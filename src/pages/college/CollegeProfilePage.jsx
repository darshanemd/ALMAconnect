import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Building, Save, Plus, X, CheckCircle, Mail, MapPin, Calendar, Hash } from 'lucide-react';
import './CollegeProfilePage.css';

export default function CollegeProfilePage() {
  const { user } = useAuth();
  const { colleges, updateCollege } = useData();
  
  // Find current admin's college
  const college = colleges.find(c => c.id === user?.collegeId);

  // State for form fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [location, setLocation] = useState('');
  const [established, setEstablished] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [departments, setDepartments] = useState([]);
  
  // Tag manager state
  const [newDeptInput, setNewDeptInput] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Sync state when college data is loaded
  useEffect(() => {
    if (college) {
      setName(college.name || '');
      setCode(college.code || '');
      setLocation(college.location || '');
      setEstablished(college.established || '');
      setAdminEmail(college.adminEmail || '');
      setDepartments(college.departments || []);
    }
  }, [college]);

  if (!college) {
    return (
      <div className="college-profile-page text-center p-8">
        <div className="card max-w-lg mx-auto p-12">
          <Building size={48} className="text-secondary mx-auto mb-4" />
          <h3>No College Associated</h3>
          <p className="text-secondary">Your administrator account is not linked to any active college profile.</p>
        </div>
      </div>
    );
  }

  const handleAddDept = (e) => {
    e.preventDefault();
    const cleanInput = newDeptInput.trim();
    if (!cleanInput) return;
    
    if (departments.some(d => d.toLowerCase() === cleanInput.toLowerCase())) {
      setError('Department already exists in the list.');
      return;
    }

    setDepartments([...departments, cleanInput]);
    setNewDeptInput('');
    setError('');
  };

  const handleRemoveDept = (deptIndex) => {
    setDepartments(departments.filter((_, idx) => idx !== deptIndex));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !code.trim() || !location.trim() || !adminEmail.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (departments.length === 0) {
      setError('Please add at least one department.');
      return;
    }

    try {
      updateCollege(college.id, {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        location: location.trim(),
        established: Number(established),
        adminEmail: adminEmail.trim(),
        departments: departments
      });
      
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to update college profile. Please try again.');
    }
  };

  return (
    <div className="college-profile-page stagger-children">
      {success && (
        <div className="success-banner">
          <CheckCircle size={20} />
          <span>College profile updated successfully! Changes are saved to database.</span>
        </div>
      )}

      {error && (
        <div className="badge badge-danger w-full gap-2 p-3 mb-6">
          <span>{error}</span>
        </div>
      )}

      <div className="college-profile-card">
        <div className="profile-card-header flex items-center gap-4">
          <div className="avatar avatar-lg" style={{ background: 'var(--accent-bg)', color: 'var(--accent-dark)' }}>
            <Building size={28} />
          </div>
          <div>
            <h2>Manage Institution Profile</h2>
            <p>Modify and save details for {college.name}</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
          <div className="input-group">
            <label htmlFor="col-name">Institution Full Name *</label>
            <div className="input-with-icon">
              <Building className="input-icon" size={18} />
              <input 
                id="col-name" 
                type="text" 
                className="input" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-2 gap-4">
            <div className="input-group">
              <label htmlFor="col-code">Short Code / Abbreviation *</label>
              <div className="input-with-icon">
                <Hash className="input-icon" size={18} />
                <input 
                  id="col-code" 
                  type="text" 
                  className="input" 
                  value={code} 
                  onChange={e => setCode(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="col-est">Year Established *</label>
              <div className="input-with-icon">
                <Calendar className="input-icon" size={18} />
                <input 
                  id="col-est" 
                  type="number" 
                  className="input" 
                  value={established} 
                  onChange={e => setEstablished(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-2 gap-4">
            <div className="input-group">
              <label htmlFor="col-loc">Location (City, State) *</label>
              <div className="input-with-icon">
                <MapPin className="input-icon" size={18} />
                <input 
                  id="col-loc" 
                  type="text" 
                  className="input" 
                  value={location} 
                  onChange={e => setLocation(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="col-email">Contact / Administrative Email *</label>
              <div className="input-with-icon">
                <Mail className="input-icon" size={18} />
                <input 
                  id="col-email" 
                  type="email" 
                  className="input" 
                  value={adminEmail} 
                  onChange={e => setAdminEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>
          </div>

          <div className="input-group">
            <label>Offered Departments / Branches *</label>
            <div className="tag-manager-container mt-2">
              <div className="tag-manager-tags">
                {departments.map((dept, index) => (
                  <span key={index} className="tag-item">
                    {dept}
                    <button 
                      type="button" 
                      className="tag-remove-btn" 
                      onClick={() => handleRemoveDept(index)}
                      aria-label={`Remove ${dept} department`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              
              <div className="tag-input-row mt-2">
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. Information Science, Biotechnology" 
                  value={newDeptInput}
                  onChange={e => setNewDeptInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDept(e);
                    }
                  }}
                />
                <button 
                  type="button" 
                  className="btn btn-secondary flex items-center gap-1"
                  onClick={handleAddDept}
                >
                  <Plus size={16} /> Add
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="submit" className="btn btn-primary flex-1 flex items-center justify-center gap-2">
              <Save size={18} /> Save Institution Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
