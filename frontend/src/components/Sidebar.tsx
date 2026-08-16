import { 
  CheckSquare, 
  Kanban, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Timer, 
  FolderKanban, 
  Zap,
  LogOut,
  Moon,
  Sun,
  X,
  Download
} from 'lucide-react';
import type { ViewMode } from '../types/task';
import { motion, AnimatePresence } from 'framer-motion';
import AsciiGlitchText from './AsciiGlitchText';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
  totalTasks: number;
  completedTasks: number;
  onOpenInstallModal?: () => void;
}

const navItems: { id: ViewMode; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: 'list', label: 'All Tasks', icon: CheckSquare, color: '#ffe600' },
  { id: 'kanban', label: 'Kanban Board', icon: Kanban, color: '#00f0ff' },
  { id: 'calendar', label: 'Calendar View', icon: CalendarIcon, color: '#00ff66' },
  { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3, color: '#9d00ff' },
  { id: 'pomodoro', label: 'Focus Timer', icon: Timer, color: '#ff007a' },
];

const categories: { id: string; label: string; color: string; badge: string }[] = [
  { id: 'all', label: 'All Categories', color: '#000000', badge: 'ALL' },
  { id: 'work', label: 'Work & Projects', color: '#0066ff', badge: 'PRO' },
  { id: 'personal', label: 'Personal & Life', color: '#ff007a', badge: 'LIFE' },
  { id: 'learning', label: 'Learning & Study', color: '#ffe600', badge: 'STUDY' },
  { id: 'finance', label: 'Finance & Bills', color: '#00ff66', badge: 'CASH' },
  { id: 'health', label: 'Health & Fitness', color: '#00f0ff', badge: 'FIT' },
];

