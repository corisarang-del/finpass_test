import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import home1 from '../assets/images/home1.jpg';
import home2 from '../assets/images/home2.jpg';
import home3 from '../assets/images/home3.jpg';
import 부동산Image from '../assets/images/부동산.jpg';
import 기초자산Image from '../assets/images/기초자산.jpg';
import 주식Image from '../assets/images/주식.jpg';
import 라이프Image from '../assets/images/라이프.jpg';

// 렌더마다 새 참조 생성을 막기 위해 컴포넌트 외부에 선언
const CATEGORIES = [
  { id: 'real-estate', title: '부동산', sub: '현실 점검', desc: '내 집 마련', image: 부동산Image },
  { id: 'insurance', title: '기초자산', sub: '안전 확보', desc: '위험 방어', image: 기초자산Image },
  { id: 'stock', title: '주식', sub: '자산 증식', desc: '속도 조절', image: 주식Image },
  { id: 'life-balance', title: '라이프', sub: '균형 잡기', desc: '삶의 목표', image: 라이프Image },
] as const;

const HERO_CONTENT = [
  { id: 0, title: '당신의 삶을 데이터로 읽다', tag: 'DATA INTELLIGENCE', bgImage: home1 },
  { id: 1, title: '보이지 않던 길이 열리다', tag: 'STRATEGIC ROADMAP', bgImage: home2 },
  { id: 2, title: '꿈꾸던 미래를 현실의 전략으로', tag: 'FUTURE REALITY', bgImage: home3 },
  { id: 3, title: '인생 지도를 그려보세요', tag: 'SELECT YOUR JOURNEY', bgImage: home3 },
] as const;

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  // prefers-reduced-motion 준수: 모션 감소 선호 시 duration을 0으로
  const dur = (ms: number) => (shouldReduceMotion ? 0 : ms);
  const fromOnboarding = (location.state as { fromOnboarding?: boolean } | undefined)?.fromOnboarding === true;
  const [sequenceStep, setSequenceStep] = useState(fromOnboarding ? 3 : 0);
  const [isHeroReady, setIsHeroReady] = useState(fromOnboarding);

  useEffect(() => {
    if (fromOnboarding) return undefined;

    let cancelled = false;
    const firstImage = new Image();
    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled) setIsHeroReady(true);
    }, 1200);

    firstImage.onload = () => {
      if (!cancelled) setIsHeroReady(true);
      window.clearTimeout(fallbackTimer);
    };
    firstImage.onerror = () => {
      if (!cancelled) setIsHeroReady(true);
      window.clearTimeout(fallbackTimer);
    };
    firstImage.src = home1;

    return () => {
      cancelled = true;
      window.clearTimeout(fallbackTimer);
    };
  }, [fromOnboarding]);

  useEffect(() => {
    if (sequenceStep < 3 && isHeroReady) {
      const timer = setTimeout(() => {
        if (sequenceStep === 2) {
          navigate('/onboarding');
        } else {
          setSequenceStep((prev) => prev + 1);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [sequenceStep, navigate, isHeroReady]);

  const currentContent = HERO_CONTENT[sequenceStep > 2 ? 3 : sequenceStep];
  const bgImage = sequenceStep === 3 ? HERO_CONTENT[2].bgImage : currentContent.bgImage;

  return (
    <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden fixed inset-0">
      <AnimatePresence mode="popLayout">
        {sequenceStep < 3 && isHeroReady && (
          <motion.div
            key={currentContent.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur(1.02), ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full z-0"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(1.15) contrast(1.05) saturate(1.05)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.28) 100%)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <nav
        aria-label="주 네비게이션"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 60,
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'Outfit, Inter, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          }}
        >
          FinPass
        </span>
      </nav>

      <AnimatePresence mode="wait">
        {sequenceStep < 3 && isHeroReady && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              key={currentContent.id}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
              transition={{ duration: dur(0.51) }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                width: '100%',
                maxWidth: 1200,
                margin: '0 auto',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  marginBottom: 16,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  textAlign: 'center',
                  fontFamily: '"Sora", "Outfit", "Pretendard", sans-serif',
                  color: 'rgba(255,255,255,0.95)',
                  textShadow: '0 2px 10px rgba(0,0,0,0.75)',
                }}
              >
                {currentContent.tag}
              </span>
              <h1
                style={{
                  fontFamily: '"Sora", "Pretendard", "SUIT", sans-serif',
                  fontSize: 'clamp(34px, 4.2vw, 72px)',
                  fontWeight: 800,
                  lineHeight: 1.16,
                  whiteSpace: 'pre-wrap',
                  textAlign: 'center',
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  textShadow: '0 4px 20px rgba(0,0,0,0.92), 0 8px 34px rgba(0,0,0,0.55)',
                }}
              >
                {currentContent.title}
              </h1>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sequenceStep === 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: dur(0.68) }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 40,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '72px 32px 28px',
              overflow: 'hidden',
              background: '#0d1117',
            }}
          >
            {/* 배경 텍스처 */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${home3})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.07,
                zIndex: 0,
              }}
            />

            {/* 헤더 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dur(0.2), duration: dur(0.6) }}
              style={{
                position: 'relative',
                zIndex: 1,
                textAlign: 'center',
                marginBottom: 'clamp(20px, 3.5vh, 44px)',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.38)',
                  marginBottom: '12px',
                  fontFamily: '"Outfit", sans-serif',
                }}
              >
                SELECT YOUR JOURNEY
              </p>
              <h2
                style={{
                  fontFamily: '"Sora", "Pretendard", sans-serif',
                  fontSize: 'clamp(22px, 3vw, 44px)',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.15,
                  margin: 0,
                  textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                }}
              >
                인생 지도를 그려보세요
              </h2>
            </motion.div>

            {/* 카드 그리드 */}
            <div
              className="grid grid-cols-2 md:grid-cols-4"
              style={{
                position: 'relative',
                zIndex: 1,
                gap: 'clamp(10px, 1.5vw, 16px)',
                width: '100%',
                maxWidth: '1080px',
                height: 'clamp(220px, 52vh, 420px)',
              }}
            >
              {CATEGORIES.map((cat, idx) => (
                <motion.div
                  key={cat.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${cat.title} — ${cat.desc} 가이드 시작하기`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dur(0.3 + idx * 0.08), duration: dur(0.55), ease: 'easeOut' }}
                  whileHover={shouldReduceMotion ? {} : { y: -8, transition: { duration: 0.2, ease: 'easeOut' } }}
                  onClick={() => navigate(`/wizard?category=${cat.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/wizard?category=${cat.id}`);
                    }
                  }}
                  style={{
                    position: 'relative',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: '100%',
                    background: '#1a2233',
                  }}
                  className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117]"
                >
                  {/* 배경 이미지 */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: `url(${cat.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    className="transition-transform duration-500 ease-out group-hover:scale-105"
                  />

                  {/* 그라디언트 오버레이 */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.75) 100%)',
                    }}
                    className="transition-opacity duration-500 group-hover:opacity-90"
                  />

                  {/* 호버 테두리 */}
                  <div className="absolute inset-0 border border-white/0 group-hover:border-white/20 transition-colors duration-500" style={{ borderRadius: '14px' }} />

                  {/* 텍스트 */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: 'clamp(12px, 2vh, 20px) clamp(12px, 1.5vw, 18px)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.6)',
                        fontFamily: '"Outfit", sans-serif',
                      }}
                    >
                      {cat.sub}
                    </span>
                    <h3
                      style={{
                        fontFamily: '"Sora", "Pretendard", sans-serif',
                        fontSize: 'clamp(15px, 1.8vw, 22px)',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '-0.01em',
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {cat.title}
                    </h3>
                    <p
                      className="opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-[opacity,transform] duration-300 delay-75"
                      style={{
                        margin: 0,
                        fontFamily: '"Pretendard", sans-serif',
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.65)',
                      }}
                    >
                      {cat.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* 하단 힌트 */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.38 }}
              transition={{ delay: dur(0.9), duration: dur(0.6) }}
              style={{
                position: 'relative',
                zIndex: 1,
                marginTop: 'clamp(14px, 2.5vh, 30px)',
                fontSize: '13px',
                color: 'rgba(255,255,255,0.38)',
                fontFamily: '"Pretendard", sans-serif',
                letterSpacing: '0.015em',
                textAlign: 'center',
              }}
            >
              원하는 영역을 선택하면 함께 전략을 세워드립니다
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isHeroReady && sequenceStep < 3 && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 55,
            background: 'radial-gradient(circle at 50% 30%, #1a2441 0%, #0a0f1e 55%, #04070f 100%)',
          }}
        />
      )}
    </div>
  );
};

export default Home;
