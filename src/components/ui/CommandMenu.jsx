import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Search, Compass, Users, Briefcase, Calendar, Heart, BookOpen, User, CreditCard, X, ArrowLeft } from 'lucide-react';
import './CommandMenu.css';

export default function CommandMenu({ isOpen, onClose }) {
  const { user } = useAuth();
  const { getAlumni, getJobs, getEvents } = useData();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useRef(useNavigate());
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  const getPages = () => {
    const list = [
      { name: 'Dashboard', path: '/dashboard', icon: Compass, role: '*' },
      { name: 'Alumni Directory', path: '/directory', icon: Users, role: '*' },
      { name: 'Job Board', path: '/jobs', icon: Briefcase, role: 'alumni' },
      { name: 'Job Board (Student)', path: '/jobs', icon: Briefcase, role: 'student' },
      { name: 'Events Calendar', path: '/events', icon: Calendar, role: '*' },
      { name: 'Success Stories & Blogs', path: '/blog', icon: BookOpen, role: 'alumni' },
      { name: 'Success Stories & Blogs (Student)', path: '/blog', icon: BookOpen, role: 'student' },
      { name: 'Smart Card', path: '/card', icon: CreditCard, role: 'alumni' },
      { name: 'AI Resume Analyzer', path: '/student/resume-analyzer', icon: Compass, role: 'student' },
      { name: 'Skill Gap Detector', path: '/student/skill-gap', icon: Compass, role: 'student' },
      { name: 'Placement Predictor', path: '/student/placement-predictor', icon: Compass, role: 'student' },
      { name: 'Verification Requests', path: '/verification', icon: Users, role: 'college_admin' },
      { name: 'Upload Alumni CSV', path: '/csv-upload', icon: Users, role: 'college_admin' },
    ];
    
    return list.filter(p => p.role === '*' || p.role === user?.role);
  };

  const pages = getPages();
  const filteredPages = pages.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

  // Get matching alumni/jobs/events if query is entered
  const matchedAlumni = query.length >= 2 ? getAlumni({ search: query }).slice(0, 3) : [];
  const matchedJobs = query.length >= 2 ? getJobs({ search: query }).slice(0, 3) : [];

  const allItems = [
    ...filteredPages.map(p => ({ ...p, type: 'page' })),
    ...matchedAlumni.map(a => ({ name: `${a.firstName} ${a.lastName} (${a.currentRole || 'Alumni'})`, path: `/directory?id=${a.id}`, icon: User, type: 'alumni' })),
    ...matchedJobs.map(j => ({ name: `${j.title} at ${j.company}`, path: `/jobs?id=${j.id}`, icon: Briefcase, type: 'job' }))
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allItems[activeIndex]) {
        navigate.current(allItems[activeIndex].path);
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="command-backdrop" onClick={onClose}>
      <div className="command-menu" onClick={e => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="command-input-wrapper">
          <button 
            type="button" 
            className="btn btn-ghost p-1 rounded-lg text-secondary hover:text-primary mr-1"
            onClick={onClose}
            title="Back / Close (Esc)"
          >
            <ArrowLeft size={18} />
          </button>
          <Search className="command-search-icon" size={18} />
          <input 
            ref={inputRef}
            type="text" 
            className="command-input" 
            placeholder="Type a command or search directory, jobs..." 
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveIndex(0); }}
          />
          <button 
            type="button" 
            className="btn btn-ghost p-1 rounded-lg text-secondary hover:text-primary ml-1"
            onClick={onClose}
            title="Close Menu (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        <div className="command-results">
          {allItems.length === 0 ? (
            <div className="command-empty">No results found for "{query}"</div>
          ) : (
            <>
              {filteredPages.length > 0 && (
                <div className="command-group">
                  <div className="command-group-label">Navigation</div>
                  {filteredPages.map((item, index) => {
                    const Icon = item.icon;
                    const globalIndex = index;
                    return (
                      <div 
                        key={item.path} 
                        className={`command-item ${activeIndex === globalIndex ? 'active' : ''}`}
                        onClick={() => { navigate.current(item.path); onClose(); }}
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                      >
                        <Icon size={16} />
                        <span>{item.name}</span>
                        <span className="command-shortcut"><kbd>↵</kbd></span>
                      </div>
                    );
                  })}
                </div>
              )}

              {matchedAlumni.length > 0 && (
                <div className="command-group">
                  <div className="command-group-label">Alumni</div>
                  {matchedAlumni.map((alum, index) => {
                    const globalIndex = filteredPages.length + index;
                    return (
                      <div 
                        key={alum.id} 
                        className={`command-item ${activeIndex === globalIndex ? 'active' : ''}`}
                        onClick={() => { navigate.current(`/directory`); onClose(); }}
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                      >
                        <User size={16} />
                        <span>{alum.firstName} {alum.lastName} - {alum.currentRole || 'Graduate'} at {alum.currentCompany || 'Alumni'}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {matchedJobs.length > 0 && (
                <div className="command-group">
                  <div className="command-group-label">Jobs</div>
                  {matchedJobs.map((job, index) => {
                    const globalIndex = filteredPages.length + matchedAlumni.length + index;
                    return (
                      <div 
                        key={job.id} 
                        className={`command-item ${activeIndex === globalIndex ? 'active' : ''}`}
                        onClick={() => { navigate.current(`/jobs`); onClose(); }}
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                      >
                        <Briefcase size={16} />
                        <span>{job.title} - {job.company}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        <div className="command-footer">
          <span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span><kbd>Enter</kbd> to select</span>
          <span><kbd>ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
