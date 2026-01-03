#!/bin/bash
# Generate all PWA icon sizes from base logo

BASE="logo-512.png"

# Check if base logo exists
if [ ! -f "$BASE" ]; then
    echo "❌ Base logo not found: $BASE"
    exit 1
fi

echo "🎨 Generating PWA icons from $BASE..."

# Array of required sizes for PWA
sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
    output="icon-${size}x${size}.png"
    echo "  📦 Generating $output..."
    
    convert "$BASE" \
        -resize "${size}x${size}" \
        -quality 95 \
        "$output"
    
    if [ -f "$output" ]; then
        echo "  ✅ Created: $output ($(du -h "$output" | cut -f1))"
    else
        echo "  ❌ Failed: $output"
    fi
done

echo ""
echo "🎉 All PWA icons generated successfully!"
echo ""
echo "📊 Generated icons:"
ls -lh icon-*.png | awk '{print "  - " $9 " (" $5 ")"}'

