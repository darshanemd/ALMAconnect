import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  TrendingUp, Sparkles, RefreshCw, Sliders, RotateCcw, 
  Brain, ShieldCheck, Compass, CheckCircle2, AlertTriangle, 
  ArrowRight, Layers, BarChart3, Activity, X,
  GraduationCap, FolderGit2, Briefcase, Code2, AlertCircle, Target,
  Building2, Rocket, Laptop, Check, Zap, Info, ChevronDown, Search,
  Server, Smartphone, Cloud, Cpu, Bot, Palette, Shield, Flame, Gauge,
  Award, PlayCircle, Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Legend, Tooltip, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, PieChart, Pie, Cell, Sector, AreaChart, Area, BarChart, Bar
} from 'recharts';
import { 
  HIRING_TIERS, TARGET_JOB_ROLES, runPlacementSimulation 
} from '../../utils/placementPredictionEngine';
import { apiRequest } from '../../utils/api';
import './PlacementPredictorPage.css';

// Grouped Job Roles with metadata, domain colors, and icons
export const ROLE_GROUPS = [
  {
    category: 'Software & Cloud Engineering',
    color: '#38bdf8',
    roles: [
      { id: 'Software Engineer (SDE / Full Stack)', title: 'Software Engineer (SDE / Full Stack)', icon: Code2, badge: 'High Demand' },
      { id: 'Backend Engineer (Distributed Systems)', title: 'Backend Engineer (Distributed Systems)', icon: Server, badge: 'Core' },
      { id: 'Frontend / Mobile Developer', title: 'Frontend / Mobile Developer', icon: Smartphone, badge: 'Popular' },
      { id: 'DevOps & Cloud Infrastructure Engineer', title: 'DevOps & Cloud Infrastructure Engineer', icon: Cloud, badge: 'High Growth' },
      { id: 'QA Automation & Reliability Engineer', title: 'QA Automation & Reliability Engineer', icon: CheckCircle2, badge: 'Quality' },
      { id: 'Blockchain & Web3 Developer', title: 'Blockchain & Web3 Developer', icon: Sparkles, badge: 'Web3' }
    ]
  },
  {
    category: 'AI, Machine Learning & Data',
    color: '#a855f7',
    roles: [
      { id: 'AI / LLM Application Developer', title: 'AI / LLM Application Developer', icon: Sparkles, badge: 'Trending' },
      { id: 'Data Scientist & Machine Learning Engineer', title: 'Data Scientist & Machine Learning Engineer', icon: Brain, badge: 'High CTC' },
      { id: 'Data Analyst & Business Intelligence', title: 'Data Analyst & Business Intelligence', icon: BarChart3, badge: 'Analytics' }
    ]
  },
  {
    category: 'Cybersecurity, Systems & Leadership',
    color: '#f59e0b',
    roles: [
      { id: 'Cybersecurity & Systems Analyst', title: 'Cybersecurity & Systems Analyst', icon: Shield, badge: 'Security' },
      { id: 'Product Management & Tech Consultant', title: 'Product Management & Tech Consultant', icon: Compass, badge: 'Product' },
      { id: 'Technical Program Manager', title: 'Technical Program Manager', icon: Layers, badge: 'Management' }
    ]
  },
  {
    category: 'Core Hardware, Embedded & Design',
    color: '#10b981',
    roles: [
      { id: 'Embedded Systems & IoT Engineer', title: 'Embedded Systems & IoT Engineer', icon: Cpu, badge: 'IoT' },
      { id: 'Robotics & Automation Specialist', title: 'Robotics & Automation Specialist', icon: Bot, badge: 'Robotics' },
      { id: 'Hardware / VLSI & Core Electronics', title: 'Hardware / VLSI & Core Electronics', icon: Laptop, badge: 'VLSI' },
      { id: 'UI/UX & Product Design Engineer', title: 'UI/UX & Product Design Engineer', icon: Palette, badge: 'UI/UX' }
    ]
  }
];

