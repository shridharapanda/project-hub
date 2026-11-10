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
        <button
          className="notification-close"
          onClick={onClose}
          aria-label="Close notifications"
        >
          &times;
        </button>
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
                  <div className="notif-actions" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      type="button"
                      className="primary-btn-sm notif-btn"
                      onClick={() => handleAccept(n)}
                    >
                      {n.action === 'collab' ? 'Accept Request' : 'Connect'}
                    </button>
                    <button
                      type="button"
                      className="secondary-btn-sm notif-btn"
                      onClick={() => handleDismiss(n)}
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.some(n => !n.read) && (
        <button className="mark-read-btn" onClick={onMarkAllRead}>
          ✓ Mark all as read
        </button>
      )}
    </div>
  );
}
