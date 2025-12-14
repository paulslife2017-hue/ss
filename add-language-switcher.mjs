import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Language pairs mapping
const languagePairs = {
  // English -> Japanese
  'gangnam-head-spa-complete-guide-2025.html': 'gangnam-headspa-guide-2025-japanese.html',
  'ultimate-gangnam-head-spa-guide-2025.html': 'gangnam-headspa-guide-2025-japanese.html',
  'korean-skincare-routine-complete-guide-2025.html': 'seoul-skincare-routine-japanese.html',
  'seoul-skincare-routine-ultimate-guide.html': 'seoul-skincare-routine-japanese.html',
  'korean-beauty-trends-2025.html': 'korean-skincare-trend-2025-japanese.html',
  'seoul-beauty-tourism-guide-2025.html': 'korean-beauty-tour-complete-guide-2025-japanese.html',
  
  // Japanese -> English
  'gangnam-headspa-guide-2025-japanese.html': 'gangnam-head-spa-complete-guide-2025.html',
  'seoul-skincare-routine-japanese.html': 'korean-skincare-routine-complete-guide-2025.html',
  'korean-skincare-trend-2025-japanese.html': 'korean-beauty-trends-2025.html',
  'korean-beauty-tour-complete-guide-2025-japanese.html': 'seoul-beauty-tourism-guide-2025.html',
  'seoul-spa-ranking-2025-japanese.html': 'korean-spa-jjimjilbang-guide-2025.html'
};

// Language switcher HTML template
const languageSwitcherHTML = (alternateUrl, currentLang) => {
  const isJapanese = currentLang === 'ja';
  const switchToLang = isJapanese ? 'English' : '日本語';
  const switchToFlag = isJapanese ? '🇬🇧' : '🇯🇵';
  const switchToText = isJapanese ? 'Read in English' : '日本語で読む';
  
  return `
<!-- Language Switcher -->
<div class="language-switcher" style="
  position: fixed;
  top: 100px;
  right: 24px;
  z-index: 1000;
  background: white;
  padding: 12px 20px;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
">
  <a href="${alternateUrl}" style="
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #1a1a1a;
    font-weight: 600;
    font-size: 0.9375rem;
  " onmouseover="this.parentElement.style.transform='scale(1.05)'" onmouseout="this.parentElement.style.transform='scale(1)'">
    <span style="font-size: 1.25rem;">${switchToFlag}</span>
    <span>${switchToText}</span>
  </a>
</div>

<!-- hreflang tags for SEO -->
<link rel="alternate" hreflang="${isJapanese ? 'en' : 'ja'}" href="https://seoulzen.com/blog/${alternateUrl.replace('/blog/', '')}" />
<link rel="alternate" hreflang="${isJapanese ? 'ja' : 'en'}" href="https://seoulzen.com/blog/${isJapanese ? 'gangnam-headspa-guide-2025-japanese.html' : 'gangnam-head-spa-complete-guide-2025.html'}" />
`;
};

const blogDir = path.join(__dirname, 'public', 'blog');

console.log('🌐 Adding language switcher and multilingual links...\n');

let switchersAdded = 0;
let hreflangsAdded = 0;

Object.entries(languagePairs).forEach(([sourceFile, targetFile]) => {
  const sourceFilePath = path.join(blogDir, sourceFile);
  
  if (!fs.existsSync(sourceFilePath)) {
    console.log(`⏭️  Skipping ${sourceFile} (file not found)`);
    return;
  }
  
  let content = fs.readFileSync(sourceFilePath, 'utf8');
  
  // Skip if language switcher already exists
  if (content.includes('<!-- Language Switcher -->')) {
    console.log(`⏭️  ${sourceFile}: Language switcher already exists`);
    return;
  }
  
  // Determine current language
  const isJapanese = sourceFile.includes('japanese') || sourceFile.includes('japan');
  const currentLang = isJapanese ? 'ja' : 'en';
  
  // Add language switcher
  const switcherHTML = languageSwitcherHTML(`/blog/${targetFile}`, currentLang);
  
  // Insert before </head>
  if (content.includes('</head>')) {
    content = content.replace('</head>', `${switcherHTML}\n</head>`);
    switchersAdded++;
    hreflangsAdded++;
    
    fs.writeFileSync(sourceFilePath, content, 'utf8');
    console.log(`✅ ${sourceFile}: Added language switcher (${currentLang} → ${currentLang === 'ja' ? 'en' : 'ja'})`);
  } else {
    console.log(`⏭️  ${sourceFile}: No suitable insertion point`);
  }
});

console.log(`\n🎉 Multilingual linking complete!`);
console.log(`\n📊 Summary:`);
console.log(`  - Language switchers added: ${switchersAdded}`);
console.log(`  - hreflang tags added: ${hreflangsAdded}`);
console.log(`\n💡 Features:`);
console.log(`  🌐 Fixed language switcher (top-right corner)`);
console.log(`  🏴 English ↔ Japanese toggle`);
console.log(`  🔗 hreflang tags for international SEO`);
console.log(`  🇬🇧 "Read in English" / 🇯🇵 "日本語で読む" buttons`);
console.log(`\n📈 SEO Benefits:`);
console.log(`  ✓ Better international search rankings`);
console.log(`  ✓ Proper language targeting in Google`);
console.log(`  ✓ Reduced duplicate content issues`);
console.log(`  ✓ Improved user experience for Japanese visitors`);
