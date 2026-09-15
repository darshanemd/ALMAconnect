import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Bell, FileText, Plus, Download, Trash2, Megaphone, Check, Search, Calendar, User, Eye, ExternalLink, X } from 'lucide-react';
import './CircularsPage.css';

function DocumentPreviewModal({ file, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!file || !file.attachmentUrl) return null;

  const fileName = file.attachmentName || 'Official Document';
  const url = file.attachmentUrl;

  const isImage = 
    url.startsWith('data:image/') || 
    /\.(jpe?g|png|webp|gif|svg)($|\?)/i.test(url) ||
    /\.(jpe?g|png|webp|gif|svg)$/i.test(fileName);

  // For PDFs, append toolbar and fit-width parameters so browser built-in PDF viewer
  // enables zoom buttons, page numbers, search, and fills the width nicely.
  const displayUrl = (!isImage && !url.includes('#'))
    ? `${url}#toolbar=1&navpanes=0&view=FitH`
    : url;

  return (
    <div className="modal-backdrop doc-preview-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal doc-preview-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="doc-preview-header">
          <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
            <div className="p-1.5 bg-accent/10 text-accent rounded-lg flex-shrink-0">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-primary truncate" title={fileName}>
                {fileName}
              </h3>
              {file.title && (
                <p className="text-xxs text-secondary truncate">
                  Circular: {file.title}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a 
              href={url} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-secondary btn-xs flex items-center gap-1.5 text-xs py-1 px-2.5"
              title="Open document in a new browser tab"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">Open in Tab</span>
            </a>
            <a 
              href={url} 
              download={fileName} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-primary btn-xs flex items-center gap-1.5 text-xs py-1 px-2.5"
              title="Download file"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-ghost p-1.5 rounded-lg text-secondary hover:text-primary hover:bg-surface-hover transition-colors"
              title="Close preview (Esc)"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="doc-preview-body">
          {isImage ? (
            <div className="doc-preview-img-container">
              <img 
                src={url} 
                alt={fileName} 
                className="doc-preview-img" 
              />
            </div>
          ) : (
            <iframe 
              src={displayUrl} 
              title={fileName} 
              className="doc-preview-iframe"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function CircularsPage() {
  const { user } = useAuth();
  const { 
    circulars, 
    addCircular, 
    deleteCircular, 
    markCircularsAsSeen,
    lastSeenCircularsTime,
    notifications,
    markNotificationAsRead
  } = useData();

  useEffect(() => {
    // Only mark seen if there are actually unseen circulars to avoid infinite updates
    const hasUnseen = (circulars || []).some(
      c => new Date(c.createdAt) > new Date(lastSeenCircularsTime)
    );
    if (hasUnseen) {
      markCircularsAsSeen();
    }

    // Mark corresponding circular/announcement notifications as read
    const unreadCircularNotifs = (notifications || []).filter(
      n => !n.read && (n.title.includes('Announcement') || n.content.includes('New Notice:'))
    );
    unreadCircularNotifs.forEach(n => {
      markNotificationAsRead(n.id);
    });
  }, [circulars, notifications, lastSeenCircularsTime, markCircularsAsSeen, markNotificationAsRead]);

  // Admin Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    targetAudience: 'All',
    attachmentName: '',
    attachmentUrl: '',
    postedBy: user?.name || 'College Admin'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Search & Filter State (For Students/Alumni)
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPdf, setSelectedPdf] = useState(null);

  // Filter circulars based on search and category
  const filteredCirculars = (circulars || []).filter(c => {
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.postedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreateCircular = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      await addCircular({
        ...formData,
        postedByCollegeId: user?.collegeId || ''
      });
      setSuccessMessage('Circular published successfully!');
      setFormData({
        title: '',
        content: '',
        category: 'General',
        targetAudience: 'All',
        attachmentName: '',
        attachmentUrl: '',
        postedBy: user?.name || 'College Admin'
      });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Failed to publish circular: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the circular "${title}"?`)) {
      try {
        await deleteCircular(id);
      } catch (err) {
        alert('Failed to delete circular: ' + err.message);
      }
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Academic': return 'category-academic';
      case 'Placements': return 'category-placements';
      case 'Exams': return 'category-exams';
      case 'Events': return 'category-events';
      default: return 'category-general';
    }
  };

  // ──── ADMIN VIEW ────
  if (user?.role === 'college_admin') {
    return (
      <div className="circulars-page stagger-children animate-fade-in">
        {/* Title Section */}
        <div className="page-header mb-6">
          <h2 className="font-bold text-2xl flex items-center gap-2">
            <Megaphone className="text-accent" size={24} />
            Manage Official Circulars & Notices
          </h2>
          <p className="text-secondary text-xs mt-1">
            Broadcast official notices, exam updates, and placement circulars to students and alumni.
          </p>
        </div>

        <div className="circulars-admin-grid">
          {/* Create Form */}
          <div className="card p-6 flex flex-col gap-4">
            <h3 className="section-title flex items-center gap-2">
              <Plus size={18} className="text-accent" /> Publish Official Notice
            </h3>

            {successMessage && (
              <div className="p-3 bg-accent-bg border border-accent-light rounded text-xs text-accent-dark font-medium flex items-center gap-2">
                <Check size={14} /> {successMessage}
              </div>
            )}

            <form onSubmit={handleCreateCircular} className="flex flex-col gap-3">
              <div className="input-group">
                <label htmlFor="circ-title">Notice Title *</label>
                <input 
                  id="circ-title" 
                  type="text" 
                  className="input text-xs" 
                  placeholder="e.g. End Semester Exam Registration Dates 2026"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required 
                />
              </div>

              <div className="grid grid-2 gap-3">
                <div className="input-group">
                  <label htmlFor="circ-cat">Category *</label>
                  <select 
                    id="circ-cat" 
                    className="select text-xs"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="General">General Notice</option>
                    <option value="Academic">Academic</option>
                    <option value="Placements">Placements</option>
                    <option value="Exams">Exams</option>
                    <option value="Events">Events</option>
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="circ-target">Target Audience *</label>
                  <select 
                    id="circ-target" 
                    className="select text-xs"
                    value={formData.targetAudience}
                    onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                  >
                    <option value="All">All Students & Alumni</option>
                    <option value="Students">Students Only</option>
                    <option value="Alumni">Alumni Only</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="circ-content">Notice Content / Description *</label>
                <textarea 
                  id="circ-content" 
                  className="textarea text-xs" 
                  rows="4"
                  placeholder="Draft the official contents of the notice here..."
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  required 
                />
              </div>

              <div className="input-group border-t border-dashed border-light pt-3 mt-1">
                <label className="font-semibold text-xs text-primary flex items-center gap-1.5 mb-1">
                  <FileText size={14} className="text-accent" /> Upload Document Attachment (PDF, DOCX, Image)
                </label>
                
                {formData.attachmentUrl ? (
                  <div className="flex items-center justify-between p-3 bg-surface border border-accent rounded-lg">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 bg-accent/10 text-accent rounded flex-shrink-0">
                        <FileText size={16} />
                      </div>
                      <span className="text-xs font-bold truncate text-primary">
                        {formData.attachmentName || 'Attached_Document.pdf'}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, attachmentName: '', attachmentUrl: '' })}
                      className="text-danger hover:underline text-xs font-bold"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div className="file-upload-zone p-4 border border-dashed border-light rounded-lg text-center bg-background hover:bg-surface transition-all duration-200">
                    <input 
                      id="circ-file-upload" 
                      type="file" 
                      accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                      className="hidden-file-input"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        if (file.size > 20 * 1024 * 1024) {
                          alert('File size exceeds the 20MB limit.');
                          return;
                        }

                        try {
                          const data = new FormData();
                          data.append('file', file);
                          const res = await fetch('/api/upload', {
                            method: 'POST',
                            body: data
                          });
                          if (res.ok) {
                            const result = await res.json();
                            setFormData(prev => ({
                              ...prev,
                              attachmentName: file.name,
                              attachmentUrl: result.url
                            }));
                            return;
                          }
                        } catch {
                          // Fallback to base64
                        }

                        const reader = new FileReader();
                        reader.onload = () => {
                          setFormData(prev => ({
                            ...prev,
                            attachmentName: file.name,
                            attachmentUrl: reader.result
                          }));
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <label htmlFor="circ-file-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                      <Plus size={20} className="text-accent" />
                      <span className="text-xs font-semibold text-primary">Choose file to upload</span>
                      <span className="text-xxs text-secondary">PDF, DOCX, or Image (Max 20MB)</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="circ-by">Posted By Signature *</label>
                <input 
                  id="circ-by" 
                  type="text" 
                  className="input text-xs" 
                  value={formData.postedBy}
                  onChange={e => setFormData({ ...formData, postedBy: e.target.value })}
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full mt-2 flex items-center justify-center gap-2 font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Publishing...' : <><Megaphone size={16} /> Publish Announcement</>}
              </button>
            </form>
          </div>

          {/* List of Published Notices */}
          <div className="card p-6 flex flex-col gap-4">
            <h3 className="section-title">Active Announcements ({filteredCirculars.length})</h3>
            <div className="admin-circulars-list">
              {filteredCirculars.length === 0 ? (
                <p className="text-secondary text-xs italic">No circulars published yet.</p>
              ) : (
                filteredCirculars.map(c => (
                  <div key={c.id} className="admin-circular-item p-4 border rounded bg-background flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex flex-col gap-1">
                        <span className={`tag-category ${getCategoryColor(c.category)}`}>{c.category}</span>
                        <span className="text-xxs text-secondary">Target: {c.targetAudience}</span>
                      </div>
                      <button 
                        onClick={() => handleDelete(c.id, c.title)}
                        className="btn btn-ghost p-1.5 text-danger border border-danger-light hover:bg-danger-bg rounded"
                        title="Delete Announcement"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-primary">{c.title}</h4>
                      <p className="text-xs text-secondary mt-1.5 line-clamp-2">{c.content}</p>
                    </div>

                    {/* Attached Document in Admin List */}
                    {c.attachmentUrl && (
                      <div className="flex items-center justify-between p-2 bg-surface border border-light rounded text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <FileText size={14} className="text-accent flex-shrink-0" />
                          <span className="font-semibold truncate text-[11px] text-primary">{c.attachmentName || 'Attached_Document.pdf'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button 
                            type="button" 
                            onClick={() => setSelectedPdf(c)} 
                            className="btn btn-secondary btn-xs text-[10px] py-0.5 px-2"
                          >
                            <Eye size={10} className="mr-1" /> View
                          </button>
                          <a 
                            href={c.attachmentUrl} 
                            download={c.attachmentName || 'document.pdf'} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="btn btn-primary btn-xs text-[10px] py-0.5 px-2 flex items-center gap-1"
                          >
                            <Download size={10} /> Download
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xxs text-secondary border-t border-light pt-2">
                      <span className="flex items-center gap-1"><User size={10} /> {c.postedBy}</span>
                      <span className="flex items-center gap-1"><Calendar size={10} /> {new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* PDF Document Preview Modal for Admin */}
        {selectedPdf && (
          <DocumentPreviewModal 
            file={selectedPdf} 
            onClose={() => setSelectedPdf(null)} 
          />
        )}
      </div>
    );
  }

  // ──── STUDENT / ALUMNI VIEW ────
  return (
    <div className="circulars-page stagger-children animate-fade-in max-w-6xl mx-auto">
      {/* Title Section */}
      <div className="page-header mb-6">
        <h2 className="font-bold text-2xl flex items-center gap-2">
          <Bell className="text-accent" size={24} />
          Official Bulletin & Circulars
        </h2>
        <p className="text-secondary text-xs mt-1">
          Stay updated with direct announcements and academic/placement circulars from college administration.
        </p>
      </div>

      {/* Search & Categories filter */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
        <div className="search-box flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
          <input 
            type="text" 
            className="input text-xs pl-9 w-full"
            placeholder="Search circulars by title, keyword, or author..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'General', 'Academic', 'Placement', 'Event', 'Urgent'].map(cat => (
            <button
              key={cat}
              className={`btn btn-xs ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'} whitespace-nowrap`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Circular Cards */}
      <div className="grid grid-3 gap-6">
        {filteredCirculars.length === 0 ? (
          <div className="card p-12 text-center grid-span-3">
            <h3 className="font-bold">No Announcements Found</h3>
            <p className="text-secondary text-xs mt-2">
              There are no circulars matching your search or category filter. Check back later!
            </p>
          </div>
        ) : (
          filteredCirculars.map(c => (
            <div key={c.id} className="card circular-card p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <span className={`tag-category ${getCategoryColor(c.category)}`}>
                  {c.category}
                </span>
                <span className="text-secondary text-xxs font-semibold flex items-center gap-1">
                  <Calendar size={10} /> {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-base text-primary leading-snug">{c.title}</h3>
                <p className="text-xs text-secondary mt-3 leading-relaxed whitespace-pre-line">
                  {c.content}
                </p>
              </div>

              {/* PDF Preview & Download Attachment box */}
              {c.attachmentUrl && (
                <div className="attachment-box flex items-center justify-between p-3 bg-surface border border-light rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={16} className="text-accent flex-shrink-0" />
                    <span className="text-xxs font-bold truncate text-primary" title={c.attachmentName}>
                      {c.attachmentName || 'Official Document'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedPdf(c)}
                      className="btn btn-secondary btn-xs text-xxs"
                    >
                      <Eye size={12} className="mr-1" /> Preview
                    </button>
                    <a 
                      href={c.attachmentUrl} 
                      download={c.attachmentName || 'document'}
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-primary btn-xs flex items-center gap-1 px-2.5 py-1 text-xxs"
                    >
                      <Download size={12} />
                    </a>
                  </div>
                </div>
              )}

              <div className="border-t border-light pt-3 flex justify-between items-center text-xxs text-secondary">
                <span className="flex items-center gap-1">
                  <User size={10} /> Posted by: <strong>{c.postedBy}</strong>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PDF Document Preview Modal */}
      {selectedPdf && (
        <DocumentPreviewModal 
          file={selectedPdf} 
          onClose={() => setSelectedPdf(null)} 
        />
      )}
    </div>
  );
}
