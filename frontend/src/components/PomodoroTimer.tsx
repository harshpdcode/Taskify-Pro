// src/components/PomodoroTimer.tsx
import { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Flame, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Target
} from 'lucide-react';
import type { Task } from '../types/task';
import { motion } from 'framer-motion';
import { triggerMilestoneConfetti } from '../utils/confetti';

interface PomodoroTimerProps {
  tasks: Task[];
  activeTask?: Task | null;
  onSelectTask: (task: Task) => void;
  onCompleteTask: (task: Task) => void;
}

type TimerMode = 'work' | 'short_break' | 'long_break';

const timerPresets: Record<TimerMode, { label: string; shortLabel: string; minutes: number; color: string; textCol: string }> = {
  work: { label: 'FOCUS MODE', shortLabel: 'FOCUS 25M', minutes: 25, color: '#ffe600', textCol: '#000000' },
  short_break: { label: 'SHORT BREAK', shortLabel: 'BREAK 5M', minutes: 5, color: '#00ff66', textCol: '#000000' },
  long_break: { label: 'LONG BREAK', shortLabel: 'REST 15M', minutes: 15, color: '#ff007a', textCol: '#ffffff' },
};

export default function PomodoroTimer({
  tasks,
  activeTask,
  onSelectTask,
  onCompleteTask,
}: PomodoroTimerProps) {
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);

  const totalTime = timerPresets[mode].minutes * 60;
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  // Web Audio Synth chime
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      // Audio context error handling
    }
  };

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();
      triggerMilestoneConfetti();

      if (mode === 'work') {
        setSessionsCompleted((prev) => prev + 1);
        if (activeTask) {
          onCompleteTask(activeTask);
        }
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, activeTask]);

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(timerPresets[newMode].minutes * 60);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(timerPresets[mode].minutes * 60);
  };

  const skipTimer = () => {
    setIsRunning(false);
    if (mode === 'work') {
      switchMode('short_break');
    } else {
      switchMode('work');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const radius = isDesktop ? 90 : 72;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const incompleteTasks = tasks.filter((t) => !t.completed);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isDesktop ? '1.3fr minmax(0, 1fr)' : 'minmax(0, 1fr)',
      gap: isDesktop ? '16px' : '14px',
      alignItems: 'stretch',
      height: isDesktop ? 'calc(100vh - 120px)' : 'auto',
      maxHeight: isDesktop ? 'calc(100vh - 120px)' : 'none',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      paddingBottom: isDesktop ? 0 : '24px',
    }}>
      {/* Timer Display Card */}
      <div style={{
        borderRadius: '16px',
        padding: isDesktop ? '16px 20px' : '12px 10px',
        background: 'var(--bg-card)',
        border: '3px solid #000000',
        boxShadow: '4px 4px 0px #000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        {/* Mode Switcher Segmented Control */}
        <div style={{
          display: 'flex',
          width: '100%',
          maxWidth: '380px',
          gap: '4px',
          padding: '3px',
          borderRadius: '10px',
          background: 'var(--bg-card-subtle)',
          border: '2px solid #000000',
          marginBottom: '8px',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}>
          {(['work', 'short_break', 'long_break'] as TimerMode[]).map((m) => {
            const isCurrent = mode === m;
            return (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`comic-btn ${isCurrent ? (m === 'work' ? 'comic-btn-yellow' : m === 'short_break' ? 'comic-btn-green' : 'comic-btn-pink') : 'comic-btn-white'}`}
                style={{
                  flex: 1,
                  padding: '5px 4px',
                  fontSize: isDesktop ? '11px' : '9.5px',
                  borderRadius: '7px',
                  justifyContent: 'center',
                  boxShadow: isCurrent ? '2px 2px 0px #000' : 'none',
                  whiteSpace: 'nowrap',
                  minWidth: 0,
                }}
              >
                {isDesktop ? timerPresets[m].label : timerPresets[m].shortLabel}
              </button>
            );
          })}
        </div>

        {/* Circular Clock Display */}
        <div style={{
          position: 'relative',
          width: isDesktop ? '195px' : '155px',
          height: isDesktop ? '195px' : '155px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          margin: '2px 0',
        }}>
          <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 220 220">
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="#000000"
              strokeWidth="13"
              fill="transparent"
            />
            <motion.circle
              cx="110"
              cy="110"
              r={radius}
              stroke={timerPresets[mode].color}
              strokeWidth="9"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'linear' }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time text in center */}
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: isDesktop ? '38px' : '30px', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'monospace', letterSpacing: '-1px', lineHeight: 1 }}>
              {formatTime(timeLeft)}
            </span>
            <div className="comic-badge comic-badge-rotate-left" style={{ background: timerPresets[mode].color, color: timerPresets[mode].textCol, marginTop: '3px', fontSize: '8px', padding: '1px 5px' }}>
              {timerPresets[mode].label}
            </div>
            {activeTask && (
              <span style={{
                marginTop: '3px',
                fontSize: '9px',
                fontWeight: 800,
                color: '#000000',
                maxWidth: '120px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                background: '#ffe600',
                border: '1px solid #000000',
                padding: '1px 4px',
                borderRadius: '4px',
              }}>
                🎯 {activeTask.title}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', flexShrink: 0, width: '100%', justifyContent: 'center' }}>
          <button
            onClick={toggleTimer}
            className={`comic-btn ${isRunning ? 'comic-btn-pink' : 'comic-btn-yellow'}`}
            style={{
              padding: isDesktop ? '8px 20px' : '7px 14px',
              fontSize: isDesktop ? '12px' : '10.5px',
              borderRadius: '9px',
              boxShadow: '3px 3px 0px #000000',
              flexShrink: 0,
            }}
          >
            {isRunning ? <Pause size={15} /> : <Play size={15} fill="#000" />}
            <span>{isRunning ? 'PAUSE' : 'START MISSION'}</span>
          </button>

          <button
            onClick={resetTimer}
            title="Reset Timer"
            className="comic-btn comic-btn-white"
            style={{ padding: '6px 8px', borderRadius: '8px', flexShrink: 0 }}
          >
            <RotateCcw size={14} />
          </button>

          <button
            onClick={skipTimer}
            title="Skip to Next Cycle"
            className="comic-btn comic-btn-cyan"
            style={{ padding: '6px 8px', borderRadius: '8px', flexShrink: 0 }}
          >
            <SkipForward size={14} />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Toggle Sound Effects"
            className="comic-btn comic-btn-white"
            style={{ padding: '6px 8px', borderRadius: '8px', flexShrink: 0 }}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>

        {/* Session counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          marginTop: '6px',
          padding: '2px 8px',
          borderRadius: '7px',
          background: 'var(--bg-card-subtle)',
          border: '1.5px solid #000000',
          fontSize: '9.5px',
          fontWeight: 900,
          flexShrink: 0,
        }}>
          <Flame size={12} color="#ff007a" fill="#ff007a" />
          <span>CYCLES COMPLETED:</span>
          <span style={{ color: '#00ff66', fontFamily: 'monospace', fontSize: '10.5px' }}>{sessionsCompleted}</span>
        </div>
      </div>

      {/* Target Mission Focus Selector Card */}
      <div style={{
        borderRadius: '16px',
        padding: isDesktop ? '14px 16px' : '12px 10px',
        background: 'var(--bg-card)',
        border: '3px solid #000000',
        boxShadow: '4px 4px 0px #000000',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: isDesktop ? 'calc(100vh - 120px)' : 'none',
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '6px',
          marginBottom: '6px',
          borderBottom: '2px solid #000000',
          flexShrink: 0,
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', minWidth: 0 }}>
            <Target size={15} color="#ff007a" style={{ flexShrink: 0 }} />
            <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              SELECT FOCUS MISSION
            </h3>
          </div>
          <span className="comic-badge" style={{ background: '#00ff66', color: '#000000', fontSize: '8px', padding: '1px 5px', flexShrink: 0 }}>
            {incompleteTasks.length} READY
          </span>
        </div>

        {/* Task selection list with full width containment */}
        <div
          className="custom-scrollbar"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            flex: 1,
            overflowY: 'auto',
            minHeight: 0,
            width: '100%',
            boxSizing: 'border-box',
            paddingRight: '1px',
          }}
        >
          {incompleteTasks.length === 0 ? (
            <div style={{
              flex: 1,
              minHeight: '90px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '10px',
              border: '2px dashed #000000',
              borderRadius: '10px',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-primary)',
            }}>
              <CheckCircle2 size={18} color="#00ff66" style={{ marginBottom: '3px' }} />
              <p style={{ fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase' }}>ALL MISSIONS CLEARED!</p>
            </div>
          ) : (
            incompleteTasks.map((t) => {
              const isSelected = activeTask?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  style={{
                    padding: '5px 7px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #000000' : '1.5px solid #000000',
                    background: isSelected ? '#ffe600' : 'var(--bg-card-subtle)',
                    color: isSelected ? '#000000' : 'var(--text-primary)',
                    boxShadow: isSelected ? '2px 2px 0px #000000' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '5px',
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '10.5px', fontWeight: 900, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.title}
                    </div>
                    <div style={{ display: 'flex', gap: '3px', marginTop: '2px', alignItems: 'center' }}>
                      <span className="comic-badge" style={{ fontSize: '7px', padding: '0 3px', background: '#00f0ff', color: '#000000', flexShrink: 0 }}>
                        {t.category}
                      </span>
                      <span style={{ fontSize: '8px', fontWeight: 700, color: isSelected ? '#000000' : 'var(--text-secondary)', flexShrink: 0 }}>
                        {t.estimated_minutes || 25}M
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTask(t);
                      toggleTimer();
                    }}
                    className={`comic-btn ${isSelected ? 'comic-btn-pink' : 'comic-btn-white'}`}
                    style={{ padding: '3px 6px', fontSize: '8.5px', borderRadius: '5px', flexShrink: 0, whiteSpace: 'nowrap' }}
                  >
                    {isSelected && isRunning ? <Pause size={9} /> : <Play size={9} />}
                    <span>{isSelected && isRunning ? 'FOCUSING' : 'FOCUS'}</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