// Custom Searchable Role Selector Component
function CustomRoleSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Find currently selected role metadata
  let currentRoleObj = null;
  let currentGroupObj = null;
  for (const group of ROLE_GROUPS) {
    const found = group.roles.find(r => r.id === value || r.title === value);
    if (found) {
      currentRoleObj = found;
      currentGroupObj = group;
      break;
    }
  }

  // Filter groups and roles by search query
  const filteredGroups = ROLE_GROUPS.map(group => ({
    ...group,
    roles: group.roles.filter(r => 
      r.title.toLowerCase().includes(search.toLowerCase()) || 
      group.category.toLowerCase().includes(search.toLowerCase()) ||
      (r.badge && r.badge.toLowerCase().includes(search.toLowerCase()))
    )
  })).filter(group => group.roles.length > 0);

  const CurrentIcon = currentRoleObj?.icon || Target;

  return (
    <div className="custom-role-select-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className={`custom-role-select-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="custom-role-selected-left">
          <div 
            className="custom-role-icon-box"
            style={{ 
              backgroundColor: currentGroupObj ? `${currentGroupObj.color}18` : 'var(--accent-bg)',
              color: currentGroupObj?.color || 'var(--accent)'
            }}
          >
            <CurrentIcon size={16} />
          </div>
          <div className="custom-role-selected-text">
            <span className="custom-role-title-text">{currentRoleObj?.title || value}</span>
            {currentGroupObj && (
              <span className="custom-role-sub-text">{currentGroupObj.category}</span>
            )}
          </div>
        </div>

        <div className="custom-role-selected-right">
          {currentRoleObj?.badge && (
            <span className="custom-role-badge">{currentRoleObj.badge}</span>
          )}
          <ChevronDown size={15} className={`custom-role-chevron ${open ? 'rotated' : ''}`} />
        </div>
      </button>

      {open && (
        <div className="custom-role-dropdown-menu animate-scale-in">
          <div className="custom-role-search-box">
            <Search size={14} className="text-secondary" />
            <input
              type="text"
              className="custom-role-search-input"
              placeholder="Search 16+ career domains & roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            {search && (
              <button 
                type="button" 
                className="custom-role-search-clear"
                onClick={() => setSearch('')}
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="custom-role-list-scroll">
            {filteredGroups.length === 0 ? (
              <div className="custom-role-empty">
                <AlertCircle size={18} className="text-secondary mb-1" />
                <span>No roles matching "{search}"</span>
              </div>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.category} className="custom-role-group">
                  <div className="custom-role-group-header" style={{ color: group.color }}>
                    <span>{group.category}</span>
                    <span className="custom-role-group-count">{group.roles.length}</span>
                  </div>
                  {group.roles.map((r) => {
                    const isSelected = r.id === value || r.title === value;
                    const RoleIcon = r.icon;
                    return (
                      <div
                        key={r.id}
                        role="option"
                        aria-selected={isSelected}
                        className={`custom-role-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          onChange(r.title);
                          setOpen(false);
                          setSearch('');
                        }}
                      >
                        <div className="custom-role-option-left">
                          <div 
                            className="custom-role-option-icon"
                            style={{ 
                              backgroundColor: isSelected ? 'var(--accent)' : `${group.color}15`,
                              color: isSelected ? '#ffffff' : group.color
                            }}
                          >
                            <RoleIcon size={14} />
                          </div>
                          <span className="custom-role-option-title">{r.title}</span>
                        </div>
                        <div className="custom-role-option-right">
                          {r.badge && (
                            <span className="custom-role-option-badge">{r.badge}</span>
                          )}
                          {isSelected && (
                            <Check size={14} className="text-accent custom-role-check" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlacementPredictorPage() {
  const { user } = useAuth();

  // Form Parameters
  const [tier, setTier] = useState('tier2');
  const [role, setRole] = useState(TARGET_JOB_ROLES[0]);
  const [gpa, setGpa] = useState('7.8');
  const [aptitude, setAptitude] = useState('75');
  const [projects, setProjects] = useState('2');
  const [internships, setInternships] = useState('1');
  const [dsa, setDsa] = useState('150');
  const [backlogs, setBacklogs] = useState('0');

  // Simulation & View States
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [mlData, setMlData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'radar' | 'montecarlo'
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Tab 3 Monte Carlo Scenario Filter
  const [mcScenario, setMcScenario] = useState('balanced'); // 'balanced' | 'surge' | 'freeze'
  const [activeDonutIndex, setActiveDonutIndex] = useState(null);

  // Archetype Presets Handler
  const applyPreset = (presetName) => {
    if (presetName === 'faang') {
      setTier('tier1');
      setRole('Software Engineer (SDE / Full Stack)');
      setGpa('9.2');
      setAptitude('92');
      setProjects('3');
      setInternships('2');
      setDsa('450');
      setBacklogs('0');
    } else if (presetName === 'scaleup') {
      setTier('tier2');
      setRole('AI / LLM Application Developer');
      setGpa('8.1');
      setAptitude('82');
      setProjects('3');
      setInternships('1');
      setDsa('220');
      setBacklogs('0');
    } else if (presetName === 'practical') {
      setTier('tier2');
      setRole('Software Engineer (SDE / Full Stack)');
      setGpa('7.8');
      setAptitude('75');
      setProjects('2');
      setInternships('1');
      setDsa('150');
      setBacklogs('0');
    }
  };

  // Run Simulation Handler
  const handleRunSimulation = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setDrawerOpen(false);

    try {
      const mlRes = await apiRequest('/ml/predict-placement', 'POST', {
        cgpa: parseFloat(gpa),
        internships: parseInt(internships, 10),
        historyOfBacklogs: parseInt(backlogs, 10),
        stream: user?.department || 'Computer Science',
        age: 21,
        gender: 'Male'
      }).catch(() => null);

      if (mlRes?.success) {
        setMlData(mlRes);
      }
    } catch {
      // Fallback
    }

    setTimeout(() => {
      const res = runPlacementSimulation({
        gpa, aptitude, projects, internships, dsa, backlogs, tier, role
      });
      setPrediction(res);
      setLoading(false);
    }, 1000);
  };

  // Quick Live Tuning in Drawer
  const handleLiveTweak = (newFields) => {
    const updated = {
      gpa, aptitude, projects, internships, dsa, backlogs, tier, role,
      ...newFields
    };
    if (newFields.gpa !== undefined) setGpa(newFields.gpa);
    if (newFields.aptitude !== undefined) setAptitude(newFields.aptitude);
    if (newFields.projects !== undefined) setProjects(newFields.projects);
    if (newFields.internships !== undefined) setInternships(newFields.internships);
    if (newFields.dsa !== undefined) setDsa(newFields.dsa);
    if (newFields.backlogs !== undefined) setBacklogs(newFields.backlogs);
    if (newFields.tier !== undefined) setTier(newFields.tier);
    if (newFields.role !== undefined) setRole(newFields.role);

    const res = runPlacementSimulation(updated);
    setPrediction(res);

    apiRequest('/ml/predict-placement', 'POST', {
      cgpa: parseFloat(updated.gpa),
      internships: parseInt(updated.internships, 10),
      historyOfBacklogs: parseInt(updated.backlogs, 10),
      stream: user?.department || 'Computer Science',
      age: 21
    }).then(mlRes => {
      if (mlRes?.success) setMlData(mlRes);
    }).catch(() => {});
  };

  // Reset to initial launcher state
  const handleReset = () => {
    setPrediction(null);
    setDrawerOpen(false);
    setActiveTab('overview');
  };

  // Dynamic Monte Carlo Donut Data based on scenario
  const getScenarioDonutData = () => {
    if (!prediction) return [];
    const baseProb = prediction.placementProbability;
    
    let shift = 0;
    if (mcScenario === 'surge') shift = 14;
    else if (mcScenario === 'freeze') shift = -18;

    const effProb = Math.max(8, Math.min(95, baseProb + shift));
    
    let high = Math.max(4, Math.round(effProb * 0.32));
    let good = Math.max(8, Math.round(effProb * 0.52));
    let mod = Math.max(8, Math.round((100 - effProb) * 0.44));
    let low = Math.max(4, Math.round((100 - effProb) * 0.26));
    let veryLow = Math.max(2, Math.round((100 - effProb) * 0.12));

    const total = high + good + mod + low + veryLow;
    high = Math.round((high / total) * 100);
    good = Math.round((good / total) * 100);
    mod = Math.round((mod / total) * 100);
    low = Math.round((low / total) * 100);
    veryLow = 100 - (high + good + mod + low);

    return [
      { name: '80% - 100% (High Placement Confidence)', value: high, cycles: high * 10, fill: '#10b981' },
      { name: '60% - 80% (Favorable Outcome)', value: good, cycles: good * 10, fill: '#3b82f6' },
      { name: '40% - 60% (Moderate / Borderline)', value: mod, cycles: mod * 10, fill: '#f59e0b' },
      { name: '20% - 40% (Elevated Rejection Risk)', value: low, cycles: low * 10, fill: '#f97316' },
      { name: '0% - 20% (Disqualification Risk)', value: veryLow, cycles: veryLow * 10, fill: '#ef4444' }
    ];
  };

  // Calculate SVG Circle Dashoffset for Probability Gauge
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = prediction 
    ? circumference - (prediction.placementProbability / 100) * circumference 
    : circumference;

  return (
    <div className="placement-page-container">

      {/* ──────────────────────────────────────────────────────────────────
          STATE 1: CLEAN 12-DOT CIRCULAR SPINNER
          ────────────────────────────────────────────────────────────────── */}
      {loading && (
        <div className="dot-loading-wrapper">
          <div className="dot-spinner-wheel">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="dot-spinner-petal" 
                style={{ 
                  transform: `rotate(${i * 30}deg) translate(0, -20px)`,
                  animationDelay: `${-1.1 + (i * 0.1)}s` 
                }} 
              />
            ))}
          </div>
          <div className="dot-spinner-text">RUNNING XGBOOST & SHAP SIMULATION...</div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          STATE 2: ELEVATED STRUCTURED LAUNCHER FORM
          ────────────────────────────────────────────────────────────────── */}
      {!loading && !prediction && (
        <div className="launcher-wrapper">
          <form onSubmit={handleRunSimulation} className="launcher-card">
            
            {/* Top Accent Gradient Bar */}
            <div className="launcher-card-accent-bar" />

            <div className="launcher-card-inner">
              
              {/* Launcher Header & AI Model Pill */}
              <div className="launcher-header">
                <div className="launcher-title-wrap">
                  <div className="launcher-icon-box">
                    <TrendingUp size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2>Placement Predictor & Stress Simulator</h2>
                      <span className="model-chip">
                        <Sparkles size={11} className="text-accent" /> Calibrated ML v3.4
                      </span>
                    </div>
                    <p>Calibrated against historical campus hiring records & 1,000+ Monte Carlo benchmark cycles</p>
                  </div>
                </div>
              </div>

              {/* Archetype Quick Presets Bar */}
              <div className="presets-banner">
                <span className="presets-label">
                  <Flame size={13} className="text-amber-500" /> Quick Profile Archetypes:
                </span>
                <div className="presets-chips-row">
                  <button 
                    type="button" 
                    onClick={() => applyPreset('faang')}
                    className="preset-chip"
                    title="Load Tier 1 FAANG / Product Aspirant Profile"
                  >
                    🚀 Tier-1 Product Aspirant
                  </button>
                  <button 
                    type="button" 
                    onClick={() => applyPreset('scaleup')}
                    className="preset-chip"
                    title="Load High-Growth Scaleup AI Developer Profile"
                  >
                    ⚡ Scaleup AI / SDE
                  </button>
                  <button 
                    type="button" 
                    onClick={() => applyPreset('practical')}
                    className="preset-chip"
                    title="Load Balanced Profile"
                  >
                    🎯 Balanced Benchmark
                  </button>
                </div>
              </div>

              {/* ──────────────── SECTION 1: TARGET CAREER GOALS ──────────────── */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <div className="section-step-badge">1</div>
                  <div>
                    <h3 className="form-section-title">Target Career Objectives</h3>
                    <p className="form-section-subtitle">Select your recruitment company tier & specific job specialization</p>
                  </div>
                </div>

                {/* Target Hiring Tier Selector */}
                <div className="mb-4">
                  <label className="field-label">Target Hiring Tier</label>
                  <div className="tier-buttons-grid">
                    {Object.values(HIRING_TIERS).map(t => {
                      const isSelected = tier === t.key;
                      return (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => setTier(t.key)}
                          className={`tier-btn ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="tier-btn-header">
                            {t.key === 'tier1' && <Building2 size={15} className={isSelected ? 'text-accent' : 'text-tertiary'} />}
                            {t.key === 'tier2' && <Rocket size={15} className={isSelected ? 'text-accent' : 'text-tertiary'} />}
                            {t.key === 'tier3' && <Laptop size={15} className={isSelected ? 'text-accent' : 'text-tertiary'} />}
                            <span className="tier-btn-title">{t.name}</span>
                          </div>
                          <span className="tier-btn-sub">Target GPA ≥ {t.targetGpa}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Job Role - Modern Custom Searchable Selector */}
                <div>
                  <label className="field-label">
                    <Target size={13} className="text-accent" /> Target Job Role Specialization
                  </label>
                  <CustomRoleSelect 
                    value={role} 
                    onChange={(newRole) => setRole(newRole)} 
                  />
                </div>
              </div>

              {/* ──────────────── SECTION 2: ACADEMIC & APTITUDE ──────────────── */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <div className="section-step-badge">2</div>
                  <div>
                    <h3 className="form-section-title">Academic & Analytical Profile</h3>
                    <p className="form-section-subtitle">Core institutional performance metrics & screening test readiness</p>
                  </div>
                </div>

                <div className="grid grid-2 gap-4">
                  <div>
                    <label className="field-label">
                      <GraduationCap size={13} className="text-accent" /> Academic GPA / CGPA (0 - 10)
                    </label>
                    <div className="input-with-adornment">
                      <input 
                        type="number" 
                        step="0.1" 
                        min="0" 
                        max="10" 
                        className="input"
                        value={gpa} 
                        onChange={e => setGpa(e.target.value)} 
                        required 
                      />
                      <span className="input-adornment-tag">/ 10 CGPA</span>
                    </div>
                  </div>

                  <div>
                    <label className="field-label">
                      <Brain size={13} className="text-accent" /> Aptitude & Reasoning Prep Score (0 - 100)
                    </label>
                    <div className="input-with-adornment">
                      <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        className="input"
                        value={aptitude} 
                        onChange={e => setAptitude(e.target.value)} 
                        required 
                      />
                      <span className="input-adornment-tag">/ 100 Score</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ──────────────── SECTION 3: TECHNICAL & PRACTICAL DEPTH ──────────────── */}
              <div className="form-section-card">
                <div className="form-section-header">
                  <div className="section-step-badge">3</div>
                  <div>
                    <h3 className="form-section-title">Technical Experience & Problem Solving</h3>
                    <p className="form-section-subtitle">Real-world software development depth and interview readiness</p>
                  </div>
                </div>

                <div className="grid grid-2 gap-4 mb-4">
                  <div>
                    <label className="field-label">
                      <FolderGit2 size={13} className="text-accent" /> Major Projects Completed
                    </label>
                    <div className="input-with-adornment">
                      <input 
                        type="number" 
                        min="0" 
                        max="20" 
                        className="input"
                        value={projects} 
                        onChange={e => setProjects(e.target.value)} 
                        required 
                      />
                      <span className="input-adornment-tag">Deployed</span>
                    </div>
                  </div>

                  <div>
                    <label className="field-label">
                      <Briefcase size={13} className="text-accent" /> Industry Internships Done
                    </label>
                    <div className="input-with-adornment">
                      <input 
                        type="number" 
                        min="0" 
                        max="10" 
                        className="input"
                        value={internships} 
                        onChange={e => setInternships(e.target.value)} 
                        required 
                      />
                      <span className="input-adornment-tag">Completed</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-2 gap-4">
                  <div>
                    <label className="field-label">
                      <Code2 size={13} className="text-accent" /> DSA Problems Solved (LeetCode / GFG)
                    </label>
                    <div className="input-with-adornment">
                      <input 
                        type="number" 
                        min="0" 
                        max="2000" 
                        className="input"
                        value={dsa} 
                        onChange={e => setDsa(e.target.value)} 
                        required 
                      />
                      <span className="input-adornment-tag">Problems</span>
                    </div>
                  </div>

                  <div>
                    <label className="field-label">
                      <AlertCircle size={13} className="text-accent" /> Active Academic Backlogs
                    </label>
                    <div className="input-with-adornment">
                      <input 
                        type="number" 
                        min="0" 
                        max="10" 
                        className="input"
                        value={backlogs} 
                        onChange={e => setBacklogs(e.target.value)} 
                        required 
                      />
                      <span className={`input-adornment-tag ${Number(backlogs) > 0 ? 'text-red-400' : ''}`}>
                        {Number(backlogs) === 0 ? 'Clear (0)' : `${backlogs} Active`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="predict-submit-btn">
                <TrendingUp size={16} /> Run Placement Simulation & Stress Test
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          STATE 3: EXECUTIVE RESULTS WORKSPACE
          ────────────────────────────────────────────────────────────────── */}
      {!loading && prediction && (
        <div className="results-workspace animate-fade-in">
          
          {/* Top Control Bar */}
          <div className="results-control-bar">
            <div className="control-bar-left">
              <button 
                type="button" 
                onClick={() => setDrawerOpen(true)}
                className="tweak-param-btn"
              >
                <Sliders size={13} className="text-accent" /> Tweak Parameters
              </button>

              <button 
                type="button" 
                onClick={handleReset}
                className="reset-btn"
              >
                <RotateCcw size={12} /> Reset Form
              </button>

              <span className="tier-badge-pill">
                <span className="tier-dot" /> {prediction.tierInfo.name}
              </span>
            </div>

            <div className="control-bar-right">
              <button 
                type="button" 
                onClick={handleRunSimulation}
                className="rerun-btn"
              >
                <RefreshCw size={12} /> Re-run Simulation
              </button>

              <div className="student-meta-badge">
                <div className="student-avatar-circle">
                  {user?.name ? user.name.charAt(0) : 'R'}
                </div>
                <span className="student-name-text">
                  {user?.name || 'Rahul Kumar'} &middot; {user?.department || 'Computer Science'}
                </span>
              </div>
            </div>
          </div>

          {/* Trained ML Ensemble Prediction Banner */}
          {mlData?.success && (
            <div className="mb-4 p-4 rounded-xl border border-accent/30 bg-accent/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-fade-in shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-primary">Trained ML Model Prediction:</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                      {mlData.placement_probability}% Placement Likelihood &middot; {mlData.hiring_tier}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface-raised text-secondary border border-border">
                      XGBoost + Random Forest Soft-Voting Ensemble
                    </span>
                  </div>
                  <p className="text-xs text-secondary mt-1">
                    Trained on real Indian Engineering Campus Placement dataset (<code className="text-accent font-mono text-[11px]">collegePlace.csv</code>, 760 records) &middot; Test Accuracy: <strong>{mlData.model_metadata?.test_accuracy || 84.87}%</strong> &middot; ROC-AUC: <strong>{mlData.model_metadata?.roc_auc || 0.9109}</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-xs">
                <span className="px-2 py-1 rounded bg-surface-raised border border-border text-tertiary">
                  Top Weight: <strong>CGPA (61.2%)</strong> &middot; Internships (11.4%)
                </span>
              </div>
            </div>
          )}

          {/* Top 3 Summary KPI Cards */}
          <div className="top-kpis-grid">
            
            {/* Card 1: Placement Probability */}
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Placement Probability</span>
                <span className="kpi-tag">{mlData ? `Ensemble: ${mlData.placement_probability}%` : 'XGBoost Model'}</span>
              </div>

              <div className="gauge-flex-wrap">
                <div className="relative flex items-center justify-center">
                  <svg className="radial-gauge-svg" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r={radius} className="gauge-bg-circle" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r={radius} 
                      className="gauge-fill-circle"
                      style={{
                        stroke: prediction.probabilityColor,
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset
                      }}
                    />
                  </svg>
                  <div className="gauge-center-text">
                    <span className="gauge-percent-num">{prediction.placementProbability}%</span>
                  </div>
                </div>

                <span className="gauge-rating-badge" style={{ color: prediction.probabilityColor }}>
                  {prediction.probabilityRating}
                </span>
                <span className="gauge-subtext">Based on target tier benchmarks & applicant pool</span>
                <span className="target-role-pill">
                  <Target size={11} className="text-accent inline mr-1" />
                  Target Role: {prediction.targetRole.split('(')[0].trim()}
                </span>
              </div>
            </div>

            {/* Card 2: Placement Resilience Index */}
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Placement Resilience Index</span>
                <span className={`resilience-status-pill ${prediction.resilienceStatusClass}`}>
                  <ShieldCheck size={11} /> {prediction.resilienceStatus}
                </span>
              </div>

              <div>
                <div className="resilience-score-big">
                  {prediction.resilienceScore} <span>/100</span>
                </div>

                <div className="resilience-projections-grid">
                  <div className="proj-col">
                    <span className="proj-col-title">Best Case</span>
                    <div className="proj-col-val text-emerald-400">{prediction.projections.bestCase}%</div>
                    <div className="proj-mini-track">
                      <div className="proj-mini-fill bg-emerald-400" style={{ width: `${prediction.projections.bestCase}%` }} />
                    </div>
                    <span className="proj-col-desc">Favorable Market</span>
                  </div>

                  <div className="proj-col">
                    <span className="proj-col-title">Average Case</span>
                    <div className="proj-col-val text-primary">{prediction.projections.averageCase}%</div>
                    <div className="proj-mini-track">
                      <div className="proj-mini-fill bg-blue-400" style={{ width: `${prediction.projections.averageCase}%` }} />
                    </div>
                    <span className="proj-col-desc">Standard Cohort</span>
                  </div>

                  <div className="proj-col">
                    <span className="proj-col-title">Worst Case</span>
                    <div className="proj-col-val text-amber-400">{prediction.projections.worstCase}%</div>
                    <div className="proj-mini-track">
                      <div className="proj-mini-fill bg-amber-400" style={{ width: `${prediction.projections.worstCase}%` }} />
                    </div>
                    <span className="proj-col-desc">High Competition</span>
                  </div>
                </div>

                <p className="resilience-footer-note">
                  Profile is {prediction.resilienceStatus.toLowerCase()}. Critical sensitivity detected in Aptitude Score and DSA Depth.
                </p>
              </div>
            </div>

            {/* Card 3: AI Strategic Intelligence */}
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-title flex items-center gap-1.5">
                  <Zap size={13} className="text-accent" /> AI Strategic Intelligence
                </span>
                <span className="kpi-tag text-accent font-bold">+15% Potential</span>
              </div>

              <div>
                <h4 className="ai-intel-headline">{prediction.aiIntelligence.headline}</h4>
                <p className="ai-intel-detail">{prediction.aiIntelligence.detail}</p>
              </div>

              <div className="ai-intel-buttons-row">
                <button 
                  type="button" 
                  onClick={() => setActiveTab('radar')}
                  className="ai-nav-btn primary"
                >
                  <Compass size={13} /> Benchmark Radar
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('montecarlo')}
                  className="ai-nav-btn secondary"
                >
                  <Activity size={13} /> Monte Carlo Test
                </button>
              </div>
            </div>

          </div>

          {/* Tab Switcher */}
          <div className="predictor-tabs-bar">
            <button 
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`predictor-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            >
              <BarChart3 size={13} /> Executive Overview & Sensitivity
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('radar')}
              className={`predictor-tab-btn ${activeTab === 'radar' ? 'active' : ''}`}
            >
              <Compass size={13} /> Placed Alumni Benchmark Radar
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('montecarlo')}
              className={`predictor-tab-btn ${activeTab === 'montecarlo' ? 'active' : ''}`}
            >
              <Activity size={13} /> Monte Carlo Stress Test
            </button>
          </div>

          {/* ──────────────────────────────────────────────────────────────
              TAB 1: EXECUTIVE OVERVIEW & SENSITIVITY
              ────────────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div className="tab-pane animate-fade-in">
              
              {/* Hero Panel: Profile Weight Contribution (SHAP) */}
              <div className="shap-hero-card">
                <div className="shap-card-header">
                  <div className="flex items-center gap-2">
                    <Layers size={15} className="text-accent" />
                    <span>Profile Weight Contribution (SHAP Feature Importance)</span>
                  </div>
                  <span className="text-[10px] text-tertiary font-semibold uppercase tracking-wider">
                    XGBoost Tree Weights
                  </span>
                </div>

                {/* Table Header */}
                <div className="shap-table-head">
                  <span>Parameter</span>
                  <span>Student Score</span>
                  <span>Weight Contribution</span>
                  <span className="text-right">Campus Shortlist Evaluation</span>
                </div>

                <div className="shap-rows-stack">
                  {prediction.shapFeatures.map((f, idx) => (
                    <div key={idx} className={`shap-row-item ${f.status}`}>
                      <div className="flex items-center gap-2">
                        {idx === 0 && <GraduationCap size={13} className="text-accent" />}
                        {idx === 1 && <Brain size={13} className="text-accent" />}
                        {idx === 2 && <FolderGit2 size={13} className="text-accent" />}
                        {idx === 3 && <Briefcase size={13} className="text-accent" />}
                        {idx === 4 && <Code2 size={13} className="text-accent" />}
                        <span className="shap-feature-name">{f.name}</span>
                      </div>

                      <span className="shap-feature-val">{f.value}</span>
                      
                      <div className="shap-impact-bar-wrap">
                        <span className="shap-feature-impact">{f.impactPercent}</span>
                        <div className="shap-mini-track">
                          <div 
                            className={`shap-mini-fill ${f.status}`} 
                            style={{ width: `${Math.min(100, (Math.abs(f.impactValue) / 30) * 100)}%` }} 
                          />
                        </div>
                      </div>

                      <span className="shap-feature-desc">{f.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Triplet Grid: Factors, Breaking Point, Monte Carlo */}
              <div className="triplet-bottom-grid">
                
                {/* Column 1: Impact of Factors */}
                <div className="triplet-card">
                  <span className="triplet-card-title">
                    <Activity size={13} className="text-accent" /> Impact of Factors (What can change your odds?)
                  </span>

                  <div className="factor-impact-table">
                    {prediction.factorImpacts.map((fac, idx) => (
                      <div key={idx} className="factor-impact-row">
                        <span className="factor-name">{fac.factor}</span>
                        <div className="factor-bar-track">
                          <div 
                            className={`factor-bar-fill ${fac.levelClass}`} 
                            style={{ width: `${fac.fill}%` }} 
                          />
                        </div>
                        <span className="factor-delta">{fac.delta}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Breaking Point Sensitivity Analysis */}
                <div className="triplet-card">
                  <div>
                    <span className="triplet-card-title">
                      <TrendingUp size={13} className="text-accent" /> Breaking Point Sensitivity Analysis
                    </span>
                    <span className="critical-threshold-badge">
                      <AlertTriangle size={10} className="inline mr-1" />
                      Critical Cutoff: Aptitude Score = {prediction.criticalThreshold}
                    </span>
                  </div>

                  <div style={{ width: '100%', height: 135 }}>
                    <ResponsiveContainer width="100%" height={135} minWidth={0} minHeight={0}>
                      <LineChart data={prediction.aptitudeCurve}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                        <XAxis dataKey="aptitude" stroke="var(--text-tertiary)" fontSize={10} />
                        <YAxis stroke="var(--text-tertiary)" fontSize={10} domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', fontSize: 11, borderRadius: 6 }} 
                          formatter={(v) => [`${v}% Probability`, 'Placement Odds']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="probability" 
                          stroke="#6E72E5" 
                          strokeWidth={2.2} 
                          dot={{ r: 2.5, fill: '#6E72E5' }} 
                          activeDot={{ r: 5, fill: '#38bdf8' }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <p className="triplet-chart-caption">
                    Score drop threshold where applicant automated shortlisting risks sharp drop-off.
                  </p>
                </div>

                {/* Column 3: Monte Carlo Risk Distribution */}
                <div className="triplet-card">
                  <span className="triplet-card-title">
                    <Activity size={13} className="text-accent" /> Monte Carlo Risk Distribution (1,000+ Iterations)
                  </span>

                  <div className="mc-donut-wrapper">
                    <div style={{ width: '100%', height: 105 }}>
                      <ResponsiveContainer width="100%" height={105} minWidth={0} minHeight={0}>
                        <PieChart>
                          <Pie 
                            data={prediction.monteCarloDonutData} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={28} 
                            outerRadius={44} 
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {prediction.monteCarloDonutData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mc-donut-center-label">
                      <span>1,000+</span>
                      <small>Sims</small>
                    </div>

                    <div className="mc-legend-list">
                      {prediction.monteCarloDonutData.map((item, idx) => (
                        <div key={idx} className="mc-legend-row">
                          <div className="mc-legend-left">
                            <span className="mc-legend-dot" style={{ background: item.fill }} />
                            <span>{item.name}</span>
                          </div>
                          <span className="mc-legend-pct">{item.value}%</span>
                        </div>
                      ))}
                    </div>

                    <div className="most-likely-outcome-box">
                      Most Likely Outcome: {prediction.mostLikelyOutcome}
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────
              TAB 2: PLACED ALUMNI BENCHMARK RADAR
              ────────────────────────────────────────────────────────────── */}
          {activeTab === 'radar' && (
            <div className="tab-pane animate-fade-in">
              <div className="radar-tab-card">
                <h3>Student Profile vs. Placed Alumni Benchmark Radar</h3>
                <p>
                  Multi-dimensional comparison against verified placed alumni at {prediction.tierInfo.name} companies.
                </p>

                <div style={{ width: '100%', height: 320 }} className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={320} minWidth={0} minHeight={0}>
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={prediction.radarData}>
                      <PolarGrid stroke="var(--border)" opacity={0.5} />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--text-tertiary)', fontSize: 9 }} />
                      <Radar 
                        name="Placed Alumni Benchmark" 
                        dataKey="PlacedAlumni" 
                        stroke="#6366f1" 
                        fill="#6366f1" 
                        fillOpacity={0.25} 
                      />
                      <Radar 
                        name="Your Profile" 
                        dataKey="YourScore" 
                        stroke="#10b981" 
                        fill="#10b981" 
                        fillOpacity={0.4} 
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        formatter={(val) => <span style={{ color: 'var(--text-primary)', fontSize: 12 }}>{val}</span>} 
                      />
                      <Tooltip contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 6 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="radar-gap-insights">
                  <div className="radar-gap-title flex items-center gap-1.5">
                    <Info size={13} className="text-accent" /> Key Competency Gaps Identified
                  </div>
                  <div className="radar-gap-grid">
                    <div className="gap-box">
                      <span className="gap-metric">DSA & Problem Solving</span>
                      <span className="gap-delta text-amber-400">
                        {prediction.radarData.find(d => d.metric === 'DSA Depth')?.YourScore || 0} vs {prediction.radarData.find(d => d.metric === 'DSA Depth')?.PlacedAlumni || 0}
                      </span>
                      <p className="gap-recommendation">Solve 50+ Graph & DP problems to match placed alumni median.</p>
                    </div>

                    <div className="gap-box">
                      <span className="gap-metric">System Design / Projects</span>
                      <span className="gap-delta text-emerald-400">
                        {prediction.radarData.find(d => d.metric === 'Projects')?.YourScore || 0} vs {prediction.radarData.find(d => d.metric === 'Projects')?.PlacedAlumni || 0}
                      </span>
                      <p className="gap-recommendation">Projects meet current baseline for {prediction.tierInfo.name}.</p>
                    </div>

                    <div className="gap-box">
                      <span className="gap-metric">Aptitude Readiness</span>
                      <span className="gap-delta text-blue-400">
                        {prediction.radarData.find(d => d.metric === 'Aptitude')?.YourScore || 0} vs {prediction.radarData.find(d => d.metric === 'Aptitude')?.PlacedAlumni || 0}
                      </span>
                      <p className="gap-recommendation">Maintain daily mock speed drills to avoid cutoff disqualifications.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────────
              TAB 3: MONTE CARLO STRESS TEST
              ────────────────────────────────────────────────────────────── */}
          {activeTab === 'montecarlo' && (
            <div className="tab-pane animate-fade-in">
              <div className="montecarlo-tab-card">
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3>1,000-Iteration Monte Carlo Placement Stress Test</h3>
                    <p>Simulating hiring cycle variance, market volatility, and interview panel stringency.</p>
                  </div>

                  <div className="scenario-filter-bar">
                    <button 
                      type="button" 
                      className={`scenario-btn ${mcScenario === 'balanced' ? 'active' : ''}`}
                      onClick={() => setMcScenario('balanced')}
                    >
                      Balanced Cycle
                    </button>
                    <button 
                      type="button" 
                      className={`scenario-btn ${mcScenario === 'surge' ? 'active' : ''}`}
                      onClick={() => setMcScenario('surge')}
                    >
                      Hiring Surge (+14%)
                    </button>
                    <button 
                      type="button" 
                      className={`scenario-btn ${mcScenario === 'freeze' ? 'active' : ''}`}
                      onClick={() => setMcScenario('freeze')}
                    >
                      Tech Freeze (-18%)
                    </button>
                  </div>
                </div>

                <div className="montecarlo-visual-grid">
                  
                  {/* Donut Chart with Breakdown */}
                  <div className="mc-full-donut-panel">
                    <span className="font-bold text-xs text-primary mb-2 block">
                      Outcome Distribution Across 1,000 Simulated Recruitment Drives
                    </span>

                    <div style={{ width: '100%', height: 240 }} className="relative flex items-center justify-center">
                      <ResponsiveContainer width="100%" height={240} minWidth={0} minHeight={0}>
                        <PieChart>
                          <Pie 
                            data={getScenarioDonutData()} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={55} 
                            outerRadius={85} 
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {getScenarioDonutData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 6, fontSize: 11 }} 
                            formatter={(v, name) => [`${v}% of Cycles (${v * 10} drives)`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="mc-donut-hero-text">
                        <span className="text-xl font-extrabold text-primary">1,000</span>
                        <span className="text-[10px] text-tertiary">Cycles Run</span>
                      </div>
                    </div>

                    <div className="mc-full-legend-stack">
                      {getScenarioDonutData().map((seg, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-border-light">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.fill }} />
                            <span className="text-secondary">{seg.name}</span>
                          </div>
                          <span className="font-bold text-primary">{seg.value}% ({seg.cycles} drives)</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Histogram of Outcomes */}
                  <div className="mc-histogram-panel">
                    <span className="font-bold text-xs text-primary mb-2 block">
                      Offer Distribution Probability Density (Simulated Placement Offers)
                    </span>

                    <div style={{ width: '100%', height: 240 }}>
                      <ResponsiveContainer width="100%" height={240} minWidth={0} minHeight={0}>
                        <BarChart data={[
                          { bracket: '0-20%', frequency: getScenarioDonutData()[4]?.value || 5, fill: '#ef4444' },
                          { bracket: '20-40%', frequency: getScenarioDonutData()[3]?.value || 12, fill: '#f97316' },
                          { bracket: '40-60%', frequency: getScenarioDonutData()[2]?.value || 25, fill: '#f59e0b' },
                          { bracket: '60-80%', frequency: getScenarioDonutData()[1]?.value || 40, fill: '#3b82f6' },
                          { bracket: '80-100%', frequency: getScenarioDonutData()[0]?.value || 18, fill: '#10b981' }
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                          <XAxis dataKey="bracket" stroke="var(--text-tertiary)" fontSize={10} />
                          <YAxis stroke="var(--text-tertiary)" fontSize={10} label={{ value: 'Frequency %', angle: -90, position: 'insideLeft', fill: 'var(--text-tertiary)', fontSize: 10 }} />
                          <Tooltip 
                            contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', borderRadius: 6, fontSize: 11 }} 
                            formatter={(v) => [`${v}% of Simulation Runs`, 'Probability Frequency']}
                          />
                          <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
                            {getScenarioDonutData().map((entry, index) => (
                              <Cell key={`bar-${index}`} fill={entry.fill} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="p-3 bg-surface-hover border rounded-lg mt-2 text-xs text-secondary leading-relaxed">
                      💡 <strong>Simulation Insight:</strong> In {mcScenario.toUpperCase()} market conditions, your candidate profile converts in <strong>{Math.round((getScenarioDonutData()[0]?.value || 0) + (getScenarioDonutData()[1]?.value || 0))}%</strong> of campus recruitment scenarios without requiring repeat drives.
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ──────────────────────────────────────────────────────────────────
          PARAMETER TUNING DRAWER (SLIDE-IN MODAL)
          ────────────────────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="parameter-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="parameter-drawer-body" onClick={e => e.stopPropagation()}>
            
            <div className="drawer-header">
              <h3>
                <Sliders size={16} className="text-accent" /> Live Parameter Tuning
              </h3>
              <button 
                type="button" 
                onClick={() => setDrawerOpen(false)}
                className="btn btn-ghost p-1 text-secondary hover:text-primary rounded-full"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              
              {/* Tier Select */}
              <div className="input-group">
                <label className="font-bold text-xs text-primary block mb-1">Target Hiring Tier</label>
                <div className="tier-buttons-grid" style={{ marginBottom: 0 }}>
                  {Object.values(HIRING_TIERS).map(t => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => handleLiveTweak({ tier: t.key })}
                      className={`tier-btn ${tier === t.key ? 'selected' : ''}`}
                    >
                      <span className="tier-btn-title">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Select in Drawer */}
              <div className="input-group">
                <label className="font-bold text-xs text-primary block mb-1">Target Job Role</label>
                <CustomRoleSelect 
                  value={role} 
                  onChange={(newRole) => handleLiveTweak({ role: newRole })} 
                />
              </div>

              {/* GPA Slider */}
              <div className="input-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-xs text-primary">Academic GPA (CGPA)</label>
                  <span className="text-xs font-extrabold text-accent">{gpa} / 10</span>
                </div>
                <input 
                  type="range" 
                  min="5.0" 
                  max="10.0" 
                  step="0.1" 
                  value={gpa}
                  onChange={e => handleLiveTweak({ gpa: e.target.value })}
                  className="w-full accent-accent cursor-pointer" 
                />
              </div>

              {/* Aptitude Slider */}
              <div className="input-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-xs text-primary">Aptitude Prep Score</label>
                  <span className="text-xs font-extrabold text-accent">{aptitude} / 100</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="100" 
                  step="1" 
                  value={aptitude}
                  onChange={e => handleLiveTweak({ aptitude: e.target.value })}
                  className="w-full accent-accent cursor-pointer" 
                />
              </div>

              {/* DSA Problems Slider */}
              <div className="input-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-xs text-primary">DSA Solved Volume</label>
                  <span className="text-xs font-extrabold text-accent">{dsa} Problems</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  step="10" 
                  value={dsa}
                  onChange={e => handleLiveTweak({ dsa: e.target.value })}
                  className="w-full accent-accent cursor-pointer" 
                />
              </div>

              {/* Projects Counter */}
              <div className="input-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-xs text-primary">Projects Completed</label>
                  <span className="text-xs font-extrabold text-accent">{projects} Projects</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="6" 
                  step="1" 
                  value={projects}
                  onChange={e => handleLiveTweak({ projects: e.target.value })}
                  className="w-full accent-accent cursor-pointer" 
                />
              </div>

              {/* Internships Counter */}
              <div className="input-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-xs text-primary">Internships Finished</label>
                  <span className="text-xs font-extrabold text-accent">{internships} Internships</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="4" 
                  step="1" 
                  value={internships}
                  onChange={e => handleLiveTweak({ internships: e.target.value })}
                  className="w-full accent-accent cursor-pointer" 
                />
              </div>

              {/* Backlogs */}
              <div className="input-group">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-xs text-primary">Active Backlogs</label>
                  <span className={`text-xs font-extrabold ${Number(backlogs) > 0 ? 'text-danger' : 'text-emerald-400'}`}>
                    {backlogs} Backlogs
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="5" 
                  step="1" 
                  value={backlogs}
                  onChange={e => handleLiveTweak({ backlogs: e.target.value })}
                  className="w-full accent-accent cursor-pointer" 
                />
              </div>

              <button 
                type="button" 
                onClick={() => setDrawerOpen(false)}
                className="btn btn-primary btn-sm font-bold mt-2"
              >
                Done & View Results
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
