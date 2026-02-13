# JS 번들 및 앱 구조 분석 결과

**작성시각**: 2026-02-12  
**해결하고자 한 문제**: FinPass 웹 앱의 JS 번들/소스코드를 분석하여 전체 앱 구조, 컴포넌트, 데이터 흐름, 스타일링 전략을 파악

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프레임워크 | React 19 + Vite 8 beta + TypeScript 5.9 |
| 스타일링 | Tailwind CSS v4 + 인라인 스타일 혼용 |
| 라우팅 | react-router-dom v7 |
| 애니메이션 | framer-motion v12 |
| 아이콘 | lucide-react |
| 유틸 | clsx, tailwind-merge |
| 폰트 | Pretendard(한글), Inter/Outfit(영문) — CDN 로드 |
| 패키지매니저 | pnpm |

---

## 2. 디렉토리 구조

```
finpass-web/
├── index.html            — 엔트리, 폰트 CDN 로드
├── src/
│   ├── main.tsx          — ReactDOM 렌더 엔트리
│   ├── App.tsx           — Router 설정 (3 라우트)
│   ├── index.css         — Tailwind 지시자 + 글로벌 리셋
│   ├── App.css           — Vite 기본 보일러플레이트 (미사용)
│   ├── pages/
│   │   ├── Home.tsx      — 홈 (207줄)
│   │   ├── Wizard.tsx    — 질문 위자드 (821줄)
│   │   ├── FinalAnalysis.tsx — 분석 결과 (318줄)
│   │   └── Result.tsx    — 구 결과 페이지 (96줄, 미사용?)
│   ├── assets/images/    — 11개 PNG 이미지
│   ├── components/       — 빈 디렉토리
│   ├── hooks/            — 빈 디렉토리
│   └── utils/            — 빈 디렉토리
├── tailwind.config.js    — 폰트 패밀리 커스텀
└── vite.config.ts
```

---

## 3. 라우팅 구조

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | `Home` | 인트로 시퀀스 → 카테고리 선택 |
| `/wizard?category=ID` | `Wizard` | 가이드 에이전트와 대화형 질문 |
| `/result` | `FinalAnalysis` | 답변 기반 분석 결과 표시 |

---

## 4. 페이지별 상세 분석

### 4.1 Home.tsx

**역할**: 3단계 인트로 애니메이션 → 4개 카테고리 선택 화면

**핵심 로직**:
- `sequenceStep` state (0~3)로 단계 관리
- step 0~2: 배경 이미지 교체 + 중앙 텍스트 애니메이션 (3.5초 간격)
- step 3: 4개 카테고리 카드 (각 25vh 높이, 풀스크린)

**카테고리 4종**:
- `real-estate` (부동산) — `부동산.png`
- `insurance` (기초자산) — `기초자산.png`  
- `stock` (주식) — `주식.png`
- `life-balance` (라이프) — `라이프.png`

**스타일 특징**:
- 배경 이미지 `brightness(1.4)` 필터
- 그라데이션 오버레이 (`rgba(0,0,0,0.25)` → `rgba(0,0,0,0.1)`)
- hover 시 opacity/scale 트랜지션
- FinPass 로고: Outfit 폰트, 고정 좌상단

### 4.2 Wizard.tsx (핵심 컴포넌트, 821줄)

**역할**: 카테고리별 가이드 에이전트가 대화형으로 질문을 진행

**데이터 구조**:
- `QuestionType`: `'text' | 'number' | 'single' | 'multi' | 'slider' | 'intro'`
- `Question`: id, step, text, type, options, placeholder, guideComment, condition
- `GuideProfile`: name, nameKo, role, image, color, accentColor, bgImage, intro, outro

