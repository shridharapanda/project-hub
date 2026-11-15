import React, { useState } from 'react';

export default function GoogleAuthModal({ isOpen, onClose, onSelectAccount }) {
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleCollege, setGoogleCollege] = useState('');
  const [error, setError] = useState('');

  // Load only accounts previously saved on THIS device by THIS user
  const [savedAccounts, setSavedAccounts] = useState(() => {
    try {
      const stored = localStorage.getItem('ph_device_google_accounts');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [isAddingNew, setIsAddingNew] = useState(() => {
    try {
      const stored = localStorage.getItem('ph_device_google_accounts');
      return !(stored && JSON.parse(stored).length > 0);
    } catch (e) {
      return true;
    }
  });

  if (!isOpen) return null;

  const handleChoose = (acc) => {
    onSelectAccount(acc);
    onClose();
  };

  const handleGoogleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter your valid Gmail / Google email address.');
      return;
    }

    const cleanName = googleName.trim() || cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const cleanCollege = googleCollege.trim() || 'Engineering Student';

    const accountObj = {
      name: cleanName,
      email: cleanEmail,
      avatar: cleanName.slice(0, 2).toUpperCase(),
      college: cleanCollege,
      provider: 'google'
    };

    // Save this account to this device for future 1-click login
    try {
      const existing = savedAccounts.filter(a => a.email.toLowerCase() !== cleanEmail);
      const updated = [accountObj, ...existing].slice(0, 3);
      setSavedAccounts(updated);
      localStorage.setItem('ph_device_google_accounts', JSON.stringify(updated));
    } catch (err) {}

    onSelectAccount(accountObj);
    onClose();
  };

  return (
    <div
      className="modal-backdrop show active"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '20px'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'var(--card-solid, #ffffff)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          padding: '28px 24px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <svg width="34" height="34" viewBox="0 0 24 24" style={{ marginBottom: '8px' }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            Sign in with Google
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '4px', marginBottom: 0 }}>
            to continue to <strong>Student Project Hub</strong>
          </p>
        </div>

        {/* If user previously logged in on THIS device, let them choose or add new */}
        {!isAddingNew && savedAccounts.length > 0 ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {savedAccounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChoose(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-subtle)',
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
                      fontWeight: 700
                    }}
                  >
                    {acc.avatar || acc.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {acc.email}
                    </div>
                  </div>
                </button>
              ))}

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
                  border: '1px dashed var(--border)',
                  background: 'transparent',
                  color: 'var(--primary, #6366f1)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                <i className="fa-solid fa-user-plus" style={{ fontSize: '14px' }}></i> Use another Google account
              </button>
            </div>
          </div>
        ) : (
          /* New User / Friend Entering Their Own Gmail */
          <form onSubmit={handleGoogleSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: 'var(--text-primary)' }}>
                Your Google / Gmail Address *
              </label>
              <input
                type="email"
                required
                autoFocus
                placeholder="yourname@gmail.com"
                value={googleEmail}
                onChange={(e) => {
                  setGoogleEmail(e.target.value);
                  setError('');
                }}
                style={{
                  width: '100%',
                  padding: '11px 13px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--input-bg, #ffffff)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: 'var(--text-primary)' }}>
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 13px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--input-bg, #ffffff)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '5px', color: 'var(--text-primary)' }}>
                Your College / University
              </label>
              <input
                type="text"
                placeholder="e.g. VSSUT, Burla / NIT / IIT"
                value={googleCollege}
                onChange={(e) => setGoogleCollege(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 13px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--input-bg, #ffffff)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
            </div>

            {error && (
              <p style={{ color: '#ef4444', fontSize: '12px', margin: '0 0 12px' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="primary-btn"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 700,
                justifyContent: 'center',
                background: '#4285F4',
                borderColor: '#4285F4'
              }}
            >
              Continue with Google Account →
            </button>

            {savedAccounts.length > 0 && (
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  padding: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--muted)',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                ← Back to saved accounts
              </button>
            )}
          </form>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--muted)',
              fontSize: '12.5px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
