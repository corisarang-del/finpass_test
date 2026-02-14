import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Share2, RotateCcw, Mountain, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';
import agentHanImg from '../assets/images/agent_han.png';
import agentSongImg from '../assets/images/agent_song.png';
import agentChoiImg from '../assets/images/agent_choi.png';
import agentYouImg from '../assets/images/agent_you.png';
import { getFinalGuideComment, GUIDE_PROFILES } from '../lib/plannerProfile';

interface SimulationSnapshot {
  financialIndependenceAge: number | null;
  targetAsset: number;
  achievementRate: number;
  monthlySavings: number;
}

interface FinalRouteState {
  answers?: Record<string, unknown>;
  categoryId?: string;
  simulationSnapshot?: SimulationSnapshot;
}

const EMPTY_ANSWERS: Record<string, unknown> = {};
const GUIDE_IMAGES: Record<string, string> = {
  han: agentHanImg,
  song: agentSongImg,
  choi: agentChoiImg,
  you: agentYouImg,
};

const formatAsset = (value: number) => `${(value / 100000000).toFixed(2)}억`;
const displayFont = "'Pretendard Variable', 'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif";
const englishFont = "'Playfair Display', 'Bodoni MT', 'Didot', 'Times New Roman', serif";

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 18,
  border: '1px solid #e2e8f4',
  padding: 16,
  boxShadow: '0 8px 24px rgba(37, 64, 110, 0.06)',
};
const selectedOptionColor = '#1e2a3a';

const primaryButtonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 12,
  background: selectedOptionColor,
  color: '#fff',
  fontWeight: 600,
  fontSize: 15,
  padding: '12px 14px',
  cursor: 'pointer',
  boxShadow: '0 6px 14px rgba(30, 42, 58, 0.2)',
};

const secondaryButtonStyle: React.CSSProperties = {
  border: '1px solid #dbe3f1',
  borderRadius: 12,
  background: '#fff',
  color: '#334766',
  fontWeight: 600,
  fontSize: 14,
  padding: '12px 12px',
  cursor: 'pointer',
};

