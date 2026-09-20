import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Bell, Menu, User, Settings, LogOut, ChevronDown, Sun, Moon, Monitor, CheckCheck } from 'lucide-react';
import Avatar from '../ui/Avatar';
import './TopBar.css';

export default function TopBar({ onMenuToggle, title, onToggleCommandMenu }) {
  const { user, logout } = useAuth();
  const { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useRef(useNavigate());
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const renderThemeIcon = () => {
    if (theme === 'light') return <Sun size={18} />;
    if (theme === 'dark') return <Moon size={18} />;
    return <Monitor size={18} />;
  };

  const userNotifications = getNotifications(user?.role, user?.id, user?.collegeId) || [];
  const unreadCount = userNotifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate.current('/login');
  };

  const handleMarkAllRead = () => {
    if (typeof markAllNotificationsAsRead === 'function') {
      markAllNotificationsAsRead(user?.role, user?.id);
    } else {
      userNotifications.forEach(n => markNotificationAsRead(n.id));
    }
  };

  const handleNotifClick = (notif) => {
    markNotificationAsRead(notif.id);
    setNotifOpen(false);

    let target = notif.link;

    if (target) {
      if (target === '/messages' || target === '/message') target = '/network';
      if (target === '/complaints') {
        target = user?.role === 'college_admin' ? '/college/complaints' : '/student/complaints';
      }
    } else {
      const titleLower = (notif.title || '').toLowerCase();
      const contentLower = (notif.content || notif.message || '').toLowerCase();
      const typeLower = (notif.type || '').toLowerCase();

      if (titleLower.includes('resume') || typeLower.includes('resume') || contentLower.includes('resume')) {
        target = user?.role === 'student' ? '/directory' : '/dashboard?tab=guidance';
      } else if (titleLower.includes('job') || contentLower.includes('job') || typeLower === 'job') {
        target = '/jobs';
      } else if (titleLower.includes('event') || titleLower.includes('rsvp') || titleLower.includes('registration') || titleLower.includes('hackathon') || contentLower.includes('event') || typeLower === 'event') {
        target = '/events';
      } else if (titleLower.includes('survey') || contentLower.includes('survey') || typeLower === 'survey') {
        target = '/surveys';
      } else if (titleLower.includes('blog') || titleLower.includes('story') || contentLower.includes('story') || typeLower === 'blog') {
        target = '/blogs';
      } else if (titleLower.includes('message') || contentLower.includes('message') || titleLower.includes('connect') || contentLower.includes('connect') || typeLower === 'message') {
        target = '/network';
      } else if (titleLower.includes('complaint') || contentLower.includes('complaint') || titleLower.includes('report') || contentLower.includes('report') || typeLower === 'complaint') {
        target = user?.role === 'college_admin' ? '/college/complaints' : '/student/complaints';
      } else if (titleLower.includes('notice') || titleLower.includes('announcement') || titleLower.includes('circular') || contentLower.includes('notice') || contentLower.includes('circular') || typeLower === 'circular') {
        target = '/circulars';
      } else if (user?.role === 'college_admin' && (notif.role === 'college_admin' || titleLower.includes('verify') || contentLower.includes('verify'))) {
        target = '/verification';
      } else {
        target = '/dashboard';
      }
    }

    if (target) {
      navigate.current(target);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuToggle} aria-label="Toggle Menu">
          <Menu size={20} />
        </button>
        <h2 className="topbar-title">{title}</h2>
      </div>

      <div className="topbar-right">
        {/* Command Menu Shortcut Hint */}
        <button 
          className="topbar-shortcut-btn hide-mobile" 
          onClick={onToggleCommandMenu}
          title="Search anything (Ctrl+K)"
        >
          <span>Search...</span>
          <kbd className="topbar-kbd">Ctrl K</kbd>
        </button>

        {/* Theme Mode Toggle Button */}
        <button
          className="topbar-icon-btn"
          onClick={cycleTheme}
          title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)} (Click to switch)`}
          aria-label="Switch theme mode"
        >
          {renderThemeIcon()}
        </button>

        {/* Notifications */}
        <div className="topbar-notif-container" ref={notifRef}>
          <button 
            className="topbar-icon-btn" 
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="topbar-notif-badge">{unreadCount}</span>}
          </button>
          
          {notifOpen && (
            <div className="topbar-notif-dropdown">
              <div className="topbar-notif-header">
                <div className="topbar-notif-title-group">
                  <span className="topbar-notif-heading">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="topbar-notif-count-pill">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    type="button" 
                    onClick={handleMarkAllRead} 
                    className="topbar-mark-read-btn"
                    title="Mark all notifications as read"
                  >
                    <CheckCheck size={13} />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>
              <div className="topbar-notif-list">
                {userNotifications.length === 0 ? (
                  <div className="topbar-notif-empty">
                    <div className="topbar-notif-empty-icon">
                      <Bell size={24} />
                    </div>
                    <span>No new notifications</span>
                  </div>
                ) : (
                  userNotifications.map(notif => (
                    <button 
                      key={notif.id} 
                      className={`topbar-notif-item ${!notif.read ? 'unread' : ''}`}
                      onClick={() => handleNotifClick(notif)}
                    >
                      <div className="topbar-notif-item-header">
                        <span className="topbar-notif-item-title">{notif.title}</span>
                        {!notif.read && <span className="topbar-notif-unread-dot" />}
                      </div>
                      <div className="topbar-notif-item-msg">{notif.message || notif.content}</div>
                      {notif.date && (
                        <div className="topbar-notif-item-time">
                          {new Date(notif.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        {user && (
          <div className="topbar-user-container" ref={dropdownRef}>
            <button 
              className="topbar-user-trigger" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Avatar 
                src={user.avatarUrl} 
                name={user.name} 
                role={user.role} 
                size="sm" 
              />
              <span className="topbar-username hide-mobile">{user.name}</span>
              <ChevronDown size={14} className="topbar-chevron" />
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu topbar-dropdown-menu">
                <div className="topbar-dropdown-header">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs text-secondary capitalize">{user.role.replace('_', ' ')}</div>
                </div>
                <div className="dropdown-divider" />
                {(user.role === 'alumni' || user.role === 'student') && (
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <User size={16} /> My Profile
                  </Link>
                )}
                <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <Settings size={16} /> Settings
                </Link>
                <div className="dropdown-divider" />
                <button className="dropdown-item text-danger w-full" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
