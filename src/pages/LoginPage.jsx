import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Forgot password & OTP verification states
  const [showOtpFlow, setShowOtpFlow] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [receivedOtpCode, setReceivedOtpCode] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { login, sendPhoneOtp, verifyOtpAndResetPassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state?.from?.pathname && location.state.from.pathname !== '/login' && location.state.from.pathname !== '/')
    ? location.state.from.pathname
    : '/home';

  // Standard Name & Password Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const cleanId = identifier.trim();
    if (!cleanId) {
      setMessage({ text: 'Please enter your Name or Phone number.', type: 'error' });
      return;
    }

    if (!password) {
      setMessage({ text: 'Please enter your password.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await login(cleanId, password);
      setMessage({ text: `Signed in as ${res.user?.name}! Redirecting...`, type: 'success' });
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 350);
    } catch (err) {
      setMessage({ text: err.message || 'Login failed. Please check your credentials.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to Phone
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const cleanPhone = otpPhone.replace(/\D/g, '').slice(-10);
    if (!cleanPhone || cleanPhone.length < 10) {
      setMessage({ text: 'Please enter a valid 10-digit mobile phone number.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await sendPhoneOtp(cleanPhone);
      setOtpSent(true);
      setReceivedOtpCode(res.otp);
      setMessage({
        text: `OTP sent successfully to +91 ${cleanPhone}! Check the notification banner below.`,
        type: 'success'
      });
    } catch (err) {
      setMessage({ text: err.message || 'Failed to send OTP. Please check your phone number.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Reset Password / Log In
  const handleVerifyOtpAndLogin = async (e) => {
    e.preventDefault();
    const cleanPhone = otpPhone.replace(/\D/g, '').slice(-10);

    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      setMessage({ text: 'Please enter the complete 6-digit OTP code.', type: 'error' });
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setMessage({ text: 'New password must be at least 4 characters long.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await verifyOtpAndResetPassword(cleanPhone, enteredOtp.trim(), newPassword);
      setMessage({ text: `Password reset verified! Signed in as ${res.user?.name}. Redirecting...`, type: 'success' });
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 400);
    } catch (err) {
      setMessage({ text: err.message || 'OTP verification failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Theme toggle in corner */}
      <button
        onClick={toggleTheme}
        className="nav-icon-btn"
        title="Toggle Theme"
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10
        }}
      >
        <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
      </button>

      <div className="login-card" style={{
        width: '100%',
        maxWidth: '430px',
        padding: '36px 30px',
        borderRadius: '22px',
        background: 'var(--card-bg, #ffffff)',
        border: '1px solid var(--border-color, #e2e8f0)',
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.1)',
        boxSizing: 'border-box'
      }}>
        {/* Logo */}
        <div className="logo" style={{
          marginBottom: '14px',
          color: 'var(--primary, #4f46e5)',
          fontSize: '26px',
          fontWeight: 850,
          letterSpacing: '-0.5px',
          textAlign: 'center'
        }}>
          Project<span style={{ color: 'var(--text-color, #0f172a)' }}>Hub</span>
        </div>

        {/* Header */}
        <h1 style={{
          marginBottom: '6px',
          textAlign: 'center',
          fontSize: '23px',
          fontWeight: 800,
          color: 'var(--text-color, #0f172a)'
        }}>
          {showOtpFlow ? 'Reset Password via OTP' : 'Student Sign In'}
        </h1>

        <p className="subtitle" style={{
          marginBottom: '20px',
          color: 'var(--text-secondary, #64748b)',
          textAlign: 'center',
          fontSize: '13px',
          lineHeight: 1.5
        }}>
          {showOtpFlow
            ? 'Verify with your registered phone number OTP to reset your password and sign in.'
            : 'Enter your Name and Password to sign in to your account.'}
        </p>

        {/* ---------------- MODE 1: NAME & PASSWORD LOGIN ---------------- */}
        {!showOtpFlow ? (
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="identifier" style={{
              display: 'block',
              margin: '12px 0 6px',
              color: 'var(--text-color, #1e293b)',
              fontSize: '13px',
              fontWeight: 600
            }}>
              Your Name / Phone Number
            </label>
            <input
              id="identifier"
              type="text"
              required
              autoFocus
              placeholder="e.g. Rahul Sharma or 9876543210"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setMessage({ text: '', type: '' });
              }}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid var(--border-color, #cbd5e1)',
                borderRadius: '10px',
                background: 'var(--input-bg, #ffffff)',
                color: 'var(--text-color, #0f172a)',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 0 6px' }}>
              <label htmlFor="password" style={{
                color: 'var(--text-color, #1e293b)',
                fontSize: '13px',
                fontWeight: 600
              }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setShowOtpFlow(true);
                  setMessage({ text: '', type: '' });
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#4f46e5',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage({ text: '', type: '' });
              }}
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid var(--border-color, #cbd5e1)',
                borderRadius: '10px',
                background: 'var(--input-bg, #ffffff)',
                color: 'var(--text-color, #0f172a)',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '13px',
                border: 'none',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>

            {message.text && (
              <div style={{
                marginTop: '16px',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                textAlign: 'center',
                color: message.type === 'error' ? '#ef4444' : '#10b981',
                background: message.type === 'error' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                border: message.type === 'error' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                {message.text}
              </div>
            )}

            <div style={{
              marginTop: '22px',
              color: 'var(--text-secondary, #64748b)',
              fontSize: '13px',
              textAlign: 'center'
            }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary, #4f46e5)', fontWeight: 600, textDecoration: 'none' }}>
                Register here
              </Link>
            </div>
          </form>
        ) : (
          /* ---------------- MODE 2: FORGOT PASSWORD / PHONE OTP FLOW ---------------- */
          <div>
            {/* Simulated Live SMS Notification Banner when OTP is sent */}
            {otpSent && receivedOtpCode && (
              <div style={{
                marginBottom: '16px',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                color: '#ffffff',
                boxShadow: '0 8px 20px rgba(15, 23, 42, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                animation: 'modalIn 0.25s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <i className="fa-solid fa-comment-sms" style={{ color: '#38bdf8', fontSize: '15px' }}></i>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>SMS Verification Code</span>
                  <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: 'auto' }}>Just now</span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#e2e8f0', lineHeight: 1.4 }}>
                  Your ProjectHub verification OTP is <strong style={{ color: '#38bdf8', fontSize: '15px', letterSpacing: '2px' }}>{receivedOtpCode}</strong>.
                </div>
                <button
                  type="button"
                  onClick={() => setEnteredOtp(receivedOtpCode)}
                  style={{
                    marginTop: '8px',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    background: '#38bdf8',
                    color: '#0f172a',
                    border: 'none',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ⚡ Auto-fill OTP Code
                </button>
              </div>
            )}

            {!otpSent ? (
              /* Step 1: Enter Phone Number */
              <form onSubmit={handleSendOtp}>
                <label style={{
                  display: 'block',
                  margin: '10px 0 6px',
                  color: 'var(--text-color, #1e293b)',
                  fontSize: '13px',
                  fontWeight: 600
                }}>
                  Enter Your Registered Phone Number
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    borderRadius: '10px',
                    background: 'var(--surface-subtle, #f1f5f9)',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--text-secondary, #64748b)'
                  }}>
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    autoFocus
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    value={otpPhone}
                    onChange={(e) => {
                      setOtpPhone(e.target.value.replace(/\D/g, ''));
                      setMessage({ text: '', type: '' });
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      border: '1px solid var(--border-color, #cbd5e1)',
                      borderRadius: '10px',
                      background: 'var(--input-bg, #ffffff)',
                      color: 'var(--text-color, #0f172a)',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    marginTop: '18px',
                    padding: '13px',
                    border: 'none',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP via SMS →'}
                </button>
              </form>
            ) : (
              /* Step 2: Enter OTP and New Password */
              <form onSubmit={handleVerifyOtpAndLogin}>
                <label style={{
                  display: 'block',
                  margin: '10px 0 6px',
                  color: 'var(--text-color, #1e293b)',
                  fontSize: '13px',
                  fontWeight: 600
                }}>
                  Enter 6-Digit OTP
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="6-digit code"
                  maxLength={6}
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    borderRadius: '10px',
                    background: 'var(--input-bg, #ffffff)',
                    color: 'var(--text-color, #0f172a)',
                    fontSize: '16px',
                    letterSpacing: '4px',
                    textAlign: 'center',
                    fontWeight: 700,
                    boxSizing: 'border-box'
                  }}
                />

                <label style={{
                  display: 'block',
                  margin: '12px 0 6px',
                  color: 'var(--text-color, #1e293b)',
                  fontSize: '13px',
                  fontWeight: 600
                }}>
                  Create New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password (min 4 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid var(--border-color, #cbd5e1)',
                    borderRadius: '10px',
                    background: 'var(--input-bg, #ffffff)',
                    color: 'var(--text-color, #0f172a)',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    marginTop: '18px',
                    padding: '13px',
                    border: 'none',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Log In →'}
                </button>

                <div style={{ marginTop: '10px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#4f46e5',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            )}

            {message.text && (
              <div style={{
                marginTop: '16px',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                textAlign: 'center',
                color: message.type === 'error' ? '#ef4444' : '#10b981',
                background: message.type === 'error' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                border: message.type === 'error' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                {message.text}
              </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setShowOtpFlow(false);
                  setOtpSent(false);
                  setReceivedOtpCode('');
                  setMessage({ text: '', type: '' });
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary, #64748b)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ← Back to Name & Password Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
