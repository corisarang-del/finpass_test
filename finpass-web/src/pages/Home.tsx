import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import home1 from '../assets/images/home1.jpg';
import home2 from '../assets/images/home2.jpg';
import home3 from '../assets/images/home3.jpg';
import 부동산Image from '../assets/images/부동산.jpg';
import 기초자산Image from '../assets/images/기초자산.jpg';
import 주식Image from '../assets/images/주식.jpg';
import 라이프Image from '../assets/images/라이프.jpg';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromOnboarding = (location.state as { fromOnboarding?: boolean } | undefined)?.fromOnboarding === true;
  const [sequenceStep, setSequenceStep] = useState(fromOnboarding ? 3 : 0);
  const [isHeroReady, setIsHeroReady] = useState(fromOnboarding);

  const categories = [
    { id: 'real-estate', title: '부동산', sub: '현실 점검', desc: '내 집 마련', image: 부동산Image },
    { id: 'insurance', title: '기초자산', sub: '안전 확보', desc: '위험 방어', image: 기초자산Image },
    { id: 'stock', title: '주식', sub: '자산 증식', desc: '속도 조절', image: 주식Image },
    { id: 'life-balance', title: '라이프', sub: '균형 잡기', desc: '삶의 목표', image: 라이프Image },
  ];

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

  const heroContent = [
    { id: 0, title: '당신의 삶을 데이터로 읽다', tag: 'DATA INTELLIGENCE', bgImage: home1 },
    { id: 1, title: '보이지 않던 길이 열리다', tag: 'STRATEGIC ROADMAP', bgImage: home2 },
    { id: 2, title: '꿈꾸던 미래를 현실의 전략으로', tag: 'FUTURE REALITY', bgImage: home3 },
    { id: 3, title: '인생 지도를 그려보세요', tag: 'SELECT YOUR JOURNEY', bgImage: home3 },
  ];

  const currentContent = heroContent[sequenceStep > 2 ? 3 : sequenceStep];
  const bgImage = sequenceStep === 3 ? heroContent[2].bgImage : currentContent.bgImage;

  return (
    <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden fixed inset-0">
      <AnimatePresence mode="popLayout">
        {sequenceStep < 3 && isHeroReady && (
          <motion.div
            key={currentContent.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.02, ease: 'easeInOut' }}
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
        <div
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
        </div>
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
              transition={{ duration: 0.51 }}
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
            transition={{ duration: 0.68 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 40,
              display: 'flex',
              flexDirection: 'column',
              margin: 0,
              padding: 0,
              overflow: 'hidden',
            }}
          >
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + idx * 0.1, duration: 0.6, ease: 'easeOut' }}
                onClick={() => navigate(`/wizard?category=${cat.id}`)}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '25vh',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  margin: 0,
                  padding: 0,
                  border: 'none',
                }}
                className="group"
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${cat.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  className="opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60 group-hover:from-black/20 group-hover:via-black/30 group-hover:to-black/40 transition-all duration-500" />

                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '8px 16px' }}>
                  <div className="flex flex-col items-center justify-center space-y-1 transform transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-105">
                    <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase px-2 py-1 border border-white/30 rounded-full bg-black/30 backdrop-blur-sm whitespace-nowrap opacity-80 group-hover:opacity-100 group-hover:border-white/50 transition-all duration-500">
                      {cat.sub}
                    </span>
                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-none drop-shadow-2xl text-center">{cat.title}</h3>
                    <p className="text-xs md:text-sm text-gray-200 font-medium opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-500 delay-100">{cat.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
