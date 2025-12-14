import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { compress } from 'hono/compress';
import { blogArticles } from './blog-articles.js';

const app = new Hono();

// ==========================================
// SECURITY HEADERS - Protection against attacks
// ==========================================

// Apply security headers to all routes
app.use('*', async (c, next) => {
  await next();
  
  // CSP (Content Security Policy) - Prevents XSS attacks
  c.header('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://adservice.google.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https: http:; " +
    "connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com; " +
    "frame-src 'self' https://pagead2.googlesyndication.com https://www.youtube.com; " +
    "object-src 'none'; " +
    "base-uri 'self';"
  );
  
  // HSTS (HTTP Strict Transport Security) - Forces HTTPS
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // COOP (Cross-Origin-Opener-Policy) - Prevents cross-origin attacks
  c.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  
  // XFO (X-Frame-Options) - Prevents clickjacking
  c.header('X-Frame-Options', 'SAMEORIGIN');
  
  // Additional security headers
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
});

// ==========================================
// PERFORMANCE OPTIMIZATION: Compression & Caching
// ==========================================

// Enable Gzip compression for all responses
app.use('*', compress({
  encoding: 'gzip',
  threshold: 1024 // Only compress responses > 1KB
}));

// Cache headers for static assets
app.use('/public/*', async (c, next) => {
  await next();
  // Cache static files for 1 year (immutable)
  c.header('Cache-Control', 'public, max-age=31536000, immutable');
});

// Cache headers for JavaScript files (code-split modules)
app.use('/js/*', async (c, next) => {
  await next();
  // Cache JS files for 7 days (shorter for quick updates)
  c.header('Cache-Control', 'public, max-age=604800, immutable');
  c.header('Content-Type', 'application/javascript; charset=utf-8');
});

// Cache headers for images with optimization hints
app.use('/images/*', async (c, next) => {
  await next();
  // Cache images for 30 days
  c.header('Cache-Control', 'public, max-age=2592000, immutable');
  // Image optimization hints
  c.header('Accept-CH', 'DPR, Viewport-Width, Width');
  c.header('Vary', 'Accept, DPR, Viewport-Width, Width');
});

// Inform browser about external resources (AdSense) for better caching
app.use('*', async (c, next) => {
  await next();
  // Resource hints for better performance
  c.header('Link', '<https://pagead2.googlesyndication.com>; rel=dns-prefetch, <https://pagead2.googlesyndication.com>; rel=preconnect');
});

// PWA - Service Worker (no cache, always fresh)
app.get('/service-worker.js', serveStatic({ 
  root: './public',
  onNotFound: (path, c) => c.text('Service Worker not found', 404)
}));
app.use('/service-worker.js', async (c, next) => {
  await next();
  c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  c.header('Content-Type', 'application/javascript');
});

// PWA - Manifest
app.get('/manifest.json', serveStatic({ 
  root: './public',
  onNotFound: (path, c) => c.text('Manifest not found', 404)
}));
app.use('/manifest.json', async (c, next) => {
  await next();
  c.header('Cache-Control', 'public, max-age=86400'); // 1 day
  c.header('Content-Type', 'application/json');
});

