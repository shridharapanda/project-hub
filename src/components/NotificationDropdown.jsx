import React from 'react';

export default function NotificationDropdown({
  notifications = [],
  onClose,
  onMarkAllRead,
  onAction,
  onAccept,
  onDismiss
}) {
  const handleAccept = (n) => {
    if (onAccept) {
      onAccept(n.id, n.fromUser || n.title);
    } else if (onAction) {
      onAction(n.id, 'accept');
    }
  };

  const handleDismiss = (n) => {
    if (onDismiss) {
      onDismiss(n.id);
    } else if (onAction) {
      onAction(n.id, 'dismiss');
    }
  };
  return (
    <div className="notification-panel show">
      <div className="notification-header">
        <div>
          <h3>Notifications</h3>
          <p>Recent platform alerts & requests</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {notifications.some(n => !n.read) && (
            <button
              type="button"
              className="notif-mark-read-icon"
              onClick={onMarkAllRead}
              title="Mark all as read"
              aria-label="Mark all as read"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '11px',
                transition: 'all 0.15s ease'
              }}
            >
              <i className="fa-solid fa-check-double"></i>
            </button>
          )}
          <button
            className="notification-close"
            onClick={onClose}
            aria-label="Close notifications"
          >
            &times;
          </button>
        </div>
      </div>

      <div className="notification-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)', fontSize: '13px' }}>
            No new notifications
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="notification-item" style={{ opacity: n.read ? 0.7 : 1 }}>
              <div className="notification-icon">
                <i className={`fa-solid ${n.icon || 'fa-bell'}`}></i>
              </div>
              <div className="notif-body">
                <strong>{n.title}</strong>
                <p>{n.description}</p>
                <small>{n.time}</small>

                {(n.action === 'connect' || n.action === 'collab') && !n.read && (
                  <div className="notif-actions" style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                    <button
                      type="button"
                      className="notif-btn notif-accept-btn"
                      onClick={() => handleAccept(n)}
                      title="Accept request"
                      aria-label="Accept"
                      style={{ width: '24px', height: '24px', padding: 0, borderRadius: '6px' }}
                    >
                      <i className="fa-solid fa-check" style={{ fontSize: '11px' }}></i>
                    </button>
                    <button
                      type="button"
                      className="notif-btn notif-reject-btn"
                      onClick={() => handleDismiss(n)}
                      title="Reject request"
                      aria-label="Reject"
                      style={{ width: '24px', height: '24px', padding: 0, borderRadius: '6px' }}
                    >
                      <i className="fa-solid fa-xmark" style={{ fontSize: '11px' }}></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.some(n => !n.read) && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 12px' }}>
          <button
            type="button"
            className="mark-read-symbol-btn"
            onClick={onMarkAllRead}
            title="Mark all as read"
            aria-label="Mark all as read"
            style={{
              width: '32px',
              height: '32px',
              padding: 0,
              borderRadius: '50%',
              border: '1px solid var(--primary-border, rgba(99, 102, 241, 0.3))',
              background: 'var(--primary-tint, rgba(99, 102, 241, 0.08))',
              color: 'var(--primary, #4f46e5)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.15s ease'
            }}
          >
            <i className="fa-solid fa-check-double"></i>
          </button>
        </div>
      )}
    </div>
  );
}
