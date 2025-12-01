import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

// ==========================================
// ADMIN & DATA CONFIGURATION
// ==========================================

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'kbeauty2025';

let clickTracking = [];

// Services database (in production, use real database)
let services = [
  // Beauty - Massage
  {
    id: 'gangnam-massage',
    name: { ko: '강남 프리미엄 마사지', en: 'Gangnam Premium Massage', ja: '江南プレミアムマッサージ', zh: '江南高級按摩' },
    description: { ko: '전신 아로마 테라피 마사지', en: 'Full body aromatherapy massage', ja: '全身アロマセラピーマッサージ', zh: '全身芳香療法按摩' },
    price: { krw: 150000, usd: 115, jpy: 16200, twd: 3650 },
    discount: '10%',
    badge: 'popular',
    duration: '90min',
    rating: 4.8,
    reviews: 234,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/massage?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'massage'
  },
  // Beauty - Head Spa
  {
    id: 'gangnam-headspa',
    name: { ko: '강남 헤드스파', en: 'Gangnam Head Spa', ja: '江南ヘッドスパ', zh: '江南頭皮護理' },
    description: { ko: '강남 최고의 두피 관리와 릴랙세이션', en: 'Premium scalp treatment in Gangnam', ja: '江南最高級頭皮トリートメント', zh: '江南頂級頭皮護理' },
    price: { krw: 120000, usd: 92, jpy: 13000, twd: 2900 },
    discount: '15%',
    badge: 'popular',
    duration: '90min',
    rating: 4.8,
    reviews: 342,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/headspa?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'headspa'
  },
  // Beauty - Semi-Permanent Makeup
  {
    id: 'lip-tattoo',
    name: { ko: '립 타투', en: 'Lip Tattoo', ja: 'リップタトゥー', zh: '唇部紋繡' },
    description: { ko: '자연스럽고 지속적인 립 컬러', en: 'Natural, long-lasting lip color', ja: '自然で長持ちするリップカラー', zh: '自然持久唇色' },
    price: { krw: 500000, usd: 385, jpy: 54000, twd: 11900 },
    discount: '20%',
    badge: 'recommended',
    duration: '120min',
    rating: 4.9,
    reviews: 218,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/lip-tattoo?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'semipermanent'
  },
  {
    id: 'eyebrow-tattoo',
    name: { ko: '눈썹 문신', en: 'Eyebrow Tattoo', ja: '眉毛タトゥー', zh: '眉毛紋繡' },
    description: { ko: '완벽한 눈썹 모양', en: 'Perfect brow shape', ja: '完璧な眉の形', zh: '完美眉形' },
    price: { krw: 450000, usd: 346, jpy: 48000, twd: 10700 },
    badge: 'popular',
    duration: '120min',
    rating: 4.7,
    reviews: 156,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/eyebrow?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'semipermanent'
  },
  // Beauty - Facial
  {
    id: 'bb-glow',
    name: { ko: 'BB글로우', en: 'BB Glow', ja: 'BBグロウ', zh: 'BB光澤' },
    description: { ko: '반영구 파운데이션', en: 'Semi-permanent foundation', ja: 'セミパーマネントファンデーション', zh: '半永久粉底' },
    price: { krw: 250000, usd: 192, jpy: 27000, twd: 5900 },
    discount: '10%',
    badge: 'newdeal',
    duration: '90min',
    rating: 4.6,
    reviews: 89,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/bb-glow?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'facial'
  },
  {
    id: 'glass-skin',
    name: { ko: '글래스 스킨', en: 'Glass Skin Facial', ja: 'グラススキン', zh: '玻璃肌' },
    description: { ko: '투명하고 빛나는 피부', en: 'Translucent, glowing skin', ja: '透明で輝く肌', zh: '透明光澤肌膚' },
    price: { krw: 180000, usd: 138, jpy: 19500, twd: 4400 },
    badge: 'recommended',
    duration: '90min',
    rating: 4.8,
    reviews: 267,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/glass-skin?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'facial'
  },
  {
    id: 'aqua-peel',
    name: { ko: '아쿠아필', en: 'Aqua Peel', ja: 'アクアピール', zh: '水飛梭' },
    description: { ko: '수분 충전 딥클렌징', en: 'Hydration deep cleansing', ja: '保湿ディープクレンジング', zh: '補水深層清潔' },
    price: { krw: 150000, usd: 115, jpy: 16200, twd: 3650 },
    badge: 'popular',
    duration: '60min',
    rating: 4.7,
    reviews: 198,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/aqua-peel?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'facial'
  },
  // Tour - Cultural
  {
    id: 'hanbok-palace',
    name: { ko: '궁궐 한복 체험', en: 'Palace Hanbok Experience', ja: '宮殿韓服体験', zh: '宮殿韓服體驗' },
    description: { ko: '한복 대여 + 경복궁 + 북촌', en: 'Hanbok + Gyeongbokgung + Bukchon', ja: '韓服＋景福宮＋北村', zh: '韓服＋景福宮＋北村' },
    price: { krw: 95000, usd: 73, jpy: 10300, twd: 2320 },
    discount: '15%',
    badge: 'popular',
    duration: '5hrs',
    rating: 4.9,
    reviews: 523,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1583500557349-fb5238f8d946?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.klook.com/activity/hanbok-palace-tour?aid=KLOOK_AFFILIATE_ID',
    platform: 'Klook',
    category: 'tour',
    subcategory: 'cultural'
  },
  // Tour - K-Beauty
  {
    id: 'kbeauty-tour',
    name: { ko: 'K-뷰티 체험 투어', en: 'K-Beauty Experience Tour', ja: 'Kビューティー体験ツアー', zh: 'K美容體驗之旅' },
    description: { ko: '강남 뷰티샵, 스킨케어 체험', en: 'Gangnam beauty shops & skincare', ja: '江南ビューティーショップ体験', zh: '江南美容店體驗' },
    price: { krw: 85000, usd: 65, jpy: 9200, twd: 2070 },
    discount: '12%',
    badge: 'popular',
    duration: '4hrs',
    rating: 4.9,
    reviews: 412,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.klook.com/activity/kbeauty-tour-seoul?aid=KLOOK_AFFILIATE_ID',
    platform: 'Klook',
    category: 'tour',
    subcategory: 'kbeauty'
  },
  // Tour - Sightseeing
  {
    id: 'seoul-night',
    name: { ko: '서울 야경 투어', en: 'Seoul Night Tour', ja: 'ソウル夜景ツアー', zh: '首爾夜景之旅' },
    description: { ko: '남산타워, 한강, DDP 야경', en: 'Namsan Tower, Han River & DDP', ja: '南山タワー、漢江、DDP', zh: '南山塔、漢江、DDP' },
    price: { krw: 75000, usd: 58, jpy: 8100, twd: 1830 },
    badge: 'recommended',
    duration: '3hrs',
    rating: 4.8,
    reviews: 356,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.kkday.com/seoul-night-tour?pid=KKDAY_AFFILIATE_ID',
    platform: 'KKday',
    category: 'tour',
    subcategory: 'sightseeing'
  },
  // Tour - Food
  {
    id: 'gangnam-foodie',
    name: { ko: '강남 미식 투어', en: 'Gangnam Foodie Tour', ja: '江南グルメツアー', zh: '江南美食之旅' },
    description: { ko: '강남 핫플 레스토랑 7곳', en: '7 hottest Gangnam restaurants', ja: '江南人気レストラン7軒', zh: '江南7家熱門餐廳' },
    price: { krw: 120000, usd: 92, jpy: 13000, twd: 2900 },
    badge: 'newdeal',
    duration: '4hrs',
    rating: 4.7,
    reviews: 189,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.kkday.com/gangnam-food-tour?pid=KKDAY_AFFILIATE_ID',
    platform: 'KKday',
    category: 'tour',
    subcategory: 'food'
  },
  // Shop - Premium
  {
    id: 'sulwhasoo-set',
    name: { ko: '설화수 진설 세트', en: 'Sulwhasoo Essential Set', ja: '雪花秀エッセンシャルセット', zh: '雪花秀精華套裝' },
    description: { ko: '한방 명품 화장품 베스트셀러', en: 'Premium herbal cosmetics', ja: '韓方高級化粧品', zh: '韓方高級化妝品' },
    price: { krw: 350000, usd: 269, jpy: 37900, twd: 8540 },
    discount: '18%',
    badge: 'popular',
    rating: 4.9,
    reviews: 1243,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/sulwhasoo?lptag=AF123456',
    platform: 'Coupang',
    category: 'shop',
    subcategory: 'premium'
  },
  {
    id: 'whoo-set',
    name: { ko: '후 자생 에센스', en: 'The History of Whoo', ja: '后エッセンス', zh: '后精華' },
    description: { ko: '궁중 비방 럭셔리 세트', en: 'Royal court luxury set', ja: '宮中秘方ラグジュアリー', zh: '宮廷秘方奢華套裝' },
    price: { krw: 420000, usd: 323, jpy: 45500, twd: 10250 },
    discount: '20%',
    badge: 'recommended',
    rating: 4.8,
    reviews: 876,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/whoo?lptag=AF123456',
    platform: 'Coupang',
    category: 'shop',
    subcategory: 'premium'
  },
  // Shop - Skincare
  {
    id: 'cosrx-collection',
    name: { ko: 'COSRX 인기 제품', en: 'COSRX Bestseller', ja: 'COSRXベストセラー', zh: 'COSRX暢銷系列' },
    description: { ko: '여드름 피부 필수템', en: 'Acne skin essentials', ja: 'ニキビ肌必需品', zh: '痘痘肌必備' },
    price: { krw: 85000, usd: 65, jpy: 9200, twd: 2070 },
    discount: '15%',
    badge: 'popular',
    rating: 4.7,
    reviews: 2134,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/cosrx?lptag=AF123456',
    platform: 'Coupang',
    category: 'shop',
    subcategory: 'skincare'
  },
  {
    id: 'beauty-joseon',
    name: { ko: '조선미녀 선케어', en: 'Beauty of Joseon Sun Care', ja: '美人朝鮮サンケア', zh: '朝鮮美人防曬' },
    description: { ko: '선크림 + 선스틱 세트', en: 'Sunscreen + Sun stick set', ja: '日焼け止めセット', zh: '防曬霜套裝' },
    price: { krw: 38000, usd: 29, jpy: 4100, twd: 930 },
    discount: '10%',
    badge: 'newdeal',
    rating: 4.9,
    reviews: 3567,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1556229010-aa3bafc8e533?w=800&h=600&fit=crop',
    affiliateUrl: 'https://smartstore.naver.com/beauty-joseon?ref=NAVER_SHOPPING_ID',
    platform: 'Naver Shopping',
    category: 'shop',
    subcategory: 'skincare'
  },
  // Shop - Mask
  {
    id: 'mediheal-masks',
    name: { ko: '메디힐 마스크팩 30매', en: 'Mediheal Mask Pack 30pcs', ja: 'メディヒールマスク30枚', zh: 'Mediheal面膜30片' },
    description: { ko: '티트리 + NMF + 콜라겐', en: 'Tea Tree + NMF + Collagen', ja: 'ティーツリー＋NMF＋コラーゲン', zh: '茶樹＋NMF＋膠原蛋白' },
    price: { krw: 45000, usd: 35, jpy: 4900, twd: 1100 },
    discount: '25%',
    badge: 'discount',
    rating: 4.6,
    reviews: 4521,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/mediheal?lptag=AF123456',
    platform: 'Coupang',
    category: 'shop',
    subcategory: 'mask'
  }
];

