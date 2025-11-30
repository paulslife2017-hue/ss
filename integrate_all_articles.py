#!/usr/bin/env python3
"""
Integrate all article files into server.js
"""
import re
import json

# Article files to integrate
article_files = [
    ('article_6_gel_nails.js', 6),
    ('article_7_myeongdong_shopping.js', 7),
    ('article_8_mens_grooming.js', 8),
    ('article_9_head_spa_gangnam.js', 9),
    ('article_10_bb_glow.js', 10),
    ('article_11_eyebrow_tattoo.js', 11),
    ('article_12_anti_aging.js', 12),
    ('article_13_skincare_routine.js', 13),
    ('article_14_couple_spa.js', 14),
    ('article_15_foot_massage.js', 15),
    ('article_16_korean_body_scrub.js', 16),
    ('article_17_korean_sheet_masks.js', 17),
    ('article_18_korean_hair_salons.js', 18),
    ('article_19_korean_dermatology.js', 19),
    ('article_20_korean_wellness.js', 20),
]

def extract_article_data(filename, article_id):
    """Extract article data from JS file"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract title
        title_match = re.search(r"title:\s*['\"](.+?)['\"]", content)
        title = title_match.group(1) if title_match else f"Article {article_id}"
        
        # Extract slug
        slug_match = re.search(r"slug:\s*['\"](.+?)['\"]", content)
        slug = slug_match.group(1) if slug_match else f"article-{article_id}"
        
        # Extract excerpt
        excerpt_match = re.search(r"excerpt:\s*['\"](.+?)['\"]", content, re.DOTALL)
        excerpt = excerpt_match.group(1) if excerpt_match else ""
        
        # Extract full content
        content_match = re.search(r"content:\s*`(.*?)`\s*[,}]", content, re.DOTALL)
        article_content = content_match.group(1) if content_match else "<p>Content loading...</p>"
        
        # Extract other fields
        category_match = re.search(r"category:\s*['\"](.+?)['\"]", content)
        category = category_match.group(1) if category_match else "Beauty"
        
        date_match = re.search(r"date:\s*['\"](.+?)['\"]", content)
        date = date_match.group(1) if date_match else "2025-01-29"
        
        author_match = re.search(r"author:\s*['\"](.+?)['\"]", content)
        author = author_match.group(1) if author_match else "Seoul Beauty Expert"
        
        reading_time_match = re.search(r"readingTime:\s*['\"](.+?)['\"]", content)
        reading_time = reading_time_match.group(1) if reading_time_match else "15 min read"
        
        # Extract tags
        tags_match = re.search(r"tags:\s*\[(.*?)\]", content, re.DOTALL)
        tags_str = tags_match.group(1) if tags_match else ""
        tags = [t.strip().strip("'\"") for t in tags_str.split(',') if t.strip()]
        
        return {
            'id': article_id,
            'title': title,
            'slug': slug,
            'excerpt': excerpt,
            'content': article_content,
            'category': category,
            'date': date,
            'author': author,
            'readingTime': reading_time,
            'tags': tags,
            'published': True,
            'views': 0
        }
    except Exception as e:
        print(f"❌ Error processing {filename}: {e}")
        return None

# Extract all articles
articles = []
for filename, article_id in article_files:
    print(f"Processing {filename}...")
    article_data = extract_article_data(filename, article_id)
    if article_data:
        articles.append(article_data)
        print(f"  ✅ Article {article_id}: {article_data['title'][:50]}...")

print(f"\n📊 Total articles extracted: {len(articles)}")

# Generate JavaScript code for posts array (articles 6-20)
print("\n✅ Generating posts array code for articles 6-20...")
print("✅ Output will be in 'new_posts_6_20.txt'")
print("📝 You need to manually add these to server.js posts array")

with open('new_posts_6_20.txt', 'w', encoding='utf-8') as f:
    for i, article in enumerate(articles):
        f.write(f"  {{\n")
        f.write(f"    id: {article['id']},\n")
        f.write(f"    title: {json.dumps(article['title'])},\n")
        f.write(f"    slug: {json.dumps(article['slug'])},\n")
        f.write(f"    excerpt: {json.dumps(article['excerpt'])},\n")
        # Content needs special handling due to template literals
        content_escaped = article['content'].replace('`', '\\`').replace('${', '\\${')
        f.write(f"    content: `{content_escaped}`,\n")
        f.write(f"    category: {json.dumps(article['category'])},\n")
        f.write(f"    date: {json.dumps(article['date'])},\n")
        f.write(f"    author: {json.dumps(article['author'])},\n")
        f.write(f"    readingTime: {json.dumps(article['readingTime'])},\n")
        f.write(f"    tags: {json.dumps(article['tags'])},\n")
        f.write(f"    published: true,\n")
        f.write(f"    views: {article['views']}\n")
        f.write(f"  }}")
        if i < len(articles) - 1:
            f.write(",\n")
        else:
            f.write("\n")

print("\n✅ Done! Check 'new_posts_6_20.txt' file")
