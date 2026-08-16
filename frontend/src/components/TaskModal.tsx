// src/components/TaskModal.tsx
import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  Tag,
  Flag,
  CheckCircle2,
  Sparkles,
  Check,
  Zap,
} from 'lucide-react';
import type { Task, TaskPriority, TaskStatus, TaskCategory, Subtask } from '../types/task';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  initialTask?: Task | null;
}

const priorityOpts: { id: TaskPriority; label: string; color: string; textCol: string }[] = [
  { id: 1, label: 'LOW',    color: '#00ff66', textCol: '#000000' },
  { id: 2, label: 'MEDIUM', color: '#00f0ff', textCol: '#000000' },
  { id: 3, label: 'HIGH',   color: '#ffe600', textCol: '#000000' },
  { id: 4, label: 'URGENT', color: '#ff007a', textCol: '#ffffff' },
];

const categoryOpts: { id: TaskCategory; label: string }[] = [
  { id: 'work', label: 'WORK & PROJECTS' },
  { id: 'personal', label: 'PERSONAL & LIFE' },
  { id: 'learning', label: 'LEARNING & STUDY' },
  { id: 'finance', label: 'FINANCE & BILLS' },
  { id: 'health', label: 'HEALTH & FITNESS' },
  { id: 'creative', label: 'CREATIVE' },
  { id: 'general', label: 'GENERAL' },
];

