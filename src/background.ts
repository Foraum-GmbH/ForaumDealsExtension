import browser from 'webextension-polyfill';
import type { Deal, DealsData } from './types';

/**
 * Background service worker
 * Handles API calls and data storage
 */

const _API_URL = 'https://api.example.com/deals';
const STORAGE_KEY = 'foraum_deals_data';
const UPDATE_INTERVAL = 3600000; // 1 hour in milliseconds

/**
 * Fetch deals from API
 */
async function fetchDeals(): Promise<Deal[]> {
  try {
    // const response = await fetch(API_URL);
    // const data = await response.json();
    // return data.deals;

    const mockDeals: Deal[] = [
      {
        id: '1',
        title: '20% Off Your First Order',
        description: 'Save 20% on your first purchase',
        type: 'general',
        domain: 'example.com',
        link: 'https://foraum.de/deals',
        couponCode: 'FIRST20',
        affiliateUrl: 'https://example.com?ref=foraum'
      },
      {
        id: '2',
        title: 'Free Shipping',
        description: 'Get free shipping on orders over $50',
        type: 'coupon',
        domain: 'www.foraum.de',
        couponCode: 'FREESHIP50'
      },
      {
        id: '3',
        title: 'Summer Sale - Up to 50% Off',
        description: 'Huge savings on summer items',
        type: 'general',
        domain: 'foraum.de',
        link: 'https://example.com/summer-sale',
        affiliateUrl: 'https://example.com/summer-sale?ref=foraum'
      },
      {
        id: '4',
        title: '10% Off Electronics',
        description: 'Save on the latest tech',
        type: 'coupon',
        domain: 'shop.foraum.de',
        couponCode: 'TECH10'
      },
      {
        id: '5',
        title: 'Buy One Get One Free',
        description: 'BOGO offer on select items',
        type: 'general',
        domain: 'deals.foraum.de',
        link: 'https://deals.foraum.de/bogo',
        affiliateUrl: 'https://deals.foraum.de/bogo?ref=foraum'
      },
      {
        id: '6',
        title: 'Exclusive Member Discount',
        description: 'Special discount for members only',
        type: 'coupon',
        domain: 'members.foraum.de',
        couponCode: 'MEMBER20'
      },
      {
        id: '7',
        title: 'Holiday Special',
        description: 'Exclusive holiday discounts',
        type: 'general',
        domain: 'holiday.foraum.de',
        link: 'https://holiday.foraum.de/special',
        affiliateUrl: 'https://holiday.foraum.de/special?ref=foraum'
      },
      {
        id: '8',
        title: 'Clearance Sale - Up to 70% Off',
        description: 'Massive discounts on clearance items',
        type: 'general',
        domain: 'clearance.foraum.de',
        link: 'https://clearance.foraum.de/sale',
        affiliateUrl: 'https://clearance.foraum.de/sale?ref=foraum'
      },
      {
        id: '9',
        title: '15% Off Sitewide',
        description: 'Enjoy 15% off everything on the site',
        type: 'coupon',
        domain: 'www.foraum.de',
        couponCode: 'SITEWIDE15'
      },
      {
        id: '10',
        title: 'Weekend Flash Sale',
        description: 'Limited time offers this weekend only',
        type: 'general',
        domain: 'flash.foraum.de',
        link: 'https://flash.foraum.de/weekend-sale',
        affiliateUrl: 'https://flash.foraum.de/weekend-sale?ref=foraum'
      }
    ];

    return mockDeals;
  } catch (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
}

/**
 * Store deals in browser storage
 */
async function storeDeals(deals: Deal[]): Promise<void> {
  const data: DealsData = {
    deals,
    lastUpdated: Date.now()
  };
  await browser.storage.local.set({ [STORAGE_KEY]: data });
}

/**
 * Get deals from storage
 */
export async function getStoredDeals(): Promise<DealsData | null> {
  const result = await browser.storage.local.get(STORAGE_KEY);
  return result[STORAGE_KEY] || null;
}

/**
 * Update Extension badge
 */
async function updateBadge(count: number): Promise<void> {
  const text = count > 0 ? count.toString() : null;
  await browser.action.setBadgeText({ text });
  browser.action.setBadgeTextColor({ color: '#FFFFFF' });
  await browser.action.setBadgeBackgroundColor({ color: '#FF0000' });
}

/**
 * Update deals from API
 */
async function updateDeals(): Promise<void> {
  console.log('Updating deals from API...');
  const deals = await fetchDeals();
  await storeDeals(deals);
  console.log(`Stored ${deals.length} deals`);

  // Notify content scripts that deals have been updated
  const tabs = await browser.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      browser.tabs.sendMessage(tab.id, { type: 'DEALS_UPDATED' }).catch(() => {
        // Ignore errors for tabs that don't have content script
      });
    }
  }
}

/**
 * Initialize background service
 */
async function initialize(): Promise<void> {
  console.log('Foraum Deals Extension initialized');
  await updateDeals();
  setInterval(updateDeals, UPDATE_INTERVAL);
}

browser.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  initialize();
});

browser.runtime.onStartup.addListener(() => {
  console.log('Browser started');
  initialize();
});

await initialize();

browser.runtime.onMessage.addListener((message, _) => {
  if (message.type === 'GET_DEALS') {
    return getStoredDeals();
  }

  if (message.type === 'UPDATE_BADGE') {
    return updateBadge(message.data.count);
  }

  return Promise.resolve();
});
