import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { GraduationCap, Sparkles, MessageSquare, ArrowRight, Check, Send, X } from 'lucide-react';
import { calculateMentorMatch, generateConversationStarters } from '../../utils/matching';
import { getInitials } from '../../utils/formatters';
import './MentorshipPage.css';

export default function MentorshipPage() {
  const { user } = useAuth();
  const { alumni, updateAlumni, getAlumniById } = useData();

  const [activeMode, setActiveMode] = useState('find'); // find, volunteer
  const [mentorModalOpen, setModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  
  // Mentorship request state
  const [requestMsg, setRequestMsg] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  // Volunteer form state
  const [topics, setTopics] = useState('');

  const currentUserData = useMemo(() => getAlumniById(user?.id) || user || {}, [getAlumniById, user]);

  // Mentor list (verified, has isMentor: true, not the user)
  const mentorsList = useMemo(() => {
    return alumni.filter(a => a.isMentor && a.id !== user?.id && (a.status === 'active' || !a.status));
  }, [alumni, user]);

  // Compute matches
  const mentorsWithMatches = useMemo(() => {
    const mentee = currentUserData || user || {};
    return mentorsList.map(mentor => {
      const match = calculateMentorMatch(mentee, mentor);
      const starters = generateConversationStarters(mentee, mentor);
      return {
        ...mentor,
        matchScore: match.score || 70,
        matchReasons: match.reasons || [],
        starters: starters || []
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, [mentorsList, currentUserData, user]);

  const handleOpenRequest = (mentor) => {
    setSelectedMentor(mentor);
    setRequestMsg(`Hi ${mentor.firstName}, I came across your profile and would value your guidance in ${mentor.mentorTopics.slice(0, 2).join(' & ')} as a mentor.`);
    setMessageSent(false);
    setModalOpen(true);
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    setMessageSent(true);
    setTimeout(() => {
      setModalOpen(false);
    }, 1500);
  };

  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    const topicsArray = topics ? topics.split(',').map(t => t.trim()).filter(t => t.length > 0) : [];
    
    updateAlumni(user?.id, {
      isMentor: true,
      mentorTopics: topicsArray
    });

    alert('Thank you! You are now registered as a mentor on the platform.');
  };

  return (
    <div className="mentorship-page stagger-children">
      {/* Mode navigation */}
      <div className="tabs mb-6">
        <button className={`tab-btn ${activeMode === 'find' ? 'active' : ''}`} onClick={() => setActiveMode('find')}>
          Find a Mentor
        </button>
        <button className={`tab-btn ${activeMode === 'volunteer' ? 'active' : ''}`} onClick={() => setActiveMode('volunteer')}>
          Volunteer as Mentor
        </button>
      </div>

      {activeMode === 'find' && (
        <div className="flex flex-col gap-6">
          {mentorsWithMatches.length === 0 ? (
            <div className="card empty-state p-12 text-center">
              <div className="empty-icon"><GraduationCap size={32} /></div>
              <h3>No Mentors Registered</h3>
              <p>Check back later or invite senior alumni to volunteer as mentors.</p>
            </div>
          ) : (
            mentorsWithMatches.map(mentor => (
              <div key={mentor.id} className="card mentor-card p-6 flex flex-col gap-4">
                <div className="mentor-header flex justify-between items-start flex-wrap gap-4">
                  <div className="flex gap-4">
                    <div className="avatar avatar-lg">{getInitials(`${mentor.firstName} ${mentor.lastName}`)}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{mentor.firstName} {mentor.lastName}</h3>
                      <p className="text-xs text-secondary mt-1">{mentor.degree} &bull; {mentor.department}</p>
                      <p className="text-sm font-medium text-accent mt-2">{mentor.currentCompany ? `${mentor.currentRole} at ${mentor.currentCompany}` : 'Professional Mentor'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="ai-match-gauge" style={{ backgroundColor: mentor.matchScore > 75 ? 'var(--accent-bg)' : '#EFF6FF', color: mentor.matchScore > 75 ? 'var(--accent-dark)' : '#1D4ED8' }}>
                      <Sparkles size={14} />
                      <span>{mentor.matchScore}% Match Score</span>
                    </div>
                    <button onClick={() => handleOpenRequest(mentor)} className="btn btn-primary btn-sm mt-2">Request Mentor</button>
                  </div>
                </div>

                <div className="mentor-body pt-3 border-t border-light">
                  <div className="mentor-topics">
                    <h4 className="font-semibold text-xs text-secondary uppercase tracking-wider">Expertise / Mentoring Topics</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {mentor.mentorTopics.map((t, idx) => (
                        <span key={idx} className="badge badge-accent">{t}</span>
                      ))}
                    </div>
                  </div>

                  {mentor.matchReasons.length > 0 && (
                    <div className="mentor-match-insights mt-4 bg-background p-4 rounded border border-light">
                      <h4 className="font-semibold text-xs text-accent uppercase tracking-wider flex items-center gap-1">
                        <Sparkles size={12} /> AI Match Insights
                      </h4>
                      <ul className="text-xs text-secondary list-disc pl-4 mt-2 flex flex-col gap-1">
                        {mentor.matchReasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Conversation Starters */}
                  {mentor.starters.length > 0 && (
                    <div className="mentor-conversation-starters mt-4">
                      <h4 className="font-semibold text-xs text-secondary uppercase tracking-wider">Suggested Openers</h4>
                      <div className="flex flex-col gap-2 mt-2">
                        {mentor.starters.map((starter, idx) => (
                          <div key={idx} className="starter-box p-3 bg-surface border rounded text-xs text-secondary italic">
                            "{starter}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeMode === 'volunteer' && (
        <div className="card p-8 max-w-lg mx-auto">
          <div className="text-center">
            <GraduationCap size={48} className="text-accent mx-auto" />
            <h2 className="font-bold text-xl mt-4">Become an Alumni Mentor</h2>
            <p className="text-sm text-secondary mt-2">
              Share your professional knowledge, review resumes, help with interview prep, and guide junior alumni on their career journey.
            </p>
          </div>

          <form onSubmit={handleVolunteerSubmit} className="mt-8 flex flex-col gap-4">
            <div className="input-group">
              <label htmlFor="mentor-topics">Mentoring Topics / Expertise (Comma separated) *</label>
              <input 
                type="text" 
                id="mentor-topics" 
                className="input" 
                placeholder="e.g. System Design, Web Development, Interview Prep, Product Management" 
                value={topics}
                onChange={e => setTopics(e.target.value)}
                required
              />
            </div>

            <div className="volunteer-info-badge p-4 bg-background border rounded text-xs text-secondary flex items-start gap-2">
              <Check size={16} className="text-success flex-shrink-0" />
              <span>By registering, you agree to receive potential mentorship queries from students and fresh graduates. You can disable this from settings at any time.</span>
            </div>

            <button type="submit" className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2">
              Submit Volunteer Registration <ArrowRight size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Request Mentorship Modal */}
      {mentorModalOpen && selectedMentor && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Request Mentorship from {selectedMentor.firstName}</h3>
              <button className="btn btn-ghost p-1" onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSendRequest}>
              <div className="modal-body flex flex-col gap-4">
                {messageSent ? (
                  <div className="text-center p-6 flex flex-col items-center">
                    <div className="success-icon-wrapper"><Check size={28} /></div>
                    <h3 className="mt-4">Mentorship Request Sent!</h3>
                    <p className="text-xs text-secondary mt-2">You will be notified once they accept your mentorship match invitation.</p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-secondary">
                      Write a brief message explaining what you hope to learn or accomplish under their mentorship.
                    </p>
                    <div className="input-group">
                      <label htmlFor="req-msg">Custom Invitation Message</label>
                      <textarea 
                        id="req-msg" 
                        className="textarea" 
                        rows="4" 
                        value={requestMsg}
                        onChange={e => setRequestMsg(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
              {!messageSent && (
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary flex items-center gap-2">
                    <Send size={14} /> Send Invitation
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
