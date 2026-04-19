import React, { useRef, useEffect, useState } from 'react';
import { Download, Share2, RotateCcw, CheckCircle2, Home } from 'lucide-react';
import { useBooth } from '../App';

const FILTERS = [
  { name: 'none',    label: 'original', css: 'none',                                                                          overlay: null },
  { name: 'soft',    label: 'soft',     css: 'brightness(1.05) saturate(1.1) contrast(0.92)',                                 overlay: { opacity: 0.38, blur: 1.2 } },
  { name: 'glow',    label: 'glow',     css: 'brightness(1.12) saturate(1.25) contrast(0.88)',                                overlay: { opacity: 0.52, blur: 2.2 } },
  { name: 'mono',    label: 'mono',     css: 'grayscale(100%)',                                                                overlay: null },
  { name: 'fade',    label: 'fade',     css: 'brightness(1.15) saturate(0.6) contrast(0.85)',                                 overlay: null },
  { name: 'vivid',   label: 'vivid',    css: 'saturate(1.8) contrast(1.1)',                                                   overlay: null },
  { name: 'warm',    label: 'warm',     css: 'sepia(0.35) saturate(1.3) brightness(1.05)',                                    overlay: null },
  { name: 'cool',    label: 'cool',     css: 'hue-rotate(200deg) saturate(0.9) brightness(1.05)',                             overlay: null },
  { name: 'vintage', label: 'vintage',  css: 'sepia(0.6) contrast(0.85) brightness(0.95) saturate(0.8)',                     overlay: null },
  { name: 'drama',   label: 'drama',    css: 'contrast(1.4) saturate(1.2) brightness(0.9)',                                   overlay: null },
];

