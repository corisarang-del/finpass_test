# 개발일지 - 선택 상태 색상 테마 일관화 확장 (2026-02-14)

## 작업 목표
ValueDiscovery에 맞춘 선택 상태 기준색(#1e2a3a)을 주요 후속 페이지에도 통일 적용.

## 변경 파일
1. finpass-web/src/pages/VisionBoard.tsx
- selectedOptionColor, selectedOptionShadow 상수 추가
- 주요 CTA 버튼 색상/그림자를 선택 상태 기준값으로 변경
- 자산 항로 곡선/포인트 강조색을 선택 상태 기준값으로 통일

2. finpass-web/src/pages/FinalAnalysis.tsx
- selectedOptionColor, selectedOptionShadow 상수 추가
- 주요 CTA(점검 동의 버튼) 색상/그림자를 선택 상태 기준값으로 변경
- 상단 목표 도달률 수치 강조색 통일
- 연차 리스트의 1번 활성 배지 색상 통일

3. finpass-web/src/pages/ActionPlanDetail.tsx
- selectedOptionColor, selectedOptionShadow 상수 추가
- 주요 CTA 버튼 색상/그림자 통일
- 차트의 실행 후 경로/달성률 라인 강조색 통일
- 실행 표 수치 컬러 통일

4. finpass-web/src/pages/CheckupConsent.tsx
- selectedOptionColor, selectedOptionShadow 상수 추가
- 주기 선택 버튼(active) 배경/보더/텍스트/그림자 통일
- 제출 CTA 버튼 색상/그림자 통일

## 검증
- 빌드 검증: npm run build (finpass-web) 성공

## 회귀 영향
- 비즈니스 로직/데이터 흐름 변화 없음
- 색상 토큰 및 시각 강조 규칙만 조정
