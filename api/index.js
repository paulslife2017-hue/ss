// Vercel Serverless Function - Direct Handler
import { blogArticles } from '../blog-articles.js';

// Simple router without Hono
export default async function handler(req, res) {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const path = url.pathname;
  const lang = url.searchParams.get('lang') || 'en';

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Sitemap.xml route
  if (path === '/sitemap.xml') {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://seoulzen.com</loc><priority>1.0</priority></url>
  <url><loc>https://seoulzen.com/blog</loc><priority>0.9</priority></url>
  ${blogArticles.map(article => `  <url><loc>https://seoulzen.com/blog/${article.slug}</loc><priority>0.8</priority></url>`).join('\n')}
</urlset>`;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(sitemap);
  }

  // Robots.txt route
  if (path === '/robots.txt') {
    const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://seoulzen.com/sitemap.xml`;
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(robotsTxt);
  }

  // Blog list page
  if (path === '/blog') {
    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>K-Beauty Seoul Blog - ${blogArticles.length} Articles</title>
  <meta name="description" content="Complete guide to Korean beauty services in Seoul">
</head>
<body>
  <h1>K-Beauty Seoul Official Blog</h1>
  <p>Total Articles: ${blogArticles.length}</p>
  <ul>
    ${blogArticles.map(article => `
      <li>
        <h2><a href="/blog/${article.slug}">${article.title[lang] || article.title.en}</a></h2>
        <p>${article.excerpt[lang] || article.excerpt.en}</p>
      </li>
    `).join('')}
  </ul>
  <footer>
    <p>© 2025 Seoul Zen - K-Beauty Official Blog</p>
    <p><a href="https://kbeautyseoul.co.kr">Book Services</a></p>
  </footer>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  // Individual blog post
  if (path.startsWith('/blog/')) {
    const slug = path.replace('/blog/', '');
    const article = blogArticles.find(a => a.slug === slug);
    
    if (!article) {
      return res.status(404).send('<h1>Blog post not found</h1>');
    }

    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title[lang] || article.title.en}</title>
  <meta name="description" content="${article.metaDescription[lang] || article.metaDescription.en}">
</head>
<body>
  <article>
    ${article.content[lang] || article.content.en}
  </article>
  <footer>
    <p><a href="/blog">← Back to Blog List</a></p>
    <p><a href="https://kbeautyseoul.co.kr">Book Services</a></p>
  </footer>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  // Homepage
  if (path === '/' || path === '') {
    const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seoul Zen - K-Beauty Official Blog</title>
  <meta name="description" content="Your guide to Korean beauty services in Seoul">
</head>
<body>
  <h1>🇰🇷 Seoul Zen - K-Beauty Official Blog</h1>
  <p>Complete guide to Korean beauty services, treatments, and tourism in Seoul</p>
  <p><strong>Total Articles: ${blogArticles.length}</strong></p>
  <nav>
    <a href="/blog">📖 Browse All Articles</a> | 
    <a href="https://kbeautyseoul.co.kr">📅 Book Services</a>
  </nav>
  <h2>Featured Articles</h2>
  <ul>
    ${blogArticles.slice(0, 5).map(article => `
      <li><a href="/blog/${article.slug}">${article.title[lang] || article.title.en}</a></li>
    `).join('')}
  </ul>
  <footer>
    <p>© 2025 Seoul Zen - Official Blog of kbeautyseoul.co.kr</p>
  </footer>
</body>
</html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  }

  // 404 fallback
  return res.status(404).send('<h1>404 - Page Not Found</h1>');
}
