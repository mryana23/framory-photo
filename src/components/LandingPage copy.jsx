import React, { useState, useEffect, useRef } from 'react';
import { Camera, Palette, Download, Star, Menu, X, ArrowRight, Zap, Heart } from 'lucide-react';
import { themes } from '../data/themes';

const features = [
  { icon: '📷', title: 'Instant Capture', desc: 'Take 4 photos in a row with live preview. No lag, just vibes.', tag: '4-shot burst' },
  { icon: '🎨', title: 'Aesthetic Frames', desc: 'Curated themes that match your current era.', tag: 'so many options' },
  { icon: '⚡', title: 'Instant Results', desc: 'Your strip is ready in seconds. Download & post immediately.', tag: 'lightning fast' },
  { icon: '💾', title: 'Easy Download', desc: 'High quality, straight to your camera roll. No account needed.', tag: 'no signup' },
];

const steps = [
  { num: '1', title: 'Pick a Theme', desc: 'Find your current aesthetic.', emoji: '🎨', color: '#FF6B6B' },
  { num: '2', title: 'Choose a Frame', desc: 'Classic strip or custom layout.', emoji: '🖼️', color: '#FFD93D' },
  { num: '3', title: 'Strike a Pose', desc: '4 shots, all the drama.', emoji: '✨', color: '#6BCB77' },
  { num: '4', title: 'Save & Share', desc: 'Post it immediately, obviously.', emoji: '💾', color: '#4D96FF' },
];

const reviews = [
  { name: 'Sasha K.', handle: '@sasha.captures', text: "literally the cutest photo booth app ever omg. the themes are SO good 🤌", stars: 5, bg: '#FF6B6B' },
  { name: 'mio.jpg', handle: '@mio.frames', text: "used this for my bestie's bday!! everyone wanted their own strips 😭💕", stars: 5, bg: '#c084fc' },
  { name: 'Reva', handle: '@reva.art', text: 'the dark romance theme is actually unhinged (in the best way). felt like a main character', stars: 5, bg: '#FFD93D' },
];

const fallbackExtras = {
  bg: 'from-purple-950 to-slate-900',
  accent: '#a855f7',
  preview: ['#1e1b4b', '#4c1d95', '#7c3aed', '#a855f7'],
};

