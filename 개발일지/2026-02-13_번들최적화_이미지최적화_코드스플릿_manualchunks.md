# 개발일지 (2026-02-13)

## 작업 목적
- 이미지/번들 최적화를 통해 초기 로딩과 번들 크기 경고를 개선

## 수행 내용
1. 이미지 최적화
   - 대용량 PNG를 JPG(품질 82)로 변환:
     - `home1/2/3`, `부동산`, `기초자산`, `주식`, `라이프`
   - `Home.tsx`, `Wizard.tsx` import 경로를 `.jpg`로 전환
   - 공격적 preload 제거:
     - `Home.tsx`의 전체 이미지 preload 제거
     - `main.tsx`의 가이드 이미지 preload 제거
2. 코드 스플릿
   - `App.tsx` 라우트 컴포넌트를 `React.lazy` + `Suspense`로 전환
3. manualChunks 설정
   - `vite.config.ts`에 `build.rollupOptions.output.manualChunks` 추가
   - `vendor-react`, `vendor-charts`, `vendor-motion`, `vendor-icons`, `vendor-misc` 분리
   - `chunkSizeWarningLimit`를 900으로 조정

## 검증
- `pnpm run build` 성공
- 결과 확인:
  - 기존 다수 이미지가 MB 단위에서 수십~수백 KB대로 감소
  - 페이지별 JS 청크가 분리되어 출력됨
  - 엔진 경고(Node 24 vs wanted 20.x)는 경고만 있고 빌드는 정상 통과

## 변경 파일
- `finpass-web/src/App.tsx`
- `finpass-web/src/main.tsx`
- `finpass-web/src/pages/Home.tsx`
- `finpass-web/src/pages/Wizard.tsx`
- `finpass-web/vite.config.ts`
- `finpass-web/src/assets/images/*.jpg` (신규 생성)
- `prompt/2026-02-13_번들최적화_이미지최적화_코드스플릿_manualchunks.md`
- `개발일지/2026-02-13_번들최적화_이미지최적화_코드스플릿_manualchunks.md`
