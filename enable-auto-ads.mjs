import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const blogDir = './public/blog';
const ADSENSE_CLIENT = 'ca-pub-6943282483618134';

// Auto Ads script - Google will automatically place ads
const autoAdsScript = `
<!-- Google AdSense Auto Ads (AI-Powered Optimization) -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}"
     crossorigin="anonymous"></script>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "${ADSENSE_CLIENT}",
          enable_page_level_ads: true
     });
</script>
`;

function enableAutoAds() {
  const files = readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'undefined.html');
  let processedCount = 0;
  let skippedCount = 0;
  
  for (const filename of files) {
    const filepath = join(blogDir, filename);
    
    try {
      let content = readFileSync(filepath, 'utf-8');
      
      // Check if Auto Ads already enabled
      if (content.includes('enable_page_level_ads: true')) {
        console.log(`⏭️  Already has Auto Ads: ${filename}`);
        skippedCount++;
        continue;
      }
      
      // Find the AdSense script tag
      const adsenseScriptRegex = /<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-[0-9]+"/;
      
      if (adsenseScriptRegex.test(content)) {
        // Add Auto Ads config after the AdSense script
        const match = content.match(adsenseScriptRegex);
        const insertPosition = content.indexOf(match[0]) + match[0].length;
        const scriptEnd = content.indexOf('</script>', insertPosition) + 9;
        
        // Insert Auto Ads enablement right after existing AdSense script
        const autoAdsEnablement = `\n<script>\n     (adsbygoogle = window.adsbygoogle || []).push({\n          google_ad_client: "${ADSENSE_CLIENT}",\n          enable_page_level_ads: true\n     });\n</script>`;
        
        content = content.slice(0, scriptEnd) + autoAdsEnablement + content.slice(scriptEnd);
        
        writeFileSync(filepath, content, 'utf-8');
        processedCount++;
        console.log(`✅ Enabled Auto Ads: ${filename}`);
      } else {
        console.log(`⚠️  No AdSense script found: ${filename}`);
      }
      
    } catch (error) {
      console.log(`❌ Error processing ${filename}:`, error.message);
    }
  }
  
  console.log(`\n✨ Auto Ads Activation Complete!\n`);
  console.log(`📊 Summary:`);
  console.log(`   Files processed: ${processedCount}`);
  console.log(`   Files skipped: ${skippedCount}`);
  console.log(`   Total files: ${files.length}`);
  
  console.log(`\n🤖 Google Auto Ads Features:`);
  console.log(`   ✅ AI-powered ad placement`);
  console.log(`   ✅ Automatic optimization`);
  console.log(`   ✅ No manual ad slot management`);
  console.log(`   ✅ Works with existing manual ads`);
  console.log(`   ✅ Mobile responsive`);
  console.log(`   ✅ Revenue maximization`);
  
  console.log(`\n🎯 Auto Ads Benefits:`);
  console.log(`   - Google's machine learning finds optimal positions`);
  console.log(`   - Automatically adapts to content layout`);
  console.log(`   - Tests different ad formats`);
  console.log(`   - Maximizes revenue without code changes`);
  console.log(`   - Can increase revenue by 10-30%`);
  
  console.log(`\n⚙️  AdSense Dashboard Configuration:`);
  console.log(`   1. Go to: https://adsense.google.com`);
  console.log(`   2. Navigate to: Ads → By site`);
  console.log(`   3. Find your site: seoulzen.com`);
  console.log(`   4. Toggle "Auto ads" to ON`);
  console.log(`   5. Choose ad formats:`);
  console.log(`      ✅ In-page ads (recommended)`);
  console.log(`      ✅ Anchor ads (mobile bottom)`);
  console.log(`      ⚠️  Vignette ads (use cautiously - can annoy users)`);
  console.log(`   6. Set ad load: Medium or High`);
  console.log(`   7. Click "Apply to site"`);
  
  console.log(`\n💡 Best Practices:`);
  console.log(`   - Keep existing manual ads (they work together)`);
  console.log(`   - Monitor for 2-4 weeks before adjusting`);
  console.log(`   - Check user experience (bounce rate)`);
  console.log(`   - Adjust ad load if too intrusive`);
  console.log(`   - Compare revenue: Manual vs Auto vs Combined`);
  
  console.log(`\n📈 Expected Results:`);
  console.log(`   Week 1-2: Learning phase (Google AI testing)`);
  console.log(`   Week 3-4: Optimization phase (performance improves)`);
  console.log(`   Month 2+: Stable optimal performance`);
  console.log(`   Revenue increase: +10-30% typically`);
  
  console.log(`\n⚠️  Important:`);
  console.log(`   - Auto Ads MUST be enabled in AdSense dashboard`);
  console.log(`   - Code alone won't activate Auto Ads`);
  console.log(`   - Takes 24-48 hours to fully activate`);
  console.log(`   - Monitor user experience metrics`);
  
  console.log(`\n🚀 Current Status:`);
  console.log(`   Manual ads: 4.0 per article (already optimized)`);
  console.log(`   Auto ads: Now enabled in code`);
  console.log(`   Next step: Enable in AdSense dashboard`);
  console.log(`   Combined potential: 5-7 total ads per page`);
}

enableAutoAds();
