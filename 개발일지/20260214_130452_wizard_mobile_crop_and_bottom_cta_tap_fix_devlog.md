# 개발일지

## 작업 요약
- Wizard 모바일 잘림 완화
  - viewport 너비 상태 관리 추가(resize 반영)
  - 루트 컨테이너를 모바일에서 스크롤 가능하게 조정
  - 선택지 패널에 mobile 전용 top/bottom 고정값 적용으로 하단 대화창과 충돌 방지
- 하단 CTA 터치 개선
  - 6개 페이지에 safe-area 포함 하단 패딩 확대
  - 주요 CTA를 sticky bottom으로 배치해 모바일 브라우저 UI(주소창/탭바)와 겹침 완화
  - CheckupConsent는 중앙 정렬 레이아웃을 문서 흐름 기반으로 변경하여 하단 버튼 접근성 개선

## 변경 파일
- finpass-web/src/pages/Wizard.tsx
- finpass-web/src/pages/ValueDiscovery.tsx
- finpass-web/src/pages/VisionBoard.tsx
- finpass-web/src/pages/Result.tsx
- finpass-web/src/pages/ActionPlanDetail.tsx
- finpass-web/src/pages/FinalAnalysis.tsx
- finpass-web/src/pages/CheckupConsent.tsx

## 검증
- npm run build 성공
