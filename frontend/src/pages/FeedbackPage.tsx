import React from 'react';
import { ExternalLink, Star, MessageSquare, Users, ArrowRight } from 'lucide-react';

// Replace this with your actual Google Form URL
const GOOGLE_FORM_URL = 'https://forms.gle/YOUR_FORM_ID_HERE';

const USER_FEEDBACK = [
  {
    name: 'Alex R.',
    wallet: 'GDEMO1XXXX...XXX1',
    rating: 5,
    comment: 'The UI is incredibly clean. Buying property with XLM was seamless. Love the Freighter integration!',
    date: 'Apr 2026',
  },
  {
    name: 'Priya M.',
    wallet: 'GDEMO2XXXX...XXX2',
    rating: 5,
    comment: 'Finally a real estate platform that works on blockchain! The testnet demo is very convincing.',
    date: 'Apr 2026',
  },
  {
    name: 'Carlos J.',
    wallet: 'GDEMO3XXXX...XXX3',
    rating: 4,
    comment: 'Great concept. Would love to see more properties. The transaction speed on Stellar is impressive.',
    date: 'Apr 2026',
  },
  {
    name: 'Sarah K.',
    wallet: 'GDEMO4XXXX...XXX4',
    rating: 5,
    comment: 'As an investor, this platform makes real estate much more accessible. Stellar\'s fees are a game-changer.',
    date: 'Apr 2026',
  },
  {
    name: 'James T.',
    wallet: 'GDEMO5XXXX...XXX5',
    rating: 4,
    comment: 'Dashboard is clean, property cards are beautiful. Would love IPFS-based image storage.',
    date: 'Apr 2026',
  },
];

const FeedbackPage: React.FC = () => {
  const avgRating = USER_FEEDBACK.reduce((s, f) => s + f.rating, 0) / USER_FEEDBACK.length;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span className="badge badge-gold" style={{ padding: '8px 16px' }}>
              <Star size={12} fill="currentColor" /> User Feedback
            </span>
          </div>
          <h1 className="section-title" style={{ fontSize: '2.5rem' }}>Community Voices</h1>
          <p style={{ color: '#475569', marginTop: '12px', fontSize: '16px', maxWidth: '480px', margin: '12px auto 0' }}>
            Real feedback from our testnet users. Join the community and share your experience with DESTATE.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', fontWeight: '900', fontFamily: "'Space Grotesk'", color: '#fbbf24', marginBottom: '4px' }}>
              {avgRating.toFixed(1)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '8px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} color="#f59e0b" fill={i < Math.round(avgRating) ? '#f59e0b' : 'transparent'} />
              ))}
            </div>
            <div style={{ fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Rating</div>
          </div>
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', fontWeight: '900', fontFamily: "'Space Grotesk'", color: '#a78bfa', marginBottom: '8px' }}>
              {USER_FEEDBACK.length}+
            </div>
            <div style={{ fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reviews</div>
          </div>
          <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', fontWeight: '900', fontFamily: "'Space Grotesk'", color: '#4ade80', marginBottom: '8px' }}>
              5+
            </div>
            <div style={{ fontSize: '12px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Testnet Users</div>
          </div>
        </div>

        {/* Submit Feedback CTA */}
        <div style={{
          padding: '40px',
          background: 'linear-gradient(135deg, rgba(108,99,255,0.15) 0%, rgba(6,182,212,0.05) 100%)',
          border: '1px solid rgba(108,99,255,0.2)',
          borderRadius: '20px',
          textAlign: 'center',
          marginBottom: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div className="orb orb-purple" style={{ width: '200px', height: '200px', top: '-50px', right: '-50px', opacity: 0.4 }} />
          <MessageSquare size={40} color="#6c63ff" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '800', fontFamily: "'Space Grotesk'", marginBottom: '12px', position: 'relative' }}>
            Share Your Experience
          </h2>
          <p style={{ color: '#475569', marginBottom: '28px', position: 'relative', maxWidth: '400px', margin: '0 auto 28px', lineHeight: '1.6' }}>
            Fill out our Google Form with your wallet address, email, and product rating. Help us build the future of real estate.
          </p>
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            id="feedback-form-link"
            style={{ padding: '14px 32px', fontSize: '15px', display: 'inline-flex', textDecoration: 'none', position: 'relative' }}
          >
            <ExternalLink size={16} /> Submit Feedback Form <ArrowRight size={16} />
          </a>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#374151', position: 'relative' }}>
            Takes less than 2 minutes • We read every response
          </div>
        </div>

        {/* Feedback Form Fields Preview */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', marginBottom: '16px', fontFamily: "'Space Grotesk'" }}>
            What We Ask
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { field: 'Full Name', desc: 'Your name for personalization' },
              { field: 'Email Address', desc: 'For follow-up communications' },
              { field: 'Stellar Wallet Address', desc: 'Verifiable on Stellar Explorer' },
              { field: 'Product Rating (1-5)', desc: 'How would you rate DESTATE?' },
              { field: 'Feature Requests', desc: 'What would you like to see next?' },
              { field: 'Overall Feedback', desc: 'Anything else you want to share' },
            ].map((item) => (
              <div key={item.field} className="glass-card" style={{ padding: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#a78bfa', marginBottom: '4px' }}>{item.field}</div>
                <div style={{ fontSize: '12px', color: '#475569' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* User Reviews */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Users size={20} color="#6c63ff" />
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#f8fafc', fontFamily: "'Space Grotesk'" }}>
              Testnet User Reviews
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {USER_FEEDBACK.map((feedback, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, hsl(${idx * 60}, 70%, 60%), hsl(${idx * 60 + 40}, 70%, 40%))`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '700',
                      color: 'white',
                    }}>
                      {feedback.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#f8fafc', fontSize: '15px' }}>{feedback.name}</div>
                      <div style={{ fontSize: '11px', color: '#475569', fontFamily: 'monospace' }}>{feedback.wallet}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} color="#f59e0b" fill={i < feedback.rating ? '#f59e0b' : 'transparent'} />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{feedback.date}</span>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', fontStyle: 'italic' }}>
                  "{feedback.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet addresses section */}
        <div style={{
          marginTop: '40px',
          padding: '32px',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '16px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '16px', fontFamily: "'Space Grotesk'" }}>
            Verified Testnet Users — Stellar Explorer
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'GDEMO1YOURCOLLECTEDWALLETADDRESSHERE1XXX',
              'GDEMO2YOURCOLLECTEDWALLETADDRESSHERE2XXX',
              'GDEMO3YOURCOLLECTEDWALLETADDRESSHERE3XXX',
              'GDEMO4YOURCOLLECTEDWALLETADDRESSHERE4XXX',
              'GDEMO5YOURCOLLECTEDWALLETADDRESSHERE5XXX',
            ].map((addr, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
              }}>
                <span style={{ fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>#{i + 1} {addr}</span>
                <a
                  href={`https://stellar.expert/explorer/testnet/account/${addr}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#6c63ff', display: 'flex' }}
                >
                  <ExternalLink size={13} />
                </a>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: '#374151', marginTop: '12px' }}>
            * Real wallet addresses will be added after collecting user feedback via the Google Form.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
