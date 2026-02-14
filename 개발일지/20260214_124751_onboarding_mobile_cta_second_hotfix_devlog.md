# 개발일지 - Onboarding 모바일 CTA 2차 핫픽스 (2026-02-14)

## 작업 목표
리배포 후에도 모바일에서 CTA가 안 보이는 현상 재해결.

## 원인 추정
- 모바일 브라우저의 100vh/동적 툴바 이슈로 하단 요소가 실뷰포트 밖으로 밀림
- 컨테이너 기준 absolute 고정은 기기별 레이아웃 차이에서 불안정 가능

## 변경 파일
1. finpass-web/src/pages/Onboarding.tsx
- 루트 높이 100vh -> 100dvh(+ minHeight: 100dvh) 변경
- 콘텐츠 하단 패딩 상향 (calc(132px + env(safe-area-inset-bottom)))
- CTA 영역 position: absolute -> position: fixed 전환 (뷰포트 기준 고정)
- CTA 래퍼 pointerEvents: none, 버튼 pointerEvents: auto로 터치 안정화

## 검증
- 
pm run build (finpass-web) 성공

## 회귀 영향
- 기능/플로우 로직 변경 없음
- 모바일 뷰포트 대응 레이아웃만 조정
