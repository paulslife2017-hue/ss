import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();

// ==========================================
// AFFILIATE & MULTILINGUAL CONFIGURATION
// ==========================================

const affiliateConfig = {
  partners: {
    kbeauty: 'KBSEOUL2025',
    klook: 'KLOOK_AFFILIATE_ID',
    kkday: 'KKDAY_AFFILIATE_ID',
    coupang: 'COUPANG_PARTNER_ID',
    naver: 'NAVER_SHOPPING_ID'
  },
  commission: {
    beauty: '10-15%',
    tour: '8-12%',
    shop: '5-10%'
  }
};

let clickTracking = [];

const translations = {
  ko: {
    nav: {
      beauty: '뷰티',
      tour: '투어',
      shop: '쇼핑',
      stats: '통계'
    },
    hero: {
      title: '서울 K-뷰티 가이드',
      subtitle: '최고의 한국 뷰티, 투어, 쇼핑 추천'
    },
    catalog: {
      beauty: '뷰티 서비스',
      beautyDesc: '강남 프리미엄 뷰티 트리트먼트',
      tour: '투어 프로그램',
      tourDesc: '서울 베스트 투어 & 체험',
      shop: '쇼핑',
      shopDesc: 'K-뷰티 인기 상품'
    },
    cta: {
      viewAll: '전체 보기 →',
      bookNow: '예약하기 →',
      shopNow: '구매하기 →'
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
      stats: 'Stats'
    },
    hero: {
      title: 'Seoul K-Beauty Guide',
      subtitle: 'Best Korean Beauty, Tours & Shopping'
    },
    catalog: {
      beauty: 'Beauty Services',
      beautyDesc: 'Premium Gangnam Beauty Treatments',
      tour: 'Tour Programs',
      tourDesc: 'Best Seoul Tours & Experiences',
      shop: 'Shopping',
      shopDesc: 'Trending K-Beauty Products'
    },
    cta: {
      viewAll: 'View All →',
      bookNow: 'Book Now →',
      shopNow: 'Shop Now →'
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
      stats: '統計'
    },
    hero: {
      title: 'ソウルKビューティーガイド',
      subtitle: '最高の韓国ビューティー、ツアー、ショッピング'
    },
    catalog: {
      beauty: 'ビューティーサービス',
      beautyDesc: '江南プレミアムビューティートリートメント',
      tour: 'ツアープログラム',
      tourDesc: 'ソウルベストツアー＆体験',
      shop: 'ショッピング',
      shopDesc: '人気Kビューティー商品'
    },
    cta: {
      viewAll: 'すべて見る →',
      bookNow: '予約する →',
      shopNow: '購入する →'
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
      stats: '統計'
    },
    hero: {
      title: '首爾K美容指南',
      subtitle: '最佳韓國美容、旅遊和購物'
    },
    catalog: {
      beauty: '美容服務',
      beautyDesc: '江南高級美容療程',
      tour: '旅遊方案',
      tourDesc: '首爾最佳行程與體驗',
      shop: '購物',
      shopDesc: '熱銷K美容商品'
    },
    cta: {
      viewAll: '查看全部 →',
      bookNow: '立即預訂 →',
      shopNow: '立即購買 →'
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
// SERVICE DATA BY CATEGORY
// ==========================================

const beautyServices = [
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
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/headspa?ref=KBSEOUL2025&utm_source=affiliate&utm_medium=website&utm_campaign=headspa',
    platform: 'K-Beauty Seoul',
    category: 'beauty'
  },
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
    imageUrl: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/lip-tattoo?ref=KBSEOUL2025&utm_source=affiliate&utm_medium=website&utm_campaign=liptattoo',
    platform: 'K-Beauty Seoul',
    category: 'beauty'
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
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/eyebrow?ref=KBSEOUL2025&utm_source=affiliate&utm_medium=website&utm_campaign=eyebrow',
    platform: 'K-Beauty Seoul',
    category: 'beauty'
  },
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
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/bb-glow?ref=KBSEOUL2025&utm_source=affiliate&utm_medium=website&utm_campaign=bbglow',
    platform: 'K-Beauty Seoul',
    category: 'beauty'
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
    imageUrl: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/glass-skin?ref=KBSEOUL2025&utm_source=affiliate&utm_medium=website&utm_campaign=glassskin',
    platform: 'K-Beauty Seoul',
    category: 'beauty'
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
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=600&fit=crop',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/aqua-peel?ref=KBSEOUL2025&utm_source=affiliate&utm_medium=website&utm_campaign=aquapeel',
    platform: 'K-Beauty Seoul',
    category: 'beauty'
  }
];

