import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowRight,
  Heart,
  Star,
  Camera,
  Palette,
  Zap,
  Download,
  Sparkles,
  Image,
  CheckCircle2,
} from "lucide-react";
import { themes } from "../data/themes";

// ── Step icons (inline SVG, no emoji) ────────────────────────────────────────
const IconPalette = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);
const IconGrid = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);
const IconCameraFill = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const IconDownloadFill = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const features = [
  {
    icon: Camera,
    title: "Instant Capture",
    desc: "4 shots, live preview, zero lag. Just you and the lens.",
    tag: "4-shot burst",
    color: "#FFD1DC",
  },
  {
    icon: Palette,
    title: "Curated Themes",
    desc: "Frames that match your current era. Constantly growing.",
    tag: "always fresh",
    color: "#C5DEDD",
  },
  {
    icon: Zap,
    title: "Ready in Seconds",
    desc: "Your strip drops instantly. No waiting, no buffering.",
    tag: "lightning fast",
    color: "#FFF0C2",
  },
  {
    icon: Download,
    title: "Direct to Camera Roll",
    desc: "High-res download with zero signup needed. Ever.",
    tag: "no account",
    color: "#D4C5FF",
  },
];

const steps = [
  {
    num: "01",
    title: "Pick Your Vibe",
    desc: "Browse themes. Find your current era. Click.",
    Icon: IconPalette,
    accent: "rgba(255,185,151,0.55)",
  },
  {
    num: "02",
    title: "Choose a Layout",
    desc: "Classic strip, square grid, or polaroid — your call.",
    Icon: IconGrid,
    accent: "rgba(168,222,192,0.55)",
  },
  {
    num: "03",
    title: "Strike a Pose",
    desc: "Four shots. All the drama. Make each one count.",
    Icon: IconCameraFill,
    accent: "rgba(244,184,200,0.55)",
  },
  {
    num: "04",
    title: "Save & Share",
    desc: "Download instantly and post before you even blink.",
    Icon: IconDownloadFill,
    accent: "rgba(196,179,255,0.55)",
  },
];

const themeVisuals = {
  ticket: {
    bg: "linear-gradient(135deg, #ffe0ec 0%, #ffc2d4 50%, #ffb3c6 100%)",
    swatches: [
      {
        bg: "#ff6b9d",
        pattern:
          "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.4) 8px, rgba(255,255,255,0.4) 9px)",
      }, 
      {
        bg: "#ff85a1",
        pattern:
          "repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.4) 8px, rgba(255,255,255,0.4) 9px)",
      },
      {
        bg: "#ffb3c6",
        pattern:
          "radial-gradient(circle at 0% 50%, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 9px, transparent 9px) 0 0 / 18px 18px",
      },
      {
        bg: "#ffc2d4",
        pattern:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 2px, transparent 2px, transparent 8px)",
      },
    ],
  },
  denim: {
    bg: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #c7d8f8 100%)",
    swatches: [
      {
        bg: "#93c5fd",
        pattern:
          "repeating-linear-gradient(135deg, transparent, transparent 3px, rgba(255,255,255,0.25) 3px, rgba(255,255,255,0.25) 4px)",
      }, 
      {
        bg: "#60a5fa",
        pattern:
          "repeating-linear-gradient(135deg, transparent, transparent 3px, rgba(255,255,255,0.25) 3px, rgba(255,255,255,0.25) 4px)",
      },
      {
        bg: "#bfdbfe",
        pattern:
          "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 4px)",
      },
      {
        bg: "#dbeafe",
        pattern:
          "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 4px)",
      },
    ],
  },
  vintage: {
    bg: "linear-gradient(135deg, #f5e6d3 0%, #ecdcc8 50%, #e8d5c0 100%)",
    swatches: [
      {
        bg: "#c4956a",
        pattern:
          "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, transparent 60%), repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.04) 10px, rgba(0,0,0,0.04) 11px)",
      }, 
      {
        bg: "#d4a574",
        pattern:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.1) 0%, transparent 40%)",
      }, 
      {
        bg: "#e8c9a0",
        pattern:
          "repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,0.04) 10px, rgba(0,0,0,0.04) 11px)",
      },
      {
        bg: "#f5e6d3",
        pattern:
          "radial-gradient(circle at 50% 50%, rgba(200,160,100,0.2) 0%, transparent 70%)",
      },
    ],
  },
  newspaper: {
    bg: "linear-gradient(135deg, #f5f0e8 0%, #ede4d0 50%, #e8dfc8 100%)",
    swatches: [
      {
        bg: "#b8a878",
        pattern:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)",
      }, 
      {
        bg: "#c9b896",
        pattern:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)",
      },
      {
        bg: "#ddd0b4",
        pattern:
          "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,0,0,0.06) 6px, rgba(0,0,0,0.06) 7px), repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(0,0,0,0.06) 6px, rgba(0,0,0,0.06) 7px)",
      }, 
      {
        bg: "#f0e8d4",
        pattern:
          "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px)",
      },
    ],
  },
  y2k: {
    bg: "linear-gradient(135deg, #fae8ff 0%, #f0abfc 40%, #e879f9 100%)",
    swatches: [
      {
        bg: "#a855f7",
        pattern:
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6) 0%, transparent 30%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.4) 0%, transparent 25%)",
      }, 
      {
        bg: "#c084fc",
        pattern:
          "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 5px), repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 5px)",
      }, 
      {
        bg: "#e879f9",
        pattern:
          "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.5) 0%, transparent 20%), radial-gradient(circle at 60% 20%, rgba(255,255,255,0.4) 0%, transparent 15%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.5) 0%, transparent 20%)",
      },
      {
        bg: "#f0abfc",
        pattern:
          "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 5px)",
      },
    ],
  },
  simple: {
    bg: "linear-gradient(135deg, #f8f8f8 0%, #efefef 50%, #e8e8e8 100%)",
    swatches: [
      {
        bg: "#d4d4d4",
        pattern:
          "repeating-linear-gradient(0deg, transparent, transparent 6px, rgba(255,255,255,0.6) 6px, rgba(255,255,255,0.6) 7px)",
      },
      {
        bg: "#e8e8e8",
        pattern:
          "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(0,0,0,0.05) 6px, rgba(0,0,0,0.05) 7px)",
      },
      {
        bg: "#f0f0f0",
        pattern:
          "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.06) 1px, transparent 1px) 0 0 / 10px 10px",
      },
      {
        bg: "#fafafa",
        pattern:
          "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.04) 5px, rgba(0,0,0,0.04) 6px)",
      },
    ],
  },
};

