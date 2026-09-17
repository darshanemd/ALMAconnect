import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../utils/api';
import { 
  Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, 
  X, CheckCircle, RefreshCw, KeyRound 
} from 'lucide-react';
import AlumniConnectLogo from '../../components/ui/AlumniConnectLogo';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeHub, setActiveHub] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const navigate = useNavigate();

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1); // 1 = Request, 2 = Enter OTP & New Password
  const [otpInput, setOtpInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const requestingResetRef = useRef(false);

  const handleRequestReset = async (e) => {
    e?.preventDefault();
    if (forgotLoading || requestingResetRef.current) return;
    requestingResetRef.current = true;
    setForgotError('');
    setForgotSuccess('');
    setForgotLoading(true);
    try {
      const res = await apiRequest('/auth/forgot-password', 'POST', { email: forgotEmail.trim() });
      setOtpInput('');
      setForgotSuccess(res.message || 'Verification OTP dispatched! Please check your email inbox.');
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.message || 'Failed to request password reset. Please try again.');
    } finally {
      setForgotLoading(false);
      requestingResetRef.current = false;
    }
  };

  const handlePerformReset = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (newPasswordInput.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setForgotError('New passwords do not match. Please verify.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await apiRequest('/auth/reset-password', 'POST', {
        otp: otpInput.trim(),
        email: forgotEmail.trim(),
        newPassword: newPasswordInput
      });
      setForgotSuccess('Password reset successfully! Signing you in...');
      setTimeout(async () => {
        setForgotModalOpen(false);
        setForgotStep(1);
        try {
          await login(forgotEmail.trim(), newPasswordInput);
          navigate('/dashboard');
        } catch (loginErr) {
          setEmail(forgotEmail);
          setPassword(newPasswordInput);
        } finally {
          setForgotSuccess('');
          setOtpInput('');
          setNewPasswordInput('');
          setConfirmPasswordInput('');
        }
      }, 1200);
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password. Please check the OTP code.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Rotatable Ecosystem State & Drag Controls
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, angle: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, angle: rotationAngle };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    setRotationAngle(dragStartRef.current.angle + deltaX * 0.7);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Smooth Continuous Ambient Rotation when idle
  React.useEffect(() => {
    let animFrame;
    const animate = () => {
      if (!isDragging) {
        setRotationAngle(prev => (prev + 0.3) % 360);
      }
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isDragging]);

  const handleHubClick = (hubName, demoEmail, targetAngle) => {
    setActiveHub(hubName);
    setEmail(demoEmail);
    if (!password) {
      setPassword('demo123');
    }
    if (typeof targetAngle === 'number') {
      setRotationAngle(targetAngle);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="viewport">
        
        {/* LEFT SIDE: Interactive Rotatable AlumniConnect Ecosystem Artwork */}
        <div 
          className={`left-visual-side ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={(e) => {
            setIsDragging(true);
            dragStartRef.current = { x: e.touches[0].clientX, angle: rotationAngle };
          }}
          onTouchMove={(e) => {
            if (!isDragging) return;
            const deltaX = e.touches[0].clientX - dragStartRef.current.x;
            setRotationAngle(dragStartRef.current.angle + deltaX * 0.7);
          }}
          onTouchEnd={handleMouseUp}
        >
          <div className="logo-background-wrap">

            {/* Large AlumniConnect Brand Logo with Rotating Outer Wings & Constant Center Cap */}
            <div className="artwork-logo-main">
              <AlumniConnectLogo size={360} wingRotation={rotationAngle} />
            </div>

            {/* Floating Ecosystem Node Badges (matching user screenshot) */}
            <div 
              className={`hub-node node-top ${activeHub === 'Student Hub' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleHubClick('Student Hub', 'student@demo.com', 0);
              }}
              title="Click to select Student Hub"
            >
              <span className="node-dot green-dot" />
              Student Hub
            </div>

            <div 
              className={`hub-node node-left ${activeHub === 'Alumni' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleHubClick('Alumni', 'alumni@demo.com', 120);
              }}
              title="Click to select Alumni"
            >
              <span className="node-dot blue-dot" />
              Alumni
            </div>

            <div 
              className={`hub-node node-right ${activeHub === 'College' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleHubClick('College', 'admin@demo.com', 240);
              }}
              title="Click to select College Admin"
            >
              <span className="node-dot teal-dot" />
              College
            </div>
          </div>

          <div className="visual-caption">
            <h3>ALUMNI CONNECT ECOSYSTEM</h3>
          </div>
        </div>

        {/* RIGHT SIDE: Detailed Interactive Login Card */}
        <div className="right-form-side">
          <div className="login-card-custom">

            <div className="card-header-custom">
              <div className="brand-title-custom">
                <AlumniConnectLogo size={32} />
                AlumniConnect
              </div>
              <h2 className="welcome-text-custom">Welcome Back!</h2>
              <p className="welcome-subtitle-custom">Interactive portal login for students, alumni & faculty</p>
            </div>

            {error && (
              <div className="login-error badge badge-danger w-full gap-2 p-3 mb-4" style={{ borderRadius: '12px' }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              
              {/* Email Input with active focus pen indicator */}
              <div className="input-group-custom">
                <div className="input-wrapper-custom">
                  <input 
                    type="email" 
                    className="input-field-custom" 
                    id="email" 
                    placeholder="[Email Address]" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="username"
                    required 
                  />
                  <Mail className="input-icon-lead" size={20} />
                  
                  {/* Pen Edit Active Indicator */}
                  <svg className="pen-indicator-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </div>
              </div>

              {/* Password Input with show/hide toggle & active pen indicator */}
              <div className="input-group-custom">
                <div className="input-wrapper-custom">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="input-field-custom" 
                    id="password" 
                    placeholder="[Password]" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required 
                  />
                  <Lock className="input-icon-lead" size={20} />

                  <button 
                    type="button" 
                    className="toggle-password-btn" 
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="options-row-custom">
                <button 
                  type="button" 
                  onClick={() => {
                    setForgotError('');
                    setForgotSuccess('');
                    setForgotEmail(email || '');
                    setForgotStep(1);
                    setForgotModalOpen(true);
                  }} 
                  className="forgot-link-custom bg-transparent border-0 cursor-pointer p-0"
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="btn-submit-custom" disabled={loading}>
                {loading ? 'Authenticating...' : 'Login'} <ArrowRight size={18} />
              </button>



              <div className="card-footer-custom" style={{ marginTop: '20px' }}>
                Don't have an account? <Link to="/register">Sign Up</Link> &nbsp;•&nbsp; <a href="#" onClick={(e) => { e.preventDefault(); alert("Help Center: Contact support@alumniconnect.edu"); }}>Need Help?</a>
              </div>

            </form>
          </div>
        </div>

      </div>

      {/* Forgot / Reset Password Modal */}
      {forgotModalOpen && (
        <div className="modal-backdrop" style={{ zIndex: 9999, padding: '16px' }} onClick={() => setForgotModalOpen(false)}>
          <div className="modal animate-scale-up" style={{ width: '100%', maxWidth: 440, padding: 20, borderRadius: 16, boxSizing: 'border-box' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center pb-3 border-b">
              <h3 className="text-base font-bold flex items-center gap-2 text-primary">
                <KeyRound className="text-accent" size={20} />
                {forgotStep === 1 ? 'Reset Password via Gmail' : 'Verify OTP & Set Password'}
              </h3>
              <button className="btn btn-ghost p-1" onClick={() => setForgotModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body py-4">
              {forgotError && (
                <div className="badge badge-danger w-full p-3 mb-3 flex items-start gap-2 text-xs font-semibold" style={{ borderRadius: 8, whiteSpace: 'normal', wordBreak: 'break-word' }}>
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotSuccess && (
                <div className="p-3 mb-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-start gap-2 font-medium" style={{ wordBreak: 'break-word' }}>
                  <CheckCircle size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              {forgotStep === 1 ? (
                <form onSubmit={handleRequestReset} className="flex flex-col gap-3">
                  <p className="text-xs text-secondary leading-relaxed">
                    Enter your registered email address. We will dispatch a <strong>6-digit verification OTP</strong> directly to your inbox via Gmail.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Registered Account Email *</label>
                    <div className="relative flex items-center">
                      <input 
                        type="email" 
                        className="input w-full text-xs"
                        placeholder="e.g. 0shivathefighter@gmail.com" 
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        autoComplete="email"
                        required 
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-3 pt-2 border-t">
                    <button type="button" className="btn btn-secondary text-xs" onClick={() => setForgotModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary text-xs flex items-center gap-1.5 font-bold" disabled={forgotLoading}>
                      {forgotLoading ? <RefreshCw size={14} className="animate-spin" /> : <Mail size={14} />}
                      <span>Send OTP Code</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePerformReset} className="flex flex-col gap-3">
                  <p className="text-xs text-secondary leading-relaxed" style={{ wordBreak: 'break-word' }}>
                    We sent a 6-digit OTP to <strong>{forgotEmail}</strong>. Enter the code and your new password:
                  </p>

                  {/* 6-Digit OTP Code Input */}
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">6-Digit Verification OTP *</label>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoComplete="one-time-code"
                      className="input w-full text-center font-mono font-bold tracking-widest text-lg"
                      placeholder="• • • • • •" 
                      value={otpInput}
                      onChange={e => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
                      required 
                    />
                    <div className="text-[11px] text-secondary mt-1">Code valid for 15 minutes. Check your Gmail inbox.</div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">New Password *</label>
                    <div className="relative flex items-center">
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        className="input w-full pr-10 text-xs"
                        placeholder="Min 6 characters" 
                        value={newPasswordInput}
                        onChange={e => setNewPasswordInput(e.target.value)}
                        autoComplete="new-password"
                        minLength={6}
                        required 
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 text-secondary hover:text-primary"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1">Confirm New Password *</label>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      className="input w-full text-xs"
                      placeholder="Re-enter new password" 
                      value={confirmPasswordInput}
                      onChange={e => setConfirmPasswordInput(e.target.value)}
                      autoComplete="new-password"
                      minLength={6}
                      required 
                    />
                  </div>

                  <div className="flex flex-wrap justify-between items-center gap-2 mt-3 pt-2 border-t">
                    <button type="button" className="btn btn-ghost text-xs" onClick={() => setForgotStep(1)}>
                      ← Change Email
                    </button>
                    <button type="submit" className="btn btn-primary text-xs flex items-center gap-1.5 font-bold" disabled={forgotLoading}>
                      {forgotLoading ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      <span>Save New Password</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


