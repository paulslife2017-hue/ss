#!/bin/bash
# Google Search Console URL Inspection API
# Requires: Google Search Console API access

API_KEY="YOUR_API_KEY_HERE"
SITE_URL="https://seoulzen.com"

while IFS= read -r url; do
  echo "📍 Inspecting: $url"
  curl -X POST \
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"inspectionUrl\": \"$url\",
      \"siteUrl\": \"$SITE_URL\"
    }"
  sleep 2
done < gsc-urls-high-priority.txt
