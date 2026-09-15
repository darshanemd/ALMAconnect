import React from 'react';
import { NavLink } from 'react-router';
import { useData } from '../../contexts/DataContext';
import { 
  LayoutDashboard, Users, Briefcase, Calendar, Heart, BookOpen, 
  Network, GraduationCap, CreditCard, Shield, Upload, Building, 
  Settings, ChevronLeft, ChevronRight, ClipboardList, FileText, Sparkles, TrendingUp, Bell, MessageSquareWarning, X
} from 'lucide-react';
import AlumniConnectLogo from '../ui/AlumniConnectLogo';
import './Sidebar.css';

export default function Sidebar({ role, collapsed, mobileOpen, onToggle, onNavClick }) {
  const { circulars, lastSeenCircularsTime } = useData();
  const unreadCount = (circulars || []).filter(c => new Date(c.createdAt) > new Date(lastSeenCircularsTime)).length;
  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/circulars', label: 'Circulars & Notices', icon: Bell },
          { to: '/student/resume-analyzer', label: 'AI Resume Analyzer', icon: FileText },
          { to: '/student/skill-gap', label: 'Skill Gap Detector', icon: Sparkles },
          { to: '/student/placement-predictor', label: 'Placement Predictor', icon: TrendingUp },
          { to: '/directory', label: 'Alumni Directory', icon: Users },
          { to: '/jobs', label: 'Job Portal', icon: Briefcase },
          { to: '/events', label: 'Events & Reunions', icon: Calendar },
          { to: '/blog', label: 'Blog & News', icon: BookOpen },
          { to: '/network', label: 'My Network', icon: Network },
          { to: '/mentorship', label: 'Mentorship', icon: GraduationCap },
          { to: '/card', label: 'Smart ID Card', icon: CreditCard },
          { to: '/surveys', label: 'Surveys', icon: ClipboardList },
          { to: '/student/complaints', label: 'Complaints & Reports', icon: MessageSquareWarning },
        ];
      case 'alumni':
        return [
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/circulars', label: 'Circulars & Notices', icon: Bell },
          { to: '/directory', label: 'Alumni Directory', icon: Users },
          { to: '/jobs', label: 'Job Portal', icon: Briefcase },
          { to: '/events', label: 'Events & Reunions', icon: Calendar },
          { to: '/blog', label: 'Blog & News', icon: BookOpen },
          { to: '/network', label: 'My Network', icon: Network },
          { to: '/mentorship', label: 'Mentorship', icon: GraduationCap },
          { to: '/card', label: 'Smart ID Card', icon: CreditCard },
          { to: '/surveys', label: 'Surveys', icon: ClipboardList },
          { to: '/student/complaints', label: 'Complaints & Reports', icon: MessageSquareWarning },
        ];
      case 'college_admin':
        return [
          { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/circulars', label: 'Circulars & Notices', icon: Bell },
          { to: '/college/profile', label: 'College Profile', icon: Building },
          { to: '/verification', label: 'Member Management', icon: Shield },
          { to: '/csv-upload', label: 'CSV Bulk Upload', icon: Upload },
          { to: '/directory', label: 'Alumni Directory', icon: Users },
          { to: '/jobs', label: 'Manage Jobs', icon: Briefcase },
          { to: '/events', label: 'Manage Events', icon: Calendar },
          { to: '/blog', label: 'Manage Blog', icon: BookOpen },
          { to: '/survey-builder', label: 'Survey Builder', icon: ClipboardList },
          { to: '/college/complaints', label: 'Complaints & Misconduct Reports', icon: MessageSquareWarning },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo-container flex justify-between items-center w-full">
        <div className="flex items-center gap-3">
          <AlumniConnectLogo size={38} />
          <span className="sidebar-logo-text">AlumniConnect</span>
        </div>
        {onNavClick && (
          <button 
            onClick={onNavClick} 
            className="sidebar-mobile-close-btn"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink 
              key={item.to} 
              to={item.to} 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title={item.label}
              end={item.to === '/dashboard'}
              onClick={onNavClick}
            >
              <Icon 
                className={`sidebar-link-icon ${item.to === '/circulars' && unreadCount > 0 ? 'darken-green-bell' : ''}`} 
                size={20} 
              />
              <span className="sidebar-link-text">{item.label}</span>
              {item.to === '/circulars' && unreadCount > 0 && (
                <span className="sidebar-badge">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <NavLink 
          to="/settings" 
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          title="Settings"
          onClick={onNavClick}
        >
          <Settings className="sidebar-link-icon" size={20} />
          <span className="sidebar-link-text">Settings</span>
        </NavLink>

        <button 
          onClick={onToggle} 
          className="sidebar-collapse-btn"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  );
}
