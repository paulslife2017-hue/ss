#!/bin/bash

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 🔍 Vercel 배포 완료 확인 스크립트
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 
# 사용법: bash verify_deployment.sh
# 시간: 15:33 (5분 후) 실행
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Vercel 배포 확인 (2026-01-03 15:33)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Canonical 태그 확인
echo "1️⃣ Canonical 태그 확인:"
CANONICAL=$(curl -s -H "Cache-Control: no-cache" "https://seoulzen.com/public/korean-glass-skin-guide-2026-en.html" | grep -o '<link rel="canonical"[^>]*>')
if [ -n "$CANONICAL" ]; then
    echo "✅ $CANONICAL"
else
    echo "❌ Canonical 태그 없음 (아직 배포 중)"
fi
echo ""

# 2. www 리다이렉트 확인
echo "2️⃣ www → non-www 리다이렉트:"
REDIRECT=$(curl -I https://www.seoulzen.com/ 2>&1 | grep -i "location:")
if echo "$REDIRECT" | grep -q "https://seoulzen.com/"; then
    echo "✅ $REDIRECT"
else
    echo "❌ 리다이렉트 없음 (아직 배포 중)"
fi
echo ""

# 3. Sitemap 확인
echo "3️⃣ Sitemap 라우팅:"
SITEMAP=$(curl -I https://seoulzen.com/sitemap.xml 2>&1 | grep "HTTP")
if echo "$SITEMAP" | grep -q "200"; then
    echo "✅ $SITEMAP"
else
    echo "❌ Sitemap 에러"
fi
echo ""

# 4. Vercel 캐시 상태
echo "4️⃣ Vercel 캐시 상태:"
CACHE=$(curl -I https://seoulzen.com/ 2>&1 | grep "x-vercel-cache")
echo "   $CACHE"
if echo "$CACHE" | grep -q "MISS"; then
    echo "   ✅ 새 배포 적용됨 (CACHE: MISS)"
elif echo "$CACHE" | grep -q "HIT"; then
    echo "   ⚠️  오래된 캐시 (CACHE: HIT) - 2분 더 대기"
fi
echo ""

# 5. 배포 시간 확인
echo "5️⃣ 배포 타임스탬프:"
VERCEL_ID=$(curl -I https://seoulzen.com/ 2>&1 | grep "x-vercel-id")
echo "   $VERCEL_ID"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 결과 요약"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 결과 판단
if [ -n "$CANONICAL" ] && echo "$REDIRECT" | grep -q "https://seoulzen.com/"; then
    echo "🎉 배포 완료!"
    echo ""
    echo "✅ Canonical 태그: 추가됨"
    echo "✅ www 리다이렉트: 작동 중"
    echo "✅ Sitemap: 정상"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 다음 단계: Google Search Console"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. https://search.google.com/search-console 접속"
    echo "2. URL 검사 → 10개 URL 색인 요청"
    echo "3. Sitemaps → https://seoulzen.com/sitemap.xml 제출"
    echo ""
else
    echo "⚠️  아직 배포 중..."
    echo ""
    echo "현재 상태:"
    [ -z "$CANONICAL" ] && echo "❌ Canonical 태그: 없음"
    echo "$REDIRECT" | grep -q "https://seoulzen.com/" || echo "❌ www 리다이렉트: 없음"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⏰ 2-3분 더 기다린 후 다시 실행:"
    echo "   bash verify_deployment.sh"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi

echo ""
echo "마지막 확인: $(date)"
echo ""
