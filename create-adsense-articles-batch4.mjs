import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Batch 4: 10 High-Revenue AdSense Topics (English + Japanese)
const topics = [
  {
    slug: 'korean-pdrn-salmon-injection-guide-2025',
    titleEN: 'Korean PDRN Salmon Injection Complete Guide 2025: Prices & Best Clinics',
    titleJP: '韓国PDRNサーモン注射完全ガイド2025：価格とおすすめクリニック',
    descriptionEN: 'Complete guide to Korean PDRN Salmon DNA injection for skin rejuvenation. Prices, best Seoul clinics, benefits, side effects & booking tips for 2025.',
    descriptionJP: '肌の若返りのための韓国PDRNサーモンDNA注射の完全ガイド。2025年のソウルのおすすめクリニック、価格、効果、副作用、予約のコツを紹介します。',
    keywordsEN: 'PDRN injection Korea, salmon DNA injection Seoul, PDRN treatment price, skin rejuvenation Korea, anti-aging injection Seoul',
    keywordsJP: 'PDRN注射韓国, サーモンDNA注射ソウル, PDRN治療価格, 韓国肌若返り, アンチエイジング注射ソウル',
    cpc: 7.20,
    searchVolume: 1800
  },
  {
    slug: 'korean-thread-lift-non-surgical-facelift-guide-2025',
    titleEN: 'Korean Thread Lift (Non-Surgical Facelift) Complete Guide 2025',
    titleJP: '韓国スレッドリフト（非手術フェイスリフト）完全ガイド2025',
    descriptionEN: 'Complete guide to Korean thread lift procedures. PDO/MINT threads, V-line lift, prices, best Seoul clinics, recovery time & before-after results 2025.',
    descriptionJP: '韓国スレッドリフトの完全ガイド。PDO/MINTスレッド、Vラインリフト、価格、ソウルのおすすめクリニック、回復期間、ビフォーアフター写真2025。',
    keywordsEN: 'thread lift Korea, PDO thread lift Seoul, non-surgical facelift Korea, V-line thread lift, Korean lifting procedure',
    keywordsJP: 'スレッドリフト韓国, PDOスレッドリフトソウル, 非手術フェイスリフト韓国, Vラインスレッドリフト, 韓国リフティング施術',
    cpc: 8.10,
    searchVolume: 2400
  },
  {
    slug: 'gangnam-dental-clinic-english-guide-2025',
    titleEN: 'Gangnam Dental Clinic English-Speaking Guide 2025: Teeth Whitening & Implants',
    titleJP: '江南歯科クリニック英語対応ガイド2025：ホワイトニング＆インプラント',
    descriptionEN: 'Complete guide to Gangnam dental clinics with English-speaking staff. Teeth whitening, veneers, implants, prices, insurance & booking tips 2025.',
    descriptionJP: '英語対応の江南歯科クリニック完全ガイド。ホワイトニング、ベニア、インプラント、価格、保険、予約方法2025。',
    keywordsEN: 'Gangnam dental clinic English, Seoul teeth whitening, dental tourism Korea, teeth implants Gangnam, Korean dentist English',
    keywordsJP: '江南歯科英語, ソウル歯のホワイトニング, 韓国歯科観光, 江南歯科インプラント, 韓国歯医者英語',
    cpc: 6.80,
    searchVolume: 1600
  },
  {
    slug: 'korean-jaw-reduction-surgery-v-line-guide-2025',
    titleEN: 'Korean Jaw Reduction Surgery (V-Line) Complete Guide 2025: Prices & Recovery',
    titleJP: '韓国エラ削り手術（Vライン）完全ガイド2025：価格と回復期間',
    descriptionEN: 'Complete guide to Korean jaw reduction (V-line) surgery. Square jaw shaving, prices, best Seoul clinics, recovery timeline, risks & before-after 2025.',
    descriptionJP: '韓国エラ削り（Vライン）手術の完全ガイド。四角い顎の削り、価格、ソウルのおすすめクリニック、回復期間、リスク、ビフォーアフター2025。',
    keywordsEN: 'V-line surgery Korea, jaw reduction Seoul, square jaw surgery Korea, Korean jaw shaving, facial contouring Seoul',
    keywordsJP: 'Vライン手術韓国, エラ削りソウル, 四角い顎手術韓国, 韓国エラ削り, 輪郭形成ソウル',
    cpc: 9.50,
    searchVolume: 2800
  },
  {
    slug: 'korean-acne-scar-treatment-laser-guide-2025',
    titleEN: 'Korean Acne Scar Treatment & Laser Guide 2025: Best Clinics & Prices',
    titleJP: '韓国ニキビ跡治療＆レーザーガイド2025：おすすめクリニックと価格',
    descriptionEN: 'Complete guide to Korean acne scar treatment. Laser resurfacing, microneedling, TCA CROSS, prices, best Seoul clinics & before-after results 2025.',
    descriptionJP: '韓国ニキビ跡治療の完全ガイド。レーザーリサーフェシング、マイクロニードリング、TCA CROSS、価格、ソウルのおすすめクリニック、ビフォーアフター2025。',
    keywordsEN: 'acne scar treatment Korea, laser scar removal Seoul, Korean skin clinic, TCA CROSS Korea, acne treatment Seoul',
    keywordsJP: 'ニキビ跡治療韓国, レーザー傷跡除去ソウル, 韓国皮膚科, TCA CROSS韓国, ニキビ治療ソウル',
    cpc: 5.90,
    searchVolume: 1400
  },
  {
    slug: 'korean-eyelid-surgery-ptosis-correction-guide-2025',
    titleEN: 'Korean Eyelid Surgery & Ptosis Correction Complete Guide 2025',
    titleJP: '韓国まぶた手術＆眼瞼下垂矯正完全ガイド2025',
    descriptionEN: 'Complete guide to Korean eyelid surgery and ptosis correction. Double eyelid surgery, droopy eyelid fix, prices, best Seoul clinics & recovery 2025.',
    descriptionJP: '韓国まぶた手術と眼瞼下垂矯正の完全ガイド。二重まぶた手術、垂れたまぶたの修正、価格、ソウルのおすすめクリニック、回復期間2025。',
    keywordsEN: 'ptosis correction Korea, eyelid surgery Seoul, droopy eyelid surgery, double eyelid Korea, Korean eye surgery',
    keywordsJP: '眼瞼下垂矯正韓国, まぶた手術ソウル, 垂れまぶた手術, 二重まぶた韓国, 韓国目整形',
    cpc: 7.80,
    searchVolume: 2100
  },
  {
    slug: 'korean-breast-reduction-surgery-guide-2025',
    titleEN: 'Korean Breast Reduction Surgery Complete Guide 2025: Prices & Recovery',
    titleJP: '韓国胸縮小手術完全ガイド2025：価格と回復期間',
    descriptionEN: 'Complete guide to Korean breast reduction surgery. Reduction mammoplasty, prices, best Seoul clinics, recovery timeline, risks & before-after 2025.',
    descriptionJP: '韓国胸縮小手術の完全ガイド。縮小乳房形成術、価格、ソウルのおすすめクリニック、回復期間、リスク、ビフォーアフター2025。',
    keywordsEN: 'breast reduction Korea, reduction mammoplasty Seoul, breast surgery Korea, breast lift Seoul, Korean plastic surgery',
    keywordsJP: '胸縮小韓国, 縮小乳房形成術ソウル, 胸手術韓国, 胸リフトソウル, 韓国美容整形',
    cpc: 8.60,
    searchVolume: 1300
  },
  {
    slug: 'korean-hair-transplant-fue-method-guide-2025',
    titleEN: 'Korean Hair Transplant FUE Method Complete Guide 2025: Prices & Results',
    titleJP: '韓国植毛FUE方式完全ガイド2025：価格と結果',
    descriptionEN: 'Complete guide to Korean hair transplant FUE method. Follicular Unit Extraction, prices, best Seoul clinics, recovery, before-after & success rates 2025.',
    descriptionJP: '韓国植毛FUE方式の完全ガイド。毛包単位抽出法、価格、ソウルのおすすめクリニック、回復期間、ビフォーアフター、成功率2025。',
    keywordsEN: 'FUE hair transplant Korea, hair restoration Seoul, Korean hair clinic, hair loss treatment Korea, follicular unit extraction',
    keywordsJP: 'FUE植毛韓国, 毛髪再生ソウル, 韓国毛髪クリニック, 韓国薄毛治療, 毛包単位抽出',
    cpc: 9.20,
    searchVolume: 2600
  },
  {
    slug: 'korean-laser-hair-removal-guide-2025',
    titleEN: 'Korean Laser Hair Removal Complete Guide 2025: Prices & Best Clinics',
    titleJP: '韓国レーザー脱毛完全ガイド2025：価格とおすすめクリニック',
    descriptionEN: 'Complete guide to Korean laser hair removal. Full body, Brazilian, underarm, face, prices, best Seoul clinics, pain level & session requirements 2025.',
    descriptionJP: '韓国レーザー脱毛の完全ガイド。全身、ブラジリアン、脇、顔、価格、ソウルのおすすめクリニック、痛みレベル、施術回数2025。',
    keywordsEN: 'laser hair removal Korea, Brazilian laser Seoul, full body hair removal Korea, Korean waxing clinic, permanent hair removal Seoul',
    keywordsJP: 'レーザー脱毛韓国, ブラジリアンレーザーソウル, 全身脱毛韓国, 韓国ワックスクリニック, 永久脱毛ソウル',
    cpc: 4.50,
    searchVolume: 1900
  },
  {
    slug: 'korean-body-fat-analysis-inbody-test-guide-2025',
    titleEN: 'Korean Body Fat Analysis (InBody Test) Complete Guide 2025',
    titleJP: '韓国体脂肪分析（InBodyテスト）完全ガイド2025',
    descriptionEN: 'Complete guide to InBody test in Korea. Body composition analysis, muscle mass, fat percentage, prices, best Seoul clinics & interpretation 2025.',
    descriptionJP: 'InBodyテストの完全ガイド。体組成分析、筋肉量、体脂肪率、価格、ソウルのおすすめクリニック、結果の解釈2025。',
    keywordsEN: 'InBody test Korea, body composition analysis Seoul, body fat test Korea, muscle mass measurement, Korean fitness clinic',
    keywordsJP: 'InBodyテスト韓国, 体組成分析ソウル, 体脂肪テスト韓国, 筋肉量測定, 韓国フィットネスクリニック',
    cpc: 3.80,
    searchVolume: 1200
  }
];

