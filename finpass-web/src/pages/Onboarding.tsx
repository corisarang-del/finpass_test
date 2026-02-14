import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calculator, Sparkles, Heart, Timer, Clock, Wallet, HelpCircle, Plane, Coffee, Palette, Users } from 'lucide-react';

// --- 온보딩 스텝 데이터 ---
interface StepItem {
    icon: React.ReactNode;
    text: string;
}

interface StepData {
    titleLines: { text: string; highlight: boolean }[];
    subtitle: string;
    items: StepItem[];
    layout: 'list' | 'grid';
    footerText: string;
    cta: string;
}

const ACCENT = '#4A90D9';
const iconProps = { width: 18, height: 18, strokeWidth: 1.8 };

const STEPS: StepData[] = [
    {
        titleLines: [
            { text: '복잡한 계산은 우리가', highlight: false },
            { text: '당신은 꿈만 꾸세요', highlight: true },
        ],
        subtitle: '숫자가 어렵다고요?\n괜찮아요. 우리가 다 계산해 드릴게요',
        items: [
            { icon: <Calculator {...iconProps} />, text: '복잡한 계산은 우리가 할게요' },
            { icon: <Sparkles {...iconProps} />, text: '당신은 꿈만 꾸세요' },
            { icon: <Heart {...iconProps} />, text: '강요하지 않을게요' },
            { icon: <Timer {...iconProps} />, text: '당신의 속도로 가요' },
        ],
        layout: 'list',
        footerText: '입력하는 정보는 기기에만 저장됩니다',
        cta: '믿어볼게',
    },
    {
        titleLines: [
            { text: '매일 출근하며', highlight: false },
            { text: '"언제까지 이럴까"', highlight: true },
            { text: '생각하죠?', highlight: false },
        ],
        subtitle: '알바비 받으며 버티는 지금,\n미래는 더 막막하게만 느껴지고...',
        items: [
            { icon: <Clock {...iconProps} />, text: '"매일 아침, 알람 소리가 너무 싫어요"' },
            { icon: <Wallet {...iconProps} />, text: '"월급은 매번 어디로 사라지는 걸까요"' },
            { icon: <HelpCircle {...iconProps} />, text: '"은퇴? 그건 남의 얘기 같아요"' },
        ],
        layout: 'list',
        footerText: '당신만 그런 게 아니에요. 우리 모두 비슷한 고민을 하고 있답니다',
        cta: '맞아, 나도 그래',
    },
    {
        titleLines: [
            { text: '상상해 보세요', highlight: false },
            { text: '내가 원할 때 일하는', highlight: true },
            { text: '그런 삶을', highlight: false },
        ],
        subtitle: '은퇴가 먼 미래가 아니라\n내가 선택하는 자유가 될 때',
        items: [
            { icon: <Plane {...iconProps} />, text: '언제든 떠날 수 있는 여행' },
            { icon: <Coffee {...iconProps} />, text: '여유롭게 마시는 오후 커피' },
            { icon: <Palette {...iconProps} />, text: '하고 싶었던 취미 생활' },
            { icon: <Users {...iconProps} />, text: '소중한 사람들과의 시간' },
        ],
        layout: 'grid',
        footerText: '작은 습관 하나가 10년 후의 당신을 바꿀 수 있어요',
        cta: '상상하고 싶어',
    },
];

