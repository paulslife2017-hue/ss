import fs from 'fs';
import xml from 'xml2js';

console.log('🔗 Generating Google Search Console Bulk Submission URLs\n');

// Parse sitemap
const sitemapXml = fs.readFileSync('public/sitemap.xml', 'utf-8');
xml.parseString(sitemapXml, (err, result) => {
  if (err) {
    console.error('Error parsing sitemap:', err);
    return;
  }

  const urls = result.urlset.url.map(u => u.loc[0]);
  
  // Create submission files
  const allUrls = urls.join('\n');
  fs.writeFileSync('gsc-urls-all.txt', allUrls);
  
  // Group by priority
  const blogUrls = urls.filter(u => u.includes('/blog/'));
  const mainUrls = urls.filter(u => !u.includes('/blog/'));
  
  fs.writeFileSync('gsc-urls-blog.txt', blogUrls.join('\n'));
  fs.writeFileSync('gsc-urls-main.txt', mainUrls.join('\n'));
  
  // Create batches of 10 (GSC limit for manual submission)
  const batches = [];
  for (let i = 0; i < urls.length; i += 10) {
    batches.push(urls.slice(i, i + 10));
  }
  
  batches.forEach((batch, idx) => {
    fs.writeFileSync(`gsc-batch-${idx + 1}.txt`, batch.join('\n'));
  });
  
  console.log('✅ Generated submission files:');
  console.log(`   📄 gsc-urls-all.txt (${urls.length} URLs)`);
  console.log(`   📄 gsc-urls-blog.txt (${blogUrls.length} URLs)`);
  console.log(`   📄 gsc-urls-main.txt (${mainUrls.length} URLs)`);
  console.log(`   📄 gsc-batch-*.txt (${batches.length} batches of 10 URLs)\n`);
  
  console.log('📋 How to submit to Google Search Console:');
  console.log('   1. Go to: https://search.google.com/search-console');
  console.log('   2. Select property: seoulzen.com');
  console.log('   3. Go to "Sitemaps" → Submit: https://seoulzen.com/sitemap.xml');
  console.log('   4. Go to "URL Inspection" → Submit URLs from batch files\n');
  
  // Create priority list (high CPC articles)
  const highPriorityUrls = [
    'korean-jaw-reduction-surgery-v-line-guide-2025',
    'korean-hair-transplant-fue-method-guide-2025',
    'korean-breast-reduction-surgery-guide-2025',
    'korean-thread-lift-non-surgical-facelift-guide-2025',
    'korean-eyelid-surgery-ptosis-correction-guide-2025',
    'korean-pdrn-salmon-injection-guide-2025',
    'gangnam-dental-clinic-english-guide-2025',
    'korean-acne-scar-treatment-laser-guide-2025',
  ];
  
  const priorityUrls = urls.filter(u => 
    highPriorityUrls.some(keyword => u.includes(keyword))
  );
  
  fs.writeFileSync('gsc-urls-high-priority.txt', priorityUrls.join('\n'));
  console.log(`🎯 High Priority URLs (High CPC):`);
  console.log(`   📄 gsc-urls-high-priority.txt (${priorityUrls.length} URLs)`);
  console.log(`   Submit these FIRST for fastest AdSense revenue!\n`);
  
  // Create inspection API script
  const apiScript = `#!/bin/bash
# Google Search Console URL Inspection API
# Requires: Google Search Console API access

API_KEY="YOUR_API_KEY_HERE"
SITE_URL="https://seoulzen.com"

while IFS= read -r url; do
  echo "📍 Inspecting: $url"
  curl -X POST \\
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" \\
    -H "Authorization: Bearer $API_KEY" \\
    -H "Content-Type: application/json" \\
    -d "{
      \\"inspectionUrl\\": \\"$url\\",
      \\"siteUrl\\": \\"$SITE_URL\\"
    }"
  sleep 2
done < gsc-urls-high-priority.txt
`;
  
  fs.writeFileSync('gsc-api-submit.sh', apiScript);
  fs.chmodSync('gsc-api-submit.sh', '755');
  console.log('🤖 API Automation Script:');
  console.log('   📄 gsc-api-submit.sh (requires API key setup)\n');
});
