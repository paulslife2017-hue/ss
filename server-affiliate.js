import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

// ==========================================
// AFFILIATE TRACKING & CONFIGURATION
// ==========================================

const affiliateConfig = {
  // 제휴 파트너 ID들
  partners: {
    kbeauty: 'KBSEOUL2025',
    klook: 'KLOOK_AFFILIATE_ID',
    kkday: 'KKDAY_AFFILIATE_ID',
    coupang: 'COUPANG_PARTNER_ID',
    naver: 'NAVER_SHOPPING_ID'
  },
  
  // 클릭 트래킹을 위한 리디렉션 엔드포인트
  trackingUrl: '/track',
  
  // 수익 쉐어 (예상)
  commission: {
    beauty: '10-15%',
    tour: '8-12%',
    shop: '5-10%'
  }
};

// 클릭 트래킹 데이터 (실제 환경에서는 DB 사용)
let clickTracking = [];

// ==========================================
// MULTILINGUAL CONTENT DATA
// ==========================================

const translations = {
  ko: {
    nav: {
      beauty: '뷰티 서비스',
      tour: '투어',
      shop: '쇼핑',
      admin: '통계'
    },
    hero: {
      title: '서울 K-뷰티 가이드',
      subtitle: '최고의 한국 뷰티 트리트먼트, 투어, 쇼핑 추천'
    },
    sections: {
      beauty: '인기 뷰티 서비스',
      tour: '추천 투어',
      shop: '인기 상품'
    },
    cta: {
      bookNow: '예약하기 →',
      learnMore: '자세히 보기',
      shopNow: '구매하기 →',
      viewDeals: '특가 보기 →'
    },
    badges: {
      popular: '인기',
      recommended: '추천',
      newDeal: '신규',
      discount: '할인'
    }
  },
  en: {
    nav: {
      beauty: 'Beauty',
      tour: 'Tours',
      shop: 'Shop',
      admin: 'Stats'
    },
    hero: {
      title: 'Seoul K-Beauty Guide',
      subtitle: 'Best Korean Beauty Treatments, Tours & Shopping Recommendations'
    },
    sections: {
      beauty: 'Popular Beauty Services',
      tour: 'Recommended Tours',
      shop: 'Trending Products'
    },
    cta: {
      bookNow: 'Book Now →',
      learnMore: 'Learn More',
      shopNow: 'Shop Now →',
      viewDeals: 'View Deals →'
    },
    badges: {
      popular: 'Popular',
      recommended: 'Recommended',
      newDeal: 'New',
      discount: 'Sale'
    }
  },
  ja: {
    nav: {
      beauty: 'ビューティー',
      tour: 'ツアー',
      shop: 'ショップ',
      admin: '統計'
    },
    hero: {
      title: 'ソウルKビューティーガイド',
      subtitle: '最高の韓国ビューティートリートメント、ツアー、ショッピング推薦'
    },
    sections: {
      beauty: '人気ビューティーサービス',
      tour: 'おすすめツアー',
      shop: '人気商品'
    },
    cta: {
      bookNow: '予約する →',
      learnMore: '詳細を見る',
      shopNow: '購入する →',
      viewDeals: 'お得情報 →'
    },
    badges: {
      popular: '人気',
      recommended: 'おすすめ',
      newDeal: '新着',
      discount: 'セール'
    }
  },
  zh: {
    nav: {
      beauty: '美容',
      tour: '旅遊',
      shop: '購物',
      admin: '統計'
    },
    hero: {
      title: '首爾K美容指南',
      subtitle: '最佳韓國美容療程、旅遊和購物推薦'
    },
    sections: {
      beauty: '熱門美容服務',
      tour: '推薦行程',
      shop: '熱銷商品'
    },
    cta: {
      bookNow: '立即預訂 →',
      learnMore: '了解更多',
      shopNow: '立即購買 →',
      viewDeals: '查看優惠 →'
    },
    badges: {
      popular: '熱門',
      recommended: '推薦',
      newDeal: '新品',
      discount: '特價'
    }
  }
};

