import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const blogDir = path.join(__dirname, 'public', 'blog');
const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

console.log(`Processing ${files.length} blog files...`);

files.forEach(file => {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if schema already exists
  if (content.includes('"@type": "Article"')) {
    console.log(`⏭️  Skipping ${file} (schema exists)`);
    return;
  }
  
  // Extract title from <title> tag
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : 'Korean Beauty Guide';
  
  // Extract description from meta description
  const descMatch = content.match(/<meta name="description" content="(.*?)"/);
  const description = descMatch ? descMatch[1] : 'Complete guide to Korean beauty treatments in Seoul';
  
  // Generate schema
  const schema = `
  <!-- JSON-LD Structured Data for SEO -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${title.replace(/"/g, '\\"')}",
    "description": "${description.replace(/"/g, '\\"')}",
    "image": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=630",
    "author": {
      "@type": "Organization",
      "name": "Seoul Zen",
      "url": "https://seoulzen.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Seoul Zen",
      "logo": {
        "@type": "ImageObject",
        "url": "https://seoulzen.com/logo.png"
      }
    },
    "datePublished": "2025-01-15",
    "dateModified": "2025-01-15",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://seoulzen.com/blog/${file}"
    },
    "keywords": "Korean beauty, Seoul beauty treatments, K-beauty guide, Korean skincare, Seoul spa, Gangnam beauty"
  }
  </script>
`;
  
  // Insert schema before </head>
  content = content.replace('</head>', `${schema}\n</head>`);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Added schema to ${file}`);
});

console.log('Done!');
