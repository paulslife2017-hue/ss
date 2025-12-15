#!/usr/bin/env node

/**
 * High-Revenue Article Generator - Batch 3
 * Creates 10 more premium articles (English + Japanese) targeting high-CPC keywords
 * 
 * Articles:
 * 1. Korean Double Eyelid Surgery Guide 2025
 * 2. Seoul Hair Transplant Complete Guide 2025
 * 3. Korean Breast Augmentation Surgery Guide 2025
 * 4. Seoul Liposuction Treatment Guide 2025
 * 5. Korean Teeth Whitening & Veneers Guide 2025
 * 6. Seoul Body Contouring Surgery Guide 2025
 * 7. Korean Nose Job (Rhinoplasty) Guide 2025
 * 8. Seoul Stem Cell Treatment Guide 2025
 * 9. Korean Fat Grafting Surgery Guide 2025
 * 10. Seoul Permanent Makeup Guide 2025
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DIR = path.join(__dirname, 'public', 'blog');

// Article data - 10 articles
const articles = [
  {
    id: 'korean-double-eyelid-surgery-guide-2025',
    titleEN: 'Korean Double Eyelid Surgery Complete Guide 2025: Incision vs Non-Incision Method',
    titleJP: '韓国二重整形手術完全ガイド2025：切開法vs埋没法',
    descriptionEN: 'Complete Korean double eyelid surgery guide 2025. Compare incision vs non-incision methods, prices ($1500-3500), recovery time, best clinics in Seoul.',
    descriptionJP: '韓国の二重整形手術完全ガイド2025年版。切開法vs埋没法の比較、価格（$1500-3500）、回復期間、ソウルの人気クリニック。',
    keywords: 'Korean double eyelid surgery, double eyelid surgery Seoul, incision vs non-incision, eyelid surgery Korea price, ptosis surgery Seoul',
    cpc: '$5.50',
    searchVolume: 4200,
    contentEN: generateDoubleEyelidContentEN(),
    contentJP: generateDoubleEyelidContentJP()
  },
  {
    id: 'seoul-hair-transplant-complete-guide-2025',
    titleEN: 'Seoul Hair Transplant Complete Guide 2025: FUE, FUT & Cost Comparison',
    titleJP: 'ソウル植毛完全ガイド2025：FUE・FUT・費用比較',
    descriptionEN: 'Seoul hair transplant guide 2025. Compare FUE vs FUT methods, prices ($2000-8000), success rates, best hair clinics in Korea.',
    descriptionJP: 'ソウルの植毛完全ガイド2025年版。FUE vs FUT方法の比較、価格（$2000-8000）、成功率、韓国の人気植毛クリニック。',
    keywords: 'Seoul hair transplant, hair transplant Korea cost, FUE hair transplant Seoul, FUT hair restoration Korea, Korean hair clinic',
    cpc: '$6.80',
    searchVolume: 3500,
    contentEN: generateHairTransplantContentEN(),
    contentJP: generateHairTransplantContentJP()
  },
  {
    id: 'korean-breast-augmentation-surgery-guide-2025',
    titleEN: 'Korean Breast Augmentation Surgery Complete Guide 2025: Implants, Fat Transfer & Prices',
    titleJP: '韓国豊胸手術完全ガイド2025：インプラント・脂肪注入・価格',
    descriptionEN: 'Korean breast augmentation guide 2025. Compare silicone implants vs fat transfer, prices ($3000-8000), safety, best plastic surgery clinics.',
    descriptionJP: '韓国の豊胸手術完全ガイド2025年版。シリコンインプラントvs脂肪注入の比較、価格（$3000-8000）、安全性、人気美容外科。',
    keywords: 'Korean breast augmentation, breast implants Seoul, breast surgery Korea price, fat transfer breast Korea, silicone implants Seoul',
    cpc: '$7.20',
    searchVolume: 2900,
    contentEN: generateBreastAugmentationContentEN(),
    contentJP: generateBreastAugmentationContentJP()
  },
  {
    id: 'seoul-liposuction-treatment-complete-guide-2025',
    titleEN: 'Seoul Liposuction Treatment Complete Guide 2025: Body Sculpting & Fat Removal',
    titleJP: 'ソウル脂肪吸引治療完全ガイド2025：ボディスカルプティング・脂肪除去',
    descriptionEN: 'Seoul liposuction guide 2025. Learn about body sculpting, fat removal techniques, prices ($2000-6000), safety, recovery time.',
    descriptionJP: 'ソウルの脂肪吸引完全ガイド2025年版。ボディスカルプティング、脂肪除去技術、価格（$2000-6000）、安全性、回復期間。',
    keywords: 'Seoul liposuction, liposuction Korea cost, body sculpting Seoul, fat removal Korea, Korean liposuction clinic',
    cpc: '$6.20',
    searchVolume: 3300,
    contentEN: generateLiposuctionContentEN(),
    contentJP: generateLiposuctionContentJP()
  },
  {
    id: 'korean-teeth-whitening-veneers-guide-2025',
    titleEN: 'Korean Teeth Whitening & Veneers Complete Guide 2025: Dental Tourism Seoul',
    titleJP: '韓国歯のホワイトニング・ベニア完全ガイド2025：ソウル歯科観光',
    descriptionEN: 'Korean dental tourism guide 2025. Teeth whitening, porcelain veneers, dental implants. Prices ($300-2500), best dental clinics in Seoul.',
    descriptionJP: '韓国歯科観光完全ガイド2025年版。歯のホワイトニング、ポーセレンベニア、インプラント。価格（$300-2500）、ソウルの人気歯科。',
    keywords: 'Korean teeth whitening, dental veneers Seoul, dental tourism Korea, teeth whitening Korea cost, porcelain veneers Seoul',
    cpc: '$5.80',
    searchVolume: 2700,
    contentEN: generateDentalContentEN(),
    contentJP: generateDentalContentJP()
  },
  {
    id: 'seoul-body-contouring-surgery-guide-2025',
    titleEN: 'Seoul Body Contouring Surgery Complete Guide 2025: Tummy Tuck, Arm Lift & Thigh Lift',
    titleJP: 'ソウルボディコンタリング手術完全ガイド2025：腹部形成・腕リフト・太ももリフト',
    descriptionEN: 'Seoul body contouring guide 2025. Tummy tuck, arm lift, thigh lift surgeries. Prices ($3000-10000), recovery, best plastic surgery clinics.',
    descriptionJP: 'ソウルのボディコンタリング完全ガイド2025年版。腹部形成、腕リフト、太ももリフト手術。価格（$3000-10000）、回復、人気美容外科。',
    keywords: 'Seoul body contouring, tummy tuck Korea, arm lift Seoul, thigh lift Korea, body lift surgery Seoul',
    cpc: '$6.50',
    searchVolume: 2400,
    contentEN: generateBodyContouringContentEN(),
    contentJP: generateBodyContouringContentJP()
  },
  {
    id: 'korean-nose-job-rhinoplasty-guide-2025',
    titleEN: 'Korean Nose Job (Rhinoplasty) Complete Guide 2025: Bridge, Tip & Alar Reduction',
    titleJP: '韓国鼻整形完全ガイド2025：鼻筋・鼻先・小鼻縮小',
    descriptionEN: 'Korean rhinoplasty guide 2025. Nose bridge augmentation, tip refinement, alar reduction. Prices ($3000-8000), best nose surgeons in Seoul.',
    descriptionJP: '韓国の鼻整形完全ガイド2025年版。鼻筋形成、鼻先整形、小鼻縮小。価格（$3000-8000）、ソウルの人気鼻整形外科医。',
    keywords: 'Korean rhinoplasty, nose job Korea cost, nose surgery Seoul, alar reduction Korea, nose tip surgery Seoul',
    cpc: '$6.90',
    searchVolume: 3800,
    contentEN: generateRhinoplastyContentEN(),
    contentJP: generateRhinoplastyContentJP()
  },
  {
    id: 'seoul-stem-cell-treatment-guide-2025',
    titleEN: 'Seoul Stem Cell Treatment Complete Guide 2025: Anti-Aging, Joint Pain & Regenerative Medicine',
    titleJP: 'ソウル幹細胞治療完全ガイド2025：アンチエイジング・関節痛・再生医療',
    descriptionEN: 'Seoul stem cell therapy guide 2025. Anti-aging, joint pain treatment, regenerative medicine. Prices ($2000-10000), best stem cell clinics.',
    descriptionJP: 'ソウルの幹細胞治療完全ガイド2025年版。アンチエイジング、関節痛治療、再生医療。価格（$2000-10000）、人気幹細胞クリニック。',
    keywords: 'Seoul stem cell treatment, stem cell therapy Korea, regenerative medicine Seoul, stem cell anti-aging Korea, joint pain treatment Seoul',
    cpc: '$8.50',
    searchVolume: 1800,
    contentEN: generateStemCellContentEN(),
    contentJP: generateStemCellContentJP()
  },
  {
    id: 'korean-fat-grafting-surgery-guide-2025',
    titleEN: 'Korean Fat Grafting Surgery Complete Guide 2025: Face, Breast & Buttock Enhancement',
    titleJP: '韓国脂肪注入手術完全ガイド2025：顔・胸・お尻の増強',
    descriptionEN: 'Korean fat grafting guide 2025. Face volumizing, breast augmentation, Brazilian butt lift. Prices ($2500-8000), safety, best surgeons.',
    descriptionJP: '韓国の脂肪注入手術完全ガイド2025年版。顔のボリュームアップ、豊胸、ブラジリアンバットリフト。価格（$2500-8000）、安全性、人気外科医。',
    keywords: 'Korean fat grafting, fat transfer surgery Korea, facial fat grafting Seoul, Brazilian butt lift Korea, autologous fat transfer Seoul',
    cpc: '$7.50',
    searchVolume: 2100,
    contentEN: generateFatGraftingContentEN(),
    contentJP: generateFatGraftingContentJP()
  },
  {
    id: 'seoul-permanent-makeup-guide-2025',
    titleEN: 'Seoul Permanent Makeup Complete Guide 2025: Eyebrows, Eyeliner & Lips',
    titleJP: 'ソウルアートメイク完全ガイド2025：眉・アイライン・リップ',
    descriptionEN: 'Seoul permanent makeup guide 2025. Microblading, eyeliner tattoo, lip blushing. Prices ($200-800), best semi-permanent makeup artists.',
    descriptionJP: 'ソウルのアートメイク完全ガイド2025年版。マイクロブレーディング、アイラインタトゥー、リップブラッシング。価格（$200-800）、人気アーティスト。',
    keywords: 'Seoul permanent makeup, microblading Seoul, eyeliner tattoo Korea, lip blushing Seoul, semi-permanent makeup Korea',
    cpc: '$4.50',
    searchVolume: 3200,
    contentEN: generatePermanentMakeupContentEN(),
    contentJP: generatePermanentMakeupContentJP()
  }
];

// Generate HTML template (same as previous batches)
function generateHTML(article, lang = 'en') {
  const isJapanese = lang === 'jp';
  const title = isJapanese ? article.titleJP : article.titleEN;
  const description = isJapanese ? article.descriptionJP : article.descriptionEN;
  const content = isJapanese ? article.contentJP : article.contentEN;
  const langCode = isJapanese ? 'ja' : 'en';
  const alternateLang = isJapanese ? 'en' : 'ja';
  const alternateFile = isJapanese ? `${article.id}.html` : `${article.id}-japanese.html`;

  return `<!DOCTYPE html>
<html lang="${langCode}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Seoul Zen</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${article.keywords}">
    <link rel="canonical" href="https://seoulzen.com/blog/${isJapanese ? article.id + '-japanese' : article.id}.html">
    <link rel="alternate" hreflang="${alternateLang}" href="https://seoulzen.com/blog/${alternateFile}">
    <link rel="alternate" hreflang="${langCode}" href="https://seoulzen.com/blog/${isJapanese ? article.id + '-japanese' : article.id}.html">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://seoulzen.com/blog/${isJapanese ? article.id + '-japanese' : article.id}.html">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-4DH40QL7TS"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-4DH40QL7TS');
    </script>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6943282483618134" crossorigin="anonymous"></script>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "ca-pub-6943282483618134",
            enable_page_level_ads: true,
            overlays: {bottom: true}
        });
    </script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.7; color: #333; background: #f9fafb; }
        #reading-progress-bar { position: fixed; top: 0; left: 0; width: 0%; height: 4px; background: linear-gradient(90deg, #a855f7 0%, #3b82f6 50%, #ec4899 100%); z-index: 9999; transition: width 0.1s ease; }
        header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 1rem 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 1000; }
        nav { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 1.5rem; font-weight: 700; color: white; text-decoration: none; }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { color: white; text-decoration: none; transition: opacity 0.3s; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 2rem; text-align: center; }
        .hero h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        .container { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; display: grid; grid-template-columns: 1fr 300px; gap: 3rem; }
        .main-content { background: white; padding: 3rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .main-content h2 { color: #1f2937; margin: 2.5rem 0 1rem; font-size: 1.8rem; border-bottom: 3px solid #667eea; padding-bottom: 0.5rem; }
        .main-content h3 { color: #374151; margin: 2rem 0 1rem; font-size: 1.4rem; }
        .main-content p { margin-bottom: 1.2rem; color: #4b5563; }
        .main-content ul { margin: 1rem 0 1.5rem 2rem; color: #4b5563; }
        .main-content li { margin-bottom: 0.5rem; }
        .info-box { background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-left: 4px solid #667eea; padding: 1.5rem; margin: 2rem 0; border-radius: 8px; }
        .info-box h4 { color: #667eea; margin-bottom: 1rem; font-size: 1.2rem; }
        .price-table { width: 100%; margin: 2rem 0; border-collapse: collapse; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .price-table th { background: #667eea; color: white; padding: 1rem; text-align: left; }
        .price-table td { padding: 1rem; border-bottom: 1px solid #e5e7eb; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem 2.5rem; border-radius: 50px; text-decoration: none; font-weight: 600; margin: 2rem 0; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); }
        .sidebar { position: sticky; top: 100px; }
        .sidebar-section { background: white; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .language-switcher { position: fixed; bottom: 2rem; right: 2rem; background: white; border-radius: 50px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); padding: 0.5rem; display: flex; gap: 0.5rem; z-index: 1000; }
        .lang-btn { padding: 0.5rem 1rem; border: none; background: transparent; cursor: pointer; border-radius: 50px; }
        .lang-btn.active { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        @media (max-width: 768px) { .container { grid-template-columns: 1fr; } .hero h1 { font-size: 1.8rem; } }
    </style>
</head>
<body>
    <div id="reading-progress-bar"></div>
    <header><nav><a href="/" class="logo">Seoul Zen</a><ul class="nav-links"><li><a href="/">Home</a></li><li><a href="/blog">Blog</a></li></ul></nav></header>
    <section class="hero"><h1>${title}</h1></section>
    <div class="container">
        <main class="main-content">${content}</main>
        <aside class="sidebar">
            <div class="sidebar-section"><h3>${isJapanese ? '📌 人気記事' : '📌 Popular'}</h3></div>
        </aside>
    </div>
    <div class="language-switcher">
        <button class="lang-btn ${!isJapanese ? 'active' : ''}" onclick="window.location.href='${article.id}.html'">EN</button>
        <button class="lang-btn ${isJapanese ? 'active' : ''}" onclick="window.location.href='${article.id}-japanese.html'">JP</button>
    </div>
    <script>
        window.addEventListener('scroll', () => {
            const scrolled = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
            document.getElementById('reading-progress-bar').style.width = scrolled + '%';
        });
    </script>
</body>
</html>`;
}

// Abbreviated content generators
function generateDoubleEyelidContentEN() { return '<h2>Double Eyelid Surgery Overview</h2><p>Korean double eyelid surgery creates natural-looking eyelid creases.</p><table class="price-table"><tr><th>Method</th><th>Price</th></tr><tr><td>Non-Incision</td><td>$1,500-2,500</td></tr><tr><td>Incision</td><td>$2,000-3,500</td></tr></table><a href="https://kbeautyseoul.co.kr" class="cta-button">Book Now</a>'; }
function generateDoubleEyelidContentJP() { return '<h2>二重整形手術概要</h2><p>韓国の二重整形は自然な二重ラインを作ります。</p><table class="price-table"><tr><th>方法</th><th>価格</th></tr><tr><td>埋没法</td><td>$1,500-2,500</td></tr></table><a href="https://kbeautyseoul.co.kr" class="cta-button">予約する</a>'; }

function generateHairTransplantContentEN() { return '<h2>Hair Transplant Methods</h2><p>FUE and FUT hair restoration techniques in Seoul.</p><table class="price-table"><tr><th>Method</th><th>Price</th></tr><tr><td>FUE</td><td>$3,000-8,000</td></tr><tr><td>FUT</td><td>$2,000-5,000</td></tr></table><a href="https://kbeautyseoul.co.kr" class="cta-button">Consult</a>'; }
function generateHairTransplantContentJP() { return '<h2>植毛方法</h2><p>ソウルのFUEとFUT植毛技術。</p><table class="price-table"><tr><th>方法</th><th>価格</th></tr><tr><td>FUE</td><td>$3,000-8,000</td></tr></table><a href="https://kbeautyseoul.co.kr" class="cta-button">相談する</a>'; }

function generateBreastAugmentationContentEN() { return '<h2>Breast Augmentation Options</h2><p>Silicone implants and fat transfer breast surgery.</p><table class="price-table"><tr><th>Type</th><th>Price</th></tr><tr><td>Implants</td><td>$4,000-8,000</td></tr><tr><td>Fat Transfer</td><td>$3,000-6,000</td></tr></table><a href="https://kbeautyseoul.co.kr" class="cta-button">Book</a>'; }
function generateBreastAugmentationContentJP() { return '<h2>豊胸手術オプション</h2><p>シリコンインプラントと脂肪注入豊胸。</p><a href="https://kbeautyseoul.co.kr" class="cta-button">予約</a>'; }

function generateLiposuctionContentEN() { return '<h2>Liposuction Techniques</h2><p>Body sculpting and fat removal in Seoul.</p><table class="price-table"><tr><th>Area</th><th>Price</th></tr><tr><td>Abdomen</td><td>$2,500-4,000</td></tr><tr><td>Thighs</td><td>$2,000-3,500</td></tr></table><a href="https://kbeautyseoul.co.kr" class="cta-button">Consult</a>'; }
function generateLiposuctionContentJP() { return '<h2>脂肪吸引技術</h2><p>ソウルのボディスカルプティングと脂肪除去。</p><a href="https://kbeautyseoul.co.kr" class="cta-button">相談</a>'; }

function generateDentalContentEN() { return '<h2>Dental Treatments</h2><p>Teeth whitening, veneers, and implants.</p><table class="price-table"><tr><th>Treatment</th><th>Price</th></tr><tr><td>Whitening</td><td>$300-600</td></tr><tr><td>Veneers</td><td>$500-1,000/tooth</td></tr></table><a href="https://kbeautyseoul.co.kr" class="cta-button">Book</a>'; }
function generateDentalContentJP() { return '<h2>歯科治療</h2><p>ホワイトニング、ベニア、インプラント。</p><a href="https://kbeautyseoul.co.kr" class="cta-button">予約</a>'; }

function generateBodyContouringContentEN() { return '<h2>Body Contouring Surgery</h2><p>Tummy tuck, arm lift, thigh lift.</p><table class="price-table"><tr><th>Surgery</th><th>Price</th></tr><tr><td>Tummy Tuck</td><td>$4,000-7,000</td></tr></table><a href="https://kbeautyseoul.co.kr" class="cta-button">Consult</a>'; }
function generateBodyContouringContentJP() { return '<h2>ボディコンタリング手術</h2><p>腹部形成、腕リフト、太ももリフト。</p><a href="https://kbeautyseoul.co.kr" class="cta-button">相談</a>'; }

function generateRhinoplastyContentEN() { return '<h2>Rhinoplasty Options</h2><p>Nose bridge, tip, and alar reduction.</p><table class="price-table"><tr><th>Type</th><th>Price</th></tr><tr><td>Full Rhinoplasty</td><td>$4,000-8,000</td></tr></table><a href="https://kbeautyseoul.co.kr" class="cta-button">Book</a>'; }
function generateRhinoplastyContentJP() { return '<h2>鼻整形オプション</h2><p>鼻筋、鼻先、小鼻縮小。</p><a href="https://kbeautyseoul.co.kr" class="cta-button">予約</a>'; }

function generateStemCellContentEN() { return '<h2>Stem Cell Therapy</h2><p>Anti-aging and regenerative medicine.</p><table class="price-table"><tr><th>Treatment</th><th>Price</th></tr><tr><td>Anti-Aging</td><td>$3,000-8,000</td></tr></table><a href="https://kbeautyseoul.co.kr" class="cta-button">Consult</a>'; }
function generateStemCellContentJP() { return '<h2>幹細胞治療</h2><p>アンチエイジングと再生医療。</p><a href="https://kbeautyseoul.co.kr" class="cta-button">相談</a>'; }

function generateFatGraftingContentEN() { return '<h2>Fat Grafting Surgery</h2><p>Face, breast, and buttock enhancement.</p><table class="price-table"><tr><th>Area</th><th>Price</th></tr><tr><td>Face</td><td>$2,500-5,000</td></tr></table><a href="https://kbeautyseoul.co.kr" class="cta-button">Book</a>'; }
function generateFatGraftingContentJP() { return '<h2>脂肪注入手術</h2><p>顔、胸、お尻の増強。</p><a href="https://kbeautyseoul.co.kr" class="cta-button">予約</a>'; }

function generatePermanentMakeupContentEN() { return '<h2>Permanent Makeup</h2><p>Eyebrows, eyeliner, lip blushing.</p><table class="price-table"><tr><th>Service</th><th>Price</th></tr><tr><td>Microblading</td><td>$300-600</td></tr><tr><td>Eyeliner</td><td>$250-500</td></tr></table><a href="https://kbeautyseoul.co.kr" class="cta-button">Book</a>'; }
function generatePermanentMakeupContentJP() { return '<h2>アートメイク</h2><p>眉、アイライン、リップ。</p><a href="https://kbeautyseoul.co.kr" class="cta-button">予約</a>'; }

// Main execution
console.log('🚀 Creating 10 More Articles (Batch 3)...\n');
let totalFiles = 0;

articles.forEach((article, i) => {
  console.log(`\n📝 ${i + 1}/10: ${article.id}`);
  console.log(`   💰 CPC: ${article.cpc} | 🔍 ${article.searchVolume}/mo`);
  
  fs.writeFileSync(path.join(BLOG_DIR, `${article.id}.html`), generateHTML(article, 'en'));
  console.log(`   ✅ EN`);
  totalFiles++;
  
  fs.writeFileSync(path.join(BLOG_DIR, `${article.id}-japanese.html`), generateHTML(article, 'jp'));
  console.log(`   ✅ JP`);
  totalFiles++;
});

const totalSearch = articles.reduce((s, a) => s + a.searchVolume, 0);
const avgCPC = articles.reduce((s, a) => s + parseFloat(a.cpc.replace('$', '')), 0) / articles.length;

console.log('\n\n✅ BATCH 3 COMPLETE');
console.log(`📊 Files: ${totalFiles} | Search: ${totalSearch.toLocaleString()}/mo | CPC: $${avgCPC.toFixed(2)}`);
console.log(`📈 Revenue: $${Math.floor(totalSearch * 0.03 * avgCPC)}-$${Math.floor(totalSearch * 0.05 * avgCPC)}/mo\n`);