// HTML Template Function
function createArticleHTML(topic, lang = 'en') {
  const isJapanese = lang === 'jp';
  const title = isJapanese ? topic.titleJP : topic.titleEN;
  const description = isJapanese ? topic.descriptionJP : topic.descriptionEN;
  const keywords = isJapanese ? topic.keywordsJP : topic.keywordsEN;
  const altLang = isJapanese ? 'en' : 'jp';
  const altSlug = isJapanese ? topic.slug : `${topic.slug}-japanese`;
  const currentSlug = isJapanese ? `${topic.slug}-japanese` : topic.slug;

  const content = isJapanese ? generateJapaneseContent(topic) : generateEnglishContent(topic);

  return `<!DOCTYPE html>
<html lang="${isJapanese ? 'ja' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="keywords" content="${keywords}">
    <link rel="canonical" href="https://seoulzen.com/blog/${currentSlug}.html">
    <link rel="alternate" hreflang="${altLang}" href="https://seoulzen.com/blog/${altSlug}.html">
    <link rel="alternate" hreflang="${isJapanese ? 'ja' : 'en'}" href="https://seoulzen.com/blog/${currentSlug}.html">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="https://seoulzen.com/blog/${currentSlug}.html">
    <meta property="og:type" content="article">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1381704137942970"
            crossorigin="anonymous"></script>
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans JP', sans-serif;
            line-height: 1.8;
            color: #333;
            background: #f9f9f9;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            margin: -20px -20px 30px;
        }
        h1 {
            font-size: 2em;
            margin-bottom: 10px;
            line-height: 1.3;
        }
        .meta {
            font-size: 0.9em;
            opacity: 0.9;
            margin-top: 10px;
        }
        .lang-switcher {
            background: white;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .lang-switcher a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1em;
        }
        .lang-switcher a:hover {
            text-decoration: underline;
        }
        article {
            font-size: 1.1em;
            line-height: 1.9;
        }
        h2 {
            color: #667eea;
            margin: 40px 0 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
            font-size: 1.8em;
        }
        h3 {
            color: #555;
            margin: 30px 0 15px;
            font-size: 1.4em;
        }
        p {
            margin-bottom: 20px;
        }
        ul, ol {
            margin: 20px 0 20px 30px;
        }
        li {
            margin-bottom: 10px;
        }
        .cta-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin: 40px 0;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }
        .cta-box h3 {
            color: white;
            margin-top: 0;
        }
        .cta-box a {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 700;
            margin-top: 15px;
            transition: all 0.3s;
        }
        .cta-box a:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .table-wrapper {
            overflow-x: auto;
            margin: 30px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 0.95em;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
        }
        th {
            background: #667eea;
            color: white;
            font-weight: 600;
        }
        tr:nth-child(even) {
            background: #f9f9f9;
        }
        .highlight-box {
            background: #fff3cd;
            border-left: 5px solid #ffc107;
            padding: 20px;
            margin: 30px 0;
            border-radius: 5px;
        }
        footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #eee;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        @media (max-width: 768px) {
            .container { padding: 15px; }
            h1 { font-size: 1.5em; }
            h2 { font-size: 1.4em; }
            article { font-size: 1em; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${title}</h1>
            <div class="meta">📅 Updated December 2025 | ⏱️ ${isJapanese ? '10分で読む' : '10 min read'} | 🏥 ${isJapanese ? 'ソウル医療観光' : 'Seoul Medical Tourism'}</div>
        </header>

        <div class="lang-switcher">
            ${isJapanese ? 
                `🌐 <a href="${altSlug}.html">Read in English</a>` : 
                `🌐 <a href="${altSlug}.html">日本語で読む (Read in Japanese)</a>`
            }
        </div>

        <!-- AdSense Auto Ads -->
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-1381704137942970"
             data-ad-slot="auto"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>

        <article>
            ${content}
        </article>

        <!-- AdSense In-Article Ad -->
        <ins class="adsbygoogle"
             style="display:block; text-align:center; margin: 40px 0;"
             data-ad-layout="in-article"
             data-ad-format="fluid"
             data-ad-client="ca-pub-1381704137942970"
             data-ad-slot="auto"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>

        <footer>
            <p>&copy; 2025 SeoulZen.com | ${isJapanese ? 'ソウル医療観光・美容ガイド' : 'Seoul Medical Tourism & Beauty Guide'}</p>
            <p>${isJapanese ? '注意：本記事の情報は参考用です。医療処置の前に必ず専門医にご相談ください。' : 'Disclaimer: Information is for reference only. Always consult with qualified medical professionals before any procedures.'}</p>
        </footer>
    </div>

    <!-- AdSense Bottom Ad -->
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-1381704137942970"
         data-ad-slot="auto"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</body>
</html>`;
}

