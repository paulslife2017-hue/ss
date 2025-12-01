# 🛒 SeoulZen.com 쇼핑몰 개발 계획

## 📋 개발 우선순위

### Phase 1: 기본 쇼핑몰 기능 (1-2주) ⭐ 지금!
```
✅ 1. 제품 데이터 구조 설계
✅ 2. 쇼핑 홈페이지 (메인 + 제품 목록)
✅ 3. 제품 상세 페이지
✅ 4. 장바구니 기능 (LocalStorage)
✅ 5. 체크아웃 페이지
✅ 6. Stripe 결제 연동
✅ 7. 주문 확인 페이지
```

### Phase 2: 관리자 기능 (1주)
```
✅ 1. 관리자 로그인
✅ 2. 제품 관리 (추가/수정/삭제)
✅ 3. 주문 관리
✅ 4. 재고 관리
```

### Phase 3: 고급 기능 (나중에)
```
⏳ 1. 회원가입/로그인
⏳ 2. 위시리스트
⏳ 3. 리뷰 시스템
⏳ 4. 이메일 자동화
```

---

## 🎨 디자인 컨셉

### 참고 사이트
- Amazon: 간단명료, 제품 중심
- Soko Glam: 깔끔, 프리미엄
- YesStyle: 다양한 제품, 할인 강조

### SeoulZen 스타일
```
✨ 깔끔한 화이트 + 핑크 포인트
📱 모바일 퍼스트
🖼️ 큰 제품 이미지
💳 명확한 CTA 버튼
```

---

## 🗂️ 파일 구조

```
/home/user/webapp/
├── server.js                 # 메인 서버 (Hono)
├── products.js               # 제품 데이터
├── public/
│   ├── index.html           # 쇼핑몰 메인
│   ├── shop.html            # 제품 목록
│   ├── product.html         # 제품 상세
│   ├── cart.html            # 장바구니
│   ├── checkout.html        # 체크아웃
│   ├── admin/
│   │   ├── login.html       # 관리자 로그인
│   │   ├── dashboard.html   # 대시보드
│   │   └── products.html    # 제품 관리
│   └── css/
│       └── shop.css         # 쇼핑몰 스타일
```

---

## 💾 데이터 구조

### 제품 (Product)
```javascript
{
  id: 1,
  name: "COSRX Advanced Snail 96 Mucin Power Essence",
  brand: "COSRX",
  category: "serum",
  price: 28.99,
  originalPrice: 35.00,
  image: "url",
  images: ["url1", "url2", "url3"],
  description: "...",
  ingredients: "...",
  howToUse: "...",
  inStock: true,
  stock: 50,
  rating: 4.8,
  reviews: 1234,
  tags: ["bestseller", "sensitive-skin"]
}
```

### 주문 (Order)
```javascript
{
  id: "ORDER-001",
  date: "2025-12-01",
  customer: {
    name: "John Doe",
    email: "john@example.com",
    address: "..."
  },
  items: [
    { productId: 1, quantity: 2, price: 28.99 }
  ],
  subtotal: 57.98,
  shipping: 10.00,
  total: 67.98,
  status: "pending", // pending, paid, shipped, delivered
  paymentIntent: "pi_xxx" // Stripe
}
```

---

## 🎯 주요 기능

### 1. 홈페이지
- 베스트셀러 제품 (6개)
- 카테고리 (Cleanser, Toner, Serum, Moisturizer, Sunscreen)
- 특별 할인 섹션
- "Shop Now" CTA

### 2. 제품 목록
- 카테고리별 필터
- 가격대 필터
- 브랜드 필터
- 정렬 (인기순, 가격순, 신상품순)
- 그리드 뷰

### 3. 제품 상세
- 큰 제품 이미지 (갤러리)
- 가격 + 할인율
- "Add to Cart" 버튼
- 수량 선택
- 제품 설명
- 성분 정보
- 사용법
- 리뷰 (나중에)

### 4. 장바구니
- 제품 목록
- 수량 조절
- 삭제 기능
- 소계 계산
- 배송비 표시 ($10 고정!)
- "Proceed to Checkout"

### 5. 체크아웃
- 배송 정보 폼
- 주문 요약
- Stripe 결제
- 주문 확인

### 6. 관리자
- 로그인 (간단한 비밀번호)
- 제품 추가/수정/삭제
- 주문 목록 보기
- 주문 상태 업데이트

---

## 🔧 기술 스택

- **Backend**: Hono (Node.js)
- **Frontend**: Vanilla JavaScript (간단!)
- **Database**: JSON 파일 (초기) → MongoDB (나중에)
- **Payment**: Stripe
- **Styling**: Custom CSS
- **Storage**: LocalStorage (장바구니)

---

## 🚀 배포 계획

1. GitHub push
2. Vercel 자동 배포
3. 테스트
4. 실제 판매 시작!

---

## 💰 Stripe 설정

```bash
# Stripe CLI 설치 (나중에)
# 테스트 모드로 시작
# 실제 결제는 승인 후
```

---

## 📝 다음 단계

1. ✅ 제품 데이터 만들기 (20개 베스트셀러)
2. ✅ 홈페이지 HTML/CSS
3. ✅ 제품 목록 페이지
4. ✅ 장바구니 기능
5. ✅ Stripe 연동
6. ✅ 관리자 페이지

**예상 시간: 2-3시간 (기본 기능)**

---

지금 시작하시겠어요? 🚀
