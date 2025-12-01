#!/usr/bin/env python3
"""
Article Integration Script
Automatically integrates article_*.js files into server.js
"""

import os
import re
import json
from pathlib import Path

def find_article_files():
    """Find all article_*.js files in current directory"""
    article_files = []
    for file in Path('.').glob('article_*.js'):
        article_files.append(str(file))
    return sorted(article_files)

def extract_article_data(filepath):
    """Extract article object from JS file"""
    print(f"📄 Reading {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the article object (between { and module.exports)
    # Match from first { to last } before module.exports
    pattern = r'(?:const \w+ = )?(\{[\s\S]*?\});?\s*(?:module\.exports|$)'
    match = re.search(pattern, content)
    
    if not match:
        print(f"  ❌ Could not parse {filepath}")
        return None
    
    article_str = match.group(1)
    
    # Extract id to check if already integrated
    id_match = re.search(r'id:\s*(\d+)', article_str)
    if id_match:
        article_id = int(id_match.group(1))
        print(f"  ✅ Found Article ID: {article_id}")
        return {
            'id': article_id,
            'content': article_str,
            'filepath': filepath
        }
    
    return None

def check_if_article_exists(server_content, article_id):
    """Check if article ID already exists in server.js"""
    pattern = rf'id:\s*{article_id}\s*,'
    return bool(re.search(pattern, server_content))

def integrate_articles():
    """Main integration function"""
    print("🚀 Article Integration Script")
    print("=" * 50)
    
    # Find article files
    article_files = find_article_files()
    if not article_files:
        print("❌ No article_*.js files found!")
        return
    
    print(f"📚 Found {len(article_files)} article file(s)")
    print()
    
    # Read server.js
    server_path = 'server.js'
    if not os.path.exists(server_path):
        print(f"❌ {server_path} not found!")
        return
    
    print(f"📖 Reading {server_path}...")
    with open(server_path, 'r', encoding='utf-8') as f:
        server_content = f.read()
    
    # Find posts array location
    posts_array_match = re.search(r'const posts = \[([\s\S]*?)\n\];', server_content, re.MULTILINE)
    if not posts_array_match:
        print("❌ Could not find 'const posts = [...]' in server.js!")
        return
    
    print("✅ Found posts array in server.js")
    print()
    
    # Extract articles
    articles = []
    for filepath in article_files:
        article_data = extract_article_data(filepath)
        if article_data:
            articles.append(article_data)
    
    if not articles:
        print("❌ No valid articles found to integrate!")
        return
    
    print()
    print("🔍 Checking which articles need integration...")
    print()
    
    # Check which articles are new
    new_articles = []
    existing_articles = []
    
    for article in articles:
        article_id = article['id']
        if check_if_article_exists(server_content, article_id):
            existing_articles.append(article_id)
            print(f"  ⚠️  Article {article_id} already exists - skipping")
        else:
            new_articles.append(article)
            print(f"  ✅ Article {article_id} is NEW - will integrate")
    
    if not new_articles:
        print()
        print("✨ All articles are already integrated!")
        print("   No changes needed.")
        return
    
    print()
    print(f"📝 Integrating {len(new_articles)} new article(s)...")
    print()
    
    # Find insertion point (before ];)
    posts_end_pattern = r'(\n\s*}\n)(\];)'
    posts_end_match = re.search(posts_end_pattern, posts_array_match.group(0))
    
    if not posts_end_match:
        print("❌ Could not find insertion point in posts array!")
        return
    
    # Build new articles string
    new_articles_str = ""
    for article in new_articles:
        # Add comma and newline, then the article
        new_articles_str += ",\n  " + article['content']
        print(f"  ✅ Added Article {article['id']}")
    
    # Replace in full server content
    old_posts_array = posts_array_match.group(0)
    new_posts_array = old_posts_array.replace(
        posts_end_match.group(0),
        posts_end_match.group(1) + new_articles_str + "\n" + posts_end_match.group(2)
    )
    
    new_server_content = server_content.replace(old_posts_array, new_posts_array)
    
    # Backup original server.js
    backup_path = 'server.js.backup'
    print()
    print(f"💾 Creating backup: {backup_path}")
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(server_content)
    
    # Write new server.js
    print(f"💾 Writing updated {server_path}")
    with open(server_path, 'w', encoding='utf-8') as f:
        f.write(new_server_content)
    
    print()
    print("=" * 50)
    print("✅ Integration Complete!")
    print()
    print("📊 Summary:")
    print(f"   • New articles added: {len(new_articles)}")
    print(f"   • Already existing: {len(existing_articles)}")
    print(f"   • Backup saved: {backup_path}")
    print()
    
    if new_articles:
        print("📋 Integrated Articles:")
        for article in new_articles:
            print(f"   • Article {article['id']} from {article['filepath']}")
    
    print()
    print("🚀 Next Steps:")
    print("   1. Test locally: node server.js")
    print("   2. Check new articles appear on site")
    print("   3. Commit: git add server.js && git commit -m 'feat: Integrate new articles'")
    print("   4. Push: git push origin main")
    print()

if __name__ == "__main__":
    try:
        integrate_articles()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
