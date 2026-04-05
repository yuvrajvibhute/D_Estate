import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useFreighter } from '../hooks/useFreighter';
import { Wallet, Home, LayoutDashboard, PlusCircle, Building } from 'lucide-react';

const Navbar: React.FC = () => {
  const { address, isWalletConnected, connect, loading } = useFreighter();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const truncateAddress = (addr: any) => {
    if (!addr) return '';
    const str = typeof addr === 'object' ? addr.address || addr.publicKey || String(addr) : String(addr);
    if (!str || str.length < 10) return str;
    return `${str.slice(0, 6)}...${str.slice(-4)}`;
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
              <Building className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
              DESTATE
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link 
              to="/marketplace" 
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${isActive('/marketplace') ? 'text-primary' : 'text-slate-300 hover:text-white'}`}
            >
              <Home className="w-4 h-4" />
              <span>Explore</span>
            </Link>
            <Link 
              to="/list" 
              className={`flex items-center space-x-1 text-sm font-medium transition-colors ${isActive('/list') ? 'text-primary' : 'text-slate-300 hover:text-white'}`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Property</span>
            </Link>
            {isWalletConnected && (
              <Link 
                to="/dashboard" 
                className={`flex items-center space-x-1 text-sm font-medium transition-colors ${isActive('/dashboard') ? 'text-primary' : 'text-slate-300 hover:text-white'}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Wallet Button */}
          <div className="flex items-center">
            {isWalletConnected ? (
              <div className="glass px-4 py-2 rounded-full flex items-center space-x-2 border border-purple-500/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-sm font-mono text-purple-200">{truncateAddress(address || '')}</span>
              </div>
            ) : (
              <button 
                onClick={connect}
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>{loading ? 'Connecting...' : 'Connect Freighter'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
