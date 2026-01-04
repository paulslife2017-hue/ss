#!/usr/bin/env node

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const blogDir = './blog';
const files = readdirSync(blogDir).filter(f => f.endsWith('.html'));

console.log(`🔍 총 ${files.length}개 블로그 파일 발견\n`);

let totalCleaned = 0;
const results = [];

files.forEach(file => {
  const filePath = join(blogDir, file);
  let content = readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // 링크 개수 카운트 (수정 전)
  const beforeCount = (content.match(/kbeautyseoul\.co\.kr/g) || []).length;
  
  // 🚨 1순위: 본문 중간의 중복 booking 링크 제거
  // "Book on kbeautyseoul.co.kr" 패턴
  content = content.replace(
    /<a[^>]*href="[^"]*kbeautyseoul\.co\.kr[^"]*"[^>]*>\s*Book on kbeautyseoul\.co\.kr\s*<\/a>/gi,
    ''
  );
  
  // "Booked via: kbeautyseoul.co.kr/booking/xxx" 패턴
  content = content.replace(
    /<p[^>]*>.*?Booked via:.*?kbeautyseoul\.co\.kr.*?<\/p>/gi,
    ''
  );
  
  // "English Support: Book via kbeautyseoul.co.kr" 패턴
  content = content.replace(
    /<p[^>]*>.*?English Support:.*?kbeautyseoul\.co\.kr.*?<\/p>/gi,
    ''
  );
  
  // 📅 이모티콘 + "Book on kbeautyseoul.co.kr" 패턴
  content = content.replace(
    /<p[^>]*>📅.*?kbeautyseoul\.co\.kr.*?<\/p>/gi,
    ''
  );
  
  // 🚨 2순위: 할인 코드 링크 제거 (본문 중간만, CTA 제외)
  // discount 파라미터가 있는 링크를 본문에서 제거
  // (맨 아래 CTA는 유지하기 위해 article 태그 내부만 타겟)
  content = content.replace(
    /(<article[^>]*>[\s\S]*?)<a[^>]*href="[^"]*kbeautyseoul\.co\.kr[^"]*\?discount=[^"]*"[^>]*>.*?<\/a>/gi,
    (match, before) => {
      // article 내부의 discount 링크만 제거
      if (before) {
        return before;
      }
      return match;
    }
  );
  
  // 🚨 3순위: Browse All Treatments 같은 반복 링크 제거
  content = content.replace(
    /<a[^>]*href="[^"]*kbeautyseoul\.co\.kr[^"]*"[^>]*>\s*Browse All Treatments.*?<\/a>/gi,
    ''
  );
  
  // 🚨 공격적인 CTA 문구 부드럽게 변경
  content = content.replace(
    /(Book Now|Reserve Now|Claim Discount)\s*→/gi,
    'View details →'
  );
  
  // 링크 개수 카운트 (수정 후)
  const afterCount = (content.match(/kbeautyseoul\.co\.kr/g) || []).length;
  const removed = beforeCount - afterCount;
  
  if (removed > 0) {
    writeFileSync(filePath, content, 'utf-8');
    totalCleaned++;
    results.push({
      file,
      before: beforeCount,
      after: afterCount,
      removed
    });
    console.log(`✅ ${file}`);
    console.log(`   ${beforeCount} → ${afterCount} 링크 (${removed}개 제거)\n`);
  } else {
    console.log(`⏭️  ${file} - 변경 사항 없음\n`);
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 정리 결과 요약');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log(`총 파일: ${files.length}개`);
console.log(`수정된 파일: ${totalCleaned}개`);
console.log(`제거된 총 링크: ${results.reduce((sum, r) => sum + r.removed, 0)}개\n`);

if (results.length > 0) {
  console.log('상위 5개 파일:');
  results
    .sort((a, b) => b.removed - a.removed)
    .slice(0, 5)
    .forEach((r, i) => {
      console.log(`${i + 1}. ${r.file}: ${r.before} → ${r.after} (${r.removed}개 제거)`);
    });
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅ 링크 정리 완료!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
