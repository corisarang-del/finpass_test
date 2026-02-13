import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, House, LineChart, ShieldCheck, RotateCcw, Bot } from 'lucide-react';
import agentHanImg from '../assets/images/agent_han.png';
import agentSongImg from '../assets/images/agent_song.png';
import agentChoiImg from '../assets/images/agent_choi.png';
import agentYouImg from '../assets/images/agent_you.png';
import { GUIDE_PROFILES, getFinalGuideComment } from '../lib/plannerProfile';

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

interface ActionPlanItem {
  title: string;
  description: string;
  impact: string;
  icon: 'house' | 'line' | 'shield';
  selected?: boolean;
}

interface ActionPlanDetailState {
  item: ActionPlanItem;
  categoryId: string;
  answers: Record<string, unknown>;
  simulationSnapshot: SimulationSnapshot;
  actionIndex: number;
}

const EMPTY_ANSWERS: Record<string, unknown> = {};

const GUIDE_IMAGES: Record<string, string> = {
  han: agentHanImg,
  song: agentSongImg,
  choi: agentChoiImg,
  you: agentYouImg,
};

const formatAsset = (value: number) => (value >= 100000000 ? `${(value / 100000000).toFixed(1)}억원` : `${Math.round(value / 10000).toLocaleString()}만원`);
const toYearMonth = (months: number) => `${Math.floor(months / 12)}년 ${months % 12}개월`;

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 22,
  border: '1px solid #e7ebf3',
  padding: 16,
  boxShadow: '0 10px 28px rgba(10, 23, 53, 0.05)',
};

const planByCategory = (categoryId: string, answers: Record<string, unknown>): ActionPlanItem[] => {
  const picked = String(answers.l3 ?? answers.r6 ?? answers.s5 ?? answers.i5 ?? '');

  if (categoryId === 'real-estate') {
    return [
      { title: 'ISA 계좌 활용하기', description: '비과세 혜택으로 실수익률을 올리고 주거자금 이전까지 운용해.', impact: '은퇴 시점 1.2년 단축', icon: 'house', selected: true },
      { title: '연금 저축 펀드', description: '세액공제 구간을 먼저 채우는 방식으로 연간 수익률을 높여.', impact: '연 5개월 단축', icon: 'line' },
      { title: '비상금 확보', description: '생활비 6개월치를 분리해서 예외 상황에도 계획을 유지해.', impact: '리스크 관리', icon: 'shield' },
    ];
  }

  if (categoryId === 'insurance') {
    return [
      { title: '중복 보험 정리', description: '보장 중복 항목부터 정리해 고정비를 낮춰.', impact: '월 5~15만원 절감', icon: 'shield', selected: true },
      { title: '현금흐름 통장 분리', description: '생활비와 저축/투자 계좌를 분리해 자동화해.', impact: '실행 유지력 상승', icon: 'house' },
      { title: '연금 자동 납입', description: '매월 자동이체로 장기 복리 구조를 고정해.', impact: '장기 안정성 강화', icon: 'line' },
    ];
  }

  if (categoryId === 'stock') {
    return [
      { title: '핵심 ETF 비중 확대', description: '개별 테마 비중을 줄이고 분산 ETF를 중심으로 유지해.', impact: '변동성 완화', icon: 'line', selected: true },
      { title: `${picked || '관심 테마'} 비중 제한`, description: '관심 종목은 전체 자산의 20% 이하로만 가져가.', impact: '쏠림 방지', icon: 'house' },
      { title: '손실 허용 구간 룰', description: '손실 구간별로 리밸런싱 규칙을 미리 정해.', impact: '하락장 방어', icon: 'shield' },
    ];
  }

  return [
    { title: '작은 습관 1개 고정', description: `${picked || '지출 절감 항목'}부터 월 고정 루틴으로 만들자.`, impact: '목표 시점 단축', icon: 'house', selected: true },
    { title: '월간 점검 루틴', description: '수입/지출/저축률을 월 1회 점검해서 이탈을 줄여.', impact: '지속 가능성 개선', icon: 'line' },
    { title: '에너지 보호 규칙', description: '번아웃 구간을 방지해서 계획을 끝까지 유지해.', impact: '실행 유지력 강화', icon: 'shield' },
  ];
};

const IconByType = ({ type }: { type: ActionPlanItem['icon'] }) => {
  if (type === 'house') return <House size={18} color="#111f45" />;
  if (type === 'line') return <LineChart size={18} color="#0c6f5b" />;
  return <ShieldCheck size={18} color="#385a9b" />;
};

