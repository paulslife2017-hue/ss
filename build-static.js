import { blogArticles } from './blog-articles.js';
import fs from 'fs';
import path from 'path';

const distDir = './public';
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

// Modern CSS with latest UI trends
const commonCSS = `
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  line-height: 1.7; 
  color: #1a1a1a; 
  background: #fafafa;
}
.container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }

/* Modern Header */
header { 
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
  color: white; 
  padding: 48px 0;
  position: relative;
  overflow: hidden;
}
header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"><path d="M0 0v120h1200V0c-200 50-400 80-600 80S200 50 0 0z" fill="rgba(255,255,255,0.05)"/></svg>');
  opacity: 0.3;
}
header .container { position: relative; z-index: 1; }
header h1 { 
  font-size: clamp(2rem, 5vw, 3rem); 
  margin-bottom: 12px;
  font-weight: 800;
  letter-spacing: -0.02em;
}
header p { font-size: 1.125rem; opacity: 0.95; font-weight: 500; }

/* Navigation */
nav { 
  background: white; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  padding: 16px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}
nav .container { 
  display: flex; 
  justify-content: center; 
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
nav a { 
  text-decoration: none; 
  color: #4b5563; 
  padding: 10px 20px; 
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 0.9375rem;
}
nav a:hover { 
  background: #6366f1; 
  color: white; 
  transform: translateY(-1px);
}

/* Hero Section */
.hero { 
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
  color: white;
  padding: 80px 24px;
  text-align: center;
  margin: 40px 0;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
  top: -250px;
  right: -250px;
}
.hero h2 { 
  font-size: clamp(2rem, 6vw, 3.5rem); 
  margin-bottom: 20px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
.hero p { font-size: 1.25rem; margin-bottom: 32px; opacity: 0.95; max-width: 600px; margin-left: auto; margin-right: auto; }
.btn { 
  display: inline-block;
  padding: 14px 32px;
  background: white;
  color: #6366f1;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 8px;
  font-size: 0.9375rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.btn:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

/* Blog Grid - Modern Card Design */
.blog-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); 
  gap: 32px; 
  margin: 48px 0;
}
.blog-card { 
  background: white; 
  border-radius: 16px; 
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f3f4f6;
}
.blog-card:hover { 
  transform: translateY(-4px); 
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  border-color: #e5e7eb;
}
.blog-card img { 
  width: 100%; 
  height: 220px; 
  object-fit: cover;
  transition: transform 0.3s;
}
.blog-card:hover img { transform: scale(1.05); }
.blog-card-content { padding: 24px; }
.blog-card h3 { 
  font-size: 1.25rem; 
  margin-bottom: 12px; 
  color: #111827;
  font-weight: 700;
  line-height: 1.3;
}
.blog-card p { 
  color: #6b7280; 
  margin-bottom: 16px;
  font-size: 0.9375rem;
  line-height: 1.6;
}
.blog-card .meta {
  font-size: 0.875rem;
  color: #9ca3af;
  margin-bottom: 12px;
  display: flex;
  gap: 12px;
}
.blog-card a.read-more { 
  color: #6366f1; 
  text-decoration: none; 
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9375rem;
  transition: gap 0.2s;
}
.blog-card a.read-more:hover { 
  color: #4f46e5;
  gap: 10px;
}

/* Section Headers */
.section-title { 
  text-align: center; 
  font-size: clamp(2rem, 4vw, 2.5rem); 
  margin: 80px 0 16px; 
  color: #111827;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.section-subtitle { 
  text-align: center; 
  color: #6b7280; 
  font-size: 1.125rem;
  margin-bottom: 48px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Footer */
footer { 
  background: #111827; 
  color: #d1d5db; 
  padding: 48px 0; 
  margin-top: 96px;
  text-align: center;
}
footer a { color: #818cf8; text-decoration: none; font-weight: 500; }
footer a:hover { color: #a5b4fc; text-decoration: underline; }
footer p { line-height: 1.8; }

/* Badges */
.badge { 
  display: inline-block;
  padding: 6px 16px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  font-size: 0.875rem;
  margin: 6px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

/* Article Page */
article { 
  background: white; 
  padding: 48px; 
  border-radius: 16px; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  margin: 32px 0;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}
article h1 { font-size: clamp(2rem, 4vw, 2.75rem); margin-bottom: 24px; color: #111827; font-weight: 800; line-height: 1.2; }
article h2 { font-size: 2rem; margin: 40px 0 16px; color: #1f2937; font-weight: 700; }
article h3 { font-size: 1.5rem; margin: 32px 0 12px; color: #374151; font-weight: 600; }
article p { margin-bottom: 16px; line-height: 1.8; color: #374151; }
article ul, article ol { margin: 16px 0 16px 32px; }
article li { margin-bottom: 10px; line-height: 1.7; color: #374151; }
article a { color: #6366f1; text-decoration: none; font-weight: 500; }
article a:hover { text-decoration: underline; color: #4f46e5; }
article img { 
  width: 100%; 
  border-radius: 12px; 
  margin: 24px 0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
}
article table { width: 100%; border-collapse: collapse; margin: 24px 0; border-radius: 8px; overflow: hidden; }
article th, article td { padding: 14px; border: 1px solid #e5e7eb; text-align: left; }
article th { background: #f9fafb; font-weight: 600; color: #111827; }
article tr:hover { background: #f9fafb; }

/* Back Link */
.back-link { 
  display: inline-block; 
  margin: 24px 0; 
  padding: 12px 24px;
  background: #6366f1;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.2s;
  font-size: 0.9375rem;
}
.back-link:hover { background: #4f46e5; transform: translateX(-4px); }

/* Responsive */
@media (max-width: 768px) {
  .container { padding: 0 16px; }
  header { padding: 32px 0; }
  .hero { padding: 60px 20px; margin: 24px 0; border-radius: 16px; }
  .blog-grid { grid-template-columns: 1fr; gap: 24px; }
  article { padding: 24px; margin: 20px 0; }
  .section-title { margin: 56px 0 12px; }
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
          <img src="${article.image}" alt="${article.title.en}" loading="lazy">
          <div class="blog-card-content">
            <h3>${article.title.en}</h3>
            <p>${article.excerpt.en.substring(0, 130)}...</p>
            <div class="meta">
              <span>📅 ${article.date || '2025-01-01'}</span>
              <span>⏱️ ${article.readTime || '10 min read'}</span>
            </div>
            <a href="/blog/${article.slug}.html" class="read-more">Read Full Guide →</a>
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
          <img src="${article.image}" alt="${article.title.en}" loading="lazy">
          <div class="blog-card-content">
            <h3>${article.title.en}</h3>
            <p>${article.excerpt.en.substring(0, 130)}...</p>
            <div class="meta">
              <span>📅 ${article.date || '2025-01-01'}</span>
              <span>⏱️ ${article.readTime || '10 min read'}</span>
            </div>
            <a href="/blog/${article.slug}.html" class="read-more">Read Full Guide →</a>
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
