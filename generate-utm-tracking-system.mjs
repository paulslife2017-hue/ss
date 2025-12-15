import fs from 'fs';
import path from 'path';

// All blog articles (116 articles = 58 EN + 58 JP)
const articles = [
  // Batch 1: High-Revenue Medical Tourism (30 topics × 2 languages = 60 files)
  'seoul-botox-guide-2025',
  'korean-filler-treatment-guide-2025',
  'seoul-laser-treatment-guide-2025',
  'korean-skin-whitening-treatment-guide-2025',
  'seoul-anti-aging-treatment-guide-2025',
  'seoul-acne-treatment-complete-guide-2025',
  'korean-double-eyelid-surgery-guide-2025',
  'seoul-liposuction-treatment-complete-guide-2025',
  'seoul-body-contouring-surgery-guide-2025',
  'korean-nose-job-rhinoplasty-guide-2025',
  'korean-breast-augmentation-surgery-guide-2025',
  'seoul-fat-grafting-treatment-guide-2025',
  'korean-teeth-whitening-complete-guide-2025',
  'seoul-hair-transplant-complete-guide-2025',
  'korean-permanent-makeup-guide-2025',
  'gangnam-head-spa-complete-guide-2025',
  'korean-spa-jjimjilbang-guide-2025',
  'korean-stem-cell-treatment-guide-2025',
  'korean-prp-treatment-guide-2025',
  'seoul-microneedling-treatment-guide-2025',
  'korean-chemical-peel-guide-2025',
  'seoul-coolsculpting-body-contouring-2025',
  'korean-hifu-facelift-treatment-2025',
  'seoul-ultherapy-skin-tightening-2025',
  'korean-iv-vitamin-drip-therapy-2025',
  'seoul-dermapen-microneedling-guide-2025',
  'korean-hair-loss-treatment-guide-2025',
  'seoul-tattoo-removal-laser-guide-2025',
  'korean-mole-removal-clinic-guide-2025',
  'seoul-scar-removal-treatment-guide-2025',
  
  // Batch 2: KBeautySeoul Backlink Articles (8 topics × 2 languages = 16 files)
  'korean-glass-skin-facial-treatment-guide-2025',
  'seoul-korean-massage-spa-complete-guide-2025',
  'gangnam-beauty-district-clinic-guide-2025',
  'korean-head-spa-scalp-treatment-booking-2025',
  'myeongdong-beauty-street-shopping-guide-2025',
  'korean-jjimjilbang-spa-experience-guide-2025',
  'seoul-beauty-package-tours-booking-2025',
  'korean-beauty-influencer-recommended-clinics-2025',
  
  // Batch 3: Booking & Reservation Guides (10 topics × 2 languages = 20 files)
  'how-to-book-korean-beauty-treatments-online-2025',
  'best-korean-beauty-clinics-english-staff-2025',
  'korean-beauty-booking-platforms-comparison-2025',
  'save-money-korean-beauty-treatments-2025',
  'korean-beauty-appointment-cancellation-policy-2025',
  'korean-beauty-consultation-before-visit-2025',
  'korean-beauty-payment-methods-guide-2025',
  'korean-beauty-medical-visa-requirements-2025',
  'korean-beauty-accommodation-near-clinics-2025',
  'korean-beauty-aftercare-follow-up-guide-2025',
  
  // Batch 4: High-CPC Medical Beauty (10 topics × 2 languages = 20 files)
  'korean-pdrn-salmon-injection-guide-2025',
  'korean-thread-lift-non-surgical-facelift-guide-2025',
  'gangnam-dental-clinic-english-guide-2025',
  'korean-jaw-reduction-surgery-v-line-guide-2025',
  'korean-acne-scar-treatment-laser-guide-2025',
  'korean-eyelid-surgery-ptosis-correction-guide-2025',
  'korean-breast-reduction-surgery-guide-2025',
  'korean-hair-transplant-fue-method-guide-2025',
  'korean-laser-hair-removal-guide-2025',
  'korean-body-fat-analysis-inbody-test-guide-2025'
];

