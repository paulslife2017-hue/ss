# 🚨 Vercel 도메인 설정 필수! 🚨

## ⚠️ 중요한 사실

**vercel.json만으로는 www → non-www 리다이렉트를 설정할 수 없습니다!**

Vercel의 `vercel.json`에서는 다음과 같은 제약이 있습니다:
- ❌ `source`에 전체 URL 사용 불가 (`https://www.seoulzen.com/:path*` 같은 패턴 불가)
- ❌ 도메인 간 리다이렉트 불가 (경로 기반 리다이렉트만 가능)
- ✅ **반드시 Vercel 대시보드에서 도메인 설정 필요!**

---

## 📋 필수 설정 단계

### STEP 1: Vercel 대시보드 접속

👉 **https://vercel.com/paulslife2017-hue/ss/settings/domains**

### STEP 2: 도메인 설정 확인

현재 도메인 목록에서:
1. **seoulzen.com** - Primary Domain으로 설정
2. **www.seoulzen.com** - 리다이렉트 설정 필요

### STEP 3: www 도메인 리다이렉트 설정

**www.seoulzen.com** 행에서:

1. 도메인 클릭 또는 "Edit" 버튼 클릭
2. **"Redirect to another domain"** 옵션 선택
3. 입력란에 `seoulzen.com` 입력
4. **"Permanent (301)"** 옵션 체크 (SEO에 중요!)
5. **"Save"** 클릭

### STEP 4: 설정 확인

브라우저에서 테스트:
```
https://www.seoulzen.com/ 입력
→ https://seoulzen.com/ 으로 자동 리다이렉트되어야 함
```

터미널에서 테스트:
```bash
curl -I https://www.seoulzen.com/
```

예상 결과:
```
HTTP/2 301
location: https://seoulzen.com/
```

---

## 🎯 왜 이렇게 해야 하나?

### Vercel의 도메인 시스템

Vercel은 프로젝트에 여러 도메인을 연결할 수 있습니다:
- **Production Domain**: 메인 도메인 (seoulzen.com)
- **Alias Domains**: 추가 도메인 (www.seoulzen.com, 다른 도메인 등)

각 도메인은 다음 중 하나의 동작을 설정할 수 있습니다:
1. **독립적으로 서빙** - 같은 콘텐츠를 각각 제공
2. **다른 도메인으로 리다이렉트** - 301/302 리다이렉트 ⭐ 우리가 원하는 것!

### SEO를 위한 올바른 설정

Google은 www와 non-www를 서로 다른 사이트로 봅니다:
- `https://seoulzen.com/` ← 우리가 원하는 표준 URL
- `https://www.seoulzen.com/` ← 이 URL은 리다이렉트되어야 함

**두 도메인이 같은 콘텐츠를 제공하면:**
- ❌ Google: "중복 콘텐츠!"
- ❌ SEO 점수 분산
- ❌ 색인 문제 발생

**www → non-www 301 리다이렉트 설정 시:**
- ✅ Google: "아, non-www가 표준 URL이구나!"
- ✅ SEO 점수 통합
- ✅ 정상 색인

---

## 📸 Vercel 대시보드 설정 화면 설명

### 도메인 목록 화면
```
┌─────────────────────────────────────────────────────────────┐
│ Domains                                                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ seoulzen.com                              [Primary] [Edit]   │
│ Status: Active                                                │
│                                                               │
│ www.seoulzen.com                                    [Edit] ← 클릭! │
│ Status: Active                                                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### www.seoulzen.com 편집 화면
```
┌─────────────────────────────────────────────────────────────┐
│ Edit Domain: www.seoulzen.com                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ ⚪ Serve this domain independently                           │
│                                                               │
│ ⚫ Redirect to another domain                    ← 선택!      │
│    ┌───────────────────────────────────────┐                │
│    │ seoulzen.com                          │ ← 입력!         │
│    └───────────────────────────────────────┘                │
│                                                               │
│    ☑ Permanent (301)                         ← 체크!         │
│    ☐ Temporary (302)                                         │
│                                                               │
│    [Cancel]  [Save]                          ← 클릭!         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ 설정 후 확인 사항

1. **브라우저 테스트**
   - www 버전 접속 → non-www로 리다이렉트 확인
   - 주소창에 non-www URL 표시 확인

2. **Google Search Console**
   - seoulzen.com 속성만 사용
   - www.seoulzen.com 속성은 삭제 또는 무시
   - sitemap.xml 재제출 (https://seoulzen.com/sitemap.xml)

3. **색인 재요청**
   - 주요 페이지 5-10개 색인 재요청
   - 1-2주 후 "중복 페이지" 오류 감소 확인

---

## 🎯 요약

| 항목 | 설정 |
|------|------|
| **Primary Domain** | seoulzen.com |
| **www 도메인** | Redirect to seoulzen.com (Permanent 301) |
| **Canonical URL** | https://seoulzen.com/ |
| **Google Search Console** | seoulzen.com 속성만 사용 |
| **Sitemap URL** | https://seoulzen.com/sitemap.xml |

---

## 🚀 이 설정을 완료하면

- ✅ Google이 non-www를 표준 URL로 인식
- ✅ "중복 페이지" 오류 해결
- ✅ SEO 점수 통합
- ✅ 정상 색인 및 검색 노출

---

**작성 날짜**: 2026-01-03
**우선순위**: 🔴 최고 (즉시 설정 필요!)
