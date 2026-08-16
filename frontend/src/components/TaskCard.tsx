// src/components/TaskCard.tsx
import React, { useState } from 'react';
import {
  Check,
  Clock,
  Calendar as CalendarIcon,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  Play,
  Tag,
  AlertCircle,
  Zap,
} from 'lucide-react';
import type { Task, TaskPriority, Subtask } from '../types/task';
import { motion, AnimatePresence } from 'framer-motion';
import { triggerTaskConfetti } from '../utils/confetti';
import AsciiGlitchText from './AsciiGlitchText';

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStartFocus?: (task: Task) => void;
  onUpdateSubtasks?: (task: Task, subtasks: Subtask[]) => void;
}

const priorityConfig: Record<TaskPriority, { label: string; color: string; bg: string; textCol: string }> = {
  1: { label: 'LOW',    color: '#00ff66', bg: '#00ff66', textCol: '#000000' },
  2: { label: 'MEDIUM', color: '#00f0ff', bg: '#00f0ff', textCol: '#000000' },
  3: { label: 'HIGH',   color: '#ffe600', bg: '#ffe600', textCol: '#000000' },
  4: { label: 'URGENT', color: '#ff007a', bg: '#ff007a', textCol: '#ffffff' },
};

const categoryConfig: Record<string, { color: string; bg: string }> = {
  work:     { color: '#0066ff', bg: '#0066ff' },
  personal: { color: '#ff007a', bg: '#ff007a' },
  learning: { color: '#ffe600', bg: '#ffe600' },
  finance:  { color: '#00ff66', bg: '#00ff66' },
  health:   { color: '#00f0ff', bg: '#00f0ff' },
  creative: { color: '#9d00ff', bg: '#9d00ff' },
  general:  { color: '#ffffff', bg: '#ffffff' },
};

