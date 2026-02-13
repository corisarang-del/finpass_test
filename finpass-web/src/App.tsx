import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import Wizard from './pages/Wizard';
import Result from './pages/Result';
import FinalAnalysis from './pages/FinalAnalysis';
import LiveSimulation from './pages/LiveSimulation';
import ActionPlanDetail from './pages/ActionPlanDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/wizard" element={<Wizard />} />
        <Route path="/result" element={<Result />} />
        <Route path="/simulation" element={<LiveSimulation />} />
        <Route path="/final-analysis" element={<FinalAnalysis />} />
        <Route path="/action-plan-detail" element={<ActionPlanDetail />} />
      </Routes>
    </Router>
  );
}


export default App;
