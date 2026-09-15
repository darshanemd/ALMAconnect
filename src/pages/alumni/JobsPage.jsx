import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  Search, Briefcase, MapPin, DollarSign, Calendar, Clock, Sparkles, 
  Check, ChevronDown, ChevronUp, Plus, ExternalLink, FileText, 
  Download, Paperclip, Upload, X, Loader2, CheckCheck, ShieldCheck, 
  AlertTriangle, UserCheck, Inbox, FileCheck2, LayoutGrid, List,
  Bookmark, BookmarkCheck, Share2, Building, ArrowUpRight, Filter,
  RotateCcw, Users, Banknote, HelpCircle, Eye
} from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';
import { calculateSkillMatch } from '../../utils/matching';
import { formatDate } from '../../utils/formatters';
import './JobsPage.css';

// Helper to safely format salary text (handles ?, commas, LPA, etc.)
function formatSalaryDisplay(salary) {
  if (!salary) return 'Competitive';
  let cleaned = String(salary).trim();
  // Fix misplaced question marks from encoding
  cleaned = cleaned.replace(/^\?+/, '₹').replace(/\s*\?+\s*/g, ' ₹');
  // Fix malformed ",000 - ,000" or similar
  if (cleaned.startsWith(',')) {
    cleaned = '₹' + cleaned.replace(/^,/, '');
  }
  return cleaned;
}

