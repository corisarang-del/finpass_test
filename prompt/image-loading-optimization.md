# 이미지 로딩 최적화 프롬프트

## 사용자 요청
```
서버 배포해서 보니 홈화면 이미지들과 가이드 이미지들이 약간씩 늦게 뜨는거 같아.
최적화 시켜서 빨리 뜨게 해줘
```

## 분석 과정
1. 이미지 파일 크기 확인
   - `agent_*.png`: 4개 각 779~853KB → 가장 큰 병목
   - `home*.jpg`: 248~457KB
   - 카테고리 JPG: 65~420KB
2. `vite.config.ts` 확인 → 이미지 압축 플러그인 없음
3. `Home.tsx` 확인 → home1만 useEffect에서 프리로드, 나머지는 렌더 시 로딩
4. `Wizard.tsx` 확인 → lazy-load 페이지, 카테고리-에이전트 매핑 파악
   - real-estate → agentHanImg
   - insurance → agentSongImg
   - stock → agentChoiImg
   - life-balance → agentYouImg

## 구현 전략
1. **빌드 시 압축**: `vite-plugin-image-optimizer` + `sharp` 설치 → JPG 80%, PNG 85% 품질
2. **모듈 레벨 프리로드**: Home.tsx 최상단에 `if (typeof window !== 'undefined')` 블록으로 7개 이미지 즉시 병렬 로드
3. **hover 프리페치**: 카드 `onPointerEnter`에서 해당 에이전트 이미지 `new Image()` 프리로드

## 결과
- 에이전트 PNG 79% 압축 (800KB → ~180KB)
- 전체 이미지 53% 절감 (4.9MB → 2.3MB)
- 빌드 성공, TypeScript 에러 없음