export default function TaskModal({ isOpen, onClose, onSave, initialTask }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(3);
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [category, setCategory] = useState<TaskCategory>('work');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(25);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority || 3);
      setStatus(initialTask.status || 'todo');
      setCategory(initialTask.category || 'work');
      setDueDate(initialTask.due_date ? initialTask.due_date.slice(0, 10) : '');
      setEstimatedMinutes(initialTask.estimated_minutes || 25);
      setSubtasks(initialTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setPriority(3);
      setStatus('todo');
      setCategory('work');
      setDueDate('');
      setEstimatedMinutes(25);
      setSubtasks([]);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks([...subtasks, { id: Date.now().toString(), text: newSubtaskText.trim(), completed: false }]);
    setNewSubtaskText('');
  };

  const setDatePreset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setDueDate(d.toISOString().slice(0, 10));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      category,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      estimated_minutes: Number(estimatedMinutes),
      subtasks,
      completed: status === 'completed',
    });
    onClose();
  };

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--text-primary)',
    fontSize: '11px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '6px',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '42px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: 800,
    color: 'var(--text-primary)',
    background: 'var(--bg-input)',
    border: '2px solid #000000',
    boxShadow: '2px 2px 0px #000000',
    boxSizing: 'border-box',
    outline: 'none',
    padding: '0 14px',
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(5px)',
          }}
        />

        {/* Comic Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '620px',
            maxHeight: 'min(90vh, 760px)',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '18px',
            background: 'var(--bg-card)',
            border: '4px solid #000000',
            boxShadow: '10px 10px 0px #000000',
            zIndex: 90,
            overflow: 'hidden',
          }}
        >
          {/* ── 1. PINNED MODAL HEADER ── */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 20px',
              background: '#ffe600',
              color: '#000000',
              borderBottom: '3px solid #000000',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap size={20} fill="#000" />
              <h2 style={{ fontWeight: 900, fontSize: '17px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {initialTask ? '⚡ EDIT MISSION TARGET' : '💥 DISPATCH NEW MISSION'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="comic-btn comic-btn-pink"
              style={{ padding: '6px', borderRadius: '8px', boxShadow: '2px 2px 0px #000' }}
            >
              <X size={16} />
            </button>
          </div>

          {/* ── 2. SCROLLABLE FORM BODY ── */}
          <form
            id="task-modal-form"
            onSubmit={handleSubmit}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Title */}
            <div>
              <label style={labelStyle}>
                <Flag size={13} /> MISSION TITLE *
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="WHAT NEEDS TO BE ACCOMPLISHED?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>
                <Sparkles size={13} /> CONTEXT & INTEL
              </label>
              <textarea
                rows={3}
                placeholder="Add key notes, requirements, or links..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  ...inputStyle,
                  height: 'auto',
                  padding: '10px 14px',
                  resize: 'none',
                  display: 'block',
                  lineHeight: 1.45,
                }}
              />
            </div>

            {/* Priority Selector */}
            <div>
              <label style={labelStyle}>
                <Flag size={13} /> THREAT LEVEL / PRIORITY
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {priorityOpts.map((p) => {
                  const isSelected = priority === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPriority(p.id)}
                      className="comic-btn"
                      style={{
                        background: isSelected ? p.color : 'var(--bg-input)',
                        color: isSelected ? p.textCol : 'var(--text-primary)',
                        padding: '9px 0',
                        fontSize: '11px',
                        fontWeight: 900,
                        border: '2px solid #000000',
                        boxShadow: isSelected ? '3px 3px 0px #000000' : '2px 2px 0px #000000',
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>
                  <CheckCircle2 size={13} /> STATUS
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="todo">TO DO</option>
                  <option value="in_progress">IN PROGRESS</option>
                  <option value="in_review">IN REVIEW</option>
                  <option value="completed">COMPLETED</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>
                  <Tag size={13} /> CATEGORY
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  {categoryOpts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date & Quick Presets */}
            <div>
              <label style={labelStyle}>
                <CalendarIcon size={13} /> DEADLINE
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{ ...inputStyle, width: 'auto', minWidth: '150px' }}
                />
                {[
                  ['TODAY', 0],
                  ['TOMORROW', 1],
                  ['NEXT WEEK', 7],
                ].map(([lbl, days]) => (
                  <button
                    key={lbl as string}
                    type="button"
                    onClick={() => setDatePreset(days as number)}
                    className="comic-btn comic-btn-white"
                    style={{ padding: '6px 12px', fontSize: '11px' }}
                  >
                    {lbl}
                  </button>
                ))}
                {dueDate && (
                  <button
                    type="button"
                    onClick={() => setDueDate('')}
                    className="comic-btn comic-btn-pink"
                    style={{ padding: '6px 12px', fontSize: '11px' }}
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </div>

            {/* Estimated Focus Time */}
            <div>
              <label style={labelStyle}>
                <Clock size={13} /> ESTIMATED FOCUS TIME
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="number"
                  min={5}
                  max={480}
                  step={5}
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  style={{ ...inputStyle, width: '90px', fontFamily: 'monospace' }}
                />
                <span style={{ fontSize: '12px', fontWeight: 800 }}>MINUTES</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[15, 25, 45, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setEstimatedMinutes(m)}
                      className={`comic-btn ${estimatedMinutes === m ? 'comic-btn-yellow' : 'comic-btn-white'}`}
                      style={{ padding: '5px 10px', fontSize: '11px' }}
                    >
                      {m}M
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Checklist Subtasks */}
            <div>
              <label style={labelStyle}>
                <CheckCircle2 size={13} /> CHECKLIST STEPS ({subtasks.length})
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="ADD SUB-STEP (PRESS ENTER)"
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="comic-btn comic-btn-cyan"
                  style={{ padding: '0 16px', fontSize: '12px' }}
                >
                  <Plus size={14} /> ADD
                </button>
              </div>

              {subtasks.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    maxHeight: '140px',
                    overflowY: 'auto',
                    padding: '2px',
                  }}
                >
                  {subtasks.map((st) => (
                    <div
                      key={st.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'var(--bg-input)',
                        color: 'var(--text-primary)',
                        border: '2px solid #000000',
                        boxShadow: '2px 2px 0px #000000',
                      }}
                    >
                      <div
                        onClick={() =>
                          setSubtasks(
                            subtasks.map((s) => (s.id === st.id ? { ...s, completed: !s.completed } : s))
                          )
                        }
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
                      >
                        <div
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: '1.5px solid #000',
                            background: st.completed ? '#00ff66' : '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {st.completed && <Check size={12} color="#000000" strokeWidth={3.5} />}
                        </div>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 800,
                            textDecoration: st.completed ? 'line-through' : 'none',
                            opacity: st.completed ? 0.7 : 1,
                          }}
                        >
                          {st.text}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSubtasks(subtasks.filter((s) => s.id !== st.id))}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#ff007a',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>

          {/* ── 3. PINNED MODAL FOOTER ── */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              padding: '14px 24px',
              borderTop: '3px solid #000000',
              background: 'var(--bg-card)',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="comic-btn comic-btn-white"
              style={{ padding: '9px 20px', fontSize: '12px' }}
            >
              CANCEL
            </button>
            <button
              type="submit"
              form="task-modal-form"
              className="comic-btn comic-btn-green"
              style={{ padding: '9px 28px', fontSize: '13px' }}
            >
              {initialTask ? 'SAVE CHANGES ✔' : 'DISPATCH MISSION 💥'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
