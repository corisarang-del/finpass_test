import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Wizard = lazy(() => import('./pages/Wizard'));
const Result = lazy(() => import('./pages/Result'));
const FinalAnalysis = lazy(() => import('./pages/FinalAnalysis'));
const LiveSimulation = lazy(() => import('./pages/LiveSimulation'));
const ActionPlanDetail = lazy(() => import('./pages/ActionPlanDetail'));
const ValueDiscovery = lazy(() => import('./pages/ValueDiscovery'));
const VisionBoard = lazy(() => import('./pages/VisionBoard'));
const CheckupConsent = lazy(() => import('./pages/CheckupConsent'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e2f49', fontFamily: "'Pretendard', 'SUIT', sans-serif" }}>불러오는 중입니다...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/wizard" element={<Wizard />} />
          <Route path="/value-discovery" element={<ValueDiscovery />} />
          <Route path="/vision-board" element={<VisionBoard />} />
          <Route path="/result" element={<Result />} />
          <Route path="/simulation" element={<LiveSimulation />} />
          <Route path="/final-analysis" element={<FinalAnalysis />} />
          <Route path="/checkup-consent" element={<CheckupConsent />} />
          <Route path="/action-plan-detail" element={<ActionPlanDetail />} />
        </Routes>
      </Suspense>
    </Router>
  );
}


export default App;
