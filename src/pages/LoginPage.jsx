import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import GoogleAuthModal from '../components/GoogleAuthModal';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const { login, loginWithGoogle, user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state?.from?.pathname && location.state.from.pathname !== '/login' && location.state.from.pathname !== '/')
    ? location.state.from.pathname
    : '/home';

  const handleSubmit = async (e) => {
    e.preventDefault();
    let cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setMessage({ text: 'Please enter your Gmail address.', type: 'error' });
      return;
    }
    if (!cleanEmail.includes('@')) {
      cleanEmail = `${cleanEmail}@gmail.com`;
    }

    if (!password || password.length < 4) {
      setMessage({ text: 'Password must be at least 4 characters.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await login(cleanEmail, password);
      setMessage({ text: `Signed in as ${res.user?.name || cleanEmail}! Redirecting...`, type: 'success' });
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 350);
    } catch (err) {
      setMessage({ text: err.message || 'Login failed. Please verify your Gmail and password.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAccountSelected = async (googleAccount) => {
    setLoading(true);
    try {
      await loginWithGoogle(googleAccount);
      setMessage({ text: `Signed in via Google as ${googleAccount.name}! Redirecting...`, type: 'success' });
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 350);
    } catch (err) {
      console.error('Google sign-in error:', err);
      setMessage({ text: 'Google sign-in failed. Please try again.', type: 'error' });
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
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.1)'
      }}>
        <div className="logo" style={{
          marginBottom: '16px',
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
          Sign in to ProjectHub
        </h1>

        <p className="subtitle" style={{
          marginBottom: '22px',
          color: 'var(--text-secondary, #64748b)',
          textAlign: 'center',
          fontSize: '13px',
          lineHeight: 1.6
        }}>
          Give your Gmail ID & password or continue with Google.
        </p>

        {/* If user is already authenticated on this device, show quick continue banner */}
        {isAuthenticated && user && (
          <div style={{
            marginBottom: '20px',
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'var(--surface-subtle, #f8f9fa)',
            border: '1px solid var(--border-color, #e2e8f0)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', color: 'var(--text-color, #0f172a)', marginBottom: '8px' }}>
              Currently signed in as <strong>{user.name}</strong> ({user.email})
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => navigate('/home')}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Go to Home Feed →
              </button>
              <button
                type="button"
                onClick={logout}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  color: 'var(--text-secondary, #64748b)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        )}

        {/* ================= CONTINUE WITH GOOGLE BUTTON ================= */}
        <button
          type="button"
          className="google-btn"
          onClick={() => setIsGoogleModalOpen(true)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '12px',
            background: 'var(--card-bg, #ffffff)',
            color: 'var(--text-color, #0f172a)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
          }}
        >
          {/* Google SVG Logo */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '20px 0',
          color: 'var(--text-secondary, #94a3b8)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em'
        }}>
          <span style={{ flex: 1, borderBottom: '1px solid var(--border-color, #e2e8f0)' }}></span>
          <span style={{ padding: '0 10px' }}>or with gmail id</span>
          <span style={{ flex: 1, borderBottom: '1px solid var(--border-color, #e2e8f0)' }}></span>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={{
            display: 'block',
            margin: '12px 0 6px',
            color: 'var(--text-color, #1e293b)',
            fontSize: '13px',
            fontWeight: 600
          }}>
            Gmail ID / Email
          </label>
          <input
            id="email"
            type="text"
            required
            autoComplete="email"
            placeholder="e.g. yourname@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          <label htmlFor="password" style={{
            display: 'block',
            margin: '12px 0 6px',
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
            placeholder="Enter password (min 4 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In with Gmail →'}
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
              Register with Gmail
            </Link>
          </div>
        </form>
      </div>

      {/* Google Account Picker Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelected}
      />
    </div>
  );
}
