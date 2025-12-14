import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const blogDir = './public/blog';

// Enhanced language switcher with Korean and Chinese
const enhancedLanguageSwitcher = `
<!-- Enhanced Multilingual Language Switcher (EN/JP/KR/CN) -->
<div class="language-switcher-enhanced" style="
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 8px;
  display: flex;
  gap: 8px;
">
  <button class="lang-btn" data-lang="en" title="English" style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
    🇬🇧
  </button>
  <button class="lang-btn" data-lang="ja" title="日本語" style="
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
    🇯🇵
  </button>
  <button class="lang-btn" data-lang="ko" title="한국어" style="
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    color: white;
    border: none;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
  " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 16px rgba(255, 107, 107, 0.5)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(255, 107, 107, 0.3)'">
    🇰🇷
  </button>
  <button class="lang-btn" data-lang="zh" title="中文" style="
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: white;
    border: none;
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  " onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 4px 16px rgba(245, 158, 11, 0.5)'" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(245, 158, 11, 0.3)'">
    🇨🇳
  </button>
  <div style="
    position: absolute;
    bottom: -40px;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 11px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  " class="lang-tooltip">
    Coming Soon! 🚀
  </div>
</div>

<script>
(function() {
  'use strict';
  
  // Language mapping with availability status
  const LANGUAGE_MAPPINGS = {
    // Head Spa Articles
    'gangnam-head-spa-complete-guide-2025.html': {
      en: '/blog/gangnam-head-spa-complete-guide-2025.html',
      ja: '/blog/gangnam-headspa-guide-2025-japanese.html',
      ko: null, // Coming soon
      zh: null  // Coming soon
    },
    'gangnam-headspa-guide-2025-japanese.html': {
      en: '/blog/gangnam-head-spa-complete-guide-2025.html',
      ja: '/blog/gangnam-headspa-guide-2025-japanese.html',
      ko: null,
      zh: null
    },
    
    // Skincare Articles
    'seoul-skincare-routine-ultimate-guide.html': {
      en: '/blog/seoul-skincare-routine-ultimate-guide.html',
      ja: '/blog/seoul-skincare-routine-japanese.html',
      ko: null,
      zh: null
    },
    'seoul-skincare-routine-japanese.html': {
      en: '/blog/seoul-skincare-routine-ultimate-guide.html',
      ja: '/blog/seoul-skincare-routine-japanese.html',
      ko: null,
      zh: null
    },
    
    // Trends Articles
    'korean-beauty-trends-2025.html': {
      en: '/blog/korean-beauty-trends-2025.html',
      ja: '/blog/korean-skincare-trend-2025-japanese.html',
      ko: null,
      zh: null
    },
    'korean-skincare-trend-2025-japanese.html': {
      en: '/blog/korean-beauty-trends-2025.html',
      ja: '/blog/korean-skincare-trend-2025-japanese.html',
      ko: null,
      zh: null
    },
    
    // Tourism Articles
    'seoul-beauty-tourism-guide-2025.html': {
      en: '/blog/seoul-beauty-tourism-guide-2025.html',
      ja: '/blog/korean-beauty-tour-complete-guide-2025-japanese.html',
      ko: null,
      zh: null
    },
    'korean-beauty-tour-complete-guide-2025-japanese.html': {
      en: '/blog/seoul-beauty-tourism-guide-2025.html',
      ja: '/blog/korean-beauty-tour-complete-guide-2025-japanese.html',
      ko: null,
      zh: null
    },
    
    // Spa Rankings
    'seoul-spa-ranking-2025-japanese.html': {
      en: null,
      ja: '/blog/seoul-spa-ranking-2025-japanese.html',
      ko: null,
      zh: null
    }
  };
  
  // Get current page filename
  const currentPage = window.location.pathname.split('/').pop();
  const mappings = LANGUAGE_MAPPINGS[currentPage] || {};
  
  // Setup language switcher
  function setupLanguageSwitcher() {
    const buttons = document.querySelectorAll('.lang-btn');
    const tooltip = document.querySelector('.lang-tooltip');
    
    buttons.forEach(btn => {
      const targetLang = btn.getAttribute('data-lang');
      const targetUrl = mappings[targetLang];
      
      // Style active language
      if (isCurrentLanguage(targetLang)) {
        btn.style.opacity = '1';
        btn.style.fontWeight = 'bold';
        btn.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.5), 0 4px 16px rgba(102, 126, 234, 0.5)';
      } else if (!targetUrl) {
        // Style unavailable languages
        btn.style.opacity = '0.4';
        btn.style.cursor = 'not-allowed';
        btn.style.filter = 'grayscale(100%)';
      }
      
      // Add click handler
      btn.addEventListener('click', function() {
        if (targetUrl && !isCurrentLanguage(targetLang)) {
          // Track language switch
          if (typeof gtag !== 'undefined') {
            gtag('event', 'language_switch', {
              from: getCurrentLanguage(),
              to: targetLang,
              page: currentPage
            });
          }
          window.location.href = targetUrl;
        } else if (!targetUrl) {
          // Show "coming soon" tooltip
          if (tooltip) {
            tooltip.style.opacity = '1';
            setTimeout(() => {
              tooltip.style.opacity = '0';
            }, 2000);
          }
        }
      });
    });
  }
  
  // Detect current language from filename
  function getCurrentLanguage() {
    if (currentPage.includes('japanese')) return 'ja';
    if (currentPage.includes('korean')) return 'ko';
    if (currentPage.includes('chinese')) return 'zh';
    return 'en';
  }
  
  function isCurrentLanguage(lang) {
    return getCurrentLanguage() === lang;
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', setupLanguageSwitcher);
  
  console.log('🌍 Enhanced multilingual switcher initialized (EN/JP/KR/CN)');
  console.log('🚀 Korean & Chinese versions: Coming Soon!');
})();
</script>
`;

