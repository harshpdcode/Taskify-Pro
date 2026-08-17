// src/pages/Register.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getBaseURL } from '../api/client';
import { User, Mail, Lock, ArrowRight, Sun, Moon, Eye, EyeOff, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

import { useTheme } from '../context/ThemeContext';

const perks = [
  { emoji: '⚡', text: 'Free Forever — No credit card required' },
  { emoji: '🔒', text: 'JWT Secured, end-to-end protected' },
  { emoji: '💥', text: 'Instant Setup — Under 30 seconds' },
  { emoji: '📱', text: 'High-Impact Neo-Brutalist design' },
];

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMd, setIsMd] = useState(window.innerWidth >= 1024);
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMd(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = formData.username.trim();
    const cleanEmail = formData.email.trim();

    if (!cleanUsername || !cleanEmail || !formData.password) {
      toast.error('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setIsLoading(true);
      const res = await api.post('/register', {
        username: cleanUsername,
        email: cleanEmail,
        password: formData.password,
      });
      if (res.status === 201) {
        toast.success('Account created! Sign in to continue 💥');
        navigate('/login');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      const serverMsg = err.response?.data?.error || err.response?.data?.message;
      if (serverMsg) {
        toast.error(serverMsg);
      } else if (err.response?.status === 429) {
        toast.error('Too many requests. Please wait a moment and try again.');
      } else if (err.code === 'ERR_NETWORK' || !err.response) {
        const apiTarget = getBaseURL();
        toast.error(`Cannot connect to server at ${apiTarget}. Check network or IP!`);
      } else {
        toast.error(err.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
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
                background: '#ff007a', border: '3px solid #000',
                boxShadow: '3px 3px 0px #000',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: 'rotate(-3deg)',
              }}>
                <Zap size={22} color="#fff" fill="#fff" />
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
            <div className="comic-badge" style={{ background: '#00ff66', color: '#000' }}>100% FREE</div>
          </div>

          {/* Hero */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem 2.5rem' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Badge */}
              <div className="comic-badge comic-badge-rotate-left" style={{ background: '#00ff66', color: '#000000', marginBottom: '20px', fontSize: '12px' }}>
                ⚡ INSTANT MISSION ENLISTMENT
              </div>

              {/* Heading */}
              <h1 style={{ fontWeight: 900, fontSize: '38px', lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '-0.5px', marginBottom: '16px' }}>
                BUILD YOUR FLOW.<br />
                <span style={{
                  background: '#ffe600',
                  color: '#000000',
                  padding: '2px 10px',
                  border: '3px solid #000',
                  boxShadow: '4px 4px 0px #000',
                  display: 'inline-block',
                  transform: 'rotate(-1deg)',
                  marginTop: '6px',
                }}>
                  UNLEASH MAXIMUM POWER.
                </span>
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 700, lineHeight: 1.6, maxWidth: '400px', marginBottom: '28px' }}>
                Join thousands of high performers who orchestrate projects with smart boards, checklists, and integrated focus analytics.
              </p>

              {/* Perks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '440px' }}>
                {perks.map((p, i) => (
                  <motion.div
                    key={p.text}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 + 0.2 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: '#ffffff',
                      color: '#000000',
                      border: '2px solid #000000',
                      boxShadow: '2px 2px 0px #000000',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{p.emoji}</span>
                    <span style={{ fontSize: '12px', fontWeight: 800 }}>{p.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2rem 2.5rem', borderTop: 'var(--border-thick)', background: 'var(--bg-sidebar)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff66', border: '1px solid #000', display: 'inline-block' }} />
              NO CREDIT CARD REQUIRED
            </div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)' }}>COMIC ENLISTMENT</div>
          </div>
        </div>
      )}

      {/* ── RIGHT PANEL (Register Card) ── */}
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
            <div className="comic-badge" style={{ background: '#ff007a', color: '#ffffff', marginBottom: '8px' }}>
              ⚡ HERO REGISTRATION
            </div>
            <h2 style={{ fontWeight: 900, fontSize: '24px', textTransform: 'uppercase', letterSpacing: '-0.3px', marginBottom: '4px' }}>
              CREATE ACCOUNT
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 700 }}>Enlist today — it takes under 30 seconds.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Username */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                USERNAME
              </label>
              <div style={{ position: 'relative' }}>
                <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  name="username"
                  required
                  minLength={3}
                  placeholder="Choose a callsign"
                  value={formData.username}
                  onChange={handleChange}
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

            {/* Email */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                EMAIL ADDRESS
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
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

            {/* Password */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                CONFIRM PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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

            <button
              type="submit"
              disabled={isLoading}
              className="comic-btn comic-btn-pink"
              style={{
                width: '100%',
                height: '44px',
                fontSize: '14px',
                marginTop: '6px',
              }}
            >
              {isLoading ? (
                <>CREATING ACCOUNT...</>
              ) : (
                <>GET STARTED FREE <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '20px', paddingTop: '16px', borderTop: '2px solid #000000' }}>
            ALREADY ENLISTED?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{ background: 'none', border: 'none', color: '#ff007a', fontWeight: 900, cursor: 'pointer', textDecoration: 'underline', fontSize: '12px' }}
            >
              SIGN IN
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
