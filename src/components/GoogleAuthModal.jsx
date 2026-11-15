import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

function formatGoogleProfile(emailInput, customName, customCollege) {
  let email = (emailInput || '').trim().toLowerCase();
  if (!email) {
    email = 'student.builder@gmail.com';
  } else if (!email.includes('@')) {
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
      displayName = 'Google Student';
    }
  }

  const college = (customCollege || '').trim() || 'Student Innovator';

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

export default function GoogleAuthModal({ isOpen, onClose, onSelectAccount }) {
  const { isDark } = useTheme();
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleCollege, setGoogleCollege] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [error, setError] = useState('');

  // Load accounts previously signed in on this specific device
  const [savedAccounts, setSavedAccounts] = useState(() => {
    try {
      const stored = localStorage.getItem('ph_device_google_accounts');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

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
      // Save to device storage for quick 1-click select next time
      const existing = savedAccounts.filter(a => a.email.toLowerCase() !== accountObj.email.toLowerCase());
      const updated = [accountObj, ...existing].slice(0, 4);
      setSavedAccounts(updated);
      localStorage.setItem('ph_device_google_accounts', JSON.stringify(updated));
    } catch (err) {}

    onSelectAccount(accountObj);
    onClose();
  };

  const handleInstantSignIn = () => {
    const instantAccount = formatGoogleProfile('student.google@gmail.com', 'Google Student', 'Engineering College');
    commitAccount(instantAccount);
  };

  const handleChooseSaved = (acc) => {
    commitAccount(acc);
  };

  const handleRemoveSaved = (e, emailToRemove) => {
    e.stopPropagation();
    try {
      const updated = savedAccounts.filter(a => a.email.toLowerCase() !== emailToRemove.toLowerCase());
      setSavedAccounts(updated);
      localStorage.setItem('ph_device_google_accounts', JSON.stringify(updated));
    } catch (err) {}
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = googleEmail.trim();

    // If user clicked submit with empty email, proceed with clean Google account
    const accountObj = formatGoogleProfile(cleanEmail, googleName, googleCollege);
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
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
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
        {/* Close 'X' button */}
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

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" style={{ marginBottom: '8px' }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: textColor }}>
            Sign in with Google
          </h2>
          <p style={{ fontSize: '13px', color: textMuted, marginTop: '4px', marginBottom: 0 }}>
            to continue to <strong>Student Project Hub</strong>
          </p>
        </div>

        {/* 1. Saved Accounts on this Device */}
        {savedAccounts.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: textMuted, marginBottom: '8px' }}>
              Choose an account
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {savedAccounts.map((acc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleChooseSaved(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '11px 13px',
                    borderRadius: '12px',
                    border: `1px solid ${borderColor}`,
                    background: surfaceSubtle,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4285F4, #34A853)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      flexShrink: 0
                    }}
                  >
                    {acc.avatar || acc.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: textColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '12px', color: textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {acc.email}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleRemoveSaved(e, acc.email)}
                    title="Remove from device"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: textMuted,
                      cursor: 'pointer',
                      padding: '4px 6px',
                      fontSize: '12px',
                      borderRadius: '4px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '18px 0 14px',
              color: textMuted,
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              <span style={{ flex: 1, borderBottom: `1px solid ${borderColor}` }}></span>
              <span style={{ padding: '0 10px' }}>or enter gmail</span>
              <span style={{ flex: 1, borderBottom: `1px solid ${borderColor}` }}></span>
            </div>
          </div>
        )}

        {/* 2. Fast Single-Field Gmail Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px', color: textColor }}>
              Your Google / Gmail Address
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. rahul.sharma@gmail.com"
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
            <div style={{ fontSize: '11px', color: textMuted, marginTop: '4px' }}>
              Your profile name & avatar will be automatically created from your Gmail.
            </div>
          </div>

          {/* Optional Expandable Fields */}
          {!showOptionalFields ? (
            <button
              type="button"
              onClick={() => setShowOptionalFields(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#4285F4',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
                marginBottom: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <i className="fa-solid fa-sliders" style={{ fontSize: '11px' }}></i>
              + Customize name or college (optional)
            </button>
          ) : (
            <div style={{
              background: surfaceSubtle,
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '16px'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, marginBottom: '4px', color: textColor }}>
                  Custom Display Name (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${borderColor}`,
                    background: inputBg,
                    color: textColor,
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, marginBottom: '4px', color: textColor }}>
                  College / University (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. VSSUT, Burla / IIT"
                  value={googleCollege}
                  onChange={(e) => setGoogleCollege(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: `1px solid ${borderColor}`,
                    background: inputBg,
                    color: textColor,
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>
              {error}
            </div>
          )}

          {/* Primary Submit Button */}
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
              transition: 'background 0.15s ease',
              boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)'
            }}
          >
            Continue with this Google Account →
          </button>

          {/* 3. Instant 1-Tap Quick Sign-In Option */}
          <button
            type="button"
            onClick={handleInstantSignIn}
            style={{
              width: '100%',
              marginTop: '10px',
              padding: '10px 14px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: surfaceSubtle,
              color: textColor,
              border: `1px solid ${borderColor}`,
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            <i className="fa-solid fa-bolt" style={{ color: '#FBBC05' }}></i>
            ⚡ Instant 1-Tap Google Sign-In (No typing)
          </button>
        </form>

        {/* Footer info & Cancel */}
        <div style={{ marginTop: '18px', textAlign: 'center' }}>
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
