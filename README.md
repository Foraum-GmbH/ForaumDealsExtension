# Foraum Deals Browser Extension

A cross-browser extension (Chrome & Firefox) that displays affiliate deals and coupons for the websites you visit.

## Features

- 🌐 **Cross-Browser Support**: Works on Chrome, Firefox, and other Chromium-based browsers
- 📱 **TypeScript**: Fully typed codebase for better development experience
- 🔄 **Automatic Updates**: Fetches deals from API on browser startup and periodically
- 🎯 **Domain Filtering**: Shows only relevant deals for the current website
- 🎁 **Multiple Deal Types**: Organized sections for promoted, coupon, and general deals
- 🍪 **Cookie Management**: Automatically updates affiliate tracking cookies
- 💅 **Modern UI**: Clean and intuitive popup interface

## Project Structure

```
ForaumDealsExtension/
├── src/
│   ├── background.ts    # Background service worker (API calls, data storage)
│   ├── content.ts       # Content script (domain checking, cookie updates)
│   ├── popup.ts         # Popup interface logic
│   └── types.ts         # TypeScript type definitions
├── public/
│   ├── manifest.json    # Extension manifest (Chrome/Firefox compatible)
│   ├── popup.html       # Popup UI
│   └── icons/           # Extension icons
├── dist/                # Built extension (generated)
└── webpack.config.js    # Build configuration
```

## Development

### Prerequisites

- Node.js 14 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Foraum-GmbH/ForaumDealsExtension.git
cd ForaumDealsExtension
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

The built extension will be in the `dist/` directory.

### Development Mode

To build and watch for changes:
```bash
npm run watch
```

## Installing the Extension

### Chrome / Chromium Browsers

1. Build the extension using `npm run build`
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist/` directory from the project

### Firefox

1. Build the extension using `npm run build`
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to the `dist/` directory and select `manifest.json`

## Usage

### For Users

1. **Browser Startup**: The extension automatically fetches the latest deals when you start your browser
2. **Visit Websites**: Browse normally - the extension checks each domain for available deals
3. **View Deals**: Click the extension icon to see deals filtered for the current website
4. **Get Deals**: 
   - For coupon codes: Click "Copy Code" to copy to clipboard
   - For direct deals: Click "Get Deal" to open the affiliate link

### For Developers

#### Customizing the API

Edit `src/background.ts` and update the `API_URL` constant:

```typescript
const API_URL = 'https://your-api.example.com/deals';
```

The API should return a JSON response with this structure:

```typescript
{
  "deals": [
    {
      "id": "unique-id",
      "title": "Deal Title",
      "description": "Deal description",
      "type": "promoted" | "coupon" | "general",
      "domain": "example.com",
      "link": "https://example.com/deal",
      "couponCode": "COUPON123",
      "affiliateUrl": "https://example.com?ref=foraum",
      "expiresAt": "2024-12-31T23:59:59Z"
    }
  ]
}
```

#### Deal Types

- **promoted**: High-priority deals shown at the top
- **coupon**: Deals with coupon codes
- **general**: Standard deals and offers

## Cookie Management

The extension automatically sets affiliate tracking cookies when:
1. A page is visited that has promoted deals
2. A user clicks on an affiliate link

Cookies are set with a 30-day expiration and include the affiliate reference parameter.

## Scripts

- `npm run build`: Build the extension for production
- `npm run watch`: Build and watch for changes during development
- `npm run clean`: Remove the dist directory

## Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 109+
- ✅ Edge 88+
- ✅ Opera 74+
- ✅ Brave (Chromium-based version)

## License

See [LICENSE](LICENSE) file for details.

## Support

For issues and questions, please open an issue on GitHub.