# Foraum Deals Browser Extension

<div align="center">

![License](https://img.shields.io/badge/license-See%20LICENSE-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Chrome](https://img.shields.io/badge/Chrome-88%2B-brightgreen.svg)
![Firefox](https://img.shields.io/badge/Firefox-109%2B-orange.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)

**A cross-browser extension that displays affiliate deals and coupons for the websites you visit.**

[Features](#features) • [Quick Start](QUICKSTART.md) • [Installation](#installing-the-extension) • [Development](#development) • [API Integration](#api-integration) • [Contributing](#contributing)

</div>

---


## Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x450/667eea/ffffff?text=Popup+with+Deals" alt="Extension Popup" />
  <p><i>Extension popup showing categorized deals</i></p>
</div>

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

### Component Flow

```
Browser Startup → Background Worker → Fetch Deals from API → Store Locally
                                                                    ↓
User Visits Page → Content Script → Check Domain → Filter Deals ← Storage
                                                          ↓
User Clicks Icon → Popup Opens → Display Filtered Deals → User Action
```

## API Integration

The extension integrates with a REST API to fetch deals. See [API.md](API.md) for detailed integration guide.

### Quick API Setup

1. Update the API URL in `src/background.ts`:
   ```typescript
   const API_URL = 'https://your-api.example.com/deals';
   ```

2. Expected API response format:
   ```json
   {
     "deals": [
       {
         "id": "1",
         "title": "20% Off",
         "description": "Save on your order",
         "type": "promoted",
         "domain": "example.com",
         "couponCode": "SAVE20",
         "affiliateUrl": "https://example.com?ref=foraum"
       }
     ]
   }
   ```

For complete API documentation, see [API.md](API.md).

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run build` | Build the extension for production |
| `npm run watch` | Build and watch for changes during development |
| `npm run clean` | Remove the dist directory |
| `npm run package` | Build and create a distributable zip file |
| `npm run lint` | Run ESLint to check code quality |
| `npm run lint:fix` | Run ESLint and auto-fix issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting without making changes |
| `npm run type-check` | Check TypeScript types without building |
| `npm run check` | Run all checks (lint + format + type-check) |

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

| Browser | Minimum Version | Status |
|---------|----------------|--------|
| Chrome | 88+ | ✅ Supported |
| Firefox | 109+ | ✅ Supported |
| Edge | 88+ | ✅ Supported |
| Opera | 74+ | ✅ Supported |
| Brave | Latest | ✅ Supported |
| Safari | - | ⏳ Planned |

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Start for Contributors

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Build and test: `npm run build`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Security

Security is important to us. If you discover a security vulnerability, please review our [Security Policy](SECURITY.md) for responsible disclosure guidelines.

## Roadmap

- [x] Core extension functionality
- [x] Chrome & Firefox support
- [x] TypeScript implementation
- [x] Cookie management
- [ ] Safari support
- [ ] User preferences/settings
- [ ] Deal categories customization
- [ ] Notifications for new deals
- [ ] Analytics dashboard

## License

See [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/)
- Uses [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) for cross-browser compatibility
- Bundled with [Webpack](https://webpack.js.org/)

## Support

- 📖 [Documentation](https://github.com/Foraum-GmbH/ForaumDealsExtension/wiki)
- 🐛 [Issue Tracker](https://github.com/Foraum-GmbH/ForaumDealsExtension/issues)
- 💬 [Discussions](https://github.com/Foraum-GmbH/ForaumDealsExtension/discussions)
- 📧 Email: support@foraum.com (replace with actual email)

---

<div align="center">
  Made with ❤️ by <a href="https://foraum.com">Foraum GmbH</a>
</div>