# 개발일지 - Wizard 모바일 잘림 + 주요 페이지 하단 CTA 터치성 개선 (2026-02-14)

## 작업 목표
- Wizard 모바일 잘림 해결
- 주요 페이지 하단 CTA가 모바일에서 안정적으로 눌리도록 터치/안전영역 보강

## 변경 파일
1. finpass-web/src/pages/Wizard.tsx
- 루트 높이 100vh -> 100dvh로 전환
- 모바일 판단(isMobile) 추가
- 모바일에서 캐릭터 이미지 비노출 처리
- 선택지 패널 모바일 전용 레이아웃(상단/폭/최대높이) 적용
- 하단 대화창 패딩/최소높이에 safe-area 반영
- 모바일에서 대화 텍스트 크기/행간 조정

2. finpass-web/src/pages/ValueDiscovery.tsx
- 메인 래퍼 하단 패딩에 nv(safe-area-inset-bottom) 반영
- CTA 버튼에 minHeight, 	ouchAction, zIndex 추가

3. finpass-web/src/pages/VisionBoard.tsx
- 페이지 하단 safe-area 패딩 반영
- CTA 버튼 터치 안정성(minHeight, 	ouchAction) 보강

4. finpass-web/src/pages/Result.tsx
- 페이지 하단 safe-area 패딩 반영
- 하단 CTA 버튼 터치 안정성 보강

5. finpass-web/src/pages/FinalAnalysis.tsx
- 페이지 하단 safe-area 패딩 반영
- primary/secondary 버튼 모두 터치 영역/터치 액션 보강

6. finpass-web/src/pages/ActionPlanDetail.tsx
- 페이지 하단 safe-area 패딩 반영
- 하단 CTA 버튼 터치 안정성 보강

7. finpass-web/src/pages/CheckupConsent.tsx
- 페이지 하단 safe-area 패딩 반영
- 주기 선택/제출/홈 버튼에 최소 높이 및 	ouchAction 보강

## 검증
- 
pm run build (finpass-web) 성공

## 회귀 영향
- 비즈니스 로직 변경 없음
- 모바일 레이아웃/터치 UX 중심 개선
