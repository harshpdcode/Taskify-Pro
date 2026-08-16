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
  shortLabel: string;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  color: string;
  bg: string;
}

const dockItems: DockItem[] = [
  { id: 'list', label: 'TASKS', shortLabel: 'TASKS', icon: CheckSquare, color: '#000000', bg: '#ffe600' },
  { id: 'kanban', label: 'KANBAN', shortLabel: 'LANES', icon: Kanban, color: '#000000', bg: '#00f0ff' },
  { id: 'calendar', label: 'CALENDAR', shortLabel: 'CALENDAR', icon: CalendarIcon, color: '#000000', bg: '#00ff66' },
  { id: 'pomodoro', label: 'TIMER', shortLabel: 'TIMER', icon: Timer, color: '#ffffff', bg: '#ff007a' },
  { id: 'analytics', label: 'STATS', shortLabel: 'STATS', icon: BarChart3, color: '#ffffff', bg: '#9d00ff' },
];

export default function MobileBottomDock({
  currentView,
  onViewChange,
  onOpenQuickAdd,
}: MobileBottomDockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null);
  const [hoveredView, setHoveredView] = useState<ViewMode | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle drag / pointer movement across the dock to switch menu
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
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        right: '10px',
        zIndex: 45,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
      className="lg:hidden"
    >
      <motion.div
        ref={dockRef}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: '100%',
          maxWidth: '430px',
          background: 'var(--bg-sidebar)',
          border: '3px solid #000000',
          borderRadius: '22px',
          boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.5), 4px 4px 0px #ffe600' : '4px 4px 0px #000000',
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '4px',
          pointerEvents: 'auto',
          userSelect: 'none',
          touchAction: 'none',
          position: 'relative',
          transition: 'box-shadow 0.2s ease',
        }}
      >
        {/* Active Floating Comic Badge (Follows current tab) */}
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
                padding: '6px 2px',
                borderRadius: '14px',
                background: isActive ? item.bg : 'transparent',
                color: isActive ? item.color : 'var(--text-secondary)',
                border: isActive ? '2px solid #000000' : '2px solid transparent',
                boxShadow: isActive ? '2px 2px 0px #000000' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
              }}
            >
              {/* Icon */}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 900,
                  letterSpacing: '0.4px',
                  marginTop: '3px',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.shortLabel}
              </span>

              {/* Active Glitch Underline Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeDockPill"
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    width: '14px',
                    height: '3px',
                    background: '#000000',
                    borderRadius: '2px',
                  }}
                />
              )}
            </motion.button>
          );
        })}

        {/* Quick Add Mission Floating Button (+) */}
        <motion.button
          onClick={onOpenQuickAdd}
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.08 }}
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
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
            marginLeft: '2px',
          }}
          title="Create New Mission (Task)"
        >
          <Plus size={22} strokeWidth={3} />
        </motion.button>
      </motion.div>
    </div>
  );
}
