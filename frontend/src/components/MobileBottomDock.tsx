// src/components/MobileBottomDock.tsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Kanban, 
  Calendar as CalendarIcon, 
  Timer, 
  BarChart3, 
  Plus,
  Sun,
  Moon
} from 'lucide-react';
import type { ViewMode } from '../types/task';
import { useTheme } from '../context/ThemeContext';

interface MobileBottomDockProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenQuickAdd: () => void;
}

interface DockTabItem {
  id: ViewMode | 'theme';
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
  bg: string;
  isThemeToggle?: boolean;
}

const leftItems: DockTabItem[] = [
  { id: 'list', label: 'TASKS', icon: CheckSquare, color: '#000000', bg: '#ffe600' },
  { id: 'kanban', label: 'LANES', icon: Kanban, color: '#000000', bg: '#00f0ff' },
  { id: 'calendar', label: 'CALENDAR', icon: CalendarIcon, color: '#000000', bg: '#00ff66' },
];

export default function MobileBottomDock({
  currentView,
  onViewChange,
  onOpenQuickAdd,
}: MobileBottomDockProps) {
  const { darkMode, toggleTheme } = useTheme();
  const dockRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLElement | null>>({});
  const [hoveredView, setHoveredView] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const rightItems: DockTabItem[] = [
    { id: 'pomodoro', label: 'TIMER', icon: Timer, color: '#ffffff', bg: '#ff007a' },
    { id: 'analytics', label: 'STATS', icon: BarChart3, color: '#ffffff', bg: '#9d00ff' },
    { 
      id: 'theme', 
      label: darkMode ? 'LIGHT' : 'DARK', 
      icon: darkMode ? Sun : Moon, 
      color: '#000000', 
      bg: '#ffe600',
      isThemeToggle: true,
    },
  ];

  const allItems: DockTabItem[] = [...leftItems, ...rightItems];

  // Determine closest tab to touch X coordinate during drag
  const detectTabAtX = (clientX: number): DockTabItem | null => {
    let closestItem: DockTabItem | null = null;
    let minDistance = Infinity;

    for (const item of allItems) {
      const el = tabRefs.current[item.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (clientX >= rect.left && clientX <= rect.right) {
          return item;
        }
        const tabCenter = rect.left + rect.width / 2;
        const dist = Math.abs(clientX - tabCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestItem = item;
        }
      }
    }

    return closestItem;
  };

  // Touch Move / Drag Gesture listener
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    const touch = e.touches[0];
    if (touch) {
      const targetItem: DockTabItem | null = detectTabAtX(touch.clientX);
      if (targetItem) {
        setHoveredView(targetItem.id);
        if (!targetItem.isThemeToggle) {
          onViewChange(targetItem.id as ViewMode);
        }
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    if (touch) {
      const targetItem: DockTabItem | null = detectTabAtX(touch.clientX);
      if (targetItem && targetItem.id !== hoveredView) {
        setHoveredView(targetItem.id);
        if (!targetItem.isThemeToggle) {
          onViewChange(targetItem.id as ViewMode);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setHoveredView(null);
  };

  const renderTab = (item: DockTabItem) => {
    const isActive = !item.isThemeToggle && currentView === item.id;
    const isTargeted = hoveredView === item.id;
    const Icon = item.icon;

    return (
      <motion.button
        key={item.id}
        ref={(el) => { tabRefs.current[item.id] = el; }}
        onClick={(e) => {
          e.stopPropagation();
          if (item.isThemeToggle) {
            toggleTheme();
          } else {
            onViewChange(item.id as ViewMode);
          }
        }}
        whileTap={{ scale: 0.9, rotate: item.isThemeToggle ? 25 : 0 }}
        animate={{
          scale: isTargeted || isActive ? 1.04 : 0.98,
          y: isTargeted || isActive ? -2 : 0,
        }}
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '5px 1px 3px',
          borderRadius: '9px',
          background: isActive ? item.bg : 'transparent',
          color: isActive ? item.color : 'var(--text-secondary)',
          border: isActive ? '2px solid #000000' : '2px solid transparent',
          boxShadow: isActive ? '2px 2px 0px #000000' : 'none',
          cursor: 'pointer',
          minWidth: 0,
          transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
        }}
        title={item.label}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} strokeWidth={isActive ? 2.8 : 2.2} />
        </div>

        <span
          style={{
            fontSize: '7.5px',
            fontWeight: 900,
            letterSpacing: '0.2px',
            marginTop: '2px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            lineHeight: 1.1,
          }}
        >
          {item.label}
        </span>

        {isActive && (
          <motion.div
            layoutId="activeDockUnderline"
            style={{
              position: 'absolute',
              bottom: '1px',
              width: '8px',
              height: '2px',
              background: item.color,
              borderRadius: '2px',
            }}
          />
        )}
      </motion.button>
    );
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100vw',
        zIndex: 50,
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
      className="lg:hidden"
    >
      {/* Multiverse Neon Dividing Line across top */}
      <div
        style={{
          width: '100%',
          height: '3px',
          background: 'linear-gradient(90deg, #ffe600, #ff007a, #00f0ff, #00ff66)',
        }}
      />

      {/* Main Solid Dock Bar with 3-Left | Center-FAB | 3-Right Symmetry */}
      <div
        ref={dockRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          width: '100%',
          background: 'var(--bg-card)',
          borderTop: '3px solid #000000',
          boxShadow: '0 -4px 0px #000000, 0 -10px 24px rgba(0,0,0,0.5)',
          padding: '4px 4px calc(5px + env(safe-area-inset-bottom, 4px))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Left 3 Tabs: Tasks, Lanes, Calendar (Flex 1) */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '2px', minWidth: 0 }}>
          {leftItems.map(renderTab)}
        </div>

        {/* ── CENTER HERO POP FAB (+) BUTTON (LIFTED HIGHER & DEAD CENTER) ── */}
        <div
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 3px',
            flexShrink: 0,
            position: 'relative',
            zIndex: 30,
          }}
        >
          {/* Subtle Outer Halo Ring */}
          <div style={{
            position: 'absolute',
            top: '-34px',
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '2.5px solid #000000',
            zIndex: 1,
            pointerEvents: 'none',
          }} />

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuickAdd();
            }}
            whileTap={{ scale: 0.84, rotate: 90 }}
            whileHover={{ scale: 1.12, rotate: 15 }}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffe600 0%, #ff007a 100%)',
              color: '#000000',
              border: '3.5px solid #000000',
              boxShadow: '0 4px 0px #000000, 0 6px 18px rgba(255, 0, 122, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginTop: '-30px',
              position: 'relative',
              zIndex: 10,
              transform: 'rotate(-2deg)',
            }}
            title="Create New Mission (Task)"
          >
            <Plus size={26} strokeWidth={3.5} color="#ffffff" />
          </motion.button>
        </div>

        {/* Right 3 Tabs: Timer, Stats, Theme Toggle (Flex 1) */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '2px', minWidth: 0 }}>
          {rightItems.map(renderTab)}
        </div>
      </div>
    </nav>
  );
}