const ResultPreview = ({ frameImage, photos, photoSlots, selectedFilter = 'none', onRetake }) => {
  const canvasRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [sharing, setSharing] = useState(false);
  const { handleReset, selectedTheme, selectedFrame } = useBooth();

  const getFilename = () => {
    const theme = selectedTheme?.name?.toLowerCase().replace(/\s+/g, '-') || 'photo';
    const frame = selectedFrame?.name?.toLowerCase().replace(/\s+/g, '-') || 'strip';
    const date = new Date();
    const stamp = `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
    return `framory-${theme}-${frame}-${stamp}.png`;
  };

  const getCaption = () => {
    const captions = [
      `📸 A simple web-based photo booth tool. Capture 4 shots with curated minimalist frames and download the result instantly. No account registration required.\n\nTry it here: https://framory-photo.vercel.app/`,
      `🎞️ Quick photo strip generator. This tool offers high-performance single-page processing with various aesthetic themes. 4 poses, one click download, completely free.\n\nLink: https://framory-photo.vercel.app/`,
      `A functional photo booth for your browser. It features a clean interface, multiple filter options, and instant high-quality downloads without any signup barriers.\n\nAccess the tool: https://framory-photo.vercel.app/`,
      `✨ Digital photo booth with a focus on simplicity. Choose a theme, strike 4 poses, and get your photo strip immediately. No data collection, just a straightforward creative tool.\n\nAvailable at: https://framory-photo.vercel.app/`,
      `Capture and download 4-frame photo strips directly from your browser. Features include real-time filters, mobile-friendly interface, and zero-latency processing.\n\nTry Framory: https://framory-photo.vercel.app/`,
      `📸 Minimalist photo booth strip creator. Designed for speed and ease of use—no login needed, curated frame aesthetics, and instant local saving.\n\nCheck it out: https://framory-photo.vercel.app/`,
      `An efficient way to create photo booth strips. Select from various modern themes, take 4 shots, and export your image instantly in high resolution.\n\nFree to use: https://framory-photo.vercel.app/`,
      `🎞️ A browser-based tool for quick photo sessions. It provides an accessible interface with professional filters and high-quality frame layouts for immediate use.\n\nLink: https://framory-photo.vercel.app/`,
    ];
    return captions[Math.floor(Math.random() * captions.length)];
  };

  const drawToCanvas = async (canvas) => {
    const ctx = canvas.getContext('2d');

    const frame = new Image();
    frame.crossOrigin = 'anonymous';
    frame.src = frameImage;
    await new Promise(res => (frame.onload = res));

    canvas.width = frame.width;
    canvas.height = frame.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const activeFilter = FILTERS.find(f => f.name === selectedFilter);
    const filterCss = activeFilter?.css !== 'none' ? activeFilter?.css : 'none';

    for (let i = 0; i < Math.min(photos.length, photoSlots.length); i++) {
      const img = new Image();
      img.src = photos[i];
      await new Promise(res => (img.onload = res));

      const slot = photoSlots[i];
      if (!slot) continue;

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const clipX = slot.x;
      const clipY = slot.y;
      const clipW = slot.width;
      const clipH = slot.height;

      const scaleX = clipW / img.width;
      const scaleY = clipH / img.height;
      const scale = Math.max(scaleX, scaleY);

      const srcX = (img.width - clipW / scale) / 2;
      const srcY = (img.height - clipH / scale) / 2;
      const srcW = clipW / scale;
      const srcH = clipH / scale;

      ctx.beginPath();
      ctx.rect(clipX, clipY, clipW, clipH);
      ctx.clip();

      ctx.filter = filterCss;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, clipX, clipY, clipW, clipH);
      ctx.filter = 'none';

      if (activeFilter?.overlay) {
        const { blur, opacity } = activeFilter.overlay;
        const offscreen = document.createElement('canvas');
        offscreen.width = canvas.width;
        offscreen.height = canvas.height;
        const offCtx = offscreen.getContext('2d');
        offCtx.filter = `blur(${blur * 2}px) ${filterCss !== 'none' ? filterCss : ''}`.trim();
        offCtx.drawImage(img, srcX, srcY, srcW, srcH, clipX, clipY, clipW, clipH);
        offCtx.filter = 'none';

        ctx.globalAlpha = opacity;
        ctx.globalCompositeOperation = activeFilter.name === 'glow' ? 'screen' : 'normal';
        ctx.drawImage(offscreen, 0, 0);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }

      ctx.restore();
    }

    ctx.drawImage(frame, 0, 0);
  };

  useEffect(() => {
    const run = async () => {
      if (!frameImage || !canvasRef.current || photos.length === 0) return;
      await drawToCanvas(canvasRef.current);
    };
    run();
  }, [frameImage, photos, photoSlots, selectedFilter]);

  const downloadResult = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      await drawToCanvas(canvas);

      const link = document.createElement('a');
      link.download = getFilename();
      link.href = canvas.toDataURL('image/png');
      link.click();

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2500);
    } finally {
      setDownloading(false);
    }
  };

  const shareResult = async () => {
    setSharing(true);
    const caption = getCaption();
    try {
      const canvas = document.createElement('canvas');
      await drawToCanvas(canvas);

      const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
      const file = new File([blob], getFilename(), { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'My Framory Strip',
          text: caption,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'My Framory Strip',
          text: caption,
          url: 'https://framory-photo.vercel.app/',
        });
      } else {
        alert('Sharing not supported on this browser. Try downloading instead!');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    } finally {
      setSharing(false);
    }
  };

  const canShareSupported = typeof navigator !== 'undefined' && !!(navigator.share || navigator.canShare);

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
        .grad-text {
          background: linear-gradient(135deg, #FF8A80 0%, #FF6B9D 40%, #C77DFF 75%, #7B9CFF 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .btn-download {
          display: inline-flex; align-items: center; gap: 0.55rem;
          background: #1a1a1a; color: #fff;
          font-family: 'Nunito', sans-serif; font-weight: 800;
          font-size: clamp(0.88rem, 2.5vw, 0.95rem);
          border: none; border-radius: 100px;
          padding: clamp(0.8rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2.25rem);
          cursor: pointer; transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 6px 24px rgba(26,26,26,0.15); white-space: nowrap;
        }
        .btn-download:hover:not(:disabled) { transform: translateY(-2px) scale(1.03); box-shadow: 0 14px 36px rgba(26,26,26,0.22); }
        .btn-download:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-download.success { background: #1a7a4a; box-shadow: 0 6px 24px rgba(26,122,74,0.2); }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 0.55rem;
          background: transparent; color: #555;
          font-family: 'Nunito', sans-serif; font-weight: 700;
          font-size: clamp(0.88rem, 2.5vw, 0.95rem);
          border: 1.5px solid #E0DAD3; border-radius: 100px;
          padding: clamp(0.8rem, 3vw, 1rem) clamp(1.5rem, 5vw, 2.25rem);
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .btn-secondary:hover { border-color: #1a1a1a; color: #1a1a1a; }
        .btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-home {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: transparent; color: #B0A89A;
          font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 0.82rem;
          border: none; border-radius: 100px; padding: 0.5rem 1rem;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
          text-decoration: underline; text-decoration-color: transparent; text-underline-offset: 3px;
        }
        .btn-home:hover { color: #CC3B2A; text-decoration-color: #CC3B2A; }
        .canvas-card {
          background: #fff; border-radius: 20px; border: 1.5px solid #EDEAE4;
          padding: clamp(0.75rem, 2.5vw, 1.25rem);
          box-shadow: 0 20px 60px rgba(0,0,0,0.08); display: inline-block; transition: box-shadow 0.3s;
        }
        .canvas-card:hover { box-shadow: 0 28px 72px rgba(0,0,0,0.12); }
        .action-row { display: flex; gap: 0.75rem; align-items: center; justify-content: center; flex-wrap: wrap; }
        .wavy-wrap { position: relative; display: inline-block; }
        .wavy-wrap svg { position: absolute; bottom: -8px; left: 0; width: 100%; height: 10px; display: block; }
        @keyframes appear {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .appear { animation: appear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .appear-delay { animation: appear 0.5s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .appear-delay-2 { animation: appear 0.5s 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .action-row { flex-direction: column; width: 100%; }
          .btn-download, .btn-secondary { justify-content: center; width: 100%; }
        }
      `}</style>

      <div className="blob" style={{ width: 420, height: 420, background: 'rgba(255,194,194,0.3)', top: '-8%', right: '-5%', filter: 'blur(80px)' }} />
      <div className="blob" style={{ width: 260, height: 260, background: 'rgba(168,222,192,0.25)', bottom: '5%', left: '2%', filter: 'blur(65px)' }} />
      <div className="blob" style={{ width: 200, height: 200, background: 'rgba(196,179,255,0.2)', top: '40%', right: '5%', filter: 'blur(55px)' }} />

      <div style={{
        position: 'fixed', top: '2rem', right: 0, width: '200px', height: '200px', opacity: 0.16,
        backgroundImage: 'radial-gradient(circle, #D8D2CA 1px, transparent 1px)',
        backgroundSize: '26px 26px',
        maskImage: 'radial-gradient(ellipse at top right, black 15%, transparent 72%)',
        WebkitMaskImage: 'radial-gradient(ellipse at top right, black 15%, transparent 72%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1, width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 'clamp(1.25rem, 4vw, 2rem)',
      }}>
        <div style={{ textAlign: 'center' }} className="appear">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            background: '#fff', border: '1.5px solid #EDEAE4', borderRadius: '100px',
            padding: '0.3rem 0.85rem 0.3rem 0.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '1rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#CC3B2A', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B0A89A' }}>
              your memory
            </span>
          </div>
          <h2 style={{
            fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem, 7vw, 4rem)',
            fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '0.5rem',
          }}>
            looking{' '}
            <span className="wavy-wrap">
              <em className="grad-text" style={{ fontStyle: 'italic' }}>gorgeous</em>
              <svg viewBox="0 0 300 10" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 6 Q25 1 50 6 Q75 11 100 6 Q125 1 150 6 Q175 11 200 6 Q225 1 250 6 Q275 11 300 6"
                  fill="none" stroke="#CC3B2A" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
          </h2>
          <p style={{ color: '#B0A89A', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', fontWeight: 400 }}>
            download it before you close the tab
          </p>
        </div>

        <div className="canvas-card appear">
          <canvas
            ref={canvasRef}
            style={{
              maxWidth: '100%', height: 'auto', display: 'block',
              borderRadius: '10px', maxHeight: 'clamp(400px, 65vh, 700px)', width: 'auto',
            }}
          />
        </div>

        <div className="action-row appear-delay">
          <button
            className={`btn-download${downloaded ? ' success' : ''}`}
            onClick={downloadResult}
            disabled={downloading}
          >
            {downloaded ? (
              <><CheckCircle2 size={17} strokeWidth={2.5} /> Saved!</>
            ) : downloading ? (
              <><div style={{ width: 17, height: 17, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving...</>
            ) : (
              <><Download size={17} strokeWidth={2} /> Download Strip</>
            )}
          </button>

          {canShareSupported && (
            <button className="btn-secondary" onClick={shareResult} disabled={sharing}>
              {sharing ? (
                <><div style={{ width: 15, height: 15, border: '2px solid #DDD', borderTopColor: '#555', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Sharing...</>
              ) : (
                <><Share2 size={16} strokeWidth={2} /> Share</>
              )}
            </button>
          )}

          <button className="btn-secondary" onClick={onRetake}>
            <RotateCcw size={16} strokeWidth={2} /> Retake
          </button>
        </div>

        <div className="appear-delay-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
          <button className="btn-home" onClick={handleReset}>
            <Home size={13} strokeWidth={2} /> Start a new session
          </button>
          <p style={{
            fontFamily: "'DM Mono', monospace", fontSize: '0.58rem',
            letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8C0B8', textAlign: 'center',
          }}>
            high quality png · free forever
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultPreview;