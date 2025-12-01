import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

// ==========================================
// ADMIN & DATA STORAGE
// ==========================================

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'kbeauty2025';

let clickTracking = [];
let adminSessions = new Set();

// Helper function to extract YouTube video ID
function getYouTubeVideoId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^?&\s]+)/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Helper function to get YouTube thumbnail
function getYouTubeThumbnail(url) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// ==========================================
// SERVICE DATA WITH SUBCATEGORIES
// ==========================================

let services = [
  // BEAUTY - Massage
  {
    id: 'gangnam-massage',
    category: 'beauty',
    subcategory: 'massage',
    name: { ko: '강남 프리미엄 마사지', en: 'Gangnam Premium Massage', ja: '江南プレミアムマッサージ', zh: '江南高級按摩' },
    description: { ko: '강남 최고의 전신 마사지', en: 'Best full body massage in Gangnam', ja: '江南最高の全身マッサージ', zh: '江南最佳全身按摩' },
    price: { krw: 150000, usd: 115, jpy: 16200, twd: 3650 },
    discount: '10%',
    badge: 'popular',
    duration: '90min',
    rating: 4.9,
    reviews: 456,
    mediaType: 'youtube',
    mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/massage?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul'
  },
  
  // BEAUTY - Head Spa
  {
    id: 'gangnam-headspa',
    category: 'beauty',
    subcategory: 'headspa',
    name: { ko: '강남 헤드스파', en: 'Gangnam Head Spa', ja: '江南ヘッドスパ', zh: '江南頭皮護理' },
    description: { ko: '강남 최고의 두피 관리와 릴랙세이션', en: 'Premium scalp treatment in Gangnam', ja: '江南最高級頭皮トリートメント', zh: '江南頂級頭皮護理' },
    price: { krw: 120000, usd: 92, jpy: 13000, twd: 2900 },
    discount: '15%',
    badge: 'popular',
    duration: '90min',
    rating: 4.8,
    reviews: 342,
    mediaType: 'image',
    mediaUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/headspa?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul'
  },
  
  // BEAUTY - Semi-Permanent Makeup
  {
    id: 'lip-tattoo',
    category: 'beauty',
    subcategory: 'semipermanent',
    name: { ko: '립 타투', en: 'Lip Tattoo', ja: 'リップタトゥー', zh: '唇部紋繡' },
    description: { ko: '자연스럽고 지속적인 립 컬러', en: 'Natural, long-lasting lip color', ja: '自然で長持ちするリップカラー', zh: '自然持久唇色' },
    price: { krw: 500000, usd: 385, jpy: 54000, twd: 11900 },
    discount: '20%',
    badge: 'recommended',
    duration: '120min',
    rating: 4.9,
    reviews: 218,
    mediaType: 'image',
    mediaUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/lip-tattoo?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul'
  },
  
  {
    id: 'eyebrow-tattoo',
    category: 'beauty',
    subcategory: 'semipermanent',
    name: { ko: '눈썹 문신', en: 'Eyebrow Tattoo', ja: '眉毛タトゥー', zh: '眉毛紋繡' },
    description: { ko: '완벽한 눈썹 모양', en: 'Perfect brow shape', ja: '完璧な眉の形', zh: '完美眉形' },
    price: { krw: 450000, usd: 346, jpy: 48000, twd: 10700 },
    badge: 'popular',
    duration: '120min',
    rating: 4.7,
    reviews: 156,
    mediaType: 'image',
    mediaUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/eyebrow?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul'
  },
  
  // BEAUTY - Facial
  {
    id: 'glass-skin',
    category: 'beauty',
    subcategory: 'facial',
    name: { ko: '글래스 스킨', en: 'Glass Skin Facial', ja: 'グラススキン', zh: '玻璃肌' },
    description: { ko: '투명하고 빛나는 피부', en: 'Translucent, glowing skin', ja: '透明で輝く肌', zh: '透明光澤肌膚' },
    price: { krw: 180000, usd: 138, jpy: 19500, twd: 4400 },
    badge: 'recommended',
    duration: '90min',
    rating: 4.8,
    reviews: 267,
    mediaType: 'image',
    mediaUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/glass-skin?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul'
  },
  
  // TOUR - Cultural
  {
    id: 'hanbok-palace',
    category: 'tour',
    subcategory: 'cultural',
    name: { ko: '궁궐 한복 체험', en: 'Palace Hanbok Experience', ja: '宮殿韓服体験', zh: '宮殿韓服體驗' },
    description: { ko: '한복 대여 + 경복궁 + 북촌', en: 'Hanbok + Gyeongbokgung + Bukchon', ja: '韓服＋景福宮＋北村', zh: '韓服＋景福宮＋北村' },
    price: { krw: 95000, usd: 73, jpy: 10300, twd: 2320 },
    discount: '15%',
    badge: 'popular',
    duration: '5hrs',
    rating: 4.9,
    reviews: 523,
    mediaType: 'youtube',
    mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imageUrl: 'https://images.unsplash.com/photo-1583500557349-fb5238f8d946?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.klook.com/activity/hanbok-palace-tour?aid=KLOOK_AFFILIATE_ID',
    platform: 'Klook'
  },
  
  // TOUR - Food
  {
    id: 'gangnam-foodie',
    category: 'tour',
    subcategory: 'food',
    name: { ko: '강남 미식 투어', en: 'Gangnam Foodie Tour', ja: '江南グルメツアー', zh: '江南美食之旅' },
    description: { ko: '강남 핫플 레스토랑 7곳', en: '7 hottest Gangnam restaurants', ja: '江南人気レストラン7軒', zh: '江南7家熱門餐廳' },
    price: { krw: 120000, usd: 92, jpy: 13000, twd: 2900 },
    badge: 'newdeal',
    duration: '4hrs',
    rating: 4.7,
    reviews: 189,
    mediaType: 'image',
    mediaUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.kkday.com/gangnam-food-tour?pid=KKDAY_AFFILIATE_ID',
    platform: 'KKday'
  },
  
  // TOUR - Beauty
  {
    id: 'kbeauty-tour',
    category: 'tour',
    subcategory: 'beauty',
    name: { ko: 'K-뷰티 체험 투어', en: 'K-Beauty Experience Tour', ja: 'Kビューティー体験ツアー', zh: 'K美容體驗之旅' },
    description: { ko: '강남 뷰티샵, 스킨케어 체험', en: 'Gangnam beauty shops & skincare', ja: '江南ビューティーショップ体験', zh: '江南美容店體驗' },
    price: { krw: 85000, usd: 65, jpy: 9200, twd: 2070 },
    discount: '12%',
    badge: 'popular',
    duration: '4hrs',
    rating: 4.9,
    reviews: 412,
    mediaType: 'image',
    mediaUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.klook.com/activity/kbeauty-tour-seoul?aid=KLOOK_AFFILIATE_ID',
    platform: 'Klook'
  },
  
  // TOUR - Night
  {
    id: 'seoul-night',
    category: 'tour',
    subcategory: 'night',
    name: { ko: '서울 야경 투어', en: 'Seoul Night Tour', ja: 'ソウル夜景ツアー', zh: '首爾夜景之旅' },
    description: { ko: '남산타워, 한강, DDP 야경', en: 'Namsan Tower, Han River & DDP', ja: '南山タワー、漢江、DDP', zh: '南山塔、漢江、DDP' },
    price: { krw: 75000, usd: 58, jpy: 8100, twd: 1830 },
    badge: 'recommended',
    duration: '3hrs',
    rating: 4.8,
    reviews: 356,
    mediaType: 'image',
    mediaUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.kkday.com/seoul-night-tour?pid=KKDAY_AFFILIATE_ID',
    platform: 'KKday'
  },
  
  // SHOP - Skincare
  {
    id: 'sulwhasoo-set',
    category: 'shop',
    subcategory: 'skincare',
    name: { ko: '설화수 진설 세트', en: 'Sulwhasoo Essential Set', ja: '雪花秀エッセンシャルセット', zh: '雪花秀精華套裝' },
    description: { ko: '한방 명품 화장품 베스트셀러', en: 'Premium herbal cosmetics', ja: '韓方高級化粧品', zh: '韓方高級化妝品' },
    price: { krw: 350000, usd: 269, jpy: 37900, twd: 8540 },
    discount: '18%',
    badge: 'popular',
    rating: 4.9,
    reviews: 1243,
    mediaType: 'image',
    mediaUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/sulwhasoo?lptag=AF123456',
    platform: 'Coupang'
  },
  
  {
    id: 'cosrx-collection',
    category: 'shop',
    subcategory: 'skincare',
    name: { ko: 'COSRX 인기 제품', en: 'COSRX Bestseller', ja: 'COSRXベストセラー', zh: 'COSRX暢銷系列' },
    description: { ko: '여드름 피부 필수템', en: 'Acne skin essentials', ja: 'ニキビ肌必需品', zh: '痘痘肌必備' },
    price: { krw: 85000, usd: 65, jpy: 9200, twd: 2070 },
    discount: '15%',
    badge: 'popular',
    rating: 4.7,
    reviews: 2134,
    mediaType: 'image',
    mediaUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/cosrx?lptag=AF123456',
    platform: 'Coupang'
  },
  
  // SHOP - Makeup
  {
    id: 'beauty-joseon',
    category: 'shop',
    subcategory: 'suncare',
    name: { ko: '조선미녀 선케어', en: 'Beauty of Joseon Sun Care', ja: '美人朝鮮サンケア', zh: '朝鮮美人防曬' },
    description: { ko: '선크림 + 선스틱 세트', en: 'Sunscreen + Sun stick set', ja: '日焼け止めセット', zh: '防曬霜套裝' },
    price: { krw: 38000, usd: 29, jpy: 4100, twd: 930 },
    discount: '10%',
    badge: 'newdeal',
    rating: 4.9,
    reviews: 3567,
    mediaType: 'image',
    mediaUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1556229010-aa3bafc8e533?w=800&h=600&fit=crop',
    affiliateUrl: 'https://smartstore.naver.com/beauty-joseon?ref=NAVER_SHOPPING_ID',
    platform: 'Naver Shopping'
  },
  
  {
    id: 'mediheal-masks',
    category: 'shop',
    subcategory: 'mask',
    name: { ko: '메디힐 마스크팩 30매', en: 'Mediheal Mask Pack 30pcs', ja: 'メディヒールマスク30枚', zh: 'Mediheal面膜30片' },
    description: { ko: '티트리 + NMF + 콜라겐', en: 'Tea Tree + NMF + Collagen', ja: 'ティーツリー＋NMF＋コラーゲン', zh: '茶樹＋NMF＋膠原蛋白' },
    price: { krw: 45000, usd: 35, jpy: 4900, twd: 1100 },
    discount: '25%',
    badge: 'discount',
    rating: 4.6,
    reviews: 4521,
    mediaType: 'image',
    mediaUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/mediheal?lptag=AF123456',
    platform: 'Coupang'
  }
];

