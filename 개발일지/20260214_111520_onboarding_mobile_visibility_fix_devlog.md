# 개발일지 - Onboarding 하단 CTA 가시성/모바일 UX 개선 (2026-02-14)

## 작업 목표
배포 환경에서 Onboarding 하단 버튼이 잘리는 문제 해결 및 모바일 사용성 개선.

## 변경 파일
1. finpass-web/src/pages/Onboarding.tsx
- 콘텐츠 영역을 overflowY: auto로 전환해 작은 뷰포트에서도 스크롤 가능하게 조정
- nv(safe-area-inset-bottom) 적용으로 모바일 하단 안전영역 대응
- 중앙 고정(margin auto) 레이아웃을 minHeight: 100% 기반 플로우 레이아웃으로 변경
- 하단 안내 + CTA를 position: sticky; bottom: 0으로 변경해 항상 접근 가능하도록 개선
- 모바일 화면에서 제목/카드 패딩/간격을 소폭 축소하여 한 화면 밀도 최적화

## 검증
- 빌드 검증: npm run build (finpass-web) 성공

## 회귀 영향
- 기능/라우팅 로직 변경 없음
- 레이아웃/스크롤 동작 및 하단 CTA 노출 정책만 변경
