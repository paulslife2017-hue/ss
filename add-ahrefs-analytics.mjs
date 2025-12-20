import fs from 'fs';
import { glob } from 'glob';

console.log('🚀 Adding Ahrefs Analytics to all blog pages...\n');

const ahrefsScript = `    <!-- Ahrefs Analytics -->
    <script>
      var ahrefs_analytics_script = document.createElement('script');
      ahrefs_analytics_script.async = true;
      ahrefs_analytics_script.src = 'https://analytics.ahrefs.com/analytics.js';
      ahrefs_analytics_script.setAttribute('data-key', 'HIiCZqZjAudkvyUdqityuw');
      document.getElementsByTagName('head')[0].appendChild(ahrefs_analytics_script);
    </script>
`;

// 모든 블로그 HTML 파일 찾기
const files = glob.sync('public/blog/*.html');

let addedCount = 0;
let skippedCount = 0;
let updatedFiles = [];

console.log(`📁 Found ${files.length} blog files\n`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // 이미 Ahrefs가 있는지 확인
  if (content.includes('analytics.ahrefs.com')) {
    console.log(`⏭️  Already exists: ${file.split('/').pop()}`);
    skippedCount++;
  } else {
    // </head> 태그 앞에 Ahrefs 스크립트 삽입
    content = content.replace('</head>', `${ahrefsScript}\n</head>`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Added: ${file.split('/').pop()}`);
    addedCount++;
    updatedFiles.push(file.split('/').pop());
  }
});

console.log('\n' + '='.repeat(70));
console.log('📊 AHREFS ANALYTICS INSTALLATION COMPLETE');
console.log('='.repeat(70));
console.log(`✅ Added to: ${addedCount} files`);
console.log(`⏭️  Skipped: ${skippedCount} files (already exists)`);
console.log(`📁 Total files: ${files.length}`);

if (updatedFiles.length > 0) {
  console.log('\n📝 Updated files:');
  updatedFiles.slice(0, 10).forEach(file => {
    console.log(`   - ${file}`);
  });
  if (updatedFiles.length > 10) {
    console.log(`   ... and ${updatedFiles.length - 10} more`);
  }
}

console.log('\n🎯 Next Steps:');
console.log('   1. Commit and push to GitHub');
console.log('   2. Visit https://ahrefs.com/webmaster-tools');
console.log('   3. Verify domain ownership');
console.log('   4. Check analytics data (available after 24-48 hours)');
console.log('\n✅ Done!\n');
