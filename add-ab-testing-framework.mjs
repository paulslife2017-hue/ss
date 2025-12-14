import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const blogDir = './public/blog';

const abTestingScript = `
<!-- A/B Testing Framework -->
<script>
(function() {
  'use strict';
  
  // A/B Testing Configuration
  const AB_TESTS = {
    'sidebar_position': {
      variants: ['left', 'right'],
      weight: [50, 50] // 50% each
    },
    'cta_color': {
      variants: ['blue', 'purple', 'green'],
      weight: [33, 34, 33]
    },
    'headline_style': {
      variants: ['question', 'statement', 'benefit'],
      weight: [33, 34, 33]
    },
    'image_size': {
      variants: ['large', 'medium', 'small'],
      weight: [40, 40, 20]
    }
  };
  
  // Get or create user variant assignment
  function getVariant(testName) {
    const storageKey = \`ab_test_\${testName}\`;
    let variant = localStorage.getItem(storageKey);
    
    if (!variant) {
      // Assign variant based on weighted distribution
      const test = AB_TESTS[testName];
      const random = Math.random() * 100;
      let cumulative = 0;
      
      for (let i = 0; i < test.variants.length; i++) {
        cumulative += test.weight[i];
        if (random < cumulative) {
          variant = test.variants[i];
          break;
        }
      }
      
      localStorage.setItem(storageKey, variant);
      
      // Track assignment
      if (typeof gtag !== 'undefined') {
        gtag('event', 'ab_test_assignment', {
          test_name: testName,
          variant: variant,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return variant;
  }
  
  // Apply variants
  function applyVariants() {
    // Test 1: Sidebar Position
    const sidebarVariant = getVariant('sidebar_position');
    const sidebar = document.querySelector('.blog-sidebar');
    if (sidebar) {
      sidebar.setAttribute('data-ab-position', sidebarVariant);
      if (sidebarVariant === 'left') {
        sidebar.style.order = '-1';
      }
    }
    
    // Test 2: CTA Color
    const ctaVariant = getVariant('cta_color');
    const ctaButtons = document.querySelectorAll('.cta-button, .book-now-btn');
    ctaButtons.forEach(btn => {
      btn.setAttribute('data-ab-color', ctaVariant);
      const colors = {
        'blue': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'purple': 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
        'green': 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      };
      btn.style.background = colors[ctaVariant];
    });
    
    // Test 3: Headline Style
    const headlineVariant = getVariant('headline_style');
    document.documentElement.setAttribute('data-ab-headline', headlineVariant);
    
    // Test 4: Image Size
    const imageVariant = getVariant('image_size');
    const mainImage = document.querySelector('.hero-image, .featured-image');
    if (mainImage) {
      mainImage.setAttribute('data-ab-size', imageVariant);
      const sizes = {
        'large': '100%',
        'medium': '80%',
        'small': '60%'
      };
      mainImage.style.maxWidth = sizes[imageVariant];
    }
  }
  
  // Track conversions
  function trackConversion(conversionType) {
    const conversions = {};
    
    Object.keys(AB_TESTS).forEach(testName => {
      const variant = getVariant(testName);
      conversions[testName] = variant;
    });
    
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ab_test_conversion', {
        conversion_type: conversionType,
        variants: JSON.stringify(conversions),
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('🎯 A/B Test Conversion:', conversionType, conversions);
  }
  
  // Track all CTA clicks
  function trackCTAClicks() {
    const ctaLinks = document.querySelectorAll('a[href*="kbeautyseoul.co.kr"], .cta-button, .book-now-btn');
    ctaLinks.forEach(link => {
      link.addEventListener('click', function() {
        trackConversion('cta_click');
      });
    });
  }
  
  // Track page engagement
  let engagementTracked = false;
  function trackEngagement() {
    if (!engagementTracked) {
      const scrollDepth = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (scrollDepth > 0.75) {
        trackConversion('page_engagement_75');
        engagementTracked = true;
      }
    }
  }
  
  // Track time on page
  let startTime = Date.now();
  window.addEventListener('beforeunload', function() {
    const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
    if (timeOnPage > 60) { // More than 1 minute
      trackConversion('time_on_page_60s');
    }
  });
  
  // Initialize
  document.addEventListener('DOMContentLoaded', function() {
    applyVariants();
    trackCTAClicks();
    window.addEventListener('scroll', trackEngagement);
    
    console.log('✅ A/B Testing Framework initialized');
    console.log('🧪 Active tests:', Object.keys(AB_TESTS));
  });
  
  // Expose for debugging
  window.ABTesting = {
    getVariant: getVariant,
    trackConversion: trackConversion,
    tests: AB_TESTS
  };
})();
</script>

<!-- A/B Testing Dashboard (Admin Only - Remove in production) -->
<script>
// Quick A/B test results viewer (console command)
window.viewABTestResults = function() {
  const results = {};
  Object.keys(window.ABTesting.tests).forEach(test => {
    results[test] = localStorage.getItem(\`ab_test_\${test}\`);
  });
  console.table(results);
};
console.log('💡 View your A/B test assignments: window.viewABTestResults()');
</script>
`;

function addABTestingFramework() {
  const files = readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'undefined.html');
  let processedCount = 0;
  
  for (const filename of files) {
    const filepath = join(blogDir, filename);
    
    try {
      let content = readFileSync(filepath, 'utf-8');
      
      // Skip if already has A/B testing
      if (content.includes('A/B Testing Framework')) {
        console.log(`⏭️  Skipped (already has A/B testing): ${filename}`);
        continue;
      }
      
      // Insert before closing </body> tag
      const bodyCloseIndex = content.lastIndexOf('</body>');
      if (bodyCloseIndex !== -1) {
        content = content.slice(0, bodyCloseIndex) + abTestingScript + content.slice(bodyCloseIndex);
        writeFileSync(filepath, content, 'utf-8');
        processedCount++;
        console.log(`✅ Added A/B testing to: ${filename}`);
      }
      
    } catch (error) {
      console.log(`⚠️  Error processing ${filename}:`, error.message);
    }
  }
  
  console.log(`\n✨ A/B Testing Framework Summary:`);
  console.log(`   ${processedCount} files processed`);
  console.log(`\n🧪 Active Tests:`);
  console.log(`   1. Sidebar Position (Left vs Right)`);
  console.log(`   2. CTA Button Color (Blue vs Purple vs Green)`);
  console.log(`   3. Headline Style (Question vs Statement vs Benefit)`);
  console.log(`   4. Image Size (Large vs Medium vs Small)`);
  console.log(`\n📊 Conversion Tracking:`);
  console.log(`   - CTA Clicks`);
  console.log(`   - Page Engagement (75% scroll)`);
  console.log(`   - Time on Page (60+ seconds)`);
  console.log(`\n🎯 Google Analytics Integration:`);
  console.log(`   - Event: ab_test_assignment`);
  console.log(`   - Event: ab_test_conversion`);
  console.log(`\n💡 View Results:`);
  console.log(`   - Browser console: window.viewABTestResults()`);
  console.log(`   - Google Analytics 4: Events > ab_test_*`);
}

addABTestingFramework();