const FinalAnalysis = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const routeState = (state as FinalRouteState) || {};

  const categoryId = routeState.categoryId ?? 'real-estate';
  const answers = routeState.answers ?? EMPTY_ANSWERS;
  const guide = GUIDE_PROFILES[categoryId] ?? GUIDE_PROFILES['real-estate'];
  const guideImage = GUIDE_IMAGES[guide.key] ?? agentHanImg;

  const snapshot = routeState.simulationSnapshot ?? {
    financialIndependenceAge: null,
    targetAsset: 3000000 * 12 * 25,
    achievementRate: 0,
    monthlySavings: 0,
  };

  const roadmap = useMemo(() => planByCategory(categoryId, answers), [categoryId, answers]);
  const monthsToGoal = snapshot.monthlySavings > 0 ? Math.ceil(Math.max(0, snapshot.targetAsset - snapshot.targetAsset * (snapshot.achievementRate / 100)) / snapshot.monthlySavings) : null;
  const finalComment = getFinalGuideComment(categoryId, answers);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '18px 14px 30px', fontFamily: "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif" }}>
      <main style={{ maxWidth: 420, margin: '0 auto', display: 'grid', gap: 14 }}>
        <section style={{ ...cardStyle, textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ width: 58, height: 58, margin: '0 auto', borderRadius: 999, background: 'linear-gradient(120deg,#9cebd9,#4acbb2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={30} color="#0f3e3a" />
          </div>
          <h1 style={{ margin: '12px 0 0', fontSize: 38, lineHeight: 1.15, color: '#161d2f', fontWeight: 900 }}>최적의 액션 플랜이<br /><span style={{ color: '#0f7d68' }}>준비됐습니다</span></h1>
          <p style={{ margin: '8px 0 0', color: '#758099' }}>시뮬레이션 결과를 기반으로 실행순서를 정리했습니다.</p>
        </section>

        <section style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <img src={guideImage} alt={guide.name} style={{ width: 76, height: 92, borderRadius: 14, objectFit: 'contain', objectPosition: 'center top', background: '#eef3fb', border: '1px solid #d8e2f2', flexShrink: 0, padding: 2 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, color: '#111d3e', fontWeight: 900, fontSize: 20, letterSpacing: '-0.01em' }}>{guide.name}</p>
              <p style={{ margin: '2px 0 8px', color: '#6a7590', fontSize: 14, letterSpacing: '-0.01em' }}>{guide.role}</p>
              <div style={{ border: '1px solid #d5ddeb', background: '#f7fafe', borderRadius: 14, padding: '10px 12px', color: '#34405f', fontSize: 14, lineHeight: 1.45, display: 'flex', gap: 8, alignItems: 'flex-start', letterSpacing: '-0.01em' }}>
                <Bot size={16} color="#111f45" style={{ marginTop: 2, flexShrink: 0 }} />
                {finalComment}
              </div>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[{ label: '예상 은퇴 나이', value: `${snapshot.financialIndependenceAge ?? '-'}세`, color: '#111f45' }, { label: '목표 자산', value: formatAsset(snapshot.targetAsset), color: '#0c6f5b' }, { label: '달성률', value: `${snapshot.achievementRate}%`, color: '#111f45' }, { label: '예상 소요 기간', value: monthsToGoal === null ? '-' : toYearMonth(monthsToGoal), color: '#111f45' }].map((item) => (
            <article key={item.label} style={{ ...cardStyle, padding: 14 }}>
              <p style={{ margin: 0, color: '#7a8297', fontSize: 12 }}>{item.label}</p>
              <p style={{ margin: '6px 0 0', color: item.color, fontSize: 30, fontWeight: 900, lineHeight: 1.1 }}>{item.value}</p>
            </article>
          ))}
        </section>

        <section style={cardStyle}>
          <p style={{ margin: 0, color: '#1c2333', fontSize: 15, fontWeight: 900 }}>추천 액션 플랜</p>
          <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
            {roadmap.map((item, actionIndex) => (
              <button
                key={item.title}
                type="button"
                onClick={() =>
                  navigate('/action-plan-detail', {
                    state: {
                      item,
                      categoryId,
                      answers,
                      simulationSnapshot: snapshot,
                      actionIndex,
                    } as ActionPlanDetailState,
                  })
                }
                style={{
                  borderRadius: 14,
                  border: item.selected ? '1.5px solid #111f45' : '1px solid #d9deea',
                  background: item.selected ? '#eff3fb' : '#ffffff',
                  padding: '12px 12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <IconByType type={item.icon} />
                  <div>
                    <p style={{ margin: 0, color: '#1b2235', fontWeight: 800 }}>{item.title}</p>
                    <p style={{ margin: '4px 0 0', color: '#6f7890', fontSize: 13 }}>{item.description}</p>
                    <p style={{ margin: '6px 0 0', color: '#8d96ac', fontSize: 12, fontWeight: 700 }}>{item.impact}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, background: '#f4faf8', borderColor: '#d9eee8' }}>
          <p style={{ margin: 0, color: '#0f7d68', fontWeight: 900, fontSize: 18, letterSpacing: '-0.01em' }}>작은 시작이 큰 변화를 만듭니다</p>
          <p style={{ margin: '6px 0 0', color: '#6f7890', fontSize: 14, letterSpacing: '-0.01em', lineHeight: 1.35 }}>첫 번째 액션부터 실행하면 계획이 현실이 됩니다.</p>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button type="button" onClick={() => navigate('/result', { state: { answers, categoryId } })} style={{ border: '1px solid #d9deea', borderRadius: 999, background: '#fff', color: '#38415a', fontWeight: 800, fontSize: 16, padding: '14px 12px', cursor: 'pointer' }}>대시보드</button>
          <button type="button" onClick={() => navigate('/result', { state: { answers, categoryId } })} style={{ border: 'none', borderRadius: 999, background: '#101d40', color: '#fff', fontWeight: 900, fontSize: 16, padding: '14px 12px', cursor: 'pointer' }}>
            다시 시작하기 <RotateCcw size={16} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default FinalAnalysis;
