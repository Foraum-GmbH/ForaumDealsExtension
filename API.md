# API Integration Guide

This document explains how to integrate your deals API with the Foraum Deals Extension.

## API Endpoint

The extension expects to fetch deals from a REST API endpoint. Configure the endpoint in `src/background.ts`:

```typescript
const API_URL = 'https://your-api.example.com/deals';
```

## Request Format

The extension makes a GET request to the API endpoint when:
- The browser starts
- Every hour (configurable via `UPDATE_INTERVAL` in `src/background.ts`)

No authentication is currently implemented, but you can add headers in the `fetchDeals()` function.

## Response Format

The API should return a JSON response with the following structure:

```json
{
  "deals": [
    {
      "id": "unique-identifier",
      "title": "20% Off Your First Order",
      "description": "Save 20% on your first purchase with this exclusive code",
      "type": "promoted",
      "domain": "example.com",
      "link": "https://example.com/deals",
      "couponCode": "FIRST20",
      "affiliateUrl": "https://example.com?ref=foraum",
      "expiresAt": "2024-12-31T23:59:59Z"
    }
  ]
}
```

## Field Descriptions

### Required Fields

- **id** (string): Unique identifier for the deal
- **title** (string): Short, catchy title for the deal
- **description** (string): Longer description explaining the deal
- **type** (string): One of: `"promoted"`, `"coupon"`, or `"general"`
- **domain** (string): The domain this deal applies to (e.g., "example.com")

### Optional Fields

- **link** (string): URL to the deal page
- **couponCode** (string): Coupon/promo code if applicable
- **affiliateUrl** (string): URL with affiliate tracking parameters
- **expiresAt** (string): ISO 8601 datetime when the deal expires

## Deal Types

### Promoted Deals (`type: "promoted"`)
- Shown first in the popup
- Automatically set affiliate cookies when user visits the domain
- Should include `affiliateUrl` for tracking

### Coupon Deals (`type: "coupon"`)
- Displayed in a separate section
- Must include `couponCode`
- Users can copy the code with one click

### General Deals (`type: "general"`)
- Standard deals and offers
- Can have either a `link` or `couponCode` (or both)

## Domain Matching

The extension uses flexible domain matching:
- Subdomain support: A deal for "example.com" will match "shop.example.com"
- Reverse matching: A deal for "shop.example.com" will match "example.com"
- The "www." prefix is automatically removed for matching

## Affiliate Tracking

When `affiliateUrl` is provided:

1. The extension extracts the `ref` parameter from the query string
2. Sets a cookie named `foraum_affiliate` with the ref value
3. Cookie expires after 30 days
4. Cookie is set when:
   - User visits a page with promoted deals
   - User clicks on a deal link

Example affiliate URL:
```
https://example.com/product?ref=foraum&campaign=extension
```

This will set a cookie: `foraum_affiliate=foraum`

## Example API Response

```json
{
  "deals": [
    {
      "id": "deal-001",
      "title": "Free Shipping on Orders Over $50",
      "description": "No minimum purchase required. Limited time offer.",
      "type": "promoted",
      "domain": "store.example.com",
      "couponCode": "FREESHIP",
      "affiliateUrl": "https://store.example.com?ref=foraum"
    },
    {
      "id": "deal-002",
      "title": "20% Off Electronics",
      "description": "Save big on laptops, phones, and accessories",
      "type": "coupon",
      "domain": "example.com",
      "couponCode": "TECH20"
    },
    {
      "id": "deal-003",
      "title": "Summer Sale - Up to 50% Off",
      "description": "Huge discounts on summer clothing and accessories",
      "type": "general",
      "domain": "fashion.example.com",
      "link": "https://fashion.example.com/summer-sale",
      "affiliateUrl": "https://fashion.example.com/summer-sale?ref=foraum&source=ext"
    }
  ]
}
```

## Error Handling

If the API request fails:
- The extension logs the error to the console
- Previously cached deals remain available
- The extension will retry on the next scheduled update

## Testing Your API

1. Update the `API_URL` in `src/background.ts`
2. Build the extension: `npm run build`
3. Load the extension in your browser
4. Check the browser console for any errors
5. Open the popup on a matching domain to see your deals

## Mock Data

By default, the extension includes mock data in `src/background.ts` for testing purposes. Replace the `fetchDeals()` function with your actual API call:

```typescript
async function fetchDeals(): Promise<Deal[]> {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data.deals;
  } catch (error) {
    console.error('Error fetching deals:', error);
    return [];
  }
}
```
