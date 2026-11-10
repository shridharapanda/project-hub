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
      fromName: notif.fromName || user?.name || null,
      fromEmail: notif.fromEmail || user?.email || null,
      toName: notif.toName || null,
      toEmail: notif.toEmail || null,
      status: notif.status || 'pending',
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
    const userEmailNorm = (user?.email || '').toLowerCase().trim();
    const userNameNorm = (user?.name || '').toLowerCase().trim();

    setNotifications(prev => {
      const updated = prev.map(n => {
        const targetEmail = (n.toEmail || '').toLowerCase().trim();
        const targetName = (n.toName || '').toLowerCase().trim();
        const matchesUser = !n.toEmail || (userEmailNorm && targetEmail === userEmailNorm) || (userNameNorm && targetName === userNameNorm);
        return matchesUser ? { ...n, read: true } : n;
      });
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

  const acceptRequest = (notifId) => {
    const notif = notifications.find(n => n.id === notifId);
    if (!notif) return;

    if (notif.action === 'connect') {
      // 1. Increment connection count for recipient (current user)
      if (user && updateProfile) {
        updateProfile({
          connectionsCount: (user.connectionsCount || 0) + 1
        });
      }

      // 2. Increment connection count for requester in user database
      try {
        const db = JSON.parse(localStorage.getItem('ph_users_db') || '{}');
        const reqEmail = (notif.fromEmail || '').toLowerCase().trim();
        if (reqEmail && db[reqEmail]) {
          db[reqEmail].connectionsCount = (db[reqEmail].connectionsCount || 0) + 1;
          localStorage.setItem('ph_users_db', JSON.stringify(db));
        }
      } catch (e) {}

      // 3. Record reciprocal connection in ph_connections
      try {
        const connMap = JSON.parse(localStorage.getItem('ph_connections') || '{}');
        const myKey = (user?.email || user?.name || '').toLowerCase().trim();
        const theirKey = (notif.fromEmail || notif.fromName || '').toLowerCase().trim();

        if (myKey && theirKey) {
          connMap[myKey] = connMap[myKey] || [];
          if (!connMap[myKey].includes(theirKey)) connMap[myKey].push(theirKey);

          connMap[theirKey] = connMap[theirKey] || [];
          if (!connMap[theirKey].includes(myKey)) connMap[theirKey].push(myKey);

          localStorage.setItem('ph_connections', JSON.stringify(connMap));
        }
      } catch (e) {}

      // 4. Send acceptance notification back to requester
      const acceptanceNotif = {
        id: 'notif-' + Date.now(),
        icon: 'fa-user-check',
        title: 'Connection Accepted 🎉',
        description: `${user?.name || 'A builder'} accepted your connection request!`,
        toEmail: notif.fromEmail,
        toName: notif.fromName,
        fromEmail: user?.email,
        fromName: user?.name,
        time: 'Just now',
        read: false
      };

      setNotifications(prev => {
        const updated = [
          acceptanceNotif,
          ...prev.map(n => n.id === notifId ? {
            ...n,
            read: true,
            action: null,
            status: 'accepted',
            description: `You are now connected with ${notif.fromName || 'this student'}! ✓`
          } : n)
        ];
        try {
          localStorage.setItem('ph_notifications', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    } else if (notif.action === 'collab') {
      // Collaboration Accepted
      const acceptanceNotif = {
        id: 'notif-' + Date.now(),
        icon: 'fa-circle-check',
        title: 'Collaboration Accepted 🤝',
        description: `${user?.name || 'Project lead'} accepted you into "${notif.projectTitle}" as ${notif.role}!`,
        toEmail: notif.fromEmail,
        toName: notif.fromName,
        fromEmail: user?.email,
        fromName: user?.name,
        time: 'Just now',
        read: false
      };

      setNotifications(prev => {
        const updated = [
          acceptanceNotif,
          ...prev.map(n => n.id === notifId ? {
            ...n,
            read: true,
            action: null,
            status: 'accepted',
            description: `Accepted ${notif.fromName} into "${notif.projectTitle}" as ${notif.role}! ✓`
          } : n)
        ];
        try {
          localStorage.setItem('ph_notifications', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }

    window.dispatchEvent(new Event('ph_notification_event'));
    window.dispatchEvent(new Event('ph_connections_updated'));
  };

  // Only display notifications meant for the current user
  const userEmailNorm = (user?.email || '').toLowerCase().trim();
  const userNameNorm = (user?.name || '').toLowerCase().trim();

  const visibleNotifications = notifications.filter(n => {
    if (!user) return true;
    const targetEmail = (n.toEmail || '').toLowerCase().trim();
    const targetName = (n.toName || '').toLowerCase().trim();

    // If targeted to a specific user, only that user should see it
    if (targetEmail || targetName) {
      return (userEmailNorm && targetEmail === userEmailNorm) ||
             (userNameNorm && targetName === userNameNorm);
    }
    // General or system broadcast
    return true;
  });

  const unreadCount = visibleNotifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: visibleNotifications,
        allNotifications: notifications,
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