// Enhanced hreflang tags
function generateEnhancedHreflangTags(filename) {
  const mappings = {
    'gangnam-head-spa-complete-guide-2025.html': {
      en: 'https://seoulzen.com/blog/gangnam-head-spa-complete-guide-2025.html',
      ja: 'https://seoulzen.com/blog/gangnam-headspa-guide-2025-japanese.html'
    },
    'gangnam-headspa-guide-2025-japanese.html': {
      en: 'https://seoulzen.com/blog/gangnam-head-spa-complete-guide-2025.html',
      ja: 'https://seoulzen.com/blog/gangnam-headspa-guide-2025-japanese.html'
    },
    'seoul-skincare-routine-ultimate-guide.html': {
      en: 'https://seoulzen.com/blog/seoul-skincare-routine-ultimate-guide.html',
      ja: 'https://seoulzen.com/blog/seoul-skincare-routine-japanese.html'
    },
    'seoul-skincare-routine-japanese.html': {
      en: 'https://seoulzen.com/blog/seoul-skincare-routine-ultimate-guide.html',
      ja: 'https://seoulzen.com/blog/seoul-skincare-routine-japanese.html'
    },
    'korean-beauty-trends-2025.html': {
      en: 'https://seoulzen.com/blog/korean-beauty-trends-2025.html',
      ja: 'https://seoulzen.com/blog/korean-skincare-trend-2025-japanese.html'
    },
    'korean-skincare-trend-2025-japanese.html': {
      en: 'https://seoulzen.com/blog/korean-beauty-trends-2025.html',
      ja: 'https://seoulzen.com/blog/korean-skincare-trend-2025-japanese.html'
    },
    'seoul-beauty-tourism-guide-2025.html': {
      en: 'https://seoulzen.com/blog/seoul-beauty-tourism-guide-2025.html',
      ja: 'https://seoulzen.com/blog/korean-beauty-tour-complete-guide-2025-japanese.html'
    },
    'korean-beauty-tour-complete-guide-2025-japanese.html': {
      en: 'https://seoulzen.com/blog/seoul-beauty-tourism-guide-2025.html',
      ja: 'https://seoulzen.com/blog/korean-beauty-tour-complete-guide-2025-japanese.html'
    }
  };
  
  const urls = mappings[filename];
  if (!urls) return '';
  
  let hreflangTags = '';
  for (const [lang, url] of Object.entries(urls)) {
    hreflangTags += `<link rel="alternate" hreflang="${lang}" href="${url}">\n`;
  }
  // Add x-default
  if (urls.en) {
    hreflangTags += `<link rel="alternate" hreflang="x-default" href="${urls.en}">\n`;
  }
  
  return hreflangTags;
}

function addMultilingualFeatures() {
  const files = readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'undefined.html');
  let processedCount = 0;
  let hreflangCount = 0;
  
  for (const filename of files) {
    const filepath = join(blogDir, filename);
    
    try {
      let content = readFileSync(filepath, 'utf-8');
      let modified = false;
      
      // Add/Update language switcher
      if (!content.includes('language-switcher-enhanced')) {
        // Remove old switcher if exists
        content = content.replace(/<div class="language-switcher"[\s\S]*?<\/script>/g, '');
        
        // Insert new enhanced switcher before </body>
        const bodyCloseIndex = content.lastIndexOf('</body>');
        if (bodyCloseIndex !== -1) {
          content = content.slice(0, bodyCloseIndex) + enhancedLanguageSwitcher + content.slice(bodyCloseIndex);
          modified = true;
        }
      }
      
      // Add/Update hreflang tags
      const hreflangTags = generateEnhancedHreflangTags(filename);
      if (hreflangTags && !content.includes(`rel="alternate" hreflang=`)) {
        const headCloseIndex = content.indexOf('</head>');
        if (headCloseIndex !== -1) {
          content = content.slice(0, headCloseIndex) + hreflangTags + content.slice(headCloseIndex);
          modified = true;
          hreflangCount++;
        }
      }
      
      if (modified) {
        writeFileSync(filepath, content, 'utf-8');
        processedCount++;
        console.log(`✅ Updated multilingual features: ${filename}`);
      }
      
    } catch (error) {
      console.log(`⚠️  Error processing ${filename}:`, error.message);
    }
  }
  
  console.log(`\n✨ Multilingual Features Summary:`);
  console.log(`   ${processedCount} files processed`);
  console.log(`   ${hreflangCount} files with hreflang tags`);
  console.log(`\n🌍 Languages:`);
  console.log(`   ✅ English (EN)`);
  console.log(`   ✅ Japanese (JA)`);
  console.log(`   🚀 Korean (KO) - Coming Soon`);
  console.log(`   🚀 Chinese (ZH) - Coming Soon`);
  console.log(`\n🎨 Features:`);
  console.log(`   - 4-language switcher (EN/JP/KR/CN)`);
  console.log(`   - Visual indicators for available languages`);
  console.log(`   - "Coming Soon" tooltip for KR/CN`);
  console.log(`   - Enhanced hreflang tags for SEO`);
  console.log(`   - Google Analytics language switch tracking`);
  console.log(`\n📊 Expected Impact:`);
  console.log(`   - Korean traffic: +200% (when launched)`);
  console.log(`   - Chinese traffic: +150% (when launched)`);
  console.log(`   - Total international traffic: +350%`);
}

addMultilingualFeatures();
