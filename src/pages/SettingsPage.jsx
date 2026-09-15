import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { apiRequest } from '../utils/api';
import { 
  Settings, Save, RefreshCw, Check, Sun, Moon, Monitor, 
  Camera, User, Shield, CheckCircle2, AlertCircle, 
  Mail, Phone, Briefcase, MapPin, Building,
  GraduationCap, Award, Link
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import ProfilePhotoUploader from '../components/ui/ProfilePhotoUploader';
import './SettingsPage.css';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { getAlumniById } = useData();
  const { theme, setTheme } = useTheme();

  // Active Tab State
  const [activeTab, setActiveTab] = useState('profile');

  // Load latest member data if available
  const alum = getAlumniById(user?.id) || user;

  // Profile Tab State
  const [fullName, setFullName] = useState(user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim());
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || alum?.phone || '');
  const [currentRole, setCurrentRole] = useState(user?.currentRole || alum?.currentRole || '');
  const [currentCompany, setCurrentCompany] = useState(user?.currentCompany || alum?.currentCompany || '');
  const [department, setDepartment] = useState(user?.department || alum?.department || 'Computer Science');
  const [degree, setDegree] = useState(user?.degree || alum?.degree || 'B.Tech');
  const [graduationYear, setGraduationYear] = useState(user?.graduationYear || alum?.graduationYear || (user?.role === 'student' ? 2027 : 2024));
  const [location, setLocation] = useState(user?.location || alum?.location || '');
  const [bio, setBio] = useState(user?.bio || alum?.bio || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || alum?.linkedin || '');
  const [skillsString, setSkillsString] = useState((user?.skills || alum?.skills || []).join(', '));
  
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Privacy Tab State - Contact & Information Privacy
  const [hidePhone, setHidePhone] = useState(user?.privacy?.hidePhone || false);
  const [hideEmail, setHideEmail] = useState(user?.privacy?.hideEmail || false);
  const [privacyLoading, setPrivacyLoading] = useState(false);
  const [privacySaved, setPrivacySaved] = useState(false);

  // Sync state when user object or alum data updates
  useEffect(() => {
    if (user) {
      setFullName(user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim());
      setPhone(user.phone || alum?.phone || '');
      setCurrentRole(user.currentRole || alum?.currentRole || '');
      setCurrentCompany(user.currentCompany || alum?.currentCompany || '');
      setDepartment(user.department || alum?.department || 'Computer Science');
      setDegree(user.degree || alum?.degree || 'B.Tech');
      setGraduationYear(user.graduationYear || alum?.graduationYear || (user.role === 'student' ? 2027 : 2024));
      setLocation(user.location || alum?.location || '');
      setBio(user.bio || alum?.bio || '');
      setLinkedin(user.linkedin || alum?.linkedin || '');
      setSkillsString((user.skills || alum?.skills || []).join(', '));

      // Privacy
      if (user.privacy) {
        setHidePhone(user.privacy.hidePhone || false);
        setHideEmail(user.privacy.hideEmail || false);
      }
    }
  }, [user, alum]);

  // Profile Save
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSaved(false);

    try {
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || '';

      const skillsArray = skillsString
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const updatePayload = {
        firstName,
        lastName,
        name: fullName.trim(),
        phone: phone.trim(),
        currentRole: currentRole.trim(),
        currentCompany: currentCompany.trim(),
        department: department.trim(),
        degree: degree.trim(),
        graduationYear: Number(graduationYear) || 2024,
        location: location.trim(),
        bio: bio.trim(),
        linkedin: linkedin.trim(),
        skills: skillsArray
      };

      if (user?.id) {
        await apiRequest(`/members/${user.id}`, 'PUT', updatePayload);
      }
      
      updateUser(updatePayload);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      alert('Failed to update profile details: ' + err.message);
    } finally {
      setProfileLoading(false);
    }
  };


  // Save Privacy Preferences
  const handleSavePrivacy = async () => {
    setPrivacyLoading(true);
    setPrivacySaved(false);
    try {
      const privacyPayload = {
        privacy: {
          hidePhone,
          hideEmail
        }
      };
      if (user?.id) {
        await apiRequest(`/members/${user.id}`, 'PUT', privacyPayload);
      }
      updateUser(privacyPayload);
      setPrivacySaved(true);
      setTimeout(() => setPrivacySaved(false), 3000);
    } catch (err) {
      alert('Failed to save privacy settings: ' + err.message);
    } finally {
      setPrivacyLoading(false);
    }
  };


  return (
    <div className="settings-container stagger-children animate-fade-in">
      {/* Header */}
      <div className="settings-header">
        <h2 className="text-2xl font-bold text-primary flex items-center gap-2.5">
          <Settings className="text-accent" size={26} /> Account & Platform Settings
        </h2>
        <p className="text-sm text-secondary mt-1">
          Manage your personal details, profile information, and contact privacy.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="settings-tabs">
        <button 
          className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={16} /> Profile & Appearance
        </button>

        <button 
          className={`settings-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <Shield size={16} /> Privacy & Visibility
        </button>
      </div>

      {/* ==================== TAB 1: PROFILE & APPEARANCE ==================== */}
      {activeTab === 'profile' && (
        <div className="stagger-children flex flex-col gap-6">
          {/* Profile Photo */}
          <div className="settings-card text-center">
            <div className="settings-card-header justify-center mb-2">
              <h3 className="settings-card-title">
                <Camera size={18} className="text-accent" /> Profile Photo & Avatar
              </h3>
            </div>
            
            <div className="relative inline-block mx-auto my-3">
              <Avatar 
                src={user?.avatarUrl || user?.avatar} 
                name={user?.name || 'User'} 
                role={user?.role} 
                size="xl" 
                isVerified={true}
              />
              <button 
                type="button"
                className="btn btn-primary rounded-full p-2 absolute bottom-0 right-0 shadow-md"
                onClick={() => setShowPhotoModal(true)}
                title="Change Profile Photo"
              >
                <Camera size={14} />
              </button>
            </div>

            <p className="text-xs text-secondary mt-1 max-w-sm mx-auto">
              Your photo is visible across your <strong>{user?.role?.replace('_', ' ')}</strong> directory badge, comments, and direct messages.
            </p>

            <button 
              type="button" 
              className="btn btn-outline btn-sm mt-4 inline-flex items-center gap-1.5 font-bold"
              onClick={() => setShowPhotoModal(true)}
            >
              <Camera size={14} /> Change Profile Photo
            </button>
          </div>

          {/* Account & Career Details Form */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title flex items-center gap-2">
                  <User size={18} className="text-accent" /> Personal & Academic Information
                </h3>
                <p className="settings-card-subtitle">Keep your professional identity and institutional records current</p>
              </div>
            </div>

            {profileSaved && (
              <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Profile details saved successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
              <div className="grid grid-2 gap-4">
                <div className="input-group">
                  <label className="text-xs font-semibold text-primary">Full Name *</label>
                  <input 
                    type="text" 
                    className="input text-xs" 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)} 
                    required 
                  />
                </div>

                <div className="input-group">
                  <label className="text-xs font-semibold text-primary">Phone Number</label>
                  <input 
                    type="tel" 
                    className="input text-xs" 
                    placeholder="e.g. +91 98765 43210"
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid grid-3 gap-4">
                <div className="input-group">
                  <label className="text-xs font-semibold text-primary">Branch / Department *</label>
                  <input 
                    type="text" 
                    className="input text-xs" 
                    value={department} 
                    onChange={e => setDepartment(e.target.value)} 
                    required 
                  />
                </div>

                <div className="input-group">
                  <label className="text-xs font-semibold text-primary">Degree</label>
                  <input 
                    type="text" 
                    className="input text-xs" 
                    placeholder="e.g. B.Tech / B.E"
                    value={degree} 
                    onChange={e => setDegree(e.target.value)} 
                  />
                </div>

                <div className="input-group">
                  <label className="text-xs font-semibold text-primary">Year of Graduation *</label>
                  <input 
                    type="number" 
                    className="input text-xs" 
                    value={graduationYear} 
                    onChange={e => setGraduationYear(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-2 gap-4">
                <div className="input-group">
                  <label className="text-xs font-semibold text-primary">Current Job Title / Role</label>
                  <input 
                    type="text" 
                    className="input text-xs" 
                    placeholder="e.g. Senior Software Engineer"
                    value={currentRole} 
                    onChange={e => setCurrentRole(e.target.value)} 
                  />
                </div>

                <div className="input-group">
                  <label className="text-xs font-semibold text-primary">Current Company / Organization</label>
                  <input 
                    type="text" 
                    className="input text-xs" 
                    placeholder="e.g. Google, Microsoft, Startup"
                    value={currentCompany} 
                    onChange={e => setCurrentCompany(e.target.value)} 
                  />
                </div>
              </div>

              <div className="grid grid-2 gap-4">
                <div className="input-group">
                  <label className="text-xs font-semibold text-primary">Location (City, Country)</label>
                  <input 
                    type="text" 
                    className="input text-xs" 
                    placeholder="e.g. Bengaluru, India"
                    value={location} 
                    onChange={e => setLocation(e.target.value)} 
                  />
                </div>

                <div className="input-group">
                  <label className="text-xs font-semibold text-primary">LinkedIn Profile URL</label>
                  <input 
                    type="url" 
                    className="input text-xs" 
                    placeholder="https://linkedin.com/in/username"
                    value={linkedin} 
                    onChange={e => setLinkedin(e.target.value)} 
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="text-xs font-semibold text-primary">Skills (Comma-separated)</label>
                <input 
                  type="text" 
                  className="input text-xs" 
                  placeholder="e.g. React, Node.js, Python, System Design, Machine Learning"
                  value={skillsString} 
                  onChange={e => setSkillsString(e.target.value)} 
                />
              </div>

              <div className="input-group">
                <label className="text-xs font-semibold text-primary">Short Bio / Summary</label>
                <textarea 
                  className="textarea text-xs" 
                  rows="3"
                  placeholder="Share a short summary about your background, career interests, or mentorship availability..."
                  value={bio} 
                  onChange={e => setBio(e.target.value)} 
                />
              </div>

              <div className="grid grid-2 gap-4 border-t border-light pt-3 mt-1">
                <div className="input-group">
                  <label className="text-xs font-semibold text-primary">Registered Email Address</label>
                  <input 
                    type="email" 
                    className="input text-xs bg-slate-50 opacity-80 cursor-not-allowed" 
                    value={email} 
                    disabled 
                  />
                </div>

                <div className="input-group">
                  <label className="text-xs font-semibold text-primary">Assigned Institutional Role</label>
                  <input 
                    type="text" 
                    className="input text-xs capitalize bg-slate-50 opacity-80 cursor-not-allowed" 
                    value={user?.role?.replace('_', ' ') || ''} 
                    disabled 
                  />
                </div>
              </div>

              <div className="pt-2">
                <button type="submit" className="btn btn-primary flex items-center gap-2 font-bold" disabled={profileLoading}>
                  {profileLoading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : profileSaved ? (
                    <><Check size={16} /> Saved Changes</>
                  ) : (
                    <><Save size={16} /> Save Personal Details</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Theme Preference */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title flex items-center gap-2">
                  <Sun size={18} className="text-accent" /> Appearance Theme
                </h3>
                <p className="settings-card-subtitle">Choose your preferred visual presentation style</p>
              </div>
            </div>

            <div className="grid grid-3 gap-3 pt-2">
              <button
                type="button"
                className={`btn ${theme === 'light' ? 'btn-primary font-bold' : 'btn-secondary'} flex flex-col items-center gap-2 p-4`}
                onClick={() => setTheme('light')}
              >
                <Sun size={20} />
                <span className="text-xs font-semibold">Light Mode</span>
              </button>

              <button
                type="button"
                className={`btn ${theme === 'dark' ? 'btn-primary font-bold' : 'btn-secondary'} flex flex-col items-center gap-2 p-4`}
                onClick={() => setTheme('dark')}
              >
                <Moon size={20} />
                <span className="text-xs font-semibold">Dark Mode</span>
              </button>

              <button
                type="button"
                className={`btn ${theme === 'system' ? 'btn-primary font-bold' : 'btn-secondary'} flex flex-col items-center gap-2 p-4`}
                onClick={() => setTheme('system')}
              >
                <Monitor size={20} />
                <span className="text-xs font-semibold">System Sync</span>
              </button>
            </div>
          </div>
        </div>
      )}



      {/* ==================== TAB 2: PRIVACY & VISIBILITY ==================== */}
      {activeTab === 'privacy' && (
        <div className="stagger-children flex flex-col gap-6">
          {/* Contact Privacy Toggles */}
          <div className="settings-card">
            <div className="settings-card-header">
              <div>
                <h3 className="settings-card-title flex items-center gap-2">
                  <Shield size={18} className="text-accent" /> Contact & Information Privacy
                </h3>
                <p className="settings-card-subtitle">Control what personal details are shown on your public cards</p>
              </div>
            </div>

            {privacySaved && (
              <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 font-bold">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Privacy preferences saved successfully!</span>
              </div>
            )}

            <div className="divide-y divide-slate-100">
              <div className="settings-toggle-item">
                <div className="settings-toggle-info">
                  <div className="settings-toggle-title flex items-center gap-1.5">
                    <Phone size={16} className="text-accent" /> Hide Phone Number
                  </div>
                  <p className="settings-toggle-desc">
                    Keep your personal phone number confidential from the public directory.
                  </p>
                </div>
                <label className="switch-control">
                  <input 
                    type="checkbox" 
                    checked={hidePhone} 
                    onChange={e => setHidePhone(e.target.checked)} 
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>

              <div className="settings-toggle-item">
                <div className="settings-toggle-info">
                  <div className="settings-toggle-title flex items-center gap-1.5">
                    <Mail size={16} className="text-accent" /> Hide Direct Email Address
                  </div>
                  <p className="settings-toggle-desc">
                    Mask your email and require other members to contact you via in-app chat.
                  </p>
                </div>
                <label className="switch-control">
                  <input 
                    type="checkbox" 
                    checked={hideEmail} 
                    onChange={e => setHideEmail(e.target.checked)} 
                  />
                  <span className="switch-slider"></span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t mt-4 flex items-center justify-end">
              <button 
                type="button" 
                onClick={handleSavePrivacy}
                className="btn btn-primary flex items-center gap-2 font-bold" 
                disabled={privacyLoading}
              >
                {privacyLoading ? <RefreshCw size={16} className="animate-spin" /> : privacySaved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save Privacy Settings</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Uploader Modal */}
      {showPhotoModal && (
        <ProfilePhotoUploader 
          currentSrc={user?.avatarUrl || user?.avatar}
          userName={user?.name || 'User'}
          userRole={user?.role || 'default'}
          onSave={(newPhotoUrl) => updateUser({ avatarUrl: newPhotoUrl, avatar: newPhotoUrl })}
          onClose={() => setShowPhotoModal(false)}
        />
      )}


    </div>
  );
}
