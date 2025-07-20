#!/bin/bash

# Local deployment test script
# This simulates what GitHub Pages will serve

echo "🚀 Testing local deployment..."

# Create temporary deploy directory
rm -rf _deploy_test
mkdir -p _deploy_test

# Copy game files
cp -r crypto-trader/public/* _deploy_test/

echo "📦 Files prepared for deployment:"
ls -la _deploy_test/

echo ""
echo "🌐 Starting local server..."
echo "Game will be available at: http://localhost:8080"
echo "Press Ctrl+C to stop"

cd _deploy_test
python3 -m http.server 8080 