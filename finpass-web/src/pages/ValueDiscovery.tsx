import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, ArrowLeft, Search } from 'lucide-react';

interface ValueRouteState {
  answers?: Record<string, unknown>;
  categoryId?: string;
}

interface ValueProfile {
  coreGoals: string[];
  coreValues: string[];
  motivationStyle: 'steady' | 'challenge' | 'balance';
}

const GOAL_OPTIONS = ['내 집 마련', '경제적 자유', '자산 증식', '안정 자산 구축', '커리어 성장', '여행/경험'];
const VALUE_OPTIONS = ['안정', '성장', '자유', '건강', '가족', '균형', '몰입'];
const displayFont = "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif";
const selectedOptionColor = '#1e2a3a';
const selectedOptionShadow = '0 8px 25px rgba(30, 42, 58, 0.25)';

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 18,
  border: '1px solid #e2e8f4',
  padding: 16,
  boxShadow: '0 8px 24px rgba(37, 64, 110, 0.06)',
};

const primaryButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 14,
  background: '#4c8fe9',
  color: '#fff',
  fontWeight: 700,
  fontSize: 16,
  padding: '14px 16px',
  cursor: 'pointer',
  boxShadow: '0 10px 20px rgba(76, 143, 233, 0.28)',
};

const chipStyle = (active: boolean): React.CSSProperties => ({
  border: active ? `1px solid ${selectedOptionColor}` : '1px solid #dde5f2',
  background: active ? selectedOptionColor : '#fff',
  color: active ? '#ffffff' : '#2a3a58',
  borderRadius: 12,
  padding: '10px 12px',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  boxShadow: active ? selectedOptionShadow : 'none',
  transition: 'all 0.2s ease',
});

const toArr = (value: unknown) => {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (value === null || value === undefined || value === '') return [];
  return [String(value)];
};

const deriveDefaultsFromAnswers = (answers: Record<string, unknown>, categoryId: string): ValueProfile => {
  const goals = new Set<string>();
  const values = new Set<string>();

  const c3 = String(answers.c3 ?? '');
  if (c3) values.add(c3);

  const l1 = String(answers.l1 ?? '');
  const l4 = String(answers.l4 ?? '');
  if (l1) goals.add(l1);
  if (l4) values.add(l4);

  toArr(answers.r2).forEach(() => goals.add('내 집 마련'));
  const r1 = String(answers.r1 ?? '');
  if (r1 === '매매' || r1 === '전세') goals.add('내 집 마련');

  const i1 = String(answers.i1 ?? '');
  if (i1) goals.add('안정 자산 구축');

  const s5 = String(answers.s5 ?? '');
  if (s5) goals.add('자산 증식');

  if (categoryId === 'life-balance' && !goals.size) goals.add('경제적 자유');
  if (categoryId === 'real-estate' && !goals.size) goals.add('내 집 마련');
  if (categoryId === 'insurance' && !goals.size) goals.add('안정 자산 구축');
  if (categoryId === 'stock' && !goals.size) goals.add('자산 증식');

  if (!values.size) values.add('균형');

  const motivationStyle: ValueProfile['motivationStyle'] = c3 === '성장' ? 'challenge' : c3 === '안정' ? 'steady' : 'balance';

  return {
    coreGoals: Array.from(goals).slice(0, 2),
    coreValues: Array.from(values).slice(0, 2),
    motivationStyle,
  };
};

