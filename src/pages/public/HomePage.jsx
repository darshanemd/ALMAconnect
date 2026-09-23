import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { 
  Users, Briefcase, Calendar, GraduationCap, ArrowRight, Award, 
  Compass, ShieldCheck, Sparkles, CheckCircle2, ChevronDown, 
  TrendingUp, FileText, Zap, Activity, X, Star, Globe
} from 'lucide-react';
import AlumniConnectLogo from '../../components/ui/AlumniConnectLogo';
import { apiRequest } from '../../utils/api';
import './HomePage.css';

const COMMUNITY_ACTIVITIES = [
  { icon: '🎓', text: 'Rahul S. (SDE @ Google) accepted a 1:1 mentorship request', time: '2m ago' },
  { icon: '📄', text: '18 student resumes audited by AI Placement Suite', time: '5m ago' },
  { icon: '💼', text: 'New Senior Fullstack Engineer role posted at Microsoft', time: '8m ago' },
  { icon: '🏛️', text: '500+ new alumni registered from IIIT Bangalore', time: '12m ago' },
  { icon: '⚡', text: 'Skill Gap Analysis generated 45 personalized roadmaps', time: '15m ago' }
];

export default function HomePage() {
  const [liveStats, setLiveStats] = useState({
    alumni: 3,
    students: 1,
    colleges: 5,
    jobs: 7,
    events: 5,
    verifiedAlumni: 3,
    mentors: 2,
    recentAlumniPreview: [
      { name: 'Priya Sharma', initials: 'PS', role: 'Software Engineer', company: 'Google' },
      { name: 'Rohan Verma', initials: 'RV', role: 'Senior Engineer', company: 'Microsoft' },
      { name: 'Anjali Rao', initials: 'AR', role: 'Systems Engineer', company: 'Infosys' }
    ],
    activities: [
      { icon: '💼', text: 'New Machine Learning Researcher role posted at IBM Research', time: 'Live Job', type: 'job' }
    ]
  });

  const [activeFaq, setActiveFaq] = useState(null);

  // Hero Rotatable Ecosystem state
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, angle: 0 });

  // Cursor Parallax Glow state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Live Activity Stream Toast state
  const [activityIdx, setActivityIdx] = useState(0);
  const [showToast, setShowToast] = useState(true);

  // Fetch real live statistics from MongoDB
  useEffect(() => {
    apiRequest('/public-stats')
      .then(data => {
        if (data && typeof data.alumni === 'number') {
          setLiveStats(data);
        }
      })
      .catch(err => console.warn('Could not fetch live public stats:', err));
  }, []);

  // Handle Hero Mouse Move for Parallax
  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePos({ x: x * 0.04, y: y * 0.04 });
  };

  // Drag controls for ecosystem logo
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, angle: rotationAngle };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    setRotationAngle(dragStartRef.current.angle + deltaX * 0.7);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Continuous Ambient Swoosh Rotation
  useEffect(() => {
    let animFrame;
    const animate = () => {
      if (!isDragging) {
        setRotationAngle(prev => (prev + 0.25) % 360);
      }
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [isDragging]);

  // Live Activity Stream Ticker
  useEffect(() => {
    const activitiesList = liveStats.activities || [];
    if (activitiesList.length === 0) return;

    const interval = setInterval(() => {
      setActivityIdx(prev => (prev + 1) % activitiesList.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [liveStats.activities]);

  // IntersectionObserver for Scroll Reveal Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.12 }
    );

    const revealElements = document.querySelectorAll('.feature-card, .stat-item, .faq-card');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const activities = liveStats.activities || [];
  const currentActivity = activities[activityIdx % (activities.length || 1)] || {
    icon: '🎓',
    text: 'Live institutional database connected and active',
    time: 'Verified'
  };

  return (
    <div className="home-page">
      {/* Hero Section with Parallax Glow & Rotatable Artwork */}
      <section 
        className="hero-section"
        onMouseMove={handleHeroMouseMove}
      >
        <div 
          className="hero-bg-glow glow-1"
          style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
        />
        <div 
          className="hero-bg-glow glow-2"
          style={{ transform: `translate(${-mousePos.x * 1.2}px, ${-mousePos.y * 1.2}px)` }}
        />

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge shimmer-badge">
              <Sparkles size={16} className="text-accent animate-pulse" />
              <span>Next-Gen Institutional & Alumni Platform</span>
            </div>
            <h1>
              Connect. Empower.<br />
              <span className="gradient-text">Shape The Future.</span>
            </h1>
            <p>
              The premier ecosystem for alumni networking, AI placement tools, mentorship matching, 
              and institutional growth for modern colleges and universities.
            </p>

            <div className="hero-ctas">
              <Link to="/register" className="btn btn-primary btn-lg glow-btn magnetic-btn">
                Join Network <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg magnetic-btn">
                Explore Directory
              </Link>
            </div>

            <div className="hero-trust-proof flex items-center gap-3 mt-6 pt-4 border-t border-border-light/40">
              <div className="flex -space-x-2 overflow-hidden items-center">
                {(liveStats.recentAlumniPreview || []).slice(0, 3).map((alum, idx) => {
                  const bgColors = ['bg-accent text-white', 'bg-teal-600 text-white', 'bg-indigo-600 text-white'];
                  return (
                    <div 
                      key={idx} 
                      className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center border-2 border-surface shadow-sm ${bgColors[idx % 3]}`}
                      title={`${alum.name} (${alum.role || 'Alumni'} at ${alum.company || 'Company'})`}
                    >
                      {alum.initials || 'AL'}
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-secondary">
                <strong className="text-primary font-bold">{liveStats.alumni}</strong> verified alumni actively connected across <strong className="text-primary font-bold">{liveStats.colleges}</strong> partner colleges
              </div>
            </div>
          </div>

          {/* Interactive Rotatable Ecosystem Hero Artwork */}
          <div 
            className={`hero-illustration ${isDragging ? 'is-dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={(e) => {
              setIsDragging(true);
              dragStartRef.current = { x: e.touches[0].clientX, angle: rotationAngle };
            }}
            onTouchMove={(e) => {
              if (!isDragging) return;
              const deltaX = e.touches[0].clientX - dragStartRef.current.x;
              setRotationAngle(dragStartRef.current.angle + deltaX * 0.7);
            }}
            onTouchEnd={handleMouseUp}
          >
            <div className="home-logo-wrap">
              <div className="artwork-logo-main">
                <AlumniConnectLogo size={340} wingRotation={rotationAngle} />
              </div>

              {/* Floating Stat Cards around rotatable logo */}
              <div className="illustration-card accent-card hero-float-card float-1">
                <Users size={24} />
                <div>
                  <h3 className="font-extrabold text-base">{liveStats.alumni || 0}</h3>
                  <p className="text-xxs">Active Alumni</p>
                </div>
              </div>

              <div className="illustration-card surface-card hero-float-card float-2">
                <Briefcase size={24} />
                <div>
                  <h3 className="font-extrabold text-base">{liveStats.jobs || 0}</h3>
                  <p className="text-xxs">Active Jobs</p>
                </div>
              </div>

              <div className="illustration-card outline-card hero-float-card float-3">
                <GraduationCap size={24} />
                <div>
                  <h3 className="font-extrabold text-base">{liveStats.mentors || 0}</h3>
                  <p className="text-xxs">Mentors Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h2>{liveStats.verifiedAlumni || liveStats.alumni}</h2>
            <p>Verified Alumni</p>
          </div>
          <div className="stat-item">
            <h2>{liveStats.colleges}</h2>
            <p>Partner Colleges</p>
          </div>
          <div className="stat-item">
            <h2>{liveStats.jobs}</h2>
            <p>Active Job Openings</p>
          </div>
          <div className="stat-item">
            <h2>{liveStats.events}</h2>
            <p>Campus & Virtual Events</p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="features-section">
        <div className="section-header text-center">
          <span className="sub-tag">PLATFORM CAPABILITIES</span>
          <h2>Everything You Need in One Unified Hub</h2>
          <p>Built specifically to connect graduates, streamline career growth, and empower institutional operations.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card glass-hover">
            <div className="feature-icon icon-indigo"><Users size={24} /></div>
            <h3>Smart Alumni Directory</h3>
            <p>Filter alumni by location, company, department, and skills. Interactive geo-mapping lets you find grads near you.</p>
          </div>

          <div className="feature-card glass-hover">
            <div className="feature-icon icon-cyan"><Briefcase size={24} /></div>
            <h3>AI Job Portal</h3>
            <p>Post and discover exclusive jobs. Automated skill-gap analysis highlights missing skills for applicant readiness.</p>
          </div>

          <div className="feature-card glass-hover">
            <div className="feature-icon icon-emerald"><Calendar size={24} /></div>
            <h3>Events & Reunions</h3>
            <p>Organize webinars, homecoming reunions, and workshops with instant digital QR tickets and attendance tracking.</p>
          </div>

          <div className="feature-card glass-hover">
            <div className="feature-icon icon-purple"><GraduationCap size={24} /></div>
            <h3>1:1 Mentorship Hub</h3>
            <p>Connect students and junior alumni with industry leaders. Auto-matching algorithms connect shared career goals.</p>
          </div>

          <div className="feature-card glass-hover">
            <div className="feature-icon icon-amber"><FileText size={24} /></div>
            <h3>AI Resume Analyzer</h3>
            <p>Instant resume scoring, key-phrase detection, and placement likelihood suggestions tailored to student portfolios.</p>
          </div>

          <div className="feature-card glass-hover">
            <div className="feature-icon icon-rose"><Compass size={24} /></div>
            <h3>Smart Digital ID Card</h3>
            <p>Access your verified digital alumni ID card with built-in QR validation for campus facilities and alumni privileges.</p>
          </div>
        </div>
      </section>


      {/* FAQ Accordion */}
      <section className="faq-section">
        <div className="section-header text-center">
          <span className="sub-tag">GOT QUESTIONS?</span>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-wrapper">
          {[
            {
              q: "Who can join the ProjectALMA network?",
              a: "Alumni, current students, faculty, and college administrators from onboarded institutions can create verified accounts."
            },
            {
              q: "How does the AI Resume Analyzer work?",
              a: "Students upload their resume PDF, and our AI scans for key industry competencies, formatting quality, and produces instant improvement feedback."
            },
            {
              q: "Is my personal data protected?",
              a: "Yes. All profile data is encrypted, and you can control exactly what contact information is visible to other network members."
            }
          ].map((item, idx) => (
            <div key={idx} className={`faq-card ${activeFaq === idx ? 'open' : ''}`}>
              <button className="faq-btn" onClick={() => toggleFaq(idx)}>
                <span>{item.q}</span>
                <ChevronDown size={18} className="faq-icon" />
              </button>
              {activeFaq === idx && <p className="faq-ans">{item.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-banner-section">
        <div className="cta-banner">
          <h2>Ready to connect with your community?</h2>
          <p>Create your verified profile in minutes. Connect with peers, volunteer as a mentor, or accelerate your career today.</p>
          <Link to="/register" className="btn btn-primary btn-lg glow-btn">Get Started Now</Link>
        </div>
      </section>

      {/* Live Social Proof Activity Ticker Toast */}
      {showToast && (
        <div className="live-activity-toast glass-panel">
          <div className="activity-toast-header flex items-center justify-between gap-2 mb-2">
            <span className="flex items-center gap-1.5 text-xxs font-bold text-accent uppercase tracking-wider">
              <Activity size={12} className="animate-pulse flex-shrink-0" /> Live Activity Stream
            </span>
            <button 
              onClick={() => setShowToast(false)} 
              className="text-secondary hover:text-primary transition-colors p-0.5"
              title="Close activity feed"
            >
              <X size={14} />
            </button>
          </div>
          <div className="activity-toast-body flex items-start gap-2.5">
            <span className="activity-icon-badge text-xl flex-shrink-0 leading-none mt-0.5">{currentActivity.icon}</span>
            <div className="activity-details min-w-0 flex-1">
              <p className="activity-text text-xs font-semibold text-primary">{currentActivity.text}</p>
              <span className="activity-time text-[10px] text-secondary">{currentActivity.time}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