// ==========================================
// AFFILIATE SERVICE DATA
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
      ko: '강남 최고의 두피 관리와 릴랙세이션 경험. 90분 프리미엄 케어',
      en: 'Premium scalp treatment and ultimate relaxation in Gangnam. 90min premium care',
      ja: '江南の最高級頭皮トリートメントとリラクゼーション。90分プレミアムケア',
      zh: '江南頂級頭皮護理和極致放鬆體驗。90分鐘高級護理'
    },
    price: {
      krw: 120000,
      usd: 92,
      jpy: 13000,
      twd: 2900
    },
    discount: '15%',
    badge: 'popular',
    duration: '90min',
    rating: 4.8,
    reviews: 342,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/headspa?ref=KBSEOUL2025&utm_source=affiliate&utm_medium=website&utm_campaign=headspa',
    platform: 'K-Beauty Seoul',
    blogUrl: '/post/gangnam-head-spa-ultimate-guide-2025'
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
      ko: '자연스럽고 지속적인 립 컬러. 2-3년 유지, 세미 퍼머넌트',
      en: 'Natural, long-lasting lip color. Lasts 2-3 years, semi-permanent',
      ja: '自然で長持ちするリップカラー。2〜3年持続、セミパーマネント',
      zh: '自然持久唇色。持續2-3年，半永久'
    },
    price: {
      krw: 500000,
      usd: 385,
      jpy: 54000,
      twd: 11900
    },
    discount: '20%',
    badge: 'recommended',
    duration: '120min',
    rating: 4.9,
    reviews: 218,
    imageUrl: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/lip-tattoo?ref=KBSEOUL2025&utm_source=affiliate&utm_medium=website&utm_campaign=liptattoo',
    platform: 'K-Beauty Seoul',
    blogUrl: '/post/korean-lip-tattoo-complete-guide-seoul-2025'
  },
  {
    id: 'eyebrow-tattoo',
    name: {
      ko: '눈썹 문신 (반영구)',
      en: 'Eyebrow Tattoo',
      ja: '眉毛タトゥー',
      zh: '眉毛紋繡'
    },
    description: {
      ko: '완벽한 눈썹 모양. 프리미엄 아이브로우 반영구 화장',
      en: 'Perfect brow shape. Premium semi-permanent eyebrow makeup',
      ja: '完璧な眉の形。プレミアム半永久眉メイク',
      zh: '完美眉形。高級半永久眉毛化妝'
    },
    price: {
      krw: 450000,
      usd: 346,
      jpy: 48000,
      twd: 10700
    },
    badge: 'popular',
    duration: '120min',
    rating: 4.7,
    reviews: 156,
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/eyebrow?ref=KBSEOUL2025&utm_source=affiliate&utm_medium=website&utm_campaign=eyebrow',
    platform: 'K-Beauty Seoul'
  },
  {
    id: 'bb-glow',
    name: {
      ko: 'BB글로우 트리트먼트',
      en: 'BB Glow Treatment',
      ja: 'BBグロウトリートメント',
      zh: 'BB光澤療程'
    },
    description: {
      ko: '반영구 파운데이션으로 완벽한 피부 톤. 6-12개월 지속',
      en: 'Semi-permanent foundation for flawless skin. Lasts 6-12 months',
      ja: 'セミパーマネントファンデーションで完璧な肌。6〜12ヶ月持続',
      zh: '半永久粉底，完美膚色。持續6-12個月'
    },
    price: {
      krw: 250000,
      usd: 192,
      jpy: 27000,
      twd: 5900
    },
    discount: '10%',
    badge: 'newdeal',
    duration: '90min',
    rating: 4.6,
    reviews: 89,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/bb-glow?ref=KBSEOUL2025&utm_source=affiliate&utm_medium=website&utm_campaign=bbglow',
    platform: 'K-Beauty Seoul'
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
      ko: '투명하고 빛나는 유리 피부. 즉각적인 글로우 효과',
      en: 'Translucent, glowing glass skin. Immediate glow effect',
      ja: '透明で輝くガラス肌。即効グロー効果',
      zh: '透明光澤玻璃肌。即時光澤效果'
    },
    price: {
      krw: 180000,
      usd: 138,
      jpy: 19500,
      twd: 4400
    },
    badge: 'recommended',
    duration: '90min',
    rating: 4.8,
    reviews: 267,
    imageUrl: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/glass-skin?ref=KBSEOUL2025&utm_source=affiliate&utm_medium=website&utm_campaign=glassskin',
    platform: 'K-Beauty Seoul'
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
      ko: '수분 충전과 딥클렌징을 동시에. 다운타임 제로',
      en: 'Hydration and deep cleansing together. Zero downtime',
      ja: '保湿とディープクレンジングを同時に。ダウンタイムゼロ',
      zh: '補水和深層清潔同時進行。零恢復期'
    },
    price: {
      krw: 150000,
      usd: 115,
      jpy: 16200,
      twd: 3650
    },
    badge: 'popular',
    duration: '60min',
    rating: 4.7,
    reviews: 198,
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/aqua-peel?ref=KBSEOUL2025&utm_source=affiliate&utm_medium=website&utm_campaign=aquapeel',
    platform: 'K-Beauty Seoul'
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
      ko: '강남 뷰티샵, 스킨케어 체험, 코스메틱 쇼핑. 전문 가이드 포함',
      en: 'Gangnam beauty shops, skincare experiences & cosmetic shopping with guide',
      ja: '江南ビューティーショップ、スキンケア体験、コスメショッピング＋ガイド',
      zh: '江南美容店、護膚體驗、化妝品購物＋導遊'
    },
    price: {
      krw: 85000,
      usd: 65,
      jpy: 9200,
      twd: 2070
    },
    discount: '12%',
    badge: 'popular',
    duration: '4hrs',
    rating: 4.9,
    reviews: 412,
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.klook.com/activity/kbeauty-tour-seoul?aid=KLOOK_AFFILIATE_ID&aff_adid=kbeauty',
    platform: 'Klook'
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
      ko: '남산타워, 한강, 동대문 DDP. 인스타그램 명소 투어',
      en: 'Namsan Tower, Han River & DDP. Instagram spots tour',
      ja: '南山タワー、漢江、DDP。インスタ映えスポットツアー',
      zh: '南山塔、漢江、DDP。Instagram熱點之旅'
    },
    price: {
      krw: 75000,
      usd: 58,
      jpy: 8100,
      twd: 1830
    },
    badge: 'recommended',
    duration: '3hrs',
    rating: 4.8,
    reviews: 356,
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.kkday.com/seoul-night-tour?pid=KKDAY_AFFILIATE_ID&source=affiliate',
    platform: 'KKday'
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
      ko: '한복 대여 + 경복궁 + 북촌. 프로 사진 촬영 포함',
      en: 'Hanbok rental + Gyeongbokgung + Bukchon. Pro photoshoot included',
      ja: '韓服レンタル＋景福宮＋北村。プロ撮影付き',
      zh: '韓服租賃＋景福宮＋北村。含專業攝影'
    },
    price: {
      krw: 95000,
      usd: 73,
      jpy: 10300,
      twd: 2320
    },
    discount: '15%',
    badge: 'popular',
    duration: '5hrs',
    rating: 4.9,
    reviews: 523,
    imageUrl: 'https://images.unsplash.com/photo-1583500557349-fb5238f8d946?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.klook.com/activity/hanbok-palace-tour?aid=KLOOK_AFFILIATE_ID&aff_adid=hanbok',
    platform: 'Klook'
  },
  {
    id: 'gangnam-foodie-tour',
    name: {
      ko: '강남 미식 투어',
      en: 'Gangnam Foodie Tour',
      ja: '江南グルメツアー',
      zh: '江南美食之旅'
    },
    description: {
      ko: '강남 핫플 레스토랑 7곳. 한식, 카페, 디저트 올인원',
      en: '7 hottest Gangnam restaurants. Korean food, cafe & dessert all-in-one',
      ja: '江南人気レストラン7軒。韓国料理、カフェ、デザートオールインワン',
      zh: '江南7家熱門餐廳。韓食、咖啡、甜點一站式'
    },
    price: {
      krw: 120000,
      usd: 92,
      jpy: 13000,
      twd: 2900
    },
    badge: 'newdeal',
    duration: '4hrs',
    rating: 4.7,
    reviews: 189,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.kkday.com/gangnam-food-tour?pid=KKDAY_AFFILIATE_ID&source=affiliate',
    platform: 'KKday'
  }
];