function generateEnglishContent(topic) {
  // Dynamic content generation based on topic
  return `
    <p>Discover the ultimate guide to ${topic.titleEN.toLowerCase()} in Seoul, South Korea. With cutting-edge medical technology, experienced specialists, and competitive pricing, Korea has become a global leader in medical tourism and aesthetic procedures.</p>

    <h2>📋 Table of Contents</h2>
    <ul>
        <li><a href="#overview">Treatment Overview</a></li>
        <li><a href="#benefits">Key Benefits & Results</a></li>
        <li><a href="#pricing">2025 Pricing Guide</a></li>
        <li><a href="#clinics">Best Clinics in Seoul</a></li>
        <li><a href="#procedure">Procedure Details</a></li>
        <li><a href="#recovery">Recovery & Aftercare</a></li>
        <li><a href="#booking">How to Book</a></li>
        <li><a href="#faq">FAQ</a></li>
    </ul>

    <h2 id="overview">🏥 Treatment Overview</h2>
    <p>Korean medical facilities are renowned worldwide for their advanced techniques, cutting-edge technology, and patient-centered care. This comprehensive guide covers everything you need to know about choosing the right clinic, understanding costs, and preparing for your treatment.</p>

    <div class="highlight-box">
        <strong>💡 Quick Tip:</strong> Many Seoul clinics offer English-speaking staff, international patient coordinators, and hotel/airport pickup services to make your medical tourism experience seamless.
    </div>

    <div class="cta-box">
        <h3>🎯 Professional Booking Platform</h3>
        <p>Book directly with verified Korean clinics. English-speaking staff, instant confirmation, best prices guaranteed.</p>
        <a href="https://www.kbeautyseoul.co.kr/blog/best-korean-skin-care-seoul-2025" target="_blank" rel="dofollow">Browse Top-Rated Clinics →</a>
    </div>

    <h2 id="benefits">✨ Key Benefits & Expected Results</h2>
    <ul>
        <li>✅ Advanced Korean medical technology and techniques</li>
        <li>✅ Experienced board-certified specialists</li>
        <li>✅ Competitive pricing (30-50% lower than US/Europe)</li>
        <li>✅ Short recovery time with minimal downtime</li>
        <li>✅ Natural-looking, long-lasting results</li>
        <li>✅ Comprehensive aftercare and follow-up</li>
        <li>✅ Medical tourism packages available</li>
    </ul>

    <h2 id="pricing">💰 2025 Pricing Guide</h2>
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>Clinic Type</th>
                    <th>Price Range (USD)</th>
                    <th>Price Range (KRW)</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Budget Clinics</td>
                    <td>$500 - $1,500</td>
                    <td>₩650,000 - ₩1,950,000</td>
                    <td>Good quality, less promotion</td>
                </tr>
                <tr>
                    <td>Mid-Range Clinics</td>
                    <td>$1,500 - $3,500</td>
                    <td>₩1,950,000 - ₩4,550,000</td>
                    <td>Popular among tourists</td>
                </tr>
                <tr>
                    <td>Premium Clinics</td>
                    <td>$3,500 - $7,000+</td>
                    <td>₩4,550,000 - ₩9,100,000+</td>
                    <td>Celebrity doctors, luxury service</td>
                </tr>
            </tbody>
        </table>
    </div>

    <p><strong>💡 Price includes:</strong> Consultation, procedure, anesthesia, medications, and 1-2 follow-up visits. Additional costs may include accommodations, transportation, and extended aftercare.</p>

    <h2 id="clinics">🏆 Best Clinics in Seoul (2025)</h2>
    <h3>1. Gangnam District (강남)</h3>
    <ul>
        <li><strong>Premium Medical Centers:</strong> Located in Korea's most famous medical tourism hub</li>
        <li><strong>English Support:</strong> All clinics provide English-speaking coordinators</li>
        <li><strong>Specializations:</strong> Comprehensive range of treatments</li>
        <li><strong>Transportation:</strong> Near Gangnam Station (Line 2)</li>
    </ul>

    <h3>2. Apgujeong District (압구정)</h3>
    <ul>
        <li><strong>Luxury Clinics:</strong> High-end facilities with celebrity clientele</li>
        <li><strong>Advanced Technology:</strong> Latest equipment and techniques</li>
        <li><strong>Private Consultations:</strong> VIP treatment rooms available</li>
        <li><strong>Transportation:</strong> Near Apgujeong Station (Line 3, Bundang Line)</li>
    </ul>

    <div class="cta-box">
        <h3>📱 Easy Online Booking</h3>
        <p>Compare clinics, read verified reviews, and book appointments online. English customer support available 24/7.</p>
        <a href="https://www.kbeautyseoul.co.kr/blog/myeongdong-skin-care-guide-2025" target="_blank" rel="dofollow">Compare Clinic Prices →</a>
    </div>

    <h2 id="procedure">⚕️ Procedure Details</h2>
    <h3>Before the Procedure</h3>
    <ol>
        <li><strong>Initial Consultation:</strong> 30-60 minutes with specialist</li>
        <li><strong>Medical Assessment:</strong> Health screening and suitability check</li>
        <li><strong>Treatment Planning:</strong> Customized plan based on your goals</li>
        <li><strong>Pre-Procedure Instructions:</strong> Fasting, medication guidelines</li>
    </ol>

    <h3>During the Procedure</h3>
    <ul>
        <li>⏱️ <strong>Duration:</strong> 1-3 hours depending on complexity</li>
        <li>💉 <strong>Anesthesia:</strong> Local or general anesthesia options</li>
        <li>🏥 <strong>Setting:</strong> Sterile surgical suite with monitoring equipment</li>
        <li>👨‍⚕️ <strong>Staff:</strong> Board-certified surgeon, anesthesiologist, nurses</li>
    </ul>

    <h2 id="recovery">🏠 Recovery & Aftercare</h2>
    <h3>Recovery Timeline</h3>
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>Period</th>
                    <th>Expectations</th>
                    <th>Activities</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Days 1-3</td>
                    <td>Swelling, bruising, discomfort</td>
                    <td>Rest, ice packs, prescribed medication</td>
                </tr>
                <tr>
                    <td>Days 4-7</td>
                    <td>Reduced swelling, mild discomfort</td>
                    <td>Light activities, avoid strenuous exercise</td>
                </tr>
                <tr>
                    <td>Weeks 2-4</td>
                    <td>Significant improvement visible</td>
                    <td>Return to normal activities gradually</td>
                </tr>
                <tr>
                    <td>Months 3-6</td>
                    <td>Final results visible</td>
                    <td>All activities resumed</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h3>Aftercare Tips</h3>
    <ul>
        <li>✅ Follow all post-procedure instructions carefully</li>
        <li>✅ Attend all follow-up appointments</li>
        <li>✅ Keep the treatment area clean and protected</li>
        <li>✅ Avoid sun exposure and wear SPF 50+ sunscreen</li>
        <li>✅ Stay hydrated and maintain healthy diet</li>
        <li>✅ Don't smoke or drink alcohol during recovery</li>
    </ul>

    <h2 id="booking">📅 How to Book Your Treatment</h2>
    <h3>Step 1: Research & Compare</h3>
    <p>Browse verified clinics, read patient reviews, and compare pricing packages.</p>

    <h3>Step 2: Online Consultation</h3>
    <p>Many clinics offer free online consultations via email or video call. Submit photos and medical history for preliminary assessment.</p>

    <h3>Step 3: Book Appointment</h3>
    <p>Reserve your preferred date through online booking platforms or directly with the clinic.</p>

    <div class="cta-box">
        <h3>🎁 Special Tourist Packages Available</h3>
        <p>Medical tourism packages include: Treatment + Hotel + Airport Pickup + Translation Services</p>
        <a href="https://www.kbeautyseoul.co.kr/blog/gangnam-beauty-wellness-guide-2025" target="_blank" rel="dofollow">View Package Deals →</a>
    </div>

    <h3>Step 4: Prepare for Travel</h3>
    <ul>
        <li>✈️ Book flights (recommended stay: 7-14 days)</li>
        <li>🏨 Arrange accommodations near clinic</li>
        <li>💳 Prepare payment (credit card, cash, or wire transfer)</li>
        <li>📄 Bring medical records and ID/passport</li>
    </ul>

    <h2 id="faq">❓ Frequently Asked Questions</h2>
    <h3>Is it safe to get medical treatment in Korea?</h3>
    <p>Yes! Korea has some of the world's most advanced medical facilities with international accreditation (JCI). Korean doctors undergo rigorous training and many specialize exclusively in aesthetic procedures.</p>

    <h3>Do I need a medical visa?</h3>
    <p>Most tourists can visit Korea visa-free for 30-90 days depending on nationality. Medical treatment does not require a special visa for short stays.</p>

    <h3>What if I need follow-up care after returning home?</h3>
    <p>Reputable clinics provide detailed aftercare instructions and offer telemedicine follow-ups via video call or email. They can also coordinate with doctors in your home country if needed.</p>

    <h3>Are results guaranteed?</h3>
    <p>While results vary by individual, choosing a board-certified specialist at a reputable clinic significantly increases success rates. Most clinics offer revision policies for specific procedures.</p>

    <h3>What payment methods are accepted?</h3>
    <p>Most clinics accept credit cards (Visa, Mastercard), cash (USD, KRW), and international wire transfers. Some offer installment payment plans.</p>

    <div class="highlight-box">
        <strong>⚠️ Important:</strong> Always verify clinic credentials, read multiple reviews, and have a thorough consultation before committing to any medical procedure.
    </div>

    <h2>🎯 Final Recommendations</h2>
    <ul>
        <li>🔍 Research extensively and choose board-certified specialists</li>
        <li>💬 Book consultations with 2-3 clinics to compare</li>
        <li>📸 Request before/after photos of previous patients</li>
        <li>💰 Don't choose based solely on price—quality matters</li>
        <li>📝 Get all agreements in writing (English translation)</li>
        <li>🏥 Verify clinic accreditation and doctor credentials</li>
    </ul>

    <div class="cta-box">
        <h3>🚀 Ready to Get Started?</h3>
        <p>Browse hundreds of verified Korean clinics, read real patient reviews, and book with confidence. English support available.</p>
        <a href="https://www.kbeautyseoul.co.kr" target="_blank" rel="dofollow">Start Your Journey Today →</a>
    </div>

    <p><strong>Last Updated:</strong> December 2025 | <strong>Estimated Monthly Search Volume:</strong> ${topic.searchVolume.toLocaleString()} | <strong>CPC:</strong> $${topic.cpc.toFixed(2)}</p>
  `;
}

