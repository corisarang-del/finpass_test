# 개발일지 - Onboarding 모바일 CTA 고정 노출 핫픽스 (2026-02-14)

## 작업 목표
모바일에서 Onboarding 하단 CTA가 사라져 다음 단계로 못 넘어가는 문제 해결.

## 원인
- ramer-motion이 적용된 컨테이너 내부에서 position: sticky CTA를 사용
- 모바일 브라우저에서 transform + sticky 조합이 깨져 하단 버튼 미노출

## 변경 파일
1. finpass-web/src/pages/Onboarding.tsx
- CTA/풋터를 애니메이션 콘텐츠 내부에서 제거
- 페이지 루트 하단에 별도 position: absolute 고정 CTA 영역 신설
- 콘텐츠 스크롤 영역 paddingBottom 확대(calc(116px + env(safe-area-inset-bottom)))로 CTA와 겹침 방지
- step 변경 시 하단 문구가 정상 갱신되도록 key 기반 렌더링 적용

## 검증
- 
pm run build (finpass-web) 성공

## 회귀 영향
- 라우팅/상태 로직 변경 없음
- 하단 CTA 배치 구조만 안정화
