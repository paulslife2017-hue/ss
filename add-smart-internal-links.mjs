import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Smart internal linking map with contextual anchors
const linkMap = {
  // From new trending article to specific guides
  'korean-beauty-treatments-trending-2025.html': {
    links: [
      { keyword: 'Juvelook', url: '/blog/juvelook-treatment-seoul-complete-guide-2025.html', context: 'treatment' },
      { keyword: 'Pico Toning', url: '/blog/korean-beauty-trends-2025.html', context: 'laser' },
      { keyword: 'book your treatment', url: '/blog/korean-beauty-salon-booking-guide-2025.html', context: 'booking' },
      { keyword: 'Gangnam beauty clinics', url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', context: 'clinics' },
      { keyword: 'head spa experience', url: '/blog/gangnam-head-spa-complete-guide-2025.html', context: 'spa' }
    ]
  },
  
  'korean-beauty-treatments-trending-2025-japanese.html': {
    links: [
      { keyword: 'Juvelook', url: '/blog/juvelook-treatment-seoul-guide-2025-japanese.html', context: 'treatment' },
      { keyword: '予約ガイド', url: '/blog/korean-beauty-salon-booking-guide-2025-japanese.html', context: 'booking' },
      { keyword: 'ヘッドスパ', url: '/blog/gangnam-headspa-guide-2025-japanese.html', context: 'spa' }
    ]
  },
  
  // Juvelook guides link to PDRN and booking
  'juvelook-treatment-seoul-complete-guide-2025.html': {
    links: [
      { keyword: 'trending treatments in 2025', url: '/blog/korean-beauty-treatments-trending-2025.html', context: 'trends' },
      { keyword: 'PDRN treatment', url: '/blog/pdrn-treatment-seoul-complete-guide-2025.html', context: 'comparison' },
      { keyword: 'Book Juvelook', url: '/blog/korean-beauty-salon-booking-guide-2025.html', context: 'booking' },
      { keyword: 'Korean skincare', url: '/blog/korean-skincare-routine-complete-guide-2025.html', context: 'skincare' }
    ]
  },
  
  'juvelook-treatment-seoul-guide-2025-japanese.html': {
    links: [
      { keyword: '2025年トレンド', url: '/blog/korean-beauty-treatments-trending-2025-japanese.html', context: 'trends' },
      { keyword: 'PDRN治療', url: '/blog/pdrn-treatment-seoul-guide-2025-japanese.html', context: 'comparison' },
      { keyword: '予約する', url: '/blog/korean-beauty-salon-booking-guide-2025-japanese.html', context: 'booking' }
    ]
  },
  
  // PDRN series interconnected
  'pdrn-treatment-seoul-complete-guide-2025.html': {
    links: [
      { keyword: 'Juvelook skin booster', url: '/blog/juvelook-treatment-seoul-complete-guide-2025.html', context: 'alternative' },
      { keyword: 'PDRN vs Botox', url: '/blog/pdrn-vs-botox-comparison-guide-2025.html', context: 'comparison' },
      { keyword: 'patient reviews', url: '/blog/pdrn-treatment-reviews-real-patients-2025.html', context: 'reviews' },
      { keyword: 'side effects', url: '/blog/pdrn-side-effects-safety-guide-2025.html', context: 'safety' },
      { keyword: 'trending beauty treatments', url: '/blog/korean-beauty-treatments-trending-2025.html', context: 'trends' }
    ]
  },
  
  'pdrn-vs-botox-comparison-guide-2025.html': {
    links: [
      { keyword: 'complete PDRN guide', url: '/blog/pdrn-treatment-seoul-complete-guide-2025.html', context: 'guide' },
      { keyword: 'Juvelook', url: '/blog/juvelook-treatment-seoul-complete-guide-2025.html', context: 'alternative' },
      { keyword: 'book PDRN', url: '/blog/korean-beauty-salon-booking-guide-2025.html', context: 'booking' }
    ]
  },
  
  'pdrn-treatment-reviews-real-patients-2025.html': {
    links: [
      { keyword: 'PDRN treatment guide', url: '/blog/pdrn-treatment-seoul-complete-guide-2025.html', context: 'guide' },
      { keyword: 'PDRN vs Botox', url: '/blog/pdrn-vs-botox-comparison-guide-2025.html', context: 'comparison' },
      { keyword: 'safety concerns', url: '/blog/pdrn-side-effects-safety-guide-2025.html', context: 'safety' }
    ]
  },
  
  'pdrn-side-effects-safety-guide-2025.html': {
    links: [
      { keyword: 'PDRN treatment', url: '/blog/pdrn-treatment-seoul-complete-guide-2025.html', context: 'guide' },
      { keyword: 'patient experiences', url: '/blog/pdrn-treatment-reviews-real-patients-2025.html', context: 'reviews' },
      { keyword: 'book safely', url: '/blog/korean-beauty-salon-booking-guide-2025.html', context: 'booking' }
    ]
  },
  
  // Booking guides link to all treatments
  'korean-beauty-salon-booking-guide-2025.html': {
    links: [
      { keyword: 'trending treatments', url: '/blog/korean-beauty-treatments-trending-2025.html', context: 'trends' },
      { keyword: 'Juvelook', url: '/blog/juvelook-treatment-seoul-complete-guide-2025.html', context: 'treatment' },
      { keyword: 'PDRN', url: '/blog/pdrn-treatment-seoul-complete-guide-2025.html', context: 'treatment' },
      { keyword: 'head spa', url: '/blog/gangnam-head-spa-complete-guide-2025.html', context: 'spa' },
      { keyword: 'beauty clinics', url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', context: 'clinics' }
    ]
  },
  
  // Existing popular articles link to new content
  'gangnam-head-spa-complete-guide-2025.html': {
    links: [
      { keyword: '2025 beauty trends', url: '/blog/korean-beauty-treatments-trending-2025.html', context: 'trends' },
      { keyword: 'booking platform', url: '/blog/korean-beauty-salon-booking-guide-2025.html', context: 'booking' },
      { keyword: 'other beauty services', url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', context: 'services' }
    ]
  },
  
  'ultimate-gangnam-head-spa-guide-2025.html': {
    links: [
      { keyword: 'latest treatments', url: '/blog/korean-beauty-treatments-trending-2025.html', context: 'trends' },
      { keyword: 'reservation guide', url: '/blog/korean-beauty-salon-booking-guide-2025.html', context: 'booking' }
    ]
  },
  
  'korean-skincare-routine-complete-guide-2025.html': {
    links: [
      { keyword: 'professional treatments', url: '/blog/korean-beauty-treatments-trending-2025.html', context: 'treatments' },
      { keyword: 'Juvelook skin booster', url: '/blog/juvelook-treatment-seoul-complete-guide-2025.html', context: 'treatment' },
      { keyword: 'PDRN therapy', url: '/blog/pdrn-treatment-seoul-complete-guide-2025.html', context: 'treatment' },
      { keyword: 'Seoul clinics', url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', context: 'clinics' }
    ]
  },
  
  'seoul-beauty-clinics-comprehensive-guide-2025.html': {
    links: [
      { keyword: 'trending treatments', url: '/blog/korean-beauty-treatments-trending-2025.html', context: 'trends' },
      { keyword: 'Juvelook', url: '/blog/juvelook-treatment-seoul-complete-guide-2025.html', context: 'treatment' },
      { keyword: 'PDRN', url: '/blog/pdrn-treatment-seoul-complete-guide-2025.html', context: 'treatment' },
      { keyword: 'online booking', url: '/blog/korean-beauty-salon-booking-guide-2025.html', context: 'booking' }
    ]
  },
  
  'korean-beauty-trends-2025.html': {
    links: [
      { keyword: 'specific treatments', url: '/blog/korean-beauty-treatments-trending-2025.html', context: 'detailed' },
      { keyword: 'skincare routine', url: '/blog/korean-skincare-routine-complete-guide-2025.html', context: 'skincare' },
      { keyword: 'beauty tourism', url: '/blog/seoul-beauty-tourism-guide-2025.html', context: 'tourism' }
    ]
  },
  
  'seoul-beauty-tourism-guide-2025.html': {
    links: [
      { keyword: 'latest treatments', url: '/blog/korean-beauty-treatments-trending-2025.html', context: 'treatments' },
      { keyword: 'Juvelook', url: '/blog/juvelook-treatment-seoul-complete-guide-2025.html', context: 'treatment' },
      { keyword: 'booking services', url: '/blog/korean-beauty-salon-booking-guide-2025.html', context: 'booking' },
      { keyword: 'head spa', url: '/blog/gangnam-head-spa-complete-guide-2025.html', context: 'spa' }
    ]
  }
};

// Internal link styling
const internalLinkStyles = `
<style>
/* Internal Link Styling */
.internal-link {
  color: #6366f1;
  text-decoration: none;
  border-bottom: 1px solid rgba(99, 102, 241, 0.3);
  transition: all 0.2s ease;
  font-weight: 500;
}
.internal-link:hover {
  color: #4f46e5;
  border-bottom-color: #4f46e5;
  background: rgba(99, 102, 241, 0.05);
  padding: 0 2px;
  margin: 0 -2px;
}
</style>
`;

const blogDir = path.join(__dirname, 'public', 'blog');

console.log('🔗 Starting smart internal linking process...\n');

let totalLinksAdded = 0;
let filesProcessed = 0;

Object.entries(linkMap).forEach(([filename, config]) => {
  const filePath = path.join(blogDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${filename} (file not found)`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let linksAdded = 0;
  
  // Add internal link styles if not present
  if (!content.includes('/* Internal Link Styling */')) {
    content = content.replace('</head>', `${internalLinkStyles}\n</head>`);
  }
  
  // Add links (only if they don't already exist)
  config.links.forEach(link => {
    // Check if link doesn't already exist
    if (content.includes(`href="${link.url}"`)) {
      return; // Skip if link already exists
    }
    
    // Create a regex to find the keyword (case-insensitive, whole word)
    const regex = new RegExp(`\\b(${link.keyword})\\b`, 'i');
    const match = content.match(regex);
    
    if (match) {
      // Replace first occurrence only
      const replacement = `<a href="${link.url}" class="internal-link" title="${link.keyword}">${match[1]}</a>`;
      content = content.replace(regex, replacement);
      linksAdded++;
      totalLinksAdded++;
    }
  });
  
  if (linksAdded > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${filename}: Added ${linksAdded} internal link(s)`);
    filesProcessed++;
  } else {
    console.log(`⏭️  ${filename}: No new links added (may already exist)`);
  }
});

console.log(`\n🎉 Internal linking complete!`);
console.log(`📊 Summary:`);
console.log(`  - Files processed: ${filesProcessed}`);
console.log(`  - Total links added: ${totalLinksAdded}`);
console.log(`\n💡 Benefits:`);
console.log(`  ✓ Improved user navigation between related articles`);
console.log(`  ✓ Better SEO through contextual linking`);
console.log(`  ✓ Increased time on site and page views per session`);
console.log(`  ✓ Enhanced topical authority and relevance signals`);
console.log(`  ✓ Lower bounce rate from better content discovery`);
