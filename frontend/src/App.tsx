import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import MarketplacePage from './pages/MarketplacePage';
import ListPropertyPage from './pages/ListPropertyPage';
import DashboardPage from './pages/DashboardPage';
import FeedbackPage from './pages/FeedbackPage';
import './index.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <WalletProvider>
        <div style={{ minHeight: '100vh', background: 'var(--color-bg-primary)' }}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/list-property" element={<ListPropertyPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              {/* 404 */}
              <Route path="*" element={
                <div style={{
                  minHeight: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '16px',
                  paddingTop: '90px',
                }}>
                  <div style={{ fontSize: '80px', fontWeight: '900', color: '#1f2937', fontFamily: "'Space Grotesk'" }}>404</div>
                  <div style={{ fontSize: '20px', color: '#374151' }}>Page not found</div>
                  <a href="/" className="btn-primary" style={{ textDecoration: 'none' }}>Go Home</a>
                </div>
              } />
            </Routes>
          </main>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(10, 15, 30, 0.95)',
                backdropFilter: 'blur(20px)',
                color: '#f8fafc',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                fontSize: '14px',
                maxWidth: '380px',
              },
              success: {
                iconTheme: { primary: '#4ade80', secondary: '#0a0f1e' },
              },
              error: {
                iconTheme: { primary: '#ef4444', secondary: '#0a0f1e' },
              },
              loading: {
                iconTheme: { primary: '#6c63ff', secondary: '#0a0f1e' },
              },
            }}
          />
        </div>
      </WalletProvider>
    </BrowserRouter>
  );
};

export default App;
