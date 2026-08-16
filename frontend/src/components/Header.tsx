// src/components/Header.tsx
import { useState, useEffect } from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  User as UserIcon,
  Command,
  CheckCircle2,
  Flame,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AsciiGlitchText from './AsciiGlitchText';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenQuickAdd: () => void;
  onOpenCommandPalette: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  username: string;
  streakCount?: number;
}

export default function Header({
  onOpenSidebar,
  onOpenQuickAdd,
  onOpenCommandPalette,
  searchQuery,
  onSearchChange,
  username,
  streakCount = 3,
}: HeaderProps) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: isDesktop ? '16px' : '8px',
        padding: isDesktop ? '12px 20px' : '10px 12px',
        background: 'var(--bg-header)',
        borderBottom: 'var(--border-thick)',
        boxShadow: '0 3px 0px #000000',
        boxSizing: 'border-box',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* ── Left: mobile menu + search ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? '12px' : '8px', flex: 1, minWidth: 0, maxWidth: '540px' }}>
        {/* Mobile hamburger */}
        {!isDesktop && (
          <button
            onClick={onOpenSidebar}
            aria-label="Open menu"
            className="comic-btn comic-btn-yellow"
            style={{ padding: '7px', borderRadius: '8px', flexShrink: 0 }}
          >
            <Menu size={18} />
          </button>
        )}

        {/* Comic Search bar */}
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <Search
            size={15}
            color="#000000"
            style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            placeholder={isDesktop ? "SEARCH TASKS, TAGS, LOGS… (CTRL+K)" : "SEARCH TASKS…"}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%',
              height: '38px',
              borderRadius: '10px',
              paddingLeft: '34px',
              paddingRight: isDesktop ? '76px' : '12px',
              fontSize: isDesktop ? '12px' : '11px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              color: 'var(--text-primary)',
              background: 'var(--bg-input)',
              border: '2px solid #000000',
              boxShadow: searchFocused ? '3px 3px 0px #ffe600' : '2px 2px 0px #000000',
              outline: 'none',
              transition: 'all 0.15s ease',
              boxSizing: 'border-box',
            }}
          />
          {/* Cmd+K badge */}
          {isDesktop && (
            <button
              onClick={onOpenCommandPalette}
              style={{
                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                display: 'flex', alignItems: 'center', gap: '3px',
                padding: '3px 7px', borderRadius: '6px', border: '1px solid #000',
                background: '#ffe600', color: '#000', cursor: 'pointer',
                fontSize: '11px', fontWeight: 900,
                boxShadow: '1px 1px 0px #000',
              }}
            >
              <Command size={11} />
              <span>K</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Right: controls ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? '10px' : '6px', flexShrink: 0 }}>
        {/* Streak Stamp */}
        {isDesktop && (
          <div
            className="comic-badge comic-badge-rotate-left"
            style={{
              background: '#ffe600',
              color: '#000000',
              padding: '6px 12px',
              fontSize: '12px',
            }}
          >
            <Flame size={15} color="#ff007a" fill="#ff007a" />
            <span><AsciiGlitchText text={`${streakCount} DAY STREAK 🔥`} /></span>
          </div>
        )}

        {/* New Task button */}
        <button
          onClick={onOpenQuickAdd}
          className="comic-btn comic-btn-pink"
          style={{ padding: isDesktop ? '8px 16px' : '7px 10px', fontSize: '13px', borderRadius: '10px' }}
        >
          <Plus size={16} />
          {isDesktop && <span><AsciiGlitchText text="NEW TASK" /></span>}
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="comic-btn comic-btn-yellow"
            style={{ padding: '8px', borderRadius: '10px' }}
          >
            <Bell size={17} />
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              width: '10px', height: '10px', borderRadius: '50%',
              background: '#ff007a', border: '2px solid #000',
            }} />
          </button>

          {/* Notifications Comic Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: '310px', borderRadius: '14px', padding: '16px',
                  background: 'var(--bg-card)',
                  border: '3px solid #000000',
                  boxShadow: '6px 6px 0px #000000',
                  zIndex: 100,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '2px solid #000', paddingBottom: '8px' }}>
                  <span style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase' }}>Notifications</span>
                  <span className="comic-badge" style={{ background: '#ff007a', color: '#fff', fontSize: '10px' }}>2 NEW</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '10px 12px', borderRadius: '10px',
                    background: '#ffe600', color: '#000',
                    border: '2px solid #000', boxShadow: '2px 2px 0px #000',
                  }}>
                    <Zap size={16} color="#000" fill="#000" style={{ marginTop: '1px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', marginBottom: '2px' }}>Welcome to Comic Pro!</p>
                      <p style={{ fontSize: '11px', fontWeight: 700, lineHeight: 1.4 }}>Effortless planning. Limitless focus & flow.</p>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '10px',
                    padding: '10px 12px', borderRadius: '10px',
                    background: '#00ff66', color: '#000',
                    border: '2px solid #000', boxShadow: '2px 2px 0px #000',
                  }}>
                    <CheckCircle2 size={16} color="#000" style={{ marginTop: '1px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase', marginBottom: '2px' }}>Streak On Fire!</p>
                      <p style={{ fontSize: '11px', fontWeight: 700, lineHeight: 1.4 }}>You're 2 tasks away from your milestone record!</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar Badge */}
        <button
          onClick={() => navigate('/profile')}
          className="comic-btn comic-btn-cyan"
          style={{ padding: '5px 12px 5px 6px', borderRadius: '10px', gap: '8px' }}
        >
          <div style={{
            width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
            background: '#000000', color: '#ffffff',
            border: '1px solid #000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: '13px', textTransform: 'uppercase',
          }}>
            {username ? username.charAt(0) : <UserIcon size={14} />}
          </div>
          {isDesktop && (
            <span style={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}>
              <AsciiGlitchText text={username || 'HERO'} />
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
