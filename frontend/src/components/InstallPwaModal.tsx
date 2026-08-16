// src/components/InstallPwaModal.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, CheckCircle, Zap } from 'lucide-react';
import AsciiGlitchText from './AsciiGlitchText';

interface InstallPwaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstallDirectly?: () => void;
}

export default function InstallPwaModal({ isOpen, onClose, onInstallDirectly }: InstallPwaModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
        onClick={onClose}
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
            width: '100%',
            maxWidth: '480px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Top Yellow Header */}
          <div
            style={{
              padding: '14px 20px',
              background: '#ffe600',
              color: '#000000',
              borderBottom: '3px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Download size={20} strokeWidth={3} />
              <span style={{ fontWeight: 900, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <AsciiGlitchText text="INSTALL TASKIFY PRO APP" />
              </span>
            </div>
            <button
              onClick={onClose}
              className="comic-btn comic-btn-pink"
              style={{ padding: '6px', borderRadius: '8px' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: '20px 22px', maxHeight: '75vh', overflowY: 'auto' }}>
            {/* App Icon + Tagline */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: '#ffe600',
                  border: '3px solid #000000',
                  boxShadow: '3px 3px 0px #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transform: 'rotate(-2deg)',
                }}
              >
                <Zap size={30} fill="#000000" color="#000000" />
              </div>
              <div>
                <h3 style={{ fontWeight: 900, fontSize: '18px', textTransform: 'uppercase', margin: 0 }}>
                  TASKIFY PRO OS
                </h3>
                <span className="comic-badge" style={{ background: '#00ff66', color: '#000', marginTop: '4px', fontSize: '10px' }}>
                  STANDALONE NATIVE APP
                </span>
              </div>
            </div>

            {/* Direct Install Button (If supported by browser prompt) */}
            {onInstallDirectly && (
              <div style={{ marginBottom: '18px' }}>
                <button
                  onClick={() => {
                    onInstallDirectly();
                    onClose();
                  }}
                  className="comic-btn comic-btn-pink"
                  style={{
                    width: '100%',
                    padding: '12px 20px',
                    fontSize: '15px',
                    borderRadius: '12px',
                    boxShadow: '4px 4px 0px #000',
                  }}
                >
                  <Download size={18} />
                  <span>TAP TO INSTALL APP NOW 💥</span>
                </button>
              </div>
            )}

            {/* Benefits */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'var(--bg-input)',
                border: '2px solid #000000',
                marginBottom: '18px',
                fontSize: '12px',
                fontWeight: 800,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <CheckCircle size={15} color="#00ff66" />
                <span>Full screen app experience (no browser URL bar)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <CheckCircle size={15} color="#00f0ff" />
                <span>Instant launch icon in your phone's app drawer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <CheckCircle size={15} color="#ffe600" />
                <span>Ultra fast loading with local service worker cache</span>
              </div>
            </div>

            {/* Step-by-Step Instructions for Vivo Y73 & Chrome */}
            <div style={{ borderTop: '2px dashed #000000', paddingTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>
                <Smartphone size={16} />
                <span>HOW TO INSTALL ON ANDROID / CHROME:</span>
              </div>

              <ol style={{ paddingLeft: '18px', fontSize: '12px', fontWeight: 700, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                <li>Tap the <strong>three dots menu (⋮)</strong> at the top right of your browser.</li>
                <li>Tap <strong style={{ color: '#ff007a' }}>"Install App"</strong> or <strong style={{ color: '#0066ff' }}>"Add to Home screen"</strong>.</li>
                <li>Tap <strong>Install</strong>. The app will be added directly to your phone's app drawer!</li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
