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

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const incompleteTasks = tasks.filter((t) => !t.completed);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isDesktop ? '1.3fr 1fr' : '1fr',
      gap: isDesktop ? '16px' : '20px',
      alignItems: 'stretch',
      height: isDesktop ? 'calc(100vh - 120px)' : 'auto',
      maxHeight: isDesktop ? 'calc(100vh - 120px)' : 'none',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Timer Display Card */}
      <div style={{
        borderRadius: '16px',
        padding: isDesktop ? '18px 20px' : '24px 16px',
        background: 'var(--bg-card)',
        border: '3px solid #000000',
        boxShadow: '5px 5px 0px #000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        height: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Mode Switcher Tabs */}
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '4px',
          borderRadius: '10px',
          background: 'var(--bg-card-subtle)',
          border: '2px solid #000000',
          marginBottom: '12px',
          flexShrink: 0,
        }}>
          {(['work', 'short_break', 'long_break'] as TimerMode[]).map((m) => {
            const isCurrent = mode === m;
            return (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`comic-btn ${isCurrent ? (m === 'work' ? 'comic-btn-yellow' : m === 'short_break' ? 'comic-btn-green' : 'comic-btn-pink') : 'comic-btn-white'}`}
                style={{
                  padding: '6px 12px',
                  fontSize: isDesktop ? '11px' : '10px',
                  boxShadow: isCurrent ? '2px 2px 0px #000' : 'none',
                }}
              >
                {timerPresets[m].label}
              </button>
            );
          })}
        </div>

        {/* Circular Clock Display */}
        <div style={{ position: 'relative', width: isDesktop ? '210px' : '190px', height: isDesktop ? '210px' : '190px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
            <span style={{ fontSize: isDesktop ? '40px' : '36px', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'monospace', letterSpacing: '-1px', lineHeight: 1 }}>
              {formatTime(timeLeft)}
            </span>
            <div className="comic-badge comic-badge-rotate-left" style={{ background: timerPresets[mode].color, color: timerPresets[mode].textCol, marginTop: '6px', fontSize: '9px' }}>
              {timerPresets[mode].label}
            </div>
            {activeTask && (
              <span style={{
                marginTop: '6px',
                fontSize: '10px',
                fontWeight: 800,
                color: '#000000',
                maxWidth: '140px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                background: '#ffe600',
                border: '1px solid #000000',
                padding: '1px 6px',
                borderRadius: '5px',
              }}>
                🎯 {activeTask.title}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', flexShrink: 0 }}>
          <button
            onClick={toggleTimer}
            className={`comic-btn ${isRunning ? 'comic-btn-pink' : 'comic-btn-yellow'}`}
            style={{
              padding: '10px 24px',
              fontSize: '13px',
              borderRadius: '12px',
              boxShadow: '4px 4px 0px #000000',
            }}
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} fill="#000" />}
            <span>{isRunning ? 'PAUSE' : 'START MISSION'}</span>
          </button>

          <button
            onClick={resetTimer}
            title="Reset Timer"
            className="comic-btn comic-btn-white"
            style={{ padding: '9px 10px', borderRadius: '10px' }}
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={skipTimer}
            title="Skip to Next Cycle"
            className="comic-btn comic-btn-cyan"
            style={{ padding: '9px 10px', borderRadius: '10px' }}
          >
            <SkipForward size={16} />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title="Toggle Sound Effects"
            className="comic-btn comic-btn-white"
            style={{ padding: '9px 10px', borderRadius: '10px' }}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>

        {/* Session counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '12px',
          padding: '4px 12px',
          borderRadius: '8px',
          background: 'var(--bg-card-subtle)',
          border: '1.5px solid #000000',
          fontSize: '10.5px',
          fontWeight: 900,
          flexShrink: 0,
        }}>
          <Flame size={14} color="#ff007a" fill="#ff007a" />
          <span>CYCLES COMPLETED:</span>
          <span style={{ color: '#00ff66', fontFamily: 'monospace', fontSize: '12px' }}>{sessionsCompleted}</span>
        </div>
      </div>

      {/* Target Mission Focus Selector Card */}
      <div style={{
        borderRadius: '16px',
        padding: isDesktop ? '16px 18px' : '16px',
        background: 'var(--bg-card)',
        border: '3px solid #000000',
        boxShadow: '5px 5px 0px #000000',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: isDesktop ? 'calc(100vh - 120px)' : 'none',
        boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '8px',
          marginBottom: '10px',
          borderBottom: '2px solid #000000',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={17} color="#ff007a" />
            <h3 style={{ fontSize: '13px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              SELECT FOCUS MISSION
            </h3>
          </div>
          <span className="comic-badge" style={{ background: '#00ff66', color: '#000000', fontSize: '9px' }}>
            {incompleteTasks.length} READY
          </span>
        </div>

        {/* Task selection list */}
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
          {incompleteTasks.length === 0 ? (
            <div style={{
              flex: 1,
              minHeight: '120px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #000000',
              borderRadius: '10px',
              padding: '16px',
              textAlign: 'center',
              background: 'var(--bg-card-subtle)',
              color: 'var(--text-primary)',
            }}>
              <CheckCircle2 size={24} color="#00ff66" style={{ marginBottom: '6px' }} />
              <p style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>ALL MISSIONS CLEARED!</p>
            </div>
          ) : (
            incompleteTasks.map((t) => {
              const isSelected = activeTask?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => onSelectTask(t)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: isSelected ? '2.5px solid #000000' : '2px solid #000000',
                    background: isSelected ? '#ffe600' : 'var(--bg-card-subtle)',
                    color: isSelected ? '#000000' : 'var(--text-primary)',
                    boxShadow: isSelected ? '3px 3px 0px #000000' : '1px 1px 0px #000000',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 900, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {t.title}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
                      <span className="comic-badge" style={{ fontSize: '8px', padding: '1px 4px', background: '#00f0ff', color: '#000000' }}>
                        {t.category}
                      </span>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: isSelected ? '#000000' : 'var(--text-secondary)' }}>
                        {t.estimated_minutes || 25} MINS
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
                    style={{ padding: '4px 8px', fontSize: '9.5px', borderRadius: '6px', flexShrink: 0 }}
                  >
                    {isSelected && isRunning ? <Pause size={11} /> : <Play size={11} />}
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
