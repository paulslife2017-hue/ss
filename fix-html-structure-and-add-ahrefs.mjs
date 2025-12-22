import fs from 'fs';
import { glob } from 'glob';

console.log('🔧 Fixing HTML structure and adding Ahrefs Analytics...\n');

const ahrefsScript = `    <!-- Ahrefs Analytics -->
    <script>
      var ahrefs_analytics_script = document.createElement('script');
      ahrefs_analytics_script.async = true;
      ahrefs_analytics_script.src = 'https://analytics.ahrefs.com/analytics.js';
      ahrefs_analytics_script.setAttribute('data-key', 'HIiCZqZjAudkvyUdqityuw');
      document.getElementsByTagName('head')[0].appendChild(ahrefs_analytics_script);
    </script>
`;

// Find all blog HTML files
const files = glob.sync('public/blog/*.html');

let fixedCount = 0;
let skippedCount = 0;
let fixedFiles = [];

console.log(`📁 Found ${files.length} blog files\n`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Check if Ahrefs already exists
  if (content.includes('analytics.ahrefs.com')) {
    console.log(`✅ Already has Ahrefs: ${file.split('/').pop()}`);
    skippedCount++;
    return;
  }
  
  // Check if </head> exists
  if (!content.includes('</head>')) {
    console.log(`⚠️  Missing </head> tag: ${file.split('/').pop()}`);
    
    // Find a good insertion point (after the last </style> in head section, before body content starts)
    // Look for the pattern of closing style tag followed by body-related content
    
    // Strategy: Find "<!-- Language Switcher -->" or similar markers that indicate body section
    // and insert </head> before it
    const bodyMarkers = [
      '<!-- Language Switcher -->',
      '<nav ',
      '<header ',
      '<main ',
      '<div class="container">',
      '<body>',
      '<body ',
    ];
    
    let insertPos = -1;
    let foundMarker = null;
    
    for (const marker of bodyMarkers) {
      const pos = content.indexOf(marker);
      if (pos !== -1 && (insertPos === -1 || pos < insertPos)) {
        insertPos = pos;
        foundMarker = marker;
      }
    }
    
    if (insertPos !== -1) {
      console.log(`   → Found body marker: "${foundMarker}" at position ${insertPos}`);
      // Insert Ahrefs script and </head> before the body marker
      content = content.substring(0, insertPos) + 
                ahrefsScript + '\n</head>\n\n' +
                content.substring(insertPos);
      
      fs.writeFileSync(file, content, 'utf8');
      console.log(`   ✅ Fixed and added Ahrefs\n`);
      fixedCount++;
      fixedFiles.push(file.split('/').pop());
    } else {
      console.log(`   ❌ Could not find safe insertion point\n`);
    }
  } else {
    // File has </head> tag, just insert Ahrefs before it
    content = content.replace('</head>', `${ahrefsScript}\n</head>`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Added Ahrefs: ${file.split('/').pop()}`);
    fixedCount++;
    fixedFiles.push(file.split('/').pop());
  }
});

console.log('\n' + '='.repeat(70));
console.log('📊 HTML STRUCTURE FIX & AHREFS INSTALLATION COMPLETE');
console.log('='.repeat(70));
console.log(`✅ Fixed/Added: ${fixedCount} files`);
console.log(`⏭️  Skipped: ${skippedCount} files (already has Ahrefs)`);
console.log(`📁 Total files: ${files.length}`);

if (fixedFiles.length > 0) {
  console.log('\n📝 Updated files:');
  fixedFiles.forEach(file => {
    console.log(`   - ${file}`);
  });
}

console.log('\n🎯 Next Steps:');
console.log('   1. Verify HTML structure is valid');
console.log('   2. Commit and push to GitHub');
console.log('   3. Visit https://ahrefs.com/webmaster-tools');
console.log('   4. Verify domain ownership');
console.log('   5. Check analytics data (available after 24-48 hours)');
console.log('\n✅ Done!\n');
