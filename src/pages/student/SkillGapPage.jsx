import { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../utils/api';
import { 
  Sparkles, Database, Code2, Cloud, BrainCircuit, Layout, Terminal,
  Plus, X, ArrowRight, RotateCcw, MessageSquare, CheckCircle, 
  Check, Play, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Users, Target, ExternalLink,
  Video, FileCheck, Send, Layers, Server, Search
} from 'lucide-react';
import { 
  FEATURED_CAREER_ROLES, ALL_CAREER_ROLES_METADATA, DEFAULT_STARTING_SKILLS, 
  POPULAR_SUGGESTED_SKILLS, getAlumniTwinsForRole,
  getPracticePlatformsForTool, getSafeYouTubeUrl
} from '../../data/alumniTwinData';
import './SkillGapPage.css';

// Icon Map for Dynamic Component Resolution
const ROLE_ICONS = {
  Database: Database,
  Code2: Code2,
  Cloud: Cloud,
  BrainCircuit: BrainCircuit,
  Layout: Layout,
  Terminal: Terminal,
  Layers: Layers,
  Server: Server
};

export default function SkillGapPage() {
  const { user } = useAuth();

  // State
  const [selectedRole, setSelectedRole] = useState('Cloud Backend Engineer');
  const [selectedTwinIndex, setSelectedTwinIndex] = useState(0);
  const [startingSkills, setStartingSkills] = useState(DEFAULT_STARTING_SKILLS);
  const [newSkillInput, setNewSkillInput] = useState('');
  const skillInputRef = useRef(null);

  // Custom Roles Dropdown State
  const [isRolesDropdownOpen, setIsRolesDropdownOpen] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Navigation & Detection State
  const [hasDetected, setHasDetected] = useState(false);
  const [activeTab, setActiveTab] = useState('missing-tools'); // 'missing-tools' | 'roadmap' | 'courses'
  const [coursesSubTab, setCoursesSubTab] = useState('videos'); // 'videos' | 'practice'
  
  // Interactive Roadmap Checkboxes
  const [completedMilestones, setCompletedMilestones] = useState({});
  
  // Collapsible Interview Accordions
  const [expandedQa, setExpandedQa] = useState(null);

  // Mentorship Connect Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectTopic, setConnectTopic] = useState('1:1 Resume & Skill Gap Review');
  const [connectMessage, setConnectMessage] = useState('');
  const [connectSuccess, setConnectSuccess] = useState(false);

  // Missing Tools Domain Filter State
  const [selectedToolCategory, setSelectedToolCategory] = useState('all');

  // Selected Visual Roadmap Phase Index & Floating Drawer State
  const [selectedRoadmapPhaseIndex, setSelectedRoadmapPhaseIndex] = useState(0);
  const [isPhaseDrawerOpen, setIsPhaseDrawerOpen] = useState(false);

  // Load saved career profile from MongoDB
  useEffect(() => {
    if (!user?.id) return;
    apiRequest(`/career/profile/${user.id}`)
      .then(profile => {
        if (profile) {
          if (profile.careerTarget) setSelectedRole(profile.careerTarget);
          if (profile.roadmapProgress && typeof profile.roadmapProgress === 'object') {
            setCompletedMilestones(profile.roadmapProgress);
          }
          if (Array.isArray(profile.skills) && profile.skills.length > 0) {
            setStartingSkills(profile.skills);
          }
        }
      })
      .catch(err => console.warn('Could not load student career profile from DB:', err));
  }, [user?.id]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRolesDropdownOpen(false);
      }
    }
    if (isRolesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRolesDropdownOpen]);

  // Available Alumni Twins for the chosen career role
  const availableTwins = useMemo(() => {
    return getAlumniTwinsForRole(selectedRole, startingSkills);
  }, [selectedRole, startingSkills]);

  // Active Selected Alumni Twin Data
  const twin = availableTwins[selectedTwinIndex] || availableTwins[0];

  // Roadmap Progress Stats Calculations
  const allRoadmapMilestones = useMemo(() => {
    return (twin.roadmapPhases || []).flatMap(p => p.milestones || []);
  }, [twin.roadmapPhases]);

  const totalMilestonesCount = allRoadmapMilestones.length;
  const completedMilestonesCount = allRoadmapMilestones.filter(m => completedMilestones[m.id]).length;
  const overallProgressPercent = totalMilestonesCount > 0 
    ? Math.round((completedMilestonesCount / totalMilestonesCount) * 100) 
    : 0;

  // Filtered Missing Tools based on category
  const filteredMissingTools = useMemo(() => {
    if (selectedToolCategory === 'all') return twin.missingTools || [];
    return (twin.missingTools || []).filter(t => t.category === selectedToolCategory);
  }, [twin.missingTools, selectedToolCategory]);

  // Filtered Career Roles for Dropdown
  const filteredRoles = useMemo(() => {
    if (!roleSearchQuery.trim()) return ALL_CAREER_ROLES_METADATA;
    return ALL_CAREER_ROLES_METADATA.filter(r => 
      r.title.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(roleSearchQuery.toLowerCase())
    );
  }, [roleSearchQuery]);

  // Handle Role Change
  const handleRoleChange = (newRole) => {
    setSelectedRole(newRole);
    setSelectedTwinIndex(0);
    setSelectedToolCategory('all');
    setCompletedMilestones({});
    setExpandedQa(null);
    setIsRolesDropdownOpen(false);
    if (user?.id) {
      apiRequest(`/career/target/${user.id}`, 'PUT', { targetRole: newRole }).catch(() => {});
    }
  };

  // Helper to persist skills to DB
  const persistSkillsToDb = (updatedSkills) => {
    if (!user?.id) return;
    apiRequest(`/members/${user.id}`, 'PUT', { skills: updatedSkills }).catch(() => {});
  };

  // Add Skill Tag (supports comma separation & single additions)
  const handleAddSkill = (e) => {
    if (e) e.preventDefault();
    const trimmed = newSkillInput.trim().replace(/^,+|,+$/g, '');
    if (trimmed) {
      const parts = trimmed.split(',').map(s => s.trim()).filter(Boolean);
      const newSkills = parts.filter(s => !startingSkills.some(existing => existing.toLowerCase() === s.toLowerCase()));
      if (newSkills.length > 0) {
        const next = [...startingSkills, ...newSkills];
        setStartingSkills(next);
        persistSkillsToDb(next);
      }
      setNewSkillInput('');
    }
  };

  // Keyboard shortcut handler for tag input (Enter or Comma)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    } else if (e.key === 'Backspace' && newSkillInput === '' && startingSkills.length > 0) {
      const next = startingSkills.slice(0, -1);
      setStartingSkills(next);
      persistSkillsToDb(next);
    }
  };

  // Remove Skill Tag
  const handleRemoveSkill = (skillToRemove) => {
    const next = startingSkills.filter(s => s !== skillToRemove);
    setStartingSkills(next);
    persistSkillsToDb(next);
  };

  // Quick Suggestion Click
  const handleAddSuggestedSkill = (skill) => {
    if (!startingSkills.includes(skill)) {
      const next = [...startingSkills, skill];
      setStartingSkills(next);
      persistSkillsToDb(next);
    }
  };

  // Toggle Milestone in Roadmap (Increases/decreases progress percentage)
  const toggleMilestone = (id, e) => {
    if (e) e.stopPropagation();
    setCompletedMilestones(prev => {
      const updated = {
        ...prev,
        [id]: !prev[id]
      };
      if (user?.id) {
        apiRequest(`/career/roadmap/${user.id}`, 'PUT', {
          roadmapProgress: updated,
          targetRole: selectedRole
        }).catch(() => {});
      }
      return updated;
    });
  };

  // Toggle Entire Phase Complete (Click to Done)
  const togglePhaseComplete = (phase, e) => {
    if (e) e.stopPropagation();
    const phaseMilestones = phase.milestones || [];
    if (phaseMilestones.length === 0) return;

    const isAllCurrentlyDone = phaseMilestones.every(m => completedMilestones[m.id]);
    const newCompleted = { ...completedMilestones };

    phaseMilestones.forEach(m => {
      newCompleted[m.id] = !isAllCurrentlyDone;
    });

    setCompletedMilestones(newCompleted);
    if (user?.id) {
      apiRequest(`/career/roadmap/${user.id}`, 'PUT', {
        roadmapProgress: newCompleted,
        targetRole: selectedRole
      }).catch(() => {});
    }
  };

  // Open Connect Modal
  const handleOpenConnectModal = () => {
    setConnectMessage(`Hi ${twin.name}, I noticed you are placed as a ${twin.currentRole} at ${twin.currentCompany}. I am targeting the same career path and would love 15 minutes of guidance on mastering the key skill gaps!`);
    setConnectSuccess(false);
    setIsConnectModalOpen(true);
  };

  // Submit Mentorship Message
  const handleSendConnection = (e) => {
    e.preventDefault();
    setConnectSuccess(true);
    setTimeout(() => {
      setIsConnectModalOpen(false);
      setConnectSuccess(false);
    }, 2000);
  };

  return (
    <div className="skill-gap-container">
      {/* ── TOP HEADER (Present on both screens) ── */}
      <div className="skill-gap-top-header">
        <div className="intelligence-pill-badge">
          <Sparkles size={15} />
          <span>The Alumni Twin Intelligence Model</span>
        </div>
        <h1 className="skill-gap-main-title">Skill Gap Detector</h1>
        <p className="skill-gap-subtitle">
          Match with a real placed senior from your college who started from your skill level and discover the exact tools they learned to get hired.
        </p>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: SELECTION & INPUT SCREEN (Matches Image 1)
         ───────────────────────────────────────────────────────────── */}
      {!hasDetected ? (
        <div className="skill-gap-card-box">
          {/* Step 1: Select Career Role */}
          <div className="step-section-title">
            <span className="step-num-badge">1</span>
            <span>Select Your Target Career Role</span>
          </div>

          {/* 6 Featured Role Cards Grid */}
          <div className="roles-grid">
            {FEATURED_CAREER_ROLES.map((role) => {
              const IconComp = ROLE_ICONS[role.icon] || Code2;
              const isSelected = selectedRole === role.title;
              return (
                <button
                  key={role.id}
                  type="button"
                  className={`role-card-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleRoleChange(role.title)}
                >
                  <div className="role-card-icon-wrap">
                    <IconComp size={20} />
                  </div>
                  <div className="role-card-text">
                    <span className="role-card-title">{role.title}</span>
                    <span className="role-card-subtitle">{role.subtitle}</span>
                  </div>
                  {isSelected && <span className="role-selected-dot"></span>}
                </button>
              );
            })}
          </div>

          {/* ── Custom Styled "More Roles" Selector & Floating Popover ── */}
          <div className="custom-dropdown-container" ref={dropdownRef}>
            <div 
              className={`more-roles-interactive-bar ${isRolesDropdownOpen ? 'open' : ''}`}
              onClick={() => setIsRolesDropdownOpen(!isRolesDropdownOpen)}
            >
              <div className="more-roles-left-meta">
                <span className="more-roles-label">More Roles:</span>
                <span className="more-roles-current-val">{selectedRole}</span>
              </div>
              <div className="more-roles-right-meta">
                <span className="more-roles-count-pill">{ALL_CAREER_ROLES_METADATA.length} available</span>
                <ChevronDown 
                  size={16} 
                  className={`more-roles-arrow-icon ${isRolesDropdownOpen ? 'rotated' : ''}`} 
                />
              </div>
            </div>

            {/* Floating Dropdown Popover */}
            {isRolesDropdownOpen && (
              <div className="custom-roles-popover-menu animate-fade-in">
                {/* Search Header */}
                <div className="dropdown-search-box">
                  <Search size={14} className="dropdown-search-icon" />
                  <input
                    type="text"
                    className="dropdown-search-input"
                    placeholder="Search career role or domain..."
                    value={roleSearchQuery}
                    onChange={(e) => setRoleSearchQuery(e.target.value)}
                    autoFocus
                  />
                  {roleSearchQuery && (
                    <button 
                      type="button" 
                      className="dropdown-clear-btn"
                      onClick={() => setRoleSearchQuery('')}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Roles Options List */}
                <div className="dropdown-roles-list">
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((r) => {
                      const IconComp = ROLE_ICONS[r.icon] || Code2;
                      const isSelected = selectedRole === r.title;
                      return (
                        <div
                          key={r.title}
                          className={`dropdown-role-option ${isSelected ? 'active' : ''}`}
                          onClick={() => handleRoleChange(r.title)}
                        >
                          <div className="dropdown-option-icon-box">
                            <IconComp size={16} />
                          </div>
                          <div className="dropdown-option-details">
                            <div className="dropdown-option-title-row">
                              <span className="dropdown-option-title">{r.title}</span>
                              <span className="dropdown-option-category">{r.category}</span>
                            </div>
                            <span className="dropdown-option-desc">{r.desc}</span>
                          </div>
                          {isSelected && (
                            <div className="dropdown-option-check">
                              <Check size={16} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="dropdown-empty-search">
                      No career roles matching "{roleSearchQuery}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Starting Skills Header */}
          <div className="flex justify-between items-center mt-6 mb-2">
            <div className="step-section-title mb-0">
              <span className="step-num-badge">2</span>
              <span>Your Current Starting Skills</span>
              <span className="skill-count-badge">({startingSkills.length} selected)</span>
            </div>
            <div className="flex items-center gap-3">
              {startingSkills.length > 0 ? (
                <button
                  type="button"
                  className="skill-action-link text-secondary hover:text-danger"
                  onClick={() => setStartingSkills([])}
                  title="Clear all selected skills"
                >
                  <RotateCcw size={12} /> Clear All
                </button>
              ) : (
                <button
                  type="button"
                  className="skill-action-link text-accent"
                  onClick={() => setStartingSkills(DEFAULT_STARTING_SKILLS)}
                >
                  Reset Defaults
                </button>
              )}
            </div>
          </div>

          {/* Starting Skills Box */}
          <div className="starting-skills-container" onClick={() => skillInputRef.current?.focus()}>
            {startingSkills.map((skill) => (
              <span key={skill} className="skill-tag-pill">
                <span>{skill}</span>
                <button
                  type="button"
                  className="skill-tag-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveSkill(skill);
                  }}
                  title={`Remove ${skill}`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}

            <form onSubmit={handleAddSkill} className="skill-input-form" onClick={(e) => e.stopPropagation()}>
              <input
                ref={skillInputRef}
                type="text"
                className="skill-inline-input"
                placeholder={startingSkills.length === 0 ? "Type skill name (e.g. Docker, TypeScript, React) & press Enter..." : "+ Add another skill..."}
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="submit"
                className={`skill-add-submit-btn ${newSkillInput.trim() ? 'active' : ''}`}
                disabled={!newSkillInput.trim()}
                title="Add Skill"
              >
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            </form>
          </div>

          {/* Quick Suggestions Row */}
          <div className="skill-suggestions-row">
            <span className="skill-suggestion-label">Suggested:</span>
            {POPULAR_SUGGESTED_SKILLS.filter(s => !startingSkills.includes(s)).slice(0, 7).map((skill) => (
              <button
                key={skill}
                type="button"
                className="skill-suggestion-btn"
                onClick={() => handleAddSuggestedSkill(skill)}
              >
                + {skill}
              </button>
            ))}
          </div>

          {/* Big Green CTA Button */}
          <button
            type="button"
            className="detect-action-btn"
            onClick={() => setHasDetected(true)}
          >
            <Sparkles size={18} />
            <span>Detect Skill Gap & Find Alumni Twin</span>
            <ArrowRight size={18} />
          </button>

          {/* Trust Stats Footer */}
          <div className="trust-stats-footer">
            <div className="trust-stat-item">
              <Users size={15} />
              <span>500+ Verified Placed Seniors</span>
            </div>
            <span className="trust-stat-dot"></span>
            <div className="trust-stat-item">
              <Target size={15} />
              <span>Real Interview Hiring Deltas</span>
            </div>
            <span className="trust-stat-dot"></span>
            <div className="trust-stat-item">
              <MessageSquare size={15} />
              <span>1-Click Senior Mentorship</span>
            </div>
          </div>
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────
            VIEW 2: ANALYSIS & ALUMNI TWIN RESULTS SCREEN (Matches Image 2)
           ───────────────────────────────────────────────────────────── */
        <div>
          {/* Target Role Summary & Change Bar */}
          <div className="results-target-bar">
            <div className="target-role-badge-wrap">
              <span className="target-role-label">Target Role:</span>
              <span className="target-role-pill">{selectedRole}</span>
            </div>

            <button
              type="button"
              className="change-target-btn"
              onClick={() => setHasDetected(false)}
            >
              <RotateCcw size={13} />
              <span>Change Target Role</span>
            </button>
          </div>

          {/* Multi-Senior Twin Selector Panel */}
          {availableTwins.length > 1 && (
            <div className="multi-twin-selection-panel">
              <div className="multi-twin-panel-header">
                <div className="multi-twin-title-wrap">
                  <h3 className="multi-twin-title">
                    <Users size={16} />
                    <span>Choose Placed Senior Blueprint:</span>
                  </h3>
                  <span className="multi-twin-badge">{availableTwins.length} Paths Available</span>
                </div>
                <p className="multi-twin-subtitle">
                  Select a senior whose target company or tech stack matches your placement goals.
                </p>
              </div>

              <div className="twin-cards-selector-grid">
                {availableTwins.map((t, idx) => {
                  const isSelected = idx === selectedTwinIndex;
                  return (
                    <div
                      key={t.id || idx}
                      className={`twin-select-card ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedTwinIndex(idx);
                        setCompletedMilestones({});
                        setExpandedQa(null);
                      }}
                    >
                      <div className="twin-select-avatar">
                        {t.initials}
                      </div>

                      <div className="twin-select-info">
                        <div className="twin-select-name-row">
                          <span className="twin-select-name">{t.name}</span>
                          {isSelected && <CheckCircle size={15} className="twin-active-check-icon" />}
                        </div>
                        <div className="twin-select-company">
                          {t.currentCompany} <span>• {t.package}</span>
                        </div>
                        <div className="twin-select-stack">
                          🛠️ {t.stackFocus || t.missingTools.map(m => m.category).slice(0, 2).join(' + ')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3 Result Navigation Tabs */}
          <div className="results-tabs-bar">
            <button
              type="button"
              className={`result-tab-btn ${activeTab === 'missing-tools' ? 'active' : ''}`}
              onClick={() => setActiveTab('missing-tools')}
            >
              <Sparkles size={16} />
              <span>{twin.missingTools.length} Missing Tools Overview</span>
            </button>

            <button
              type="button"
              className={`result-tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveTab('roadmap')}
            >
              <Target size={16} />
              <span>Visual Milestone Roadmap</span>
            </button>

            <button
              type="button"
              className={`result-tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <Play size={16} />
              <span>YouTube Courses & Practice Hub</span>
            </button>
          </div>

          {/* ── TAB 1: MISSING TOOLS & ALUMNI TWIN OVERVIEW ── */}
          {activeTab === 'missing-tools' && (
            <div className="alumni-twin-container">
              {/* Senior Profile Header Bar */}
              <div className="senior-profile-header">
                <div className="senior-meta-left">
                  <div className="senior-avatar-box">
                    {twin.initials || 'SR'}
                  </div>
                  <div>
                    <div className="senior-name-row">
                      <span className="senior-name">{twin.name}</span>
                      <CheckCircle size={18} className="senior-verified-icon" />
                    </div>
                    <div className="senior-placement-text">
                      Placed as <strong>{twin.currentRole}</strong> at <strong>{twin.currentCompany}</strong> • {twin.package}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="connect-senior-btn"
                  onClick={handleOpenConnectModal}
                >
                  <MessageSquare size={15} />
                  <span>Connect with {twin.name.split(' ')[0]}</span>
                </button>
              </div>

              {/* Dynamic Skill Match & Acquired Skills Diagnosis Card */}
              <div className="skill-diagnosis-card">
                <div className="diagnosis-top-row">
                  <div className="diagnosis-score-badge">
                    {twin.matchPercentage || 60}% Match
                  </div>
                  <div>
                    <h4 className="diagnosis-title">
                      {twin.acquiredSkills?.length || startingSkills.length} of Your Current Skills Directly Match {twin.currentRole}
                    </h4>
                    <p className="diagnosis-subtitle">
                      Great baseline! We verified your mastered skills and isolated the <strong>{twin.missingTools.length} remaining high-yield gaps</strong> you need to reach {twin.package} at {twin.currentCompany}.
                    </p>
                  </div>
                </div>

                <div className="diagnosis-acquired-skills-row">
                  <span className="acquired-label">Verified Mastered Skills:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {(twin.acquiredSkills || startingSkills).map((skill, sIdx) => (
                      <span key={sIdx} className="acquired-skill-chip">
                        <Check size={12} className="text-accent font-bold" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Baseline Insight Quote */}
              <div className="baseline-headline-quote">
                "{twin.name.split(' ')[0]} started with your foundational skill baseline. Here are the{' '}
                <span className="baseline-highlight">
                  {twin.missingTools.length} specific tools
                </span>{' '}
                {twin.gender === 'female' ? 'she' : 'he'} learned to get hired at {twin.currentCompany}:"
              </div>

              {/* Category Filter Chips Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs text-secondary font-semibold mr-1">Filter by Domain:</span>
                  <button
                    type="button"
                    className={`tool-filter-chip ${selectedToolCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedToolCategory('all')}
                  >
                    All Gaps ({twin.missingTools.length})
                  </button>
                  {Array.from(new Set(twin.missingTools.map(t => t.category))).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      className={`tool-filter-chip ${selectedToolCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedToolCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-secondary font-medium">
                  Showing <strong>{filteredMissingTools.length}</strong> of <strong>{twin.missingTools.length}</strong> skill gaps
                </div>
              </div>

              {/* Missing Tools Cards Grid (Dynamic 3 to 6+ tools) */}
              <div className="missing-tools-grid">
                {filteredMissingTools.map((tool, idx) => (
                  <div key={tool.title || idx} className="missing-tool-card">
                    <div>
                      <div className="tool-card-top-row">
                        <span className="tool-number-pill">Tool #{idx + 1}</span>
                        <span className="tool-duration-text">{tool.duration}</span>
                      </div>

                      <h3 className="tool-title">{tool.title}</h3>
                      <div className="tool-category-badge">{tool.category}</div>

                      <p className="tool-why-text">
                        <strong>Why it mattered:</strong> {tool.whyItMattered}
                      </p>
                    </div>

                    <div className="tool-practice-box">
                      <div className="practice-label">PRACTICE PROJECT:</div>
                      <div className="practice-title">{tool.practiceProject}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Senior's Interview Advice Box */}
              <div className="senior-advice-box">
                <div className="senior-advice-title-row">
                  <MessageSquare size={17} />
                  <span>{twin.name.split(' ')[0]}'s Interview Advice for {twin.currentCompany}:</span>
                </div>
                <p className="senior-advice-quote">
                  "{twin.advice}"
                </p>
              </div>
            </div>
          )}

          {/* ── TAB 2: INTERACTIVE TREE BRANCH ROADMAP & FLOATING DRAWER ── */}
          {activeTab === 'roadmap' && (
            <div className="alumni-twin-container">
              {/* Personalized Journey Header Banner */}
              <div className="personalized-roadmap-banner">
                <div className="roadmap-banner-top-row">
                  <div className="roadmap-pathway-pills">
                    <div className="roadmap-start-pill">
                      <span className="pill-dot"></span>
                      <span>Starting Baseline: {startingSkills.slice(0, 3).join(', ')}</span>
                    </div>
                    <ArrowRight size={14} className="text-secondary" />
                    <div className="roadmap-goal-pill">
                      <Target size={13} />
                      <span>Goal: {twin.currentRole} at {twin.currentCompany} ({twin.package})</span>
                    </div>
                  </div>

                  <div className="roadmap-meta-stats">
                    <span>⏱️ Total Duration: <strong>16 Weeks (120 hrs)</strong></span>
                  </div>
                </div>

                {/* Progress Bar Row */}
                <div className="roadmap-progress-container">
                  <div className="roadmap-progress-labels">
                    <span className="text-xs font-bold text-primary">
                      Overall Career Tree Progress
                    </span>
                    <span className="text-xs font-bold text-accent">
                      {completedMilestonesCount} of {totalMilestonesCount} Milestones Completed ({overallProgressPercent}%)
                    </span>
                  </div>
                  <div className="roadmap-progress-track">
                    <div 
                      className="roadmap-progress-fill" 
                      style={{ width: `${overallProgressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* ── TREE BRANCH ROADMAP DIAGRAM ── */}
              <div className="tree-roadmap-canvas">
                {/* Root Starting Node */}
                <div className="tree-root-node">
                  <div className="tree-root-badge">
                    <Sparkles size={15} />
                    <span>Current Baseline: {startingSkills.slice(0, 4).join(' • ')}</span>
                  </div>
                </div>

                {/* Central Trunk Spine */}
                <div className="tree-trunk-line">
                  <div 
                    className="tree-trunk-fill"
                    style={{ height: `${overallProgressPercent}%` }}
                  ></div>
                </div>

                {/* Tree Branches with Rich Interactive Cards */}
                <div className="tree-branches-container">
                  {twin.roadmapPhases.map((phase, idx) => {
                    const isLeft = idx % 2 === 0;
                    const phaseMilestones = phase.milestones || [];
                    const phaseCompleted = phaseMilestones.filter(m => completedMilestones[m.id]).length;
                    const isAllDone = phaseMilestones.length > 0 && phaseCompleted === phaseMilestones.length;
                    const isCurrent = !isAllDone && (idx === 0 || (twin.roadmapPhases[idx - 1]?.milestones || []).every(m => completedMilestones[m.id]));
                    const isSelected = isPhaseDrawerOpen && selectedRoadmapPhaseIndex === idx;

                    // Fallback domain icons
                    const icons = [Layout, Server, Database, Terminal, Sparkles, Cloud];
                    const PhaseIcon = ROLE_ICONS[phase.icon] || icons[idx % icons.length] || Sparkles;

                    return (
                      <div 
                        key={phase.phase || idx} 
                        className={`tree-branch-item ${isLeft ? 'branch-left' : 'branch-right'}`}
                      >
                        {/* Connecting Stem to Trunk */}
                        <div className={`tree-stem-connector ${isAllDone ? 'done' : ''}`}></div>

                        {/* Interactive Trunk Node Dot */}
                        <div 
                          className={`tree-trunk-node-dot ${isAllDone ? 'done' : ''} ${isCurrent ? 'active-pulse' : ''} ${isSelected ? 'selected' : ''}`}
                          onClick={(e) => togglePhaseComplete(phase, e)}
                          title={isAllDone ? `Phase ${phase.phase} Done! Click to undo` : `Click to complete Phase ${phase.phase}`}
                        >
                          {isAllDone ? (
                            <Check size={14} className="text-inverse" />
                          ) : (
                            <span>{phase.phase}</span>
                          )}
                        </div>

                        {/* Rich Interactive Phase Card on Branch */}
                        <div 
                          className={`tree-branch-card ${isAllDone ? 'completed' : ''} ${isCurrent ? 'in-focus' : ''} ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedRoadmapPhaseIndex(idx);
                            setIsPhaseDrawerOpen(true);
                          }}
                        >
                          {/* Card Top Header */}
                          <div className="tree-card-top-row">
                            <div className="tree-card-icon-title-group">
                              <div className="tree-card-icon-box">
                                <PhaseIcon size={15} />
                              </div>
                              <div className="tree-phase-meta-wrap">
                                <span className="tree-phase-pill">Phase {phase.phase}</span>
                                <span className="tree-weeks-tag">{phase.weeks}</span>
                              </div>
                            </div>

                            {/* Interactive Click-To-Done Icon Button */}
                            <button
                              type="button"
                              className={`tree-mark-done-icon-btn ${isAllDone ? 'done' : ''}`}
                              onClick={(e) => togglePhaseComplete(phase, e)}
                              title={isAllDone ? `Phase ${phase.phase} Completed! Click to undo` : `Mark Phase ${phase.phase} complete (+20%)`}
                              aria-label={isAllDone ? "Mark phase incomplete" : "Mark phase complete"}
                            >
                              <Check size={14} strokeWidth={isAllDone ? 3 : 2.2} />
                            </button>
                          </div>

                          {/* Phase Title */}
                          <h4 className="tree-card-title">{phase.title}</h4>

                          {/* Interactive Sprint Checkpoints directly on Card */}
                          <div className="tree-card-sprints-list">
                            {phaseMilestones.map((m) => {
                              const isDone = !!completedMilestones[m.id];
                              return (
                                <div
                                  key={m.id}
                                  className={`tree-sprint-mini-item ${isDone ? 'done' : ''}`}
                                  onClick={(e) => toggleMilestone(m.id, e)}
                                  title="Click to toggle milestone completion"
                                >
                                  <div className={`tree-sprint-checkbox ${isDone ? 'checked' : ''}`}>
                                    {isDone && <Check size={10} />}
                                  </div>
                                  <span className="tree-sprint-text">{m.text}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Progress Meter & Interactive Footer */}
                          <div className="tree-card-footer">
                            <div className="tree-card-progress-col">
                              <div className="tree-mini-progress-label">
                                {phaseCompleted} of {phaseMilestones.length} Sprints ({phaseMilestones.length > 0 ? Math.round((phaseCompleted / phaseMilestones.length) * 100) : 0}%)
                              </div>
                              <div className="tree-mini-progress-track">
                                <div 
                                  className="tree-mini-progress-fill" 
                                  style={{ width: `${phaseMilestones.length > 0 ? (phaseCompleted / phaseMilestones.length) * 100 : 0}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="tree-action-trigger">
                              <span>Full Specs</span>
                              <ArrowRight size={13} className="tree-arrow-icon" />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Target Goal Crown Node */}
                <div className="tree-goal-node">
                  <div className="tree-goal-badge">
                    <Target size={16} />
                    <span>Target Placement: {twin.currentRole} at {twin.currentCompany} ({twin.package})</span>
                  </div>
                </div>
              </div>

              {/* ── SIDE FLOATING WINDOW / SLIDING DRAWER ── */}
              {isPhaseDrawerOpen && twin.roadmapPhases[selectedRoadmapPhaseIndex] && (() => {
                const currentPhase = twin.roadmapPhases[selectedRoadmapPhaseIndex];
                const phaseMilestones = currentPhase.milestones || [];
                const phaseCompleted = phaseMilestones.filter(m => completedMilestones[m.id]).length;
                const isAllDone = phaseMilestones.length > 0 && phaseCompleted === phaseMilestones.length;

                return (
                  <div className="side-drawer-backdrop" onClick={() => setIsPhaseDrawerOpen(false)}>
                    <div className="side-drawer-window" onClick={(e) => e.stopPropagation()}>
                      {/* Drawer Header */}
                      <div className="side-drawer-header">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="phase-number-pill">Phase {currentPhase.phase} Blueprint</span>
                            <span className="phase-weeks-meta">
                              {currentPhase.weeks} • {currentPhase.commitment}
                            </span>
                          </div>
                          <h3 className="side-drawer-title">{currentPhase.title}</h3>
                        </div>

                        <button
                          type="button"
                          className="side-drawer-close-btn"
                          onClick={() => setIsPhaseDrawerOpen(false)}
                          title="Close Details (Esc)"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Drawer Scrollable Content */}
                      <div className="side-drawer-body">
                        {/* Quick Toggle Phase Completion Bar */}
                        <div className="drawer-quick-complete-bar">
                          <div className="text-xs font-bold text-primary">
                            Phase Status: {isAllDone ? 'Completed (100%)' : `${phaseCompleted}/${phaseMilestones.length} Completed`}
                          </div>
                          <button
                            type="button"
                            className={`tree-mark-done-btn ${isAllDone ? 'done' : ''}`}
                            onClick={(e) => togglePhaseComplete(currentPhase, e)}
                          >
                            {isAllDone ? (
                              <>
                                <Check size={12} />
                                <span>Mark Incomplete</span>
                              </>
                            ) : (
                              <>
                                <span className="done-dot-indicator"></span>
                                <span>Mark Whole Phase Done</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Phase Goal & Description */}
                        <div className="drawer-overview-card">
                          <p className="side-drawer-desc">{currentPhase.description}</p>
                        </div>

                        {/* Key Skills Unlocked */}
                        {currentPhase.keySkills && currentPhase.keySkills.length > 0 && (
                          <div className="phase-skills-unlock-row">
                            <span className="text-xs text-secondary font-bold mr-2">Core Tech Stack:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {currentPhase.keySkills.map(skill => (
                                <span key={skill} className="skill-tag-pill">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actionable Sprint Milestones Checklist */}
                        <div className="phase-milestones-section">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-primary uppercase tracking-wide">
                              Sprint Milestones & Checkpoints ({phaseCompleted}/{phaseMilestones.length} Completed)
                            </span>
                            {isAllDone && (
                              <span className="text-xs font-bold text-accent">✓ Phase Completed!</span>
                            )}
                          </div>

                          <div className="milestones-checklist">
                            {phaseMilestones.map((m) => {
                              const isDone = !!completedMilestones[m.id];
                              return (
                                <div
                                  key={m.id}
                                  className={`milestone-check-item ${isDone ? 'done' : ''}`}
                                  onClick={(e) => toggleMilestone(m.id, e)}
                                >
                                  <div className={`milestone-checkbox-box ${isDone ? 'checked' : ''}`}>
                                    {isDone && <Check size={12} />}
                                  </div>
                                  <span>{m.text}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Capstone Deliverable Card */}
                        {currentPhase.capstoneDeliverable && (
                          <div className="phase-capstone-box">
                            <div className="practice-label">PHASE CAPSTONE PROJECT DELIVERABLE:</div>
                            <div className="practice-title">{currentPhase.capstoneDeliverable}</div>
                          </div>
                        )}

                        {/* Senior Twin's Pro-Tip */}
                        {currentPhase.proTip && (
                          <div className="senior-advice-box mt-3">
                            <div className="senior-advice-title-row">
                              <MessageSquare size={15} />
                              <span>{twin.name.split(' ')[0]}'s Pro-Tip for Phase {currentPhase.phase}:</span>
                            </div>
                            <p className="senior-advice-quote">
                              "{currentPhase.proTip}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Drawer Footer Navigation */}
                      <div className="side-drawer-footer">
                        <button
                          type="button"
                          className="phase-nav-btn"
                          disabled={selectedRoadmapPhaseIndex === 0}
                          onClick={() => setSelectedRoadmapPhaseIndex(prev => Math.max(0, prev - 1))}
                        >
                          <ChevronLeft size={16} />
                          <span>Previous Phase</span>
                        </button>

                        <button
                          type="button"
                          className="phase-nav-btn next"
                          disabled={selectedRoadmapPhaseIndex === twin.roadmapPhases.length - 1}
                          onClick={() => setSelectedRoadmapPhaseIndex(prev => Math.min(twin.roadmapPhases.length - 1, prev + 1))}
                        >
                          <span>Next Phase</span>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── TAB 3: YOUTUBE COURSES & PRACTICE HUB ── */}
          {activeTab === 'courses' && (
            <div className="alumni-twin-container">
              {/* Courses & Practice Hub Top Banner */}
              <div className="courses-hub-top-banner">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="hub-tag-badge">Placement Skill Boost Hub</span>
                  <span className="text-xs text-secondary font-semibold">• Curated for {twin.currentRole} at {twin.currentCompany}</span>
                </div>
                <h2 className="courses-hub-main-title">
                  Skill Gap Video Courses & Interactive Practice Hub
                </h2>
                <p className="courses-hub-main-subtitle">
                  Master every skill gap required for {twin.currentRole}. Switch between full video masterclasses or solve hands-on coding challenges directly on LeetCode, HackerRank, and Kaggle.
                </p>

                {/* Segmented Sub-Tab Switcher Bar */}
                <div className="hub-segmented-switch-bar">
                  <button
                    type="button"
                    className={`hub-switch-btn ${coursesSubTab === 'videos' ? 'active' : ''}`}
                    onClick={() => setCoursesSubTab('videos')}
                  >
                    <Video size={16} />
                    <span>Skill Gap Video Masterclasses</span>
                    <span className="hub-switch-count">
                      {twin.missingTools.reduce((acc, t) => acc + (t.youtubeCourses?.length || 0), 0)} Courses
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`hub-switch-btn ${coursesSubTab === 'practice' ? 'active' : ''}`}
                    onClick={() => setCoursesSubTab('practice')}
                  >
                    <Code2 size={16} />
                    <span>Interactive Practice Hub</span>
                    <span className="hub-switch-count">
                      LeetCode • HackerRank • Kaggle
                    </span>
                  </button>
                </div>
              </div>

              {/* ── SECTION 1: VIDEO MASTERCLASSES & COURSES ── */}
              {coursesSubTab === 'videos' && (
                <div className="skill-tools-practice-container">
                  {twin.missingTools.map((tool, toolIdx) => {
                    const youtubeCourses = tool.youtubeCourses || [];

                    return (
                      <div key={tool.toolNumber || toolIdx} className="tool-practice-section-card">
                        {/* Tool Header Row */}
                        <div className="tool-section-header">
                          <div className="tool-section-header-left">
                            <div className="tool-section-num-badge">Gap #{tool.toolNumber || toolIdx + 1}</div>
                            <div>
                              <h3 className="tool-section-title">{tool.title}</h3>
                              <div className="flex items-center gap-2 flex-wrap mt-1">
                                <span className="tool-section-cat-pill">{tool.category}</span>
                                <span className="tool-section-duration">{tool.duration}</span>
                              </div>
                            </div>
                          </div>

                          {tool.keySkills && tool.keySkills.length > 0 && (
                            <div className="tool-skills-chips-row">
                              {tool.keySkills.map(skill => (
                                <span key={skill} className="skill-chip-micro">{skill}</span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Why it mattered */}
                        <div className="tool-why-callout">
                          <strong>Why Senior Interviewers Test This:</strong> {tool.whyItMattered}
                        </div>

                        {/* Video Tutorials Grid */}
                        <div className="yt-courses-full-grid">
                          {youtubeCourses.map((course, cIdx) => {
                            const safeUrl = getSafeYouTubeUrl(course.link, course.title);
                            return (
                              <div key={cIdx} className="yt-course-card-vertical">
                                <div className="yt-thumbnail-large-box">
                                  <Play size={24} className="yt-play-icon" />
                                  <span className="yt-duration-pill">{course.duration}</span>
                                </div>
                                <div className="yt-card-info-vert">
                                  <h4 className="yt-card-title-vert" title={course.title}>
                                    {course.title}
                                  </h4>
                                  <div className="yt-card-channel-vert">
                                    {course.channel} • {course.views}
                                  </div>
                                  <a
                                    href={safeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="yt-watch-full-btn"
                                  >
                                    <Play size={13} />
                                    <span>Watch Full Tutorial</span>
                                    <ExternalLink size={12} />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── SECTION 2: INTERACTIVE PRACTICE PLATFORMS & DELIVERABLES ── */}
              {coursesSubTab === 'practice' && (
                <div className="skill-tools-practice-container">
                  {twin.missingTools.map((tool, toolIdx) => {
                    const practicePlatforms = getPracticePlatformsForTool(tool, selectedRole);

                    return (
                      <div key={tool.toolNumber || toolIdx} className="tool-practice-section-card">
                        {/* Tool Header Row */}
                        <div className="tool-section-header">
                          <div className="tool-section-header-left">
                            <div className="tool-section-num-badge">Gap #{tool.toolNumber || toolIdx + 1}</div>
                            <div>
                              <h3 className="tool-section-title">{tool.title}</h3>
                              <div className="flex items-center gap-2 flex-wrap mt-1">
                                <span className="tool-section-cat-pill">{tool.category}</span>
                                <span className="tool-section-duration">{tool.duration}</span>
                              </div>
                            </div>
                          </div>

                          {tool.keySkills && tool.keySkills.length > 0 && (
                            <div className="tool-skills-chips-row">
                              {tool.keySkills.map(skill => (
                                <span key={skill} className="skill-chip-micro">{skill}</span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Interactive Practice Platforms Grid (LeetCode & HackerRank) */}
                        <div className="practice-platforms-full-grid">
                          {practicePlatforms.map((plat, pIdx) => (
                            <div key={pIdx} className={`practice-platform-card ${plat.platformKey}`}>
                              <div className="plat-card-header">
                                <div className="plat-brand-group">
                                  <span className={`plat-brand-badge ${plat.platformKey}`}>{plat.name}</span>
                                  <span className="plat-topic-pill">{plat.badge}</span>
                                </div>
                                <span className="plat-diff-tag">{plat.difficulty}</span>
                              </div>

                              <h4 className="plat-card-title">{plat.title}</h4>
                              <p className="plat-card-desc">{plat.description}</p>

                              <a
                                href={plat.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`plat-action-btn ${plat.platformKey}`}
                              >
                                <span>Practice on {plat.name}</span>
                                <ExternalLink size={13} />
                              </a>
                            </div>
                          ))}
                        </div>

                        {/* Capstone Practice Project Spec */}
                        {tool.practiceProject && (
                          <div className="tool-practice-spec-box">
                            <div className="practice-label">HANDS-ON REPO CAPSTONE DELIVERABLE:</div>
                            <div className="practice-title">{tool.practiceProject}</div>
                            {tool.projectDescription && (
                              <p className="practice-desc">{tool.projectDescription}</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* High Frequency Interview Questions */}
                  <div className="step-section-title mb-3 mt-6">
                    <FileCheck size={16} />
                    <span>Real Alumni Interview Q&A Preparation</span>
                  </div>

                  <div className="interview-qas-list">
                    {twin.interviewQAs.map((item, idx) => {
                      const isOpen = expandedQa === idx;
                      return (
                        <div
                          key={idx}
                          className="interview-qa-box"
                          onClick={() => setExpandedQa(isOpen ? null : idx)}
                        >
                          <div className="qa-header-row">
                            <span className="qa-question-text">Q: {item.q}</span>
                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                          {isOpen && (
                            <p className="qa-answer-text">
                              {item.a}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── CONNECT WITH SENIOR MENTOR MODAL ── */}
      {isConnectModalOpen && (
        <div className="mentor-modal-overlay" onClick={() => setIsConnectModalOpen(false)}>
          <div className="mentor-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setIsConnectModalOpen(false)}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-light">
              <div className="senior-avatar-box">
                {twin.initials}
              </div>
              <div>
                <h3 className="text-base font-bold text-primary flex items-center gap-1.5">
                  Connect with {twin.name} <CheckCircle size={15} className="text-accent" />
                </h3>
                <p className="text-xs text-secondary">
                  {twin.currentRole} at {twin.currentCompany} • {twin.batch}
                </p>
              </div>
            </div>

            {connectSuccess ? (
              <div className="text-center py-6 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-accent-bg text-accent flex items-center justify-center mx-auto mb-3">
                  <Check size={24} />
                </div>
                <h4 className="text-sm font-bold text-primary">Mentorship Request Sent!</h4>
                <p className="text-xs text-secondary mt-1">
                  {twin.name.split(' ')[0]} has been notified. You can track this conversation in your Network tab.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendConnection} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-secondary font-semibold block mb-1">
                    Select Mentorship Topic:
                  </label>
                  <select
                    className="select text-xs w-full"
                    value={connectTopic}
                    onChange={(e) => setConnectTopic(e.target.value)}
                  >
                    <option value="1:1 Resume & Skill Gap Review">1:1 Resume & Skill Gap Review</option>
                    <option value={`Interview Preparation for ${twin.currentCompany}`}>Interview Preparation for {twin.currentCompany}</option>
                    <option value="Hands-on Practice Project Feedback">Hands-on Practice Project Feedback</option>
                    <option value="Referral & Campus Placement Inquiry">Referral & Campus Placement Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-secondary font-semibold block mb-1">
                    Introductory Note:
                  </label>
                  <textarea
                    rows={4}
                    className="textarea text-xs w-full"
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="detect-action-btn mt-2 py-2.5 text-xs font-bold"
                >
                  <Send size={14} />
                  <span>Send Request to {twin.name.split(' ')[0]}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
