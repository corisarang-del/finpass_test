import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot } from 'lucide-react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart as ReLineChart,
  Line,
  BarChart,
  Bar,
} from 'recharts';
import agentHanImg from '../assets/images/agent_han.png';
import agentSongImg from '../assets/images/agent_song.png';
import agentChoiImg from '../assets/images/agent_choi.png';
import agentYouImg from '../assets/images/agent_you.png';
import { GUIDE_PROFILES } from '../lib/plannerProfile';

interface SimulationSnapshot {
  financialIndependenceAge: number | null;
  targetAsset: number;
  achievementRate: number;
  monthlySavings: number;
}

interface ActionPlanItem {
  title: string;
  description: string;
  impact: string;
  icon: 'house' | 'line' | 'shield';
  selected?: boolean;
}

interface ActionPlanDetailState {
  item?: ActionPlanItem;
  categoryId?: string;
  answers?: Record<string, unknown>;
  simulationSnapshot?: SimulationSnapshot;
  actionIndex?: number;
}

interface ActionScenario {
  headline: string;
  guideComment: string;
  steps: string[];
  yearlyMultiplier: number;
  yearlyGrowthBonus: number;
  progressDelta: [number, number, number, number];
  tableRows: [string, string, string][];
}

const GUIDE_IMAGES: Record<string, string> = {
  han: agentHanImg,
  song: agentSongImg,
  choi: agentChoiImg,
  you: agentYouImg,
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 22,
  border: '1px solid #e7ebf3',
  padding: 16,
  boxShadow: '0 10px 28px rgba(10, 23, 53, 0.05)',
};

const formatAsset = (value: number) => (value >= 100000000 ? `${(value / 100000000).toFixed(1)}억원` : `${Math.round(value / 10000).toLocaleString()}만원`);

