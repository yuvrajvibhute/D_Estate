import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import {
  ArrowRight, Shield, Zap, Globe, TrendingUp, Building2,
  Users, CheckCircle, ChevronRight, Wallet, Star
} from 'lucide-react';

const STATS = [
  { label: 'Properties Listed', value: '2.4K+', icon: <Building2 size={20} /> },
  { label: 'Total Volume', value: '$142M', icon: <TrendingUp size={20} /> },
  { label: 'Active Users', value: '18K+', icon: <Users size={20} /> },
  { label: 'Networks', value: 'Stellar', icon: <Globe size={20} /> },
];

const FEATURES = [
  {
    icon: <Shield size={28} />,
    title: 'On-Chain Security',
    description: 'Every property transaction is recorded immutably on the Stellar blockchain. No intermediaries, no fraud, complete transparency.',
    color: '#6c63ff',
  },
  {
    icon: <Zap size={28} />,
    title: 'Instant Settlement',
    description: 'Stellar\'s 3-5 second block times mean property transactions settle faster than traditional wires. Global and frictionless.',
    color: '#06b6d4',
  },
  {
    icon: <Globe size={28} />,
    title: 'Global Access',
    description: 'Buy or sell real estate anywhere in the world with just a Freighter wallet. No banks, no borders, no bureaucracy.',
    color: '#f59e0b',
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'Low Transaction Fees',
    description: 'Stellar\'s micro-fee structure means you keep more of your investment. Typically under $0.01 per transaction.',
    color: '#4ade80',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Connect Wallet', desc: 'Install Freighter and connect your Stellar wallet in seconds.' },
  { step: '02', title: 'Browse Properties', desc: 'Explore verified listings on the blockchain marketplace.' },
  { step: '03', title: 'Purchase On-Chain', desc: 'Buy with XLM. Transaction is recorded immutably on Stellar.' },
  { step: '04', title: 'Own & Manage', desc: 'Your properties appear in your portfolio dashboard instantly.' },
];

const LandingPage: React.FC = () => {
  const { isWalletConnected, connectWallet, isConnecting } = useWallet();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      heroRef.current.style.setProperty('--mouse-x', `${x * 100}%`);
      heroRef.current.style.setProperty('--mouse-y', `${y * 100}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="grid-bg"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: '120px 24px 80px',
        }}
      >
        {/* Background orbs */}
        <div className="orb orb-purple" style={{ width: '500px', height: '500px', top: '-100px', left: '-100px', opacity: 0.4 }} />
        <div className="orb orb-cyan" style={{ width: '400px', height: '400px', bottom: '-50px', right: '-100px', opacity: 0.3 }} />
        <div className="orb orb-gold" style={{ width: '300px', height: '300px', top: '40%', left: '60%', opacity: 0.2 }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Tag */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <span className="badge badge-purple" style={{ padding: '8px 16px', fontSize: '12px' }}>
              <Star size={12} fill="currentColor" /> Built on Stellar Testnet
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 88px)',
            fontWeight: '900',
            fontFamily: "'Space Grotesk', sans-serif",
            lineHeight: '1.05',
            letterSpacing: '-0.03em',
            marginBottom: '24px',
          }}>
            <span style={{ color: '#f8fafc' }}>Real Estate, </span>
            <br />
            <span className="gradient-text">On the Blockchain.</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#64748b',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: '0 auto 48px',
          }}>
            The world's first decentralized real estate marketplace on Stellar.
            Buy, sell, and own properties with complete transparency — no intermediaries.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/marketplace" className="btn-primary" style={{ padding: '16px 32px', fontSize: '16px' }}>
              Explore Properties <ArrowRight size={18} />
            </Link>
            {!isWalletConnected ? (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-secondary"
                style={{ padding: '16px 32px', fontSize: '16px' }}
              >
                {isConnecting ? (
                  <><div className="spinner" style={{ width: '16px', height: '16px' }} /> Connecting...</>
                ) : (
                  <><Wallet size={18} /> Connect Wallet</>
                )}
              </button>
            ) : (
              <Link to="/list-property" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '16px' }}>
                <Building2 size={18} /> List Your Property
              </Link>
            )}
          </div>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '60px', flexWrap: 'wrap' }}>
            {['1,000+ XLM Volume', 'Stellar Testnet', 'Soroban Smart Contracts'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '13px' }}>
                <CheckCircle size={14} color="#4ade80" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px' }}>
          {STATS.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ color: '#6c63ff', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
              <div style={{ fontSize: '32px', fontWeight: '800', fontFamily: "'Space Grotesk', sans-serif", color: '#f8fafc', marginBottom: '4px' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#475569' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="section-title">Why DESTATE?</h2>
            <p style={{ color: '#475569', fontSize: '16px', maxWidth: '480px', margin: '12px auto 0' }}>
              The future of real estate is decentralized. Here's why thousands of buyers and sellers choose us.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {FEATURES.map((feat) => (
              <div key={feat.title} className="glass-card" style={{ padding: '32px 28px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: `${feat.color}20`,
                  border: `1px solid ${feat.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: feat.color,
                  marginBottom: '20px',
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', marginBottom: '10px', fontFamily: "'Space Grotesk', sans-serif" }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 className="section-title">How It Works</h2>
            <p style={{ color: '#475569', fontSize: '16px' }}>Four simple steps to own property on the blockchain.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', position: 'relative' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(167,139,250,0.1))',
                  border: '1px solid rgba(108,99,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#a78bfa',
                  margin: '0 auto 16px',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}>
                  {step.step}
                </div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>{step.title}</h4>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>{step.desc}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <ChevronRight
                    size={20}
                    color="#6c63ff"
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '-16px',
                      opacity: 0.5,
                      display: 'none',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '60px 40px',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(6,182,212,0.05) 100%)',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div className="orb orb-purple" style={{ width: '300px', height: '300px', top: '-50px', right: '-50px', opacity: 0.3 }} />
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: '900',
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#f8fafc',
            marginBottom: '16px',
            position: 'relative',
          }}>
            Ready to own property<br />on-chain?
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px', marginBottom: '40px', position: 'relative' }}>
            Join thousands of users buying and selling real estate on the Stellar blockchain.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <Link to="/marketplace" className="btn-primary" style={{ padding: '16px 32px', fontSize: '16px' }}>
              Start Exploring <ArrowRight size={18} />
            </Link>
            <Link to="/feedback" className="btn-secondary" style={{ padding: '16px 32px', fontSize: '16px' }}>
              Share Feedback
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        textAlign: 'center',
        color: '#374151',
        fontSize: '13px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
          <Zap size={16} color="#6c63ff" fill="#6c63ff" />
          <span style={{ fontWeight: '700', color: '#475569', fontFamily: "'Space Grotesk', sans-serif" }}>DESTATE</span>
          <span>— Decentralized Real Estate on Stellar Testnet</span>
        </div>
        <div style={{ marginTop: '8px', color: '#1f2937' }}>
          Built with ❤️ using React + Soroban + Stellar SDK
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
