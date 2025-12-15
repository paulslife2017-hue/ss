import fs from 'fs';

const sitemapPath = 'public/sitemap.xml';
let sitemap = fs.readFileSync(sitemapPath, 'utf8');

const today = new Date().toISOString().split('T')[0]; // 2025-12-15 format

// Batch 2 URLs (16 URLs - 8 topics × EN+JP)
const batch2Topics = [
  'korean-glass-skin-facial-treatment-guide-2025',
  'seoul-korean-massage-spa-complete-guide-2025',
  'gangnam-beauty-district-clinic-guide-2025',
  'korean-head-spa-scalp-treatment-booking-2025',
  'myeongdong-beauty-street-shopping-guide-2025',
  'korean-jjimjilbang-spa-experience-guide-2025',
  'seoul-beauty-package-tours-booking-2025',
  'korean-beauty-influencer-recommended-clinics-2025'
];

// Batch 4 URLs (20 URLs - 10 topics × EN+JP)
const batch4Topics = [
  'korean-pdrn-salmon-injection-guide-2025',
  'korean-thread-lift-non-surgical-facelift-guide-2025',
  'gangnam-dental-clinic-english-guide-2025',
  'korean-jaw-reduction-surgery-v-line-guide-2025',
  'korean-acne-scar-treatment-laser-guide-2025',
  'korean-eyelid-surgery-ptosis-correction-guide-2025',
  'korean-breast-reduction-surgery-guide-2025',
  'korean-hair-transplant-fue-method-guide-2025',
  'korean-laser-hair-removal-guide-2025',
  'korean-body-fat-analysis-inbody-test-guide-2025'
];

let newEntries = '\n  <!-- Batch 2: KBeautySeoul Backlink Articles (8 topics EN+JP, 16 URLs) -->\n';

batch2Topics.forEach(slug => {
  // English version
  newEntries += `  <url>
    <loc>https://seoulzen.com/blog/${slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
`;
  
  // Japanese version
  newEntries += `  <url>
    <loc>https://seoulzen.com/blog/${slug}-japanese.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
`;
});

newEntries += '  <!-- Batch 4: High-Revenue AdSense Articles (10 topics EN+JP, 20 URLs) -->\n';

batch4Topics.forEach(slug => {
  // English version
  newEntries += `  <url>
    <loc>https://seoulzen.com/blog/${slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
`;
  
  // Japanese version
  newEntries += `  <url>
    <loc>https://seoulzen.com/blog/${slug}-japanese.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
`;
});

// Insert before closing </urlset> tag
sitemap = sitemap.replace('</urlset>', newEntries + '</urlset>');

fs.writeFileSync(sitemapPath, sitemap, 'utf8');

console.log('✅ Sitemap updated successfully!');
console.log(`📊 Added ${batch2Topics.length * 2} Batch 2 URLs + ${batch4Topics.length * 2} Batch 4 URLs = ${(batch2Topics.length + batch4Topics.length) * 2} new URLs`);
console.log(`🌐 Total URLs in sitemap: ${(sitemap.match(/<loc>/g) || []).length}`);
console.log('📅 Last modified:', today);
