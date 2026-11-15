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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (!cleanName) {
      setMessage({ text: 'Please enter your full name.', type: 'error' });
      return;
    }

    if (!cleanPhone || cleanPhone.length < 10) {
      setMessage({ text: 'Please enter a valid 10-digit mobile phone number.', type: 'error' });
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
      const res = await register(cleanName, cleanPhone, password, college.trim() || 'Engineering Student');
      setMessage({ text: `Welcome ${res.user?.name}! Redirecting to home...`, type: 'success' });
      setTimeout(() => {
        navigate('/home', { replace: true });
      }, 350);
    } catch (err) {
      setMessage({ text: err.message || 'Registration failed. Please try again.', type: 'error' });
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
        maxWidth: '440px',
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
          Register with your Name and Phone number to showcase projects and collaborate.
        </p>

        <form onSubmit={handleSubmit}>
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

          <label htmlFor="regPhone" style={{
            display: 'block',
            margin: '10px 0 5px',
            color: 'var(--text-color, #1e293b)',
            fontSize: '13px',
            fontWeight: 600
          }}>
            Mobile Phone Number * (Linked for OTP Verification)
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
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
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
          </div>

          <label htmlFor="regCollege" style={{
            display: 'block',
            margin: '10px 0 5px',
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

          <label htmlFor="regPassword" style={{
            display: 'block',
            margin: '10px 0 5px',
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

          <label htmlFor="regConfirmPassword" style={{
            display: 'block',
            margin: '10px 0 5px',
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
            {loading ? 'Creating account...' : 'Create Account →'}
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
