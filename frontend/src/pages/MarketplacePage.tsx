import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../context/WalletContext';
import PropertyCard from '../components/PropertyCard';
import PropertyModal from '../components/PropertyModal';
import type { Property } from '../lib/supabase';
import { fetchProperties } from '../lib/supabase';
import { MOCK_PROPERTIES } from '../lib/mockData';
import {
  buildPaymentTransaction, submitTransaction,
  getAccountBalance, formatXLM
} from '../lib/stellar';
import { Search, SlidersHorizontal, Building2, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const FILTER_TYPES = ['All', 'Apartment', 'Villa', 'Penthouse', 'Condo', 'Loft', 'Estate', 'Chalet', 'Smart Home'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

const MarketplacePage: React.FC = () => {
  const { isWalletConnected, publicKey, connectWallet, signTx } = useWallet();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [useMock, setUseMock] = useState(false);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchProperties();
      if (data.length === 0) {
        setProperties(MOCK_PROPERTIES);
        setUseMock(true);
      } else {
        setProperties(data);
        setUseMock(false);
      }
    } catch {
      setProperties(MOCK_PROPERTIES);
      setUseMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProperties(); }, [loadProperties]);

  // Apply filters
  useEffect(() => {
    let result = [...properties];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (selectedType !== 'All') {
      result = result.filter(p => p.property_type === selectedType);
    }

    if (maxPrice !== '') {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        default: return 0;
      }
    });

    setFiltered(result);
  }, [properties, searchQuery, selectedType, sortBy, maxPrice]);

  const handleBuy = async (property: Property) => {
    if (!isWalletConnected || !publicKey) {
      toast.error('Please connect your wallet first');
      await connectWallet();
      return;
    }

    if (property.owner === publicKey) {
      toast.error('You already own this property');
      return;
    }

    setBuyingId(property.id);
    const toastId = toast.loading('Building transaction...');

    try {
      // Check balance
      const balance = await getAccountBalance(publicKey);
      if (balance < property.price + 2) {
        toast.error(`Insufficient balance. You need at least ${formatXLM(property.price + 2)} XLM.`, { id: toastId });
        return;
      }

      toast.loading('Sign transaction in Freighter...', { id: toastId });
      const xdr = await buildPaymentTransaction(publicKey, property.owner, property.price);
      const signedXdr = await signTx(xdr);

      toast.loading('Submitting to Stellar network...', { id: toastId });
      const txHash = await submitTransaction(signedXdr);

      toast.success(
        `🎉 Property purchased! TX: ${txHash.slice(0, 8)}...`,
        { id: toastId, duration: 8000 }
      );

      // Refresh
      await loadProperties();
      setSelectedProperty(null);
    } catch (err: any) {
      const msg = err?.message || 'Transaction failed';
      if (msg.includes('install') || msg.includes('Freighter')) {
        toast.error('Please install the Freighter wallet extension', { id: toastId });
      } else if (msg.includes('reject') || msg.includes('cancel')) {
        toast.error('Transaction cancelled', { id: toastId });
      } else {
        toast.error(msg, { id: toastId });
      }
    } finally {
      setBuyingId(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setSortBy('newest');
    setMaxPrice('');
  };

  const activeFilterCount = [
    searchQuery !== '',
    selectedType !== 'All',
    maxPrice !== '',
    sortBy !== 'newest',
  ].filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', paddingBottom: '60px' }}>
      {/* Header */}
      <div style={{
        padding: '40px 24px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <div>
            <h1 className="section-title" style={{ fontSize: '2.5rem' }}>Property Marketplace</h1>
            <p style={{ color: '#475569', marginTop: '8px' }}>
              {useMock
                ? `Showing ${filtered.length} demo properties (connect Supabase for live data)`
                : `${filtered.length} properties available on Stellar testnet`}
            </p>
          </div>
          <button
            onClick={loadProperties}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', fontSize: '13px' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {/* Search + Filter bar */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input
              type="text"
              placeholder="Search properties by title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '40px' }}
              id="marketplace-search"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
            style={{ width: 'auto', minWidth: '180px' }}
            id="marketplace-sort"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={activeFilterCount > 0 ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '10px 16px', fontSize: '13px', position: 'relative' }}
            id="marketplace-filters-btn"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '20px',
                height: '20px',
                background: '#f59e0b',
                borderRadius: '50%',
                fontSize: '11px',
                fontWeight: '700',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="btn-danger" style={{ padding: '10px 16px', fontSize: '13px' }}>
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div style={{
            marginTop: '16px',
            padding: '20px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
          }}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div>
                <label className="label">Property Type</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {FILTER_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: '1px solid',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: selectedType === type ? 'rgba(108,99,255,0.2)' : 'transparent',
                        borderColor: selectedType === type ? 'rgba(108,99,255,0.5)' : 'rgba(255,255,255,0.1)',
                        color: selectedType === type ? '#a78bfa' : '#64748b',
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label" htmlFor="max-price-filter">Max Price (XLM)</label>
                <input
                  id="max-price-filter"
                  type="number"
                  placeholder="e.g. 5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  className="input-field"
                  style={{ width: '160px' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card shimmer" style={{ height: '420px' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <Building2 size={48} color="#374151" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#475569', marginBottom: '8px' }}>No properties found</h3>
            <p style={{ color: '#374151', marginBottom: '24px' }}>Try adjusting your filters or search query</p>
            <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onBuy={handleBuy}
                onView={setSelectedProperty}
                isOwned={publicKey === property.owner}
                isBuying={buyingId === property.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Modal */}
      <PropertyModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onBuy={handleBuy}
        isOwned={selectedProperty ? publicKey === selectedProperty.owner : false}
        isBuying={buyingId === selectedProperty?.id}
        currentUserKey={publicKey}
      />
    </div>
  );
};

export default MarketplacePage;
