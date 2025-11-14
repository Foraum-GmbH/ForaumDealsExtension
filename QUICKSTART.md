# Quick Start Guide

## Installation for Users

### Chrome

1. Download the latest release from [Releases](https://github.com/Foraum-GmbH/ForaumDealsExtension/releases)
2. Extract the ZIP file
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select the `dist/` folder from the extracted files
7. The extension icon should appear in your toolbar! 🎉

### Firefox

1. Download the latest release from [Releases](https://github.com/Foraum-GmbH/ForaumDealsExtension/releases)
2. Extract the ZIP file
3. Open Firefox and go to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on"
5. Navigate to the `dist/` folder and select `manifest.json`
6. The extension icon should appear in your toolbar! 🎉

## Installation for Developers

### Prerequisites

- Node.js 14 or higher
- npm or yarn
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Foraum-GmbH/ForaumDealsExtension.git
cd ForaumDealsExtension

# 2. Install dependencies
npm install

# 3. Build the extension
npm run build

# 4. The extension is now ready in the dist/ folder
# Load it in your browser following the steps above
```

## Development Workflow

```bash
# Start development mode (auto-rebuild on changes)
npm run watch

# In another terminal, run checks
npm run check          # Run all checks
npm run lint           # Check code quality
npm run format:check   # Check formatting

# Auto-fix issues
npm run lint:fix       # Fix linting issues
npm run format         # Format code
```

## Using the Extension

### First Time Setup

1. After installation, the extension will automatically fetch deals when you start your browser
2. The deals are cached locally and updated every hour

### Viewing Deals

1. Visit any website
2. Click the extension icon in your toolbar
3. See deals filtered for the current domain
4. Deals are organized into:
   - ⭐ **Promoted Deals** - Featured offers
   - 🎟️ **Coupon Deals** - Deals with discount codes
   - 💰 **General Deals** - Other available offers

### Using Coupons

1. Click "Copy Code" to copy the coupon to clipboard
2. Paste it at checkout on the website

### Using Direct Deals

1. Click "Get Deal" to open the deal in a new tab
2. The extension automatically sets affiliate cookies for tracking

## Customizing the API

By default, the extension uses mock data. To use your own deals API:

1. Open `src/background.ts`
2. Update the `API_URL` constant:
   ```typescript
   const API_URL = 'https://your-api.example.com/deals';
   ```
3. Ensure your API returns data in the correct format (see [API.md](API.md))
4. Rebuild the extension:
   ```bash
   npm run build
   ```
5. Reload the extension in your browser

## Troubleshooting

### Extension not loading

- Make sure you selected the `dist/` folder, not the root folder
- Check that you've run `npm run build`
- Look for errors in the browser console

### Deals not showing

- Check the browser console for API errors
- Verify your API is accessible
- Make sure the API response format matches the expected structure

### Build errors

- Delete `node_modules/` and run `npm install` again
- Make sure you're using Node.js 14 or higher
- Check that all dependencies installed successfully

## Getting Help

- 📖 [Full Documentation](README.md)
- 🐛 [Report an Issue](https://github.com/Foraum-GmbH/ForaumDealsExtension/issues)
- 💬 [Discussions](https://github.com/Foraum-GmbH/ForaumDealsExtension/discussions)
- 🤝 [Contributing Guide](CONTRIBUTING.md)

## Next Steps

- Read the [API Integration Guide](API.md) to connect your deals API
- Check out [CONTRIBUTING.md](CONTRIBUTING.md) to contribute to the project
- Review [SECURITY.md](SECURITY.md) for security best practices
