# Security Policy

## Supported Versions

We actively support the following versions of the Foraum Deals Extension:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of the Foraum Deals Extension seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **DO NOT** open a public issue for security vulnerabilities
2. Email security concerns to: [security@foraum.com](mailto:security@foraum.com) (replace with actual email)
3. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Initial Response**: We aim to respond within 48 hours
- **Status Updates**: We'll keep you informed about the progress
- **Resolution**: We'll work with you to understand and resolve the issue
- **Credit**: We'll credit you in the release notes (unless you prefer to remain anonymous)

## Security Best Practices

### For Users

1. **Download Only from Official Sources**
   - Chrome Web Store
   - Firefox Add-ons
   - Official GitHub releases

2. **Keep Extension Updated**
   - Enable automatic updates in your browser
   - Check for updates regularly

3. **Review Permissions**
   - The extension requests specific permissions for functionality
   - Review what data the extension can access

4. **API Security**
   - Ensure your API endpoint uses HTTPS
   - Implement rate limiting on your API
   - Use authentication if handling sensitive data

### For Developers

1. **Dependencies**
   - Run `npm audit` regularly
   - Keep dependencies updated
   - Review security advisories

2. **Code Review**
   - All PRs require review before merging
   - Check for XSS vulnerabilities in popup rendering
   - Validate all user inputs

3. **Data Handling**
   - No sensitive data should be logged
   - Use secure storage APIs
   - Implement proper error handling

## Known Security Considerations

### Permissions

The extension requires the following permissions:

- **storage**: To cache deals locally
- **cookies**: To set affiliate tracking cookies
- **tabs**: To get current tab URL for domain filtering
- **host_permissions**: To work on all websites

### Data Privacy

- **No Personal Data Collection**: The extension does not collect personal information
- **Local Storage**: Deal data is stored locally in the browser
- **API Calls**: Only made to fetch public deal information
- **Cookies**: Only affiliate tracking cookies are set, with user interaction

### Content Security

- **No Inline Scripts**: All scripts are external files
- **XSS Prevention**: HTML escaping for all user-facing content
- **HTTPS Only**: API calls should use HTTPS endpoints

## Secure Development

### Building from Source

1. Verify the source code:
   ```bash
   git clone https://github.com/Foraum-GmbH/ForaumDealsExtension.git
   cd ForaumDealsExtension
   git log --show-signature
   ```

2. Audit dependencies:
   ```bash
   npm audit
   ```

3. Build the extension:
   ```bash
   npm install
   npm run build
   ```

4. Review the built files in `dist/` before loading

### Code Signing

Official releases are:
- Built using GitHub Actions
- Artifacts are available for verification
- Signed when published to browser stores

## Vulnerability Disclosure Policy

We follow responsible disclosure practices:

1. **Private Disclosure**: Report vulnerabilities privately first
2. **Coordinated Release**: We'll work with you on disclosure timing
3. **Public Disclosure**: After fix is released and users have time to update
4. **CVE Assignment**: For critical vulnerabilities, we'll request CVE assignment

## Security Updates

Security updates are released as soon as possible:

- **Critical**: Within 24-48 hours
- **High**: Within 1 week
- **Medium/Low**: In next regular release

Updates are announced through:
- GitHub Security Advisories
- Release notes
- Extension update mechanism

## Contact

For security concerns: security@foraum.com (replace with actual email)

For general questions: Open an issue on GitHub

## Acknowledgments

We appreciate security researchers who help make this extension safer:

- [List will be updated with contributors who report valid vulnerabilities]

## Additional Resources

- [OWASP Browser Extension Security](https://cheatsheetseries.owasp.org/cheatsheets/Browser_Extension_Security_Cheat_Sheet.html)
- [Chrome Extension Security Best Practices](https://developer.chrome.com/docs/extensions/mv3/security/)
- [Mozilla Add-on Security](https://extensionworkshop.com/documentation/develop/build-a-secure-extension/)
