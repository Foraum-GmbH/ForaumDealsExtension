import browser from 'webextension-polyfill';
import { Deal } from './types';

/**
 * Content script
 * Runs on every page to check domain and update cookies with affiliate links
 */

let currentDomain = '';

/**
 * Get current domain from URL
 */
function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    return '';
  }
}

/**
 * Update cookies with affiliate tracking
 */
async function updateAffiliateCookies(deal: Deal): Promise<void> {
  if (!deal.affiliateUrl) {
    return;
  }

  try {
    const url = new URL(deal.affiliateUrl);
    const params = new URLSearchParams(url.search);
    
    // Set affiliate cookie
    await browser.cookies.set({
      url: window.location.origin,
      name: 'foraum_affiliate',
      value: params.get('ref') || 'foraum',
      expirationDate: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 days
    });

    console.log('Affiliate cookie set for', currentDomain);
  } catch (error) {
    console.error('Error setting affiliate cookie:', error);
  }
}

/**
 * Get filtered deals for current domain
 */
async function getDealsForCurrentDomain(): Promise<Deal[]> {
  currentDomain = getDomain(window.location.href);
  
  if (!currentDomain) {
    return [];
  }

  const response = await browser.runtime.sendMessage({ type: 'GET_DEALS' });
  
  if (!response || !response.deals) {
    return [];
  }

  // Filter deals for current domain
  const filteredDeals = response.deals.filter((deal: Deal) => {
    const dealDomain = deal.domain.replace('www.', '');
    return currentDomain.includes(dealDomain) || dealDomain.includes(currentDomain);
  });

  // Update affiliate cookies for promoted deals
  const promotedDeals = filteredDeals.filter((deal: Deal) => deal.type === 'promoted');
  if (promotedDeals.length > 0) {
    await updateAffiliateCookies(promotedDeals[0]);
  }

  return filteredDeals;
}

/**
 * Initialize content script
 */
async function initialize(): Promise<void> {
  const deals = await getDealsForCurrentDomain();
  
  if (deals.length > 0) {
    console.log(`Found ${deals.length} deals for ${currentDomain}`);
    
    // Update badge to show number of deals
    browser.runtime.sendMessage({
      type: 'UPDATE_BADGE',
      data: { count: deals.length }
    });
  }
}

// Listen for messages from background script
browser.runtime.onMessage.addListener((message) => {
  if (message.type === 'DEALS_UPDATED') {
    initialize();
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
