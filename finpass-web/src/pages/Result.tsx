import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Flag, Wallet, Gauge, Sparkles } from 'lucide-react';
import {
  derivePlanInputsFromAnswers,
  getResultGuideComment,
  GUIDE_PROFILES,
  type PlanInputs as PlannerPlanInputs,
} from '../lib/plannerProfile';

interface WizardRouteState {
  answers?: Record<string, unknown>;
  categoryId?: string;
  planInputs?: PlanInputs;
}

const EMPTY_ANSWERS: Record<string, unknown> = {};

export interface PlanInputs {
  retirementAge: number;
  targetMonthlyExpense: number;
  initialNetWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
  investmentReturnRate: number;
}

const RETIREMENT_AGE_OPTIONS = [40, 45, 50, 55, 60];
const TARGET_EXPENSE_OPTIONS = [2000000, 3000000, 5000000, 8000000];
const RETURN_RATE_OPTIONS = [5, 7, 10];

const toNumber = (value: unknown, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

const formatAsset = (value: number) =>
  value >= 100000000 ? `${(value / 100000000).toFixed(1)}억원` : `${Math.round(value / 10000).toLocaleString()}만원`;

const inputStyle: React.CSSProperties = {
  marginTop: 8,
  width: '100%',
  boxSizing: 'border-box',
  border: '1px solid #d3dae7',
  borderRadius: 16,
  padding: '12px 14px',
  fontWeight: 700,
  fontSize: 16,
  color: '#111b3a',
  outline: 'none',
  background: '#fff',
};

const sectionStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 24,
  border: '1px solid #e7ebf3',
  padding: 20,
  boxShadow: '0 10px 28px rgba(10, 23, 53, 0.05)',
};

