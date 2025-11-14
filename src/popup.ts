import browser from 'webextension-polyfill';
import type { Deal, FilteredDeals } from './types';

let currentDomain: string | null = null;
let allDeals: Deal[] = [];

/**
 * Get current domain from active tab
 */
async function getCurrentDomain(): Promise<string | null> {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]?.url) {
    try {
      const url = new URL(tabs[0].url);
      return url.hostname.replace('www.', '');
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Filter deals by domain
 */
function filterDealsByDomain(deals: Deal[], domain: string | null): Deal[] {
  console.log('Organizing deals:', deals, domain);

  if (domain && domain?.length > 0) {
    return deals.filter(deal => {
      const dealDomain = deal.domain.replace('www.', '');
      return domain.includes(dealDomain) || dealDomain.includes(domain);
    });
  } else {
    return [];
  }
}

/**
 * Organize deals by type
 */
function organizeDeals(deals: Deal[]): FilteredDeals {
  if (deals.length === 0) {
    return {
      promoted: [],
      coupon: [],
      general: []
    };
  } else {
    return {
      promoted: deals.filter(deal => deal.type === 'promoted'),
      coupon: deals.filter(deal => deal.type === 'coupon'),
      general: deals.filter(deal => deal.type === 'general')
    };
  }
}

/**
 * Handle coupon code copy
 */
async function handleCouponCopy(couponCode: string, button: HTMLElement): Promise<void> {
  await navigator.clipboard.writeText(couponCode);
  const originalText = button.textContent;
  button.textContent = '✓ Copied!';
  button.style.background = '#28a745';

  setTimeout(() => {
    button.textContent = originalText;
    button.style.background = '';
  }, 2000);
}

/**
 * Handle affiliate link click
 */
async function handleAffiliateLink(deal: Deal): Promise<void> {
  const url = deal.affiliateUrl || deal.link;
  if (url) {
    // Set affiliate cookie before opening link
    if (deal.affiliateUrl) {
      try {
        const urlObj = new URL(deal.affiliateUrl);
        const params = new URLSearchParams(urlObj.search);

        await browser.cookies.set({
          url: urlObj.origin,
          name: 'foraum_affiliate',
          value: params.get('ref') || 'foraum',
          expirationDate: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
        });
      } catch {
        console.error('Error setting cookie');
      }
    }

    // Open link in new tab
    void browser.tabs.create({ url });
  }
}

/**
 * Render deal item
 */
function renderDealItem(deal: Deal, isLast: boolean): string {
  const hasCoupon = !!deal.couponCode;
  const hasLink = !!(deal.affiliateUrl || deal.link);

  const icon = hasLink
    ? `<svg class="w-5 h-5 text-[#98a0ae] group-hover:text-[#3dd6b8]" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
         <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
       </svg>`
    : hasCoupon
      ? `<svg class="w-5 h-5 text-[#98a0ae] group-hover:text-[#3dd6b8]" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
        </svg>`
      : '';

  return `
    <div 
      class="group hover:bg-[#33a08e]/30 flex items-center justify-between cursor-pointer p-3 ${isLast ? '' : 'border-b-2 border-[#1e1f21]'}"
      data-deal-id="${deal.id}"
      data-has-coupon="${hasCoupon}"
    >
      <div class="flex flex-col overflow-hidden">
        <div class="text-white font-medium truncate">${deal.title}</div>
        <div class="text-gray-400 font-regular truncate">${deal.description}</div>
      </div>

      <div class="flex items-center ml-3">
        ${icon}
      </div>
    </div>
  `;
}

/**
 * Render section
 */
function renderSection(title: string, deals: Deal[]): string {
  if (deals.length === 0) {
    return '';
  }

  return `
    <div class="mb-2">
      <div class="text-[#33a08e] font-semibold mb-1">${title}</div>
      <div class="bg-[#262b30] rounded-md overflow-hidden">
        ${deals.map((deal, index) => renderDealItem(deal, index === deals.length - 1)).join('')}
      </div>
    </div>
  `;
}

/**
 * Render popup content
 */
function renderPopup(filteredDeals: FilteredDeals): void {
  console.log('Rendering popup with deals:', filteredDeals);

  const contentDiv = document.getElementById('content');
  if (!contentDiv) return;

  const totalDeals =
    filteredDeals.promoted.length + filteredDeals.coupon.length + filteredDeals.general.length;

  if (totalDeals === 0) {
    contentDiv.innerHTML = `
      <div class="empty-state">
        <p>No deals available for this domain</p>
        <small>Check back later for exclusive offers!</small>
      </div>
    `;
    return;
  }

  contentDiv.innerHTML = `
    ${renderSection('⭐ Promoted Deals', filteredDeals.promoted)}
    ${renderSection('🎟️ Coupon Deals', filteredDeals.coupon)}
    ${renderSection('💰 General Deals', filteredDeals.general)}
  `;

  // Attach event listeners
  attachEventListeners();
}

/**
 * Attach event listeners to buttons
 */
function attachEventListeners(): void {
  // Copy coupon buttons
  for (const button of Array.from(document.querySelectorAll('.copy-coupon'))) {
    button.addEventListener('click', async e => {
      const target = e.target as HTMLElement;
      const couponCode = target.dataset.coupon;
      if (couponCode) {
        await handleCouponCopy(couponCode, target);
      }
    });
  }

  // Open link buttons
  for (const button of Array.from(document.querySelectorAll('.open-link'))) {
    button.addEventListener('click', async e => {
      const target = e.target as HTMLElement;
      const dealId = target.dataset.dealId;
      const deal = allDeals.find(d => d.id === dealId);
      if (deal) {
        await handleAffiliateLink(deal);
      }
    });
  }
}

/**
 * Update domain info
 */
function updateHeaderInfo(domain: string | null, dealCount: number): void {
  const dealCountElement = document.getElementById('deal-count');
  const domainInfoElement = document.getElementById('current-page');

  if (domainInfoElement && dealCountElement) {
    dealCountElement.textContent = domain
      ? `${dealCount} Foraum Deal${dealCount === 1 ? '' : 's'}`
      : 'Foraum Deals';
    domainInfoElement.textContent = domain ? `Für: ${domain}` : 'Unbekannte Seite';
  }
}

/**
 * Load and display deals
 */
async function loadDeals(): Promise<void> {
  try {
    currentDomain = await getCurrentDomain();
    const response = await browser.runtime.sendMessage({ type: 'GET_DEALS' });

    allDeals = response.deals;
  } catch {
    allDeals = [];
  }

  const filteredDeals = filterDealsByDomain(allDeals, currentDomain);
  const organizedDeals = organizeDeals(filteredDeals);

  updateHeaderInfo(currentDomain, allDeals.length);
  renderPopup(organizedDeals);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadDeals);
} else {
  await loadDeals();
}
