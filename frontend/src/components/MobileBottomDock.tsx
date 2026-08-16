// src/components/MobileBottomDock.tsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Kanban, 
  Calendar as CalendarIcon, 
  Timer, 
  BarChart3, 
  Plus
} from 'lucide-react';
import type { ViewMode } from '../types/task';

interface MobileBottomDockProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenQuickAdd: () => void;
}

interface DockItem {
  id: ViewMode;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
  bg: string;
}

const leftItems: DockItem[] = [
  { id: 'list', label: 'TASKS', icon: CheckSquare, color: '#000000', bg: '#ffe600' },
  { id: 'kanban', label: 'LANES', icon: Kanban, color: '#000000', bg: '#00f0ff' },
  { id: 'calendar', label: 'CALENDAR', icon: CalendarIcon, color: '#000000', bg: '#00ff66' },
];

const rightItems: DockItem[] = [
  { id: 'pomodoro', label: 'TIMER', icon: Timer, color: '#ffffff', bg: '#ff007a' },
  { id: 'analytics', label: 'STATS', icon: BarChart3, color: '#ffffff', bg: '#9d00ff' },
];

const allItems = [...leftItems, ...rightItems];

export default function MobileBottomDock({
  currentView,
  onViewChange,
  onOpenQuickAdd,
}: MobileBottomDockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null);
  const [hoveredView, setHoveredView] = useState<ViewMode | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Drag-to-select gesture handler
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dockRef.current || !isDragging) return;
    const rect = dockRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const targetIndex = Math.min(allItems.length - 1, Math.floor(percentage * allItems.length));
    const targetItem = allItems[targetIndex];
    if (targetItem && targetItem.id !== hoveredView) {
      setHoveredView(targetItem.id);
      onViewChange(targetItem.id);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setHoveredView(null);
  };

  const renderTab = (item: DockItem) => {
    const isActive = currentView === item.id;
    const isTargeted = hoveredView === item.id;
    const Icon = item.icon;

    return (
      <motion.button
        key={item.id}
        onClick={() => onViewChange(item.id)}
        whileTap={{ scale: 0.92 }}
        animate={{
          scale: isTargeted || isActive ? 1.05 : 0.98,
          y: isTargeted || isActive ? -2 : 0,
        }}
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6px 2px 4px',
          borderRadius: '10px',
          background: isActive ? item.bg : 'transparent',
          color: isActive ? item.color : 'var(--text-secondary)',
          border: isActive ? '2px solid #000000' : '2px solid transparent',
          boxShadow: isActive ? '2px 2px 0px #000000' : 'none',
          cursor: 'pointer',
          minWidth: 0,
          transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} strokeWidth={isActive ? 2.8 : 2} />
        </div>

        <span
          style={{
            fontSize: '8px',
            fontWeight: 900,
            letterSpacing: '0.3px',
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
              width: '10px',
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
        touchAction: 'none',
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

      {/* Main Solid Dock Bar */}
      <div
        ref={dockRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: '100%',
          background: 'var(--bg-card)',
          borderTop: '3px solid #000000',
          boxShadow: '0 -4px 0px #000000, 0 -10px 24px rgba(0,0,0,0.5)',
          padding: '4px 6px calc(6px + env(safe-area-inset-bottom, 4px))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2px',
          boxSizing: 'border-box',
        }}
      >
        {/* Left 3 Tabs: Tasks, Lanes, Calendar */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 3, gap: '2px', minWidth: 0 }}>
          {leftItems.map(renderTab)}
        </div>

        {/* ── CENTER HERO POP FAB (+) BUTTON ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', flexShrink: 0, position: 'relative' }}>
          <motion.button
            onClick={onOpenQuickAdd}
            whileTap={{ scale: 0.86, rotate: 90 }}
            whileHover={{ scale: 1.1, rotate: 15 }}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ffe600 0%, #ff007a 100%)',
              color: '#000000',
              border: '3px solid #000000',
              boxShadow: '3px 3px 0px #000000, 0 4px 14px rgba(255, 0, 122, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginTop: '-16px',
              zIndex: 10,
              transform: 'rotate(-2deg)',
            }}
            title="Create New Mission (Task)"
          >
            <Plus size={24} strokeWidth={3.5} color="#ffffff" />
          </motion.button>
        </div>

        {/* Right 2 Tabs: Timer, Stats */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 2, gap: '2px', minWidth: 0 }}>
          {rightItems.map(renderTab)}
        </div>
      </div>
    </nav>
  );
}
