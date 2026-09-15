import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  Calendar, Clock, MapPin, Users, Heart, Sparkles, Check, Plus, Ticket, X, 
  MessageSquare, Send, Lightbulb, Server, Mic, Code, GraduationCap, Upload, 
  ClipboardCheck, Trophy, FileText, FileDown, ArrowDown, ArrowRight, ExternalLink, 
  Search, Filter, Music, PartyPopper, Shirt, Printer, Copy, CheckCircle2, Trash2,
  FileSpreadsheet, Loader2, AlertCircle
} from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/formatters';
import QRCode from 'react-qr-code';

// Modular Events UI Components
import EventCreationModal from '../../components/events/EventCreationModal';
import { CAMPUS_EVENT_CATEGORIES, CATEGORY_DEFAULT_POSTERS } from '../../constants/eventConstants';
import DynamicRegistrationModal from '../../components/events/DynamicRegistrationModal';
import DigitalGatePassModal from '../../components/events/DigitalGatePassModal';
import AttendeeRosterModal from '../../components/events/AttendeeRosterModal';

import './EventsPage.css';

export default function EventsPage() {
  const { user } = useAuth();
  const { 
    getEvents, addEvent, rsvpEvent, registerForEvent, eventComments, addEventComment, 
    uploadProblemStatement, events, getTeams, createTeam, joinTeam, leaveTeam, alumni 
  } = useData();

  const [activeTab, setActiveTab] = useState('upcoming');
  const [modalOpen, setModalOpen] = useState(false);
  const [gatePassModalOpen, setGatePassModalOpen] = useState(false);
  const [selectedEventForTicket, setSelectedEventForTicket] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Registration & Attendee Roster Modal states
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [selectedEventForRegistration, setSelectedEventForRegistration] = useState(null);
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [selectedEventForRoster, setSelectedEventForRoster] = useState(null);

  // Hackathon Workflow states
  const hackathonEvents = useMemo(() => {
    return (events || []).filter(e => e.type === 'hackathon' || e.registrationMode === 'hackathon');
  }, [events]);

  const [selectedHackathonId, setSelectedHackathonId] = useState('');
  useEffect(() => {
    if (hackathonEvents.length > 0 && !selectedHackathonId) {
      setSelectedHackathonId(hackathonEvents[0].id);
    }
  }, [hackathonEvents, selectedHackathonId]);

  const activeHackathon = useMemo(() => {
    return hackathonEvents.find(e => e.id === selectedHackathonId) || hackathonEvents[0];
  }, [hackathonEvents, selectedHackathonId]);

  // Admin permission check for Hackathon & Problem Statement management
  const isAdmin = user?.role === 'admin' || user?.role === 'college_admin' || user?.role === 'college' || (activeHackathon && activeHackathon.organizer === user?.name);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const pdfInputRef = useRef(null);

  // Handle PDF Upload / Replace for Active Hackathon
  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Please upload a valid PDF document (.pdf)');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert('File is too large. Please select a PDF smaller than 20MB.');
      return;
    }

    if (!activeHackathon?.id) {
      alert('No active hackathon selected.');
      return;
    }

    try {
      setUploadingPdf(true);
      let finalFileUrl = null;

      // 1. Try uploading file to server static uploads directory
      try {
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok) {
          const data = await uploadRes.json();
          if (data.url) {
            finalFileUrl = data.url;
          }
        }
      } catch (uploadErr) {
        console.warn('Backend /api/upload failed, falling back to base64 Data URL:', uploadErr);
      }

      // 2. Fallback to base64 data URL if static upload endpoint was unavailable
      if (!finalFileUrl) {
        finalFileUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
      }

      await uploadProblemStatement(activeHackathon.id, file.name, finalFileUrl);
    } catch (err) {
      console.error('Failed to upload problem statement PDF:', err);
      alert('Failed to upload PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingPdf(false);
      if (pdfInputRef.current) {
        pdfInputRef.current.value = '';
      }
    }
  };

  // Handle Delete PDF so admin can remove or add another one
  const handleDeletePdf = async () => {
    if (!activeHackathon?.id) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${activeHackathon.problemStatementName || 'this problem statement PDF'}"?\n\nParticipants will not be able to download it until you upload a new PDF.`
    );
    if (!confirmDelete) return;

    try {
      setUploadingPdf(true);
      await uploadProblemStatement(activeHackathon.id, null, null);
    } catch (err) {
      console.error('Failed to delete problem statement PDF:', err);
      alert('Failed to delete PDF: ' + (err.message || 'Unknown error'));
    } finally {
      setUploadingPdf(false);
    }
  };

  // Handle Download PDF for all users
  const handleDownloadPdf = () => {
    if (!activeHackathon?.problemStatementUrl) {
      alert('No problem statement PDF is currently available to download.');
      return;
    }

    const url = activeHackathon.problemStatementUrl;
    const fileName = activeHackathon.problemStatementName || `${(activeHackathon.title || 'hackathon').replace(/\s+/g, '_')}_problem_statement.pdf`;

    if (url.startsWith('data:') || url.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (url.includes('example.com')) {
      // Mock seed fallback: generate a valid PDF blob so download succeeds without hitting broken external link
      const samplePdfContent = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>/Contents 4 0 R>>endobj\n4 0 obj<</Length 260>>stream\nBT\n/F1 18 Tf\n50 720 Td\n(${activeHackathon.title || 'Campus Hackathon 2026'}) Tj\n0 -35 Td\n/F1 12 Tf\n(Official Problem Statement & Hackathon Track Guidelines) Tj\n0 -25 Td\n(Track 1: AI-Powered Smart Campus Infrastructure & Automation) Tj\n0 -20 Td\n(Track 2: Autonomous Energy Conservation & Carbon Footprint Tracking) Tj\n0 -20 Td\n(Track 3: Decentralized Alumni Networking & Verification Ledger) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000216 00000 n\ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n520\n%%EOF`;
      const blob = new Blob([samplePdfContent], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } else {
      // Direct file path (/uploads/...) or external URL
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCreateEvent = async (eventData) => {
    await addEvent({
      ...eventData,
      organizer: user?.name || 'College Admin'
    });
    setModalOpen(false);
  };

  const handleOpenRegistration = (event) => {
    const isPast = activeTab === 'past' || (event.date && new Date(event.date) < new Date());
    if (isPast) {
      alert('Registration for this event is closed because the event has already concluded.');
      return;
    }

    if (event.registrationMode === 'external_link' && event.externalUrl) {
      window.open(event.externalUrl, '_blank');
      return;
    }
    
    setSelectedEventForRegistration(event);
    setRegistrationModalOpen(true);
  };

  const handleRegisterParticipant = async (eventId, regData) => {
    if (registerForEvent) {
      await registerForEvent(eventId, regData);
    } else {
      await rsvpEvent(eventId, user?.id);
    }
  };

  const handleOpenGatePass = (event) => {
    setSelectedEventForTicket(event);
    setRegistrationModalOpen(false);
    setGatePassModalOpen(true);
  };

  const handleRegisterAnotherCategory = () => {
    if (selectedEventForTicket) {
      setSelectedEventForRegistration(selectedEventForTicket);
      setGatePassModalOpen(false);
      setRegistrationModalOpen(true);
    }
  };

  const handleOpenRoster = (event) => {
    setSelectedEventForRoster(event);
    setRosterModalOpen(true);
  };

  // Filter events
  const displayedEvents = useMemo(() => {
    const rawEvents = getEvents({ type: activeTab });
    return rawEvents.filter(e => {
      const matchSearch = (e.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (e.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (e.location || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === 'all' || e.type === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [getEvents, activeTab, searchQuery, categoryFilter]);

  const getCategoryBadgeLabel = (type) => {
    const cat = CAMPUS_EVENT_CATEGORIES.find(c => c.value === type);
    if (cat) return `${cat.emoji} ${cat.label}`;
    if (!type) return '✨ Event';
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="events-page stagger-children">
      {/* Top Header & Actions */}
      <div className="card p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PartyPopper className="text-accent" size={24} /> Events, Reunions & Campus Fests Hub
          </h2>
          <p className="text-xs text-secondary mt-1">
            Discover Sports meets, Cultural fests, Freshers day, Annual day celebrations, Gandhi Jayanti events, Workshops, and Hackathons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(user?.role === 'college_admin' || user?.role === 'alumni') && (
            <button 
              onClick={() => setModalOpen(true)} 
              className="btn btn-primary flex items-center gap-2 font-bold"
            >
              <Plus size={16} /> Host New Event
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs mb-6">
        <button 
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Campus Events
        </button>
        <button 
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Events & Celebrations
        </button>
        <button 
          className={`tab-btn ${activeTab === 'hackathons' ? 'active' : ''}`}
          onClick={() => setActiveTab('hackathons')}
        >
          🚀 Hackathons & Coding Contests
        </button>
      </div>

      {/* Search & Category Filter Bar */}
      {activeTab !== 'hackathons' && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-3 text-secondary" />
            <input 
              type="text" 
              className="input text-xs pl-9 w-full" 
              placeholder="Search campus events by title, description, or venue..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-secondary" />
            <select 
              className="select text-xs" 
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Event Categories</option>
              {CAMPUS_EVENT_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ── TAB 1 & 2: UPCOMING & PAST EVENTS ── */}
      {activeTab !== 'hackathons' && (
        <div className="grid grid-3 gap-6">
          {displayedEvents.length === 0 ? (
            <div className="grid-span-3">
              <EmptyState 
                icon={Calendar} 
                title="No Events Found" 
                message="No events match your current category filter. Host a new campus event or check back soon." 
              />
            </div>
          ) : (
            displayedEvents.map(event => {
              const isPast = activeTab === 'past' || (event.date && new Date(event.date) < new Date());
              const isRegistered = event.rsvps.includes(user?.id);
              const isFull = event.currentAttendees >= event.maxAttendees && !isRegistered;
              const isOrganizer = user?.role === 'college_admin' || event.organizer === user?.name;
              const posterImage = event.image || (CATEGORY_DEFAULT_POSTERS && CATEGORY_DEFAULT_POSTERS[event.type]) || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';

              return (
                <div key={event.id} className="card event-card hover:border-accent/40 transition-all">
                  {/* Event Poster Banner Image */}
                  <div className="event-poster-container">
                    <img 
                      src={posterImage} 
                      alt={event.title} 
                      className={`event-poster-img ${isPast ? 'grayscale-[30%]' : ''}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80';
                      }}
                    />

                    {/* Floating Category Badge & Registration Mode */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap z-10">
                      <span className="badge badge-accent text-[10px] font-bold shadow-md backdrop-blur-md" style={{ background: 'rgba(22, 27, 34, 0.88)', color: 'var(--accent-light)' }}>
                        {getCategoryBadgeLabel(event.type)}
                      </span>
                      {isPast && (
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/90 border border-amber-500/40 px-2 py-0.5 rounded-full shadow-md backdrop-blur-md">
                          Concluded
                        </span>
                      )}
                    </div>
                    {event.registrationMode && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="text-[10px] font-semibold text-primary backdrop-blur-md px-2 py-0.5 border border-border/60 rounded-full shadow-md" style={{ background: 'rgba(22, 27, 34, 0.88)' }}>
                          {event.registrationMode === 'hackathon' || event.type === 'hackathon' ? '🚀 Hackathon' : event.registrationMode === 'custom_form' ? '📋 Questionnaire' : event.registrationMode === 'external_link' ? '🔗 External' : '⚡ 1-Click'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="event-card-content">
                    <div>
                      <h3 className="font-bold text-base text-primary mb-2 line-clamp-2">{event.title}</h3>
                      <p className="text-xs text-secondary line-clamp-3 mb-3 leading-relaxed">{event.description}</p>

                      <div className="flex flex-col gap-1.5 text-xs text-secondary border-t border-light pt-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-accent flex-shrink-0" />
                          <span className="truncate">{formatDate(event.date)} at {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-accent flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-accent flex-shrink-0" />
                          <span>{event.currentAttendees} / {event.maxAttendees} Registered</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-3 border-t border-light">
                      {/* Action buttons */}
                      <div className="flex gap-2">
                        {isPast ? (
                          isRegistered ? (
                            <>
                              <button 
                                type="button" 
                                onClick={() => handleOpenGatePass(event)}
                                className="btn btn-secondary btn-sm flex-1 flex items-center justify-center gap-1 font-semibold"
                              >
                                <Ticket size={14} /> My Pass
                              </button>
                              <button 
                                type="button" 
                                disabled
                                className="btn btn-secondary btn-sm flex-1 opacity-70 cursor-not-allowed font-medium"
                              >
                                ✓ Attended
                              </button>
                            </>
                          ) : (
                            <button 
                              type="button" 
                              disabled
                              className="btn btn-secondary btn-sm flex-1 font-semibold opacity-60 cursor-not-allowed flex items-center justify-center gap-1.5"
                            >
                              <Clock size={14} className="text-secondary" /> Registration Closed
                            </button>
                          )
                        ) : isRegistered ? (
                          <>
                            <button 
                              type="button" 
                              onClick={() => handleOpenGatePass(event)}
                              className="btn btn-secondary btn-sm flex-1 flex items-center justify-center gap-1.5 font-semibold text-primary"
                            >
                              <Ticket size={14} className="text-accent" /> My Pass
                            </button>
                            <button 
                              type="button" 
                              onClick={() => handleOpenRegistration(event)}
                              className="btn btn-secondary btn-sm flex-1 flex items-center justify-center gap-1.5 font-semibold text-primary hover:text-accent"
                              title="Register another category or team entry for this event"
                            >
                              <Plus size={14} className="text-accent" /> Register Again
                            </button>
                          </>
                        ) : (
                          <button 
                            type="button" 
                            onClick={() => handleOpenRegistration(event)}
                            disabled={isFull}
                            className="btn btn-primary btn-sm flex-1 font-bold"
                          >
                            {isFull ? 'Fully Booked' : 'Register for Event'}
                          </button>
                        )}
                      </div>

                      {/* Organizer Roster Button */}
                      {isOrganizer && (
                        <button 
                          type="button" 
                          onClick={() => handleOpenRoster(event)}
                          className="btn btn-secondary btn-xs w-full flex items-center justify-center gap-1 text-accent font-semibold"
                        >
                          <FileSpreadsheet size={13} /> View Roster & Export CSV
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── TAB 3: HACKATHONS & PROBLEM STATEMENTS ── */}
      {activeTab === 'hackathons' && (
        <div className="card p-6">
          {/* Top Header & Segmented Hackathon Switcher */}
          <div className="hackathon-hub-header">
            <div>
              <h3 className="section-title flex items-center gap-2 mb-1">
                <Code size={20} className="text-accent" /> Hackathons & Coding Contests
              </h3>
              <p className="text-xs text-secondary">
                Download official problem statements, view challenge details, and register for hackathons.
              </p>
            </div>

            {/* Segmented pill switcher with solid active button */}
            {hackathonEvents.length > 1 && (
              <div className="hackathon-switcher">
                {hackathonEvents.map(h => {
                  const isSelected = activeHackathon?.id === h.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setSelectedHackathonId(h.id)}
                      className={`hackathon-switcher-btn ${isSelected ? 'active' : ''}`}
                    >
                      <Code size={13} />
                      <span>{h.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {activeHackathon ? (
            <div className="hackathon-detail-panel">
              {/* Hackathon title, details & actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-base text-primary">{activeHackathon.title}</h4>
                    {isAdmin && (
                      <span className="badge badge-accent text-xxs font-bold uppercase tracking-wider py-0.5 px-2">
                        Admin Mode
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-secondary mt-1 leading-relaxed">{activeHackathon.description}</p>
                  <div className="flex items-center gap-4 text-xs text-secondary mt-2 flex-wrap">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar size={13} className="text-accent" /> {formatDate(activeHackathon.date)}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin size={13} className="text-accent" /> {activeHackathon.location || 'Campus Tech Lab'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleOpenRoster(activeHackathon)}
                      className="btn btn-secondary btn-sm text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Users size={13} /> Attendees
                    </button>
                  )}
                  <button 
                    type="button"
                    onClick={() => handleOpenRegistration(activeHackathon)}
                    className="btn btn-primary btn-sm font-bold flex items-center gap-1.5"
                  >
                    <Code size={14} /> Register
                  </button>
                </div>
              </div>

              {/* Hidden file input for Admin PDF upload / replace */}
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfUpload}
                style={{ display: 'none' }}
              />

              {/* Problem Statement Box */}
              {activeHackathon.problemStatementUrl ? (
                <div className="hackathon-pdf-card">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="hackathon-pdf-icon-wrap">
                      <FileText size={22} />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-primary truncate block">
                        {activeHackathon.problemStatementName || 'problem_statement.pdf'}
                      </span>
                      <span className="text-xxs text-secondary block mt-0.5">
                        Official problem statements & challenge guidelines
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button 
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={uploadingPdf}
                      className="btn btn-primary btn-sm flex items-center gap-1.5 font-bold"
                      title="Download PDF"
                    >
                      <FileDown size={14} /> Download PDF
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          type="button"
                          onClick={() => pdfInputRef.current?.click()}
                          disabled={uploadingPdf}
                          className="btn btn-secondary btn-sm text-xs flex items-center gap-1 font-semibold"
                          title="Upload another PDF to replace this one"
                        >
                          {uploadingPdf ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />} Replace
                        </button>
                        <button
                          type="button"
                          onClick={handleDeletePdf}
                          disabled={uploadingPdf}
                          className="btn btn-outline btn-sm text-xs text-danger border-danger/30 hover:bg-danger/10 hover:border-danger flex items-center gap-1 font-semibold"
                          title="Delete this PDF"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* When no PDF is uploaded */
                isAdmin ? (
                  <div className="hackathon-pdf-upload-dropzone">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                        <Upload size={18} />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-primary block">
                          No Problem Statement Uploaded
                        </span>
                        <span className="text-xxs text-secondary">
                          Attach the problem statement PDF for participants to download
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => pdfInputRef.current?.click()}
                      disabled={uploadingPdf}
                      className="btn btn-secondary btn-sm font-bold text-accent flex items-center gap-1.5"
                    >
                      {uploadingPdf ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} 
                      {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-surface border rounded-xl flex items-center gap-2 text-secondary text-xs">
                    <AlertCircle size={15} className="flex-shrink-0" />
                    <span>Problem statements will be published here by the organizers soon.</span>
                  </div>
                )
              )}
            </div>
          ) : (
            <p className="text-xs text-secondary italic">No active hackathon available.</p>
          )}
        </div>
      )}

      {/* EVENT CREATION MODAL */}
      {modalOpen && (
        <EventCreationModal 
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateEvent}
        />
      )}

      {/* DYNAMIC REGISTRATION MODAL FOR ALL CAMPUS EVENTS & HACKATHONS */}
      {registrationModalOpen && selectedEventForRegistration && (
        <DynamicRegistrationModal 
          event={selectedEventForRegistration}
          user={user}
          onClose={() => setRegistrationModalOpen(false)}
          onRegister={handleRegisterParticipant}
          onOpenGatePass={handleOpenGatePass}
        />
      )}

      {/* ATTENDEE ROSTER MODAL WITH CSV EXPORT */}
      {rosterModalOpen && selectedEventForRoster && (
        <AttendeeRosterModal 
          event={selectedEventForRoster}
          alumni={alumni}
          onClose={() => setRosterModalOpen(false)}
        />
      )}

      {/* VERIFIED DIGITAL GATE PASS MODAL */}
      {gatePassModalOpen && selectedEventForTicket && (
        <DigitalGatePassModal 
          event={selectedEventForTicket}
          user={user}
          onClose={() => setGatePassModalOpen(false)}
          onRegisterAnother={handleRegisterAnotherCategory}
          onRegisterAnotherEvent={() => {
            setGatePassModalOpen(false);
            window.scrollTo({ top: 300, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