const shopProducts = [
  {
    id: 'sulwhasoo-set',
    name: {
      ko: '설화수 진설 기초 세트',
      en: 'Sulwhasoo Essential Set',
      ja: '雪花秀エッセンシャルセット',
      zh: '雪花秀精華套裝'
    },
    description: {
      ko: '한방 명품 화장품 베스트셀러. 5단계 풀 세트',
      en: 'Premium Korean herbal cosmetics bestseller. 5-step full set',
      ja: '韓方高級化粧品ベストセラー。5ステップフルセット',
      zh: '韓方高級化妝品暢銷品。5步驟全套裝'
    },
    price: {
      krw: 350000,
      usd: 269,
      jpy: 37900,
      twd: 8540
    },
    discount: '18%',
    badge: 'popular',
    rating: 4.9,
    reviews: 1243,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/sulwhasoo?lptag=AF123456&subid=COUPANG_PARTNER_ID',
    platform: 'Coupang'
  },
  {
    id: 'whoo-gift-set',
    name: {
      ko: '후 자생 에센스 세트',
      en: 'The History of Whoo Essence Set',
      ja: '后エッセンスセット',
      zh: '后精華套裝'
    },
    description: {
      ko: '궁중 비방 화장품. 럭셔리 안티에이징 세트',
      en: 'Royal court secret formula. Luxury anti-aging set',
      ja: '宮中秘方化粧品。ラグジュアリーアンチエイジングセット',
      zh: '宮廷秘方化妝品。奢華抗老套裝'
    },
    price: {
      krw: 420000,
      usd: 323,
      jpy: 45500,
      twd: 10250
    },
    discount: '20%',
    badge: 'recommended',
    rating: 4.8,
    reviews: 876,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/whoo?lptag=AF123456&subid=COUPANG_PARTNER_ID',
    platform: 'Coupang'
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
      ko: '여드름 피부 필수템. 스네일 뮤신 96 + BHA 토너',
      en: 'Acne skin essentials. Snail Mucin 96 + BHA Toner',
      ja: 'ニキビ肌必需品。スネイルムチン96＋BHAトナー',
      zh: '痘痘肌必備。蝸牛精華96＋BHA化妝水'
    },
    price: {
      krw: 85000,
      usd: 65,
      jpy: 9200,
      twd: 2070
    },
    discount: '15%',
    badge: 'popular',
    rating: 4.7,
    reviews: 2134,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/cosrx?lptag=AF123456&subid=COUPANG_PARTNER_ID',
    platform: 'Coupang'
  },
  {
    id: 'beauty-of-joseon-set',
    name: {
      ko: '조선미녀 선케어 세트',
      en: 'Beauty of Joseon Sun Care Set',
      ja: '美人朝鮮サンケアセット',
      zh: '朝鮮美人防曬套裝'
    },
    description: {
      ko: '선크림 + 선스틱. 끈적임 제로, 백탁 제로',
      en: 'Sunscreen + Sun stick. Non-greasy, no white cast',
      ja: '日焼け止め＋スティック。べたつきゼロ、白浮きゼロ',
      zh: '防曬霜＋防曬棒。零黏膩、零泛白'
    },
    price: {
      krw: 38000,
      usd: 29,
      jpy: 4100,
      twd: 930
    },
    discount: '10%',
    badge: 'newdeal',
    rating: 4.9,
    reviews: 3567,
    imageUrl: 'https://images.unsplash.com/photo-1556229010-aa3bafc8e533?w=800&h=600&fit=crop',
    affiliateUrl: 'https://smartstore.naver.com/beauty-joseon?ref=NAVER_SHOPPING_ID',
    platform: 'Naver Shopping'
  },
  {
    id: 'mediheal-mask-pack',
    name: {
      ko: '메디힐 마스크팩 30매',
      en: 'Mediheal Mask Pack 30pcs',
      ja: 'メディヒールマスクパック30枚',
      zh: 'Mediheal面膜30片'
    },
    description: {
      ko: '티트리 + NMF + 콜라겐 믹스. 대용량 특가',
      en: 'Tea Tree + NMF + Collagen mix. Bulk deal',
      ja: 'ティーツリー＋NMF＋コラーゲンミックス。大容量特価',
      zh: '茶樹＋NMF＋膠原蛋白混合。大容量特價'
    },
    price: {
      krw: 45000,
      usd: 35,
      jpy: 4900,
      twd: 1100
    },
    discount: '25%',
    badge: 'discount',
    rating: 4.6,
    reviews: 4521,
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/mediheal?lptag=AF123456&subid=COUPANG_PARTNER_ID',
    platform: 'Coupang'
  }
];

