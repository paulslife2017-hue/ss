# 🚀 Vercel 배포 가이드

## 빠른 배포 (3분 완성)

### Option 1: Vercel CLI (추천)

```bash
# 1. Vercel CLI 설치
npm install -g vercel

# 2. 배포 (처음)
vercel

# 3. 프로덕션 배포
vercel --prod
```

### Option 2: GitHub 연동 (자동 배포)

1. **GitHub에 Push**
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

2. **Vercel 웹사이트에서 Import**
   - https://vercel.com/new 방문
   - GitHub 연동
   - `paulslife2017-hue/ss` 저장소 선택
   - "Deploy" 클릭
   - ✅ 완료! 자동 배포 설정됨

### Option 3: Vercel Deploy Button

README.md에 있는 Deploy 버튼 클릭:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/paulslife2017-hue/ss)

## 🔧 Vercel 프로젝트 설정

배포 시 다음 설정 확인:

### Framework Preset
- **선택:** Other

### Build Settings
- **Build Command:** `echo 'No build needed'` (또는 비워두기)
- **Output Directory:** `.` (또는 비워두기)
- **Install Command:** `npm install`

### Root Directory
- `.` (기본값)

## 🌐 커스텀 도메인 설정

### 1. Vercel에서 도메인 추가

```
프로젝트 Settings → Domains → Add Domain
```

예: `seoulbeautyguide.com`

### 2. DNS 설정

도메인 제공업체(예: Namecheap, GoDaddy)에서:

**A 레코드:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**CNAME 레코드:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. 자동 HTTPS

Vercel이 자동으로 SSL 인증서 발급 (무료)

## ✅ 배포 후 확인사항

### 1. Google Search Console 인증

사이트가 배포되면:
1. https://search.google.com/search-console 방문
2. "속성 추가"
3. Vercel 도메인 입력
4. "확인" 클릭
5. 메타태그가 이미 추가되어 있으므로 즉시 인증됨 ✅

### 2. Google AdSense 등록

1. https://adsense.google.com 방문
2. "시작하기" 클릭
3. Vercel 도메인 입력
4. AdSense 코드가 이미 추가되어 있음 ✅
5. 승인 대기 (15-20개 글 필요, 1-2주 소요)

### 3. 사이트 동작 확인

- ✅ 홈페이지 로딩
- ✅ 블로그 포스트 읽기
- ✅ 카테고리 페이지
- ✅ 모바일 반응형
- ✅ 백링크 작동 (kbeautyseoul.co.kr)

## 📊 Vercel 무료 플랜 제한

- ✅ **대역폭:** 100GB/월
- ✅ **빌드:** 6,000분/월
- ✅ **함수 실행:** 100GB-시간/월
- ✅ **도메인:** 무제한
- ✅ **HTTPS:** 무료 자동

**이 블로그는 무료 플랜으로 충분합니다!**

## 🔄 자동 배포 설정 (GitHub 연동 시)

매번 `git push`하면 자동으로:
1. Vercel이 변경사항 감지
2. 자동 빌드 시작
3. 새 버전 배포
4. 이전 버전 백업 유지

**배포 시간:** 약 30-60초

## 🐛 문제 해결

### "Deployment Failed" 에러

```bash
# 로컬에서 테스트
npm install
node server.js

# 브라우저에서 확인
http://localhost:3000
```

문제 없으면:
```bash
vercel --prod --force
```

### 도메인이 작동하지 않음

1. DNS 전파 대기 (최대 48시간)
2. DNS 확인: https://dnschecker.org
3. Vercel 대시보드에서 도메인 상태 확인

### AdSense 광고가 보이지 않음

- 24-48시간 대기 (Google 승인 필요)
- AdSense 계정 상태 확인
- 콘텐츠 15-20개 확보 필요

## 📈 배포 후 할 일

### 즉시 (1일차)
1. ✅ Google Search Console 등록
2. ✅ Google Analytics 설정
3. ✅ 사이트맵 제출
4. ✅ Robots.txt 확인

### 1주일 내
1. 10-15개 추가 기사 작성
2. 소셜 미디어 공유
3. Reddit, Facebook 그룹 홍보
4. Google AdSense 신청

### 1개월 내
1. 20-30개 기사 달성
2. 백링크 구축 시작
3. 이메일 뉴스레터 준비
4. SEO 성과 분석

## 🎯 성공 지표

### 1개월
- 📊 Google 인덱싱: 모든 페이지
- 👥 방문자: 500-1,000명
- 🔗 백링크: 5-10개

### 3개월
- 📊 검색 순위: 1-2페이지
- 👥 방문자: 3,000-5,000명
- 💰 AdSense 승인

### 6개월
- 📊 검색 순위: 1페이지
- 👥 방문자: 10,000+명
- 💰 수익: $100-300/월

## 💡 팁

### SEO 최적화
```
1. 정기적 콘텐츠 업데이트 (주 2-3회)
2. 내부 링크 강화
3. 이미지 최적화
4. 메타 태그 개선
5. 로딩 속도 최적화
```

### 트래픽 증대
```
1. Pinterest 핀 생성
2. Instagram 스토리
3. YouTube 쇼츠
4. Reddit 커뮤니티
5. Facebook 그룹
```

### 수익 증대
```
1. 제휴 마케팅 링크 추가
2. 이메일 리스트 구축
3. 프리미엄 가이드 판매
4. 스폰서 포스트
```

## 📞 지원

문제가 있으면:
1. Vercel 문서: https://vercel.com/docs
2. Vercel 커뮤니티: https://github.com/vercel/vercel/discussions
3. 이 저장소 Issues

---

**🎉 성공적인 배포를 기원합니다!**

배포 완료 후 URL을 kbeautyseoul.co.kr 팀과 공유하세요.
