
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 가이드 에이전트 이미지
import agentHanImg from '../assets/images/agent_han.png';
import agentSongImg from '../assets/images/agent_song.png';
import agentChoiImg from '../assets/images/agent_choi.png';
import agentYouImg from '../assets/images/agent_you.png';

// 배경 이미지
import home1 from '../assets/images/home1.jpg';
import home2 from '../assets/images/home2.jpg';
import home3 from '../assets/images/home3.jpg';

// --- Types & Data ---
type QuestionType = 'text' | 'number' | 'single' | 'multi' | 'slider' | 'intro';

interface Question {
    id: string;
    step: string;
    text: string;
    type: QuestionType;
    options?: string[];
    placeholder?: string;
    guideComment?: string;
    condition?: (answers: any) => boolean;
}

interface GuideProfile {
    name: string;
    nameKo: string;
    role: string;
    image: string;
    color: string;
    accentColor: string;
    bgImage: string;
    intro: string;
    outro: string;
}

const GUIDES: Record<string, GuideProfile> = {
    'real-estate': {
        name: 'Agent Han',
        nameKo: '에이전트 한',
        role: 'Real Estate Strategist',
        image: agentHanImg,
        color: '#4A90D9',
        accentColor: 'rgba(74, 144, 217, 0.3)',
        bgImage: home1,
        intro: "이번 코스를 담당하게 된 수석 가이드 에이전트 한입니다. 현실적인 경로부터 정리해보겠습니다.",
        outro: "입지 우선순위가 명확하니, 후보지를 좁히는 순간부터 전략이 선명해집니다."
    },
    'insurance': {
        name: 'Guardian Song',
        nameKo: '가디언 송',
        role: 'Risk Manager',
        image: agentSongImg,
        color: '#4CAF50',
        accentColor: 'rgba(76, 175, 80, 0.3)',
        bgImage: home2,
        intro: "이번 코스를 담당하게 된 수석 가이드 가디언 송입니다. 안전장치부터 점검하겠습니다.",
        outro: "연금이 시작되어 있다는 점은 큰 장점입니다. 이제는 꾸준함이 핵심입니다."
    },
    'stock': {
        name: 'Trader Choi',
        nameKo: '트레이더 최',
        role: 'Market Analyst',
        image: agentChoiImg,
        color: '#E53935',
        accentColor: 'rgba(229, 57, 53, 0.3)',
        bgImage: home3,
        intro: "이번 코스를 담당하게 된 수석 가이드 트레이더 최입니다. 흐름과 원칙을 함께 보겠습니다.",
        outro: "변동성 허용 범위가 낮다면 분산과 규칙성이 핵심입니다."
    },
    'life-balance': {
        name: 'Director Yoo',
        nameKo: '디렉터 유',
        role: 'Life Balancer',
        image: agentYouImg,
        color: '#9C27B0',
        accentColor: 'rgba(156, 39, 176, 0.3)',
        bgImage: home1,
        intro: "이번 코스를 담당하게 된 수석 가이드 디렉터 유입니다. 삶의 목표를 먼저 그려보죠.",
        outro: "작은 습관 하나만 바꿔도 목표 시점이 빨라질 수 있습니다."
    }
};

const COMMON_QUESTIONS: Question[] = [
    { id: 'c0', step: '인사', text: "", type: 'intro', guideComment: "" },
    { id: 'c1', step: '발견', text: "안녕하세요! 당신을 무엇이라 불러드리면 좋을까요?", type: 'text', placeholder: "예: 김지수", guideComment: "반갑습니다. 오늘 대화가 당신의 인생 지도가 될 겁니다." },
    { id: 'c2', step: '발견', text: "현재 몇 번째 생일을 지나오셨나요?", type: 'number', placeholder: "나이 입력", guideComment: "나이는 단순한 숫자가 아닙니다. 가능성의 척도죠." },
    { id: 'c3', step: '발견', text: "당신이 가장 중요하게 생각하는 가치는 무엇인가요?", type: 'single', options: ['성장', '안정', '자유', '건강'], guideComment: "가치는 모든 선택의 기준이 됩니다." },
];

