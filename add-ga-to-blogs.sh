#!/bin/bash

# Google Analytics code to insert
GA_CODE='  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4DH40QL7TS"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('\''js'\'', new Date());
    gtag('\''config'\'', '\''G-4DH40QL7TS'\'');
  </script>
  '

# Process all HTML files in public/blog directory
cd /home/user/webapp/public/blog

for file in *.html; do
    # Check if GA is already installed
    if ! grep -q "G-4DH40QL7TS" "$file"; then
        echo "Adding GA to $file"
        # Insert GA code after <head> tag
        sed -i '/<head>/a\'"$GA_CODE" "$file"
    else
        echo "GA already exists in $file, skipping"
    fi
done

echo "Done! GA4 added to all blog pages."
