// src/components/Header.tsx
import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  Bell,
  User as UserIcon,
  Command,
  CheckCircle2,
  Flame,
  Zap,
  CheckSquare,
  Kanban,
  Calendar as CalendarIcon,
  Timer,
  BarChart3,
  Sun,
  Moon,
  FileDown,
  Download,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AsciiGlitchText from './AsciiGlitchText';
import type { ViewMode } from '../types/task';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenQuickAdd: () => void;
  onOpenCommandPalette: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  username: string;
  userEmail?: string;
  streakCount?: number;
  completedTasksCount?: number;
  totalTasksCount?: number;
  onExport?: () => void;
  onLogout?: () => void;
  onOpenInstallModal?: () => void;
}

const navItems: { id: ViewMode; label: string; icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>; color: string; bg: string }[] = [
  { id: 'list', label: 'TASKS', icon: CheckSquare, color: '#000000', bg: '#ffe600' },
  { id: 'kanban', label: 'KANBAN', icon: Kanban, color: '#000000', bg: '#00f0ff' },
  { id: 'calendar', label: 'CALENDAR', icon: CalendarIcon, color: '#000000', bg: '#00ff66' },
  { id: 'pomodoro', label: 'TIMER', icon: Timer, color: '#ffffff', bg: '#ff007a' },
  { id: 'analytics', label: 'STATS', icon: BarChart3, color: '#ffffff', bg: '#9d00ff' },
];