const CATEGORY_QUESTIONS: Record<string, Question[]> = {
    'real-estate': [
        { id: 'r1', step: '부동산 전략', text: "희망 주거 형태는 전세인가요, 매매인가요?", type: 'single', options: ['전세', '매매', '월세', '반전세'], guideComment: "주거 형태에 따라 자금 운용 전략이 완전히 달라집니다." },
        { id: 'r2', step: '부동산 전략', text: "원하는 입지의 우선순위는 무엇인가요?", type: 'multi', options: ['직주근접', '학군', '교통편리', '개발호재'], guideComment: "입지 우선순위를 알면 불필요한 고민을 줄일 수 있습니다." },
        { id: 'r3', step: '부동산 전략', text: "현실적으로 감당 가능한 월 상환액은 어느 정도인가요?", type: 'single', options: ['50만원 이하', '50~100만원', '100~150만원', '150만원 이상'], guideComment: "월 상환 한도에 맞춘다면, 매수 시점을 조절할 수 있습니다." },
        { id: 'r4', step: '부동산 전략', text: "전세에서 매매로 전환할 의향은 어느 정도인가요?", type: 'single', options: ['매우 높음', '높음', '보통', '낮음'], guideComment: "전환 시점을 잡는 것이 부동산 투자의 핵심입니다." },
        { id: 'r5', step: '부동산 전략', text: "지금 가장 걱정되는 변수는 무엇인가요?", type: 'multi', options: ['금리', '대출한도', '소득변동'], guideComment: "변수를 미리 알면 대비책을 세울 수 있습니다." },
        { id: 'r6', step: '부동산 전략', text: "청약과 매매 중 어떤 전략이 더 마음에 가까운가요?", type: 'single', options: ['청약', '매매', '상관없음'], guideComment: "현재 자산 구조로는 청약 기회를 노리는 전략이 더 현실적일 수 있습니다." },
    ],
    'insurance': [
        { id: 'i1', step: '기초 점검', text: "비상금이 몇 개월치 확보되어 있나요?", type: 'single', options: ['없음', '3개월 미만', '3~6개월', '6개월 이상'], guideComment: "방어 장치가 약한 상태입니다. 비상금부터 확보하는 것이 최우선입니다." },
        { id: 'i2', step: '기초 점검', text: "현재 가입된 보험의 목적을 알고 계신가요?", type: 'single', options: ['잘 모름', '대략 암', '정확히 암', '가입 안 함'], guideComment: "보험의 목적이 불명확하면 비용이 커집니다. 목적을 정리하면 부담이 줄어듭니다." },
        { id: 'i3', step: '기초 점검', text: "연금 준비는 어느 정도 진행되고 있나요?", type: 'single', options: ['아직 안 함', '시작함', '잘 되고 있음'], guideComment: "연금이 시작되어 있다는 점은 큰 장점입니다. 이제는 꾸준함이 핵심입니다." },
        { id: 'i4', step: '기초 점검', text: "갑작스러운 지출이 생기면 가장 먼저 흔들릴 곳은 어디인가요?", type: 'single', options: ['생활비', '보험료', '저축/투자', '대출상환'], guideComment: "가장 약한 고리를 미리 보강해야 합니다." },
        { id: 'i5', step: '기초 점검', text: "보험료/저축 중 지금 줄일 수 있는 항목이 있나요?", type: 'single', options: ['있다', '없다', '모르겠다'], guideComment: "고정 비용을 줄이는 것이 자산 형성의 첫걸음입니다." },
        { id: 'i6', step: '기초 점검', text: "노후 생활비를 생각해 본 적이 있나요?", type: 'single', options: ['구체적으로 계산함', '생각만 해봄', '아직 안 해봄'], guideComment: "막연한 불안은 구체적인 숫자로 해소됩니다." },
    ],
    'stock': [
        { id: 's1', step: '투자 성향', text: "투자 경험은 어느 정도인가요?", type: 'single', options: ['없음', '1년 미만', '1~3년', '3년 이상'], guideComment: "경험이 쌓일수록 시장을 보는 눈이 달라집니다." },
        { id: 's2', step: '투자 성향', text: "변동성에 대한 심리적 허용 범위는 어느 정도인가요?", type: 'single', options: ['매우 낮음', '낮음', '보통', '높음'], guideComment: "변동성 허용 범위가 낮다면 분산과 규칙성이 핵심입니다." },
        { id: 's3', step: '투자 성향', text: "투자 목표 기간은 몇 년으로 생각하시나요?", type: 'single', options: ['1년 미만', '1~3년', '3~5년', '5년 이상'], guideComment: "짧은 기간에 큰 수익을 노리는 구조는 위험합니다. 기간을 늘리면 선택지가 넓어집니다." },
        { id: 's4', step: '투자 성향', text: "월 투자 여력은 어느 정도인가요?", type: 'single', options: ['10만원 이하', '10~30만원', '30~50만원', '50만원 이상'], guideComment: "꾸준한 투자가 시간의 마법을 만듭니다." },
        { id: 's5', step: '투자 성향', text: "지금 가장 관심 있는 투자 테마는 무엇인가요?", type: 'single', options: ['AI/반도체', '바이오/헬스', '2차전지', '배당주'], guideComment: "관심 테마는 좋지만, 원칙 없는 진입은 피하는 편이 안전합니다." },
        { id: 's6', step: '투자 성향', text: "손실이 발생했을 때 감내할 수 있는 수준은 어느 정도인가요?", type: 'single', options: ['-5%', '-10%', '-20%', '반토막도 감수'], guideComment: "감내할 수 있는 리스크 안에서만 투자하세요." },
    ],
    'life-balance': [
        { id: 'l1', step: '목표 설정', text: "지금 가장 간절한 삶의 목표는 무엇인가요?", type: 'single', options: ['내 집 마련', '경제적 자유', '건강한 삶', '커리어 성장'], guideComment: "목표가 선명해졌습니다. 이제 시간을 숫자로 바꾸는 단계입니다." },
        { id: 'l2', step: '목표 설정', text: "그 목표를 이루고 싶은 시점은 언제인가요?", type: 'single', options: ['1년 이내', '3년 이내', '5년 이내', '10년 이내'], guideComment: "데드라인이 없는 목표는 꿈에 불과합니다." },
        { id: 'l3', step: '목표 설정', text: "목표 달성을 위해 줄일 수 있는 지출은 어떤 것인가요?", type: 'single', options: ['외식/카페', '구독서비스', '쇼핑/의류', '없음'], guideComment: "작은 습관 하나만 바꿔도 목표 시점이 빨라질 수 있습니다." },
        { id: 'l4', step: '목표 설정', text: "목표를 위해 포기할 수 없는 가치는 무엇인가요?", type: 'single', options: ['건강', '가족시간', '워라밸', '돈'], guideComment: "포기할 수 없는 가치가 분명하니, 나머지는 조정 가능합니다." },
        { id: 'l5', step: '목표 설정', text: "목표가 이뤄진 날, 가장 먼저 하고 싶은 일은?", type: 'single', options: ['여행', '가족과 시간', '취미 몰입', '새로운 도전'], guideComment: "그 장면을 생생하게 상상해보세요. 힘이 될 겁니다." },
        { id: 'l6', step: '목표 설정', text: "지금 이 목표를 방해하는 가장 큰 습관은?", type: 'single', options: ['충동소비', '미루기', '과도한 야근', '무계획'], guideComment: "방해물을 알면 제거할 수 있습니다." },
    ]
};