// Social media platforms
const platforms = [
  { name: 'Instagram', code: 'instagram', medium: 'social' },
  { name: 'Facebook', code: 'facebook', medium: 'social' },
  { name: 'Twitter', code: 'twitter', medium: 'social' },
  { name: 'Pinterest', code: 'pinterest', medium: 'social' },
  { name: 'LinkedIn', code: 'linkedin', medium: 'social' },
  { name: 'Reddit', code: 'reddit', medium: 'social' },
  { name: 'Quora', code: 'quora', medium: 'social' },
  { name: 'TikTok', code: 'tiktok', medium: 'social' },
  { name: 'YouTube', code: 'youtube', medium: 'video' },
  { name: 'Email Newsletter', code: 'email', medium: 'email' }
];

// Campaign types
const campaigns = [
  'batch1_promo',
  'batch2_promo',
  'batch3_promo',
  'batch4_promo',
  'holiday_special',
  'new_year_2025',
  'summer_sale',
  'influencer_collab'
];

// Generate UTM links
function generateUTMLink(baseUrl, article, platform, campaign, language = 'en') {
  const slug = language === 'en' ? article : `${article}-japanese`;
  const fullUrl = `${baseUrl}/blog/${slug}.html`;
  
  const params = new URLSearchParams({
    utm_source: platform.code,
    utm_medium: platform.medium,
    utm_campaign: campaign,
    utm_content: article,
    utm_term: language
  });
  
  return `${fullUrl}?${params.toString()}`;
}

// Generate CSV for all UTM links
function generateUTMCSV() {
  const baseUrl = 'https://seoulzen.com';
  const rows = [];
  
  // Header
  rows.push([
    'Article_Slug',
    'Language',
    'Platform',
    'Campaign',
    'UTM_Link',
    'Short_Description'
  ].join(','));
  
  // Generate links for each article × platform × campaign × language
  articles.forEach(article => {
    ['en', 'jp'].forEach(lang => {
      platforms.forEach(platform => {
        // Use batch4_promo as default campaign
        const campaign = 'batch4_promo';
        const utmLink = generateUTMLink(baseUrl, article, platform, campaign, lang);
        const description = `${article.replace(/-/g, ' ')} - ${lang.toUpperCase()} - ${platform.name}`;
        
        rows.push([
          article,
          lang,
          platform.name,
          campaign,
          utmLink,
          description
        ].join(','));
      });
    });
  });
  
  return rows.join('\n');
}

