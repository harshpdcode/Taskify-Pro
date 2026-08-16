// src/components/MultiverseGlitchOverlay.tsx
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect } from 'react';

const ASCII_SNIPPETS = [
  '░▒▓█ REALITY_FRACTURE // MULTIVERSE_SHIFT █▓▒░',
  'DIMENSION_SPLIT: EARTH-616 <---> EARTH-1610',
  '01100010 01110010 01100101 01100001 01101011',
  '⚡ QUANTUM_TIMELINE_DISPLACEMENT // ERR_404',
  '█████████ MULTIVERSE_CONVERGENCE █████████',
];

export default function MultiverseGlitchOverlay() {
  const { isGlitching } = useTheme();
  const [randomSnippet, setRandomSnippet] = useState('');

  useEffect(() => {
    if (isGlitching) {
      setRandomSnippet(ASCII_SNIPPETS[Math.floor(Math.random() * ASCII_SNIPPETS.length)]);
    }
  }, [isGlitching]);

  if (!isGlitching) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      className="multiverse-tear-active"
    >
      {/* Cyan Chromatic Dimension Slice */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 240, 255, 0.25)',
          mixBlendMode: 'screen',
          transform: 'translate(-12px, 4px) skewX(-4deg)',
          clipPath: 'polygon(0 15%, 100% 15%, 100% 50%, 0 50%)',
          animation: 'spider-slice-left 220ms steps(3, jump-none) infinite',
        }}
      />

      {/* Magenta Chromatic Dimension Slice */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255, 0, 122, 0.25)',
          mixBlendMode: 'screen',
          transform: 'translate(14px, -4px) skewX(5deg)',
          clipPath: 'polygon(0 48%, 100% 48%, 100% 85%, 0 85%)',
          animation: 'spider-slice-right 220ms steps(3, jump-none) infinite',
        }}
      />

      {/* Halftone Glitch Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#000000 20%, transparent 21%)',
          backgroundSize: '10px 10px',
          opacity: 0.35,
          mixBlendMode: 'overlay',
        }}
      />

      {/* ASCII Multiverse Code Stream Banner */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: 0,
          right: 0,
          padding: '8px 0',
          background: '#000000',
          color: '#00ff66',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '14px',
          fontWeight: 900,
          textAlign: 'center',
          letterSpacing: '2px',
          borderTop: '2px solid #00f0ff',
          borderBottom: '2px solid #ff007a',
          boxShadow: '0 0 20px rgba(0, 255, 102, 0.6)',
          transform: 'skewY(-1.5deg)',
        }}
      >
        {randomSnippet}
      </div>

      {/* Multiverse Comic Burst Slash Lines */}
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #ffe600, #ff007a, #00f0ff)',
          transform: 'translateY(-50%) skewY(-2deg)',
          boxShadow: '0 0 20px #00f0ff, 0 0 40px #ff007a',
        }}
      />
    </div>
  );
}
