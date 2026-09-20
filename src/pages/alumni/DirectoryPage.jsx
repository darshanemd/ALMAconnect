import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Search, MapPin, Briefcase, GraduationCap, Grid, List, Map, MessageSquare, Send, X, RefreshCw, FileText, Clock, Eye, Sparkles } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';
import { SkeletonGrid } from '../../components/ui/Skeleton';
import { getInitials } from '../../utils/formatters';
import ResumeViewerModal from '../../components/ui/ResumeViewerModal';
import ChatModal from '../../components/ui/ChatModal';
import { calculateMentorMatch } from '../../utils/matching';
import './DirectoryPage.css';

export default function DirectoryPage() {
  const { user } = useAuth();
  const { getAlumni, colleges, sendConnectionRequest, getConnectionRequests, getDirectMessages, sendDirectMessage, sendResumeRequest, getResumeRequestStatus } = useData();

  // Smart Match State
  const [smartMatchActive, setSmartMatchActive] = useState(false);
  const [minMatchThreshold, setMinMatchThreshold] = useState(0);

  // Resume Viewer State
  const [selectedResumeAlum, setSelectedResumeAlum] = useState(null);

  // Direct Messaging States
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatAlum, setActiveChatAlum] = useState(null);

  const handleOpenChat = (alum) => {
    setActiveChatAlum(alum);
    setChatOpen(true);
  };
  
  const [viewMode, setViewMode] = useState('grid'); // grid, list, map
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('');
  const [year, setYear] = useState('');

  // Fetch active verified alumni (scoped to user's college)
  const filters = useMemo(() => {
    const f = { status: 'active', role: 'alumni' };
    if (user?.collegeId) f.collegeId = user.collegeId;
    if (search) f.search = search;
    if (dept) f.department = dept;
    if (year) f.graduationYear = year;
    return f;
  }, [search, dept, year, user?.collegeId]);

  const rawAlumniList = getAlumni(filters);

  // Process alumni list with optional Smart Match scoring & sorting
  const alumniList = useMemo(() => {
    if (!smartMatchActive || !user) {
      return rawAlumniList;
    }

    const currentUserData = getAlumni({}).find(a => a.id === user.id) || {
      id: user.id,
      department: user.department || 'Computer Science',
      skills: user.skills || ['React', 'JavaScript', 'Node.js', 'Python'],
      location: user.location || 'Bengaluru',
      mentorTopics: ['Career Transition', 'Resume Review']
    };

    return rawAlumniList
      .map(alum => {
        const matchInfo = calculateMentorMatch(currentUserData, alum);
        return {
          ...alum,
          matchScore: matchInfo.score,
          matchReasons: matchInfo.reasons
        };
      })
      .filter(alum => (alum.matchScore || 0) >= minMatchThreshold)
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  }, [rawAlumniList, smartMatchActive, user, getAlumni, minMatchThreshold]);

  // Fetch current user connection requests
  const userRequests = getConnectionRequests(user?.id) || [];
  
  const getConnectionStatus = (alumId) => {
    if (user?.id === alumId) return 'self';
    
    // Check if they are already connected
    const currentAlum = getAlumni({}).find(a => a.id === user?.id);
    if (currentAlum && currentAlum.connections && currentAlum.connections.includes(alumId)) {
      return 'connected';
    }

    const req = userRequests.find(r => (r.from === user?.id && r.to === alumId) || (r.from === alumId && r.to === user?.id));
    if (req) return req.status; // pending, accepted, rejected
    return 'none';
  };

  const handleConnect = (alumId) => {
    sendConnectionRequest(user?.id, alumId);
  };

  // Unique departments for filter list
  const departments = [
    "Computer Science", "Information Science", "Electronics & Communication",
    "Mechanical Engineering", "Civil Engineering", "MBA", "PhD"
  ];

  const handleRequestResume = async (alumniId) => {
    if (!user?.id) {
      alert('Please log in to request an alumni resume.');
      return;
    }
    try {
      await sendResumeRequest(user.id, user.name, alumniId);
      alert('Resume request sent successfully! The alumni has been notified and you will be able to view their resume once approved.');
    } catch (err) {
      alert('Failed to send resume request. Please try again.');
    }
  };

  return (
    <div className="directory-page stagger-children">
      {/* Search and Filters */}
      <div className="filter-bar">
        <div className="search-bar flex-1">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            className="input" 
            placeholder="Search by name, company, role, location..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select className="select" value={dept} onChange={e => setDept(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select className="select" value={year} onChange={e => setYear(e.target.value)}>
          <option value="">All Years</option>
          {Array.from({ length: 12 }, (_, i) => 2015 + i).map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        {/* Highlighted Smart Match Alumni Toggle (No Badges) */}
        <button 
          onClick={() => setSmartMatchActive(!smartMatchActive)} 
          className={`smart-match-toggle-btn ${smartMatchActive ? 'active' : ''}`}
          title="Toggle Smart Match Alumni algorithm to rank by compatibility"
        >
          <Sparkles size={15} />
          <span>{smartMatchActive ? 'Smart Match: Active' : 'Smart Match'}</span>
        </button>

        {smartMatchActive && (
          <select 
            className="select text-xs font-bold text-accent" 
            value={minMatchThreshold} 
            onChange={e => setMinMatchThreshold(Number(e.target.value))}
          >
            <option value={0}>All Match Scores</option>
            <option value={60}>60%+ Match Only</option>
            <option value={75}>75%+ Match Only</option>
            <option value={85}>85%+ Match Only</option>
          </select>
        )}

        {/* View Mode buttons */}
        <div className="view-mode-buttons">
          <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
            <Grid size={18} />
          </button>
          <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
            <List size={18} />
          </button>
          <button className={`view-btn ${viewMode === 'map' ? 'active' : ''}`} onClick={() => setViewMode('map')}>
            <Map size={18} />
          </button>
        </div>
      </div>

      {/* Directory Content */}
      {alumniList.length === 0 ? (
        <EmptyState
          title="No Alumni Found"
          description="Try modifying your search queries or filters to explore wider alumni connections."
          actionLabel="Reset Search Filters"
          onAction={() => { setSearch(''); setDept(''); setYear(''); }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-3 gap-6">
          {alumniList.map(alum => {
            const status = getConnectionStatus(alum.id);
            return (
              <div key={alum.id} className="card alumni-card card-interactive">

                <div className="alumni-card-header flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="avatar avatar-lg">
                      {getInitials(`${alum.firstName} ${alum.lastName}`)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{alum.firstName} {alum.lastName}</h3>
                      <div className="flex items-center gap-1 text-xs text-secondary mt-1">
                        <GraduationCap size={14} />
                        <span>{alum.degree} in {alum.department} &bull; {alum.graduationYear}</span>
                      </div>
                    </div>
                  </div>

                  {smartMatchActive && (
                    <div className="smart-match-badge" title={`${alum.matchScore ?? 50}% Compatibility Match`}>
                      <Sparkles size={13} />
                      <span>{alum.matchScore ?? 50}% Match</span>
                    </div>
                  )}
                </div>

                <div className="alumni-card-body">
                  {alum.currentCompany ? (
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Briefcase size={16} />
                      <span className="truncate">{alum.currentRole} at <strong>{alum.currentCompany}</strong></span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-secondary">
                      <Briefcase size={16} />
                      <span>Exploring Opportunities</span>
                    </div>
                  )}

                  {alum.location && (
                    <div className="flex items-center gap-2 text-sm text-secondary mt-2">
                      <MapPin size={16} />
                      <span>{alum.location}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mt-4">
                    {alum.skills.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="tag tag-outline">{s}</span>
                    ))}
                  </div>

                  {smartMatchActive && (
                    <div className="smart-match-reasons-box">
                      <div className="flex items-center justify-between mb-1">
                        <span className="flex items-center gap-1 font-bold text-accent text-xs">
                          <Sparkles size={12} /> Why You Match ({alum.matchScore ?? 50}% Match):
                        </span>
                      </div>
                      {alum.matchReasons && alum.matchReasons.length > 0 ? (
                        <ul>
                          {alum.matchReasons.slice(0, 2).map((reason, idx) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-secondary mt-1">General alumni network match based on profile compatibility.</p>
                      )}
                    </div>
                  )}
                </div>

                {user && status !== 'self' && (
                  <div className="alumni-card-footer mt-4 flex flex-col gap-2">
                    <div className="flex gap-2">
                      {status === 'none' && (
                        <button onClick={() => handleConnect(alum.id)} className="btn btn-primary flex-1">Connect</button>
                      )}
                      {status === 'pending' && (
                        <button className="btn btn-secondary flex-1" disabled>Request Pending</button>
                      )}
                      {status === 'connected' && (
                        <button 
                          onClick={() => handleOpenChat(alum)} 
                          className="btn btn-secondary flex-1 flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare size={16} className="text-accent" />
                          <span>Message</span>
                        </button>
                      )}
                    </div>

                    {/* Resume Request & Viewer Button */}
                    {(() => {
                      const resumeStatus = getResumeRequestStatus(user.id, alum.id);
                      if (resumeStatus === 'none') {
                        return (
                          <button 
                            onClick={() => handleRequestResume(alum.id)} 
                            className="btn btn-outline btn-xs w-full flex items-center justify-center gap-1 text-xs"
                          >
                            <FileText size={13} /> Request Resume
                          </button>
                        );
                      } else if (resumeStatus === 'pending') {
                        return (
                          <button 
                            className="btn btn-ghost btn-xs w-full text-secondary flex items-center justify-center gap-1 text-xs" 
                            disabled
                          >
                            <Clock size={13} /> Resume Requested (Pending)
                          </button>
                        );
                      } else if (resumeStatus === 'accepted') {
                        return (
                          <button 
                            onClick={() => setSelectedResumeAlum(alum)} 
                            className="btn btn-accent btn-xs w-full flex items-center justify-center gap-1 text-xs font-bold text-white shadow-sm"
                          >
                            <Eye size={13} /> View Resume
                          </button>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : viewMode === 'list' ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                {smartMatchActive && <th>Match Score</th>}
                <th>Alma Mater</th>
                <th>Dept & Year</th>
                <th>Professional Info</th>
                <th>Location</th>
                {user && <th className="text-right">Action</th>}
              </tr>
            </thead>
            <tbody>
              {alumniList.map(alum => {
                const status = getConnectionStatus(alum.id);
                const alumCollege = colleges.find(c => c.id === alum.collegeId);
                return (
                  <tr key={alum.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar avatar-sm">{getInitials(`${alum.firstName} ${alum.lastName}`)}</div>
                        <span className="font-semibold">{alum.firstName} {alum.lastName}</span>
                      </div>
                    </td>
                    {smartMatchActive && (
                      <td>
                        <span className="smart-match-badge text-xs">
                          <Sparkles size={12} />
                          {alum.matchScore ?? 50}% Match
                        </span>
                      </td>
                    )}
                    <td>{alumCollege ? alumCollege.code : alum.collegeId}</td>
                    <td>{alum.department} ({alum.graduationYear})</td>
                    <td>{alum.currentCompany ? `${alum.currentRole} at ${alum.currentCompany}` : 'Job Seeker'}</td>
                    <td>{alum.location || 'N/A'}</td>
                    {user && (
                      <td className="text-right">
                        {status === 'none' && <button onClick={() => handleConnect(alum.id)} className="btn btn-primary btn-sm">Connect</button>}
                        {status === 'pending' && <button className="btn btn-secondary btn-sm" disabled>Pending</button>}
                        {status === 'connected' && (
                          <button 
                            onClick={() => handleOpenChat(alum)} 
                            className="btn btn-secondary btn-sm flex items-center gap-1"
                            title="Direct Message"
                          >
                            <MessageSquare size={14} className="text-accent" />
                            <span>Message</span>
                          </button>
                        )}
                        {status === 'self' && <span className="text-secondary text-xs">You</span>}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Map View Placeholder */
        <div className="card map-view-placeholder p-12 text-center flex flex-col items-center justify-center">
          <Map className="map-icon" size={48} style={{ color: 'var(--accent)' }} />
          <h3 className="mt-4">Geographic Alumni Map</h3>
          <p className="mt-2 text-secondary max-width-440">
            Interactive map shows alumni distribution worldwide. Currently, {alumniList.length} alumni are grouped across key hubs:
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            <div className="map-stat-node">
              <h4>Bengaluru</h4>
              <span>{alumniList.filter(a => a.location === 'Bengaluru').length} Alumni</span>
            </div>
            <div className="map-stat-node">
              <h4>Pune</h4>
              <span>{alumniList.filter(a => a.location === 'Pune').length} Alumni</span>
            </div>
            <div className="map-stat-node">
              <h4>Hyderabad</h4>
              <span>{alumniList.filter(a => a.location === 'Hyderabad').length} Alumni</span>
            </div>
            <div className="map-stat-node">
              <h4>Mumbai</h4>
              <span>{alumniList.filter(a => a.location === 'Mumbai').length} Alumni</span>
            </div>
          </div>
        </div>
      )}

      {/* Direct Messaging Modal */}
      {chatOpen && activeChatAlum && (
        <ChatModal 
          activeChatAlum={activeChatAlum} 
          onClose={() => setChatOpen(false)} 
        />
      )}

      {selectedResumeAlum && (
        <ResumeViewerModal 
          alumniName={`${selectedResumeAlum.firstName} ${selectedResumeAlum.lastName}`}
          alumniRole={selectedResumeAlum.currentRole || 'Alumnus'}
          avatarUrl={selectedResumeAlum.avatarUrl}
          resumeUrl={selectedResumeAlum.resumeUrl}
          resumeType={selectedResumeAlum.resumeType || 'pdf'}
          alumniData={selectedResumeAlum}
          onClose={() => setSelectedResumeAlum(null)}
        />
      )}
    </div>
  );
}