const Result = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const routeState = (state as WizardRouteState) || {};

  const categoryId = routeState.categoryId ?? 'real-estate';
  const answers = routeState.answers ?? EMPTY_ANSWERS;

  const inferred = derivePlanInputsFromAnswers(categoryId, answers);
  const defaults: PlannerPlanInputs = routeState.planInputs ?? inferred;

  const guide = GUIDE_PROFILES[categoryId] ?? GUIDE_PROFILES['real-estate'];
  const guideComment = getResultGuideComment(categoryId, answers);

  const [retirementAge, setRetirementAge] = useState(defaults.retirementAge);
  const [targetMonthlyExpense, setTargetMonthlyExpense] = useState(defaults.targetMonthlyExpense);
  const [initialNetWorth, setInitialNetWorth] = useState(defaults.initialNetWorth);
  const [monthlyIncome, setMonthlyIncome] = useState(defaults.monthlyIncome);
  const [monthlyExpense, setMonthlyExpense] = useState(defaults.monthlyExpense);
  const [investmentReturnRate, setInvestmentReturnRate] = useState(defaults.investmentReturnRate);

  const targetAsset = targetMonthlyExpense * 12 * 25;

  const answerHighlights = useMemo(
    () =>
      Object.entries(answers)
        .filter(([key, value]) => key !== 'c0' && value !== '' && value !== null && value !== undefined)
        .slice(0, 3)
        .map(([key, value]) => ({ key, value: Array.isArray(value) ? value.join(', ') : String(value) })),
    [answers],
  );

  const moveNext = () => {
    const planInputs: PlanInputs = {
      retirementAge,
      targetMonthlyExpense,
      initialNetWorth,
      monthlyIncome,
      monthlyExpense,
      investmentReturnRate,
    };

    navigate('/simulation', { state: { answers, categoryId, planInputs } });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '20px 14px 32px', fontFamily: "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif" }}>
      <main style={{ maxWidth: 420, margin: '0 auto', display: 'grid', gap: 14 }}>
        <section style={{ textAlign: 'center', padding: '8px 8px 4px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, background: '#f3f6fb', color: '#1c2a4d', fontSize: 12, fontWeight: 700, padding: '6px 10px' }}>
            <Flag size={13} /> 목표 설정
          </span>
          <h1 style={{ fontSize: 46, margin: '14px 0 10px', lineHeight: 1.15, letterSpacing: '-0.02em', color: '#121c3a' }}>
            은퇴 후 한 달,
            <br />
            얼마를 쓰고 싶어?
          </h1>
          <p style={{ color: '#66718a', fontSize: 17, margin: 0 }}>{guide.name}이(가) 선택하신 답변을 기준으로 계산하고 있습니다.</p>
          <p style={{ color: '#4e5a78', fontSize: 14, margin: '8px auto 0', maxWidth: 360, lineHeight: 1.4 }}>{guideComment}</p>
        </section>

        <section style={sectionStyle}>
          <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: '#172548', fontWeight: 800 }}>
            <Sparkles size={16} color="#178f74" /> 목표 은퇴 나이
          </p>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
            {RETIREMENT_AGE_OPTIONS.map((age) => {
              const active = retirementAge === age;
              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => setRetirementAge(age)}
                  style={{
                    borderRadius: 14,
                    border: active ? '1.5px solid #121f46' : '1px solid #d5ddea',
                    background: active ? '#121f46' : '#ffffff',
                    color: active ? '#fff' : '#1e2b4f',
                    fontWeight: 800,
                    fontSize: 16,
                    padding: '11px 0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {age}세
                </button>
              );
            })}
          </div>

          <p style={{ margin: '18px 0 0', display: 'flex', alignItems: 'center', gap: 8, color: '#172548', fontWeight: 800 }}>
            <Wallet size={16} color="#178f74" /> 희망 월 생활비
          </p>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {TARGET_EXPENSE_OPTIONS.map((amount) => {
              const active = targetMonthlyExpense === amount;
              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setTargetMonthlyExpense(amount)}
                  style={{
                    textAlign: 'left',
                    borderRadius: 18,
                    border: active ? '1.5px solid #121f46' : '1px solid #d5ddea',
                    background: active ? '#121f46' : '#ffffff',
                    padding: '15px 13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 900, color: active ? '#ffffff' : '#101b3a' }}>{Math.round(amount / 10000).toLocaleString()}만원</div>
                  <div style={{ fontSize: 13, color: active ? '#cfd7ee' : '#727d97', marginTop: 3 }}>월 예상 지출</div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 14, borderRadius: 16, background: '#101d40', color: '#fff', padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, opacity: 0.9 }}>필요 목표 자산</div>
            <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, color: '#5ce0be' }}>{formatAsset(targetAsset)}</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>월 {Math.round(targetMonthlyExpense / 10000).toLocaleString()}만원 × 12개월 × 25년</div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: '#172548', fontWeight: 900, fontSize: 20 }}>
            <Gauge size={18} color="#178f74" /> 현재 재무 상태
          </h2>
          <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
            <label style={{ fontWeight: 700, color: '#33405f' }}>현재 총 순자산<input type="number" value={initialNetWorth} onChange={(e) => setInitialNetWorth(toNumber(e.target.value, 0))} style={inputStyle} /></label>
            <label style={{ fontWeight: 700, color: '#33405f' }}>월 소득(세후)<input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(toNumber(e.target.value, 0))} style={inputStyle} /></label>
            <label style={{ fontWeight: 700, color: '#33405f' }}>월 평균 지출<input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(toNumber(e.target.value, 0))} style={inputStyle} /></label>

            <div>
              <p style={{ margin: '0 0 8px', color: '#33405f', fontWeight: 700 }}>예상 연 수익률</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                {RETURN_RATE_OPTIONS.map((rate) => {
                  const active = investmentReturnRate === rate;
                  return (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setInvestmentReturnRate(rate)}
                      style={{
                        borderRadius: 14,
                        border: active ? '1.5px solid #121f46' : '1px solid #d5ddea',
                        background: active ? '#121f46' : '#ffffff',
                        color: active ? '#fff' : '#1e2b4f',
                        fontWeight: 800,
                        fontSize: 15,
                        padding: '10px 0',
                        cursor: 'pointer',
                      }}
                    >
                      {rate}%
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section style={{ ...sectionStyle, padding: 16 }}>
          <p style={{ margin: 0, color: '#172548', fontWeight: 800 }}>가이드와 대화에서 선택한 내용</p>
          {answerHighlights.length === 0 ? (
            <p style={{ margin: '8px 0 0', color: '#6c7488' }}>아직 표시할 답변이 없습니다.</p>
          ) : (
            <ul style={{ margin: '8px 0 0', color: '#6c7488', paddingLeft: 18 }}>
              {answerHighlights.map((item) => (
                <li key={item.key} style={{ marginTop: 4 }}>{item.value}</li>
              ))}
            </ul>
          )}
        </section>

        <button type="button" onClick={moveNext} style={{ border: 'none', borderRadius: 999, background: '#101d40', color: '#fff', fontWeight: 900, fontSize: 18, padding: '16px 18px', cursor: 'pointer' }}>
          다음 단계 <ChevronRight size={18} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
        </button>
      </main>
    </div>
  );
};

export default Result;
