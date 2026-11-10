import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import ProfileModal from './ProfileModal';

export default function Navbar({
  notifications: propNotifications,
  onMarkAllRead,
  onNotificationAction,
  searchQuery: propSearchQuery = '',
  onSearchChange
}) {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const notifContext = useNotifications();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(propSearchQuery);

  const activeNotifications = propNotifications || notifContext?.notifications || [];
  const unreadCount = notifContext?.unreadCount ?? activeNotifications.filter(n => !n.read).length;

  const initials = (user?.name || 'SP')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="navbar">
        <NavLink to="/" className="logo">
          Project<span>Hub</span>
        </NavLink>

        <form className="search" onSubmit={handleSearchSubmit}>
          <span>⌕</span>
          <input
            type="text"
            id="searchInput"
            placeholder="Search projects, skills..."
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </form>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? 'active' : '')}>
            Projects
          </NavLink>
          <NavLink to="/members" className={({ isActive }) => (isActive ? 'active' : '')}>
            Members
          </NavLink>
          <NavLink to="/hackathons" className={({ isActive }) => (isActive ? 'active' : '')}>
            Hackathons
          </NavLink>
          <NavLink to="/messages" className={({ isActive }) => (isActive ? 'active' : '')}>
            Messages
          </NavLink>
        </nav>

        <div className="nav-right">
          {/* Theme Toggle Button */}
          <button
            id="themeToggleBtn"
            className="nav-icon-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            <i
              className={isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}
              style={{ color: isDark ? '#f59e0b' : '' }}
            ></i>
          </button>

          {/* Notifications Button */}
          <div style={{ position: 'relative' }}>
            <button
              id="notificationBtn"
              className="nav-icon-btn"
              onClick={() => setShowNotifications(prev => !prev)}
              title="Notifications"
            >
              <i className="fa-regular fa-bell"></i>
              {unreadCount > 0 && <span className="notification-dot"></span>}
            </button>

            {showNotifications && (
              <NotificationDropdown
                notifications={activeNotifications}
                onClose={() => setShowNotifications(false)}
                onMarkAllRead={onMarkAllRead || notifContext?.markAllRead}
                onAccept={(id, from) => notifContext?.acceptRequest(id, from)}
                onDismiss={(id) => notifContext?.removeNotification(id)}
                onAction={onNotificationAction}
              />
            )}
          </div>

          {/* Messages shortcut button */}
          <NavLink to="/messages" className="nav-icon-btn" title="Messages">
            <i className="fa-regular fa-envelope"></i>
          </NavLink>

          {/* Profile Avatar Button */}
          {isAuthenticated ? (
            <button
              type="button"
              className="avatar"
              id="profileAvatarBtn"
              onClick={() => setShowProfileModal(true)}
              title="Customize your profile"
              aria-label="Open your profile"
              style={{ overflow: 'hidden', padding: 0 }}
            >
              {user?.avatarImage || user?.profilePicture ? (
                <img
                  src={user.avatarImage || user.profilePicture}
                  alt={user?.name || 'Avatar'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                initials
              )}
            </button>
          ) : (
            <NavLink to="/login" className="primary-btn-sm" style={{ padding: '8px 14px' }}>
              Log In
            </NavLink>
          )}

          {/* Logout Button */}
          {isAuthenticated && (
            <button
              id="logoutBtn"
              className="nav-icon-btn"
              onClick={handleLogout}
              title="Log Out"
            >
              <i className="fa-solid fa-arrow-right-from-bracket"></i>
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="menu menu-btn"
            id="menuBtn"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Open mobile navigation"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-menu show" id="mobileMenu">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/projects" onClick={() => setMobileMenuOpen(false)}>
            Projects
          </NavLink>
          <NavLink to="/members" onClick={() => setMobileMenuOpen(false)}>
            Members
          </NavLink>
          <NavLink to="/hackathons" onClick={() => setMobileMenuOpen(false)}>
            Hackathons
          </NavLink>
          <NavLink to="/messages" onClick={() => setMobileMenuOpen(false)}>
            Messages
          </NavLink>
          <button
            onClick={() => {
              toggleTheme();
              setMobileMenuOpen(false);
            }}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '11px 14px',
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className={isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon'}></i>
            {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
          {isAuthenticated ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '11px 14px',
                background: 'transparent',
                border: 'none',
                color: '#f87171',
                cursor: 'pointer'
              }}
            >
              Log Out
            </button>
          ) : (
            <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
              Log In
            </NavLink>
          )}
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}
