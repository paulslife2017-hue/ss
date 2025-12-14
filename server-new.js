import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

// ==========================================
// MULTILINGUAL CONTENT DATA
// ==========================================

const translations = {
  ko: {
    nav: {
      beauty: '뷰티 서비스',
      tour: '투어',
      shop: '쇼핑',
      admin: '관리자'
    },
    hero: {
      title: '서울 K-뷰티 경험',
      subtitle: '최고의 한국 뷰티 트리트먼트, 투어, 쇼핑을 한 곳에서'
    },
    sections: {
      beauty: '뷰티 서비스',
      tour: '투어 프로그램',
      shop: '쇼핑몰'
    },
    cta: {
      bookNow: '지금 예약하기',
      learnMore: '더 알아보기',
      shopNow: '쇼핑하기'
    }
  },
  en: {
    nav: {
      beauty: 'Beauty Services',
      tour: 'Tours',
      shop: 'Shop',
      admin: 'Admin'
    },
    hero: {
      title: 'Seoul K-Beauty Experience',
      subtitle: 'Best Korean Beauty Treatments, Tours & Shopping in One Place'
    },
    sections: {
      beauty: 'Beauty Services',
      tour: 'Tour Programs',
      shop: 'Shopping'
    },
    cta: {
      bookNow: 'Book Now',
      learnMore: 'Learn More',
      shopNow: 'Shop Now'
    }
  },
  ja: {
    nav: {
      beauty: 'ビューティーサービス',
      tour: 'ツアー',
      shop: 'ショッピング',
      admin: '管理者'
    },
    hero: {
      title: 'ソウルKビューティー体験',
      subtitle: '最高の韓国ビューティートリートメント、ツアー、ショッピングを一か所で'
    },
    sections: {
      beauty: 'ビューティーサービス',
      tour: 'ツアープログラム',
      shop: 'ショッピング'
    },
    cta: {
      bookNow: '今すぐ予約',
      learnMore: 'もっと見る',
      shopNow: '今すぐ購入'
    }
  },
  zh: {
    nav: {
      beauty: '美容服務',
      tour: '旅遊',
      shop: '購物',
      admin: '管理員'
    },
    hero: {
      title: '首爾K美容體驗',
      subtitle: '最佳韓國美容療程、旅遊和購物一站式服務'
    },
    sections: {
      beauty: '美容服務',
      tour: '旅遊方案',
      shop: '購物'
    },
    cta: {
      bookNow: '立即預約',
      learnMore: '了解更多',
      shopNow: '立即購買'
    }
  }
};

// ==========================================
// SERVICE DATA
// ==========================================

