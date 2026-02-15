#!/bin/bash
cd "$(dirname "$0")"
echo "Starting dress shop at http://localhost:3000"
echo "Press Ctrl+C to stop."
python3 -m http.server 3000
