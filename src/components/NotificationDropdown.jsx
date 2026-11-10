import React from 'react';

export default function NotificationDropdown({ notifications, onClose, onMarkAllRead, onAction }) {
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

                {n.action === 'connect' && !n.read && (
                  <div className="notif-actions">
                    <button
                      className="primary-btn-sm notif-btn"
                      onClick={() => onAction(n.id, 'accept')}
                    >
                      Connect
                    </button>
                    <button
                      className="secondary-btn-sm notif-btn"
                      onClick={() => onAction(n.id, 'dismiss')}
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
