import React, { useRef, useEffect, useState } from 'react';
import { Download, RotateCcw, Share2, CheckCircle2 } from 'lucide-react';

const ResultPreview = ({ frameImage, photos, photoSlots, onRetake }) => {
  const canvasRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const drawPreview = async () => {
      if (!frameImage || !canvasRef.current || photos.length === 0) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const frame = new Image();
      frame.crossOrigin = 'anonymous';
      frame.src = frameImage;
      await new Promise(res => (frame.onload = res));

      canvas.width = frame.width;
      canvas.height = frame.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const loadedPhotos = [];
      for (let i = 0; i < Math.min(photos.length, photoSlots.length); i++) {
        const img = new Image();
        img.src = photos[i];
        await new Promise(res => (img.onload = res));
        loadedPhotos.push(img);
      }

      for (let i = 0; i < loadedPhotos.length; i++) {
        const img = loadedPhotos[i];
        const slot = photoSlots[i];
        if (!slot) continue;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const scaleX = slot.width / img.width;
        const scaleY = slot.height / img.height;
        const scale = Math.max(scaleX, scaleY);

        const drawWidth = img.width * scale + 2;
        const drawHeight = img.height * scale + 2;
        const drawX = Math.floor(slot.x + (slot.width - drawWidth) / 2);
        const drawY = Math.floor(slot.y + (slot.height - drawHeight) / 2);

        ctx.save();
        ctx.beginPath();
        ctx.rect(slot.x - 1, slot.y - 1, slot.width + 2, slot.height + 2);
        ctx.clip();
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();
      }

      ctx.drawImage(frame, 0, 0);
    };

    drawPreview();
  }, [frameImage, photos, photoSlots]);

  const downloadResult = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const frame = new Image();
      frame.crossOrigin = 'anonymous';
      frame.src = frameImage;
      await new Promise(res => (frame.onload = res));

      canvas.width = frame.width;
      canvas.height = frame.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < Math.min(photos.length, photoSlots.length); i++) {
        const img = new Image();
        img.src = photos[i];
        await new Promise(res => (img.onload = res));

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const slot = photoSlots[i];
        const scaleX = slot.width / img.width;
        const scaleY = slot.height / img.height;
        const scale = Math.max(scaleX, scaleY);

        const drawWidth = img.width * scale + 2;
        const drawHeight = img.height * scale + 2;
        const drawX = Math.floor(slot.x + (slot.width - drawWidth) / 2);
        const drawY = Math.floor(slot.y + (slot.height - drawHeight) / 2);

        ctx.save();
        ctx.beginPath();
        ctx.rect(slot.x - 1, slot.y - 1, slot.width + 2, slot.height + 2);
        ctx.clip();
        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();
      }

      ctx.drawImage(frame, 0, 0);

      const link = document.createElement('a');
      link.download = 'framory-photo.png';
      link.href = canvas.toDataURL('image/png');
      link.click();

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FBF8F4',
      fontFamily: "'Nunito', sans-serif",
      color: '#1a1a1a',
      overflowX: 'hidden',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)',
    }}>
      <style>{`
  
        .blob { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }

        /* Gradient text */
        .grad-text {
          background: linear-gradient(135deg, #FF8A80 0%, #FF6B9D 40%, #C77DFF 75%, #7B9CFF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Buttons */
        .btn-download {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          background: #1a1a1a;
          color: #fff;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: clamp(0.88rem, 2.5vw, 0.95rem);
          border: none;
          border-radius: 100px;
          padding: clamp(0.8rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2.25rem);
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 6px 24px rgba(26,26,26,0.15);
          white-space: nowrap;
        }
        .btn-download:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 14px 36px rgba(26,26,26,0.22);
        }
        .btn-download:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-download.success {
          background: #1a7a4a;
          box-shadow: 0 6px 24px rgba(26,122,74,0.2);
        }

        .btn-retake {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          background: transparent;
          color: #555;
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: clamp(0.88rem, 2.5vw, 0.95rem);
          border: 1.5px solid #E0DAD3;
          border-radius: 100px;
          padding: clamp(0.8rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2.25rem);
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .btn-retake:hover {
          border-color: #1a1a1a;
          color: #1a1a1a;
        }

        /* Canvas card */
        .canvas-card {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #EDEAE4;
          padding: clamp(0.75rem, 2.5vw, 1.25rem);
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
          display: inline-block;
          transition: box-shadow 0.3s;
        }
        .canvas-card:hover {
          box-shadow: 0 28px 72px rgba(0,0,0,0.12);
        }

        /* Action row responsive */
        .action-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Wavy underline */
        .wavy-wrap { position: relative; display: inline-block; }
        .wavy-wrap svg {
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 10px;
          display: block;
        }

        /* Appear animation */
        @keyframes appear {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .appear { animation: appear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .appear-delay { animation: appear 0.5s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both; }

        @media (max-width: 480px) {
          .action-row { flex-direction: column; width: 100%; }
          .btn-download, .btn-retake { justify-content: center; width: 100%; }
        }
      `}</style>

      {/* Ambient blobs */}
      <div className="blob" style={{ width: 420, height: 420, background: 'rgba(255,194,194,0.3)', top: '-8%', right: '-5%', filter: 'blur(80px)' }} />
      <div className="blob" style={{ width: 260, height: 260, background: 'rgba(168,222,192,0.25)', bottom: '5%', left: '2%', filter: 'blur(65px)' }} />
      <div className="blob" style={{ width: 200, height: 200, background: 'rgba(196,179,255,0.2)', top: '40%', right: '5%', filter: 'blur(55px)' }} />

      {/* Dot grid */}
      <div style={{
        position: 'fixed', top: '2rem', right: 0, width: '200px', height: '200px', opacity: 0.16,
        backgroundImage: 'radial-gradient(circle, #D8D2CA 1px, transparent 1px)',
        backgroundSize: '26px 26px',
        maskImage: 'radial-gradient(ellipse at top right, black 15%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(ellipse at top right, black 15%, transparent 72%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        gap: 'clamp(1.25rem, 4vw, 2rem)',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center' }} className="appear">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            background: '#fff', border: '1.5px solid #EDEAE4', borderRadius: '100px',
            padding: '0.3rem 0.85rem 0.3rem 0.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
            marginBottom: '1rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#CC3B2A', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B0A89A' }}>
              your memory
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: 'clamp(2rem, 7vw, 4rem)',
            fontWeight: 400,
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            color: '#1a1a1a',
            marginBottom: '0.5rem',
          }}>
            looking{' '}
            <span className="wavy-wrap">
              <em className="grad-text" style={{ fontStyle: 'italic' }}>gorgeous</em>
              <svg viewBox="0 0 300 10" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6 Q25 1 50 6 Q75 11 100 6 Q125 1 150 6 Q175 11 200 6 Q225 1 250 6 Q275 11 300 6" fill="none" stroke="#CC3B2A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>

          <p style={{ color: '#B0A89A', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', fontWeight: 400 }}>
            download it before you close the tab
          </p>
        </div>

        {/* Canvas preview */}
        <div className="canvas-card appear">
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              borderRadius: '10px',
              maxHeight: 'clamp(400px, 65vh, 700px)',
              width: 'auto',
            }}
          />
        </div>

        {/* Action buttons */}
        <div className="action-row appear-delay">
          <button
            className={`btn-download${downloaded ? ' success' : ''}`}
            onClick={downloadResult}
            disabled={downloading}
          >
            {downloaded ? (
              <>
                <CheckCircle2 size={17} strokeWidth={2.5} />
                Saved!
              </>
            ) : downloading ? (
              <>
                <div style={{ width: 17, height: 17, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                Saving...
              </>
            ) : (
              <>
                <Download size={17} strokeWidth={2} />
                Download Strip
              </>
            )}
          </button>

          <button className="btn-retake" onClick={onRetake}>
            <RotateCcw size={16} strokeWidth={2} />
            Retake
          </button>
        </div>

        {/* Hint */}
        <p style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.58rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#C8C0B8',
          textAlign: 'center',
        }}>
          high quality png · free forever
        </p>

      </div>

      {/* Spin keyframe for download loader */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ResultPreview;