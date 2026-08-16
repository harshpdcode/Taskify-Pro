// src/pages/Profile.tsx
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { ArrowLeft, User, Mail, Save, Edit3, Check, X, Send, ShieldCheck, Lock, Zap, Download, Smartphone, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AsciiGlitchText from '../components/AsciiGlitchText';
import { usePwaInstall } from '../hooks/usePwaInstall';
import InstallPwaModal from '../components/InstallPwaModal';

type UserProfile = { id: number; username: string; email: string; member_since?: string };

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [resetEmail, setResetEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { showInstallModal, setShowInstallModal, triggerInstall, isInstalled } = usePwaInstall();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/profile')
      .then((res) => {
        setUser(res.data);
        setFormData({ username: res.data.username, email: res.data.email });
        setResetEmail(res.data.email);
      })
      .catch(() => toast.error('Failed to load profile.'));
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await api.put('/profile', formData);
      setUser(res.data);
      setEditing(false);
      toast.success('Profile updated! 💥');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    try {
      await api.post('/profile/request-otp', { email: resetEmail });
      setResetStep(2);
      toast.info('OTP code sent to your email! ⚡');
    } catch {
      toast.error('Failed to send OTP.');
    }
  };

  const handlePasswordReset = async () => {
    try {
      await api.post('/profile/verify-otp', { email: resetEmail, otp: resetOtp });
      await api.post('/profile/reset-password', { email: resetEmail, new_password: newPassword });
      toast.success('Password changed successfully! 💥');
      setResetOtp('');
      setNewPassword('');
      setResetStep(1);
    } catch {
      toast.error('Failed to reset password.');
    }
  };

  if (!user) {
    return (
      <div
        className="min-h-screen halftone-bg"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-main)',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            border: '4px solid #000000',
            borderTopColor: '#ffe600',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen halftone-bg"
      style={{
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-primary)',
        padding: 'clamp(16px, 4vw, 40px) clamp(12px, 3vw, 24px)',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '680px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate('/app')}
          className="comic-btn comic-btn-white"
          style={{
            alignSelf: 'flex-start',
            padding: '7px 16px',
            fontSize: '12px',
            borderRadius: '10px',
          }}
        >
          <ArrowLeft size={15} /> <span>Back to Dashboard</span>
        </button>

        {/* Profile Comic Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            borderRadius: '18px',
            background: 'var(--bg-card)',
            border: '3px solid #000000',
            boxShadow: '6px 6px 0px #000000',
            overflow: 'hidden',
          }}
        >
          {/* Header Accent */}
          <div
            style={{
              padding: '12px 20px',
              background: '#ffe600',
              color: '#000000',
              borderBottom: '3px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} fill="#000" />
              <span style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                <AsciiGlitchText text="HERO IDENTIFICATION DOSSIER" />
              </span>
            </div>
            <span className="comic-badge" style={{ background: '#ff007a', color: '#fff', fontSize: '10px' }}>
              LEVEL 5
            </span>
          </div>

          <div style={{ padding: 'clamp(18px, 4vw, 28px)' }}>
            {/* Avatar + Call-sign */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                paddingBottom: '20px',
                marginBottom: '20px',
                borderBottom: '2px dashed #000000',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '14px',
                    background: '#00f0ff',
                    border: '3px solid #000000',
                    boxShadow: '3px 3px 0px #000000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px',
                    fontWeight: 900,
                    color: '#000000',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                  }}
                >
                  {user.username?.charAt(0) || 'U'}
                </div>
                <div>
                  <h1 style={{ fontWeight: 900, fontSize: '22px', textTransform: 'uppercase', marginBottom: '2px' }}>
                    <AsciiGlitchText text={user.username} />
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, opacity: 0.85 }}>
                    <Mail size={13} /> {user.email}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {editing ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      disabled={loading}
                      className="comic-btn comic-btn-green"
                      style={{ padding: '8px 16px', fontSize: '12px' }}
                    >
                      <Save size={14} /> <span>{loading ? 'Saving…' : 'Save'}</span>
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="comic-btn comic-btn-pink"
                      style={{ padding: '8px 12px' }}
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="comic-btn comic-btn-yellow"
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    <Edit3 size={14} /> <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            {/* Form fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Username */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    marginBottom: '6px',
                  }}
                >
                  CALL-SIGN / USERNAME
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    name="username"
                    value={formData.username}
                    disabled={!editing}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      background: 'var(--bg-input)',
                      border: '2px solid #000000',
                      boxShadow: '2px 2px 0px #000000',
                      boxSizing: 'border-box',
                      paddingLeft: '36px',
                      paddingRight: '12px',
                      outline: 'none',
                      opacity: editing ? 1 : 0.65,
                      cursor: editing ? 'text' : 'not-allowed',
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    marginBottom: '6px',
                  }}
                >
                  REGISTERED HQ EMAIL
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input
                    name="email"
                    value={formData.email}
                    disabled
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      background: 'var(--bg-input)',
                      border: '2px solid #000000',
                      boxShadow: '2px 2px 0px #000000',
                      boxSizing: 'border-box',
                      paddingLeft: '36px',
                      paddingRight: '12px',
                      outline: 'none',
                      opacity: 0.5,
                      cursor: 'not-allowed',
                    }}
                  />
                </div>
                <p style={{ fontSize: '11px', fontWeight: 700, opacity: 0.65, marginTop: '4px' }}>
                  Email is locked to your account clearance.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security & Password Reset Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{
            borderRadius: '18px',
            background: 'var(--bg-card)',
            border: '3px solid #000000',
            boxShadow: '6px 6px 0px #000000',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '12px 20px',
              background: '#00ff66',
              color: '#000000',
              borderBottom: '3px solid #000000',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <ShieldCheck size={18} />
            <span style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              SECURITY & ACCESS VAULT
            </span>
          </div>

          <div style={{ padding: 'clamp(18px, 4vw, 28px)' }}>
            {resetStep === 1 ? (
              <div>
                <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '14px', opacity: 0.85 }}>
                  Change your secure passphrase using OTP verification code.
                </p>
                <button
                  onClick={handleRequestOtp}
                  className="comic-btn comic-btn-yellow"
                  style={{ padding: '9px 20px', fontSize: '12px' }}
                >
                  <Send size={14} /> <span>Request OTP Code</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                    ENTER 6-DIGIT OTP
                  </label>
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      background: 'var(--bg-input)',
                      border: '2px solid #000000',
                      boxShadow: '2px 2px 0px #000000',
                      boxSizing: 'border-box',
                      padding: '0 12px',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
                    NEW SECURE PASSWORD
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        width: '100%',
                        height: '42px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 800,
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
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    onClick={handlePasswordReset}
                    className="comic-btn comic-btn-green"
                    style={{ padding: '9px 20px', fontSize: '12px' }}
                  >
                    <Check size={14} /> <span>Verify & Save</span>
                  </button>
                  <button
                    onClick={() => setResetStep(1)}
                    className="comic-btn comic-btn-white"
                    style={{ padding: '9px 16px', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── NATIVE APP INSTALLATION DOSSIER CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            borderRadius: '18px',
            background: 'var(--bg-card)',
            border: '3px solid #000000',
            boxShadow: '6px 6px 0px #000000',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 20px',
              background: '#00f0ff',
              color: '#000000',
              borderBottom: '3px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smartphone size={18} strokeWidth={2.5} />
              <span style={{ fontWeight: 900, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                <AsciiGlitchText text="APP INSTALLATION & DEVICE ACCESS" />
              </span>
            </div>
            <span className="comic-badge" style={{ background: isInstalled ? '#00ff66' : '#ffe600', color: '#000', fontSize: '10px' }}>
              {isInstalled ? 'INSTALLED NATIVE' : 'PWA READY'}
            </span>
          </div>

          <div style={{ padding: 'clamp(18px, 4vw, 28px)' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
              Install <strong>Taskify Pro</strong> directly onto your Android, iPhone, Windows, or Mac device. Enjoy full-screen distraction-free mode, instant home screen launch, and fast offline caching.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  triggerInstall();
                  setShowInstallModal(true);
                }}
                className="comic-btn comic-btn-pink spider-hover-glitch"
                style={{ padding: '10px 22px', fontSize: '13px' }}
              >
                <Download size={16} strokeWidth={3} />
                <span>{isInstalled ? 'REINSTALL / APP INFO' : '⚡ INSTALL APP NOW'}</span>
              </button>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: 'var(--text-secondary)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-input)',
                  border: '1px solid #000',
                }}
              >
                <CheckCircle size={13} color="#00ff66" />
                <span>Service Worker Cache Active</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Install PWA Modal */}
      <InstallPwaModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        onInstallDirectly={triggerInstall}
      />
    </div>
  );
}