const subcategoryNames = {
  beauty: {
    massage: { ko: '마사지', en: 'Massage', ja: 'マッサージ', zh: '按摩' },
    headspa: { ko: '헤드스파', en: 'Head Spa', ja: 'ヘッドスパ', zh: '頭皮護理' },
    semipermanent: { ko: '반영구', en: 'Semi-Permanent', ja: '半永久', zh: '半永久' },
    facial: { ko: '페이셜', en: 'Facial', ja: 'フェイシャル', zh: '面部護理' }
  },
  tour: {
    cultural: { ko: '문화', en: 'Cultural', ja: '文化', zh: '文化' },
    kbeauty: { ko: 'K-뷰티', en: 'K-Beauty', ja: 'Kビューティー', zh: 'K美容' },
    sightseeing: { ko: '관광', en: 'Sightseeing', ja: '観光', zh: '觀光' },
    food: { ko: '미식', en: 'Food', ja: 'グルメ', zh: '美食' }
  },
  shop: {
    premium: { ko: '프리미엄', en: 'Premium', ja: 'プレミアム', zh: '高級' },
    skincare: { ko: '스킨케어', en: 'Skincare', ja: 'スキンケア', zh: '護膚' },
    mask: { ko: '마스크팩', en: 'Mask Pack', ja: 'マスクパック', zh: '面膜' }
  }
};

