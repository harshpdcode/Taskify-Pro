// src/components/KanbanBoard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Circle, 
  Clock, 
  Eye, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles
} from 'lucide-react';
import type { Task, TaskStatus } from '../types/task';
import TaskCard from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onUpdateStatus: (task: Task, newStatus: TaskStatus) => void;
  onQuickAddInLane: (status: TaskStatus) => void;
  onStartFocus: (task: Task) => void;
}

const columns: { id: TaskStatus; title: string; icon: React.ComponentType<{ size?: number; color?: string }>; color: string; textCol: string }[] = [
  { id: 'todo', title: 'TO DO', icon: Circle, color: '#ffe600', textCol: '#000000' },
  { id: 'in_progress', title: 'IN PROGRESS', icon: Clock, color: '#00f0ff', textCol: '#000000' },
  { id: 'in_review', title: 'IN REVIEW', icon: Eye, color: '#9d00ff', textCol: '#ffffff' },
  { id: 'completed', title: 'COMPLETED', icon: CheckCircle2, color: '#00ff66', textCol: '#000000' },
];

export default function KanbanBoard({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onUpdateStatus,
  onQuickAddInLane,
  onStartFocus,
}: KanbanBoardProps) {
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => {
      if (status === 'completed') return t.completed || t.status === 'completed';
      if (status === 'todo') return (t.status === 'todo' || !t.status) && !t.completed;
      return t.status === status && !t.completed;
    });
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'in_review';
    if (current === 'in_review') return 'completed';
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'completed') return 'in_review';
    if (current === 'in_review') return 'in_progress';
    if (current === 'in_progress') return 'todo';
    return null;
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isDesktop ? 'repeat(4, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: isDesktop ? '14px' : '16px',
      alignItems: 'stretch',
      height: isDesktop ? 'calc(100vh - 120px)' : 'auto',
      maxHeight: isDesktop ? 'calc(100vh - 120px)' : 'none',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {columns.map((col) => {
        const colTasks = getTasksByStatus(col.id);
        const Icon = col.icon;
        const prevStatus = getPrevStatus(col.id);
        const nextStatus = getNextStatus(col.id);

        return (
          <div
            key={col.id}
            style={{
              borderRadius: '16px',
              padding: '12px 10px',
              background: 'var(--bg-card)',
              border: '3px solid #000000',
              boxShadow: '4px 4px 0px #000000',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              minHeight: 0,
              boxSizing: 'border-box',
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 10px',
              marginBottom: '10px',
              borderRadius: '10px',
              background: col.color,
              color: col.textCol,
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon size={15} />
                <h3 style={{
                  fontSize: '12px',
                  fontWeight: 900,
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                  margin: 0,
                }}>
                  {col.title}
                </h3>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                <span style={{
                  padding: '1px 6px',
                  borderRadius: '6px',
                  background: '#000000',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                }}>
                  {colTasks.length}
                </span>
              </div>
            </div>

            {/* Lane Action Banner */}
            <div style={{ marginBottom: '8px', flexShrink: 0 }}>
              <button
                onClick={() => onQuickAddInLane(col.id)}
                className="comic-btn comic-btn-white"
                style={{
                  width: '100%',
                  padding: '5px',
                  fontSize: '10px',
                  borderRadius: '8px',
                  borderStyle: 'dashed',
                  justifyContent: 'center',
                  background: 'var(--bg-card-subtle)',
                }}
              >
                <Plus size={13} />
                <span>ADD CARD</span>
              </button>
            </div>

            {/* Task list in lane with smooth internal scroll */}
            <div
              className="custom-scrollbar"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                flex: 1,
                overflowY: 'auto',
                minHeight: 0,
                paddingRight: '3px',
                paddingLeft: '1px',
                paddingTop: '1px',
                paddingBottom: '4px',
              }}
            >
              {colTasks.length === 0 ? (
                <div style={{
                  flex: 1,
                  minHeight: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #000000',
                  borderRadius: '10px',
                  padding: '14px',
                  textAlign: 'center',
                  background: 'var(--bg-card-subtle)',
                }}>
                  <Sparkles size={18} color="#000000" style={{ marginBottom: '4px' }} />
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>LANE CLEARED!</span>
                </div>
              ) : (
                colTasks.map((task) => (
                  <div key={task.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <TaskCard
                      task={task}
                      onToggle={onToggle}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStartFocus={onStartFocus}
                    />

                    {/* Quick Move Arrows Bar */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '2px 4px',
                      borderRadius: '6px',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid #000000',
                    }}>
                      {prevStatus ? (
                        <button
                          onClick={() => onUpdateStatus(task, prevStatus)}
                          title={`Move back to ${prevStatus}`}
                          className="comic-btn comic-btn-white"
                          style={{
                            padding: '2px 6px',
                            fontSize: '9px',
                            borderRadius: '4px',
                            boxShadow: 'none',
                          }}
                        >
                          <ArrowLeft size={11} />
                        </button>
                      ) : <div />}

                      <span style={{ fontSize: '8.5px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                        STAGE: {col.id}
                      </span>

                      {nextStatus ? (
                        <button
                          onClick={() => onUpdateStatus(task, nextStatus)}
                          title={`Advance to ${nextStatus}`}
                          className="comic-btn comic-btn-white"
                          style={{
                            padding: '2px 6px',
                            fontSize: '9px',
                            borderRadius: '4px',
                            boxShadow: 'none',
                          }}
                        >
                          <ArrowRight size={11} />
                        </button>
                      ) : <div />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
