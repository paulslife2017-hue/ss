#!/bin/bash
# Generate favicon and Apple touch icons

BASE="logo-512.png"

echo "🍎 Generating additional icons..."

# Favicon (32x32 and 16x16 in one .ico file)
echo "  📦 Generating favicon.ico..."
convert "$BASE" \
    \( -clone 0 -resize 32x32 \) \
    \( -clone 0 -resize 16x16 \) \
    -delete 0 -colors 256 \
    ../favicon.ico
echo "  ✅ Created: favicon.ico"

# Apple Touch Icon (180x180)
echo "  📦 Generating apple-touch-icon.png..."
convert "$BASE" \
    -resize 180x180 \
    -quality 95 \
    ../apple-touch-icon.png
echo "  ✅ Created: apple-touch-icon.png"

# Apple Touch Icon precomposed (for older iOS)
echo "  📦 Generating apple-touch-icon-precomposed.png..."
cp ../apple-touch-icon.png ../apple-touch-icon-precomposed.png
echo "  ✅ Created: apple-touch-icon-precomposed.png"

echo ""
echo "🎉 Extra icons generated!"
echo ""
echo "📊 All icons in public/:"
ls -lh ../favicon.ico ../apple-touch-icon*.png 2>/dev/null | awk '{print "  - " $9 " (" $5 ")"}'