const beautyServices = [
  {
    id: 'gangnam-headspa',
    name: {
      ko: '강남 헤드스파',
      en: 'Gangnam Head Spa',
      ja: '江南ヘッドスパ',
      zh: '江南頭皮護理'
    },
    description: {
      ko: '강남 최고의 두피 관리와 릴랙세이션 경험',
      en: 'Premium scalp treatment and ultimate relaxation in Gangnam',
      ja: '江南の最高級頭皮トリートメントとリラクゼーション',
      zh: '江南頂級頭皮護理和極致放鬆體驗'
    },
    price: {
      krw: 120000,
      usd: 92,
      jpy: 13000,
      twd: 2900
    },
    duration: '90min',
    videoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&fm=webp&auto=format&q=80',
    bookingUrl: 'https://kbeautyseoul.co.kr/booking/headspa'
  },
  {
    id: 'lip-tattoo',
    name: {
      ko: '립 타투 (립 블러싱)',
      en: 'Lip Tattoo (Lip Blushing)',
      ja: 'リップタトゥー（リップブラッシング）',
      zh: '唇部紋繡（唇部暈染）'
    },
    description: {
      ko: '자연스럽고 지속적인 립 컬러를 위한 반영구 화장',
      en: 'Semi-permanent makeup for natural, long-lasting lip color',
      ja: '自然で長持ちするリップカラーのためのセミパーマネントメイク',
      zh: '自然持久唇色的半永久化妝'
    },
    price: {
      krw: 500000,
      usd: 385,
      jpy: 54000,
      twd: 11900
    },
    duration: '120min',
    videoUrl: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800&h=600&fit=crop&fm=webp&auto=format&q=80',
    bookingUrl: 'https://kbeautyseoul.co.kr/booking/lip-tattoo'
  },
  {
    id: 'eyebrow-tattoo',
    name: {
      ko: '눈썹 문신',
      en: 'Eyebrow Tattoo',
      ja: '眉毛タトゥー',
      zh: '眉毛紋繡'
    },
    description: {
      ko: '완벽한 눈썹 모양을 위한 프리미엄 아이브로우 타투',
      en: 'Premium eyebrow tattoo for perfect brow shape',
      ja: '完璧な眉の形のためのプレミアム眉タトゥー',
      zh: '完美眉形的高級眉毛紋繡'
    },
    price: {
      krw: 450000,
      usd: 346,
      jpy: 48000,
      twd: 10700
    },
    duration: '120min',
    videoUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop&fm=webp&auto=format&q=80',
    bookingUrl: 'https://kbeautyseoul.co.kr/booking/eyebrow'
  },
  {
    id: 'bb-glow',
    name: {
      ko: 'BB글로우',
      en: 'BB Glow Treatment',
      ja: 'BBグロウトリートメント',
      zh: 'BB光澤療程'
    },
    description: {
      ko: '반영구 파운데이션으로 완벽한 피부 톤',
      en: 'Semi-permanent foundation for flawless skin tone',
      ja: 'セミパーマネントファンデーションで完璧な肌色',
      zh: '半永久粉底，完美膚色'
    },
    price: {
      krw: 250000,
      usd: 192,
      jpy: 27000,
      twd: 5900
    },
    duration: '90min',
    videoUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop&fm=webp&auto=format&q=80',
    bookingUrl: 'https://kbeautyseoul.co.kr/booking/bb-glow'
  },
  {
    id: 'glass-skin-facial',
    name: {
      ko: '글래스 스킨 페이셜',
      en: 'Glass Skin Facial',
      ja: 'グラススキンフェイシャル',
      zh: '玻璃肌面部護理'
    },
    description: {
      ko: '투명하고 빛나는 유리 피부를 위한 페이셜',
      en: 'Facial treatment for translucent, glowing glass skin',
      ja: '透明で輝くガラス肌のためのフェイシャル',
      zh: '透明光澤玻璃肌面部護理'
    },
    price: {
      krw: 180000,
      usd: 138,
      jpy: 19500,
      twd: 4400
    },
    duration: '90min',
    videoUrl: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=600&fit=crop&fm=webp&auto=format&q=80',
    bookingUrl: 'https://kbeautyseoul.co.kr/booking/glass-skin'
  },
  {
    id: 'aqua-peel',
    name: {
      ko: '아쿠아필 페이셜',
      en: 'Aqua Peel Facial',
      ja: 'アクアピールフェイシャル',
      zh: '水飛梭面部護理'
    },
    description: {
      ko: '수분 충전과 딥클렌징을 동시에',
      en: 'Hydration and deep cleansing in one treatment',
      ja: '保湿とディープクレンジングを同時に',
      zh: '補水和深層清潔同時進行'
    },
    price: {
      krw: 150000,
      usd: 115,
      jpy: 16200,
      twd: 3650
    },
    duration: '60min',
    videoUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=600&fit=crop&fm=webp&auto=format&q=80',
    bookingUrl: 'https://kbeautyseoul.co.kr/booking/aqua-peel'
  }
];

