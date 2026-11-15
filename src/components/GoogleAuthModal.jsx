import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const DEFAULT_DEVICE_ACCOUNT = {
  name: 'Shridhara Panda',
  email: 'shridhara.panda@gmail.com',
  avatar: 'SP',
  college: 'VSSUT, Burla',
  role: 'Student Builder & Founder',
  isDeviceAccount: true,
  provider: 'google'
};

function formatGoogleProfile(emailInput, customName, customCollege) {
  let email = (emailInput || '').trim().toLowerCase();
  if (!email) {
    return DEFAULT_DEVICE_ACCOUNT;
  }
  if (!email.includes('@')) {
    email = `${email}@gmail.com`;
  }

  // Derive human-readable name from email if customName is not provided
  let displayName = (customName || '').trim();
  if (!displayName) {
    const username = email.split('@')[0];
    displayName = username
      .replace(/[._\-+]/g, ' ')
      .replace(/\d+/g, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    if (!displayName) {
      displayName = 'Student Builder';
    }
  }

  const college = (customCollege || '').trim() || 'Engineering Student';

  // Extract clean initials
  const words = displayName.split(/\s+/).filter(Boolean);
  const initials = words.length >= 2
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : displayName.slice(0, 2).toUpperCase();

  return {
    name: displayName,
    email: email,
    avatar: initials,
    college: college,
    provider: 'google',
    role: 'Student Builder'
  };
}

// Parse Google JWT ID token
function parseGoogleJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function GoogleAuthModal({ isOpen, onClose, onSelectAccount }) {
  const { isDark } = useTheme();
  const [googleEmail, setGoogleEmail] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [error, setError] = useState('');

  // Device Google Accounts list
  const [deviceAccounts, setDeviceAccounts] = useState(() => {
    try {
      const stored = localStorage.getItem('ph_device_google_accounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return [DEFAULT_DEVICE_ACCOUNT];
    } catch (e) {
      return [DEFAULT_DEVICE_ACCOUNT];
    }
  });

  // Check for native Google Identity Services (GIS)
  useEffect(() => {
    if (!isOpen) return;

    const clientId = localStorage.getItem('ph_google_client_id');
    if (window.google?.accounts?.id && clientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              const payload = parseGoogleJwt(response.credential);
              if (payload) {
                const words = (payload.name || '').trim().split(/\s+/).filter(Boolean);
                const initials = words.length >= 2
                  ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
                  : (payload.name || 'G').slice(0, 2).toUpperCase();

                const accountObj = {
                  name: payload.name || payload.email.split('@')[0],
                  email: payload.email,
                  avatar: initials,
                  picture: payload.picture || null,
                  college: 'Student Builder',
                  provider: 'google',
                  role: 'Student Builder'
                };
                commitAccount(accountObj);
              }
            }
          }
        });
        window.google.accounts.id.prompt();
      } catch (err) {
        console.warn('GIS prompt unavailable:', err);
      }
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commitAccount = (accountObj) => {
    try {
      const existing = deviceAccounts.filter(a => a.email.toLowerCase() !== accountObj.email.toLowerCase());
      const updated = [accountObj, ...existing].slice(0, 4);
      setDeviceAccounts(updated);
      localStorage.setItem('ph_device_google_accounts', JSON.stringify(updated));
    } catch (err) {}

    onSelectAccount(accountObj);
    onClose();
  };

  const handleChooseAccount = (acc) => {
    commitAccount(acc);
  };

  const handleSubmitNewEmail = (e) => {
    e.preventDefault();
    const clean = googleEmail.trim();
    if (!clean) {
      setError('Please enter your Google / Gmail email address.');
      return;
    }
    const accountObj = formatGoogleProfile(clean);
    commitAccount(accountObj);
  };

  const cardBg = isDark ? '#202124' : '#ffffff';
  const textColor = isDark ? '#e8eaed' : '#202124';
  const textMuted = isDark ? '#9aa0a6' : '#5f6368';
  const borderColor = isDark ? '#3c4043' : '#dadce0';
  const surfaceSubtle = isDark ? '#303134' : '#f8f9fa';
  const inputBg = isDark ? '#171717' : '#ffffff';

  return (
    <div
      className="modal-backdrop show active"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          background: cardBg,
          color: textColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          padding: '28px 24px',
          position: 'relative',
          animation: 'modalIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'transparent',
            border: 'none',
            color: textMuted,
            fontSize: '18px',
            cursor: 'pointer',
            padding: '6px 10px',
            borderRadius: '50%',
            lineHeight: 1
          }}
          title="Close"
        >
          ✕
        </button>

        {/* Google Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" style={{ marginBottom: '8px' }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: textColor }}>
            Choose a Google Account
          </h2>
          <p style={{ fontSize: '13px', color: textMuted, marginTop: '4px', marginBottom: 0 }}>
            to continue to <strong>Student Project Hub</strong>
          </p>
        </div>

        {/* List of Device Google Accounts */}
        {!isAddingNew ? (
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: textMuted,
              marginBottom: '10px'
            }}>
              Google Accounts on this device
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {deviceAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChooseAccount(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: `1.5px solid ${borderColor}`,
                    background: surfaceSubtle,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4285F4';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = borderColor;
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  {/* Google Avatar */}
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4285F4, #34A853)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      flexShrink: 0,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                    }}
                  >
                    {acc.avatar || acc.name.slice(0, 2).toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: textColor,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {acc.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: textMuted,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {acc.email}
                    </div>
                  </div>

                  <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: 'rgba(66, 133, 244, 0.1)',
                    color: '#4285F4',
                    flexShrink: 0
                  }}>
                    Continue →
                  </div>
                </button>
              ))}

              {/* Use another Google Account */}
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: `1px dashed ${borderColor}`,
                  background: 'transparent',
                  color: '#4285F4',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginTop: '4px'
                }}
              >
                <i className="fa-solid fa-user-plus" style={{ fontSize: '14px' }}></i>
                Use another Google Account on this device
              </button>
            </div>
          </div>
        ) : (
          /* Use Another Google Account Form */
          <form onSubmit={handleSubmitNewEmail}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px', color: textColor }}>
                Enter your Google / Gmail account
              </label>
              <input
                type="text"
                autoFocus
                placeholder="yourname@gmail.com"
                value={googleEmail}
                onChange={(e) => {
                  setGoogleEmail(e.target.value);
                  setError('');
                }}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: `1px solid ${borderColor}`,
                  background: inputBg,
                  color: textColor,
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ fontSize: '11.5px', color: textMuted, marginTop: '5px' }}>
                You will be signed in with this Google account on this device.
              </div>
            </div>

            {error && (
              <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: '#4285F4',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)'
              }}
            >
              Continue with this Google Account →
            </button>

            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                color: textMuted,
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              ← Back to Google accounts on this device
            </button>
          </form>
        )}

        {/* Footer info & Cancel */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: textMuted,
              fontSize: '12.5px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