export default function Header({
  currentView,
  onViewChange,
  onOpenQuickAdd,
  onOpenCommandPalette,
  searchQuery,
  onSearchChange,
  username,
  userEmail = 'hero@taskify.pro',
  streakCount = 4,
  completedTasksCount = 0,
  totalTasksCount = 0,
  onExport,
  onLogout,
  onOpenInstallModal,
}: HeaderProps) {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);

  const profileRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const completionPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

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
        gap: '12px',
        padding: isDesktop ? '10px 24px' : '8px 12px',
        background: 'var(--bg-header)',
        borderBottom: 'var(--border-thick)',
        boxShadow: '0 3px 0px #000000',
        boxSizing: 'border-box',
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* ── Left: Brand & Logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <div
          onClick={() => onViewChange('list')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <motion.div
            whileHover={{ rotate: 10, scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#ffe600',
              border: '3px solid #000000',
              boxShadow: '3px 3px 0px #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(-3deg)',
              flexShrink: 0,
            }}
          >
            <Zap size={20} color="#000000" fill="#000000" />
          </motion.div>

          <div>
            <div style={{ fontWeight: 900, fontSize: isDesktop ? '17px' : '15px', textTransform: 'uppercase', letterSpacing: '-0.4px', lineHeight: 1.1 }}>
              Taskify <span style={{ color: '#ff007a' }}>Pro</span>
            </div>
            {isDesktop && (
              <div className="comic-badge" style={{ background: '#00f0ff', color: '#000000', padding: '1px 5px', fontSize: '9px', marginTop: '2px' }}>
                MULTIVERSE OS ⚡
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Center: Interactive View Switcher Tabs (Desktop/Tablet) ── */}
      {isDesktop && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px #000000',
            borderRadius: '14px',
            padding: '4px',
            gap: '4px',
          }}
        >
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.02 }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  border: isActive ? '2px solid #000000' : '2px solid transparent',
                  background: isActive ? item.bg : 'transparent',
                  color: isActive ? item.color : 'var(--text-secondary)',
                  boxShadow: isActive ? '2px 2px 0px #000000' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} strokeWidth={2.5} />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* ── Right: Search + Streak + New Task + Notifications + Profile Dropdown ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? '10px' : '6px', flexShrink: 0 }}>
        {/* Comic Search bar */}
        <div style={{ position: 'relative', width: isDesktop ? '200px' : '130px' }}>
          <Search
            size={14}
            color="#000000"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          />
          <input
            type="text"
            placeholder={isDesktop ? "SEARCH (CTRL+K)" : "SEARCH…"}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              width: '100%',
              height: '34px',
              borderRadius: '10px',
              paddingLeft: '30px',
              paddingRight: isDesktop ? '38px' : '8px',
              fontSize: isDesktop ? '11px' : '10px',
              fontWeight: 800,
              letterSpacing: '0.4px',
              color: 'var(--text-primary)',
              background: 'var(--bg-input)',
              border: '2px solid #000000',
              boxShadow: searchFocused ? '2px 2px 0px #ffe600' : '2px 2px 0px #000000',
              outline: 'none',
              transition: 'all 0.15s ease',
              boxSizing: 'border-box',
            }}
          />
          {isDesktop && (
            <button
              onClick={onOpenCommandPalette}
              style={{
                position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
                display: 'flex', alignItems: 'center', gap: '2px',
                padding: '2px 5px', borderRadius: '5px', border: '1px solid #000',
                background: '#ffe600', color: '#000', cursor: 'pointer',
                fontSize: '10px', fontWeight: 900,
                boxShadow: '1px 1px 0px #000',
              }}
            >
              <Command size={10} />
              <span>K</span>
            </button>
          )}
        </div>

        {/* Streak Stamp */}
        {isDesktop && (
          <div
            className="comic-badge comic-badge-rotate-left"
            style={{
              background: '#ffe600',
              color: '#000000',
              padding: '5px 10px',
              fontSize: '11px',
            }}
          >
            <Flame size={14} color="#ff007a" fill="#ff007a" />
            <span><AsciiGlitchText text={`${streakCount}D STREAK`} /></span>
          </div>
        )}

        {/* New Task button */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          onClick={onOpenQuickAdd}
          className="comic-btn comic-btn-pink"
          style={{ padding: isDesktop ? '7px 14px' : '6px 10px', fontSize: isDesktop ? '12px' : '11px', borderRadius: '10px' }}
        >
          <Plus size={15} strokeWidth={3} />
          {isDesktop && <span>NEW TASK</span>}
        </motion.button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="comic-btn comic-btn-yellow"
            style={{ padding: '7px', borderRadius: '10px' }}
          >
            <Bell size={16} />
            <span style={{
              position: 'absolute', top: '-3px', right: '-3px',
              width: '9px', height: '9px', borderRadius: '50%',
              background: '#ff007a', border: '2px solid #000',
            }} />
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: '290px', borderRadius: '14px', padding: '14px',
                  background: 'var(--bg-card)',
                  border: '3px solid #000000',
                  boxShadow: '5px 5px 0px #000000',
                  zIndex: 100,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '2px solid #000', paddingBottom: '6px' }}>
                  <span style={{ fontWeight: 900, fontSize: '12px', textTransform: 'uppercase' }}>MISSIONS LOG</span>
                  <span className="comic-badge" style={{ background: '#ff007a', color: '#fff', fontSize: '9px' }}>2 ACTIVE</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    padding: '8px 10px', borderRadius: '10px',
                    background: '#ffe600', color: '#000',
                    border: '2px solid #000', boxShadow: '2px 2px 0px #000',
                  }}>
                    <Zap size={15} color="#000" fill="#000" style={{ marginTop: '1px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', marginBottom: '2px' }}>Multiverse Sync Active</p>
                      <p style={{ fontSize: '10px', fontWeight: 700, lineHeight: 1.3 }}>Cloud PostgreSQL database is online.</p>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                    padding: '8px 10px', borderRadius: '10px',
                    background: '#00ff66', color: '#000',
                    border: '2px solid #000', boxShadow: '2px 2px 0px #000',
                  }}>
                    <CheckCircle2 size={15} color="#000" style={{ marginTop: '1px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', marginBottom: '2px' }}>Streak Protected!</p>
                      <p style={{ fontSize: '10px', fontWeight: 700, lineHeight: 1.3 }}>{streakCount} Day focus streak maintained.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Interactive User Profile & Quick Action Menu Dropdown ── */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.04 }}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="comic-btn comic-btn-cyan spider-hover-glitch"
            style={{ padding: '4px 8px 4px 5px', borderRadius: '10px', gap: '6px' }}
          >
            <div style={{
              width: '26px', height: '26px', borderRadius: '7px', flexShrink: 0,
              background: '#000000', color: '#ffffff',
              border: '1px solid #000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: '12px', textTransform: 'uppercase',
            }}>
              {username ? username.charAt(0) : <UserIcon size={13} />}
            </div>
            {isDesktop && (
              <span style={{ fontWeight: 900, fontSize: '11px', textTransform: 'uppercase' }}>
                {username || 'HERO'}
              </span>
            )}
            <ChevronDown size={13} strokeWidth={3} />
          </motion.button>

          {/* User Dossier & Actions Dropdown */}
          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  width: '260px', borderRadius: '16px', padding: '14px',
                  background: 'var(--bg-card)',
                  border: '3px solid #000000',
                  boxShadow: '6px 6px 0px #000000',
                  zIndex: 100,
                  color: 'var(--text-primary)',
                }}
              >
                {/* Hero Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '10px', borderBottom: '2px dashed var(--border-color)', marginBottom: '10px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '10px',
                    background: '#ffe600', color: '#000', border: '2px solid #000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, fontSize: '16px', textTransform: 'uppercase',
                    boxShadow: '2px 2px 0px #000',
                  }}>
                    {username ? username.charAt(0) : 'H'}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      @{username || 'hero'}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {userEmail}
                    </div>
                  </div>
                </div>

                {/* Mission Progress Mini Bar */}
                <div style={{ padding: '8px', background: 'var(--bg-input)', borderRadius: '10px', border: '1px solid #000', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 900, marginBottom: '4px' }}>
                    <span>COMPLETION RATE</span>
                    <span style={{ color: '#00ff66' }}>{completionPct}%</span>
                  </div>
                  <div style={{ height: '7px', width: '100%', background: '#000000', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${completionPct}%`, background: '#00ff66', transition: 'width 0.3s ease' }} />
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {/* Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="comic-btn comic-btn-yellow"
                    style={{ justifyContent: 'flex-start', padding: '7px 10px', fontSize: '11px', width: '100%', borderRadius: '8px' }}
                  >
                    {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                    <span>{darkMode ? 'SWITCH TO LIGHT MODE' : 'SWITCH TO DARK MODE'}</span>
                  </button>

                  {/* Profile & Dossier */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/profile');
                    }}
                    className="comic-btn comic-btn-cyan"
                    style={{ justifyContent: 'flex-start', padding: '7px 10px', fontSize: '11px', width: '100%', borderRadius: '8px' }}
                  >
                    <Settings size={14} />
                    <span>HERO PROFILE & DOSSIER</span>
                  </button>

                  {/* Export Report */}
                  {onExport && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onExport();
                      }}
                      className="comic-btn comic-btn-green"
                      style={{ justifyContent: 'flex-start', padding: '7px 10px', fontSize: '11px', width: '100%', borderRadius: '8px' }}
                    >
                      <FileDown size={14} />
                      <span>EXPORT COMIC REPORT (PDF)</span>
                    </button>
                  )}

                  {/* Install PWA Modal */}
                  {onOpenInstallModal && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenInstallModal();
                      }}
                      className="comic-btn comic-btn-white"
                      style={{ justifyContent: 'flex-start', padding: '7px 10px', fontSize: '11px', width: '100%', borderRadius: '8px' }}
                    >
                      <Download size={14} />
                      <span>INSTALL PWA APP</span>
                    </button>
                  )}

                  {/* Logout */}
                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        onLogout();
                      }}
                      className="comic-btn comic-btn-pink"
                      style={{ justifyContent: 'flex-start', padding: '7px 10px', fontSize: '11px', width: '100%', borderRadius: '8px', marginTop: '4px' }}
                    >
                      <LogOut size={14} />
                      <span>LOGOUT / EXIT</span>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
