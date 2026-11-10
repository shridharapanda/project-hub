import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialNotifications } from '../services/mockData';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user, updateProfile } = useAuth();

  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('ph_notifications');
      return stored ? JSON.parse(stored) : initialNotifications;
    } catch (e) {
      return initialNotifications;
    }
  });

  // Sync state to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('ph_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage quota error', e);
    }
  }, [notifications]);

  // Listen to custom window events for immediate multi-component notification sync
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem('ph_notifications');
        if (stored) {
          setNotifications(JSON.parse(stored));
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('ph_notification_event', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('ph_notification_event', handleSync);
    };
  }, []);

  const addNotification = (notif) => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      icon: notif.icon || 'fa-bell',
      title: notif.title || 'Platform Notification',
      description: notif.description || '',
      time: 'Just now',
      read: false,
      action: notif.action || null,
      fromUser: notif.fromUser || null,
      ...notif
    };

    setNotifications(prev => {
      const updated = [newNotif, ...prev];
      try {
        localStorage.setItem('ph_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    window.dispatchEvent(new Event('ph_notification_event'));
  };

  const markAllRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      try {
        localStorage.setItem('ph_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    window.dispatchEvent(new Event('ph_notification_event'));
  };

  const removeNotification = (id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      try {
        localStorage.setItem('ph_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    window.dispatchEvent(new Event('ph_notification_event'));
  };

  const acceptRequest = (notifId, requesterName) => {
    // Increment connection count for current user
    if (user && updateProfile) {
      updateProfile({
        connectionsCount: (user.connectionsCount || 0) + 1
      });
    }

    setNotifications(prev => {
      const updated = prev.map(n => {
        if (n.id === notifId) {
          return {
            ...n,
            read: true,
            action: null,
            description: `You are now connected with ${requesterName || n.fromUser || 'this student'}! ✓`
          };
        }
        return n;
      });
      try {
        localStorage.setItem('ph_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    window.dispatchEvent(new Event('ph_notification_event'));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllRead,
        removeNotification,
        acceptRequest
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
