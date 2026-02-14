# 개발일지 - ValueDiscovery 선택 색상 일관화 (2026-02-14)

## 작업 목표
가이드 질문(Wizard)에서 선택 시 사용하는 색상과 ValueDiscovery의 선택 상태 색상 일치.

## 참조 기준
- 기준 파일: finpass-web/src/pages/Wizard.tsx
- 선택 상태 색상:
  - 배경: #1e2a3a
  - 보더: #1e2a3a
  - 텍스트: #ffffff
  - 그림자: 0 8px 25px rgba(30, 42, 58, 0.25)

## 변경 파일
1. finpass-web/src/pages/ValueDiscovery.tsx
- selectedOptionColor, selectedOptionShadow 상수 추가
- 목표/가치 칩(chipStyle) 선택 상태 색상을 Wizard 기준으로 변경
- 동기 스타일 버튼 선택 상태 색상을 Wizard 기준으로 변경
- 선택 상태 transition/boxShadow 일관화

## 검증
- 빌드 검증: npm run build (finpass-web) 성공

## 회귀 영향
- 상태/로직/라우팅 변경 없음
- 선택 상태의 시각 피드백 컬러만 조정