const tourPackages = [
  {
    id: 'kbeauty-tour',
    name: {
      ko: 'K-뷰티 체험 투어',
      en: 'K-Beauty Experience Tour',
      ja: 'Kビューティー体験ツアー',
      zh: 'K美容體驗之旅'
    },
    description: {
      ko: '강남 뷰티샵, 스킨케어 체험, 코스메틱 쇼핑까지',
      en: 'Visit Gangnam beauty shops, skincare experiences & cosmetic shopping',
      ja: '江南ビューティーショップ、スキンケア体験、コスメショッピング',
      zh: '江南美容店、護膚體驗、化妝品購物'
    },
    price: {
      krw: 85000,
      usd: 65,
      jpy: 9200,
      twd: 2070
    },
    duration: '4hrs',
    videoUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop&fm=webp&auto=format&q=80',
    bookingUrl: 'https://kbeautyseoul.co.kr/tour/kbeauty'
  },
  {
    id: 'seoul-night-tour',
    name: {
      ko: '서울 야경 투어',
      en: 'Seoul Night Tour',
      ja: 'ソウル夜景ツアー',
      zh: '首爾夜景之旅'
    },
    description: {
      ko: '남산타워, 한강, 동대문 디자인 플라자 야경',
      en: 'Namsan Tower, Han River & Dongdaemun Design Plaza night views',
      ja: '南山タワー、漢江、東大門デザインプラザの夜景',
      zh: '南山塔、漢江、東大門設計廣場夜景'
    },
    price: {
      krw: 75000,
      usd: 58,
      jpy: 8100,
      twd: 1830
    },
    duration: '3hrs',
    videoUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop&fm=webp&auto=format&q=80',
    bookingUrl: 'https://kbeautyseoul.co.kr/tour/night'
  },
  {
    id: 'palace-hanbok-tour',
    name: {
      ko: '궁궐 한복 체험',
      en: 'Palace Hanbok Experience',
      ja: '宮殿韓服体験',
      zh: '宮殿韓服體驗'
    },
    description: {
      ko: '한복 대여와 경복궁, 북촌 한옥마을 투어',
      en: 'Hanbok rental + Gyeongbokgung Palace & Bukchon Hanok Village',
      ja: '韓服レンタル＋景福宮、北村韓屋村ツアー',
      zh: '韓服租賃＋景福宮、北村韓屋村之旅'
    },
    price: {
      krw: 95000,
      usd: 73,
      jpy: 10300,
      twd: 2320
    },
    duration: '5hrs',
    videoUrl: 'https://images.unsplash.com/photo-1583500557349-fb5238f8d946?w=800&h=600&fit=crop&fm=webp&auto=format&q=80',
    bookingUrl: 'https://kbeautyseoul.co.kr/tour/hanbok'
  }
];

const shopProducts = [
  {
    id: 'sulwhasoo-set',
    name: {
      ko: '설화수 진설 기초 세트',
      en: 'Sulwhasoo Essential Set',
      ja: '雪花秀(ソルファス)エッセンシャルセット',
      zh: '雪花秀精華套裝'
    },
    description: {
      ko: '한방 명품 화장품 베스트셀러 세트',
      en: 'Premium Korean herbal cosmetics bestseller set',
      ja: '韓方高級化粧品ベストセラーセット',
      zh: '韓方高級化妝品暢銷套裝'
    },
    price: {
      krw: 350000,
      usd: 269,
      jpy: 37900,
      twd: 8540
    },
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=600&fit=crop&fm=webp&auto=format&q=80',
    shopUrl: 'https://kbeautyseoul.co.kr/shop/sulwhasoo'
  },
  {
    id: 'whoo-gift-set',
    name: {
      ko: '후 자생 에센스 세트',
      en: 'The History of Whoo Essence Set',
      ja: '后(フー)エッセンスセット',
      zh: '后精華套裝'
    },
    description: {
      ko: '궁중 비방 화장품 프리미엄 세트',
      en: 'Royal court secret formula premium cosmetics set',
      ja: '宮中秘方化粧品プレミアムセット',
      zh: '宮廷秘方化妝品高級套裝'
    },
    price: {
      krw: 420000,
      usd: 323,
      jpy: 45500,
      twd: 10250
    },
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop&fm=webp&auto=format&q=80',
    shopUrl: 'https://kbeautyseoul.co.kr/shop/whoo'
  },
  {
    id: 'cosrx-collection',
    name: {
      ko: 'COSRX 인기 제품 모음',
      en: 'COSRX Bestseller Collection',
      ja: 'COSRXベストセラーコレクション',
      zh: 'COSRX暢銷系列'
    },
    description: {
      ko: '여드름 피부를 위한 필수 제품 세트',
      en: 'Essential products set for acne-prone skin',
      ja: 'ニキビ肌のための必須製品セット',
      zh: '痘痘肌必備產品套裝'
    },
    price: {
      krw: 85000,
      usd: 65,
      jpy: 9200,
      twd: 2070
    },
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=600&fit=crop&fm=webp&auto=format&q=80',
    shopUrl: 'https://kbeautyseoul.co.kr/shop/cosrx'
  }
];

// ==========================================
// HTML GENERATION FUNCTIONS
// ==========================================

