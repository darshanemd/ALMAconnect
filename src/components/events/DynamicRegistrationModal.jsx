import React, { useState, useMemo } from 'react';
import { 
  X, Check, Send, Sparkles, ShieldCheck, Plus, Trash2, 
  ExternalLink, Calendar, MapPin, CheckCircle2, Ticket, Compass, 
  Search, ArrowLeft, Users, User, Trophy, Edit3, Loader2, Award
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { formatDate } from '../../utils/formatters';
import { 
  FRESHERS_CATEGORIES, 
  ETHNIC_CATEGORIES, 
  SPORTS_CATEGORIES, 
  HACKATHON_TRACKS, 
  HACKATHON_ROLES, 
  SUMMIT_ROLES, 
  GUEST_OPTIONS, 
  WORKSHOP_TRACKS, 
  WORKSHOP_LEVELS, 
  WORKSTATION_OPTIONS 
} from '../../constants/eventConstants';
import './DynamicRegistrationModal.css';

export default function DynamicRegistrationModal({ event, user, onClose, onRegister, onOpenGatePass }) {
  const { getAlumniById } = useData();
  const profileData = getAlumniById ? getAlumniById(user?.id) : null;

  const fullName = user?.name || (profileData ? `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() : '') || 'Rahul Kumar';
  const rollNumber = user?.rollNumber || profileData?.rollNumber || 'STU2027001';
  const department = user?.department || profileData?.department || 'Computer Science';
  const userEmail = user?.email || profileData?.email || 'student@demo.com';
  const degree = user?.degree || profileData?.degree || 'B.Tech';
  const gradYear = user?.graduationYear || profileData?.graduationYear || 2027;
  const company = user?.currentCompany || profileData?.currentCompany || (user?.role === 'student' ? 'TechCorp' : 'Google');
  const roleTitle = user?.currentRole || profileData?.currentRole || (user?.role === 'student' ? 'Student' : 'Software Engineer');

  const titleLower = (event?.title || '').toLowerCase();
  const typeLower = (event?.type || '').toLowerCase();

  // Determine Event Category Type
  const isSports = typeLower.includes('sports') || titleLower.includes('sports') || titleLower.includes('championship');
  const isHackathon = typeLower.includes('hackathon') || titleLower.includes('hackathon') || titleLower.includes('challenge');
  const isReunion = typeLower.includes('reunion') || titleLower.includes('reunion') || titleLower.includes('summit') || titleLower.includes('gala');
  const isWorkshop = typeLower.includes('workshop') || titleLower.includes('workshop') || titleLower.includes('bootcamp');
  const isEthnic = titleLower.includes('ethnic') || titleLower.includes('traditional');
  const isFreshers = typeLower.includes('freshers') || titleLower.includes('freshers') || (!isSports && !isHackathon && !isReunion && !isWorkshop && !isEthnic);

  // Form States
  const [entryType, setEntryType] = useState('Individual Entry');
  
  // Category / Track Selection
  const [selectedCategory, setSelectedCategory] = useState(() => {
    if (isSports) return SPORTS_CATEGORIES[0];
    if (isEthnic) return ETHNIC_CATEGORIES[0];
    if (isFreshers) return FRESHERS_CATEGORIES[0];
    if (isHackathon) return HACKATHON_TRACKS[0];
    if (isReunion) return SUMMIT_ROLES[0];
    if (isWorkshop) return WORKSHOP_TRACKS[0];
    return 'General Entry';
  });

  // Category Picker View toggle
  const [isPickingCategory, setIsPickingCategory] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryFilterTab, setCategoryFilterTab] = useState('all');

  // Custom Sport / Event Name
  const [customSportName, setCustomSportName] = useState('');

  // Team Details
  const [teamName, setTeamName] = useState('');
  const [teamMembersText, setTeamMembersText] = useState('');

  // Hackathon Specifics
  const [collegeName, setCollegeName] = useState('SJCE Mysuru');
  const [hackathonTeamMembers, setHackathonTeamMembers] = useState([
    { id: 1, name: fullName, email: userEmail, role: 'Team Leader', isLead: true },
    { id: 2, name: '', email: '', role: 'Developer', isLead: false },
    { id: 3, name: '', email: '', role: 'Designer', isLead: false },
    { id: 4, name: '', email: '', role: 'ML / AI Engineer', isLead: false },
    { id: 5, name: '', email: '', role: 'Tester / QA', isLead: false }
  ]);

  // Reunion Specifics
  const [degreeBatch, setDegreeBatch] = useState(`Batch of ${gradYear} - ${degree} ${department}`);
  const [currentCompanyRole, setCurrentCompanyRole] = useState(`${roleTitle.toLowerCase()} at ${company}`);
  const [guestOption, setGuestOption] = useState(GUEST_OPTIONS[0]);

  // Workshop Specifics
  const [experienceLevel, setExperienceLevel] = useState(WORKSHOP_LEVELS[1]);
  const [workstationOption, setWorkstationOption] = useState(WORKSTATION_OPTIONS[0]);
  const [learningGoals, setLearningGoals] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available options for current event
  const currentCategoryList = useMemo(() => {
    if (isSports) return SPORTS_CATEGORIES;
    if (isEthnic) return ETHNIC_CATEGORIES;
    if (isFreshers) return FRESHERS_CATEGORIES;
    if (isHackathon) return HACKATHON_TRACKS;
    if (isReunion) return SUMMIT_ROLES;
    if (isWorkshop) return WORKSHOP_TRACKS;
    return ['General Entry'];
  }, [isSports, isEthnic, isFreshers, isHackathon, isReunion, isWorkshop]);

  // Filtered categories for the picker modal view
  const filteredPickerOptions = useMemo(() => {
    let list = currentCategoryList;

    if (isSports) {
      if (categoryFilterTab === 'track') {
        list = list.filter(c => c.includes('Sprint') || c.includes('Running') || c.includes('Marathon') || c.includes('Relay'));
      } else if (categoryFilterTab === 'field') {
        list = list.filter(c => c.includes('Jump') || c.includes('Throw') || c.includes('Shot Put'));
      } else if (categoryFilterTab === 'team') {
        list = list.filter(c => c.includes('Cricket') || c.includes('Football') || c.includes('Basketball') || c.includes('Volleyball') || c.includes('Badminton') || c.includes('Tennis') || c.includes('Kabaddi'));
      } else if (categoryFilterTab === 'other') {
        list = list.filter(c => c.includes('Esports') || c.includes('Other') || c.includes('Custom'));
      }
    }

    if (!categorySearch.trim()) return list;

    const query = categorySearch.toLowerCase().trim();
    return list.filter(item => item.toLowerCase().includes(query));
  }, [currentCategoryList, isSports, categoryFilterTab, categorySearch]);

  if (!event) return null;

  // External link handler
  if (event.registrationMode === 'external_link' && event.externalUrl) {
    return (
      <div className="reg-modal-overlay" onClick={onClose}>
        <div className="reg-modal-container" style={{ maxWidth: '440px', padding: '24px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="reg-modal-close-btn" onClick={onClose}><X size={18} /></button>
          </div>
          <ExternalLink size={40} className="text-accent" style={{ margin: '0 auto 12px' }} />
          <h3 className="reg-modal-title">{event.title}</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
            This event uses an official external registration portal. Click below to continue registration.
          </p>
          <a 
            href={event.externalUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="reg-submit-btn"
            style={{ marginTop: '20px', textDecoration: 'none' }}
          >
            Go to Registration Portal <ExternalLink size={15} />
          </a>
        </div>
      </div>
    );
  }

  const handleAddTeamMember = () => {
    setHackathonTeamMembers(prev => [
      ...prev,
      { id: Date.now(), name: '', email: '', role: 'Developer', isLead: false }
    ]);
  };

  const handleRemoveTeamMember = (id) => {
    setHackathonTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleUpdateTeamMember = (id, field, value) => {
    setHackathonTeamMembers(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const isTeamMode = entryType === 'Team / Group Entry';
  const isOtherSelected = selectedCategory.includes('Other') || selectedCategory.includes('Custom');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const effectiveCategory = isOtherSelected && customSportName.trim()
      ? customSportName.trim()
      : selectedCategory;

    const answersPayload = {
      category: effectiveCategory,
      sport: effectiveCategory,
      entryType,
      roleOrPosition: isReunion ? selectedCategory : '',
      teamName: isTeamMode ? teamName : (isHackathon ? teamName : ''),
      teamMembers: isHackathon ? hackathonTeamMembers : teamMembersText,
      institution: isHackathon ? collegeName : '',
      guestOption: isReunion ? guestOption : '',
      degreeBatch: isReunion ? degreeBatch : '',
      currentCompanyRole: isReunion ? currentCompanyRole : '',
      experienceLevel: isWorkshop ? experienceLevel : '',
      workstationOption: isWorkshop ? workstationOption : '',
      learningGoals: isWorkshop ? learningGoals : ''
    };

    const registrationData = {
      userId: user?.id,
      userName: fullName,
      userEmail,
      userRole: user?.role || 'student',
      rollNumber,
      department,
      category: effectiveCategory,
      entryType,
      roleOrPosition: isReunion ? selectedCategory : '',
      teamName: isTeamMode ? teamName : '',
      teamMembers: isHackathon ? hackathonTeamMembers : (teamMembersText ? teamMembersText.split(',').map(s => s.trim()) : []),
      guestOption: isReunion ? guestOption : '',
      companyOrRole: isReunion ? currentCompanyRole : '',
      degreeOrBatch: isReunion ? degreeBatch : '',
      experienceLevel: isWorkshop ? experienceLevel : '',
      workstationOption: isWorkshop ? workstationOption : '',
      answers: answersPayload
    };

    try {
      if (onRegister) {
        await onRegister(event.id, registrationData);
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const identityRolePrefix = user?.role === 'alumni' ? 'Alumni' : user?.role === 'college_admin' ? 'Faculty' : 'Student';
  const avatarInitials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'ST';

  return (
    <div className="reg-modal-overlay" onClick={onClose}>
      <div 
        className="reg-modal-container"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="reg-modal-header">
          <div>
            <h2 className="reg-modal-title">{event.title}</h2>
            <div className="reg-modal-meta-row">
              <span className="reg-modal-meta-item">
                <Calendar size={13} className="text-accent" />
                <span>{formatDate(event.date) || 'Upcoming Event'}{event.time ? ` • ${event.time}` : ''}</span>
              </span>
              <span>•</span>
              <span className="reg-modal-meta-item">
                <MapPin size={13} className="text-accent" />
                <span>{event.location || 'Campus'}</span>
              </span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="reg-modal-close-btn"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        {!submitted ? (
          <div className="reg-modal-body">
            
            {/* View A: Category Picker Drawer / View */}
            {isPickingCategory ? (
              <div className="reg-picker-view">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button 
                    type="button" 
                    onClick={() => setIsPickingCategory(false)}
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      background: 'transparent', 
                      border: 'none', 
                      color: 'var(--accent)', 
                      fontSize: '0.825rem', 
                      fontWeight: 600, 
                      cursor: 'pointer' 
                    }}
                  >
                    <ArrowLeft size={15} /> Back to Form
                  </button>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>
                    Select your category / track
                  </span>
                </div>

                {/* Search Bar */}
                <div className="reg-picker-search">
                  <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input 
                    type="text"
                    autoFocus
                    placeholder="Search category or track (e.g. Coding, Cricket, Dance)..."
                    value={categorySearch}
                    onChange={e => setCategorySearch(e.target.value)}
                    className="reg-picker-search-input"
                  />
                  {categorySearch && (
                    <button 
                      type="button" 
                      onClick={() => setCategorySearch('')}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Sports Category Filter Tabs */}
                {isSports && (
                  <div className="reg-picker-tabs">
                    <button 
                      type="button" 
                      className={`reg-picker-tab-btn ${categoryFilterTab === 'all' ? 'active' : ''}`}
                      onClick={() => setCategoryFilterTab('all')}
                    >
                      All ({SPORTS_CATEGORIES.length})
                    </button>
                    <button 
                      type="button" 
                      className={`reg-picker-tab-btn ${categoryFilterTab === 'track' ? 'active' : ''}`}
                      onClick={() => setCategoryFilterTab('track')}
                    >
                      Track & Running
                    </button>
                    <button 
                      type="button" 
                      className={`reg-picker-tab-btn ${categoryFilterTab === 'field' ? 'active' : ''}`}
                      onClick={() => setCategoryFilterTab('field')}
                    >
                      Jumps & Throws
                    </button>
                    <button 
                      type="button" 
                      className={`reg-picker-tab-btn ${categoryFilterTab === 'team' ? 'active' : ''}`}
                      onClick={() => setCategoryFilterTab('team')}
                    >
                      Team Sports
                    </button>
                    <button 
                      type="button" 
                      className={`reg-picker-tab-btn ${categoryFilterTab === 'other' ? 'active' : ''}`}
                      onClick={() => setCategoryFilterTab('other')}
                    >
                      Other & Custom
                    </button>
                  </div>
                )}

                {/* Interactive Tiles Grid */}
                <div className="reg-picker-grid">
                  {filteredPickerOptions.map((opt, idx) => {
                    const isSelected = opt === selectedCategory;
                    const isOther = opt.includes('Other') || opt.includes('Custom');

                    return (
                      <button
                        key={idx}
                        type="button"
                        className={`reg-picker-tile ${isSelected ? 'active' : ''} ${isOther ? 'other-tile' : ''}`}
                        onClick={() => {
                          setSelectedCategory(opt);
                          setIsPickingCategory(false);
                        }}
                      >
                        <span style={{ flex: 1, wordBreak: 'break-word' }}>
                          {opt}
                        </span>
                        {isSelected && <Check size={15} className="text-accent" style={{ flexShrink: 0, marginLeft: '6px' }} />}
                        {!isSelected && isOther && <Sparkles size={14} className="text-accent" style={{ flexShrink: 0, marginLeft: '6px' }} />}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Other Option Banner */}
                <div className="reg-picker-other-banner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={15} className="text-accent" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                      Don't see your specific category?
                    </span>
                  </div>
                  <button
                    type="button"
                    className="reg-picker-other-btn"
                    onClick={() => {
                      const otherOpt = currentCategoryList.find(c => c.includes('Other') || c.includes('Custom')) || 'Other / Custom Track';
                      setSelectedCategory(otherOpt);
                      setIsPickingCategory(false);
                    }}
                  >
                    Custom Category
                  </button>
                </div>
              </div>
            ) : (
              /* View B: Registration Form View */
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Verified Student Ribbon */}
                <div className="reg-identity-ribbon">
                  <div className="reg-identity-user">
                    <div className="reg-identity-avatar">
                      {avatarInitials}
                    </div>
                    <div className="reg-identity-details">
                      <strong>{fullName}</strong>
                      <span className="text-secondary">({rollNumber} • {department})</span>
                    </div>
                  </div>
                  <div className="reg-identity-badge">
                    <CheckCircle2 size={12} />
                    <span>Verified {identityRolePrefix}</span>
                  </div>
                </div>

                {/* Category / Sport Selection Trigger Box */}
                <div className="reg-form-group">
                  <label className="reg-form-label">
                    <span>{isSports ? 'Selected Sport / Discipline' : 'Selected Category / Track'} *</span>
                    <button 
                      type="button"
                      onClick={() => {
                        setIsPickingCategory(true);
                        setCategorySearch('');
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                    >
                      Browse All Categories
                    </button>
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setIsPickingCategory(true);
                      setCategorySearch('');
                    }}
                    className="reg-category-card-trigger"
                  >
                    <div className="reg-category-selected-info">
                      <Trophy size={16} className="text-accent" style={{ flexShrink: 0 }} />
                      <span className="reg-category-selected-title">
                        {isOtherSelected && customSportName.trim()
                          ? `${customSportName.trim()} (Custom)`
                          : selectedCategory}
                      </span>
                    </div>
                    <div className="reg-category-change-badge">
                      <Edit3 size={12} />
                      <span>Change</span>
                    </div>
                  </button>
                </div>

                {/* Custom Sport / Category Text Input (revealed whenever 'Other / Custom' is chosen) */}
                {isOtherSelected && (
                  <div className="reg-form-group" style={{ background: 'var(--accent-bg)', border: '1px dashed var(--accent)', borderRadius: 'var(--radius-lg, 12px)', padding: '12px 14px' }}>
                    <label className="reg-form-label" style={{ color: 'var(--text-primary)', marginBottom: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                        <Award size={14} className="text-accent" /> Specify Custom Category / Discipline Name *
                      </span>
                    </label>
                    <input 
                      type="text"
                      className="reg-form-input"
                      placeholder="e.g. Swimming 50m Freestyle / Lawn Tennis / Robotics Track"
                      value={customSportName}
                      onChange={e => setCustomSportName(e.target.value)}
                      required
                      autoFocus
                    />
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                      Please specify the exact name of your sport, event, or custom track.
                    </span>
                  </div>
                )}

                {/* Participation Format: Individual vs Team Switch */}
                <div className="reg-form-group">
                  <label className="reg-form-label">Participation Format *</label>
                  <div className="reg-segmented-control">
                    <button
                      type="button"
                      className={`reg-segment-btn ${entryType === 'Individual Entry' ? 'active' : ''}`}
                      onClick={() => setEntryType('Individual Entry')}
                    >
                      <User size={14} /> Individual Entry
                    </button>
                    <button
                      type="button"
                      className={`reg-segment-btn ${entryType === 'Team / Group Entry' ? 'active' : ''}`}
                      onClick={() => setEntryType('Team / Group Entry')}
                    >
                      <Users size={14} /> Team / Group Entry
                    </button>
                  </div>
                </div>

                {/* Team Details (when Team Entry is selected) */}
                {isTeamMode && !isHackathon && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="reg-form-group">
                      <label className="reg-form-label">Team / Squad Name *</label>
                      <input 
                        type="text"
                        className="reg-form-input"
                        placeholder="e.g. Strikers XI / CS Thunderbolts"
                        value={teamName}
                        onChange={e => setTeamName(e.target.value)}
                        required={isTeamMode}
                      />
                    </div>
                    <div className="reg-form-group">
                      <label className="reg-form-label">Team Members *</label>
                      <input 
                        type="text"
                        className="reg-form-input"
                        placeholder="e.g. Rahul, Priya, Amit"
                        value={teamMembersText}
                        onChange={e => setTeamMembersText(e.target.value)}
                        required={isTeamMode}
                      />
                    </div>
                  </div>
                )}

                {/* Hackathon Specific Team Roster Table */}
                {isHackathon && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="reg-form-group">
                        <label className="reg-form-label">Institution / College *</label>
                        <input 
                          type="text"
                          className="reg-form-input"
                          value={collegeName}
                          onChange={e => setCollegeName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="reg-form-group">
                        <label className="reg-form-label">Team Name *</label>
                        <input 
                          type="text"
                          className="reg-form-input"
                          placeholder="e.g. CodeCrafters / AI Knights"
                          value={teamName}
                          onChange={e => setTeamName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="reg-form-group">
                      <label className="reg-form-label">Team Members & Roles (Up to 5)</label>
                      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg, 12px)', overflow: 'hidden', background: 'var(--surface)' }}>
                        <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                          <table style={{ width: '100%', fontSize: '0.78rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ background: 'var(--surface-hover)', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                              <tr>
                                <th style={{ padding: '8px 10px', fontWeight: 600 }}>Name</th>
                                <th style={{ padding: '8px 10px', fontWeight: 600 }}>Email</th>
                                <th style={{ padding: '8px 10px', fontWeight: 600 }}>Role</th>
                                <th style={{ padding: '8px 6px', textAlign: 'center', width: '36px' }}></th>
                              </tr>
                            </thead>
                            <tbody>
                              {hackathonTeamMembers.map((member) => (
                                <tr key={member.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                  <td style={{ padding: '6px 10px' }}>
                                    {member.isLead ? <strong className="text-primary">{member.name}</strong> : (
                                      <input 
                                        type="text" 
                                        placeholder="Full Name"
                                        value={member.name}
                                        onChange={e => handleUpdateTeamMember(member.id, 'name', e.target.value)}
                                        className="reg-form-input"
                                        style={{ padding: '4px 8px', fontSize: '0.75rem', height: '28px' }}
                                      />
                                    )}
                                  </td>
                                  <td style={{ padding: '6px 10px' }}>
                                    {member.isLead ? <span className="text-secondary">{member.email}</span> : (
                                      <input 
                                        type="email" 
                                        placeholder="Email"
                                        value={member.email}
                                        onChange={e => handleUpdateTeamMember(member.id, 'email', e.target.value)}
                                        className="reg-form-input"
                                        style={{ padding: '4px 8px', fontSize: '0.75rem', height: '28px' }}
                                      />
                                    )}
                                  </td>
                                  <td style={{ padding: '6px 10px' }}>
                                    <select 
                                      value={member.role}
                                      onChange={e => handleUpdateTeamMember(member.id, 'role', e.target.value)}
                                      className="reg-form-input"
                                      style={{ padding: '2px 6px', fontSize: '0.75rem', height: '28px', background: 'var(--surface)' }}
                                    >
                                      {HACKATHON_ROLES.map((r, rIdx) => (
                                        <option key={rIdx} value={r}>{r}</option>
                                      ))}
                                    </select>
                                  </td>
                                  <td style={{ padding: '6px', textAlign: 'center' }}>
                                    {member.isLead ? (
                                      <span className="badge badge-accent text-[10px] py-0 px-1.5">Lead</span>
                                    ) : (
                                      <button 
                                        type="button"
                                        onClick={() => handleRemoveTeamMember(member.id)}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--danger, #ef4444)', cursor: 'pointer', padding: '2px' }}
                                        title="Remove member"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div style={{ padding: '8px', background: 'var(--surface-hover)', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
                          <button 
                            type="button" 
                            onClick={handleAddTeamMember}
                            style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Plus size={13} /> Add Team Member
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Alumni Reunion / Summit Specifics */}
                {isReunion && (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="reg-form-group">
                        <label className="reg-form-label">Graduation Batch & Degree *</label>
                        <input 
                          type="text"
                          className="reg-form-input"
                          value={degreeBatch}
                          onChange={e => setDegreeBatch(e.target.value)}
                          required
                        />
                      </div>
                      <div className="reg-form-group">
                        <label className="reg-form-label">Current Company & Role *</label>
                        <input 
                          type="text"
                          className="reg-form-input"
                          value={currentCompanyRole}
                          onChange={e => setCurrentCompanyRole(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="reg-form-group">
                      <label className="reg-form-label">Accompanying Guests / Family *</label>
                      <div className="reg-pills-grid">
                        {GUEST_OPTIONS.map((g, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`reg-pill-btn ${guestOption === g ? 'active' : ''}`}
                            onClick={() => setGuestOption(g)}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Technical Workshop Specifics */}
                {isWorkshop && (
                  <>
                    <div className="reg-form-group">
                      <label className="reg-form-label">Experience Level</label>
                      <div className="reg-pills-grid">
                        {WORKSHOP_LEVELS.map((lvl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`reg-pill-btn ${experienceLevel === lvl ? 'active' : ''}`}
                            onClick={() => setExperienceLevel(lvl)}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="reg-form-group">
                      <label className="reg-form-label">Laptop & Workstation Setup</label>
                      <div className="reg-pills-grid">
                        {WORKSTATION_OPTIONS.map((w, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`reg-pill-btn ${workstationOption === w ? 'active' : ''}`}
                            onClick={() => setWorkstationOption(w)}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Action Button */}
                <div style={{ marginTop: '4px' }}>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="reg-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Confirming Registration...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Confirm Registration</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Security Footer Note */}
                <div style={{ textAlign: 'center', fontSize: '0.725rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <ShieldCheck size={13} className="text-accent" />
                  <span>Verified campus registration • Instant digital gate pass confirmation</span>
                </div>

              </form>
            )}

          </div>
        ) : (
          /* Confirmation Screen */
          <div className="reg-confirm-container">
            <div className="reg-confirm-badge-icon">
              <CheckCircle2 size={32} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>
                Registration Confirmed!
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Your participant seat for <strong className="text-primary">{event.title}</strong> has been secured.
              </p>
            </div>

            {/* Summary Card */}
            <div className="reg-confirm-card-summary">
              <div className="reg-confirm-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Registered Track:</span>
                <strong className="text-primary">{isOtherSelected && customSportName.trim() ? customSportName : selectedCategory}</strong>
              </div>
              <div className="reg-confirm-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Format:</span>
                <span className="text-primary">{entryType}</span>
              </div>
              <div className="reg-confirm-summary-row">
                <span style={{ color: 'var(--text-secondary)' }}>Participant:</span>
                <span className="text-primary">{fullName} ({rollNumber})</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
              <button 
                type="button"
                onClick={() => onOpenGatePass ? onOpenGatePass(event) : onClose()}
                className="reg-confirm-btn-primary"
              >
                <Ticket size={16} /> View My Digital Gate Pass & QR
              </button>

              <button 
                type="button"
                onClick={onClose}
                className="reg-confirm-btn-secondary"
              >
                <Compass size={16} className="text-accent" /> Done / Back to Events
              </button>
            </div>

            <p style={{ fontSize: '0.725rem', color: 'var(--text-tertiary)', margin: 0 }}>
              You can also access your Digital Gate Pass anytime directly from the event card.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
