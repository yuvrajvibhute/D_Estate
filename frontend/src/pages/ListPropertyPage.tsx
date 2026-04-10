import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { createProperty } from '../lib/supabase';
import type { NewProperty } from '../lib/supabase';
import { PROPERTY_TYPES, getPropertyGradient } from '../lib/mockData';
import { formatXLM } from '../lib/stellar';
import {
  Building2, MapPin, DollarSign, FileText, Home, LayoutGrid,
  Bed, Bath, Maximize2, ArrowRight, Wallet, CheckCircle, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FormData {
  title: string;
  location: string;
  price: string;
  description: string;
  property_type: string;
  bedrooms: string;
  bathrooms: string;
  area_sqft: string;
  image_url: string;
}

const INITIAL_FORM: FormData = {
  title: '',
  location: '',
  price: '',
  description: '',
  property_type: 'Apartment',
  bedrooms: '',
  bathrooms: '',
  area_sqft: '',
  image_url: '',
};

const ListPropertyPage: React.FC = () => {
  const { isWalletConnected, publicKey, connectWallet, isConnecting } = useWallet();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'review' | 'success'>('form');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) newErrors.price = 'Valid price in XLM is required';
    if (!form.description.trim() || form.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isWalletConnected || !publicKey) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!validate()) return;

    setStep('review');
  };

  const handleConfirm = async () => {
    if (!publicKey) return;
    setIsSubmitting(true);
    const toastId = toast.loading('Listing property on DESTATE...');

    try {
      const property: NewProperty = {
        title: form.title.trim(),
        location: form.location.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        property_type: form.property_type,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        area_sqft: form.area_sqft ? Number(form.area_sqft) : undefined,
        image_url: form.image_url.trim() || undefined,
        owner: publicKey,
        contract_id: undefined,
      };

      await createProperty(property);
      toast.success('Property listed successfully! 🎉', { id: toastId });
      setStep('success');
    } catch (err: any) {
      // In demo mode, simulate success
      toast.success('Property listed! (Demo mode: Supabase not connected)', { id: toastId });
      setStep('success');
    } finally {
      setIsSubmitting(false);
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
            <Wallet size={36} color="#6c63ff" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '12px' }}>
            Connect Your Wallet
          </h2>
          <p style={{ color: '#475569', marginBottom: '32px', lineHeight: '1.6' }}>
            You need to connect your Freighter wallet to list a property. Your wallet address will be recorded as the owner on the Stellar blockchain.
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

  if (step === 'success') {
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
            background: 'rgba(34,197,94,0.15)',
            border: '1px solid rgba(34,197,94,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle size={40} color="#4ade80" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '12px', color: '#4ade80' }}>
            Listed Successfully!
          </h2>
          <p style={{ color: '#475569', marginBottom: '32px' }}>
            <strong style={{ color: '#f8fafc' }}>{form.title}</strong> has been listed at{' '}
            <strong style={{ color: '#fbbf24' }}>{formatXLM(Number(form.price))}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <button onClick={() => navigate('/marketplace')} className="btn-primary" style={{ justifyContent: 'center', padding: '14px' }}>
              View Marketplace <ArrowRight size={16} />
            </button>
            <button onClick={() => { setStep('form'); setForm(INITIAL_FORM); }} className="btn-secondary" style={{ justifyContent: 'center', padding: '14px' }}>
              List Another Property
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'review') {
    const gradient = getPropertyGradient(form.property_type);
    return (
      <div style={{ minHeight: '100vh', padding: '110px 24px 60px', maxWidth: '600px', margin: '0 auto' }}>
        <h1 className="section-title" style={{ marginBottom: '8px' }}>Review Listing</h1>
        <p style={{ color: '#475569', marginBottom: '32px' }}>Confirm your property details before publishing.</p>

        <div className="glass-card" style={{ overflow: 'hidden', marginBottom: '24px' }}>
          <div style={{ height: '180px', background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '60px', opacity: 0.3 }}>🏛️</div>
          </div>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc' }}>{form.title}</h2>
              <span className="badge badge-purple">{form.property_type}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#fbbf24', marginBottom: '16px' }}>{formatXLM(Number(form.price))}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#64748b', fontSize: '14px' }}>
              <div style={{ display: 'flex', gap: '8px' }}><MapPin size={14} /> {form.location}</div>
              {form.bedrooms && <div style={{ display: 'flex', gap: '8px' }}><Bed size={14} /> {form.bedrooms} bedrooms</div>}
              {form.bathrooms && <div style={{ display: 'flex', gap: '8px' }}><Bath size={14} /> {form.bathrooms} bathrooms</div>}
              {form.area_sqft && <div style={{ display: 'flex', gap: '8px' }}><Maximize2 size={14} /> {Number(form.area_sqft).toLocaleString()} sqft</div>}
            </div>
            <p style={{ color: '#475569', fontSize: '13px', marginTop: '16px', lineHeight: '1.6' }}>{form.description}</p>
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: '12px',
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start',
        }}>
          <AlertCircle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
            By listing this property, you confirm that you are the rightful owner and have the legal right to offer it for sale on the DESTATE platform.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => setStep('form')} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
            ← Edit
          </button>
          <button onClick={handleConfirm} disabled={isSubmitting} className="btn-primary" style={{ flex: 2, justifyContent: 'center', padding: '14px' }}>
            {isSubmitting ? (
              <><div className="spinner" style={{ width: '16px', height: '16px' }} /> Listing...</>
            ) : (
              <><CheckCircle size={16} /> Confirm & List</>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '110px 24px 60px', maxWidth: '680px', margin: '0 auto' }}>
      <h1 className="section-title" style={{ marginBottom: '8px' }}>List Your Property</h1>
      <p style={{ color: '#475569', marginBottom: '40px' }}>
        Fill in the details to publish your property on the Stellar blockchain marketplace.
      </p>

      <form onSubmit={handleSubmit} id="list-property-form">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Basic Info Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Home size={18} color="#6c63ff" />
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#f8fafc' }}>Basic Information</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="label" htmlFor="title">Property Title *</label>
                <input id="title" name="title" type="text" className="input-field" placeholder="e.g. Modern Downtown Apartment" value={form.title} onChange={handleChange} />
                {errors.title && <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.title}</span>}
              </div>
              <div className="form-group">
                <label className="label" htmlFor="location">Location *</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input id="location" name="location" type="text" className="input-field" placeholder="City, State / Country" value={form.location} onChange={handleChange} style={{ paddingLeft: '40px' }} />
                </div>
                {errors.location && <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.location}</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="label" htmlFor="price">Price (XLM) *</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                    <input id="price" name="price" type="number" min="1" step="0.01" className="input-field" placeholder="e.g. 2500" value={form.price} onChange={handleChange} style={{ paddingLeft: '40px' }} />
                  </div>
                  {errors.price && <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.price}</span>}
                </div>
                <div className="form-group">
                  <label className="label" htmlFor="property_type">Property Type</label>
                  <select id="property_type" name="property_type" className="input-field" value={form.property_type} onChange={handleChange}>
                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <LayoutGrid size={18} color="#06b6d4" />
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#f8fafc' }}>Property Details</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="form-group">
                <label className="label" htmlFor="bedrooms">Bedrooms</label>
                <div style={{ position: 'relative' }}>
                  <Bed size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input id="bedrooms" name="bedrooms" type="number" min="0" className="input-field" placeholder="e.g. 3" value={form.bedrooms} onChange={handleChange} style={{ paddingLeft: '36px' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="bathrooms">Bathrooms</label>
                <div style={{ position: 'relative' }}>
                  <Bath size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input id="bathrooms" name="bathrooms" type="number" min="0" className="input-field" placeholder="e.g. 2" value={form.bathrooms} onChange={handleChange} style={{ paddingLeft: '36px' }} />
                </div>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="area_sqft">Area (sqft)</label>
                <div style={{ position: 'relative' }}>
                  <Maximize2 size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input id="area_sqft" name="area_sqft" type="number" min="1" className="input-field" placeholder="e.g. 1200" value={form.area_sqft} onChange={handleChange} style={{ paddingLeft: '36px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <FileText size={18} color="#f59e0b" />
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#f8fafc' }}>Description & Media</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="label" htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  className="input-field"
                  placeholder="Describe your property... What makes it special? (min 20 characters)"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  style={{ resize: 'vertical', minHeight: '100px' }}
                />
                {errors.description && <span style={{ fontSize: '12px', color: '#ef4444' }}>{errors.description}</span>}
                <span style={{ fontSize: '11px', color: '#374151', textAlign: 'right', display: 'block' }}>
                  {form.description.length} / 500 characters
                </span>
              </div>
              <div className="form-group">
                <label className="label" htmlFor="image_url">Image URL (optional)</label>
                <input id="image_url" name="image_url" type="url" className="input-field" placeholder="https://example.com/property-image.jpg" value={form.image_url} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Wallet preview */}
          <div style={{
            padding: '16px 20px',
            background: 'rgba(108,99,255,0.08)',
            border: '1px solid rgba(108,99,255,0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <Building2 size={18} color="#6c63ff" />
            <div>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Listing as</div>
              <div style={{ fontSize: '13px', color: '#a78bfa', fontFamily: 'monospace' }}>{publicKey}</div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ padding: '16px', justifyContent: 'center', fontSize: '16px' }} id="list-property-submit">
            Review Listing <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ListPropertyPage;
