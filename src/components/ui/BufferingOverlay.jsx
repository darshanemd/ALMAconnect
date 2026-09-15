import React from 'react';
import AlumniConnectLogo from './AlumniConnectLogo';
import { useTheme } from '../../contexts/ThemeContext';
import './BufferingOverlay.css';

/**
 * BufferingOverlay component featuring separate, dedicated Light Mode & Dark Mode UI/UX animations.
 */
export default function BufferingOverlay({ 
  title = "Loading AlumniConnect", 
  subtitle = "Connecting alumni worldwide...",
  brandText = true 
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`buffering-overlay-container ${isDark ? 'mode-dark' : 'mode-light'}`}>
      {/* Background Ambient Glow Effects */}
      <div className="buffering-bg-glow buffering-glow-1" />
      <div className="buffering-bg-glow buffering-glow-2" />
      <div className="buffering-bg-glow buffering-glow-3" />

      <div className="buffering-content">
        {/* Animated Multi-Color Spinner Ring Wrapper */}
        <div className="buffering-spinner-wrapper">
          {/* SVG Rings with Theme-Specific Gradients (Sage & Teal for Light, Indigo & Sky for Dark) */}
          <svg className="buffering-svg-rings" viewBox="0 0 200 200">
            <defs>
              {isDark ? (
                <linearGradient id="ringGradOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6E72E5" />
                  <stop offset="35%" stopColor="#60A5FA" />
                  <stop offset="70%" stopColor="#8E92F5" />
                  <stop offset="100%" stopColor="#34D399" />
                </linearGradient>
              ) : (
                <linearGradient id="ringGradOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6FAF98" />
                  <stop offset="35%" stopColor="#00B5C4" />
                  <stop offset="70%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              )}
            </defs>
            <circle 
              cx="100" 
              cy="100" 
              r="90" 
              fill="none" 
              stroke="url(#ringGradOuter)" 
              strokeWidth="4" 
              strokeDasharray="420 120" 
              strokeLinecap="round" 
            />
          </svg>

          {/* Inner Counter-Rotating Ring SVG */}
          <svg className="buffering-svg-rings-inner" viewBox="0 0 200 200">
            <defs>
              {isDark ? (
                <linearGradient id="ringGradInner" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8E92F5" />
                  <stop offset="50%" stopColor="#6E72E5" />
                  <stop offset="100%" stopColor="#5054C7" />
                </linearGradient>
              ) : (
                <linearGradient id="ringGradInner" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#6FAF98" />
                  <stop offset="100%" stopColor="#00B5C4" />
                </linearGradient>
              )}
            </defs>
            <circle 
              cx="100" 
              cy="100" 
              r="84" 
              fill="none" 
              stroke="url(#ringGradInner)" 
              strokeWidth="2.5" 
              strokeDasharray="300 200" 
              strokeLinecap="round" 
            />
          </svg>

          {/* Center Disc Badge */}
          <div className="buffering-inner-badge">
            <AlumniConnectLogo size={42} />
            {brandText && (
              <span className="buffering-brand-name">
                <span className="buffering-brand-orange">Alumni</span>
                <span className="buffering-brand-blue">Connect</span>
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Titles */}
        <h2 className="buffering-title">{title}</h2>
        <p className="buffering-subtitle">{subtitle}</p>

        {/* Animated Bouncing 3 Dots */}
        <div className="buffering-dots">
          <div className="buffering-dot" />
          <div className="buffering-dot" />
          <div className="buffering-dot" />
        </div>
      </div>
    </div>
  );
}
