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

const timerPresets: Record<TimerMode, { label: string; minutes: number; color: string; textCol: string }> = {
  work: { label: 'FOCUS MODE', minutes: 25, color: '#ffe600', textCol: '#000000' },
  short_break: { label: 'SHORT BREAK', minutes: 5, color: '#00ff66', textCol: '#000000' },
  long_break: { label: 'LONG BREAK', minutes: 15, color: '#ff007a', textCol: '#ffffff' },
};

export default function PomodoroTimer({
  tasks,
  activeTask,
  onSelectTask,
  onCompleteTask,
}: PomodoroTimerProps) {
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
        const nextCount = sessionsCompleted + 1;
        setSessionsCompleted(nextCount);
        if (nextCount % 4 === 0) {
          switchMode('long_break');
        } else {
          switchMode('short_break');
        }
      } else {
        switchMode('work');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, sessionsCompleted]);

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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // SVG Circular ring calculations
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const incompleteTasks = tasks.filter((t) => !t.completed);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '24px',
      alignItems: 'flex-start',
    }}>
      {/* Timer Display Card */}
      <div style={{
        gridColumn: 'span 2',
        borderRadius: '16px',
        padding: '36px 24px',
        background: 'var(--bg-card)',
        border: '3px solid #000000',
        boxShadow: '8px 8px 0px #000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '6px',
          borderRadius: '12px',
          background: 'var(--bg-card-subtle)',
          border: '2px solid #000000',
          marginBottom: '30px',
        }}>
          {(['work', 'short_break', 'long_break'] as TimerMode[]).map((m) => {
            const isCurrent = mode === m;
            return (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`comic-btn ${isCurrent ? (m === 'work' ? 'comic-btn-yellow' : m === 'short_break' ? 'comic-btn-green' : 'comic-btn-pink') : 'comic-btn-white'}`}
                style={{
                  padding: '8px 16px',
                  fontSize: '12px',
                  boxShadow: isCurrent ? '2px 2px 0px #000' : 'none',
                }}
              >
                {timerPresets[m].label}
              </button>
            );
          })}
        </div>

        {/* Big Circular Animated Clock */}
        <div style={{ position: 'relative', width: '260px', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 240 240">
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke="#000000"
              strokeWidth="14"
              fill="transparent"
            />
            <motion.circle
              cx="120"
              cy="120"
              r={radius}
              stroke={timerPresets[mode].color}
              strokeWidth="10"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: 'linear' }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time text in center */}
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '48px', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'monospace', letterSpacing: '-1px', lineHeight: 1 }}>
              {formatTime(timeLeft)}
            </span>
            <div className="comic-badge comic-badge-rotate-left" style={{ background: timerPresets[mode].color, color: timerPresets[mode].textCol, marginTop: '8px', fontSize: '10px' }}>
              {timerPresets[mode].label}
            </div>
            {activeTask && (
              <span style={{
                marginTop: '8px',
                fontSize: '11px',
                fontWeight: 800,
                color: '#000000',
                maxWidth: '160px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                background: '#ffe600',
                border: '1px solid #000000',
                padding: '2px 8px',
                borderRadius: '6px',
              }}>
                🎯 {activeTask.title}
              </span>
            )}
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '32px' }}>
          <button
            onClick={resetTimer}
            title="Reset Timer"
            className="comic-btn comic-btn-white"
            style={{ padding: '12px', borderRadius: '12px' }}
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={toggleTimer}
            className={`comic-btn ${isRunning ? 'comic-btn-pink' : 'comic-btn-yellow'}`}
            style={{ padding: '14px 38px', fontSize: '16px', borderRadius: '14px' }}
          >
            {isRunning ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
            <span>{isRunning ? 'PAUSE' : 'START FOCUS'}</span>
          </button>

          <button
            onClick={() => switchMode(mode === 'work' ? 'short_break' : 'work')}
            title="Skip Session"
            className="comic-btn comic-btn-white"
            style={{ padding: '12px', borderRadius: '12px' }}
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Sessions Completed Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '24px', fontSize: '12px', fontWeight: 800 }}>
          <Flame size={18} color="#ff007a" fill="#ff007a" />
          <span style={{ textTransform: 'uppercase' }}>COMPLETED SESSIONS:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {Array.from({ length: Math.max(sessionsCompleted, 4) }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  backgroundColor: i < sessionsCompleted ? '#ffe600' : 'var(--bg-card-subtle)',
                  border: '1.5px solid #000000',
                  boxShadow: i < sessionsCompleted ? '1px 1px 0px #000' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Sound toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="comic-btn comic-btn-white"
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            padding: '8px',
            borderRadius: '8px',
            fontSize: '11px',
          }}
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Focus Target Task Drawer */}
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
          gap: '10px',
          paddingBottom: '14px',
          marginBottom: '14px',
          borderBottom: '2px solid #000000',
        }}>
          <Target size={18} />
          <div>
            <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase' }}>FOCUS TARGET MISSION</h3>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)' }}>LOCK ONTO A TARGET FOR THIS ROUND</p>
          </div>
        </div>

        {/* Currently Active Task Banner */}
        {activeTask ? (
          <div style={{
            padding: '14px',
            borderRadius: '12px',
            background: '#ffe600',
            color: '#000000',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px #000000',
            marginBottom: '16px',
          }}>
            <span className="comic-badge" style={{ background: '#ff007a', color: '#fff', fontSize: '9px', marginBottom: '4px' }}>
              ACTIVE TARGET
            </span>
            <h4 style={{ fontSize: '14px', fontWeight: 900, marginTop: '4px', marginBottom: '10px' }}>{activeTask.title}</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                onClick={() => onCompleteTask(activeTask)}
                className="comic-btn comic-btn-green"
                style={{ padding: '5px 10px', fontSize: '11px', borderRadius: '6px' }}
              >
                <CheckCircle2 size={13} />
                <span>MISSION DONE</span>
              </button>
              <button
                onClick={() => onSelectTask(null as any)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#000000',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                CLEAR
              </button>
            </div>
          </div>
        ) : (
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            background: 'var(--bg-card-subtle)',
            border: '2px dashed #000000',
            textAlign: 'center',
            fontSize: '11px',
            fontWeight: 800,
            marginBottom: '16px',
            textTransform: 'uppercase',
          }}>
            SELECT A TARGET BELOW TO LOCK IN
          </div>
        )}

        {/* Task List Selector */}
        <div
          className="custom-scrollbar"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 360px)',
            paddingRight: '2px',
          }}
        >
          {incompleteTasks.map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTask(t)}
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                border: activeTask?.id === t.id ? '2px solid #000000' : '2px solid #000000',
                background: activeTask?.id === t.id ? '#ffe600' : '#ffffff',
                color: '#000000',
                boxShadow: activeTask?.id === t.id ? '3px 3px 0px #000000' : '1px 1px 0px #000000',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '3px',
                    flexShrink: 0,
                    border: '1px solid #000',
                    backgroundColor: t.priority === 4 ? '#ff007a' : t.priority === 3 ? '#ffe600' : t.priority === 2 ? '#00f0ff' : '#00ff66',
                  }}
                />
                <span style={{ fontSize: '12px', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 900, fontFamily: 'monospace', flexShrink: 0, marginLeft: '8px' }}>
                {t.estimated_minutes || 25}M
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
