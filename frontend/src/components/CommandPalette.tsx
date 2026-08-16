// src/components/CommandPalette.tsx
import { useState, useEffect } from 'react';
import { Search, Plus, CheckSquare, Kanban, Calendar as CalendarIcon, BarChart3, Sun, X, Download, Command } from 'lucide-react';
import type { Task, ViewMode } from '../types/task';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onOpenNewTask: () => void;
  onSwitchView: (view: ViewMode) => void;
  onToggleTheme: () => void;
  onExport: () => void;
}

const makeQuickActions = (onOpenNewTask: () => void, onToggleTheme: () => void, onExport: () => void, onClose: () => void) => [
  { icon: <Plus size={15} color="#6366f1" />, label: 'Create New Task', kbd: 'N', onClick: () => { onOpenNewTask(); onClose(); } },
  { icon: <Sun size={15} color="#f59e0b" />, label: 'Toggle Dark / Light Mode', onClick: () => { onToggleTheme(); onClose(); } },
  { icon: <Download size={15} color="#10b981" />, label: 'Export Tasks (JSON)', onClick: () => { onExport(); onClose(); } },
];

const viewActions = [
  { icon: <CheckSquare size={14} color="#6366f1" />, label: 'All Tasks', view: 'list' as ViewMode },
  { icon: <Kanban size={14} color="#a855f7" />, label: 'Kanban Board', view: 'kanban' as ViewMode },
  { icon: <CalendarIcon size={14} color="#f59e0b" />, label: 'Calendar', view: 'calendar' as ViewMode },
  { icon: <BarChart3 size={14} color="#ec4899" />, label: 'Analytics', view: 'analytics' as ViewMode },
];

export default function CommandPalette({ isOpen, onClose, tasks, onSelectTask, onOpenNewTask, onSwitchView, onToggleTheme, onExport }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); if (isOpen) onClose(); else setQuery(''); }
      else if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    (t.description && t.description.toLowerCase().includes(query.toLowerCase()))
  );

  const sectionLabel = (text: string) => (
    <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', padding: '0 4px', marginBottom: '6px' }}>{text}</span>
  );

  const actionBtn = (label: string, icon: React.ReactNode, onClick: () => void, kbd?: string) => (
    <button key={label} onClick={onClick}
      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '12px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease' }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-chip-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
      {icon}
      <span style={{ flex: 1 }}>{label}</span>
      {kbd && <kbd style={{ padding: '2px 6px', borderRadius: '6px', background: 'var(--bg-chip)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '10px', fontFamily: 'monospace' }}>{kbd}</kbd>}
    </button>
  );

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '80px', padding: '80px 16px 16px' }}>
        {/* Backdrop */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }} />

        {/* Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -12 }} transition={{ duration: 0.15 }}
          style={{ position: 'relative', width: '100%', maxWidth: '520px', borderRadius: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-modal)', zIndex: 10, overflow: 'hidden' }}
        >
          {/* Accent bar */}
          <div style={{ height: '2px', background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)' }} />

          {/* Search input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
            <Search size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
            <input type="text" autoFocus placeholder="Search tasks or type a command…"
              value={query} onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '14px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <kbd style={{ display: 'flex', alignItems: 'center', gap: '2px', padding: '3px 7px', borderRadius: '6px', background: 'var(--bg-chip)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'monospace' }}>
                <Command size={10} /> K
              </kbd>
              <button onClick={onClose}
                style={{ padding: '5px', borderRadius: '8px', border: 'none', background: 'var(--bg-chip)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: '12px 14px 16px', maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick actions */}
            <div>
              {sectionLabel('Quick Actions')}
              {makeQuickActions(onOpenNewTask, onToggleTheme, onExport, onClose).map(({ icon, label, kbd, onClick }) =>
                actionBtn(label, icon, onClick, kbd)
              )}
            </div>

            {/* Navigate */}
            <div>
              {sectionLabel('Jump To View')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {viewActions.map(({ icon, label, view }) => (
                  <button key={view} onClick={() => { onSwitchView(view); onClose(); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-subtle)', background: 'var(--bg-chip)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.12s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-chip-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-chip)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Task search results */}
            {query && (
              <div>
                {sectionLabel(`Matching Tasks (${filteredTasks.length})`)}
                {filteredTasks.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '12px', padding: '8px 12px' }}>No tasks matched "{query}"</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {filteredTasks.slice(0, 6).map((t) => (
                      <button key={t.id} onClick={() => { onSelectTask(t); onClose(); }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'var(--bg-chip)', color: 'var(--text-primary)', fontSize: '13px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-chip-hover)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-chip)'; }}>
                        <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{t.title}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px', textTransform: 'capitalize', flexShrink: 0, marginLeft: '8px' }}>{t.category || 'General'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
