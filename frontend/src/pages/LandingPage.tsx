import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Globe } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center animate-fade-in relative">
      
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mb-12 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 z-10 text-center md:text-left">
          <div className="inline-block px-4 py-1.5 rounded-full glass border-purple-500/30 text-purple-300 text-sm font-semibold mb-6">
            ✨ Next-Gen Real Estate Protocol
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Tokenize Your <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Future Today.
            </span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto md:mx-0">
            DESTATE brings transparent, secure, and instant real estate transactions to the Stellar network using Soroban smart contracts. No middlemen. Pure ownership.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <Link to="/marketplace" className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2">
              <span>Explore Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/list" className="btn-secondary w-full sm:w-auto text-center">
              List Yours
            </Link>
          </div>
        </div>
        
        <div className="md:w-1/2 mt-16 md:mt-0 relative z-10 hidden md:block">
          {/* Mockup visual */}
          <div className="relative w-full max-w-md mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-2xl blur-2xl transform rotate-3 scale-105"></div>
            <div className="glass-card p-4">
              <img 
                src="https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800" 
                alt="Luxury Home" 
                className="rounded-xl w-full h-[400px] object-cover shadow-2xl"
              />
              <div className="absolute bottom-8 left-8 right-8 glass p-4 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-white font-bold">Beverly Hills Villa</p>
                  <p className="text-purple-300 text-sm">Tokenized Asset</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Price</p>
                  <p className="text-secondary font-bold">120,000 XLM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 text-center md:text-left">
          <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6 mx-auto md:mx-0">
            <Zap className="text-purple-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
          <p className="text-slate-400">Powered by the Stellar network, transactions settle in seconds with near-zero fractional fees.</p>
        </div>
        <div className="glass-card p-8 text-center md:text-left">
          <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6 mx-auto md:mx-0">
            <ShieldCheck className="text-blue-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Immutable Security</h3>
          <p className="text-slate-400">Smart contracts via Soroban enforce trustless logic, guaranteeing absolute property ledger security.</p>
        </div>
        <div className="glass-card p-8 text-center md:text-left">
          <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-6 mx-auto md:mx-0">
            <Globe className="text-green-400 w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Global Access</h3>
          <p className="text-slate-400">No borders. Anyone with Freighter Wallet can buy, sell, and verify property global ownership.</p>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
