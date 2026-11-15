import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Phone OTP verification states
  const [otpSent, setOtpSent] = useState(false);
  const [sentToPhone, setSentToPhone] = useState('');
  const [receivedOtp, setReceivedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const { sendRegistrationOtp, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Reset OTP if user alters phone number after OTP was sent
  const handlePhoneChange = (e) => {
    const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(clean);
    if (otpSent && clean !== sentToPhone) {
      setOtpSent(false);
      setReceivedOtp('');
      setEnteredOtp('');
      setMessage({ text: 'Phone number changed. Please click "Send OTP" to verify this number.', type: 'info' });
    }
  };

  // Step 1: Check if phone exists and send verification OTP
  const handleSendOtp = async () => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (!cleanPhone || cleanPhone.length < 10) {
      setMessage({ text: 'Please enter a valid 10-digit mobile phone number.', type: 'error' });
      return;
    }

    setOtpLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await sendRegistrationOtp(cleanPhone);
      setOtpSent(true);
      setSentToPhone(cleanPhone);
      setReceivedOtp(res.otp);
      setMessage({
        text: `OTP sent successfully to +91 ${cleanPhone}! Check the notification alert below.`,
        type: 'success'
      });
    } catch (err) {
      setMessage({
        text: err.message || 'Failed to send verification OTP.',
        type: 'error'
      });
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 2: Validate all fields, verify OTP, and Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (!cleanName || cleanName.length < 2) {
      setMessage({ text: 'Please enter your full name (minimum 2 characters).', type: 'error' });
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      setMessage({ text: 'Please enter a valid 10-digit mobile phone number.', type: 'error' });
      return;
    }

    // Require phone OTP verification first
    if (!otpSent || sentToPhone !== cleanPhone) {
      setMessage({ text: 'Please click "Send OTP" to verify your mobile phone number first.', type: 'error' });
      return;
    }

    if (!enteredOtp || enteredOtp.trim().length !== 6) {
      setMessage({ text: 'Please enter the complete 6-digit OTP verification code.', type: 'error' });
      return;
    }

    if (!password || !confirmPassword) {
      setMessage({ text: 'Please fill in both password fields.', type: 'error' });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    if (password.length < 4) {
      setMessage({ text: 'Password must be at least 4 characters long.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await register(
        cleanName,
        cleanPhone,
        enteredOtp.trim(),
        password,
        college.trim() || 'Engineering Student'
      );
      setMessage({ text: `Account verified and registered! Welcome, ${res.user?.name}! Redirecting...`, type: 'success' });
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 400);
    } catch (err) {
      setMessage({ text: err.message || 'Registration failed. Please check your OTP and try again.', type: 'error' });
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
        maxWidth: '460px',
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

        <h1 style={{
          marginBottom: '6px',
          textAlign: 'center',
          fontSize: '23px',
          fontWeight: 800,
          color: 'var(--text-color, #0f172a)'
        }}>
          Create Student Account
        </h1>

        <p className="subtitle" style={{
          marginBottom: '20px',
          color: 'var(--text-secondary, #64748b)',
          textAlign: 'center',
          fontSize: '13px',
          lineHeight: 1.5
        }}>
          Register with your Name and verified Mobile Phone number to showcase projects and collaborate.
        </p>

        {/* Instant SMS notification banner simulation */}
        {otpSent && receivedOtp && (
          <div style={{
            marginBottom: '18px',
            padding: '13px 15px',
            borderRadius: '12px',
            background: 'rgba(79, 70, 229, 0.08)',
            border: '1px solid rgba(79, 70, 229, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <i className="fa-solid fa-comment-sms" style={{ marginRight: '6px' }}></i>
                SMS Verification • Code Received
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--text-color, #0f172a)', marginTop: '3px' }}>
                Your OTP code is: <span style={{ color: '#4f46e5', letterSpacing: '3px' }}>{receivedOtp}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEnteredOtp(receivedOtp)}
              style={{
                padding: '7px 13px',
                borderRadius: '8px',
                border: '1px solid #4f46e5',
                background: '#4f46e5',
                color: '#ffffff',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Auto Fill
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <label htmlFor="regName" style={{
            display: 'block',
            margin: '10px 0 5px',
            color: 'var(--text-color, #1e293b)',
            fontSize: '13px',
            fontWeight: 600
          }}>
            Full Name *
          </label>
          <input
            id="regName"
            type="text"
            required
            autoFocus
            placeholder="e.g. Rahul Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: '1px solid var(--border-color, #cbd5e1)',
              borderRadius: '10px',
              background: 'var(--input-bg, #ffffff)',
              color: 'var(--text-color, #0f172a)',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />

          {/* Mobile Phone Number with Check / Send OTP button */}
          <label htmlFor="regPhone" style={{
            display: 'block',
            margin: '12px 0 5px',
            color: 'var(--text-color, #1e293b)',
            fontSize: '13px',
            fontWeight: 600
          }}>
            Mobile Phone Number * (Verified by OTP)
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
              id="regPhone"
              type="tel"
              required
              maxLength={10}
              placeholder="10-digit mobile number"
              value={phone}
              onChange={handlePhoneChange}
              style={{
                flex: 1,
                padding: '11px 14px',
                border: '1px solid var(--border-color, #cbd5e1)',
                borderRadius: '10px',
                background: 'var(--input-bg, #ffffff)',
                color: 'var(--text-color, #0f172a)',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpLoading || phone.length < 10}
              style={{
                padding: '0 14px',
                borderRadius: '10px',
                border: otpSent ? '1px solid var(--border-color, #cbd5e1)' : 'none',
                background: otpSent ? 'var(--surface-subtle, #f1f5f9)' : '#4f46e5',
                color: otpSent ? 'var(--text-color, #0f172a)' : '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: (otpLoading || phone.length < 10) ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {otpLoading ? 'Checking...' : (otpSent ? 'Resend OTP' : 'Send OTP')}
            </button>
          </div>

          {/* OTP Input Field */}
          {otpSent && (
            <div style={{ marginTop: '12px' }}>
              <label htmlFor="regOtp" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '0 0 5px',
                color: 'var(--text-color, #1e293b)',
                fontSize: '13px',
                fontWeight: 600
              }}>
                <span>Enter 6-Digit Verification Code *</span>
                <span style={{ fontSize: '11.5px', color: '#10b981', fontWeight: 600 }}>
                  <i className="fa-solid fa-circle-check" style={{ marginRight: '4px' }}></i>
                  Sent to +91 {sentToPhone}
                </span>
              </label>
              <input
                id="regOtp"
                type="text"
                required
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  border: '1px solid #4f46e5',
                  borderRadius: '10px',
                  background: 'var(--input-bg, #ffffff)',
                  color: 'var(--text-color, #0f172a)',
                  fontSize: '16px',
                  letterSpacing: '3px',
                  fontWeight: 700,
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* College */}
          <label htmlFor="regCollege" style={{
            display: 'block',
            margin: '12px 0 5px',
            color: 'var(--text-color, #1e293b)',
            fontSize: '13px',
            fontWeight: 600
          }}>
            College / University
          </label>
          <input
            id="regCollege"
            type="text"
            placeholder="e.g. VSSUT, Burla / IIT / NIT"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: '1px solid var(--border-color, #cbd5e1)',
              borderRadius: '10px',
              background: 'var(--input-bg, #ffffff)',
              color: 'var(--text-color, #0f172a)',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />

          {/* Password */}
          <label htmlFor="regPassword" style={{
            display: 'block',
            margin: '12px 0 5px',
            color: 'var(--text-color, #1e293b)',
            fontSize: '13px',
            fontWeight: 600
          }}>
            Password *
          </label>
          <input
            id="regPassword"
            type="password"
            required
            placeholder="At least 4 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: '1px solid var(--border-color, #cbd5e1)',
              borderRadius: '10px',
              background: 'var(--input-bg, #ffffff)',
              color: 'var(--text-color, #0f172a)',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />

          {/* Confirm Password */}
          <label htmlFor="regConfirmPassword" style={{
            display: 'block',
            margin: '12px 0 5px',
            color: 'var(--text-color, #1e293b)',
            fontSize: '13px',
            fontWeight: 600
          }}>
            Confirm Password *
          </label>
          <input
            id="regConfirmPassword"
            type="password"
            required
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: '1px solid var(--border-color, #cbd5e1)',
              borderRadius: '10px',
              background: 'var(--input-bg, #ffffff)',
              color: 'var(--text-color, #0f172a)',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '22px',
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
            {loading ? 'Verifying & Creating Account...' : (otpSent ? 'Verify OTP & Create Account →' : 'Verify Mobile via OTP & Register →')}
          </button>

          {/* Status Message */}
          {message.text && (
            <div style={{
              marginTop: '16px',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              textAlign: 'center',
              color: message.type === 'error' ? '#ef4444' : (message.type === 'info' ? '#6366f1' : '#10b981'),
              background: message.type === 'error' ? 'rgba(239, 68, 68, 0.08)' : (message.type === 'info' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(16, 185, 129, 0.08)'),
              border: message.type === 'error' ? '1px solid rgba(239, 68, 68, 0.2)' : (message.type === 'info' ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)')
            }}>
              {message.text}
              {message.text.includes('already registered') && (
                <div style={{ marginTop: '8px' }}>
                  <Link
                    to="/login"
                    style={{
                      display: 'inline-block',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      background: '#4f46e5',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    Go to Sign In →
                  </Link>
                </div>
              )}
            </div>
          )}

          <div style={{
            marginTop: '22px',
            color: 'var(--text-secondary, #64748b)',
            fontSize: '13px',
            textAlign: 'center'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary, #4f46e5)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in with Name & Password
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
