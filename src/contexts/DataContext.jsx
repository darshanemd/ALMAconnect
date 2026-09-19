import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest } from '../utils/api';

const DataContext = createContext(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();

  const [colleges, setColleges] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [preVerifiedStudents, setPreVerifiedStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventComments, setEventComments] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [teams, setTeams] = useState([]);
  const [circulars, setCirculars] = useState([]);
  const [lastSeenCircularsTime, setLastSeenCircularsTime] = useState(new Date(0).toISOString());
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const [resumeRequests, setResumeRequests] = useState(() => {
    try {
      const stored = localStorage.getItem('alumni_resume_requests');
      return stored ? JSON.parse(stored) : [
        {
          id: 'rr-1',
          studentId: 'member-3', // Rahul Kumar
          studentName: 'Rahul Kumar',
          alumniId: 'member-1', // Priya Sharma
          status: 'accepted',
          createdAt: new Date().toISOString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [blockedByUsers, setBlockedByUsers] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);

  // Sync last seen circulars timestamp to user session
  useEffect(() => {
    if (user?.id) {
      setLastSeenCircularsTime(localStorage.getItem(`lastSeenCirculars_${user.id}`) || new Date(0).toISOString());
    } else {
      setLastSeenCircularsTime(new Date(0).toISOString());
    }
  }, [user]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const fetchedNotifs = await apiRequest(`/notifications?userId=${user.id}&role=${user.role}&collegeId=${user.collegeId || ''}`);
      setNotifications(fetchedNotifs);
    } catch (err) {
      console.warn('Failed to refresh notifications:', err);
    }
  }, [user]);

  // Load all data on mount or when user session shifts
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const cachedCollegesStr = localStorage.getItem('cachedColleges');
        const cachedColleges = cachedCollegesStr ? JSON.parse(cachedCollegesStr) : null;

        let fetchedColleges = [];
        try {
          fetchedColleges = await apiRequest('/colleges');
        } catch (colErr) {
          console.warn('Failed to fetch colleges from backend API, using cached:', colErr);
        }

        if (fetchedColleges && fetchedColleges.length > 0) {
          if (cachedColleges && cachedColleges.length > 0) {
            const merged = fetchedColleges.map(c => {
              const cachedObj = cachedColleges.find(item => item.id === c.id);
              return cachedObj ? { ...c, ...cachedObj } : c;
            });
            setColleges(merged);
            localStorage.setItem('cachedColleges', JSON.stringify(merged));
          } else {
            setColleges(fetchedColleges);
            localStorage.setItem('cachedColleges', JSON.stringify(fetchedColleges));
          }
        } else if (cachedColleges && cachedColleges.length > 0) {
          setColleges(cachedColleges);
        }

        const fetchedAlumni = await apiRequest('/members');
        const currentYear = new Date().getFullYear();
        const normalizedMembers = (fetchedAlumni || []).map(m => {
          const gradYear = Number(m.graduationYear);
          if (m.role === 'student' && gradYear && gradYear <= currentYear) {
            return { ...m, role: 'alumni' };
          }
          return m;
        });
        setAlumni(normalizedMembers);

        const fetchedPreverified = await apiRequest('/preverified');
        setPreVerifiedStudents(fetchedPreverified);

        const fetchedJobs = await apiRequest('/jobs');
        setJobs(fetchedJobs);

        const fetchedEvents = await apiRequest('/events');
        setEvents(fetchedEvents);

        const fetchedComments = await apiRequest('/events/comments').catch(() => []);
        setEventComments(fetchedComments);

        const fetchedSurveys = await apiRequest('/surveys');
        setSurveys(fetchedSurveys);

        const fetchedBlogs = await apiRequest('/blogs');
        setBlogs(fetchedBlogs);

        const fetchedTeams = await apiRequest('/teams');
        setTeams(fetchedTeams);

        if (user?.id) {
          const fetchedNetworking = await apiRequest(`/networking?userId=${user.id}`);
          setConnectionRequests(fetchedNetworking);

          await refreshNotifications();

          const fetchedCirculars = await apiRequest(`/circulars?role=${user.role}&collegeId=${user.collegeId || ''}`);
          setCirculars(fetchedCirculars);

          const fetchedEmailLogs = await apiRequest('/emails').catch(() => []);
          setEmailLogs(fetchedEmailLogs || []);

          const blockData = await apiRequest(`/blocks/${user.id}`).catch(() => ({ blockedUserIds: [], blockedByUserIds: [] }));
          setBlockedUsers(blockData.blockedUserIds || []);
          setBlockedByUsers(blockData.blockedByUserIds || []);
        }
      } catch (err) {
        console.error('Failed to sync database collections with MongoDB:', err);
      }
    };

    loadAllData();
  }, [user, refreshNotifications]);

  // Periodic real-time sync for notifications (every 20s)
  useEffect(() => {
    if (!user?.id) return;
    const notifInterval = setInterval(() => {
      refreshNotifications();
    }, 20000);
    return () => clearInterval(notifInterval);
  }, [user, refreshNotifications]);

  const resetData = async () => {
    try {
      localStorage.removeItem('cachedColleges');
      await apiRequest('/dev/reset', 'POST');
    } catch (err) {
      console.error('Failed to reset database:', err);
      throw err;
    }
  };

  // College CRUD
  const updateCollege = async (id, updatedFields) => {
    try {
      const updated = await apiRequest(`/colleges/${id}`, 'PUT', updatedFields);
      setColleges(prev => {
        const next = prev.map(col => col.id === id ? { ...col, ...updatedFields, ...updated } : col);
        localStorage.setItem('cachedColleges', JSON.stringify(next));
        return next;
      });
    } catch (err) {
      console.error('Failed to update college in backend API, persisting locally:', err);
      setColleges(prev => {
        const next = prev.map(col => col.id === id ? { ...col, ...updatedFields } : col);
        localStorage.setItem('cachedColleges', JSON.stringify(next));
        return next;
      });
    }
  };

  // Alumni & Student CRUD
  const getAlumni = (filters = {}) => {
    const currentYear = new Date().getFullYear();
    return alumni.filter(alum => {
      const gradYear = Number(alum.graduationYear);
      const isGraduated = alum.role === 'student' && gradYear && gradYear <= currentYear;
      const effectiveRole = isGraduated ? 'alumni' : (alum.role || 'alumni');
      if (filters.role && effectiveRole !== filters.role) return false;
      
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const fullName = `${alum.firstName} ${alum.lastName}`.toLowerCase();
        const company = (alum.currentCompany || '').toLowerCase();
        const roleStr = (alum.currentRole || '').toLowerCase();
        const location = (alum.location || '').toLowerCase();
        const email = (alum.email || '').toLowerCase();
        const roll = (alum.rollNumber || '').toLowerCase();
        
        if (!fullName.includes(query) && !company.includes(query) && !roleStr.includes(query) && !location.includes(query) && !email.includes(query) && !roll.includes(query)) {
          return false;
        }
      }
      if (filters.department && alum.department !== filters.department) return false;
      if (filters.graduationYear && alum.graduationYear !== Number(filters.graduationYear)) return false;
      if (filters.collegeId && alum.collegeId !== filters.collegeId) return false;
      if (filters.isMentor !== undefined && alum.isMentor !== filters.isMentor) return false;
      if (filters.status && alum.status !== filters.status) return false;
      return true;
    });
  };

  const getAlumniById = (id) => {
    const item = alumni.find(a => a.id === id);
    if (!item) return item;
    const currentYear = new Date().getFullYear();
    const gradYear = Number(item.graduationYear);
    if (item.role === 'student' && gradYear && gradYear <= currentYear) {
      return { ...item, role: 'alumni' };
    }
    return item;
  };

  const updateAlumni = async (id, updatedFields) => {
    try {
      const updated = await apiRequest(`/members/${id}`, 'PUT', updatedFields);
      setAlumni(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      console.error('Failed to update alumni details:', err);
    }
  };

  const verifyAlumni = async (id) => {
    try {
      const updated = await apiRequest(`/members/${id}/verify`, 'PUT');
      setAlumni(prev => prev.map(a => a.id === id ? updated : a));
      const freshEmails = await apiRequest('/emails').catch(() => []);
      if (freshEmails && freshEmails.length > 0) setEmailLogs(freshEmails);
    } catch (err) {
      console.error('Failed to verify member:', err);
      setAlumni(prev => prev.map(a => a.id === id ? { ...a, isVerified: true, status: 'active' } : a));
    }
  };

  const bulkVerifyAlumni = async (ids, emailOptions = null) => {
    try {
      const updatedIdsSet = new Set(ids);
      const res = await apiRequest('/members/bulk-verify', 'PUT', { ids, emailOptions });
      setAlumni(prev => prev.map(a => updatedIdsSet.has(a.id) ? { ...a, isVerified: true, status: 'active' } : a));

      if (res.emailLogs && res.emailLogs.length > 0) {
        setEmailLogs(prev => [...res.emailLogs, ...prev]);
      } else {
        const freshEmails = await apiRequest('/emails').catch(() => []);
        if (freshEmails && freshEmails.length > 0) setEmailLogs(freshEmails);
      }
    } catch (err) {
      console.error('Failed to bulk verify members:', err);
      const updatedIdsSet = new Set(ids);
      setAlumni(prev => prev.map(a => updatedIdsSet.has(a.id) ? { ...a, isVerified: true, status: 'active' } : a));
    }
  };

  const rejectAlumni = async (id) => {
    try {
      const updated = await apiRequest(`/members/${id}/reject`, 'PUT');
      setAlumni(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      console.error('Failed to reject member:', err);
      setAlumni(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a));
    }
  };

  const bulkRejectAlumni = async (ids) => {
    try {
      const updatedIdsSet = new Set(ids);
      await apiRequest('/members/bulk-reject', 'PUT', { ids });
      setAlumni(prev => prev.map(a => updatedIdsSet.has(a.id) ? { ...a, status: 'rejected' } : a));
    } catch (err) {
      console.error('Failed to bulk reject members:', err);
      const updatedIdsSet = new Set(ids);
      setAlumni(prev => prev.map(a => updatedIdsSet.has(a.id) ? { ...a, status: 'rejected' } : a));
    }
  };

  const addManualAlumniRegistration = async (alumData) => {
    const saved = await apiRequest('/members/manual-alumni', 'POST', alumData);
    setAlumni(prev => [...prev, saved]);
    return saved;
  };

  const addManualStudentRegistration = async (studentData) => {
    const saved = await apiRequest('/members/manual-student', 'POST', studentData);
    setAlumni(prev => [...prev, saved]);
    return saved;
  };

  const bulkAddAlumni = async (newAlumniList) => {
    try {
      const saved = await apiRequest('/members/bulk-alumni', 'POST', newAlumniList);
      setAlumni(prev => [...prev, ...saved]);
    } catch (err) {
      console.error('Failed to bulk add alumni:', err);
    }
  };

  const deleteMember = async (id) => {
    try {
      await apiRequest(`/members/${id}`, 'DELETE');
      setAlumni(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete member:', err);
    }
  };

  const updateMember = async (id, updatedFields) => {
    try {
      const updated = await apiRequest(`/members/${id}`, 'PUT', updatedFields);
      setAlumni(prev => prev.map(a => a.id === id ? updated : a));
    } catch (err) {
      console.error('Failed to edit member profile:', err);
    }
  };

  const addPreVerifiedStudents = async (newStudents) => {
    try {
      const saved = await apiRequest('/preverified/bulk', 'POST', newStudents);
      setPreVerifiedStudents(prev => [...prev, ...saved]);
    } catch (err) {
      console.error('Failed to bulk add pre-verified students:', err);
    }
  };

  const addManualPreVerifiedStudent = async (student) => {
    try {
      const saved = await apiRequest('/preverified', 'POST', student);
      setPreVerifiedStudents(prev => [...prev, saved]);
    } catch (err) {
      console.error('Failed to add pre-verified student:', err);
    }
  };

  const removePreVerifiedStudent = async (rollNumber) => {
    try {
      await apiRequest(`/preverified/${rollNumber}`, 'DELETE');
      setPreVerifiedStudents(prev => prev.filter(s => s.rollNumber !== rollNumber));
    } catch (err) {
      console.error('Failed to delete pre-verification record:', err);
    }
  };

  // Jobs CRUD
  const getJobs = (filters = {}) => {
    return jobs
      .filter(job => {
        if (filters.search) {
          const query = filters.search.toLowerCase();
          const title = job.title.toLowerCase();
          const company = job.company.toLowerCase();
          const desc = job.description.toLowerCase();
          if (!title.includes(query) && !company.includes(query) && !desc.includes(query)) {
            return false;
          }
        }
        if (filters.type && job.type !== filters.type) return false;
        if (filters.experience && job.experience !== filters.experience) return false;
        if (filters.status && job.status !== filters.status) return false;
        return true;
      })
      .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
  };

  const addJob = async (job) => {
    try {
      const saved = await apiRequest('/jobs', 'POST', job);
      setJobs(prev => [saved, ...prev]);
      await refreshNotifications();
      return saved;
    } catch (err) {
      console.error('Failed to add job posting:', err);
      throw err;
    }
  };

  const approveJob = async (jobId) => {
    try {
      const updated = await apiRequest(`/jobs/${jobId}/approve`, 'PUT');
      setJobs(prev => prev.map(j => j.id === jobId ? updated : j));
      await refreshNotifications();
      return updated;
    } catch (err) {
      console.error('Failed to approve job:', err);
      throw err;
    }
  };

  const rejectJob = async (jobId) => {
    try {
      const updated = await apiRequest(`/jobs/${jobId}/reject`, 'PUT');
      setJobs(prev => prev.map(j => j.id === jobId ? updated : j));
      await refreshNotifications();
      return updated;
    } catch (err) {
      console.error('Failed to reject job:', err);
      throw err;
    }
  };

  const applyJob = async (jobId) => {
    try {
      const updated = await apiRequest(`/jobs/${jobId}/apply`, 'PUT', { userId: user?.id });
      setJobs(prev => prev.map(j => j.id === jobId ? updated : j));
      await refreshNotifications();
    } catch (err) {
      console.error('Failed to apply for job:', err);
    }
  };

  // Events CRUD
  const getEvents = (filters = {}) => {
    return events.filter(event => {
      const isPast = new Date(event.date) < new Date();
      if (filters.type === 'upcoming' && isPast) return false;
      if (filters.type === 'past' && !isPast) return false;
      return true;
    });
  };

  const addEvent = async (event) => {
    try {
      const saved = await apiRequest('/events', 'POST', { collegeId: user?.collegeId, ...event });
      setEvents(prev => [saved, ...prev]);
      await refreshNotifications();
    } catch (err) {
      console.error('Failed to add event:', err);
    }
  };

  const rsvpEvent = async (eventId, userId) => {
    try {
      const updated = await apiRequest(`/events/${eventId}/rsvp`, 'PUT', { userId });
      setEvents(prev => prev.map(e => e.id === eventId ? updated : e));
      await refreshNotifications();
    } catch (err) {
      console.error('Failed to RSVP for event:', err);
    }
  };

  const registerForEvent = async (eventId, registrationData) => {
    try {
      const updated = await apiRequest(`/events/${eventId}/register`, 'POST', registrationData);
      setEvents(prev => prev.map(e => e.id === eventId ? updated : e));
      await refreshNotifications();
      return updated;
    } catch (err) {
      console.error('Failed to register for event:', err);
      // Fallback local update
      setEvents(prev => prev.map(e => {
        if (e.id !== eventId) return e;
        const rsvps = Array.from(new Set([...(e.rsvps || []), registrationData.userId]));
        const prevRegs = e.registrations || [];
        const existingIdx = prevRegs.findIndex(r => r.userId === registrationData.userId);
        const newReg = {
          id: `reg-${Date.now()}`,
          ...registrationData,
          registeredAt: new Date().toISOString()
        };
        const updatedRegs = existingIdx >= 0 ? prevRegs.map((r, i) => i === existingIdx ? newReg : r) : [...prevRegs, newReg];
        return {
          ...e,
          rsvps,
          currentAttendees: rsvps.length,
          registrations: updatedRegs
        };
      }));
      throw err;
    }
  };

  const addEventComment = async (eventId, commentData) => {
    try {
      const saved = await apiRequest(`/events/${eventId}/comments`, 'POST', commentData);
      setEventComments(prev => [...prev, saved]);
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  const uploadProblemStatement = async (eventId, fileName, fileUrl) => {
    try {
      const updated = await apiRequest(`/events/${eventId}/problem-statement`, 'PUT', {
        problemStatementName: fileName,
        problemStatementUrl: fileUrl
      });
      setEvents(prev => prev.map(e => e.id === eventId ? updated : e));
      await refreshNotifications();
      return updated;
    } catch (err) {
      console.error('Failed to upload problem statement:', err);
      throw err;
    }
  };

  // Teams CRUD
  const getTeams = (eventId) => {
    return teams.filter(t => t.eventId === eventId);
  };

  const createTeam = async (teamData) => {
    try {
      const saved = await apiRequest('/teams', 'POST', teamData);
      setTeams(prev => [...prev, saved]);
      return saved;
    } catch (err) {
      console.error('Failed to create team:', err);
      throw err;
    }
  };

  const joinTeam = async (teamId, memberData) => {
    try {
      const updated = await apiRequest(`/teams/${teamId}/join`, 'PUT', memberData);
      setTeams(prev => prev.map(t => t.id === teamId ? updated : t));
      await refreshNotifications();
      return updated;
    } catch (err) {
      console.error('Failed to join team:', err);
      throw err;
    }
  };

  const leaveTeam = async (teamId, userId) => {
    try {
      const response = await apiRequest(`/teams/${teamId}/leave`, 'PUT', { userId });
      if (response.dissolved) {
        setTeams(prev => prev.filter(t => t.id !== teamId));
      } else {
        setTeams(prev => prev.map(t => t.id === teamId ? response : t));
      }
      return response;
    } catch (err) {
      console.error('Failed to leave team:', err);
      throw err;
    }
  };

  // Surveys CRUD
  const getSurveys = (filterRole) => {
    const roleToFilter = filterRole !== undefined ? filterRole : (user?.role !== 'college_admin' ? user?.role : null);
    if (!roleToFilter || roleToFilter === 'college_admin') return surveys;
    return surveys.filter(s => {
      const aud = s.targetAudience || 'all';
      if (roleToFilter === 'student') {
        return aud === 'student' || aud === 'all';
      }
      if (roleToFilter === 'alumni') {
        return aud === 'alumni' || aud === 'all';
      }
      return true;
    });
  };

  const addSurvey = async (survey) => {
    try {
      const saved = await apiRequest('/surveys', 'POST', { collegeId: user?.collegeId, ...survey });
      setSurveys(prev => [saved, ...prev]);
      await refreshNotifications();
      return saved;
    } catch (err) {
      console.error('Failed to build feedback survey:', err);
      throw err;
    }
  };

  const updateSurvey = async (surveyId, updatedFields) => {
    try {
      const updated = await apiRequest(`/surveys/${surveyId}`, 'PUT', updatedFields);
      setSurveys(prev => prev.map(s => s.id === surveyId ? { ...s, ...updated } : s));
      return updated;
    } catch (err) {
      console.error('Failed to update survey:', err);
      throw err;
    }
  };

  const deleteSurvey = async (surveyId) => {
    try {
      await apiRequest(`/surveys/${surveyId}`, 'DELETE');
      setSurveys(prev => prev.filter(s => s.id !== surveyId));
    } catch (err) {
      console.error('Failed to delete survey:', err);
      throw err;
    }
  };

  const submitSurveyResponse = async (surveyId, responses, alumniId) => {
    try {
      await apiRequest(`/surveys/${surveyId}/respond`, 'POST', { responses, submittedBy: alumniId });
      setSurveys(prev => prev.map(s => s.id === surveyId ? { ...s, responses: (s.responses || 0) + 1 } : s));
    } catch (err) {
      console.error('Failed to submit survey answers:', err);
    }
  };

  const getSurveyResults = async (surveyId) => {
    try {
      return await apiRequest(`/surveys/${surveyId}/responses`);
    } catch (err) {
      console.error('Failed to load responses for survey:', err);
      return [];
    }
  };

  // Networking CRUD
  const getConnectionRequests = useCallback((userId) => {
    return connectionRequests;
  }, [connectionRequests]);

  const sendConnectionRequest = useCallback(async (fromId, toId) => {
    try {
      const saved = await apiRequest('/networking', 'POST', { fromId, toId });
      setConnectionRequests(prev => [...prev, saved]);
      await refreshNotifications();
    } catch (err) {
      console.error('Failed to request connection:', err);
    }
  }, [refreshNotifications]);

  const respondConnectionRequest = useCallback(async (requestId, status) => {
    try {
      const updated = await apiRequest(`/networking/${requestId}`, 'PUT', { status });
      setConnectionRequests(prev => prev.map(r => r.id === requestId ? updated : r));
      
      // Re-fetch alumni profiles to reload the network sync details
      const fetchedAlumni = await apiRequest('/members');
      setAlumni(fetchedAlumni);
      await refreshNotifications();
    } catch (err) {
      console.error('Failed to respond to request:', err);
    }
  }, [refreshNotifications]);

  // Direct Messaging
  const getDirectMessages = useCallback(async (currentUserId, otherUserId) => {
    try {
      return await apiRequest(`/messages/${otherUserId}?currentUserId=${currentUserId}`);
    } catch (err) {
      console.error('Failed to load direct messages:', err);
      return [];
    }
  }, []);

  const sendDirectMessage = useCallback(async (fromUserId, toUserId, text = '', image = null) => {
    try {
      const saved = await apiRequest('/messages', 'POST', { from: fromUserId, to: toUserId, text, image });
      await refreshNotifications();
      return saved;
    } catch (err) {
      console.error('Failed to send direct message:', err);
      throw err;
    }
  }, [refreshNotifications]);

  // Block & Report User Management
  const refreshBlocks = useCallback(async () => {
    if (!user?.id) return;
    try {
      const blockData = await apiRequest(`/blocks/${user.id}`).catch(() => ({ blockedUserIds: [], blockedByUserIds: [] }));
      setBlockedUsers(blockData.blockedUserIds || []);
      setBlockedByUsers(blockData.blockedByUserIds || []);
    } catch (err) {
      console.error('Failed to refresh blocks:', err);
    }
  }, [user?.id]);

  const blockUser = useCallback(async (targetUserId) => {
    if (!user?.id || !targetUserId) return;
    try {
      await apiRequest('/blocks', 'POST', { blockerId: user.id, blockedId: targetUserId });
      await refreshBlocks();
    } catch (err) {
      console.error('Failed to block user:', err);
    }
  }, [user?.id, refreshBlocks]);

  const unblockUser = useCallback(async (targetUserId) => {
    if (!user?.id || !targetUserId) return;
    try {
      await apiRequest('/blocks', 'DELETE', { blockerId: user.id, blockedId: targetUserId });
      await refreshBlocks();
    } catch (err) {
      console.error('Failed to unblock user:', err);
    }
  }, [user?.id, refreshBlocks]);

  const isUserBlocked = useCallback((targetUserId) => {
    if (!targetUserId) return false;
    return blockedUsers.includes(targetUserId) || blockedByUsers.includes(targetUserId);
  }, [blockedUsers, blockedByUsers]);

  const addNotification = useCallback(async (notif) => {
    try {
      const saved = await apiRequest('/notifications', 'POST', notif);
      setNotifications(prev => [saved, ...prev]);
      return saved;
    } catch (err) {
      console.error('Failed to send alert notification:', err);
    }
  }, []);

  const reportUserToAdmin = useCallback(async ({ reportedId, reportedName, reason, details, proofImage = null, blockAlso = false }) => {
    if (!user?.id) throw new Error('Must be logged in to report');
    const reporterName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.id;
    
    await apiRequest('/complaints', 'POST', {
      title: `Misconduct Report: ${reportedName}`,
      category: 'misconduct',
      description: `Reporter: ${reporterName} (${user.id})\nReported User: ${reportedName} (${reportedId})\nReason: ${reason}\nDetails: ${details || 'None provided'}`,
      submitterMemberId: user.id,
      collegeId: user.collegeId || '',
      ...(proofImage ? { proofImage } : {})
    });

    try {
      await addNotification({
        id: `notif-rep-${user.id}-${reportedId}`,
        title: '🚨 User Misconduct Report',
        content: `${reporterName} reported ${reportedName} for: "${reason}". Details: ${details || 'No details'}`,
        message: `${reporterName} reported ${reportedName} for: "${reason}". Details: ${details || 'No details'}`,
        role: 'college_admin',
        collegeId: user.collegeId || '',
        type: 'complaint',
        link: '/college/complaints',
        date: new Date(),
        read: false
      });
    } catch (err) {
      console.warn('Failed to send admin notification for report:', err);
    }

    if (blockAlso && blockUser) {
      await blockUser(reportedId);
    }
  }, [user, addNotification, blockUser]);

  // Filter notifications based on active user preferences
  const activeNotifications = useMemo(() => {
    if (!user?.notifications) return notifications;
    const prefs = user.notifications;
    return (notifications || []).filter(n => {
      if (prefs.directMessages === false && (n.type === 'message' || n.title?.includes('Message') || n.title?.includes('💬'))) {
        return false;
      }
      if (prefs.connectionRequests === false && (n.type === 'networking' || n.title?.includes('Connection') || n.title?.includes('Mentorship'))) {
        return false;
      }
      if (prefs.circulars === false && (n.type === 'circular' || n.title?.includes('Announcement') || n.title?.includes('Notice'))) {
        return false;
      }
      if (prefs.jobAlerts === false && (n.type === 'job' || n.title?.includes('Job'))) {
        return false;
      }
      if (prefs.eventReminders === false && (n.type === 'event' || n.title?.includes('Event'))) {
        return false;
      }
      return true;
    });
  }, [notifications, user?.notifications]);

  // Notifications CRUD
  const getNotifications = (role, userId, collegeId) => {
    return activeNotifications;
  };

  const markNotificationAsRead = useCallback(async (notifId) => {
    try {
      const updated = await apiRequest(`/notifications/${notifId}/read`, 'PUT');
      setNotifications(prev => prev.map(n => n.id === notifId ? updated : n));
    } catch (err) {
      console.error('Failed to mark alert read:', err);
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async (role, userId) => {
    try {
      await apiRequest('/notifications/read-all', 'PUT', { 
        userId: userId || user?.id, 
        role: role || user?.role, 
        collegeId: user?.collegeId 
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.warn('Failed to mark all notifications read on backend, updating locally:', err);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  }, [user]);

  // Blogs CRUD
  const getBlogs = () => blogs;

  const addBlog = async (blogData) => {
    try {
      const saved = await apiRequest('/blogs', 'POST', { collegeId: user?.collegeId, ...blogData });
      setBlogs(prev => [saved, ...prev]);
      await refreshNotifications();
    } catch (err) {
      console.error('Failed to add blog:', err);
    }
  };

  const likeBlog = async (blogId, explicitUserId = null) => {
    const userId = explicitUserId || user?.id || user?._id || user?.email;
    try {
      const updated = await apiRequest(`/blogs/${blogId}/like`, 'PUT', { userId });
      setBlogs(prev => prev.map(b => b.id === blogId ? updated : b));
      return updated;
    } catch (err) {
      console.error('Failed to like blog:', err);
      let updatedBlog = null;
      setBlogs(prev => prev.map(b => {
        if (b.id !== blogId) return b;
        const likedBy = Array.isArray(b.likedBy) ? [...b.likedBy] : [];
        const userIdStr = String(userId || '').trim();
        const hasLiked = userIdStr && likedBy.some(id => String(id).trim() === userIdStr);
        const newLikedBy = hasLiked
          ? likedBy.filter(id => String(id).trim() !== userIdStr)
          : (userIdStr ? [...likedBy, userIdStr] : likedBy);
        const newLikes = hasLiked
          ? Math.max(0, (b.likes || 1) - 1)
          : (b.likes || 0) + 1;
        updatedBlog = { ...b, likes: newLikes, likedBy: newLikedBy };
        return updatedBlog;
      }));
      return updatedBlog;
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      await apiRequest(`/blogs/${blogId}`, 'DELETE');
      setBlogs(prev => prev.filter(b => b.id !== blogId));
    } catch (err) {
      console.error('Failed to delete blog:', err);
    }
  };

  const addBlogComment = async (blogId, commentData) => {
    try {
      const res = await apiRequest(`/blogs/${blogId}/comments`, 'POST', commentData);
      if (res.blog) {
        setBlogs(prev => prev.map(b => b.id === blogId ? res.blog : b));
        return res.blog;
      }
      return null;
    } catch (err) {
      console.error('Failed to post blog comment:', err);
      let updatedBlog = null;
      setBlogs(prev => prev.map(b => {
        if (b.id !== blogId) return b;
        const newComm = {
          id: `comm-${Date.now()}`,
          ...commentData,
          createdAt: new Date().toISOString()
        };
        const currentList = Array.isArray(b.commentsList) ? b.commentsList : [];
        const newList = [...currentList, newComm];
        updatedBlog = {
          ...b,
          commentsList: newList,
          comments: Math.max(newList.length, (b.comments || 0) + 1)
        };
        return updatedBlog;
      }));
      return updatedBlog;
    }
  };

  const deleteBlogComment = async (blogId, commentId) => {
    try {
      const res = await apiRequest(`/blogs/${blogId}/comments/${commentId}`, 'DELETE');
      if (res.blog) {
        setBlogs(prev => prev.map(b => b.id === blogId ? res.blog : b));
        return res.blog;
      }
    } catch (err) {
      console.error('Failed to delete blog comment:', err);
      let updatedBlog = null;
      setBlogs(prev => prev.map(b => {
        if (b.id !== blogId) return b;
        const currentList = Array.isArray(b.commentsList) ? b.commentsList : [];
        const newList = currentList.filter(c => c.id !== commentId);
        updatedBlog = {
          ...b,
          commentsList: newList,
          comments: newList.length
        };
        return updatedBlog;
      }));
      return updatedBlog;
    }
  };

  const addCircular = async (circularData) => {
    try {
      const saved = await apiRequest('/circulars', 'POST', circularData);
      setCirculars(prev => [saved, ...prev]);
      await refreshNotifications();
      return saved;
    } catch (err) {
      console.error('Failed to add circular:', err);
      throw err;
    }
  };

  const deleteCircular = async (id) => {
    try {
      await apiRequest(`/circulars/${id}`, 'DELETE');
      setCirculars(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Failed to delete circular:', err);
      throw err;
    }
  };

  const markCircularsAsSeen = useCallback(() => {
    if (!user?.id) return;
    const now = new Date().toISOString();
    localStorage.setItem(`lastSeenCirculars_${user.id}`, now);
    setLastSeenCircularsTime(now);
  }, [user]);

  const sendResumeRequest = (studentId, studentName, alumniId) => {
    const newRequest = {
      id: `rr-${Date.now()}`,
      studentId,
      studentName: studentName || user?.name || 'Student',
      alumniId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setResumeRequests(prev => {
      const updated = [newRequest, ...prev.filter(r => !(r.studentId === studentId && r.alumniId === alumniId))];
      localStorage.setItem('alumni_resume_requests', JSON.stringify(updated));
      return updated;
    });
    return newRequest;
  };

  const respondResumeRequest = (requestId, status) => {
    setResumeRequests(prev => {
      const updated = prev.map(r => r.id === requestId ? { ...r, status } : r);
      localStorage.setItem('alumni_resume_requests', JSON.stringify(updated));
      return updated;
    });
  };

  const getResumeRequestStatus = (studentId, alumniId) => {
    const req = resumeRequests.find(r => r.studentId === studentId && r.alumniId === alumniId);
    return req ? req.status : 'none';
  };

  const getResumeRequestsForAlumni = (alumniId) => {
    return resumeRequests.filter(r => r.alumniId === alumniId);
  };

  const value = {
    isOffline,
    colleges,
    alumni,
    preVerifiedStudents,
    eventComments,
    jobs,
    events,
    surveys,
    resetData,
    updateCollege,
    getAlumni,
    getAlumniById,
    updateAlumni,
    verifyAlumni,
    bulkVerifyAlumni,
    rejectAlumni,
    bulkRejectAlumni,
    emailLogs,
    addManualAlumniRegistration,
    addManualStudentRegistration,
    addPreVerifiedStudents,
    addManualPreVerifiedStudent,
    removePreVerifiedStudent,
    deleteMember,
    updateMember,
    bulkAddAlumni,
    getJobs,
    addJob,
    approveJob,
    rejectJob,
    applyJob,
    getEvents,
    addEvent,
    rsvpEvent,
    registerForEvent,
    addEventComment,
    getSurveys,
    addSurvey,
    updateSurvey,
    deleteSurvey,
    submitSurveyResponse,
    getSurveyResults,
    getConnectionRequests,
    sendConnectionRequest,
    respondConnectionRequest,
    getDirectMessages,
    sendDirectMessage,
    blockedUsers,
    blockedByUsers,
    refreshBlocks,
    blockUser,
    unblockUser,
    isUserBlocked,
    reportUserToAdmin,
    notifications: activeNotifications,
    getNotifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    refreshNotifications,
    blogs,
    getBlogs,
    addBlog,
    likeBlog,
    deleteBlog,
    addBlogComment,
    deleteBlogComment,
    uploadProblemStatement,
    teams,
    getTeams,
    createTeam,
    joinTeam,
    leaveTeam,
    circulars,
    addCircular,
    deleteCircular,
    lastSeenCircularsTime,
    markCircularsAsSeen,
    resumeRequests,
    sendResumeRequest,
    respondResumeRequest,
    getResumeRequestStatus,
    getResumeRequestsForAlumni
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataContext;
