# 홈 카드 리디자인 프롬프트

## 사용자 요청
```
c:\Users\khc\Desktop\coding_test\asset_up\finpass_test\default.png 현재 이 화면에서 각각 4개 영역을 클릭하면 해당 가이드 화면으로 바뀌는데 이 디자인을 바꾸고 싶어.
c:\Users\khc\Desktop\coding_test\asset_up\finpass_test\role.png role.png에 나오는 이런식으로 수정해줘.
폰트는 현재 홈페이지 유지. 색감이나 uxui도 유지하면서 디자인만 role.png 형식
```

## 분석 과정
1. `default.png` (현재): 4개 세로 밴드, 각 25vh, 풀스크린 배경이미지 + 중앙 텍스트
2. `role.png` (목표): 다크 배경, 가로 카드 그리드, 이미지 썸네일 카드, 상단 제목
3. `finpass-web/src/pages/Home.tsx` 탐색 → `sequenceStep === 3` 블록이 대상
4. Tailwind CSS 4 + framer-motion + 인라인 스타일 혼용 방식 파악

## 구현 전략
- `sequenceStep === 3` AnimatePresence 블록만 수정 (나머지 로직 건드리지 않음)
- CSS Grid 반응형: `grid-cols-2 md:grid-cols-4`
- 카드 높이: `clamp(220px, 52vh, 420px)` 고정으로 이미지 비율 유지
- framer-motion `whileHover={{ y: -8 }}` + Tailwind group hover 조합으로 인터랙션
- 기존 폰트(Sora, Pretendard, Outfit) 및 다크 색감 완전 유지
