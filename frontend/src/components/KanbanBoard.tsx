// src/components/KanbanBoard.tsx
import React from 'react';
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
      gap: '20px',
      alignItems: 'flex-start',
      paddingBottom: '24px',
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
              padding: '16px 14px',
              background: 'var(--bg-card)',
              border: '3px solid #000000',
              boxShadow: '6px 6px 0px #000000',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '560px',
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              marginBottom: '14px',
              borderRadius: '10px',
              background: col.color,
              color: col.textCol,
              border: '2px solid #000000',
              boxShadow: '3px 3px 0px #000000',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={16} />
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: 900,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}>
                  {col.title}
                </h3>
                <span style={{
                  padding: '2px 7px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  background: '#000000',
                  color: '#ffffff',
                }}>
                  {colTasks.length}
                </span>
              </div>

              <button
                onClick={() => onQuickAddInLane(col.id)}
                title={`Add task to ${col.title}`}
                className="comic-btn comic-btn-white"
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  boxShadow: '1px 1px 0px #000',
                }}
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Task list in lane */}
            <div
              className="custom-scrollbar"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                flex: 1,
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 240px)',
                paddingRight: '4px',
                paddingLeft: '2px',
                paddingTop: '2px',
                paddingBottom: '6px',
              }}
            >
              {colTasks.length === 0 ? (
                <div style={{
                  minHeight: '160px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #000000',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  background: 'var(--bg-card-subtle)',
                }}>
                  <Sparkles size={22} color="#000000" style={{ marginBottom: '6px' }} />
                  <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>LANE CLEARED!</span>
                  <button
                    onClick={() => onQuickAddInLane(col.id)}
                    className="comic-btn comic-btn-yellow"
                    style={{
                      marginTop: '10px',
                      fontSize: '11px',
                      padding: '4px 10px',
                    }}
                  >
                    + ADD TASK
                  </button>
                </div>
              ) : (
                colTasks.map((task) => (
                  <div key={task.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
                      padding: '4px 8px',
                      background: 'var(--bg-card-subtle)',
                      borderRadius: '8px',
                      fontSize: '11px',
                      border: '2px solid #000000',
                    }}>
                      {prevStatus ? (
                        <button
                          onClick={() => onUpdateStatus(task, prevStatus)}
                          className="comic-btn comic-btn-white"
                          style={{
                            padding: '3px 8px',
                            fontSize: '10px',
                            borderRadius: '6px',
                            boxShadow: '1px 1px 0px #000',
                          }}
                          title={`Move to ${prevStatus.replace('_', ' ')}`}
                        >
                          <ArrowLeft size={11} />
                          <span style={{ textTransform: 'uppercase' }}>{prevStatus.replace('_', ' ')}</span>
                        </button>
                      ) : <span />}

                      {nextStatus && (
                        <button
                          onClick={() => onUpdateStatus(task, nextStatus)}
                          className="comic-btn comic-btn-yellow"
                          style={{
                            padding: '3px 8px',
                            fontSize: '10px',
                            borderRadius: '6px',
                            boxShadow: '1px 1px 0px #000',
                          }}
                          title={`Move to ${nextStatus.replace('_', ' ')}`}
                        >
                          <span style={{ textTransform: 'uppercase' }}>{nextStatus.replace('_', ' ')}</span>
                          <ArrowRight size={11} />
                        </button>
                      )}
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