**가이드 에이전트 4명**:
| ID | 이름 | 역할 | 색상 |
|----|------|------|------|
| real-estate | 에이전트 한 (Agent Han) | Real Estate Strategist | `#4A90D9` |
| insurance | 가디언 송 (Guardian Song) | Risk Manager | `#4CAF50` |
| stock | 트레이더 최 (Trader Choi) | Market Analyst | `#E53935` |
| life-balance | 디렉터 유 (Director Yoo) | Life Balancer | `#9C27B0` |

**질문 흐름**:
- 공통 질문 4개 (인사, 이름, 나이, 가치관)
- 카테고리별 질문 6개 (총 10개 스텝)
- 조건부 질문은 `condition` 함수로 필터링

**UI 특징**:
- 가이드 캐릭터 이미지: 좌측 하단 60~70vh 높이
- 대화 버블: 우측 하단, 가이드 코멘트 타이핑 애니메이션 (30ms/글자)
- 선택지: 중앙 2열 그리드 카드, selected 시 `#1e2a3a` 배경
- 진행률 바: 상단, 가이드 color 기반 그라데이션
- 배경: 순수 화이트 + 가이드 color 미세 radial-gradient

### 4.3 FinalAnalysis.tsx

**역할**: Wizard에서 받은 답변을 기반으로 Mock 분석 결과 표시

**섹션 구성**:
1. **타이틀**: 가이드 이름 + 사용자명 표시
2. **요약 카드 4장**: 현재 단계, 준비 지수(점수), 목표 시점, 이벤트 충돌
3. **인생 타임라인**: 4개 이벤트 포인트 (현재→1차목표→충돌→최종목표)
4. **가이드 인사이트**: 한 줄 요약 + CTA 버튼 2개
5. **리스크/기회**: 2열 그리드

**Mock 데이터 예시** (real-estate):
- 단계: 성장기, 점수: 58/주의, 목표 도달: 6년 2개월
- 리스크: 대출 비중 과다, 청약 가점 부족
- 기회: 월 저축 여력 양호, 부업 소득 가능성

### 4.4 Result.tsx (구 버전, 미사용 추정)

**역할**: 대시보드 형태의 간단한 결과 화면 (라우트에 매핑 안됨)
- 3열 레이아웃(타임라인 + 사이드바)
- 하드코딩된 데이터

---

## 5. 이미지 에셋 (11개)

| 파일명 | 용도 | 크기 |
|--------|------|------|
| home1/2/3.png | 홈 배경 & 위자드 배경 | 3~4.5MB |
| agent_han/song/choi/you.png | 가이드 에이전트 캐릭터 | ~800KB |
| 부동산/기초자산/주식/라이프.png | 카테고리 카드 배경 | 0.8~3.8MB |

---

## 6. 스타일링 전략

- **Tailwind CSS v4**: 유틸리티 클래스 기반 레이아웃, 색상, 타이포그래피
- **인라인 스타일**: Wizard.tsx에서 대부분의 상세 스타일링을 inline으로 처리 (framer-motion과 통합)
- **커스텀 폰트**: tailwind.config.js에서 `sans: Pretendard`, `display: Outfit`
- **없는 것**: CSS 변수, 디자인 토큰 시스템, 다크모드, 반응형 breakpoint (md만 일부)

---

## 7. 해결된 것 / 안된 것

### 해결됨
- 전체 앱 아키텍처 파악 완료
- 라우팅 구조 및 데이터 흐름 파악
- 4개 페이지 컴포넌트의 역할/구조/스타일 분석 완료
- 가이드 에이전트 시스템 및 질문 구조 파악
- 스타일링 전략 분석 (Tailwind + inline 혼용)

### 미해결 / 개선 필요
- PINPASS 참조 사이트의 JS 번들 청크 분석은 일부만 완료 (나머지 청크 미확인)
- `Result.tsx`가 라우트에 매핑되지 않아 실제 사용 여부 불명확
- components/hooks/utils가 모두 비어있어 코드 재사용성 낮음
- Wizard.tsx가 821줄로 과도하게 큼 (리팩토링 필요)