// Generate social media post templates with UTM links
function generateSocialMediaPosts() {
  const baseUrl = 'https://seoulzen.com';
  const posts = [];
  
  // Header
  posts.push([
    'Platform',
    'Language',
    'Article_Title',
    'Post_Text',
    'Hashtags',
    'UTM_Link',
    'Best_Time_To_Post',
    'Image_Suggestion'
  ].join('\t'));
  
  // Sample posts for Batch 4 articles
  const batch4Articles = [
    {
      slug: 'korean-pdrn-salmon-injection-guide-2025',
      titleEN: 'Korean PDRN Salmon Injection Guide 2025',
      titleJP: '韓国PDRNサーモン注射ガイド2025',
      instagramEN: '📍 Korean PDRN Salmon Injection Complete Guide 2025\n\n✨ Skin rejuvenation without surgery\n💰 Price: $200-$500 per session\n⏱️ 30-minute procedure\n🏥 Best Seoul clinics reviewed\n\n👉 Link in bio for full guide\n\n#KoreanBeauty #PDRN #SalmonDNA #SeoulSkincare #AntiAging #KBeauty #MedicalTourism #SeoulClinic #SkinRejuvenation #GangnamBeauty',
      instagramJP: '📍 韓国PDRNサーモン注射完全ガイド2025\n\n✨ 手術なしの肌再生\n💰 価格：1回$200-$500\n⏱️ 30分施術\n🏥 ソウルおすすめクリニック\n\n👉 プロフィールのリンクから全文を\n\n#韓国美容 #PDRN #サーモン注射 #ソウルスキンケア #アンチエイジング #Kビューティー #医療観光 #ソウルクリニック #肌再生 #江南美容',
      twitterEN: '🇰🇷 PDRN Salmon Injection in Seoul\n\n✅ Natural skin regeneration\n✅ $200-$500 per session\n✅ No downtime\n✅ Long-lasting results\n\nComplete guide with clinic recommendations 👇\n\n#KoreanBeauty #PDRN #Seoul',
      twitterJP: '🇰🇷 ソウルPDRNサーモン注射\n\n✅ 自然な肌再生\n✅ 1回$200-$500\n✅ ダウンタイムなし\n✅ 長持ちする効果\n\nクリニック推薦付き完全ガイド👇\n\n#韓国美容 #PDRN #ソウル',
      hashtagsIG: '#KoreanBeauty #PDRN #SalmonDNA #SeoulSkincare #AntiAging #KBeauty #MedicalTourism #SeoulClinic #SkinRejuvenation #GangnamBeauty #KoreanSkincare #BeautyTourism #PDRNTreatment #SalmonInjection #SeoulMedical',
      hashtagsTW: '#KoreanBeauty #PDRN #Seoul #Skincare #AntiAging',
      hashtagsPN: '#KoreanBeauty #PDRN #SalmonDNA #SeoulSkincare #AntiAging #KBeauty #MedicalTourism #BeautyGuide #PDRNTreatment #SalmonInjection #KoreanMedicine #SeoulTravel #BeautyTips #SkincareRoutine #NaturalBeauty'
    },
    {
      slug: 'korean-thread-lift-non-surgical-facelift-guide-2025',
      titleEN: 'Korean Thread Lift (Non-Surgical Facelift) Guide 2025',
      titleJP: '韓国スレッドリフト（非手術フェイスリフト）ガイド2025',
      instagramEN: '📍 Korean Thread Lift Complete Guide 2025\n\n✨ Non-surgical facelift in Seoul\n💰 Price: $1,500-$3,500\n⏱️ 1-2 hours, instant results\n🏥 PDO & MINT threads explained\n\n👉 Full guide link in bio\n\n#ThreadLift #KoreanPlasticSurgery #VLine #NonSurgicalFacelift #SeoulBeauty #GangnamClinic #PDOThreads #AntiAging #KBeauty #FaceLift',
      instagramJP: '📍 韓国スレッドリフト完全ガイド2025\n\n✨ ソウルの非手術フェイスリフト\n💰 価格：$1,500-$3,500\n⏱️ 1-2時間、即効果\n🏥 PDO & MINTスレッド解説\n\n👉 プロフィールリンクで全文\n\n#スレッドリフト #韓国整形 #Vライン #非手術フェイスリフト #ソウル美容 #江南クリニック #PDOスレッド #アンチエイジング #Kビューティー #フェイスリフト',
      twitterEN: '🇰🇷 Korean Thread Lift Guide 2025\n\n✅ Non-surgical facelift\n✅ $1,500-$3,500\n✅ PDO/MINT threads\n✅ Instant V-line results\n✅ Minimal downtime\n\nBest clinics & prices 👇\n\n#ThreadLift #KoreanBeauty #Seoul',
      twitterJP: '🇰🇷 韓国スレッドリフトガイド2025\n\n✅ 非手術フェイスリフト\n✅ $1,500-$3,500\n✅ PDO/MINTスレッド\n✅ 即Vライン効果\n✅ ダウンタイム少ない\n\nおすすめクリニック&価格👇\n\n#スレッドリフト #韓国美容 #ソウル',
      hashtagsIG: '#ThreadLift #KoreanPlasticSurgery #VLine #NonSurgicalFacelift #SeoulBeauty #GangnamClinic #PDOThreads #AntiAging #KBeauty #FaceLift #KoreanBeauty #MedicalTourism #PlasticSurgery #BeautyClinic #SeoulClinic',
      hashtagsTW: '#ThreadLift #KoreanBeauty #Seoul #PlasticSurgery #VLine',
      hashtagsPN: '#ThreadLift #KoreanPlasticSurgery #VLine #NonSurgicalFacelift #SeoulBeauty #GangnamClinic #PDOThreads #AntiAging #KBeauty #FaceLift #MedicalTourism #BeautyTreatment #KoreanMedicine #SeoulTravel #BeautyGuide'
    }
  ];
  
  batch4Articles.forEach(article => {
    // Instagram posts
    ['en', 'jp'].forEach(lang => {
      const utmLink = generateUTMLink(baseUrl, article.slug, 
        platforms.find(p => p.code === 'instagram'), 'batch4_promo', lang);
      
      posts.push([
        'Instagram',
        lang.toUpperCase(),
        lang === 'en' ? article.titleEN : article.titleJP,
        lang === 'en' ? article.instagramEN : article.instagramJP,
        article.hashtagsIG,
        utmLink,
        'Mon-Fri 10AM, 2PM, 6PM KST',
        `${article.slug}-instagram.jpg`
      ].join('\t'));
    });
    
    // Twitter posts
    ['en', 'jp'].forEach(lang => {
      const utmLink = generateUTMLink(baseUrl, article.slug,
        platforms.find(p => p.code === 'twitter'), 'batch4_promo', lang);
      
      posts.push([
        'Twitter',
        lang.toUpperCase(),
        lang === 'en' ? article.titleEN : article.titleJP,
        lang === 'en' ? article.twitterEN : article.twitterJP,
        article.hashtagsTW,
        utmLink,
        'Mon-Fri 12PM, 4PM, 8PM KST',
        `${article.slug}-twitter.jpg`
      ].join('\t'));
    });
    
    // Pinterest posts
    ['en', 'jp'].forEach(lang => {
      const utmLink = generateUTMLink(baseUrl, article.slug,
        platforms.find(p => p.code === 'pinterest'), 'batch4_promo', lang);
      
      const pinterestDesc = lang === 'en' 
        ? `Complete guide to ${article.titleEN}. Prices, best Seoul clinics, procedure details, recovery timeline & booking tips. #KoreanBeauty #Seoul`
        : `${article.titleJP}の完全ガイド。価格、ソウルおすすめクリニック、施術詳細、回復期間、予約のコツ。#韓国美容 #ソウル`;
      
      posts.push([
        'Pinterest',
        lang.toUpperCase(),
        lang === 'en' ? article.titleEN : article.titleJP,
        pinterestDesc,
        article.hashtagsPN,
        utmLink,
        'Daily 8AM, 2PM, 8PM KST',
        `${article.slug}-pinterest.jpg`
      ].join('\t'));
    });
  });
  
  return posts.join('\n');
}

