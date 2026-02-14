# 개발일지 - 핵심 페이지 타이포 톤다운 및 트렌디화 (2026-02-14)

## 작업 목표
업로드 참조 이미지 톤에 맞춰 제목/타이틀 과대·과중량 문제를 완화하고 세련된 인상을 강화.

## 변경 파일
1. finpass-web/src/pages/ValueDiscovery.tsx
- 타이틀 폰트 스택을 Pretendard Variable 우선으로 조정
- 메인 타이틀 크기/굵기 축소 (30/800 -> 26/700)
- 섹션 헤딩(핵심 목표/가치/동기) weight 톤다운 (900 -> 700)
- 선택 배지 텍스트 weight 톤다운

2. finpass-web/src/pages/VisionBoard.tsx
- 타이틀 폰트 스택 Pretendard Variable 우선 적용
- 히어로 타이틀 크기/굵기 축소 (30/800 -> 26/700)
- 섹션 헤딩 및 카드 타이틀 weight/size 톤다운

3. finpass-web/src/pages/Result.tsx
- 장식 serif(Cormorant) 제거, 산세리프 기반으로 통일
- 메인 질문 타이틀 축소 (46 -> 34, 700)
- 보조 문장 크기 축소 (17 -> 15)
- 옵션 카드/지표/섹션 헤딩의 둥근 반경 및 weight 정리
- CTA 버튼 타이포/패딩 완화 (18/900 -> 16/700)

4. finpass-web/src/pages/FinalAnalysis.tsx
- 타이틀 폰트 스택 Pretendard Variable 우선 적용
- 메인 타이틀 축소 (38/800 -> 32/700)
- 도달률 숫자/카드 타이틀/리스트 수치 weight 톤다운
- 공유 버튼 텍스트 크기 축소 (20 -> 15)

5. finpass-web/src/pages/CheckupConsent.tsx
- 메인 타이틀 축소 (32/800 -> 28/700)
- 폰트 스택 Pretendard Variable 우선 적용

6. finpass-web/src/pages/ActionPlanDetail.tsx
- 메인 타이틀 축소 (32/800 -> 28/700)
- 가이드명/섹션 h2 헤딩 weight/size 톤다운
- 폰트 스택 Pretendard Variable 우선 적용

## 검증
- 
pm run build (finpass-web) 성공

## 회귀 영향
- 로직/상태/라우팅 변경 없음
- 타이포그래피(크기/두께/일부 반경) 중심 시각 조정