// Subcategory definitions
const subcategories = {
  beauty: {
    massage: { ko: '마사지', en: 'Massage', ja: 'マッサージ', zh: '按摩' },
    headspa: { ko: '헤드스파', en: 'Head Spa', ja: 'ヘッドスパ', zh: '頭皮護理' },
    semipermanent: { ko: '반영구', en: 'Semi-Permanent', ja: '半永久', zh: '半永久' },
    facial: { ko: '페이셜', en: 'Facial', ja: 'フェイシャル', zh: '面部護理' }
  },
  tour: {
    cultural: { ko: '문화', en: 'Cultural', ja: '文化', zh: '文化' },
    food: { ko: '미식', en: 'Food', ja: 'グルメ', zh: '美食' },
    beauty: { ko: '뷰티', en: 'Beauty', ja: 'ビューティー', zh: '美容' },
    night: { ko: '야경', en: 'Night', ja: '夜景', zh: '夜景' }
  },
  shop: {
    skincare: { ko: '스킨케어', en: 'Skincare', ja: 'スキンケア', zh: '護膚' },
    suncare: { ko: '선케어', en: 'Sun Care', ja: 'サンケア', zh: '防曬' },
    mask: { ko: '마스크팩', en: 'Mask Pack', ja: 'マスクパック', zh: '面膜' }
  }
};

