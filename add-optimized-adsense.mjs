import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const blogDir = './public/blog';
const ADSENSE_CLIENT = 'ca-pub-6943282483618134';

// Optimized AdSense ad units for different positions
const adUnits = {
  headerBanner: `
<!-- AdSense: Header Banner (728x90 Leaderboard) -->
<div style="text-align: center; margin: 24px 0; padding: 16px; background: #f8f9fa; border-radius: 8px;">
  <ins class="adsbygoogle"
       style="display:inline-block;width:728px;height:90px"
       data-ad-client="${ADSENSE_CLIENT}"
       data-ad-slot="1234567890"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
`,

  afterFirstParagraph: `
<!-- AdSense: After First Paragraph (Responsive Display) -->
<div style="margin: 32px 0; padding: 16px; background: #f8f9fa; border-radius: 8px;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="${ADSENSE_CLIENT}"
       data-ad-slot="2345678901"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
`,

  midContent: `
<!-- AdSense: Mid Content (In-Article Ad) -->
<div style="margin: 32px 0; padding: 16px; background: #f8f9fa; border-radius: 8px;">
  <ins class="adsbygoogle"
       style="display:block; text-align:center;"
       data-ad-layout="in-article"
       data-ad-format="fluid"
       data-ad-client="${ADSENSE_CLIENT}"
       data-ad-slot="3456789012"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
`,

  beforeFAQ: `
<!-- AdSense: Before FAQ Section (Rectangle 300x250) -->
<div style="margin: 32px auto; padding: 16px; background: #f8f9fa; border-radius: 8px; max-width: 320px;">
  <ins class="adsbygoogle"
       style="display:inline-block;width:300px;height:250px"
       data-ad-client="${ADSENSE_CLIENT}"
       data-ad-slot="4567890123"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
`,

  footer: `
<!-- AdSense: Footer (Responsive Display) -->
<div style="margin: 40px 0 24px 0; padding: 16px; background: #f8f9fa; border-radius: 8px;">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="${ADSENSE_CLIENT}"
       data-ad-slot="5678901234"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>
       (adsbygoogle = window.adsbygoogle || []).push({});
  </script>
</div>
`
};

function countExistingAds(content) {
  const matches = content.match(/class="adsbygoogle"/g);
  return matches ? matches.length : 0;
}