// --- Onboarding Component ---
const Onboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(1);

    const step = STEPS[currentStep];
    const progress = ((currentStep + 1) / STEPS.length) * 100;

    const goNext = () => {
        if (currentStep < STEPS.length - 1) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        } else {
            navigate('/', { state: { fromOnboarding: true } });
        }
    };

    const goPrev = () => {
        if (currentStep > 0) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        } else {
            navigate('/');
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100dvh',
                minHeight: '100dvh',
                overflow: 'hidden',
                fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
            }}
        >
            {/* === 배경 (Wizard와 동일: 순수 화이트 + 미세 장식) === */}
            <div style={{ position: 'absolute', inset: 0, background: '#ffffff' }} />
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `radial-gradient(circle at 15% 85%, ${ACCENT}05 0%, transparent 40%), radial-gradient(circle at 85% 15%, ${ACCENT}03 0%, transparent 40%)`,
                }}
            />

            {/* === 상단 UI (Wizard와 동일 스타일) === */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* 뒤로가기 버튼: Wizard 원형 버튼 */}
                    <button
                        onClick={goPrev}
                        style={{
                            background: 'white',
                            border: '1px solid #e2e5ea',
                            borderRadius: '50%',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#333',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        }}
                    >
                        <ArrowLeft style={{ width: 18, height: 18 }} />
                    </button>

                    {/* 스텝 카운터: Wizard pill 스타일 */}
                    <div style={{
                        background: 'white',
                        border: '1px solid #e2e5ea',
                        borderRadius: 20,
                        padding: '6px 16px',
                        color: '#666',
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                        {currentStep + 1} / {STEPS.length}
                    </div>
                </div>

                {/* 진행률 바: Wizard와 동일 */}
                <div style={{
                    marginTop: 12,
                    height: 3,
                    background: '#e2e5ea',
                    borderRadius: 2,
                    overflow: 'hidden',
                }}>
                    <motion.div
                        style={{
                            height: '100%',
                            background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}99)`,
                            borderRadius: 2,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* === 메인 콘텐츠 (화면 가운데 정렬) === */}
            <div
                style={{
                    position: 'absolute',
                    top: 84,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 45,
                    display: 'flex',
                    flexDirection: 'column',
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingBottom: 'calc(132px + env(safe-area-inset-bottom))',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentStep}
                        custom={direction}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        style={{
                            width: '100%',
                            maxWidth: 420,
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '100%',
                            margin: '0 auto',
                            paddingTop: 8,
                        }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            {/* 질문 헤딩 */}
                            <div style={{ marginBottom: 10, textAlign: 'center' }}>
                            {step.titleLines.map((line, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        fontSize: line.highlight ? 'clamp(20px, 5vw, 22px)' : 'clamp(17px, 4.2vw, 19px)',
                                        fontWeight: 700,
                                        color: line.highlight ? ACCENT : '#1a1a2e',
                                        lineHeight: 1.34,
                                        letterSpacing: '-0.02em',
                                        wordBreak: 'keep-all',
                                    }}
                                >
                                    {line.text}
                                </div>
                            ))}
                            <p style={{
                                color: '#999',
                                fontSize: 12,
                                lineHeight: 1.5,
                                marginTop: 5,
                                whiteSpace: 'pre-line',
                            }}>
                                {step.subtitle}
                            </p>
                            </div>

                            {/* 아이템 카드 */}
                            {step.layout === 'list' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                    {step.items.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: 0.1 + idx * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
                                            style={{
                                                background: '#ffffff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: 14,
                                                padding: '10px 14px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 10,
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                            }}
                                        >
                                            <span style={{ color: ACCENT, flexShrink: 0 }}>{item.icon}</span>
                                            <span style={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: '#2c2c3a',
                                                letterSpacing: '-0.01em',
                                            }}>
                                                {item.text}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                    {step.items.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ delay: 0.1 + idx * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
                                            style={{
                                                background: '#ffffff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: 14,
                                                padding: '12px 10px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 6,
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                            }}
                                        >
                                            <span style={{ color: ACCENT }}>{item.icon}</span>
                                            <span style={{
                                                fontSize: 13,
                                                fontWeight: 600,
                                                color: '#2c2c3a',
                                                textAlign: 'center',
                                                letterSpacing: '-0.01em',
                                                lineHeight: 1.4,
                                            }}>
                                                {item.text}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* === 하단 고정 CTA: 모바일에서도 항상 노출 === */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 60,
                    padding: '10px 16px calc(18px + env(safe-area-inset-bottom))',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 32%, #ffffff 100%)',
                    pointerEvents: 'none',
                }}
            >
                <motion.p
                    key={`footer-${currentStep}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        textAlign: 'center',
                        color: '#a1a7b3',
                        fontSize: 11,
                        margin: '0 0 8px',
                        letterSpacing: '-0.01em',
                    }}
                >
                    {step.footerText}
                </motion.p>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <motion.button
                        onClick={goNext}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT}dd)`,
                            border: 'none',
                            borderRadius: 12,
                            padding: '12px 30px',
                            color: 'white',
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: `0 4px 15px ${ACCENT}25`,
                            fontFamily: "'Pretendard', sans-serif",
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            transition: 'all 0.2s ease',
                            minWidth: 146,
                            justifyContent: 'center',
                            pointerEvents: 'auto',
                        }}
                    >
                        {step.cta}
                        <ArrowRight style={{ width: 16, height: 16 }} />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