const Wizard = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const categoryId = searchParams.get('category') || 'real-estate';
    const guide = GUIDES[categoryId] || GUIDES['real-estate'];

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [inputValue, setInputValue] = useState<any>('');
    const [isTyping, setIsTyping] = useState(true);
    const [displayedText, setDisplayedText] = useState('');
    const [viewportWidth, setViewportWidth] = useState<number>(
        typeof window !== 'undefined' ? window.innerWidth : 1024
    );

    const questions = useMemo(() => {
        const allQuestions = [...COMMON_QUESTIONS, ...(CATEGORY_QUESTIONS[categoryId] || [])];
        return allQuestions.filter(q => {
            if (!q.condition) return true;
            return q.condition(answers);
        });
    }, [categoryId, answers]);

    const currentQuestion = questions[currentStepIndex];
    const progress = ((currentStepIndex + 1) / questions.length) * 100;
    const isLastStep = currentStepIndex === questions.length - 1;
    const isMobile = viewportWidth <= 768;

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const onResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // 타이핑 효과
    useEffect(() => {
        if (!currentQuestion) return;
        const comment = isIntro ? guide.intro : (currentQuestion.guideComment || guide.intro);
        setIsTyping(true);
        setDisplayedText('');
        let idx = 0;
        const interval = setInterval(() => {
            idx++;
            setDisplayedText(comment.slice(0, idx));
            if (idx >= comment.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 30);
        return () => clearInterval(interval);
    }, [currentStepIndex, currentQuestion, guide.intro]);

    // Reset input when question changes
    useEffect(() => {
        if (currentQuestion) {
            setInputValue(answers[currentQuestion.id] || (currentQuestion.type === 'slider' ? 0 : ''));
        }
    }, [currentQuestion, answers]);

    const handleNext = () => {
        if (currentQuestion.type !== 'slider' && !inputValue && currentQuestion.type !== 'multi') return;

        const newAnswers = { ...answers, [currentQuestion.id]: inputValue };
        setAnswers(newAnswers);

        if (isLastStep) {
            navigate('/value-discovery', { state: { answers: newAnswers, categoryId } });
        } else {
            setCurrentStepIndex(prev => prev + 1);
            setInputValue('');
        }
    };

    const handleOptionSelect = (option: string) => {
        setInputValue(option);
        if (currentQuestion.type === 'single') {
            const newAnswers = { ...answers, [currentQuestion.id]: option };
            setAnswers(newAnswers);

            // 선택 상태를 잠깐 보여준 뒤 다음 스텝으로
            setTimeout(() => {
                if (isLastStep) {
                    navigate('/value-discovery', { state: { answers: newAnswers, categoryId } });
                } else {
                    setCurrentStepIndex(prev => prev + 1);
                }
            }, 500);
        }
    };

    const handleMultiSelect = (option: string) => {
        let currentSelected = Array.isArray(inputValue) ? inputValue : [];
        if (currentSelected.includes(option)) {
            currentSelected = currentSelected.filter((item: string) => item !== option);
        } else {
            currentSelected = [...currentSelected, option];
        }
        setInputValue(currentSelected as any);
    };

    if (!currentQuestion) return <div>Loading...</div>;

    const showChoices = currentQuestion.type === 'single' || currentQuestion.type === 'multi';
    const isIntro = currentQuestion.type === 'intro';

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100dvh',
                minHeight: '100dvh',
                overflow: isMobile ? 'auto' : 'hidden',
                WebkitOverflowScrolling: 'touch',
                fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
            }}
        >
            {/* === 배경 레이어 (순수 화이트) === */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#ffffff',
                }}
            />

            {/* 배경 장식 요소 */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `radial-gradient(circle at 15% 85%, ${guide.color}05 0%, transparent 40%), radial-gradient(circle at 85% 15%, ${guide.color}03 0%, transparent 40%)`,
                }}
            />

            {/* === 상단 UI === */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button
                        onClick={() => {
                            if (currentStepIndex > 0) {
                                setCurrentStepIndex(prev => prev - 1);
                            } else {
                                navigate('/');
                            }
                        }}
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
                        {currentStepIndex + 1} / {questions.length}
                    </div>
                </div>

                {/* 진행률 바 */}
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
                            background: `linear-gradient(90deg, ${guide.color}, ${guide.color}99)`,
                            borderRadius: 2,
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* === 캐릭터 이미지 (왼쪽 배치) === */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '2%',
                        height: showChoices ? (isMobile ? '46vh' : '60vh') : (isMobile ? '56vh' : '70vh'),
                        zIndex: 10,
                        pointerEvents: 'none',
                        display: isMobile ? 'none' : 'flex',
                        alignItems: 'flex-end',
                        transition: 'height 0.3s ease',
                    }}
                >
                    <img
                        src={guide.image}
                        alt={guide.name}
                        style={{
                            height: '100%',
                            width: 'auto',
                            maxWidth: 'none',
                            objectFit: 'contain',
                            objectPosition: 'bottom',
                            filter: 'drop-shadow(0 10px 40px rgba(0,0,0,0.5))',
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* === 선택지 영역 (프리미엄 카드 스타일) === */}
            <AnimatePresence mode='wait'>
                {showChoices && (
                    <motion.div
                        key={`choices-${currentQuestion.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        style={{
                            position: 'absolute',
                            top: isMobile ? 84 : '18%',
                            bottom: isMobile ? 'calc(154px + env(safe-area-inset-bottom))' : 'auto',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: isMobile ? 'calc(100% - 24px)' : '60%',
                            maxWidth: 480,
                            maxHeight: isMobile ? 'none' : '52vh',
                            zIndex: 45,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0,
                            overflowY: 'auto',
                        }}
                    >
                        {/* 질문 헤딩 */}
                        <div style={{
                            marginBottom: 20,
                            textAlign: 'center',
                        }}>
                            <h2 style={{
                                fontSize: 21,
                                fontWeight: 700,
                                color: '#1a1a2e',
                                lineHeight: 1.5,
                                margin: 0,
                                letterSpacing: '-0.02em',
                                wordBreak: 'keep-all',
                            }}>
                                {currentQuestion.text}
                            </h2>
                        </div>

                        {/* 선택지 카드 그리드 */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 10,
                        }}>
                            {currentQuestion.type === 'single' && currentQuestion.options?.map((opt, idx) => (
                                <motion.button
                                    key={opt}
                                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: 0.1 + idx * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
                                    onClick={() => handleOptionSelect(opt)}
                                    style={{
                                        background: inputValue === opt
                                            ? '#1e2a3a'
                                            : '#ffffff',
                                        border: inputValue === opt
                                            ? '1px solid #1e2a3a'
                                            : '1px solid #e5e7eb',
                                        borderRadius: 14,
                                        padding: '18px 16px',
                                        color: inputValue === opt ? '#ffffff' : '#2c2c3a',
                                        fontSize: 15,
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        letterSpacing: '-0.01em',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        minHeight: 64,
                                        display: 'flex',
                                        alignItems: 'flex-end',
                                        boxShadow: inputValue === opt
                                            ? '0 8px 25px rgba(30, 42, 58, 0.25)'
                                            : '0 1px 3px rgba(0,0,0,0.04)',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (inputValue !== opt) {
                                            e.currentTarget.style.borderColor = '#c5c8ce';
                                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (inputValue !== opt) {
                                            e.currentTarget.style.borderColor = '#e5e7eb';
                                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }
                                    }}
                                >
                                    {inputValue === opt && (
                                        <span style={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            width: 22,
                                            height: 22,
                                            borderRadius: '50%',
                                            border: '1.5px solid rgba(255,255,255,0.6)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <Check style={{ width: 13, height: 13, color: 'white' }} />
                                        </span>
                                    )}
                                    {opt}
                                </motion.button>
                            ))}

                            {currentQuestion.type === 'multi' && currentQuestion.options?.map((opt, idx) => {
                                const isSelected = Array.isArray(inputValue) && inputValue.includes(opt);
                                return (
                                    <motion.button
                                        key={opt}
                                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ delay: 0.1 + idx * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
                                        onClick={() => handleMultiSelect(opt)}
                                        style={{
                                            background: isSelected
                                                ? '#1e2a3a'
                                                : '#ffffff',
                                            border: isSelected
                                                ? '1px solid #1e2a3a'
                                                : '1px solid #e5e7eb',
                                            borderRadius: 14,
                                            padding: '18px 16px',
                                            color: isSelected ? '#ffffff' : '#2c2c3a',
                                            fontSize: 15,
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            letterSpacing: '-0.01em',
                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            position: 'relative',
                                            minHeight: 64,
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            boxShadow: isSelected
                                                ? '0 8px 25px rgba(30, 42, 58, 0.25)'
                                                : '0 1px 3px rgba(0,0,0,0.04)',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.borderColor = '#c5c8ce';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isSelected) {
                                                e.currentTarget.style.borderColor = '#e5e7eb';
                                                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }
                                        }}
                                    >
                                        {isSelected && (
                                            <span style={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                width: 22,
                                                height: 22,
                                                borderRadius: '50%',
                                                border: '1.5px solid rgba(255,255,255,0.6)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}>
                                                <Check style={{ width: 13, height: 13, color: 'white' }} />
                                            </span>
                                        )}
                                        <span>{opt}</span>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* multi 확인 버튼 */}
                        {currentQuestion.type === 'multi' && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                onClick={handleNext}
                                disabled={!inputValue || inputValue.length === 0}
                                style={{
                                    marginTop: 16,
                                    background: (!inputValue || inputValue.length === 0)
                                        ? '#f0f0f0'
                                        : '#1e2a3a',
                                    border: 'none',
                                    borderRadius: 14,
                                    padding: '16px 24px',
                                    color: (!inputValue || inputValue.length === 0) ? '#bbb' : 'white',
                                    fontSize: 15,
                                    fontWeight: 700,
                                    cursor: (!inputValue || inputValue.length === 0) ? 'not-allowed' : 'pointer',
                                    boxShadow: (!inputValue || inputValue.length === 0) ? 'none' : '0 4px 20px rgba(30,42,58,0.2)',
                                }}
                            >
                                선택 완료
                            </motion.button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* === 하단 대화창 === */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 40,
                }}
            >
                {/* 이름 태그 */}
                <div style={{
                    marginLeft: 24,
                    marginBottom: -1,
                    display: 'inline-block',
                    background: `linear-gradient(135deg, ${guide.color}, ${guide.color}dd)`,
                    padding: '8px 20px',
                    borderRadius: '12px 12px 0 0',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 14,
                    letterSpacing: '0.03em',
                    boxShadow: `0 -2px 10px ${guide.color}20`,
                }}>
                    {guide.nameKo}
                </div>

                {/* 대화 본문 */}
                <div
                    style={{
                        background: 'white',
                        borderTop: `2px solid ${guide.color}30`,
                        padding: isMobile ? '14px 16px calc(12px + env(safe-area-inset-bottom))' : '20px 28px 24px',
                        minHeight: isMobile ? 132 : 120,
                        boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
                    }}
                >
                    {/* 가이드 코멘트 (타이핑 효과) */}
                    <p style={{
                        color: '#1a1a2e',
                        fontSize: isMobile ? 14 : 16,
                        lineHeight: 1.6,
                        margin: 0,
                        fontWeight: 400,
                    }}>
                        {displayedText}
                        {isTyping && (
                            <span style={{
                                display: 'inline-block',
                                width: 8,
                                height: 18,
                                background: guide.color,
                                marginLeft: 2,
                                verticalAlign: 'text-bottom',
                                animation: 'blink 0.8s ease-in-out infinite',
                            }} />
                        )}
                    </p>

                    {/* 텍스트/숫자 입력 (선택지나 intro가 아닐 때) */}
                    {!showChoices && !isIntro && (
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentQuestion.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.3 }}
                                style={{ marginTop: 16 }}
                            >
                                {/* 질문 텍스트 */}
                                <div style={{
                                    color: '#888',
                                    fontSize: 13,
                                    fontWeight: 600,
                                    marginBottom: 10,
                                    letterSpacing: '0.02em',
                                }}>
                                    {currentQuestion.text}
                                </div>

                                {(currentQuestion.type === 'text' || currentQuestion.type === 'number') && (
                                    <div style={{ display: 'flex', gap: 10 }}>
                                        <input
                                            type={currentQuestion.type === 'number' ? 'number' : 'text'}
                                            placeholder={currentQuestion.placeholder || '입력해주세요...'}
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                                            autoFocus
                                            style={{
                                                flex: 1,
                                                background: '#f8f9fb',
                                                border: '1px solid #e2e5ea',
                                                borderRadius: 10,
                                                padding: '12px 16px',
                                                color: '#1a1a2e',
                                                fontSize: 15,
                                                fontWeight: 500,
                                                outline: 'none',
                                                fontFamily: 'inherit',
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor = guide.color;
                                                e.currentTarget.style.boxShadow = `0 0 10px ${guide.color}20`;
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor = '#e2e5ea';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        />
                                        <button
                                            onClick={handleNext}
                                            disabled={!inputValue}
                                            style={{
                                                background: inputValue
                                                    ? `linear-gradient(135deg, ${guide.color}, ${guide.color}dd)`
                                                    : '#f0f0f0',
                                                border: 'none',
                                                borderRadius: 10,
                                                padding: '12px 24px',
                                                color: inputValue ? 'white' : '#bbb',
                                                fontSize: 14,
                                                fontWeight: 700,
                                                cursor: inputValue ? 'pointer' : 'not-allowed',
                                                whiteSpace: 'nowrap',
                                                boxShadow: inputValue ? `0 4px 15px ${guide.color}25` : 'none',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {isLastStep ? '결과 보기' : '다음'}
                                        </button>
                                    </div>
                                )}

                                {currentQuestion.type === 'slider' && (
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 10,
                                        }}>
                                            <span style={{ color: '#bbb', fontSize: 12 }}>0</span>
                                            <span style={{
                                                color: guide.color,
                                                fontSize: 32,
                                                fontWeight: 800,
                                            }}>
                                                {inputValue || 0}
                                            </span>
                                            <span style={{ color: '#bbb', fontSize: 12 }}>100</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={inputValue || 0}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            style={{
                                                width: '100%',
                                                height: 6,
                                                borderRadius: 3,
                                                appearance: 'none',
                                                background: `linear-gradient(to right, ${guide.color} 0%, ${guide.color} ${inputValue || 0}%, #e2e5ea ${inputValue || 0}%, #e2e5ea 100%)`,
                                                cursor: 'pointer',
                                                outline: 'none',
                                            }}
                                        />
                                        <button
                                            onClick={handleNext}
                                            style={{
                                                marginTop: 12,
                                                width: '100%',
                                                background: `linear-gradient(135deg, ${guide.color}, ${guide.color}dd)`,
                                                border: 'none',
                                                borderRadius: 10,
                                                padding: '12px 24px',
                                                color: 'white',
                                                fontSize: 15,
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                boxShadow: `0 4px 15px ${guide.color}25`,
                                            }}
                                        >
                                            {isLastStep ? '결과 보기' : '다음'}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}

                    {/* intro 단계 시작하기 버튼 */}
                    {isIntro && !isTyping && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => {
                                setAnswers({ ...answers, [currentQuestion.id]: 'intro_done' });
                                setCurrentStepIndex(prev => prev + 1);
                            }}
                            style={{
                                marginTop: 16,
                                background: `linear-gradient(135deg, ${guide.color}, ${guide.color}dd)`,
                                border: 'none',
                                borderRadius: 12,
                                padding: '14px 32px',
                                color: 'white',
                                fontSize: 15,
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: `0 4px 15px ${guide.color}25`,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            시작하기
                        </motion.button>
                    )}
                </div>
            </div>

            {/* 블링크 커서 애니메이션 */}
            <style>{`
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                }
                input[type="range"]::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: white;
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                }
            `}</style>
        </div >
    );
};

export default Wizard;