const translations = {
  ko: {
    nav: { beauty: '뷰티', tour: '투어', shop: '쇼핑', admin: '관리자', stats: '통계' },
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
    badges: { popular: '인기', recommended: '추천', newDeal: '신규', discount: '할인' }
  },
  en: {
    nav: { beauty: 'Beauty', tour: 'Tours', shop: 'Shop', admin: 'Admin', stats: 'Stats' },
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
    badges: { popular: 'Popular', recommended: 'Recommended', newDeal: 'New', discount: 'Sale' }
  },
  ja: {
    nav: { beauty: 'ビューティー', tour: 'ツアー', shop: 'ショップ', admin: '管理者', stats: '統計' },
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
    badges: { popular: '人気', recommended: 'おすすめ', newDeal: '新着', discount: 'セール' }
  },
  zh: {
    nav: { beauty: '美容', tour: '旅遊', shop: '購物', admin: '管理員', stats: '統計' },
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
    badges: { popular: '熱門', recommended: '推薦', newDeal: '新品', discount: '特價' }
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function trackClick(serviceId, category, platform, lang) {
  clickTracking.push({
    id: Date.now(),
    serviceId,
    category,
    platform,
    lang,
    timestamp: new Date().toISOString()
  });
  if (clickTracking.length > 1000) clickTracking = clickTracking.slice(-1000);
}

function getBadgeText(badge, lang) {
  const t = translations[lang];
  const map = {
    'popular': t.badges.popular,
    'recommended': t.badges.recommended,
    'newdeal': t.badges.newDeal,
    'discount': t.badges.discount
  };
  return map[badge] || badge;
}

function checkAuth(c) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return false;
  
  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

// ==========================================
// ADMIN PAGE HTML
// ==========================================

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
          padding: 20px;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        .header {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        h1 { font-size: 28px; }
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: 0.3s;
        }
        .btn-primary {
          background: #FF6B9D;
          color: white;
        }
        .btn-primary:hover { background: #e55a8a; }
        .btn-success {
          background: #10B981;
          color: white;
        }
        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          overflow-x: auto;
        }
        .tab {
          padding: 12px 24px;
          background: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #666;
          transition: 0.3s;
          white-space: nowrap;
        }
        .tab.active {
          background: #FF6B9D;
          color: white;
        }
        .content {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
        }
        .service-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .service-item {
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 16px;
          position: relative;
        }
        .service-item img {
          width: 100%;
          height: 180px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 12px;
        }
        .youtube-badge {
          position: absolute;
          top: 24px;
          right: 24px;
          background: #FF0000;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
        }
        .service-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .service-desc {
          font-size: 13px;
          color: #666;
          margin-bottom: 12px;
        }
        .service-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #e0e0e0;
        }
        .service-price {
          font-size: 18px;
          font-weight: 700;
          color: #FF6B9D;
        }
        .service-actions {
          display: flex;
          gap: 8px;
        }
        .btn-small {
          padding: 6px 12px;
          font-size: 12px;
        }
        .btn-edit { background: #F59E0B; color: white; }
        .btn-delete { background: #EF4444; color: white; }
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          z-index: 1000;
          align-items: center;
          justify-content: center;
        }
        .modal.active { display: flex; }
        .modal-content {
          background: white;
          padding: 32px;
          border-radius: 16px;
          max-width: 600px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
        }
        .form-group textarea {
          min-height: 80px;
          resize: vertical;
        }
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 24px;
        }
        .subcategory-badge {
          display: inline-block;
          padding: 4px 8px;
          background: #f0f0f0;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          margin-bottom: 8px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div>
            <h1>🎨 K-Beauty Seoul 관리자</h1>
            <p>서비스 관리 시스템</p>
          </div>
          <button class="btn btn-primary" onclick="openAddModal()">+ 새 서비스 추가</button>
        </div>
        
        <div class="tabs">
          <button class="tab active" onclick="filterCategory('all')">전체</button>
          <button class="tab" onclick="filterCategory('beauty')">뷰티</button>
          <button class="tab" onclick="filterCategory('tour')">투어</button>
          <button class="tab" onclick="filterCategory('shop')">쇼핑</button>
        </div>
        
        <div class="content">
          <div id="serviceGrid" class="service-grid"></div>
        </div>
      </div>
      
      <!-- Add/Edit Modal -->
      <div id="serviceModal" class="modal">
        <div class="modal-content">
          <h2 id="modalTitle">새 서비스 추가</h2>
          <form id="serviceForm" onsubmit="saveService(event)">
            <input type="hidden" id="serviceId">
            
            <div class="form-group">
              <label>카테고리 *</label>
              <select id="category" required onchange="updateSubcategories()">
                <option value="">선택하세요</option>
                <option value="beauty">뷰티</option>
                <option value="tour">투어</option>
                <option value="shop">쇼핑</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>하위 카테고리 *</label>
              <select id="subcategory" required>
                <option value="">먼저 카테고리를 선택하세요</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>미디어 타입 *</label>
              <select id="mediaType" required onchange="toggleMediaInput()">
                <option value="image">이미지</option>
                <option value="youtube">YouTube 영상</option>
              </select>
            </div>
            
            <div class="form-group" id="youtubeUrlGroup">
              <label>YouTube URL</label>
              <input type="url" id="mediaUrl" placeholder="https://www.youtube.com/watch?v=...">
              <small style="color: #666; font-size: 12px;">YouTube URL을 입력하면 자동으로 썸네일이 표시됩니다</small>
            </div>
            
            <div class="form-group">
              <label>이미지 URL (대체 이미지) *</label>
              <input type="url" id="imageUrl" required placeholder="https://...">
            </div>
            
            <div class="form-group">
              <label>제목 (한국어) *</label>
              <input type="text" id="nameKo" required>
            </div>
            
            <div class="form-group">
              <label>제목 (영어) *</label>
              <input type="text" id="nameEn" required>
            </div>
            
            <div class="form-group">
              <label>설명 (한국어) *</label>
              <textarea id="descKo" required></textarea>
            </div>
            
            <div class="form-group">
              <label>설명 (영어) *</label>
              <textarea id="descEn" required></textarea>
            </div>
            
            <div class="form-group">
              <label>가격 (KRW) *</label>
              <input type="number" id="priceKrw" required>
            </div>
            
            <div class="form-group">
              <label>제휴 링크 *</label>
              <input type="url" id="affiliateUrl" required>
            </div>
            
            <div class="form-group">
              <label>플랫폼</label>
              <input type="text" id="platform" placeholder="K-Beauty Seoul">
            </div>
            
            <div class="form-group">
              <label>소요 시간</label>
              <input type="text" id="duration" placeholder="90min">
            </div>
            
            <div class="form-group">
              <label>할인율 (%)</label>
              <input type="text" id="discount" placeholder="15">
            </div>
            
            <div class="form-group">
              <label>배지</label>
              <select id="badge">
                <option value="popular">인기</option>
                <option value="recommended">추천</option>
                <option value="newdeal">신규</option>
                <option value="discount">할인</option>
              </select>
            </div>
            
            <div class="form-actions">
              <button type="button" class="btn" onclick="closeModal()">취소</button>
              <button type="submit" class="btn btn-success">저장</button>
            </div>
          </form>
        </div>
      </div>
      
      <script>
        let currentFilter = 'all';
        
        const subcategoryOptions = {
          beauty: {
            massage: '마사지',
            headspa: '헤드스파',
            semipermanent: '반영구',
            facial: '페이셜'
          },
          tour: {
            cultural: '문화',
            food: '미식',
            beauty: '뷰티',
            night: '야경'
          },
          shop: {
            skincare: '스킨케어',
            suncare: '선케어',
            mask: '마스크팩'
          }
        };
        
        function updateSubcategories() {
          const category = document.getElementById('category').value;
          const subcategorySelect = document.getElementById('subcategory');
          subcategorySelect.innerHTML = '<option value="">선택하세요</option>';
          
          if (category && subcategoryOptions[category]) {
            Object.entries(subcategoryOptions[category]).forEach(([key, label]) => {
              const option = document.createElement('option');
              option.value = key;
              option.textContent = label;
              subcategorySelect.appendChild(option);
            });
          }
        }
        
        function toggleMediaInput() {
          const mediaType = document.getElementById('mediaType').value;
          const youtubeGroup = document.getElementById('youtubeUrlGroup');
          youtubeGroup.style.display = mediaType === 'youtube' ? 'block' : 'none';
        }
        
        async function loadServices() {
          const res = await fetch('/api/services');
          const services = await res.json();
          renderServices(services);
        }
        
        function renderServices(services) {
          const grid = document.getElementById('serviceGrid');
          const filtered = currentFilter === 'all' 
            ? services 
            : services.filter(s => s.category === currentFilter);
          
          grid.innerHTML = filtered.map(service => {
            const thumbnail = service.mediaType === 'youtube' && service.mediaUrl
              ? getYouTubeThumbnail(service.mediaUrl)
              : service.imageUrl;
            
            return \`
              <div class="service-item">
                \${service.mediaType === 'youtube' ? '<div class="youtube-badge">▶ YouTube</div>' : ''}
                <img src="\${thumbnail}" alt="\${service.name.ko}">
                <div class="subcategory-badge">\${getSubcategoryLabel(service.category, service.subcategory)}</div>
                <div class="service-title">\${service.name.ko}</div>
                <div class="service-desc">\${service.description.ko}</div>
                <div class="service-meta">
                  <div class="service-price">₩\${service.price.krw.toLocaleString()}</div>
                  <div class="service-actions">
                    <button class="btn btn-small btn-edit" onclick="editService('\${service.id}')">수정</button>
                    <button class="btn btn-small btn-delete" onclick="deleteService('\${service.id}')">삭제</button>
                  </div>
                </div>
              </div>
            \`;
          }).join('');
        }
        
        function getYouTubeThumbnail(url) {
          const videoId = extractYouTubeId(url);
          return videoId ? \`https://img.youtube.com/vi/\${videoId}/maxresdefault.jpg\` : '';
        }
        
        function extractYouTubeId(url) {
          const match = url.match(/(?:youtube\\.com\\/watch\\?v=|youtu\\.be\\/)([^&\\s]+)/);
          return match ? match[1] : null;
        }
        
        function getSubcategoryLabel(category, subcategory) {
          return subcategoryOptions[category]?.[subcategory] || subcategory;
        }
        
        function filterCategory(category) {
          currentFilter = category;
          document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
          event.target.classList.add('active');
          loadServices();
        }
        
        function openAddModal() {
          document.getElementById('modalTitle').textContent = '새 서비스 추가';
          document.getElementById('serviceForm').reset();
          document.getElementById('serviceId').value = '';
          document.getElementById('serviceModal').classList.add('active');
          toggleMediaInput();
        }
        
        async function editService(id) {
          const res = await fetch(\`/api/services/\${id}\`);
          const service = await res.json();
          
          document.getElementById('modalTitle').textContent = '서비스 수정';
          document.getElementById('serviceId').value = service.id;
          document.getElementById('category').value = service.category;
          updateSubcategories();
          document.getElementById('subcategory').value = service.subcategory;
          document.getElementById('mediaType').value = service.mediaType;
          document.getElementById('mediaUrl').value = service.mediaUrl || '';
          document.getElementById('imageUrl').value = service.imageUrl;
          document.getElementById('nameKo').value = service.name.ko;
          document.getElementById('nameEn').value = service.name.en;
          document.getElementById('descKo').value = service.description.ko;
          document.getElementById('descEn').value = service.description.en;
          document.getElementById('priceKrw').value = service.price.krw;
          document.getElementById('affiliateUrl').value = service.affiliateUrl;
          document.getElementById('platform').value = service.platform;
          document.getElementById('duration').value = service.duration || '';
          document.getElementById('discount').value = service.discount || '';
          document.getElementById('badge').value = service.badge;
          
          toggleMediaInput();
          document.getElementById('serviceModal').classList.add('active');
        }
        
        async function saveService(event) {
          event.preventDefault();
          
          const id = document.getElementById('serviceId').value;
          const data = {
            id: id || Date.now().toString(),
            category: document.getElementById('category').value,
            subcategory: document.getElementById('subcategory').value,
            mediaType: document.getElementById('mediaType').value,
            mediaUrl: document.getElementById('mediaUrl').value,
            imageUrl: document.getElementById('imageUrl').value,
            name: {
              ko: document.getElementById('nameKo').value,
              en: document.getElementById('nameEn').value,
              ja: document.getElementById('nameEn').value,
              zh: document.getElementById('nameEn').value
            },
            description: {
              ko: document.getElementById('descKo').value,
              en: document.getElementById('descEn').value,
              ja: document.getElementById('descEn').value,
              zh: document.getElementById('descEn').value
            },
            price: {
              krw: parseInt(document.getElementById('priceKrw').value),
              usd: Math.round(parseInt(document.getElementById('priceKrw').value) * 0.77),
              jpy: Math.round(parseInt(document.getElementById('priceKrw').value) * 0.108),
              twd: Math.round(parseInt(document.getElementById('priceKrw').value) * 0.024)
            },
            affiliateUrl: document.getElementById('affiliateUrl').value,
            platform: document.getElementById('platform').value,
            duration: document.getElementById('duration').value,
            discount: document.getElementById('discount').value,
            badge: document.getElementById('badge').value,
            rating: 4.8,
            reviews: 100
          };
          
          const method = id ? 'PUT' : 'POST';
          const url = id ? \`/api/services/\${id}\` : '/api/services';
          
          await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          closeModal();
          loadServices();
        }
        
        async function deleteService(id) {
          if (!confirm('정말 삭제하시겠습니까?')) return;
          
          await fetch(\`/api/services/\${id}\`, { method: 'DELETE' });
          loadServices();
        }
        
        function closeModal() {
          document.getElementById('serviceModal').classList.remove('active');
        }
        
        // Initialize
        loadServices();
        toggleMediaInput();
      </script>
    </body>
    </html>
  `;
}

// ==========================================
// Continue in next message due to length...

// ==========================================
// FRONTEND HTML GENERATION (SIMPLIFIED)
// ==========================================

function generateServiceCard(service, lang) {
  const t = translations[lang];
  const currencySymbol = {ko: '₩', en: '$', ja: '¥', zh: 'NT$'}[lang];
  const priceKey = {ko: 'krw', en: 'usd', ja: 'jpy', zh: 'twd'}[lang];
  
  // Use YouTube thumbnail if available
  let displayImage = service.imageUrl;
  if (service.mediaType === 'youtube' && service.mediaUrl) {
    const ytThumb = getYouTubeThumbnail(service.mediaUrl);
    if (ytThumb) displayImage = ytThumb;
  }
  
  return `
    <div class="service-card">
      <div class="service-image">
        <img src="${displayImage}" alt="${service.name[lang]}" loading="lazy">
        ${service.mediaType === 'youtube' ? '<div class="youtube-badge">▶ YouTube</div>' : ''}
        ${service.duration ? `<div class="service-badge">${service.duration}</div>` : ''}
        ${service.badge ? `
          <div class="badge-container">
            <span class="badge badge-${service.badge}">${getBadgeText(service.badge, lang)}</span>
          </div>
        ` : ''}
        ${service.discount ? `<div class="discount-badge">-${service.discount}</div>` : ''}
      </div>
      <div class="service-info">
        <div class="platform-tag">${service.platform}</div>
        <div class="subcategory-badge">${subcategories[service.category][service.subcategory][lang]}</div>
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
  const beautyServices = services.filter(s => s.category === 'beauty').slice(0, 3);
  const tourServices = services.filter(s => s.category === 'tour').slice(0, 3);
  const shopServices = services.filter(s => s.category === 'shop').slice(0, 3);
  
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>K-Beauty Seoul | ${t.hero.title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, sans-serif; }
        .nav { position: fixed; top: 0; width: 100%; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 100; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; }
        .hero { margin-top: 60px; padding: 60px 20px; background: linear-gradient(135deg, #FF6B9D, #FFC2D4); color: white; text-align: center; }
        .hero h1 { font-size: 32px; margin-bottom: 12px; }
        .section { padding: 40px 20px; }
        .section:nth-child(even) { background: #f8f9fa; }
        .section h2 { font-size: 24px; margin-bottom: 20px; }
        .service-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .service-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .service-image { position: relative; padding-top: 66%; }
        .service-image img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
        .youtube-badge { position: absolute; top: 10px; left: 10px; background: #FF0000; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
        .service-badge { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
        .badge-container { position: absolute; bottom: 10px; left: 10px; }
        .badge { padding: 4px 10px; border-radius: 10px; font-size: 11px; font-weight: 700; color: white; }
        .badge-popular { background: #FF6B9D; }
        .badge-recommended { background: #10B981; }
        .badge-newdeal { background: #F59E0B; }
        .badge-discount { background: #EF4444; }
        .discount-badge { position: absolute; bottom: 10px; right: 10px; background: #EF4444; color: white; padding: 6px 10px; border-radius: 6px; font-size: 13px; font-weight: 700; }
        .service-info { padding: 16px; }
        .platform-tag { display: inline-block; padding: 3px 8px; background: #f0f0f0; border-radius: 4px; font-size: 10px; margin-bottom: 8px; }
        .subcategory-badge { display: inline-block; padding: 3px 8px; background: #e3f2fd; border-radius: 4px; font-size: 10px; margin-bottom: 8px; margin-left: 4px; color: #1976d2; font-weight: 600; }
        .service-name { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
        .service-description { font-size: 13px; color: #666; margin-bottom: 12px; }
        .rating { font-size: 12px; margin-bottom: 12px; }
        .service-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #e0e0e0; }
        .price-amount { font-size: 18px; font-weight: 700; color: #FF6B9D; }
        .service-cta { padding: 8px 16px; background: #FF6B9D; color: white; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 13px; }
        .view-all { text-align: center; margin-top: 20px; }
        .view-all a { display: inline-block; padding: 12px 32px; background: #FF6B9D; color: white; text-decoration: none; border-radius: 8px; font-weight: 600; }
      </style>
    </head>
    <body>
      <nav class="nav">
        <div>K-Beauty Seoul</div>
        <div>
          <a href="/catalog/beauty?lang=${lang}">Beauty</a> | 
          <a href="/catalog/tour?lang=${lang}">Tours</a> | 
          <a href="/catalog/shop?lang=${lang}">Shop</a> | 
          <a href="/admin">Admin</a>
        </div>
      </nav>
      
      <div class="hero">
        <h1>${t.hero.title}</h1>
        <p>${t.hero.subtitle}</p>
      </div>
      
      <section class="section">
        <h2>${t.catalog.beauty}</h2>
        <div class="service-grid">
          ${beautyServices.map(s => generateServiceCard(s, lang)).join('')}
        </div>
        <div class="view-all">
          <a href="/catalog/beauty?lang=${lang}">${t.cta.viewAll}</a>
        </div>
      </section>
      
      <section class="section">
        <h2>${t.catalog.tour}</h2>
        <div class="service-grid">
          ${tourServices.map(s => generateServiceCard(s, lang)).join('')}
        </div>
        <div class="view-all">
          <a href="/catalog/tour?lang=${lang}">${t.cta.viewAll}</a>
        </div>
      </section>
      
      <section class="section">
        <h2>${t.catalog.shop}</h2>
        <div class="service-grid">
          ${shopServices.map(s => generateServiceCard(s, lang)).join('')}
        </div>
        <div class="view-all">
          <a href="/catalog/shop?lang=${lang}">${t.cta.viewAll}</a>
        </div>
      </section>
    </body>
    </html>
  `;
}

function generateCatalogPage(category, lang = 'en') {
  const t = translations[lang];
  const filtered = services.filter(s => s.category === category);
  
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.catalog[category]} | K-Beauty Seoul</title>
    </head>
    <body>
      <h1>${t.catalog[category]}</h1>
      <div class="service-grid">
        ${filtered.map(s => generateServiceCard(s, lang)).join('')}
      </div>
    </body>
    </html>
  `;
}

// ==========================================
// API ROUTES
// ==========================================

app.get('/api/services', (c) => {
  return c.json(services);
});

app.get('/api/services/:id', (c) => {
  const id = c.req.param('id');
  const service = services.find(s => s.id === id);
  if (!service) return c.json({ error: 'Not found' }, 404);
  return c.json(service);
});

app.post('/api/services', async (c) => {
  const data = await c.req.json();
  services.push(data);
  return c.json({ success: true, id: data.id });
});

app.put('/api/services/:id', async (c) => {
  const id = c.req.param('id');
  const data = await c.req.json();
  const index = services.findIndex(s => s.id === id);
  if (index === -1) return c.json({ error: 'Not found' }, 404);
  services[index] = data;
  return c.json({ success: true });
});

app.delete('/api/services/:id', (c) => {
  const id = c.req.param('id');
  services = services.filter(s => s.id !== id);
  return c.json({ success: true });
});

// ==========================================
// PUBLIC ROUTES
// ==========================================

app.get('/', (c) => {
  const lang = c.req.query('lang') || 'en';
  return c.html(generateHomePage(lang));
});

app.get('/catalog/:category', (c) => {
  const category = c.req.param('category');
  const lang = c.req.query('lang') || 'en';
  return c.html(generateCatalogPage(category, lang));
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

app.get('/admin', (c) => {
  return c.html(generateAdminPage());
});

app.get('/stats', (c) => {
  const totalClicks = clickTracking.length;
  const last24h = clickTracking.filter(c => (new Date() - new Date(c.timestamp)) < 24 * 60 * 60 * 1000).length;
  
  return c.html(`
    <html>
      <head><title>Stats</title></head>
      <body style="font-family: sans-serif; padding: 40px;">
        <h1>📊 통계</h1>
        <p>총 클릭: ${totalClicks}</p>
        <p>최근 24시간: ${last24h}</p>
      </body>
    </html>
  `);
});

app.use('/static/*', serveStatic({ root: './' }));

// ==========================================
// SERVER START
// ==========================================

const port = process.env.PORT || 3000;

serve({
  fetch: app.fetch,
  port
});

console.log(`✅ K-Beauty Seoul running on port ${port}`);
console.log(`🎨 Admin: http://localhost:${port}/admin`);
console.log(`📊 Stats: http://localhost:${port}/stats`);
