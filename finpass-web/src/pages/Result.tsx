import { useEffect, useMemo, useState } from 'react';
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
  visionBoardSummary?: VisionBoardSummary;
}

const EMPTY_ANSWERS: Record<string, unknown> = {};

interface VisionBoardSummary {
  headline: string;
  goalCards: Array<{ title: string; targetYear?: number; note: string }>;
}

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
const displayFont = "'Pretendard Variable', 'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif";
const englishFont = "'Playfair Display', 'Bodoni MT', 'Didot', 'Times New Roman', serif";

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
  borderRadius: 18,
  border: '1px solid #dbe2ec',
  padding: 18,
  boxShadow: '0 10px 28px rgba(10, 23, 53, 0.05)',
};

const primaryButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 14,
  background: '#1e2f49',
  color: '#fff',
  fontWeight: 600,
  fontSize: 15,
  padding: '12px 15px',
  cursor: 'pointer',
  boxShadow: '0 6px 14px rgba(30, 42, 58, 0.2)',
  minHeight: 48,
  touchAction: 'manipulation',
  position: 'relative',
  zIndex: 1,
};

const Result = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const routeState = (state as WizardRouteState) || {};

  const categoryId = routeState.categoryId ?? 'real-estate';
  const answers = routeState.answers ?? EMPTY_ANSWERS;
  const visionBoardSummary = routeState.visionBoardSummary;

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
  const [viewportWidth, setViewportWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const isMobile = viewportWidth <= 768;

  const targetAsset = targetMonthlyExpense * 12 * 25;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f4f6f9 0%, #eef2f7 100%)', padding: isMobile ? '20px 14px calc(124px + env(safe-area-inset-bottom))' : '20px 14px 36px', fontFamily: "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif" }}>
      <main style={{ maxWidth: 420, margin: '0 auto', display: 'grid', gap: 14 }}>
        {visionBoardSummary && (
          <section style={{ ...sectionStyle, background: '#0f1c3d', color: '#fff' }}>
            <p style={{ margin: 0, color: '#8dd9c5', fontWeight: 600, fontSize: 12, letterSpacing: '0.08em', fontFamily: englishFont }}>VISION BOARD</p>
            <p style={{ margin: '6px 0 0', fontSize: 21, lineHeight: 1.3, fontWeight: 700 }}>{visionBoardSummary.headline}</p>
            <p style={{ margin: '8px 0 0', color: '#d2dbee', fontSize: 13 }}>비전을 현실 수치와 연결해 실행 경로를 계산하는 단계입니다.</p>
            <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
              {visionBoardSummary.goalCards.slice(0, 2).map((item) => (
                <div key={item.title} style={{ borderRadius: 12, background: 'rgba(255,255,255,0.08)', padding: '8px 10px', fontSize: 13 }}>
                  <strong>{item.title}</strong>
                  <span style={{ color: '#cfdbf5' }}>{item.targetYear ? ` · ${item.targetYear}년` : ''}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section style={{ textAlign: 'center', padding: '8px 8px 4px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, background: '#f3f6fb', color: '#1c2a4d', fontSize: 12, fontWeight: 700, padding: '6px 10px' }}>
            <Flag size={13} /> 목표 설정
          </span>
          <h1 style={{ fontSize: 34, margin: '12px 0 8px', lineHeight: 1.2, letterSpacing: '-0.02em', color: '#121c3a', fontWeight: 700, fontFamily: displayFont }}>
            은퇴 후 한 달,
            <br />
            얼마를 사용하고 싶으신가요?
          </h1>
          <p style={{ color: '#66718a', fontSize: 15, margin: 0 }}>{guide.name}이(가) 선택하신 답변을 기준으로 계산하고 있습니다.</p>
          <p style={{ color: '#4e5a78', fontSize: 14, margin: '8px auto 0', maxWidth: 360, lineHeight: 1.4 }}>{guideComment}</p>
        </section>

        <section style={sectionStyle}>
          <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: '#172548', fontWeight: 700 }}>
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
                    border: active ? '2px solid #0f1626' : '1px solid #d4dbe7',
                    background: active ? '#1e2f49' : '#ffffff',
                    color: active ? '#fff' : '#1e2b4f',
                    fontWeight: 600,
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

          <p style={{ margin: '18px 0 0', display: 'flex', alignItems: 'center', gap: 8, color: '#172548', fontWeight: 700 }}>
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
                    borderRadius: 14,
                    border: active ? '2px solid #0f1626' : '1px solid #d4dbe7',
                    background: active ? '#1e2f49' : '#ffffff',
                    padding: '15px 13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: 24, fontWeight: 600, color: active ? '#ffffff' : '#101b3a' }}>{Math.round(amount / 10000).toLocaleString()}만원</div>
                  <div style={{ fontSize: 13, color: active ? '#cfd7ee' : '#727d97', marginTop: 3 }}>월 예상 지출</div>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 14, borderRadius: 14, background: '#1e2f49', color: '#fff', padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, opacity: 0.9 }}>필요 목표 자산</div>
            <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1, color: '#5ce0be' }}>{formatAsset(targetAsset)}</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>월 {Math.round(targetMonthlyExpense / 10000).toLocaleString()}만원 × 12개월 × 25년</div>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, color: '#172548', fontWeight: 700, fontSize: 18 }}>
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
                        border: active ? '2px solid #0f1626' : '1px solid #d4dbe7',
                        background: active ? '#1e2f49' : '#ffffff',
                        color: active ? '#fff' : '#1e2b4f',
                        fontWeight: 600,
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
          <p style={{ margin: 0, color: '#172548', fontWeight: 700 }}>가이드와 대화에서 선택한 내용</p>
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

        <button type="button" onClick={moveNext} style={{ ...primaryButtonStyle, position: isMobile ? 'sticky' : 'static', bottom: isMobile ? 'calc(10px + env(safe-area-inset-bottom))' : undefined, zIndex: 3 }}>
          가능성 탐색 시작 <ChevronRight size={18} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
        </button>
      </main>
    </div>
  );
};

export default Result;

