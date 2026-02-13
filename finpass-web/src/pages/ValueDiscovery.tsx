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
const displayFont = "'Cormorant Garamond', 'Noto Serif KR', 'Times New Roman', serif";

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 22,
  border: '1px solid #dbe2ec',
  padding: 16,
  boxShadow: '0 10px 24px rgba(10, 23, 53, 0.05)',
};

const primaryButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 22,
  background: '#1e2f49',
  color: '#fff',
  fontWeight: 900,
  fontSize: 17,
  padding: '18px 16px',
  cursor: 'pointer',
  boxShadow: '0 8px 18px rgba(20, 33, 58, 0.22)',
};

const chipStyle = (active: boolean): React.CSSProperties => ({
  border: active ? '2px solid #0f1626' : '1px solid #d7deea',
  background: active ? '#1e2f49' : '#fff',
  color: active ? '#ffffff' : '#223153',
  borderRadius: 16,
  padding: '11px 13px',
  fontWeight: 700,
  fontSize: 14,
  cursor: 'pointer',
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f4f6f9 0%, #edf2f8 100%)', fontFamily: "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif" }}>
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '0 14px 30px', display: 'grid', gap: 14 }}>
        <header style={{ height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#6e7f9f' }}>
          <button type="button" onClick={() => navigate(-1)} style={{ border: 'none', background: 'transparent', color: '#617494', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 700 }}>
            <ArrowLeft size={18} /> Home
          </button>
          <p style={{ margin: 0, color: '#1a2440', fontWeight: 800, display: 'inline-flex', gap: 8, alignItems: 'center', fontSize: 18 }}><Search size={18} /> 발견</p>
          <p style={{ margin: 0, color: '#7d8daa', fontSize: 14, fontWeight: 700 }}>0%</p>
        </header>

        <section style={{ ...cardStyle, background: '#fff', padding: '26px 20px' }}>
          <p style={{ margin: 0, color: '#8ea1c2', fontWeight: 800, letterSpacing: '0.12em', fontSize: 12 }}>STEP 01</p>
          <h1 style={{ margin: '8px 0 0', color: '#0f1a36', fontSize: 42, lineHeight: 1.1, fontWeight: 900, fontFamily: displayFont }}>발견</h1>
          <p style={{ margin: '6px 0 0', color: '#607292', fontSize: 16 }}>나에 대한 이야기</p>
          <div style={{ marginTop: 16, borderTop: '1px solid #e7edf8', paddingTop: 12 }}>
            <p style={{ margin: 0, color: '#162440', fontSize: 32, fontWeight: 800, fontFamily: displayFont }}>{name} 님의 가치 발견</p>
            <p style={{ margin: '6px 0 0', color: '#6a7a99', fontSize: 15 }}>{summary}</p>
          </div>
        </section>

        <section style={cardStyle}>
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
        </section>

        <section style={cardStyle}>
          <p style={{ margin: 0, color: '#14224a', fontWeight: 900, fontSize: 16 }}>지키고 싶은 가치(최대 2개)</p>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {VALUE_OPTIONS.map((item) => (
              <button key={item} type="button" onClick={() => setCoreValues((prev) => toggleItem(prev, item))} style={chipStyle(coreValues.includes(item))}>
                {item}
              </button>
            ))}
          </div>
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
                    borderRadius: 16,
                    border: active ? '2px solid #0f1626' : '1px solid #d7deea',
                    background: active ? '#1e2f49' : '#fff',
                    color: active ? '#fff' : '#21315a',
                    fontWeight: 800,
                    padding: '12px 0',
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        <button type="button" onClick={moveNext} disabled={!canProceed} style={{ ...primaryButtonStyle, background: canProceed ? '#1e2f49' : '#a7b1c9', cursor: canProceed ? 'pointer' : 'not-allowed' }}>
          비전보드 만들기 <ChevronRight size={18} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
        </button>
      </main>
    </div>
  );
};

export default ValueDiscovery;
