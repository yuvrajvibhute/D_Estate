import React from 'react';
import type { Property } from '../lib/supabase';
import { formatXLM, truncateAddress } from '../lib/stellar';
import { getPropertyGradient } from '../lib/mockData';
import { MapPin, Bed, Bath, Maximize2, Star, ShoppingCart, Eye } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onBuy?: (property: Property) => void;
  onView?: (property: Property) => void;
  isOwned?: boolean;
  isBuying?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onBuy,
  onView,
  isOwned = false,
  isBuying = false,
}) => {
  const gradient = getPropertyGradient(property.property_type || 'default');

  return (
    <div
      className="glass-card"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Property Image / Gradient Placeholder */}
      <div
        style={{
          position: 'relative',
          height: '200px',
          background: gradient,
          overflow: 'hidden',
          flexShrink: 0,
        }}
        onClick={() => onView?.(property)}
      >
        {property.image_url ? (
          <img
            src={property.image_url}
            alt={property.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <div style={{ fontSize: '48px', opacity: 0.3 }}>🏛️</div>
            <span style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.6)',
              fontWeight: '600',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {property.property_type}
            </span>
          </div>
        )}

        {/* Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          gap: '6px',
        }}>
          <span className={`badge ${property.is_sold ? 'status-sold' : 'badge-green'}`} style={{ borderRadius: '20px' }}>
            {property.is_sold ? '● Sold' : '● For Sale'}
          </span>
        </div>

        {isOwned && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
          }}>
            <span className="badge badge-gold">
              <Star size={10} fill="currentColor" /> Owned
            </span>
          </div>
        )}

        {/* Gradient overlay at bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px',
          background: 'linear-gradient(to top, rgba(10, 15, 30, 0.8), transparent)',
        }} />
      </div>

      {/* Card Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {/* Title & Price */}
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '700',
            fontFamily: "'Space Grotesk', sans-serif",
            marginBottom: '4px',
            color: '#f8fafc',
            lineHeight: '1.3',
          }}>
            {property.title}
          </h3>
          <div style={{
            fontSize: '22px',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
          <MapPin size={13} />
          <span style={{ fontSize: '13px' }}>{property.location}</span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '13px',
          color: '#475569',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {property.description}
        </p>

        {/* Property Details */}
        {(property.bedrooms || property.bathrooms || property.area_sqft) && (
          <div style={{
            display: 'flex',
            gap: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            {property.bedrooms && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '12px' }}>
                <Bed size={13} />
                <span>{property.bedrooms} bed</span>
              </div>
            )}
            {property.bathrooms && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '12px' }}>
                <Bath size={13} />
                <span>{property.bathrooms} bath</span>
              </div>
            )}
            {property.area_sqft && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '12px' }}>
                <Maximize2 size={13} />
                <span>{property.area_sqft.toLocaleString()} sqft</span>
              </div>
            )}
          </div>
        )}

        {/* Owner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 12px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
          }} />
          <div>
            <div style={{ fontSize: '10px', color: '#475569', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Owner</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
              {truncateAddress(property.owner, 8)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
          <button
            onClick={() => onView?.(property)}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: 'center', padding: '10px 12px', fontSize: '13px' }}
          >
            <Eye size={14} /> Details
          </button>
          {!isOwned && !property.is_sold && onBuy && (
            <button
              onClick={() => onBuy(property)}
              disabled={isBuying}
              className="btn-gold"
              style={{ flex: 2, justifyContent: 'center', padding: '10px 12px', fontSize: '13px' }}
            >
              {isBuying ? (
                <><div className="spinner" style={{ width: '14px', height: '14px', borderColor: 'rgba(0,0,0,0.3)', borderTopColor: '#000' }} /> Processing...</>
              ) : (
                <><ShoppingCart size={14} /> Buy Now</>
              )}
            </button>
          )}
          {isOwned && (
            <div className="badge badge-gold" style={{ flex: 2, justifyContent: 'center', borderRadius: '10px', padding: '10px 12px' }}>
              <Star size={13} fill="currentColor" /> In Your Portfolio
            </div>
          )}
          {property.is_sold && !isOwned && (
            <div className="badge status-sold" style={{ flex: 2, justifyContent: 'center', borderRadius: '10px', padding: '10px 12px' }}>
              Property Sold
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