function generateNavigation(lang = 'en') {
  const t = translations[lang];
  return `
    <nav class="mobile-nav">
      <div class="nav-container">
        <div class="logo">
          <img src="https://via.placeholder.com/120x40/FF6B9D/FFFFFF?text=KBeauty+Seoul" alt="K-Beauty Seoul">
        </div>
        <div class="nav-links">
          <a href="#beauty" class="nav-link">${t.nav.beauty}</a>
          <a href="#tour" class="nav-link">${t.nav.tour}</a>
          <a href="#shop" class="nav-link">${t.nav.shop}</a>
          <a href="/admin" class="nav-link admin-link">${t.nav.admin}</a>
        </div>
        <div class="language-selector">
          <select onchange="window.location.href='/?lang='+this.value" class="lang-select">
            <option value="ko" ${lang === 'ko' ? 'selected' : ''}>한국어</option>
            <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
            <option value="ja" ${lang === 'ja' ? 'selected' : ''}>日本語</option>
            <option value="zh" ${lang === 'zh' ? 'selected' : ''}>繁體中文</option>
          </select>
        </div>
        <button class="mobile-menu-btn" onclick="toggleMobileMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  `;
}

function generateHeroSection(lang = 'en') {
  const t = translations[lang];
  return `
    <section class="hero-section">
      <div class="hero-video-container">
        <video autoplay muted loop playsinline class="hero-video">
          <source src="https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4" type="video/mp4">
        </video>
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">${t.hero.title}</h1>
        <p class="hero-subtitle">${t.hero.subtitle}</p>
        <div class="hero-cta">
          <a href="#beauty" class="cta-button primary">${t.cta.bookNow}</a>
          <a href="#about" class="cta-button secondary">${t.cta.learnMore}</a>
        </div>
      </div>
    </section>
  `;
}

