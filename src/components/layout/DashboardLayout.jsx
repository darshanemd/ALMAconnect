import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useCommandMenu } from '../../hooks/useCommandMenu';
import { Megaphone, X, WifiOff } from 'lucide-react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileBottomBar from './MobileBottomBar';
import CommandMenu from '../ui/CommandMenu';
import ErrorBoundary from '../ui/ErrorBoundary';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const { user } = useAuth();
  const { circulars, isOffline } = useData();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const { isOpen: commandMenuOpen, setIsOpen: setCommandMenuOpen, toggle: toggleCommandMenu } = useCommandMenu();

  const urgentCircular = (circulars || []).find(c => c.category === 'Urgent');

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // On desktop: toggle collapse. On mobile: toggle drawer.
  const handleMenuBtnClick = () => {
    if (window.innerWidth <= 768) {
      handleMobileToggle();
    } else {
      handleSidebarToggle();
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/directory') return 'Alumni Directory';
    if (path === '/jobs') return 'Jobs Portal';
    if (path === '/events') return 'Events & Reunions';
    if (path === '/blog') return 'Blog & Success Stories';
    if (path.startsWith('/blog/')) return 'Read Success Story';
    if (path === '/network') return 'My Network';
    if (path === '/mentorship') return 'Mentorship Hub';
    if (path === '/card') return user?.role === 'student' ? 'Smart Student ID' : 'Smart Alumni ID';
    if (path === '/surveys') return 'Feedback & Surveys';
    if (path === '/student/resume-analyzer') return 'AI Resume Analyzer';
    if (path === '/student/skill-gap') return 'Skill Gap Detector';
    if (path === '/student/placement-predictor') return 'Placement Predictor';
    if (path === '/verification') return 'Member Management';
    if (path === '/csv-upload') return 'CSV Pre-Verification';
    if (path === '/survey-builder') return 'Create Feedback Survey';
    if (path === '/profile') {
      if (user?.role === 'student') return 'Student Profile';
      if (user?.role === 'alumni') return 'Alumni Profile';
      if (user?.role === 'college_admin') return 'College Profile';
      return 'My Profile';
    }
    if (path === '/circulars') return 'Circulars & Notices';
    if (path === '/student/complaints') return 'Anonymous Complaints';
    if (path === '/college/complaints') return 'Manage Student Complaints';
    return user?.role === 'student' ? 'Student Portal' : user?.role === 'college_admin' ? 'College Portal' : 'Alumni Portal';
  };

  return (
    <div className={`dashboard-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div 
        className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`} 
        onClick={handleMobileToggle}
      />
      
      <div className={`sidebar-container ${mobileOpen ? 'mobile-open' : ''}`}>
        <Sidebar 
          role={user?.role} 
          collapsed={sidebarCollapsed} 
          mobileOpen={mobileOpen}
          onToggle={handleSidebarToggle} 
          onNavClick={() => setMobileOpen(false)}
        />
      </div>

      <div className="main-container">
        <TopBar 
          onMenuToggle={handleMenuBtnClick} 
          title={getPageTitle()} 
          onToggleCommandMenu={toggleCommandMenu}
        />
        
        {/* Network Offline Toast Banner */}
        {isOffline && (
          <div className="p-3.5 bg-amber-600 text-white flex items-center justify-between px-6 shadow-md animate-slide-down">
            <div className="flex items-center gap-3">
              <WifiOff size={18} className="animate-pulse flex-shrink-0" />
              <span className="text-xs font-semibold">
                Network Disconnected &mdash; You are in offline mode. Changes are saved locally and will auto-sync when connection is restored.
              </span>
            </div>
          </div>
        )}

        {/* Urgent Broadcast Notice Banner */}
        {urgentCircular && !bannerDismissed && (
          <div className="p-3 bg-danger text-white flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Megaphone size={18} className="animate-bounce flex-shrink-0" />
              <span className="text-xs font-semibold">
                URGENT NOTICE: {urgentCircular.title} &mdash;{' '}
                <Link to="/circulars" className="underline font-bold text-white hover:text-gray-200">
                  Read Full Notice
                </Link>
              </span>
            </div>
            <button 
              onClick={() => setBannerDismissed(true)} 
              className="text-white opacity-80 hover:opacity-100 p-1"
              aria-label="Dismiss banner"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <main className="content-area animate-fade-in">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {/* Touch-Optimized Mobile Bottom Bar */}
      <MobileBottomBar role={user?.role} />

      <CommandMenu 
        isOpen={commandMenuOpen} 
        onClose={() => setCommandMenuOpen(false)} 
      />
    </div>
  );
}