export default function LandingPage({ onSelectTheme }) {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [marqueePos, setMarqueePos] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    let pos = 0;
    const tick = () => {
      pos -= 0.6;
      setMarqueePos(pos);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const goto = (id) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const marqueeItems = ['📸 pick your vibe', '✨ aesthetic strips', '💕 no signup needed', '🎨 curated themes', '⚡ instant download', '🖼️ strike a pose'];

  return (
    <div style={{ minHeight: '100vh', background: '#F5F0EB', color: '#0D0D0D', overflowX: 'hidden', fontFamily: "'Syne', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700;800&family=Syne:wght@400;700;800;900&family=Syne+Mono&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .logo-fra { font-family: 'Syne', sans-serif; font-weight: 900; font-size: 1.5rem; letter-spacing: -0.04em; color: #0D0D0D; }
        .logo-mory { font-family: 'Caveat', cursive; font-weight: 800; font-size: 1.85rem; color: #E63946; letter-spacing: 0.01em; line-height: 1; }
        .logo-wrap { display: inline-flex; align-items: baseline; gap: 0px; line-height: 1; }

        .pill-badge { display: inline-flex; align-items: center; gap: 0.375rem; font-family: 'Syne Mono', monospace; font-size: 0.7rem; padding: 0.3rem 0.75rem; border-radius: 9999px; border: 1.5px solid currentColor; font-weight: 600; letter-spacing: 0.04em; text-transform: lowercase; }

        .btn-red { display: inline-flex; align-items: center; gap: 0.625rem; padding: 1rem 2.25rem; border-radius: 9999px; background: #E63946; color: #fff; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; border: 2px solid #0D0D0D; cursor: pointer; letter-spacing: -0.02em; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 4px 4px 0px #0D0D0D; }
        .btn-red:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #0D0D0D; }
        .btn-red:active { transform: translate(1px, 1px); box-shadow: 2px 2px 0px #0D0D0D; }

        .btn-outline { display: inline-flex; align-items: center; gap: 0.625rem; padding: 1rem 2.25rem; border-radius: 9999px; background: transparent; color: #0D0D0D; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1rem; border: 2px solid #0D0D0D; cursor: pointer; letter-spacing: -0.02em; transition: transform 0.15s, box-shadow 0.15s, background 0.15s; box-shadow: 4px 4px 0px #0D0D0D; }
        .btn-outline:hover { background: #0D0D0D; color: #F5F0EB; transform: translate(-2px, -2px); box-shadow: 6px 6px 0px #E63946; }

        .hero-headline { font-family: 'Syne', sans-serif; font-weight: 900; line-height: 0.95; letter-spacing: -0.05em; font-size: clamp(3.25rem, 11vw, 8.5rem); }
        .hero-script { font-family: 'Caveat', cursive; font-weight: 800; font-size: clamp(3.75rem, 13vw, 10rem); line-height: 0.9; color: #E63946; letter-spacing: 0.01em; }
        .section-heading { font-family: 'Syne', sans-serif; font-weight: 900; letter-spacing: -0.04em; font-size: clamp(2rem, 5.5vw, 3.75rem); line-height: 1.0; }
        .section-script { font-family: 'Caveat', cursive; font-weight: 800; font-size: clamp(2.5rem, 6.5vw, 4.75rem); color: #E63946; line-height: 0.9; }

        .nav-link { color: #0D0D0D; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.875rem; background: none; border: none; cursor: pointer; transition: color 0.15s; letter-spacing: -0.02em; }
        .nav-link:hover { color: #E63946; }

        .feat-card { background: #fff; border: 2px solid #0D0D0D; border-radius: 1.25rem; padding: 1.75rem; box-shadow: 5px 5px 0px #0D0D0D; transition: transform 0.15s, box-shadow 0.15s; position: relative; overflow: hidden; }
        .feat-card:hover { transform: translate(-3px, -3px); box-shadow: 8px 8px 0px #0D0D0D; }

        .step-card { border: 2px solid rgba(245,240,235,0.15); border-radius: 1.25rem; padding: 1.5rem; background: rgba(245,240,235,0.04); position: relative; }

        .rev-card { border: 2px solid #0D0D0D; border-radius: 1.5rem; padding: 1.75rem; box-shadow: 5px 5px 0px #0D0D0D; position: relative; overflow: hidden; transition: transform 0.15s, box-shadow 0.15s; }
        .rev-card:hover { transform: translate(-3px, -3px); box-shadow: 8px 8px 0px #0D0D0D; }

        .theme-card { border: 2px solid #0D0D0D; border-radius: 1.5rem; overflow: hidden; box-shadow: 5px 5px 0px #0D0D0D; cursor: pointer; text-align: left; background: #fff; transition: transform 0.15s, box-shadow 0.15s; display: flex; flex-direction: column; }
        .theme-card:hover { transform: translate(-4px, -4px); box-shadow: 9px 9px 0px #E63946; }

        .tag-chip { display: inline-block; font-family: 'Syne Mono', monospace; font-size: 0.65rem; padding: 0.2rem 0.6rem; border-radius: 9999px; background: #F5F0EB; border: 1.5px solid #0D0D0D; font-weight: 600; letter-spacing: 0.05em; text-transform: lowercase; color: #0D0D0D; }

        .marquee-track { display: flex; gap: 0; white-space: nowrap; font-family: 'Caveat', cursive; font-weight: 700; font-size: 1.4rem; color: #F5F0EB; }
        .marquee-item { padding: 0 2.5rem; display: inline-flex; align-items: center; gap: 1rem; }

        .sticker { position: absolute; pointer-events: none; font-size: 2rem; line-height: 1; filter: drop-shadow(2px 2px 0px rgba(0,0,0,0.15)); }
        @keyframes floatY { 0%,100%{transform:translateY(0) rotate(var(--rot,0deg))}50%{transform:translateY(-12px) rotate(var(--rot,0deg))} }
        .sticker { animation: floatY 4s ease-in-out infinite; }

        .rotating-badge { width: 7rem; height: 7rem; border-radius: 50%; background: #FFD93D; border: 2px solid #0D0D0D; display: flex; align-items: center; justify-content: center; position: relative; box-shadow: 3px 3px 0px #0D0D0D; flex-shrink: 0; }
        .rotating-badge-text { position: absolute; inset: 0; animation: spin 12s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounceDown { 0%,100%{transform:translateY(0)}50%{transform:translateY(8px)} }

        @media (max-width: 900px) {
          .features-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .themes-grid { grid-template-columns: 1fr 1fr !important; }
          .reviews-grid { grid-template-columns: 1fr !important; }
          .hero-badge-row { flex-direction: column !important; align-items: flex-start !important; }
          .rotating-badge { display: none !important; }
        }
        @media (max-width: 600px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .themes-grid { grid-template-columns: 1fr !important; }
          .hero-cta-row { flex-direction: column !important; align-items: flex-start !important; }
          .stats-row { flex-direction: column !important; gap: 1rem !important; }
          .desktop-only { display: none !important; }
          .feat-split { flex-direction: column !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, transition: 'all 0.25s', background: scrolled ? 'rgba(245,240,235,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: scrolled ? '2px solid #0D0D0D' : 'none' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="logo-wrap" style={{ cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="logo-fra">fra</span>
            <span className="logo-mory">mory</span>
          </div>
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            {[['Features', 'features'], ['How It Works', 'how'], ['Themes', 'themes']].map(([l, id]) => (
              <button key={id} className="nav-link" onClick={() => goto(id)}>{l}</button>
            ))}
          </div>
          <button className="btn-red desktop-only" onClick={() => goto('themes')} style={{ padding: '0.625rem 1.5rem', fontSize: '0.875rem', boxShadow: '3px 3px 0 #0D0D0D' }}>Try now ✨</button>
          <button onClick={() => setNavOpen(!navOpen)} style={{ background: 'none', border: '2px solid #0D0D0D', borderRadius: '0.5rem', padding: '0.4rem', cursor: 'pointer', display: 'none' }} className="mobile-menu-btn">
            <style>{`.mobile-menu-btn{display:flex!important;}@media(min-width:601px){.mobile-menu-btn{display:none!important;}}`}</style>
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {navOpen && (
          <div style={{ background: '#F5F0EB', borderTop: '2px solid #0D0D0D', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[['Features', 'features'], ['How It Works', 'how'], ['Themes', 'themes']].map(([l, id]) => (
              <button key={id} className="nav-link" style={{ fontSize: '1.1rem', textAlign: 'left' }} onClick={() => goto(id)}>{l}</button>
            ))}
            <button className="btn-red" onClick={() => goto('themes')} style={{ justifyContent: 'center' }}>Try now ✨</button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(7rem, 16vw, 11rem) 1.5rem clamp(4rem, 8vw, 6rem)', maxWidth: '80rem', margin: '0 auto', position: 'relative' }}>
        <div className="sticker" style={{ top: '9rem', right: '6%', '--rot': '12deg', animationDelay: '0s' }}>✨</div>
        <div className="sticker" style={{ top: '15rem', right: '17%', '--rot': '-8deg', animationDelay: '1s', fontSize: '1.5rem' }}>📸</div>
        <div className="sticker" style={{ bottom: '3rem', right: '10%', '--rot': '5deg', animationDelay: '2s' }}>💕</div>
        <div className="sticker" style={{ bottom: '5rem', left: '1%', '--rot': '-12deg', animationDelay: '0.5s' }}>🌸</div>

        <div style={{ marginBottom: '1.75rem' }}>
          <span className="pill-badge" style={{ color: '#E63946', borderColor: '#E63946', background: 'rgba(230,57,70,0.07)' }}>✦ free forever · no account needed</span>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <div className="hero-headline">your photos,</div>
          <div className="hero-script">but make it</div>
          <div className="hero-headline">aesthetic<span style={{ color: '#E63946' }}>.</span></div>
        </div>

        <div className="hero-badge-row" style={{ display: 'flex', alignItems: 'flex-end', gap: '3rem', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#666', maxWidth: '28rem', lineHeight: 1.65 }}>
            A digital photo booth that turns your selfies into beautiful strips — curated themes, dreamy frames, instant downloads.
          </p>
          <div className="rotating-badge">
            <svg className="rotating-badge-text" viewBox="0 0 100 100">
              <path id="circle-path" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
              <text fontSize="9.5" fontFamily="'Syne Mono', monospace" fontWeight="700" fill="#0D0D0D" letterSpacing="2">
                <textPath href="#circle-path">📸 PHOTO BOOTH · AESTHETIC ·&nbsp;</textPath>
              </text>
            </svg>
            <span style={{ fontSize: '2rem', zIndex: 1 }}>✨</span>
          </div>
        </div>

        <div className="hero-cta-row" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <button className="btn-red" onClick={() => goto('themes')} style={{ fontSize: '1.05rem', padding: '1rem 2.25rem' }}>
            Start a Session <ArrowRight size={18} />
          </button>
          <button className="btn-outline" onClick={() => goto('how')}>How It Works</button>
        </div>

        <div className="stats-row" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex' }}>
              {['🧑‍🎤','👩‍🎨','🧑‍💻','👩‍🦰','🧑‍🦱'].map((e,i) => (
                <div key={i} style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: ['#FF6B6B','#FFD93D','#6BCB77','#4D96FF','#c084fc'][i], border: '2.5px solid #F5F0EB', marginLeft: i>0?'-0.6rem':0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', zIndex:5-i, boxShadow:'1px 1px 0 rgba(0,0,0,0.2)' }}>{e}</div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '-0.02em' }}>10,000+</div>
              <div style={{ fontSize: '0.75rem', color: '#888', fontFamily: "'Syne Mono', monospace" }}>strips created</div>
            </div>
          </div>
          <div style={{ width: 1, height: '2rem', background: '#ddd' }} />
          <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
            {[...Array(5)].map((_,i) => <Star key={i} size={14} style={{ color: '#E63946', fill: '#E63946' }} />)}
            <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: '0.8rem', color: '#666', marginLeft: '0.4rem' }}>4.9 avg</span>
          </div>
        </div>

        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
          <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', color: '#aaa', animation: 'bounceDown 2s ease-in-out infinite', display: 'inline-block' }}>SCROLL ↓</span>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ background: '#E63946', borderTop: '2px solid #0D0D0D', borderBottom: '2px solid #0D0D0D', padding: '0.875rem 0', overflow: 'hidden' }}>
        <div className="marquee-track" style={{ transform: `translateX(${marqueePos % (marqueeItems.length * 280)}px)` }}>
          {[...marqueeItems,...marqueeItems,...marqueeItems,...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFD93D', display: 'inline-block' }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: 'clamp(4rem, 10vw, 7rem) 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
        <div className="feat-split" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', gap: '1.5rem' }}>
          <div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span className="pill-badge" style={{ color: '#888', borderColor: '#ccc' }}>✦ why framory</span>
            </div>
            <div className="section-heading">everything</div>
            <div className="section-script">you need,</div>
            <div className="section-heading">nothing you don't.</div>
          </div>
          <button className="btn-red" onClick={() => goto('themes')}>pick a theme <ArrowRight size={16} /></button>
        </div>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
          {features.map((f, i) => (
            <div key={i} className="feat-card">
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <span className="tag-chip">{f.tag}</span>
              </div>
              <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem', lineHeight: 1 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: '#777', fontSize: '0.875rem', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ZIGZAG DIVIDER ── */}
      <div style={{ background: '#0D0D0D', borderTop: '2px solid #0D0D0D', overflow: 'hidden' }}>
        <svg viewBox="0 0 1440 32" style={{ display: 'block', width: '100%' }} preserveAspectRatio="none">
          <polygon points="0,0 60,32 120,0 180,32 240,0 300,32 360,0 420,32 480,0 540,32 600,0 660,32 720,0 780,32 840,0 900,32 960,0 1020,32 1080,0 1140,32 1200,0 1260,32 1320,0 1380,32 1440,0 1440,32 0,32" fill="#F5F0EB" />
        </svg>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ background: '#0D0D0D', color: '#F5F0EB', padding: 'clamp(4rem, 10vw, 7rem) 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
            <span className="pill-badge" style={{ color: '#FFD93D', borderColor: 'rgba(255,217,61,0.4)', background: 'rgba(255,217,61,0.08)', marginBottom: '1rem', display: 'inline-flex' }}>✦ the process</span>
            <div className="section-heading" style={{ color: '#F5F0EB' }}>how it works</div>
            <div className="section-script" style={{ color: '#FFD93D' }}>it's so easy bestie</div>
          </div>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
            {steps.map((step, i) => (
              <div key={i} className="step-card" style={{ boxShadow: `4px 4px 0px ${step.color}`, borderColor: 'rgba(245,240,235,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{step.emoji}</div>
                  <span style={{ fontFamily: "'Syne Mono', monospace", fontSize: '0.75rem', color: 'rgba(245,240,235,0.3)', fontWeight: 700 }}>{step.num}/4</span>
                </div>
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.03em', marginBottom: '0.5rem', color: '#F5F0EB' }}>{step.title}</h3>
                <p style={{ color: 'rgba(245,240,235,0.5)', fontSize: '0.875rem', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <button className="btn-red" onClick={() => goto('themes')} style={{ background: '#FFD93D', color: '#0D0D0D', boxShadow: '4px 4px 0 rgba(245,240,235,0.25)', borderColor: 'rgba(245,240,235,0.2)' }}>
              start now, it's free ✨
            </button>
          </div>
        </div>
      </section>

      <div style={{ background: '#0D0D0D', overflow: 'hidden' }}>
        <svg viewBox="0 0 1440 32" style={{ display: 'block', width: '100%' }} preserveAspectRatio="none">
          <polygon points="0,32 60,0 120,32 180,0 240,32 300,0 360,32 420,0 480,32 540,0 600,32 660,0 720,32 780,0 840,32 900,0 960,32 1020,0 1080,32 1140,0 1200,32 1260,0 1320,32 1380,0 1440,32 1440,32 0,32" fill="#F5F0EB" />
        </svg>
      </div>

      {/* ── REVIEWS ── */}
      <section style={{ padding: 'clamp(4rem, 10vw, 7rem) 1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <span className="pill-badge" style={{ color: '#888', borderColor: '#ccc' }}>✦ testimonials</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div className="section-heading">people are</div>
            <div className="section-script" style={{ color: '#E63946' }}>obsessed 🤩</div>
          </div>
        </div>
        <div className="reviews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
          {reviews.map((r, i) => (
            <div key={i} className="rev-card" style={{ background: r.bg + '14' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: r.bg, borderRadius: '6px 6px 0 0' }} />
              <div style={{ display: 'flex', gap: '3px', marginBottom: '1rem' }}>
                {[...Array(r.stars)].map((_,j) => <Star key={j} size={14} style={{ color: '#E63946', fill: '#E63946' }} />)}
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '1.25rem', color: '#333' }}>"{r.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: r.bg, border: '2px solid #0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>{r.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', letterSpacing: '-0.02em' }}>{r.name}</div>
                  <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: '0.7rem', color: '#888' }}>{r.handle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THEMES ── */}
      <section id="themes" style={{ background: '#fff', borderTop: '2px solid #0D0D0D', borderBottom: '2px solid #0D0D0D', padding: 'clamp(4rem, 10vw, 7rem) 1.5rem' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <span className="pill-badge" style={{ color: '#888', borderColor: '#ccc' }}>✦ pick your vibe</span>
            </div>
            <div className="section-heading">choose a theme</div>
            <div className="section-script" style={{ color: '#E63946' }}>&amp; start shooting 📸</div>
            <p style={{ color: '#888', marginTop: '0.75rem', fontSize: '1rem' }}>Select your aesthetic — we'll take you right into the booth.</p>
          </div>
          <div className="themes-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {themes.map((theme) => {
              const preview = theme.preview || fallbackExtras.preview;
              return (
                <button key={theme.id} className="theme-card" onClick={() => onSelectTheme(theme)}>
                  <div style={{ height: '9rem', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${preview[0]}, ${preview[preview.length - 1]})` }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', gap: '4px', padding: '1rem 1.25rem 0' }}>
                      {preview.map((color, i) => (
                        <div key={i} style={{ flex: 1, height: '3.5rem', borderRadius: '6px 6px 0 0', backgroundColor: color, border: '1px solid rgba(0,0,0,0.1)' }} />
                      ))}
                    </div>
                    <div style={{ position: 'absolute', top: '0.875rem', left: '0.875rem', fontSize: '1.75rem', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}>{theme.emoji || '🎨'}</div>
                  </div>
                  <div style={{ padding: '1.1rem 1.25rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.03em', marginBottom: '0.2rem' }}>{theme.name}</h3>
                      {theme.description && <p style={{ color: '#888', fontSize: '0.8rem' }}>{theme.description}</p>}
                    </div>
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#E63946', border: '2px solid #0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '2px 2px 0 #0D0D0D' }}>
                      <ArrowRight size={13} style={{ color: '#fff' }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section style={{ background: '#E63946', padding: 'clamp(5rem, 12vw, 8rem) 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="sticker" style={{ top: '2rem', left: '5%', '--rot': '-15deg', animationDelay: '0s' }}>💕</div>
        <div className="sticker" style={{ bottom: '2rem', right: '6%', '--rot': '10deg', animationDelay: '1s' }}>✨</div>
        <div className="sticker" style={{ top: '3rem', right: '20%', '--rot': '20deg', animationDelay: '0.5s', fontSize: '1.5rem' }}>🌸</div>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '36rem', margin: '0 auto' }}>
          <div style={{ fontFamily: "'Syne Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.65)', marginBottom: '1.5rem' }}>IT ONLY TAKES A MINUTE ✦</div>
          <div className="section-heading" style={{ color: '#fff' }}>ready to make</div>
          <div className="section-script" style={{ color: '#FFD93D' }}>memories?</div>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '1.25rem 0 2.5rem', lineHeight: 1.65 }}>No sign up. No stress. Just vibes.</p>
          <button
            onClick={() => goto('themes')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 2.5rem', borderRadius: '9999px', background: '#fff', color: '#E63946', fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '1.05rem', border: '2px solid #0D0D0D', cursor: 'pointer', boxShadow: '4px 4px 0 #0D0D0D', letterSpacing: '-0.02em', transition: 'transform 0.15s, box-shadow 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #0D0D0D'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #0D0D0D'; }}
          >
            <Heart size={16} style={{ fill: '#E63946' }} />
            Start Your Session
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0D0D0D', color: '#F5F0EB', padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="logo-wrap">
          <span className="logo-fra" style={{ color: '#F5F0EB', fontSize: '1.25rem' }}>fra</span>
          <span className="logo-mory" style={{ color: '#E63946', fontSize: '1.5rem' }}>mory</span>
        </div>
        <p style={{ fontFamily: "'Syne Mono', monospace", fontSize: '0.75rem', color: '#555', letterSpacing: '0.05em' }}>
          MADE WITH <Heart size={10} style={{ display: 'inline', color: '#E63946', fill: '#E63946' }} /> FOR AESTHETIC MOMENTS · FREE FOREVER
        </p>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {[['Features','features'],['Themes','themes']].map(([l,id]) => (
            <button key={id} onClick={() => goto(id)} style={{ fontFamily: "'Syne', sans-serif", fontSize: '0.8rem', color: '#555', cursor: 'pointer', background: 'none', border: 'none', transition: 'color 0.15s' }} onMouseEnter={e=>e.currentTarget.style.color='#F5F0EB'} onMouseLeave={e=>e.currentTarget.style.color='#555'}>{l}</button>
          ))}
        </div>
      </footer>
    </div>
  );
}