const FinalAnalysis = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const routeState = (state as FinalRouteState) || {};

  const categoryId = routeState.categoryId ?? 'real-estate';
  const answers = routeState.answers ?? EMPTY_ANSWERS;
  const name = String(answers.c1 ?? '사용자');
  const guide = GUIDE_PROFILES[categoryId] ?? GUIDE_PROFILES['real-estate'];
  const guideImage = GUIDE_IMAGES[guide.key] ?? agentHanImg;

  const snapshot = routeState.simulationSnapshot ?? {
    financialIndependenceAge: null,
    targetAsset: 3000000 * 12 * 25,
    achievementRate: 0,
    monthlySavings: 0,
  };

  const finalComment = getFinalGuideComment(categoryId, answers);
  const [shareMessage, setShareMessage] = useState('');

  const yearlyRoadmap = useMemo(() => {
    const baseAsset = snapshot.targetAsset * (snapshot.achievementRate / 100);
    return [1, 2, 3, 4, 5].map((year) => {
      const asset = Math.max(0, Math.round(baseAsset + snapshot.monthlySavings * 12 * year));
      const increase = Math.max(0, Math.round(snapshot.monthlySavings * 12 * year));
      return { year, asset, increase };
    });
  }, [snapshot]);

  const projectedAsset5Y = yearlyRoadmap[4]?.asset ?? snapshot.targetAsset;

  const onShareVisionCard = async () => {
    const text = `${name} 님 미래 자산 등고선\n달성률 ${snapshot.achievementRate}%\n5년 뒤 자산 ${formatAsset(projectedAsset5Y)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'FinPass 미래 자산 등고선', text });
        setShareMessage('공유가 완료되었습니다.');
        return;
      }
      await navigator.clipboard.writeText(text);
      setShareMessage('공유 문구를 복사했습니다.');
    } catch {
      setShareMessage('공유를 완료하지 못했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fa', padding: '16px 14px 30px', fontFamily: "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif" }}>
      <main style={{ maxWidth: 420, margin: '0 auto', display: 'grid', gap: 14 }}>
        <section style={{ ...cardStyle, padding: 20 }}>
          <p style={{ margin: 0, color: '#7f95be', fontWeight: 600, fontSize: 11, letterSpacing: '0.08em', fontFamily: englishFont }}>5-YEAR ASSET ROADMAP</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginTop: 4 }}>
            <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.2, color: '#101c3f', fontWeight: 700, fontFamily: displayFont, letterSpacing: '-0.01em' }}>
              {name} 님의
              <br />
              미래 자산 등고선
            </h1>
            <div style={{ borderRadius: 14, border: '1px solid #d5deef', background: '#f6f9ff', padding: '8px 10px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#8693b0', fontWeight: 700 }}>목표 도달률</p>
              <p style={{ margin: '2px 0 0', color: selectedOptionColor, fontSize: 24, fontWeight: 700 }}>{snapshot.achievementRate}%</p>
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            <article style={{ border: '1px solid #d8ece5', background: '#ecfaf4', borderRadius: 12, padding: '10px 10px' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#1d8a6d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}><Sparkles size={14} /> 성실형 자산 빌더</p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#5c8f82' }}>규칙적인 실천이 강점</p>
            </article>
            <article style={{ border: '1px solid #dce4f7', background: '#eef3ff', borderRadius: 12, padding: '10px 10px' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#496de0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}><TrendingUp size={14} /> 계속 자산 증가형</p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#7288bc' }}>변동성 커버 가능</p>
            </article>
            <article style={{ border: '1px solid #dce4f7', background: '#f2f6ff', borderRadius: 12, padding: '10px 10px' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#4d66bc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}><ShieldCheck size={14} /> 안정적 리스크 구조</p>
              <p style={{ margin: '4px 0 0', fontSize: 11, color: '#7288bc' }}>방어력 우수</p>
            </article>
          </div>
        </section>

        <section style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px 0' }}>
            <p style={{ margin: 0, color: '#25345e', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mountain size={15} color="#7d8cab" /> 자산 고지 시각화
            </p>
            <p style={{ margin: '2px 0 0', color: '#b0bbd3', fontWeight: 600, fontSize: 11, textAlign: 'right', fontFamily: englishFont }}>ASSET TOPOGRAPHY</p>
          </div>
          <div style={{ height: 230, position: 'relative', marginTop: 4, background: 'linear-gradient(180deg,#ffffff 0%,#f8fafe 100%)' }}>
            <div style={{ position: 'absolute', left: 16, right: 16, bottom: 34, borderTop: '3px dashed #c7d4f2' }} />
            <div style={{ position: 'absolute', left: 8, right: -30, bottom: 34, height: 100, background: 'linear-gradient(180deg,rgba(101,141,255,0.06),rgba(101,141,255,0.22))', clipPath: 'polygon(0 100%, 0 85%, 25% 70%, 50% 56%, 75% 42%, 100% 30%, 100% 100%)' }} />
            {[0, 1, 2, 3, 4].map((idx) => (
              <div key={idx} style={{ position: 'absolute', left: `${16 + idx * 20}%`, bottom: `${34 + idx * 17}px`, width: 12, height: 12, borderRadius: 999, background: idx === 0 ? '#5b63ff' : '#d9dfec', border: '2px solid #fff' }} />
            ))}
            <div style={{ position: 'absolute', left: 18, right: 12, bottom: 10, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)' }}>
              {['2024', '2025', '2026', '2027', '2028'].map((year) => (
                <p key={year} style={{ margin: 0, fontSize: 11, color: '#9aabcf', fontWeight: 700 }}>{year}</p>
              ))}
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <div style={{ display: 'grid', gap: 12 }}>
            {yearlyRoadmap.map((item, idx) => {
              const title =
                idx === 0 ? '베이스캠프 확보' : idx === 1 ? '능선 진입' : idx === 2 ? '고도 적응' : idx === 3 ? '정상 가시권' : '정상 정복 (Peak)';
              const note =
                idx === 0 ? '안정적인 현금흐름 확보' : idx === 1 ? '복리 가속도 구간' : idx === 2 ? '자산 포트폴리오 최적화' : idx === 3 ? '목표 수익률 달성 임박' : '5년내 재정 완성';
              return (
                <article key={item.year} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: idx === 0 ? selectedOptionColor : '#f2f5fb', color: idx === 0 ? '#fff' : '#91a0c2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                      {idx + 1}
                    </div>
                    <div>
                      <p style={{ margin: 0, color: '#1f2d4d', fontWeight: 700 }}>{title}</p>
                      <p style={{ margin: '2px 0 0', color: '#93a0bc', fontSize: 12 }}>{note}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, color: '#1f2a40', fontWeight: 700, fontSize: 22 }}>{formatAsset(item.asset)}</p>
                    <p style={{ margin: '2px 0 0', color: '#2fb481', fontWeight: 800, fontSize: 12 }}>+{Math.round(item.increase / 1000000).toLocaleString()}만 증가</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
            <img
              src={guideImage}
              alt={guide.name}
              style={{ width: 76, height: 92, borderRadius: 14, objectFit: 'contain', objectPosition: 'center top', background: '#eef3fb', border: '1px solid #d8e2f2', flexShrink: 0, padding: 2 }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: '#111d3e', fontWeight: 700 }}>{guide.name}</p>
              <p style={{ margin: '2px 0 8px', color: '#6a7590', fontSize: 12 }}>{guide.role}</p>
              <div style={{ border: '1px solid #d5ddeb', background: '#f7fafe', borderRadius: 14, padding: '10px 12px', color: '#34405f', fontSize: 14, lineHeight: 1.45 }}>
                {finalComment}
              </div>
            </div>
          </div>
          <button type="button" onClick={onShareVisionCard} style={{ ...secondaryButtonStyle, marginTop: 12, width: '100%', fontSize: 15, display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
            <Share2 size={20} />
            비전 카드 공유하기
          </button>
          {shareMessage && <p style={{ margin: '8px 0 0', color: '#526286', fontSize: 13 }}>{shareMessage}</p>}
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button type="button" onClick={() => navigate('/result', { state: { answers, categoryId } })} style={secondaryButtonStyle}>
            대시보드
          </button>
          <button type="button" onClick={() => navigate('/checkup-consent', { state: { answers, categoryId } })} style={primaryButtonStyle}>
            점검 동의
          </button>
        </div>

        <button type="button" onClick={() => navigate('/result', { state: { answers, categoryId } })} style={{ ...secondaryButtonStyle, fontSize: 14, padding: '12px 12px', color: '#394768' }}>
          다시 계산하기 <RotateCcw size={14} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
        </button>
      </main>
    </div>
  );
};

export default FinalAnalysis;
