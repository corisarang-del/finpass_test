import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Flag, Stars, Target } from 'lucide-react';

interface ValueProfile {
  coreGoals: string[];
  coreValues: string[];
  motivationStyle: 'steady' | 'challenge' | 'balance';
}

interface VisionRouteState {
  answers?: Record<string, unknown>;
  categoryId?: string;
  valueProfile?: ValueProfile;
}

interface VisionBoardSummary {
  headline: string;
  goalCards: Array<{ title: string; targetYear: number; note: string }>;
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  borderRadius: 18,
  border: '1px solid #e2e8f4',
  padding: 16,
  boxShadow: '0 8px 24px rgba(37, 64, 110, 0.06)',
};
const selectedOptionColor = '#1e2a3a';
const englishFont = "'Playfair Display', 'Bodoni MT', 'Didot', 'Times New Roman', serif";

const primaryButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 12,
  background: selectedOptionColor,
  color: '#fff',
  fontWeight: 600,
  fontSize: 15,
  padding: '12px 15px',
  cursor: 'pointer',
  boxShadow: '0 6px 14px rgba(30, 42, 58, 0.2)',
};
const displayFont = "'Pretendard Variable', 'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif";

const toAsset = (value: number) => `${(value / 100000000).toFixed(1)}억`;

const VisionBoard = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const routeState = (state as VisionRouteState) || {};
  const answers = routeState.answers ?? {};
  const categoryId = routeState.categoryId ?? 'real-estate';
  const valueProfile = routeState.valueProfile ?? { coreGoals: ['경제적 자유'], coreValues: ['균형'], motivationStyle: 'balance' as const };
  const name = String(answers.c1 ?? '고객');
  const currentYear = new Date().getFullYear();

  const summary: VisionBoardSummary = useMemo(() => {
    const headline = `${name} 님의 비전보드`;
    const cards = valueProfile.coreGoals.slice(0, 3).map((goal, idx) => ({
      title: goal,
      targetYear: currentYear + (idx + 1),
      note: `${valueProfile.coreValues[idx % Math.max(1, valueProfile.coreValues.length)] || '균형'}을 지키는 성장 경로`,
    }));
    return { headline, goalCards: cards };
  }, [name, valueProfile, currentYear]);

  const pathMetrics = useMemo(() => {
    const base = 220000000 + summary.goalCards.length * 40000000;
    return {
      now: Math.round(base * 0.38),
      mid: Math.round(base * 0.68),
      target: base,
    };
  }, [summary.goalCards.length]);

  const moveNext = () => {
    navigate('/result', { state: { answers, categoryId, visionBoardSummary: summary } });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fa', padding: '16px 14px 30px', fontFamily: "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif" }}>
      <main style={{ maxWidth: 430, margin: '0 auto', display: 'grid', gap: 14 }}>
        <section style={{ ...cardStyle, background: '#ffffff', color: '#223657', position: 'relative', overflow: 'hidden', padding: 20 }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 190, height: 190, borderRadius: 999, background: '#edf4ff', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1, paddingRight: 12 }}>
            <p style={{ margin: 0, color: '#6f8fc1', fontWeight: 600, fontSize: 11, letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 6, fontFamily: englishFont }}>
              <Stars size={14} /> VISION BOARD
            </p>
            <h1 style={{ margin: '8px 0 0', fontSize: 26, lineHeight: 1.3, fontWeight: 700, fontFamily: displayFont }}>{summary.headline}</h1>
            <p style={{ margin: '8px 0 0', color: '#6e82a9', fontSize: 14 }}>목표와 가치를 시각적으로 고정하고, 현실 입력으로 연결하겠습니다.</p>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={{ margin: 0, color: '#14224a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Target size={15} color="#2f67d8" /> 목표 자산 항로
          </p>
          <p style={{ margin: '8px 0 0', color: '#5f6f90', fontSize: 13, lineHeight: 1.5 }}>
            현재 기준점부터 중간 목표를 거쳐 최종 목표 자산으로 이동하는 경로를 보여드립니다. 아래 수치는 비전보드 기반 초안이며, 다음 단계에서 자동 보정됩니다.
          </p>
          <div style={{ marginTop: 12, height: 170, borderRadius: 14, background: 'linear-gradient(180deg,#f7faff 0%, #f0f5ff 100%)', border: '1px solid #dbe5f7', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: 14, right: 14, bottom: 28, borderTop: '2px dashed #b8c8ee' }} />
            <div style={{ position: 'absolute', left: 14, right: 18, bottom: 28, height: 88, borderTop: `3px solid ${selectedOptionColor}`, borderRadius: '100% 100% 0 0 / 84% 84% 0 0' }} />
            {[
              { left: '14%', bottom: 32, label: '현재', value: toAsset(pathMetrics.now) },
              { left: '49%', bottom: 72, label: '중간', value: toAsset(pathMetrics.mid) },
              { left: '82%', bottom: 112, label: '목표', value: toAsset(pathMetrics.target) },
            ].map((point) => (
              <div key={point.label} style={{ position: 'absolute', left: point.left, bottom: point.bottom }}>
                <div style={{ width: 12, height: 12, borderRadius: 999, background: selectedOptionColor, border: '2px solid #fff', boxShadow: '0 0 0 3px #d8deea' }} />
                <p style={{ margin: '6px 0 0', fontSize: 11, fontWeight: 800, color: '#4c5f88' }}>{point.label}</p>
                <p style={{ margin: 0, fontSize: 11, color: '#6e7fa6' }}>{point.value}</p>
              </div>
            ))}
          </div>
        </section>

        {summary.goalCards.map((card, idx) => (
          <section key={card.title} style={cardStyle}>
            <p style={{ margin: 0, color: '#7280a3', fontWeight: 600, fontSize: 12, fontFamily: englishFont }}>VISION {idx + 1}</p>
            <p style={{ margin: '6px 0 0', color: '#14224a', fontWeight: 700, fontSize: 20 }}>{card.title}</p>
            <p style={{ margin: '4px 0 0', color: '#48608f', fontWeight: 700 }}>{card.targetYear}년 목표</p>
            <p style={{ margin: '8px 0 0', color: '#5f6f90', fontSize: 14 }}>{card.note}</p>
          </section>
        ))}

        <section style={cardStyle}>
          <p style={{ margin: 0, color: '#14224a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Flag size={15} color="#2f67d8" /> 실행 모드
          </p>
          <p style={{ margin: '8px 0 0', color: '#5f6f90', lineHeight: 1.5 }}>
            {valueProfile.motivationStyle === 'steady' && '꾸준형 페이스로 월간 루틴 중심으로 진행하겠습니다.'}
            {valueProfile.motivationStyle === 'balance' && '균형형 페이스로 수입·지출·휴식을 함께 맞춰 진행하겠습니다.'}
            {valueProfile.motivationStyle === 'challenge' && '도전형 페이스로 목표 시점을 앞당기는 전략을 적용하겠습니다.'}
          </p>
        </section>

        <button type="button" onClick={moveNext} style={primaryButtonStyle}>
          현실 입력으로 이동 <ChevronRight size={18} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
        </button>
      </main>
    </div>
  );
};

export default VisionBoard;
