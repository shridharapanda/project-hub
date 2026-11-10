import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const { login, demoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Please fill in all fields.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await login(email, password);
      setMessage({ text: 'Login successful! Redirecting...', type: 'success' });
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err) {
      setMessage({ text: err.message || 'Login failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setLoading(true);
    demoLogin();
    setMessage({ text: 'Logged in with Demo Student account! Redirecting...', type: 'success' });
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 500);
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
        maxWidth: '420px',
        padding: '38px 32px',
        borderRadius: '20px',
        background: 'var(--card-bg, #ffffff)',
        border: '1px solid var(--border-color, #e2e8f0)',
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)'
      }}>
        <div className="logo" style={{
          marginBottom: '22px',
          color: 'var(--primary, #4f46e5)',
          fontSize: '26px',
          fontWeight: 850,
          letterSpacing: '-0.5px',
          textAlign: 'center'
        }}>
          Project<span style={{ color: 'var(--text-color, #0f172a)' }}>Hub</span>
        </div>

        <h1 style={{
          marginBottom: '8px',
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: 800,
          color: 'var(--text-color, #0f172a)'
        }}>
          Welcome back
        </h1>

        <p className="subtitle" style={{
          marginBottom: '26px',
          color: 'var(--text-secondary, #64748b)',
          textAlign: 'center',
          fontSize: '13px',
          lineHeight: 1.6
        }}>
          Enter your details to access your account.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={{
            display: 'block',
            margin: '16px 0 7px',
            color: 'var(--text-color, #1e293b)',
            fontSize: '13px',
            fontWeight: 600
          }}>
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="student@vssut.ac.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid var(--border-color, #cbd5e1)',
              borderRadius: '10px',
              background: 'var(--input-bg, #ffffff)',
              color: 'var(--text-color, #0f172a)',
              fontSize: '14px'
            }}
          />

          <label htmlFor="password" style={{
            display: 'block',
            margin: '16px 0 7px',
            color: 'var(--text-color, #1e293b)',
            fontSize: '13px',
            fontWeight: 600
          }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid var(--border-color, #cbd5e1)',
              borderRadius: '10px',
              background: 'var(--input-bg, #ffffff)',
              color: 'var(--text-color, #0f172a)',
              fontSize: '14px'
            }}
          />

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
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Log In'}
          </button>

          <button
            type="button"
            className="demo-btn"
            onClick={handleDemoLogin}
            disabled={loading}
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '11px',
              background: 'rgba(79, 70, 229, 0.08)',
              border: '1px solid rgba(79, 70, 229, 0.25)',
              borderRadius: '10px',
              color: '#4f46e5',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            ⚡ Quick Demo Student Login
          </button>

          {message.text && (
            <p style={{
              marginTop: '16px',
              fontSize: '13px',
              textAlign: 'center',
              color: message.type === 'error' ? '#ef4444' : '#10b981'
            }}>
              {message.text}
            </p>
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
      </div>
    </div>
  );
}
