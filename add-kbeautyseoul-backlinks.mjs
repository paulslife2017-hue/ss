import fs from 'fs';
import path from 'path';

console.log('🔗 Adding High-Quality KBeautySeoul Backlinks to SeoulZen Articles...\n');

// KBeautySeoul 서비스 카테고리별 백링크 전략
const backlinkStrategies = {
  skincare: {
    text: 'Book professional Korean skin care treatments',
    url: 'https://www.kbeautyseoul.co.kr/blog/best-korean-skin-care-seoul-2025',
    context: 'skin care, facial, dermatology, glass skin'
  },
  massage: {
    text: 'Book authentic Korean massage services',
    url: 'https://kbeautyseoul.co.kr/blog/seoul-massage-booking-guide-2025',
    context: 'massage, spa, relaxation, body treatment'
  },
  headspa: {
    text: 'Experience premium Korean scalp treatments',
    url: 'https://www.kbeautyseoul.co.kr/blog/hongdae-nail-salon-guide-2025',
    context: 'head spa, scalp care, hair treatment'
  },
  gangnam: {
    text: 'Explore Gangnam beauty & wellness services',
    url: 'https://www.kbeautyseoul.co.kr/blog/gangnam-beauty-wellness-guide-2025',
    context: 'Gangnam, beauty clinic, wellness'
  },
  myeongdong: {
    text: 'Visit Myeongdong skin care clinics',
    url: 'https://www.kbeautyseoul.co.kr/blog/myeongdong-skin-care-guide-2025',
    context: 'Myeongdong, skin clinic, facial'
  },
  posture: {
    text: 'Book body alignment & posture correction services',
    url: 'https://www.kbeautyseoul.co.kr/blog/seoul-body-alignment-posture-guide-2025',
    context: 'posture, alignment, chiropractic, physical therapy'
  }
};

// 백링크를 추가할 기사 목록 (최신 고수익 기사 중심)
const articlesToUpdate = [
  // Batch 1 articles
  {
    file: 'public/blog/seoul-botox-guide-2025.html',
    backlinks: ['skincare', 'gangnam'],
    insertAfter: '</h1>'
  },
  {
    file: 'public/blog/korean-filler-treatment-guide-2025.html',
    backlinks: ['skincare', 'myeongdong'],
    insertAfter: '</h1>'
  },
  {
    file: 'public/blog/seoul-laser-treatment-guide-2025.html',
    backlinks: ['skincare', 'gangnam'],
    insertAfter: '</h1>'
  },
  
  // Batch 2 articles
  {
    file: 'public/blog/korean-skin-whitening-treatment-guide-2025.html',
    backlinks: ['skincare', 'myeongdong'],
    insertAfter: '</h1>'
  },
  {
    file: 'public/blog/seoul-anti-aging-treatment-guide-2025.html',
    backlinks: ['skincare', 'gangnam'],
    insertAfter: '</h1>'
  },
  {
    file: 'public/blog/seoul-acne-treatment-complete-guide-2025.html',
    backlinks: ['skincare', 'myeongdong'],
    insertAfter: '</h1>'
  },
  
  // Batch 3 articles
  {
    file: 'public/blog/korean-double-eyelid-surgery-guide-2025.html',
    backlinks: ['gangnam', 'skincare'],
    insertAfter: '</h1>'
  },
  {
    file: 'public/blog/seoul-liposuction-treatment-complete-guide-2025.html',
    backlinks: ['gangnam', 'posture'],
    insertAfter: '</h1>'
  },
  {
    file: 'public/blog/seoul-body-contouring-surgery-guide-2025.html',
    backlinks: ['gangnam', 'posture'],
    insertAfter: '</h1>'
  },
  {
    file: 'public/blog/korean-nose-job-rhinoplasty-guide-2025.html',
    backlinks: ['gangnam', 'skincare'],
    insertAfter: '</h1>'
  },
  
  // Existing popular articles
  {
    file: 'public/blog/gangnam-head-spa-complete-guide-2025.html',
    backlinks: ['headspa', 'massage', 'gangnam'],
    insertAfter: '</h1>'
  },
  {
    file: 'public/blog/korean-spa-jjimjilbang-guide-2025.html',
    backlinks: ['massage', 'skincare'],
    insertAfter: '</h1>'
  },
  {
    file: 'public/blog/korean-beauty-treatments-trending-2025.html',
    backlinks: ['skincare', 'gangnam', 'myeongdong'],
    insertAfter: '</h1>'
  },
  {
    file: 'public/blog/juvelook-treatment-seoul-complete-guide-2025.html',
    backlinks: ['skincare', 'gangnam'],
    insertAfter: '</h1>'
  },
  {
    file: 'public/blog/pdrn-treatment-seoul-complete-guide-2025.html',
    backlinks: ['skincare', 'myeongdong'],
    insertAfter: '</h1>'
  }
];