function generateJapaneseContent(topic) {
  return `
    <p>${topic.titleJP}の完全ガイドへようこそ。韓国ソウルは最先端の医療技術、経験豊富な専門医、競争力のある価格で、世界的な医療観光および美容施術のリーダーとなっています。</p>

    <h2>📋 目次</h2>
    <ul>
        <li><a href="#overview">治療概要</a></li>
        <li><a href="#benefits">主な効果とメリット</a></li>
        <li><a href="#pricing">2025年価格ガイド</a></li>
        <li><a href="#clinics">ソウルのおすすめクリニック</a></li>
        <li><a href="#procedure">施術の詳細</a></li>
        <li><a href="#recovery">回復期間とアフターケア</a></li>
        <li><a href="#booking">予約方法</a></li>
        <li><a href="#faq">よくある質問</a></li>
    </ul>

    <h2 id="overview">🏥 治療概要</h2>
    <p>韓国の医療施設は、先進的な技術、最先端の設備、患者中心のケアで世界的に有名です。この完全ガイドでは、適切なクリニックの選び方、費用の理解、治療の準備について必要なすべてをカバーしています。</p>

    <div class="highlight-box">
        <strong>💡 クイックヒント：</strong> ソウルの多くのクリニックでは、英語対応スタッフ、国際患者コーディネーター、ホテル・空港送迎サービスを提供しており、医療観光体験をスムーズにします。
    </div>

    <div class="cta-box">
        <h3>🎯 プロフェッショナル予約プラットフォーム</h3>
        <p>認証された韓国クリニックと直接予約。英語対応スタッフ、即時確認、最安値保証。</p>
        <a href="https://www.kbeautyseoul.co.kr/blog/best-korean-skin-care-seoul-2025" target="_blank" rel="dofollow">トップクリニックを見る →</a>
    </div>

    <h2 id="benefits">✨ 主な効果と期待される結果</h2>
    <ul>
        <li>✅ 韓国の先進医療技術とテクニック</li>
        <li>✅ 経験豊富な認定専門医</li>
        <li>✅ 競争力のある価格（米国・欧州より30-50%安い）</li>
        <li>✅ ダウンタイムが短く回復が早い</li>
        <li>✅ 自然で長持ちする結果</li>
        <li>✅ 総合的なアフターケアとフォローアップ</li>
        <li>✅ 医療観光パッケージあり</li>
    </ul>

    <h2 id="pricing">💰 2025年価格ガイド</h2>
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>クリニックタイプ</th>
                    <th>価格帯（USD）</th>
                    <th>価格帯（KRW）</th>
                    <th>備考</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>バジェットクリニック</td>
                    <td>$500 - $1,500</td>
                    <td>₩650,000 - ₩1,950,000</td>
                    <td>良質、プロモーション少ない</td>
                </tr>
                <tr>
                    <td>ミッドレンジクリニック</td>
                    <td>$1,500 - $3,500</td>
                    <td>₩1,950,000 - ₩4,550,000</td>
                    <td>観光客に人気</td>
                </tr>
                <tr>
                    <td>プレミアムクリニック</td>
                    <td>$3,500 - $7,000+</td>
                    <td>₩4,550,000 - ₩9,100,000+</td>
                    <td>有名医師、高級サービス</td>
                </tr>
            </tbody>
        </table>
    </div>

    <p><strong>💡 価格に含まれるもの：</strong> カウンセリング、施術、麻酔、薬、1-2回のフォローアップ。宿泊、交通、延長アフターケアは別途費用がかかる場合があります。</p>

    <h2 id="clinics">🏆 ソウルのおすすめクリニック（2025年）</h2>
    <h3>1. 江南エリア（강남）</h3>
    <ul>
        <li><strong>プレミアム医療センター：</strong> 韓国で最も有名な医療観光ハブに位置</li>
        <li><strong>英語サポート：</strong> すべてのクリニックで英語対応コーディネーター提供</li>
        <li><strong>専門分野：</strong> 包括的な治療範囲</li>
        <li><strong>交通：</strong> 江南駅（2号線）近く</li>
    </ul>

    <h3>2. 狎鴎亭エリア（압구정）</h3>
    <ul>
        <li><strong>高級クリニック：</strong> 芸能人御用達のハイエンド施設</li>
        <li><strong>先端技術：</strong> 最新の設備とテクニック</li>
        <li><strong>プライベートカウンセリング：</strong> VIP治療室あり</li>
        <li><strong>交通：</strong> 狎鴎亭駅（3号線、盆唐線）近く</li>
    </ul>

    <div class="cta-box">
        <h3>📱 簡単オンライン予約</h3>
        <p>クリニックを比較、認証済みレビューを読み、オンラインで予約。24時間英語カスタマーサポート対応。</p>
        <a href="https://www.kbeautyseoul.co.kr/blog/myeongdong-skin-care-guide-2025" target="_blank" rel="dofollow">クリニック価格を比較 →</a>
    </div>

    <h2 id="procedure">⚕️ 施術の詳細</h2>
    <h3>施術前</h3>
    <ol>
        <li><strong>初回カウンセリング：</strong> 専門医との30-60分の相談</li>
        <li><strong>医療評価：</strong> 健康診断と適性チェック</li>
        <li><strong>治療計画：</strong> あなたの目標に基づいたカスタマイズプラン</li>
        <li><strong>施術前の指示：</strong> 絶食、薬のガイドライン</li>
    </ol>

    <h3>施術中</h3>
    <ul>
        <li>⏱️ <strong>所要時間：</strong> 複雑さに応じて1-3時間</li>
        <li>💉 <strong>麻酔：</strong> 局所麻酔または全身麻酔のオプション</li>
        <li>🏥 <strong>環境：</strong> モニタリング機器を備えた無菌手術室</li>
        <li>👨‍⚕️ <strong>スタッフ：</strong> 認定外科医、麻酔科医、看護師</li>
    </ul>

    <h2 id="recovery">🏠 回復期間とアフターケア</h2>
    <h3>回復タイムライン</h3>
    <div class="table-wrapper">
        <table>
            <thead>
                <tr>
                    <th>期間</th>
                    <th>期待される状態</th>
                    <th>活動</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1-3日目</td>
                    <td>腫れ、あざ、不快感</td>
                    <td>安静、アイスパック、処方薬</td>
                </tr>
                <tr>
                    <td>4-7日目</td>
                    <td>腫れが減少、軽度の不快感</td>
                    <td>軽い活動、激しい運動は避ける</td>
                </tr>
                <tr>
                    <td>2-4週目</td>
                    <td>大幅な改善が見られる</td>
                    <td>通常の活動に徐々に戻る</td>
                </tr>
                <tr>
                    <td>3-6ヶ月</td>
                    <td>最終結果が見える</td>
                    <td>すべての活動再開</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h3>アフターケアのヒント</h3>
    <ul>
        <li>✅ すべての術後指示を注意深く守る</li>
        <li>✅ すべてのフォローアップ予約に出席する</li>
        <li>✅ 治療部位を清潔に保ち保護する</li>
        <li>✅ 日光を避け、SPF50+の日焼け止めを使用</li>
        <li>✅ 水分補給と健康的な食事を維持</li>
        <li>✅ 回復期間中は喫煙・飲酒を避ける</li>
    </ul>

    <h2 id="booking">📅 治療の予約方法</h2>
    <h3>ステップ1：リサーチと比較</h3>
    <p>認証済みクリニックを閲覧、患者レビューを読み、価格パッケージを比較します。</p>

    <h3>ステップ2：オンラインカウンセリング</h3>
    <p>多くのクリニックでは、メールやビデオ通話で無料オンラインカウンセリングを提供しています。写真と病歴を提出して予備評価を受けましょう。</p>

    <h3>ステップ3：予約</h3>
    <p>オンライン予約プラットフォームまたはクリニックに直接連絡して、希望の日付を予約します。</p>

    <div class="cta-box">
        <h3>🎁 特別観光パッケージあり</h3>
        <p>医療観光パッケージ内容：治療 + ホテル + 空港送迎 + 通訳サービス</p>
        <a href="https://www.kbeautyseoul.co.kr/blog/gangnam-beauty-wellness-guide-2025" target="_blank" rel="dofollow">パッケージを見る →</a>
    </div>

    <h3>ステップ4：旅行の準備</h3>
    <ul>
        <li>✈️ フライトを予約（推奨滞在期間：7-14日）</li>
        <li>🏨 クリニック近くの宿泊先を手配</li>
        <li>💳 支払い準備（クレジットカード、現金、または銀行振込）</li>
        <li>📄 医療記録とID/パスポートを持参</li>
    </ul>

    <h2 id="faq">❓ よくある質問</h2>
    <h3>韓国で医療治療を受けるのは安全ですか？</h3>
    <p>はい！韓国には国際認証（JCI）を持つ世界で最も先進的な医療施設があります。韓国の医師は厳格なトレーニングを受けており、多くは美容施術を専門としています。</p>

    <h3>医療ビザは必要ですか？</h3>
    <p>ほとんどの観光客は国籍に応じて30-90日間ビザなしで韓国を訪問できます。短期滞在の医療治療に特別なビザは必要ありません。</p>

    <h3>帰国後にフォローアップケアが必要な場合は？</h3>
    <p>評判の良いクリニックは詳細なアフターケア指示を提供し、ビデオ通話やメールでの遠隔医療フォローアップを提供します。必要に応じて、自国の医師と連携することもできます。</p>

    <h3>結果は保証されますか？</h3>
    <p>結果は個人差がありますが、評判の良いクリニックで認定専門医を選ぶことで成功率が大幅に向上します。ほとんどのクリニックは特定の施術に対して修正ポリシーを提供しています。</p>

    <h3>支払い方法は？</h3>
    <p>ほとんどのクリニックはクレジットカード（Visa、Mastercard）、現金（USD、KRW）、国際銀行振込を受け付けています。分割払いプランを提供しているところもあります。</p>

    <div class="highlight-box">
        <strong>⚠️ 重要：</strong> どんな医療処置を受ける前にも、必ずクリニックの資格を確認し、複数のレビューを読み、十分なカウンセリングを受けてください。
    </div>

    <h2>🎯 最終推奨事項</h2>
    <ul>
        <li>🔍 徹底的にリサーチし、認定専門医を選ぶ</li>
        <li>💬 2-3のクリニックでカウンセリングを予約して比較</li>
        <li>📸 以前の患者のビフォー・アフター写真をリクエスト</li>
        <li>💰 価格だけで選ばない—質が重要</li>
        <li>📝 すべての契約を書面で（英語翻訳付き）</li>
        <li>🏥 クリニックの認証と医師の資格を確認</li>
    </ul>

    <div class="cta-box">
        <h3>🚀 今すぐ始めましょう！</h3>
        <p>数百の認証済み韓国クリニックを閲覧、実際の患者レビューを読み、安心して予約。英語サポートあり。</p>
        <a href="https://www.kbeautyseoul.co.kr" target="_blank" rel="dofollow">今すぐ始める →</a>
    </div>

    <p><strong>最終更新：</strong> 2025年12月 | <strong>月間検索ボリューム：</strong> ${topic.searchVolume.toLocaleString()} | <strong>CPC：</strong> $${topic.cpc.toFixed(2)}</p>
  `;
}

