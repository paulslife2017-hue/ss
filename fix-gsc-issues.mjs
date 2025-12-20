import fs from 'fs';
import path from 'path';

console.log('🔍 Google Search Console Issues Fix\n');

// 1. Verify all blog HTML files exist
const blogDir = './public/blog/';
const htmlFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

console.log(`📊 Found ${htmlFiles.length} HTML files in public/blog/\n`);

// 2. Read current sitemap
const sitemapPath = './public/sitemap.xml';
let sitemap = fs.readFileSync(sitemapPath, 'utf8');

// Extract URLs from sitemap
const urlMatches = sitemap.match(/<loc>(.*?)<\/loc>/g);
const sitemapUrls = urlMatches.map(match => {
  const url = match.replace('<loc>', '').replace('</loc>', '');
  return url.replace('https://seoulzen.com/', '');
});

console.log(`📋 Sitemap contains ${sitemapUrls.length} URLs\n`);

// 3. Find mismatches
const blogUrls = sitemapUrls.filter(url => url.startsWith('blog/'));
const issues = [];

blogUrls.forEach(url => {
  const filename = url.replace('blog/', '');
  const filePath = path.join(blogDir, filename);
  
  if (!fs.existsSync(filePath)) {
    issues.push({
      type: '404 - File Not Found',
      url: url,
      filename: filename
    });
  } else {
    // Check file size
    const stats = fs.statSync(filePath);
    if (stats.size < 1000) {
      issues.push({
        type: 'Empty or Too Small',
        url: url,
        filename: filename,
        size: stats.size
      });
    }
  }
});

console.log('='.repeat(70));
console.log('🔴 ISSUES FOUND');
console.log('='.repeat(70));

if (issues.length === 0) {
  console.log('✅ No issues found! All sitemap URLs have corresponding files.\n');
} else {
  console.log(`Found ${issues.length} issues:\n`);
  
  issues.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue.type}`);
    console.log(`   URL: https://seoulzen.com/${issue.url}`);
    console.log(`   File: ${issue.filename}`);
    if (issue.size !== undefined) {
      console.log(`   Size: ${issue.size} bytes`);
    }
    console.log('');
  });
}

// 4. Find files not in sitemap
const existingFiles = htmlFiles.map(f => `blog/${f}`);
const missingFromSitemap = existingFiles.filter(f => !sitemapUrls.includes(f));

if (missingFromSitemap.length > 0) {
  console.log('='.repeat(70));
  console.log('🟡 FILES NOT IN SITEMAP');
  console.log('='.repeat(70));
  console.log(`Found ${missingFromSitemap.length} files not in sitemap:\n`);
  
  missingFromSitemap.slice(0, 10).forEach((file, i) => {
    console.log(`${i + 1}. ${file}`);
  });
  
  if (missingFromSitemap.length > 10) {
    console.log(`... and ${missingFromSitemap.length - 10} more`);
  }
  console.log('');
}

// 5. Generate clean sitemap with only existing files
console.log('='.repeat(70));
console.log('🛠️  GENERATING CLEAN SITEMAP');
console.log('='.repeat(70));

const today = new Date().toISOString().split('T')[0];
let cleanSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Homepage -->
  <url>
    <loc>https://seoulzen.com</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Blog Index -->
  <url>
    <loc>https://seoulzen.com/blog.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Blog Articles -->\n`;

// Add only verified existing files
let validCount = 0;
htmlFiles.forEach(file => {
  const filePath = path.join(blogDir, file);
  const stats = fs.statSync(filePath);
  
  // Only add files larger than 1KB
  if (stats.size > 1000) {
    cleanSitemap += `  <url>
    <loc>https://seoulzen.com/blog/${file}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  \n`;
    validCount++;
  }
});

cleanSitemap += '</urlset>';

// Save clean sitemap
fs.writeFileSync(sitemapPath, cleanSitemap, 'utf8');

console.log(`✅ Clean sitemap generated with ${validCount} valid blog URLs\n`);

// 6. Create robots.txt if not exists
const robotsPath = './public/robots.txt';
const robotsContent = `User-agent: *
Allow: /

Sitemap: https://seoulzen.com/sitemap.xml
`;

fs.writeFileSync(robotsPath, robotsContent, 'utf8');
console.log('✅ robots.txt created/updated\n');

// 7. Summary
console.log('='.repeat(70));
console.log('📊 SUMMARY');
console.log('='.repeat(70));
console.log(`Total HTML files: ${htmlFiles.length}`);
console.log(`Valid files added to sitemap: ${validCount}`);
console.log(`404 Issues found: ${issues.filter(i => i.type === '404 - File Not Found').length}`);
console.log(`Empty files found: ${issues.filter(i => i.type === 'Empty or Too Small').length}`);
console.log(`Files missing from sitemap: ${missingFromSitemap.length}`);
console.log('');
console.log('✅ All issues fixed!\n');

console.log('🎯 Next Steps:');
console.log('1. Commit and push changes to GitHub');
console.log('2. Wait 2-5 minutes for Vercel deployment');
console.log('3. Go to Google Search Console');
console.log('4. Resubmit sitemap: https://seoulzen.com/sitemap.xml');
console.log('5. Wait 24-48 hours for re-indexing\n');
