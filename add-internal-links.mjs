import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Internal linking configuration
const internalLinks = {
  // New high-value articles (Articles 38-41)
  'korean-beauty-treatments-trending-2025.html': [
    {
      searchText: 'Juvelook is a revolutionary',
      replaceWith: '<a href="/blog/juvelook-treatment-seoul-complete-guide-2025.html" class="internal-link">Juvelook</a> is a revolutionary',
      maxOccurrences: 1
    },
    {
      searchText: 'PDRN facials',
      replaceWith: '<a href="/blog/pdrn-treatment-seoul-complete-guide-2025.html" class="internal-link">PDRN facials</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'Book Your Treatment',
      replaceWith: '<a href="/blog/korean-beauty-salon-booking-guide-2025.html" class="internal-link">Book Your Treatment</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'Gangnam head spa',
      replaceWith: '<a href="/blog/gangnam-head-spa-complete-guide-2025.html" class="internal-link">Gangnam head spa</a>',
      maxOccurrences: 1
    }
  ],
  
  'juvelook-treatment-seoul-complete-guide-2025.html': [
    {
      searchText: 'trending Korean beauty treatments',
      replaceWith: '<a href="/blog/korean-beauty-treatments-trending-2025.html" class="internal-link">trending Korean beauty treatments</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'PDRN treatment',
      replaceWith: '<a href="/blog/pdrn-treatment-seoul-complete-guide-2025.html" class="internal-link">PDRN treatment</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'book your treatment',
      replaceWith: '<a href="/blog/korean-beauty-salon-booking-guide-2025.html" class="internal-link">book your treatment</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'Korean skincare routine',
      replaceWith: '<a href="/blog/korean-skincare-routine-complete-guide-2025.html" class="internal-link">Korean skincare routine</a>',
      maxOccurrences: 1
    }
  ],
  
  // PDRN series (Articles 33-37)
  'pdrn-treatment-seoul-complete-guide-2025.html': [
    {
      searchText: 'Juvelook skin booster',
      replaceWith: '<a href="/blog/juvelook-treatment-seoul-complete-guide-2025.html" class="internal-link">Juvelook skin booster</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'PDRN vs Botox',
      replaceWith: '<a href="/blog/pdrn-vs-botox-comparison-guide-2025.html" class="internal-link">PDRN vs Botox</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'real patient reviews',
      replaceWith: '<a href="/blog/pdrn-treatment-reviews-real-patients-2025.html" class="internal-link">real patient reviews</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'side effects',
      replaceWith: '<a href="/blog/pdrn-side-effects-safety-guide-2025.html" class="internal-link">side effects</a>',
      maxOccurrences: 1
    }
  ],
  
  // Booking guide
  'korean-beauty-salon-booking-guide-2025.html': [
    {
      searchText: 'trending treatments',
      replaceWith: '<a href="/blog/korean-beauty-treatments-trending-2025.html" class="internal-link">trending treatments</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'Juvelook treatment',
      replaceWith: '<a href="/blog/juvelook-treatment-seoul-complete-guide-2025.html" class="internal-link">Juvelook treatment</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'PDRN therapy',
      replaceWith: '<a href="/blog/pdrn-treatment-seoul-complete-guide-2025.html" class="internal-link">PDRN therapy</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'head spa',
      replaceWith: '<a href="/blog/gangnam-head-spa-complete-guide-2025.html" class="internal-link">head spa</a>',
      maxOccurrences: 1
    }
  ],
  
  // Popular existing articles
  'gangnam-head-spa-complete-guide-2025.html': [
    {
      searchText: 'Korean beauty treatments',
      replaceWith: '<a href="/blog/korean-beauty-treatments-trending-2025.html" class="internal-link">Korean beauty treatments</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'booking guide',
      replaceWith: '<a href="/blog/korean-beauty-salon-booking-guide-2025.html" class="internal-link">booking guide</a>',
      maxOccurrences: 1
    }
  ],
  
  'korean-skincare-routine-complete-guide-2025.html': [
    {
      searchText: 'professional treatments',
      replaceWith: '<a href="/blog/korean-beauty-treatments-trending-2025.html" class="internal-link">professional treatments</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'Juvelook',
      replaceWith: '<a href="/blog/juvelook-treatment-seoul-complete-guide-2025.html" class="internal-link">Juvelook</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'Seoul beauty clinics',
      replaceWith: '<a href="/blog/seoul-beauty-clinics-comprehensive-guide-2025.html" class="internal-link">Seoul beauty clinics</a>',
      maxOccurrences: 1
    }
  ],
  
  'seoul-beauty-clinics-comprehensive-guide-2025.html': [
    {
      searchText: '2025 trending treatments',
      replaceWith: '<a href="/blog/korean-beauty-treatments-trending-2025.html" class="internal-link">2025 trending treatments</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'PDRN injections',
      replaceWith: '<a href="/blog/pdrn-treatment-seoul-complete-guide-2025.html" class="internal-link">PDRN injections</a>',
      maxOccurrences: 1
    },
    {
      searchText: 'book appointments',
      replaceWith: '<a href="/blog/korean-beauty-salon-booking-guide-2025.html" class="internal-link">book appointments</a>',
      maxOccurrences: 1
    }
  ]
};

// Add CSS for internal links
const internalLinkCSS = `
<style>
  .internal-link {
    color: #0066cc;
    text-decoration: none;
    border-bottom: 1px solid #0066cc;
    transition: all 0.3s ease;
  }
  .internal-link:hover {
    color: #004499;
    border-bottom-color: #004499;
  }
</style>
`;

const blogDir = path.join(__dirname, 'public', 'blog');

console.log('🔗 Starting internal linking process...\n');

Object.keys(internalLinks).forEach(filename => {
  const filePath = path.join(blogDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${filename} (file not found)`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let linksAdded = 0;
  
  // Add CSS for internal links if not present
  if (!content.includes('.internal-link')) {
    content = content.replace('</head>', `${internalLinkCSS}\n</head>`);
  }
  
  // Apply each link replacement
  internalLinks[filename].forEach(link => {
    const regex = new RegExp(link.searchText, 'gi');
    const matches = content.match(regex);
    
    if (matches && matches.length > 0) {
      // Replace only first occurrence or up to maxOccurrences
      let count = 0;
      content = content.replace(regex, (match) => {
        if (count < link.maxOccurrences) {
          count++;
          linksAdded++;
          return link.replaceWith;
        }
        return match;
      });
    }
  });
  
  if (linksAdded > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${filename}: Added ${linksAdded} internal link(s)`);
  } else {
    console.log(`⏭️  ${filename}: No new links added (may already exist)`);
  }
});

console.log('\n🎉 Internal linking complete!');
console.log('\n📊 Benefits:');
console.log('  - Improved user navigation between related articles');
console.log('  - Better SEO through contextual linking');
console.log('  - Increased time on site and page views');
console.log('  - Enhanced topical authority');
