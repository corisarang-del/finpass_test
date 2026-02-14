import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, RotateCcw, Bot, TrendingUp, Coffee, UtensilsCrossed, CreditCard } from 'lucide-react';
import { useFinancialSimulation } from '../hooks/useFinancialSimulation';
import type { PlanInputs } from './Result';
import agentHanImg from '../assets/images/agent_han.png';
import agentSongImg from '../assets/images/agent_song.png';
import agentChoiImg from '../assets/images/agent_choi.png';
import agentYouImg from '../assets/images/agent_you.png';
import { derivePlanInputsFromAnswers, getDetailedAnswerInsights, getSimulationGuideComment, GUIDE_PROFILES } from '../lib/plannerProfile';

interface SimulationRouteState {
  answers?: Record<string, unknown>;
  categoryId?: string;
  planInputs?: PlanInputs;
}

interface SliderActionItem {
  key: 'coffee' | 'delivery' | 'subscription';
  label: string;
  icon: 'coffee' | 'delivery' | 'subscription';
  max: number;
  step: number;
}

const EMPTY_ANSWERS: Record<string, unknown> = {};

const ACTION_ITEMS: SliderActionItem[] = [
  { key: 'coffee', label: '커피 값 아끼기', icon: 'coffee', max: 100000, step: 10000 },
  { key: 'delivery', label: '배달비 아끼기', icon: 'delivery', max: 200000, step: 10000 },
  { key: 'subscription', label: '구독비 줄이기', icon: 'subscription', max: 50000, step: 5000 },
];
const displayFont = "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif";
const selectedOptionColor = '#1e2a3a';
const selectedOptionShadow = '0 8px 25px rgba(30, 42, 58, 0.25)';

const GUIDE_IMAGES: Record<string, string> = {
  han: agentHanImg,
  song: agentSongImg,
  choi: agentChoiImg,
  you: agentYouImg,
};

const toNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const toMoney = (value: number) => `${Math.round(value).toLocaleString()}원`;
const toAsset = (value: number) => (value >= 100000000 ? `${(value / 100000000).toFixed(1)}억원` : `${Math.round(value / 10000).toLocaleString()}만원`);
const toYearMonth = (months: number) => `${Math.floor(months / 12)}년 ${months % 12}개월`;
const toManwon = (value: number) => `+${Math.round(value / 10000).toLocaleString()}만원`;

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 18,
  border: '1px solid #e2e8f4',
  padding: 16,
  boxShadow: '0 8px 24px rgba(37, 64, 110, 0.06)',
};

const primaryButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 14,
  background: selectedOptionColor,
  color: '#fff',
  fontWeight: 700,
  fontSize: 16,
  padding: '14px 16px',
  cursor: 'pointer',
  boxShadow: selectedOptionShadow,
};

const IconByType = ({ type }: { type: SliderActionItem['icon'] }) => {
  if (type === 'coffee') return <Coffee size={20} color="#d87907" />;
  if (type === 'delivery') return <UtensilsCrossed size={20} color="#d72655" />;
  return <CreditCard size={20} color="#2a65d9" />;
};

const getAdjustmentTip = (adjustments: Record<SliderActionItem['key'], number>) => {
  const total = adjustments.coffee + adjustments.delivery + adjustments.subscription;
  if (total >= 250000) return '아주 좋습니다. 지금 조정 폭이면 목표 시점 단축 가능성이 확실히 높아졌습니다.';
  if (adjustments.delivery >= 100000) return '배달비 조정 효과가 크게 반영되고 있습니다. 유지하시면 체감이 빨리 올라옵니다.';
  if (adjustments.coffee >= 50000) return '커피 지출 조정이 안정적으로 누적되고 있습니다. 실천 지속성이 강점입니다.';
  if (adjustments.subscription >= 30000) return '구독비 정리가 월 고정비를 깔끔하게 줄여주고 있습니다.';
  return '지금 페이스도 충분히 좋습니다. 무리 없이 유지 가능한 항목부터 이어가시면 됩니다.';
};

