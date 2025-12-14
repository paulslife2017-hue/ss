#!/usr/bin/env python3
"""Add image fields to all blog articles for card thumbnails"""

import re

# Read the blog-articles.js file
with open('blog-articles.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Define image URLs for each article category
image_mapping = {
    'gangnam-massage-guide-2025': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop',
    'gangnam-scalp-care-guide-2025': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
    'seoul-lip-tattoo-guide-2025': 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop',
    'seoul-bb-glow-treatment-2025': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
    'seoul-nail-art-guide-2025': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop',
    'korean-spa-jjimjilbang-guide-2025': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop',
    'seoul-laser-hair-removal-guide-2025': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
    'seoul-aqua-peel-guide-2025': 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=600&fit=crop',
    'seoul-cryotherapy-complete-guide-2025': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'seoul-iv-drip-therapy-guide-2025': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop',
    'seoul-weight-loss-clinic-guide-2025': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'gangnam-dental-clinic-guide-2025': 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&h=600&fit=crop',
    'seoul-dermatology-clinic-guide-2025': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=600&fit=crop',
    'seoul-cosmetic-surgery-guide-2025': 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&h=600&fit=crop',
    'seoul-hair-salon-guide-2025': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
    'gangnam-lash-lift-guide-2025': 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800&h=600&fit=crop',
    'seoul-skin-booster-injection-guide-2025': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=600&fit=crop',
    'gangnam-body-contouring-guide-2025': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
    'seoul-facial-treatment-guide-2025': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&h=600&fit=crop',
    'gangnam-mole-removal-guide-2025': 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&h=600&fit=crop',
    'gangnam-head-spa-complete-guide-2025': 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
    # New articles 22-26
    'korean-skincare-routine-complete-guide-2025': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=600&fit=crop',
    'complete-guide-korean-beauty-services-seoul-2025': 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&h=600&fit=crop',
    'korean-beauty-tour-complete-guide-2025-japanese': 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&h=600&fit=crop',
    'seoul-spa-recommended-ranking-2025-japanese': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop',
    'korean-skincare-latest-trends-2025-japanese': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=600&fit=crop',
}

# Function to add image field after slug
def add_image_field(match):
    slug_line = match.group(1)
    slug_value = match.group(2).strip("'\"")
    rest = match.group(3)
    
    # Get the image URL for this slug
    image_url = image_mapping.get(slug_value, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop')
    
    # Insert image field after slug
    return f"{slug_line}\n    image: '{image_url}',\n{rest}"

# Pattern to match slug and insert image after it (note: no quotes around slug in actual file)
pattern = r"(    slug: '([^']+)',)\n(    excerpt:)"

# Apply the transformation
modified_content = re.sub(pattern, add_image_field, content)

# Write back
with open('blog-articles.js', 'w', encoding='utf-8') as f:
    f.write(modified_content)

print("✅ Successfully added image fields to all blog articles!")
print(f"📊 Total mappings: {len(image_mapping)}")
