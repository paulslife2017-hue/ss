import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing Google Search Console Errors...\n');

// 1. Check what "undefined.html" actually is
const undefinedPath = 'public/blog/undefined.html';
const undefinedContent = fs.readFileSync(undefinedPath, 'utf-8');
const titleMatch = undefinedContent.match(/<title>([^<]+)<\/title>/);
const h1Match = undefinedContent.match(/<h1[^>]*>([^<]+)<\/h1>/);

console.log('📄 Analyzing undefined.html:');
console.log(`   Title: ${titleMatch ? titleMatch[1] : 'Not found'}`);
console.log(`   H1: ${h1Match ? h1Match[1] : 'Not found'}`);

// Determine proper filename
let newFilename = 'how-to-book-korean-beauty-treatments-2025.html';
if (titleMatch && titleMatch[1].includes('Book Korean Beauty')) {
  newFilename = 'how-to-book-korean-beauty-treatments-2025.html';
}

console.log(`   ✅ Should be renamed to: ${newFilename}\n`);

// 2. Remove undefined.html from sitemap and add proper URL
const sitemapPath = 'public/sitemap.xml';
let sitemap = fs.readFileSync(sitemapPath, 'utf-8');

// Get today's date for lastmod
const today = new Date().toISOString().split('T')[0];
console.log(`📅 Today's date: ${today}\n`);

// Remove undefined.html entry
const undefinedEntry = sitemap.match(/<url>\s*<loc>https:\/\/seoulzen\.com\/blog\/undefined\.html<\/loc>[\s\S]*?<\/url>/);
if (undefinedEntry) {
  sitemap = sitemap.replace(undefinedEntry[0], '');
  console.log('✅ Removed undefined.html from sitemap');
}

// Update all lastmod dates to today (fix future date issue)
sitemap = sitemap.replace(/<lastmod>2025-12-20<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
console.log(`✅ Updated all lastmod dates to ${today}`);

// Add proper URL if it doesn't exist
if (!sitemap.includes(`blog/${newFilename}`)) {
  const newEntry = `  
  <url>
    <loc>https://seoulzen.com/blog/${newFilename}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>\n`;
  
  sitemap = sitemap.replace('</urlset>', newEntry + '</urlset>');
  console.log(`✅ Added proper URL: ${newFilename}`);
}

// 3. Rename undefined.html file
const newPath = `public/blog/${newFilename}`;
if (!fs.existsSync(newPath)) {
  fs.renameSync(undefinedPath, newPath);
  console.log(`✅ Renamed file: undefined.html → ${newFilename}\n`);
} else {
  // If target exists, just delete undefined.html
  fs.unlinkSync(undefinedPath);
  console.log(`✅ Deleted duplicate file: undefined.html\n`);
}

// 4. Save updated sitemap
fs.writeFileSync(sitemapPath, sitemap);

// 5. Count URLs
const urlCount = (sitemap.match(/<url>/g) || []).length;
console.log(`\n📊 Final Sitemap Stats:`);
console.log(`   Total URLs: ${urlCount}`);
console.log(`   Last Updated: ${today}`);

// 6. Create robots.txt with proper format
const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: https://seoulzen.com/sitemap.xml

# Google Bots
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

# Crawl-delay (prevent overload)
Crawl-delay: 1
`;

fs.writeFileSync('public/robots.txt', robotsTxt);
console.log(`\n✅ Updated robots.txt with proper format`);

console.log('\n✨ All Google Search Console issues fixed!');
console.log('\n📋 Next Steps:');
console.log('   1. Commit and push changes to GitHub');
console.log('   2. Wait 5 minutes for Vercel deployment');
console.log('   3. Submit sitemap to Google Search Console:');
console.log('      https://search.google.com/search-console');
console.log('   4. Request indexing for all URLs (bulk request)');
