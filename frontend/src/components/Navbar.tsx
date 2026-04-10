import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { truncateAddress } from '../lib/stellar';
import {
  Home, Building2, PlusCircle, LayoutDashboard, Wallet,
  Copy, ExternalLink, LogOut, Menu, X, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const { publicKey, isWalletConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [walletDropdown, setWalletDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      toast.success('Address copied!');
    }
  };

  const handleViewExplorer = () => {
    if (publicKey) {
      window.open(`https://stellar.expert/explorer/testnet/account/${publicKey}`, '_blank');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <Home size={16} /> },
    { to: '/marketplace', label: 'Marketplace', icon: <Building2 size={16} /> },
    { to: '/list-property', label: 'List Property', icon: <PlusCircle size={16} /> },
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled
          ? 'rgba(5, 8, 20, 0.95)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(255,255,255,0.06)'
          : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo */}
      <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Zap size={18} color="white" fill="white" />
        </div>
        <span style={{
          fontSize: '20px',
          fontWeight: '800',
          fontFamily: "'Space Grotesk', sans-serif",
          background: 'linear-gradient(135deg, #f8fafc, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.02em',
        }}>
          DESTATE
        </span>
      </NavLink>

      {/* Desktop Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Wallet Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {isWalletConnected && publicKey ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setWalletDropdown(!walletDropdown)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(108, 99, 255, 0.15)',
                border: '1px solid rgba(108, 99, 255, 0.3)',
                borderRadius: '10px',
                color: '#a78bfa',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: '8px',
                height: '8px',
                background: '#4ade80',
                borderRadius: '50%',
                boxShadow: '0 0 8px #4ade80',
              }} />
              {truncateAddress(publicKey)}
              <Wallet size={14} />
            </button>

            {/* Dropdown */}
            {walletDropdown && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                minWidth: '260px',
                background: 'rgba(10, 15, 30, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '16px',
                zIndex: 1001,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}>
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Connected Wallet
                  </div>
                  <div style={{ fontSize: '13px', color: '#a78bfa', fontWeight: '500', wordBreak: 'break-all' }}>
                    {publicKey}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button onClick={handleCopyAddress} className="btn-secondary" style={{ justifyContent: 'center', fontSize: '13px', padding: '8px 12px' }}>
                    <Copy size={14} /> Copy Address
                  </button>
                  <button onClick={handleViewExplorer} className="btn-secondary" style={{ justifyContent: 'center', fontSize: '13px', padding: '8px 12px' }}>
                    <ExternalLink size={14} /> View on Explorer
                  </button>
                  <button onClick={() => { disconnectWallet(); setWalletDropdown(false); }} className="btn-danger" style={{ justifyContent: 'center' }}>
                    <LogOut size={14} /> Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '13px' }}
          >
            {isConnecting ? (
              <><div className="spinner" style={{ width: '14px', height: '14px' }} /> Connecting...</>
            ) : (
              <><Wallet size={14} /> Connect Wallet</>
            )}
          </button>
        )}

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 20, 0.97)',
          backdropFilter: 'blur(20px)',
          zIndex: 999,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', fontSize: '16px' }}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
