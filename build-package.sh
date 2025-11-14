#!/bin/bash

# Build the extension
echo "Building extension..."
npm run build

# Create dist directory if it doesn't exist
mkdir -p dist

# Create a zip file for distribution
echo "Creating distribution package..."
cd dist
zip -r ../foraum-deals-extension.zip . -x "*.DS_Store"
cd ..

echo "Package created: foraum-deals-extension.zip"
echo "You can now upload this to the Chrome Web Store or Firefox Add-ons"
