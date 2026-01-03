#!/bin/bash

echo "=========================================="
echo "SEO Canonical URL 검증 스크립트"
echo "=========================================="
echo ""

ERRORS=0

# 1. sitemap.xml에 /public/ 경로가 없는지 확인
echo "✅ 1. sitemap.xml 검증"
if grep -q "seoulzen.com/public/" sitemap.xml; then
    echo "   ❌ ERROR: sitemap.xml에 /public/ 경로가 여전히 존재합니다!"
    ERRORS=$((ERRORS+1))
else
    echo "   ✓ sitemap.xml에 /public/ 경로 없음 (정상)"
fi

# 2. sitemap.xml에 홈페이지 URL 확인
echo ""
echo "✅ 2. 홈페이지 URL 검증"
if grep -q "<loc>https://seoulzen.com/</loc>" sitemap.xml; then
    echo "   ✓ https://seoulzen.com/ 존재 (정상)"
else
    echo "   ❌ ERROR: https://seoulzen.com/ 누락!"
    ERRORS=$((ERRORS+1))
fi

# 3. robots.txt sitemap 경로 확인
echo ""
echo "✅ 3. robots.txt sitemap 경로 검증"
if grep -q "Sitemap: https://seoulzen.com/sitemap.xml" robots.txt; then
    echo "   ✓ robots.txt sitemap 경로 정상"
else
    echo "   ❌ ERROR: robots.txt sitemap 경로 오류!"
    ERRORS=$((ERRORS+1))
fi

# 4. index.html canonical URL 확인
echo ""
echo "✅ 4. index.html canonical URL 검증"
if grep -q 'rel="canonical" href="https://seoulzen.com/"' index.html; then
    echo "   ✓ index.html canonical URL 정상"
else
    echo "   ❌ ERROR: index.html canonical URL 오류!"
    ERRORS=$((ERRORS+1))
fi

# 5. blog.html canonical URL 확인
echo ""
echo "✅ 5. blog.html canonical URL 검증"
if grep -q 'rel="canonical" href="https://seoulzen.com/blog.html"' blog.html; then
    echo "   ✓ blog.html canonical URL 정상"
else
    echo "   ❌ ERROR: blog.html canonical URL 오류!"
    ERRORS=$((ERRORS+1))
fi

# 6. 블로그 페이지 샘플 검증 (5개)
echo ""
echo "✅ 6. 블로그 페이지 canonical URL 샘플 검증"
BLOG_ERRORS=0
for file in $(ls blog/*.html | head -5); do
    filename=$(basename "$file")
    if grep -q "rel=\"canonical\" href=\"https://seoulzen.com/blog/$filename\"" "$file"; then
        echo "   ✓ $filename canonical 정상"
    else
        echo "   ❌ $filename canonical 오류!"
        BLOG_ERRORS=$((BLOG_ERRORS+1))
    fi
done
if [ $BLOG_ERRORS -gt 0 ]; then
    ERRORS=$((ERRORS+1))
fi

# 7. _headers 파일 검증
echo ""
echo "✅ 7. _headers 파일 검증"
if grep -q 'Link: <https://seoulzen.com/>; rel="canonical"' _headers; then
    echo "   ✓ _headers에 canonical 헤더 존재"
else
    echo "   ⚠️  WARNING: _headers에 canonical 헤더 누락 (선택사항)"
fi

# 8. _redirects 파일 검증
echo ""
echo "✅ 8. _redirects www→non-www 리다이렉트 검증"
if grep -q "https://www.seoulzen.com/\*.*https://seoulzen.com/:splat.*301" _redirects; then
    echo "   ✓ www→non-www 301 리다이렉트 존재"
else
    echo "   ❌ ERROR: www→non-www 리다이렉트 누락!"
    ERRORS=$((ERRORS+1))
fi

# 9. sitemap.xml URL 개수 확인
echo ""
echo "✅ 9. sitemap.xml 통계"
TOTAL_URLS=$(grep -c "<loc>" sitemap.xml)
echo "   ℹ️  총 $TOTAL_URLS 개의 URL 포함"

echo ""
echo "=========================================="
if [ $ERRORS -eq 0 ]; then
    echo "✅ 모든 검증 통과! SEO 설정이 완벽합니다!"
    echo "=========================================="
    exit 0
else
    echo "❌ $ERRORS 개의 오류 발견! 위 내용을 확인하세요."
    echo "=========================================="
    exit 1
fi
