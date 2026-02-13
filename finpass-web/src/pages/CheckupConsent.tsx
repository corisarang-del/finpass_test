import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';

interface CheckupRouteState {
  answers?: Record<string, unknown>;
  categoryId?: string;
}

const cycleOptions = [3, 6, 12] as const;
const displayFont = "'Cormorant Garamond', 'Noto Serif KR', 'Times New Roman', serif";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const CheckupConsent = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const routeState = (state as CheckupRouteState) || {};
  const answers = routeState.answers ?? {};
  const name = String(answers.c1 ?? '사용자');

  const [cycleMonths, setCycleMonths] = useState<(typeof cycleOptions)[number]>(3);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = useMemo(() => isValidEmail(email), [email]);

  const onSubmit = () => {
    if (!canSubmit) return;
    const payload = {
      agreed: true,
      cycleMonths,
      email,
      createdAt: new Date().toISOString(),
      user: name,
    };
    localStorage.setItem('finpass_checkup_consent', JSON.stringify(payload));
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#2f67d8', padding: '18px 14px 28px', fontFamily: "'Pretendard', 'SUIT', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <main style={{ width: '100%', maxWidth: 430, background: 'rgba(255,255,255,0.06)', borderRadius: 28, border: '1px solid rgba(255,255,255,0.25)', padding: '26px 18px 22px', color: '#fff' }}>
        <div style={{ width: 92, height: 92, borderRadius: 999, background: 'rgba(255,255,255,0.13)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Mail size={48} />
        </div>

        <h1 style={{ margin: '18px 0 0', textAlign: 'center', fontSize: 42, lineHeight: 1.2, fontWeight: 900, fontFamily: displayFont }}>페이스메이커가
          <br />
          되어드리겠습니다.
        </h1>
        <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: 17, lineHeight: 1.5, color: '#dce6ff' }}>
          {cycleMonths}개월마다 {name} 님의 동반 경로를 점검해 드리겠습니다.
          <br />
          지금 이메일을 등록하시면 점검 리포트를 발송해 드리겠습니다.
        </p>

        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {cycleOptions.map((cycle) => {
            const active = cycleMonths === cycle;
            return (
              <button
                key={cycle}
                type="button"
                onClick={() => setCycleMonths(cycle)}
                style={{
                  borderRadius: 12,
                  border: active ? '1.5px solid #ffffff' : '1px solid rgba(255,255,255,0.45)',
                  background: active ? 'rgba(8,20,56,0.4)' : 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  fontWeight: 800,
                  padding: '10px 0',
                  cursor: 'pointer',
                }}
              >
                {cycle}개월
              </button>
            );
          })}
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소를 입력해주세요"
          style={{
            marginTop: 14,
            width: '100%',
            boxSizing: 'border-box',
            border: 'none',
            borderRadius: 20,
            background: '#fff',
            color: '#1b2d55',
            fontSize: 18,
            fontWeight: 700,
            padding: '17px 16px',
            outline: 'none',
          }}
        />

        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || submitted}
          style={{
            marginTop: 12,
            width: '100%',
            border: 'none',
            borderRadius: 20,
            background: canSubmit && !submitted ? '#0c1a42' : '#8093c7',
            color: '#fff',
            fontWeight: 900,
            fontSize: 19,
            padding: '16px 14px',
            cursor: canSubmit && !submitted ? 'pointer' : 'not-allowed',
          }}
        >
          {submitted ? '동의 완료' : '점검 동의 및 동반 시작'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            marginTop: 10,
            width: '100%',
            border: '1px solid rgba(255,255,255,0.45)',
            borderRadius: 20,
            background: 'transparent',
            color: '#fff',
            fontWeight: 700,
            fontSize: 15,
            padding: '11px 14px',
            cursor: 'pointer',
          }}
        >
          홈으로 이동
        </button>
      </main>
    </div>
  );
};

export default CheckupConsent;
