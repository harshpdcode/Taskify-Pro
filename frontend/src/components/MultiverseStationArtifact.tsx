// src/components/MultiverseStationArtifact.tsx
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAsciiGlitch } from '../hooks/useAsciiGlitch';

interface MultiverseStationArtifactProps {
  isGlitching: boolean;
  mouseOffset: { x: number; y: number; intensity: number };
}

export default function MultiverseStationArtifact({
  isGlitching,
  mouseOffset,
}: MultiverseStationArtifactProps) {
  const { darkMode } = useTheme();

  const title1 = useAsciiGlitch('TASKIFY_OS', isGlitching);
  const title2 = useAsciiGlitch('FOCUS: 100%', isGlitching);
  const title3 = useAsciiGlitch('STATUS: ACTIVE', isGlitching);
  const title4 = useAsciiGlitch('25:00 FOCUS', isGlitching);

  const cyanShiftX = -12 - mouseOffset.x * 0.8;
  const cyanShiftY = 6 + mouseOffset.y * 0.5;
  const magentaShiftX = 14 + mouseOffset.x * 0.8;
  const magentaShiftY = -6 - mouseOffset.y * 0.5;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `perspective(900px) rotateY(${mouseOffset.x * 0.45}deg) rotateX(${-mouseOffset.y * 0.45}deg) scale(${1 + mouseOffset.intensity * 0.06})`,
        transition: 'transform 0.1s ease-out',
        userSelect: 'none',
      }}
    >
      {/* ── CYAN MULTIVERSE CHROMATIC FRACTURE LAYER ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 12px #00f0ff) brightness(1.3)',
          opacity: isGlitching || mouseOffset.intensity > 0.15 ? 0.9 : 0,
          transform: `translate(${cyanShiftX}px, ${cyanShiftY}px)`,
          clipPath: 'polygon(0 0, 100% 0, 100% 32%, 0 32%, 0 60%, 100% 60%, 100% 85%, 0 85%)',
          animation: isGlitching ? 'spider-slice-left 220ms steps(3, jump-none) infinite' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      >
        <StationIllustration
          tagText="DIMENSION-616"
          statusText={title3.displayText}
          timerText={title4.displayText}
          accentColor="#00f0ff"
          badgeColor="#00f0ff"
          isCyanGhost
        />
      </div>

      {/* ── MAGENTA MULTIVERSE CHROMATIC FRACTURE LAYER ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 12px #ff007a) brightness(1.3)',
          opacity: isGlitching || mouseOffset.intensity > 0.15 ? 0.9 : 0,
          transform: `translate(${magentaShiftX}px, ${magentaShiftY}px)`,
          clipPath: 'polygon(0 20%, 100% 20%, 100% 48%, 0 48%, 0 70%, 100% 70%, 100% 95%, 0 95%)',
          animation: isGlitching ? 'spider-slice-right 220ms steps(3, jump-none) infinite' : 'none',
          transition: 'opacity 0.2s ease',
        }}
      >
        <StationIllustration
          tagText="DIMENSION-1610"
          statusText={title3.displayText}
          timerText={title4.displayText}
          accentColor="#ff007a"
          badgeColor="#ff007a"
          isMagentaGhost
        />
      </div>

      {/* ── MAIN HIGH-ENERGY NEO-BRUTALIST COMIC MISSION STATION ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          zIndex: 10,
          filter: isGlitching
            ? 'contrast(1.25) drop-shadow(4px 4px 0px #000000)'
            : darkMode
            ? 'drop-shadow(8px 8px 0px #000000)'
            : 'drop-shadow(8px 8px 0px rgba(0,0,0,0.85))',
        }}
      >
        <StationIllustration
          tagText={title1.displayText}
          statusText={title2.displayText}
          timerText={title4.displayText}
          accentColor="#ffe600"
          badgeColor="#ff007a"
        />
      </div>

      {/* Spider-Verse Comic Dimension Stamp */}
      {isGlitching && (
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: -8 }}
          exit={{ scale: 0 }}
          className="comic-badge"
          style={{
            position: 'absolute',
            top: '8%',
            right: '-6%',
            background: '#ff007a',
            color: '#ffffff',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px #000000',
            fontSize: '11px',
            fontWeight: 900,
            zIndex: 30,
          }}
        >
          🕷️ REALITY SHIFT ACTIVE
        </motion.div>
      )}
    </div>
  );
}

