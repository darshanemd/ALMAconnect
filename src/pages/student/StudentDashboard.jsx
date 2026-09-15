import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  FileText, Target, TrendingUp, Sparkles, ChevronRight, Calendar, 
  Briefcase, Users, CheckCircle2, GraduationCap, 
  ArrowUpRight, LayoutGrid, BookOpen, ThumbsUp, MessageSquare
} from 'lucide-react';
import { calculateSkillMatch } from '../../utils/matching';
import Avatar from '../../components/ui/Avatar';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getAlumni, getJobs, getEvents, getAlumniById, getBlogs } = useData();
  const navigate = useNavigate();

  const currentUserData = getAlumniById(user?.id);
  const recentBlogs = useMemo(() => getBlogs() || [], [getBlogs]);

  // Suggested Mentors based on branch
  const suggestedMentors = useMemo(() => {
    const allAlumni = getAlumni({ status: 'active', role: 'alumni' });
    if (!currentUserData?.department) return allAlumni.slice(0, 3);
    return allAlumni
      .filter(a => a.id !== user?.id && a.department === currentUserData.department)
      .slice(0, 3);
  }, [currentUserData, getAlumni, user]);

  // Recommended placement jobs
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

  // Upcoming campus placement events
  const upcomingEvents = getEvents({ type: 'upcoming' }).slice(0, 3);

  // Enhanced Stats
  const stats = [
    { 
      label: 'Skills Registered', 
      value: currentUserData?.skills?.length || 4, 
      icon: Sparkles, 
      color: 'var(--accent-bg)', 
      iconColor: 'var(--accent-dark)',
      trend: '+2 added recently',
      trendClass: 'positive'
    },
    { 
      label: 'Upcoming Campus Events', 
      value: upcomingEvents.length || 3, 
      icon: Calendar, 
      color: '#EFF6FF', 
      iconColor: '#1D4ED8',
      trend: '⚡ 1 Event Tomorrow',
      trendClass: 'info'
    },
    { 
      label: 'Matching Job Openings', 
      value: getJobs().length || 5, 
      icon: Briefcase, 
      color: '#FEF2F2', 
      iconColor: '#DC2626',
      trend: '🔥 Top 5% Match',
      trendClass: 'warning'
    }
  ];

  // Animated Readiness Meter Counter state
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const target = 78;
    const duration = 1200;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="student-dashboard animate-fade-in max-w-7xl mx-auto">
      {/* ── Workspace Header ── */}
      <div className="workspace-header">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Avatar 
              src={user?.avatarUrl || currentUserData?.avatarUrl} 
              name={user?.name || 'Student'} 
              role="student" 
              size="lg" 
              isVerified={true}
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-extrabold text-primary">
                  Welcome back, {user?.name || 'Rahul Kumar'}
                </h2>
                <span className="badge badge-accent text-xs">Verified Student</span>
              </div>
              <p className="text-xs text-secondary">
                {currentUserData?.degree || 'B.Tech'} in {currentUserData?.department || 'Computer Science'} &bull; Class of {currentUserData?.graduationYear || '2027'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigate('/student/resume-analyzer')} 
              className="btn btn-primary btn-sm flex items-center gap-1.5"
            >
              <FileText size={14} /> Analyze Resume
            </button>
            <button 
              onClick={() => navigate('/directory')} 
              className="btn btn-secondary btn-sm flex items-center gap-1.5"
            >
              <Users size={14} /> Find Mentors
            </button>
          </div>
        </div>

        {/* Workspace Quick Actions Bar */}
        <div className="workspace-quick-actions">
          <span className="text-xs font-semibold text-tertiary mr-2 flex items-center gap-1">
            <Sparkles size={13} className="text-accent" /> Quick Tools:
          </span>
          <button 
            onClick={() => navigate('/student/resume-analyzer')}
            className="btn btn-ghost btn-xs text-secondary hover:text-primary"
          >
            <FileText size={13} /> ATS Analyzer
          </button>
          <button 
            onClick={() => navigate('/student/skill-gap')}
            className="btn btn-ghost btn-xs text-secondary hover:text-primary"
          >
            <Target size={13} /> Skill Gap Detector
          </button>
          <button 
            onClick={() => navigate('/student/placement-predictor')}
            className="btn btn-ghost btn-xs text-secondary hover:text-primary"
          >
            <TrendingUp size={13} /> Placement Odds
          </button>
          <button 
            onClick={() => navigate('/card')}
            className="btn btn-ghost btn-xs text-secondary hover:text-primary"
          >
            <GraduationCap size={13} /> Student Pass
          </button>
          <button 
            onClick={() => navigate('/blog')}
            className="btn btn-ghost btn-xs text-secondary hover:text-primary"
          >
            <BookOpen size={13} /> Stories & News
          </button>
        </div>
      </div>

      {/* ── Linear / Vercel Style Workspace Tabs Navigation ── */}
      <div className="workspace-tabs-nav">
        <button 
          className={`workspace-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutGrid size={15} /> Overview
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'placement' ? 'active' : ''}`}
          onClick={() => setActiveTab('placement')}
        >
          <Sparkles size={15} /> Placement & Skills <span className="tab-badge">AI</span>
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'mentors' ? 'active' : ''}`}
          onClick={() => setActiveTab('mentors')}
        >
          <Users size={15} /> Mentors & Network <span className="tab-badge">{suggestedMentors.length}</span>
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <Briefcase size={15} /> Jobs & Drives <span className="tab-badge">{jobRecommendations.length}</span>
        </button>
        <button 
          className={`workspace-tab-btn ${activeTab === 'stories' ? 'active' : ''}`}
          onClick={() => setActiveTab('stories')}
        >
          <BookOpen size={15} /> Stories & News <span className="tab-badge">{recentBlogs.length}</span>
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
            {/* Main Column */}
            <div className="student-main-column">
              {/* Readiness Banner */}
              <div className="readiness-meter-box">
                <div className="gauge-circle-box">
                  <svg viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" stroke="var(--border-light)" strokeWidth="5" fill="transparent" />
                    <circle 
                      cx="32" cy="32" r="26" 
                      stroke="var(--accent)" 
                      strokeWidth="5" 
                      strokeDasharray={163}
                      strokeDashoffset={163 - (163 * animatedScore) / 100}
                      strokeLinecap="round" 
                      fill="transparent"
                      style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                  </svg>
                  <span className="gauge-circle-text">{animatedScore}%</span>
                </div>
                <div className="readiness-breakdown flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-primary truncate">Overall Placement Readiness Score</span>
                    <button onClick={() => setActiveTab('placement')} className="text-xs text-accent font-semibold hover:underline shrink-0 whitespace-nowrap">
                      View Breakdown &rarr;
                    </button>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <span className="readiness-pill"><CheckCircle2 size={12} className="text-accent" /> ATS Score: 82/100</span>
                    <span className="readiness-pill"><CheckCircle2 size={12} className="text-accent" /> Skill Match: 75%</span>
                  </div>
                </div>
              </div>

              {/* Priority Recommended Jobs */}
              <div className="card p-5">
                <div className="flex justify-between items-center gap-2 mb-4">
                  <h3 className="section-title mb-0 truncate">Recommended Placement Openings</h3>
                  <button onClick={() => setActiveTab('jobs')} className="text-xs font-bold text-accent hover:underline shrink-0 whitespace-nowrap">
                    See All Jobs &rarr;
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {jobRecommendations.slice(0, 2).map(job => (
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

              {/* Alumni Stories & Campus News Preview */}
              <div className="card p-5">
                <div className="flex justify-between items-center gap-2 mb-4">
                  <div>
                    <h3 className="section-title mb-0 truncate">Alumni Stories & Campus News</h3>
                    <p className="text-xs text-secondary mt-0.5">Interview preparation, tech articles, and success stories</p>
                  </div>
                  <button onClick={() => setActiveTab('stories')} className="text-xs font-bold text-accent hover:underline shrink-0 whitespace-nowrap">
                    Read Feed &rarr;
                  </button>
                </div>
                <div className="grid grid-2 gap-4">
                  {recentBlogs.slice(0, 2).map(blog => (
                    <div 
                      key={blog.id} 
                      className="card p-4 border border-light flex flex-col justify-between cursor-pointer hover:border-accent/40 transition-colors"
                      onClick={() => navigate(`/blog/${blog.id}`)}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="badge badge-accent capitalize text-[10px]">{blog.category ? blog.category.replace('-', ' ') : 'Article'}</span>
                          <span className="text-[11px] text-tertiary">{new Date(blog.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <h4 className="font-bold text-sm text-primary line-clamp-2">{blog.title}</h4>
                        <p className="text-xs text-secondary mt-1.5 line-clamp-2">{blog.excerpt}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-light text-[11px] text-secondary">
                        <div className="avatar avatar-xs">{blog.author?.avatarInitials || 'AU'}</div>
                        <span className="font-medium text-primary truncate">{blog.author?.name || 'Community Member'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="student-sidebar-column">
              {/* Upcoming Drive */}
              <div className="card p-5">
                <div className="flex justify-between items-center gap-2 mb-3">
                  <h3 className="section-title mb-0 truncate">Next Placement Event</h3>
                  <button onClick={() => setActiveTab('jobs')} className="text-xs font-bold text-accent hover:underline shrink-0 whitespace-nowrap">View All</button>
                </div>
                {upcomingEvents.length > 0 ? (
                  <div className="event-item-compact">
                    <div className="event-date-box">
                      <span className="month">{new Date(upcomingEvents[0].date).toLocaleString('en-US', { month: 'short' })}</span>
                      <span className="day">{new Date(upcomingEvents[0].date).getDate()}</span>
                    </div>
                    <div className="event-details-compact">
                      <h4 className="font-semibold text-xs text-primary truncate">{upcomingEvents[0].title}</h4>
                      <p className="text-xs text-secondary truncate">{upcomingEvents[0].location}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-secondary">No upcoming drives.</p>
                )}
              </div>

              {/* Digital Student Credential Pass */}
              <div className="card p-5 text-center">
                <div className="mini-student-card">
                  <div className="mini-card-header">
                    <span className="flex items-center gap-1"><GraduationCap size={13} /> Student Pass</span>
                    <span className="text-xs font-bold text-emerald-200">VERIFIED</span>
                  </div>
                  <div className="mini-card-body">
                    <Avatar src={user?.avatarUrl || currentUserData?.avatarUrl} name={user?.name || 'Student'} role="student" size="sm" />
                    <div className="mini-card-info text-left">
                      <h4 className="text-xs font-bold">{user?.name || 'Rahul Kumar'}</h4>
                      <p className="text-[11px] opacity-90">{currentUserData?.department || 'Computer Science'}</p>
                    </div>
                  </div>
                </div>
                <Link to="/card" className="btn btn-secondary btn-xs w-full mt-3 flex items-center justify-center gap-1">
                  View Pass Details <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: PLACEMENT & SKILLS TAB ── */}
      {activeTab === 'placement' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="section-title mb-1 flex items-center gap-2">
                  <Sparkles size={18} className="text-accent" /> AI Placement Training & Skills Suite
                </h3>
                <p className="text-xs text-secondary">Boost your hiring probability with automated ATS analysis and skill gap detection</p>
              </div>
              <span className="badge badge-accent text-xs font-bold">AI Engine v3.2</span>
            </div>

            <div className="grid grid-3 gap-4">
              {/* Tool 1: Resume Analyzer */}
              <div className="ai-tool-horizontal-card cursor-pointer" onClick={() => navigate('/student/resume-analyzer')}>
                <div className="flex items-center gap-3">
                  <div className="ai-tool-icon-box bg-accent-bg text-accent">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-primary">AI Resume Analyzer</h4>
                    <p className="text-xs text-secondary mt-0.5">ATS keyword density & formatting check</p>
                  </div>
                </div>
                <button className="btn btn-outline btn-xs text-accent font-bold">Launch &rarr;</button>
              </div>

              {/* Tool 2: Skill Gap Detector */}
              <div className="ai-tool-horizontal-card cursor-pointer" onClick={() => navigate('/student/skill-gap')}>
                <div className="flex items-center gap-3">
                  <div className="ai-tool-icon-box bg-amber-50 text-amber-700">
                    <Target size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-primary">Skill Gap Detector</h4>
                    <p className="text-xs text-secondary mt-0.5">Identify missing technical skills</p>
                  </div>
                </div>
                <button className="btn btn-outline btn-xs text-amber-700 font-bold">Launch &rarr;</button>
              </div>

              {/* Tool 3: Placement Predictor */}
              <div className="ai-tool-horizontal-card cursor-pointer" onClick={() => navigate('/student/placement-predictor')}>
                <div className="flex items-center gap-3">
                  <div className="ai-tool-icon-box bg-blue-50 text-blue-700">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-primary">Placement Predictor</h4>
                    <p className="text-xs text-secondary mt-0.5">Hiring probability & roadmap</p>
                  </div>
                </div>
                <button className="btn btn-outline btn-xs text-blue-700 font-bold">Launch &rarr;</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: MENTORS & NETWORK TAB ── */}
      {activeTab === 'mentors' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="section-title mb-0">Suggested Department Mentors</h3>
                <p className="text-xs text-secondary mt-0.5">Verified alumni from {currentUserData?.department || 'Computer Science'}</p>
              </div>
              <Link to="/directory" className="btn btn-primary btn-sm flex items-center gap-1">
                Browse Full Directory <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="grid grid-3 gap-4">
              {suggestedMentors.map(m => (
                <div key={m.id} className="suggested-mentor-item">
                  <div className="flex items-center gap-3">
                    <Avatar src={m.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${m.name}`} name={m.name} role="alumni" size="sm" />
                    <div>
                      <h4 className="font-bold text-xs text-primary">{m.name}</h4>
                      <span className="text-xs text-secondary block">{m.currentCompany || 'Software Engineer'}</span>
                    </div>
                  </div>
                  <button onClick={() => navigate('/directory')} className="btn btn-outline btn-xs text-accent font-bold">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: JOBS & DRIVES TAB ── */}
      {activeTab === 'jobs' && (
        <div className="student-dashboard-grid">
          <div className="student-main-column">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="section-title mb-0">Recommended Placement Jobs</h3>
                <Link to="/jobs" className="text-xs font-bold text-accent hover:underline">View All Jobs &rarr;</Link>
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
                    <div className="flex flex-wrap gap-1 mt-3">
                      {(job.requirements || []).slice(0, 3).map((r, idx) => (
                        <span key={idx} className="tag tag-outline text-xs">{r}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="student-sidebar-column">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="section-title mb-0">Upcoming Campus Drives</h3>
                <Link to="/events" className="text-xs font-bold text-accent hover:underline">All Events &rarr;</Link>
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
                      <button onClick={() => navigate('/events')} className="btn btn-ghost btn-xs p-0 mt-1 flex items-center gap-1 font-semibold text-accent">
                        RSVP Now <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: STORIES & CAMPUS NEWS TAB ── */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h3 className="section-title mb-1 flex items-center gap-2">
                  <BookOpen size={18} className="text-accent" /> Alumni Stories & Campus News
                </h3>
                <p className="text-xs text-secondary">
                  Real interview experiences, career advice, and community achievements shared by alumni and students
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/blog" className="btn btn-primary btn-sm flex items-center gap-1.5">
                  <BookOpen size={14} /> Open Full Blog & Feed
                </Link>
              </div>
            </div>

            <div className="grid grid-3 gap-6">
              {recentBlogs.map(blog => (
                <div 
                  key={blog.id} 
                  className="card p-5 border border-light flex flex-col justify-between cursor-pointer hover:border-accent/40 transition-all hover:translate-y-[-2px]"
                  onClick={() => navigate(`/blog/${blog.id}`)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="badge badge-accent capitalize text-xs">
                        {blog.category ? blog.category.replace('-', ' ') : 'Article'}
                      </span>
                      <span className="text-xs text-tertiary">
                        {new Date(blog.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-primary mt-2 line-clamp-2">{blog.title}</h4>
                    <p className="text-xs text-secondary mt-2 line-clamp-3 leading-relaxed">{blog.excerpt}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-light flex justify-between items-center text-xs text-secondary">
                    <div className="flex items-center gap-2">
                      <div className="avatar avatar-xs">{blog.author?.avatarInitials || 'AU'}</div>
                      <span className="font-semibold text-primary truncate max-w-[120px]">{blog.author?.name || 'Community Member'}</span>
                    </div>
                    <div className="flex gap-2 text-tertiary">
                      <span className="flex items-center gap-1"><ThumbsUp size={11} /> {blog.likes || 0}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={11} /> {blog.comments || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