const translations = {
  ko: {
    nav: { beauty: '뷰티', tour: '투어', shop: '쇼핑', admin: '관리자' },
    hero: { title: '서울 K-뷰티 가이드', subtitle: '최고의 한국 뷰티, 투어, 쇼핑 추천' },
    catalog: {
      beauty: '뷰티 서비스',
      beautyDesc: '강남 프리미엄 뷰티 트리트먼트',
      tour: '투어 프로그램',
      tourDesc: '서울 베스트 투어 & 체험',
      shop: '쇼핑',
      shopDesc: 'K-뷰티 인기 상품'
    },
    cta: { viewAll: '전체 보기 →', bookNow: '예약하기 →', shopNow: '구매하기 →' },
    badges: { popular: '인기', recommended: '추천', newdeal: '신규', discount: '할인' }
  },
  en: {
    nav: { beauty: 'Beauty', tour: 'Tours', shop: 'Shop', admin: 'Admin' },
    hero: { title: 'Seoul K-Beauty Guide', subtitle: 'Best Korean Beauty, Tours & Shopping' },
    catalog: {
      beauty: 'Beauty Services',
      beautyDesc: 'Premium Gangnam Beauty Treatments',
      tour: 'Tour Programs',
      tourDesc: 'Best Seoul Tours & Experiences',
      shop: 'Shopping',
      shopDesc: 'Trending K-Beauty Products'
    },
    cta: { viewAll: 'View All →', bookNow: 'Book Now →', shopNow: 'Shop Now →' },
    badges: { popular: 'Popular', recommended: 'Recommended', newdeal: 'New', discount: 'Sale' }
  },
  ja: {
    nav: { beauty: 'ビューティー', tour: 'ツアー', shop: 'ショップ', admin: '管理者' },
    hero: { title: 'ソウルKビューティーガイド', subtitle: '最高の韓国ビューティー、ツアー、ショッピング' },
    catalog: {
      beauty: 'ビューティーサービス',
      beautyDesc: '江南プレミアムビューティートリートメント',
      tour: 'ツアープログラム',
      tourDesc: 'ソウルベストツアー＆体験',
      shop: 'ショッピング',
      shopDesc: '人気Kビューティー商品'
    },
    cta: { viewAll: 'すべて見る →', bookNow: '予約する →', shopNow: '購入する →' },
    badges: { popular: '人気', recommended: 'おすすめ', newdeal: '新着', discount: 'セール' }
  },
  zh: {
    nav: { beauty: '美容', tour: '旅遊', shop: '購物', admin: '管理員' },
    hero: { title: '首爾K美容指南', subtitle: '最佳韓國美容、旅遊和購物' },
    catalog: {
      beauty: '美容服務',
      beautyDesc: '江南高級美容療程',
      tour: '旅遊方案',
      tourDesc: '首爾最佳行程與體驗',
      shop: '購物',
      shopDesc: '熱銷K美容商品'
    },
    cta: { viewAll: '查看全部 →', bookNow: '立即預訂 →', shopNow: '立即購買 →' },
    badges: { popular: '熱門', recommended: '推薦', newdeal: '新品', discount: '特價' }
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getYoutubeThumbnail(youtubeUrl) {
  if (!youtubeUrl) return null;
  
  // Extract video ID from various YouTube URL formats
  let videoId = null;
  
  // https://www.youtube.com/watch?v=VIDEO_ID
  if (youtubeUrl.includes('youtube.com/watch?v=')) {
    videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
  }
  // https://youtu.be/VIDEO_ID
  else if (youtubeUrl.includes('youtu.be/')) {
    videoId = youtubeUrl.split('youtu.be/')[1]?.split('?')[0];
  }
  // https://www.youtube.com/embed/VIDEO_ID
  else if (youtubeUrl.includes('youtube.com/embed/')) {
    videoId = youtubeUrl.split('embed/')[1]?.split('?')[0];
  }
  
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  
  return null;
}

function trackClick(serviceId, category, platform, lang) {
  const clickData = {
    id: Date.now(),
    serviceId,
    category,
    platform,
    lang,
    timestamp: new Date().toISOString()
  };
  clickTracking.push(clickData);
  if (clickTracking.length > 1000) clickTracking = clickTracking.slice(-1000);
  return clickData;
}

function getBadgeText(badge, lang) {
  const t = translations[lang];
  const map = { 
    'popular': t.badges.popular, 
    'recommended': t.badges.recommended, 
    'newdeal': t.badges.newdeal, 
    'discount': t.badges.discount 
  };
  return map[badge] || badge;
}

// ==========================================
// HTML GENERATION
// ==========================================

function generateStyles() {
  return `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      :root {
        --primary: #FF6B9D;
        --secondary: #FFC2D4;
        --success: #10B981;
        --warning: #F59E0B;
        --text-dark: #222;
        --text-light: #666;
        --bg-light: #F8F9FA;
        --border: #E0E0E0;
        --shadow: 0 2px 20px rgba(0,0,0,0.08);
        --shadow-hover: 0 4px 30px rgba(0,0,0,0.12);
      }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', 'Hiragino Sans', sans-serif;
        color: var(--text-dark);
        line-height: 1.6;
        background: #fff;
      }
      
      /* Navigation */
      .nav {
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
      .logo img { height: 32px; }
      .nav-links {
        display: none;
        gap: 24px;
      }
      .nav-link {
        text-decoration: none;
        color: var(--text-dark);
        font-weight: 500;
        font-size: 14px;
        transition: 0.3s;
      }
      .nav-link:hover { color: var(--primary); }
      .nav-link.admin-link { color: var(--primary); }
      .lang-select {
        padding: 6px 12px;
        border: 1px solid var(--border);
        border-radius: 8px;
        background: white;
        font-size: 14px;
        cursor: pointer;
      }
      
      /* Hero */
      .hero {
        position: relative;
        height: 60vh;
        min-height: 400px;
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
        margin-bottom: 12px;
        text-shadow: 0 2px 10px rgba(0,0,0,0.2);
      }
      .hero-subtitle {
        font-size: 16px;
        margin-bottom: 20px;
        opacity: 0.95;
      }
      .affiliate-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 2px solid rgba(255,255,255,0.5);
        font-size: 13px;
        font-weight: 600;
      }
      
      /* Catalog Section */
      .catalog-section {
        padding: 60px 20px 40px;
        background: var(--bg-light);
      }
      .catalog-container {
        max-width: 1400px;
        margin: 0 auto;
      }
      
      /* Category Card */
      .category-card {
        background: white;
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 40px;
        box-shadow: var(--shadow);
      }
      .category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 16px;
        border-bottom: 2px solid var(--bg-light);
      }
      .category-info h3 {
        font-size: 24px;
        font-weight: 700;
        color: var(--text-dark);
        margin-bottom: 4px;
      }
      .category-info p {
        font-size: 14px;
        color: var(--text-light);
      }
      .category-link {
        padding: 10px 20px;
        background: var(--primary);
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: 600;
        font-size: 14px;
        transition: 0.3s;
        white-space: nowrap;
      }
      .category-link:hover {
        background: #e55a8a;
        transform: translateY(-1px);
      }
      
      /* Subcategory Tabs */
      .subcategory-tabs {
        display: flex;
        gap: 8px;
        margin-bottom: 20px;
        overflow-x: auto;
        padding-bottom: 10px;
        -webkit-overflow-scrolling: touch;
      }
      .subcategory-tabs::-webkit-scrollbar {
        height: 4px;
      }
      .subcategory-tabs::-webkit-scrollbar-track {
        background: var(--bg-light);
        border-radius: 2px;
      }
      .subcategory-tabs::-webkit-scrollbar-thumb {
        background: var(--primary);
        border-radius: 2px;
      }
      .subcategory-tab {
        padding: 8px 16px;
        background: var(--bg-light);
        border: 2px solid transparent;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        color: var(--text-light);
        cursor: pointer;
        transition: 0.3s;
        white-space: nowrap;
      }
      .subcategory-tab.active {
        background: white;
        border-color: var(--primary);
        color: var(--primary);
      }
      
      /* Service Grid - Horizontal Scroll */
      .service-grid-wrapper {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        margin: 0 -24px;
        padding: 0 24px;
      }
      .service-grid-wrapper::-webkit-scrollbar {
        height: 6px;
      }
      .service-grid-wrapper::-webkit-scrollbar-track {
        background: var(--bg-light);
        border-radius: 3px;
      }
      .service-grid-wrapper::-webkit-scrollbar-thumb {
        background: var(--primary);
        border-radius: 3px;
      }
      .service-grid {
        display: flex;
        gap: 16px;
        padding-bottom: 10px;
      }
      .service-card {
        flex: 0 0 280px;
        background: white;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid var(--border);
        transition: all 0.3s;
        display: flex;
        flex-direction: column;
      }
      .service-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-hover);
      }
      .service-image {
        position: relative;
        width: 100%;
        padding-top: 60%;
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
      .youtube-indicator {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        background: rgba(255,0,0,0.9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        pointer-events: none;
      }
      .service-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255,255,255,0.95);
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        color: var(--primary);
      }
      .badge-container {
        position: absolute;
        top: 10px;
        left: 10px;
      }
      .badge {
        padding: 4px 10px;
        border-radius: 10px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
      }
      .badge-popular { background: linear-gradient(135deg, #FF6B9D, #C44569); color: white; }
      .badge-recommended { background: linear-gradient(135deg, #10B981, #059669); color: white; }
      .badge-newdeal { background: linear-gradient(135deg, #F59E0B, #D97706); color: white; }
      .badge-discount { background: linear-gradient(135deg, #EF4444, #DC2626); color: white; }
      .discount-badge {
        position: absolute;
        bottom: 10px;
        right: 10px;
        background: #EF4444;
        color: white;
        padding: 6px 10px;
        border-radius: 6px;
        font-weight: 700;
        font-size: 13px;
      }
      .service-info {
        padding: 16px;
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .platform-tag {
        display: inline-block;
        padding: 3px 8px;
        background: var(--bg-light);
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        color: var(--text-light);
        margin-bottom: 8px;
        text-transform: uppercase;
      }
      .service-name {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 6px;
      }
      .service-description {
        font-size: 13px;
        color: var(--text-light);
        margin-bottom: 10px;
        flex: 1;
      }
      .rating {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 12px;
        font-size: 12px;
      }
      .stars { font-size: 12px; }
      .rating-text {
        color: var(--text-light);
        font-weight: 500;
      }
      .service-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid var(--border);
      }
      .price-amount {
        font-size: 18px;
        font-weight: 700;
        color: var(--primary);
      }
      .service-cta {
        padding: 8px 16px;
        background: var(--primary);
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        font-size: 13px;
        transition: 0.3s;
      }
      .service-cta:hover {
        background: #e55a8a;
      }
      
      /* Footer */
      footer {
        text-align: center;
        padding: 40px 20px;
        background: var(--bg-light);
        color: var(--text-light);
        font-size: 13px;
      }
      footer p { margin-bottom: 8px; }
      
      /* Responsive */
      @media (min-width: 768px) {
        .nav-links { display: flex; }
        .hero-title { font-size: 48px; }
        .hero-subtitle { font-size: 20px; }
        .service-card {
          flex: 0 0 320px;
        }
      }
      @media (min-width: 1024px) {
        .service-card {
          flex: 0 0 350px;
        }
      }
    </style>
  `;
}

function generateServiceCard(service, lang) {
  const t = translations[lang];
  const currencySymbol = {ko: '₩', en: '$', ja: '¥', zh: 'NT$'}[lang];
  const priceKey = {ko: 'krw', en: 'usd', ja: 'jpy', zh: 'twd'}[lang];
  
  // Use YouTube thumbnail if available, otherwise use imageUrl
  const thumbnail = getYoutubeThumbnail(service.youtubeUrl);
  const displayImage = thumbnail || service.imageUrl;
  const hasYoutube = !!service.youtubeUrl;
  
  return `
    <div class="service-card">
      <div class="service-image">
        <img src="${displayImage}" alt="${service.name[lang]}" loading="lazy" onerror="this.src='https://via.placeholder.com/350x210/FF6B9D/FFFFFF?text=No+Image'">
        ${hasYoutube ? '<div class="youtube-indicator">▶</div>' : ''}
        ${service.duration ? `<div class="service-badge">${service.duration}</div>` : ''}
        <div class="badge-container">
          <span class="badge badge-${service.badge}">${getBadgeText(service.badge, lang)}</span>
        </div>
        ${service.discount ? `<div class="discount-badge">-${service.discount}</div>` : ''}
      </div>
      <div class="service-info">
        <div class="platform-tag">${service.platform}</div>
        <h4 class="service-name">${service.name[lang]}</h4>
        <p class="service-description">${service.description[lang]}</p>
        ${service.rating ? `
          <div class="rating">
            <span class="stars">${'⭐'.repeat(Math.floor(service.rating))}</span>
            <span class="rating-text">${service.rating} (${service.reviews})</span>
          </div>
        ` : ''}
        <div class="service-footer">
          <div class="price-amount">${currencySymbol}${service.price[priceKey].toLocaleString()}</div>
          <a href="/track/${service.id}?category=${service.category}&lang=${lang}" 
             class="service-cta" 
             target="_blank"
             rel="nofollow noopener">
            ${t.cta.bookNow}
          </a>
        </div>
      </div>
    </div>
  `;
}

function generateHomePage(lang = 'en') {
  const t = translations[lang];
  
  // Group services by category
  const beautyServices = services.filter(s => s.category === 'beauty').slice(0, 6);
  const tourServices = services.filter(s => s.category === 'tour').slice(0, 6);
  const shopServices = services.filter(s => s.category === 'shop').slice(0, 6);
  
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>K-Beauty Seoul | ${t.hero.title}</title>
      <meta name="description" content="${t.hero.subtitle}">
      ${generateStyles()}
    </head>
    <body>
      <nav class="nav">
        <div class="nav-container">
          <div class="logo">
            <a href="/?lang=${lang}">
              <img src="https://via.placeholder.com/120x40/FF6B9D/FFFFFF?text=K-Beauty+Seoul" alt="K-Beauty Seoul">
            </a>
          </div>
          <div class="nav-links">
            <a href="/catalog/beauty?lang=${lang}" class="nav-link">${t.nav.beauty}</a>
            <a href="/catalog/tour?lang=${lang}" class="nav-link">${t.nav.tour}</a>
            <a href="/catalog/shop?lang=${lang}" class="nav-link">${t.nav.shop}</a>
            <a href="/admin" class="nav-link admin-link">${t.nav.admin}</a>
          </div>
          <select onchange="window.location.href='/?lang='+this.value" class="lang-select">
            <option value="ko" ${lang === 'ko' ? 'selected' : ''}>🇰🇷 한국어</option>
            <option value="en" ${lang === 'en' ? 'selected' : ''}>🇺🇸 English</option>
            <option value="ja" ${lang === 'ja' ? 'selected' : ''}>🇯🇵 日本語</option>
            <option value="zh" ${lang === 'zh' ? 'selected' : ''}>🇹🇼 繁體中文</option>
          </select>
        </div>
      </nav>
      
      <section class="hero">
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
            <span>🎁</span>
            <span>${lang === 'ko' ? '제휴 마케팅으로 운영' : lang === 'ja' ? 'アフィリエイトで運営' : lang === 'zh' ? '聯盟行銷營運' : 'Affiliate Marketing'}</span>
          </div>
        </div>
      </section>
      
      <section class="catalog-section">
        <div class="catalog-container">
          <!-- Beauty -->
          <div class="category-card">
            <div class="category-header">
              <div class="category-info">
                <h3>${t.catalog.beauty}</h3>
                <p>${t.catalog.beautyDesc}</p>
              </div>
              <a href="/catalog/beauty?lang=${lang}" class="category-link">${t.cta.viewAll}</a>
            </div>
            <div class="service-grid-wrapper">
              <div class="service-grid">
                ${beautyServices.map(s => generateServiceCard(s, lang)).join('')}
              </div>
            </div>
          </div>
          
          <!-- Tour -->
          <div class="category-card">
            <div class="category-header">
              <div class="category-info">
                <h3>${t.catalog.tour}</h3>
                <p>${t.catalog.tourDesc}</p>
              </div>
              <a href="/catalog/tour?lang=${lang}" class="category-link">${t.cta.viewAll}</a>
            </div>
            <div class="service-grid-wrapper">
              <div class="service-grid">
                ${tourServices.map(s => generateServiceCard(s, lang)).join('')}
              </div>
            </div>
          </div>
          
          <!-- Shop -->
          <div class="category-card">
            <div class="category-header">
              <div class="category-info">
                <h3>${t.catalog.shop}</h3>
                <p>${t.catalog.shopDesc}</p>
              </div>
              <a href="/catalog/shop?lang=${lang}" class="category-link">${t.cta.viewAll}</a>
            </div>
            <div class="service-grid-wrapper">
              <div class="service-grid">
                ${shopServices.map(s => generateServiceCard(s, lang)).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer>
        <p>💡 ${lang === 'ko' ? '이 사이트는 제휴 마케팅으로 운영됩니다.' : lang === 'ja' ? 'このサイトはアフィリエイトで運営されています。' : lang === 'zh' ? '本網站透過聯盟行銷營運。' : 'This site operates through affiliate marketing.'}</p>
        <p>© 2025 K-Beauty Seoul Guide</p>
      </footer>
    </body>
    </html>
  `;
}

function generateCatalogPage(category, lang = 'en', subcategory = 'all') {
  const t = translations[lang];
  let items = services.filter(s => s.category === category);
  
  if (subcategory !== 'all') {
    items = items.filter(s => s.subcategory === subcategory);
  }
  
  const categoryNames = {
    beauty: t.catalog.beauty,
    tour: t.catalog.tour,
    shop: t.catalog.shop
  };
  
  const categoryDescs = {
    beauty: t.catalog.beautyDesc,
    tour: t.catalog.tourDesc,
    shop: t.catalog.shopDesc
  };
  
  // Get subcategories for this category
  const subcategories = subcategoryNames[category];
  const subcategoryKeys = Object.keys(subcategories);
  
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${categoryNames[category]} | K-Beauty Seoul</title>
      <meta name="description" content="${categoryDescs[category]}">
      ${generateStyles()}
    </head>
    <body>
      <nav class="nav">
        <div class="nav-container">
          <div class="logo">
            <a href="/?lang=${lang}">
              <img src="https://via.placeholder.com/120x40/FF6B9D/FFFFFF?text=K-Beauty+Seoul" alt="K-Beauty Seoul">
            </a>
          </div>
          <div class="nav-links">
            <a href="/catalog/beauty?lang=${lang}" class="nav-link">${t.nav.beauty}</a>
            <a href="/catalog/tour?lang=${lang}" class="nav-link">${t.nav.tour}</a>
            <a href="/catalog/shop?lang=${lang}" class="nav-link">${t.nav.shop}</a>
            <a href="/admin" class="nav-link admin-link">${t.nav.admin}</a>
          </div>
          <select onchange="window.location.href='/catalog/${category}?lang='+this.value+'&sub=${subcategory}'" class="lang-select">
            <option value="ko" ${lang === 'ko' ? 'selected' : ''}>🇰🇷 한국어</option>
            <option value="en" ${lang === 'en' ? 'selected' : ''}>🇺🇸 English</option>
            <option value="ja" ${lang === 'ja' ? 'selected' : ''}>🇯🇵 日本語</option>
            <option value="zh" ${lang === 'zh' ? 'selected' : ''}>🇹🇼 繁體中文</option>
          </select>
        </div>
      </nav>
      
      <section class="catalog-section" style="margin-top: 56px;">
        <div class="catalog-container">
          <div class="category-card">
            <div class="category-header">
              <div class="category-info">
                <h1 style="font-size: 32px; margin-bottom: 8px;">${categoryNames[category]}</h1>
                <p>${categoryDescs[category]}</p>
              </div>
            </div>
            
            <div class="subcategory-tabs">
              <div class="subcategory-tab ${subcategory === 'all' ? 'active' : ''}" 
                   onclick="window.location.href='/catalog/${category}?lang=${lang}&sub=all'">
                ${lang === 'ko' ? '전체' : lang === 'ja' ? 'すべて' : lang === 'zh' ? '全部' : 'All'}
              </div>
              ${subcategoryKeys.map(key => `
                <div class="subcategory-tab ${subcategory === key ? 'active' : ''}" 
                     onclick="window.location.href='/catalog/${category}?lang=${lang}&sub=${key}'">
                  ${subcategories[key][lang]}
                </div>
              `).join('')}
            </div>
            
            <div class="service-grid-wrapper">
              <div class="service-grid">
                ${items.map(item => generateServiceCard(item, lang)).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <footer>
        <p>💡 ${lang === 'ko' ? '이 사이트는 제휴 마케팅으로 운영됩니다.' : lang === 'ja' ? 'このサイトはアフィリエイトで運営されています。' : lang === 'zh' ? '本網站透過聯盟行銷營運。' : 'This site operates through affiliate marketing.'}</p>
        <p>© 2025 K-Beauty Seoul Guide</p>
      </footer>
    </body>
    </html>
  `;
}

function generateAdminPage() {
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>관리자 페이지 | K-Beauty Seoul</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
          background: #f5f5f5;
        }
        
        /* Header */
        .admin-header {
          background: linear-gradient(135deg, #FF6B9D, #FFC2D4);
          color: white;
          padding: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .admin-header h1 {
          font-size: 24px;
          margin-bottom: 4px;
        }
        .admin-header p {
          font-size: 14px;
          opacity: 0.9;
        }
        
        /* Container */
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }
        
        /* Tabs */
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          overflow-x: auto;
          background: white;
          padding: 16px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        .tab {
          padding: 10px 20px;
          background: #f5f5f5;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          color: #666;
          transition: 0.3s;
          white-space: nowrap;
        }
        .tab.active {
          background: #FF6B9D;
          color: white;
        }
        
        /* Add Button */
        .add-btn {
          padding: 12px 24px;
          background: #10B981;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          margin-bottom: 20px;
          transition: 0.3s;
        }
        .add-btn:hover {
          background: #059669;
        }
        
        /* Services Grid */
        .services-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        /* Service Card */
        .admin-service-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          display: flex;
          gap: 16px;
        }
        .admin-service-image {
          width: 120px;
          height: 120px;
          border-radius: 8px;
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
          background: #f5f5f5;
        }
        .admin-service-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .youtube-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: red;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
        }
        .admin-service-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .admin-service-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 4px;
          color: #222;
        }
        .admin-service-desc {
          font-size: 13px;
          color: #666;
          margin-bottom: 8px;
        }
        .admin-service-meta {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }
        .admin-service-meta span {
          padding: 4px 8px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        .admin-service-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
        }
        .edit-btn, .delete-btn {
          padding: 6px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          transition: 0.3s;
        }
        .edit-btn {
          background: #3B82F6;
          color: white;
        }
        .edit-btn:hover {
          background: #2563EB;
        }
        .delete-btn {
          background: #EF4444;
          color: white;
        }
        .delete-btn:hover {
          background: #DC2626;
        }
        
        /* Modal */
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 9999;
          padding: 20px;
          overflow-y: auto;
        }
        .modal.active {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 24px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .modal-header h2 {
          font-size: 20px;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        .form-group {
          margin-bottom: 16px;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          font-size: 13px;
          margin-bottom: 6px;
          color: #222;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
        }
        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .save-btn {
          width: 100%;
          padding: 12px;
          background: #10B981;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: 0.3s;
        }
        .save-btn:hover {
          background: #059669;
        }
        
        /* YouTube Preview */
        .youtube-preview {
          margin-top: 8px;
          padding: 8px;
          background: #f5f5f5;
          border-radius: 6px;
          font-size: 12px;
          color: #666;
        }
        .youtube-preview img {
          width: 100%;
          max-width: 200px;
          border-radius: 4px;
          margin-top: 8px;
        }
        
        /* Responsive */
        @media (min-width: 768px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      </style>
    </head>
    <body>
      <div class="admin-header">
        <h1>🎨 K-Beauty Seoul 관리자</h1>
        <p>서비스 관리 시스템</p>
      </div>
      
      <div class="container">
        <div class="tabs">
          <button class="tab active" onclick="filterCategory('all')">전체 (${services.length})</button>
          <button class="tab" onclick="filterCategory('beauty')">뷰티 (${services.filter(s => s.category === 'beauty').length})</button>
          <button class="tab" onclick="filterCategory('tour')">투어 (${services.filter(s => s.category === 'tour').length})</button>
          <button class="tab" onclick="filterCategory('shop')">쇼핑 (${services.filter(s => s.category === 'shop').length})</button>
        </div>
        
        <button class="add-btn" onclick="openModal()">➕ 새 서비스 추가</button>
        
        <div class="services-grid" id="servicesGrid">
          ${services.map(service => {
            const thumbnail = getYoutubeThumbnail(service.youtubeUrl);
            const displayImage = thumbnail || service.imageUrl;
            return `
              <div class="admin-service-card" data-category="${service.category}">
                <div class="admin-service-image">
                  <img src="${displayImage}" alt="${service.name.ko}">
                  ${service.youtubeUrl ? '<div class="youtube-badge">YouTube</div>' : ''}
                </div>
                <div class="admin-service-info">
                  <div class="admin-service-title">${service.name.ko}</div>
                  <div class="admin-service-desc">${service.description.ko}</div>
                  <div class="admin-service-meta">
                    <span>${service.category}</span>
                    <span>${service.subcategory}</span>
                    <span>₩${service.price.krw.toLocaleString()}</span>
                    ${service.discount ? `<span style="color: #EF4444;">-${service.discount}</span>` : ''}
                  </div>
                  <div class="admin-service-actions">
                    <button class="edit-btn" onclick='editService(${JSON.stringify(service).replace(/'/g, "&#39;")})'>수정</button>
                    <button class="delete-btn" onclick="deleteService('${service.id}')">삭제</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      
      <!-- Modal -->
      <div class="modal" id="serviceModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modalTitle">새 서비스 추가</h2>
            <button class="close-btn" onclick="closeModal()">&times;</button>
          </div>
          <form id="serviceForm" onsubmit="saveService(event)">
            <input type="hidden" id="serviceId" name="id">
            
            <div class="form-group">
              <label>YouTube URL (선택사항) 📺</label>
              <input type="text" id="youtubeUrl" name="youtubeUrl" placeholder="https://www.youtube.com/watch?v=..." onchange="previewYoutube()">
              <div id="youtubePreview" class="youtube-preview" style="display: none;"></div>
            </div>
            
            <div class="form-group">
              <label>이미지 URL (YouTube가 없을 경우 필수)</label>
              <input type="text" id="imageUrl" name="imageUrl" placeholder="https://...">
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>카테고리</label>
                <select id="category" name="category" required onchange="updateSubcategories()">
                  <option value="beauty">뷰티</option>
                  <option value="tour">투어</option>
                  <option value="shop">쇼핑</option>
                </select>
              </div>
              <div class="form-group">
                <label>서브카테고리</label>
                <select id="subcategory" name="subcategory" required>
                  <option value="massage">마사지</option>
                  <option value="headspa">헤드스파</option>
                  <option value="semipermanent">반영구</option>
                  <option value="facial">페이셜</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label>서비스명 (한국어)</label>
              <input type="text" id="nameKo" name="name.ko" required>
            </div>
            
            <div class="form-group">
              <label>서비스명 (English)</label>
              <input type="text" id="nameEn" name="name.en" required>
            </div>
            
            <div class="form-group">
              <label>설명 (한국어)</label>
              <textarea id="descKo" name="description.ko" required></textarea>
            </div>
            
            <div class="form-group">
              <label>설명 (English)</label>
              <textarea id="descEn" name="description.en" required></textarea>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>가격 (KRW)</label>
                <input type="number" id="priceKrw" name="price.krw" required>
              </div>
              <div class="form-group">
                <label>할인율 (선택)</label>
                <input type="text" id="discount" name="discount" placeholder="10%">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label>소요시간</label>
                <input type="text" id="duration" name="duration" placeholder="90min">
              </div>
              <div class="form-group">
                <label>배지</label>
                <select id="badge" name="badge">
                  <option value="popular">인기</option>
                  <option value="recommended">추천</option>
                  <option value="newdeal">신규</option>
                  <option value="discount">할인</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label>제휴 링크</label>
              <input type="text" id="affiliateUrl" name="affiliateUrl" required>
            </div>
            
            <div class="form-group">
              <label>플랫폼</label>
              <input type="text" id="platform" name="platform" required placeholder="K-Beauty Seoul">
            </div>
            
            <button type="submit" class="save-btn">💾 저장하기</button>
          </form>
        </div>
      </div>
      
      <script>
        const subcategoryOptions = {
          beauty: [
            { value: 'massage', label: '마사지' },
            { value: 'headspa', label: '헤드스파' },
            { value: 'semipermanent', label: '반영구' },
            { value: 'facial', label: '페이셜' }
          ],
          tour: [
            { value: 'cultural', label: '문화' },
            { value: 'kbeauty', label: 'K-뷰티' },
            { value: 'sightseeing', label: '관광' },
            { value: 'food', label: '미식' }
          ],
          shop: [
            { value: 'premium', label: '프리미엄' },
            { value: 'skincare', label: '스킨케어' },
            { value: 'mask', label: '마스크팩' }
          ]
        };
        
        function filterCategory(cat) {
          const cards = document.querySelectorAll('.admin-service-card');
          const tabs = document.querySelectorAll('.tab');
          
          tabs.forEach(t => t.classList.remove('active'));
          event.target.classList.add('active');
          
          cards.forEach(card => {
            if (cat === 'all' || card.dataset.category === cat) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        }
        
        function openModal() {
          document.getElementById('serviceModal').classList.add('active');
          document.getElementById('modalTitle').textContent = '새 서비스 추가';
          document.getElementById('serviceForm').reset();
          document.getElementById('serviceId').value = '';
        }
        
        function closeModal() {
          document.getElementById('serviceModal').classList.remove('active');
        }
        
        function updateSubcategories() {
          const category = document.getElementById('category').value;
          const subcategorySelect = document.getElementById('subcategory');
          const options = subcategoryOptions[category];
          
          subcategorySelect.innerHTML = options.map(opt => 
            \`<option value="\${opt.value}">\${opt.label}</option>\`
          ).join('');
        }
        
        function previewYoutube() {
          const url = document.getElementById('youtubeUrl').value;
          const preview = document.getElementById('youtubePreview');
          
          if (!url) {
            preview.style.display = 'none';
            return;
          }
          
          let videoId = null;
          if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
          } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
          }
          
          if (videoId) {
            const thumbnail = \`https://img.youtube.com/vi/\${videoId}/maxresdefault.jpg\`;
            preview.innerHTML = \`
              ✅ YouTube 영상 감지됨<br>
              <img src="\${thumbnail}" alt="Thumbnail">
            \`;
            preview.style.display = 'block';
          } else {
            preview.innerHTML = '❌ 유효한 YouTube URL이 아닙니다.';
            preview.style.display = 'block';
          }
        }
        
        function editService(service) {
          document.getElementById('serviceModal').classList.add('active');
          document.getElementById('modalTitle').textContent = '서비스 수정';
          
          document.getElementById('serviceId').value = service.id;
          document.getElementById('youtubeUrl').value = service.youtubeUrl || '';
          document.getElementById('imageUrl').value = service.imageUrl || '';
          document.getElementById('category').value = service.category;
          updateSubcategories();
          document.getElementById('subcategory').value = service.subcategory;
          document.getElementById('nameKo').value = service.name.ko;
          document.getElementById('nameEn').value = service.name.en;
          document.getElementById('descKo').value = service.description.ko;
          document.getElementById('descEn').value = service.description.en;
          document.getElementById('priceKrw').value = service.price.krw;
          document.getElementById('discount').value = service.discount || '';
          document.getElementById('duration').value = service.duration || '';
          document.getElementById('badge').value = service.badge;
          document.getElementById('affiliateUrl').value = service.affiliateUrl;
          document.getElementById('platform').value = service.platform;
          
          previewYoutube();
        }
        
        async function saveService(e) {
          e.preventDefault();
          const formData = new FormData(e.target);
          const data = Object.fromEntries(formData);
          
          const response = await fetch('/admin/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if (response.ok) {
            alert('저장되었습니다!');
            window.location.reload();
          } else {
            alert('저장 실패!');
          }
        }
        
        async function deleteService(id) {
          if (!confirm('정말 삭제하시겠습니까?')) return;
          
          const response = await fetch(\`/admin/api/services/\${id}\`, {
            method: 'DELETE'
          });
          
          if (response.ok) {
            alert('삭제되었습니다!');
            window.location.reload();
          } else {
            alert('삭제 실패!');
          }
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

app.get('/catalog/:category', (c) => {
  const category = c.req.param('category');
  const lang = c.req.query('lang') || 'en';
  const subcategory = c.req.query('sub') || 'all';
  return c.html(generateCatalogPage(category, lang, subcategory));
});

app.get('/admin', (c) => {
  return c.html(generateAdminPage());
});

app.post('/admin/api/services', async (c) => {
  const data = await c.req.json();
  
  // Create or update service
  const serviceId = data.id || `service-${Date.now()}`;
  const existingIndex = services.findIndex(s => s.id === serviceId);
  
  const service = {
    id: serviceId,
    name: {
      ko: data['name.ko'],
      en: data['name.en'],
      ja: data['name.en'], // Copy EN to JA for now
      zh: data['name.en']  // Copy EN to ZH for now
    },
    description: {
      ko: data['description.ko'],
      en: data['description.en'],
      ja: data['description.en'],
      zh: data['description.en']
    },
    price: {
      krw: parseInt(data['price.krw']),
      usd: Math.round(parseInt(data['price.krw']) * 0.00077),
      jpy: Math.round(parseInt(data['price.krw']) * 0.108),
      twd: Math.round(parseInt(data['price.krw']) * 0.024)
    },
    discount: data.discount || '',
    badge: data.badge || 'popular',
    duration: data.duration || '',
    rating: 4.8,
    reviews: 100,
    youtubeUrl: data.youtubeUrl || '',
    imageUrl: data.imageUrl || '',
    affiliateUrl: data.affiliateUrl,
    platform: data.platform,
    category: data.category,
    subcategory: data.subcategory
  };
  
  if (existingIndex >= 0) {
    services[existingIndex] = service;
  } else {
    services.push(service);
  }
  
  return c.json({ success: true, service });
});

app.delete('/admin/api/services/:id', (c) => {
  const id = c.req.param('id');
  const index = services.findIndex(s => s.id === id);
  
  if (index >= 0) {
    services.splice(index, 1);
    return c.json({ success: true });
  }
  
  return c.json({ success: false }, 404);
});

app.get('/track/:serviceId', (c) => {
  const serviceId = c.req.param('serviceId');
  const category = c.req.query('category') || 'unknown';
  const lang = c.req.query('lang') || 'en';
  
  const service = services.find(s => s.id === serviceId);
  
  if (service) {
    trackClick(serviceId, category, service.platform, lang);
    return c.redirect(service.affiliateUrl);
  }
  
  return c.redirect('https://kbeautyseoul.co.kr');
});

app.get('/stats', (c) => {
  const totalClicks = clickTracking.length;
  const last24h = clickTracking.filter(cl => (new Date() - new Date(cl.timestamp)) < 24 * 60 * 60 * 1000).length;
  const byCategory = clickTracking.reduce((acc, cl) => { acc[cl.category] = (acc[cl.category] || 0) + 1; return acc; }, {});
  const byPlatform = clickTracking.reduce((acc, cl) => { acc[cl.platform] = (acc[cl.platform] || 0) + 1; return acc; }, {});
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>통계</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 24px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .stat-card.primary { background: linear-gradient(135deg, #FF6B9D, #FFC2D4); color: white; }
        .stat-label { font-size: 14px; opacity: 0.9; margin-bottom: 8px; }
        .stat-value { font-size: 32px; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 통계</h1>
        </div>
        <div class="stat-grid">
          <div class="stat-card primary">
            <div class="stat-label">총 클릭</div>
            <div class="stat-value">${totalClicks}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">최근 24시간</div>
            <div class="stat-value">${last24h}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">예상 수익</div>
            <div class="stat-value">₩${(totalClicks * 15000).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  return c.html(html);
});

// ==========================================
// SERVER START
// ==========================================

const port = process.env.PORT || 3000;

serve({
  fetch: app.fetch,
  port
});

console.log(`✅ K-Beauty Seoul running on port ${port}`);
console.log(`📱 Mobile-optimized with horizontal scroll`);
console.log(`🎬 YouTube thumbnail support`);
console.log(`🎨 Admin panel at /admin`);
