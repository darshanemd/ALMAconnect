import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { User, Mail, Phone, Briefcase, GraduationCap, MapPin, Link as LinkIcon, Sparkles, Edit2, Check, X, Camera, FileText, Upload, Eye } from 'lucide-react';
import { getInitials } from '../../utils/formatters';
import Avatar from '../../components/ui/Avatar';
import ProfilePhotoUploader from '../../components/ui/ProfilePhotoUploader';
import ResumeViewerModal from '../../components/ui/ResumeViewerModal';
import { uploadFile, getFileUrl } from '../../utils/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { getAlumniById, updateAlumni } = useData();

  const profileData = getAlumniById(user?.id);

  const defaultRole = user?.role === 'student' ? 'Student' : user?.role === 'college_admin' ? 'College Administrator' : 'Graduate';
  const displayRole = profileData?.currentRole || defaultRole;

  const [editMode, setEditMode] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumeFile, setResumeFile] = useState(user?.resumeUrl || profileData?.resumeUrl || '');
  const [resumeType, setResumeType] = useState(user?.resumeType || profileData?.resumeType || 'pdf');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const resumeInputRef = useRef(null);

  // Sync resume when user or profileData changes / re-fetches from backend
  useEffect(() => {
    const currentResume = user?.resumeUrl || profileData?.resumeUrl || '';
    if (currentResume) {
      setResumeFile(currentResume);
    }
    const currentType = user?.resumeType || profileData?.resumeType || 'pdf';
    if (currentType) {
      setResumeType(currentType);
    }
  }, [user?.resumeUrl, user?.resumeType, profileData?.resumeUrl, profileData?.resumeType]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert('File size exceeds 20MB limit.');
      return;
    }

    const isPdfFile = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const fileType = isPdfFile ? 'pdf' : 'image';
    setIsUploadingResume(true);

    try {
      let finalResumeUrl = '';

      // 1. Upload via multipart/form-data to /api/upload for persistent server storage
      try {
        const formData = new FormData();
        formData.append('file', file);
        const uploadData = await uploadFile(formData);
        if (uploadData?.url) {
          finalResumeUrl = uploadData.url;
        }
      } catch (uploadErr) {
        console.warn('Server file upload failed, falling back to base64 storage:', uploadErr);
      }

      // 2. Fallback to base64 encoding if direct server upload did not return a URL
      if (!finalResumeUrl) {
        finalResumeUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => resolve(evt.target?.result || '');
          reader.readAsDataURL(file);
        });
      }

      if (finalResumeUrl) {
        setResumeFile(finalResumeUrl);
        setResumeType(fileType);

        // Persist to AuthContext (updates session & calls /api/members/:id PUT)
        await updateUser({
          resumeUrl: finalResumeUrl,
          resumeType: fileType,
          resumeName: file.name
        });

        // Persist to DataContext
        if (updateAlumni && user?.id) {
          updateAlumni(user.id, {
            resumeUrl: finalResumeUrl,
            resumeType: fileType,
            resumeName: file.name
          });
        }

        alert('Resume saved permanently! It will remain in your profile even after you logout and login.');
      }
    } catch (err) {
      console.error('Error saving resume:', err);
      alert('Failed to save resume. Please try again.');
    } finally {
      setIsUploadingResume(false);
    }
  };
  const [formData, setFormData] = useState({
    firstName: profileData?.firstName || '',
    lastName: profileData?.lastName || '',
    phone: profileData?.phone || '',
    currentCompany: profileData?.currentCompany || '',
    currentRole: profileData?.currentRole || '',
    location: profileData?.location || '',
    bio: profileData?.bio || '',
    skills: profileData?.skills ? profileData.skills.join(', ') : '',
    linkedin: profileData?.linkedin || ''
  });

  const handleSave = (e) => {
    e.preventDefault();
    const skillsArray = formData.skills
      ? formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];
      
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      currentCompany: formData.currentCompany,
      currentRole: formData.currentRole,
      location: formData.location,
      bio: formData.bio,
      skills: skillsArray,
      linkedin: formData.linkedin
    };

    updateAlumni(user?.id, payload);
    setEditMode(false);
  };

  if (!profileData) {
    return (
      <div className="card p-12 text-center">
        <h3>Profile Not Found</h3>
        <p className="text-secondary mt-2">Cannot retrieve profile metrics for your user account.</p>
      </div>
    );
  }

  return (
    <div className="profile-page stagger-children">
      {/* Profile Banner */}
      <div className="profile-banner-card card mb-6">
        <div className="profile-banner-content p-8 flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="relative inline-block">
              <Avatar 
                src={user?.avatarUrl || profileData.avatarUrl} 
                name={`${profileData.firstName} ${profileData.lastName}`} 
                role={user?.role} 
                size="xl" 
                isVerified={true}
              />
              <button 
                type="button"
                className="btn btn-primary rounded-full p-2 absolute bottom-0 right-0 shadow-md"
                onClick={() => setShowPhotoModal(true)}
                title="Change Profile Photo"
                aria-label="Change Profile Photo"
              >
                <Camera size={14} />
              </button>
            </div>
            <div>
              <h2 className="font-bold text-2xl text-accent-dark">{profileData.firstName} {profileData.lastName}</h2>
              <p className="text-sm font-semibold opacity-90">{displayRole} {profileData.currentCompany ? `at ${profileData.currentCompany}` : ''}</p>
              <div className="flex items-center gap-1 text-xs text-secondary mt-2">
                <MapPin size={14} />
                <span>{profileData.location || 'Location not specified'}</span>
              </div>
            </div>
          </div>
          
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="btn btn-secondary flex items-center gap-2">
              <Edit2 size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-3 gap-6">
        {/* Left column (2/3 width) - Edit Form or Profile View */}
        <div className="grid-span-2">
          {editMode ? (
            <form onSubmit={handleSave} className="card p-8 flex flex-col gap-6">
              <h3 className="section-title">Edit Personal & Professional Details</h3>

              <div className="grid grid-2 gap-4">
                <div className="input-group">
                  <label htmlFor="edit-first">First Name *</label>
                  <input type="text" id="edit-first" className="input" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label htmlFor="edit-last">Last Name *</label>
                  <input type="text" id="edit-last" className="input" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-2 gap-4">
                <div className="input-group">
                  <label htmlFor="edit-phone">Phone Number</label>
                  <input type="tel" id="edit-phone" className="input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="input-group">
                  <label htmlFor="edit-loc">Location (City)</label>
                  <input type="text" id="edit-loc" className="input" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-2 gap-4">
                <div className="input-group">
                  <label htmlFor="edit-comp">Current Company</label>
                  <input type="text" id="edit-comp" className="input" value={formData.currentCompany} onChange={e => setFormData({...formData, currentCompany: e.target.value})} />
                </div>
                <div className="input-group">
                  <label htmlFor="edit-role">Designation</label>
                  <input type="text" id="edit-role" className="input" value={formData.currentRole} onChange={e => setFormData({...formData, currentRole: e.target.value})} />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="edit-linkedin">LinkedIn Profile Link</label>
                <input type="url" id="edit-linkedin" className="input" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
              </div>

              <div className="input-group">
                <label htmlFor="edit-skills">Skills (Comma separated)</label>
                <input type="text" id="edit-skills" className="input" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
              </div>

              <div className="input-group">
                <label htmlFor="edit-bio">Short Bio</label>
                <textarea id="edit-bio" className="textarea" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows="4" />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-light">
                <button type="button" className="btn btn-secondary flex items-center gap-1" onClick={() => setEditMode(false)}>
                  <X size={16} /> Cancel
                </button>
                <button type="submit" className="btn btn-primary flex items-center gap-1">
                  <Check size={16} /> Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col gap-6">
              {/* About card */}
              <div className="card p-8">
                <h3 className="section-title">Professional Bio</h3>
                <p className="text-sm text-secondary mt-3 leading-relaxed">
                  {profileData.bio || 'No professional bio provided yet. Click Edit Profile to add one!'}
                </p>
              </div>

              {/* Skills card */}
              <div className="card p-8">
                <h3 className="section-title flex items-center gap-2">
                  <Sparkles size={18} className="text-accent" /> Competencies & Skills
                </h3>
                <div className="flex flex-wrap gap-2 mt-4">
                  {profileData.skills.length === 0 ? (
                    <p className="text-xs text-secondary italic">No skills registered.</p>
                  ) : (
                    profileData.skills.map((s, idx) => (
                      <span key={idx} className="badge badge-accent p-2">{s}</span>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column - Education, Contact info */}
        <div className="flex flex-col gap-6">
          {/* Education Summary */}
          <div className="card p-6">
            <h3 className="section-title flex items-center gap-2">
              <GraduationCap size={18} className="text-accent" /> Education Details
            </h3>
            <div className="education-box mt-4 border-l-2 border-accent pl-4 py-1">
              <h4 className="font-semibold text-sm">{profileData.degree} in {profileData.department}</h4>
              <p className="text-xs text-secondary mt-1">Class of {profileData.graduationYear}</p>
              <p className="text-xs text-secondary font-bold mt-1">Verified Alma Mater</p>
            </div>
          </div>

          {/* Compulsory Resume Upload Card for Alumni */}
          {user?.role === 'alumni' && (
            <div className="card p-6 border-accent">
              <h3 className="section-title flex items-center gap-2 mb-1">
                <FileText size={18} className="text-accent" /> Resume & CV Management
              </h3>
              <p className="text-xs text-secondary mb-4 leading-relaxed">
                Compulsory for networking. Students will be able to request to view your resume, which you can approve or decline.
              </p>

              <input 
                ref={resumeInputRef}
                type="file" 
                accept="application/pdf,image/*" 
                onChange={handleResumeUpload}
                className="hidden" 
              />

              <div className="flex flex-col gap-2">
                {resumeFile ? (
                  <div className="p-3 bg-accent-bg border border-accent-light rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-accent" />
                      <span className="text-xs font-bold text-accent-dark">Resume Active ({resumeType.toUpperCase()})</span>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-ghost btn-xs text-accent flex items-center gap-1 font-bold hover:underline"
                      onClick={() => setShowResumeModal(true)}
                    >
                      <Eye size={12} /> Preview
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-semibold">
                    ⚠️ No resume uploaded yet. Upload a PDF or Image resume below.
                  </div>
                )}

                <button 
                  type="button" 
                  className="btn btn-outline btn-sm w-full mt-2 flex items-center justify-center gap-1.5"
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={isUploadingResume}
                >
                  <Upload size={14} /> {isUploadingResume ? 'Saving Resume...' : resumeFile ? 'Update Resume File' : 'Upload Resume (PDF/Image)'}
                </button>
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="card p-6">
            <h3 className="section-title">Contact & Social</h3>
            <div className="flex flex-col gap-3 mt-4 text-xs text-secondary">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-accent" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-accent" />
                <span>{profileData.phone || 'Phone not specified'}</span>
              </div>
              {profileData.linkedin && (
                <div className="flex items-center gap-3">
                  <LinkIcon size={16} className="text-accent" />
                  <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
                    View LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPhotoModal && (
        <ProfilePhotoUploader 
          currentSrc={user?.avatarUrl || profileData.avatarUrl}
          userName={`${profileData.firstName} ${profileData.lastName}`}
          userRole={user?.role || 'default'}
          onSave={(newPhoto) => updateUser({ avatarUrl: newPhoto })}
          onClose={() => setShowPhotoModal(false)}
        />
      )}

      {showResumeModal && (
        <ResumeViewerModal 
          alumniName={`${profileData.firstName} ${profileData.lastName}`}
          alumniRole={displayRole}
          avatarUrl={user?.avatarUrl || profileData.avatarUrl}
          resumeUrl={resumeFile}
          resumeType={resumeType}
          alumniData={{ ...profileData, ...user }}
          onClose={() => setShowResumeModal(false)}
        />
      )}
    </div>
  );
}
