import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Related articles configuration for each blog post
const relatedArticlesMap = {
  // Trending treatments hub
  'korean-beauty-treatments-trending-2025.html': {
    title: 'Explore More Korean Beauty Guides',
    articles: [
      {
        title: 'Juvelook Treatment Seoul 2025: Complete Guide',
        url: '/blog/juvelook-treatment-seoul-complete-guide-2025.html',
        description: 'Everything about Juvelook HA skin booster in Seoul',
        badge: 'NEW'
      },
      {
        title: 'PDRN Treatment Seoul: Complete Guide',
        url: '/blog/pdrn-treatment-seoul-complete-guide-2025.html',
        description: 'Salmon DNA therapy guide with prices and clinics',
        badge: 'POPULAR'
      },
      {
        title: 'Korean Beauty Salon Booking Guide',
        url: '/blog/korean-beauty-salon-booking-guide-2025.html',
        description: 'How to book your Korean beauty treatments',
        badge: null
      },
      {
        title: 'Gangnam Head Spa Complete Guide',
        url: '/blog/gangnam-head-spa-complete-guide-2025.html',
        description: 'Best head spa services in Gangnam',
        badge: null
      }
    ]
  },
  
  // Head Spa articles
  'gangnam-head-spa-complete-guide-2025.html': {
    title: 'Related Beauty Services',
    articles: [
      {
        title: 'Korean Beauty Treatments 2025',
        url: '/blog/korean-beauty-treatments-trending-2025.html',
        description: 'Top 10 trending treatments in Seoul',
        badge: 'TRENDING'
      },
      {
        title: 'Gangnam Massage Guide',
        url: '/blog/gangnam-massage-guide-2025.html',
        description: 'Best massage services in Gangnam',
        badge: null
      },
      {
        title: 'Korean Spa & Jjimjilbang Guide',
        url: '/blog/korean-spa-jjimjilbang-guide-2025.html',
        description: 'Traditional Korean spa experience',
        badge: null
      }
    ]
  },
  
  'ultimate-gangnam-head-spa-guide-2025.html': {
    title: 'More Gangnam Beauty Guides',
    articles: [
      {
        title: 'Gangnam Head Spa Complete Guide',
        url: '/blog/gangnam-head-spa-complete-guide-2025.html',
        description: 'Comprehensive guide to head spa services',
        badge: null
      },
      {
        title: 'Korean Beauty Treatments 2025',
        url: '/blog/korean-beauty-treatments-trending-2025.html',
        description: 'Latest trending treatments',
        badge: 'NEW'
      },
      {
        title: 'Seoul Beauty Clinics Guide',
        url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html',
        description: 'Top beauty clinics in Seoul',
        badge: null
      }
    ]
  },
  
  // Skincare articles
  'korean-skincare-routine-complete-guide-2025.html': {
    title: 'Related Skincare & Beauty Guides',
    articles: [
      {
        title: 'Best Seoul Skincare Brands 2024',
        url: '/blog/best-seoul-skincare-brands-2024.html',
        description: 'Top Korean skincare brands',
        badge: null
      },
      {
        title: 'Korean Skincare for Beginners',
        url: '/blog/korean-skincare-routine-beginners-2025.html',
        description: 'Start your K-beauty journey',
        badge: 'BEGINNER'
      },
      {
        title: 'Korean Beauty Treatments 2025',
        url: '/blog/korean-beauty-treatments-trending-2025.html',
        description: 'Professional treatments to try',
        badge: 'TRENDING'
      }
    ]
  },
  
  'best-seoul-skincare-brands-2024.html': {
    title: 'Complete Your Skincare Journey',
    articles: [
      {
        title: 'Korean Skincare Routine Guide',
        url: '/blog/korean-skincare-routine-complete-guide-2025.html',
        description: 'Build your perfect routine',
        badge: null
      },
      {
        title: 'Seoul Beauty Clinics Guide',
        url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html',
        description: 'Professional beauty treatments',
        badge: null
      },
      {
        title: 'Korean Beauty Trends 2025',
        url: '/blog/korean-beauty-trends-2025.html',
        description: 'Latest K-beauty trends',
        badge: null
      }
    ]
  },
  
  // Beauty services
  'seoul-beauty-clinics-comprehensive-guide-2025.html': {
    title: 'Explore More Beauty Treatments',
    articles: [
      {
        title: 'Korean Beauty Treatments 2025',
        url: '/blog/korean-beauty-treatments-trending-2025.html',
        description: 'Top 10 trending treatments',
        badge: 'POPULAR'
      },
      {
        title: 'Top 5 Korean Beauty Services',
        url: '/blog/top-5-korean-beauty-services-worth-trying-2025.html',
        description: 'Must-try beauty services',
        badge: null
      },
      {
        title: 'Seoul Beauty Tourism Guide',
        url: '/blog/seoul-beauty-tourism-guide-2025.html',
        description: 'Plan your beauty trip',
        badge: null
      }
    ]
  },
  
  'top-5-korean-beauty-services-worth-trying-2025.html': {
    title: 'Discover More Beauty Services',
    articles: [
      {
        title: 'Seoul Lip Tattoo Guide',
        url: '/blog/seoul-lip-tattoo-guide-2025.html',
        description: 'Semi-permanent lip color',
        badge: null
      },
      {
        title: 'Seoul BB Glow Treatment',
        url: '/blog/seoul-bb-glow-treatment-2025.html',
        description: 'Skin tint treatment guide',
        badge: null
      },
      {
        title: 'Seoul Beauty Clinics Guide',
        url: '/blog/seoul-beauty-clinics-comprehensive-guide-2025.html',
        description: 'Top clinics in Seoul',
        badge: null
      }
    ]
  },
  
  // Tourism
  'seoul-beauty-tourism-guide-2025.html': {
    title: 'Plan Your Beauty Trip',
    articles: [
      {
        title: 'Korean Beauty Treatments 2025',
        url: '/blog/korean-beauty-treatments-trending-2025.html',
        description: 'Latest treatments to try',
        badge: 'TRENDING'
      },
      {
        title: 'Gangnam Head Spa Guide',
        url: '/blog/gangnam-head-spa-complete-guide-2025.html',
        description: 'Relaxing spa experience',
        badge: null
      },
      {
        title: 'Top 5 Korean Beauty Services',
        url: '/blog/top-5-korean-beauty-services-worth-trying-2025.html',
        description: 'Must-try services',
        badge: 'POPULAR'
      }
    ]
  },
  
  // Trends
  'korean-beauty-trends-2025.html': {
    title: 'Explore Trending Treatments',
    articles: [
      {
        title: 'Korean Beauty Treatments 2025',
        url: '/blog/korean-beauty-treatments-trending-2025.html',
        description: 'Detailed treatment guides',
        badge: 'NEW'
      },
      {
        title: 'Korean Skincare Routine',
        url: '/blog/korean-skincare-routine-complete-guide-2025.html',
        description: 'Build your routine',
        badge: null
      },
      {
        title: 'Seoul Beauty Tourism',
        url: '/blog/seoul-beauty-tourism-guide-2025.html',
        description: 'Beauty travel guide',
        badge: null
      }
    ]
  }
};