const tourPackages = [
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
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.klook.com/activity/kbeauty-tour-seoul?aid=KLOOK_AFFILIATE_ID&aff_adid=kbeauty',
    platform: 'Klook',
    category: 'tour'
  },
  {
    id: 'seoul-night',
    name: { ko: '서울 야경 투어', en: 'Seoul Night Tour', ja: 'ソウル夜景ツアー', zh: '首爾夜景之旅' },
    description: { ko: '남산타워, 한강, DDP 야경', en: 'Namsan Tower, Han River & DDP', ja: '南山タワー、漢江、DDP', zh: '南山塔、漢江、DDP' },
    price: { krw: 75000, usd: 58, jpy: 8100, twd: 1830 },
    badge: 'recommended',
    duration: '3hrs',
    rating: 4.8,
    reviews: 356,
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.kkday.com/seoul-night-tour?pid=KKDAY_AFFILIATE_ID&source=affiliate',
    platform: 'KKday',
    category: 'tour'
  },
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
    imageUrl: 'https://images.unsplash.com/photo-1583500557349-fb5238f8d946?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.klook.com/activity/hanbok-palace-tour?aid=KLOOK_AFFILIATE_ID&aff_adid=hanbok',
    platform: 'Klook',
    category: 'tour'
  },
  {
    id: 'gangnam-foodie',
    name: { ko: '강남 미식 투어', en: 'Gangnam Foodie Tour', ja: '江南グルメツアー', zh: '江南美食之旅' },
    description: { ko: '강남 핫플 레스토랑 7곳', en: '7 hottest Gangnam restaurants', ja: '江南人気レストラン7軒', zh: '江南7家熱門餐廳' },
    price: { krw: 120000, usd: 92, jpy: 13000, twd: 2900 },
    badge: 'newdeal',
    duration: '4hrs',
    rating: 4.7,
    reviews: 189,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    affiliateUrl: 'https://www.kkday.com/gangnam-food-tour?pid=KKDAY_AFFILIATE_ID&source=affiliate',
    platform: 'KKday',
    category: 'tour'
  }
];

const shopProducts = [
  {
    id: 'sulwhasoo-set',
    name: { ko: '설화수 진설 세트', en: 'Sulwhasoo Essential Set', ja: '雪花秀エッセンシャルセット', zh: '雪花秀精華套裝' },
    description: { ko: '한방 명품 화장품 베스트셀러', en: 'Premium herbal cosmetics', ja: '韓方高級化粧品', zh: '韓方高級化妝品' },
    price: { krw: 350000, usd: 269, jpy: 37900, twd: 8540 },
    discount: '18%',
    badge: 'popular',
    rating: 4.9,
    reviews: 1243,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/sulwhasoo?lptag=AF123456&subid=COUPANG_PARTNER_ID',
    platform: 'Coupang',
    category: 'shop'
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
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/whoo?lptag=AF123456&subid=COUPANG_PARTNER_ID',
    platform: 'Coupang',
    category: 'shop'
  },
  {
    id: 'cosrx-collection',
    name: { ko: 'COSRX 인기 제품', en: 'COSRX Bestseller', ja: 'COSRXベストセラー', zh: 'COSRX暢銷系列' },
    description: { ko: '여드름 피부 필수템', en: 'Acne skin essentials', ja: 'ニキビ肌必需品', zh: '痘痘肌必備' },
    price: { krw: 85000, usd: 65, jpy: 9200, twd: 2070 },
    discount: '15%',
    badge: 'popular',
    rating: 4.7,
    reviews: 2134,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/cosrx?lptag=AF123456&subid=COUPANG_PARTNER_ID',
    platform: 'Coupang',
    category: 'shop'
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
    imageUrl: 'https://images.unsplash.com/photo-1556229010-aa3bafc8e533?w=800&h=600&fit=crop',
    affiliateUrl: 'https://smartstore.naver.com/beauty-joseon?ref=NAVER_SHOPPING_ID',
    platform: 'Naver Shopping',
    category: 'shop'
  },
  {
    id: 'mediheal-masks',
    name: { ko: '메디힐 마스크팩 30매', en: 'Mediheal Mask Pack 30pcs', ja: 'メディヒールマスク30枚', zh: 'Mediheal面膜30片' },
    description: { ko: '티트리 + NMF + 콜라겐', en: 'Tea Tree + NMF + Collagen', ja: 'ティーツリー＋NMF＋コラーゲン', zh: '茶樹＋NMF＋膠原蛋白' },
    price: { krw: 45000, usd: 35, jpy: 4900, twd: 1100 },
    discount: '25%',
    badge: 'discount',
    rating: 4.6,
    reviews: 4521,
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=600&fit=crop',
    affiliateUrl: 'https://link.coupang.com/a/mediheal?lptag=AF123456&subid=COUPANG_PARTNER_ID',
    platform: 'Coupang',
    category: 'shop'
  }
];