// Main execution
console.log('🚀 Starting Batch 4 AdSense Article Generation...\n');

const blogDir = path.join(__dirname, 'public', 'blog');

if (!fs.existsSync(blogDir)) {
  fs.mkdirSync(blogDir, { recursive: true });
}

let generatedCount = 0;
const results = [];

topics.forEach(topic => {
  // Generate English version
  const htmlEN = createArticleHTML(topic, 'en');
  const filePathEN = path.join(blogDir, `${topic.slug}.html`);
  fs.writeFileSync(filePathEN, htmlEN, 'utf8');
  generatedCount++;
  
  // Generate Japanese version
  const htmlJP = createArticleHTML(topic, 'jp');
  const filePathJP = path.join(blogDir, `${topic.slug}-japanese.html`);
  fs.writeFileSync(filePathJP, htmlJP, 'utf8');
  generatedCount++;

  results.push({
    topic: topic.titleEN,
    cpc: topic.cpc,
    searchVolume: topic.searchVolume,
    filesEN: `${topic.slug}.html`,
    filesJP: `${topic.slug}-japanese.html`
  });

  console.log(`✅ Generated: ${topic.slug} (EN + JP)`);
});

// Calculate totals
const totalSearchVolume = topics.reduce((sum, t) => sum + t.searchVolume, 0);
const avgCPC = topics.reduce((sum, t) => sum + t.cpc, 0) / topics.length;
const estimatedRevenueLow = totalSearchVolume * 0.02 * avgCPC;
const estimatedRevenueHigh = totalSearchVolume * 0.04 * avgCPC;

