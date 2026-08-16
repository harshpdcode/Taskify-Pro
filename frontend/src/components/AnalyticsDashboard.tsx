// src/components/AnalyticsDashboard.tsx
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ListTodo, 
  Zap, 
  Flame, 
  PieChart,
  Target
} from 'lucide-react';
import type { Task, TaskStats } from '../types/task';
import { motion } from 'framer-motion';

interface AnalyticsDashboardProps {
  tasks: Task[];
  stats?: TaskStats | null;
}

export default function AnalyticsDashboard({ tasks }: AnalyticsDashboardProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed || t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress' && !t.completed).length;

  const now = new Date();
  const overdue = tasks.filter((t) => t.due_date && !t.completed && new Date(t.due_date) < now).length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Priority breakdown
  const priorityBreakdown = {
    urgent: tasks.filter((t) => t.priority === 4).length,
    high: tasks.filter((t) => t.priority === 3).length,
    medium: tasks.filter((t) => t.priority === 2 || !t.priority).length,
    low: tasks.filter((t) => t.priority === 1).length,
  };

  // Category breakdown
  const categoriesCount: Record<string, number> = {};
  tasks.forEach((t) => {
    const cat = t.category || 'general';
    categoriesCount[cat] = (categoriesCount[cat] || 0) + 1;
  });

  // Estimated focus hours completed
  const totalEstimatedMinutes = tasks.reduce((acc, t) => acc + (t.estimated_minutes || 25), 0);
  const completedEstimatedMinutes = tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + (t.estimated_minutes || 25), 0);

  const focusHoursCompleted = (completedEstimatedMinutes / 60).toFixed(1);
  const totalFocusHours = (totalEstimatedMinutes / 60).toFixed(1);

  // SVG Circular progress radius
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  let productivityTitle = 'LEVEL 1: ROOKIE';
  let productivityColor = '#ffe600';
  if (completionRate >= 80) {
    productivityTitle = 'LEVEL MAX: SUPERHERO! 🚀';
    productivityColor = '#00ff66';
  } else if (completionRate >= 50) {
    productivityTitle = 'LEVEL 3: POWERHOUSE! 🔥';
    productivityColor = '#00f0ff';
  } else if (completionRate > 0) {
    productivityTitle = 'LEVEL 2: ON A ROLL ⚡';
    productivityColor = '#ffe600';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner: Productivity Score & Progress Ring */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          borderRadius: '16px',
          padding: '28px',
          background: 'var(--bg-card)',
          border: '3px solid #000000',
          boxShadow: '6px 6px 0px #000000',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          position: 'relative',
        }}
      >
        <div style={{ zIndex: 1, maxWidth: '500px' }}>
          <div className="comic-badge comic-badge-rotate-left" style={{ background: '#ffe600', color: '#000000', marginBottom: '10px' }}>
            <Zap size={13} fill="#000" />
            <span>⚡ POWER STATS</span>
          </div>
          <h2 style={{
            fontSize: '26px',
            fontWeight: 900,
            letterSpacing: '-0.3px',
            textTransform: 'uppercase',
            marginBottom: '8px',
            color: 'var(--text-primary)',
          }}>
            {productivityTitle}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700, lineHeight: 1.5 }}>
            You have executed <strong style={{ color: '#ff007a' }}>{completed}</strong> out of <strong style={{ color: '#0066ff' }}>{total}</strong> tasks. You unlocked approximately <strong style={{ color: '#000', background: '#ffe600', padding: '1px 4px', border: '1px solid #000' }}>{focusHoursCompleted}H</strong> of pure focus!
          </p>
        </div>

        {/* Animated Circular Progress Gauge */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, flexShrink: 0 }}>
          <svg style={{ width: '130px', height: '130px', transform: 'rotate(-90deg)' }} viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="#000000"
              strokeWidth="12"
              fill="transparent"
            />
            <motion.circle
              cx="70"
              cy="70"
              r={radius}
              stroke={productivityColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'monospace', lineHeight: 1 }}>{completionRate}%</span>
            <span style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.8px', color: 'var(--text-secondary)', marginTop: '2px' }}>CLEARED</span>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
      }}>
        {/* Total Tasks */}
        <motion.div
          whileHover={{ y: -3 }}
          style={{
            borderRadius: '14px',
            padding: '18px',
            background: '#ffffff',
            color: '#000000',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px #000000',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>TOTAL MISSIONS</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#ffe600', border: '1px solid #000' }}>
              <ListTodo size={16} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace' }}>{total}</div>
          <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px', display: 'block', opacity: 0.8 }}>IN WORKSPACE</span>
        </motion.div>

        {/* Completed Tasks */}
        <motion.div
          whileHover={{ y: -3 }}
          style={{
            borderRadius: '14px',
            padding: '18px',
            background: '#00ff66',
            color: '#000000',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px #000000',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>COMPLETED</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#ffffff', border: '1px solid #000' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace' }}>{completed}</div>
          <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px', display: 'block', opacity: 0.85 }}>{completionRate}% CLEARANCE RATE</span>
        </motion.div>

        {/* In Progress */}
        <motion.div
          whileHover={{ y: -3 }}
          style={{
            borderRadius: '14px',
            padding: '18px',
            background: '#00f0ff',
            color: '#000000',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px #000000',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>IN PROGRESS</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#ffffff', border: '1px solid #000' }}>
              <Clock size={16} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace' }}>{inProgress}</div>
          <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px', display: 'block', opacity: 0.85 }}>ACTIVE COMBAT</span>
        </motion.div>

        {/* Overdue */}
        <motion.div
          whileHover={{ y: -3 }}
          style={{
            borderRadius: '14px',
            padding: '18px',
            background: '#ff007a',
            color: '#ffffff',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0px #000000',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px' }}>OVERDUE</span>
            <div style={{ padding: '6px', borderRadius: '8px', background: '#ffffff', color: '#000', border: '1px solid #000' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'monospace' }}>{overdue}</div>
          <span style={{ fontSize: '11px', fontWeight: 700, marginTop: '4px', display: 'block', opacity: 0.9 }}>HIGH ALERT</span>
        </motion.div>
      </div>

      {/* Breakdown Section: Priorities & Categories */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
      }}>
        {/* Priority Distribution */}
        <div style={{
          borderRadius: '16px',
          padding: '20px',
          background: 'var(--bg-card)',
          border: '3px solid #000000',
          boxShadow: '6px 6px 0px #000000',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '14px',
            marginBottom: '14px',
            borderBottom: '2px solid #000000',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={16} />
              <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase' }}>PRIORITY THREAT LEVELS</h3>
            </div>
            <span className="comic-badge" style={{ background: '#ffe600', color: '#000' }}>{total} TOTAL</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'URGENT', count: priorityBreakdown.urgent, color: '#ff007a' },
              { label: 'HIGH', count: priorityBreakdown.high, color: '#ffe600' },
              { label: 'MEDIUM', count: priorityBreakdown.medium, color: '#00f0ff' },
              { label: 'LOW', count: priorityBreakdown.low, color: '#00ff66' },
            ].map((p) => {
              const pct = total > 0 ? Math.round((p.count / total) * 100) : 0;
              return (
                <div key={p.label}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: 900, marginBottom: '4px' }}>
                    <span style={{ color: p.color, textShadow: '1px 1px 0px #000' }}>{p.label}</span>
                    <span style={{ fontFamily: 'monospace' }}>
                      {p.count} TASKS ({pct}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '12px', borderRadius: '6px', background: '#000000', border: '2px solid #000000', overflow: 'hidden', padding: '1px' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6 }}
                      style={{ height: '100%', borderRadius: '4px', backgroundColor: p.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Distribution */}
        <div style={{
          borderRadius: '16px',
          padding: '20px',
          background: 'var(--bg-card)',
          border: '3px solid #000000',
          boxShadow: '6px 6px 0px #000000',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '14px',
              marginBottom: '14px',
              borderBottom: '2px solid #000000',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PieChart size={16} />
                <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase' }}>CATEGORY MISSIONS</h3>
              </div>
              <span className="comic-badge" style={{ background: '#00f0ff', color: '#000' }}>{Object.keys(categoriesCount).length} TAGS</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {Object.entries(categoriesCount).map(([cat, count]) => (
                <div
                  key={cat}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    color: '#000000',
                    border: '2px solid #000000',
                    boxShadow: '2px 2px 0px #000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>{cat}</h4>
                    <span style={{ fontSize: '10px', fontWeight: 700, opacity: 0.75 }}>{count} {count === 1 ? 'TASK' : 'TASKS'}</span>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: 900, fontFamily: 'monospace' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Focus hours metric */}
          <div style={{
            marginTop: '16px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: '#ffe600',
            color: '#000000',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="#ff007a" fill="#ff007a" />
              <div>
                <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase' }}>ESTIMATED WORKLOAD</span>
                <p style={{ fontSize: '10px', fontWeight: 700 }}>Total focused hours</p>
              </div>
            </div>
            <span style={{ fontSize: '15px', fontWeight: 900, fontFamily: 'monospace' }}>
              {focusHoursCompleted} / {totalFocusHours} HRS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
