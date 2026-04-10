import React from 'react';
import type { Property } from '../lib/supabase';
import { formatXLM, truncateAddress } from '../lib/stellar';
import { getPropertyGradient } from '../lib/mockData';
import { X, MapPin, Bed, Bath, Maximize2, ShoppingCart, ExternalLink, Calendar } from 'lucide-react';

interface PropertyModalProps {
  property: Property | null;
  onClose: () => void;
  onBuy?: (property: Property) => void;
  isOwned?: boolean;
  isBuying?: boolean;
  currentUserKey?: string | null;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  property,
  onClose,
  onBuy,
  isBuying = false,
  currentUserKey,
}) => {
  if (!property) return null;

  const gradient = getPropertyGradient(property.property_type || 'default');
  const isOwnProperty = currentUserKey && property.owner === currentUserKey;
  const formattedDate = new Date(property.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(10, 15, 30, 0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white',
            zIndex: 1,
          }}
        >
          <X size={18} />
        </button>

        {/* Header Image */}
        <div style={{
          height: '240px',
          background: gradient,
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {property.image_url ? (
            <img src={property.image_url} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px 20px 0 0' }} />
          ) : (
            <div style={{ fontSize: '80px', opacity: 0.3 }}>🏛️</div>
          )}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '20px',
            display: 'flex',
            gap: '8px',
          }}>
            <span className={`badge ${property.is_sold ? 'status-sold' : 'badge-green'}`}>
              {property.is_sold ? '● Sold' : '● For Sale'}
            </span>
            <span className="badge badge-purple">{property.property_type}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '28px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '800',
              fontFamily: "'Space Grotesk', sans-serif",
              marginBottom: '8px',
              color: '#f8fafc',
            }}>
              {property.title}
            </h2>
            <div style={{
              fontSize: '28px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {formatXLM(property.price)}
            </div>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', marginBottom: '20px' }}>
            <MapPin size={16} />
            <span style={{ fontSize: '15px' }}>{property.location}</span>
          </div>

          {/* Stats grid */}
          {(property.bedrooms || property.bathrooms || property.area_sqft) && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginBottom: '20px',
            }}>
              {property.bedrooms && (
                <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Bed size={20} color="#a78bfa" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>{property.bedrooms}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bedrooms</div>
                </div>
              )}
              {property.bathrooms && (
                <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Bath size={20} color="#06b6d4" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>{property.bathrooms}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bathrooms</div>
                </div>
              )}
              {property.area_sqft && (
                <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Maximize2 size={20} color="#f59e0b" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>{property.area_sqft.toLocaleString()}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sq. Ft.</div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>About</h4>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.7' }}>{property.description}</p>
          </div>

          {/* Owner info */}
          <div style={{
            padding: '16px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '20px',
          }}>
            <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Current Owner
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c63ff, #a78bfa)' }} />
                <span style={{ fontSize: '13px', color: '#a78bfa', fontFamily: 'monospace' }}>
                  {truncateAddress(property.owner, 10)}
                </span>
              </div>
              <a
                href={`https://stellar.expert/explorer/testnet/account/${property.owner}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#6c63ff', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', textDecoration: 'none' }}
              >
                <ExternalLink size={13} /> Explorer
              </a>
            </div>
          </div>

          {/* Listed date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '13px', marginBottom: '24px' }}>
            <Calendar size={14} />
            Listed on {formattedDate}
          </div>

          {/* Action Buttons */}
          {!isOwnProperty && !property.is_sold && onBuy && (
            <button
              onClick={() => onBuy(property)}
              disabled={isBuying}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }}
            >
              {isBuying ? (
                <><div className="spinner" style={{ width: '18px', height: '18px', borderColor: 'rgba(0,0,0,0.3)', borderTopColor: '#000' }} /> Processing Transaction...</>
              ) : (
                <><ShoppingCart size={18} /> Purchase Property — {formatXLM(property.price)}</>
              )}
            </button>
          )}

          {isOwnProperty && (
            <div className="badge badge-gold" style={{ width: '100%', justifyContent: 'center', borderRadius: '12px', padding: '14px', fontSize: '14px' }}>
              ✓ You own this property
            </div>
          )}

          {property.is_sold && !isOwnProperty && (
            <div className="badge status-sold" style={{ width: '100%', justifyContent: 'center', borderRadius: '12px', padding: '14px', fontSize: '14px' }}>
              This property has been sold
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