const TICKER_ITEMS = [
  "digital photo booth",
  "a whole vibe",
  "curated aesthetics",
  "zero effort",
  "instant strips",
  "no sign-up needed",
  "main character energy",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}
function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      style={{
        transform: visible ? "none" : "translateY(24px)",
        opacity: visible ? 1 : 0,
        transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
      }}
    >
      {children}
    </div>
  );
}
function Stars({ n = 5 }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[...Array(n)].map((_, i) => (
        <Star key={i} size={11} fill="#FACC15" stroke="#FACC15" />
      ))}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function LandingPage({ onSelectTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [tickerPos, setTickerPos] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const rafRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    let pos = 0;
    const tick = () => {
      pos -= 0.5;
      setTickerPos(pos);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveStep((s) => (s + 1) % 4), 2400);
    return () => clearInterval(id);
  }, []);

  const goto = useCallback((id) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleThemeSelect = useCallback(
    (theme) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (onSelectTheme) onSelectTheme(theme);
    },
    [onSelectTheme],
  );

  const tickerAll = [
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
    ...TICKER_ITEMS,
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F9F6F2",
        color: "#1a1a1a",
        overflowX: "hidden",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;0,9..144,900;1,9..144,300;1,9..144,400;1,9..144,700;1,9..144,900&family=Nunito:wght@300;400;600;700;800;900&family=DM+Mono:wght@400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { -webkit-font-smoothing: antialiased; }
        ::selection { background: #CC3B2A; color: #fff; }
        button { cursor: pointer; font-family: inherit; border: none; background: none; }

        .logo-wrap  { display:inline-flex; align-items:baseline; cursor:pointer; gap:1px; }
        .logo-sans  { font-family:'Nunito',sans-serif; font-weight:800; font-size:1.5rem; color:#1a1a1a; letter-spacing:-0.02em; line-height:1; }
        .logo-serif { font-family:'Fraunces',serif; font-style:italic; font-weight:400; font-size:1.65rem; color:#D94F3A; letter-spacing:-0.01em; line-height:1; }

        .nav-link { font-family:'Nunito',sans-serif; font-weight:700; font-size:0.88rem; color:#888; background:none; border:none; cursor:pointer; transition:color 0.2s; }
        .nav-link:hover { color:#1a1a1a; }

        .btn-primary {
          display:inline-flex; align-items:center; gap:0.45rem;
          padding:0.75rem 1.6rem; border-radius:100px;
          background:#1a1a1a; color:#fff;
          font-family:'Nunito',sans-serif; font-weight:800; font-size:0.88rem;
          border:none; cursor:pointer;
          transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }
        .btn-primary:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 12px 32px rgba(26,26,26,0.25); }

        .btn-outline {
          display:inline-flex; align-items:center; gap:0.45rem;
          padding:0.75rem 1.6rem; border-radius:100px;
          background:transparent; color:#555;
          font-family:'Nunito',sans-serif; font-weight:700; font-size:0.88rem;
          border:1.5px solid #E0DAD3; cursor:pointer; transition:all 0.2s;
        }
        .btn-outline:hover { border-color:#1a1a1a; color:#1a1a1a; }

        .btn-white {
          display:inline-flex; align-items:center; gap:0.45rem;
          padding:1rem 2.25rem; border-radius:100px;
          background:#fff; color:#1a1a1a;
          font-family:'Nunito',sans-serif; font-weight:800; font-size:0.9rem;
          border:none; cursor:pointer;
          transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1);
        }
        .btn-white:hover { transform:translateY(-2px) scale(1.02); box-shadow:0 12px 32px rgba(255,255,255,0.22); }

        .mono { font-family:'DM Mono',monospace; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; }

        .pill-label {
          font-family:'DM Mono',monospace; font-size:0.6rem; letter-spacing:0.08em; text-transform:uppercase;
          display:inline-flex; align-items:center;
          padding:0.25rem 0.75rem; border-radius:100px;
          background:#F2EEE8; color:#B8B0A8;
        }

        .grad-text {
          background:linear-gradient(135deg,#FF8A80 0%,#FF6B9D 40%,#C77DFF 75%,#7B9CFF 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
        }

        .feat-card {
          background:#fff; border-radius:22px; padding:1.75rem;
          border:1.5px solid #EDEAE4; position:relative; overflow:hidden;
          transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1); height:100%;
        }
        .feat-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:3px;
          background:linear-gradient(90deg,#FF8A80,#FF6B9D,#C77DFF,#7B9CFF);
          opacity:0; transition:opacity 0.25s;
        }
        .feat-card:hover { transform:translateY(-6px); box-shadow:0 20px 50px rgba(0,0,0,0.08); border-color:transparent; }
        .feat-card:hover::before { opacity:1; }

        .theme-card {
          border-radius:22px; overflow:hidden; cursor:pointer;
          background:#fff; border:1.5px solid #EDEAE4;
          transition:all 0.28s cubic-bezier(0.34,1.56,0.64,1);
          display:flex; flex-direction:column; text-align:left; width:100%;
        }
        .theme-card:hover { transform:translateY(-7px) rotate(-0.4deg); box-shadow:0 24px 60px rgba(0,0,0,0.12); border-color:transparent; }
        .theme-card:hover .cta-chip { background:#1a1a1a; color:#fff; }
       
        .theme-grid > *:last-child:nth-child(3n - 1) {
          grid-column-end: -2;
        }

        .theme-grid > *:last-child:nth-child(3n - 2) {
          grid-column: 2;
        }
        .cta-chip {
          display:inline-flex; align-items:center; gap:0.35rem;
          font-family:'Nunito',sans-serif; font-weight:600; font-size:0.72rem;
          background:#F2EEE8; color:#888;
          padding:0.3rem 0.8rem 0.3rem 0.5rem; border-radius:100px;
          transition:all 0.22s; flex-shrink:0;
        }
        /* Theme card Go button responsive */
        .theme-chip-mobile { display: none; }
        .theme-chip-desktop { display: inline-flex; flex-shrink: 0; }
        
        .rev-card {
          background:#fff; border-radius:22px; padding:1.75rem;
          border:1.5px solid #EDEAE4;
          transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .rev-card:hover { transform:translateY(-5px); box-shadow:0 16px 40px rgba(0,0,0,0.07); }

        .step-btn {
          text-align:left; width:100%; border-radius:16px; padding:1rem 1.25rem;
          display:flex; align-items:center; gap:1rem;
          transition:all 0.28s cubic-bezier(0.34,1.56,0.64,1);
          border:1px solid transparent;
        }
        .step-btn.active { background:rgba(255,255,255,0.07); border-color:rgba(255,255,255,0.1); }

        .step-dot { width:9px; height:9px; border-radius:50%; background:#444; border:none; transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .step-dot.active { background:#fff; width:26px; border-radius:5px; }

        .film-hole { width:9px; height:9px; border-radius:2px; background:rgba(0,0,0,0.15); flex-shrink:0; }
        .film-frame { border-radius:10px; overflow:hidden; position:relative; border:1.5px solid rgba(255,255,255,0.3); display:flex; align-items:center; justify-content:center; }

        .noise { position:absolute; inset:0; pointer-events:none; opacity:0.028;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        @keyframes float  { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(2deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(14px)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0} }

        @media(max-width:900px){
          .feat-grid  { grid-template-columns:1fr 1fr !important; }
          .step-panel { grid-template-columns:1fr !important; }
          .theme-grid { grid-template-columns:1fr 1fr !important; }
          .rev-grid   { grid-template-columns:1fr !important; }
          .hero-right { display:none !important; }
          .desktop-only { display:none !important; }
        }
        @media(max-width:600px){
          .feat-grid  { grid-template-columns:1fr !important; }
          .theme-grid { grid-template-columns:1fr !important; }
          .hero-cta   { flex-direction:column !important; }
          .hero-cta > button { width:100%; justify-content:center !important; }
          
          .theme-card { width: 100% !important; max-width: 100% !important; }
          .theme-grid > * { grid-column: 1 / -1 !important; }
          
          .theme-grid > *:last-child:nth-child(3n - 1) { grid-column-end: auto !important; }
          .theme-grid > *:last-child:nth-child(3n - 2) { grid-column: auto !important; }
        }
        .mobile-btn { display:none !important; }
        @media(max-width:900px){ .mobile-btn { display:flex !important; } }
      `}</style>

      {/* ══ NAV ════════════════════════════════════════════════════════════════ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          transition: "all 0.3s",
          background: scrolled ? "rgba(249,246,242,0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(22px)" : "none",
          boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.06)" : "none",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "1.1rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            className="logo-wrap"
            style={{ background: "none", border: "none", padding: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className="logo-sans">fra</span>
            <span className="logo-serif">mory</span>
          </button>
          <div
            className="desktop-only"
            style={{ display: "flex", alignItems: "center", gap: "2rem" }}
          >
            {[
              ["Features", "features"],
              ["How It Works", "how"],
              ["Themes", "themes"],
            ].map(([l, id]) => (
              <button key={id} className="nav-link" onClick={() => goto(id)}>
                {l}
              </button>
            ))}
          </div>
          <button
            className="desktop-only btn-primary"
            style={{ padding: "0.55rem 1.25rem", fontSize: "0.82rem" }}
            onClick={() => goto("themes")}
          >
            Try free <Sparkles size={12} />
          </button>
          <button
            className="mobile-btn"
            onClick={() => setNavOpen(!navOpen)}
            style={{
              background: "none",
              border: "1.5px solid #DDD",
              padding: "0.4rem 0.85rem",
              borderRadius: "100px",
              fontSize: "0.78rem",
              fontFamily: "'Nunito',sans-serif",
              fontWeight: 700,
              color: "#555",
            }}
          >
            {navOpen ? "✕" : "☰"}
          </button>
        </div>
        {navOpen && (
          <div
            style={{
              background: "#F9F6F2",
              borderTop: "1px solid #EDEAE4",
              padding: "1.5rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {[
              ["Features", "features"],
              ["How It Works", "how"],
              ["Themes", "themes"],
            ].map(([l, id]) => (
              <button
                key={id}
                className="nav-link"
                style={{ textAlign: "left", fontSize: "1rem" }}
                onClick={() => goto(id)}
              >
                {l}
              </button>
            ))}
            <button
              className="btn-primary"
              style={{ justifyContent: "center" }}
              onClick={() => goto("themes")}
            >
              Try free <Sparkles size={12} />
            </button>
          </div>
        )}
      </nav>

      {/* ══ HERO ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          minHeight: "100vh",
          background: "#FBF8F4",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Blobs */}
        <div
          style={{
            position: "absolute",
            width: 380,
            height: 380,
            background: "rgba(255,194,194,0.38)",
            top: "8%",
            right: "6%",
            borderRadius: "50%",
            filter: "blur(70px)",
            animation: "float 7s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            background: "rgba(168,222,192,0.35)",
            top: "45%",
            right: "25%",
            borderRadius: "50%",
            filter: "blur(50px)",
            animation: "float2 9s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            background: "rgba(196,179,255,0.28)",
            bottom: "15%",
            left: "5%",
            borderRadius: "50%",
            filter: "blur(50px)",
            animation: "float 11s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        {/* Dot grid */}
        <div
          style={{
            position: "absolute",
            top: "3rem",
            right: 0,
            width: 260,
            height: 260,
            opacity: 0.22,
            backgroundImage:
              "radial-gradient(circle,#D8D2CA 1px,transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(ellipse at top right,black 15%,transparent 72%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at top right,black 15%,transparent 72%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "clamp(5rem,7vw,9rem) 2rem clamp(4rem,5vw,7rem)",
            position: "relative",
            zIndex: 1,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr auto",
              gridTemplateAreas: isMobile ? "'content'" : "'content frame'",
              rowGap: "1rem",
              columnGap: isMobile ? "0" : "3rem",
              justifyItems: "left",
            }}
          >
            {/* Left */}
            <div>
              {/* Eyebrow badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#fff",
                  border: "1.5px solid #EDE8DF",
                  borderRadius: "10px",
                  padding: "0.38rem 0.9rem 0.38rem 0.45rem",
                  marginBottom: "2.25rem",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                  animation: "slideUp 0.7s ease both",
                }}
              >
                <span
                  style={{
                    background: "#CC3B2A",
                    color: "#fff",
                    borderRadius: "7px",
                    padding: "0.18rem 0.55rem",
                    fontSize: "0.62rem",
                    fontFamily: "'DM Mono',monospace",
                    letterSpacing: "0.08em",
                  }}
                >
                  FREE
                </span>
                <span
                  style={{ fontSize: "0.8rem", color: "#999", fontWeight: 400 }}
                >
                  no account · no signup · just vibes
                </span>
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#CC3B2A",
                    animation: "blink 1.4s ease infinite",
                    flexShrink: 0,
                  }}
                />
              </div>

              {/* H1 */}
              <h1
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontWeight: 600,
                  fontSize: "clamp(3.5rem,9vw,7rem)",
                  color: "#1a1a1a",
                  lineHeight: 0.95,
                  marginBottom: "1.5rem",
                }}
              >
                your camera roll,
                <br />
                <span className="grad-text" style={{ fontStyle: "italic" }}>
                  but make it
                </span>
                <br />
                <span style={{ position: "relative", display: "inline-block" }}>
                  <em>a whole vibe.</em>
                  <svg
                    viewBox="0 0 600 14"
                    preserveAspectRatio="none"
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      left: 0,
                      width: "100%",
                      height: "12px",
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 7 Q30 2 60 7 Q90 12 120 7 Q150 2 180 7 Q210 12 240 7 Q270 2 300 7 Q330 12 360 7 Q390 2 420 7 Q450 12 480 7 Q510 2 540 7 Q570 12 600 7"
                      fill="none"
                      stroke="#CC3B2A"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p
                style={{
                  color: "#999",
                  fontSize: "clamp(0.95rem,2vw,1.05rem)",
                  lineHeight: 1.85,
                  maxWidth: "30rem",
                  marginBottom: "2.25rem",
                  fontWeight: 300,
                  animation: "slideUp 0.7s 0.18s ease both",
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                A digital photo booth that turns your selfies into beautiful
                strips — curated themes, dreamy frames, instant downloads.
              </p>

              {/* Social proof row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  marginBottom: "2.25rem",
                  animation: "slideUp 0.7s 0.26s ease both",
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                <div style={{ display: "flex" }}>
                  {[
                    ["#fde2e4", "#CC3B2A"],
                    ["#c5dedd", "#3AACAA"],
                    ["#D4C5FF", "#9B6DFF"],
                    ["#FFF0C2", "#C4A000"],
                  ].map(([bg, stroke], i) => (
                    <div
                      key={i}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: bg,
                        border: "2px solid #FBF8F4",
                        marginLeft: i ? -8 : 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircle2
                        size={13}
                        stroke={stroke}
                        strokeWidth={2}
                        fill="none"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <Stars n={5} />
                  <div
                    style={{
                      fontFamily: "'Nunito',sans-serif",
                      fontSize: "0.72rem",
                      color: "#C0BAB2",
                    }}
                  >
                    freshly launched, already loved.
                  </div>
                </div>
              </div>

              <div
                className="hero-cta"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  animation: "slideUp 0.7s 0.34s ease both",
                  opacity: 0,
                  animationFillMode: "forwards",
                }}
              >
                <button className="btn-primary" onClick={() => goto("themes")}>
                  Start a Session <ArrowRight size={14} />
                </button>
                <button className="btn-outline" onClick={() => goto("how")}>
                  How It Works
                </button>
              </div>
            </div>

            {/* Right — film strip */}
            <div
              className="hero-right"
              style={{
                flexShrink: 0,
                animation: "float 7s ease-in-out infinite",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                alignSelf: "center",
              }}
            >
              <div
                style={{
                  background: "#fff",
                  border: "1.5px solid #EDE8DF",
                  borderRadius: 20,
                  padding: "12px 8px",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.07)",
                  width: 100,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="film-hole" />
                  ))}
                </div>
                {[
                  {
                    bg: "linear-gradient(135deg,#fde2e4,#fad2e1)",
                    IconEl: Camera,
                    c: "#CC3B2A",
                  },
                  {
                    bg: "linear-gradient(135deg,#dfe7fd,#c5dedd)",
                    IconEl: Palette,
                    c: "#6B7FCC",
                  },
                  {
                    bg: "linear-gradient(135deg,#c5dedd,#a7f3d0)",
                    IconEl: Sparkles,
                    c: "#3AACAA",
                  },
                  {
                    bg: "linear-gradient(135deg,#fff5ba,#FED7AA)",
                    IconEl: Star,
                    c: "#C4A000",
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="film-frame"
                    style={{
                      background: f.bg,
                      width: 82,
                      height: 82,
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg,rgba(255,255,255,0.45) 0%,transparent 60%)",
                      }}
                    />
                    <div style={{ position: "absolute", bottom: 6, left: 6 }}>
                      <f.IconEl
                        size={15}
                        stroke={f.c}
                        fill="none"
                        strokeWidth={1.75}
                      />
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    gap: 5,
                    justifyContent: "center",
                    marginTop: 4,
                  }}
                >
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="film-hole" />
                  ))}
                </div>
              </div>
              <span
                className="mono"
                style={{ fontSize: "0.5rem", color: "#C0BAB2" }}
              >
                sample strip
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ══ TICKER ═════════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: "#1a1a1a",
          padding: "0.85rem 0",
          overflow: "hidden",
          zIndex: 1,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            transform: `translateX(${tickerPos % (tickerAll.length * 200)}px)`,
          }}
        >
          {tickerAll.map((item, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0 1.5rem",
                fontFamily: "'Nunito',sans-serif",
                fontWeight: 700,
                fontSize: "0.78rem",
                color: "rgba(255,255,255,0.5)",
                whiteSpace: "nowrap",
                gap: "1.25rem",
              }}
            >
              {item}
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.25)",
                  display: "inline-block",
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* ══ FEATURES ═══════════════════════════════════════════════════════════ */}
      <section
        id="features"
        style={{
          padding: "clamp(5rem,10vw,7.5rem) 2rem",
          maxWidth: "80rem",
          margin: "0 auto",
        }}
      >
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "3rem",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <span
                className="pill-label"
                style={{ marginBottom: "0.75rem", display: "inline-flex" }}
              >
                why framory
              </span>
              <h2
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontWeight: 500,
                  fontSize: "clamp(2rem,5vw,3.25rem)",
                  color: "#1a1a1a",
                  lineHeight: 1.05,
                }}
              >
                everything you need,
                <br />
                <em className="grad-text">nothing you don't.</em>
              </h2>
            </div>
            <button className="btn-primary" onClick={() => goto("themes")}>
              pick a theme <ArrowRight size={14} />
            </button>
          </div>
        </Reveal>
        <div
          className="feat-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "1rem",
          }}
        >
          {features.map((f, i) => {
            const IconComp = f.icon;
            return (
              <Reveal key={i} delay={i * 0.07}>
                <div className="feat-card">
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: "13px",
                      background: `${f.color}55`,
                      border: `1.5px solid ${f.color}BB`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <IconComp size={20} strokeWidth={1.75} fill="none" />
                  </div>
                  <span
                    className="pill-label"
                    style={{ marginBottom: "0.75rem", display: "inline-flex" }}
                  >
                    {f.tag}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Nunito',sans-serif",
                      fontWeight: 800,
                      fontSize: "0.92rem",
                      color: "#1a1a1a",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      color: "#B8B0A8",
                      fontSize: "0.83rem",
                      lineHeight: 1.75,
                      fontWeight: 300,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ══ HOW IT WORKS ═══════════════════════════════════════════════════════ */}
      <section
        id="how"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "#111",
          padding: "clamp(5rem,10vw,7.5rem) 2rem",
        }}
      >
        <div className="noise" />
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-8%",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle,rgba(255,107,107,0.1) 0%,transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle,rgba(168,85,247,0.1) 0%,transparent 65%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <span
                className="pill-label"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.35)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: "0.75rem",
                  display: "inline-flex",
                }}
              >
                the process
              </span>
              <h2
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontWeight: 500,
                  fontSize: "clamp(2rem,5vw,3.25rem)",
                  color: "#fff",
                  lineHeight: 1.05,
                }}
              >
                four steps,
                <br />
                <em className="grad-text">infinite memories.</em>
              </h2>
            </div>
          </Reveal>

          <div
            className="step-panel"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "5rem",
              alignItems: "center",
            }}
          >
            {/* Active card */}
            <Reveal>
              <div
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 28,
                  padding: "3rem",
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: steps[activeStep].accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.5rem",
                    color: "rgba(255,255,255,0.85)",
                  }}
                >
                  {(() => {
                    const StepIcon = steps[activeStep].Icon;
                    return <StepIcon />;
                  })()}
                </div>
                <span
                  className="mono"
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    marginBottom: "0.75rem",
                    display: "block",
                    fontSize: "0.56rem",
                  }}
                >
                  STEP {steps[activeStep].num}
                </span>
                <h3
                  style={{
                    fontFamily: "'Fraunces',serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.2rem,3vw,1.75rem)",
                    color: "#fff",
                    marginBottom: "0.75rem",
                  }}
                >
                  {steps[activeStep].title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Nunito',sans-serif",
                    fontWeight: 300,
                    fontSize: "0.95rem",
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.8,
                  }}
                >
                  {steps[activeStep].desc}
                </p>
                <div
                  style={{ display: "flex", gap: "0.4rem", marginTop: "2rem" }}
                >
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      className={`step-dot${i === activeStep ? " active" : ""}`}
                      onClick={() => setActiveStep(i)}
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Step list */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              {steps.map((step, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <button
                    className={`step-btn${i === activeStep ? " active" : ""}`}
                    onClick={() => setActiveStep(i)}
                  >
                    <span
                      className="mono"
                      style={{
                        color:
                          i === activeStep
                            ? "#FF8A80"
                            : "rgba(255,255,255,0.2)",
                        flexShrink: 0,
                        fontSize: "0.56rem",
                      }}
                    >
                      {step.num}
                    </span>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background:
                          i === activeStep
                            ? step.accent
                            : "rgba(255,255,255,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: "rgba(255,255,255,0.75)",
                        transition: "all 0.25s",
                      }}
                    >
                      {(() => {
                        const StepIcon = step.Icon;
                        return <StepIcon />;
                      })()}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Nunito',sans-serif",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          color:
                            i === activeStep
                              ? "#fff"
                              : "rgba(255,255,255,0.35)",
                          marginBottom: "0.12rem",
                        }}
                      >
                        {step.title}
                      </div>
                      {i === activeStep && (
                        <div
                          style={{
                            fontFamily: "'Nunito',sans-serif",
                            fontWeight: 300,
                            fontSize: "0.78rem",
                            color: "rgba(255,255,255,0.28)",
                          }}
                        >
                          {step.desc}
                        </div>
                      )}
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.2}>
            <div style={{ textAlign: "center", marginTop: "4rem" }}>
              <button className="btn-white" onClick={() => goto("themes")}>
                start now, it's free <Sparkles size={13} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ THEMES ═════════════════════════════════════════════════════════════ */}
      <section
        id="themes"
        style={{
          padding: "clamp(5rem,10vw,7.5rem) 2rem",
          background: "#F9F6F2",
        }}
      >
        <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span
                className="pill-label"
                style={{ marginBottom: "0.75rem", display: "inline-flex" }}
              >
                pick your vibe
              </span>
              <h2
                style={{
                  fontFamily: "'Fraunces',serif",
                  fontWeight: 500,
                  fontSize: "clamp(2rem,5vw,3.25rem)",
                  color: "#1a1a1a",
                  lineHeight: 1.05,
                  marginBottom: "0.75rem",
                }}
              >
                choose a theme,
                <br />
                <em className="grad-text">start shooting.</em>
              </h2>
              <p
                style={{
                  color: "#C0BAB2",
                  fontSize: "0.9rem",
                  fontWeight: 300,
                }}
              >
                Select your aesthetic — we'll take you right into the booth.
              </p>
            </div>
          </Reveal>

          <div
            className="theme-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: "1.1rem",
              justifyItems: "stretch",
            }}
          >
            {themes.map((theme, i) => {
              const visuals = themeVisuals[theme.id];
              const isHov = hoveredTheme === theme.id;
              return (
                <Reveal key={theme.id} delay={i * 0.07}>
                  <button
                    className="theme-card"
                    onClick={() => handleThemeSelect(theme)}
                    onMouseEnter={() => setHoveredTheme(theme.id)}
                    onMouseLeave={() => setHoveredTheme(null)}
                  >
                    <div
                      style={{
                        height: "10rem",
                        position: "relative",
                        overflow: "hidden",
                        background: visuals.bg,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          display: "flex",
                          gap: 4,
                          padding: "0.75rem 0.875rem 0",
                        }}
                      >
                        {visuals.swatches.map((swatch, j) => (
                          <div
                            key={j}
                            style={{
                              flex: 1,
                              height: "3.75rem",
                              borderRadius: "8px 8px 0 0",
                              background: swatch.bg,
                              backgroundImage: swatch.pattern,
                              border: "1.5px solid rgba(255,255,255,0.45)",
                              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.55)",
                              transition: `transform 0.3s ${j * 0.04}s ease`,
                              transform: isHov ? "translateY(-5px)" : "none",
                            }}
                          />
                        ))}
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: "0.65rem",
                          left: "0.8rem",
                          width: "2rem",
                          height: "2rem",
                          borderRadius: "8px",
                          background: "rgba(255,255,255,0.5)",
                          backdropFilter: "blur(4px)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Image
                          size={14}
                          stroke="#1a1a1a"
                          strokeWidth={1.75}
                          fill="none"
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "1.1rem 1.2rem",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "0.5rem",
                        background: "#fff",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3
                          style={{
                            fontFamily: "'Nunito',sans-serif",
                            fontWeight: 800,
                            fontSize: "0.88rem",
                            color: "#1a1a1a",
                            marginBottom: "0.2rem",
                          }}
                        >
                          {theme.name}
                        </h3>
                        {theme.description && (
                          <p
                            style={{
                              color: "#C0BAB2",
                              fontSize: "0.72rem",
                              fontWeight: 300,
                              lineHeight: 1.5,
                            }}
                          >
                            {theme.description}
                          </p>
                        )}
                        {/* Go button — Bottom */}
                        <div
                          className="cta-chip theme-chip-mobile"
                          style={{ marginTop: "0.6rem" }}
                        >
                          <ArrowRight size={11} />
                          Go
                        </div>
                      </div>

                      {/* Go button — Right */}
                      <div className="cta-chip theme-chip-desktop">
                        <ArrowRight size={11} />
                        Go
                      </div>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ FOOTER CTA ═════════════════════════════════════════════════════════ */}
      <section
        style={{
          background: "#1a1a1a",
          padding: "clamp(6rem,14vw,9rem) 2rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="noise" />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle,rgba(255,107,157,0.15) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "30%",
            right: "10%",
            width: 300,
            height: 300,
            background:
              "radial-gradient(circle,rgba(124,77,255,0.12) 0%,transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            fontFamily: "'Fraunces',serif",
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: "clamp(8rem,25vw,20rem)",
            color: "rgba(255,255,255,0.025)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            whiteSpace: "nowrap",
            letterSpacing: "-0.04em",
            userSelect: "none",
            pointerEvents: "none",
            lineHeight: 1,
          }}
        >
          framory
        </div>
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: "36rem",
            margin: "0 auto",
          }}
        >
          <Reveal>
            <span
              className="pill-label"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                marginBottom: "1.5rem",
                display: "inline-flex",
              }}
            >
              it only takes a minute
            </span>
            <h2
              style={{
                fontFamily: "'Fraunces',serif",
                fontWeight: 600,
                fontSize: "clamp(2.5rem,8vw,5rem)",
                color: "#fff",
                lineHeight: 0.95,
                marginBottom: "1.25rem",
              }}
            >
              ready to make
              <br />
              <em className="grad-text">memories?</em>
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.95rem",
                lineHeight: 1.85,
                marginBottom: "2.5rem",
                fontWeight: 300,
              }}
            >
              No signup. No stress. Just vibes.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.875rem",
                flexWrap: "wrap",
              }}
            >
              <button className="btn-white" onClick={() => goto("themes")}>
                <Heart size={15} fill="transparent" stroke="#FF6B9D" /> Start
                Your Session
              </button>
              <button
                onClick={() => goto("how")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "1rem 1.75rem",
                  borderRadius: "100px",
                  background: "transparent",
                  color: "rgba(255,255,255,0.5)",
                  border: "1.5px solid rgba(255,255,255,0.15)",
                  fontFamily: "'Nunito',sans-serif",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                }}
              >
                How It Works
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          background: "#111",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "1.5rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <button
            className="logo-wrap"
            style={{ background: "none", border: "none", padding: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span
              className="logo-sans"
              style={{ fontSize: "1.2rem", color: "#fff" }}
            >
              fra
            </span>
            <span
              className="logo-serif"
              style={{ fontSize: "1.35rem", color: "rgba(255,255,255,0.6)" }}
            >
              mory
            </span>
          </button>
          <p
            className="mono"
            style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.56rem" }}
          >
            made with{" "}
            <Heart
              size={8}
              fill="#FF6B9D"
              stroke="#FF6B9D"
              style={{ display: "inline", verticalAlign: "middle" }}
            />{" "}
            · free forever
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              ["Features", "features"],
              ["Themes", "themes"],
            ].map(([l, id]) => (
              <button
                key={id}
                onClick={() => goto(id)}
                style={{
                  color: "rgba(255,255,255,0.28)",
                  fontSize: "0.82rem",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Nunito',sans-serif",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.75)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.color = "rgba(255,255,255,0.28)")
                }
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
