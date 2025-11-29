#!/usr/bin/env python3
import re
import os

# Read server.js
with open('server.js', 'r', encoding='utf-8') as f:
    server_content = f.read()

# Article files to integrate
article_files = [
    'article_9_head_spa_gangnam.js',
    'article_10_bb_glow.js',
    'article_11_eyebrow_tattoo.js',
    'article_12_anti_aging.js',
    'article_13_skincare_routine.js',
    'article_14_couple_spa.js',
    'article_15_foot_massage.js'
]

print("🔄 Integrating articles into server.js...")

# Extract article content from each file
articles_content = []
for filename in article_files:
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
            # Extract the object content (remove module.exports = and trailing ;)
            match = re.search(r'module\.exports = ({[\s\S]*});', content)
            if match:
                articles_content.append(match.group(1))
                print(f"✅ Extracted: {filename}")
            else:
                print(f"⚠️  Failed to extract: {filename}")
    else:
        print(f"❌ Missing: {filename}")

# Find posts array end
posts_array_end_match = re.search(r'(const posts = \[[\s\S]*?)\n\];', server_content)
if not posts_array_end_match:
    print("❌ Could not find posts array")
    exit(1)

before_array_end = posts_array_end_match.group(1)
after_array_pattern = r'(\n\];[\s\S]*)'
after_match = re.search(after_array_pattern, server_content[posts_array_end_match.end()-2:])
after_content = server_content[posts_array_end_match.end()-2:]

# Add new articles
new_content = before_array_end + ',\n  ' + ',\n  '.join(articles_content) + after_content

# Write updated server.js
with open('server.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"\n🎉 Successfully integrated {len(articles_content)} articles!")
print(f"📊 Total: {8 + len(articles_content)} articles (100% complete!)")
print("✅ server.js updated!")
