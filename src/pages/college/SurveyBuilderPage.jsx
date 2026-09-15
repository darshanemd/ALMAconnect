import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { ClipboardList, Trash2, BarChart, FileText, Download, RefreshCw, Star, Users, GraduationCap, BookOpen, Check, Plus } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import './SurveyBuilderPage.css';

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

export default function SurveyBuilderPage() {
  const { user } = useAuth();
  const { surveys, addSurvey, updateSurvey, deleteSurvey, getSurveyResults } = useData();

  const [activeTab, setActiveTab] = useState('list'); // list, create, results
  const [selectedSurveyForResults, setSelectedSurveyForResults] = useState(null);
  const [loadedResults, setLoadedResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    let active = true;

    if (selectedSurveyForResults) {
      // Defer state updates to satisfy the react-hooks/set-state-in-effect rule
      setTimeout(() => {
        if (!active) return;
        setLoadingResults(true);
        getSurveyResults(selectedSurveyForResults.id)
          .then(res => {
            if (active) {
              setLoadedResults(res || []);
            }
          })
          .catch(err => {
            console.error(err);
            if (active) {
              setLoadedResults([]);
            }
          })
          .finally(() => {
            if (active) {
              setLoadingResults(false);
            }
          });
      }, 0);
    } else {
      setTimeout(() => {
        if (active) {
          setLoadedResults([]);
        }
      }, 0);
    }

    return () => {
      active = false;
    };
  }, [selectedSurveyForResults, getSurveyResults]);

  // Create Survey states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('all'); // 'all', 'alumni', 'student'
  const [anonymous, setAnonymous] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [questions, setQuestions] = useState([
    { id: 'q-1', type: 'mcq', question: 'Rate your satisfaction level:', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'], required: true }
  ]);

  const handleAddQuestion = () => {
    const newQ = {
      id: `q-${Date.now()}`,
      type: 'text',
      question: '',
      options: ['Option 1', 'Option 2'],
      required: true
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleQuestionChange = (id, field, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleMcqOptionChange = (qId, optionIdx, value) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOpts = [...q.options];
        newOpts[optionIdx] = value;
        return { ...q, options: newOpts };
      }
      return q;
    }));
  };

  const handleAddMcqOption = (qId) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] };
      }
      return q;
    }));
  };

  const handleRemoveMcqOption = (qId, optionIdx) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options.length > 2) {
        return { ...q, options: q.options.filter((_, idx) => idx !== optionIdx) };
      }
      return q;
    }));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title || questions.length === 0) return;

    const payload = {
      title,
      description,
      targetAudience,
      anonymous,
      questions,
      createdBy: user?.name || 'College Admin',
      collegeId: user?.collegeId || 'col-1',
      deadline: deadline ? new Date(deadline).toISOString() : null
    };

    addSurvey(payload);
    setTitle('');
    setDescription('');
    setTargetAudience('all');
    setAnonymous(false);
    setDeadline('');
    setQuestions([{ id: 'q-1', type: 'mcq', question: 'Rate satisfaction:', options: ['Yes', 'No'], required: true }]);
    setActiveTab('list');
  };

  const handleDeleteSurvey = async (survey) => {
    if (!window.confirm(`Are you sure you want to permanently delete the survey "${survey.title}" and all its submitted responses?`)) {
      return;
    }
    try {
      await deleteSurvey(survey.id);
    } catch (err) {
      alert('Failed to delete survey: ' + (err.message || 'Unknown error'));
    }
  };

  const handleAudienceChange = async (survey, newAudience) => {
    try {
      await updateSurvey(survey.id, { targetAudience: newAudience });
    } catch (err) {
      alert('Failed to update target audience: ' + (err.message || 'Unknown error'));
    }
  };

  const handleViewResults = (survey) => {
    setSelectedSurveyForResults(survey);
    setActiveTab('results');
  };

  const handleExportCsv = (survey) => {
    const results = loadedResults;
    
    const headers = [];
    if (!survey.anonymous) {
      headers.push('Respondent');
    }
    headers.push('Date Submitted');
    
    survey.questions.forEach((q, idx) => {
      headers.push(`Q${idx + 1}: ${q.question}`);
    });
    
    const rows = [headers];
    
    results.forEach(res => {
      const row = [];
      if (!survey.anonymous) {
        row.push(res.userName || res.respondentName || 'Anonymous');
      }
      row.push(res.date ? new Date(res.date).toLocaleString() : new Date().toLocaleString());
      
      survey.questions.forEach(q => {
        const answer = res.responses.find(r => r.qId === q.id)?.value || '';
        row.push(answer);
      });
      rows.push(row);
    });
    
    const csvContent = rows.map(r => 
      r.map(val => {
        const strVal = String(val);
        const escaped = strVal.replace(/"/g, '""');
        if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('"')) {
          return `"${escaped}"`;
        }
        return escaped;
      }).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${survey.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_results.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const analyzeSentiment = (responses) => {
    if (!responses || responses.length === 0) {
      return { positive: 0, neutral: 100, negative: 0 };
    }

    const posWords = new Set(['good', 'great', 'awesome', 'excellent', 'helpful', 'satisfied', 'love', 'perfect', 'best', 'amazing', 'valuable', 'informative', 'useful', 'supportive', 'friendly', 'recommend', 'nice', 'happy', 'glad', 'enjoy', 'enjoyed', 'fantastic', 'easy', 'clear']);
    const negWords = new Set(['bad', 'poor', 'terrible', 'awful', 'useless', 'boring', 'worst', 'dissatisfied', 'hate', 'unhelpful', 'disappointing', 'frustrated', 'annoyed', 'difficult', 'expensive', 'waste', 'unhappy', 'hard', 'unclear', 'confusing', 'fail', 'failed', 'issue', 'issues', 'bug', 'bugs']);

    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;

    responses.forEach(text => {
      if (!text) return;
      const words = text.toLowerCase().match(/\b\w+\b/g) || [];
      let posScore = 0;
      let negScore = 0;

      words.forEach(word => {
        if (posWords.has(word)) posScore++;
        if (negWords.has(word)) negScore++;
      });

      if (posScore > negScore) {
        positiveCount++;
      } else if (negScore > posScore) {
        negativeCount++;
      } else {
        neutralCount++;
      }
    });

    const total = responses.length;
    return {
      positive: Math.round((positiveCount / total) * 100),
      neutral: Math.round((neutralCount / total) * 100),
      negative: Math.round((negativeCount / total) * 100)
    };
  };

  // Compile survey results
  const surveyAnalytics = React.useMemo(() => {
    if (!selectedSurveyForResults) return [];
    
    const results = loadedResults;
    
    return selectedSurveyForResults.questions.map(q => {
      if (q.type === 'mcq') {
        const counts = {};
        q.options.forEach(opt => { counts[opt] = 0; });
        results.forEach(res => {
          const ans = res.responses.find(r => r.qId === q.id)?.value;
          if (ans) {
            counts[ans] = (counts[ans] || 0) + 1;
          }
        });
        
        const chartData = Object.entries(counts).map(([name, count]) => ({ name, count }));
        return { q, type: 'mcq', chartData };
      }
      
      if (q.type === 'rating') {
        let total = 0;
        let count = 0;
        results.forEach(res => {
          const ans = res.responses.find(r => r.qId === q.id)?.value;
          if (ans) {
            total += Number(ans);
            count++;
          }
        });
        const average = count > 0 ? (total / count).toFixed(1) : '0';
        return { q, type: 'rating', average, count };
      }
      
      const textResponses = results.map(res => 
        res.responses.find(r => r.qId === q.id)?.value
      ).filter(Boolean);
      
      return { q, type: 'text', textResponses };
    });
  }, [selectedSurveyForResults, loadedResults]);

  return (
    <div className="survey-builder-page stagger-children">
      {/* SVG gradients for premium rendering of fractional star ratings */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="var(--accent)" />
            <stop offset="50%" stopColor="transparent" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
      {/* Top Header & Quick Action Banner */}
      <div className="card p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ClipboardList className="text-emerald-600" size={24} /> Feedback & Campus Surveys
          </h2>
          <p className="text-xs text-secondary mt-1">
            Design, publish, and analyze custom feedback surveys for students and alumni.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab !== 'create' ? (
            <button 
              type="button"
              onClick={() => setActiveTab('create')} 
              className="survey-create-cta-btn"
            >
              <Plus size={18} strokeWidth={2.5} /> Create New Survey
            </button>
          ) : (
            <button 
              type="button"
              onClick={() => setActiveTab('list')} 
              className="btn btn-secondary flex items-center gap-2"
            >
              Back to Active Surveys
            </button>
          )}
        </div>
      </div>

      {/* Tab controls */}
      <div className="tabs mb-6 flex items-center gap-3">
        <button 
          className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} 
          onClick={() => setActiveTab('list')}
        >
          Active Surveys ({surveys.length})
        </button>
        {activeTab === 'create' && (
          <button className="tab-btn active">
            Design Survey
          </button>
        )}
        {activeTab === 'results' && (
          <button className="tab-btn active">Results Analysis</button>
        )}
      </div>

      {activeTab === 'list' && (
        <div className="flex flex-col gap-4">
          {surveys.length === 0 ? (
            <div className="card empty-state p-12 text-center flex flex-col items-center">
              <div className="empty-icon"><ClipboardList size={32} /></div>
              <h3>No Feedback Surveys Created</h3>
              <p className="mb-4">Click below to design and distribute your first feedback survey.</p>
              <button 
                type="button"
                onClick={() => setActiveTab('create')} 
                className="survey-create-cta-btn"
              >
                <Plus size={18} strokeWidth={2.5} /> Create First Survey
              </button>
            </div>
          ) : (
            surveys.map(survey => (
              <div key={survey.id} className="card survey-list-item p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h4 className="font-semibold text-lg">{survey.title}</h4>
                    <select
                      value={survey.targetAudience || 'all'}
                      onChange={(e) => handleAudienceChange(survey, e.target.value)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full border border-border bg-surface cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent"
                      title="Click to reassign audience target"
                    >
                      <option value="all">👥 All (Students & Alumni)</option>
                      <option value="student">🎒 Students Only</option>
                      <option value="alumni">🎓 Alumni Only</option>
                    </select>
                  </div>
                  <p className="text-xs text-secondary mt-1">
                    Published: {formatDate(survey.createdDate)} &bull; {survey.responses} Responses received
                    {survey.deadline && (
                      <>
                        {" "}&bull;{" "}
                        {new Date(survey.deadline) < new Date() ? (
                          <span className="text-danger font-semibold">Ended: {new Date(survey.deadline).toLocaleString()}</span>
                        ) : (
                          <span className="text-success font-semibold">Ends: {new Date(survey.deadline).toLocaleString()}</span>
                        )}
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleViewResults(survey)} 
                    className="btn btn-secondary btn-sm flex items-center gap-1"
                  >
                    <BarChart size={16} /> View Results
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSurvey(survey)}
                    className="btn btn-ghost btn-sm text-danger hover:bg-danger-light p-1.5 rounded-md"
                    title="Delete survey"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <form onSubmit={handlePublish} className="card p-8 flex flex-col gap-6">
          <h3 className="section-title">Design Feedback Survey</h3>

          <div className="input-group">
            <label htmlFor="surv-title">Survey Title *</label>
            <input type="text" id="surv-title" className="input" placeholder="e.g. 2026 Placement Preparation Review" value={title} onChange={e => setTitle(e.target.value)} required />
          </div>

          {/* Target Audience Selector */}
          <div className="survey-audience-section">
            <label className="survey-audience-label">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <p className="survey-audience-hint">Specify who should participate and see this feedback survey:</p>
            
            <div className="survey-audience-grid">
              {/* Option 1: All Students & Alumni */}
              <button 
                type="button"
                className={`survey-audience-card ${targetAudience === 'all' ? 'selected' : ''}`}
                onClick={() => setTargetAudience('all')}
              >
                <div className="survey-audience-icon-box">
                  <Users size={22} />
                </div>
                <div className="survey-audience-content">
                  <div className="survey-audience-title">
                    <span>All Community</span>
                    <div className="survey-audience-radio">
                      {targetAudience === 'all' && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                  <div className="survey-audience-desc">
                    Open to both enrolled students and graduated alumni across campus.
                  </div>
                </div>
              </button>

              {/* Option 2: Current Students Only */}
              <button 
                type="button"
                className={`survey-audience-card ${targetAudience === 'student' ? 'selected' : ''}`}
                onClick={() => setTargetAudience('student')}
              >
                <div className="survey-audience-icon-box">
                  <BookOpen size={22} />
                </div>
                <div className="survey-audience-content">
                  <div className="survey-audience-title">
                    <span>Current Students</span>
                    <div className="survey-audience-radio">
                      {targetAudience === 'student' && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                  <div className="survey-audience-desc">
                    Academics, labs, placement prep & on-campus student feedback.
                  </div>
                </div>
              </button>

              {/* Option 3: Graduated Alumni Only */}
              <button 
                type="button"
                className={`survey-audience-card ${targetAudience === 'alumni' ? 'selected' : ''}`}
                onClick={() => setTargetAudience('alumni')}
              >
                <div className="survey-audience-icon-box">
                  <GraduationCap size={22} />
                </div>
                <div className="survey-audience-content">
                  <div className="survey-audience-title">
                    <span>Graduated Alumni</span>
                    <div className="survey-audience-radio">
                      {targetAudience === 'alumni' && <Check size={12} strokeWidth={3} />}
                    </div>
                  </div>
                  <div className="survey-audience-desc">
                    Industry trends, mentorship, reunions & alumni relations.
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="surv-desc">Description</label>
            <textarea id="surv-desc" className="textarea" placeholder="Help candidates understand the objectives of this survey..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer mt-2">
            <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} />
            <span>Enable Anonymous Feedback</span>
          </label>

          <div className="input-group mt-2">
            <label htmlFor="surv-deadline">Deadline Date & Time</label>
            <input 
              type="datetime-local" 
              id="surv-deadline" 
              className="input" 
              value={deadline} 
              onChange={e => setDeadline(e.target.value)} 
            />
            <p className="text-xs text-secondary mt-1">Leave empty if the survey has no expiration deadline.</p>
          </div>

          <div className="questions-builder-list mt-6 pt-6 border-t border-light flex flex-col gap-6">
            <h4>Survey Questions</h4>
            {questions.map((q) => (
              <div key={q.id} className="question-builder-item p-4 bg-background border rounded flex flex-col gap-3 relative">
                <button type="button" onClick={() => handleRemoveQuestion(q.id)} className="btn btn-ghost text-danger p-1 absolute top-4 right-4" title="Delete Question">
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-2 gap-4">
                  <div className="input-group">
                    <label>Question Type</label>
                    <select className="select" value={q.type} onChange={e => handleQuestionChange(q.id, 'type', e.target.value)}>
                      <option value="mcq">Multiple Choice (MCQ)</option>
                      <option value="text">Open-Ended Text</option>
                      <option value="rating">Star Rating (1-5)</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Question Text *</label>
                    <input type="text" className="input" placeholder="Write question..." value={q.question} onChange={e => handleQuestionChange(q.id, 'question', e.target.value)} required />
                  </div>
                </div>

                {/* MCQ Options build */}
                {q.type === 'mcq' && (
                  <div className="mcq-options-builder mt-2">
                    <label className="text-xs font-semibold text-secondary">MCQ Options</label>
                    <div className="flex flex-col gap-2 mt-2">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className="flex gap-2 items-center">
                          <input type="text" className="input input-sm" value={opt} onChange={e => handleMcqOptionChange(q.id, optIdx, e.target.value)} required />
                          <button type="button" onClick={() => handleRemoveMcqOption(q.id, optIdx)} className="btn btn-ghost text-danger p-1" disabled={q.options.length <= 2}><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => handleAddMcqOption(q.id)} className="btn btn-secondary btn-sm mt-3">Add Option</button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-light">
            <button type="button" onClick={handleAddQuestion} className="btn btn-secondary">Add Another Question</button>
            <button type="submit" className="btn btn-primary">Publish Survey</button>
          </div>
        </form>
      )}

      {activeTab === 'results' && selectedSurveyForResults && (
        <div className="card p-8 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl">{selectedSurveyForResults.title}</h3>
              <p className="text-xs text-secondary mt-1">Analytics based on {selectedSurveyForResults.responses} responses logged.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleExportCsv(selectedSurveyForResults)} 
                className="btn btn-primary btn-sm flex items-center gap-1.5"
                title="Export survey responses to CSV"
              >
                <Download size={14} /> Export CSV
              </button>
              <button onClick={() => setActiveTab('list')} className="btn btn-secondary btn-sm">Back to List</button>
            </div>
          </div>

          {loadingResults ? (
            <div className="card p-12 text-center flex flex-col items-center justify-center h-full">
              <RefreshCw size={36} className="text-accent animate-spin" />
              <h3 className="font-bold text-lg mt-4">Loading survey responses...</h3>
              <p className="text-xs text-secondary mt-1">Retrieving direct database records from the MongoDB server.</p>
            </div>
          ) : (
            <div className="results-analytics-list mt-6 flex flex-col gap-8">
              {surveyAnalytics.map((analysis, index) => (
                <div key={index} className="analysis-card p-6 bg-background border rounded">
                  <h4 className="font-semibold text-sm mb-4">Q{index + 1}: {analysis.q.question}</h4>

                  {analysis.type === 'mcq' && (
                    <div className="mcq-charts-layout grid grid-2 gap-6 mt-4">
                      <div className="chart-wrapper flex flex-col items-center">
                        <h5 className="text-xs font-semibold text-secondary mb-2">Response Distribution (Bar Chart)</h5>
                        <div style={{ width: '100%', height: '220px' }}>
                          <ResponsiveContainer width="100%" height={220} minWidth={0} minHeight={0}>
                            <RechartsBarChart data={analysis.chartData} margin={{ top: 10, right: 15, left: -10, bottom: 4 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" opacity={0.6} />
                              <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={{ stroke: 'var(--border-light)' }} tickMargin={8} />
                              <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} tickMargin={8} width={36} allowDecimals={false} />
                              <Tooltip cursor={{ fill: 'rgba(78, 113, 93, 0.08)', radius: 6 }} contentStyle={{ background: 'var(--surface, #ffffff)', borderColor: 'var(--border, #e5e7eb)', borderRadius: 8, fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                              <Bar dataKey="count" name="Responses" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="chart-wrapper flex flex-col items-center">
                        <h5 className="text-xs font-semibold text-secondary mb-2">Percentage Share (Pie Chart)</h5>
                        <div style={{ width: '100%', height: '220px' }}>
                          <ResponsiveContainer width="100%" height={220} minWidth={0} minHeight={0}>
                            <PieChart>
                              <Pie
                                data={analysis.chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                outerRadius={70}
                                fill="#8884d8"
                                dataKey="count"
                              >
                                {analysis.chartData.map((_, idx) => (
                                  <Cell key={`cell-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
                              <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  )}

                  {analysis.type === 'rating' && (
                    <div className="rating-summary-content text-center py-4 flex flex-col items-center gap-2">
                      <span className="font-bold text-5xl text-accent">{analysis.average}</span>
                      <div className="flex gap-1 py-1">
                        {Array.from({ length: 5 }, (_, i) => i + 1).map(starVal => {
                          const avg = Number(analysis.average);
                          const isFull = avg >= starVal;
                          const isHalf = !isFull && avg > starVal - 1;
                          return (
                            <Star 
                              key={starVal} 
                              size={24} 
                              className={isFull || isHalf ? 'text-accent' : 'text-tertiary'}
                              fill={isFull ? 'var(--accent)' : isHalf ? 'url(#halfStar)' : 'transparent'} 
                            />
                          );
                        })}
                      </div>
                      <span className="text-secondary text-sm block mt-1">Average Star Rating (out of {analysis.count} responses)</span>
                    </div>
                  )}

                  {analysis.type === 'text' && (
                    <div className="text-responses-layout grid grid-2 gap-6 mt-4">
                      <div className="sentiment-card p-4 bg-surface-hover border rounded flex flex-col justify-center gap-4">
                        <h5 className="text-xs font-semibold text-secondary flex items-center gap-1.5">
                          <FileText size={14} className="text-accent" />
                          <span>AI Sentiment Scoring</span>
                        </h5>
                        {(() => {
                          const sentiment = analyzeSentiment(analysis.textResponses);
                          return (
                            <div className="flex flex-col gap-3">
                              <div className="sentiment-bar-wrapper">
                                <div className="flex justify-between text-xs font-semibold text-secondary mb-1">
                                  <span className="text-success">Positive</span>
                                  <span>{sentiment.positive}%</span>
                                </div>
                                <div className="w-full bg-light rounded-full h-2">
                                  <div className="bg-success h-2 rounded-full transition-all duration-500" style={{ width: `${sentiment.positive}%` }}></div>
                                </div>
                              </div>
                              <div className="sentiment-bar-wrapper">
                                <div className="flex justify-between text-xs font-semibold text-secondary mb-1">
                                  <span className="text-warning">Neutral</span>
                                  <span>{sentiment.neutral}%</span>
                                </div>
                                <div className="w-full bg-light rounded-full h-2">
                                  <div className="bg-warning h-2 rounded-full transition-all duration-500" style={{ width: `${sentiment.neutral}%` }}></div>
                                </div>
                              </div>
                              <div className="sentiment-bar-wrapper">
                                <div className="flex justify-between text-xs font-semibold text-secondary mb-1">
                                  <span className="text-danger">Negative</span>
                                  <span>{sentiment.negative}%</span>
                                </div>
                                <div className="w-full bg-light rounded-full h-2">
                                  <div className="bg-danger h-2 rounded-full transition-all duration-500" style={{ width: `${sentiment.negative}%` }}></div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="comments-wrapper flex flex-col">
                        <h5 className="text-xs font-semibold text-secondary mb-2">Comments Log ({analysis.textResponses.length})</h5>
                        <div className="text-responses-list max-height-200 overflow-y-auto flex flex-col gap-2 pr-1" style={{ maxHeight: '180px' }}>
                          {analysis.textResponses.length === 0 ? (
                            <p className="text-xs text-secondary italic">No open-ended comments received.</p>
                          ) : (
                            analysis.textResponses.map((res, idx) => (
                              <div key={idx} className="text-response-bubble p-3 bg-surface border rounded text-xs text-secondary leading-relaxed">
                                "{res}"
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
