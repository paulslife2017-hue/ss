#!/bin/bash
# K-Beauty Seoul Logo Generator using ImageMagick

# Create a beautiful gradient background logo for K-Beauty Seoul
convert -size 512x512 \
  -define gradient:angle=135 \
  gradient:'#FF385C-#BD1E59' \
  -gravity center \
  \( -background none -fill white -font Arial-Bold -pointsize 72 label:'KB' \
     -trim +repage -resize 280x280 \) \
  -gravity center -composite \
  \( -background none -fill white -font Arial -pointsize 28 label:'SEOUL' \
     -trim +repage \) \
  -gravity south -geometry +0+80 -composite \
  -modulate 100,120,100 \
  logo-512.png

echo "✅ Created base logo: logo-512.png"