function generateBeautySection(lang = 'en') {
  const t = translations[lang];
  const currencySymbol = {ko: '₩', en: '$', ja: '¥', zh: 'NT$'}[lang];
  const priceKey = {ko: 'krw', en: 'usd', ja: 'jpy', zh: 'twd'}[lang];
  
  return `
    <section id="beauty" class="content-section beauty-section">
      <div class="section-header">
        <h2 class="section-title">${t.sections.beauty}</h2>
      </div>
      <div class="service-grid">
        ${beautyServices.map(service => `
          <div class="service-card">
            <div class="service-image">
              <img src="${service.videoUrl}" alt="${service.name[lang]}" loading="lazy">
              <div class="service-badge">${service.duration}</div>
            </div>
            <div class="service-info">
              <h3 class="service-name">${service.name[lang]}</h3>
              <p class="service-description">${service.description[lang]}</p>
              <div class="service-footer">
                <div class="service-price">
                  <span class="price-amount">${currencySymbol}${service.price[priceKey].toLocaleString()}</span>
                </div>
                <a href="${service.bookingUrl}" class="service-cta" target="_blank">${t.cta.bookNow}</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function generateTourSection(lang = 'en') {
  const t = translations[lang];
  const currencySymbol = {ko: '₩', en: '$', ja: '¥', zh: 'NT$'}[lang];
  const priceKey = {ko: 'krw', en: 'usd', ja: 'jpy', zh: 'twd'}[lang];
  
  return `
    <section id="tour" class="content-section tour-section">
      <div class="section-header">
        <h2 class="section-title">${t.sections.tour}</h2>
      </div>
      <div class="service-grid">
        ${tourPackages.map(tour => `
          <div class="service-card">
            <div class="service-image">
              <img src="${tour.videoUrl}" alt="${tour.name[lang]}" loading="lazy">
              <div class="service-badge">${tour.duration}</div>
            </div>
            <div class="service-info">
              <h3 class="service-name">${tour.name[lang]}</h3>
              <p class="service-description">${tour.description[lang]}</p>
              <div class="service-footer">
                <div class="service-price">
                  <span class="price-amount">${currencySymbol}${tour.price[priceKey].toLocaleString()}</span>
                </div>
                <a href="${tour.bookingUrl}" class="service-cta" target="_blank">${t.cta.bookNow}</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function generateShopSection(lang = 'en') {
  const t = translations[lang];
  const currencySymbol = {ko: '₩', en: '$', ja: '¥', zh: 'NT$'}[lang];
  const priceKey = {ko: 'krw', en: 'usd', ja: 'jpy', zh: 'twd'}[lang];
  
  return `
    <section id="shop" class="content-section shop-section">
      <div class="section-header">
        <h2 class="section-title">${t.sections.shop}</h2>
      </div>
      <div class="service-grid">
        ${shopProducts.map(product => `
          <div class="service-card">
            <div class="service-image">
              <img src="${product.imageUrl}" alt="${product.name[lang]}" loading="lazy">
            </div>
            <div class="service-info">
              <h3 class="service-name">${product.name[lang]}</h3>
              <p class="service-description">${product.description[lang]}</p>
              <div class="service-footer">
                <div class="service-price">
                  <span class="price-amount">${currencySymbol}${product.price[priceKey].toLocaleString()}</span>
                </div>
                <a href="${product.shopUrl}" class="service-cta" target="_blank">${t.cta.shopNow}</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function generateMobileStyles() {
  return `
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      :root {
        --primary-color: #FF6B9D;
        --secondary-color: #FFC2D4;
        --text-dark: #222;
        --text-light: #666;
        --bg-light: #F8F9FA;
        --border-color: #E0E0E0;
        --shadow: 0 2px 20px rgba(0,0,0,0.08);
        --shadow-hover: 0 4px 30px rgba(0,0,0,0.12);
      }
      
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', 'Hiragino Sans', sans-serif;
        color: var(--text-dark);
        line-height: 1.6;
        background-color: #fff;
        overflow-x: hidden;
      }
      
      /* Navigation */
      .mobile-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #fff;
        box-shadow: var(--shadow);
        z-index: 1000;
        padding: 12px 0;
      }
      
      .nav-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .logo img {
        height: 32px;
      }
      
      .nav-links {
        display: none;
        gap: 24px;
      }
      
      .nav-link {
        text-decoration: none;
        color: var(--text-dark);
        font-weight: 500;
        font-size: 14px;
        transition: color 0.3s;
      }
      
      .nav-link:hover {
        color: var(--primary-color);
      }
      
      .admin-link {
        color: var(--primary-color);
      }
      
      .language-selector {
        display: none;
      }
      
      .lang-select {
        padding: 6px 12px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: white;
        font-size: 14px;
        cursor: pointer;
      }
      
      .mobile-menu-btn {
        display: flex;
        flex-direction: column;
        gap: 4px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px;
      }
      
      .mobile-menu-btn span {
        width: 24px;
        height: 2px;
        background: var(--text-dark);
        border-radius: 2px;
        transition: 0.3s;
      }
      
      /* Hero Section */
      .hero-section {
        position: relative;
        height: 70vh;
        min-height: 500px;
        max-height: 700px;
        margin-top: 56px;
        overflow: hidden;
      }
      
      .hero-video-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      
      .hero-video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, rgba(255, 107, 157, 0.7), rgba(255, 194, 212, 0.6));
      }
      
      .hero-content {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 20px;
        color: white;
      }
      
      .hero-title {
        font-size: 36px;
        font-weight: 700;
        margin-bottom: 16px;
        text-shadow: 0 2px 10px rgba(0,0,0,0.2);
      }
      
      .hero-subtitle {
        font-size: 16px;
        font-weight: 400;
        margin-bottom: 32px;
        opacity: 0.95;
        max-width: 600px;
      }
      
      .hero-cta {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .cta-button {
        padding: 14px 32px;
        border-radius: 12px;
        text-decoration: none;
        font-weight: 600;
        font-size: 15px;
        transition: all 0.3s;
        display: inline-block;
      }
      
      .cta-button.primary {
        background: white;
        color: var(--primary-color);
      }
      
      .cta-button.primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
      
      .cta-button.secondary {
        background: rgba(255,255,255,0.2);
        color: white;
        border: 2px solid white;
      }
      
      .cta-button.secondary:hover {
        background: white;
        color: var(--primary-color);
      }
      
      /* Content Sections */
      .content-section {
        padding: 60px 20px;
      }
      
      .content-section:nth-child(even) {
        background: var(--bg-light);
      }
      
      .section-header {
        max-width: 1200px;
        margin: 0 auto 40px;
      }
      
      .section-title {
        font-size: 32px;
        font-weight: 700;
        color: var(--text-dark);
        margin-bottom: 8px;
      }
      
      /* Service Grid */
      .service-grid {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr;
        gap: 24px;
      }
      
      .service-card {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: var(--shadow);
        transition: all 0.3s;
      }
      
      .service-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-hover);
      }
      
      .service-image {
        position: relative;
        width: 100%;
        padding-top: 66.67%; /* 3:2 aspect ratio */
        overflow: hidden;
        background: var(--bg-light);
      }
      
      .service-image img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .service-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        background: rgba(255,255,255,0.95);
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        color: var(--primary-color);
      }
      
      .service-info {
        padding: 20px;
      }
      
      .service-name {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 8px;
        color: var(--text-dark);
      }
      
      .service-description {
        font-size: 14px;
        color: var(--text-light);
        margin-bottom: 16px;
        line-height: 1.5;
      }
      
      .service-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 16px;
        border-top: 1px solid var(--border-color);
      }
      
      .service-price {
        display: flex;
        flex-direction: column;
      }
      
      .price-amount {
        font-size: 22px;
        font-weight: 700;
        color: var(--primary-color);
      }
      
      .service-cta {
        padding: 10px 24px;
        background: var(--primary-color);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s;
      }
      
      .service-cta:hover {
        background: #e55a8a;
        transform: translateY(-1px);
      }
      
      /* Tablet */
      @media (min-width: 768px) {
        .nav-links {
          display: flex;
        }
        
        .language-selector {
          display: block;
        }
        
        .mobile-menu-btn {
          display: none;
        }
        
        .service-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 32px;
        }
        
        .hero-title {
          font-size: 48px;
        }
        
        .hero-subtitle {
          font-size: 20px;
        }
      }
      
      /* Desktop */
      @media (min-width: 1024px) {
        .service-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        
        .hero-title {
          font-size: 56px;
        }
        
        .section-title {
          font-size: 40px;
        }
      }
    </style>
  `;
}

function generateHomePage(lang = 'en') {
  const t = translations[lang];
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
      <title>K-Beauty Seoul | ${t.hero.title}</title>
      <meta name="description" content="${t.hero.subtitle}">
      <meta name="keywords" content="K-Beauty, Seoul, Korean Beauty, Head Spa, Lip Tattoo, Beauty Services, Seoul Tour">
      
      <!-- Open Graph -->
      <meta property="og:title" content="K-Beauty Seoul | ${t.hero.title}">
      <meta property="og:description" content="${t.hero.subtitle}">
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://kbeautyseoul.co.kr">
      <meta property="og:image" content="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&h=630&fit=crop&fm=webp&auto=format&q=80">
      
      <!-- Favicon -->
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💄</text></svg>">
      
      ${generateMobileStyles()}
    </head>
    <body>
      ${generateNavigation(lang)}
      ${generateHeroSection(lang)}
      ${generateBeautySection(lang)}
      ${generateTourSection(lang)}
      ${generateShopSection(lang)}
      
      <script>
        function toggleMobileMenu() {
          // Mobile menu toggle logic
          alert('Mobile menu coming soon!');
        }
      </script>
    </body>
    </html>
  `;
}

// ==========================================
// ADMIN PAGE
// ==========================================

function generateAdminPage() {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>관리자 페이지 | K-Beauty Seoul Admin</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
          background: #f5f5f5;
          padding: 20px;
        }
        
        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .admin-header {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
          margin-bottom: 24px;
        }
        
        .admin-header h1 {
          font-size: 28px;
          color: #222;
          margin-bottom: 8px;
        }
        
        .admin-header p {
          color: #666;
          font-size: 14px;
        }
        
        .admin-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        
        .admin-tab {
          padding: 12px 24px;
          background: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #666;
          transition: all 0.3s;
          white-space: nowrap;
        }
        
        .admin-tab.active {
          background: #FF6B9D;
          color: white;
        }
        
        .admin-content {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
        }
        
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        
        .stat-card {
          background: linear-gradient(135deg, #FF6B9D, #FFC2D4);
          padding: 24px;
          border-radius: 12px;
          color: white;
        }
        
        .stat-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 8px;
        }
        
        .stat-value {
          font-size: 32px;
          font-weight: 700;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 24px;
        }
        
        .data-table th {
          background: #f8f9fa;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          color: #666;
          border-bottom: 2px solid #e0e0e0;
        }
        
        .data-table td {
          padding: 16px 12px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 14px;
        }
        
        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .status-confirmed {
          background: #d4edda;
          color: #155724;
        }
        
        .status-pending {
          background: #fff3cd;
          color: #856404;
        }
        
        .action-btn {
          padding: 6px 16px;
          background: #FF6B9D;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: 0.3s;
        }
        
        .action-btn:hover {
          background: #e55a8a;
        }
        
        @media (max-width: 768px) {
          body {
            padding: 12px;
          }
          
          .admin-header h1 {
            font-size: 22px;
          }
          
          .stat-grid {
            grid-template-columns: 1fr;
          }
          
          .data-table {
            font-size: 12px;
          }
          
          .data-table th, .data-table td {
            padding: 8px;
          }
        }
      </style>
    </head>
    <body>
      <div class="admin-container">
        <div class="admin-header">
          <h1>💄 K-Beauty Seoul 관리자</h1>
          <p>뷰티 서비스, 투어, 쇼핑 통합 관리 시스템</p>
        </div>
        
        <div class="admin-tabs">
          <button class="admin-tab active" onclick="showTab('beauty')">뷰티 서비스</button>
          <button class="admin-tab" onclick="showTab('tour')">투어</button>
          <button class="admin-tab" onclick="showTab('shop')">쇼핑</button>
          <button class="admin-tab" onclick="showTab('stats')">통계</button>
        </div>
        
        <div class="admin-content">
          <div id="beauty-tab">
            <h2 style="margin-bottom: 24px;">뷰티 서비스 예약 관리</h2>
            
            <div class="stat-grid">
              <div class="stat-card">
                <div class="stat-label">오늘 예약</div>
                <div class="stat-value">12</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">이번 주 예약</div>
                <div class="stat-value">47</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">대기 중</div>
                <div class="stat-value">8</div>
              </div>
            </div>
            
            <table class="data-table">
              <thead>
                <tr>
                  <th>예약번호</th>
                  <th>서비스</th>
                  <th>고객명</th>
                  <th>날짜</th>
                  <th>상태</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#BK001</td>
                  <td>강남 헤드스파</td>
                  <td>김지혜</td>
                  <td>2025-12-05 14:00</td>
                  <td><span class="status-badge status-confirmed">확정</span></td>
                  <td><button class="action-btn">상세보기</button></td>
                </tr>
                <tr>
                  <td>#BK002</td>
                  <td>립 타투</td>
                  <td>田中さくら</td>
                  <td>2025-12-05 16:00</td>
                  <td><span class="status-badge status-pending">대기</span></td>
                  <td><button class="action-btn">상세보기</button></td>
                </tr>
                <tr>
                  <td>#BK003</td>
                  <td>BB글로우</td>
                  <td>Sarah Johnson</td>
                  <td>2025-12-06 10:00</td>
                  <td><span class="status-badge status-confirmed">확정</span></td>
                  <td><button class="action-btn">상세보기</button></td>
                </tr>
                <tr>
                  <td>#BK004</td>
                  <td>눈썹 문신</td>
                  <td>陳美玲</td>
                  <td>2025-12-06 14:00</td>
                  <td><span class="status-badge status-confirmed">확정</span></td>
                  <td><button class="action-btn">상세보기</button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <script>
        function showTab(tab) {
          const tabs = document.querySelectorAll('.admin-tab');
          tabs.forEach(t => t.classList.remove('active'));
          event.target.classList.add('active');
          
          // Tab switching logic here
          alert(tab + ' 탭 - 개발 중');
        }
      </script>
    </body>
    </html>
  `;
}

// ==========================================
// ROUTES
// ==========================================

app.get('/', (c) => {
  const lang = c.req.query('lang') || 'en';
  return c.html(generateHomePage(lang));
});

app.get('/admin', (c) => {
  return c.html(generateAdminPage());
});

// Static file serving
app.use('/static/*', serveStatic({ root: './' }));

// ==========================================
// SERVER START
// ==========================================

const port = 3001;

console.log('🚀 Starting K-Beauty Seoul Server...');
console.log('📱 Mobile-first Airbnb-style design');
console.log('🌏 Multilingual: Korean, English, Japanese, Traditional Chinese');
console.log('💄 Sections: Beauty Services, Tours, Shop');

serve({
  fetch: app.fetch,
  port
});

console.log(`✅ Server running on http://localhost:${port}`);
console.log('🔗 Main site: http://localhost:${port}/?lang=en');
console.log('🔗 한국어: http://localhost:${port}/?lang=ko');
console.log('🔗 日本語: http://localhost:${port}/?lang=ja');
console.log('🔗 繁體中文: http://localhost:${port}/?lang=zh');
console.log('🔗 Admin: http://localhost:${port}/admin');