// Sub-component: High-Def SVG Graphic Novel Mission Control Station
function StationIllustration({
  tagText,
  statusText,
  timerText,
  accentColor,
  badgeColor,
  isCyanGhost = false,
  isMagentaGhost = false,
}: {
  tagText: string;
  statusText: string;
  timerText: string;
  accentColor: string;
  badgeColor: string;
  isCyanGhost?: boolean;
  isMagentaGhost?: boolean;
}) {
  const baseFill = isCyanGhost ? '#00f0ff' : isMagentaGhost ? '#ff007a' : '#ffffff';
  const cardFill = isCyanGhost ? '#00f0ff' : isMagentaGhost ? '#ff007a' : '#faf8f0';

  return (
    <svg
      viewBox="0 0 500 500"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}
    >
      {/* ── BACKGROUND COMIC SPEED HALO & BURST ── */}
      <circle cx="250" cy="250" r="190" fill={accentColor} stroke="#000000" strokeWidth="6" strokeDasharray="16 10" opacity="0.35" />
      <polygon points="250,30 265,100 235,100" fill="#000000" />
      <polygon points="470,250 400,265 400,235" fill="#000000" />
      <polygon points="250,470 235,400 265,400" fill="#000000" />
      <polygon points="30,250 100,235 100,265" fill="#000000" />

      {/* ── ISOMETRIC DESK / MISSION CONTROL PODIUM ── */}
      <g transform="translate(0, 40)">
        {/* Base shadow plate */}
        <polygon points="120,380 380,380 440,430 60,430" fill="#000000" />
        <polygon points="110,370 370,370 430,420 50,420" fill={cardFill} stroke="#000000" strokeWidth="5" />

        {/* Podium Base */}
        <rect x="150" y="320" width="200" height="60" rx="8" fill="#ffe600" stroke="#000000" strokeWidth="5" />
        <line x1="160" y1="350" x2="340" y2="350" stroke="#000000" strokeWidth="3" strokeDasharray="6 4" />

        {/* ── MAIN HOLOGRAPHIC TASK BOARD TABLET ── */}
        <g transform="translate(100, 110)">
          {/* Main Board Frame */}
          <rect x="0" y="0" width="300" height="220" rx="16" fill={baseFill} stroke="#000000" strokeWidth="6" />
          
          {/* Top Board Header */}
          <rect x="0" y="0" width="300" height="42" rx="16" fill={accentColor} stroke="#000000" strokeWidth="6" />
          <circle cx="24" cy="21" r="7" fill="#ff007a" stroke="#000000" strokeWidth="2.5" />
          <circle cx="44" cy="21" r="7" fill="#00f0ff" stroke="#000000" strokeWidth="2.5" />
          <circle cx="64" cy="21" r="7" fill="#00ff66" stroke="#000000" strokeWidth="2.5" />

          {/* Header Title Text */}
          <text x="180" y="27" fontFamily="monospace" fontSize="13" fontWeight="900" textAnchor="middle" fill="#000000">
            {tagText}
          </text>

          {/* 3 Kanban Lane Columns */}
          {/* Lane 1: TO-DO */}
          <rect x="14" y="56" width="84" height="150" rx="8" fill="#ffe600" stroke="#000000" strokeWidth="3.5" />
          <rect x="22" y="68" width="68" height="36" rx="6" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
          <line x1="28" y1="80" x2="78" y2="80" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
          <line x1="28" y1="92" x2="65" y2="92" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />

          <rect x="22" y="112" width="68" height="36" rx="6" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
          <line x1="28" y1="124" x2="72" y2="124" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
          <line x1="28" y1="136" x2="55" y2="136" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />

          {/* Lane 2: IN-PROGRESS */}
          <rect x="108" y="56" width="84" height="150" rx="8" fill="#00f0ff" stroke="#000000" strokeWidth="3.5" />
          <rect x="116" y="68" width="68" height="42" rx="6" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
          <line x1="122" y1="80" x2="174" y2="80" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
          <line x1="122" y1="92" x2="160" y2="92" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="170" cy="100" r="4" fill="#ff007a" />

          {/* Lane 3: COMPLETED */}
          <rect x="202" y="56" width="84" height="150" rx="8" fill="#00ff66" stroke="#000000" strokeWidth="3.5" />
          <rect x="210" y="68" width="68" height="42" rx="6" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
          <path d="M 218 88 L 226 96 L 244 76" fill="none" stroke="#000000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="250" y1="84" x2="270" y2="84" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
          <line x1="250" y1="94" x2="265" y2="94" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* ── FLOATING POMODORO FOCUS TIMER GAUGE (Left) ── */}
        <g transform="translate(25, 170) rotate(-6)">
          <rect x="0" y="0" width="90" height="90" rx="14" fill="#ff007a" stroke="#000000" strokeWidth="5" />
          <circle cx="45" cy="45" r="32" fill="#ffffff" stroke="#000000" strokeWidth="4" />
          <circle cx="45" cy="45" r="24" fill="none" stroke="#ffe600" strokeWidth="6" strokeDasharray="80 30" />
          <text x="45" y="50" fontFamily="monospace" fontSize="11" fontWeight="900" textAnchor="middle" fill="#000000">
            {timerText}
          </text>
        </g>

        {/* ── FLOATING PRODUCTIVITY POWER LEVEL BADGE (Right) ── */}
        <g transform="translate(385, 160) rotate(8)">
          <rect x="0" y="0" width="95" height="105" rx="14" fill="#ffe600" stroke="#000000" strokeWidth="5" />
          <polygon points="47,15 60,45 88,48 66,68 73,95 47,80 22,95 29,68 7,48 35,45" fill={badgeColor} stroke="#000000" strokeWidth="3" />
          <text x="47" y="60" fontFamily="monospace" fontSize="11" fontWeight="900" textAnchor="middle" fill="#ffffff">
            ⚡
          </text>
          <text x="47" y="98" fontFamily="monospace" fontSize="8.5" fontWeight="900" textAnchor="middle" fill="#000000">
            {statusText}
          </text>
        </g>
      </g>
    </svg>
  );
}
