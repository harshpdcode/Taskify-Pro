// src/pages/Landing.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import MultiverseStationArtifact from '../components/MultiverseStationArtifact';
import AsciiGlitchText from '../components/AsciiGlitchText';
import { 
  Kanban, 
  Sparkles, 
  ArrowRight,
  X,
  Zap,
  Flame,
  Sun,
  Moon,
  Radio,
  Layers,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePwaInstall } from '../hooks/usePwaInstall';
import InstallPwaModal from '../components/InstallPwaModal';

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { darkMode, toggleTheme, isGlitching } = useTheme();
  const { showInstallModal, setShowInstallModal, triggerInstall } = usePwaInstall();
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);
  const [isHoveringArtwork, setIsHoveringArtwork] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0, intensity: 0 });

  const stageRef = useRef<HTMLElement | null>(null);
  const stationRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = "Taskify Pro — Effortless planning. Limitless focus.";
  }, []);

  // Track mouse coordinates for interactive multiverse dimensional pulling
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!stationRef.current) return;
    const rect = stationRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // Calculate proximity intensity
    const maxDist = 420;
    const intensity = Math.max(0, 1 - distance / maxDist);

    setMouseOffset({
      x: (distX / (rect.width / 2)) * 25,
      y: (distY / (rect.height / 2)) * 20,
      intensity,
    });
  };

  const handleMouseEnter = () => setIsHoveringArtwork(true);
  const handleMouseLeave = () => {
    setIsHoveringArtwork(false);
    setMouseOffset({ x: 0, y: 0, intensity: 0 });
  };

  const isGlitchingActive = isGlitching || isHoveringArtwork;

  return (
    <>
      <style>{`
        .neo-landing {
          width: 100vw;
          height: 100vh;
          margin: 0;
          overflow: hidden;
          background-color: var(--bg-main);
          color: var(--text-primary);
          position: relative;
        }

        /* ── TOP COMIC NAVBAR ── */
        .neo-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          padding: 0 max(12px, 3vw);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--bg-sidebar);
          border-bottom: 3px solid #000000;
          box-shadow: 0 3px 0px #000000;
          z-index: 50;
          box-sizing: border-box;
        }

        .dark .neo-navbar {
          border-bottom: 3px solid #ffffff;
          box-shadow: 0 3px 0px rgba(0, 0, 0, 0.9);
        }

        .neo-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
          flex-shrink: 0;
        }

        .neo-brand-badge {
          width: 32px;
          height: 32px;
          background: #ffe600;
          border: 2px solid #000000;
          box-shadow: 2px 2px 0px #000000;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          transform: rotate(-3deg);
          flex-shrink: 0;
        }

        /* ── HERO DISPLAY WORDMARK ── */
        .neo-hero-container {
          position: absolute;
          top: clamp(76px, 14dvh, 120px);
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 1;
          pointer-events: none;
          user-select: none;
          text-align: center;
          padding: 0 12px;
        }

        .neo-hero-title {
          font-family: 'Bungee', 'Impact', sans-serif;
          font-size: clamp(32px, 8.5vw, 116px);
          font-weight: 900;
          letter-spacing: 2px;
          line-height: 0.95;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.2em;
          text-shadow: 4px 4px 0px #000000;
        }

        .dark .neo-hero-title {
          text-shadow: 5px 5px 0px #000000;
        }

        .neo-title-taskify {
          background: #ffe600;
          color: #000000;
          padding: 2px 14px;
          border: 3px solid #000000;
          box-shadow: 4px 4px 0px #ff007a;
          border-radius: 12px;
          transform: rotate(-1.5deg);
        }

        .dark .neo-title-taskify {
          background: #ffe600;
          color: #000000;
          border: 3px solid #ffffff;
          box-shadow: 4px 4px 0px #ff007a;
        }

        .neo-title-pro {
          background: #ff007a;
          color: #ffffff;
          padding: 2px 14px;
          border: 3px solid #000000;
          box-shadow: 4px 4px 0px #00f0ff;
          border-radius: 12px;
          transform: rotate(2deg);
        }

        .dark .neo-title-pro {
          border: 3px solid #ffffff;
        }

        /* ── SPIDER-VERSE MULTIVERSE CENTERPIECE STAGE ── */
        .spider-multiverse-stage {
          position: absolute;
          top: clamp(170px, 25dvh, 260px);
          left: 50vw;
          height: min(58dvh, 500px, 90vw);
          width: min(58dvh, 500px, 90vw);
          transform: translateX(-50%);
          z-index: 5;
          cursor: crosshair;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Comic Stickers */
        .comic-sticker {
          position: absolute;
          z-index: 10;
          pointer-events: none;
          border: 3px solid #000000;
          box-shadow: 4px 4px 0px #000000;
          padding: 8px 14px;
          border-radius: 12px;
          font-weight: 900;
          font-size: 13px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .sticker-left {
          bottom: clamp(16px, 5dvh, 40px);
          left: max(16px, 4vw);
          background: #ffe600;
          color: #000000;
          transform: rotate(-2deg);
        }

        .sticker-right {
          bottom: clamp(16px, 5dvh, 40px);
          right: max(16px, 4vw);
          background: #00f0ff;
          color: #000000;
          transform: rotate(2deg);
          text-align: right;
        }

        @media (max-width: 900px) {
          .nav-links-desktop {
            display: none !important;
          }
        }

        @media (max-width: 640px) {
          .neo-hero-container {
            top: 74px !important;
          }
          .spider-multiverse-stage {
            height: min(40dvh, 280px) !important;
            width: min(40dvh, 280px) !important;
            top: 160px !important;
          }
          .mobile-hero-cta {
            display: flex !important;
          }
          .comic-sticker {
            font-size: 10px !important;
            padding: 4px 8px !important;
            border-width: 2px !important;
            box-shadow: 2px 2px 0px #000 !important;
            bottom: 10px !important;
          }
          .sticker-left {
            left: 8px !important;
            max-width: 44vw !important;
          }
          .sticker-right {
            right: 8px !important;
            max-width: 44vw !important;
          }
        }

        .mobile-hero-cta {
          display: none;
          position: absolute;
          bottom: clamp(65px, 12dvh, 100px);
          left: 0;
          right: 0;
          justify-content: center;
          z-index: 15;
        }
      `}</style>

      <div className="neo-landing halftone-bg">
        {/* ── TOP COMIC NAVBAR ── */}
        <header className="neo-navbar">
          {/* Brand Logo */}
          <div className="neo-brand" onClick={() => navigate('/')}>
            <div className="neo-brand-badge spider-hover-glitch">
              <Zap size={18} color="#000000" fill="#000000" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
              <span style={{ fontWeight: 900, fontSize: '15px', letterSpacing: '-0.3px', textTransform: 'uppercase' }}>
                <AsciiGlitchText text="TASKIFY" /> <span style={{ color: '#ff007a' }}><AsciiGlitchText text="PRO" /></span>
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setShowFeaturesModal(true)}
              className="comic-btn comic-btn-cyan spider-hover-glitch"
              style={{ padding: '7px 16px', fontSize: '13px' }}
            >
              <Sparkles size={14} />
              <span>Features</span>
            </button>
            <button
              onClick={() => setShowInstallModal(true)}
              className="comic-btn comic-btn-yellow spider-hover-glitch"
              style={{ padding: '7px 16px', fontSize: '13px' }}
            >
              <Download size={14} />
              <span>Install App</span>
            </button>
            <button
              onClick={() => navigate(isAuthenticated ? '/app' : '/login')}
              className="comic-btn comic-btn-white spider-hover-glitch"
              style={{ padding: '7px 16px', fontSize: '13px' }}
            >
              <span>Login</span>
            </button>
          </div>

          {/* Right Action Button & Multiverse Theme Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => setShowInstallModal(true)}
              title="Install Taskify Pro App"
              className="comic-btn comic-btn-cyan spider-hover-glitch"
              style={{ padding: '7px 10px', fontSize: '11px', borderRadius: '10px' }}
            >
              <Download size={15} />
              <span className="hidden sm:inline">INSTALL</span>
            </button>

            <button
              onClick={toggleTheme}
              title="Switch Universe (Theme Glitch)"
              className="comic-btn comic-btn-yellow spider-hover-glitch"
              style={{ padding: '7px 9px', borderRadius: '10px' }}
            >
              {darkMode ? <Sun size={16} color="#000" /> : <Moon size={16} color="#000" />}
            </button>

            {!isAuthenticated ? (
              <button
                onClick={() => navigate('/register')}
                className="comic-btn comic-btn-pink spider-hover-glitch"
                style={{
                  padding: '7px 14px',
                  fontSize: '12px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <Flame size={14} fill="#ffffff" />
                <span>Sign Up Free →</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/app')}
                className="comic-btn comic-btn-green spider-hover-glitch"
                style={{
                  padding: '7px 14px',
                  fontSize: '12px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <Zap size={14} fill="#000000" />
                <span>Dashboard →</span>
              </button>
            )}
          </div>
        </header>

        {/* ── MAIN HERO STAGE ── */}
        <main
          style={{
            position: 'fixed',
            inset: 0,
            overflow: 'hidden',
          }}
        >
          <section
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'absolute',
              inset: 0,
              contain: 'strict',
              isolation: 'isolate',
              overflow: 'hidden',
            }}
          >
            {/* 1. NEO-BRUTALIST COMIC TITLE WITH REAL-TIME ASCII GLITCH MORPH */}
            <div className="neo-hero-container">
              <h1 className="neo-hero-title spider-hover-glitch" id="taskify-title" aria-label="Taskify Pro">
                <span className="neo-title-taskify">
                  <AsciiGlitchText text="TASKIFY" />
                </span>
                <span className="neo-title-pro">
                  <AsciiGlitchText text="PRO" />
                </span>
              </h1>
            </div>

            {/* 2. SPIDER-VERSE MULTIVERSE MISSION STATION (Brand New Concept Artwork) */}
            <div
              ref={stationRef}
              className="spider-multiverse-stage"
              onClick={() => {
                setIsHoveringArtwork(true);
                setTimeout(() => setIsHoveringArtwork(false), 600);
              }}
            >
              <MultiverseStationArtifact
                isGlitching={isGlitchingActive}
                mouseOffset={mouseOffset}
              />
            </div>

            {/* 3. Mobile Hero Action Button */}
            <div className="mobile-hero-cta">
              <button
                onClick={() => navigate(isAuthenticated ? '/app' : '/register')}
                className="comic-btn comic-btn-pink spider-hover-glitch"
                style={{
                  padding: '10px 24px',
                  fontSize: '14px',
                  borderRadius: '999px',
                  boxShadow: '4px 4px 0px #000000',
                  pointerEvents: 'auto',
                }}
              >
                <Flame size={16} fill="#ffffff" />
                <span>{isAuthenticated ? 'Enter Workspace →' : 'Get Started Free →'}</span>
              </button>
            </div>

            {/* 4. Comic Sticker Callouts with ASCII hover morph */}
            <div className="comic-sticker sticker-left spider-hover-glitch">
              <div>💥 <AsciiGlitchText text="100% FOCUS" /></div>
              <div style={{ fontSize: '10px', opacity: 0.85, fontWeight: 700 }}>Effortless planning.</div>
            </div>

            <div className="comic-sticker sticker-right spider-hover-glitch">
              <div>⚡ <AsciiGlitchText text="ZERO DELAYS" /></div>
              <div style={{ fontSize: '10px', opacity: 0.85, fontWeight: 700 }}>Peak momentum.</div>
            </div>
          </section>

          {/* Comic Feature Modal */}
          <AnimatePresence>
            {showFeaturesModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  zIndex: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px',
                }}
                onClick={() => setShowFeaturesModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, rotate: -2, y: 20 }}
                  animate={{ scale: 1, rotate: 0, y: 0 }}
                  exit={{ scale: 0.9, rotate: 2, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: 'var(--bg-card)',
                    border: '4px solid #000000',
                    boxShadow: '10px 10px 0px #000000',
                    borderRadius: '20px',
                    width: '100%',
                    maxWidth: '560px',
                    padding: '28px',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '3px solid #000000', paddingBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="comic-badge" style={{ background: '#ffe600', color: '#000' }}>⚡ WEAPONS ARSENAL</span>
                      <h2 style={{ fontSize: '20px', fontWeight: 900, textTransform: 'uppercase' }}>PRODUCTIVITY POWERS</h2>
                    </div>
                    <button
                      onClick={() => setShowFeaturesModal(false)}
                      className="comic-btn comic-btn-pink"
                      style={{ padding: '6px', borderRadius: '8px' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    {[
                      { icon: <Kanban size={20} />, title: "KANBAN LANES", desc: "Interactive drag-and-drop mission control", bg: "#ffe600", text: "#000" },
                      { icon: <Layers size={20} />, title: "CALENDAR GRID", desc: "Time-block and schedule operations", bg: "#00f0ff", text: "#000" },
                      { icon: <Radio size={20} />, title: "FOCUS TIMER", desc: "Synthesized audio Pomodoro chimes", bg: "#ff007a", text: "#fff" },
                      { icon: <Zap size={20} />, title: "POWER STATS", desc: "Productivity level rank & streak counter", bg: "#00ff66", text: "#000" },
                    ].map((f) => (
                      <div
                        key={f.title}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          background: f.bg,
                          color: f.text,
                          border: '2px solid #000000',
                          boxShadow: '3px 3px 0px #000000',
                        }}
                      >
                        <div style={{ marginBottom: '8px' }}>{f.icon}</div>
                        <h3 style={{ fontSize: '13px', fontWeight: 900, marginBottom: '4px' }}>{f.title}</h3>
                        <p style={{ fontSize: '11px', fontWeight: 700, opacity: 0.9 }}>{f.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => {
                        setShowFeaturesModal(false);
                        navigate('/register');
                      }}
                      className="comic-btn comic-btn-yellow"
                      style={{ padding: '10px 24px', fontSize: '14px' }}
                    >
                      <span>ENLIST NOW →</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* PWA App Install Modal */}
        <InstallPwaModal
          isOpen={showInstallModal}
          onClose={() => setShowInstallModal(false)}
          onInstallDirectly={triggerInstall}
        />
      </div>
    </>
  );
}