// PWA - Offline page
app.get('/offline.html', serveStatic({ 
  root: './public',
  onNotFound: (path, c) => c.text('Offline page not found', 404)
}));

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
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1515688594390-b649af70d282?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/aqua-peel?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'facial'
  },
  // Beauty - Massage (Additional)
  {
    id: 'aromatherapy-massage',
    name: { ko: '아로마테라피 마사지', en: 'Aromatherapy Massage', ja: 'アロマセラピーマッサージ', zh: '芳香療法按摩' },
    description: { ko: '천연 에센셜 오일로 힐링하는 전신 마사지', en: 'Full body massage with natural essential oils', ja: '天然エッセンシャルオイルで癒す全身マッサージ', zh: '天然精油全身按摩' },
    price: { krw: 180000, usd: 138, jpy: 19500, twd: 4400 },
    discount: '15%',
    badge: 'recommended',
    duration: '120min',
    rating: 4.9,
    reviews: 567,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/aromatherapy?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'massage'
  },
  {
    id: 'deep-tissue-massage',
    name: { ko: '딥티슈 마사지', en: 'Deep Tissue Massage', ja: 'ディープティシューマッサージ', zh: '深層組織按摩' },
    description: { ko: '근육 깊숙이 풀어주는 강력한 마사지', en: 'Intense massage for deep muscle relief', ja: '筋肉の奥深くほぐす強力なマッサージ', zh: '深層肌肉放鬆按摩' },
    price: { krw: 200000, usd: 154, jpy: 21600, twd: 4880 },
    badge: 'popular',
    duration: '90min',
    rating: 4.8,
    reviews: 423,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/deep-tissue?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'massage'
  },
  {
    id: 'hot-stone-massage',
    name: { ko: '핫스톤 마사지', en: 'Hot Stone Massage', ja: 'ホットストーンマッサージ', zh: '熱石按摩' },
    description: { ko: '따뜻한 현무암으로 혈액순환 촉진', en: 'Warm basalt stones for circulation', ja: '温かい玄武岩で血行促進', zh: '溫熱玄武岩促進血液循環' },
    price: { krw: 220000, usd: 169, jpy: 23800, twd: 5370 },
    discount: '10%',
    badge: 'newdeal',
    duration: '90min',
    rating: 4.9,
    reviews: 312,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/hot-stone?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'massage'
  },
  // Beauty - Facial (Additional)
  {
    id: 'oxygen-facial',
    name: { ko: '산소 페이셜', en: 'Oxygen Facial', ja: '酸素フェイシャル', zh: '氧氣面部護理' },
    description: { ko: '고농도 산소로 피부 활력 충전', en: 'High-concentration oxygen revitalization', ja: '高濃度酸素で肌活力チャージ', zh: '高濃度氧氣活化肌膚' },
    price: { krw: 200000, usd: 154, jpy: 21600, twd: 4880 },
    badge: 'recommended',
    duration: '75min',
    rating: 4.8,
    reviews: 234,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/oxygen-facial?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'facial'
  },
  {
    id: 'collagen-facial',
    name: { ko: '콜라겐 부스팅 페이셜', en: 'Collagen Boosting Facial', ja: 'コラーゲンブースティングフェイシャル', zh: '膠原蛋白提升面部護理' },
    description: { ko: '콜라겐 생성 촉진으로 탄력있는 피부', en: 'Boost collagen for firm skin', ja: 'コラーゲン生成促進で弾力肌', zh: '促進膠原蛋白生成緊緻肌膚' },
    price: { krw: 230000, usd: 177, jpy: 24900, twd: 5610 },
    discount: '15%',
    badge: 'popular',
    duration: '90min',
    rating: 4.9,
    reviews: 456,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/collagen-facial?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'facial'
  },
  {
    id: 'led-light-therapy',
    name: { ko: 'LED 라이트 테라피', en: 'LED Light Therapy', ja: 'LEDライトセラピー', zh: 'LED光療' },
    description: { ko: '빛으로 피부 재생, 여드름 개선', en: 'Light therapy for skin regeneration', ja: '光で肌再生、ニキビ改善', zh: '光療促進肌膚再生' },
    price: { krw: 170000, usd: 131, jpy: 18400, twd: 4150 },
    badge: 'newdeal',
    duration: '60min',
    rating: 4.7,
    reviews: 189,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1629397685936-3d6a9682ec63?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/led-therapy?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'facial'
  },
  // Beauty - Semi-Permanent (Additional)
  {
    id: 'eyeliner-tattoo',
    name: { ko: '아이라인 문신', en: 'Eyeliner Tattoo', ja: 'アイラインタトゥー', zh: '眼線紋繡' },
    description: { ko: '자연스러운 아이라인으로 또렷한 눈매', en: 'Natural eyeliner for defined eyes', ja: '自然なアイラインではっきりした目元', zh: '自然眼線讓眼睛更有神' },
    price: { krw: 380000, usd: 292, jpy: 41000, twd: 9270 },
    discount: '18%',
    badge: 'popular',
    duration: '90min',
    rating: 4.8,
    reviews: 298,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1583001308194-8c68f0e11012?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/eyeliner?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'semipermanent'
  },
  {
    id: 'hairline-tattoo',
    name: { ko: '헤어라인 문신', en: 'Hairline Tattoo', ja: 'ヘアラインタトゥー', zh: '髮際線紋繡' },
    description: { ko: '헤어라인 보정으로 완벽한 이마 라인', en: 'Perfect forehead line with hairline correction', ja: 'ヘアライン補正で完璧な額ライン', zh: '完美額頭線條髮際線修正' },
    price: { krw: 650000, usd: 500, jpy: 70300, twd: 15860 },
    badge: 'recommended',
    duration: '150min',
    rating: 4.9,
    reviews: 167,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1595475884562-073c30d45670?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/hairline?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'semipermanent'
  },
  // Beauty - Head Spa (Additional)
  {
    id: 'scalp-detox',
    name: { ko: '두피 디톡스 케어', en: 'Scalp Detox Care', ja: '頭皮デトックスケア', zh: '頭皮排毒護理' },
    description: { ko: '모공 속 노폐물 제거, 건강한 두피', en: 'Deep pore cleansing for healthy scalp', ja: '毛穴の老廃物除去、健康な頭皮', zh: '深層清潔毛孔健康頭皮' },
    price: { krw: 140000, usd: 108, jpy: 15100, twd: 3410 },
    discount: '12%',
    badge: 'popular',
    duration: '75min',
    rating: 4.8,
    reviews: 389,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/scalp-detox?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'headspa'
  },
  {
    id: 'hair-loss-treatment',
    name: { ko: '탈모 케어 프로그램', en: 'Hair Loss Treatment Program', ja: '脱毛ケアプログラム', zh: '脫髮護理方案' },
    description: { ko: '전문 탈모 케어로 모발 건강 회복', en: 'Professional hair loss care for healthy hair', ja: '専門脱毛ケアで毛髪健康回復', zh: '專業脫髮護理恢復髮質健康' },
    price: { krw: 250000, usd: 192, jpy: 27000, twd: 6100 },
    badge: 'recommended',
    duration: '120min',
    rating: 4.9,
    reviews: 234,
    youtubeUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
    affiliateUrl: 'https://kbeautyseoul.co.kr/booking/hair-loss?ref=KBSEOUL2025',
    platform: 'K-Beauty Seoul',
    category: 'beauty',
    subcategory: 'headspa'
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
    imageUrl: 'https://images.unsplash.com/photo-1583500557349-fb5238f8d946?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1556229010-aa3bafc8e533?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
    imageUrl: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&h=600&fit=crop&q=80&fm=webp&auto=format',
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
      
      /* Quick Links Hover Effects */
      a[href*="kbeautyseoul.co.kr/booking"]:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 32px rgba(255, 107, 157, 0.3) !important;
        border-color: #FF6B9D !important;
      }
      a[href*="/blog"]:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(255, 107, 157, 0.2) !important;
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
  
  // Get featured content
  const featuredBlogs = blogArticles.slice(0, 3);
  const popularServices = services.filter(s => s.category === 'beauty').slice(0, 4);
  const latestBlogs = blogArticles.slice(3, 9);
  
  // Translations for new homepage
  const homeTexts = {
    ko: {
      officialBadge: 'kbeautyseoul.co.kr 공식 가이드 블로그',
      heroTitle: '당신의 프리미엄\nK-뷰티 가이드',
      heroSubtitle: '검증된 업체 • 영어 지원 • 투명한 가격 • 안전한 예약',
      bookNow: '지금 예약하기',
      readGuides: '가이드 읽기',
      featuredTitle: '📌 추천 가이드',
      featuredSubtitle: '가장 인기 있는 K-뷰티 정보를 확인하세요',
      servicesTitle: '💎 인기 서비스',
      servicesSubtitle: '검증된 프리미엄 K-뷰티 서비스',
      whyChooseTitle: '왜 K-Beauty Seoul인가?',
      whyChooseSubtitle: '신뢰할 수 있는 K-뷰티 파트너',
      verifiedTitle: '검증된 업체',
      verifiedDesc: '모든 제휴 업체는 철저한 검증을 거쳤습니다',
      englishTitle: '영어 지원',
      englishDesc: '24/7 영어 고객 지원 서비스',
      pricingTitle: '투명한 가격',
      pricingDesc: '숨겨진 비용 없는 명확한 가격 정책',
      safeTitle: '안전한 예약',
      safeDesc: '안전하고 신뢰할 수 있는 예약 시스템',
      latestTitle: '📚 최신 블로그',
      latestSubtitle: '새로운 K-뷰티 정보와 팁',
      viewAllGuides: '모든 가이드 보기',
      viewAllPosts: '모든 포스트 보기',
      footerDesc: 'kbeautyseoul.co.kr의 공식 정보 블로그입니다',
      footerRights: '모든 권리 보유'
    },
    en: {
      officialBadge: 'Official Guide Blog of kbeautyseoul.co.kr',
      heroTitle: 'Your Premium\nK-Beauty Guide',
      heroSubtitle: 'Verified Providers • English Support • Transparent Pricing • Safe Booking',
      bookNow: 'Book Now',
      readGuides: 'Read Guides',
      featuredTitle: '📌 Featured Guides',
      featuredSubtitle: 'Discover the most popular K-Beauty information',
      servicesTitle: '💎 Popular Services',
      servicesSubtitle: 'Verified Premium K-Beauty Services',
      whyChooseTitle: 'Why K-Beauty Seoul?',
      whyChooseSubtitle: 'Your Trusted K-Beauty Partner',
      verifiedTitle: 'Verified Providers',
      verifiedDesc: 'All partners are thoroughly verified',
      englishTitle: 'English Support',
      englishDesc: '24/7 English customer support',
      pricingTitle: 'Transparent Pricing',
      pricingDesc: 'Clear pricing with no hidden costs',
      safeTitle: 'Safe Booking',
      safeDesc: 'Secure and reliable booking system',
      latestTitle: '📚 Latest Blog Posts',
      latestSubtitle: 'New K-Beauty tips and information',
      viewAllGuides: 'View All Guides',
      viewAllPosts: 'View All Posts',
      footerDesc: 'Official guide blog of kbeautyseoul.co.kr',
      footerRights: 'All rights reserved'
    },
    ja: {
      officialBadge: 'kbeautyseoul.co.kr 公式ガイドブログ',
      heroTitle: 'あなたのプレミアム\nK-Beautyガイド',
      heroSubtitle: '検証済み • 英語対応 • 透明な価格 • 安全予約',
      bookNow: '今すぐ予約',
      readGuides: 'ガイドを読む',
      featuredTitle: '📌 おすすめガイド',
      featuredSubtitle: '人気のK-Beauty情報をチェック',
      servicesTitle: '💎 人気サービス',
      servicesSubtitle: '検証済みプレミアムK-Beautyサービス',
      whyChooseTitle: 'なぜK-Beauty Seoul?',
      whyChooseSubtitle: '信頼できるK-Beautyパートナー',
      verifiedTitle: '検証済み',
      verifiedDesc: 'すべての提携先は徹底的に検証されています',
      englishTitle: '英語対応',
      englishDesc: '24/7英語カスタマーサポート',
      pricingTitle: '透明な価格',
      pricingDesc: '隠れた費用のない明確な価格',
      safeTitle: '安全予約',
      safeDesc: '安全で信頼できる予約システム',
      latestTitle: '📚 最新ブログ',
      latestSubtitle: '新しいK-Beauty情報とヒント',
      viewAllGuides: 'すべてのガイドを見る',
      viewAllPosts: 'すべての投稿を見る',
      footerDesc: 'kbeautyseoul.co.krの公式ガイドブログ',
      footerRights: '全著作権所有'
    }
  };
  
  const txt = homeTexts[lang] || homeTexts.en;
  
  return `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>K-Beauty Seoul | ${t.hero.title}</title>
      <meta name="description" content="${t.hero.subtitle}">
      
      <!-- Google AdSense - 자동 광고 -->
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134"
           crossorigin="anonymous"></script>
      
      ${generateStyles()}
    </head>
    <body>
      <nav class="nav">
        <div class="nav-container">
          <div class="logo">
            <a href="/?lang=${lang}" style="text-decoration: none;">
              <img src="https://via.placeholder.com/120x40/FF6B9D/FFFFFF?text=K-Beauty+Seoul" alt="K-Beauty Seoul" style="display: block; margin-bottom: 2px;">
              <div style="font-size: 10px; color: #FF6B9D; text-align: center; font-weight: 600; letter-spacing: 0.5px;">
                ${lang === 'ko' ? '🏆 kbeautyseoul.co.kr 공식 블로그' : lang === 'ja' ? '🏆 kbeautyseoul.co.kr 公式ブログ' : '🏆 Official Blog of kbeautyseoul.co.kr'}
              </div>
            </a>
          </div>
          <div class="nav-links">
            <a href="/catalog/beauty?lang=${lang}" class="nav-link">${t.nav.beauty}</a>
            <a href="/catalog/tour?lang=${lang}" class="nav-link">${t.nav.tour}</a>
            <a href="/catalog/shop?lang=${lang}" class="nav-link">${t.nav.shop}</a>
            <a href="/blog?lang=${lang}" class="nav-link" style="color: #FF6B9D; font-weight: 700;">📝 Blog</a>
          </div>
          <select onchange="window.location.href='/?lang='+this.value" class="lang-select">
            <option value="ko" ${lang === 'ko' ? 'selected' : ''}>🇰🇷 한국어</option>
            <option value="en" ${lang === 'en' ? 'selected' : ''}>🇺🇸 English</option>
            <option value="ja" ${lang === 'ja' ? 'selected' : ''}>🇯🇵 日本語</option>
            <option value="zh" ${lang === 'zh' ? 'selected' : ''}>🇹🇼 繁體中文</option>
          </select>
        </div>
      </nav>
      
      <!-- Fixed CTA Button: Book Now -->
      <a href="https://kbeautyseoul.co.kr?ref=KBSEOUL2025&utm_source=blog&utm_medium=fixed_cta" 
         target="_blank"
         style="position: fixed; bottom: 30px; right: 30px; z-index: 9999; 
                background: linear-gradient(135deg, #FF6B9D 0%, #FF8FB3 100%); 
                color: white; padding: 18px 32px; border-radius: 50px; 
                text-decoration: none; font-weight: 700; font-size: 16px; 
                box-shadow: 0 8px 24px rgba(255, 107, 157, 0.5); 
                transition: all 0.3s ease; display: flex; align-items: center; gap: 10px;
                animation: pulse 2s infinite; border: 3px solid rgba(255,255,255,0.3);">
        <span style="font-size: 24px;">📅</span>
        <span>${lang === 'ko' ? '지금 예약' : lang === 'ja' ? '今すぐ予約' : 'Book Now'}</span>
      </a>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 24px rgba(255, 107, 157, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 12px 32px rgba(255, 107, 157, 0.6); }
        }
        a[href*="kbeautyseoul.co.kr"]:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(255, 107, 157, 0.6);
        }
      </style>
      
      <section class="hero">
        <div class="hero-video-container">
          <video autoplay muted loop playsinline class="hero-video">
            <source src="https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4" type="video/mp4">
          </video>
          <div class="hero-overlay"></div>
        </div>
        <div class="hero-content">
          <!-- Official Blog Badge -->
          <div style="display: inline-block; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); 
                      padding: 12px 24px; border-radius: 50px; margin-bottom: 24px;
                      box-shadow: 0 8px 32px rgba(0,0,0,0.1); border: 2px solid rgba(255,107,157,0.3);">
            <span style="font-size: 18px; font-weight: 700; color: #FF6B9D; letter-spacing: 0.5px;">
              🏆 ${txt.officialBadge}
            </span>
          </div>
          
          <h1 class="hero-title" style="font-size: 64px; font-weight: 900; line-height: 1.2; margin-bottom: 24px;">
            ${txt.heroTitle.replace('\\n', '<br>')}
          </h1>
          <p class="hero-subtitle" style="font-size: 22px; margin-bottom: 40px;">
            ${txt.heroSubtitle}
          </p>
          
          <!-- Trust Badges -->
          <div style="display: flex; justify-content: center; gap: 32px; margin: 32px 0; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.95); 
                        padding: 12px 20px; border-radius: 12px; backdrop-filter: blur(10px);">
              <span style="font-size: 20px;">✅</span>
              <span style="font-weight: 600; color: #333;">${lang === 'ko' ? '검증된 서비스' : lang === 'ja' ? '検証済みサービス' : 'Verified Services'}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.95); 
                        padding: 12px 20px; border-radius: 12px; backdrop-filter: blur(10px);">
              <span style="font-size: 20px;">🏥</span>
              <span style="font-weight: 600; color: #333;">${lang === 'ko' ? '150+ 제휴 업체' : lang === 'ja' ? '150+ 提携先' : '150+ Providers'}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.95); 
                        padding: 12px 20px; border-radius: 12px; backdrop-filter: blur(10px);">
              <span style="font-size: 20px;">🕐</span>
              <span style="font-weight: 600; color: #333;">${lang === 'ko' ? '24/7 영어 지원' : lang === 'ja' ? '24/7 英語サポート' : '24/7 English Support'}</span>
            </div>
          </div>
          
          <!-- Premium Service Banner -->
          <div style="display: inline-block; background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); 
                      padding: 16px 32px; border-radius: 50px; margin: 24px 0;
                      box-shadow: 0 8px 32px rgba(255, 165, 0, 0.4); border: 3px solid rgba(255,255,255,0.5);
                      animation: pulse 2s infinite;">
            <span style="font-size: 24px; font-weight: 900; color: white; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              ✨ ${lang === 'ko' ? '프리미엄 K-뷰티 서비스 예약' : lang === 'ja' ? 'プレミアムK-Beautyサービス予約' : 'Book Premium K-Beauty Services'}
            </span>
          </div>
          
          <!-- Hero CTA Buttons -->
          <div style="display: flex; gap: 16px; justify-content: center; margin-top: 24px; flex-wrap: wrap;">
            <a href="https://kbeautyseoul.co.kr?ref=KBSEOUL2025&utm_source=blog&utm_medium=hero_cta" 
               target="_blank"
               style="display: inline-flex; align-items: center; gap: 10px;
                      background: linear-gradient(135deg, #FF6B9D 0%, #FF8FB3 100%); 
                      color: white; padding: 20px 56px; border-radius: 50px; text-decoration: none; 
                      font-weight: 700; font-size: 20px; box-shadow: 0 8px 24px rgba(255, 107, 157, 0.5);
                      transition: all 0.3s ease; border: 3px solid rgba(255,255,255,0.3);">
              <span style="font-size: 28px;">📅</span>
              <span>${txt.bookNow}</span>
            </a>
            <a href="/blog?lang=${lang}" 
               style="display: inline-flex; align-items: center; gap: 10px;
                      background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
                      color: #FF6B9D; padding: 20px 56px; border-radius: 50px; text-decoration: none; 
                      font-weight: 700; font-size: 20px; border: 3px solid rgba(255,107,157,0.4);
                      transition: all 0.3s ease;">
              <span style="font-size: 28px;">📖</span>
              <span>${txt.readGuides}</span>
            </a>
          </div>
          
          <div class="affiliate-badge" style="margin-top: 24px;">
            <span>🏆</span>
            <span>${lang === 'ko' ? '검증된 업체 • 영어 지원 • 투명한 가격 • 안전한 예약' : lang === 'ja' ? '検証済み • 英語対応 • 透明な価格 • 安全予約' : 'Verified Providers • English Support • Transparent Pricing • Safe Booking'}</span>
          </div>
        </div>
      </section>
      
      <!-- Quick Links Section -->
      <section style="background: linear-gradient(135deg, #FFF5F8 0%, #FFE8EF 100%); padding: 60px 20px;">
        <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
          <!-- Featured Services Badge -->
          <div style="display: inline-block; background: linear-gradient(135deg, #FF6B9D 0%, #FF8FB3 100%); 
                      padding: 10px 24px; border-radius: 50px; margin-bottom: 20px;
                      box-shadow: 0 4px 16px rgba(255, 107, 157, 0.3);">
            <span style="font-size: 14px; font-weight: 700; color: white; letter-spacing: 1px;">
              ⭐ ${lang === 'ko' ? '프리미엄 서비스 • 영어 지원' : lang === 'ja' ? 'プレミアムサービス • 英語対応' : 'PREMIUM SERVICES • ENGLISH SUPPORT'}
            </span>
          </div>
          
          <h2 style="font-size: 32px; font-weight: 700; color: #333; margin-bottom: 16px;">
            ${lang === 'ko' ? '🔥 인기 K-뷰티 서비스' : lang === 'ja' ? '🔥 人気K-Beautyサービス' : '🔥 Most Popular K-Beauty Services'}
          </h2>
          <p style="font-size: 18px; color: #666; margin-bottom: 40px;">
            ${lang === 'ko' ? '검증된 업체 • 투명한 가격 • 안전한 예약 • 24/7 영어 지원' : lang === 'ja' ? '検証済み • 透明な価格 • 安全予約 • 24/7英語サポート' : 'Verified Providers • Transparent Pricing • Safe Booking • 24/7 English Support'}
          </p>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 32px;">
            <!-- Gangnam Head Spa -->
            <a href="https://kbeautyseoul.co.kr/booking/headspa?ref=KBSEOUL2025" target="_blank"
               style="display: block; background: white; padding: 24px; border-radius: 16px; text-decoration: none;
                      box-shadow: 0 4px 16px rgba(0,0,0,0.1); transition: all 0.3s ease; border: 2px solid transparent;">
              <div style="font-size: 40px; margin-bottom: 12px;">💆‍♀️</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #FF6B9D; margin-bottom: 8px;">
                ${lang === 'ko' ? '강남 헤드스파' : lang === 'ja' ? '江南ヘッドスパ' : 'Gangnam Head Spa'}
              </h3>
              <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
                ${lang === 'ko' ? '두피 케어 & 릴랙세이션' : lang === 'ja' ? '頭皮ケア & リラクゼーション' : 'Scalp Care & Relaxation'}
              </p>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <span style="font-size: 18px; font-weight: 700; color: #FF6B9D;">₩120,000</span>
                <span style="font-size: 12px; background: #E8F5E9; color: #2E7D32; padding: 4px 12px; border-radius: 4px; font-weight: 600;">⭐ ${lang === 'ko' ? '인기' : lang === 'ja' ? '人気' : 'POPULAR'}</span>
              </div>
            </a>
            
            <!-- Lip Tattoo -->
            <a href="https://kbeautyseoul.co.kr/booking/lip-tattoo?ref=KBSEOUL2025" target="_blank"
               style="display: block; background: white; padding: 24px; border-radius: 16px; text-decoration: none;
                      box-shadow: 0 4px 16px rgba(0,0,0,0.1); transition: all 0.3s ease; border: 2px solid transparent;">
              <div style="font-size: 40px; margin-bottom: 12px;">💋</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #FF6B9D; margin-bottom: 8px;">
                ${lang === 'ko' ? '립 타투' : lang === 'ja' ? 'リップタトゥー' : 'Lip Tattoo'}
              </h3>
              <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
                ${lang === 'ko' ? '자연스러운 립 컬러' : lang === 'ja' ? '自然なリップカラー' : 'Natural Lip Color'}
              </p>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <span style="font-size: 18px; font-weight: 700; color: #FF6B9D;">₩500,000</span>
                <span style="font-size: 12px; background: #FFF3E0; color: #E65100; padding: 4px 12px; border-radius: 4px; font-weight: 600;">🔥 ${lang === 'ko' ? '베스트' : lang === 'ja' ? 'ベスト' : 'BEST'}</span>
              </div>
            </a>
            
            <!-- BB Glow -->
            <a href="https://kbeautyseoul.co.kr/booking/bb-glow?ref=KBSEOUL2025" target="_blank"
               style="display: block; background: white; padding: 24px; border-radius: 16px; text-decoration: none;
                      box-shadow: 0 4px 16px rgba(0,0,0,0.1); transition: all 0.3s ease; border: 2px solid transparent;">
              <div style="font-size: 40px; margin-bottom: 12px;">✨</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #FF6B9D; margin-bottom: 8px;">
                ${lang === 'ko' ? 'BB 글로우' : lang === 'ja' ? 'BBグロウ' : 'BB Glow'}
              </h3>
              <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
                ${lang === 'ko' ? '반영구 파운데이션' : lang === 'ja' ? 'セミパーマネントファンデーション' : 'Semi-Permanent Foundation'}
              </p>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <span style="font-size: 18px; font-weight: 700; color: #FF6B9D;">₩250,000</span>
                <span style="font-size: 12px; background: #E3F2FD; color: #1565C0; padding: 4px 12px; border-radius: 4px; font-weight: 600;">✨ ${lang === 'ko' ? '추천' : lang === 'ja' ? 'おすすめ' : 'RECOMMENDED'}</span>
              </div>
            </a>
            
            <!-- Gangnam Massage -->
            <a href="https://kbeautyseoul.co.kr/booking/massage?ref=KBSEOUL2025" target="_blank"
               style="display: block; background: white; padding: 24px; border-radius: 16px; text-decoration: none;
                      box-shadow: 0 4px 16px rgba(0,0,0,0.1); transition: all 0.3s ease; border: 2px solid transparent;">
              <div style="font-size: 40px; margin-bottom: 12px;">💆</div>
              <h3 style="font-size: 20px; font-weight: 700; color: #FF6B9D; margin-bottom: 8px;">
                ${lang === 'ko' ? '강남 마사지' : lang === 'ja' ? '江南マッサージ' : 'Gangnam Massage'}
              </h3>
              <p style="font-size: 14px; color: #666; margin-bottom: 12px;">
                ${lang === 'ko' ? '아로마 테라피 마사지' : lang === 'ja' ? 'アロマセラピーマッサージ' : 'Aromatherapy Massage'}
              </p>
              <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
                <span style="font-size: 18px; font-weight: 700; color: #FF6B9D;">₩150,000</span>
                <span style="font-size: 12px; background: #F3E5F5; color: #6A1B9A; padding: 4px 12px; border-radius: 4px; font-weight: 600;">💎 ${lang === 'ko' ? '프리미엄' : lang === 'ja' ? 'プレミアム' : 'PREMIUM'}</span>
              </div>
            </a>
          </div>
          
          <a href="/blog?lang=${lang}" 
             style="display: inline-block; background: white; color: #FF6B9D; 
                    padding: 16px 40px; border-radius: 50px; text-decoration: none; 
                    font-weight: 700; font-size: 16px; border: 2px solid #FF6B9D;
                    transition: all 0.3s ease; box-shadow: 0 4px 16px rgba(0,0,0,0.1);">
            📖 ${lang === 'ko' ? '더 많은 가이드 보기 →' : lang === 'ja' ? 'もっとガイドを見る →' : 'Read More Guides →'}
          </a>
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
      
      <!-- Google AdSense - 자동 광고 -->
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134"
           crossorigin="anonymous"></script>
      
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
      
      <!-- Google AdSense - 자동 광고 -->
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134"
           crossorigin="anonymous"></script>
      
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
// BLOG ROUTES
// ==========================================

// Blog list page
app.get('/blog', (c) => {
  const lang = c.req.query('lang') || 'en';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${lang === 'ko' ? '블로그' : lang === 'ja' ? 'ブログ' : 'Blog'} | K-Beauty Seoul</title>
      <meta name="description" content="${lang === 'ko' ? 'K-뷰티 서울 블로그: 강남 최고의 뷰티 서비스 가이드' : lang === 'ja' ? 'K-ビューティソウルブログ：江南最高の美容サービスガイド' : 'K-Beauty Seoul Blog: Best beauty services guide in Gangnam'}">
      
      <!-- Google AdSense - 자동 광고 -->
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134"
           crossorigin="anonymous"></script>
      
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #FF6B9D, #FFC2D4); color: white; padding: 60px 20px; text-align: center; }
        .header h1 { font-size: 36px; margin-bottom: 12px; }
        .header p { font-size: 18px; opacity: 0.95; }
        .container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
        .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; }
        .blog-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: transform 0.3s; cursor: pointer; }
        .blog-card:hover { transform: translateY(-8px); box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        .blog-image { width: 100%; height: 220px; object-fit: cover; }
        .blog-content { padding: 24px; }
        .blog-category { display: inline-block; background: #FF6B9D; color: white; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
        .blog-title { font-size: 22px; font-weight: 700; margin-bottom: 12px; color: #333; }
        .blog-excerpt { font-size: 15px; color: #666; margin-bottom: 16px; line-height: 1.6; }
        .blog-meta { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #999; }
        .blog-link { text-decoration: none; color: inherit; }
        @media (max-width: 768px) {
          .blog-grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div style="display: inline-block; background: rgba(255,255,255,0.2); padding: 8px 20px; border-radius: 25px; margin-bottom: 15px; backdrop-filter: blur(10px);">
          <span style="font-size: 14px; font-weight: 600;">
            ${lang === 'ko' ? '🏆 kbeautyseoul.co.kr 공식 블로그' : lang === 'ja' ? '🏆 kbeautyseoul.co.kr 公式ブログ' : '🏆 Official Blog of kbeautyseoul.co.kr'}
          </span>
        </div>
        <h1>${lang === 'ko' ? '📝 K-뷰티 서울 가이드' : lang === 'ja' ? '📝 K-ビューティソウルガイド' : '📝 K-Beauty Seoul Guide'}</h1>
        <p>${lang === 'ko' ? '실제 후기 & 예약 가이드 | 전문가가 직접 작성한 신뢰할 수 있는 정보' : lang === 'ja' ? '実際のレビュー＆予約ガイド｜専門家が書いた信頼できる情報' : 'Real Reviews & Booking Guide | Trusted Info by Beauty Experts'}</p>
        <div style="margin-top: 15px;">
          <a href="https://kbeautyseoul.co.kr?ref=KBSEOUL2025&utm_source=blog_header" 
             target="_blank"
             style="display: inline-block; background: white; color: #FF6B9D; padding: 12px 30px; border-radius: 30px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.15); transition: all 0.3s;">
            ${lang === 'ko' ? '🎁 지금 예약하고 10% 할인받기' : lang === 'ja' ? '🎁 今予約して10%割引' : '🎁 Book Now & Get 10% OFF'}
          </a>
        </div>
        
        <!-- Search Box -->
        <div style="max-width: 600px; margin: 20px auto 0;">
          <input type="text" id="blogSearch" placeholder="${lang === 'ko' ? '블로그 검색... (예: 헤드스파, 선크림, 여드름)' : lang === 'ja' ? 'ブログ検索...' : 'Search blogs... (e.g., head spa, sunscreen, acne)'}" 
                 style="width: 100%; padding: 14px 20px; border: none; border-radius: 30px; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" 
                 onkeyup="filterBlogs()" />
        </div>
      </div>
      
      <div class="container">
        <!-- 광고: 블로그 목록 상단 -->
        <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f5f5f5; border-radius: 12px; min-height: 120px;">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-format="fluid"
               data-ad-layout-key="-6t+ed+2i-1n-4w"
               data-ad-client="ca-pub-6943282483618134"
               data-ad-slot="6677889900"></ins>
          <script>
               (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
        
        <div class="blog-grid">
          ${blogArticles.map(article => `
            <a href="/blog/${article.id}?lang=${lang}" class="blog-link">
              <div class="blog-card">
                <img src="${article.content[lang]?.match(/src="([^"]+)"/)?.[1] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop&q=80&fm=webp&auto=format'}" alt="${article.title[lang] || article.title.en}" class="blog-image" />
                <div class="blog-content">
                  <div class="blog-category">${article.category.toUpperCase()}</div>
                  <div class="blog-title">${article.title[lang] || article.title.en}</div>
                  <div class="blog-excerpt">${article.excerpt[lang] || article.excerpt.en}</div>
                  <div class="blog-meta">
                    <span>${article.readTime}</span>
                    <span>${article.publishedAt}</span>
                  </div>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
        
        <!-- 광고: 블로그 목록 하단 -->
        <div style="text-align: center; margin: 40px 0; padding: 30px; background: #fafafa; border-radius: 12px; min-height: 280px;">
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-format="autorelaxed"
               data-ad-client="ca-pub-6943282483618134"
               data-ad-slot="3344556677"></ins>
          <script>
               (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
      </div>
      
      <script>
        // 블로그 검색 기능 - "head spa" → "scalp care" 매칭 포함
        function filterBlogs() {
          const searchInput = document.getElementById('blogSearch').value.toLowerCase();
          const blogCards = document.querySelectorAll('.blog-card');
          
          // 검색어 동의어 매핑 (Search term synonyms mapping)
          const synonyms = {
            'head spa': ['scalp care', 'headspa', 'head spa', 'scalp', '헤드스파', '두피케어'],
            'headspa': ['scalp care', 'headspa', 'head spa', 'scalp', '헤드스파', '두피케어'],
            'scalp': ['scalp care', 'headspa', 'head spa', 'scalp', '헤드스파', '두피케어'],
            'sunscreen': ['sun cream', 'spf', 'uv protection', '선크림', '자외선차단제'],
            'acne': ['pimple', 'breakout', 'blemish', '여드름', 'ニキビ'],
            'anti aging': ['anti-aging', 'wrinkle', 'fine line', '안티에이징', '주름'],
            'routine': ['step', 'regimen', '루틴', '단계']
          };
          
          // 검색어를 동의어로 확장
          let searchTerms = [searchInput];
          Object.keys(synonyms).forEach(key => {
            if (searchInput.includes(key)) {
              searchTerms = searchTerms.concat(synonyms[key]);
            }
          });
          
          blogCards.forEach(card => {
            const title = card.querySelector('.blog-title').textContent.toLowerCase();
            const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
            const category = card.querySelector('.blog-category').textContent.toLowerCase();
            
            // 원본 검색어 또는 동의어가 포함되어 있는지 확인
            const isMatch = searchTerms.some(term => 
              title.includes(term) || 
              excerpt.includes(term) || 
              category.includes(term)
            );
            
            if (searchInput === '' || isMatch) {
              card.parentElement.style.display = 'block';
            } else {
              card.parentElement.style.display = 'none';
            }
          });
        }
      </script>
    </body>
    </html>
  `;
  
  return c.html(html);
});

// Sitemap.xml route
app.get('/sitemap.xml', (c) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://seoulzen.com</loc><priority>1.0</priority></url>
  <url><loc>https://seoulzen.com/blog</loc><priority>0.9</priority></url>
  ${blogArticles.map(article => `  <url><loc>https://seoulzen.com/blog/${article.slug}</loc><priority>0.8</priority></url>`).join('\n')}
</urlset>`;
  return c.body(sitemap, 200, {
    'Content-Type': 'application/xml; charset=utf-8'
  });
});

// Robots.txt route
app.get('/robots.txt', (c) => {
  const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://seoulzen.com/sitemap.xml`;
  return c.text(robotsTxt);
});

