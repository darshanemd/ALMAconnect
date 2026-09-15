import React, { useState } from 'react';
import { 
  X, Check, Code, Users, Sparkles, Send, 
  Globe, CheckCircle2, Calendar, MapPin, FileText
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { formatDate } from '../../utils/formatters';

const SIMPLE_HACKATHON_TRACKS = [
  { id: 'web-app', title: '🌐 Web Development', desc: 'Websites & Web Applications' },
  { id: 'mobile-app', title: '📱 Mobile App Development', desc: 'Android & iOS Apps' },
  { id: 'ai-tech', title: '🤖 Artificial Intelligence & ML', desc: 'AI Models, Chatbots & Smart Projects' },
  { id: 'open-innovation', title: '💡 Open Track / Any Project', desc: 'Build any software or hardware project of your choice' }
];

const HACKER_ROLES = [
  'Frontend Developer', 'Backend / API Engineer', 'Full Stack Developer',
  'AI / ML Engineer', 'UI/UX Designer', 'DevOps / Cloud Architect'
];

export default function RealHackathonRegModal({ event, user, onClose, onRegister }) {
  const [submitted, setSubmitted] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const [formData, setFormData] = useState(() => ({
    format: 'team', // 'solo' | 'team'
    teamName: '',
    teamSize: '3',
    teamPasscode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    selectedTrack: 'web-app',
    problemStatementText: '',
    hackerRole: 'Full Stack Developer',
    primaryLanguages: 'React, Node.js, Python, Java',
    githubUrl: '',
    linkedinUrl: ''
  }));

  if (!event) return null;

  const handleSubmitFinal = (e) => {
    e.preventDefault();

    if (formData.format === 'team' && !formData.teamName.trim()) {
      alert('Please enter your Team Name.');
      return;
    }

    if (!formData.problemStatementText.trim()) {
      alert('Please enter your Problem Statement & Solution summary.');
      return;
    }

    const selectedTrackObj = SIMPLE_HACKATHON_TRACKS.find(t => t.id === formData.selectedTrack);

    const regAnswers = {
      format: formData.format === 'solo' ? 'Solo Hacker' : `Team: ${formData.teamName} (${formData.teamSize} members)`,
      teamName: formData.format === 'solo' ? 'Solo' : formData.teamName,
      teamPasscode: formData.teamPasscode,
      track: selectedTrackObj ? selectedTrackObj.title : formData.selectedTrack,
      problemStatement: formData.problemStatementText,
      hackerRole: formData.hackerRole,
      techStack: formData.primaryLanguages,
      githubUrl: formData.githubUrl || 'N/A'
    };

    setRegistrationData(regAnswers);
    onRegister(event.id, regAnswers);
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal max-w-2xl p-0 overflow-hidden rounded-2xl border shadow-2xl" onClick={e => e.stopPropagation()}>
        
        {/* Google Form Header Bar Accent */}
        <div className="h-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-accent" />

        {!submitted ? (
          <form onSubmit={handleSubmitFinal} className="p-6 bg-slate-50 flex flex-col gap-5 max-h-[85vh] overflow-y-auto text-xs">
            
            {/* Top Close Row */}
            <div className="flex justify-between items-center">
              <span className="text-xxs font-bold uppercase tracking-wider text-accent bg-accent-bg px-2.5 py-1 rounded-full">
                Hackathon Registration Form
              </span>
              <button type="button" className="btn btn-ghost p-1 text-secondary" onClick={onClose}>
                <X size={20} />
              </button>
            </div>

            {/* 1. GOOGLE FORM HEADER CARD */}
            <div className="bg-white p-6 border rounded-2xl shadow-sm border-t-8 border-t-accent flex flex-col gap-2">
              <h2 className="text-xl font-extrabold text-primary">{event.title} Registration</h2>
              <p className="text-xs text-secondary leading-relaxed">{event.description}</p>
              
              <div className="flex flex-wrap gap-4 text-xs text-secondary mt-2 pt-3 border-t border-light">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar size={14} className="text-accent" /> {formatDate(event.date)} at {event.time}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin size={14} className="text-accent" /> {event.location}
                </span>
              </div>
            </div>

            {/* 2. QUESTION CARD: PARTICIPATION FORMAT & TEAM */}
            <div className="bg-white p-6 border rounded-2xl shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                Participation Format & Team Details <span className="text-danger">*</span>
              </h3>

              <div className="flex flex-col gap-3">
                <label className={`p-3.5 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${formData.format === 'team' ? 'bg-accent-bg/20 border-accent' : 'bg-white hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="format" 
                    checked={formData.format === 'team'} 
                    onChange={() => setFormData({ ...formData, format: 'team' })}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-xs text-primary block">Team Registration</span>
                    <span className="text-xxs text-secondary block mt-0.5">Register with a team of 2 to 4 members.</span>
                  </div>
                </label>

                <label className={`p-3.5 border rounded-xl flex items-start gap-3 cursor-pointer transition-all ${formData.format === 'solo' ? 'bg-accent-bg/20 border-accent' : 'bg-white hover:bg-slate-50'}`}>
                  <input 
                    type="radio" 
                    name="format" 
                    checked={formData.format === 'solo'} 
                    onChange={() => setFormData({ ...formData, format: 'solo' })}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-xs text-primary block">Solo Hacker</span>
                    <span className="text-xxs text-secondary block mt-0.5">Register individually and join a team later at the hub.</span>
                  </div>
                </label>
              </div>

              {formData.format === 'team' && (
                <div className="grid grid-2 gap-4 mt-2 p-4 bg-slate-50 border rounded-xl">
                  <div className="input-group">
                    <label className="font-semibold text-xs text-primary">Team Name <span className="text-danger">*</span></label>
                    <input 
                      type="text" 
                      className="input text-xs" 
                      placeholder="e.g. CyberKnights / NeuralCoders" 
                      value={formData.teamName}
                      onChange={e => setFormData({ ...formData, teamName: e.target.value })}
                      required={formData.format === 'team'}
                    />
                  </div>

                  <div className="input-group">
                    <label className="font-semibold text-xs text-primary">Team Size</label>
                    <select 
                      className="select text-xs" 
                      value={formData.teamSize}
                      onChange={e => setFormData({ ...formData, teamSize: e.target.value })}
                    >
                      <option value="2">2 Members</option>
                      <option value="3">3 Members</option>
                      <option value="4">4 Members (Max Capacity)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 3. QUESTION CARD: SIMPLE HACKATHON TRACK & PROBLEM STATEMENT */}
            <div className="bg-white p-6 border rounded-2xl shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                <FileText size={16} className="text-accent" /> Track & Problem Statement <span className="text-danger">*</span>
              </h3>

              <div className="input-group">
                <label className="font-semibold text-xs text-primary">Select Project Category / Track <span className="text-danger">*</span></label>
                <select 
                  className="select text-xs w-full" 
                  value={formData.selectedTrack}
                  onChange={e => setFormData({ ...formData, selectedTrack: e.target.value })}
                >
                  {SIMPLE_HACKATHON_TRACKS.map(t => (
                    <option key={t.id} value={t.id}>{t.title} — {t.desc}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label className="font-semibold text-xs text-primary">Fill Problem Statement & Proposed Solution <span className="text-danger">*</span></label>
                <textarea 
                  className="input text-xs h-24 py-2 resize-none" 
                  placeholder="Enter the problem statement your team is addressing and brief proposed solution..."
                  value={formData.problemStatementText}
                  onChange={e => setFormData({ ...formData, problemStatementText: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* 4. QUESTION CARD: HACKER PROFILE & TECH STACK */}
            <div className="bg-white p-6 border rounded-2xl shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                Hacker Specialization & Tech Profile <span className="text-danger">*</span>
              </h3>

              <div className="grid grid-2 gap-4">
                <div className="input-group">
                  <label className="font-semibold text-xs text-primary">Your Primary Role <span className="text-danger">*</span></label>
                  <select 
                    className="select text-xs" 
                    value={formData.hackerRole}
                    onChange={e => setFormData({ ...formData, hackerRole: e.target.value })}
                  >
                    {HACKER_ROLES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="font-semibold text-xs text-primary">Languages & Technologies <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    className="input text-xs" 
                    placeholder="e.g. Python, React, Java, C++, SQL" 
                    value={formData.primaryLanguages}
                    onChange={e => setFormData({ ...formData, primaryLanguages: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-2 gap-4">
                <div className="input-group">
                  <label className="font-semibold text-xs text-primary flex items-center gap-1">
                    <Globe size={13} /> GitHub Profile Link (Optional)
                  </label>
                  <input 
                    type="url" 
                    className="input text-xs" 
                    placeholder="https://github.com/username" 
                    value={formData.githubUrl}
                    onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="font-semibold text-xs text-primary flex items-center gap-1">
                    <Globe size={13} /> LinkedIn Profile Link (Optional)
                  </label>
                  <input 
                    type="url" 
                    className="input text-xs" 
                    placeholder="https://linkedin.com/in/username" 
                    value={formData.linkedinUrl}
                    onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* FORM SUBMISSION BAR */}
            <div className="bg-white p-5 border rounded-2xl shadow-sm flex items-center justify-between">
              <button 
                type="submit" 
                className="btn btn-primary px-8 py-2.5 font-extrabold flex items-center gap-2 shadow"
              >
                <Send size={16} /> Complete Registration
              </button>
              <button 
                type="button" 
                onClick={onClose}
                className="btn btn-ghost text-xs text-secondary hover:text-danger font-semibold"
              >
                Cancel / Close
              </button>
            </div>

          </form>
        ) : (
          /* SUCCESS ADMIT BADGE */
          <div className="p-8 bg-slate-50 text-center flex flex-col items-center gap-4 animate-fade-in">
            <CheckCircle2 size={52} className="text-success animate-bounce" />
            <h3 className="font-extrabold text-xl text-primary">Registration Confirmed!</h3>
            <p className="text-xs text-secondary">
              Thank you for registering for {event.title}. Your admit pass and QR code have been issued.
            </p>

            <div className="p-5 bg-white border border-accent/40 rounded-2xl shadow-md max-w-sm w-full flex flex-col items-center gap-3">
              <span className="badge badge-accent text-xxs uppercase tracking-wider font-bold">Official Hacker Admit Pass</span>
              
              <div className="p-3 bg-white border rounded-xl">
                <QRCode value={`HACKPASS:${event.id}:${user?.id}:${registrationData?.teamName}`} size={140} />
              </div>

              <div className="text-center">
                <h4 className="font-bold text-sm text-primary">{user?.name}</h4>
                <span className="text-xs text-secondary block">{registrationData?.format}</span>
                <span className="text-xs font-semibold text-accent block mt-1">Track: {registrationData?.track}</span>
                <span className="text-xxs text-secondary block mt-0.5 line-clamp-1">{registrationData?.problemStatement}</span>
              </div>

              {registrationData?.teamPasscode && (
                <div className="p-2 bg-accent-bg/30 border border-accent/30 rounded-lg text-xs w-full">
                  <span className="text-xxs text-secondary block uppercase font-semibold">Team Invite Passcode</span>
                  <strong className="font-mono text-sm text-accent tracking-widest">{registrationData.teamPasscode}</strong>
                </div>
              )}
            </div>

            <button type="button" onClick={onClose} className="btn btn-primary mt-2 px-6">
              Done & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
