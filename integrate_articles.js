// Script to integrate all article files into server.js
import fs from 'fs';

// Read all article files
const articleFiles = [
  'article_6_gel_nails.js',
  'article_7_myeongdong_shopping.js',
  'article_8_mens_grooming.js',
  'article_9_head_spa_gangnam.js',
  'article_10_bb_glow.js',
  'article_11_eyebrow_tattoo.js',
  'article_12_anti_aging.js',
  'article_13_skincare_routine.js',
  'article_14_couple_spa.js',
  'article_15_foot_massage.js',
  'article_16_korean_body_scrub.js',
  'article_17_korean_sheet_masks.js',
  'article_18_korean_hair_salons.js',
  'article_19_korean_dermatology.js',
  'article_20_korean_wellness.js'
];

async function extractArticleData() {
  const articles = [];
  
  for (const file of articleFiles) {
    try {
      const module = await import(`./${file}`);
      const articleKey = Object.keys(module).find(key => key.startsWith('article'));
      if (articleKey && module[articleKey]) {
        const article = module[articleKey];
        articles.push({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          category: article.category || 'Beauty',
          date: article.date,
          author: article.author || 'Seoul Beauty Expert',
          readingTime: article.readingTime || '15 min read',
          tags: article.tags || [],
          published: true,
          views: article.views || 0
        });
        console.log(`✅ Loaded: Article ${article.id} - ${article.title.substring(0, 50)}...`);
      }
    } catch (error) {
      console.error(`❌ Error loading ${file}:`, error.message);
    }
  }
  
  // Sort by ID
  articles.sort((a, b) => a.id - b.id);
  
  console.log(`\n📊 Total articles loaded: ${articles.length}`);
  
  // Generate the posts array code
  const postsCode = `const posts = [\n${articles.map(article => 
    `  {\n    id: ${article.id},\n    title: ${JSON.stringify(article.title)},\n    slug: ${JSON.stringify(article.slug)},\n    excerpt: ${JSON.stringify(article.excerpt)},\n    content: \`${article.content.replace(/`/g, '\\`')}\`,\n    category: ${JSON.stringify(article.category)},\n    date: ${JSON.stringify(article.date)},\n    author: ${JSON.stringify(article.author)},\n    readingTime: ${JSON.stringify(article.readingTime)},\n    tags: ${JSON.stringify(article.tags)},\n    published: true,\n    views: ${article.views}\n  }`
  ).join(',\n')}  \n];`;
  
  // Write to a temporary file
  fs.writeFileSync('posts_data.txt', postsCode);
  console.log('\n✅ Posts array written to posts_data.txt');
  console.log('📝 Next: Manually replace the posts array in server.js');
}

extractArticleData().catch(console.error);
