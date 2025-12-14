import { blogArticles } from './blog-articles.js';
import fs from 'fs';
import path from 'path';

const distDir = './public';
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

// Generate homepage
const homepage = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Seoul Zen - K-Beauty Official Blog</title></head><body>
<h1>🇰🇷 Seoul Zen</h1><p>Total Articles: ${blogArticles.length}</p>
<a href="/blog.html">📖 Browse All Articles</a>
</body></html>`;
fs.writeFileSync(path.join(distDir, 'index.html'), homepage);

// Generate blog list
const blogList = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Blog List</title></head><body>
<h1>All Articles (${blogArticles.length})</h1><ul>
${blogArticles.map(a => `<li><a href="/blog/${a.slug}.html">${a.title.en}</a></li>`).join('')}
</ul></body></html>`;
fs.writeFileSync(path.join(distDir, 'blog.html'), blogList);

// Generate sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://seoulzen.com</loc><priority>1.0</priority></url>
<url><loc>https://seoulzen.com/blog.html</loc><priority>0.9</priority></url>
${blogArticles.map(a => `<url><loc>https://seoulzen.com/blog/${a.slug}.html</loc><priority>0.8</priority></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);

// Generate blog posts
const blogDir = path.join(distDir, 'blog');
if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

blogArticles.forEach(article => {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${article.title.en}</title>
<meta name="description" content="${article.metaDescription.en}"></head><body>
<article>${article.content.en}</article>
<p><a href="/blog.html">← Back</a></p></body></html>`;
  fs.writeFileSync(path.join(blogDir, `${article.slug}.html`), html);
});

console.log(`✅ Generated ${blogArticles.length} blog posts + homepage + sitemap`);
