import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, MessageSquareWarning, AlertCircle, Clock, CheckCircle2,
  XCircle, ThumbsUp, RefreshCw, Filter, Send, Building2, ChevronDown, ChevronUp, ImagePlus, ZoomIn, X
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest } from '../../utils/api';
import './ComplaintsAdminPage.css';

const CATEGORIES = [
  { value: 'misconduct', label: '🚨 User Misconduct & Abuse' },
  { value: 'Academic', label: 'Academic' },
  { value: 'Infrastructure', label: 'Infrastructure' },
  { value: 'Faculty', label: 'Faculty' },
  { value: 'Administration', label: 'Administration' },
  { value: 'Hostel', label: 'Hostel' },
  { value: 'Canteen', label: 'Canteen' },
  { value: 'Other', label: 'Other' }
];
const STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' }
];

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
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function AdminComplaintCard({ complaint, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [responseText, setResponseText] = useState(complaint.adminResponse || '');
  const [selectedStatus, setSelectedStatus] = useState(complaint.status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const updated = await apiRequest(`/complaints/${complaint.id}/status`, 'PATCH', {
        status: selectedStatus,
        adminResponse: responseText
      });
      onUpdate(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to update complaint:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-complaint-card">
      <div className="admin-card-top">
        <div className="admin-card-header">
          <div style={{ flex: 1 }}>
            <div className="admin-card-badges">
              {complaint.category === 'misconduct' ? (
                <span className="category-chip category-misconduct">🚨 Misconduct Report</span>
              ) : (
                <span className="category-chip">{complaint.category}</span>
              )}
              <StatusBadge status={complaint.status} />
            </div>
            <h4 className="admin-card-title">{complaint.title}</h4>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ flexShrink: 0 }}
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <p className={`admin-card-desc ${!expanded ? 'clamped' : ''}`}
           style={!expanded ? { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } : {}}
        >
          {complaint.description}
        </p>

        <div className="admin-card-meta">
          <span className="admin-meta-item">
            <Clock size={12} /> Submitted: {formatDate(complaint.submittedAt)}
          </span>
          <span className="admin-meta-item">
            <ThumbsUp size={12} /> {complaint.upvoteCount || 0} supports
          </span>
          {complaint.resolvedAt && (
            <span className="admin-meta-item">
              <CheckCircle2 size={12} /> Resolved: {formatDate(complaint.resolvedAt)}
            </span>
          )}
        </div>
      </div>

      {complaint.proofImage && (
        <div style={{ padding: '0 var(--space-6) var(--space-4)' }}>
          <div className="proof-image-wrap">
            <button className="proof-thumb-btn" onClick={() => setLightbox(true)} title="View proof image">
              <img src={complaint.proofImage} alt="Proof" className="proof-thumb" />
              <div className="proof-thumb-overlay"><ZoomIn size={18} /></div>
            </button>
            <span className="proof-label"><ImagePlus size={12} /> Proof image attached by student</span>
          </div>
          {lightbox && (
            <div className="lightbox-backdrop" onClick={() => setLightbox(false)}>
              <div className="lightbox-box" onClick={e => e.stopPropagation()}>
                <button className="lightbox-close" onClick={() => setLightbox(false)}><X size={20} /></button>
                <img src={complaint.proofImage} alt="Proof" className="lightbox-img" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Response panel (always visible for admin) */}
      <div className="admin-response-panel">
        <h5>Manage Complaint</h5>

        {complaint.adminResponse && !expanded && (
          <div className="existing-response">
            <div className="existing-response-label">Current Response</div>
            <p className="existing-response-text">{complaint.adminResponse}</p>
          </div>
        )}

        {expanded && (
          <div className="response-form">
            <textarea
              id={`response-${complaint.id}`}
              placeholder="Type your official response to this complaint… (optional)"
              value={responseText}
              onChange={e => setResponseText(e.target.value)}
            />
            <div className="response-form-actions">
              <select
                id={`status-${complaint.id}`}
                className="status-select"
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
              >
                {STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <button
                className={`btn ${saved ? 'btn-success' : 'btn-primary'} btn-sm flex items-center gap-2`}
                style={saved ? { background: 'var(--success)', color: 'white' } : {}}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</>
                ) : saved ? (
                  <><CheckCircle2 size={13} /> Saved!</>
                ) : (
                  <><Send size={13} /> Save Response</>
                )}
              </button>
            </div>
          </div>
        )}

        {!expanded && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setExpanded(true)}
          >
            {complaint.adminResponse ? 'Edit Response' : 'Respond & Update Status'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function ComplaintsAdminPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const loadComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (user?.collegeId) params.append('collegeId', user.collegeId);
      if (filterStatus) params.append('status', filterStatus);
      if (filterCategory) params.append('category', filterCategory);
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const data = await apiRequest(`/complaints${queryStr}`);
      setComplaints(data || []);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.collegeId, filterStatus, filterCategory]);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  const handleUpdate = (updated) => {
    setComplaints(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  // Compute stats
  const total = complaints.length;
  const open = complaints.filter(c => c.status === 'open').length;
  const underReview = complaints.filter(c => c.status === 'under_review').length;
  const resolved = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;

  const statCards = [
    { label: 'Total Complaints', value: total, color: 'var(--info-bg)', iconColor: 'var(--info)', icon: MessageSquareWarning },
    { label: 'Open', value: open, color: 'rgba(96, 165, 250, 0.15)', iconColor: 'var(--info)', icon: AlertCircle },
    { label: 'Under Review', value: underReview, color: 'var(--warning-bg)', iconColor: 'var(--warning)', icon: Clock },
    { label: 'Resolved / Closed', value: resolved, color: 'var(--success-bg)', iconColor: 'var(--success)', icon: CheckCircle2 }
  ];

  return (
    <div className="complaints-admin-page stagger-children">
      {/* Anonymity Guarantee Banner */}
      <div className="anon-guarantee">
        <ShieldCheck size={24} />
        <p>
          <strong>Submitter identities are fully protected.</strong> Student identities are never accessible through this
          interface. You can only see the complaint content, category, and support count.
        </p>
      </div>

      {/* Stats Strip */}
      <div className="admin-stats-strip">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className="admin-stat-card" key={i}>
              <div className="admin-stat-icon" style={{ background: s.color, color: s.iconColor }}>
                <Icon size={22} />
              </div>
              <div>
                <div className="admin-stat-value">{s.value}</div>
                <div className="admin-stat-label">{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Panel Header */}
      <div className="card p-4">
        <div className="admin-panel-header">
          <h3 className="section-title mb-0">Complaints & User Misconduct Reports</h3>
          <div className="admin-filter-bar">
            <Filter size={15} style={{ color: 'var(--text-secondary)' }} />
            <select
              id="admin-filter-status"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <select
              id="admin-filter-category"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <button
              id="admin-refresh-btn"
              className="btn btn-secondary btn-sm flex items-center gap-1"
              onClick={loadComplaints}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="admin-loading"><div className="spinner" /></div>
      ) : complaints.length === 0 ? (
        <div className="admin-empty">
          <MessageSquareWarning size={60} />
          <h4>No Complaints Found</h4>
          <p>No student complaints match the current filters. Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {complaints.map(c => (
            <AdminComplaintCard key={c.id} complaint={c} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
