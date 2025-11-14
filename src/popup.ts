import browser from 'webextension-polyfill';
import { Deal, FilteredDeals } from './types';

/**
 * Popup script
 * Displays filtered deals for the current domain
 */

let currentDomain = '';
let allDeals: Deal[] = [];

/**
 * Get current domain from active tab
 */
async function getCurrentDomain(): Promise<string> {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  if (tabs[0]?.url) {
    try {
      const url = new URL(tabs[0].url);
      return url.hostname.replace('www.', '');
    } catch (error) {
      return '';
    }
  }
  return '';
}

/**
 * Filter deals by domain
 */
function filterDealsByDomain(deals: Deal[], domain: string): Deal[] {
  if (!domain) {
    return deals;
  }

  return deals.filter(deal => {
    const dealDomain = deal.domain.replace('www.', '');
    return domain.includes(dealDomain) || dealDomain.includes(domain);
  });
}

/**
 * Organize deals by type
 */
function organizeDeals(deals: Deal[]): FilteredDeals {
  return {
    promoted: deals.filter(deal => deal.type === 'promoted'),
    coupon: deals.filter(deal => deal.type === 'coupon'),
    general: deals.filter(deal => deal.type === 'general')
  };
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}

/**
 * Handle coupon code copy
 */
async function handleCouponCopy(couponCode: string, button: HTMLElement): Promise<void> {
  await copyToClipboard(couponCode);
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
      } catch (error) {
        console.error('Error setting cookie:', error);
      }
    }
    
    // Open link in new tab
    browser.tabs.create({ url });
  }
}

/**
 * Render deal item
 */
function renderDealItem(deal: Deal): string {
  const hasCoupon = !!deal.couponCode;
  const hasLink = !!(deal.affiliateUrl || deal.link);
  
  let actionHtml = '';
  
  if (hasCoupon) {
    actionHtml = `
      <span class="coupon-code">${deal.couponCode}</span>
      <button class="btn btn-secondary copy-coupon" data-coupon="${deal.couponCode}">
        Copy Code
      </button>
    `;
  } else if (hasLink) {
    actionHtml = `
      <button class="btn btn-primary open-link" data-deal-id="${deal.id}">
        Get Deal
      </button>
    `;
  }
  
  return `
    <div class="deal-item">
      <div class="deal-info">
        <div class="deal-title">${escapeHtml(deal.title)}</div>
        <div class="deal-description">${escapeHtml(deal.description)}</div>
      </div>
      <div class="deal-action">
        ${actionHtml}
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
    <div class="section">
      <div class="section-header">${title}</div>
      ${deals.map(deal => renderDealItem(deal)).join('')}
    </div>
  `;
}

/**
 * Render popup content
 */
function renderPopup(filteredDeals: FilteredDeals): void {
  const contentDiv = document.getElementById('content');
  if (!contentDiv) return;
  
  const totalDeals = filteredDeals.promoted.length + 
                     filteredDeals.coupon.length + 
                     filteredDeals.general.length;
  
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
  document.querySelectorAll('.copy-coupon').forEach(button => {
    button.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      const couponCode = target.getAttribute('data-coupon');
      if (couponCode) {
        await handleCouponCopy(couponCode, target);
      }
    });
  });
  
  // Open link buttons
  document.querySelectorAll('.open-link').forEach(button => {
    button.addEventListener('click', async (e) => {
      const target = e.target as HTMLElement;
      const dealId = target.getAttribute('data-deal-id');
      const deal = allDeals.find(d => d.id === dealId);
      if (deal) {
        await handleAffiliateLink(deal);
      }
    });
  });
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Update domain info
 */
function updateDomainInfo(domain: string, dealCount: number): void {
  const domainInfo = document.getElementById('domain-info');
  if (domainInfo) {
    if (domain) {
      domainInfo.textContent = `${dealCount} deal${dealCount !== 1 ? 's' : ''} for ${domain}`;
    } else {
      domainInfo.textContent = `${dealCount} deal${dealCount !== 1 ? 's' : ''} available`;
    }
  }
}

/**
 * Load and display deals
 */
async function loadDeals(): Promise<void> {
  try {
    // Get current domain
    currentDomain = await getCurrentDomain();
    
    // Get deals from background script
    const response = await browser.runtime.sendMessage({ type: 'GET_DEALS' });
    
    if (!response || !response.deals) {
      const contentDiv = document.getElementById('content');
      if (contentDiv) {
        contentDiv.innerHTML = `
          <div class="empty-state">
            <p>No deals available</p>
            <small>Please try again later</small>
          </div>
        `;
      }
      return;
    }
    
    allDeals = response.deals;
    
    // Filter deals by current domain
    const filteredDeals = filterDealsByDomain(allDeals, currentDomain);
    
    // Organize deals by type
    const organizedDeals = organizeDeals(filteredDeals);
    
    // Update domain info
    updateDomainInfo(currentDomain, filteredDeals.length);
    
    // Render popup
    renderPopup(organizedDeals);
    
  } catch (error) {
    console.error('Error loading deals:', error);
    const contentDiv = document.getElementById('content');
    if (contentDiv) {
      contentDiv.innerHTML = `
        <div class="empty-state">
          <p>Error loading deals</p>
          <small>Please try again</small>
        </div>
      `;
    }
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadDeals);
} else {
  loadDeals();
}
