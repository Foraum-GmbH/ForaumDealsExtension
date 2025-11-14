import browser from 'webextension-polyfill';
import { Deal, DealsData } from './types';

/**
 * Background service worker
 * Handles API calls and data storage
 */

const API_URL = 'https://api.example.com/deals'; // Replace with actual API endpoint
const STORAGE_KEY = 'foraum_deals_data';
const UPDATE_INTERVAL = 3600000; // 1 hour in milliseconds

/**
 * Fetch deals from API
 */
async function fetchDeals(): Promise<Deal[]> {
  try {
    // For demonstration, returning mock data
    // In production, replace with actual API call:
    // const response = await fetch(API_URL);
    // const data = await response.json();
    // return data.deals;

    const mockDeals: Deal[] = [
      {
        id: '1',
        title: '20% Off Your First Order',
        description: 'Save 20% on your first purchase',
        type: 'promoted',
        domain: 'example.com',
        link: 'https://example.com/deals',
        couponCode: 'FIRST20',
        affiliateUrl: 'https://example.com?ref=foraum'
      },
      {
        id: '2',
        title: 'Free Shipping',
        description: 'Get free shipping on orders over $50',
        type: 'coupon',
        domain: 'example.com',
        couponCode: 'FREESHIP50'
      },
      {
        id: '3',
        title: 'Summer Sale - Up to 50% Off',
        description: 'Huge savings on summer items',
        type: 'general',
        domain: 'example.com',
        link: 'https://example.com/summer-sale',
        affiliateUrl: 'https://example.com/summer-sale?ref=foraum'
      },
      {
        id: '4',
        title: '10% Off Electronics',
        description: 'Save on the latest tech',
        type: 'general',
        domain: 'shop.example.com',
        couponCode: 'TECH10'
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
 * Update deals from API
 */
async function updateDeals(): Promise<void> {
  console.log('Updating deals from API...');
  const deals = await fetchDeals();
  await storeDeals(deals);
  console.log(`Stored ${deals.length} deals`);
  
  // Notify content scripts that deals have been updated
  const tabs = await browser.tabs.query({});
  tabs.forEach(tab => {
    if (tab.id) {
      browser.tabs.sendMessage(tab.id, { type: 'DEALS_UPDATED' }).catch(() => {
        // Ignore errors for tabs that don't have content script
      });
    }
  });
}

/**
 * Initialize background service
 */
async function initialize(): Promise<void> {
  console.log('Foraum Deals Extension initialized');
  
  // Fetch deals immediately on startup
  await updateDeals();
  
  // Set up periodic updates
  setInterval(updateDeals, UPDATE_INTERVAL);
}

// Listen for installation
browser.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  initialize();
});

// Listen for browser startup
browser.runtime.onStartup.addListener(() => {
  console.log('Browser started');
  initialize();
});

// Initialize immediately
initialize();

// Handle messages from content scripts and popup
browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'GET_DEALS') {
    return getStoredDeals();
  }
  return Promise.resolve();
});
