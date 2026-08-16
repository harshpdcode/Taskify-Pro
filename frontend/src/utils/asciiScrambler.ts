// src/utils/asciiScrambler.ts

/**
 * Dispatches a global ASCII glitch pulse that AsciiGlitchText and MultiverseGlitchOverlay listen to.
 */
export function triggerPageAsciiGlitch(durationMs = 450) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('ascii-glitch-pulse', { detail: { durationMs } }));
}
