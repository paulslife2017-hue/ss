#!/usr/bin/env python3
import os
import glob

# Google Analytics code to insert
GA_CODE = """  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4DH40QL7TS"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-4DH40QL7TS');
  </script>
"""

# Process all HTML files in public/blog directory
blog_dir = '/home/user/webapp/public/blog'
html_files = glob.glob(os.path.join(blog_dir, '*.html'))

count = 0
for file_path in html_files:
    filename = os.path.basename(file_path)
    
    # Read file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if GA is already installed
    if 'G-4DH40QL7TS' in content:
        print(f"GA already exists in {filename}, skipping")
        continue
    
    # Insert GA code after <head> tag
    if '<head>' in content:
        content = content.replace('<head>', '<head>\n' + GA_CODE, 1)
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Added GA to {filename}")
        count += 1
    else:
        print(f"⚠️  No <head> tag found in {filename}")

print(f"\n✅ Done! GA4 added to {count} blog pages.")
