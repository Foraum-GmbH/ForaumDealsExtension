/**
 * Type definitions for the Foraum Deals Extension
 */

export interface Deal {
  id: string;
  title: string;
  description: string;
  type: 'promoted' | 'coupon' | 'general';
  domain: string;
  link?: string;
  couponCode?: string;
  affiliateUrl?: string;
  expiresAt?: string;
}

export interface DealsData {
  deals: Deal[];
  lastUpdated: number;
}

export interface FilteredDeals {
  promoted: Deal[];
  coupon: Deal[];
  general: Deal[];
}

export interface Message {
  type: 'GET_DEALS' | 'UPDATE_COOKIES' | 'DEALS_UPDATED';
  data?: any;
}
