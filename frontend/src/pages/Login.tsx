// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, User, Sun, Moon, ArrowRight, Eye, EyeOff, Zap, KeyRound, Server, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useTheme } from '../context/ThemeContext';
import { getBaseURL } from '../api/client';

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
  const [showServerModal, setShowServerModal] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(() => localStorage.getItem('custom_api_url') || '');
  const [serverUnreachable, setServerUnreachable] = useState(false);
  const [isMd, setIsMd] = useState(window.innerWidth >= 1024);
  const { darkMode, toggleTheme } = useTheme();
  const { login, loginDemo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMd(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername || !password) {
      toast.error('Please enter both username/email and password');
      return;
    }
    setIsLoading(true);
    setServerUnreachable(false);
    try {
      await login(cleanUsername, password);
      toast.success('Welcome back! 💥');
      navigate('/app');
    } catch (err: any) {
      console.error('Login error:', err);
      const serverMsg = err.response?.data?.error || err.response?.data?.message;
      if (serverMsg) {
        toast.error(serverMsg);
      } else if (err.response?.status === 429) {
        toast.error('Too many requests. Please wait a moment and try again.');
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        const apiTarget = getBaseURL();
        setServerUnreachable(true);
        toast.error(`Cannot connect to server at ${apiTarget}. Check network or IP!`);
      } else {
        toast.error(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemo = async () => {
    setIsLoading(true);
    try {
      await loginDemo();
      toast.success('Entered Demo Mode! 🚀');
      navigate('/app');
    } catch (e) {
      toast.error('Could not enter demo mode.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setUsername('demo');
    setPassword('Password123!');
    toast.info('Demo credentials filled!');
  };

  const handleSaveCustomUrl = () => {
    const trimmed = customUrlInput.trim();
    if (trimmed) {
      localStorage.setItem('custom_api_url', trimmed);
      toast.success(`Server URL updated to ${trimmed}!`);
    } else {
      localStorage.removeItem('custom_api_url');
      toast.info('Reset to default API URL');
    }
    setShowServerModal(false);
    setServerUnreachable(false);
  };

  return (
    <div className="min-h-screen halftone-bg" style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', position: 'relative' }}>
      {/* Top right buttons */}
      <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 100, display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setShowServerModal(true)}
          title="Configure API Server"
          className="comic-btn comic-btn-cyan spider-hover-glitch"
          style={{ padding: '7px 10px', borderRadius: '10px', fontSize: '11px' }}
        >
          <Server size={15} color="#000" />
        </button>

        <button
          onClick={toggleTheme}
          title="Toggle theme"
          className="comic-btn comic-btn-yellow spider-hover-glitch"
          style={{ padding: '7px 10px', borderRadius: '10px' }}
        >
          {darkMode ? <Sun size={17} color="#000" /> : <Moon size={17} color="#000" />}
        </button>
      </div>

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
                transform: 'rotate(-4deg)'
              }}>
                <Zap size={22} color="#000" fill="#000" />
              </div>
              <span style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '-0.5px' }}>
                TASKIFY <span style={{ color: '#ff007a' }}>PRO</span>
              </span>
            </div>
          </div>

          {/* Hero text */}
          <div style={{ padding: '2.5rem 2.5rem 0' }}>
            <div className="comic-badge comic-badge-yellow comic-badge-rotate-left" style={{ display: 'inline-block', marginBottom: '16px' }}>
              DIMENSIONAL PRODUCTIVITY OS
            </div>
            <h1 style={{
              fontFamily: "'Bungee', 'Impact', sans-serif",
              fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              margin: '0 0 16px 0',
              textShadow: '3px 3px 0px #000000',
            }}>
              WELCOME BACK, <span style={{ color: '#00f0ff' }}>HERO.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 700, maxWidth: '420px', lineHeight: 1.5 }}>
              Your quantum task boards, focus pomodoro timers, and multiverse analytics are synced and ready for deployment.
            </p>
          </div>

          {/* Feature highlights */}
          <div style={{ padding: '2rem 2.5rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 'auto' }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: 'var(--bg-card)',
                  border: '2px solid #000000',
                  boxShadow: '3px 3px 0px #000000',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>{f.emoji}</div>
                <div style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{f.title}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginTop: '2px' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── RIGHT PANEL (Login Form) ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        overflowY: 'auto',
        position: 'relative',
      }}>
        {/* Mobile Header Brand */}
        {!isMd && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: '#ffe600', border: '2.5px solid #000',
              boxShadow: '2px 2px 0px #000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'rotate(-4deg)'
            }}>
              <Zap size={18} color="#000" fill="#000" />
            </div>
            <span style={{ fontWeight: 900, fontSize: '17px', letterSpacing: '-0.5px' }}>
              TASKIFY <span style={{ color: '#ff007a' }}>PRO</span>
            </span>
          </div>
        )}

        <div style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--bg-card)',
          borderRadius: '20px',
          border: 'var(--border-thick)',
          boxShadow: 'var(--shadow-hard)',
          padding: '24px 20px',
          boxSizing: 'border-box',
        }}>
          {/* Card Header */}
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <div className="comic-badge comic-badge-yellow comic-badge-rotate-left" style={{ display: 'inline-block', marginBottom: '10px', fontSize: '9.5px' }}>
              🔒 SECURE PORTAL
            </div>
            <h2 style={{
              fontFamily: "'Bungee', 'Impact', sans-serif",
              fontSize: '24px',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              margin: '0 0 4px 0',
            }}>
              HERO SIGN IN
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 700 }}>Enter your credentials to enter your workspace.</p>
          </div>

          {/* Demo Account Box */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '12px',
            marginBottom: '16px',
            background: '#ffe600',
            color: '#000000',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0px #000000',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <KeyRound size={15} />
                <span style={{ fontWeight: 900, fontSize: '11px', textTransform: 'uppercase' }}>DEMO CREDENTIALS</span>
              </div>
              <span style={{ fontSize: '9.5px', fontWeight: 800, fontFamily: 'monospace', opacity: 0.9 }}>demo · Password123!</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '6px' }}>
              <button
                type="button"
                onClick={fillDemo}
                className="comic-btn comic-btn-white"
                style={{ padding: '5px 8px', fontSize: '10px', borderRadius: '7px', justifyContent: 'center' }}
              >
                FILL
              </button>
              <button
                type="button"
                onClick={handleInstantDemo}
                className="comic-btn comic-btn-pink"
                style={{ padding: '5px 8px', fontSize: '10px', borderRadius: '7px', justifyContent: 'center' }}
              >
                <Sparkles size={12} />
                <span>INSTANT ENTER</span>
              </button>
            </div>
          </div>

          {/* Unreachable Server Alert Banner */}
          {serverUnreachable && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '10px 12px',
                borderRadius: '10px',
                background: '#ff007a',
                color: '#ffffff',
                border: '2px solid #000000',
                boxShadow: '3px 3px 0px #000000',
                marginBottom: '14px',
                fontSize: '11px',
                fontWeight: 800,
              }}
            >
              <div style={{ marginBottom: '6px' }}>⚡ Backend server is offline or unreachable.</div>
              <button
                type="button"
                onClick={handleInstantDemo}
                className="comic-btn comic-btn-yellow"
                style={{ width: '100%', padding: '6px', fontSize: '10.5px', borderRadius: '6px', justifyContent: 'center' }}
              >
                <Sparkles size={13} />
                <span>CONTINUE IN DEMO MODE →</span>
              </button>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '10.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
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
                    height: '40px',
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
              <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '10.5px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
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
                    height: '40px',
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
                fontSize: '13.5px',
                marginTop: '4px',
                justifyContent: 'center',
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
          <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '16px', paddingTop: '14px', borderTop: '2px solid #000000' }}>
            NEW TO TASKIFY PRO?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              style={{ background: 'none', border: 'none', color: '#ff007a', fontWeight: 900, cursor: 'pointer', textDecoration: 'underline' }}
            >
              CREATE ACCOUNT
            </button>
          </p>
        </div>
      </div>

      {/* Server Config Modal */}
      <AnimatePresence>
        {showServerModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setShowServerModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--bg-card)',
                border: '3px solid #000000',
                boxShadow: '6px 6px 0px #000000',
                borderRadius: '16px',
                maxWidth: '420px',
                width: '100%',
                padding: '20px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Server size={18} color="#00f0ff" />
                <h3 style={{ fontSize: '15px', fontWeight: 900, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                  API SERVER SETTINGS
                </h3>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '12px', lineHeight: 1.4 }}>
                Current Target API: <strong style={{ color: '#00ff66', wordBreak: 'break-all' }}>{getBaseURL()}</strong>
              </p>

              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px' }}>
                CUSTOM BACKEND URL (OPTIONAL)
              </label>
              <input
                type="text"
                placeholder="e.g. https://xxxx.up.railway.app/api"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                style={{
                  width: '100%',
                  height: '38px',
                  borderRadius: '8px',
                  padding: '0 10px',
                  fontSize: '12px',
                  border: '2px solid #000',
                  background: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  marginBottom: '14px',
                  boxSizing: 'border-box',
                }}
              />

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowServerModal(false)}
                  className="comic-btn comic-btn-white"
                  style={{ padding: '6px 12px', fontSize: '11px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustomUrl}
                  className="comic-btn comic-btn-yellow"
                  style={{ padding: '6px 14px', fontSize: '11px' }}
                >
                  Save URL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