// Related articles HTML template
const relatedArticlesTemplate = (config) => `
<!-- Related Articles Section -->
<section class="related-articles" style="margin: 60px 0; padding: 40px 0; background: linear-gradient(135deg, #f8f9ff 0%, #fff5f7 100%); border-radius: 16px;">
  <div class="container" style="max-width: 1280px; margin: 0 auto; padding: 0 24px;">
    <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 32px; text-align: center; color: #1a1a1a;">
      ${config.title}
    </h2>
    <div class="related-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
      ${config.articles.map(article => `
        <a href="${article.url}" class="related-card" style="
          display: block;
          background: white;
          padding: 24px;
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          position: relative;
          overflow: hidden;
        ">
          ${article.badge ? `
          <span class="badge" style="
            position: absolute;
            top: 12px;
            right: 12px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
          ">${article.badge}</span>
          ` : ''}
          <h3 style="
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: 8px;
            color: #1a1a1a;
            line-height: 1.4;
          ">${article.title}</h3>
          <p style="
            font-size: 0.9375rem;
            color: #666;
            line-height: 1.6;
            margin: 0;
          ">${article.description}</p>
        </a>
      `).join('')}
    </div>
  </div>
</section>

<style>
.related-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.15) !important;
}
.related-card:hover h3 {
  color: #6366f1;
}
</style>
`;

const blogDir = path.join(__dirname, 'public', 'blog');

console.log('📚 Adding Related Articles sections...\n');

let sectionsAdded = 0;
let filesProcessed = 0;

Object.entries(relatedArticlesMap).forEach(([filename, config]) => {
  const filePath = path.join(blogDir, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skipping ${filename} (file not found)`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if related articles section already exists
  if (content.includes('<!-- Related Articles Section -->')) {
    console.log(`⏭️  ${filename}: Related articles already exist`);
    return;
  }
  
  // Insert before footer or end of main content
  const relatedHTML = relatedArticlesTemplate(config);
  
  // Try to insert before footer
  if (content.includes('</main>')) {
    content = content.replace('</main>', `${relatedHTML}\n</main>`);
  } else if (content.includes('</body>')) {
    content = content.replace('</body>', `${relatedHTML}\n</body>`);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${filename}: Added related articles section`);
  sectionsAdded++;
  filesProcessed++;
});

console.log(`\n🎉 Related Articles sections added!`);
console.log(`\n📊 Summary:`);
console.log(`  - Files processed: ${filesProcessed}`);
console.log(`  - Sections added: ${sectionsAdded}`);
console.log(`\n💡 Benefits:`);
console.log(`  ✓ Visual content discovery at article end`);
console.log(`  ✓ Increased pages per session`);
console.log(`  ✓ Reduced bounce rate`);
console.log(`  ✓ Better user engagement`);
console.log(`  ✓ Trending/Popular/New badges guide users`);