const buildScenario = (
  categoryId: string,
  actionIndex: number,
  item: ActionPlanItem,
  snapshot: SimulationSnapshot,
  monthlySavings: number,
): ActionScenario => {
  const monthlyIncomeProxy = monthlySavings + 3500000;
  const residualCash = Math.max(0, monthlyIncomeProxy - monthlySavings);
  const categoryMap: Record<string, ActionScenario[]> = {
    'real-estate': [
      {
        headline: '주거자금 세후 수익률 강화',
        guideComment: '부동산 카테고리의 1번 액션은 주거자금 축적 속도를 높이는 것이 핵심입니다. 세후 수익률부터 올려드리겠습니다.',
        steps: ['ISA 자동이체 금액을 월 저축액의 40%로 설정', '주거자금 계좌와 생활비 계좌를 분리', '분기마다 세후 수익률 점검표 업데이트'],
        yearlyMultiplier: 1.17,
        yearlyGrowthBonus: 1.07,
        progressDelta: [0, 10, 20, 31],
        tableRows: [
          ['주거자금 적립액', `${Math.round(monthlySavings * 0.4).toLocaleString()}원`, '월 저축액의 40% 배치'],
          ['월 이자비용 완충력', `${Math.round(residualCash * 0.2).toLocaleString()}원`, '생활비 대비 완충 여력'],
          ['목표 자산(주거 포함)', formatAsset(snapshot.targetAsset), '주거비 포함 목표값'],
          ['달성률 델타(3년)', '+31%', '주거 전략 1순위 반영'],
        ],
      },
      {
        headline: '연금 공제 + 주거 병행 전략',
        guideComment: '부동산 카테고리의 2번 액션은 세액공제와 주거자금 누적을 함께 가져가는 전략입니다.',
        steps: ['연금 납입 우선순위를 세액공제 한도까지 고정', '잔여 저축분은 주거자금으로 자동 분배', '반기마다 자산배분 비율을 재조정'],
        yearlyMultiplier: 1.13,
        yearlyGrowthBonus: 1.12,
        progressDelta: [0, 8, 18, 27],
        tableRows: [
          ['연금 우선 납입액', `${Math.round(monthlySavings * 0.35).toLocaleString()}원`, '월 저축액의 35%'],
          ['주거 준비 적립액', `${Math.round(monthlySavings * 0.45).toLocaleString()}원`, '월 저축액의 45%'],
          ['성장 보너스 계수', '1.12x', '세액공제 복리 반영'],
          ['달성률 델타(3년)', '+27%', '공제+주거 병행 효과'],
        ],
      },
      {
        headline: '주거 리스크 방어 구조',
        guideComment: '부동산 카테고리의 3번 액션은 급격한 금리나 이사 변수에 대비하는 방어형 구조입니다.',
        steps: ['비상금 목표를 생활비 6개월로 설정', '고정비 자동이체일과 급여일 사이 간격 조정', '주거 관련 비정기 지출 버킷 생성'],
        yearlyMultiplier: 1.09,
        yearlyGrowthBonus: 1.03,
        progressDelta: [0, 6, 13, 21],
        tableRows: [
          ['주거 비상 버퍼', `${Math.round(residualCash * 0.6).toLocaleString()}원`, '예상 공실/이사 변수 대응'],
          ['고정비 안정 비율', `${Math.min(85, Math.round(snapshot.achievementRate + 18))}%`, '현금흐름 안전도 지표'],
          ['월 고정비 완충액', `${Math.round(monthlySavings * 0.25).toLocaleString()}원`, '긴급 지출 대비'],
          ['달성률 델타(3년)', '+21%', '이탈 방지 중심 개선'],
        ],
      },
    ],
    insurance: [
      {
        headline: '보장 중복 정리 중심안',
        guideComment: '기초자산 카테고리의 1번 액션은 보장 중복 제거로 현금흐름을 즉시 개선하는 전략입니다.',
        steps: ['중복 담보 1차 정리', '절감 보험료를 비상금 계좌로 자동 이체', '연 1회 보장 공백 여부 점검'],
        yearlyMultiplier: 1.12,
        yearlyGrowthBonus: 1.06,
        progressDelta: [0, 9, 17, 25],
        tableRows: [
          ['보험료 절감 추정', `${Math.round(monthlySavings * 0.16).toLocaleString()}원`, '중복 담보 정리 반영'],
          ['비상금 전환액', `${Math.round(monthlySavings * 0.2).toLocaleString()}원`, '절감분 우선 적립'],
          ['보장 공백 위험도', '낮음', '핵심 담보 유지 기준'],
          ['달성률 델타(3년)', '+25%', '고정비 절감 효과'],
        ],
      },
      {
        headline: '현금흐름 통장 분리 실행안',
        guideComment: '기초자산 카테고리의 2번 액션은 생활비/저축/보험 흐름을 분리해 실행 유지력을 높이는 방법입니다.',
        steps: ['생활비·저축·보장 계좌 3분리', '급여일+1일 자동분배 규칙 설정', '월말 잔액 이월 기준 고정'],
        yearlyMultiplier: 1.1,
        yearlyGrowthBonus: 1.08,
        progressDelta: [0, 7, 15, 23],
        tableRows: [
          ['생활비 계좌 한도', `${Math.round(residualCash).toLocaleString()}원`, '월 지출 상한'],
          ['저축 우선 배분액', `${Math.round(monthlySavings * 0.5).toLocaleString()}원`, '저축 계좌 선배정'],
          ['보험료 비중', `${Math.max(8, Math.round((monthlySavings / (monthlyIncomeProxy || 1)) * 100))}%`, '총 현금흐름 대비'],
          ['달성률 델타(3년)', '+23%', '흐름 자동화 효과'],
        ],
      },
      {
        headline: '연금 자동 납입 고정안',
        guideComment: '기초자산 카테고리의 3번 액션은 연금 자동납입으로 장기 복리를 고정하는 전략입니다.',
        steps: ['연금 납입일을 급여일 직후로 고정', '세액공제 한도까지 자동 증액 룰 적용', '연 2회 리밸런싱 캘린더 등록'],
        yearlyMultiplier: 1.14,
        yearlyGrowthBonus: 1.11,
        progressDelta: [0, 8, 18, 29],
        tableRows: [
          ['연금 자동 납입액', `${Math.round(monthlySavings * 0.42).toLocaleString()}원`, '월 저축액 기반'],
          ['성장 보너스 계수', '1.11x', '복리 가속 반영'],
          ['세액공제 활용률', `${Math.min(100, Math.round(snapshot.achievementRate + 28))}%`, '연금 우선 납입 기준'],
          ['달성률 델타(3년)', '+29%', '장기 복리 고정 효과'],
        ],
      },
    ],
    stock: [
      {
        headline: '핵심 ETF 집중 운용안',
        guideComment: '투자 카테고리의 1번 액션은 핵심 ETF 비중 확대로 변동성을 낮추면서 수익을 안정화하는 전략입니다.',
        steps: ['핵심 ETF 목표 비중 60% 이상 설정', '테마/개별주 비중 상한 20% 고정', '분기 리밸런싱 규칙 적용'],
        yearlyMultiplier: 1.16,
        yearlyGrowthBonus: 1.09,
        progressDelta: [0, 10, 21, 33],
        tableRows: [
          ['ETF 목표 비중', '60%', '핵심 자산 축'],
          ['테마 비중 상한', '20%', '쏠림 제한 룰'],
          ['변동성 완충 지수', `${Math.min(95, Math.round(snapshot.achievementRate + 22))}%`, '분산 효과 반영'],
          ['달성률 델타(3년)', '+33%', '핵심 ETF 집중 효과'],
        ],
      },
      {
        headline: '관심 테마 비중 제한안',
        guideComment: '투자 카테고리의 2번 액션은 선호 테마를 유지하되 총량 제한을 걸어 손실 구간을 관리하는 방법입니다.',
        steps: ['관심 테마 손실 허용치 사전 설정', '상한 초과 시 자동 축소 규칙 적용', '손익 리포트를 월 1회 기록'],
        yearlyMultiplier: 1.11,
        yearlyGrowthBonus: 1.07,
        progressDelta: [0, 7, 15, 24],
        tableRows: [
          ['테마 투자 한도', `${Math.round(monthlySavings * 0.2).toLocaleString()}원`, '월 투자 예산 기준'],
          ['손실 허용 구간', '-8%', '초과 시 비중 축소'],
          ['리밸런싱 빈도', '월 1회', '규칙 기반 관리'],
          ['달성률 델타(3년)', '+24%', '리스크 통제 효과'],
        ],
      },
      {
        headline: '하락장 방어 시나리오',
        guideComment: '투자 카테고리의 3번 액션은 하락장에서 손실폭을 통제하고 재진입 기준을 명확히 하는 전략입니다.',
        steps: ['손실 구간별 대응표 설정', '현금 비중 15% 고정', '반등 확인 후 단계적 재진입'],
        yearlyMultiplier: 1.08,
        yearlyGrowthBonus: 1.05,
        progressDelta: [0, 6, 12, 19],
        tableRows: [
          ['방어 현금 비중', '15%', '급락장 대응'],
          ['최대 손실 제한', '-12%', '포지션 축소 기준'],
          ['재진입 단계', '3단계', '분할 매수 원칙'],
          ['달성률 델타(3년)', '+19%', '낙폭 관리 효과'],
        ],
      },
    ],
    'life-balance': [
      {
        headline: '지출 루틴 고정 실행안',
        guideComment: '라이프 밸런스 카테고리의 1번 액션은 무리 없는 절약 루틴을 먼저 고정해 지속성을 높이는 전략입니다.',
        steps: ['절감 항목 1개를 4주 고정 실행', '고정비 대비 변동비 한도 설정', '주간 회고로 이탈 원인 점검'],
        yearlyMultiplier: 1.1,
        yearlyGrowthBonus: 1.06,
        progressDelta: [0, 8, 16, 25],
        tableRows: [
          ['루틴 고정 절감액', `${Math.round(monthlySavings * 0.14).toLocaleString()}원`, '선택 항목 기준'],
          ['주간 이탈 허용 횟수', '1회', '지속 가능성 유지'],
          ['습관 유지율 목표', '85%', '4주 루틴 기준'],
          ['달성률 델타(3년)', '+25%', '루틴 고정 효과'],
        ],
      },
      {
        headline: '월간 점검 루틴 실행안',
        guideComment: '라이프 밸런스 카테고리의 2번 액션은 월간 리포트 기반으로 지출과 저축률을 점검하는 구조입니다.',
        steps: ['월 1회 지출 리포트 자동 생성', '목표 대비 편차 10% 초과 시 보정', '다음 달 우선순위 1개만 지정'],
        yearlyMultiplier: 1.09,
        yearlyGrowthBonus: 1.08,
        progressDelta: [0, 7, 14, 22],
        tableRows: [
          ['월간 점검일', '매월 1일', '리뷰 고정'],
          ['편차 보정 기준', '10%', '초과 시 조정'],
          ['저축률 목표', `${Math.min(60, Math.round((monthlySavings / (monthlyIncomeProxy || 1)) * 100) + 8)}%`, '실행률 중심'],
          ['달성률 델타(3년)', '+22%', '리뷰 루틴 효과'],
        ],
      },
      {
        headline: '에너지 보호 운영안',
        guideComment: '라이프 밸런스 카테고리의 3번 액션은 번아웃을 줄여 계획을 길게 유지하는 데 초점을 둡니다.',
        steps: ['과소비 유발 구간 시간대 차단', '휴식 예산을 월 예산에 포함', '분기마다 스트레스 지표 점검'],
        yearlyMultiplier: 1.07,
        yearlyGrowthBonus: 1.04,
        progressDelta: [0, 5, 11, 18],
        tableRows: [
          ['휴식 예산 비중', '8%', '지속성 확보'],
          ['스트레스 임계치', '70점', '초과 시 일정 완화'],
          ['과소비 차단 횟수', '주 3회', '유발 상황 통제'],
          ['달성률 델타(3년)', '+18%', '번아웃 방지 효과'],
        ],
      },
    ],
  };

  const fallbackScenario: ActionScenario = {
    headline: `${item.title} 실행안`,
    guideComment: '현재 선택 기준으로 우선 실행 시나리오를 구성했습니다. 월간 점검만 꾸준히 유지하시면 됩니다.',
    steps: ['월 단위 실행 목표 1개 고정', '지표 점검 후 다음 액션 보정', '분기별 성과 리뷰'],
    yearlyMultiplier: 1.1,
    yearlyGrowthBonus: 1.06,
    progressDelta: [0, 7, 14, 22],
    tableRows: [
      ['현재 월 저축액', `${monthlySavings.toLocaleString()}원`, '입력값 기준'],
      ['목표 자산', formatAsset(snapshot.targetAsset), '시뮬레이션 반영'],
      ['현재 달성률', `${snapshot.achievementRate}%`, '현재 기준점'],
      ['달성률 델타(3년)', '+22%', '기본 실행 시나리오'],
    ],
  };

  const byCategory = categoryMap[categoryId] ?? categoryMap['real-estate'];
  return byCategory[actionIndex] ?? fallbackScenario;
};