// ==========================================
// TRACKING FUNCTION
// ==========================================

function trackClick(serviceId, serviceType, platform, lang) {
  const clickData = {
    id: Date.now(),
    serviceId,
    serviceType,
    platform,
    lang,
    timestamp: new Date().toISOString(),
    ip: 'anonymized',
    userAgent: 'anonymized'
  };
  
  clickTracking.push(clickData);
  
  // 최근 1000개만 보관 (메모리 관리)
  if (clickTracking.length > 1000) {
    clickTracking = clickTracking.slice(-1000);
  }
  
  return clickData;
}

// ==========================================
// HTML GENERATION FUNCTIONS
// ==========================================

function generateNavigation(lang = 'en') {
  const t = translations[lang];
  return `
    <nav class="mobile-nav">
      <div class="nav-container">
        <div class="logo">
          <a href="/?lang=${lang}">
            <img src="https://via.placeholder.com/120x40/FF6B9D/FFFFFF?text=K-Beauty+Seoul" alt="K-Beauty Seoul">
          </a>
        </div>
        <div class="nav-links">
          <a href="#beauty" class="nav-link">${t.nav.beauty}</a>
          <a href="#tour" class="nav-link">${t.nav.tour}</a>
          <a href="#shop" class="nav-link">${t.nav.shop}</a>
          <a href="/stats" class="nav-link stats-link">${t.nav.admin}</a>
        </div>
        <div class="language-selector">
          <select onchange="window.location.href='/?lang='+this.value" class="lang-select">
            <option value="ko" ${lang === 'ko' ? 'selected' : ''}>🇰🇷 한국어</option>
            <option value="en" ${lang === 'en' ? 'selected' : ''}>🇺🇸 English</option>
            <option value="ja" ${lang === 'ja' ? 'selected' : ''}>🇯🇵 日本語</option>
            <option value="zh" ${lang === 'zh' ? 'selected' : ''}>🇹🇼 繁體中文</option>
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
        <div class="affiliate-badge">
          <span class="badge-icon">🎁</span>
          <span class="badge-text">
            ${lang === 'ko' ? '특가 혜택 & 커미션으로 운영' : 
              lang === 'ja' ? '特別割引＆手数料で運営' :
              lang === 'zh' ? '特價優惠及佣金運營' :
              'Special Deals & Commission-Based'}
          </span>
        </div>
        <div class="hero-cta">
          <a href="#beauty" class="cta-button primary">${t.cta.viewDeals}</a>
        </div>
      </div>
    </section>
  `;
}

