import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, RotateCcw, CircleCheck, Circle, Bot, TrendingUp } from 'lucide-react';
import { useFinancialSimulation } from '../hooks/useFinancialSimulation';
import type { PlanInputs } from './Result';
import agentHanImg from '../assets/images/agent_han.png';
import agentSongImg from '../assets/images/agent_song.png';
import agentChoiImg from '../assets/images/agent_choi.png';
import agentYouImg from '../assets/images/agent_you.png';
import {
  derivePlanInputsFromAnswers,
  getSimulationGuideComment,
  getDetailedAnswerInsights,
  GUIDE_PROFILES,
} from '../lib/plannerProfile';

interface SimulationRouteState {
  answers?: Record<string, unknown>;
  categoryId?: string;
  planInputs?: PlanInputs;
}

interface ActionItem {
  key: 'coffee' | 'delivery' | 'subscription';
  label: string;
  desc: string;
  amount: number;
}

interface GuideImageProfile {
  image: string;
}

const GUIDE_IMAGES: Record<string, GuideImageProfile> = {
  han: { image: agentHanImg },
  song: { image: agentSongImg },
  choi: { image: agentChoiImg },
  you: { image: agentYouImg },
};

const EMPTY_ANSWERS: Record<string, unknown> = {};

const ACTION_ITEMS: ActionItem[] = [
  { key: 'coffee', label: '매일 커피 한 잔 줄이기', desc: '월 10만원 절약', amount: 100000 },
  { key: 'delivery', label: '배달 음식 주 2회 줄이기', desc: '월 20만원 절약', amount: 200000 },
  { key: 'subscription', label: '안 쓰는 구독 해지하기', desc: '월 5만원 절약', amount: 50000 },
];

const toNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toMoney = (value: number) => `${Math.round(value).toLocaleString()}원`;
const toAsset = (value: number) => (value >= 100000000 ? `${(value / 100000000).toFixed(1)}억원` : `${Math.round(value / 10000).toLocaleString()}만원`);
const toYearMonth = (months: number) => `${Math.floor(months / 12)}년 ${months % 12}개월`;

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 22,
  border: '1px solid #e7ebf3',
  padding: 16,
  boxShadow: '0 10px 28px rgba(10, 23, 53, 0.05)',
};

