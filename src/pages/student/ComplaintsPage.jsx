import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, Send, ThumbsUp, Clock, CheckCircle2, XCircle,
  AlertCircle, MessageSquareWarning, Filter, RefreshCw, Plus,
  ChevronDown, ChevronUp, MessagesSquare, Building2, ImagePlus, X, ZoomIn
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../utils/api';
import './ComplaintsPage.css';

const CATEGORIES = ['Academic', 'Infrastructure', 'Faculty', 'Administration', 'Hostel', 'Canteen', 'Other'];
const MAX_DESC = 1000;

// Persistent anonymous session token (never tied to identity in the UI)
function getSessionToken() {
  let token = sessionStorage.getItem('anon_complaint_token');
  if (!token) {
    token = 'anon-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem('anon_complaint_token', token);
  }
  return token;
}

function StatusBadge({ status }) {
  const map = {
    open: { label: 'Open', icon: AlertCircle },
    under_review: { label: 'Under Review', icon: Clock },
    resolved: { label: 'Resolved', icon: CheckCircle2 },
    closed: { label: 'Closed', icon: XCircle }
  };
  const { label, icon: Icon } = map[status] || map.open;
  return (
    <span className={`status-badge ${status}`}>
      <Icon size={11} /> {label}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function ComplaintCard({ complaint, onUpvote }) {
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const sessionToken = getSessionToken();
  // Track upvote state locally (optimistic)
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(complaint.upvoteCount || 0);
  const isLong = complaint.description.length > 200;

  const handleUpvote = async () => {
    const prev = upvoted;
    const prevCount = count;
    setUpvoted(!prev);
    setCount(prev ? count - 1 : count + 1);
    try {
      const res = await apiRequest(`/complaints/${complaint.id}/upvote`, 'POST', { sessionToken });
      setCount(res.upvoteCount);
      setUpvoted(res.upvoted);
    } catch {
      setUpvoted(prev);
      setCount(prevCount);
    }
  };

  return (
    <div className="complaint-card">
      <div className="complaint-card-header">
        <div>
          <div className="complaint-card-meta">
            <span className="category-chip">{complaint.category}</span>
            <StatusBadge status={complaint.status} />
          </div>
          <h4 className="complaint-card-title">{complaint.title}</h4>
        </div>
      </div>

      <p className={`complaint-card-desc ${isLong && !expanded ? 'clamped' : ''}`}>
        {complaint.description}
      </p>
      {isLong && (
        <button
          className="btn btn-ghost btn-sm flex items-center gap-1"
          style={{ padding: '2px 6px', fontSize: '12px', marginBottom: 'var(--space-2)' }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Read more</>}
        </button>
      )}

      {complaint.adminResponse && (
        <div className="admin-response-block">
          <div className="admin-response-label">
            <Building2 size={12} /> College Response
          </div>
          <p className="admin-response-text">{complaint.adminResponse}</p>
        </div>
      )}

      {complaint.proofImage && (
        <div className="proof-image-wrap">
          <button className="proof-thumb-btn" onClick={() => setLightbox(true)} title="View proof image">
            <img src={complaint.proofImage} alt="Proof" className="proof-thumb" />
            <div className="proof-thumb-overlay"><ZoomIn size={18} /></div>
          </button>
          <span className="proof-label"><ImagePlus size={12} /> Proof attached</span>
        </div>
      )}

      {lightbox && (
        <div className="lightbox-backdrop" onClick={() => setLightbox(false)}>
          <div className="lightbox-box" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(false)}><X size={20} /></button>
            <img src={complaint.proofImage} alt="Proof" className="lightbox-img" />
          </div>
        </div>
      )}

      <div className="complaint-card-footer">
        <span className="complaint-date">
          <Clock size={12} /> {formatDate(complaint.submittedAt)}
        </span>
        <button
          id={`upvote-${complaint.id}`}
          className={`upvote-btn ${upvoted ? 'upvoted' : ''}`}
          onClick={handleUpvote}
        >
          <ThumbsUp size={13} /> {count} {count === 1 ? 'Support' : 'Supports'}
        </button>
      </div>
    </div>
  );
}

export default function ComplaintsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submit');
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [form, setForm] = useState({ title: '', category: '', description: '' });
  const [proofImage, setProofImage] = useState(null);   // base64 data URL
  const [imageError, setImageError] = useState('');

  const [mySubmissions, setMySubmissions] = useState([]);
  const [loadingMine, setLoadingMine] = useState(false);

  const userCollegeId = user?.collegeId;
  const userId = user?.id;

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (userCollegeId) params.append('collegeId', userCollegeId);
      if (filterStatus) params.append('status', filterStatus);
      if (filterCategory) params.append('category', filterCategory);
      params.append('excludeMisconduct', 'true');
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const data = await apiRequest(`/complaints${queryStr}`);
      setComplaints(data || []);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  }, [userCollegeId, filterStatus, filterCategory]);

  const loadMySubmissions = useCallback(async () => {
    if (!userId) return;
    setLoadingMine(true);
    try {
      const data = await apiRequest(`/complaints?submitterMemberId=${userId}`);
      setMySubmissions(data || []);
    } catch (err) {
      console.error('Failed to load my submissions:', err);
    } finally {
      setLoadingMine(false);
    }
  }, [userId]);

  useEffect(() => {
    if (activeTab === 'board') loadComplaints();
    if (activeTab === 'mine') loadMySubmissions();
  }, [activeTab, loadComplaints, loadMySubmissions]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setImageError('');
    if (!file) { setProofImage(null); return; }
    if (!file.type.startsWith('image/')) {
      setImageError('Only image files are allowed (JPG, PNG, GIF, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image must be smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setProofImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setProofImage(null);
    setImageError('');
    // reset the hidden file input
    const inp = document.getElementById('proof-image-input');
    if (inp) inp.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.category || !form.description.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.description.length > MAX_DESC) {
      setError(`Description must be under ${MAX_DESC} characters.`);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await apiRequest('/complaints', 'POST', {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        submitterMemberId: user.id,
        ...(proofImage ? { proofImage } : {})
      });
      setSubmitted(true);
      setForm({ title: '', category: '', description: '' });
      setProofImage(null);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewComplaint = () => {
    setSubmitted(false);
    setActiveTab('submit');
  };

  const descLen = form.description.length;
  const charClass = descLen > MAX_DESC ? 'danger' : descLen > MAX_DESC * 0.85 ? 'warn' : '';

  return (
    <div className="complaints-page stagger-children">
      {/* Hero Banner */}
      <div className="complaints-hero">
        <div className="complaints-hero-inner">
          <div className="complaints-hero-text">
            <h2>Anonymous Complaints</h2>
            <p>
              Raise concerns about academics, faculty, infrastructure, or administration. Your identity is
              fully protected — only the complaint content is shared with college authorities.
            </p>
          </div>
          <div className="shield-badge">
            <div className="shield-icon-wrap">
              <ShieldCheck size={34} />
            </div>
            <span>Identity<br />Protected</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="complaints-tabs">
        <button
          id="tab-submit"
          className={`tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
          onClick={() => setActiveTab('submit')}
        >
          <Plus size={15} /> Submit Complaint
        </button>
        <button
          id="tab-board"
          className={`tab-btn ${activeTab === 'board' ? 'active' : ''}`}
          onClick={() => setActiveTab('board')}
        >
          <MessagesSquare size={15} /> Community Board
          {complaints.length > 0 && (
            <span className="tab-count">{complaints.length}</span>
          )}
        </button>
        <button
          id="tab-mine"
          className={`tab-btn ${activeTab === 'mine' ? 'active' : ''}`}
          onClick={() => setActiveTab('mine')}
        >
          <ShieldCheck size={15} /> My Submissions & Reports
          {mySubmissions.length > 0 && (
            <span className="tab-count">{mySubmissions.length}</span>
          )}
        </button>
      </div>

      {/* Submit Tab */}
      {activeTab === 'submit' && (
        <div className="complaint-form-card">
          {submitted ? (
            <div className="submit-success">
              <div className="success-ring">
                <CheckCircle2 size={36} />
              </div>
              <h3>Complaint Submitted!</h3>
              <p>
                Your complaint has been received anonymously. The college administration will review it
                and respond. You can track it on the Community Board.
              </p>
              <div className="flex gap-3">
                <button className="btn btn-primary" onClick={() => { setActiveTab('board'); loadComplaints(); }}>
                  View Community Board
                </button>
                <button className="btn btn-secondary" onClick={handleNewComplaint}>
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3>Submit a Complaint</h3>
              <p className="form-subtitle">All submissions are anonymous. Your name and details will never be shared.</p>

              <div className="anon-notice">
                <ShieldCheck size={22} />
                <p>
                  <strong>100% Anonymous.</strong> Your student ID is only used to verify you are enrolled at this college. It is
                  never stored with your complaint or shared with administrators.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="complaint-category">Category *</label>
                    <select
                      id="complaint-category"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a category…</option>
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="complaint-title">Title *</label>
                    <input
                      id="complaint-title"
                      name="title"
                      type="text"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Brief summary of the issue"
                      maxLength={120}
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="complaint-desc">Description *</label>
                    <textarea
                      id="complaint-desc"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe the issue in detail. Include relevant dates, locations, or specific examples…"
                      required
                    />
                    <span className={`char-count ${charClass}`}>{descLen}/{MAX_DESC}</span>
                  </div>

                  {/* Proof Image Upload (Optional) */}
                  <div className="form-group full-width">
                    <label>Proof Image <span style={{ fontWeight: 400, color: 'var(--text-tertiary)' }}>(optional, max 5 MB)</span></label>
                    {proofImage ? (
                      <div className="image-preview-wrap">
                        <img src={proofImage} alt="Proof preview" className="image-preview" />
                        <button type="button" className="remove-image-btn" onClick={removeImage}>
                          <X size={14} /> Remove
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="proof-image-input" className="image-upload-area">
                        <ImagePlus size={28} />
                        <span>Click to upload an image</span>
                        <span className="upload-hint">JPG, PNG, GIF, WebP — max 5 MB</span>
                        <input
                          id="proof-image-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                    )}
                    {imageError && (
                      <span style={{ fontSize: 'var(--font-xs)', color: 'var(--danger)', marginTop: '4px' }}>{imageError}</span>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger mt-4" style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)' }}>
                    {error}
                  </div>
                )}

                <div className="form-actions">
                  <button
                    id="submit-complaint-btn"
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Submitting…</>
                    ) : (
                      <><Send size={15} /> Submit Anonymously</>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}

      {/* Community Board Tab */}
      {activeTab === 'board' && (
        <div className="flex flex-col gap-4">
          {/* Filter bar */}
          <div className="card p-4 flex items-center gap-4 flex-wrap" style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <div className="filter-bar">
              <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
              <select
                id="filter-status"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select
                id="filter-category"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button
              id="refresh-complaints-btn"
              className="btn btn-secondary btn-sm flex items-center gap-1"
              onClick={loadComplaints}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="complaints-loading"><div className="spinner" /></div>
          ) : complaints.length === 0 ? (
            <div className="empty-complaints">
              <MessageSquareWarning size={56} />
              <h4>No Complaints Yet</h4>
              <p>Be the first to raise a concern. All submissions are fully anonymous.</p>
              <button className="btn btn-primary" onClick={() => setActiveTab('submit')}>
                Submit a Complaint
              </button>
            </div>
          ) : (
            <div className="complaints-list">
              {complaints.map(c => (
                <ComplaintCard key={c.id} complaint={c} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* My Submissions & Reports Tab */}
      {activeTab === 'mine' && (
        <div className="flex flex-col gap-4">
          <div className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-accent" />
              <span className="font-semibold text-sm text-primary">Your Filed Complaints & User Reports</span>
            </div>
            <button
              className="btn btn-secondary btn-sm flex items-center gap-1"
              onClick={loadMySubmissions}
            >
              <RefreshCw size={13} /> Refresh Status
            </button>
          </div>

          {loadingMine ? (
            <div className="complaints-loading"><div className="spinner" /></div>
          ) : mySubmissions.length === 0 ? (
            <div className="empty-complaints">
              <ShieldCheck size={56} className="text-secondary" />
              <h4>No Submissions Yet</h4>
              <p>You haven't submitted any complaints or user misconduct reports.</p>
              <button className="btn btn-primary" onClick={() => setActiveTab('submit')}>
                Submit a Complaint
              </button>
            </div>
          ) : (
            <div className="complaints-list">
              {mySubmissions.map(item => (
                <div key={item.id} className="complaint-card border border-light p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {item.category === 'misconduct' ? (
                        <span className="category-chip bg-red-100 text-red-700 font-bold border border-red-300">🚨 Misconduct Report</span>
                      ) : (
                        <span className="category-chip">{item.category}</span>
                      )}
                      <StatusBadge status={item.status} />
                    </div>
                    <span className="complaint-date text-xs text-secondary">
                      <Clock size={12} className="inline mr-1" />
                      {formatDate(item.submittedAt)}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-primary mb-2">{item.title}</h4>
                  <p className="text-sm text-secondary mb-3 whitespace-pre-line">{item.description}</p>

                  {/* Proof Image Attachment */}
                  {item.proofImage && (
                    <div className="proof-image-wrap mb-3">
                      <img src={item.proofImage} alt="Submitted Proof" className="proof-thumb" />
                      <span className="proof-label text-xs text-secondary"><ImagePlus size={12} /> Attached Evidence Screenshot</span>
                    </div>
                  )}

                  {/* Official Admin Response Outcome */}
                  {item.adminResponse ? (
                    <div className="admin-response-block p-3 bg-blue-50 border border-blue-200 rounded-lg mt-2">
                      <div className="admin-response-label font-bold text-xs text-blue-800 flex items-center gap-1.5 mb-1">
                        <Building2 size={14} /> College Administration Official Response & Result:
                      </div>
                      <p className="admin-response-text text-xs text-blue-900 font-medium whitespace-pre-line">{item.adminResponse}</p>
                      {item.respondedAt && (
                        <span className="text-[10px] text-blue-600 block mt-1">
                          Responded on: {new Date(item.respondedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-secondary italic bg-gray-50 p-2.5 rounded border border-dashed mt-2 flex items-center gap-1.5">
                      <Clock size={14} className="text-amber-500" />
                      <span>Pending College Administration review and response.</span>
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
