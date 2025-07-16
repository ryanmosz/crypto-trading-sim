#!/bin/bash

# Simple script to serve Unity WebGL builds locally

echo "🌐 Starting local web server for Unity WebGL build..."
echo "📁 Serving from: $(pwd)/02"
echo "🔗 Open http://localhost:8000 in your browser"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd 02 && python3 -m http.server 8000 