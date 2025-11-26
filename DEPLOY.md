# 🚀 Vercel 배포 가이드

## 가장 쉬운 방법 (1-클릭 배포)

**아래 버튼 클릭 한 번으로 배포!**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/paulslife2017-hue/ss)

### 배포 후 할 일:

1. ✅ Vercel이 자동으로 URL 생성 (예: `your-blog-abc123.vercel.app`)
2. ✅ 해당 URL 방문해서 블로그 확인
3. ✅ Google AdSense 신청 시작

---

## 수동 배포 방법

### 방법 1: Vercel CLI

```bash
# 1. Vercel CLI 설치
npm i -g vercel

# 2. 프로젝트 디렉토리에서
cd /home/user/webapp

# 3. 로그인
vercel login

# 4. 배포
vercel

# 5. 프로덕션 배포
vercel --prod
```

### 방법 2: GitHub 연동 (추천)

1. **Vercel 접속**: https://vercel.com
2. **회원가입/로그인**: GitHub 계정으로 로그인
3. **Import Project** 클릭
4. **GitHub 저장소 선택**: `paulslife2017-hue/ss`
5. **Configure Project**:
   - Framework Preset: `Other`
   - Build Command: (비워두기)
   - Output Directory: (비워두기)
   - Install Command: `npm install`
6. **Deploy** 클릭
7. **완료!** 2-3분 후 라이브 URL 받음

### 방법 3: Git Push로 자동 배포

```bash
# Vercel과 GitHub 연동 후
# Git push만 하면 자동 배포됨

git add .
git commit -m "업데이트"
git push origin main

# → Vercel이 자동으로 감지하고 배포
```

---

## 배포 후 확인사항

### 1. 사이트 작동 확인
- [ ] 홈페이지 로딩
- [ ] 블로그 글 클릭
- [ ] 이미지 표시
- [ ] 모바일 반응형

### 2. SEO 설정
- [ ] Google Search Console 등록
- [ ] Sitemap 제출
- [ ] Google Analytics 추가

### 3. 수익화 준비
- [ ] AdSense 승인 신청
- [ ] 제휴 링크 업데이트
- [ ] 광고 배치 확인

---

## 커스텀 도메인 연결 (선택)

### 도메인 구매

**추천 레지스트라:**
- Namecheap (저렴)
- GoDaddy
- Google Domains
- Cloudflare

**가격:** $10-15/년

### Vercel에 연결

1. Vercel Dashboard → 프로젝트 선택
2. **Settings** → **Domains**
3. 도메인 입력 (예: `wealthwise.com`)
4. DNS 설정:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
5. 24-48시간 대기 (DNS 전파)
6. SSL 자동 활성화

---

## 환경 변수 설정

현재는 필요 없지만, 나중에 데이터베이스 추가 시:

### Vercel Dashboard에서:

1. **Settings** → **Environment Variables**
2. 변수 추가:
   ```
   DATABASE_URL=postgresql://...
   GOOGLE_ADSENSE_ID=ca-pub-6943282483618134
   ```
3. **Save**

### 로컬에서 테스트:

```bash
# .env 파일 생성
echo "DATABASE_URL=postgresql://..." > .env

# 서버 실행
node server.js
```

---

## 트러블슈팅

### 배포 실패: "Build Error"

**해결:**
```bash
# vercel.json 확인
cat vercel.json

# 올바른 내용:
{
  "version": 2,
  "builds": [
    { "src": "server.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "server.js" }
  ]
}
```

### 배포 성공했지만 "404 Not Found"

**해결:**
- `server.js` 파일 확인
- Vercel 로그 확인
- 라우트 설정 확인

### 이미지 안 보임

**해결:**
- Unsplash URL 확인
- 이미지 URL이 https인지 확인
- 캐시 클리어 후 새로고침

### "Failed to load content"

**해결:**
- 완전히 새로 작성된 `server.js` 사용 중인지 확인
- 백업 파일과 혼동하지 않았는지 확인

---

## 성능 최적화

### Vercel 자동 최적화
- ✅ CDN (전 세계 빠른 로딩)
- ✅ 자동 SSL
- ✅ Gzip 압축
- ✅ HTTP/2

### 추가 최적화
```javascript
// server.js에 추가 가능

// 1. 캐싱 헤더
app.use('*', async (c, next) => {
  await next()
  c.header('Cache-Control', 'public, max-age=3600')
})

// 2. 이미지 최적화
// Vercel Image Optimization 사용
```

---

## 모니터링

### Vercel Analytics (무료)

1. Vercel Dashboard → 프로젝트
2. **Analytics** 탭
3. 트래픽, 성능 확인

### Google Analytics 추가

```html
<!-- server.js의 <head>에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 비용

### Vercel 무료 플랜 제한
- ✅ 100 GB 대역폭/월
- ✅ 무제한 사이트
- ✅ 자동 SSL
- ✅ 글로벌 CDN

**충분합니다!** 월 10만 방문자까지 무료

### 유료 플랜 ($20/월)
- 1 TB 대역폭
- 더 많은 빌드 시간
- 우선 지원

대부분의 블로그는 **무료 플랜으로 충분**

---

## 다음 단계

### 즉시
1. [ ] 위 버튼으로 배포
2. [ ] 사이트 작동 확인
3. [ ] URL 공유 받기

### 1주일 내
1. [ ] 콘텐츠 10개 추가
2. [ ] Google Search Console 등록
3. [ ] AdSense 신청

### 1개월 내
1. [ ] 커스텀 도메인 구매
2. [ ] Analytics 분석
3. [ ] SEO 최적화

---

## 🎉 축하합니다!

배포 완료하면 **실제 라이브 블로그** 완성!

**예상 URL**: `https://wealthwise-abc123.vercel.app`

이제 콘텐츠 추가하고 수익화 시작하세요!

---

**도움이 필요하면**: GitHub Issues에 질문 남기기
**업데이트**: Git push만 하면 자동 재배포!