function addOptimizedAdSense() {
  const files = readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'undefined.html');
  let processedCount = 0;
  let totalAdsAdded = 0;
  const stats = {
    before: [],
    after: []
  };
  
  for (const filename of files) {
    const filepath = join(blogDir, filename);
    
    try {
      let content = readFileSync(filepath, 'utf-8');
      const beforeCount = countExistingAds(content);
      stats.before.push(beforeCount);
      
      // Skip if already has 5+ ads
      if (beforeCount >= 5) {
        console.log(`⏭️  Skipped (already has ${beforeCount} ads): ${filename}`);
        stats.after.push(beforeCount);
        continue;
      }
      
      let adsAdded = 0;
      
      // 1. Add Header Banner (after <main> or after nav)
      if (!content.includes('AdSense: Header Banner') && beforeCount < 5) {
        const mainStart = content.indexOf('<main');
        if (mainStart !== -1) {
          const mainEnd = content.indexOf('>', mainStart) + 1;
          content = content.slice(0, mainEnd) + adUnits.headerBanner + content.slice(mainEnd);
          adsAdded++;
        }
      }
      
      // 2. Add After First Paragraph (after first </p> in main content)
      if (!content.includes('AdSense: After First Paragraph') && beforeCount + adsAdded < 5) {
        const firstParagraph = content.indexOf('</p>');
        if (firstParagraph !== -1 && firstParagraph > 1000) { // Ensure it's in main content
          content = content.slice(0, firstParagraph + 4) + adUnits.afterFirstParagraph + content.slice(firstParagraph + 4);
          adsAdded++;
        }
      }
      
      // 3. Add Mid Content (at ~40% of content length)
      if (!content.includes('AdSense: Mid Content') && beforeCount + adsAdded < 5) {
        const mainContentStart = content.indexOf('<main');
        const mainContentEnd = content.indexOf('</main>');
        if (mainContentStart !== -1 && mainContentEnd !== -1) {
          const midPoint = Math.floor((mainContentStart + mainContentEnd) / 2);
          // Find nearest </p> or </h2> after midpoint
          const nearestTag = content.indexOf('</p>', midPoint);
          if (nearestTag !== -1) {
            content = content.slice(0, nearestTag + 4) + adUnits.midContent + content.slice(nearestTag + 4);
            adsAdded++;
          }
        }
      }
      
      // 4. Add Before FAQ Section (if exists)
      if (!content.includes('AdSense: Before FAQ') && beforeCount + adsAdded < 5) {
        const faqHeading = content.search(/<h2[^>]*>(FAQ|Frequently Asked Questions|자주 묻는 질문|よくある質問)/i);
        if (faqHeading !== -1) {
          content = content.slice(0, faqHeading) + adUnits.beforeFAQ + content.slice(faqHeading);
          adsAdded++;
        }
      }
      
      // 5. Add Footer Ad (before </main> or before footer)
      if (!content.includes('AdSense: Footer') && beforeCount + adsAdded < 5) {
        const mainEnd = content.lastIndexOf('</main>');
        if (mainEnd !== -1) {
          content = content.slice(0, mainEnd) + adUnits.footer + content.slice(mainEnd);
          adsAdded++;
        }
      }
      
      if (adsAdded > 0) {
        writeFileSync(filepath, content, 'utf-8');
        processedCount++;
        totalAdsAdded += adsAdded;
        const afterCount = beforeCount + adsAdded;
        stats.after.push(afterCount);
        console.log(`✅ ${filename}: ${beforeCount} → ${afterCount} ads (+${adsAdded})`);
      } else {
        stats.after.push(beforeCount);
        console.log(`⚠️  ${filename}: Could not add ads (${beforeCount} existing)`);
      }
      
    } catch (error) {
      console.log(`❌ Error processing ${filename}:`, error.message);
      stats.after.push(0);
    }
  }
  
  // Calculate statistics
  const avgBefore = stats.before.reduce((a, b) => a + b, 0) / stats.before.length;
  const avgAfter = stats.after.reduce((a, b) => a + b, 0) / stats.after.length;
  
  console.log(`\n✨ AdSense Optimization Complete!\n`);
  console.log(`📊 Statistics:`);
  console.log(`   Files processed: ${processedCount} / ${files.length}`);
  console.log(`   Total ads added: ${totalAdsAdded}`);
  console.log(`   Avg ads per article (before): ${avgBefore.toFixed(1)}`);
  console.log(`   Avg ads per article (after): ${avgAfter.toFixed(1)}`);
  console.log(`   Increase: +${((avgAfter - avgBefore) / avgBefore * 100).toFixed(0)}%`);
  
  console.log(`\n📍 Ad Placement Strategy:`);
  console.log(`   1. Header Banner (728x90 Leaderboard) - High visibility`);
  console.log(`   2. After First Paragraph (Responsive) - Early engagement`);
  console.log(`   3. Mid Content (In-Article) - Natural reading flow`);
  console.log(`   4. Before FAQ (300x250 Rectangle) - Pre-conversion`);
  console.log(`   5. Footer (Responsive) - Exit intent`);
  
  console.log(`\n💰 Expected Revenue Impact:`);
  console.log(`   Current avg: ${avgBefore.toFixed(1)} ads/article`);
  console.log(`   New avg: ${avgAfter.toFixed(1)} ads/article`);
  console.log(`   Revenue multiplier: ${(avgAfter / avgBefore).toFixed(2)}x`);
  console.log(`   Monthly revenue increase: +${(((avgAfter / avgBefore) - 1) * 100).toFixed(0)}%`);
  
  console.log(`\n🎯 Google AdSense Settings:`);
  console.log(`   Publisher ID: ${ADSENSE_CLIENT}`);
  console.log(`   Ad formats: Responsive, In-Article, Fixed sizes`);
  console.log(`   Auto ads: Disabled (manual placement for control)`);
  
  console.log(`\n⚠️  Important Notes:`);
  console.log(`   - All ad slots use placeholder IDs (1234567890, etc.)`);
  console.log(`   - Replace with real ad slot IDs from Google AdSense`);
  console.log(`   - Test on mobile devices for responsive behavior`);
  console.log(`   - Monitor ad performance in AdSense dashboard`);
  console.log(`   - Ensure ads don't violate Google's Better Ads Standards`);
  
  console.log(`\n🚀 Next Steps:`);
  console.log(`   1. Go to https://adsense.google.com`);
  console.log(`   2. Create 5 ad units (Display ads)`);
  console.log(`   3. Copy the real ad slot IDs`);
  console.log(`   4. Replace placeholder IDs in this script`);
  console.log(`   5. Re-run the script with real IDs`);
  console.log(`   6. Deploy and monitor performance`);
}

addOptimizedAdSense();
