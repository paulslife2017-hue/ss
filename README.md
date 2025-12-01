# K-Beauty Seoul - Affiliate Marketing Platform

🌐 **4개 언어 지원**: 한국어, English, 日本語, 繁體中文

## 🎯 프로젝트 개요

K-Beauty Seoul은 서울의 뷰티 서비스, 투어, K-뷰티 쇼핑을 소개하는 **제휴 마케팅 플랫폼**입니다.

## ✨ 주요 기능

### 📱 3개 카탈로그 구조
- **뷰티 서비스** (`/catalog/beauty`): 강남 헤드스파, 립타투, 눈썹문신, BB글로우 등
- **투어 프로그램** (`/catalog/tour`): K-뷰티 투어, 야경 투어, 한복 체험 등
- **쇼핑** (`/catalog/shop`): 설화수, 후, COSRX, 조선미녀 등

### 💰 제휴 파트너
- **K-Beauty Seoul** (뷰티 서비스) - 10-15% 커미션
- **Klook** (투어) - 8-12% 커미션
- **KKday** (투어) - 8-12% 커미션
- **Coupang** (쇼핑) - 5-10% 커미션
- **Naver Shopping** (쇼핑) - 5-8% 커미션

### 📊 클릭 트래킹
- 모든 클릭 자동 추적 (`/track/:serviceId`)
- 실시간 통계 대시보드 (`/stats`)
- 카테고리별/플랫폼별 분석

### 🌍 다국어 지원
- 🇰🇷 한국어 (`?lang=ko`)
- 🇺🇸 영어 (`?lang=en`)
- 🇯🇵 일본어 (`?lang=ja`)
- 🇹🇼 번체중국어 (`?lang=zh`)

## 🚀 배포

### Vercel 자동 배포
```bash
# Vercel 배포 URL 사용
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_jSQZO2mM7s0H05YtpbbNjaGoUkIK/YaYY0VBUEl"
```

### 로컬 실행
```bash
npm install
npm start
# http://localhost:3000
```

## 📂 프로젝트 구조

```
/home/user/webapp/
├── server.js              # 메인 서버 (Hono 기반)
├── vercel.json            # Vercel 설정
├── package.json           # 의존성
├── article_22_*.js        # 립타투 영어 블로그
├── article_23_*.js        # 립타투 일본어 블로그
├── article_24_*.js        # 강남 헤드스파 영어 블로그
├── article_25_*.js        # 강남 헤드스파 일본어 블로그
└── README.md              # 이 파일
```

## 🎨 UI 특징

- **모바일 퍼스트** 디자인
- **Airbnb 스타일** 카드 레이아웃
- **할인 배지** 시스템 (인기, 추천, 신규, 할인)
- **평점 & 리뷰** 표시
- **플랫폼 태그** (K-Beauty Seoul, Klook, KKday, Coupang, Naver)
- **반응형 그리드** (모바일 1열, 태블릿 2열, 데스크탑 3열)

## 📈 수익 모델

```
방문자 → 클릭 → 구매 전환 → 커미션 수익

예시:
- 월 방문자: 10,000명
- 클릭률: 5% (500 클릭)
- 구매 전환율: 10% (50건)
- 평균 주문: ₩300,000
- 평균 커미션: 10%
────────────────────────
예상 월 수익: ₩1,500,000
```

## 🔗 주요 URL

- **홈페이지**: `/` 또는 `/?lang=ko`
- **뷰티 카탈로그**: `/catalog/beauty?lang=ko`
- **투어 카탈로그**: `/catalog/tour?lang=ko`
- **쇼핑 카탈로그**: `/catalog/shop?lang=ko`
- **통계 대시보드**: `/stats`
- **트래킹**: `/track/:serviceId?category=beauty&lang=ko`

## 🛠 기술 스택

- **프레임워크**: Hono.js
- **런타임**: Node.js 20+
- **배포**: Vercel
- **스타일**: Vanilla CSS (모바일 최적화)
- **추적**: 내장 클릭 트래킹

## 📝 라이센스

© 2025 K-Beauty Seoul Guide. All rights reserved.

---

**제휴 공개**: 이 사이트는 제휴 마케팅으로 운영됩니다. 링크를 통한 구매 시 소정의 수수료를 받을 수 있습니다.
