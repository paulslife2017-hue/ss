# ✅ 최종 실행 계획: Google이 non-www를 선택하도록 강제하기

**생성일**: 2026-01-04
**목표**: Google Search Console "Google 선택 표준 URL"을 `https://seoulzen.com/`로 변경

---

## 📋 현재 상태

```
✅ 사용자 선언 표준 URL: https://seoulzen.com/ (인식됨!)
❌ Google에서 선택한 표준 URL: https://www.seoulzen.com/ (아직 www 선택 중!)
✅ 301 리다이렉트: 작동 중
✅ sitemap.xml: non-www만 포함
✅ canonical 태그: 모든 페이지 설정 완료
✅ HTTP 헤더: X-Robots-Tag, Link canonical 설정 완료
```

**문제**: Google이 우리의 선언을 **인식했지만** 아직 **수용하지 않았음**

---

## 🎯 해야 할 일 (3단계)

### **STEP 1: Vercel에서 www 도메인 처리** ⭐ 가장 중요

**옵션 A: www 도메인 완전 삭제 (추천!)** 

```
1. https://vercel.com/paulslife2017-hue/ss/settings/domains
2. www.seoulzen.com 행 찾기
3. ❌ Remove Domain 클릭
4. 확인
```

**효과**: Google이 www에 접근 불가 → 강제로 non-www 선택

**옵션 B: 301 리다이렉트 유지 (이미 설정됨)**

```
1. 307 → 301로 변경 확인
2. Redirect to: seoulzen.com 확인
3. Save
```

**효과**: Google이 점진적으로 non-www 선택

---

### **STEP 2: Google Search Console 작업**

**1) URL 검사 도구:**

```
1. https://search.google.com/search-console 접속
2. 속성: seoulzen.com 선택 (www 아님!)
3. URL 입력: https://seoulzen.com/
4. "색인 생성 요청" 클릭
```

**2) Sitemap 재제출:**

```
1. Sitemaps 메뉴 클릭
2. 기존 sitemap 모두 삭제:
   - https://www.seoulzen.com/sitemap.xml (삭제!)
   - 기타 www 버전 sitemap (삭제!)
3. 새로 추가: https://seoulzen.com/sitemap.xml
4. 제출
```

**3) 주요 페이지 색인 요청 (5개):**

```
https://seoulzen.com/
https://seoulzen.com/blog.html
https://seoulzen.com/blog/gangnam-massage-guide-2025.html
https://seoulzen.com/blog/korean-skincare-routine-beginners-2025.html
https://seoulzen.com/blog/gangnam-head-spa-complete-guide-2025.html
```

---

### **STEP 3: 확인 및 모니터링**

**1) 301 리다이렉트 확인:**

```bash
curl -I https://www.seoulzen.com/ 2>&1 | grep -i "301\|location"
```

**기대 결과:**
```
HTTP/2 301
location: https://seoulzen.com/
```

**2) 1-3일 후 확인:**

```
1. Google Search Console → URL 검사
2. 입력: https://seoulzen.com/
3. "Google에서 선택한 표준 URL" 확인
4. https://seoulzen.com/로 변경되었는지 확인
```

**3) 1-2주 후 확인:**

```
1. Google Search Console → Coverage 탭
2. Valid 페이지 증가 확인
3. Duplicate 페이지 감소 확인
```

---

## ⏰ 예상 타임라인

| 시점 | 조치 | 예상 결과 |
|-----|-----|---------|
| **지금** | Vercel 설정 + Google 색인 요청 | 작업 완료 |
| **5-10분 후** | 301 리다이렉트 확인 | HTTP/2 301 정상 |
| **1-3일 후** | Google 재크롤링 | "Google 선택 표준 URL" 변경 시작 |
| **3-7일 후** | 색인 업데이트 | non-www로 완전 전환 |
| **1-2주 후** | 중복 페이지 오류 해소 | Coverage 탭 정상화 |
| **2-4주 후** | 검색 결과 정상화 | 완전 해결 ✅ |

---

## ✅ 최종 체크리스트

**지금 즉시 (5-10분):**
- [ ] Vercel에서 www.seoulzen.com 처리 (삭제 또는 301 확인)
- [ ] curl로 301 리다이렉트 확인
- [ ] Google Search Console 속성 확인 (seoulzen.com만 사용)

**30분 내:**
- [ ] Google Search Console → Sitemaps → 기존 www sitemap 삭제
- [ ] Google Search Console → Sitemaps → https://seoulzen.com/sitemap.xml 재제출
- [ ] Google Search Console → URL 검사 → https://seoulzen.com/ 색인 요청

**1시간 내:**
- [ ] 주요 페이지 5개 색인 요청 (위 목록 참고)

**1-3일 후:**
- [ ] "Google 선택 표준 URL" 변경 확인

**1-2주 후:**
- [ ] Coverage 탭 → Valid 증가 / Duplicate 감소 확인

---

## 🎯 핵심 포인트

1. **www 도메인 삭제 = 가장 강력** (Google이 선택할 수 없음)
2. **301 리다이렉트 = 점진적 해결** (1-3일 소요)
3. **Google Search Console 작업 = 필수** (Google에 직접 알림)
4. **인내심 필요** = Google 색인 업데이트는 즉시 반영 안 됨

---

## 🔍 문제 해결

**Q: "Google 선택 표준 URL"이 여전히 www인 경우?**

A: 1-3일 더 대기 → Google은 즉시 반영하지 않음

**Q: 중복 페이지 오류가 사라지지 않는 경우?**

A: 1-2주 대기 → Coverage 탭은 느리게 업데이트됨

**Q: www 도메인을 삭제해도 되나요?**

A: 네! 301 리다이렉트보다 더 강력하고 명확합니다.

---

## 📞 다음 단계

**지금 바로:**
1. ✅ Vercel 대시보드 접속 → www 도메인 처리
2. ✅ Google Search Console → Sitemaps 재제출
3. ✅ Google Search Console → 주요 페이지 색인 요청

**완료 후:**
1. 이 문서에 체크 표시하기
2. 1-3일 후 다시 확인하기
3. 문제 발생 시 FORCE_GOOGLE_NON_WWW.md 참고

---

**결론**: 이제 Google에 **직접 알려야** 합니다. Search Console 작업이 핵심입니다!

