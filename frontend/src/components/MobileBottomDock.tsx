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

const dockItems: DockItem[] = [
  { id: 'list', label: 'TASKS', icon: CheckSquare, color: '#000000', bg: '#ffe600' },
  { id: 'kanban', label: 'LANES', icon: Kanban, color: '#000000', bg: '#00f0ff' },
  { id: 'calendar', label: 'CALENDAR', icon: CalendarIcon, color: '#000000', bg: '#00ff66' },
  { id: 'pomodoro', label: 'TIMER', icon: Timer, color: '#ffffff', bg: '#ff007a' },
  { id: 'analytics', label: 'STATS', icon: BarChart3, color: '#ffffff', bg: '#9d00ff' },
];

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
    const targetIndex = Math.min(dockItems.length - 1, Math.floor(percentage * dockItems.length));
    const targetItem = dockItems[targetIndex];
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
          padding: '6px 8px calc(8px + env(safe-area-inset-bottom, 6px))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4px',
          boxSizing: 'border-box',
        }}
      >
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '4px', minWidth: 0 }}>
          {dockItems.map((item) => {
            const isActive = currentView === item.id;
            const isTargeted = hoveredView === item.id;
            const Icon = item.icon;

            return (
              <motion.button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                whileTap={{ scale: 0.92 }}
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
                  padding: '7px 2px 5px',
                  borderRadius: '12px',
                  background: isActive ? item.bg : 'transparent',
                  color: isActive ? item.color : 'var(--text-secondary)',
                  border: isActive ? '2px solid #000000' : '2px solid transparent',
                  boxShadow: isActive ? '2px 2px 0px #000000' : 'none',
                  cursor: 'pointer',
                  minWidth: 0,
                  transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
                }}
              >
                {/* Icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} strokeWidth={isActive ? 2.8 : 2} />
                </div>

                {/* Label */}
                <span
                  style={{
                    fontSize: '8.5px',
                    fontWeight: 900,
                    letterSpacing: '0.4px',
                    marginTop: '2px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    lineHeight: 1.1,
                  }}
                >
                  {item.label}
                </span>

                {/* Active Indicator Strip */}
                {isActive && (
                  <motion.div
                    layoutId="activeDockUnderline"
                    style={{
                      position: 'absolute',
                      bottom: '1px',
                      width: '12px',
                      height: '2.5px',
                      background: item.color,
                      borderRadius: '2px',
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Quick Add FAB (+) Button */}
        <motion.button
          onClick={onOpenQuickAdd}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.06 }}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: '#ffe600',
            color: '#000000',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px #ff007a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transform: 'rotate(-2deg)',
            marginLeft: '4px',
          }}
          title="Create New Mission"
        >
          <Plus size={22} strokeWidth={3.2} />
        </motion.button>
      </div>
    </nav>
  );
}