// ==========================================
// HELPER FUNCTIONS
// ==========================================

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
  const map = { 'popular': t.badges.popular, 'recommended': t.badges.recommended, 'newdeal': t.badges.newDeal, 'discount': t.badges.discount };
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
        max-width: 1200px;
        margin: 0 auto;
      }
      .catalog-header {
        text-align: center;
        margin-bottom: 50px;
      }
      .catalog-title {
        font-size: 32px;
        font-weight: 700;
        color: var(--text-dark);
        margin-bottom: 12px;
      }
      .catalog-subtitle {
        font-size: 16px;
        color: var(--text-light);
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
      
      /* Service Grid */
      .service-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
      }
      .service-card {
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
      @media (min-width: 640px) {
        .service-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
      @media (min-width: 768px) {
        .nav-links { display: flex; }
        .hero-title { font-size: 48px; }
        .hero-subtitle { font-size: 20px; }
      }
      @media (min-width: 1024px) {
        .service-grid {
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .catalog-title { font-size: 40px; }
      }
    </style>
  `;
}

function generateServiceCard(service, lang) {
  const t = translations[lang];
  const currencySymbol = {ko: '₩', en: '$', ja: '¥', zh: 'NT$'}[lang];
  const priceKey = {ko: 'krw', en: 'usd', ja: 'jpy', zh: 'twd'}[lang];
  
  return `
    <div class="service-card">
      <div class="service-image">
        <img src="${service.imageUrl}" alt="${service.name[lang]}" loading="lazy">
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
            <a href="/stats" class="nav-link">${t.nav.stats}</a>
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
          <!-- Beauty Catalog -->
          <div class="category-card">
            <div class="category-header">
              <div class="category-info">
                <h3>${t.catalog.beauty}</h3>
                <p>${t.catalog.beautyDesc}</p>
              </div>
              <a href="/catalog/beauty?lang=${lang}" class="category-link">${t.cta.viewAll}</a>
            </div>
            <div class="service-grid">
              ${beautyServices.slice(0, 3).map(s => generateServiceCard(s, lang)).join('')}
            </div>
          </div>
          
          <!-- Tour Catalog -->
          <div class="category-card">
            <div class="category-header">
              <div class="category-info">
                <h3>${t.catalog.tour}</h3>
                <p>${t.catalog.tourDesc}</p>
              </div>
              <a href="/catalog/tour?lang=${lang}" class="category-link">${t.cta.viewAll}</a>
            </div>
            <div class="service-grid">
              ${tourPackages.slice(0, 3).map(s => generateServiceCard(s, lang)).join('')}
            </div>
          </div>
          
          <!-- Shop Catalog -->
          <div class="category-card">
            <div class="category-header">
              <div class="category-info">
                <h3>${t.catalog.shop}</h3>
                <p>${t.catalog.shopDesc}</p>
              </div>
              <a href="/catalog/shop?lang=${lang}" class="category-link">${t.cta.viewAll}</a>
            </div>
            <div class="service-grid">
              ${shopProducts.slice(0, 3).map(s => generateServiceCard(s, lang)).join('')}
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

function generateCatalogPage(category, lang = 'en') {
  const t = translations[lang];
  let items = [];
  let title = '';
  let desc = '';
  
  if (category === 'beauty') {
    items = beautyServices;
    title = t.catalog.beauty;
    desc = t.catalog.beautyDesc;
  } else if (category === 'tour') {
    items = tourPackages;
    title = t.catalog.tour;
    desc = t.catalog.tourDesc;
  } else if (category === 'shop') {
    items = shopProducts;
    title = t.catalog.shop;
    desc = t.catalog.shopDesc;
  }
  
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} | K-Beauty Seoul</title>
      <meta name="description" content="${desc}">
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
            <a href="/stats" class="nav-link">${t.nav.stats}</a>
          </div>
          <select onchange="window.location.href='/catalog/${category}?lang='+this.value" class="lang-select">
            <option value="ko" ${lang === 'ko' ? 'selected' : ''}>🇰🇷 한국어</option>
            <option value="en" ${lang === 'en' ? 'selected' : ''}>🇺🇸 English</option>
            <option value="ja" ${lang === 'ja' ? 'selected' : ''}>🇯🇵 日本語</option>
            <option value="zh" ${lang === 'zh' ? 'selected' : ''}>🇹🇼 繁體中文</option>
          </select>
        </div>
      </nav>
      
      <section class="catalog-section" style="margin-top: 56px;">
        <div class="catalog-container">
          <div class="catalog-header">
            <h1 class="catalog-title">${title}</h1>
            <p class="catalog-subtitle">${desc}</p>
          </div>
          <div class="service-grid">
            ${items.map(item => generateServiceCard(item, lang)).join('')}
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

function generateStatsPage() {
  const totalClicks = clickTracking.length;
  const last24h = clickTracking.filter(c => (new Date() - new Date(c.timestamp)) < 24 * 60 * 60 * 1000).length;
  const byCategory = clickTracking.reduce((acc, c) => { acc[c.category] = (acc[c.category] || 0) + 1; return acc; }, {});
  const byPlatform = clickTracking.reduce((acc, c) => { acc[c.platform] = (acc[c.platform] || 0) + 1; return acc; }, {});
  
  return `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>제휴 통계 | K-Beauty Seoul</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
          background: #f5f5f5;
          padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header {
          background: white;
          padding: 24px;
          border-radius: 16px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
          margin-bottom: 24px;
        }
        h1 { font-size: 28px; margin-bottom: 8px; }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
        }
        .stat-card.primary { background: linear-gradient(135deg, #FF6B9D, #FFC2D4); color: white; }
        .stat-card.success { background: linear-gradient(135deg, #10B981, #6EE7B7); color: white; }
        .stat-label { font-size: 14px; opacity: 0.9; margin-bottom: 8px; }
        .stat-value { font-size: 36px; font-weight: 700; }
        .chart-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 20px rgba(0,0,0,0.08);
          margin-bottom: 24px;
        }
        .chart-title { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
        .chart-bar {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        .chart-label { width: 120px; font-size: 14px; font-weight: 600; }
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
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 제휴 마케팅 통계</h1>
          <p>K-Beauty Seoul 어필리에이트 대시보드</p>
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
            <div class="stat-label">예상 수익</div>
            <div class="stat-value">₩${(totalClicks * 15000).toLocaleString()}</div>
          </div>
        </div>
        
        <div class="chart-card">
          <div class="chart-title">카테고리별 클릭</div>
          ${Object.entries(byCategory).map(([cat, count]) => {
            const max = Math.max(...Object.values(byCategory));
            const pct = (count / max) * 100;
            return `
              <div class="chart-bar">
                <div class="chart-label">${cat}</div>
                <div class="chart-bar-fill" style="width: ${pct}%;">${count}</div>
              </div>
            `;
          }).join('')}
        </div>
        
        <div class="chart-card">
          <div class="chart-title">플랫폼별 클릭</div>
          ${Object.entries(byPlatform).map(([platform, count]) => {
            const max = Math.max(...Object.values(byPlatform));
            const pct = (count / max) * 100;
            return `
              <div class="chart-bar">
                <div class="chart-label">${platform}</div>
                <div class="chart-bar-fill" style="width: ${pct}%;">${count}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
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
  return c.html(generateCatalogPage(category, lang));
});

app.get('/track/:serviceId', (c) => {
  const serviceId = c.req.param('serviceId');
  const category = c.req.query('category') || 'unknown';
  const lang = c.req.query('lang') || 'en';
  
  let service = null;
  if (category === 'beauty') service = beautyServices.find(s => s.id === serviceId);
  else if (category === 'tour') service = tourPackages.find(s => s.id === serviceId);
  else if (category === 'shop') service = shopProducts.find(s => s.id === serviceId);
  
  if (service) {
    trackClick(serviceId, category, service.platform, lang);
    return c.redirect(service.affiliateUrl);
  }
  
  return c.redirect('https://kbeautyseoul.co.kr');
});

app.get('/stats', (c) => {
  return c.html(generateStatsPage());
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

console.log(`✅ K-Beauty Seoul Affiliate running on port ${port}`);
