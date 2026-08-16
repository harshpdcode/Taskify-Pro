// src/pages/Landing.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import MultiverseStationArtifact from '../components/MultiverseStationArtifact';
import AsciiGlitchText from '../components/AsciiGlitchText';
import { 
  Sparkles, 
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

  // Universal coordinate tracker for both Mouse (Desktop) and Finger Drag (Mobile Phone)
  const updateInteractiveOffset = (clientX: number, clientY: number) => {
    if (!stationRef.current) return;
    const rect = stationRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = clientX - centerX;
    const distY = clientY - centerY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // Calculate proximity intensity
    const maxDist = Math.max(380, typeof window !== 'undefined' ? window.innerWidth * 0.7 : 400);
    const intensity = Math.max(0.35, Math.min(1.3, 1.3 - distance / maxDist));

    setMouseOffset({
      x: (distX / (rect.width / 2)) * 30,
      y: (distY / (rect.height / 2)) * 26,
      intensity,
    });
    setIsHoveringArtwork(true);
  };

  // Native non-passive touch listeners to completely prevent browser page scrolling
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        updateInteractiveOffset(touch.clientX, touch.clientY);
        setIsHoveringArtwork(true);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      if (touch) {
        updateInteractiveOffset(touch.clientX, touch.clientY);
        setIsHoveringArtwork(true);
      }
    };

    const onTouchEnd = () => {
      // Keep animation running continuously until user taps outside!
      setIsHoveringArtwork(true);
    };

    stage.addEventListener('touchstart', onTouchStart, { passive: false });
    stage.addEventListener('touchmove', onTouchMove, { passive: false });
    stage.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      stage.removeEventListener('touchstart', onTouchStart);
      stage.removeEventListener('touchmove', onTouchMove);
      stage.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  // Mouse event handlers (PC / Laptop View)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    updateInteractiveOffset(e.clientX, e.clientY);
  };

  const handleMouseEnter = () => setIsHoveringArtwork(true);
  const handleMouseLeave = () => {
    setIsHoveringArtwork(false);
    setMouseOffset({ x: 0, y: 0, intensity: 0 });
  };

  // Reset animation only when user clicks/taps outside the interactive stage
  const handleResetStage = () => {
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
          overscroll-behavior: none;
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
          justifyContent: center;
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
          justifyContent: center;
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
          letter-spacing: -1.5px;
          text-transform: uppercase;
          margin: 0;
          line-height: 0.95;
          text-shadow: 
            3px 3px 0px #000000,
            6px 6px 0px #00f0ff,
            9px 9px 0px #ff007a;
          transform: skew(-2deg) rotate(-1deg);
        }

        .neo-title-taskify {
          color: #ffffff;
          margin-right: 10px;
        }

        .dark .neo-title-taskify {
          color: #ffffff;
        }

        .neo-title-pro {
          color: #ffe600;
          background: #000000;
          padding: 0 12px;
          border: 3px solid #000000;
          box-shadow: 4px 4px 0px #00f0ff;
          border-radius: 8px;
          display: inline-block;
          transform: rotate(3deg);
        }

        .neo-hero-subtitle {
          font-size: clamp(11px, 2vw, 16px);
          font-weight: 800;
          letter-spacing: 1px;
          margin-top: 14px;
          background: #000000;
          color: #00ff66;
          padding: 4px 14px;
          border: 2px solid #00ff66;
          border-radius: 999px;
          box-shadow: 3px 3px 0px #000000;
          text-transform: uppercase;
        }

        /* ── CENTRAL 3D ARTIFACT STAGE ── */
        .spider-multiverse-stage {
          position: absolute;
          top: 52%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: min(52dvh, 480px);
          height: min(52dvh, 480px);
          z-index: 10;
          display: flex;
          align-items: center;
          justifyContent: center;
          cursor: grab;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }

        .spider-multiverse-stage:active {
          cursor: grabbing;
        }

        /* ── STICKER BADGES ── */
        .comic-sticker {
          position: absolute;
          z-index: 12;
          padding: 8px 14px;
          border: 3px solid #000000;
          box-shadow: 4px 4px 0px #000000;
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
            height: min(42dvh, 310px) !important;
            width: min(42dvh, 310px) !important;
            top: 50% !important;
          }
          .mobile-hero-cta {
            display: flex !important;
          }
          .comic-sticker {
            font-size: 9.5px !important;
            padding: 4px 8px !important;
            border-width: 2px !important;
            box-shadow: 2px 2px 0px #000 !important;
            bottom: 8px !important;
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
          bottom: clamp(55px, 10dvh, 85px);
          left: 0;
          right: 0;
          justify-content: center;
          z-index: 25;
        }
      `}</style>

      <div className="neo-landing halftone-bg">
        {/* ── TOP COMIC NAVBAR ── */}
        <header className="neo-navbar" onClick={handleResetStage}>
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
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="comic-btn comic-btn-yellow spider-hover-glitch"
              style={{ padding: '7px 10px', borderRadius: '8px' }}
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
              touchAction: 'none',
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

            {/* 2. SPIDER-VERSE MULTIVERSE MISSION STATION (Touch-Draggable on Phone View) */}
            <div
              ref={stationRef}
              className="spider-multiverse-stage"
              onClick={() => {
                setIsHoveringArtwork(true);
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

            {/* 4. Spider-Verse Pop Badges */}
            <div className="comic-sticker sticker-left">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={14} color="#000000" />
                <span>MULTIVERSE OS</span>
              </div>
            </div>

            <div className="comic-sticker sticker-right">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} color="#000000" />
                <span>DIMENSION: 616</span>
              </div>
            </div>
          </section>
        </main>

        {/* Features Modal */}
        <AnimatePresence>
          {showFeaturesModal && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
              }}
              onClick={() => setShowFeaturesModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'var(--bg-card)',
                  border: '4px solid #000000',
                  boxShadow: '8px 8px 0px #000000',
                  borderRadius: '20px',
                  maxWidth: '520px',
                  width: '100%',
                  maxHeight: '85vh',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ padding: '16px 20px', background: '#00f0ff', color: '#000000', borderBottom: '3px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 900, fontSize: '15px', textTransform: 'uppercase' }}>MISSION CAPABILITIES</span>
                  <button onClick={() => setShowFeaturesModal(false)} className="comic-btn comic-btn-pink" style={{ padding: '4px', borderRadius: '6px' }}>
                    <X size={16} />
                  </button>
                </div>

                <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ padding: '12px', background: 'var(--bg-input)', border: '2px solid #000', borderRadius: '12px' }}>
                    <h4 style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', color: '#ffe600' }}>⚡ Kanban Board & Lanes</h4>
                    <p style={{ fontSize: '11px', marginTop: '4px' }}>Drag, drop, and stage missions across customized multiverse progress states.</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--bg-input)', border: '2px solid #000', borderRadius: '12px' }}>
                    <h4 style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', color: '#ff007a' }}>⏱️ Pomodoro Focus Timer</h4>
                    <p style={{ fontSize: '11px', marginTop: '4px' }}>Sync deep work blocks with live synth chimes and confetti celebrations.</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--bg-input)', border: '2px solid #000', borderRadius: '12px' }}>
                    <h4 style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', color: '#00ff66' }}>📅 Quantum Calendar Matrix</h4>
                    <p style={{ fontSize: '11px', marginTop: '4px' }}>Schedule, reschedule, and balance missions across days with single-tap dispatching.</p>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--bg-input)', border: '2px solid #000', borderRadius: '12px' }}>
                    <h4 style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', color: '#00f0ff' }}>📊 Hero Analytics & Reports</h4>
                    <p style={{ fontSize: '11px', marginTop: '4px' }}>Track completion velocities and export official comic dossier PDFs.</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
