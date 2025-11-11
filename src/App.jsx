import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import CVUpload from './pages/CVUpload';
import ResultsDashboard from './pages/ResultsDashboard';
import CVBuilder from './pages/CVBuilder';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<CVUpload />} />
            <Route path="/results" element={<ResultsDashboard />} />
            <Route path="/cv-builder" element={<CVBuilder />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
