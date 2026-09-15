import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ClipboardList, AlertCircle, Check, HelpCircle, Star } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import './SurveysPage.css';

export default function SurveysPage() {
  const { user } = useAuth();
  const { surveys, submitSurveyResponse } = useData();

  const [activeSurvey, setActiveSurvey] = useState(null);
  const [responseAnswers, setResponseAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [audienceFilter, setAudienceFilter] = useState('all'); // 'all', 'role_specific', 'community' (or 'student', 'alumni' for admin)

  const userRole = user?.role || 'student';

  // Filter surveys strictly matching current user's eligibility
  const eligibleSurveys = useMemo(() => {
    return (surveys || []).filter(survey => {
      const aud = survey.targetAudience || 'all';
      if (userRole === 'college_admin' || userRole === 'admin') return true;
      if (userRole === 'student') {
        return aud === 'student' || aud === 'all';
      }
      if (userRole === 'alumni') {
        return aud === 'alumni' || aud === 'all';
      }
      return true;
    });
  }, [surveys, userRole]);

  // Sub-filter by tab within eligible surveys
  const filteredSurveys = useMemo(() => {
    if (audienceFilter === 'all') return eligibleSurveys;
    if (userRole === 'college_admin' || userRole === 'admin') {
      return eligibleSurveys.filter(s => (s.targetAudience || 'all') === audienceFilter);
    }
    if (audienceFilter === 'role_specific') {
      return eligibleSurveys.filter(s => s.targetAudience === userRole);
    }
    if (audienceFilter === 'community') {
      return eligibleSurveys.filter(s => (s.targetAudience || 'all') === 'all');
    }
    return eligibleSurveys;
  }, [eligibleSurveys, audienceFilter, userRole]);

  const handleOpenSurvey = (survey) => {
    const aud = survey.targetAudience || 'all';
    if (userRole === 'student' && aud === 'alumni') {
      alert('This survey is designated exclusively for alumni.');
      return;
    }
    if (userRole === 'alumni' && aud === 'student') {
      alert('This survey is designated exclusively for current students.');
      return;
    }
    setActiveSurvey(survey);
    setResponseAnswers({});
    setSubmitted(false);
    setValidationErrors({});
  };

  const handleInputChange = (qId, value) => {
    setResponseAnswers(prev => ({ ...prev, [qId]: value }));
    if (validationErrors[qId]) {
      setValidationErrors(prev => ({ ...prev, [qId]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required questions
    const errors = {};
    let firstErrorId = null;
    activeSurvey.questions.forEach(q => {
      const val = responseAnswers[q.id];
      if (q.required && (val === undefined || val === null || (typeof val === 'string' && val.trim() === ''))) {
        errors[q.id] = true;
        if (!firstErrorId) firstErrorId = q.id;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const errorEl = document.getElementById(`card-${firstErrorId}`);
      if (errorEl) {
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Transform answers into context format
    const parsedResponses = Object.entries(responseAnswers).map(([qId, value]) => ({
      qId,
      value
    }));

    submitSurveyResponse(activeSurvey.id, parsedResponses, user?.id);
    setSubmitted(true);
    setTimeout(() => {
      setActiveSurvey(null);
    }, 1500);
  };

  return (
    <div className="surveys-page stagger-children">
      {activeSurvey ? (
        <div className="google-form-container max-w-2xl mx-auto flex flex-col gap-4 mb-12">
          {submitted ? (
            <div className="google-form-card google-form-header-card p-8 text-center flex flex-col items-center">
              <div className="google-form-top-accent"></div>
              <div className="success-icon-wrapper mb-4"><Check size={28} /></div>
              <h2 className="font-bold text-2xl text-primary">{activeSurvey.title}</h2>
              <p className="text-sm text-secondary mt-3">Your response has been recorded.</p>
              <button 
                type="button" 
                className="btn btn-secondary mt-6"
                onClick={() => setActiveSurvey(null)}
              >
                Back to Surveys
              </button>
            </div>
          ) : (activeSurvey.deadline && new Date(activeSurvey.deadline) < new Date()) ? (
            <div className="google-form-card google-form-header-card p-8 text-center flex flex-col items-center">
              <div className="google-form-top-accent"></div>
              <div className="mb-4 text-danger"><AlertCircle size={32} /></div>
              <h2 className="font-bold text-2xl text-primary">{activeSurvey.title}</h2>
              <p className="text-sm text-secondary mt-3">This survey has closed and is no longer accepting responses.</p>
              <button 
                type="button" 
                className="btn btn-secondary mt-6"
                onClick={() => setActiveSurvey(null)}
              >
                Back to Surveys
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              {/* Header Card */}
              <div className="google-form-card google-form-header-card p-6 relative overflow-hidden">
                <div className="google-form-top-accent"></div>
                <h1 className="font-bold text-3xl mb-3 text-primary">{activeSurvey.title}</h1>
                <p className="text-sm text-secondary mb-4 leading-relaxed">{activeSurvey.description}</p>
                <div className="border-t border-light pt-3 flex flex-col gap-2">
                  <div className="text-xs text-danger">* Indicates required question</div>
                  {activeSurvey.anonymous ? (
                    <div className="text-xs text-warning font-semibold flex gap-1.5 items-center">
                      <AlertCircle size={14} /> Anonymous Response Enabled. Your identity will not be shared.
                    </div>
                  ) : (
                    <div className="text-xs text-secondary font-semibold flex gap-1.5 items-center">
                      <AlertCircle size={14} /> Logged in as {user?.email || 'Anonymous'}. Your response will be linked to your account.
                    </div>
                  )}
                </div>
              </div>

              {/* Questions List */}
              {activeSurvey.questions.map((q, idx) => {
                const hasError = validationErrors[q.id];
                return (
                  <div 
                    key={q.id} 
                    id={`card-${q.id}`} 
                    className={`google-form-card google-form-question-card p-6 flex flex-col gap-4 ${hasError ? 'question-card-error' : ''}`}
                  >
                    <label className="font-medium text-base text-primary flex items-start gap-1">
                      <span>{q.question}</span>
                      {q.required && <span className="text-danger ml-0.5">*</span>}
                    </label>

                    {q.type === 'mcq' && (
                      <div className="mcq-options flex flex-col gap-3">
                        {q.options.map(opt => (
                          <label key={opt} className="google-form-radio-label flex items-center gap-3 text-sm text-secondary cursor-pointer p-2 rounded hover:bg-surface-hover transition-colors">
                            <input 
                              type="radio" 
                              name={q.id} 
                              value={opt}
                              checked={responseAnswers[q.id] === opt}
                              onChange={() => handleInputChange(q.id, opt)}
                              className="google-form-radio-input"
                            />
                            <span className="google-form-option-text">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.type === 'text' && (
                      <textarea 
                        className="google-form-textarea w-full" 
                        placeholder="Your answer" 
                        rows={2}
                        value={responseAnswers[q.id] || ''}
                        onChange={e => handleInputChange(q.id, e.target.value)}
                      />
                    )}

                    {q.type === 'rating' && (
                      <div className="rating-container flex flex-col gap-2">
                        <div className="rating-options flex gap-3 items-center py-2">
                          <span className="text-xs text-secondary">Worst</span>
                          {Array.from({ length: 5 }, (_, i) => i + 1).map(val => (
                            <button 
                              key={val} 
                              type="button" 
                              className={`google-form-rating-star ${(responseAnswers[q.id] || 0) >= val ? 'active' : ''}`}
                              onClick={() => handleInputChange(q.id, val)}
                            >
                              <Star size={28} fill={(responseAnswers[q.id] || 0) >= val ? 'var(--accent)' : 'transparent'} />
                            </button>
                          ))}
                          <span className="text-xs text-secondary">Best</span>
                        </div>
                      </div>
                    )}

                    {/* Inline Error Message */}
                    {hasError && (
                      <div className="google-form-error-msg flex items-center gap-1.5 text-xs text-danger font-semibold mt-1">
                        <AlertCircle size={14} />
                        <span>This is a required question</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Footer Buttons */}
              <div className="flex gap-3 justify-between items-center mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveSurvey(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary px-6">Submit</button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Audience Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {userRole === 'college_admin' || userRole === 'admin' ? (
              <>
                <button 
                  type="button" 
                  onClick={() => setAudienceFilter('all')} 
                  className={`btn btn-sm ${audienceFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  👥 All Surveys ({eligibleSurveys.length})
                </button>
                <button 
                  type="button" 
                  onClick={() => setAudienceFilter('student')} 
                  className={`btn btn-sm ${audienceFilter === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  🎒 For Students ({eligibleSurveys.filter(s => (s.targetAudience || 'all') === 'student').length})
                </button>
                <button 
                  type="button" 
                  onClick={() => setAudienceFilter('alumni')} 
                  className={`btn btn-sm ${audienceFilter === 'alumni' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  🎓 For Alumni ({eligibleSurveys.filter(s => (s.targetAudience || 'all') === 'alumni').length})
                </button>
              </>
            ) : (
              <>
                <button 
                  type="button" 
                  onClick={() => setAudienceFilter('all')} 
                  className={`btn btn-sm ${audienceFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  📋 All My Surveys ({eligibleSurveys.length})
                </button>
                <button 
                  type="button" 
                  onClick={() => setAudienceFilter('role_specific')} 
                  className={`btn btn-sm ${audienceFilter === 'role_specific' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {userRole === 'student' ? '🎒 Student Specific' : '🎓 Alumni Specific'} ({eligibleSurveys.filter(s => s.targetAudience === userRole).length})
                </button>
                <button 
                  type="button" 
                  onClick={() => setAudienceFilter('community')} 
                  className={`btn btn-sm ${audienceFilter === 'community' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  🌐 Campus-Wide ({eligibleSurveys.filter(s => (s.targetAudience || 'all') === 'all').length})
                </button>
              </>
            )}
          </div>

          <div className="grid grid-3 gap-6">
            {filteredSurveys.length === 0 ? (
              <div className="card empty-state p-12 text-center grid-span-3">
                <div className="empty-icon"><ClipboardList size={32} /></div>
                <h3>No Surveys Found</h3>
                <p>There are no active feedback surveys matching the selected audience at this time.</p>
              </div>
            ) : (
              filteredSurveys.map(survey => {
                const isExpired = survey.deadline && new Date(survey.deadline) < new Date();
                return (
                  <div key={survey.id} className={`card survey-card ${isExpired ? 'opacity-70' : 'card-interactive'}`}>
                    <div className="survey-card-body p-6 flex flex-col h-full">
                      <div className="flex justify-between items-start gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg" title={survey.title}>{survey.title}</h3>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {survey.targetAudience === 'alumni' && (
                            <span className="badge text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800 px-2 py-0.5 rounded-full">
                              🎓 Alumni Only
                            </span>
                          )}
                          {survey.targetAudience === 'student' && (
                            <span className="badge text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                              🎒 Students Only
                            </span>
                          )}
                          {(survey.targetAudience === 'all' || !survey.targetAudience) && (
                            <span className="badge text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800 px-2 py-0.5 rounded-full">
                              👥 All (Students & Alumni)
                            </span>
                          )}
                          {isExpired && <span className="badge badge-danger text-xs px-2 py-0.5">Closed</span>}
                        </div>
                      </div>
                      <p className="text-xs text-secondary mt-1">By {survey.createdBy}</p>
                      
                      <p className="text-sm text-secondary mt-3 flex-1 line-clamp-3">
                        {survey.description}
                      </p>

                      {survey.deadline && (
                        <div className={`text-xs mt-3 font-semibold ${isExpired ? 'text-danger' : 'text-success'}`}>
                          {isExpired ? (
                            <span>Ended: {new Date(survey.deadline).toLocaleString()}</span>
                          ) : (
                            <span>Ends: {new Date(survey.deadline).toLocaleString()}</span>
                          )}
                        </div>
                      )}

                      <div className="survey-footer mt-6 pt-3 border-t border-light flex justify-between items-center text-xs text-secondary">
                        <span>Published: {formatDate(survey.createdDate)}</span>
                        {isExpired ? (
                          <button className="btn btn-secondary btn-sm" disabled>Closed</button>
                        ) : (
                          <button onClick={() => handleOpenSurvey(survey)} className="btn btn-primary btn-sm">Take Survey</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
