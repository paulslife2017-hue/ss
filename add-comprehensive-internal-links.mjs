import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive internal linking map for ALL existing articles
const comprehensiveLinkMap = {
  // Head Spa articles
  'gangnam-head-spa-complete-guide-2025.html': {
    links: [
      { pattern: /\bbeauty treatments\b/i, url: '/blog/korean-beauty-trends-2025.html', text: 'beauty treatments', limit: 1 },
      { pattern: /\bbeauty tourism\b/i, url: '/blog/seoul-beauty-tourism-guide-2025.html', text: 'beauty tourism', limit: 1 },
      { pattern: /\bSeoul clinics\b/i, url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', text: 'Seoul clinics', limit: 1 },
      { pattern: /\bskincare routine\b/i, url: '/blog/korean-skincare-routine-complete-guide-2025.html', text: 'skincare routine', limit: 1 }
    ]
  },
  
  'ultimate-gangnam-head-spa-guide-2025.html': {
    links: [
      { pattern: /\bbeauty trends\b/i, url: '/blog/korean-beauty-trends-2025.html', text: 'beauty trends', limit: 1 },
      { pattern: /\bmassage services\b/i, url: '/blog/gangnam-massage-guide-2025.html', text: 'massage services', limit: 1 },
      { pattern: /\bscalp care\b/i, url: '/blog/gangnam-scalp-care-guide-2025.html', text: 'scalp care', limit: 1 }
    ]
  },
  
  'gangnam-massage-guide-2025.html': {
    links: [
      { pattern: /\bhead spa\b/i, url: '/blog/gangnam-head-spa-complete-guide-2025.html', text: 'head spa', limit: 1 },
      { pattern: /\bspa experience\b/i, url: '/blog/korean-spa-jjimjilbang-guide-2025.html', text: 'spa experience', limit: 1 },
      { pattern: /\bbeauty tourism\b/i, url: '/blog/seoul-beauty-tourism-guide-2025.html', text: 'beauty tourism', limit: 1 }
    ]
  },
  
  'gangnam-scalp-care-guide-2025.html': {
    links: [
      { pattern: /\bhead spa\b/i, url: '/blog/gangnam-head-spa-complete-guide-2025.html', text: 'head spa', limit: 1 },
      { pattern: /\bskincare products\b/i, url: '/blog/best-seoul-skincare-brands-2024.html', text: 'skincare products', limit: 1 },
      { pattern: /\bbeauty services\b/i, url: '/blog/top-5-korean-beauty-services-worth-trying-2025.html', text: 'beauty services', limit: 1 }
    ]
  },
  
  // Skincare articles
  'korean-skincare-routine-complete-guide-2025.html': {
    links: [
      { pattern: /\bbeauty clinics\b/i, url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', text: 'beauty clinics', limit: 1 },
      { pattern: /\bskincare brands\b/i, url: '/blog/best-seoul-skincare-brands-2024.html', text: 'skincare brands', limit: 1 },
      { pattern: /\bbeauty trends\b/i, url: '/blog/korean-beauty-trends-2025.html', text: 'beauty trends', limit: 1 },
      { pattern: /\bbeginners guide\b/i, url: '/blog/korean-skincare-routine-beginners-2025.html', text: 'beginners guide', limit: 1 }
    ]
  },
  
  'seoul-skincare-routine-ultimate-guide.html': {
    links: [
      { pattern: /\bKorean skincare\b/i, url: '/blog/korean-skincare-routine-complete-guide-2025.html', text: 'Korean skincare', limit: 1 },
      { pattern: /\bskincare brands\b/i, url: '/blog/best-seoul-skincare-brands-2024.html', text: 'skincare brands', limit: 1 },
      { pattern: /\bbeauty treatments\b/i, url: '/blog/top-5-korean-beauty-services-worth-trying-2025.html', text: 'beauty treatments', limit: 1 }
    ]
  },
  
  'korean-skincare-routine-beginners-2025.html': {
    links: [
      { pattern: /\bcomplete guide\b/i, url: '/blog/korean-skincare-routine-complete-guide-2025.html', text: 'complete guide', limit: 1 },
      { pattern: /\bbeauty trends\b/i, url: '/blog/korean-beauty-trends-2025.html', text: 'beauty trends', limit: 1 },
      { pattern: /\bSeoul brands\b/i, url: '/blog/best-seoul-skincare-brands-2024.html', text: 'Seoul brands', limit: 1 }
    ]
  },
  
  'best-seoul-skincare-brands-2024.html': {
    links: [
      { pattern: /\bskincare routine\b/i, url: '/blog/korean-skincare-routine-complete-guide-2025.html', text: 'skincare routine', limit: 1 },
      { pattern: /\bbeauty clinics\b/i, url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', text: 'beauty clinics', limit: 1 },
      { pattern: /\bbeauty trends\b/i, url: '/blog/korean-beauty-trends-2025.html', text: 'beauty trends', limit: 1 }
    ]
  },
  
  // Beauty services
  'seoul-beauty-clinics-comprehensive-guide-2025.html': {
    links: [
      { pattern: /\bhead spa\b/i, url: '/blog/gangnam-head-spa-complete-guide-2025.html', text: 'head spa', limit: 1 },
      { pattern: /\bskincare routine\b/i, url: '/blog/korean-skincare-routine-complete-guide-2025.html', text: 'skincare routine', limit: 1 },
      { pattern: /\bbeauty trends\b/i, url: '/blog/korean-beauty-trends-2025.html', text: 'beauty trends', limit: 1 },
      { pattern: /\bbeauty tourism\b/i, url: '/blog/seoul-beauty-tourism-guide-2025.html', text: 'beauty tourism', limit: 1 }
    ]
  },
  
  'top-5-korean-beauty-services-worth-trying-2025.html': {
    links: [
      { pattern: /\bhead spa\b/i, url: '/blog/gangnam-head-spa-complete-guide-2025.html', text: 'head spa', limit: 1 },
      { pattern: /\blip tattoo\b/i, url: '/blog/seoul-lip-tattoo-guide-2025.html', text: 'lip tattoo', limit: 1 },
      { pattern: /\bBB Glow\b/i, url: '/blog/seoul-bb-glow-treatment-2025.html', text: 'BB Glow', limit: 1 },
      { pattern: /\bbeauty clinics\b/i, url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', text: 'beauty clinics', limit: 1 }
    ]
  },
  
  'seoul-lip-tattoo-guide-2025.html': {
    links: [
      { pattern: /\bbeauty services\b/i, url: '/blog/top-5-korean-beauty-services-worth-trying-2025.html', text: 'beauty services', limit: 1 },
      { pattern: /\bBB Glow\b/i, url: '/blog/seoul-bb-glow-treatment-2025.html', text: 'BB Glow', limit: 1 },
      { pattern: /\bbeauty clinics\b/i, url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', text: 'beauty clinics', limit: 1 }
    ]
  },
  
  'seoul-bb-glow-treatment-2025.html': {
    links: [
      { pattern: /\blip tattoo\b/i, url: '/blog/seoul-lip-tattoo-guide-2025.html', text: 'lip tattoo', limit: 1 },
      { pattern: /\bbeauty services\b/i, url: '/blog/top-5-korean-beauty-services-worth-trying-2025.html', text: 'beauty services', limit: 1 },
      { pattern: /\bskincare routine\b/i, url: '/blog/korean-skincare-routine-complete-guide-2025.html', text: 'skincare routine', limit: 1 }
    ]
  },
  
  'seoul-nail-art-guide-2025.html': {
    links: [
      { pattern: /\bbeauty services\b/i, url: '/blog/top-5-korean-beauty-services-worth-trying-2025.html', text: 'beauty services', limit: 1 },
      { pattern: /\bbeauty tourism\b/i, url: '/blog/seoul-beauty-tourism-guide-2025.html', text: 'beauty tourism', limit: 1 },
      { pattern: /\bbeauty clinics\b/i, url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', text: 'beauty clinics', limit: 1 }
    ]
  },
  
  // Spa & Tourism
  'korean-spa-jjimjilbang-guide-2025.html': {
    links: [
      { pattern: /\bhead spa\b/i, url: '/blog/gangnam-head-spa-complete-guide-2025.html', text: 'head spa', limit: 1 },
      { pattern: /\bmassage\b/i, url: '/blog/gangnam-massage-guide-2025.html', text: 'massage', limit: 1 },
      { pattern: /\bbeauty tourism\b/i, url: '/blog/seoul-beauty-tourism-guide-2025.html', text: 'beauty tourism', limit: 1 }
    ]
  },
  
  'seoul-beauty-tourism-guide-2025.html': {
    links: [
      { pattern: /\bhead spa\b/i, url: '/blog/gangnam-head-spa-complete-guide-2025.html', text: 'head spa', limit: 1 },
      { pattern: /\bbeauty clinics\b/i, url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', text: 'beauty clinics', limit: 1 },
      { pattern: /\bbeauty services\b/i, url: '/blog/top-5-korean-beauty-services-worth-trying-2025.html', text: 'beauty services', limit: 1 },
      { pattern: /\bspa experience\b/i, url: '/blog/korean-spa-jjimjilbang-guide-2025.html', text: 'spa experience', limit: 1 }
    ]
  },
  
  'my-gangnam-beauty-treatment-experience-2025.html': {
    links: [
      { pattern: /\bhead spa\b/i, url: '/blog/gangnam-head-spa-complete-guide-2025.html', text: 'head spa', limit: 1 },
      { pattern: /\bbeauty tourism\b/i, url: '/blog/seoul-beauty-tourism-guide-2025.html', text: 'beauty tourism', limit: 1 },
      { pattern: /\bbeauty clinics\b/i, url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', text: 'beauty clinics', limit: 1 }
    ]
  },
  
  // Trends
  'korean-beauty-trends-2025.html': {
    links: [
      { pattern: /\bskincare routine\b/i, url: '/blog/korean-skincare-routine-complete-guide-2025.html', text: 'skincare routine', limit: 1 },
      { pattern: /\bbeauty clinics\b/i, url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html', text: 'beauty clinics', limit: 1 },
      { pattern: /\bbeauty tourism\b/i, url: '/blog/seoul-beauty-tourism-guide-2025.html', text: 'beauty tourism', limit: 1 },
      { pattern: /\bbeauty services\b/i, url: '/blog/top-5-korean-beauty-services-worth-trying-2025.html', text: 'beauty services', limit: 1 }
    ]
  },
  
  // Japanese articles
  'gangnam-headspa-guide-2025-japanese.html': {
    links: [
      { pattern: /美容観光/i, url: '/blog/korean-beauty-tour-complete-guide-2025-japanese.html', text: '美容観光', limit: 1 },
      { pattern: /スパランキング/i, url: '/blog/seoul-spa-ranking-2025-japanese.html', text: 'スパランキング', limit: 1 }
    ]
  },
  
  'seoul-skincare-routine-japanese.html': {
    links: [
      { pattern: /スキンケアトレンド/i, url: '/blog/korean-skincare-trend-2025-japanese.html', text: 'スキンケアトレンド', limit: 1 },
      { pattern: /美容ツアー/i, url: '/blog/korean-beauty-tour-complete-guide-2025-japanese.html', text: '美容ツアー', limit: 1 }
    ]
  },
  
  'korean-beauty-tour-complete-guide-2025-japanese.html': {
    links: [
      { pattern: /ヘッドスパ/i, url: '/blog/gangnam-headspa-guide-2025-japanese.html', text: 'ヘッドスパ', limit: 1 },
      { pattern: /スパランキング/i, url: '/blog/seoul-spa-ranking-2025-japanese.html', text: 'スパランキング', limit: 1 },
      { pattern: /スキンケア/i, url: '/blog/seoul-skincare-routine-japanese.html', text: 'スキンケア', limit: 1 }
    ]
  },
  
  'seoul-spa-ranking-2025-japanese.html': {
    links: [
      { pattern: /ヘッドスパ/i, url: '/blog/gangnam-headspa-guide-2025-japanese.html', text: 'ヘッドスパ', limit: 1 },
      { pattern: /美容ツアー/i, url: '/blog/korean-beauty-tour-complete-guide-2025-japanese.html', text: '美容ツアー', limit: 1 }
    ]
  },
  
  'korean-skincare-trend-2025-japanese.html': {
    links: [
      { pattern: /スキンケアルーティン/i, url: '/blog/seoul-skincare-routine-japanese.html', text: 'スキンケアルーティン', limit: 1 },
      { pattern: /美容ツアー/i, url: '/blog/korean-beauty-tour-complete-guide-2025-japanese.html', text: '美容ツアー', limit: 1 }
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

console.log('🔗 Starting comprehensive internal linking...\n');

let totalLinksAdded = 0;
let filesProcessed = 0;

Object.entries(comprehensiveLinkMap).forEach(([filename, config]) => {
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
  
  // Process each link
  config.links.forEach(link => {
    // Check if this specific link doesn't already exist
    if (content.includes(`href="${link.url}"`)) {
      return; // Skip if this URL already exists in the document
    }
    
    const match = content.match(link.pattern);
    
    if (match) {
      const matchedText = match[0];
      const replacement = `<a href="${link.url}" class="internal-link" title="${link.text}">${matchedText}</a>`;
      
      // Replace first occurrence only
      content = content.replace(link.pattern, replacement);
      linksAdded++;
      totalLinksAdded++;
    }
  });
  
  if (linksAdded > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${filename}: Added ${linksAdded} internal link(s)`);
    filesProcessed++;
  } else {
    console.log(`⏭️  ${filename}: No new links added`);
  }
});

console.log(`\n🎉 Comprehensive internal linking complete!`);
console.log(`\n📊 Summary:`);
console.log(`  - Files processed: ${filesProcessed}`);
console.log(`  - Total links added: ${totalLinksAdded}`);
console.log(`\n💡 SEO Benefits:`);
console.log(`  ✓ Improved crawlability and indexation`);
console.log(`  ✓ Better distribution of link equity (PageRank)`);
console.log(`  ✓ Enhanced user navigation and content discovery`);
console.log(`  ✓ Increased average pages per session`);
console.log(`  ✓ Stronger topical clustering and relevance`);
console.log(`  ✓ Reduced bounce rate through related content`);
