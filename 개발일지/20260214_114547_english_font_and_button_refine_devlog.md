# 개발일지 - 영어 전용 세리프 폰트 + 버튼/타이포 톤다운 (2026-02-14)

## 작업 목표
업로드 참고 이미지 분위기에 맞춰 영어 텍스트는 고급 세리프 계열로 분리 적용하고, 6개 페이지의 타이포/버튼을 과중량에서 미니멀 톤으로 정리.

## 변경 파일
1. finpass-web/src/index.css
- Google Fonts Playfair Display import 추가

2. finpass-web/src/pages/ValueDiscovery.tsx
- 영어 전용 폰트 상수 추가(nglishFont)
- STEP 01에 영어 세리프 폰트 적용
- CTA 버튼 톤다운(14r/700/16 -> 12r/600/15, 그림자 약화)
- CTA 컬러를 공통 선택색(#1e2a3a) 유지

3. finpass-web/src/pages/VisionBoard.tsx
- 영어 전용 폰트 상수 추가
- VISION BOARD, VISION n 라벨에 세리프 폰트 적용
- CTA 버튼 톤다운(반경/굵기/그림자 완화)

4. finpass-web/src/pages/Result.tsx
- 영어 전용 폰트 상수 추가
- VISION BOARD 라벨에 세리프 폰트 적용
- 주요 CTA 버튼 톤다운(굵기/크기/패딩/그림자)
- 선택 버튼 숫자/비율 버튼 weight 소폭 하향

5. finpass-web/src/pages/FinalAnalysis.tsx
- 영어 전용 폰트 상수 추가
- 5-YEAR ASSET ROADMAP, ASSET TOPOGRAPHY에 세리프 폰트 적용
- primary/secondary 버튼 톤다운(반경/굵기/크기/그림자 완화)

6. finpass-web/src/pages/ActionPlanDetail.tsx
- 영어 전용 폰트 상수 추가
- SELECTED ACTION PLAN 라벨에 세리프 폰트 적용
- 하단 CTA 버튼 톤다운(반경/굵기/크기/그림자 완화)

7. finpass-web/src/pages/CheckupConsent.tsx
- 선택 버튼/CTA 버튼 톤다운(굵기/크기/그림자 완화)

## 검증
- 
pm run build (finpass-web) 성공

## 회귀 영향
- 기능/상태/라우팅 로직 변경 없음
- 텍스트 스타일 및 버튼 시각 톤만 조정