export default function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  onStartFocus,
  onUpdateSubtasks,
}: TaskCardProps) {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const priority = priorityConfig[task.priority] || priorityConfig[2];
  const catStyle = categoryConfig[task.category] || categoryConfig.general;
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const subtaskProgress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  // Format Due Date
  let dueDateText = '';
  let isOverdue = false;
  if (task.due_date) {
    const due = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDateOnly = new Date(due);
    dueDateOnly.setHours(0, 0, 0, 0);
    const diffDays = Math.round((dueDateOnly.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) { dueDateText = `${Math.abs(diffDays)}d overdue`; isOverdue = !task.completed; }
    else if (diffDays === 0) dueDateText = 'Due Today';
    else if (diffDays === 1) dueDateText = 'Due Tomorrow';
    else dueDateText = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  const handleToggle = () => {
    if (!task.completed) triggerTaskConfetti();
    onToggle(task);
  };

  const handleSubtaskToggle = (subtaskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateSubtasks) return;
    const updated = subtasks.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s));
    onUpdateSubtasks(task, updated);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
      style={{
        position: 'relative',
        borderRadius: '14px',
        background: task.completed ? 'var(--bg-card-subtle)' : 'var(--bg-card)',
        border: '3px solid #000000',
        boxShadow: task.completed ? '2px 2px 0px #000000' : '5px 5px 0px #000000',
        opacity: task.completed ? 0.78 : 1,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      className="comic-card"
    >
      {/* Top Header Accent Banner */}
      <div style={{
        padding: '6px 14px',
        background: priority.bg,
        color: priority.textCol,
        borderBottom: '2px solid #000000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontWeight: 900,
        fontSize: '11px',
        letterSpacing: '0.8px',
        textTransform: 'uppercase',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={13} />
          <span><AsciiGlitchText text={`${priority.label} PRIORITY`} /></span>
        </div>
        {task.completed && (
          <span className="comic-badge comic-badge-rotate-right" style={{ background: '#00ff66', color: '#000000', padding: '1px 6px', fontSize: '10px' }}>
            COMPLETED! ✔
          </span>
        )}
      </div>

      {/* Card Body */}
      <div style={{ padding: '14px 16px' }}>
        {/* Top row: Checkbox + Title + Actions */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {/* Checkbox Stamp */}
          <button
            onClick={handleToggle}
            style={{
              marginTop: '1px', width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #000000',
              background: task.completed ? '#00ff66' : '#ffffff',
              boxShadow: '2px 2px 0px #000000',
              cursor: 'pointer', transition: 'all 0.1s ease',
            }}
            aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.completed && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
                <Check size={16} color="#000000" strokeWidth={3.5} />
              </motion.div>
            )}
          </button>

          {/* Title + description */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              color: 'var(--text-primary)',
              fontWeight: 900, fontSize: '15px', lineHeight: 1.3,
              letterSpacing: '-0.2px',
              textDecoration: task.completed ? 'line-through' : 'none',
              marginBottom: task.description ? '4px' : 0,
            }}>
              <AsciiGlitchText text={task.title} />
            </h3>
            {task.description && (
              <p style={{
                color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, lineHeight: 1.45,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                <AsciiGlitchText text={task.description} />
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {onStartFocus && !task.completed && (
              <button
                onClick={() => onStartFocus(task)}
                title="Focus (Pomodoro)"
                className="comic-btn comic-btn-pink"
                style={{ padding: '6px', borderRadius: '8px', boxShadow: '2px 2px 0px #000' }}
              >
                <Play size={13} />
              </button>
            )}
            <button
              onClick={() => onEdit(task)}
              title="Edit"
              className="comic-btn comic-btn-yellow"
              style={{ padding: '6px', borderRadius: '8px', boxShadow: '2px 2px 0px #000' }}
            >
              <Edit3 size={13} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              title="Delete"
              className="comic-btn comic-btn-white"
              style={{ padding: '6px', borderRadius: '8px', boxShadow: '2px 2px 0px #000', color: '#ff007a' }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Subtasks Section */}
        {subtasks.length > 0 && (
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '2px dashed #000000' }}>
            <div
              onClick={() => setShowSubtasks(!showSubtasks)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>
                <CheckSquare size={13} color="#ff007a" />
                <span>CHECKLIST: <strong>{completedSubtasks}/{subtasks.length}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '64px', height: '8px', borderRadius: '4px', background: '#000000', border: '1px solid #000', overflow: 'hidden' }}>
                  <div style={{ width: `${subtaskProgress}%`, height: '100%', background: '#00ff66', transition: 'width 0.3s' }} />
                </div>
                <span>{showSubtasks ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
              </div>
            </div>

            <AnimatePresence>
              {showSubtasks && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}
                >
                  {subtasks.map((st) => (
                    <div
                      key={st.id}
                      onClick={(e) => handleSubtaskToggle(st.id, e)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '5px 8px', borderRadius: '6px',
                        background: st.completed ? 'rgba(0,255,102,0.15)' : '#ffffff',
                        border: '1px solid #000000',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{
                        width: '14px', height: '14px', borderRadius: '3px', flexShrink: 0,
                        border: '1px solid #000000',
                        background: st.completed ? '#00ff66' : '#ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {st.completed && <Check size={10} color="#000000" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, textDecoration: st.completed ? 'line-through' : 'none' }}>
                        {st.text}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Comic Tag Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: '12px' }}>
          {/* Category Tag */}
          <span className="comic-badge" style={{ background: catStyle.bg, color: '#000000' }}>
            <Tag size={11} />
            <span>{task.category || 'General'}</span>
          </span>

          {/* Due Date Tag */}
          {dueDateText && (
            <span
              className="comic-badge"
              style={{
                background: isOverdue ? '#ff007a' : '#ffe600',
                color: isOverdue ? '#ffffff' : '#000000',
              }}
            >
              {isOverdue ? <AlertCircle size={11} /> : <CalendarIcon size={11} />}
              <span>{dueDateText}</span>
            </span>
          )}

          {/* Estimated Time Tag */}
          {task.estimated_minutes && (
            <span className="comic-badge" style={{ background: '#00f0ff', color: '#000000' }}>
              <Clock size={11} />
              <span>{task.estimated_minutes}M</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
