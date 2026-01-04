# Google이 non-www를 표준 URL로 선택하도록 강제하는 방법

**생성일**: 2026-01-04
**목표**: Google Search Console에서 "Google에서 선택한 표준 URL"을 `https://seoulzen.com/`로 변경

---

## 🔍 현재 상황

```
✅ 사용자 선언 표준 URL: https://seoulzen.com/
❌ Google에서 선택한 표준 URL: https://www.seoulzen.com/
```

**문제**: Google이 canonical 태그를 인식했지만, 여전히 www 버전을 선택함

---

## 🛠️ 해결 방법 (우선순위 순서)

### **방법 1: www 버전을 완전히 제거** ⭐ 가장 강력

**Vercel에서 www 도메인 삭제:**

1. Vercel 대시보드 접속
   👉 https://vercel.com/paulslife2017-hue/ss/settings/domains

2. `www.seoulzen.com` 행 찾기

3. **❌ Remove Domain** 클릭 (리다이렉트가 아니라 **완전 삭제**)

4. 확인

**효과**: Google이 www 버전에 접근할 수 없게 되어 강제로 non-www 선택

---

### **방법 2: 더 강력한 신호 추가** (방법 1 실행 후)

**1) sitemap.xml에 www 버전 명시적 제거:**

```xml
<!-- 절대 포함하지 말 것 -->
<url>
  <loc>https://www.seoulzen.com/</loc>
</url>
```

✅ **이미 완료**: sitemap.xml에 non-www만 포함됨

**2) robots.txt에 www 차단:**

```
User-agent: *
Disallow: 

# Sitemap (non-www만)
Sitemap: https://seoulzen.com/sitemap.xml

# www 버전 차단
User-agent: Googlebot
Disallow: https://www.seoulzen.com/
```

**3) HTTP 헤더 강화:**

```
X-Robots-Tag: index, follow
Link: <https://seoulzen.com/>; rel="canonical"
```

✅ **이미 완료**: _headers에 설정됨

---

### **방법 3: Google Search Console에서 직접 알리기**

**1) URL 검사 도구 사용:**

```
1. https://search.google.com/search-console 접속
2. URL 검사 창에 입력: https://www.seoulzen.com/
3. "실제 URL 테스트" 클릭
4. 301 리다이렉트 확인 (또는 404 if 도메인 삭제됨)
5. 다시 입력: https://seoulzen.com/
6. "색인 생성 요청" 클릭
```

**2) Sitemap 재제출:**

```
1. Google Search Console → Sitemaps
2. 기존 sitemap 모두 삭제
3. 새로 추가: https://seoulzen.com/sitemap.xml
4. 제출
```

**3) 주요 페이지 색인 요청 (5-10개):**

```
https://seoulzen.com/
https://seoulzen.com/blog.html
https://seoulzen.com/blog/gangnam-massage-guide-2025.html
https://seoulzen.com/blog/korean-skincare-routine-beginners-2025.html
https://seoulzen.com/blog/gangnam-head-spa-complete-guide-2025.html
```

---

## ⏰ 예상 타임라인

| 단계 | 소요 시간 | 설명 |
|-----|---------|------|
| Vercel에서 www 도메인 삭제 | 즉시 | 5-10분 내 반영 |
| Google 재크롤링 | 1-3일 | Google이 404/301 감지 |
| "Google 선택 표준 URL" 변경 | 3-7일 | non-www로 변경됨 |
| 중복 페이지 오류 해소 | 1-2주 | Coverage 탭에서 확인 |
| 검색 결과 정상화 | 2-4주 | 완전 해결 |

---

## 🎯 권장 실행 순서

**지금 즉시:**
1. ✅ Vercel에서 `www.seoulzen.com` 도메인 **완전 삭제** (Remove)
2. ✅ `robots.txt`에 www 차단 추가 (선택사항, 더 강력하게)
3. ✅ Google Search Console → URL 검사 → `https://seoulzen.com/` 색인 요청
4. ✅ Google Search Console → Sitemaps → `https://seoulzen.com/sitemap.xml` 재제출

**1-3일 후:**
5. ✅ Google Search Console → URL 검사 → "Google에서 선택한 표준 URL" 확인
6. ✅ 주요 페이지 5-10개 색인 요청

**1-2주 후:**
7. ✅ Coverage 탭 → Valid 증가 / Duplicate 감소 확인

---

## 🔍 확인 명령어

**1) www 도메인 접근 불가 확인:**
```bash
curl -I https://www.seoulzen.com/
```

**예상 결과 (도메인 삭제 후):**
```
curl: (6) Could not resolve host: www.seoulzen.com
```

또는 (301 리다이렉트 유지 시):
```
HTTP/2 301
location: https://seoulzen.com/
```

**2) non-www 정상 작동 확인:**
```bash
curl -I https://seoulzen.com/
```

**예상 결과:**
```
HTTP/2 200
link: <https://seoulzen.com/>; rel="canonical"
x-robots-tag: index, follow
```

---

## 🎯 핵심 포인트

1. **www 도메인 삭제가 가장 강력한 방법** (Google이 선택할 수 없음)
2. **301 리다이렉트만으로는 부족할 수 있음** (Google이 여전히 www 선호 가능)
3. **Sitemap, robots.txt, canonical, 색인 요청 모두 일치**해야 함
4. **인내심 필요**: Google 색인 업데이트는 1-3일 소요

---

## ✅ 체크리스트

- [ ] Vercel에서 www.seoulzen.com 도메인 **삭제** (Remove)
- [ ] robots.txt에 www 차단 추가 (선택사항)
- [ ] curl로 www 접근 불가 확인
- [ ] Google Search Console → URL 검사 → https://seoulzen.com/ 색인 요청
- [ ] Google Search Console → Sitemaps → https://seoulzen.com/sitemap.xml 재제출
- [ ] 주요 페이지 5-10개 색인 요청
- [ ] 1주일 후 "Google 선택 표준 URL" 확인

---

**결론**: www 도메인을 **완전히 삭제**하면 Google이 non-www를 선택할 수밖에 없습니다!