// 백링크 HTML 생성 함수
function generateBacklinkHTML(backlinks) {
  const links = backlinks.map(key => {
    const strategy = backlinkStrategies[key];
    return `<a href="${strategy.url}" target="_blank" rel="noopener" style="color: #e91e63; text-decoration: none; font-weight: 500;">${strategy.text}</a>`;
  }).join(' | ');
  
  return `
  <!-- KBeautySeoul Professional Booking Links -->
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px; margin: 25px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
      <span style="font-size: 24px;">📱</span>
      <h3 style="margin: 0; color: white; font-size: 18px; font-weight: 600;">Professional Booking Platform</h3>
    </div>
    <p style="color: white; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
      Book your Korean beauty treatments online with English support and instant confirmation:
    </p>
    <div style="background: rgba(255,255,255,0.15); padding: 15px; border-radius: 8px; backdrop-filter: blur(10px);">
      <p style="color: white; margin: 0; font-size: 15px; line-height: 1.8;">
        ${links}
      </p>
    </div>
    <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 12px; font-style: italic;">
      ✓ English-speaking staff • ✓ Instant confirmation • ✓ Best prices guaranteed
    </p>
  </div>
`;
}

let updatedCount = 0;
let skippedCount = 0;

// 각 기사에 백링크 추가
for (const article of articlesToUpdate) {
  const filePath = path.join(process.cwd(), article.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${article.file}`);
    skippedCount++;
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // 이미 백링크가 있는지 확인
  if (content.includes('KBeautySeoul Professional Booking Links')) {
    console.log(`⏭️  Already updated: ${path.basename(article.file)}`);
    skippedCount++;
    continue;
  }
  
  // H1 태그 다음에 백링크 박스 삽입
  const backlinkHTML = generateBacklinkHTML(article.backlinks);
  content = content.replace(
    article.insertAfter,
    article.insertAfter + '\n' + backlinkHTML
  );
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Updated: ${path.basename(article.file)} (${article.backlinks.length} backlinks)`);
  updatedCount++;
}

console.log(`\n📊 BACKLINK INTEGRATION SUMMARY:`);
console.log(`✅ Updated: ${updatedCount} files`);
console.log(`⏭️  Skipped: ${skippedCount} files`);
console.log(`\n🔗 Total Backlinks Created: ${updatedCount * 2} (average 2 per article)`);
console.log(`\n✨ BACKLINK FEATURES:`);
console.log(`   • Contextually relevant links`);
console.log(`   • DoFollow links (SEO value)`);
console.log(`   • Professional design with CTA`);
console.log(`   • Mobile-responsive`);
console.log(`   • Above-the-fold placement`);
console.log(`\n🎯 EXPECTED SEO IMPACT:`);
console.log(`   • Domain Authority boost for kbeautyseoul.co.kr`);
console.log(`   • Referral traffic from SeoulZen.com`);
console.log(`   • Improved relevance signals`);
console.log(`   • Natural link profile growth`);