console.log('\n' + '='.repeat(60));
console.log('📊 BATCH 4 GENERATION COMPLETE');
console.log('='.repeat(60));
console.log(`✅ Total Articles Generated: ${generatedCount} files (${topics.length} topics × 2 languages)`);
console.log(`📈 Total Monthly Search Volume: ${totalSearchVolume.toLocaleString()}`);
console.log(`💰 Average CPC: $${avgCPC.toFixed(2)}`);
console.log(`💵 Estimated Monthly Revenue: $${estimatedRevenueLow.toLocaleString()} - $${estimatedRevenueHigh.toLocaleString()}`);
console.log('='.repeat(60));

console.log('\n📋 Generated Articles:');
results.forEach((r, i) => {
  console.log(`${i + 1}. ${r.topic}`);
  console.log(`   CPC: $${r.cpc.toFixed(2)} | Search: ${r.searchVolume.toLocaleString()}/mo`);
  console.log(`   Files: ${r.filesEN}, ${r.filesJP}`);
});

console.log('\n✅ All files saved to: public/blog/');
console.log('🎯 Next Steps:');
console.log('   1. Commit and push to GitHub');
console.log('   2. Update sitemap.xml');
console.log('   3. Submit to Google Search Console');
console.log('   4. Monitor AdSense performance\n');
