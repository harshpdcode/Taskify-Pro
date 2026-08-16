// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Lock, User, Sun, Moon, ArrowRight, Eye, EyeOff, Zap, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useTheme } from '../context/ThemeContext';

const features = [
  { emoji: '📋', title: 'Kanban Lanes', desc: 'Drag-and-drop task boards' },
  { emoji: '📊', title: 'Power Stats', desc: 'Track your level & completion' },
  { emoji: '🍅', title: 'Focus Timer', desc: 'Pomodoro with synth audio' },
  { emoji: '📅', title: 'Calendar Grid', desc: 'Schedule missions visually' },
];

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMd, setIsMd] = useState(window.innerWidth >= 1024);
  const { darkMode, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMd(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(username, password);
      toast.success('Welcome back! 💥');
      navigate('/app');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setUsername('testuser');
    setPassword('Password123!');
    toast.info('Demo credentials filled!');
  };

  return (
    <div className="min-h-screen halftone-bg" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', position: 'relative' }}>
      {/* Theme toggle with Spider-Verse Multiverse Glitch */}
      <button
        onClick={toggleTheme}
        title="Toggle theme"
        className="comic-btn comic-btn-yellow spider-hover-glitch"
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 100,
          padding: '8px',
          borderRadius: '10px',
        }}
      >
        {darkMode ? <Sun size={18} color="#000" /> : <Moon size={18} color="#000" />}
      </button>

      {/* ── LEFT PANEL (Desktop only) ── */}
      {isMd && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '52%',
          height: '100%',
          overflowY: 'auto',
          borderRight: 'var(--border-thick)',
          backgroundColor: 'var(--bg-sidebar)',
          position: 'relative',
          zIndex: 10,
          flexShrink: 0,
        }}>
          {/* Top brand */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2.5rem 2.5rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: '#ffe600', border: '3px solid #000',
                boxShadow: '3px 3px 0px #000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: 'rotate(-3deg)',
              }}>
                <Zap size={22} color="#000" fill="#000" />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '18px', textTransform: 'uppercase', letterSpacing: '-0.3px' }}>
                  Taskify <span style={{ color: '#ff007a' }}>Pro</span>
                </div>
                <div className="comic-badge" style={{ background: '#00f0ff', color: '#000', padding: '1px 6px', fontSize: '9px' }}>
                  COMIC EDITION ⚡
                </div>
              </div>
            </div>
            <div className="comic-badge" style={{ background: '#ffe600', color: '#000' }}>v2.5 POP ART</div>
          </div>

          {/* Hero content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 2.5rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Badge */}
              <div className="comic-badge comic-badge-rotate-left" style={{ background: '#ffe600', color: '#000000', marginBottom: '20px', fontSize: '12px' }}>
                <Zap size={14} fill="#000" />
                <span>SUPERCHARGED FOCUS ENGINE</span>
              </div>

              {/* Heading */}
              <h1 style={{ fontWeight: 900, fontSize: '38px', lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '-0.5px', marginBottom: '16px' }}>
                ORGANIZE MISSIONS.<br />
                <span style={{
                  background: '#ff007a',
                  color: '#ffffff',
                  padding: '2px 10px',
                  border: '3px solid #000',
                  boxShadow: '4px 4px 0px #000',
                  display: 'inline-block',
                  transform: 'rotate(1deg)',
                  marginTop: '6px',
                }}>
                  CRUSH EVERY GOAL.
                </span>
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 700, lineHeight: 1.6, maxWidth: '400px', marginBottom: '28px' }}>
                The definitive Neo-Brutalist workspace with intelligent Kanban lanes, calendar scheduling, productivity meters, and focus timers.
              </p>

              {/* Feature cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '460px' }}>
                {features.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 + 0.2 }}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: '#ffffff',
                      color: '#000000',
                      border: '2px solid #000000',
                      boxShadow: '3px 3px 0px #000000',
                    }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{f.emoji}</div>
                    <div style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase' }}>{f.title}</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.8 }}>{f.desc}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom status */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 2.5rem', borderTop: 'var(--border-thick)', background: 'var(--bg-sidebar)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff66', border: '1px solid #000', display: 'inline-block' }} />
              ALL SYSTEMS ENGAGED
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>COMIC DISPATCH OS</div>
          </div>
        </div>
      )}

      {/* ── RIGHT PANEL (Auth Card) ── */}
      <div style={{
        flex: 1,
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        position: 'relative',
        zIndex: 10,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            width: '100%',
            maxWidth: '390px',
            background: 'var(--bg-card)',
            border: '3px solid #000000',
            boxShadow: '8px 8px 0px #000000',
            borderRadius: '18px',
            padding: '28px 24px',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '22px' }}>
            <div className="comic-badge" style={{ background: '#ffe600', color: '#000000', marginBottom: '8px' }}>
              🔒 SECURE PORTAL
            </div>
            <h2 style={{ fontWeight: 900, fontSize: '24px', textTransform: 'uppercase', letterSpacing: '-0.3px', marginBottom: '4px' }}>
              HERO SIGN IN
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700 }}>Enter your credentials to enter your workspace.</p>
          </div>

          {/* Demo Account Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: '10px',
            marginBottom: '20px',
            background: '#ffe600',
            color: '#000000',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px #000000',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <KeyRound size={16} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 900, fontSize: '11px', textTransform: 'uppercase' }}>DEMO CREDENTIALS</div>
                <div style={{ fontSize: '10px', fontWeight: 700, opacity: 0.85, fontFamily: 'monospace' }}>
                  testuser · Password123!
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="comic-btn comic-btn-white"
              style={{ padding: '4px 10px', fontSize: '10px', borderRadius: '6px' }}
            >
              FILL
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                USERNAME OR EMAIL
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  required
                  placeholder="Enter username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    background: 'var(--bg-input)',
                    border: '2px solid #000000',
                    boxShadow: '2px 2px 0px #000000',
                    boxSizing: 'border-box',
                    paddingLeft: '36px',
                    paddingRight: '12px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    background: 'var(--bg-input)',
                    border: '2px solid #000000',
                    boxShadow: '2px 2px 0px #000000',
                    boxSizing: 'border-box',
                    paddingLeft: '36px',
                    paddingRight: '40px',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="comic-btn comic-btn-yellow"
              style={{
                width: '100%',
                height: '44px',
                fontSize: '14px',
                marginTop: '6px',
              }}
            >
              {isLoading ? (
                <>SIGNING IN...</>
              ) : (
                <>SIGN IN <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Register Link */}
          <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '20px', paddingTop: '16px', borderTop: '2px solid #000000' }}>
            NEW TO TASKIFY PRO?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              style={{ background: 'none', border: 'none', color: '#ff007a', fontWeight: 900, cursor: 'pointer', textDecoration: 'underline', fontSize: '12px' }}
            >
              CREATE ACCOUNT
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