const ValueDiscovery = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const routeState = (state as ValueRouteState) || {};
  const answers = routeState.answers ?? {};
  const categoryId = routeState.categoryId ?? 'real-estate';
  const name = String(answers.c1 ?? '고객');

  const defaults = useMemo(() => deriveDefaultsFromAnswers(answers, categoryId), [answers, categoryId]);

  const [coreGoals, setCoreGoals] = useState<string[]>(defaults.coreGoals);
  const [coreValues, setCoreValues] = useState<string[]>(defaults.coreValues);
  const [motivationStyle, setMotivationStyle] = useState<ValueProfile['motivationStyle']>(defaults.motivationStyle);

  const canProceed = coreGoals.length > 0 && coreValues.length > 0;

  const summary = useMemo(() => {
    const goalText = coreGoals.slice(0, 2).join(' · ') || '핵심 목표';
    const valueText = coreValues.slice(0, 2).join(' · ') || '핵심 가치';
    return `${goalText} 중심으로 ${valueText}를 지키는 전략으로 이어가겠습니다.`;
  }, [coreGoals, coreValues]);

  const toggleItem = (current: string[], value: string, max = 2) => {
    if (current.includes(value)) return current.filter((item) => item !== value);
    if (current.length >= max) return [...current.slice(1), value];
    return [...current, value];
  };

  const moveNext = () => {
    if (!canProceed) return;
    const valueProfile: ValueProfile = { coreGoals, coreValues, motivationStyle };
    navigate('/vision-board', { state: { answers, categoryId, valueProfile } });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fa', fontFamily: "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif" }}>
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '16px 14px 30px', display: 'grid', gap: 12 }}>
        <header style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6e7f9f' }}>
          <button type="button" onClick={() => navigate(-1)} aria-label="뒤로 가기" style={{ border: '1px solid #e0e7f3', borderRadius: 999, background: '#fff', color: '#617494', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 700, width: 36, height: 36, justifyContent: 'center' }}>
            <ArrowLeft size={18} />
          </button>
          <p style={{ margin: 0, color: '#1d3357', fontWeight: 700, display: 'inline-flex', gap: 8, alignItems: 'center', fontSize: 16 }}><Search size={18} /> 발견</p>
          <p style={{ margin: 0, color: '#8da0c0', fontSize: 13, fontWeight: 600 }}>1 / 6</p>
        </header>

        <section style={{ ...cardStyle, background: '#fff', padding: '22px 18px' }}>
          <p style={{ margin: 0, color: '#8ea1c2', fontWeight: 700, letterSpacing: '0.12em', fontSize: 11 }}>STEP 01</p>
          <h1 style={{ margin: '6px 0 0', color: '#0f1a36', fontSize: 30, lineHeight: 1.2, fontWeight: 800, fontFamily: displayFont }}>{name} 님의 가치 지도</h1>
          <p style={{ margin: '8px 0 0', color: '#607292', fontSize: 15 }}>{summary}</p>
          <div style={{ marginTop: 14, borderTop: '1px solid #e7edf8', paddingTop: 12, display: 'grid', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: '#7e91b3', fontSize: 12, fontWeight: 700 }}>선택된 목표</span>
              {coreGoals.length === 0 ? (
                <span style={{ color: '#9aabc8', fontSize: 12 }}>아직 선택되지 않음</span>
              ) : (
                coreGoals.map((goal) => (
                  <span key={goal} style={{ borderRadius: 999, border: '1px solid #d7e5ff', background: '#f3f8ff', color: '#305ea3', padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>
                    {goal}
                  </span>
                ))
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ color: '#7e91b3', fontSize: 12, fontWeight: 700 }}>선택된 가치</span>
              {coreValues.length === 0 ? (
                <span style={{ color: '#9aabc8', fontSize: 12 }}>아직 선택되지 않음</span>
              ) : (
                coreValues.map((value) => (
                  <span key={value} style={{ borderRadius: 999, border: '1px solid #d7e5ff', background: '#f3f8ff', color: '#305ea3', padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>
                    {value}
                  </span>
                ))
              )}
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <article style={cardStyle}>
            <p style={{ margin: 0, color: '#14224a', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 6, fontSize: 16 }}>
              <Sparkles size={16} color="#2f67d8" /> 핵심 목표(최대 2개)
            </p>
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {GOAL_OPTIONS.map((item) => (
                <button key={item} type="button" onClick={() => setCoreGoals((prev) => toggleItem(prev, item))} style={chipStyle(coreGoals.includes(item))}>
                  {item}
                </button>
              ))}
            </div>
          </article>

          <article style={cardStyle}>
            <p style={{ margin: 0, color: '#14224a', fontWeight: 900, fontSize: 16 }}>지키고 싶은 가치(최대 2개)</p>
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {VALUE_OPTIONS.map((item) => (
                <button key={item} type="button" onClick={() => setCoreValues((prev) => toggleItem(prev, item))} style={chipStyle(coreValues.includes(item))}>
                  {item}
                </button>
              ))}
            </div>
          </article>
        </section>

        <section style={cardStyle}>
          <p style={{ margin: 0, color: '#14224a', fontWeight: 900, fontSize: 16 }}>동기 스타일</p>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[
              { key: 'steady', label: '꾸준형' },
              { key: 'balance', label: '균형형' },
              { key: 'challenge', label: '도전형' },
            ].map((item) => {
              const active = motivationStyle === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setMotivationStyle(item.key as ValueProfile['motivationStyle'])}
                  style={{
                    borderRadius: 12,
                    border: active ? `1px solid ${selectedOptionColor}` : '1px solid #dde5f2',
                    background: active ? selectedOptionColor : '#fff',
                    color: active ? '#ffffff' : '#21315a',
                    fontWeight: 700,
                    padding: '12px 0',
                    cursor: 'pointer',
                    boxShadow: active ? selectedOptionShadow : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p style={{ margin: '10px 0 0', color: '#5d7397', fontSize: 13 }}>
            {motivationStyle === 'steady' && '꾸준형: 안정적인 루틴으로 목표 달성 속도를 유지해.'}
            {motivationStyle === 'balance' && '균형형: 성과와 삶의 균형을 함께 챙기는 방식이야.'}
            {motivationStyle === 'challenge' && '도전형: 목표 시점을 앞당기는 공격적인 실행 방식이야.'}
          </p>
        </section>

        <button type="button" onClick={moveNext} disabled={!canProceed} style={{ ...primaryButtonStyle, background: canProceed ? '#4c8fe9' : '#b8c7df', cursor: canProceed ? 'pointer' : 'not-allowed' }}>
          비전보드 만들기 <ChevronRight size={18} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
        </button>
      </main>
    </div>
  );
};

export default ValueDiscovery;
