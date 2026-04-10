import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import type { Property } from '../lib/supabase';
import { fetchPropertiesByOwner } from '../lib/supabase';
import { MOCK_PROPERTIES } from '../lib/mockData';
import { formatXLM, truncateAddress, getAccountBalance } from '../lib/stellar';
import {
  LayoutDashboard, Building2, TrendingUp, Wallet, ExternalLink,
  Copy, RefreshCw, PlusCircle, Star
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { isWalletConnected, publicKey, connectWallet, isConnecting } = useWallet();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!publicKey) return;
    setLoading(true);
    try {
      // Load balance
      const bal = await getAccountBalance(publicKey);
      setBalance(bal);

      // Load owned properties
      try {
        const owned = await fetchPropertiesByOwner(publicKey);
        if (owned.length === 0) {
          // Demo: show mock properties as if owned
          const demo = MOCK_PROPERTIES.slice(0, 2).map(p => ({ ...p, owner: publicKey }));
          setProperties(demo);
        } else {
          setProperties(owned);
        }
      } catch {
        const demo = MOCK_PROPERTIES.slice(0, 2).map(p => ({ ...p, owner: publicKey }));
        setProperties(demo);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [publicKey]);

  useEffect(() => {
    if (isWalletConnected && publicKey) loadDashboard();
  }, [isWalletConnected, publicKey, loadDashboard]);

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      toast.success('Address copied!');
    }
  };

  if (!isWalletConnected) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        paddingTop: '90px',
      }}>
        <div className="glass-card" style={{ maxWidth: '480px', padding: '48px', textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(108,99,255,0.15)',
            border: '1px solid rgba(108,99,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <LayoutDashboard size={36} color="#6c63ff" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '12px' }}>
            Your Dashboard
          </h2>
          <p style={{ color: '#475569', marginBottom: '32px', lineHeight: '1.6' }}>
            Connect your Freighter wallet to view your property portfolio, balance, and transaction history.
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
          >
            {isConnecting ? (
              <><div className="spinner" style={{ width: '18px', height: '18px' }} /> Connecting...</>
            ) : (
              <><Wallet size={18} /> Connect Freighter Wallet</>
            )}
          </button>
        </div>
      </div>
    );
  }

  const totalValue = properties.reduce((sum, p) => sum + p.price, 0);

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
          <div>
            <h1 className="section-title" style={{ fontSize: '2.5rem' }}>Dashboard</h1>
            <p style={{ color: '#475569', marginTop: '8px' }}>Manage your real estate portfolio on Stellar testnet</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={loadDashboard} className="btn-secondary" style={{ padding: '10px 16px', fontSize: '13px' }}>
              <RefreshCw size={14} /> Refresh
            </button>
            <Link to="/list-property" className="btn-primary" style={{ padding: '10px 16px', fontSize: '13px' }}>
              <PlusCircle size={14} /> List Property
            </Link>
          </div>
        </div>

        {/* Wallet Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(6,182,212,0.08) 100%)',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: '20px',
          padding: '28px 32px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div className="orb orb-purple" style={{ width: '300px', height: '300px', top: '-100px', right: '-50px', opacity: 0.3 }} />

          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Connected Wallet
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#4ade80',
                boxShadow: '0 0 10px #4ade80',
              }} />
              <span style={{ fontSize: '15px', color: '#a78bfa', fontFamily: 'monospace' }}>
                {truncateAddress(publicKey!, 12)}
              </span>
              <button onClick={handleCopyAddress} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '2px' }}>
                <Copy size={14} />
              </button>
              <a
                href={`https://stellar.expert/explorer/testnet/account/${publicKey}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#475569', display: 'flex' }}
              >
                <ExternalLink size={14} />
              </a>
            </div>
            <div style={{ fontSize: '12px', color: '#374151' }}>Stellar Testnet</div>
          </div>

          {balance !== null && (
            <div style={{ textAlign: 'right', position: 'relative' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                Balance
              </div>
              <div style={{
                fontSize: '36px',
                fontWeight: '900',
                fontFamily: "'Space Grotesk', sans-serif",
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {formatXLM(balance)}
              </div>
              <div style={{ fontSize: '12px', color: '#374151' }}>
                ≈ ${(balance * 0.11).toFixed(2)} USD
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Properties Owned', value: properties.length, icon: <Building2 size={20} />, color: '#6c63ff' },
            { label: 'Portfolio Value', value: formatXLM(totalValue), icon: <TrendingUp size={20} />, color: '#f59e0b' },
            { label: 'Available Balance', value: balance !== null ? formatXLM(balance) : '—', icon: <Wallet size={20} />, color: '#06b6d4' },
            { label: 'Network', value: 'Testnet', icon: <Star size={20} />, color: '#4ade80' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#475569', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', fontFamily: "'Space Grotesk', sans-serif" }}>
                    {stat.value}
                  </div>
                </div>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: `${stat.color}15`,
                  border: `1px solid ${stat.color}25`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: stat.color,
                }}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Properties Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc', fontFamily: "'Space Grotesk', sans-serif" }}>
              My Properties
            </h2>
            <span className="badge badge-purple">{properties.length} owned</span>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card shimmer" style={{ height: '380px' }} />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <Building2 size={48} color="#374151" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>No properties yet</h3>
              <p style={{ color: '#374151', marginBottom: '24px' }}>
                Start building your real estate portfolio on the Stellar blockchain.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link to="/marketplace" className="btn-primary">Browse Marketplace</Link>
                <Link to="/list-property" className="btn-secondary">List a Property</Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onView={setSelectedProperty}
                  isOwned={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Feedback section */}
        <div style={{
          marginTop: '40px',
          padding: '32px',
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.03) 100%)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fbbf24', marginBottom: '4px' }}>
              🌟 Share Your Feedback
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b' }}>Help us improve DESTATE by sharing your experience.</p>
          </div>
          <Link to="/feedback" className="btn-gold" style={{ flexShrink: 0 }}>
            Give Feedback
          </Link>
        </div>
      </div>

      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        isOwned={true}
        currentUserKey={publicKey}
      />
    </div>
  );
};

export default DashboardPage;
