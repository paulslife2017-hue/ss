#!/usr/bin/env node

/**
 * KBeautySeoul 링크에 추적 파라미터 자동 추가
 * UTM 파라미터로 트래픽 소스 추적
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

console.log('🔗 KBeautySeoul 링크 추적 파라미터 추가 시작...\n');

// 링크별 캠페인 매핑
const campaignMapping = {
  'massage': 'massage',
  'headspa': 'headspa',
  'head-spa': 'headspa',
  'scalp': 'scalp-care',
  'lip-tattoo': 'lip-tattoo',
  'bb-glow': 'bb-glow',
  'nail': 'nail-art',
  'skincare': 'skincare',
  'spa': 'spa',
  'booking': 'general-booking'
};

// 서비스별 할인 코드
const discountCodes = {
  'massage': 'BLOG10',
  'headspa': 'FIRST15',
  'scalp-care': 'SCALP10',
  'general-booking': 'FIRST10'
};

function addTrackingParams(url, context = '') {
  // 이미 파라미터가 있는지 확인
  if (url.includes('utm_source=')) {
    return url; // 이미 추적 파라미터가 있음
  }

  let baseUrl = url;
  let campaign = 'general';
  let discount = 'FIRST10';

  // URL에서 캠페인 유형 감지
  for (const [keyword, camp] of Object.entries(campaignMapping)) {
    if (url.includes(keyword) || context.toLowerCase().includes(keyword)) {
      campaign = camp;
      discount = discountCodes[camp] || 'FIRST10';
      break;
    }
  }

  // 파라미터 구분자 결정
  const separator = url.includes('?') ? '&' : '?';

  // 추적 파라미터 추가
  return `${baseUrl}${separator}utm_source=seoulzen&utm_medium=blog&utm_campaign=${campaign}&discount=${discount}`;
}

// 파일별 처리
const files = glob.sync('**/*.{html,js}', {
  ignore: ['node_modules/**', 'dist/**', '.git/**', 'update-tracking-links.js']
});

let totalUpdates = 0;
let fileCount = 0;

files.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  let modified = false;
  let fileUpdates = 0;

  // kbeautyseoul.co.kr 링크 찾기 (href, src, url 속성)
  const patterns = [
    // HTML href 속성
    /href="(https?:\/\/(?:www\.)?kbeautyseoul\.co\.kr[^"]*)"/g,
    /href='(https?:\/\/(?:www\.)?kbeautyseoul\.co\.kr[^']*)'/g,
    
    // 일반 URL (텍스트에서)
    /(https?:\/\/(?:www\.)?kbeautyseoul\.co\.kr[\w\-\/.?=&#]*)/g
  ];

  patterns.forEach(pattern => {
    content = content.replace(pattern, (match, url) => {
      // 이미 utm_source가 있으면 스킵
      if (url.includes('utm_source=')) {
        return match;
      }

      // 파일 내용에서 컨텍스트 추출 (주변 100자)
      const index = content.indexOf(match);
      const context = content.substring(Math.max(0, index - 100), index + 100);

      const newUrl = addTrackingParams(url, context);
      
      if (newUrl !== url) {
        fileUpdates++;
        modified = true;
        
        // 원래 패턴에 맞춰 반환
        if (match.includes('href="')) {
          return `href="${newUrl}"`;
        } else if (match.includes("href='")) {
          return `href='${newUrl}'`;
        } else {
          return newUrl;
        }
      }
      
      return match;
    });
  });

  if (modified) {
    writeFileSync(file, content, 'utf-8');
    console.log(`✅ ${file}: ${fileUpdates}개 링크 업데이트`);
    totalUpdates += fileUpdates;
    fileCount++;
  }
});

console.log(`\n🎉 완료!`);
console.log(`📊 총 ${fileCount}개 파일에서 ${totalUpdates}개 링크 업데이트`);
console.log(`\n📝 추가된 파라미터:`);
console.log(`   - utm_source=seoulzen (트래픽 소스)`);
console.log(`   - utm_medium=blog (미디엄)`);
console.log(`   - utm_campaign=[서비스명] (캠페인)`);
console.log(`   - discount=[할인코드] (쿠폰)`);
console.log(`\n✅ 이제 KBeautySeoul에서 어디서 예약이 오는지 추적 가능합니다!`);
