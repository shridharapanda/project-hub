import React, { useState } from 'react';

export default function GoogleAuthModal({ isOpen, onClose, onSelectAccount }) {
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  if (!isOpen) return null;

  const accounts = [
    {
      name: "Shridhara Panda",
      email: "shridhara.panda@gmail.com",
      avatar: "SP",
      college: "VSSUT, Burla"
    },
    {
      name: "Student Developer",
      email: "student.vssut@gmail.com",
      avatar: "SD",
      college: "VSSUT, Burla"
    }
  ];

  const handleChoose = (acc) => {
    onSelectAccount(acc);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    const name = customName.trim() || customEmail.split('@')[0];
    onSelectAccount({
      name,
      email: customEmail.trim(),
      avatar: name.slice(0, 2).toUpperCase(),
      college: "VSSUT, Burla"
    });
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
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--card-solid)',
          border: '1px solid var(--border)',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          padding: '28px 24px'
        }}
      >
        {/* Header with Google Logo */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" style={{ marginBottom: '10px' }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-color, #1e293b)' }}>
            Choose an account
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary, #64748b)', marginTop: '4px' }}>
            to continue to <strong>ProjectHub</strong>
          </p>
        </div>

        {!customMode ? (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {accounts.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChoose(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    borderRadius: '12px',
                    background: 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--panel-light, #f8fafc)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4285F4, #34A853)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '13px',
                      flexShrink: 0
                    }}
                  >
                    {acc.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-color, #1e293b)' }}>
                      {acc.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary, #64748b)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {acc.email}
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right" style={{ fontSize: '11px', color: 'var(--text-secondary, #94a3b8)' }}></i>
                </button>
              ))}

              {/* Use another account button */}
              <button
                type="button"
                onClick={() => setCustomMode(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  width: '100%',
                  padding: '12px 14px',
                  border: '1px dashed var(--border-color, #cbd5e1)',
                  borderRadius: '12px',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginTop: '4px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--panel-light, #f8fafc)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--border-color, #e2e8f0)',
                    color: 'var(--text-secondary, #64748b)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0
                  }}
                >
                  <i className="fa-solid fa-user-plus"></i>
                </div>
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-color, #1e293b)' }}>
                  Use another Google account
                </div>
              </button>
            </div>

            <div style={{ marginTop: '22px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary, #64748b)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-color)' }}>
                Your Name
              </label>
              <input
                type="text"
                placeholder="Shridhara Panda"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  color: 'var(--text-color)'
                }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--text-color)' }}>
                Google Email
              </label>
              <input
                type="email"
                required
                placeholder="your.email@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  background: 'var(--input-bg)',
                  color: 'var(--text-color)'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setCustomMode(false)}
                className="outline-btn"
                style={{ flex: 1, padding: '10px' }}
              >
                Back
              </button>
              <button
                type="submit"
                className="primary-btn"
                style={{ flex: 1, padding: '10px' }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
