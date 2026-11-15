import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ProjectHub Application Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('ph_current_user');
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: '#0f172a',
          color: '#f8fafc',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '440px',
            width: '100%',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '20px',
            padding: '36px 28px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#6366f1', marginBottom: '8px' }}>
              Project<span style={{ color: '#ffffff' }}>Hub</span>
            </div>
            <h2 style={{ fontSize: '20px', margin: '0 0 10px', color: '#ffffff' }}>
              Session Recovery
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '22px' }}>
              An issue occurred while loading this view. You can reload or reset your session to return to the sign in page.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid #334155',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Clear Cache & Return to Sign In
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