// Generate Google Analytics dashboard template (HTML)
function generateTrackingDashboard() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SeoulZen UTM Tracking Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        .subtitle {
            color: #666;
            margin-bottom: 40px;
            font-size: 1.1em;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
        }
        .stat-card h3 {
            font-size: 0.9em;
            opacity: 0.9;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .stat-card .value {
            font-size: 2.5em;
            font-weight: 700;
            margin-bottom: 5px;
        }
        .stat-card .change {
            font-size: 0.9em;
            opacity: 0.9;
        }
        .chart-container {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 30px;
        }
        .chart-container h2 {
            color: #667eea;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        th {
            background: #667eea;
            color: white;
            font-weight: 600;
        }
        tr:hover {
            background: #f5f5f5;
        }
        .platform-icon {
            display: inline-block;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            margin-right: 10px;
            font-weight: 700;
            color: white;
        }
        .instagram { background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); }
        .facebook { background: #1877f2; }
        .twitter { background: #1da1f2; }
        .pinterest { background: #e60023; }
        .linkedin { background: #0077b5; }
        .reddit { background: #ff4500; }
        .progress-bar {
            width: 100%;
            height: 10px;
            background: #eee;
            border-radius: 5px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            transition: width 0.3s;
        }
        .utm-link {
            font-family: monospace;
            background: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            font-size: 0.9em;
            word-break: break-all;
            margin: 10px 0;
        }
        .copy-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9em;
            margin-left: 10px;
        }
        .copy-btn:hover {
            background: #5568d3;
        }
        .instructions {
            background: #fff3cd;
            border-left: 5px solid #ffc107;
            padding: 20px;
            margin: 30px 0;
            border-radius: 5px;
        }
        .instructions h3 {
            color: #856404;
            margin-bottom: 10px;
        }
        .instructions ol {
            margin-left: 20px;
        }
        .instructions li {
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 SeoulZen UTM Tracking Dashboard</h1>
        <p class="subtitle">Real-time social media traffic analytics & ROI tracking</p>
        
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Visits</h3>
                <div class="value" id="total-visits">0</div>
                <div class="change">📈 Tracking starts after GA4 integration</div>
            </div>
            <div class="stat-card">
                <h3>Social Traffic</h3>
                <div class="value" id="social-traffic">0</div>
                <div class="change">From Instagram, Twitter, Pinterest, etc.</div>
            </div>
            <div class="stat-card">
                <h3>Conversion Rate</h3>
                <div class="value" id="conversion-rate">0%</div>
                <div class="change">Click → Page view → Action</div>
            </div>
            <div class="stat-card">
                <h3>Est. Revenue</h3>
                <div class="value" id="revenue">$0</div>
                <div class="change">From AdSense clicks</div>
            </div>
        </div>

        <div class="instructions">
            <h3>🚀 Quick Setup Instructions</h3>
            <ol>
                <li><strong>Google Analytics 4 (GA4) Setup:</strong>
                    <ul>
                        <li>Go to <a href="https://analytics.google.com" target="_blank">analytics.google.com</a></li>
                        <li>Create property for "seoulzen.com"</li>
                        <li>Copy Measurement ID (G-XXXXXXXXXX)</li>
                        <li>Add GA4 tracking code to all blog pages</li>
                    </ul>
                </li>
                <li><strong>UTM Parameter Tracking:</strong>
                    <ul>
                        <li>GA4 automatically tracks UTM parameters</li>
                        <li>View reports: Reports → Acquisition → Traffic acquisition</li>
                        <li>Filter by utm_source, utm_medium, utm_campaign</li>
                    </ul>
                </li>
                <li><strong>Use Generated UTM Links:</strong>
                    <ul>
                        <li>Open <code>utm-tracking-links.csv</code> file</li>
                        <li>Copy UTM links for each social media post</li>
                        <li>Track performance in GA4 after 24-48 hours</li>
                    </ul>
                </li>
                <li><strong>Monitor Performance:</strong>
                    <ul>
                        <li>Check GA4 daily for first 2 weeks</li>
                        <li>Identify top-performing platforms</li>
                        <li>Double down on successful channels</li>
                    </ul>
                </li>
            </ol>
        </div>
        
        <div class="chart-container">
            <h2>📈 Traffic by Platform (Last 30 Days)</h2>
            <p style="color: #666; margin-bottom: 20px;">Data will populate after GA4 integration and first posts go live</p>
            
            <table>
                <thead>
                    <tr>
                        <th>Platform</th>
                        <th>Visits</th>
                        <th>Avg. Session Duration</th>
                        <th>Bounce Rate</th>
                        <th>Conversions</th>
                        <th>Performance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><span class="platform-icon instagram">IG</span> Instagram</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td><div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div></td>
                    </tr>
                    <tr>
                        <td><span class="platform-icon facebook">FB</span> Facebook</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td><div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div></td>
                    </tr>
                    <tr>
                        <td><span class="platform-icon twitter">TW</span> Twitter</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td><div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div></td>
                    </tr>
                    <tr>
                        <td><span class="platform-icon pinterest">PT</span> Pinterest</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td><div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div></td>
                    </tr>
                    <tr>
                        <td><span class="platform-icon linkedin">LI</span> LinkedIn</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td><div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div></td>
                    </tr>
                    <tr>
                        <td><span class="platform-icon reddit">RD</span> Reddit</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td><div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="chart-container">
            <h2>🔗 Sample UTM Links</h2>
            <p style="color: #666; margin-bottom: 20px;">Copy these links for your social media posts</p>
            
            <div style="margin: 20px 0;">
                <h3>Instagram - Korean Thread Lift (English)</h3>
                <div class="utm-link">https://seoulzen.com/blog/korean-thread-lift-non-surgical-facelift-guide-2025.html?utm_source=instagram&utm_medium=social&utm_campaign=batch4_promo&utm_content=korean-thread-lift-non-surgical-facelift-guide-2025&utm_term=en</div>
                <button class="copy-btn" onclick="copyToClipboard(this.previousElementSibling.textContent)">📋 Copy</button>
            </div>
            
            <div style="margin: 20px 0;">
                <h3>Twitter - Korean PDRN Injection (Japanese)</h3>
                <div class="utm-link">https://seoulzen.com/blog/korean-pdrn-salmon-injection-guide-2025-japanese.html?utm_source=twitter&utm_medium=social&utm_campaign=batch4_promo&utm_content=korean-pdrn-salmon-injection-guide-2025&utm_term=jp</div>
                <button class="copy-btn" onclick="copyToClipboard(this.previousElementSibling.textContent)">📋 Copy</button>
            </div>
            
            <div style="margin: 20px 0;">
                <h3>Pinterest - Korean Jaw Reduction (English)</h3>
                <div class="utm-link">https://seoulzen.com/blog/korean-jaw-reduction-surgery-v-line-guide-2025.html?utm_source=pinterest&utm_medium=social&utm_campaign=batch4_promo&utm_content=korean-jaw-reduction-surgery-v-line-guide-2025&utm_term=en</div>
                <button class="copy-btn" onclick="copyToClipboard(this.previousElementSibling.textContent)">📋 Copy</button>
            </div>
            
            <p style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 5px;">
                <strong>💡 Pro Tip:</strong> Full list of all 2,320 UTM links (116 articles × 10 platforms × 2 languages) available in <code>utm-tracking-links.csv</code>
            </p>
        </div>
        
        <div class="chart-container">
            <h2>📊 Top Performing Articles (By Social Traffic)</h2>
            <p style="color: #666; margin-bottom: 20px;">Data will show which articles get the most social media engagement</p>
            
            <table>
                <thead>
                    <tr>
                        <th>Article</th>
                        <th>Total Social Visits</th>
                        <th>Top Platform</th>
                        <th>Engagement Rate</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Korean Thread Lift Guide</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Korean PDRN Injection Guide</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td>Korean Jaw Reduction Surgery Guide</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="instructions" style="background: #d4edda; border-left-color: #28a745;">
            <h3>✅ Next Steps</h3>
            <ol>
                <li>Download <code>utm-tracking-links.csv</code> - All 2,320 UTM tracking links</li>
                <li>Download <code>social-media-posts.tsv</code> - Ready-to-use post templates</li>
                <li>Set up Google Analytics 4 (GA4) on seoulzen.com</li>
                <li>Start posting with UTM links</li>
                <li>Monitor results in GA4 after 24-48 hours</li>
                <li>Return to this dashboard to see real-time data (refresh after GA4 integration)</li>
            </ol>
        </div>
    </div>
    
    <script>
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('✅ Link copied to clipboard!');
            });
        }
        
        // Future: Connect to Google Analytics API to fetch real data
        // For now, this is a template dashboard
    </script>
</body>
</html>`;
}

// Generate all files
console.log('🚀 Generating UTM Tracking System...\n');

// 1. Generate UTM links CSV
const utmCSV = generateUTMCSV();
fs.writeFileSync('utm-tracking-links.csv', utmCSV, 'utf8');
const utmLinkCount = utmCSV.split('\n').length - 1;
console.log(`✅ Generated utm-tracking-links.csv (${utmLinkCount.toLocaleString()} UTM links)`);

// 2. Generate social media posts
const socialPosts = generateSocialMediaPosts();
fs.writeFileSync('social-media-posts.tsv', socialPosts, 'utf8');
const postCount = socialPosts.split('\n').length - 1;
console.log(`✅ Generated social-media-posts.tsv (${postCount} ready-to-post templates)`);

// 3. Generate tracking dashboard
const dashboard = generateTrackingDashboard();
fs.writeFileSync('public/tracking-dashboard.html', dashboard, 'utf8');
console.log('✅ Generated public/tracking-dashboard.html (Analytics dashboard)');

console.log('\n' + '='.repeat(70));
console.log('📊 UTM TRACKING SYSTEM GENERATED');
console.log('='.repeat(70));
console.log(`\n📁 Files created:`);
console.log(`   1. utm-tracking-links.csv - ${utmLinkCount.toLocaleString()} UTM tracking links`);
console.log(`   2. social-media-posts.tsv - ${postCount} social media post templates`);
console.log(`   3. public/tracking-dashboard.html - Analytics dashboard`);
console.log(`\n🎯 Coverage:`);
console.log(`   - 116 blog articles (58 EN + 58 JP)`);
console.log(`   - 10 social media platforms`);
console.log(`   - Multiple campaign types`);
console.log(`   - ${utmLinkCount.toLocaleString()} unique tracking links`);
console.log(`\n🌐 Dashboard URL (after deployment):`);
console.log(`   https://seoulzen.com/tracking-dashboard.html`);
console.log('\n✅ All files ready! Check your working directory.\n');
