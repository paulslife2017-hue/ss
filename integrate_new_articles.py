#!/usr/bin/env python3
"""
Integrate new articles (16-20) into server.js
"""
import re

# Read server.js
with open('server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find where posts array ends (should be around line 1962 or after article 15)
# Look for the closing bracket of posts array
posts_array_pattern = r'(const posts = \[.*?\n)(\];)'
match = re.search(posts_array_pattern, content, re.DOTALL)

if not match:
    print("ERROR: Could not find posts array")
    exit(1)

# Read new article files (16-20)
new_articles = []
for i in range(16, 21):
    filename = f'article_{i}_'
    # Find the actual filename
    import glob
    matching_files = glob.glob(f'article_{i}_*.js')
    if matching_files:
        filepath = matching_files[0]
        print(f"Reading {filepath}...")
        with open(filepath, 'r', encoding='utf-8') as f:
            article_content = f.read()
            # Extract module.exports object
            exports_match = re.search(r'module\.exports\s*=\s*(\{.*\});', article_content, re.DOTALL)
            if exports_match:
                article_obj = exports_match.group(1)
                new_articles.append(article_obj)
            else:
                print(f"WARNING: Could not extract exports from {filepath}")

if not new_articles:
    print("ERROR: No new articles found")
    exit(1)

print(f"Found {len(new_articles)} new articles to integrate")

# Find the last post in the array
last_post_pattern = r'(.*\n\s*views: \d+,\n\s*featured: (?:true|false),.*?\n\s*updatedAt: [\'"].+?[\'"]\n\s*\})'
all_matches = list(re.finditer(last_post_pattern, content, re.DOTALL))
if not all_matches:
    print("ERROR: Could not find last post")
    exit(1)

last_match = all_matches[-1]
insert_position = last_match.end()

# Add comma after last post and insert new articles
new_content = content[:insert_position] + ','

for i, article in enumerate(new_articles):
    new_content += '\n  ' + article
    if i < len(new_articles) - 1:
        new_content += ','

new_content += content[insert_position:]

# Write updated server.js
with open('server.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"✅ Successfully integrated {len(new_articles)} articles into server.js!")
print("New articles added: 16, 17, 18, 19, 20")
