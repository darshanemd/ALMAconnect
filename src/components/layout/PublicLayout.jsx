import React, { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router';
import { Menu, X, Sun, Moon } from 'lucide-react';
import AlumniConnectLogo from '../ui/AlumniConnectLogo';
import { useTheme } from '../../contexts/ThemeContext';
import './PublicLayout.css';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="public-header-container">
          <Link to="/" className="public-logo" onClick={() => setMobileMenuOpen(false)}>
            <AlumniConnectLogo size={34} />
            <span>AlumniConnect</span>
          </Link>

          <div className="public-header-right">
            <nav className={`public-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
              <NavLink to="/" end className="public-nav-link" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
              <NavLink to="/login" className="public-nav-link" onClick={() => setMobileMenuOpen(false)}>Login</NavLink>
              <NavLink to="/register" className="public-nav-link btn btn-primary public-nav-btn" onClick={() => setMobileMenuOpen(false)}>Join Portal</NavLink>
            </nav>

            <div className="public-header-actions">
              {/* High-Contrast Mode Switcher Toggle Button */}
              <button 
                type="button" 
                onClick={toggleTheme}
                className="public-theme-btn-icon"
                title={`Switch to ${resolvedTheme === 'dark' ? 'Light' : 'Dark'} mode`}
                aria-label="Toggle Theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun size={20} color="#FBBF24" />
                ) : (
                  <Moon size={20} color="#6E72E5" />
                )}
              </button>

              <button 
                className="public-menu-btn" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="public-main animate-fade-in">
        <Outlet />
      </main>

      <footer className="public-footer">
        <div className="public-footer-container">
          <div className="public-footer-brand">
            <div className="public-logo">
              <AlumniConnectLogo size={34} />
              <span>AlumniConnect</span>
            </div>
            <p>Empowering alumni networks, driving mentorship, fostering career growth, and giving back to the alma mater.</p>
          </div>
          
          <div className="public-footer-links">
            <div className="footer-link-group">
              <h4>Quick Links</h4>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
            <div className="footer-link-group">
              <h4>Platform</h4>
              <Link to="/login">Alumni Portal</Link>
              <Link to="/login">College Admin</Link>
              <Link to="/login">Student Portal</Link>
            </div>
          </div>
        </div>
        <div className="public-footer-bottom">
          <p>&copy; {new Date().getFullYear()} AlumniConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
