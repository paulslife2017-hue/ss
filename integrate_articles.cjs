// Script to integrate new articles into server.js
const fs = require('fs');
const path = require('path');

// Read server.js
const serverPath = './server.js';
let serverContent = fs.readFileSync(serverPath, 'utf8');

// New article files to integrate (6 is already there)
const newArticleFiles = [
  'article_9_head_spa_gangnam.js',
  'article_10_bb_glow.js',
  'article_11_eyebrow_tattoo.js',
  'article_12_anti_aging.js',
  'article_13_skincare_routine.js',
  'article_14_couple_spa.js',
  'article_15_foot_massage.js'
];

// Extract post objects from article files
const newPosts = [];
for (const file of newArticleFiles) {
  if (fs.existsSync(file)) {
    const articleModule = require(`./${file}`);
    newPosts.push(articleModule);
    console.log(`✅ Loaded: ${file} (ID: ${articleModule.id})`);
  } else {
    console.log(`⚠️  Missing: ${file}`);
  }
}

// Find the position to insert (before the closing ];)
const postsArrayEnd = serverContent.indexOf('\n];', serverContent.indexOf('const posts = ['));

if (postsArrayEnd === -1) {
  console.error('❌ Could not find posts array end');
  process.exit(1);
}

// Convert new posts to string format
const newPostsString = newPosts.map(post => {
  return `  ${JSON.stringify(post, null, 2).split('\n').join('\n  ')}`;
}).join(',\n');

// Insert new posts before the array end
const beforeArray = serverContent.substring(0, postsArrayEnd);
const afterArray = serverContent.substring(postsArrayEnd);

const updatedContent = beforeArray + ',\n' + newPostsString + afterArray;

// Write updated server.js
fs.writeFileSync(serverPath, updatedContent, 'utf8');

console.log(`\n🎉 Successfully integrated ${newPosts.length} new articles!`);
console.log(`📊 Total articles in server.js: ${newPosts.length + 8} articles`);
console.log('✅ server.js updated successfully!');
