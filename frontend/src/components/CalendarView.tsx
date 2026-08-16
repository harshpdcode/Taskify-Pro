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

  // Current month active days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: true,
      dateStr: new Date(year, month, i).toISOString().slice(0, 10),
    });
  }

  // Next month trailing days to complete 6-week matrix (42 cells)
  const remainingCells = 42 - calendarCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: false,
      dateStr: new Date(year, month + 1, i).toISOString().slice(0, 10),
    });
  }

  const monthLabel = currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }).toUpperCase();
  const todayStr = new Date().toISOString().slice(0, 10);
  const selectedDateTasks = tasksByDate[selectedDate] || [];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isWide ? 'minmax(0, 1fr) 350px' : '1fr',
      gap: isWide ? '16px' : '12px',
      alignItems: 'stretch',
      width: '100%',
      height: isWide ? 'calc(100vh - 100px)' : 'auto',
      maxHeight: isWide ? 'calc(100vh - 100px)' : 'none',
      boxSizing: 'border-box',
    }}>
      {/* Main Calendar Grid Card */}
      <div style={{
        minWidth: 0,
        borderRadius: '16px',
        padding: isWide ? '14px 16px' : '12px',
        background: 'var(--bg-card)',
        border: '3px solid #000000',
        boxShadow: '5px 5px 0px #000000',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Navigation header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '8px',
          marginBottom: '8px',
          borderBottom: '2px solid #000000',
          flexWrap: 'wrap',
          gap: '8px',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#ffe600',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #000000',
              boxShadow: '2px 2px 0px #000000',
            }}>
              <CalendarIcon size={17} />
            </div>
            <div>
              <h2 style={{ fontSize: isWide ? '16px' : '14px', fontWeight: 900, letterSpacing: '-0.3px', textTransform: 'uppercase', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                {monthLabel}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '9.5px', fontWeight: 700 }}>
                SELECT ANY DAY TO DISPATCH OR VIEW TASKS
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={setToday}
              className="comic-btn comic-btn-yellow"
              style={{ padding: '4px 10px', fontSize: '10px', borderRadius: '6px' }}
            >
              TODAY
            </button>
            <button
              onClick={prevMonth}
              aria-label="Previous Month"
              className="comic-btn comic-btn-white"
              style={{ padding: '4px 6px', borderRadius: '6px' }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextMonth}
              aria-label="Next Month"
              className="comic-btn comic-btn-white"
              style={{ padding: '4px 6px', borderRadius: '6px' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Day Name Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gap: '4px',
          marginBottom: '4px',
          textAlign: 'center',
          fontSize: '10px',
          fontWeight: 900,
          letterSpacing: '0.6px',
          flexShrink: 0,
        }}>
          {dayNames.map((name) => (
            <div
              key={name}
              style={{
                padding: '4px 0',
                background: 'var(--bg-card-subtle)',
                color: 'var(--text-primary)',
                border: '1.5px solid #000000',
                borderRadius: '5px',
              }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* Calendar Grid Matrix (Adaptive single-screen rows on desktop) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          gridTemplateRows: isWide ? 'repeat(6, minmax(0, 1fr))' : 'repeat(6, auto)',
          gap: '4px',
          flex: 1,
          minHeight: 0,
        }}>
          {calendarCells.map((cell, idx) => {
            const dayTasks = tasksByDate[cell.dateStr] || [];
            const isSelected = selectedDate === cell.dateStr;
            const isToday = todayStr === cell.dateStr;

            return (
              <motion.div
                key={idx}
                whileHover={{ y: -1 }}
                onClick={() => setSelectedDate(cell.dateStr)}
                style={{
                  minWidth: 0,
                  minHeight: isWide ? 0 : '70px',
                  height: '100%',
                  padding: '3px 5px',
                  borderRadius: '8px',
                  border: isSelected
                    ? '2.5px solid #000000'
                    : isToday
                    ? '2px solid #ff007a'
                    : '1.5px solid #000000',
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
                  boxShadow: isSelected ? '2px 2px 0px #000000' : 'none',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
              >
                {/* Day number & indicators */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', lineHeight: 1 }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      padding: '0 4px',
                      borderRadius: '3px',
                      background: isToday ? '#ff007a' : isSelected ? '#000000' : 'transparent',
                      color: isToday ? '#ffffff' : isSelected ? '#ffe600' : 'var(--text-primary)',
                    }}
                  >
                    {cell.day}
                  </span>

                  {dayTasks.length > 0 && (
                    <span style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '2px',
                      backgroundColor: '#ff007a',
                      border: '1px solid #000000',
                      flexShrink: 0,
                    }} />
                  )}
                </div>

                {/* Task chips preview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px', overflow: 'hidden' }}>
                  {dayTasks.slice(0, isWide ? 1 : 2).map((t) => (
                    <div
                      key={t.id}
                      style={{
                        fontSize: '8.5px',
                        fontWeight: 800,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        padding: '0 3px',
                        borderRadius: '3px',
                        background: t.completed ? '#00ff66' : '#00f0ff',
                        color: '#000000',
                        border: '1px solid #000000',
                        textDecoration: t.completed ? 'line-through' : 'none',
                        maxWidth: '100%',
                        lineHeight: 1.2,
                      }}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > (isWide ? 1 : 2) && (
                    <div style={{ fontSize: '7.5px', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'monospace', lineHeight: 1 }}>
                      +{dayTasks.length - (isWide ? 1 : 2)} MORE
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Task Inspector Sidebar Card */}
      <div style={{
        borderRadius: '16px',
        padding: isWide ? '14px 16px' : '12px',
        background: 'var(--bg-card)',
        border: '3px solid #000000',
        boxShadow: '5px 5px 0px #000000',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: isWide ? 'calc(100vh - 100px)' : 'none',
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '10px',
          marginBottom: '10px',
          borderBottom: '2px solid #000000',
          flexShrink: 0,
        }}>
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              }).toUpperCase()}
            </h3>
            <span className="comic-badge" style={{ background: '#00f0ff', color: '#000000', marginTop: '2px', fontSize: '9px' }}>
              {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'MISSION' : 'MISSIONS'}
            </span>
          </div>

          <button
            onClick={() => onQuickAddForDate(selectedDate)}
            className="comic-btn comic-btn-pink"
            style={{ padding: '5px 10px', fontSize: '10.5px', borderRadius: '6px' }}
          >
            <Plus size={13} />
            <span>ADD</span>
          </button>
        </div>

        {/* Task cards list for selected day with dedicated internal scroll */}
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
          }}
        >
          {selectedDateTasks.length === 0 ? (
            <div style={{
              flex: 1,
              minHeight: '140px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '16px',
              border: '2px dashed #000000',
              borderRadius: '10px',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-primary)',
            }}>
              <Sparkles size={20} style={{ marginBottom: '6px' }} />
              <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>NO SCHEDULED TASKS</p>
              <button
                onClick={() => onQuickAddForDate(selectedDate)}
                className="comic-btn comic-btn-yellow"
                style={{ marginTop: '8px', fontSize: '10px', padding: '4px 8px' }}
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
