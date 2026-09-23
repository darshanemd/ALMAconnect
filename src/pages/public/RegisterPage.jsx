import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  ArrowLeft, ArrowRight, Check, AlertCircle, Calendar, ChevronDown, 
  ChevronLeft, ChevronRight, School, Briefcase, ShieldCheck, Upload, 
  FileText, Trash2, Eye, X 
} from 'lucide-react';
import AlumniConnectLogo from '../../components/ui/AlumniConnectLogo';
import './RegisterPage.css';

// Interactive Calendar-Style Year Picker Component
function YearPicker({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  
  // Calculate safe default year (e.g. 2026/2027)
  const parsed = Number(value);
  const safeYear = (parsed >= 1960 && parsed <= 2035) ? parsed : currentYear + 1;
  const [decadeStart, setDecadeStart] = useState(() => Math.floor(safeYear / 12) * 12);
  const pickerRef = useRef(null);

  // Sync decade with value if changed externally
  useEffect(() => {
    if (value) {
      const valNum = Number(value);
      if (valNum >= 1960 && valNum <= 2035) {
        setDecadeStart(Math.floor(valNum / 12) * 12);
      }
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const years = Array.from({ length: 12 }, (_, i) => decadeStart + i);

  return (
    <div className="year-picker-wrapper" ref={pickerRef}>
      <button
        type="button"
        className={`year-picker-trigger ${open ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-accent" />
          <span className={value ? 'text-primary font-bold' : 'text-secondary'}>
            {value ? `${value}` : 'Select Year'}
          </span>
        </div>
        <ChevronDown size={14} className={`year-picker-chevron ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="year-picker-dropdown animate-scale-in">
          {/* Calendar Header with Decade Switcher */}
          <div className="year-picker-header">
            <button
              type="button"
              className="year-nav-btn"
              onClick={() => setDecadeStart(prev => Math.max(1960, prev - 12))}
              disabled={decadeStart <= 1960}
              title="Previous 12 Years"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="year-picker-decade-title">
              {decadeStart} &ndash; {decadeStart + 11}
            </span>
            <button
              type="button"
              className="year-nav-btn"
              onClick={() => setDecadeStart(prev => Math.min(2028, prev + 12))}
              disabled={decadeStart + 11 >= 2040}
              title="Next 12 Years"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Quick Select Preset Row */}
          <div className="year-quick-row">
            <span className="text-[10px] text-tertiary uppercase tracking-wider font-bold">Quick:</span>
            {[2024, 2025, 2026, 2027, 2028, 2029].map(yr => (
              <button
                key={yr}
                type="button"
                className={`year-quick-chip ${Number(value) === yr ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(String(yr));
                  setTimeout(() => setOpen(false), 60);
                }}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* 12-Year Grid */}
          <div className="year-grid">
            {years.map(yr => {
              const isSelected = Number(value) === yr;
              const isCurrent = yr === currentYear;
              return (
                <button
                  key={yr}
                  type="button"
                  className={`year-grid-btn ${isSelected ? 'selected' : ''} ${isCurrent ? 'current-year' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(String(yr));
                    setTimeout(() => setOpen(false), 60);
                  }}
                >
                  <span>{yr}</span>
                  {isCurrent && !isSelected && <span className="current-dot" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const { colleges, preVerifiedStudents, addManualAlumniRegistration, addManualStudentRegistration } = useData();
  const [step, setStep] = useState(1);

  // Form states
  const [formData, setFormData] = useState({
    role: 'alumni', // 'alumni' or 'student'
    rollNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    collegeId: '',
    department: '',
    graduationYear: '',
    degree: '',
    currentCompany: '',
    currentRole: '',
    location: '',
    skills: '',
    bio: '',
    idProofImage: '',
    idProofName: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [proofPreview, setProofPreview] = useState(null);
  const [proofUploadError, setProofUploadError] = useState('');
  const [proofLightboxOpen, setProofLightboxOpen] = useState(false);
  const proofFileInputRef = useRef(null);
  const stepMountedAt = useRef(0);

  const totalSteps = formData.role === 'alumni' ? 4 : 3;

  useEffect(() => {
    stepMountedAt.current = Date.now();
  }, [step]);

  const isStep1Valid = Boolean(
    formData.firstName?.trim() &&
    formData.lastName?.trim() &&
    formData.email?.trim() &&
    formData.password &&
    formData.rollNumber?.trim()
  );

  const isStep2Valid = Boolean(
    formData.collegeId &&
    formData.department &&
    formData.graduationYear &&
    formData.degree
  );

  const isStep4Valid = Boolean(formData.idProofImage);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (errorMsg) setErrorMsg('');
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (role) => {
    if (errorMsg) setErrorMsg('');
    setFormData(prev => ({ 
      ...prev, 
      role, 
      rollNumber: '',
      department: '',
      graduationYear: '',
      idProofImage: '',
      idProofName: ''
    }));
    setProofPreview(null);
    setProofUploadError('');
    if (step > 3 && role === 'student') {
      setStep(3);
    }
  };

  const handleProofFileSelect = (e) => {
    setProofUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProofUploadError('Please select a valid image file (PNG, JPG, JPEG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProofUploadError('Image size exceeds 5 MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setProofPreview(base64);
      setFormData(prev => ({
        ...prev,
        idProofImage: base64,
        idProofName: file.name
      }));
    };
    reader.onerror = () => {
      setProofUploadError('Failed to read image file. Please try selecting again.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveProof = () => {
    setProofPreview(null);
    setProofUploadError('');
    setFormData(prev => ({
      ...prev,
      idProofImage: '',
      idProofName: ''
    }));
    if (proofFileInputRef.current) {
      proofFileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (colleges && colleges.length > 0) {
      setFormData(prev => ({
        ...prev,
        collegeId: prev.collegeId || colleges[0].id,
        degree: 'B.E'
      }));
    }
  }, [colleges]);

  // Check pre-verification for students
  const matchedPreVerified = useMemo(() => {
    if (formData.role !== 'student') return null;
    const roll = formData.rollNumber.trim().toLowerCase();
    const email = formData.email.trim().toLowerCase();
    if (!roll && !email) return null;
    return preVerifiedStudents.find(
      s => (roll && s.rollNumber?.toLowerCase() === roll) ||
           (email && s.email?.toLowerCase() === email)
    );
  }, [formData.role, formData.rollNumber, formData.email, preVerifiedStudents]);

  const nextStep = () => {
    if (errorMsg) setErrorMsg('');
    if (step === 1 && !isStep1Valid) return;
    if (step === 2 && !isStep2Valid) return;

    // If we're moving from Step 1 to Step 2, and student is pre-verified, auto-fill details
    if (step === 1 && formData.role === 'student' && matchedPreVerified) {
      setFormData(prev => ({
        ...prev,
        collegeId: matchedPreVerified.collegeId || 'col-1',
        department: matchedPreVerified.department || '',
        graduationYear: String(matchedPreVerified.expectedGraduationYear || matchedPreVerified.graduationYear || ''),
        degree: matchedPreVerified.degree || ''
      }));
    }
    setStep(prev => Math.min(totalSteps, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    if (errorMsg) setErrorMsg('');
    setStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (step < totalSteps) {
      nextStep();
      return;
    }
    // Prevent accidental instant submit from double-clicks or event bleed on Step Next button
    if (Date.now() - stepMountedAt.current < 600) {
      return;
    }

    if (formData.role === 'alumni' && !formData.idProofImage) {
      setErrorMsg('Please upload a valid proof of identity (college ID card or study certificate) to complete your registration.');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      // Split skills by comma
      const skillsArray = formData.skills
        ? formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
        : [];
        
      const parsedData = {
        ...formData,
        id: formData.rollNumber ? formData.rollNumber.trim() : undefined,
        rollNumber: formData.rollNumber ? formData.rollNumber.trim() : '',
        graduationYear: Number(formData.graduationYear),
        skills: skillsArray,
        idProofUrl: formData.idProofImage || '',
        idProofName: formData.idProofName || ''
      };

      if (formData.role === 'student') {
        if (matchedPreVerified) {
          // Auto-verify and approve student
          await addManualStudentRegistration({
            ...parsedData,
            status: 'active',
            isVerified: true
          });
        } else {
          // Register student as pending
          await addManualStudentRegistration({
            ...parsedData,
            status: 'pending',
            isVerified: false
          });
        }
      } else {
        // Register alumni as pending
        await addManualAlumniRegistration(parsedData);
      }
      
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMsg(err.message || 'Registration failed. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCollege = useMemo(() => {
    return colleges.find(c => c.id === formData.collegeId) || { code: formData.collegeId, name: formData.collegeId };
  }, [colleges, formData.collegeId]);

  const displayCollegeValue = useMemo(() => {
    if (matchedPreVerified) {
      const matchedCol = colleges.find(c => c.id === matchedPreVerified.collegeId);
      return matchedCol ? matchedCol.name : 'Sri Jayachamarajendra College of Engineering';
    }
    const foundCol = colleges.find(c => c.id === formData.collegeId);
    return foundCol ? foundCol.name : formData.collegeId;
  }, [matchedPreVerified, formData.collegeId, colleges]);

  const departmentsList = useMemo(() => {
    const staticDepts = [
      "Artificial Intelligence and Machine Learning",
      "Computer Science Engineering",
      "Automobile Engineering",
      "Civil Engineering",
      "Electronics and Communication"
    ];
    if (matchedPreVerified && matchedPreVerified.department && !staticDepts.includes(matchedPreVerified.department)) {
      return [...staticDepts, matchedPreVerified.department];
    }
    return staticDepts;
  }, [matchedPreVerified]);

  if (submitted) {
    const isAutoApproved = formData.role === 'student' && matchedPreVerified;
    return (
      <div className="register-page">
        <div className="register-card card text-center submitted-state animate-scale-up">
          <div className="success-icon-wrapper" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
            <Check size={32} />
          </div>
          
          {isAutoApproved ? (
            <>
              <h2>Account Created Successfully!</h2>
              <p className="mt-4">
                Congratulations! You were pre-verified by your college as a student. Your account is fully active and you can sign in immediately.
              </p>
              <div className="badge badge-success mt-4 p-2">Status: Active / Verified</div>
            </>
          ) : (
            <>
              <h2>Registration Request Submitted!</h2>
              <p className="mt-4">
                Thank you for registering. Since you chose manual registration, your credentials have been logged, and an approval request has been sent to the <strong>{activeCollege?.code} College Admin</strong>.
              </p>
              <div className="badge badge-warning mt-4 p-2">Status: Pending Verification</div>
            </>
          )}
          
          <div className="mt-8 flex flex-col gap-2">
            <Link to="/login" className="btn btn-primary mt-4">Go to Login</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      if (step < totalSteps) {
        nextStep();
      }
    }
  };

  return (
    <div className="register-page">
      <div className="register-card card animate-fade-in">
        <div className="register-header text-center">
          <Link to="/" className="register-logo">
            <AlumniConnectLogo size={44} />
            <span>AlumniConnect</span>
          </Link>
          <h2>Create Account</h2>
          <p>
            Step {step} of {totalSteps}: {
              step === 1 ? 'Personal Details' : 
              step === 2 ? 'Education Details' : 
              step === 3 ? (formData.role === 'alumni' ? 'Professional Profile' : 'Academic Profile') : 
              'Identity Verification Proof'
            }
          </p>
          
          <div className="step-indicator-bar mt-4">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`} />
            <div className={`step-line ${step >= 2 ? 'active' : ''}`} />
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
            <div className={`step-line ${step >= 3 ? 'active' : ''}`} />
            <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
            {totalSteps === 4 && (
              <>
                <div className={`step-line ${step >= 4 ? 'active' : ''}`} />
                <div className={`step-dot ${step >= 4 ? 'active' : ''}`} />
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="register-form mt-6">
          {errorMsg && (
            <div className="alert alert-error mb-4 flex items-center justify-between gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
              {step > 1 && errorMsg.toLowerCase().includes('email') && (
                <button 
                  type="button" 
                  onClick={() => { setStep(1); setErrorMsg(''); }}
                  className="text-xs underline font-semibold cursor-pointer hover:text-red-300 ml-2 whitespace-nowrap"
                >
                  Change Email (Step 1)
                </button>
              )}
            </div>
          )}
          {step === 1 && (
            <div className="form-step-content stagger-children">
              {/* Role Selector */}
              <div className="input-group mb-4">
                <label>Register as *</label>
                <div className="flex gap-4 mt-2">
                  <div 
                    onClick={() => handleRoleChange('alumni')} 
                    className={`role-option-card flex-1 ${formData.role === 'alumni' ? 'active' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="role" 
                      id="role-alumni"
                      checked={formData.role === 'alumni'} 
                      onChange={() => {}} 
                    />
                    <label htmlFor="role-alumni" className="cursor-pointer">
                      <div className="font-semibold text-sm">Alumni</div>
                      <div className="text-xs text-secondary">Graduated student</div>
                    </label>
                  </div>
                  
                  <div 
                    onClick={() => handleRoleChange('student')} 
                    className={`role-option-card flex-1 ${formData.role === 'student' ? 'active' : ''}`}
                  >
                    <input 
                      type="radio" 
                      name="role" 
                      id="role-student"
                      checked={formData.role === 'student'} 
                      onChange={() => {}} 
                    />
                    <label htmlFor="role-student" className="cursor-pointer">
                      <div className="font-semibold text-sm">Student</div>
                      <div className="text-xs text-secondary">Currently studying</div>
                    </label>
                  </div>
                </div>
              </div>

              {formData.role === 'alumni' && (
                <div className="input-group mb-4">
                  <label htmlFor="rollNumber">USN / Alumni ID Number *</label>
                  <input 
                    id="rollNumber" 
                    type="text" 
                    className="input" 
                    placeholder="e.g. 4EG20CS045 or ALUM-2020-001" 
                    value={formData.rollNumber} 
                    onChange={handleInputChange} 
                    required 
                  />
                  <div className="text-xs text-secondary mt-1">
                    Enter your college USN (University Seat Number) or official Alumni ID.
                  </div>
                </div>
              )}

              {formData.role === 'student' && (
                <div className="input-group mb-4">
                  <label htmlFor="rollNumber">Roll Number / Student ID *</label>
                  <input 
                    id="rollNumber" 
                    type="text" 
                    className="input" 
                    placeholder="e.g. 4EG2027001" 
                    value={formData.rollNumber} 
                    onChange={handleInputChange} 
                    required 
                  />
                  {matchedPreVerified ? (
                    <div className="badge badge-success mt-2 p-2 gap-2 text-xs flex items-center justify-start w-full">
                      <Check size={14} />
                      <span>🎉 Pre-verified record found: {matchedPreVerified.firstName} {matchedPreVerified.lastName} ({matchedPreVerified.department})</span>
                    </div>
                  ) : formData.rollNumber.trim() ? (
                    <div className="badge badge-warning mt-2 p-2 gap-2 text-xs flex items-center justify-start w-full">
                      <AlertCircle size={14} />
                      <span>Roll Number not pre-verified. Request will require manual admin approval.</span>
                    </div>
                  ) : null}
                </div>
              )}

              <div className="grid grid-2 gap-4">
                <div className="input-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input id="firstName" type="text" className="input" placeholder="Rahul" value={formData.firstName} onChange={handleInputChange} autoComplete="given-name" required />
                </div>
                <div className="input-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input id="lastName" type="text" className="input" placeholder="Kumar" value={formData.lastName} onChange={handleInputChange} autoComplete="family-name" required />
                </div>
              </div>

              <div className="input-group mt-4">
                <label htmlFor="email">Email Address *</label>
                <input id="email" type="email" className="input" placeholder="rahul@example.com" value={formData.email} onChange={handleInputChange} autoComplete="email" required />
                {formData.role === 'student' && matchedPreVerified && (
                  <div className="badge badge-success mt-2 p-2 gap-2 text-xs flex items-center justify-start w-full">
                    <Check size={14} />
                    <span>🎉 Email matches pre-verified record!</span>
                  </div>
                )}
              </div>

              <div className="input-group mt-4">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" type="tel" className="input" placeholder="+91 98765 43210" value={formData.phone} onChange={handleInputChange} autoComplete="tel" />
              </div>

              <div className="input-group mt-4">
                <label htmlFor="password">Password *</label>
                <input id="password" type="password" className="input" placeholder="••••••••" value={formData.password} onChange={handleInputChange} autoComplete="new-password" required />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step-content stagger-children">
                              {matchedPreVerified && (
                  <div className="badge badge-success w-full p-3 mb-4 gap-2 text-xs flex items-center">
                    <Check size={16} />
                    <span>Your student details are auto-verified. Fields are locked.</span>
                  </div>
                )}

                {/* College Info Display */}
                {(() => {
                  const selectedCol = colleges.find(c => c.id === formData.collegeId) || colleges[0];
                  return selectedCol ? (
                    <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-lg mb-6 shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <School size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-secondary uppercase tracking-wider">{formData.role === 'alumni' ? 'Alma Mater' : 'Institution'}</span>
                        <span className="text-sm font-bold text-text">{selectedCol.name}</span>
                      </div>
                    </div>
                  ) : null;
                })()}

              

              <div className="input-group mt-4">
                <label htmlFor="department">Department *</label>
                <select 
                  id="department" 
                  className="select" 
                  value={formData.department} 
                  onChange={handleInputChange} 
                  required 
                  disabled={!formData.collegeId || !!matchedPreVerified}
                >
                  <option value="">Select Department</option>
                  {departmentsList.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-2 gap-4 mt-4">
                <div className="input-group">
                  <label htmlFor="degree">Degree *</label>
                  <input 
                    id="degree" 
                    type="text" 
                    className="input bg-surface font-semibold text-secondary cursor-not-allowed" 
                    value="B.E" 
                    readOnly 
                    disabled 
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="graduationYear">Year of Graduation *</label>
                  <YearPicker 
                    value={formData.graduationYear} 
                    onChange={(yr) => setFormData(prev => ({ ...prev, graduationYear: yr }))} 
                    disabled={!!matchedPreVerified} 
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step-content stagger-children">
              {/* Step 3 Profile Info Display */}
              <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-lg mb-6 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <Briefcase size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    {formData.role === 'alumni' ? 'Alumni Profile' : 'Student Profile'}
                  </span>
                  <span className="text-sm font-bold text-text">
                    {formData.role === 'alumni' ? 'Professional Profile & Work Experience' : 'Academic Focus & Interests'}
                  </span>
                </div>
              </div>

              {formData.role === 'student' ? (
                <div className="grid grid-2 gap-4">
                  <div className="input-group">
                    <label htmlFor="currentRole">Academic Focus / Interest</label>
                    <input id="currentRole" type="text" className="input" placeholder="e.g. Web Development" value={formData.currentRole} onChange={handleInputChange} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="location">Current Location (City)</label>
                    <input id="location" type="text" className="input" placeholder="Bengaluru" value={formData.location} onChange={handleInputChange} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-2 gap-4">
                    <div className="input-group">
                      <label htmlFor="currentCompany">Current Company</label>
                      <input id="currentCompany" type="text" className="input" placeholder="Google" value={formData.currentCompany} onChange={handleInputChange} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="currentRole">Designation / Role</label>
                      <input id="currentRole" type="text" className="input" placeholder="Software Engineer" value={formData.currentRole} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="input-group mt-4">
                    <label htmlFor="location">Current Location (City)</label>
                    <input id="location" type="text" className="input" placeholder="Bengaluru" value={formData.location} onChange={handleInputChange} />
                  </div>
                </>
              )}

              <div className="input-group mt-4">
                <label htmlFor="skills">Skills (Comma separated)</label>
                <input id="skills" type="text" className="input" placeholder="React, JavaScript, Node.js, Python" value={formData.skills} onChange={handleInputChange} />
              </div>

              <div className="input-group mt-4">
                <label htmlFor="bio">Brief Bio</label>
                <textarea id="bio" className="textarea" placeholder="Tell us about yourself, academic achievements, or professional background..." value={formData.bio} onChange={handleInputChange} />
              </div>
            </div>
          )}

          {step === 4 && formData.role === 'alumni' && (
            <div className="form-step-content stagger-children">
              {/* Header Info Display */}
              <div className="flex items-center gap-3 p-4 bg-surface border border-border rounded-lg mb-4 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <ShieldCheck size={22} className="text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                    Alumni Status Verification
                  </span>
                  <span className="text-sm font-bold text-text">
                    Official College Document & ID Verification
                  </span>
                </div>
              </div>

              {/* Exact user requested verification requirement note */}
              <div className="id-proof-info-banner mb-5">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-bg/40 border border-accent/30 text-primary text-xs leading-relaxed shadow-sm">
                  <FileText size={20} className="text-accent flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold text-text text-sm mb-1">Identity Verification Notice</p>
                    <p className="text-secondary text-xs leading-relaxed">
                      “To complete your registration and verify your alumni status, we kindly request a valid proof of identity (such as a  your college ID card, study certificate ). This helps us ensure secure access to the alumni platform.”
                    </p>
                  </div>
                </div>
              </div>

              {/* Document Upload Area */}
              <div className="input-group">
                <label className="font-semibold text-xs text-primary block mb-2">
                  Upload Identity Proof Photo (College ID Card or Study Certificate) *
                </label>

                <input 
                  type="file"
                  ref={proofFileInputRef}
                  accept="image/*"
                  onChange={handleProofFileSelect}
                  style={{ display: 'none' }}
                  id="proof-document-file-input"
                />

                {proofUploadError && (
                  <div className="alert alert-error mb-3 p-2.5 text-xs text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>{proofUploadError}</span>
                  </div>
                )}

                {formData.idProofImage ? (
                  <div className="proof-preview-card border-2 border-accent/40 rounded-xl p-4 bg-surface flex flex-col items-center gap-3 relative shadow-md animate-fade-in">
                    <div className="w-full flex items-center justify-between pb-2 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-success text-[11px] font-semibold px-2 py-0.5 flex items-center gap-1">
                          <Check size={12} /> Proof Attached
                        </span>
                        <span className="text-xs text-secondary truncate max-w-[200px]" title={formData.idProofName}>
                          {formData.idProofName || 'ID_Card_Proof.png'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveProof}
                        className="btn btn-ghost btn-xs text-danger hover:bg-danger/10 p-1 rounded-md"
                        title="Remove attached photo"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div 
                      className="proof-image-container w-full max-h-[260px] overflow-hidden rounded-lg border border-border flex items-center justify-center bg-black/5 relative group cursor-pointer"
                      onClick={() => setProofLightboxOpen(true)}
                      title="Click to inspect enlarged photo"
                    >
                      <img 
                        src={formData.idProofImage} 
                        alt="Uploaded identity proof" 
                        className="max-h-[250px] w-auto max-w-full object-contain rounded-md"
                      />
                      <div className="proof-hover-overlay absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-semibold text-xs">
                        <Eye size={16} /> Click to view full image
                      </div>
                    </div>

                    <div className="w-full flex items-center justify-between text-xs text-secondary pt-1">
                      <span>Click photo to enlarge</span>
                      <button
                        type="button"
                        onClick={() => proofFileInputRef.current?.click()}
                        className="text-accent hover:underline font-semibold"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => proofFileInputRef.current?.click()}
                    className="proof-dropzone border-2 border-dashed border-border hover:border-accent hover:bg-accent-bg/20 rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3"
                  >
                    <div className="w-14 h-14 rounded-full bg-accent-bg flex items-center justify-center text-accent shadow-sm">
                      <Upload size={28} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-sm text-text">
                        Click to choose photo or drag & drop
                      </span>
                      <span className="text-xs text-secondary">
                        Upload your College ID Card, Study Certificate, or Marksheet photo
                      </span>
                      <span className="text-[11px] text-tertiary mt-1">
                        Supported formats: PNG, JPG, JPEG, WebP &bull; Maximum file size: 5 MB
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="register-actions mt-8">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="btn btn-secondary flex items-center gap-1" disabled={isSubmitting}>
                <ArrowLeft size={16} /> Back
              </button>
            )}
            
            {step < totalSteps ? (
              <button 
                key="btn-step-next"
                type="button" 
                onClick={nextStep} 
                className="btn btn-primary flex items-center gap-1 ml-auto"
                disabled={step === 1 ? !isStep1Valid : step === 2 ? !isStep2Valid : false}
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                key="btn-step-submit"
                type="button" 
                onClick={handleSubmit}
                className="btn btn-primary ml-auto flex items-center gap-1"
                disabled={isSubmitting || (formData.role === 'alumni' && !formData.idProofImage)}
                title={formData.role === 'alumni' && !formData.idProofImage ? "Please upload proof of identity before submitting" : "Submit registration request"}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'} <Check size={16} />
              </button>
            )}
          </div>
        </form>

        {/* Proof Lightbox Modal */}
        {proofLightboxOpen && formData.idProofImage && createPortal(
          <div 
            className="chat-lightbox-backdrop" 
            onClick={() => setProofLightboxOpen(false)}
          >
            <button 
              type="button"
              className="chat-lightbox-close-btn" 
              onClick={() => setProofLightboxOpen(false)}
              title="Close image view (Esc)"
            >
              <X size={24} />
            </button>
            <div className="chat-lightbox-content" onClick={e => e.stopPropagation()}>
              <img 
                src={formData.idProofImage} 
                alt="Uploaded identity proof" 
                className="chat-lightbox-image" 
              />
            </div>
          </div>,
          document.body
        )}

        <div className="register-footer text-center mt-6">
          <p>Already have an account? <Link to="/login" className="font-semibold">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}
