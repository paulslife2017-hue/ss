// Featured blog card HTML generator
function generateFeaturedBlogCard(article, lang) {
  const title = article.title[lang] || article.title.en;
  const excerpt = article.metaDescription[lang] || article.metaDescription.en;
  
  return `
    <a href="/blog/${article.id}?lang=${lang}" class="featured-card">
      <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop&fm=webp&auto=format&q=80" 
           alt="${title}" class="featured-card-img">
      <div class="featured-card-content">
        <span class="featured-card-category">${article.category}</span>
        <h3 class="featured-card-title">${title}</h3>
        <p class="featured-card-excerpt">${excerpt.substring(0, 120)}...</p>
        <div class="featured-card-meta">
          <span>${article.readTime}</span>
          <span>${article.publishedDate}</span>
        </div>
      </div>
    </a>
  `;
}

// Service card HTML generator  
function generateServiceCardNew(service, lang) {
  const name = service.name[lang] || service.name.en;
  const desc = service.description[lang] || service.description.en;
  const price = service.price.krw.toLocaleString();
  
  const badges = {
    0: { class: 'badge-popular', icon: '⭐', text: lang === 'ko' ? '인기' : lang === 'ja' ? '人気' : 'POPULAR' },
    1: { class: 'badge-best', icon: '🔥', text: lang === 'ko' ? '베스트' : lang === 'ja' ? 'ベスト' : 'BEST' },
    2: { class: 'badge-recommended', icon: '✨', text: lang === 'ko' ? '추천' : lang === 'ja' ? 'おすすめ' : 'RECOMMENDED' },
    3: { class: 'badge-premium', icon: '💎', text: lang === 'ko' ? '프리미엄' : lang === 'ja' ? 'プレミアム' : 'PREMIUM' }
  };
  
  const badgeIndex = Math.floor(Math.random() * 4);
  const badge = badges[badgeIndex];
  
  const icons = ['💆‍♀️', '💋', '✨', '💆'];
  const icon = icons[badgeIndex];
  
  return `
    <a href="${service.affiliateUrl}" target="_blank" class="service-card">
      <div class="service-icon">${icon}</div>
      <h3 class="service-name">${name}</h3>
      <p class="service-desc">${desc}</p>
      <div class="service-price">₩${price}</div>
      <span class="service-badge ${badge.class}">${badge.icon} ${badge.text}</span>
    </a>
  `;
}

// Latest blog card HTML generator
function generateLatestBlogCard(article, lang) {
  const title = article.title[lang] || article.title.en;
  
  return `
    <a href="/blog/${article.id}?lang=${lang}" class="latest-card">
      <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&fm=webp&auto=format&q=80" 
           alt="${title}" class="latest-card-img">
      <div class="latest-card-content">
        <h4 class="latest-card-title">${title}</h4>
        <div class="latest-card-meta">${article.readTime} • ${article.publishedDate}</div>
      </div>
    </a>
  `;
}

module.exports = { generateFeaturedBlogCard, generateServiceCardNew, generateLatestBlogCard };
