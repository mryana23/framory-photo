import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, RotateCcw, ArrowRight, FlipHorizontal } from 'lucide-react';

const FILTERS = [
  { name: 'none',    label: 'original', css: 'none',                                                                          svgId: null,     overlay: null },
  { name: 'soft',    label: 'soft',     css: 'brightness(1.05) saturate(1.1) contrast(0.92)',                                 svgId: 'f-soft',  overlay: { opacity: 0.38, blur: 1.2 } },
  { name: 'glow',    label: 'glow',     css: 'brightness(1.12) saturate(1.25) contrast(0.88)',                                svgId: 'f-glow',  overlay: { opacity: 0.52, blur: 2.2 } },
  { name: 'mono',    label: 'mono',     css: 'grayscale(100%)',                                                                svgId: null,     overlay: null },
  { name: 'fade',    label: 'fade',     css: 'brightness(1.15) saturate(0.6) contrast(0.85)',                                          svgId: null,     overlay: null },
  { name: 'warm',    label: 'warm',     css: 'sepia(0.35) saturate(1.3) brightness(1.05)',                                      svgId: null,     overlay: null },
  { name: 'vintage', label: 'vintage',  css: 'sepia(0.6) contrast(0.85) brightness(0.95) saturate(0.8)',                                 svgId: null,     overlay: null },
];

const SVG_FILTERS = `
<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden">
  <defs>
    <filter id="f-soft" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="1.2" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
    <filter id="f-glow" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="2.2" result="blur"/>
      <feBlend in="SourceGraphic" in2="blur" mode="screen" result="blended"/>
      <feComposite in="blended" in2="SourceGraphic" operator="over"/>
    </filter>
  </defs>
</svg>
`;

