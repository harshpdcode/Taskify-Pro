// src/hooks/useAsciiGlitch.ts
import { useState, useEffect, useRef, useCallback } from 'react';

const ASCII_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~01░▒▓█▀▄⚡🕷️';

export function useAsciiGlitch(originalText: string, triggerGlitch: boolean, durationMs = 450) {
  const [displayText, setDisplayText] = useState(originalText);
  const isRunningRef = useRef(false);

  const startGlitch = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    const totalSteps = 12;
    let currentStep = 0;
    const intervalMs = Math.max(25, Math.floor(durationMs / totalSteps));

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;

      if (progress < 1) {
        const chars = originalText.split('').map((char, idx) => {
          if (char === ' ' || char === '\n' || char === '\t') return char;
          const resolveThreshold = idx / originalText.length;
          // Reveal original characters progressively as progress increases
          if (progress > 0.4 && progress > resolveThreshold * 0.9) {
            return char;
          }
          return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
        });
        setDisplayText(chars.join(''));
      } else {
        clearInterval(interval);
        setDisplayText(originalText);
        isRunningRef.current = false;
      }
    }, intervalMs);

    // Guaranteed fallback resolution
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setDisplayText(originalText);
      isRunningRef.current = false;
    }, durationMs + 80);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      setDisplayText(originalText);
      isRunningRef.current = false;
    };
  }, [originalText, durationMs]);

  useEffect(() => {
    if (triggerGlitch) {
      const cleanup = startGlitch();
      return cleanup;
    } else {
      setDisplayText(originalText);
    }
  }, [triggerGlitch, startGlitch, originalText]);

  return { displayText, triggerManually: startGlitch };
}
