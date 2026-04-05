 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Marketplace from './pages/Marketplace';
import ListProperty from './pages/ListProperty';
import Dashboard from './pages/Dashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Background ambient light */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none"></div>
        
        <Navbar />
        <main className="flex-grow z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/list" element={<ListProperty />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        
        {/* Simple Footer */}
        <footer className="border-t border-slate-800/50 py-6 text-center text-slate-400 text-sm z-10 glass mt-12 bg-slate-900/50">
          <p>© 2026 DESTATE. Powered by Stellar Soroban.</p>
          <div className="mt-2 text-primary-dark">
            <a href="https://forms.gle/your-mock-form-link" target="_blank" rel="noreferrer" className="hover:text-purple-400 transition-colors">
              Submit Feedback
            </a>
          </div>
        </footer>
      </div>
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#fff',
          border: '1px solid #334155'
        }
      }}/>
    </Router>
  );
}

export default App;