const LiveSimulation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const routeState = (state as SimulationRouteState) || {};

  const answers = routeState.answers ?? EMPTY_ANSWERS;
  const categoryId = routeState.categoryId ?? 'real-estate';

  const guide = GUIDE_PROFILES[categoryId] ?? GUIDE_PROFILES['real-estate'];
  const guideImage = GUIDE_IMAGES[guide.key]?.image ?? agentHanImg;

  const currentAge = toNumber(answers.c2, 29);
  const inferred = derivePlanInputsFromAnswers(categoryId, answers);
  const planInputs = routeState.planInputs ?? inferred;

  const simulation = useFinancialSimulation({
    currentAge,
    retirementAge: planInputs.retirementAge,
    targetMonthlyExpense: planInputs.targetMonthlyExpense,
    initialNetWorth: planInputs.initialNetWorth,
    monthlyIncome: planInputs.monthlyIncome,
    monthlyExpense: planInputs.monthlyExpense,
    investmentReturnRate: planInputs.investmentReturnRate,
  });

  const { inputs, setInputs, financialIndependenceAge } = simulation;

  const [checked, setChecked] = useState<Record<ActionItem['key'], boolean>>({ coffee: false, delivery: false, subscription: false });

  const toggleAction = (item: ActionItem) => {
    const nextChecked = !checked[item.key];
    setChecked((prev) => ({ ...prev, [item.key]: nextChecked }));
    setInputs((prev) => ({ ...prev, monthlyExpense: Math.max(0, prev.monthlyExpense + (nextChecked ? -item.amount : item.amount)) }));
  };

  const targetAsset = inputs.targetMonthlyExpense * 12 * 25;
  const monthlySavings = inputs.monthlyIncome - inputs.monthlyExpense;
  const achievementRate = Math.min(100, Math.round((inputs.initialNetWorth / targetAsset) * 100));
  const monthsToGoal = monthlySavings > 0 ? Math.ceil(Math.max(0, targetAsset - inputs.initialNetWorth) / monthlySavings) : null;

  const guideComment = getSimulationGuideComment(categoryId, answers, {
    achievementRate,
    fiAge: financialIndependenceAge,
    currentAge,
    targetAsset,
  });

  const detailedInsights = useMemo(() => getDetailedAnswerInsights(answers, 5), [answers]);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '18px 14px 30px', fontFamily: "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif" }}>
      <main style={{ maxWidth: 420, margin: '0 auto', display: 'grid', gap: 14 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...cardStyle, padding: '12px 14px' }}>
          <div>
            <p style={{ margin: 0, color: '#798196', fontSize: 12, fontWeight: 700 }}>PINPASS</p>
            <h1 style={{ margin: '4px 0 0', color: '#161d2f', fontSize: 18, fontWeight: 900 }}>라이브 시뮬레이션</h1>
          </div>
          <button type="button" onClick={() => navigate('/result', { state: { answers, categoryId, planInputs } })} style={{ border: '1px solid #d9deea', background: '#f8fafe', borderRadius: 999, width: 36, height: 36, cursor: 'pointer' }}>
            <RotateCcw size={16} color="#3a445d" />
          </button>
        </header>

        <section style={{ ...cardStyle, background: '#0f1c3d', color: '#fff', padding: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8edbc7' }}>가능성 진단 결과</div>
          <div style={{ marginTop: 6, fontSize: 44, lineHeight: 1.1, fontWeight: 900 }}>{financialIndependenceAge ?? '-'}세에<br />경제적 자유 가능</div>
          <p style={{ margin: '8px 0 0', color: '#b8c4df', fontSize: 14 }}>현재 달성률 {achievementRate}%로 계산 중입니다.</p>

          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#9fb2d6' }}>목표 자산</div>
              <div style={{ fontSize: 31, fontWeight: 900, color: '#5ce0be' }}>{toAsset(targetAsset)}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ fontSize: 11, color: '#9fb2d6' }}>예상 기간</div>
              <div style={{ fontSize: 31, fontWeight: 900, color: '#d0daf2' }}>{monthsToGoal === null ? '-' : toYearMonth(monthsToGoal)}</div>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <img
              src={guideImage}
              alt={guide.name}
              style={{ width: 76, height: 92, borderRadius: 14, objectFit: 'contain', objectPosition: 'center top', background: '#eef3fb', border: '1px solid #d8e2f2', flexShrink: 0, padding: 2 }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: '#111d3e', fontWeight: 900 }}>{guide.name}</p>
              <p style={{ margin: '2px 0 8px', color: '#6a7590', fontSize: 12 }}>{guide.role}</p>
              <div style={{ border: '1px solid #d5ddeb', background: '#f7fafe', borderRadius: 14, padding: '10px 12px', color: '#34405f', fontSize: 14, lineHeight: 1.45 }}>{guideComment}</div>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[{ label: '달성률', value: `${achievementRate}%`, color: '#1f2e56' }, { label: '월 저축액', value: toMoney(monthlySavings), color: '#15836a' }, { label: '현재 순자산', value: toAsset(inputs.initialNetWorth), color: '#1f2e56' }, { label: '예상 수익률', value: `${inputs.investmentReturnRate}%`, color: '#1f2e56' }].map((item) => (
            <article key={item.label} style={{ ...cardStyle, padding: 14 }}>
              <p style={{ margin: 0, color: '#7a8297', fontSize: 12 }}>{item.label}</p>
              <p style={{ margin: '6px 0 0', color: item.color, fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>{item.value}</p>
            </article>
          ))}
        </section>

        <section style={cardStyle}>
          <p style={{ margin: 0, color: '#1c2333', fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={16} color="#15836a" /> 지출 조정 시뮬레이션
          </p>
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            {ACTION_ITEMS.map((item) => {
              const active = checked[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => toggleAction(item)}
                  style={{ width: '100%', textAlign: 'left', borderRadius: 14, border: active ? '1.5px solid #14224a' : '1px solid #d9deea', background: active ? '#eef2fa' : '#ffffff', padding: '12px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div>
                    <p style={{ margin: 0, color: '#1b2235', fontWeight: 800 }}>{item.label}</p>
                    <p style={{ margin: '4px 0 0', color: '#7a8297', fontSize: 12 }}>{item.desc}</p>
                  </div>
                  {active ? <CircleCheck size={20} color="#14224a" /> : <Circle size={20} color="#a4adbf" />}
                </button>
              );
            })}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={{ margin: 0, color: '#1c2333', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}><Bot size={15} color="#14224a" /> 가이드 답변 반영 요약</p>
          {detailedInsights.length === 0 ? (
            <p style={{ margin: '8px 0 0', color: '#6c7488' }}>표시할 답변이 아직 없습니다.</p>
          ) : (
            <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
              {detailedInsights.map((item) => (
                <article key={item.id} style={{ border: '1px solid #dbe2f0', borderRadius: 12, padding: '10px 12px', background: '#f8fafe' }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#516083' }}>{item.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 900, color: '#112046' }}>{item.value}</p>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#5f6d8b' }}>해석: {item.interpretation}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#5f6d8b' }}>영향: {item.impact}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <button type="button" onClick={() => navigate('/final-analysis', { state: { answers, categoryId, simulationSnapshot: { financialIndependenceAge, targetAsset, achievementRate, monthlySavings } } })} style={{ border: 'none', borderRadius: 999, background: '#101d40', color: '#fff', fontWeight: 900, fontSize: 18, padding: '16px 18px', cursor: 'pointer' }}>
          액션 플랜 확인하기 <ArrowRight size={18} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
        </button>
      </main>
    </div>
  );
};

export default LiveSimulation;
