// src/components/AsciiGlitchText.tsx
import React, { useState, useEffect } from 'react';
import { useAsciiGlitch } from '../hooks/useAsciiGlitch';
import { useTheme } from '../context/ThemeContext';

interface AsciiGlitchTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  glitchOnHover?: boolean;
  durationMs?: number;
}

export default function AsciiGlitchText({
  text,
  className = '',
  style = {},
  glitchOnHover = true,
  durationMs = 450,
}: AsciiGlitchTextProps) {
  const { isGlitching } = useTheme();
  const [pulseGlitch, setPulseGlitch] = useState(false);

  const shouldGlitch = isGlitching || pulseGlitch;
  const { displayText, triggerManually } = useAsciiGlitch(text, shouldGlitch, durationMs);

  useEffect(() => {
    const handlePulse = () => {
      setPulseGlitch(true);
      triggerManually();
      setTimeout(() => setPulseGlitch(false), durationMs);
    };
    window.addEventListener('ascii-glitch-pulse', handlePulse);
    return () => window.removeEventListener('ascii-glitch-pulse', handlePulse);
  }, [triggerManually, durationMs]);

  const handleMouseEnter = () => {
    if (glitchOnHover) {
      setPulseGlitch(true);
      triggerManually();
      setTimeout(() => setPulseGlitch(false), durationMs);
    }
  };

  return (
    <span
      className={className}
      style={{
        ...style,
        fontFamily: shouldGlitch ? 'var(--font-mono, monospace)' : style.fontFamily,
        transition: 'color 0.15s ease',
      }}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </span>
  );
}
