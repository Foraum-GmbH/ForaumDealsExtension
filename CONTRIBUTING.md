# Contributing to Foraum Deals Extension

Thank you for your interest in contributing to the Foraum Deals Extension! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ForaumDealsExtension.git
   cd ForaumDealsExtension
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the extension:
   ```bash
   npm run build
   ```

## Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the `src/` directory

3. Build and test:
   ```bash
   npm run build
   ```

4. Load the extension in your browser:
   - Chrome: Load unpacked extension from `dist/` directory
   - Firefox: Load temporary add-on from `dist/manifest.json`

5. Commit your changes:
   ```bash
   git add .
   git commit -m "Description of your changes"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a Pull Request

## Code Style

- Use TypeScript for all new code
- Follow existing code formatting
- Run `npm run check` before committing to ensure code quality
- ESLint and Prettier are configured to enforce consistent style
- Add comments for complex logic
- Use meaningful variable and function names

### Code Quality Checks

Before submitting a PR, ensure all checks pass:

```bash
# Run all checks
npm run check

# Or run individually
npm run lint        # Check for code issues
npm run format:check # Verify formatting
npm run type-check  # Check TypeScript types
```

Auto-fix common issues:

```bash
npm run lint:fix    # Fix ESLint issues
npm run format      # Format code with Prettier
```

## Project Structure

- `src/background.ts` - Background service worker (API calls, storage)
- `src/content.ts` - Content script (runs on web pages)
- `src/popup.ts` - Popup interface logic
- `src/types.ts` - TypeScript type definitions
- `public/` - Static files (manifest, HTML, icons)
- `dist/` - Built extension (generated, not committed)

## Adding New Features

### Adding a New Deal Type

1. Update the `Deal` type in `src/types.ts`:
   ```typescript
   export interface Deal {
     // ... existing fields
     type: 'promoted' | 'coupon' | 'general' | 'your-new-type';
   }
   ```

2. Update the `organizeDeals()` function in `src/popup.ts`

3. Add rendering logic in `renderPopup()`

### Modifying the API Integration

1. Edit `src/background.ts`
2. Update the `fetchDeals()` function
3. See `API.md` for API format details

### Changing the UI

1. Edit `public/popup.html` for structure
2. Modify inline CSS in `popup.html` for styling
3. Update `src/popup.ts` for behavior

## Testing

Currently, testing is manual:

1. Build the extension: `npm run build`
2. Load it in Chrome or Firefox
3. Test on various websites
4. Check browser console for errors
5. Verify deals display correctly
6. Test coupon code copying
7. Test affiliate link opening

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation if needed
- Ensure the build succeeds (`npm run build`)
- Test in both Chrome and Firefox
- Describe your changes in the PR description

## Reporting Issues

When reporting issues, please include:

- Browser and version
- Extension version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Console errors (if any)

## Questions?

Feel free to open an issue for questions or discussion.