const LiveSimulation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const routeState = (state as SimulationRouteState) || {};

  const answers = routeState.answers ?? EMPTY_ANSWERS;
  const categoryId = routeState.categoryId ?? 'real-estate';
  const guide = GUIDE_PROFILES[categoryId] ?? GUIDE_PROFILES['real-estate'];
  const guideImage = GUIDE_IMAGES[guide.key] ?? agentHanImg;

  const currentAge = toNumber(answers.c2, 29);
  const inferred = derivePlanInputsFromAnswers(categoryId, answers);
  const planInputs = routeState.planInputs ?? inferred;

  const baseMonthlyExpense = planInputs.monthlyExpense;

  const [adjustments, setAdjustments] = useState<Record<SliderActionItem['key'], number>>({
    coffee: 0,
    delivery: 0,
    subscription: 0,
  });

  const totalAdjustment = adjustments.coffee + adjustments.delivery + adjustments.subscription;

  const simulation = useFinancialSimulation({
    currentAge,
    retirementAge: planInputs.retirementAge,
    targetMonthlyExpense: planInputs.targetMonthlyExpense,
    initialNetWorth: planInputs.initialNetWorth,
    monthlyIncome: planInputs.monthlyIncome,
    monthlyExpense: Math.max(0, baseMonthlyExpense - totalAdjustment),
    investmentReturnRate: planInputs.investmentReturnRate,
  });

  const { inputs, setInputs, financialIndependenceAge } = simulation;

  useEffect(() => {
    const adjustedExpense = Math.max(0, baseMonthlyExpense - totalAdjustment);
    setInputs((prev) => {
      if (prev.monthlyExpense === adjustedExpense) return prev;
      return { ...prev, monthlyExpense: adjustedExpense };
    });
  }, [baseMonthlyExpense, totalAdjustment, setInputs]);

  const targetAsset = inputs.targetMonthlyExpense * 12 * 25;
  const monthlySavings = inputs.monthlyIncome - inputs.monthlyExpense;
  const achievementRate = Math.min(100, Math.max(0, Math.round((inputs.initialNetWorth / targetAsset) * 100)));
  const monthsToGoal = monthlySavings > 0 ? Math.ceil(Math.max(0, targetAsset - inputs.initialNetWorth) / monthlySavings) : null;

  const savingsScore = Math.min(99.9, Math.max(10, Number((((monthlySavings / Math.max(inputs.monthlyIncome, 1)) * 100) + 35).toFixed(1))));
  const peerPercentile = Math.min(95, Math.max(5, Math.round(100 - savingsScore)));
  const projected5yAsset = Math.round(inputs.initialNetWorth + monthlySavings * 12 * 5);

  const guideComment = getSimulationGuideComment(categoryId, answers, {
    achievementRate,
    fiAge: financialIndependenceAge,
    currentAge,
    targetAsset,
  });
  const adjustmentTip = getAdjustmentTip(adjustments);
  const detailedInsights = useMemo(() => getDetailedAnswerInsights(answers, 4), [answers]);

  const setAdjustmentValue = (key: SliderActionItem['key'], value: number) => {
    setAdjustments((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fa', padding: '16px 14px 30px', fontFamily: "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif" }}>
      <main style={{ maxWidth: 420, margin: '0 auto', display: 'grid', gap: 14 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...cardStyle, padding: '12px 14px' }}>
          <div>
            <p style={{ margin: 0, color: '#8ea2c4', fontSize: 11, fontWeight: 700 }}>FINPASS</p>
            <h1 style={{ margin: '4px 0 0', color: '#1a2f53', fontSize: 17, fontWeight: 700 }}>가능성 탐색 & What If</h1>
          </div>
          <button type="button" onClick={() => navigate('/result', { state: { answers, categoryId, planInputs } })} style={{ border: '1px solid #d1d8e5', background: '#fff', borderRadius: 14, width: 40, height: 40, cursor: 'pointer' }}>
            <RotateCcw size={16} color="#3a445d" />
          </button>
        </header>

        <section style={{ ...cardStyle, padding: 20 }}>
          <h2 style={{ margin: 0, color: '#101c3f', fontWeight: 800, fontSize: 36, lineHeight: 1.2, fontFamily: displayFont }}>이미 잘하고 계십니다.</h2>
          <p style={{ margin: '10px 0 0', color: '#5b6786', fontSize: 18, lineHeight: 1.5 }}>
            현재 저축 성향은 <strong style={{ color: '#2f67d8' }}>{savingsScore}%</strong>로,
            <br />
            상위 {peerPercentile}%의 탄탄한 저축력으로 분석됩니다.
            <br />
            현재 페이스를 유지하시면 5년 뒤 순자산은 <strong style={{ color: '#2f67d8' }}>{toAsset(projected5yAsset)}</strong> 이상 도달 가능성이 높습니다.
          </p>
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
              <div style={{ border: '1px solid #d5ddeb', background: '#f7fafe', borderRadius: 14, padding: '10px 12px', color: '#34405f', fontSize: 14, lineHeight: 1.45 }}>
                {guideComment}
              </div>
              <p style={{ margin: '8px 0 0', color: '#4f6087', fontSize: 13 }}>{adjustmentTip}</p>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={{ margin: 0, color: '#1c2333', fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
            <TrendingUp size={16} color="#2f67d8" /> What If 조정
          </p>
          <div style={{ marginTop: 10, display: 'grid', gap: 14 }}>
            {ACTION_ITEMS.map((item) => (
              <article key={item.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, color: '#1b2235', fontWeight: 800, display: 'flex', gap: 8, alignItems: 'center', fontSize: 17 }}>
                    <IconByType type={item.icon} />
                    {item.label}
                  </p>
                  <p style={{ margin: 0, color: '#2f67d8', fontWeight: 900, fontSize: 20 }}>{toManwon(adjustments[item.key])}</p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={item.max}
                  step={item.step}
                  value={adjustments[item.key]}
                  onChange={(e) => setAdjustmentValue(item.key, toNumber(e.target.value, 0))}
                  style={{ width: '100%', marginTop: 8 }}
                />
              </article>
            ))}
          </div>
          <p style={{ margin: '10px 0 0', color: '#5f6d8b', fontSize: 13 }}>
            총 조정액 {toMoney(totalAdjustment)} 반영 중입니다.
          </p>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: '달성률', value: `${achievementRate}%`, color: '#1f2e56' },
            { label: '월 저축액', value: toMoney(monthlySavings), color: '#15836a' },
            { label: '목표 자산', value: toAsset(targetAsset), color: '#1f2e56' },
            { label: '예상 기간', value: monthsToGoal === null ? '-' : toYearMonth(monthsToGoal), color: '#1f2e56' },
          ].map((item) => (
            <article key={item.label} style={{ ...cardStyle, padding: 14 }}>
              <p style={{ margin: 0, color: '#7a8297', fontSize: 12 }}>{item.label}</p>
              <p style={{ margin: '6px 0 0', color: item.color, fontSize: 27, fontWeight: 900, lineHeight: 1.1 }}>{item.value}</p>
            </article>
          ))}
        </section>

        <section style={cardStyle}>
          <p style={{ margin: 0, color: '#1c2333', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Bot size={15} color="#14224a" /> 반영 요약
          </p>
          {detailedInsights.length === 0 ? (
            <p style={{ margin: '8px 0 0', color: '#6c7488' }}>표시할 답변이 아직 없습니다.</p>
          ) : (
            <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
              {detailedInsights.map((item) => (
                <article key={item.id} style={{ border: '1px solid #dbe2f0', borderRadius: 12, padding: '10px 12px', background: '#f8fafe' }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#516083' }}>{item.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 900, color: '#112046' }}>{item.value}</p>
                  <p style={{ margin: '6px 0 0', fontSize: 12, color: '#5f6d8b' }}>해석: {item.interpretation}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <button
          type="button"
          onClick={() =>
            navigate('/final-analysis', {
              state: {
                answers,
                categoryId,
                simulationSnapshot: { financialIndependenceAge, targetAsset, achievementRate, monthlySavings },
              },
            })
          }
          style={primaryButtonStyle}
        >
          5개년 로드맵 보기 <ArrowRight size={18} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
        </button>
      </main>
    </div>
  );
};

export default LiveSimulation;
