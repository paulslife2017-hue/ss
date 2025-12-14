import { blogArticles } from './blog-articles.js';
import fs from 'fs';
import path from 'path';

const distDir = './public';
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

// Common CSS for all pages
const commonCSS = `
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  line-height: 1.6; 
  color: #333; 
  background: #f9f9f9;
}
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 0; }
header h1 { font-size: 2.5rem; margin-bottom: 10px; }
header p { font-size: 1.1rem; opacity: 0.9; }
nav { background: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 15px 0; }
nav a { 
  text-decoration: none; 
  color: #667eea; 
  padding: 10px 20px; 
  margin: 0 10px;
  border-radius: 5px;
  transition: background 0.3s;
}
nav a:hover { background: #667eea; color: white; }
.hero { 
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
  margin: 30px 0;
  border-radius: 15px;
}
.hero h2 { font-size: 3rem; margin-bottom: 20px; }
.hero p { font-size: 1.3rem; margin-bottom: 30px; opacity: 0.9; }
.btn { 
  display: inline-block;
  padding: 15px 40px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 50px;
  font-weight: bold;
  transition: transform 0.3s;
  margin: 10px;
}
.btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
.blog-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
  gap: 30px; 
  margin: 40px 0;
}
.blog-card { 
  background: white; 
  border-radius: 15px; 
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}
.blog-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
.blog-card img { width: 100%; height: 200px; object-fit: cover; }
.blog-card-content { padding: 20px; }
.blog-card h3 { font-size: 1.3rem; margin-bottom: 10px; color: #333; }
.blog-card p { color: #666; margin-bottom: 15px; }
.blog-card a { 
  color: #667eea; 
  text-decoration: none; 
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.blog-card a:hover { color: #764ba2; }
.section-title { 
  text-align: center; 
  font-size: 2.5rem; 
  margin: 60px 0 30px; 
  color: #333;
}
.section-subtitle { 
  text-align: center; 
  color: #666; 
  font-size: 1.1rem;
  margin-bottom: 40px;
}
footer { 
  background: #2d3748; 
  color: white; 
  padding: 40px 0; 
  margin-top: 80px;
  text-align: center;
}
footer a { color: #667eea; text-decoration: none; }
footer a:hover { text-decoration: underline; }
.badge { 
  display: inline-block;
  padding: 5px 15px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  font-size: 0.9rem;
  margin: 5px;
}
.trust-badges { 
  display: flex; 
  justify-content: center; 
  gap: 30px; 
  flex-wrap: wrap;
  margin: 40px 0;
}
.trust-badge { 
  text-align: center; 
  padding: 20px;
  background: white;
  border-radius: 10px;
  min-width: 150px;
}
.trust-badge-icon { font-size: 2.5rem; margin-bottom: 10px; }
.trust-badge-title { font-weight: bold; color: #333; margin-bottom: 5px; }
.trust-badge-desc { font-size: 0.9rem; color: #666; }
article { 
  background: white; 
  padding: 40px; 
  border-radius: 15px; 
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  margin: 30px 0;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
article h1 { font-size: 2.5rem; margin-bottom: 20px; color: #333; }
article h2 { font-size: 2rem; margin: 30px 0 15px; color: #444; }
article h3 { font-size: 1.5rem; margin: 25px 0 12px; color: #555; }
article p { margin-bottom: 15px; line-height: 1.8; }
article ul, article ol { margin: 15px 0 15px 30px; }
article li { margin-bottom: 8px; }
article a { color: #667eea; text-decoration: none; }
article a:hover { text-decoration: underline; }
article table { width: 100%; border-collapse: collapse; margin: 20px 0; }
article th, article td { padding: 12px; border: 1px solid #ddd; text-align: left; }
article th { background: #f5f5f5; font-weight: bold; }
.back-link { 
  display: inline-block; 
  margin: 20px 0; 
  padding: 10px 20px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}
.back-link:hover { background: #764ba2; }
@media (max-width: 768px) {
  header h1 { font-size: 2rem; }
  .hero h2 { font-size: 2rem; }
  .blog-grid { grid-template-columns: 1fr; }
  article { padding: 20px; }
}
</style>
`;

// Generate homepage with full design
const homepage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seoul Zen - K-Beauty Official Blog | ${blogArticles.length} Expert Guides</title>
  <meta name="description" content="Your complete guide to Korean beauty services in Seoul. Expert reviews, prices, and English booking for massage, spa, skincare, and more.">
  ${commonCSS}
