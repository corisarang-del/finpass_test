import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

interface CheckupRouteState {
  answers?: Record<string, unknown>;
  categoryId?: string;
}

const cycleOptions = [3, 6, 12] as const;
const displayFont = "'Pretendard', 'SUIT', 'Noto Sans KR', sans-serif";
const selectedOptionColor = '#1e2a3a';
const selectedOptionShadow = '0 8px 25px rgba(30, 42, 58, 0.25)';

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
    <div style={{ minHeight: '100vh', background: '#f4f6fa', padding: '16px 14px 28px', fontFamily: "'Pretendard', 'SUIT', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <main style={{ width: '100%', maxWidth: 430, background: '#ffffff', borderRadius: 20, border: '1px solid #e2e8f4', padding: '20px 16px 18px', color: '#2a3a58', boxShadow: '0 10px 24px rgba(37, 64, 110, 0.06)' }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
          style={{ width: 34, height: 34, borderRadius: 999, border: '1px solid #dfe7f4', background: '#fff', color: '#5e7497', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ArrowLeft size={16} />
        </button>

        <div style={{ width: 78, height: 78, borderRadius: 999, background: '#edf4ff', margin: '10px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4c8fe9' }}>
          <Mail size={40} />
        </div>

        <h1 style={{ margin: '16px 0 0', textAlign: 'center', fontSize: 32, lineHeight: 1.24, fontWeight: 800, fontFamily: displayFont, color: '#1d3154' }}>페이스메이커가
          <br />
          되어드리겠습니다.
        </h1>
        <p style={{ margin: '10px 0 0', textAlign: 'center', fontSize: 15, lineHeight: 1.5, color: '#667da4' }}>
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
                  border: active ? `1px solid ${selectedOptionColor}` : '1px solid #dce5f2',
                  background: active ? selectedOptionColor : '#fff',
                  color: active ? '#ffffff' : '#4a5f82',
                  fontWeight: 700,
                  padding: '10px 0',
                  cursor: 'pointer',
                  boxShadow: active ? selectedOptionShadow : 'none',
                  transition: 'all 0.2s ease',
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
            border: '1px solid #dbe4f2',
            borderRadius: 14,
            background: '#fff',
            color: '#1b2d55',
            fontSize: 16,
            fontWeight: 600,
            padding: '14px 14px',
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
            borderRadius: 14,
            background: canSubmit && !submitted ? selectedOptionColor : '#b8c7df',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            padding: '14px 14px',
            cursor: canSubmit && !submitted ? 'pointer' : 'not-allowed',
            boxShadow: canSubmit && !submitted ? selectedOptionShadow : undefined,
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
            border: '1px solid #dbe3f1',
            borderRadius: 20,
            background: '#fff',
            color: '#3b5073',
            fontWeight: 600,
            fontSize: 14,
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