const CameraCapture = ({ selectedFrame, photoSlots, photos: initialPhotos, onPhotosComplete }) => {
  const [photos, setPhotos] = useState(initialPhotos || []);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(initialPhotos?.length || 0);
  const [countdown, setCountdown] = useState(null);
  const [stream, setStream] = useState(null);
  const [flash, setFlash] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [retakingIndex, setRetakingIndex] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [facingMode, setFacingMode] = useState('user');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async (mode) => {
    const activeMode = mode ?? facingMode;
    try {
      if (stream) stream.getTracks().forEach(track => track.stop());
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: activeMode, width: 1280, height: 720 }
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      alert('Cannot access camera. Please allow camera permission.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleFlipCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    startCamera(newMode);
  };

  const handleTakePhoto = () => {
    if (countdown !== null) return;
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(timer);
          setTimeout(() => capturePhoto(), 100);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) { alert('Camera error. Please try again.'); return; }
    if (video.readyState !== video.HAVE_ENOUGH_DATA) { alert('Camera not ready. Please wait.'); return; }
    if (video.videoWidth === 0 || video.videoHeight === 0) { alert('No video feed. Please check camera.'); return; }

    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const activeFilter = FILTERS.find(f => f.name === selectedFilter);
    const isMirrored = facingMode === 'user';

    context.filter = activeFilter?.css !== 'none' ? activeFilter.css : 'none';
    if (isMirrored) {
      context.save();
      context.scale(-1, 1);
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
      context.restore();
    } else {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    context.filter = 'none';

    if (activeFilter?.overlay) {
      const { blur, opacity } = activeFilter.overlay;
      const offscreen = document.createElement('canvas');
      offscreen.width = canvas.width;
      offscreen.height = canvas.height;
      const offCtx = offscreen.getContext('2d');
      offCtx.filter = `blur(${blur * 2}px) ${activeFilter.css !== 'none' ? activeFilter.css : ''}`.trim();
      if (isMirrored) {
        offCtx.save();
        offCtx.scale(-1, 1);
        offCtx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        offCtx.restore();
      } else {
        offCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      offCtx.filter = 'none';

      context.globalAlpha = opacity;
      context.globalCompositeOperation = selectedFilter === 'glow' ? 'screen' : 'normal';
      context.drawImage(offscreen, 0, 0);
      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';
    }

    const photoData = canvas.toDataURL('image/png');
    if (!photoData || photoData.length < 1000) { alert('Failed to capture photo. Please try again.'); return; }

    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    let newPhotos;
    if (retakingIndex !== null) {
      newPhotos = [...photos];
      newPhotos[retakingIndex] = photoData;
      setPhotos(newPhotos);
      setRetakingIndex(null);
    } else {
      newPhotos = [...photos, photoData];
      setPhotos(newPhotos);
      setCurrentPhotoIndex(Math.min(newPhotos.length, totalSlots - 1));
    }

    if (newPhotos.length >= 4 && retakingIndex === null) {
      setTimeout(() => {
        stopCamera();
        setReviewMode(true);
      }, 400);
    } else if (retakingIndex !== null) {
      setTimeout(() => {
        stopCamera();
        setReviewMode(true);
      }, 400);
    }
  };

  const handleRetakePhoto = async (index) => {
    setRetakingIndex(index);
    setReviewMode(false);
    await startCamera(facingMode);
  };

  const handleConfirm = () => {
    onPhotosComplete(photos, selectedFilter);
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => stopCamera();
  }, []);

  const totalSlots = 4;
  const shootingIndex = retakingIndex !== null ? retakingIndex : currentPhotoIndex;
  const activeCssFilter = FILTERS.find(f => f.name === selectedFilter)?.css || 'none';

  // ── REVIEW MODE ──
  if (reviewMode) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#FBF8F4',
        fontFamily: "'Nunito', sans-serif",
        color: '#1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem)',
        position: 'relative',
        overflowX: 'hidden',
      }}>
        <style>{`
          .blob { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
          .grad-text {
            background: linear-gradient(135deg, #FF8A80 0%, #FF6B9D 40%, #C77DFF 75%, #7B9CFF 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          }
          .retake-btn {
            display: inline-flex; align-items: center; gap: 0.35rem;
            font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 0.75rem;
            background: rgba(26,26,26,0.75); color: #fff;
            border: none; border-radius: 100px;
            padding: 0.4rem 0.85rem; cursor: pointer;
            transition: all 0.2s; backdrop-filter: blur(4px);
          }
          .retake-btn:hover { background: #1a1a1a; transform: scale(1.05); }
          .confirm-btn {
            display: inline-flex; align-items: center; gap: 0.5rem;
            font-family: 'Nunito', sans-serif; font-weight: 800; font-size: 1rem;
            background: #1a1a1a; color: #fff;
            border: none; border-radius: 100px;
            padding: 0.9rem 2.5rem; cursor: pointer;
            transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 8px 28px rgba(26,26,26,0.18);
          }
          .confirm-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 14px 36px rgba(26,26,26,0.25); }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          .fade-in { animation: fadeIn 0.4s ease both; }
        `}</style>

        <div className="blob" style={{ width: 360, height: 360, background: 'rgba(255,194,194,0.3)', top: '-8%', right: '0%', filter: 'blur(75px)' }} />
        <div className="blob" style={{ width: 240, height: 240, background: 'rgba(196,179,255,0.22)', bottom: '5%', left: '2%', filter: 'blur(60px)' }} />

        <div className="fade-in" style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '680px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>

          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 400, lineHeight: 1, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '0.4rem' }}>
              looking <em className="grad-text">good?</em>
            </h2>
            <p style={{ color: '#B0A89A', fontSize: '0.9rem', fontWeight: 400 }}>
              retake any photo you're not happy with, then continue.
            </p>
          </div>

          {/* 2x2 photo grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%' }}>
            {photos.map((photo, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #EDEAE4', aspectRatio: '4/3', background: '#1a1a1a' }}>
                <img
                  src={photo}
                  alt={`Photo ${i + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', top: '0.6rem', left: '0.6rem',
                  width: '1.6rem', height: '1.6rem', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(4px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: '0.85rem', color: '#1a1a1a',
                }}>
                  {i + 1}
                </div>
                <div style={{ position: 'absolute', bottom: '0.6rem', right: '0.6rem' }}>
                  <button className="retake-btn" onClick={() => handleRetakePhoto(i)}>
                    <RotateCcw size={11} strokeWidth={2.5} />
                    Retake
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Confirm button */}
          <button className="confirm-btn" onClick={handleConfirm}>
            <CheckCircle2 size={17} strokeWidth={2} />
            Looks good, continue
            <ArrowRight size={15} />
          </button>

          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8C0B8' }}>
            tap retake to redo individual shots
          </p>
        </div>
      </div>
    );
  }

  // ── CAMERA MODE ──
  const activeFilterObj = FILTERS.find(f => f.name === selectedFilter);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#FBF8F4',
      fontFamily: "'Nunito', sans-serif",
      color: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(0.5rem, 1.5vw, 1.5rem) clamp(1.2rem, 1.5vw, 2rem)',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      <style>{`
        @keyframes flash-anim { 0% { opacity: 0.85; } 100% { opacity: 0; } }
        .flash-overlay { animation: flash-anim 0.2s ease-out forwards; }
        @keyframes count-pop { 0% { transform: scale(1.4); opacity: 0; } 30% { opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        .count-pop { animation: count-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .shutter-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.6rem;
          background: #1a1a1a; color: #fff;
          font-family: 'Nunito', sans-serif; font-weight: 800; font-size: clamp(0.9rem, 2.5vw, 1rem);
          border: none; border-radius: 100px;
          padding: clamp(0.85rem, 3vw, 1rem) clamp(1.75rem, 6vw, 3rem);
          cursor: pointer; transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 6px 24px rgba(26,26,26,0.15);
        }
        .shutter-btn:hover:not(:disabled) { transform: translateY(-2px) scale(1.03); box-shadow: 0 14px 36px rgba(26,26,26,0.22); }
        .shutter-btn:disabled { opacity: 0.55; cursor: not-allowed; }
        .thumb { border-radius: 10px; overflow: hidden; border: 2px solid #EDEAE4; flex-shrink: 0; transition: border-color 0.2s; background: #F2EEE8; }
        .thumb.filled { border-color: #CC3B2A; }
        .thumb.active { border-color: #1a1a1a; box-shadow: 0 0 0 3px rgba(26,26,26,0.1); }
        .thumb.retaking { border-color: #C77DFF; box-shadow: 0 0 0 3px rgba(199,125,255,0.2); }
        .blob { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; }
        .grad-text { background: linear-gradient(135deg, #FF8A80 0%, #FF6B9D 40%, #C77DFF 75%, #7B9CFF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .video-wrapper { width: 100%; max-width: 550px!important; }
        @media (max-width: 640px) { .video-wrapper { max-width: 100%; } }
        @media (max-height: 700px) { .video-wrapper { max-width: 520px; } }
        .filter-item { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; flex-shrink: 0; }
        .filter-thumb-cam {
          width: 40px; height: 40px; border-radius: 10px; overflow: hidden;
          border: 2px solid #EDEAE4; transition: border-color 0.15s, transform 0.15s;
          background: #1a1a1a;
        }
        .filter-thumb-cam.active {
          border-color: #1a1a1a;
          transform: scale(1.1);
          box-shadow: 0 0 0 3px rgba(26,26,26,0.1);
        }
        .filter-label {
          font-size: 9px; font-family: 'DM Mono', monospace; letter-spacing: 0.05em;
          text-transform: uppercase; color: #C8C0B8; font-weight: 400; transition: color 0.15s;
        }
        .filter-label.active { color: #1a1a1a; font-weight: 700; }
        .flip-btn {
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.9); border: 1.5px solid #EDEAE4;
          border-radius: 50%; width: 44px; height: 44px;
          cursor: pointer; transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 14px rgba(0,0,0,0.08); backdrop-filter: blur(4px);
        }
        .flip-btn:hover { transform: scale(1.08) rotate(15deg); box-shadow: 0 8px 20px rgba(0,0,0,0.12); }
        .flip-btn:active { transform: scale(0.95) rotate(180deg); }
      `}</style>

      <div className="blob" style={{ width: 360, height: 360, background: 'rgba(255,194,194,0.3)', top: '-8%', right: '0%', filter: 'blur(75px)' }} />
      <div className="blob" style={{ width: 240, height: 240, background: 'rgba(196,179,255,0.22)', bottom: '5%', left: '2%', filter: 'blur(60px)' }} />

      <div dangerouslySetInnerHTML={{ __html: SVG_FILTERS }} style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(0.5rem, 1vw, 1rem)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            background: '#fff', border: '1.5px solid #EDEAE4', borderRadius: '100px',
            padding: '0.3rem 0.85rem 0.3rem 0.5rem',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '1rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: retakingIndex !== null ? '#C77DFF' : '#CC3B2A', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B0A89A' }}>
              {retakingIndex !== null ? `retaking photo ${retakingIndex + 1}` : selectedFrame?.name}
            </span>
          </div>

          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(1.75rem, 6vw, 3.25rem)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.01em', color: '#1a1a1a', marginBottom: '0.25rem' }}>
            {retakingIndex !== null ? (
              <>retake <em className="grad-text" style={{ fontStyle: 'italic' }}>#{retakingIndex + 1}</em></>
            ) : (
              <>photo{' '}<em className="grad-text" style={{ fontStyle: 'italic' }}>{shootingIndex + 1}</em>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: 'clamp(1rem, 3vw, 1.5rem)', fontWeight: 400, color: '#C8C0B8', fontStyle: 'normal' }}> / {totalSlots}</span></>
            )}
          </h2>
          <p style={{ color: '#B0A89A', fontSize: 'clamp(0.8rem, 1vw, 0.9rem)', fontWeight: 400 }}>
            {countdown ? 'get ready...' : 'strike a pose'}
          </p>
        </div>

        {/* Camera viewfinder */}
        <div className="video-wrapper" style={{ position: 'relative' }}>
          <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1.5px solid #EDEAE4', background: '#1a1a1a', position: 'relative', boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}>
            {flash && <div className="flash-overlay" style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 30, borderRadius: '18px' }} />}
            {countdown && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, borderRadius: '18px' }}>
                <span key={countdown} className="count-pop" style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: 'clamp(5rem, 20vw, 9rem)', color: '#fff', lineHeight: 1 }}>{countdown}</span>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                aspectRatio: '16/10',
                objectFit: 'cover',
                transform: facingMode === 'user' ? 'scaleX(-1)' : 'scaleX(1)',
                display: 'block',
                filter: activeCssFilter,
              }}
            />
            {/* Soft/glow smoothing overlay */}
            {activeFilterObj?.overlay && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
                backdropFilter: `blur(${activeFilterObj.overlay.blur}px)`,
                WebkitBackdropFilter: `blur(${activeFilterObj.overlay.blur}px)`,
                opacity: activeFilterObj.overlay.opacity,
                mixBlendMode: selectedFilter === 'glow' ? 'screen' : 'normal',
                borderRadius: '18px',
              }} />
            )}

            {/* Flip camera button */}
            <button
              className="flip-btn"
              onClick={handleFlipCamera}
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 10 }}
              title={facingMode === 'user' ? 'Switch to back camera' : 'Switch to front camera'}
            >
              <FlipHorizontal size={18} strokeWidth={2} color="#1a1a1a" />
            </button>

            {/* Corner markers */}
            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => {
              const isTop = pos.includes('top'), isLeft = pos.includes('left');
              return (
                <div key={pos} style={{ position: 'absolute', top: isTop ? '0.75rem' : 'auto', bottom: !isTop ? '0.75rem' : 'auto', left: isLeft ? '0.75rem' : 'auto', right: !isLeft ? '0.75rem' : 'auto', width: '1.25rem', height: '1.25rem', borderTop: isTop ? '2px solid rgba(255,255,255,0.4)' : 'none', borderBottom: !isTop ? '2px solid rgba(255,255,255,0.4)' : 'none', borderLeft: isLeft ? '2px solid rgba(255,255,255,0.4)' : 'none', borderRight: !isLeft ? '2px solid rgba(255,255,255,0.4)' : 'none', borderRadius: isTop && isLeft ? '4px 0 0 0' : isTop ? '0 4px 0 0' : isLeft ? '0 0 0 4px' : '0 0 4px 0' }} />
              );
            })}
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        {/* Thumbnail strip */}
        <div style={{ display: 'flex', gap: 'clamp(0.4rem, 2vw, 0.6rem)', alignItems: 'center', justifyContent: 'center' }}>
          {Array.from({ length: totalSlots }).map((_, i) => {
            const isFilled = i < photos.length;
            const isActive = i === shootingIndex && retakingIndex === null;
            const isRetaking = i === retakingIndex;
            return (
              <div key={i} className={`thumb${isFilled ? ' filled' : ''}${isActive ? ' active' : ''}${isRetaking ? ' retaking' : ''}`} style={{ width: 50, height: 50, position: 'relative' }}>
                {isFilled ? (
                  <>
                    <img src={photos[i]} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: isRetaking ? 0.4 : 1 }} />
                    {!isRetaking && (
                      <div style={{ position: 'absolute', bottom: 3, right: 3, width: 16, height: 16, borderRadius: '50%', background: '#CC3B2A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 size={10} style={{ color: '#fff', strokeWidth: 2.5 }} />
                      </div>
                    )}
                    {isRetaking && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#C77DFF', fontWeight: 500 }}>retaking</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "'Fraunces', serif", fontStyle: 'italic', fontSize: '1.1rem', color: isActive ? '#1a1a1a' : '#D8D2CA', lineHeight: 1 }}>{i + 1}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Filter strip — FIX: added position relative + zIndex 10 so overlay blur doesn't block clicks */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', padding: '2px 0 6px', width: '100%', maxWidth: '550px', justifyContent: 'center', scrollbarWidth: 'none', position: 'relative', zIndex: 10 }}>
          {FILTERS.map(f => (
            <div key={f.name} className="filter-item" onClick={() => setSelectedFilter(f.name)}>
              <div className={`filter-thumb-cam${selectedFilter === f.name ? ' active' : ''}`}>
                <div style={{
                  width: '100%', height: '100%',
                  background:
                    f.name === 'mono'    ? '#888'    :
                    f.name === 'warm'    ? '#c4956a' :
                    f.name === 'vintage' ? '#b09070' :
                    f.name === 'fade'    ? '#c8c0b8' :
                    f.name === 'soft'    ? '#f2c4b8' :
                    f.name === 'glow'    ? '#ffe0cc' :
                    '#d8d2ca',
                }} />
              </div>
              <span className={`filter-label${selectedFilter === f.name ? ' active' : ''}`}>{f.label}</span>
            </div>
          ))}
        </div>

        {/* Shutter button */}
        <button className="shutter-btn" onClick={handleTakePhoto} disabled={countdown !== null}>
          <Camera size={18} strokeWidth={2} />
          {countdown ? 'get ready...' : retakingIndex !== null ? `Retake Photo ${retakingIndex + 1}` : 'Take Photo'}
        </button>

        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8C0B8' }}>
          {retakingIndex !== null ? `replacing photo ${retakingIndex + 1}` : totalSlots - photos.length > 0 ? `${totalSlots - photos.length} shot${totalSlots - photos.length > 1 ? 's' : ''} remaining` : 'processing...'}
        </p>
      </div>
    </div>
  );
};

export default CameraCapture;