function getBadgeText(badge, lang) {
  const t = translations[lang];
  const badgeMap = {
    'popular': t.badges.popular,
    'recommended': t.badges.recommended,
    'newdeal': t.badges.newDeal,
    'discount': t.badges.discount
  };
  return badgeMap[badge] || badge;
}

function generateServiceCard(service, lang, type) {
  const t = translations[lang];
  const currencySymbol = {ko: '₩', en: '$', ja: '¥', zh: 'NT$'}[lang];
  const priceKey = {ko: 'krw', en: 'usd', ja: 'jpy', zh: 'twd'}[lang];
  
  const discountHTML = service.discount ? `
    <div class="discount-badge">-${service.discount}</div>
  ` : '';
  
  const ratingHTML = service.rating ? `
    <div class="rating">
      <span class="stars">${'⭐'.repeat(Math.floor(service.rating))}</span>
      <span class="rating-text">${service.rating} (${service.reviews})</span>
    </div>
  ` : '';
  
  const blogLinkHTML = service.blogUrl ? `
    <a href="${service.blogUrl}" class="blog-link" target="_blank">
      ${lang === 'ko' ? '📝 상세 가이드' : 
        lang === 'ja' ? '📝 詳細ガイド' :
        lang === 'zh' ? '📝 詳細指南' :
        '📝 Read Guide'}
    </a>
  ` : '';
  
  return `
    <div class="service-card" data-service-id="${service.id}">
      <div class="service-image">
        <img src="${service.imageUrl}" alt="${service.name[lang]}" loading="lazy">
        <div class="service-badge">${service.duration || ''}</div>
        <div class="badge-container">
          <span class="badge badge-${service.badge}">${getBadgeText(service.badge, lang)}</span>
        </div>
        ${discountHTML}
      </div>
      <div class="service-info">
        <div class="platform-tag">${service.platform}</div>
        <h3 class="service-name">${service.name[lang]}</h3>
        <p class="service-description">${service.description[lang]}</p>
        ${ratingHTML}
        <div class="service-footer">
          <div class="service-price">
            <span class="price-amount">${currencySymbol}${service.price[priceKey].toLocaleString()}</span>
          </div>
          <a href="/track/${service.id}?type=${type}&lang=${lang}" 
             class="service-cta" 
             target="_blank"
             rel="nofollow noopener">
            ${t.cta.bookNow}
          </a>
        </div>
        ${blogLinkHTML}
      </div>
    </div>
  `;
}

function generateBeautySection(lang = 'en') {
  const t = translations[lang];
  
  return `
    <section id="beauty" class="content-section beauty-section">
      <div class="section-header">
        <h2 class="section-title">${t.sections.beauty}</h2>
        <p class="section-subtitle">
          ${lang === 'ko' ? '강남 최고의 뷰티 트리트먼트 추천' :
            lang === 'ja' ? '江南最高のビューティートリートメント推薦' :
            lang === 'zh' ? '江南最佳美容療程推薦' :
            'Best beauty treatments in Gangnam'}
        </p>
      </div>
      <div class="service-grid">
        ${beautyServices.map(service => generateServiceCard(service, lang, 'beauty')).join('')}
      </div>
    </section>
  `;
}

function generateTourSection(lang = 'en') {
  const t = translations[lang];
  
  return `
    <section id="tour" class="content-section tour-section">
      <div class="section-header">
        <h2 class="section-title">${t.sections.tour}</h2>
        <p class="section-subtitle">
          ${lang === 'ko' ? 'Klook & KKday 파트너 투어' :
            lang === 'ja' ? 'Klook & KKdayパートナーツアー' :
            lang === 'zh' ? 'Klook & KKday合作行程' :
            'Klook & KKday Partner Tours'}
        </p>
      </div>
      <div class="service-grid">
        ${tourPackages.map(tour => generateServiceCard(tour, lang, 'tour')).join('')}
      </div>
    </section>
  `;
}

function generateShopSection(lang = 'en') {
  const t = translations[lang];
  
  return `
    <section id="shop" class="content-section shop-section">
      <div class="section-header">
        <h2 class="section-title">${t.sections.shop}</h2>
        <p class="section-subtitle">
          ${lang === 'ko' ? '쿠팡 & 네이버 쇼핑 인기 상품' :
            lang === 'ja' ? 'Coupang & Naver Shopping人気商品' :
            lang === 'zh' ? 'Coupang & Naver Shopping熱銷商品' :
            'Coupang & Naver Shopping Bestsellers'}
        </p>
      </div>
      <div class="service-grid">
        ${shopProducts.map(product => generateServiceCard(product, lang, 'shop')).join('')}
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
        --success-color: #10B981;
        --warning-color: #F59E0B;
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
      
      .stats-link {
        color: var(--success-color);
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
        background: linear-gradient(135deg, rgba(255, 107, 157, 0.8), rgba(255, 194, 212, 0.7));
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
        margin-bottom: 24px;
        opacity: 0.95;
        max-width: 600px;
      }
      
      .affiliate-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        border-radius: 30px;
        border: 2px solid rgba(255,255,255,0.5);
        margin-bottom: 24px;
        font-size: 14px;
        font-weight: 600;
      }
      
      .badge-icon {
        font-size: 20px;
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
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
      
      .cta-button.primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
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
        text-align: center;
      }
      
      .section-title {
        font-size: 32px;
        font-weight: 700;
        color: var(--text-dark);
        margin-bottom: 8px;
      }
      
      .section-subtitle {
        font-size: 16px;
        color: var(--text-light);
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
        position: relative;
      }
      
      .service-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-hover);
      }
      
      .service-image {
        position: relative;
        width: 100%;
        padding-top: 66.67%;
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
      
      .badge-container {
        position: absolute;
        top: 12px;
        left: 12px;
      }
      
      .badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .badge-popular {
        background: linear-gradient(135deg, #FF6B9D, #C44569);
        color: white;
      }
      
      .badge-recommended {
        background: linear-gradient(135deg, #10B981, #059669);
        color: white;
      }
      
      .badge-newdeal {
        background: linear-gradient(135deg, #F59E0B, #D97706);
        color: white;
      }
      
      .badge-discount {
        background: linear-gradient(135deg, #EF4444, #DC2626);
        color: white;
      }
      
      .discount-badge {
        position: absolute;
        bottom: 12px;
        right: 12px;
        background: #EF4444;
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(239,68,68,0.3);
      }
      
      .service-info {
        padding: 20px;
      }
      
      .platform-tag {
        display: inline-block;
        padding: 4px 10px;
        background: var(--bg-light);
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        color: var(--text-light);
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
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
        margin-bottom: 12px;
        line-height: 1.5;
      }
      
      .rating {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;
      }
      
      .stars {
        font-size: 14px;
        line-height: 1;
      }
      
      .rating-text {
        font-size: 13px;
        color: var(--text-light);
        font-weight: 500;
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
      
      .blog-link {
        display: inline-block;
        margin-top: 12px;
        font-size: 13px;
        color: var(--success-color);
        text-decoration: none;
        font-weight: 600;
        transition: 0.3s;
      }
      
      .blog-link:hover {
        color: #059669;
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
      <meta name="description" content="${t.hero.subtitle} - 제휴 마케팅으로 운영되는 K-뷰티 추천 사이트">
      <meta name="keywords" content="K-Beauty, Seoul, Korean Beauty, Affiliate, Klook, KKday, Coupang, Head Spa, Lip Tattoo">
      
      <!-- Open Graph -->
      <meta property="og:title" content="K-Beauty Seoul | ${t.hero.title}">
      <meta property="og:description" content="${t.hero.subtitle}">
      <meta property="og:type" content="website">
      <meta property="og:url" content="https://kbeautyseoul.co.kr">
      <meta property="og:image" content="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&h=630&fit=crop">
      
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
      
      <footer style="text-align: center; padding: 40px 20px; background: #f8f9fa; color: #666; font-size: 13px;">
        <p style="margin-bottom: 8px;">💡 ${lang === 'ko' ? '이 사이트는 제휴 마케팅으로 운영됩니다. 링크를 통한 구매 시 소정의 수수료를 받을 수 있습니다.' :
                                            lang === 'ja' ? 'このサイトはアフィリエイトマーケティングで運営されています。リンクからの購入で手数料を受け取る場合があります。' :
                                            lang === 'zh' ? '本網站透過聯盟行銷營運。透過連結購買時可能獲得佣金。' :
                                            'This site is operated through affiliate marketing. We may receive commissions from purchases made through links.'}</p>
        <p>© 2025 K-Beauty Seoul Guide. All rights reserved.</p>
      </footer>
      
      <script>
        function toggleMobileMenu() {
          alert('Mobile menu - Coming soon!');
        }
      </script>
    </body>
    </html>
  `;
}

// ==========================================
// STATS/ADMIN PAGE
// ==========================================

function generateStatsPage() {
  const totalClicks = clickTracking.length;
  const last24h = clickTracking.filter(c => {
    const clickTime = new Date(c.timestamp);
    const now = new Date();
    return (now - clickTime) < 24 * 60 * 60 * 1000;
  }).length;
  
  const clicksByType = clickTracking.reduce((acc, click) => {
    acc[click.serviceType] = (acc[click.serviceType] || 0) + 1;
    return acc;
  }, {});
  
  const clicksByPlatform = clickTracking.reduce((acc, click) => {
    acc[click.platform] = (acc[click.platform] || 0) + 1;
    return acc;
  }, {});
  
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>제휴 통계 | K-Beauty Seoul</title>
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
        
        .stats-container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .stats-header {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
          margin-bottom: 24px;
        }
        
        .stats-header h1 {
          font-size: 28px;
          color: #222;
          margin-bottom: 8px;
        }
        
        .stats-header p {
          color: #666;
          font-size: 14px;
        }
        
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }
        
        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
        }
        
        .stat-card.primary {
          background: linear-gradient(135deg, #FF6B9D, #FFC2D4);
          color: white;
        }
        
        .stat-card.success {
          background: linear-gradient(135deg, #10B981, #6EE7B7);
          color: white;
        }
        
        .stat-label {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 8px;
        }
        
        .stat-value {
          font-size: 36px;
          font-weight: 700;
        }
        
        .chart-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
          margin-bottom: 24px;
        }
        
        .chart-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        
        .chart-bar {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .chart-label {
          width: 120px;
          font-size: 14px;
          font-weight: 600;
        }
        
        .chart-bar-fill {
          flex: 1;
          height: 32px;
          background: #FF6B9D;
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 0 12px;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }
        
        .recent-clicks {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
        }
        
        .click-item {
          padding: 12px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 13px;
        }
        
        .click-item:last-child {
          border-bottom: none;
        }
        
        @media (max-width: 768px) {
          .chart-label {
            width: 80px;
            font-size: 12px;
          }
          
          .stat-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="stats-container">
        <div class="stats-header">
          <h1>📊 제휴 마케팅 통계</h1>
          <p>K-Beauty Seoul 어필리에이트 트래킹 대시보드</p>
        </div>
        
        <div class="stat-grid">
          <div class="stat-card primary">
            <div class="stat-label">총 클릭 수</div>
            <div class="stat-value">${totalClicks}</div>
          </div>
          <div class="stat-card success">
            <div class="stat-label">최근 24시간</div>
            <div class="stat-value">${last24h}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">예상 수익 (10% 평균)</div>
            <div class="stat-value">₩${(totalClicks * 15000).toLocaleString()}</div>
          </div>
        </div>
        
        <div class="chart-card">
          <div class="chart-title">카테고리별 클릭</div>
          ${Object.entries(clicksByType).map(([type, count]) => {
            const maxCount = Math.max(...Object.values(clicksByType));
            const percentage = (count / maxCount) * 100;
            return `
              <div class="chart-bar">
                <div class="chart-label">${type}</div>
                <div class="chart-bar-fill" style="width: ${percentage}%;">
                  ${count} 클릭
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="chart-card">
          <div class="chart-title">플랫폼별 클릭</div>
          ${Object.entries(clicksByPlatform).map(([platform, count]) => {
            const maxCount = Math.max(...Object.values(clicksByPlatform));
            const percentage = (count / maxCount) * 100;
            return `
              <div class="chart-bar">
                <div class="chart-label">${platform}</div>
                <div class="chart-bar-fill" style="width: ${percentage}%;">
                  ${count} 클릭
                </div>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="recent-clicks">
          <div class="chart-title">최근 클릭 기록</div>
          ${clickTracking.slice(-10).reverse().map(click => `
            <div class="click-item">
              <strong>${click.serviceId}</strong> - ${click.platform} 
              (${click.serviceType}) - ${new Date(click.timestamp).toLocaleString('ko-KR')}
            </div>
          `).join('')}
        </div>
      </div>
    </body>
    </html>
  `;
}

// ==========================================
// ROUTES
// ==========================================

// Main home page
app.get('/', (c) => {
  const lang = c.req.query('lang') || 'en';
  return c.html(generateHomePage(lang));
});

// Affiliate tracking redirect
app.get('/track/:serviceId', (c) => {
  const serviceId = c.req.param('serviceId');
  const type = c.req.query('type') || 'unknown';
  const lang = c.req.query('lang') || 'en';
  
  // Find the service
  let service = null;
  let targetUrl = 'https://kbeautyseoul.co.kr';
  
  if (type === 'beauty') {
    service = beautyServices.find(s => s.id === serviceId);
  } else if (type === 'tour') {
    service = tourPackages.find(s => s.id === serviceId);
  } else if (type === 'shop') {
    service = shopProducts.find(s => s.id === serviceId);
  }
  
  if (service) {
    targetUrl = service.affiliateUrl;
    trackClick(serviceId, type, service.platform, lang);
  }
  
  // Redirect to affiliate URL
  return c.redirect(targetUrl);
});

// Stats page
app.get('/stats', (c) => {
  return c.html(generateStatsPage());
});

// Blog post routes (from existing blog)
app.get('/post/:slug', (c) => {
  const slug = c.req.param('slug');
  // Redirect to old blog server on port 3000
  return c.redirect(`http://localhost:3000/post/${slug}`);
});

// Static file serving
app.use('/static/*', serveStatic({ root: './' }));

// ==========================================
// SERVER START
// ==========================================

const port = 3002;

console.log('🚀 Starting K-Beauty Seoul Affiliate Site...');
console.log('💰 Affiliate Marketing Platform');
console.log('🌏 Multilingual: Korean, English, Japanese, Traditional Chinese');
console.log('🤝 Partners: K-Beauty Seoul, Klook, KKday, Coupang, Naver Shopping');
console.log('📊 Click Tracking Enabled');

serve({
  fetch: app.fetch,
  port
});

console.log(`✅ Server running on http://localhost:${port}`);
console.log(`🔗 Main site: http://localhost:${port}/?lang=en`);
console.log(`🔗 한국어: http://localhost:${port}/?lang=ko`);
console.log(`🔗 日本語: http://localhost:${port}/?lang=ja`);
console.log(`🔗 繁體中文: http://localhost:${port}/?lang=zh`);
console.log(`📊 Stats: http://localhost:${port}/stats`);
