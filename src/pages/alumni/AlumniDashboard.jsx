import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  Users, Briefcase, Calendar, Heart, Award, ChevronRight, UserCheck, 
  GraduationCap, Star, PlusCircle, CheckCircle2, MessageSquare, ArrowUpRight, 
  Sparkles, FileText, Check, X, LayoutGrid
} from 'lucide-react';
import { calculateSkillMatch } from '../../utils/matching';
import Avatar from '../../components/ui/Avatar';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './AlumniDashboard.css';

const DEFAULT_STUDENT_REQUESTS = [
  { id: 1, name: 'Ananya Rao', role: 'B.Tech CS Student', topic: 'Career Guidance & Project Review', date: 'Today' },
  { id: 2, name: 'Karan Verma', role: 'B.Tech IS Student', topic: 'Resume Review & Referral Request', date: 'Yesterday' }
];

const sanitizeRequests = (reqList) => {
  if (!Array.isArray(reqList)) return DEFAULT_STUDENT_REQUESTS;
  return reqList.map(item => {
    if (item.topic && item.topic.toLowerCase().includes('mock interview')) {
      return { ...item, topic: 'Career Guidance & Project Review' };
    }
    return item;
  });
};

export default function AlumniDashboard() {
  const { user } = useAuth();
  const { getJobs, getEvents, getAlumniById, getResumeRequestsForAlumni, respondResumeRequest } = useData();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');

  const currentUserData = getAlumniById(user?.id);
  const alumniResumeRequests = getResumeRequestsForAlumni(user?.id) || [];
  const pendingResumeRequests = alumniResumeRequests.filter(r => r.status === 'pending');

  const storageKey = user?.id ? `alumni_mentorship_requests_${user.id}` : 'alumni_mentorship_requests_default';

  // Persistent student mentorship requests list
  const [studentRequests, setStudentRequests] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        return sanitizeRequests(JSON.parse(saved));
      }
      return DEFAULT_STUDENT_REQUESTS;
    } catch {
      return DEFAULT_STUDENT_REQUESTS;
    }
  });

  // Re-sync when switching user
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        setStudentRequests(sanitizeRequests(JSON.parse(saved)));
      } else {
        setStudentRequests(DEFAULT_STUDENT_REQUESTS);
      }
    } catch {
      setStudentRequests(DEFAULT_STUDENT_REQUESTS);
    }
  }, [storageKey]);

  // Graduation transition banner
  const gradYear = Number(user?.graduationYear || currentUserData?.graduationYear);
  const currentYear = new Date().getFullYear();
  const isRecentGrad = gradYear && gradYear <= currentYear && gradYear >= currentYear - 2;
  const bannerKey = user?.id ? `dismiss_grad_banner_${user.id}` : null;
  const [showGradBanner, setShowGradBanner] = useState(() => {
    if (!bannerKey) return true;
    return localStorage.getItem(bannerKey) !== 'true';
  });

  const handleDismissGradBanner = () => {
    setShowGradBanner(false);
    if (bannerKey) {
      localStorage.setItem(bannerKey, 'true');
    }
  };

  const handleAcceptRequest = (studentName) => {
    setStudentRequests(prev => {
      const updated = prev.filter(req => req.name !== studentName);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save accepted mentorship request:', err);
      }
      return updated;
    });
    alert(`Accepted mentorship request from ${studentName}! They have been added to your mentorship list.`);
  };

  // Stats
  const stats = [
    { 
      label: 'My Network Connections', 
      value: currentUserData?.connections?.length || 15, 
      icon: Users, 
      color: 'var(--accent-bg)', 
      iconColor: 'var(--accent)'
    },
    { 
      label: 'Student Guidance Inquiries', 
      value: studentRequests.length, 
      icon: MessageSquare, 
      color: '#EFF6FF', 
      iconColor: '#1D4ED8'
    },
    { 
      label: 'Recommended Jobs', 
      value: getJobs().length || 5, 
      icon: Briefcase, 
      color: '#FEF2F2', 
      iconColor: '#DC2626'
    }
  ];

  // Upcoming events
  const upcomingEvents = getEvents({ type: 'upcoming' }).slice(0, 3);

  // Recommended jobs based on matching
  const jobRecommendations = useMemo(() => {
    if (!currentUserData) return [];
    
    return getJobs()
      .map(job => {
        const match = calculateSkillMatch(currentUserData.skills || [], job.requirements || []);
        return { ...job, matchScore: match.matchPercentage };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [currentUserData, getJobs]);

  // Chart Data - Dynamic last 6 months progression
  const chartData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentConn = currentUserData?.connections?.length ?? 15;
    
    // Multipliers for the 6 months leading up to currentConn
    const connMultipliers = [0.25, 0.45, 0.6, 0.75, 0.9, 1.0];
    const viewBase = [16, 28, 42, 38, 62, 78];

    const data = [];
    for (let i = 5; i >= 0; i--) {
      const idx = 5 - i;
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const name = monthNames[d.getMonth()];
      const conn = Math.max(1, Math.round(currentConn * connMultipliers[idx]));
      data.push({
        name,
        connections: conn,
        profileViews: viewBase[idx]
      });
    }
    return data;
  }, [currentUserData]);

  return (
    <div className="alumni-dashboard animate-fade-in max-w-7xl mx-auto">
      {/* ── Auto-Graduation Congratulatory Banner ── */}
      {showGradBanner && isRecentGrad && (
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl p-4 mb-4 flex items-start justify-between gap-3 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-xl">
              🎓
            </div>
            <div>
              <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                Congratulations on Graduating! Welcome to the Alumni Network
              </h4>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                Having reached your Class of {gradYear} graduation milestone, your account has automatically transitioned to Alumni status. You now have full access to the Alumni Directory, mentorship tools, and the Alumni Smart Card.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <Link to="/profile" className="text-xs font-semibold text-accent hover:underline flex items-center gap-1">
                  Update your job profile & company <ArrowUpRight size={12} />
                </Link>
                <Link to="/card" className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1">
                  View your Alumni Smart Card <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </div>
          <button 
            onClick={handleDismissGradBanner}
            className="btn btn-ghost p-1 text-secondary hover:text-primary rounded-md shrink-0"
            title="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── Workspace Header ── */}
      <div className="workspace-header">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar 
              src={user?.avatarUrl || currentUserData?.avatarUrl} 
              name={user?.name || 'Alumnus'} 
              role={user?.role} 
              size="lg" 
              isVerified={true}
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-extrabold text-primary">
                  Welcome back, {user?.name || 'Priya Sharma'}
                </h2>
                <span className="badge badge-accent text-xs">Silver Alumni Mentor</span>
              </div>
              <p className="text-xs text-secondary">
                {currentUserData?.degree || 'B.Tech'} in {currentUserData?.department || 'Computer Science'} &bull; Class of {currentUserData?.graduationYear || '2020'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/jobs')} 
              className="btn btn-primary btn-sm flex items-center gap-1.5"
            >
              <PlusCircle size={14} /> Post Job Referral
            </button>
            <button 
              onClick={() => navigate('/profile')} 
              className="btn btn-secondary btn-sm flex items-center gap-1.5"
            >
              Edit Profile <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

        {/* Workspace Quick Actions Bar */}
        <div className="workspace-quick-actions">
          <span className="text-xs font-semibold text-tertiary mr-2 flex items-center gap-1">
            <Sparkles size={13} className="text-accent" /> Quick Tools:
          </span>
          <button onClick={() => navigate('/jobs')} className="btn btn-ghost btn-xs text-secondary hover:text-primary">
            <PlusCircle size={13} /> Post Job Referral
          </button>
          <button onClick={() => navigate('/mentorship')} className="btn btn-ghost btn-xs text-secondary hover:text-primary">
            <MessageSquare size={13} /> Guidance Requests ({studentRequests.length})
          </button>
          <button onClick={() => navigate('/card')} className="btn btn-ghost btn-xs text-secondary hover:text-primary">
            <GraduationCap size={13} /> Digital Pass
          </button>
        </div>
      </div>

      {/* ── Workspace Tabs Navigation ── */}
      <div className="workspace-tabs-nav">
        <button 
          className={`workspace-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutGrid size={15} /> Overview
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'guidance' ? 'active' : ''}`}
          onClick={() => setActiveTab('guidance')}
        >
          <MessageSquare size={15} /> Student Guidance <span className="tab-badge">{studentRequests.length + pendingResumeRequests.length}</span>
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={15} /> Jobs & Referrals <span className="tab-badge">{jobRecommendations.length}</span>
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <Calendar size={15} /> Events & Community <span className="tab-badge">{upcomingEvents.length}</span>
        </button>
      </div>

      {/* ── TAB 1: OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Stat Cards Strip */}
          <div className="grid grid-3 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="stat-card-enhanced">
                  <div>
                    <div className="stat-label-text">{stat.label}</div>
                    <div className="stat-main-val mt-1">{stat.value}</div>
                  </div>
                  <div className="stat-icon-wrapper" style={{ backgroundColor: stat.color, color: stat.iconColor }}>
                    <Icon size={20} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="student-dashboard-grid">
            <div className="student-main-column">
              {/* Network Growth Chart */}
              <div className="card p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="section-title mb-0">Network & Profile Growth</h3>
                  <span className="text-xs text-secondary font-medium">Last 6 Months</span>
                </div>
                <div className="chart-container mt-2" style={{ width: '100%', minHeight: 240 }}>
                  <ResponsiveContainer width="100%" height={240} minWidth={0} minHeight={0}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 16, left: -10, bottom: 4 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorConn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" opacity={0.6} />
                      <XAxis 
                        dataKey="name" 
                        stroke="var(--text-secondary)" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={{ stroke: 'var(--border-light)' }} 
                        tickMargin={8} 
                      />
                      <YAxis 
                        stroke="var(--text-secondary)" 
                        fontSize={11} 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={8} 
                        width={38} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'var(--surface, #ffffff)', 
                          borderColor: 'var(--border, #e5e7eb)', 
                          borderRadius: 8, 
                          fontSize: 12,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                        }} 
                      />
                      <Legend 
                        verticalAlign="top" 
                        align="right" 
                        iconType="circle" 
                        wrapperStyle={{ paddingBottom: 12, fontSize: 12, fontWeight: 500 }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="profileViews" 
                        name="Profile Views" 
                        stroke="#3B82F6" 
                        strokeWidth={2.5} 
                        fillOpacity={1} 
                        fill="url(#colorViews)" 
                        activeDot={{ r: 5 }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="connections" 
                        name="Connections" 
                        stroke="#10B981" 
                        strokeWidth={2.5} 
                        fillOpacity={1} 
                        fill="url(#colorConn)" 
                        activeDot={{ r: 5 }} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="student-sidebar-column">
              {/* Guidance Pending Action */}
              <div className="card p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="section-title mb-0">Student Inquiries</h3>
                  <button onClick={() => setActiveTab('guidance')} className="text-xs font-bold text-accent hover:underline">View All</button>
                </div>
                {studentRequests.length > 0 ? (
                  <div className="student-request-item">
                    <div className="flex items-center gap-3">
                      <Avatar src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${studentRequests[0].name}`} name={studentRequests[0].name} role="student" size="sm" />
                      <div>
                        <h4 className="font-bold text-xs text-primary">{studentRequests[0].name}</h4>
                        <span className="text-[10px] text-secondary block">{studentRequests[0].topic}</span>
                      </div>
                    </div>
                    <button onClick={() => handleAcceptRequest(studentRequests[0].name)} className="btn btn-primary btn-xs flex items-center gap-1">
                      <UserCheck size={12} /> Accept
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-secondary">No pending inquiries.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: STUDENT GUIDANCE TAB ── */}
      {activeTab === 'guidance' && (
        <div className="student-dashboard-grid">
          <div className="student-main-column">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="section-title mb-0">Student Mentorship Inquiries</h3>
                <span className="badge badge-accent text-xs font-bold">{studentRequests.length} Requests</span>
              </div>
              {studentRequests.length === 0 ? (
                <div className="p-4 text-center text-xs text-secondary bg-background rounded-lg">
                  No pending inquiries at this time.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {studentRequests.map(req => (
                    <div key={req.id} className="suggested-mentor-item">
                      <div className="flex items-center gap-3">
                        <Avatar src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${req.name}`} name={req.name} role="student" size="sm" />
                        <div>
                          <h4 className="font-bold text-xs text-primary">{req.name}</h4>
                          <span className="text-xs text-secondary block">{req.topic} &bull; {req.role}</span>
                        </div>
                      </div>
                      <button onClick={() => handleAcceptRequest(req.name)} className="btn btn-primary btn-xs flex items-center gap-1">
                        <UserCheck size={12} /> Accept Request
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="student-sidebar-column">
            <div className="card p-6">
              <h3 className="section-title mb-3">Resume Access Requests</h3>
              {pendingResumeRequests.length === 0 ? (
                <p className="text-xs text-secondary">No pending resume requests.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {pendingResumeRequests.map(req => (
                    <div key={req.id} className="p-3 bg-surface border border-border-light rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${req.studentName}`} name={req.studentName} role="student" size="sm" />
                        <div>
                          <h4 className="font-bold text-xs text-primary">{req.studentName}</h4>
                          <span className="text-[10px] text-secondary">Access Request</span>
                        </div>
                      </div>
                      <button onClick={() => respondResumeRequest(req.id, 'accepted')} className="btn btn-primary btn-xs">
                        <Check size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: JOBS & REFERRALS TAB ── */}
      {activeTab === 'jobs' && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="section-title mb-0">Recommended Industry Jobs</h3>
            <button onClick={() => navigate('/jobs')} className="btn btn-primary btn-sm flex items-center gap-1">
              <PlusCircle size={14} /> Post Job Referral
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {jobRecommendations.map(job => (
              <div key={job.id} className="job-rec-card" onClick={() => navigate('/jobs')}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-primary">{job.title}</h4>
                    <p className="text-xs text-secondary mt-0.5">{job.company} &bull; {job.location}</p>
                  </div>
                  <div className="match-score-badge bg-accent-bg text-accent font-bold">
                    {job.matchScore}% Match
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: EVENTS & COMMUNITY TAB ── */}
      {activeTab === 'events' && (
        <div className="student-dashboard-grid">
          <div className="student-main-column">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="section-title mb-0">Upcoming Alumni Events</h3>
                <Link to="/events" className="text-xs font-bold text-accent hover:underline">View All &rarr;</Link>
              </div>
              <div className="flex flex-col gap-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="event-item-compact">
                    <div className="event-date-box">
                      <span className="month">{new Date(event.date).toLocaleString('en-US', { month: 'short' })}</span>
                      <span className="day">{new Date(event.date).getDate()}</span>
                    </div>
                    <div className="event-details-compact">
                      <h4 className="font-semibold text-xs text-primary truncate">{event.title}</h4>
                      <p className="text-xs text-secondary truncate">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="student-sidebar-column">
            <div className="card p-6 text-center">
              <h3 className="section-title mb-4">Digital Alumni Credential</h3>
              <div className="mini-card">
                <div className="mini-card-header">
                  <span className="flex items-center gap-1"><GraduationCap size={13} /> Alumni Pass</span>
                  <span className="text-xs font-bold text-accent-light">VERIFIED</span>
                </div>
                <div className="mini-card-body">
                  <Avatar src={user?.avatarUrl || currentUserData?.avatarUrl} name={user?.name || 'Alumnus'} role={user?.role} size="sm" />
                  <div className="mini-card-info text-left">
                    <h4 className="text-xs font-bold">{user?.name || 'Priya Sharma'}</h4>
                    <p className="text-[11px] opacity-90">{currentUserData?.department || 'Computer Science'}</p>
                  </div>
                </div>
              </div>
              <Link to="/card" className="btn btn-secondary btn-xs w-full mt-3 flex items-center justify-center gap-1">
                View Pass <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