// Individual blog post page
app.get('/blog/:slug', (c) => {
  const slug = c.req.param('slug');
  const lang = c.req.query('lang') || 'en';
  
  const article = blogArticles.find(a => a.id === slug);
  
  if (!article) {
    return c.html('<h1>Blog post not found</h1>', 404);
  }
  
  const html = `
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${article.title[lang] || article.title.en} | K-Beauty Seoul</title>
      <meta name="description" content="${article.metaDescription[lang] || article.metaDescription.en}">
      <meta name="keywords" content="${article.tags.join(', ')}">
      <meta property="og:title" content="${article.title[lang] || article.title.en}">
      <meta property="og:description" content="${article.excerpt[lang] || article.excerpt.en}">
      <meta property="og:type" content="article">
      
      <!-- Google AdSense - 자동 광고 -->
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134"
           crossorigin="anonymous"></script>
      
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, system-ui, sans-serif; background: #fff; color: #333; line-height: 1.8; }
        .header { background: linear-gradient(135deg, #FF6B9D, #FFC2D4); color: white; padding: 80px 20px; text-align: center; }
        .header h1 { font-size: 42px; margin-bottom: 16px; max-width: 900px; margin-left: auto; margin-right: auto; }
        .meta { display: flex; gap: 20px; justify-content: center; align-items: center; font-size: 14px; opacity: 0.95; }
        .article-container { max-width: 800px; margin: 60px auto; padding: 0 20px; }
        .article-content h2 { font-size: 32px; margin-top: 48px; margin-bottom: 20px; color: #222; }
        .article-content h3 { font-size: 24px; margin-top: 36px; margin-bottom: 16px; color: #333; }
        .article-content p { font-size: 18px; margin-bottom: 24px; line-height: 1.8; }
        .article-content ul, .article-content ol { margin-left: 30px; margin-bottom: 24px; font-size: 18px; }
        .article-content li { margin-bottom: 12px; }
        .article-content img { width: 100%; height: auto; border-radius: 12px; margin: 30px 0; }
        .article-content table { width: 100%; margin: 24px 0; border-collapse: collapse; }
        .article-content a { color: #FF6B9D; text-decoration: none; font-weight: 600; }
        .article-content a:hover { text-decoration: underline; }
        .tags { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 40px; padding-top: 40px; border-top: 2px solid #eee; }
        .tag { background: #f0f0f0; padding: 8px 16px; border-radius: 20px; font-size: 14px; }
        .back-link { display: inline-block; margin-bottom: 40px; color: #FF6B9D; text-decoration: none; font-weight: 600; }
        .back-link:hover { text-decoration: underline; }
        @media (max-width: 768px) {
          .header h1 { font-size: 28px; }
          .article-content h2 { font-size: 26px; }
          .article-content h3 { font-size: 20px; }
          .article-content p, .article-content ul, .article-content ol { font-size: 16px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${article.title[lang] || article.title.en}</h1>
        <div class="meta">
          <span>✍️ ${article.author}</span>
          <span>📅 ${article.publishedAt}</span>
          <span>⏱️ ${article.readTime}</span>
        </div>
      </div>
      
      <div class="article-container">
        <a href="/blog?lang=${lang}" class="back-link">← ${lang === 'ko' ? '블로그 목록으로' : lang === 'ja' ? 'ブログ一覧に戻る' : 'Back to Blog'}</a>
        
        <!-- 광고 1: 블로그 상단 - Display Ad (728x90 Leaderboard) -->
        <div style="text-align: center; margin: 30px 0; padding: 20px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee; min-height: 100px; background: #f9f9f9;">
          <!-- Blog Post Header -->
          <ins class="adsbygoogle"
               style="display:inline-block;width:728px;height:90px"
               data-ad-client="ca-pub-6943282483618134"
               data-ad-slot="4402451801"></ins>
          <script>
               (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
        
        <!-- 광고 2: In-Article Ad (자동 크기 조절) -->
        <div style="text-align: center; margin: 20px 0; min-height: 250px;">
          <!-- Blog Post In-Article -->
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-6943282483618134"
               data-ad-slot="3580518248"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
               (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
        
        <div class="article-content">
          ${article.content[lang] || article.content.en}
        </div>
        
        <!-- 광고 3: 글 중간 - Responsive Display Ad -->
        <div style="text-align: center; margin: 30px 0; padding: 20px; background: #fafafa; border-radius: 8px; min-height: 280px;">
          <!-- Blog Post Middle (In-Article) -->
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-6943282483618134"
               data-ad-slot="3580518248"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
               (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
        
        <!-- 광고 4: 블로그 하단 - Large Rectangle (336x280) -->
        <div style="text-align: center; margin: 40px 0; padding: 20px 0; min-height: 300px;">
          <!-- Blog Post Footer -->
          <ins class="adsbygoogle"
               style="display:inline-block;width:336px;height:280px"
               data-ad-client="ca-pub-6943282483618134"
               data-ad-slot="8681635837"></ins>
          <script>
               (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
        
        <div class="tags">
          ${article.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
        </div>
      </div>
    </body>
    </html>
  `;
  
  return c.html(html);
});

