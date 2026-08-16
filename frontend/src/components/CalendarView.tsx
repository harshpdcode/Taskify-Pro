// src/components/CalendarView.tsx
import { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Sparkles
} from 'lucide-react';
import type { Task } from '../types/task';
import TaskCard from './TaskCard';
import { motion } from 'framer-motion';

interface CalendarViewProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStartFocus: (task: Task) => void;
  onQuickAddForDate: (dateStr: string) => void;
}

const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export default function CalendarView({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onStartFocus,
  onQuickAddForDate,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const isWide = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;

  // Organize tasks by date (YYYY-MM-DD)
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      if (t.due_date) {
        const d = t.due_date.slice(0, 10);
        if (!map[d]) map[d] = [];
        map[d].push(t);
      }
    });
    return map;
  }, [tasks]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const setToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.toISOString().slice(0, 10));
  };

  // Calendar matrix calculations
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarCells = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    calendarCells.push({
      day,
      isCurrentMonth: false,
      dateStr: new Date(year, month - 1, day).toISOString().slice(0, 10),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().slice(0, 10);
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      dateStr,
    });
  }

  // Next month leading days
  const remainingCells = 35 - calendarCells.length;
  for (let d = 1; d <= (remainingCells > 0 ? remainingCells : 42 - calendarCells.length); d++) {
    const dateStr = new Date(year, month + 1, d).toISOString().slice(0, 10);
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      dateStr,
    });
  }

  const monthLabel = currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }).toUpperCase();
  const todayStr = new Date().toISOString().slice(0, 10);
  const selectedDateTasks = tasksByDate[selectedDate] || [];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isWide ? 'minmax(0, 1fr) 360px' : '1fr',
      gap: '24px',
      alignItems: 'flex-start',
      width: '100%',
    }}>
      {/* Main Calendar Grid */}
      <div style={{
        minWidth: 0,
        borderRadius: '16px',
        padding: '20px',
        background: 'var(--bg-card)',
        border: '3px solid #000000',
        boxShadow: '6px 6px 0px #000000',
      }}>
        {/* Navigation header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '14px',
          marginBottom: '16px',
          borderBottom: '2px solid #000000',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#ffe600',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
            }}>
              <CalendarIcon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.3px', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                {monthLabel}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: 700 }}>
                SELECT ANY DAY TO DISPATCH OR VIEW TASKS
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={setToday}
              className="comic-btn comic-btn-yellow"
              style={{ padding: '6px 14px', fontSize: '11px', borderRadius: '8px' }}
            >
              TODAY
            </button>
            <button
              onClick={prevMonth}
              aria-label="Previous Month"
              className="comic-btn comic-btn-white"
              style={{ padding: '6px 8px', borderRadius: '8px' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextMonth}
              aria-label="Next Month"
              className="comic-btn comic-btn-white"
              style={{ padding: '6px 8px', borderRadius: '8px' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Day Name Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: '6px',
          marginBottom: '8px',
          textAlign: 'center',
          fontSize: '11px',
          fontWeight: 900,
          letterSpacing: '0.8px',
        }}>
          {dayNames.map((name) => (
            <div
              key={name}
              style={{
                padding: '6px 0',
                background: 'var(--bg-card-subtle)',
                color: 'var(--text-primary)',
                border: '1.5px solid #000000',
                borderRadius: '6px',
              }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: '6px',
        }}>
          {calendarCells.map((cell, idx) => {
            const dayTasks = tasksByDate[cell.dateStr] || [];
            const isSelected = selectedDate === cell.dateStr;
            const isToday = todayStr === cell.dateStr;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedDate(cell.dateStr)}
                style={{
                  minWidth: 0,
                  minHeight: '82px',
                  padding: '6px 8px',
                  borderRadius: '10px',
                  border: isSelected
                    ? '3px solid #000000'
                    : isToday
                    ? '2px solid #ff007a'
                    : '2px solid #000000',
                  background: isSelected
                    ? '#ffe600'
                    : isToday
                    ? 'rgba(255, 0, 122, 0.18)'
                    : cell.isCurrentMonth
                    ? 'var(--bg-card)'
                    : 'var(--bg-card-subtle)',
                  color: isSelected ? '#000000' : 'var(--text-primary)',
                  opacity: cell.isCurrentMonth ? 1 : 0.6,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '3px 3px 0px #000000' : '1px 1px 0px #000000',
                  overflow: 'hidden',
                }}
              >
                {/* Day number & indicators */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: isToday ? '#ff007a' : isSelected ? '#000000' : 'transparent',
                      color: isToday ? '#ffffff' : isSelected ? '#ffe600' : 'var(--text-primary)',
                    }}
                  >
                    {cell.day}
                  </span>

                  {dayTasks.length > 0 && (
                    <span style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '2px',
                      backgroundColor: '#ff007a',
                      border: '1px solid #000000',
                      flexShrink: 0,
                    }} />
                  )}
                </div>

                {/* Task chips list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', overflow: 'hidden' }}>
                  {dayTasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        padding: '1px 4px',
                        borderRadius: '3px',
                        background: t.completed ? '#00ff66' : '#00f0ff',
                        color: '#000000',
                        border: '1px solid #000000',
                        textDecoration: t.completed ? 'line-through' : 'none',
                        maxWidth: '100%',
                      }}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div style={{ fontSize: '8px', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'monospace', paddingLeft: '2px' }}>
                      +{dayTasks.length - 2} MORE
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Task Inspector Sidebar */}
      <div style={{
        borderRadius: '16px',
        padding: '20px',
        background: 'var(--bg-card)',
        border: '3px solid #000000',
        boxShadow: '6px 6px 0px #000000',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '520px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '14px',
          marginBottom: '14px',
          borderBottom: '2px solid #000000',
        }}>
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              }).toUpperCase()}
            </h3>
            <span className="comic-badge" style={{ background: '#00f0ff', color: '#000000', marginTop: '4px' }}>
              {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'TASK SCHEDULED' : 'TASKS SCHEDULED'}
            </span>
          </div>

          <button
            onClick={() => onQuickAddForDate(selectedDate)}
            className="comic-btn comic-btn-pink"
            style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '8px' }}
          >
            <Plus size={14} />
            <span>ADD</span>
          </button>
        </div>

        {/* Task cards list for selected day */}
        <div
          className="custom-scrollbar"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            flex: 1,
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 300px)',
            paddingRight: '4px',
          }}
        >
          {selectedDateTasks.length === 0 ? (
            <div style={{
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '20px',
              border: '2px dashed #000000',
              borderRadius: '12px',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-primary)',
            }}>
              <Sparkles size={24} style={{ marginBottom: '6px' }} />
              <p style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>NO SCHEDULED TASKS</p>
              <button
                onClick={() => onQuickAddForDate(selectedDate)}
                className="comic-btn comic-btn-yellow"
                style={{ marginTop: '10px', fontSize: '11px', padding: '4px 10px' }}
              >
                + SCHEDULE MISSION
              </button>
            </div>
          ) : (
            selectedDateTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onStartFocus={onStartFocus}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