</head>
<body>
  <header>
    <div class="container">
      <h1>🇰🇷 Seoul Zen</h1>
      <p>Official K-Beauty Guide Blog | ${blogArticles.length} Expert Articles</p>
      <div class="trust-badges">
        <span class="badge">✓ Verified Services</span>
        <span class="badge">✓ English Support</span>
        <span class="badge">✓ 24/7 Available</span>
      </div>
    </div>
  </header>

  <nav>
    <div class="container" style="text-align: center;">
      <a href="/">🏠 Home</a>
      <a href="/blog.html">📖 All Articles</a>
      <a href="https://kbeautyseoul.co.kr" target="_blank">📅 Book Services</a>
    </div>
  </nav>

  <div class="hero">
    <div class="container">
      <h2>Your Premium K-Beauty Guide</h2>
      <p>Expert guides, honest reviews, and transparent pricing for Seoul's best beauty services</p>
      <a href="/blog.html" class="btn">📖 Browse All Guides</a>
      <a href="https://kbeautyseoul.co.kr" class="btn" target="_blank">📅 Book Now</a>
    </div>
  </div>

  <div class="container">
    <h2 class="section-title">📌 Featured Guides</h2>
    <p class="section-subtitle">Most popular K-Beauty guides to get you started</p>
    
    <div class="blog-grid">
      ${blogArticles.slice(0, 6).map(article => `
        <div class="blog-card">
          <img src="${article.image}" alt="${article.title.en}">
          <div class="blog-card-content">
            <h3>${article.title.en}</h3>
            <p>${article.excerpt.en.substring(0, 120)}...</p>
            <a href="/blog/${article.slug}.html">Read More →</a>
          </div>
        </div>
      `).join('')}
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="/blog.html" class="btn">View All ${blogArticles.length} Guides →</a>
    </div>
  </div>

  <footer>
    <div class="container">
      <p><strong>Seoul Zen</strong> - Official Blog of <a href="https://kbeautyseoul.co.kr" target="_blank">kbeautyseoul.co.kr</a></p>
      <p style="margin-top: 10px;">Complete guides to Korean beauty services, treatments, and tourism in Seoul</p>
      <p style="margin-top: 20px; opacity: 0.7;">© 2025 Seoul Zen. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
fs.writeFileSync(path.join(distDir, 'index.html'), homepage);

// Generate blog list with design
const blogList = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All Articles (${blogArticles.length}) - Seoul Zen Blog</title>
  <meta name="description" content="Browse all ${blogArticles.length} expert guides on Korean beauty services in Seoul. Massage, spa, skincare, and more.">
  ${commonCSS}
</head>
<body>
  <header>
    <div class="container">
      <h1>📖 All Articles</h1>
      <p>${blogArticles.length} Expert K-Beauty Guides</p>
    </div>
  </header>

  <nav>
    <div class="container" style="text-align: center;">
      <a href="/">🏠 Home</a>
      <a href="/blog.html">📖 All Articles</a>
      <a href="https://kbeautyseoul.co.kr" target="_blank">📅 Book Services</a>
    </div>
  </nav>

  <div class="container">
    <h2 class="section-title">Complete Guide Collection</h2>
    <p class="section-subtitle">Everything you need to know about K-Beauty in Seoul</p>
    
    <div class="blog-grid">
      ${blogArticles.map(article => `
        <div class="blog-card">
          <img src="${article.image}" alt="${article.title.en}">
          <div class="blog-card-content">
            <h3>${article.title.en}</h3>
            <p>${article.excerpt.en.substring(0, 120)}...</p>
            <p style="font-size: 0.9rem; color: #999; margin-bottom: 10px;">
              📅 ${article.date} • ⏱️ ${article.readTime}
            </p>
            <a href="/blog/${article.slug}.html">Read Full Guide →</a>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <footer>
    <div class="container">
      <p><strong>Seoul Zen</strong> - Official Blog of <a href="https://kbeautyseoul.co.kr" target="_blank">kbeautyseoul.co.kr</a></p>
      <p style="margin-top: 20px; opacity: 0.7;">© 2025 Seoul Zen. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
fs.writeFileSync(path.join(distDir, 'blog.html'), blogList);

// Generate sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://seoulzen.com</loc><priority>1.0</priority></url>
<url><loc>https://seoulzen.com/blog.html</loc><priority>0.9</priority></url>
${blogArticles.map(a => `<url><loc>https://seoulzen.com/blog/${a.slug}.html</loc><priority>0.8</priority></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);

// Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://seoulzen.com/sitemap.xml`;
fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);

// Generate blog posts with full design
const blogDir = path.join(distDir, 'blog');
if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

blogArticles.forEach(article => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title.en} - Seoul Zen</title>
  <meta name="description" content="${article.metaDescription.en}">
  ${commonCSS}
</head>
<body>
  <header>
    <div class="container">
      <h1>Seoul Zen</h1>
      <p>K-Beauty Expert Guides</p>
    </div>
  </header>

  <nav>
    <div class="container" style="text-align: center;">
      <a href="/">🏠 Home</a>
      <a href="/blog.html">📖 All Articles</a>
      <a href="https://kbeautyseoul.co.kr" target="_blank">📅 Book Services</a>
    </div>
  </nav>

  <div class="container">
    <a href="/blog.html" class="back-link">← Back to All Articles</a>
    
    <article>
      ${article.content.en}
      
      <div style="margin-top: 40px; padding: 20px; background: #f5f5f5; border-radius: 10px; text-align: center;">
        <h3 style="margin-bottom: 15px;">Ready to Book?</h3>
        <p>Book verified K-Beauty services with English support</p>
        <a href="https://kbeautyseoul.co.kr" target="_blank" class="btn" style="margin-top: 15px;">📅 Book on kbeautyseoul.co.kr</a>
      </div>
    </article>

    <a href="/blog.html" class="back-link">← Back to All Articles</a>
  </div>

  <footer>
    <div class="container">
      <p><strong>Seoul Zen</strong> - Official Blog of <a href="https://kbeautyseoul.co.kr" target="_blank">kbeautyseoul.co.kr</a></p>
      <p style="margin-top: 20px; opacity: 0.7;">© 2025 Seoul Zen. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>`;
  fs.writeFileSync(path.join(blogDir, `${article.slug}.html`), html);
});

console.log(`✅ Generated ${blogArticles.length} beautiful blog posts + homepage + sitemap with full design!`);
