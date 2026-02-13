# JS 번들 분석 프롬프트

**사용 시각**: 2026-02-12

## 프롬프트

JS 번들을 분석해서 앱 구조를 파악해줘.

## 수행 내용

1. 프로젝트 루트 디렉토리 탐색 (`finpass-web/`)
2. `package.json` 분석 → 의존성 파악 (React 19, Vite 8, Tailwind v4, framer-motion, lucide-react 등)
3. `App.tsx` → 라우팅 구조 파악 (/, /wizard, /result)
4. 4개 페이지 파일 전체 소스 분석:
   - `Home.tsx` (207줄) — 인트로 시퀀스 + 카테고리 선택
   - `Wizard.tsx` (821줄) — 가이드 에이전트 대화형 질문
   - `FinalAnalysis.tsx` (318줄) — 분석 결과 대시보드
   - `Result.tsx` (96줄) — 구 버전 결과 페이지
5. `tailwind.config.js`, `index.html`, `index.css`, `App.css` 설정 분석
6. assets 이미지 목록 확인 (11개 PNG)
7. 분석 결과를 `개발일지/JS_번들_분석_결과.md`로 정리
