import React, { useState } from 'react';
import { Loader2, ArrowLeft, Sparkles, Image } from 'lucide-react';
import { detectTransparentAreas } from '../utils/imageDetection';

const FrameSelection = ({ selectedTheme, onBack, onSelectFrame }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [loadingFrameId, setLoadingFrameId] = useState(null);

  const handleFrameSelect = async (frame) => {
    setIsDetecting(true);
    setLoadingFrameId(frame.id);
    try {
      const areas = await detectTransparentAreas(frame.frameUrl);
      if (areas.length === 0) {
        alert('No transparent areas detected!');
        setIsDetecting(false);
        setLoadingFrameId(null);
        return;
      }
      setIsDetecting(false);
      setLoadingFrameId(null);
      onSelectFrame(frame, frame.frameUrl, areas);
    } catch (error) {
      alert('Failed to load frame.');
      setIsDetecting(false);
      setLoadingFrameId(null);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FBF8F4',
      color: '#1a1a1a',
      fontFamily: "'Nunito', sans-serif",
      overflowX: 'hidden',
      position: 'relative',
    }}>
      <style>{`
      
        .frame-card {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #EDEAE4;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          flex-shrink: 0;
          width: 220px;
          text-align: left;
        }
        .frame-card:hover {
          transform: translateY(-5px) rotate(-0.4deg);
          box-shadow: 0 20px 50px rgba(0,0,0,0.09);
          border-color: #D9D3CA;
        }
        .frame-card:hover .frame-chip {
          background: #1a1a1a;
          color: #fff;
        }
        .frame-card:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .frame-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 0.72rem;
          background: #F2EEE8;
          color: #888;
          padding: 0.3rem 0.85rem;
          border-radius: 100px;
          transition: all 0.22s;
        }
        .frame-chip.loading {
          background: #EDE8FF;
          color: #7C5CC8;
        }


        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #fff;
          border: 1.5px solid #EDEAE4;
          border-radius: 100px;
          padding: 0.35rem 0.9rem 0.35rem 0.5rem;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #B0A89A;
          box-shadow: 0 2px 10px rgba(0,0,0,0.04);
        }

        .scroll-container {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding: 0.5rem 0.25rem 1.5rem;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scroll-container::-webkit-scrollbar { display: none; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .frame-card { width: 180px; }
        }
        @media (max-width: 480px) {
          .frame-card { width: 150px; }
          .scroll-container { gap: 0.75rem; }
        }

        /* Blobs */
        .blob {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        /* Loading spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        /* Gradient text */
        .grad-text {
          background: linear-gradient(135deg, #FF8A80 0%, #FF6B9D 40%, #C77DFF 75%, #7B9CFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Wavy underline on theme name */
        .wavy-wrap { position: relative; display: inline-block; }
        .wavy-wrap svg {
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 10px;
          display: block;
        }
      `}</style>

      {/* Soft ambient blobs — same as landing page hero */}
      <div className="blob" style={{ width: 400, height: 400, background: 'rgba(255,194,194,0.32)', top: '-5%', right: '2%', filter: 'blur(80px)' }} />
      <div className="blob" style={{ width: 280, height: 280, background: 'rgba(168,222,192,0.28)', top: '50%', right: '20%', filter: 'blur(60px)' }} />
      <div className="blob" style={{ width: 220, height: 220, background: 'rgba(196,179,255,0.22)', bottom: '10%', left: '5%', filter: 'blur(55px)' }} />

      {/* Dot grid — top right corner, same as hero */}
      <div style={{
        position: 'fixed', top: '2rem', right: 0, width: '220px', height: '220px', opacity: 0.18,
        backgroundImage: 'radial-gradient(circle, #D8D2CA 1px, transparent 1px)',
        backgroundSize: '26px 26px',
        maskImage: 'radial-gradient(ellipse at top right, black 15%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(ellipse at top right, black 15%, transparent 72%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '76rem', margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem) clamp(3rem, 6vw, 6rem)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>

          {/* Theme badge */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div className="badge">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#CC3B2A', display: 'inline-block', flexShrink: 0 }} />
              {selectedTheme.name} theme
            </div>
          </div>

          {/* Heading */}
          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            fontWeight: 400,
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            color: '#1a1a1a',
            marginBottom: '1rem',
          }}>
            pick your{' '}
            <span className="wavy-wrap">
              <em className="grad-text" style={{ fontStyle: 'italic' }}>frame</em>
              <svg viewBox="0 0 300 10" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6 Q25 1 50 6 Q75 11 100 6 Q125 1 150 6 Q175 11 200 6 Q225 1 250 6 Q275 11 300 6" fill="none" stroke="#CC3B2A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>

          <p style={{ color: '#B0A89A', fontSize: '1rem', fontWeight: 400, lineHeight: 1.7, maxWidth: '28rem', margin: '0 auto' }}>
            {selectedTheme.description}
          </p>
        </div>

        {/* Frames scroll */}
        <div className="scroll-container">
          {selectedTheme.frames.map((frame) => {
            const isLoading = loadingFrameId === frame.id;
            return (
              <button
                key={frame.id}
                className="frame-card"
                onClick={() => handleFrameSelect(frame)}
                disabled={isDetecting}
              >
                {/* Preview area */}
                <div style={{ aspectRatio: '3/4', background: '#F4F0E8', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={frame.frameUrl}
                    alt={frame.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />

                  {/* Loading overlay */}
                  {isLoading && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(251,248,244,0.85)',
                      backdropFilter: 'blur(6px)',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                    }}>
                      <Loader2 size={30} className="spin" style={{ color: '#CC3B2A', strokeWidth: 2 }} />
                      <span style={{ fontSize: '0.72rem', fontFamily: "'DM Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B0A89A' }}>
                        detecting slots
                      </span>
                    </div>
                  )}

                  {/* Hover overlay */}
                  {!isLoading && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(26,26,26,0.55), transparent 50%)',
                      opacity: 0,
                      transition: 'opacity 0.25s',
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                      paddingBottom: '1rem',
                    }}
                      className="hover-overlay"
                    >
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Nunito', sans-serif" }}>Select</span>
                    </div>
                  )}

                  {/* Small icon badge top-left */}
                  <div style={{
                    position: 'absolute', top: '0.6rem', left: '0.6rem',
                    width: '1.75rem', height: '1.75rem',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(255,255,255,0.8)',
                  }}>
                    <Image size={12} style={{ color: '#1a1a1a', strokeWidth: 1.75 }} />
                  </div>
                </div>

                {/* Card footer */}
                <div style={{ padding: '1rem 1.1rem', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '0.88rem', color: '#1a1a1a', marginBottom: '0.15rem' }}>
                      {frame.name}
                    </h3>
                  </div>
                  <div className={`frame-chip${isLoading ? ' loading' : ''}`}>
                    {isLoading ? (
                      <>
                        <Loader2 size={10} className="spin" />
                        loading
                      </>
                    ) : (
                      <>
                        <ArrowLeft size={10} style={{ transform: 'rotate(180deg)' }} />
                        pick
                      </>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Hint */}
        <p style={{ textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8C0B8', marginTop: '1rem' }}>
          scroll to see more · click to select
        </p>

      </div>

      {/* Add hover effect via style tag */}
      <style>{`
        .frame-card:hover .hover-overlay { opacity: 1 !important; }
      `}</style>
    </div>
  );
};

export default FrameSelection;