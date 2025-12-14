import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Reading progress bar HTML + JavaScript
const progressBarCode = `
<!-- Reading Progress Bar -->
<div id="reading-progress-bar" style="
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 4px;
  background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
  z-index: 9999;
  transition: width 0.1s ease-out;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
"></div>

<script>
(function() {
  // Reading progress bar
  function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    const progressBar = document.getElementById('reading-progress-bar');
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  }

  // Update on scroll
  window.addEventListener('scroll', updateProgressBar);
  
  // Initial update
  updateProgressBar();
  
  // Reading time estimator
  const article = document.querySelector('article') || document.querySelector('main') || document.body;
  const text = article.textContent || article.innerText;
  const wordCount = text.trim().split(/\\s+/).length;
  const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
  
  // Add reading time indicator if not exists
  if (!document.querySelector('.reading-time')) {
    const header = document.querySelector('header h1');
    if (header && header.parentElement) {
      const readingTimeEl = document.createElement('p');
      readingTimeEl.className = 'reading-time';
      readingTimeEl.style.cssText = 'color: rgba(255,255,255,0.9); font-size: 0.9375rem; margin-top: 8px; display: flex; align-items: center; gap: 6px;';
      readingTimeEl.innerHTML = '<span style="font-size: 1.125rem;">📖</span> ' + readingTime + ' min read';
      header.parentElement.insertBefore(readingTimeEl, header.nextSibling);
    }
  }
})();
</script>
`;

const blogDir = path.join(__dirname, 'public', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

console.log('📊 Adding reading progress bars...\n');

let barsAdded = 0;

files.forEach(filename => {
  const filePath = path.join(blogDir, filename);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if progress bar already exists
  if (content.includes('id="reading-progress-bar"')) {
    console.log(`⏭️  ${filename}: Progress bar already exists`);
    return;
  }
  
  // Insert after opening <body> tag
  if (content.includes('<body>')) {
    content = content.replace('<body>', '<body>\n' + progressBarCode);
  } else {
    console.log(`⏭️  ${filename}: No <body> tag found`);
    return;
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ ${filename}: Added reading progress bar`);
  barsAdded++;
});

console.log(`\n🎉 Reading progress bars added!`);
console.log(`\n📊 Summary:`);
console.log(`  - Progress bars added: ${barsAdded}`);
console.log(`\n💡 Features:`);
console.log(`  📊 Visual progress indicator (gradient bar)`);
console.log(`  📖 Automatic reading time calculation`);
console.log(`  ⚡ Smooth scroll tracking`);
console.log(`  🎨 Branded gradient (purple-blue-pink)`);
console.log(`\n📈 Benefits:`);
console.log(`  ✓ Increased user engagement`);
console.log(`  ✓ Better content completion rates`);
console.log(`  ✓ Gamification effect (progress visibility)`);
console.log(`  ✓ Professional UX enhancement`);