// ==========================================
// ADSENSE REQUIRED PAGES
// ==========================================

// About Us Page (Required for AdSense)
app.get('/about', (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>About Us | K-Beauty Seoul</title>
      <meta name="description" content="Learn about K-Beauty Seoul, your trusted guide to authentic Korean beauty services in Seoul, Gangnam, and beyond.">
      
      <!-- Google AdSense - 자동 광고 -->
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134"
           crossorigin="anonymous"></script>
      
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, system-ui, sans-serif; line-height: 1.8; color: #333; }
        .header { background: linear-gradient(135deg, #FF6B9D, #FFC2D4); color: white; padding: 80px 20px; text-align: center; }
        .header h1 { font-size: 48px; margin-bottom: 16px; }
        .container { max-width: 900px; margin: 60px auto; padding: 0 20px; }
        h2 { font-size: 32px; margin: 40px 0 20px; color: #222; }
        p { font-size: 18px; margin-bottom: 24px; }
        .team { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin: 40px 0; }
        .team-card { background: #f9f9f9; padding: 30px; border-radius: 12px; text-align: center; }
        .contact-info { background: #f0f9ff; padding: 30px; border-radius: 12px; margin: 40px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>About K-Beauty Seoul Blog</h1>
        <p>🏆 Official Information Blog of <strong><a href="https://kbeautyseoul.co.kr?ref=KBSEOUL2025" target="_blank" style="color: #FF6B9D; text-decoration: none;">kbeautyseoul.co.kr</a></strong></p>
        <p style="font-size: 16px; margin-top: 10px;">Your Trusted Guide to Authentic Korean Beauty Experiences</p>
      </div>
      
      <div class="container">
        <h2>🎯 Who We Are</h2>
        <p><strong>We are the official information blog of <a href="https://kbeautyseoul.co.kr?ref=KBSEOUL2025" target="_blank" style="color: #FF6B9D;">kbeautyseoul.co.kr</a></strong>, Korea's leading beauty booking platform trusted by thousands of international travelers.</p>
        
        <p>Since 2020, we've helped visitors from over 50 countries experience the best of Korean beauty treatments through our comprehensive guides, honest reviews, and seamless booking system.</p>

        <h2>📝 Our Mission</h2>
        <p>To bridge the gap between international visitors and Seoul's incredible beauty industry by providing:</p>
        <ul style="margin-left: 30px; margin-bottom: 24px;">
          <li>✅ <strong>Detailed treatment guides</strong> - Everything you need to know before booking</li>
          <li>✅ <strong>Real experience reviews</strong> - Honest feedback from actual customers</li>
          <li>✅ <strong>Price comparisons</strong> - Save 30-50% vs your home country</li>
          <li>✅ <strong>Easy booking</strong> - Reserve in English through <a href="https://kbeautyseoul.co.kr?ref=KBSEOUL2025" target="_blank" style="color: #FF6B9D;">kbeautyseoul.co.kr</a></li>
        </ul>

        <h2>🌟 What We Do</h2>
        <p>As the official blog of kbeautyseoul.co.kr, we provide comprehensive, unbiased information about Korean beauty treatments to help you make informed decisions.</p>
        
        <p><strong>Our Blog Features:</strong></p>
        <ul style="margin-left: 30px; margin-bottom: 24px;">
          <li>📚 In-depth treatment guides (Head Spa, BB Glow, Massage, etc.)</li>
          <li>💰 Transparent pricing information with comparison tables</li>
          <li>⭐ Real customer reviews and experience stories</li>
          <li>🗺️ Seoul beauty tourism itineraries and tips</li>
          <li>🎁 Exclusive discount codes for kbeautyseoul.co.kr bookings</li>
          <li>🌏 Multi-language support (English, Korean, Japanese, Chinese)</li>
        </ul>

        <p><strong>Our Services Include:</strong></p>
        <ul style="margin-left: 30px; margin-bottom: 24px;">
          <li>English booking platform for Korean beauty services</li>
          <li>Expert beauty guides and treatment explanations</li>
          <li>Verified reviews from international customers</li>
          <li>24/7 customer support in multiple languages</li>
          <li>Exclusive discounts and packages for our users</li>
        </ul>

        <h2>Why Trust Us?</h2>
        <p>With over 5 years of experience in the Korean beauty industry and partnerships with 150+ verified service providers, we've helped thousands of international visitors navigate Seoul's beauty scene with confidence.</p>

        <p><strong>Our Commitments:</strong></p>
        <ul style="margin-left: 30px; margin-bottom: 24px;">
          <li>✅ Only partnering with licensed, professional establishments</li>
          <li>✅ Transparent pricing with no hidden fees</li>
          <li>✅ English-speaking staff guaranteed at all partner locations</li>
          <li>✅ Honest, unbiased reviews and recommendations</li>
          <li>✅ Customer satisfaction guarantee</li>
        </ul>

        <h2>Our Team</h2>
        <div class="team">
          <div class="team-card">
            <h3>Beauty Experts</h3>
            <p>Licensed estheticians and beauty consultants with 10+ years experience in K-beauty</p>
          </div>
          <div class="team-card">
            <h3>Customer Service</h3>
            <p>Multilingual support team available 24/7 to assist with bookings and questions</p>
          </div>
          <div class="team-card">
            <h3>Content Team</h3>
            <p>Beauty writers and researchers creating comprehensive guides for international visitors</p>
          </div>
        </div>

        <h2>Our Values</h2>
        <p><strong>Authenticity:</strong> We only promote genuine Korean beauty experiences, never tourist traps or overpriced services.</p>
        <p><strong>Quality:</strong> Every partner undergoes rigorous vetting to ensure professional standards and customer satisfaction.</p>
        <p><strong>Transparency:</strong> Clear pricing, honest reviews, and straightforward information guide all our recommendations.</p>
        <p><strong>Accessibility:</strong> Making K-beauty accessible to everyone, regardless of language barriers or familiarity with Seoul.</p>

        <div class="contact-info">
          <h2 style="margin-top: 0;">Contact Information</h2>
          <p><strong>Email:</strong> paulslife2017@gmail.com</p>
          <p><strong>Service Hours:</strong> 09:00 - 23:00 KST (Daily)</p>
          <p><strong>Languages:</strong> English, Korean, Japanese</p>
          <p><strong>Response Time:</strong> Within 24 hours</p>
        </div>

        <h2>Visit Us</h2>
        <p>While we primarily operate online, you can experience our recommended services throughout Seoul's major beauty districts: Gangnam, Myeongdong, Hongdae, Apgujeong, and Cheongdam.</p>

        <p style="text-align: center; margin-top: 60px;">
          <a href="/" style="background: #FF6B9D; color: white; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px;">Explore K-Beauty Services →</a>
        </p>
      </div>
    </body>
    </html>
  `;
  return c.html(html);
});

// Privacy Policy Page (Required for AdSense)
app.get('/privacy', (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Privacy Policy | K-Beauty Seoul</title>
      <meta name="description" content="K-Beauty Seoul Privacy Policy - How we collect, use, and protect your personal information.">
      
      <!-- Google AdSense - 자동 광고 -->
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134"
           crossorigin="anonymous"></script>
      
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, system-ui, sans-serif; line-height: 1.8; color: #333; }
        .header { background: linear-gradient(135deg, #FF6B9D, #FFC2D4); color: white; padding: 60px 20px; text-align: center; }
        .header h1 { font-size: 42px; margin-bottom: 12px; }
        .container { max-width: 900px; margin: 60px auto; padding: 0 20px; }
        h2 { font-size: 28px; margin: 40px 0 20px; color: #222; }
        h3 { font-size: 22px; margin: 30px 0 15px; color: #444; }
        p, li { font-size: 16px; margin-bottom: 16px; }
        ul { margin-left: 30px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Privacy Policy</h1>
        <p>Last Updated: December 3, 2025</p>
      </div>
      
      <div class="container">
        <p>At K-Beauty Seoul ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website kbeautyseoul.co.kr and use our services.</p>

        <h2>1. Information We Collect</h2>
        
        <h3>Personal Information</h3>
        <p>We may collect personal information that you voluntarily provide when using our services, including:</p>
        <ul>
          <li>Name and contact information (email address, phone number)</li>
          <li>Booking details and preferences</li>
          <li>Payment information (processed securely through third-party providers)</li>
          <li>Communication history with our customer service team</li>
          <li>Reviews and feedback about services</li>
        </ul>

        <h3>Automatically Collected Information</h3>
        <p>When you visit our website, we automatically collect certain information, including:</p>
        <ul>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>IP address</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website addresses</li>
          <li>Click patterns and navigation paths</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li><strong>Service Delivery:</strong> To process bookings, facilitate appointments, and provide customer support</li>
          <li><strong>Communication:</strong> To send booking confirmations, service updates, and respond to inquiries</li>
          <li><strong>Improvement:</strong> To analyze website usage and improve our services</li>
          <li><strong>Marketing:</strong> To send promotional offers and newsletters (with your consent)</li>
          <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
          <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security issues</li>
        </ul>

        <h2>3. Cookies and Tracking Technologies</h2>
        <p>We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us:</p>
        <ul>
          <li>Remember your preferences and settings</li>
          <li>Analyze website traffic and usage patterns</li>
          <li>Provide personalized content and recommendations</li>
          <li>Measure advertising effectiveness</li>
        </ul>
        <p>You can control cookie preferences through your browser settings. However, disabling cookies may limit certain website functionalities.</p>

        <h2>4. Third-Party Services</h2>
        <p>We may share your information with trusted third-party service providers who assist us in operating our website and conducting business, including:</p>
        <ul>
          <li><strong>Payment Processors:</strong> To process transactions securely</li>
          <li><strong>Booking Partners:</strong> Beauty salons, spas, and clinics you book through our platform</li>
          <li><strong>Analytics Providers:</strong> To understand website usage (e.g., Google Analytics)</li>
          <li><strong>Email Service Providers:</strong> To send booking confirmations and newsletters</li>
        </ul>
        <p>These third parties are contractually obligated to protect your information and use it only for specified purposes.</p>

        <h2>5. Google AdSense</h2>
        <p>We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank">Google Ad Settings</a>.</p>

        <h2>6. Data Security</h2>
        <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.</p>

        <h2>7. Your Rights</h2>
        <p>You have the following rights regarding your personal information:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Correction:</strong> Request correction of inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data</li>
          <li><strong>Objection:</strong> Object to processing of your data</li>
          <li><strong>Portability:</strong> Request transfer of your data to another service</li>
          <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
        </ul>
        <p>To exercise these rights, please contact us at paulslife2017@gmail.com</p>

        <h2>8. Children's Privacy</h2>
        <p>Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.</p>

        <h2>9. International Data Transfers</h2>
        <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in compliance with applicable data protection laws.</p>

        <h2>10. Changes to This Privacy Policy</h2>
        <p>We may update this privacy policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the updated policy on our website with a new "Last Updated" date.</p>

        <h2>11. Contact Us</h2>
        <p>If you have questions, concerns, or requests regarding this privacy policy or our data practices, please contact us:</p>
        <p><strong>Email:</strong> paulslife2017@gmail.com<br>
        <strong>Response Time:</strong> Within 48 hours</p>

        <p style="margin-top: 60px; padding-top: 30px; border-top: 2px solid #eee; font-size: 14px; color: #666;">
          By using K-Beauty Seoul services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
        </p>

        <p style="text-align: center; margin-top: 40px;">
          <a href="/" style="background: #FF6B9D; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">Return to Homepage →</a>
        </p>
      </div>
    </body>
    </html>
  `;
  return c.html(html);
});

// Contact Page (Required for AdSense)
app.get('/contact', (c) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Us | K-Beauty Seoul</title>
      <meta name="description" content="Get in touch with K-Beauty Seoul. Email, phone, and office hours for customer support and inquiries.">
      
      <!-- Google AdSense - 자동 광고 -->
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134"
           crossorigin="anonymous"></script>
      
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, system-ui, sans-serif; line-height: 1.8; color: #333; }
        .header { background: linear-gradient(135deg, #FF6B9D, #FFC2D4); color: white; padding: 80px 20px; text-align: center; }
        .header h1 { font-size: 48px; margin-bottom: 16px; }
        .container { max-width: 900px; margin: 60px auto; padding: 0 20px; }
        .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; margin: 40px 0; }
        .contact-card { background: #f9f9f9; padding: 40px; border-radius: 12px; text-align: center; }
        .contact-card h2 { font-size: 24px; margin-bottom: 20px; color: #FF6B9D; }
        .icon { font-size: 48px; margin-bottom: 20px; }
        .faq { margin: 60px 0; }
        .faq h3 { font-size: 20px; margin: 30px 0 15px; color: #333; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Contact K-Beauty Seoul</h1>
        <p>We're Here to Help You Experience the Best of Korean Beauty</p>
      </div>
      
      <div class="container">
        <p style="font-size: 20px; text-align: center; margin-bottom: 50px;">Have questions about bookings, services, or Korean beauty? Our multilingual team is ready to assist you!</p>

        <div class="contact-grid">
          <div class="contact-card">
            <div class="icon">📧</div>
            <h2>Email Us</h2>
            <p><strong>paulslife2017@gmail.com</strong></p>
            <p>Response within 24 hours</p>
            <p style="margin-top: 20px;">For booking inquiries, service questions, and general support</p>
          </div>

          <div class="contact-card">
            <div class="icon">⏰</div>
            <h2>Service Hours</h2>
            <p><strong>09:00 - 23:00 KST</strong></p>
            <p>Daily (Including Weekends)</p>
            <p style="margin-top: 20px;">Korea Standard Time (GMT+9)</p>
          </div>

          <div class="contact-card">
            <div class="icon">🌐</div>
            <h2>Languages</h2>
            <p><strong>English | Korean | Japanese</strong></p>
            <p>Multilingual Support Available</p>
            <p style="margin-top: 20px;">We'll match you with the appropriate language specialist</p>
          </div>
        </div>

        <div class="faq">
          <h2 style="font-size: 32px; text-align: center; margin-bottom: 40px;">Frequently Asked Questions</h2>

          <h3>Q: How do I book a beauty service?</h3>
          <p>A: Simply browse our services on the homepage, select your preferred treatment, choose a date and time, and complete the booking. You'll receive instant confirmation via email.</p>

          <h3>Q: Can I cancel or reschedule my appointment?</h3>
          <p>A: Yes! Contact us at least 24 hours before your appointment for free cancellation or rescheduling. Cancellations within 24 hours may incur a fee.</p>

          <h3>Q: Do the service providers speak English?</h3>
          <p>A: All our partner salons, spas, and clinics have English-speaking staff. We guarantee clear communication throughout your visit.</p>

          <h3>Q: What payment methods do you accept?</h3>
          <p>A: We accept all major credit cards (Visa, Mastercard, AMEX), PayPal, and Korean payment methods (Naver Pay, Kakao Pay).</p>

          <h3>Q: Are your prices final, or are there additional fees?</h3>
          <p>A: All prices displayed are final and include service charges. No hidden fees or surprise charges.</p>

          <h3>Q: How do I know if a service provider is legitimate?</h3>
          <p>A: We personally vet every partner. All providers are licensed professionals with verified credentials and positive customer reviews.</p>

          <h3>Q: Can you help with recommendations?</h3>
          <p>A: Absolutely! Email us with your skin type, concerns, and preferences. Our beauty experts will recommend the best treatments for your needs.</p>

          <h3>Q: Do you offer packages or discounts?</h3>
          <p>A: Yes! Check our homepage for current promotions. First-time customers often receive 10-20% discounts on select services.</p>
        </div>

        <div style="background: #f0f9ff; padding: 40px; border-radius: 12px; margin: 60px 0; text-align: center;">
          <h2 style="margin-bottom: 20px;">Visit Our Service Areas</h2>
          <p style="margin-bottom: 10px;"><strong>Gangnam District</strong> - Premium beauty clinics and luxury spas</p>
          <p style="margin-bottom: 10px;"><strong>Myeongdong</strong> - Tourist-friendly beauty services</p>
          <p style="margin-bottom: 10px;"><strong>Hongdae</strong> - Trendy and affordable beauty experiences</p>
          <p style="margin-bottom: 10px;"><strong>Apgujeong & Cheongdam</strong> - Celebrity-favorite beauty destinations</p>
        </div>

        <div style="background: linear-gradient(135deg, #FF6B9D, #FFC2D4); padding: 40px; border-radius: 12px; color: white; text-align: center; margin: 60px 0;">
          <h2 style="margin-bottom: 20px;">Ready to Book Your K-Beauty Experience?</h2>
          <p style="margin-bottom: 30px; font-size: 18px;">Explore our verified beauty services and book with confidence</p>
          <a href="/" style="background: white; color: #FF6B9D; padding: 15px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 18px;">Browse Services →</a>
        </div>

        <p style="text-align: center; color: #666; font-size: 14px;">
          <strong>Business Hours:</strong> Monday-Sunday, 09:00-23:00 KST<br>
          <strong>Emergency Support:</strong> For urgent booking changes on the day of service, email us immediately<br>
          <strong>Average Response Time:</strong> Email inquiries answered within 12-24 hours
        </p>
      </div>
    </body>
    </html>
  `;
  return c.html(html);
});

// ==========================================
// GOOGLE ADSENSE - ads.txt
// ==========================================

app.get('/ads.txt', (c) => {
  const adsContent = 'google.com, pub-6943282483618134, DIRECT, f08c47fec0942fa0';
  return c.text(adsContent, 200, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
});

// ==========================================
// STATIC FILE SERVING
// ==========================================

// Serve all public files (CSS, JS, images, etc.)
app.use('/*', serveStatic({ 
  root: './public',
  rewriteRequestPath: (path) => path.replace(/^\//, '/') // Keep path as-is
}));

// ==========================================
// SERVER START
// ==========================================

const port = process.env.PORT || 8080;

// Only start server in non-Vercel environment
if (!process.env.VERCEL) {
  serve({
    fetch: app.fetch,
    port
  });
  
  console.log(`✅ K-Beauty Seoul running on port ${port}`);
  console.log(`📱 Mobile-optimized with horizontal scroll`);
  console.log(`🎬 YouTube thumbnail support`);
  console.log(`🎨 Admin panel at /admin`);
}

// Export for Vercel serverless
export default app;
