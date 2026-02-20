# 이미지 로딩 최적화

## 작성 시각
2026-02-20

## 해결하고자 한 문제
서버 배포 후 홈 화면 이미지와 가이드(에이전트) 이미지가 느리게 로딩되는 현상.

**원인 분석:**
- 홈/카테고리 이미지: React 마운트 이후에야 로딩 시작 (JS 파싱 → React 실행 → `new Image()` 순서)
- 에이전트 이미지(`agent_*.png`): Wizard 페이지가 lazy-load되어 클릭 후에야 다운로드 시작
- 빌드 시 이미지 압축 없음: agent PNG 4개가 각각 800KB 이상

## 해결된 것

### 1. 빌드 시 이미지 압축 (`vite-plugin-image-optimizer` + `sharp`)
- `vite-plugin-image-optimizer@2.0.3` + `sharp@0.34.5` 설치
- `vite.config.ts`에 플러그인 추가 (JPG quality 80, PNG quality 85)
- **에이전트 PNG 79% 압축**: 800KB → 170~190KB (4장 합산 ~2.6MB 절감)
- **전체 이미지 53% 압축**: 4.9MB → 2.3MB

### 2. 모듈 레벨 이미지 프리로드 (`Home.tsx`)
```ts
// JS 모듈 로드 즉시 실행 (React 마운트 이전)
if (typeof window !== 'undefined') {
  [home1, home2, home3, 부동산Image, 기초자산Image, 주식Image, 라이프Image].forEach(src => {
    const img = new Image();
    img.src = src;
  });
}
```
- 홈 화면의 7개 이미지를 Home.js 모듈 로드 즉시 병렬 프리로드
- React 렌더 대기 없이 브라우저가 즉시 HTTP 요청 시작

### 3. 카드 hover 시 에이전트 이미지 프리페치 (`Home.tsx`)
```ts
const AGENT_IMAGES = {
  'real-estate': agentHanImg,
  'insurance': agentSongImg,
  'stock': agentChoiImg,
  'life-balance': agentYouImg,
};

// 카드 onPointerEnter:
const img = new Image();
img.src = AGENT_IMAGES[cat.id];
```
- 카테고리 카드에 마우스를 올리면 해당 에이전트 이미지 즉시 프리로드
- Wizard lazy-load + React 렌더 이전에 이미지가 캐시에 적재됨

## 해결 안 된 것
- JPG 압축률이 3~7%로 낮음: 원본이 이미 상당히 압축된 JPG이기 때문. WebP 변환으로 추가 절감 가능하나 현재 미적용
- home*.jpg는 여전히 244~454KB: CDN 캐시 또는 WebP 변환으로 추가 개선 가능

## 수정 파일
- `finpass-web/vite.config.ts` (이미지 최적화 플러그인 추가)
- `finpass-web/src/pages/Home.tsx` (에이전트 이미지 import, 모듈 레벨 프리로드, hover 프리페치)
- `finpass-web/package.json` (vite-plugin-image-optimizer, sharp devDependency 추가)

## 향후 컨텍스트
- 이미지 추가/교체 시 빌드만 하면 자동 압축됨 (별도 작업 불필요)
- JPG → WebP 변환 원하면 vite.config.ts에 `webp: { quality: 82 }` + `includePublic: true` 옵션 추가
- 에이전트 이미지가 추가되면 `AGENT_IMAGES` 레코드에 추가 필요