// Generate consistent company avatar background colors
function getCompanyColor(companyName = '') {
  const colors = [
    { bg: 'rgba(59, 130, 246, 0.12)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.25)' }, // Blue
    { bg: 'rgba(16, 185, 129, 0.12)', text: '#10b981', border: 'rgba(16, 185, 129, 0.25)' }, // Emerald
    { bg: 'rgba(245, 158, 11, 0.12)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.25)' }, // Amber
    { bg: 'rgba(139, 92, 246, 0.12)', text: '#8b5cf6', border: 'rgba(139, 92, 246, 0.25)' }, // Purple
    { bg: 'rgba(236, 72, 153, 0.12)', text: '#ec4899', border: 'rgba(236, 72, 153, 0.25)' }, // Pink
    { bg: 'rgba(20, 184, 166, 0.12)', text: '#14b8a6', border: 'rgba(20, 184, 166, 0.25)' }, // Teal
    { bg: 'rgba(99, 102, 241, 0.12)', text: '#6366f1', border: 'rgba(99, 102, 241, 0.25)' }, // Indigo
  ];
  let hash = 0;
  for (let i = 0; i < companyName.length; i++) {
    hash = companyName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function JobsPage() {
  const { user } = useAuth();
  const { getJobs, addJob, approveJob, rejectJob, applyJob, getAlumniById } = useData();

  // View mode: 'grid' or 'list' (persisted in localStorage)
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('job_portal_view_mode') || 'grid';
  });

  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'pending' | 'my_posts' | 'closed' | 'saved'
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [experience, setExperience] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'match' | 'deadline' | 'applicants'
  
  // Bookmarked / Saved Jobs
  const [savedJobIds, setSavedJobIds] = useState(() => {
    try {
      const saved = localStorage.getItem('alumniconnect_saved_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals and drawers
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetailJob, setSelectedDetailJob] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save viewMode preference
  useEffect(() => {
    localStorage.setItem('job_portal_view_mode', viewMode);
  }, [viewMode]);

  // Save bookmarked jobs to localStorage
  const toggleSaveJob = (e, jobId) => {
    e?.stopPropagation();
    setSavedJobIds(prev => {
      const next = prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId];
      localStorage.setItem('alumniconnect_saved_jobs', JSON.stringify(next));
      return next;
    });
  };

  // Post job form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    experience: '0-2 years',
    salary: '',
    description: '',
    requirements: '',
    deadline: '',
    applyUrl: '',
    pdfUrl: '',
    pdfName: ''
  });

  const currentUserData = getAlumniById(user?.id);

  const filters = useMemo(() => {
    const f = {};
    if (search) f.search = search;
    if (jobType) f.type = jobType;
    if (experience) f.experience = experience;
    return f;
  }, [search, jobType, experience]);

  const rawJobsList = getJobs(filters);

  const userSkills = useMemo(() => {
    if (currentUserData?.skills?.length) return currentUserData.skills;
    if (user?.skills?.length) return user.skills;
    try {
      const savedResume = localStorage.getItem('ats_resume_builder_data');
      if (savedResume) {
        const parsed = JSON.parse(savedResume);
        if (parsed.skills) {
          return parsed.skills.split(',').map(s => s.trim()).filter(Boolean);
        }
      }
    } catch {
      // ignore
    }
    return [];
  }, [currentUserData, user]);

  // Compute skill matches for jobs
  const jobsWithMatches = useMemo(() => {
    return rawJobsList.map(job => {
      if (user && userSkills.length > 0) {
        const match = calculateSkillMatch(userSkills, job.requirements || []);
        return {
          ...job,
          matchScore: match.matchPercentage,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills
        };
      }
      return {
        ...job,
        matchScore: null,
        matchedSkills: [],
        missingSkills: job.requirements || []
      };
    });
  }, [rawJobsList, user, userSkills]);

  // Sort jobs according to sortBy
  const sortedJobs = useMemo(() => {
    const list = [...jobsWithMatches];
    if (sortBy === 'match') {
      return list.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    } else if (sortBy === 'deadline') {
      return list.sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    } else if (sortBy === 'applicants') {
      return list.sort((a, b) => (b.applicants || 0) - (a.applicants || 0));
    }
    // Default 'newest'
    return list.sort((a, b) => new Date(b.postedDate || 0) - new Date(a.postedDate || 0));
  }, [jobsWithMatches, sortBy]);

  // Group into categorized buckets
  const { liveJobs, pendingJobs, myJobs, closedJobs, savedJobs, highMatchCount } = useMemo(() => {
    const live = [];
    const pending = [];
    const my = [];
    const closed = [];
    const saved = [];
    let highMatches = 0;
    const now = new Date();

    sortedJobs.forEach(job => {
      // Saved check
      if (savedJobIds.includes(job.id)) {
        saved.push(job);
      }

      // Check if high match
      if (job.matchScore && job.matchScore >= 60) {
        highMatches++;
      }

      // Check if posted by current user
      if (user && job.postedBy === user.id) {
        my.push(job);
      }

      if (job.status === 'pending') {
        pending.push(job);
      } else if (job.status === 'closed' || (job.deadline && new Date(job.deadline) < now) || job.status === 'rejected') {
        closed.push(job);
      } else {
        live.push(job);
      }
    });

    return { 
      liveJobs: live, 
      pendingJobs: pending, 
      myJobs: my, 
      closedJobs: closed, 
      savedJobs: saved,
      highMatchCount: highMatches
    };
  }, [sortedJobs, user, savedJobIds]);

  const toggleExpand = (id) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  const handleApply = (e, jobId, applyUrl) => {
    e?.stopPropagation();
    applyJob(jobId);
    setAppliedJobs(prev => [...prev, jobId]);
    if (applyUrl) {
      window.open(applyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleApprove = async (e, jobId, jobTitle) => {
    e?.stopPropagation();
    try {
      await approveJob(jobId);
      alert(`Job opportunity "${jobTitle}" has been approved and published live!`);
    } catch (err) {
      alert(`Failed to approve job: ${err.message || 'Unknown error'}`);
    }
  };

  const handleReject = async (e, jobId, jobTitle) => {
    e?.stopPropagation();
    if (window.confirm(`Are you sure you want to reject the job posting "${jobTitle}"?`)) {
      try {
        await rejectJob(jobId);
        alert(`Job posting "${jobTitle}" has been rejected.`);
      } catch (err) {
        alert(`Failed to reject job: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload a valid PDF document.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      alert('PDF file size cannot exceed 25MB.');
      return;
    }

    try {
      setIsUploadingPdf(true);
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const result = await res.json();
      setFormData(prev => ({
        ...prev,
        pdfUrl: result.url,
        pdfName: file.name
      }));
    } catch (err) {
      console.error('PDF upload error:', err);
      alert('Failed to upload PDF. Please try again.');
    } finally {
      setIsUploadingPdf(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const skillsArray = formData.requirements
      ? formData.requirements.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];
      
    const jobPayload = {
      title: formData.title,
      company: formData.company,
      location: formData.location,
      type: formData.type,
      experience: formData.experience,
      salary: formData.salary,
      description: formData.description,
      requirements: skillsArray,
      postedBy: user?.id,
      applyUrl: formData.applyUrl,
      pdfUrl: formData.pdfUrl || '',
      pdfName: formData.pdfName || '',
      collegeId: user?.collegeId || 'col-1',
      deadline: new Date(formData.deadline || Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    try {
      setIsSubmitting(true);
      await addJob(jobPayload);
      setModalOpen(false);

      if (user?.role === 'college_admin') {
        alert('Job opportunity published live!');
        setActiveTab('live');
      } else {
        alert('Job posting submitted for institutional review! It has been placed in the approval queue and will be published live once verified by the administration.');
        setActiveTab('my_posts');
      }

      // Reset form
      setFormData({
        title: '',
        company: '',
        location: '',
        type: 'Full-time',
        experience: '0-2 years',
        salary: '',
        description: '',
        requirements: '',
        deadline: '',
        applyUrl: '',
        pdfUrl: '',
        pdfName: ''
      });
    } catch (err) {
      alert(`Failed to submit job: ${err.message || 'Error occurred'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasActiveFilters = search || jobType || experience || sortBy !== 'newest';

  const resetFilters = () => {
    setSearch('');
    setJobType('');
    setExperience('');
    setSortBy('newest');
  };

  // Determine current display list based on activeTab
  const currentJobsToDisplay = useMemo(() => {
    switch (activeTab) {
      case 'pending': return pendingJobs;
      case 'my_posts': return myJobs;
      case 'closed': return closedJobs;
      case 'saved': return savedJobs;
      case 'live':
      default:
        return liveJobs;
    }
  }, [activeTab, liveJobs, pendingJobs, myJobs, closedJobs, savedJobs]);

  /* ──────────────────────────────────────────────────────────────────────────
     Render: Grid View Card
     ────────────────────────────────────────────────────────────────────────── */
  const renderGridCard = (job, isClosed = false, isPending = false) => {
    const isSaved = savedJobIds.includes(job.id);
    const hasApplied = appliedJobs.includes(job.id);
    const canReview = user?.role === 'college_admin';
    const companyColors = getCompanyColor(job.company);
    const formattedSalary = formatSalaryDisplay(job.salary);

    return (
      <div 
        key={job.id} 
        className={`job-grid-card ${isClosed ? 'closed-job' : ''} ${isPending ? 'pending-card' : ''}`}
        onClick={() => setSelectedDetailJob(job)}
      >
        {/* Card Top Header */}
        <div className="job-grid-card-top">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div 
              className="job-grid-avatar"
              style={{ 
                backgroundColor: companyColors.bg, 
                color: companyColors.text,
                borderColor: companyColors.border 
              }}
            >
              {job.company?.[0] || 'C'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="job-grid-title truncate" title={job.title}>
                {job.title}
              </h3>
              <div className="job-grid-company-row">
                <span className="job-grid-company-name">{job.company}</span>
                <span className="bullet-dot">&bull;</span>
                <span className="job-grid-location truncate">
                  <MapPin size={12} className="inline mr-0.5 text-secondary" />
                  {job.location}
                </span>
              </div>
            </div>
          </div>

          <button 
            type="button"
            className={`job-bookmark-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => toggleSaveJob(e, job.id)}
            title={isSaved ? "Remove from saved jobs" : "Save this job"}
            aria-label="Save Job"
          >
            {isSaved ? <BookmarkCheck size={17} className="text-accent fill-accent/20" /> : <Bookmark size={17} />}
          </button>
        </div>

        {/* Badges & Meta Row */}
        <div className="job-grid-badges">
          <span className="badge badge-neutral text-xs font-semibold">{job.type}</span>
          {job.experience && (
            <span className="badge badge-neutral text-xs font-semibold flex items-center gap-1">
              <Briefcase size={11} /> {job.experience}
            </span>
          )}
          {formattedSalary && formattedSalary !== 'Competitive' && (
            <span className="job-grid-salary-badge">
              <Banknote size={12} /> {formattedSalary}
            </span>
          )}
        </div>

        {/* AI Skill Match Badge (if available) */}
        {job.matchScore !== null && !isClosed && !isPending && (
          <div className="job-grid-match-box">
            <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
              <span className="flex items-center gap-1 text-primary">
                <Sparkles size={13} className="text-accent" /> Skill Compatibility
              </span>
              <span className={`font-extrabold ${job.matchScore >= 70 ? 'text-success' : job.matchScore >= 40 ? 'text-warning' : 'text-secondary'}`}>
                {job.matchScore}% Match
              </span>
            </div>
            <div className="skill-match-progress-track">
              <div 
                className={`skill-match-progress-bar ${job.matchScore >= 70 ? 'high' : job.matchScore >= 40 ? 'medium' : 'low'}`}
                style={{ width: `${Math.max(job.matchScore, 8)}%` }}
              />
            </div>
          </div>
        )}

        {/* Requirements Pills */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="job-grid-skills-list">
            {job.requirements.slice(0, 3).map((req, idx) => {
              const isMatched = job.matchedSkills?.includes(req);
              return (
                <span 
                  key={idx} 
                  className={`job-skill-chip ${isMatched ? 'matched' : ''}`}
                >
                  {isMatched && <Check size={11} className="inline mr-1 text-success font-bold" />}
                  {req}
                </span>
              );
            })}
            {job.requirements.length > 3 && (
              <span className="job-skill-chip more-chip">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Card Footer */}
        <div className="job-grid-footer">
          <div className="job-grid-footer-meta">
            {isPending ? (
              <span className="badge badge-warning text-[11px] font-bold flex items-center gap-1">
                <Clock size={11} /> Pending Review
              </span>
            ) : isClosed ? (
              <span className="text-[11px] text-danger font-semibold flex items-center gap-1">
                <Clock size={11} /> Expired / Closed
              </span>
            ) : (
              <span className="text-[11px] text-secondary flex items-center gap-1 font-medium">
                <Users size={12} className="text-tertiary" /> {job.applicants || 0} applicants
              </span>
            )}
          </div>

          <div className="job-grid-actions" onClick={e => e.stopPropagation()}>
            {isPending && canReview ? (
              <div className="flex items-center gap-1.5">
                <button 
                  type="button" 
                  onClick={(e) => handleApprove(e, job.id, job.title)} 
                  className="btn btn-primary btn-xs flex items-center gap-1"
                >
                  <CheckCheck size={13} /> Approve
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleReject(e, job.id, job.title)} 
                  className="btn btn-secondary btn-xs text-danger hover:bg-danger-bg flex items-center gap-1"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button 
                  type="button" 
                  onClick={() => setSelectedDetailJob(job)}
                  className="btn btn-secondary btn-xs flex items-center gap-1 font-semibold"
                  title="View complete job specifications"
                >
                  <Eye size={13} /> Details
                </button>
                {!isPending && !isClosed && (
                  <button 
                    type="button" 
                    className={`btn ${hasApplied ? 'btn-secondary' : 'btn-primary'} btn-xs flex items-center gap-1 font-bold`}
                    onClick={(e) => handleApply(e, job.id, job.applyUrl)}
                    disabled={hasApplied}
                  >
                    {hasApplied ? <Check size={13} /> : <ArrowUpRight size={13} />}
                    {hasApplied ? 'Applied' : 'Apply'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* ──────────────────────────────────────────────────────────────────────────
     Render: List View Row (Enhanced)
     ────────────────────────────────────────────────────────────────────────── */
  const renderListRow = (job, isClosed = false, isPending = false) => {
    const isExpanded = expandedJobId === job.id;
    const isSaved = savedJobIds.includes(job.id);
    const hasApplied = appliedJobs.includes(job.id);
    const canReview = user?.role === 'college_admin';
    const companyColors = getCompanyColor(job.company);
    const formattedSalary = formatSalaryDisplay(job.salary);

    return (
      <div 
        key={job.id} 
        className={`card job-card job-list-card ${isClosed ? 'closed-job' : ''} ${isPending ? 'pending-job-card' : ''} ${isExpanded ? 'expanded' : ''}`}
      >
        <div className="job-card-header-main" onClick={() => toggleExpand(job.id)}>
          <div className="job-meta-left flex-1 min-w-0">
            <div 
              className="job-company-avatar"
              style={{ 
                backgroundColor: companyColors.bg, 
                color: companyColors.text,
                borderColor: companyColors.border 
              }}
            >
              {job.company?.[0] || 'C'}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base md:text-lg flex items-center gap-2 flex-wrap">
                <span className="truncate">{job.title}</span>
                {isPending ? (
                  <span className="badge badge-warning text-[11px] flex items-center gap-1 font-bold">
                    <Clock size={11} /> Pending Review
                  </span>
                ) : (
                  <span className={`status-indicator-dot ${isClosed ? 'closed' : 'live'}`} title={isClosed ? 'Closed' : 'Live'}></span>
                )}
              </h3>
              <div className="text-secondary text-xs md:text-sm flex items-center gap-2 md:gap-3 mt-1 flex-wrap">
                <span className="font-bold text-primary">{job.company}</span>
                <span className="bullet-dot">&bull;</span>
                <span className="flex items-center gap-1"><MapPin size={13} className="text-secondary" /> {job.location}</span>
                {job.experience && (
                  <>
                    <span className="bullet-dot">&bull;</span>
                    <span className="flex items-center gap-1"><Briefcase size={13} className="text-secondary" /> {job.experience}</span>
                  </>
                )}
                {formattedSalary && formattedSalary !== 'Competitive' && (
                  <>
                    <span className="bullet-dot">&bull;</span>
                    <span className="font-bold text-accent">{formattedSalary}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="job-meta-right" onClick={e => e.stopPropagation()}>
            <span className="badge badge-neutral text-xs font-semibold">{job.type}</span>
            
            {job.matchScore !== null && !isClosed && !isPending && (
              <span className={`ai-skill-match-tag ${job.matchScore >= 70 ? 'match-high' : job.matchScore >= 40 ? 'match-med' : 'match-low'}`}>
                <Sparkles size={12} /> {job.matchScore}% Match
              </span>
            )}

            <button 
              type="button"
              className={`job-bookmark-btn ${isSaved ? 'saved' : ''}`}
              onClick={(e) => toggleSaveJob(e, job.id)}
              title={isSaved ? "Remove from saved jobs" : "Save this job"}
            >
              {isSaved ? <BookmarkCheck size={17} className="text-accent fill-accent/20" /> : <Bookmark size={17} />}
            </button>

            {isPending && canReview && (
              <div className="flex items-center gap-1.5">
                <button 
                  type="button" 
                  onClick={(e) => handleApprove(e, job.id, job.title)} 
                  className="btn btn-primary btn-sm flex items-center gap-1"
                  title="Approve and publish job opportunity live"
                >
                  <CheckCheck size={14} /> Approve & Publish
                </button>
                <button 
                  type="button" 
                  onClick={(e) => handleReject(e, job.id, job.title)} 
                  className="btn btn-secondary btn-sm text-danger hover:bg-danger-bg flex items-center gap-1"
                  title="Reject this job posting request"
                >
                  <X size={14} /> Reject
                </button>
              </div>
            )}

            <button 
              className="btn btn-ghost p-2" 
              onClick={() => toggleExpand(job.id)}
              aria-label="Toggle details"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </div>

        {/* Expanded Row Body */}
        {isExpanded && (
          <div className="job-card-expanded-body">
            <div className="job-details-row">
              <div className="detail-item">
                <Calendar size={15} />
                <span>Posted: <strong>{formatDate(job.postedDate || new Date())}</strong></span>
              </div>
              {job.deadline && (
                <div className="detail-item">
                  <Clock size={15} />
                  <span>Deadline: <strong>{formatDate(job.deadline)}</strong></span>
                </div>
              )}
              {job.postedByName && (
                <div className="detail-item">
                  <UserCheck size={15} />
                  <span>Posted by: <strong>{job.postedByName}</strong></span>
                </div>
              )}
              <div className="detail-item">
                <Banknote size={15} />
                <span>Compensation: <strong>{formattedSalary}</strong></span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-bold text-xs uppercase tracking-wider text-secondary mb-1.5">Job Overview</h4>
              <p className="text-secondary text-sm whitespace-pre-line leading-relaxed">{job.description}</p>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-secondary mb-2">Required Skills & Match Analysis</h4>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req, idx) => {
                    const isMatched = job.matchedSkills?.includes(req);
                    return (
                      <span 
                        key={idx} 
                        className={`badge ${isMatched ? 'badge-accent' : 'badge-neutral'} text-xs font-semibold`}
                      >
                        {isMatched && <Check size={12} className="mr-1 inline text-success font-bold" />}
                        {req}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Attached PDF Download */}
            {job.pdfUrl && (
              <div className="mb-4">
                <div className="job-pdf-attachment-card">
                  <div className="flex items-center gap-3">
                    <div className="pdf-icon-badge">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-primary">{job.pdfName || 'Job_Description.pdf'}</div>
                      <div className="text-[11px] text-tertiary">Official Brochure & Description Document</div>
                    </div>
                  </div>
                  <a 
                    href={job.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-secondary btn-xs flex items-center gap-1.5 font-bold"
                    onClick={e => e.stopPropagation()}
                  >
                    <Download size={13} /> View / Download PDF
                  </a>
                </div>
              </div>
            )}

            {/* Application Footer */}
            <div className="job-apply-footer">
              <div className="text-xs text-secondary font-medium">
                {isPending ? (
                  <span className="text-warning font-semibold flex items-center gap-1">
                    <Clock size={13} /> In review queue. Awaiting administrative verification.
                  </span>
                ) : isClosed ? (
                  <span className="text-danger font-semibold">This opening is closed or expired.</span>
                ) : (
                  <span>👥 <strong>{job.applicants || 0}</strong> applicants have applied</span>
                )}
              </div>

              {!isPending && !isClosed && (
                <div className="flex items-center gap-2">
                  <button 
                    className={`btn ${hasApplied ? 'btn-secondary' : 'btn-primary'} btn-sm flex items-center gap-1.5 font-bold`}
                    onClick={(e) => handleApply(e, job.id, job.applyUrl)}
                    disabled={hasApplied}
                  >
                    {hasApplied ? (
                      <>
                        <Check size={16} /> Applied Successfully
                      </>
                    ) : (
                      <>
                        Apply Now {job.applyUrl ? <ExternalLink size={14} /> : <ArrowUpRight size={14} />}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="jobs-page stagger-children">
      {/* ── Top Workspace Header ── */}
      <div className="jobs-header-section">
        <div className="jobs-header-info">
          <div className="flex items-center gap-2.5">
            <div className="jobs-header-icon-box">
              <Briefcase size={22} className="text-accent" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
                Career & Jobs Portal
              </h1>
              <p className="text-xs md:text-sm text-secondary mt-0.5">
                Explore verified opportunities, referral drives, and institutional campus hiring.
              </p>
            </div>
          </div>
        </div>

        <div className="jobs-header-actions">
          {(user?.role === 'alumni' || user?.role === 'college_admin') && (
            <button 
              className="btn btn-primary flex items-center gap-2 font-bold shadow-accent" 
              onClick={() => setModalOpen(true)}
            >
              <Plus size={17} /> Post Job Opportunity
            </button>
          )}
        </div>
      </div>

      {/* ── Workspace Quick Stats & Tabs Bar ── */}
      <div className="jobs-tabs-bar-wrapper">
        <div className="jobs-tabs-bar">
          <button 
            type="button" 
            className={`jobs-tab-btn ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => setActiveTab('live')}
          >
            <span className="status-indicator-dot live" />
            <span>Live Opportunities</span>
            <span className="jobs-tab-count">{liveJobs.length}</span>
          </button>

          {savedJobs.length > 0 && (
            <button 
              type="button" 
              className={`jobs-tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <Bookmark size={14} className="text-accent" />
              <span>Saved Jobs</span>
              <span className="jobs-tab-count accent">{savedJobs.length}</span>
            </button>
          )}

          {user?.role === 'college_admin' && (
            <button 
              type="button" 
              className={`jobs-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              <ShieldCheck size={14} className="text-warning" />
              <span>Review & Approvals</span>
              {pendingJobs.length > 0 && (
                <span className="jobs-tab-count warning">{pendingJobs.length}</span>
              )}
            </button>
          )}

          {user && myJobs.length > 0 && (
            <button 
              type="button" 
              className={`jobs-tab-btn ${activeTab === 'my_posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('my_posts')}
            >
              <UserCheck size={14} className="text-accent" />
              <span>My Postings</span>
              <span className="jobs-tab-count">{myJobs.length}</span>
            </button>
          )}

          {closedJobs.length > 0 && (
            <button 
              type="button" 
              className={`jobs-tab-btn ${activeTab === 'closed' ? 'active' : ''}`}
              onClick={() => setActiveTab('closed')}
            >
              <Clock size={14} className="text-secondary" />
              <span>Expired / Closed</span>
              <span className="jobs-tab-count">{closedJobs.length}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Search, Filters, and View Switcher Control Bar ── */}
      <div className="jobs-controls-container">
        <div className="jobs-filter-row">
          {/* Search Box */}
          <div className="search-bar flex-1 min-w-[220px]">
            <Search className="search-icon" size={17} />
            <input 
              type="text" 
              className="input" 
              placeholder="Search roles, companies, key skills, locations..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button 
                type="button"
                className="clear-search-btn"
                onClick={() => setSearch('')}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Job Type Filter */}
          <select 
            className="select" 
            value={jobType} 
            onChange={e => setJobType(e.target.value)}
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>

          {/* Experience Level Filter */}
          <select 
            className="select" 
            value={experience} 
            onChange={e => setExperience(e.target.value)}
          >
            <option value="">All Experience Levels</option>
            <option value="0-2 years">0-2 years (Entry / Grad)</option>
            <option value="2-5 years">2-5 years (Mid-Level)</option>
            <option value="5+ years">5+ years (Senior / Lead)</option>
          </select>

          {/* Sort By Option */}
          <select 
            className="select text-xs font-semibold" 
            value={sortBy} 
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">Sort: Newest First</option>
            <option value="match">Sort: Highest Match %</option>
            <option value="deadline">Sort: Deadline Soonest</option>
            <option value="applicants">Sort: Most Applicants</option>
          </select>

          {/* Reset Filters button if any filter applied */}
          {hasActiveFilters && (
            <button 
              type="button" 
              className="btn btn-ghost btn-sm text-secondary hover:text-primary flex items-center gap-1 font-semibold"
              onClick={resetFilters}
              title="Reset all search filters"
            >
              <RotateCcw size={13} /> Reset
            </button>
          )}

          {/* ── View Toggle Switcher (Image 2 Match) ── */}
          <div className="view-mode-pill-container" title="Switch layout view">
            <button 
              type="button"
              className={`view-pill-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
            >
              <LayoutGrid size={18} strokeWidth={2} />
            </button>
            <button 
              type="button"
              className={`view-pill-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List View"
            >
              <List size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content Area (Grid or List) ── */}
      <div className="jobs-content-area">
        {currentJobsToDisplay.length === 0 ? (
          <EmptyState 
            icon={Briefcase}
            title={
              activeTab === 'saved' ? "No Saved Jobs" :
              activeTab === 'pending' ? "Approvals Queue is Clear" :
              activeTab === 'my_posts' ? "No Postings Created Yet" :
              activeTab === 'closed' ? "No Closed Jobs" :
              "No Opportunities Found"
            }
            description={
              activeTab === 'saved' ? "You haven't bookmarked any jobs yet. Click the bookmark icon on any job card to save it for later." :
              activeTab === 'pending' ? "All submitted job requests have been reviewed and verified." :
              activeTab === 'my_posts' ? "You haven't posted any job openings. Share opportunities from your company." :
              "Try adjusting your search terms or filters, or post a new job opening for the community."
            }
            actionLabel={
              (activeTab === 'live' || activeTab === 'my_posts') && (user?.role === 'alumni' || user?.role === 'college_admin')
                ? "Post a Job Opportunity"
                : undefined
            }
            onAction={() => setModalOpen(true)}
          />
        ) : (
          <div>
            {/* Active Tab Notice for Admin Approvals */}
            {activeTab === 'pending' && (
              <div className="p-3 bg-warning-bg rounded-lg border border-warning/30 flex items-center gap-2.5 text-xs text-warning font-semibold mb-4">
                <ShieldCheck size={16} />
                <span>The following {pendingJobs.length} job posting(s) require verification and approval before going live.</span>
              </div>
            )}

            {/* Render Grid or List View */}
            {viewMode === 'grid' ? (
              <div className="jobs-grid-layout">
                {currentJobsToDisplay.map(job => 
                  renderGridCard(
                    job, 
                    job.status === 'closed' || (job.deadline && new Date(job.deadline) < new Date()), 
                    job.status === 'pending'
                  )
                )}
              </div>
            ) : (
              <div className="jobs-list-layout">
                {currentJobsToDisplay.map(job => 
                  renderListRow(
                    job, 
                    job.status === 'closed' || (job.deadline && new Date(job.deadline) < new Date()), 
                    job.status === 'pending'
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Full Job Details Modal / Drawer ── */}
      {selectedDetailJob && (
        <div className="modal-backdrop" onClick={() => setSelectedDetailJob(null)}>
          <div className="modal job-detail-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-3 min-w-0">
                <div 
                  className="job-company-avatar"
                  style={{ 
                    backgroundColor: getCompanyColor(selectedDetailJob.company).bg, 
                    color: getCompanyColor(selectedDetailJob.company).text,
                    borderColor: getCompanyColor(selectedDetailJob.company).border,
                    width: 48,
                    height: 48
                  }}
                >
                  {selectedDetailJob.company?.[0] || 'C'}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-bold text-primary truncate">
                    {selectedDetailJob.title}
                  </h3>
                  <div className="text-xs text-secondary flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-primary">{selectedDetailJob.company}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {selectedDetailJob.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  className={`job-bookmark-btn ${savedJobIds.includes(selectedDetailJob.id) ? 'saved' : ''}`}
                  onClick={(e) => toggleSaveJob(e, selectedDetailJob.id)}
                  title="Bookmark job"
                >
                  {savedJobIds.includes(selectedDetailJob.id) ? (
                    <BookmarkCheck size={18} className="text-accent fill-accent/20" />
                  ) : (
                    <Bookmark size={18} />
                  )}
                </button>
                <button className="btn btn-ghost p-1.5" onClick={() => setSelectedDetailJob(null)}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="modal-body flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
              {/* Key Meta Grid */}
              <div className="grid grid-2 md:grid-4 gap-3 p-3.5 bg-surface-hover rounded-xl border border-border">
                <div>
                  <div className="text-[11px] text-tertiary font-medium">Job Type</div>
                  <div className="text-sm font-bold text-primary mt-0.5">{selectedDetailJob.type}</div>
                </div>
                <div>
                  <div className="text-[11px] text-tertiary font-medium">Experience</div>
                  <div className="text-sm font-bold text-primary mt-0.5">{selectedDetailJob.experience || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-[11px] text-tertiary font-medium">Compensation</div>
                  <div className="text-sm font-bold text-accent mt-0.5">{formatSalaryDisplay(selectedDetailJob.salary)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-tertiary font-medium">Deadline</div>
                  <div className="text-sm font-bold text-primary mt-0.5">
                    {selectedDetailJob.deadline ? formatDate(selectedDetailJob.deadline) : 'Rolling Admissions'}
                  </div>
                </div>
              </div>

              {/* AI Match Overview (if applicable) */}
              {selectedDetailJob.matchScore !== null && (
                <div className="p-4 rounded-xl border border-border bg-gradient-to-r from-accent/5 to-transparent">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <Sparkles size={15} className="text-accent" /> AI Skill Compatibility Analysis
                    </span>
                    <span className={`text-sm font-extrabold ${selectedDetailJob.matchScore >= 70 ? 'text-success' : selectedDetailJob.matchScore >= 40 ? 'text-warning' : 'text-secondary'}`}>
                      {selectedDetailJob.matchScore}% Match
                    </span>
                  </div>
                  <div className="skill-match-progress-track mb-3">
                    <div 
                      className={`skill-match-progress-bar ${selectedDetailJob.matchScore >= 70 ? 'high' : selectedDetailJob.matchScore >= 40 ? 'medium' : 'low'}`}
                      style={{ width: `${Math.max(selectedDetailJob.matchScore, 8)}%` }}
                    />
                  </div>

                  {selectedDetailJob.matchedSkills?.length > 0 && (
                    <div className="text-xs text-secondary mt-2">
                      <span className="font-semibold text-primary">Matching Skills:</span>{' '}
                      {selectedDetailJob.matchedSkills.join(', ')}
                    </div>
                  )}
                  {selectedDetailJob.missingSkills?.length > 0 && (
                    <div className="text-xs text-secondary mt-1">
                      <span className="font-semibold text-tertiary">Recommended to learn:</span>{' '}
                      {selectedDetailJob.missingSkills.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                  Role Overview & Description
                </h4>
                <div className="text-secondary text-sm leading-relaxed whitespace-pre-line bg-surface p-4 rounded-xl border border-border">
                  {selectedDetailJob.description}
                </div>
              </div>

              {/* Requirements & Skills */}
              {selectedDetailJob.requirements && selectedDetailJob.requirements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                    Required Skills & Qualifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedDetailJob.requirements.map((req, idx) => {
                      const isMatched = selectedDetailJob.matchedSkills?.includes(req);
                      return (
                        <span 
                          key={idx} 
                          className={`badge ${isMatched ? 'badge-accent' : 'badge-neutral'} text-xs font-semibold py-1 px-2.5`}
                        >
                          {isMatched && <Check size={12} className="mr-1 inline text-success font-bold" />}
                          {req}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PDF Document Attachment Card */}
              {selectedDetailJob.pdfUrl && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">
                    Official Documents
                  </h4>
                  <div className="job-pdf-attachment-card">
                    <div className="flex items-center gap-3">
                      <div className="pdf-icon-badge">
                        <FileText size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-primary">{selectedDetailJob.pdfName || 'Job_Description.pdf'}</div>
                        <div className="text-[11px] text-tertiary">Official Brochure & Description Document</div>
                      </div>
                    </div>
                    <a 
                      href={selectedDetailJob.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-secondary btn-xs flex items-center gap-1.5 font-bold"
                    >
                      <Download size={13} /> View / Download PDF
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer flex justify-between items-center">
              <div className="text-xs text-secondary">
                👥 <strong>{selectedDetailJob.applicants || 0}</strong> applicants applied
              </div>
              <div className="flex items-center gap-2">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setSelectedDetailJob(null)}
                >
                  Close
                </button>
                <button 
                  type="button" 
                  className={`btn ${appliedJobs.includes(selectedDetailJob.id) ? 'btn-secondary' : 'btn-primary'} flex items-center gap-1.5 font-bold`}
                  onClick={(e) => handleApply(e, selectedDetailJob.id, selectedDetailJob.applyUrl)}
                  disabled={appliedJobs.includes(selectedDetailJob.id)}
                >
                  {appliedJobs.includes(selectedDetailJob.id) ? (
                    <>
                      <Check size={16} /> Applied Successfully
                    </>
                  ) : (
                    <>
                      Apply Now {selectedDetailJob.applyUrl ? <ExternalLink size={15} /> : <ArrowUpRight size={15} />}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Post Job Opportunity Modal ── */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => !isSubmitting && setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Briefcase size={18} className="text-accent" /> Post a New Job Opportunity
                </h3>
                <p className="text-xs text-secondary mt-0.5">
                  {user?.role === 'college_admin' 
                    ? 'Publish an official campus hiring opening or drive directly to the portal.'
                    : 'Submit a job or referral opportunity. It will be verified by the administration before going live.'}
                </p>
              </div>
              <button className="btn btn-ghost p-1" onClick={() => setModalOpen(false)} disabled={isSubmitting}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostJob}>
              <div className="modal-body flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-2 gap-4">
                  <div className="input-group">
                    <label htmlFor="title">Job Title *</label>
                    <input 
                      type="text" 
                      id="title" 
                      className="input" 
                      placeholder="e.g. Frontend Engineer / SDE-1" 
                      value={formData.title} 
                      onChange={e => setFormData({...formData, title: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="company">Company *</label>
                    <input 
                      type="text" 
                      id="company" 
                      className="input" 
                      placeholder="e.g. Google / Microsoft / Nvidia" 
                      value={formData.company} 
                      onChange={e => setFormData({...formData, company: e.target.value})} 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-2 gap-4">
                  <div className="input-group">
                    <label htmlFor="location">Location *</label>
                    <input 
                      type="text" 
                      id="location" 
                      className="input" 
                      placeholder="e.g. Bengaluru / Remote / Hybrid" 
                      value={formData.location} 
                      onChange={e => setFormData({...formData, location: e.target.value})} 
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="salary">Salary / Compensation (Optional)</label>
                    <input 
                      type="text" 
                      id="salary" 
                      className="input" 
                      placeholder="e.g. ₹15L - ₹25L PA or ₹50,000/mo" 
                      value={formData.salary} 
                      onChange={e => setFormData({...formData, salary: e.target.value})} 
                    />
                  </div>
                </div>

                <div className="grid grid-2 gap-4">
                  <div className="input-group">
                    <label htmlFor="type">Job Type *</label>
                    <select 
                      id="type" 
                      className="select" 
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value})}
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="experience">Experience Level *</label>
                    <select 
                      id="experience" 
                      className="select" 
                      value={formData.experience} 
                      onChange={e => setFormData({...formData, experience: e.target.value})}
                    >
                      <option value="0-2 years">0-2 years (Entry / Graduate)</option>
                      <option value="2-5 years">2-5 years (Mid-Level)</option>
                      <option value="5+ years">5+ years (Senior / Lead)</option>
                    </select>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="requirements">Required Skills (Comma separated) *</label>
                  <input 
                    type="text" 
                    id="requirements" 
                    className="input" 
                    placeholder="e.g. React, JavaScript, Node.js, Python, SQL" 
                    value={formData.requirements} 
                    onChange={e => setFormData({...formData, requirements: e.target.value})} 
                    required 
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="deadline">Application Deadline</label>
                  <input 
                    type="date" 
                    id="deadline" 
                    className="input" 
                    value={formData.deadline} 
                    onChange={e => setFormData({...formData, deadline: e.target.value})} 
                  />
                </div>

                {/* PDF Job Description Attachment Option */}
                <div className="input-group">
                  <label className="font-semibold text-xs text-primary flex items-center gap-1.5 mb-1">
                    <FileText size={14} className="text-accent" /> Attach Job Description / Brochure (.PDF) (Optional)
                  </label>
                  
                  <div className="job-modal-pdf-box">
                    {!formData.pdfUrl ? (
                      <div>
                        <input 
                          type="file" 
                          id="job-pdf-upload" 
                          accept=".pdf,application/pdf" 
                          onChange={handlePdfUpload}
                          className="hidden-file-input"
                        />
                        <label htmlFor="job-pdf-upload" className="upload-label-btn py-2 text-xs">
                          {isUploadingPdf ? <Loader2 size={15} className="animate-spin text-accent" /> : <Paperclip size={15} />}
                          <span>{isUploadingPdf ? 'Uploading PDF Document...' : 'Upload Job Description / Brochure (.PDF)'}</span>
                        </label>
                      </div>
                    ) : (
                      <div className="pdf-uploaded-chip">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="pdf-icon-badge" style={{ width: '28px', height: '28px' }}>
                            <FileText size={14} />
                          </div>
                          <span className="font-semibold text-xs text-primary truncate">
                            {formData.pdfName || 'Job_Description.pdf'}
                          </span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setFormData(prev => ({ ...prev, pdfUrl: '', pdfName: '' }))}
                          className="btn btn-ghost btn-xs text-danger hover:bg-danger-bg p-1 rounded"
                          title="Remove PDF"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="applyUrl">Application Link / Portal URL (Optional)</label>
                  <input 
                    type="url" 
                    id="applyUrl" 
                    className="input" 
                    placeholder="e.g. https://careers.company.com/apply or email" 
                    value={formData.applyUrl} 
                    onChange={e => setFormData({...formData, applyUrl: e.target.value})} 
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="description">Job Description & Overview *</label>
                  <textarea 
                    id="description" 
                    className="textarea" 
                    rows={4}
                    placeholder="Outline responsibilities, team culture, eligibility, and daily work..." 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    required 
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary flex items-center gap-1.5" 
                  disabled={isUploadingPdf || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Submitting...
                    </>
                  ) : user?.role === 'college_admin' ? (
                    'Publish Live'
                  ) : (
                    'Submit for Approval'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