const ActionPlanDetail = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const routeState = (state as ActionPlanDetailState) || {};

  const categoryId = routeState.categoryId ?? 'real-estate';
  const guide = GUIDE_PROFILES[categoryId] ?? GUIDE_PROFILES['real-estate'];
  const guideImage = GUIDE_IMAGES[guide.key] ?? agentHanImg;

  const item: ActionPlanItem = routeState.item ?? {
    title: '우선 실행 항목',
    description: '현재 상황 기준 기본 실행안을 보여드립니다.',
    impact: '추정 효과 분석',
    icon: 'line',
  };

  const snapshot = routeState.simulationSnapshot ?? {
    financialIndependenceAge: null,
    targetAsset: 3000000 * 12 * 25,
    achievementRate: 0,
    monthlySavings: 0,
  };
  const actionIndex = typeof routeState.actionIndex === 'number' ? routeState.actionIndex : 0;

  const monthlySavings = Math.max(0, snapshot.monthlySavings);
  const scenario = buildScenario(categoryId, actionIndex, item, snapshot, monthlySavings);
  const improvementRate = scenario.yearlyMultiplier - 1;
  const improvedSavings = Math.round(monthlySavings * (1 + improvementRate));

  const yearlyData = [
    { name: '현재', before: monthlySavings * 12, after: Math.round(improvedSavings * 12) },
    { name: '1년', before: monthlySavings * 24, after: Math.round(improvedSavings * 24 * scenario.yearlyGrowthBonus) },
    { name: '2년', before: monthlySavings * 36, after: Math.round(improvedSavings * 36 * (scenario.yearlyGrowthBonus + 0.06)) },
    { name: '3년', before: monthlySavings * 48, after: Math.round(improvedSavings * 48 * (scenario.yearlyGrowthBonus + 0.12)) },
  ];

  const progressData = [
    { year: '현재', rate: Math.min(100, snapshot.achievementRate + scenario.progressDelta[0]) },
    { year: '1년', rate: Math.min(100, snapshot.achievementRate + scenario.progressDelta[1]) },
    { year: '2년', rate: Math.min(100, snapshot.achievementRate + scenario.progressDelta[2]) },
    { year: '3년', rate: Math.min(100, snapshot.achievementRate + scenario.progressDelta[3]) },
  ];

  const tableRows: [string, string, string][] = [
    ['현재 월 저축액', `${monthlySavings.toLocaleString()}원`, '입력값 반영'],
    ['실행 후 월 저축액', `${improvedSavings.toLocaleString()}원`, `${Math.round(improvementRate * 100)}% 개선 시나리오`],
    ...scenario.tableRows,
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '18px 14px 30px', fontFamily: "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif" }}>
      <main style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gap: 14 }}>
        <header style={{ ...cardStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button type="button" onClick={() => navigate(-1)} style={{ border: '1px solid #d9deea', borderRadius: 999, background: '#fff', color: '#38415a', fontWeight: 800, fontSize: 14, padding: '8px 12px', cursor: 'pointer', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
            <ArrowLeft size={14} /> 이전
          </button>
          <p style={{ margin: 0, color: '#6f7890', fontSize: 13, fontWeight: 700 }}>액션 플랜 상세 분석</p>
        </header>

        <section style={{ ...cardStyle, background: '#0f1c3d', color: '#fff' }}>
          <p style={{ margin: 0, color: '#8edbc7', fontSize: 12, fontWeight: 700 }}>SELECTED ACTION PLAN</p>
          <h1 style={{ margin: '8px 0 0', fontSize: 36, lineHeight: 1.2, fontWeight: 900 }}>{item.title}</h1>
          <p style={{ margin: '6px 0 0', color: '#d8e1f4', fontSize: 13, fontWeight: 700 }}>{scenario.headline}</p>
          <p style={{ margin: '8px 0 0', color: '#b8c4df', fontSize: 15 }}>{item.description}</p>
          <p style={{ margin: '10px 0 0', color: '#d8e1f4', fontSize: 14, fontWeight: 700 }}>{item.impact}</p>
        </section>

        <section style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <img src={guideImage} alt={guide.name} style={{ width: 76, height: 92, borderRadius: 14, objectFit: 'contain', objectPosition: 'center top', background: '#eef3fb', border: '1px solid #d8e2f2', flexShrink: 0, padding: 2 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: '#111d3e', fontWeight: 900, fontSize: 19 }}>{guide.name}</p>
              <p style={{ margin: '2px 0 8px', color: '#6a7590', fontSize: 14 }}>{guide.role}</p>
              <div style={{ border: '1px solid #d5ddeb', background: '#f7fafe', borderRadius: 14, padding: '10px 12px', color: '#34405f', fontSize: 14, lineHeight: 1.45, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <Bot size={16} color="#111f45" style={{ marginTop: 2, flexShrink: 0 }} />
                {scenario.guideComment}
              </div>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: '0 0 10px', fontSize: 18, color: '#132248' }}>실행 단계</h2>
          <ol style={{ margin: 0, paddingLeft: 20, color: '#34405f', lineHeight: 1.55, fontSize: 14 }}>
            {scenario.steps.map((step) => (
              <li key={step} style={{ marginTop: 6 }}>{step}</li>
            ))}
          </ol>
        </section>

        <section style={{ ...cardStyle, paddingBottom: 10 }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 18, color: '#132248' }}>저축 누적 비교 차트</h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8edf6" />
                <XAxis dataKey="name" tick={{ fill: '#5f6d8b', fontSize: 12 }} />
                <YAxis tick={{ fill: '#5f6d8b', fontSize: 12 }} />
                <Tooltip formatter={(value) => `${Number(value).toLocaleString()}원`} />
                <Bar dataKey="before" name="현재 경로" fill="#9fb2d6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="after" name="실행 후 경로" fill="#0f7d68" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section style={{ ...cardStyle, paddingBottom: 10 }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 18, color: '#132248' }}>달성률 변화 예상</h2>
          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer>
              <ReLineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8edf6" />
                <XAxis dataKey="year" tick={{ fill: '#5f6d8b', fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fill: '#5f6d8b', fontSize: 12 }} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line type="monotone" dataKey="rate" stroke="#111f45" strokeWidth={3} dot={{ fill: '#111f45', r: 4 }} />
              </ReLineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: '0 0 10px', fontSize: 18, color: '#132248' }}>결과값 기반 실행 표</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #dbe2f0', color: '#5f6d8b' }}>항목</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #dbe2f0', color: '#5f6d8b' }}>수치</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #dbe2f0', color: '#5f6d8b' }}>설명</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr key={row[0]}>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #eef2f8', color: '#1b2747', fontWeight: 700 }}>{row[0]}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #eef2f8', color: '#0f7d68', fontWeight: 800 }}>{row[1]}</td>
                    <td style={{ padding: '10px 8px', borderBottom: '1px solid #eef2f8', color: '#5f6d8b' }}>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <button type="button" onClick={() => navigate('/final-analysis', { state: routeState })} style={{ border: 'none', borderRadius: 999, background: '#101d40', color: '#fff', fontWeight: 900, fontSize: 16, padding: '14px 12px', cursor: 'pointer' }}>
          액션 플랜 목록으로 돌아가기
        </button>
      </main>
    </div>
  );
};

export default ActionPlanDetail;
