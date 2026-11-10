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

  const { login, demoLogin, loginWithGoogle } = useAuth();
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

  const handleGoogleAccountSelected = async (googleAccount) => {
    setLoading(true);
    try {
      await loginWithGoogle(googleAccount);
      setMessage({ text: `Signed in as ${googleAccount.name}! Redirecting...`, type: 'success' });
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 500);
    } catch (err) {
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
        maxWidth: '420px',
        padding: '38px 32px',
        borderRadius: '20px',
        background: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)'
      }}>
        <div className="logo" style={{
          marginBottom: '18px',
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
          fontSize: '24px',
          fontWeight: 800,
          color: 'var(--text-color, #0f172a)'
        }}>
          Welcome back
        </h1>

        <p className="subtitle" style={{
          marginBottom: '22px',
          color: 'var(--text-secondary, #64748b)',
          textAlign: 'center',
          fontSize: '13px',
          lineHeight: 1.6
        }}>
          Enter your details or continue with your Google account.
        </p>

        {/* ================= CONTINUE WITH GOOGLE BUTTON ================= */}
        <button
          type="button"
          className="google-btn"
          onClick={() => setIsGoogleModalOpen(true)}
          disabled={loading}
          style={{
            width: '100%',
            padding: '11px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            background: 'var(--card-bg)',
            color: 'var(--text-color)',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
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
          <span style={{ padding: '0 10px' }}>or with email</span>
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
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              background: 'var(--input-bg)',
              color: 'var(--text-color)',
              fontSize: '14px'
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid var(--border-color)',
              borderRadius: '10px',
              background: 'var(--input-bg)',
              color: 'var(--text-color)',
              fontSize: '14px'
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

      {/* Google Account Picker Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelected}
      />
    </div>
  );
}