export default function Sidebar({
  currentView,
  onViewChange,
  selectedCategory,
  onCategoryChange,
  isOpen,
  onClose,
  darkMode,
  onToggleTheme,
  onLogout,
  totalTasks,
  completedTasks,
  onOpenInstallModal,
}: SidebarProps) {
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const sidebarContent = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '272px',
        background: 'var(--bg-sidebar)',
        borderRight: 'var(--border-thick)',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        transition: 'background-color 0.2s ease, border-color 0.2s ease',
      }}
      className="halftone-bg"
    >
      {/* Brand Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 18px 14px',
        borderBottom: 'var(--border-thick)',
        background: 'var(--bg-sidebar)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
            background: '#ffe600',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px #000000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: 'rotate(-3deg)',
          }}>
            <Zap className="w-5 h-5 text-black" fill="#000000" />
          </div>
          <div>
            <div style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '16px', letterSpacing: '-0.3px', textTransform: 'uppercase' }}>
              Taskify <span style={{ color: '#ff007a' }}>Pro</span>
            </div>
            <div className="comic-badge comic-badge-rotate-right" style={{ background: '#00f0ff', color: '#000', padding: '1px 6px', fontSize: '9px' }}>
              COMIC EDITION ⚡
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden comic-btn comic-btn-pink"
          style={{ padding: '6px', borderRadius: '8px' }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px 12px' }} className="custom-scrollbar">
        {/* Nav Views */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: 'var(--text-primary)', fontSize: '11px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>
            ⚡ WORKSPACE MODES
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onViewChange(item.id); onClose(); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', borderRadius: '10px',
                  marginBottom: '6px', cursor: 'pointer',
                  background: isActive ? item.color : 'transparent',
                  color: isActive ? '#000000' : 'var(--text-secondary)',
                  border: isActive ? '2px solid #000000' : '2px solid transparent',
                  boxShadow: isActive ? '3px 3px 0px #000000' : 'none',
                  fontWeight: 900,
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  transition: 'all 0.1s ease',
                  transform: isActive ? 'translate(-1px, -1px)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(0,0,0,0.06)';
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  <Icon className="w-4 h-4" />
                </span>
                <span><AsciiGlitchText text={item.label} /></span>
              </button>
            );
          })}
        </div>

        {/* Categories */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            color: 'var(--text-primary)', fontSize: '11px', fontWeight: 900, letterSpacing: '1px',
            textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px',
          }}>
            <span>📂 CATEGORIES</span>
            <FolderKanban className="w-3.5 h-3.5" />
          </div>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 10px', borderRadius: '8px',
                  marginBottom: '4px', cursor: 'pointer',
                  background: isSelected ? '#ffffff' : 'transparent',
                  color: isSelected ? '#000000' : 'var(--text-secondary)',
                  border: isSelected ? '2px solid #000000' : '2px solid transparent',
                  boxShadow: isSelected ? '2px 2px 0px #000000' : 'none',
                  fontSize: '12px', fontWeight: 800,
                  textAlign: 'left',
                  transition: 'all 0.1s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '100%', height: '10px', borderRadius: '3px',
                    backgroundColor: cat.color, border: '1px solid #000',
                    flexShrink: 0,
                    maxWidth: '10px',
                  }} />
                  <span><AsciiGlitchText text={cat.label} /></span>
                </div>
                <span style={{
                  fontSize: '9px', fontWeight: 900, padding: '1px 5px',
                  borderRadius: '4px', background: cat.color, color: '#fff',
                  border: '1px solid #000', textShadow: '1px 1px 0px #000',
                }}>
                  <AsciiGlitchText text={cat.badge} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Comic Progress Battery Card */}
        <div style={{
          padding: '12px', borderRadius: '12px',
          background: 'var(--bg-card)',
          border: '2px solid #000000',
          boxShadow: '3px 3px 0px #000000',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-primary)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>
              🎯 Power Level
            </span>
            <span style={{
              background: '#00ff66', color: '#000', padding: '1px 6px',
              borderRadius: '6px', border: '1px solid #000', fontSize: '11px', fontWeight: 900,
            }}>
              {completionPercentage}%
            </span>
          </div>
          <div style={{
            width: '100%', height: '12px', borderRadius: '6px',
            background: '#000000', border: '2px solid #000000', overflow: 'hidden', padding: '1px',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                height: '100%', borderRadius: '4px',
                background: 'linear-gradient(90deg, #ffe600, #ff007a, #00f0ff)',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', color: 'var(--text-secondary)', fontSize: '10px', fontWeight: 800 }}>
            <span>{completedTasks} COMPLETED</span>
            <span>{totalTasks} TOTAL</span>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div style={{
        padding: '12px 14px',
        borderTop: 'var(--border-thick)',
        background: 'var(--bg-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        gap: '8px',
      }}>
        {onOpenInstallModal && (
          <button
            onClick={onOpenInstallModal}
            className="comic-btn comic-btn-cyan spider-hover-glitch"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Download className="w-4 h-4 text-black" />
            <span>INSTALL APP ⚡</span>
          </button>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <button
            onClick={onToggleTheme}
            title="Switch Universe (Theme Glitch)"
            className="comic-btn comic-btn-yellow spider-hover-glitch"
            style={{ flex: 1, padding: '8px 10px', fontSize: '12px', borderRadius: '10px' }}
          >
            {darkMode ? <Sun className="w-4 h-4 text-black" /> : <Moon className="w-4 h-4 text-black" />}
            <span>{darkMode ? 'LIGHT' : 'DARK'}</span>
          </button>

          <button
            onClick={onLogout}
            className="comic-btn comic-btn-pink"
            style={{ flex: 1, padding: '8px 10px', fontSize: '12px', borderRadius: '10px' }}
          >
            <LogOut className="w-4 h-4" />
            <span>EXIT</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
            }}
            className="lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Desktop: always visible */}
      <div className="hidden lg:block">
        {sidebarContent}
      </div>

      {/* Mobile: slide in when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -272 }}
            animate={{ x: 0 }}
            exit={{ x: -272 }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="lg:hidden"
          >
            {sidebarContent}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
