import React from 'react';
import { NavLink } from 'react-router';
import { LayoutDashboard, Users, Briefcase, Calendar, MessageSquare, User } from 'lucide-react';
import './MobileBottomBar.css';

export default function MobileBottomBar({ role }) {
  const getNavItems = () => {
    const common = [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/directory', label: 'Directory', icon: Users },
      { to: '/jobs', label: 'Jobs', icon: Briefcase },
      { to: '/events', label: 'Events', icon: Calendar },
      { to: '/network', label: 'Network', icon: MessageSquare },
      { to: '/profile', label: 'Profile', icon: User }
    ];

    if (role === 'college_admin') {
      return [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/verification', label: 'Verify', icon: Users },
        { to: '/circulars', label: 'Notices', icon: Calendar },
        { to: '/college/complaints', label: 'Tickets', icon: MessageSquare },
        { to: '/college/profile', label: 'Profile', icon: User }
      ];
    }

    return common;
  };

  const navItems = getNavItems();

  return (
    <nav className="mobile-bottom-bar" aria-label="Mobile Bottom Navigation">
      <div className="mobile-bottom-bar-items">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `mobile-bottom-bar-item ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="mobile-bottom-bar-icon" size={20} />
              <span className="mobile-bottom-bar-label">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
