import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { apiRequest } from '../../utils/api';
import { 
  Shield, Search, Check, X, Edit, Trash2, UserPlus, Save, Building, GraduationCap, Plus, AlertCircle,
  Mail, CheckSquare, Square, Send, Eye, FileText, CheckCircle2, History, Sparkles, Lock, ExternalLink,
  Settings, RefreshCw, Copy, CheckCheck, HelpCircle, KeyRound, Server
} from 'lucide-react';
import './VerificationPage.css';

export default function VerificationPage() {
  const { user } = useAuth();
  const { 
    colleges = [],
    getAlumni, 
    verifyAlumni, 
    bulkVerifyAlumni,
    rejectAlumni, 
    bulkRejectAlumni,
    addManualStudentRegistration, 
    addManualAlumniRegistration, 
    deleteMember, 
    updateMember,
    preVerifiedStudents,
    removePreVerifiedStudent,
    emailLogs = []
  } = useData();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'students', 'alumni', 'preverified'
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Gmail SMTP Settings Modal State
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [smtpModalTab, setSmtpModalTab] = useState('tester'); // 'tester', 'guide', 'logs'
  const [smtpStatus, setSmtpStatus] = useState({ configured: false, user: null });
  const [smtpLoading, setSmtpLoading] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState(user?.email || 'admin@demo.com');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailSuccess, setTestEmailSuccess] = useState('');
  const [testEmailError, setTestEmailError] = useState('');
  const [copiedEnv, setCopiedEnv] = useState(false);

  // Email Template & Approval Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [singleApproveTarget, setSingleApproveTarget] = useState(null); // null if bulk, or member object
  const [sendEmailToggle, setSendEmailToggle] = useState(true);
  const [emailSubject, setEmailSubject] = useState('Welcome to {collegeName} Alumni Portal - Your Account is Verified!');
  const [emailBody, setEmailBody] = useState(`Dear {firstName} {lastName},

Congratulations! Your registration request for {collegeName} has been officially verified and approved.

Here are your account access details and login portal link:
--------------------------------------------------
• Portal Login Link: {loginUrl}
• Username / Email: {email}
• Roll Number / Student ID: {rollNumber}
• Password: The secure password you created during registration
--------------------------------------------------

Please click the link above to log in to your portal. (If you ever forget your password, use the "Forgot Password?" option on the login page to verify via Gmail OTP).

Warm regards,
{collegeName} Administration`);
  const [emailModalTab, setEmailModalTab] = useState('edit'); // 'edit' or 'preview'
  const [showEmailLogsModal, setShowEmailLogsModal] = useState(false);
  const [logDetail, setLogDetail] = useState(null);
  const [proofModalImage, setProofModalImage] = useState(null);

  useEffect(() => {
    if (!proofModalImage) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setProofModalImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [proofModalImage]);

  // Fetch SMTP status
  const fetchSmtpStatus = async () => {
    setSmtpLoading(true);
    try {
      const res = await apiRequest('/emails/smtp-status');
      setSmtpStatus(res);
    } catch (err) {
      console.warn('Failed to load SMTP status:', err);
    } finally {
      setSmtpLoading(false);
    }
  };

  useEffect(() => {
    fetchSmtpStatus();
  }, []);

  const handleSendTestEmail = async (e) => {
    e.preventDefault();
    setTestEmailError('');
    setTestEmailSuccess('');
    setTestEmailLoading(true);
    try {
      const res = await apiRequest('/emails/test-smtp', 'POST', { to: testEmailAddress.trim() });
      setTestEmailSuccess(res.message || `Test email dispatched to ${testEmailAddress}! Check your inbox.`);
      fetchSmtpStatus();
    } catch (err) {
      setTestEmailError(err.message || 'Failed to dispatch test email. Please verify GMAIL_USER and GMAIL_APP_PASSWORD in server/.env.');
    } finally {
      setTestEmailLoading(false);
    }
  };

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText(`GMAIL_USER=your.college.email@gmail.com\nGMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx\nEMAIL_FROM_NAME="AlumniConnect Portal"`);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  // Manual Add Form State
  const [addForm, setAddForm] = useState({
    role: 'student',
    rollNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: 'demo123',
    collegeId: user?.collegeId || 'col-1',
    department: '',
    degree: '',
    graduationYear: '',
    currentCompany: '',
    currentRole: '',
    location: '',
    skills: '',
    bio: ''
  });

  // Edit Form State
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    degree: '',
    graduationYear: '',
    rollNumber: '',
    currentCompany: '',
    currentRole: '',
    location: '',
    skills: '',
    bio: ''
  });

  // Filtered Lists
  const pendingList = useMemo(() => {
    return getAlumni({ collegeId: user?.collegeId, status: 'pending', search });
  }, [getAlumni, user?.collegeId, search]);

  const studentsList = useMemo(() => {
    return getAlumni({ 
      collegeId: user?.collegeId, 
      status: 'active', 
      role: 'student',
      search,
      department: deptFilter || undefined,
      graduationYear: yearFilter ? Number(yearFilter) : undefined
    });
  }, [getAlumni, user?.collegeId, search, deptFilter, yearFilter]);

  const alumniList = useMemo(() => {
    return getAlumni({ 
      collegeId: user?.collegeId, 
      status: 'active', 
      role: 'alumni',
      search,
      department: deptFilter || undefined,
      graduationYear: yearFilter ? Number(yearFilter) : undefined
    });
  }, [getAlumni, user?.collegeId, search, deptFilter, yearFilter]);

  const preverifiedList = useMemo(() => {
    const list = preVerifiedStudents.filter(s => s.collegeId === user?.collegeId);
    if (!search.trim()) return list;
    const query = search.toLowerCase();
    return list.filter(s => 
      s.rollNumber?.toLowerCase().includes(query) ||
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query) ||
      s.department?.toLowerCase().includes(query)
    );
  }, [preVerifiedStudents, search, user?.collegeId]);

  const currentCollegeObj = colleges.find(c => c.id === user?.collegeId);
  const activeCollege = currentCollegeObj?.name || 'College';

  // Checkbox selection helpers
  const isAllPendingSelected = pendingList.length > 0 && pendingList.every(m => selectedIds.includes(m.id));

  const toggleSelectAll = () => {
    if (isAllPendingSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingList.map(m => m.id));
    }
  };

  const toggleSelectMember = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Approval Handlers with Custom Email Template Modal
  const handleOpenSingleApproveModal = (member) => {
    setSingleApproveTarget(member);
    setEmailModalTab('edit');
    setShowEmailModal(true);
  };

  const handleOpenBulkApproveModal = () => {
    if (selectedIds.length === 0) return;
    setSingleApproveTarget(null);
    setEmailModalTab('edit');
    setShowEmailModal(true);
  };

  const confirmApproveAndDispatch = async () => {
    const targets = singleApproveTarget ? [singleApproveTarget.id] : selectedIds;
    if (targets.length === 0) return;
    
    await bulkVerifyAlumni(targets, {
      sendEmail: sendEmailToggle,
      subject: singleApproveTarget ? formatEmailText(emailSubject, singleApproveTarget) : emailSubject,
      body: singleApproveTarget ? formatEmailText(emailBody, singleApproveTarget) : emailBody
    });

    if (!singleApproveTarget) {
      setSelectedIds([]);
    }

    setShowEmailModal(false);
    setSingleApproveTarget(null);
    alert(`Successfully approved ${targets.length} member(s)${sendEmailToggle ? ' and dispatched welcome verification emails via Gmail SMTP' : ''}!`);
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Are you sure you want to reject ${selectedIds.length} registration request(s)?`)) {
      await bulkRejectAlumni(selectedIds);
      setSelectedIds([]);
      alert(`Rejected ${selectedIds.length} registration request(s).`);
    }
  };

  const handleSingleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this request?')) {
      rejectAlumni(id);
    }
  };

  // Helper to substitute dynamic placeholders for live preview
  const formatEmailText = (text, member) => {
    if (!text) return '';
    const sampleMember = member || pendingList.find(m => selectedIds.includes(m.id)) || pendingList[0] || {
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@example.com',
      rollNumber: '1NT21CS089',
      password: 'demo123'
    };

    const loginUrl = window.location.origin + '/login';
    const tempPassword = sampleMember.password || 'demo123';
    const rollNumber = sampleMember.rollNumber || '1NT21CS089';

    return text
      .replaceAll('{firstName}', sampleMember.firstName || 'Student')
      .replaceAll('{lastName}', sampleMember.lastName || '')
      .replaceAll('{email}', sampleMember.email || 'user@example.com')
      .replaceAll('{rollNumber}', rollNumber)
      .replaceAll('{collegeName}', activeCollege)
      .replaceAll('{loginUrl}', loginUrl)
      .replaceAll('{tempPassword}', tempPassword);
  };

  // Tag Pill Insertion
  const insertTag = (tag) => {
    setEmailBody(prev => prev + ' ' + tag);
  };

  // Handle Delete
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete member ${name}?`)) {
      deleteMember(id);
      alert('Member deleted.');
    }
  };

  // Open Edit Modal
  const openEditModal = (member) => {
    setEditingMember(member);
    setEditForm({
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      email: member.email || '',
      phone: member.phone || '',
      department: member.department || '',
      degree: member.degree || '',
      graduationYear: member.graduationYear || '',
      rollNumber: member.rollNumber || '',
      currentCompany: member.currentCompany || '',
      currentRole: member.currentRole || '',
      location: member.location || '',
      skills: member.skills ? member.skills.join(', ') : '',
      bio: member.bio || ''
    });
    setShowEditModal(true);
  };

  // Save Edit Member
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editForm.firstName || !editForm.lastName || !editForm.email) {
      alert('First Name, Last Name and Email are required.');
      return;
    }

    const skillsArray = editForm.skills
      ? editForm.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    updateMember(editingMember.id, {
      ...editForm,
      graduationYear: Number(editForm.graduationYear),
      skills: skillsArray
    });

    setShowEditModal(false);
    setEditingMember(null);
    alert('Member details updated successfully!');
  };

  // Save Add Manual Member
  const handleAddManual = async (e) => {
    e.preventDefault();
    if (!addForm.firstName || !addForm.lastName || !addForm.email || !addForm.department || !addForm.degree || !addForm.graduationYear) {
      alert('Please fill out all required fields.');
      return;
    }

    const skillsArray = addForm.skills
      ? addForm.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      : [];

    const memberData = {
      firstName: addForm.firstName,
      lastName: addForm.lastName,
      email: addForm.email,
      phone: addForm.phone,
      password: addForm.password || 'demo123',
      collegeId: user?.collegeId || 'col-1',
      department: addForm.department,
      degree: addForm.degree,
      graduationYear: Number(addForm.graduationYear),
      currentCompany: addForm.currentCompany || null,
      currentRole: addForm.currentRole || (addForm.role === 'student' ? 'Student' : ''),
      location: addForm.location || '',
      skills: skillsArray,
      bio: addForm.bio || '',
      isVerified: true,
      status: 'active'
    };

    try {
      if (addForm.role === 'student') {
        if (!addForm.rollNumber) {
          alert('Roll number is required for students.');
          return;
        }
        await addManualStudentRegistration({
          ...memberData,
          rollNumber: addForm.rollNumber
        });
      } else {
        await addManualAlumniRegistration(memberData);
      }

      setAddForm({
        role: 'student',
        rollNumber: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: 'demo123',
        collegeId: user?.collegeId || 'col-1',
        department: '',
        degree: '',
        graduationYear: '',
        currentCompany: '',
        currentRole: '',
        location: '',
        skills: '',
        bio: ''
      });
      setShowAddModal(false);
      alert('Member added successfully as Verified!');
    } catch (err) {
      alert('Failed to add member: ' + (err.message || 'Duplicate email or invalid data.'));
    }
  };

  // Representative sample member for preview rendering
  const previewTargetMember = singleApproveTarget || pendingList.find(m => selectedIds.includes(m.id)) || {
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@example.com',
    rollNumber: '1NT21CS089',
    password: 'demo123'
  };

  return (
    <div className="verification-page stagger-children animate-fade-in">
      {/* Header Info */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2>Member Database & Verification Tools</h2>
          <p className="text-xs text-secondary">Manage registration verification, bulk approvals, automated credentials emails, and pre-verification for {activeCollege}.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => {
              fetchSmtpStatus();
              setShowSmtpModal(true);
            }}
            className="btn btn-outline flex items-center gap-1.5 text-xs font-bold"
            title="Configure Gmail SMTP & Test Dispatcher"
          >
            <Mail size={15} className="text-accent" /> Gmail SMTP Settings
            {smtpStatus?.configured ? (
              <span className="badge badge-success text-[10px] py-0.5 px-1.5">Active</span>
            ) : (
              <span className="badge badge-warning text-[10px] py-0.5 px-1.5">Setup</span>
            )}
          </button>
          <button 
            onClick={() => setShowEmailLogsModal(true)} 
            className="btn btn-secondary flex items-center gap-2"
            title="View Dispatched Email History"
          >
            <History size={16} /> Dispatched Emails ({emailLogs.length})
          </button>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="btn btn-primary flex items-center gap-2"
          >
            <UserPlus size={16} /> Add Member Manually
          </button>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="filter-bar flex justify-between items-center gap-4 bg-surface p-2 border rounded-lg">
        <div className="tabs border-none p-0">
          <button className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
            Pending Requests ({pendingList.length})
          </button>
          <button className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
            Active Students ({studentsList.length})
          </button>
          <button className={`tab-btn ${activeTab === 'alumni' ? 'active' : ''}`} onClick={() => setActiveTab('alumni')}>
            Active Alumni ({alumniList.length})
          </button>
          <button className={`tab-btn ${activeTab === 'preverified' ? 'active' : ''}`} onClick={() => setActiveTab('preverified')}>
            Pre-Verified List ({preverifiedList.length})
          </button>
        </div>
      </div>

      {/* Bulk Actions Floating Bar (Visible when candidates are selected in Pending tab) */}
      {activeTab === 'pending' && selectedIds.length > 0 && (
        <div className="bulk-action-bar">
          <div className="bulk-action-info">
            <span className="bulk-count-badge">{selectedIds.length} Selected</span>
            <span className="text-sm font-medium">Bulk verification & credential tools ready</span>
          </div>
          <div className="bulk-action-buttons">
            <button 
              onClick={handleOpenBulkApproveModal}
              className="btn btn-sm btn-primary flex items-center gap-1"
            >
              <Mail size={14} /> Approve Selected & Send Credentials ({selectedIds.length})
            </button>
            <button 
              onClick={handleBulkReject}
              className="btn btn-sm btn-secondary text-danger flex items-center gap-1"
            >
              <X size={14} /> Reject Selected ({selectedIds.length})
            </button>
            <button 
              onClick={() => setSelectedIds([])}
              className="btn btn-sm btn-ghost"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Database Filters Bar (Shown for active databases) */}
      {(activeTab === 'students' || activeTab === 'alumni') && (
        <div className="grid grid-4 gap-4 p-4 bg-surface border rounded-lg animate-scale-up">
          <div className="input-group">
            <label className="text-xs font-semibold">Search by Name/Email</label>
            <div className="input-with-icon">
              <Search className="input-icon" size={16} />
              <input 
                type="text" 
                className="input input-sm" 
                placeholder="e.g. Rahul..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
          </div>
          
          <div className="input-group">
            <label className="text-xs font-semibold">Department</label>
            <select 
              className="select input-sm" 
              value={deptFilter} 
              onChange={e => setDeptFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Science">Information Science</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="MBA">MBA</option>
            </select>
          </div>

          <div className="input-group">
            <label className="text-xs font-semibold">Graduation Year</label>
            <input 
              type="number" 
              className="input input-sm" 
              placeholder="e.g. 2024" 
              value={yearFilter} 
              onChange={e => setYearFilter(e.target.value)} 
            />
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => { setSearch(''); setDeptFilter(''); setYearFilter(''); }} 
              className="btn btn-secondary btn-sm w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Search Bar for Pending & Pre-verified */}
      {(activeTab === 'pending' || activeTab === 'preverified') && (
        <div className="search-bar w-full max-width-full animate-scale-up" style={{ maxWidth: '100%' }}>
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            className="input w-full" 
            placeholder={activeTab === 'pending' ? "Search pending requests by name or email..." : "Search pre-verified list..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Table Container */}
      <div className="card">
        {/* PENDING APPROVALS TAB */}
        {activeTab === 'pending' && (
          pendingList.length === 0 ? (
            <div className="empty-state p-12 text-center">
              <div className="empty-icon"><Shield size={32} /></div>
              <h3>No Registration Requests</h3>
              <p>There are no pending student or alumni requests awaiting approval.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }} className="text-center">
                      <input 
                        type="checkbox"
                        className="custom-checkbox"
                        checked={isAllPendingSelected}
                        onChange={toggleSelectAll}
                        title="Select All Pending Candidates"
                      />
                    </th>
                    <th>Candidate</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Year & Degree</th>
                    <th>Email & Contact</th>
                    <th>Identity Proof</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingList.map(member => {
                    const isSelected = selectedIds.includes(member.id);
                    return (
                      <tr key={member.id} className={isSelected ? 'bg-surface-hover' : ''}>
                        <td className="text-center">
                          <input 
                            type="checkbox"
                            className="custom-checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectMember(member.id)}
                          />
                        </td>
                        <td>
                          <div className="font-semibold">{member.firstName} {member.lastName}</div>
                          {member.rollNumber && <span className="text-xs text-secondary font-mono">Roll: {member.rollNumber}</span>}
                        </td>
                        <td>
                          <span className={`badge ${member.role === 'student' ? 'badge-info' : 'badge-accent'}`}>
                            {member.role === 'student' ? 'Student' : 'Alumni'}
                          </span>
                        </td>
                        <td>{member.department}</td>
                        <td>{member.degree} (Class of {member.graduationYear})</td>
                        <td>
                          <div className="text-sm">{member.email}</div>
                          <div className="text-xs text-secondary">{member.phone || 'No phone'}</div>
                        </td>
                        <td>
                          {member.idProofUrl ? (
                            <button 
                              type="button"
                              onClick={() => setProofModalImage(member.idProofUrl)}
                              className="btn btn-xs btn-secondary flex items-center gap-1.5 text-accent font-semibold hover:bg-accent-bg border border-accent/30 py-1 px-2 rounded-md"
                              title="Click to inspect uploaded College ID or Study Certificate"
                            >
                              <FileText size={12} />
                              <span>View ID Card</span>
                            </button>
                          ) : (
                            <span className="text-xs text-secondary italic">None</span>
                          )}
                        </td>
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleOpenSingleApproveModal(member)} 
                              className="btn btn-sm btn-primary flex items-center gap-1"
                              title="Approve Member & Custom Email"
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button 
                              onClick={() => handleSingleReject(member.id)} 
                              className="btn btn-sm btn-secondary text-danger flex items-center gap-1"
                              title="Reject Request"
                            >
                              <X size={14} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* ACTIVE STUDENTS TAB */}
        {activeTab === 'students' && (
          studentsList.length === 0 ? (
            <div className="empty-state p-12 text-center">
              <div className="empty-icon"><GraduationCap size={32} /></div>
              <h3>No Active Students</h3>
              <p>No student accounts match the active filters.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Degree</th>
                    <th>Class of</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsList.map(student => (
                    <tr key={student.id}>
                      <td className="font-semibold font-mono">{student.rollNumber || 'N/A'}</td>
                      <td>
                        <div className="font-semibold">{student.firstName} {student.lastName}</div>
                        <div className="text-xs text-secondary">Joined: {new Date(student.joinedDate).toLocaleDateString()}</div>
                      </td>
                      <td>{student.email}</td>
                      <td>{student.department}</td>
                      <td>{student.degree}</td>
                      <td>{student.graduationYear}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(student)} 
                            className="btn btn-sm btn-ghost text-accent p-1"
                            title="Edit Details"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(student.id, `${student.firstName} ${student.lastName}`)} 
                            className="btn btn-sm btn-ghost text-danger p-1"
                            title="Delete Student"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* ACTIVE ALUMNI TAB */}
        {activeTab === 'alumni' && (
          alumniList.length === 0 ? (
            <div className="empty-state p-12 text-center">
              <div className="empty-icon"><Building size={32} /></div>
              <h3>No Active Alumni</h3>
              <p>No alumni profiles match the active filters.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company & Designation</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Degree & Class</th>
                    <th>Location</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alumniList.map(alum => (
                    <tr key={alum.id}>
                      <td>
                        <div className="font-semibold">{alum.firstName} {alum.lastName}</div>
                        <div className="text-xs text-secondary">ID: {alum.id}</div>
                      </td>
                      <td>
                        {alum.currentCompany ? (
                          <>
                            <div className="font-semibold">{alum.currentCompany}</div>
                            <div className="text-xs text-secondary">{alum.currentRole}</div>
                          </>
                        ) : (
                          <span className="text-xs text-secondary font-italic">No Job Listed</span>
                        )}
                      </td>
                      <td>{alum.email}</td>
                      <td>{alum.department}</td>
                      <td>{alum.degree} ({alum.graduationYear})</td>
                      <td>{alum.location || 'N/A'}</td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(alum)} 
                            className="btn btn-sm btn-ghost text-accent p-1"
                            title="Edit Details"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(alum.id, `${alum.firstName} ${alum.lastName}`)} 
                            className="btn btn-sm btn-ghost text-danger p-1"
                            title="Delete Alumni"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* PRE-VERIFIED STUDENTS TAB */}
        {activeTab === 'preverified' && (
          preverifiedList.length === 0 ? (
            <div className="empty-state p-12 text-center">
              <div className="empty-icon"><Check size={32} /></div>
              <h3>No Pre-verified Entries</h3>
              <p>No pre-verified student records found. Add them via CSV or manually.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Degree</th>
                    <th>Class of</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {preverifiedList.map(stud => (
                    <tr key={stud.rollNumber}>
                      <td className="font-semibold font-mono">{stud.rollNumber}</td>
                      <td>{stud.firstName} {stud.lastName}</td>
                      <td>{stud.email}</td>
                      <td>{stud.department}</td>
                      <td>{stud.degree}</td>
                      <td>{stud.expectedGraduationYear || stud.graduationYear}</td>
                      <td className="text-right">
                        <button 
                          onClick={() => {
                            if (window.confirm(`Remove pre-verification for ${stud.firstName} ${stud.lastName}?`)) {
                              removePreVerifiedStudent(stud.rollNumber);
                            }
                          }} 
                          className="btn btn-ghost text-danger p-1"
                          title="Remove Pre-verification"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* CUSTOM EMAIL TEMPLATE & APPROVAL MODAL */}
      {showEmailModal && (
        <div className="modal-backdrop">
          <div className="modal animate-scale-up" style={{ maxWidth: '720px' }}>
            <div className="modal-header">
              <div>
                <h3><Mail size={18} /> Automated Approval & Credential Dispatch</h3>
                <p className="text-xs text-secondary mt-1">
                  {singleApproveTarget 
                    ? `Approving candidate: ${singleApproveTarget.firstName} ${singleApproveTarget.lastName} (${singleApproveTarget.email})`
                    : `Bulk Approval for ${selectedIds.length} selected candidate(s)`}
                </p>
              </div>
              <button onClick={() => setShowEmailModal(false)} className="btn btn-ghost p-1"><X size={18} /></button>
            </div>

            <div className="modal-body flex flex-col gap-4">
              {/* Candidate ID Proof Banner if single approval */}
              {singleApproveTarget && singleApproveTarget.idProofUrl && (
                <div className="flex items-center justify-between p-3.5 bg-accent-bg/40 border border-accent/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <img 
                      src={singleApproveTarget.idProofUrl} 
                      alt="Candidate ID Proof" 
                      className="w-14 h-14 object-cover rounded-lg border border-border shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setProofModalImage(singleApproveTarget.idProofUrl)}
                      title="Click to inspect proof full screen"
                    />
                    <div>
                      <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-accent" />
                        Uploaded Proof of Identity Attached
                      </span>
                      <span className="text-[11px] text-secondary block mt-0.5">
                        {singleApproveTarget.idProofName || 'College ID Card / Study Certificate'}
                      </span>
                      <span className="text-[10px] text-accent font-semibold mt-0.5 inline-block">
                        Click thumbnail to inspect full size
                      </span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setProofModalImage(singleApproveTarget.idProofUrl)}
                    className="btn btn-xs btn-secondary flex items-center gap-1.5 text-accent font-bold"
                  >
                    <Eye size={13} /> View Full ID
                  </button>
                </div>
              )}

              {/* Option toggle */}
              <label className="flex items-center gap-3 p-3 bg-surface border rounded-lg cursor-pointer">
                <input 
                  type="checkbox"
                  className="custom-checkbox"
                  checked={sendEmailToggle}
                  onChange={e => setSendEmailToggle(e.target.checked)}
                />
                <div>
                  <span className="font-semibold text-sm">Send Automated Approval Email with Welcome Link & Credentials</span>
                  <p className="text-xs text-secondary">Dispatch onboarding instructions, temporary portal password, and login URL to candidate email.</p>
                </div>
              </label>

              {sendEmailToggle && (
                <>
                  {/* Navigation tabs */}
                  <div className="modal-nav-tabs">
                    <button 
                      type="button"
                      className={`modal-nav-tab ${emailModalTab === 'edit' ? 'active' : ''}`}
                      onClick={() => setEmailModalTab('edit')}
                    >
                      <FileText size={15} /> Customize Email Template
                    </button>
                    <button 
                      type="button"
                      className={`modal-nav-tab ${emailModalTab === 'preview' ? 'active' : ''}`}
                      onClick={() => setEmailModalTab('preview')}
                    >
                      <Eye size={15} /> Live Email Preview
                    </button>
                  </div>

                  {/* EDIT TEMPLATE TAB */}
                  {emailModalTab === 'edit' && (
                    <div className="flex flex-col gap-4">
                      <div className="input-group">
                        <label className="text-xs font-semibold">Email Subject Line</label>
                        <input 
                          type="text" 
                          className="input" 
                          value={emailSubject}
                          onChange={e => setEmailSubject(e.target.value)}
                        />
                      </div>

                      <div className="input-group">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-semibold">Email Template Body</label>
                          <span className="text-xs text-secondary">Insert Dynamic Tags:</span>
                        </div>
                        
                        {/* Dynamic Tag Pills */}
                        <div className="tag-pills-container">
                          <button type="button" className="tag-pill-btn" onClick={() => insertTag('{firstName}')}>+ {'{firstName}'}</button>
                          <button type="button" className="tag-pill-btn" onClick={() => insertTag('{lastName}')}>+ {'{lastName}'}</button>
                          <button type="button" className="tag-pill-btn" onClick={() => insertTag('{email}')}>+ {'{email}'}</button>
                          <button type="button" className="tag-pill-btn" onClick={() => insertTag('{rollNumber}')}>+ {'{rollNumber}'}</button>
                          <button type="button" className="tag-pill-btn" onClick={() => insertTag('{collegeName}')}>+ {'{collegeName}'}</button>
                          <button type="button" className="tag-pill-btn" onClick={() => insertTag('{loginUrl}')}>+ {'{loginUrl}'}</button>
                          <button type="button" className="tag-pill-btn" onClick={() => insertTag('{tempPassword}')}>+ {'{tempPassword}'}</button>
                        </div>

                        <textarea 
                          className="textarea mt-2" 
                          rows={8}
                          value={emailBody}
                          onChange={e => setEmailBody(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* LIVE PREVIEW TAB */}
                  {emailModalTab === 'preview' && (
                    <div className="email-preview-card">
                      <div className="email-preview-header">
                        <h4>{formatEmailText(emailSubject, previewTargetMember)}</h4>
                        <div className="email-preview-sub">From: {activeCollege} Admin &lt;noreply@{activeCollege.toLowerCase().replace(/\s+/g, '')}.edu&gt;</div>
                        <div className="email-preview-sub">To: {previewTargetMember.firstName} {previewTargetMember.lastName} &lt;{previewTargetMember.email}&gt;</div>
                      </div>
                      
                      <div className="email-preview-body">
                        {formatEmailText(emailBody, previewTargetMember)}

                        <div className="email-credentials-box">
                          <div className="font-semibold text-xs text-primary mb-1">🔑 DISPATCHED CREDENTIAL SUMMARY</div>
                          <div>Login URL: <a href={window.location.origin + '/login'} target="_blank" rel="noreferrer" className="text-accent underline">{window.location.origin}/login</a></div>
                          <div>User Email: {previewTargetMember.email}</div>
                          {previewTargetMember.rollNumber && <div>Roll Number: {previewTargetMember.rollNumber}</div>}
                          <div>Temporary Access Password: <span className="font-bold text-accent">{previewTargetMember.password || 'demo123'}</span></div>
                        </div>

                        <div className="mt-4">
                          <a href="#" onClick={e => e.preventDefault()} className="email-cta-button">
                            Complete Portal Onboarding &rarr;
                          </a>
                        </div>
                      </div>

                      <div className="email-preview-footer">
                        Sent via {activeCollege} Alumni Verification Automated System &bull; Secure Encrypted Dispatch
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="modal-footer flex justify-between items-center">
              <button type="button" onClick={() => setShowEmailModal(false)} className="btn btn-secondary">Cancel</button>
              <button 
                type="button" 
                onClick={confirmApproveAndDispatch} 
                className="btn btn-primary flex items-center gap-2"
              >
                <Send size={16} /> Confirm Approval & Dispatch ({singleApproveTarget ? 1 : selectedIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GMAIL SMTP SETTINGS & TEST DISPATCHER MODAL */}
      {showSmtpModal && (
        <div className="modal-backdrop" style={{ zIndex: 9999 }} onClick={() => setShowSmtpModal(false)}>
          <div className="modal animate-scale-up" style={{ maxWidth: '760px', maxHeight: '90vh', overflowY: 'auto', borderRadius: 16 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header flex justify-between items-center pb-3 border-b">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-accent/10 text-accent rounded-lg">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary flex items-center gap-2">
                    Gmail SMTP Service & Dispatcher
                    {smtpStatus?.configured ? (
                      <span className="badge badge-success text-[10px] py-0.5 px-2 font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} /> Connected
                      </span>
                    ) : (
                      <span className="badge badge-warning text-[10px] py-0.5 px-2 font-bold flex items-center gap-1">
                        <AlertCircle size={11} /> Setup Required
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    Automated email delivery for Password Reset OTPs and Verified Member Onboarding
                  </p>
                </div>
              </div>
              <button onClick={() => setShowSmtpModal(false)} className="btn btn-ghost p-1"><X size={18} /></button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b px-2 pt-2 bg-slate-50 gap-2">
              <button
                type="button"
                className={`py-2 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  smtpModalTab === 'tester'
                    ? 'border-accent text-accent bg-white rounded-t-lg shadow-sm'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
                onClick={() => setSmtpModalTab('tester')}
              >
                <Send size={14} /> Live Tester & Status
              </button>

              <button
                type="button"
                className={`py-2 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  smtpModalTab === 'guide'
                    ? 'border-accent text-accent bg-white rounded-t-lg shadow-sm'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
                onClick={() => setSmtpModalTab('guide')}
              >
                <Server size={14} /> .env & Setup Guide
              </button>

              <button
                type="button"
                className={`py-2 px-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                  smtpModalTab === 'logs'
                    ? 'border-accent text-accent bg-white rounded-t-lg shadow-sm'
                    : 'border-transparent text-secondary hover:text-primary'
                }`}
                onClick={() => setSmtpModalTab('logs')}
              >
                <History size={14} /> Dispatched Logs ({emailLogs.length})
              </button>
            </div>

            <div className="modal-body py-4">
              
              {/* TAB 1: LIVE TESTER & CONNECTION STATUS */}
              {smtpModalTab === 'tester' && (
                <div className="flex flex-col gap-4">
                  {/* Status Banner */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${smtpStatus?.configured ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center ${smtpStatus?.configured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {smtpStatus?.configured ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-primary flex items-center gap-2">
                          {smtpStatus?.configured ? (
                            <>Connected as <span className="font-mono text-accent">{smtpStatus.user}</span></>
                          ) : (
                            'Gmail SMTP Not Connected'
                          )}
                        </div>
                        <div className="text-[11px] text-secondary mt-0.5">
                          {smtpStatus?.configured ? (
                            'Gmail SSL Port 465 • Ready to dispatch OTPs & Onboarding emails'
                          ) : (
                            'Operating in local demo mode. To dispatch real emails, configure your Google App Password.'
                          )}
                        </div>
                      </div>
                    </div>

                    <button 
                      type="button" 
                      onClick={fetchSmtpStatus} 
                      className="btn btn-secondary btn-sm text-[11px] flex items-center gap-1 font-semibold shrink-0"
                    >
                      <RefreshCw size={12} className={smtpLoading ? 'animate-spin' : ''} /> Check Status
                    </button>
                  </div>

                  {/* Send Live Test Email Card */}
                  <div className="p-4 bg-surface border rounded-xl shadow-xs">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                      <Send size={14} className="text-accent" /> Dispatch Test Email
                    </h4>
                    <p className="text-xs text-secondary mb-3">
                      Verify that your Gmail SMTP connection can successfully reach inboxes by sending a test message.
                    </p>

                    {testEmailError && (
                      <div className="badge badge-danger w-full p-2.5 mb-3 flex items-center gap-2 text-xs font-medium" style={{ borderRadius: 8 }}>
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{testEmailError}</span>
                      </div>
                    )}

                    {testEmailSuccess && (
                      <div className="p-3 mb-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 font-medium">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span>{testEmailSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleSendTestEmail} className="flex gap-2">
                      <input 
                        type="email" 
                        className="input flex-1 text-xs" 
                        placeholder="Enter recipient email (e.g. yourname@gmail.com)"
                        value={testEmailAddress}
                        onChange={e => setTestEmailAddress(e.target.value)}
                        required 
                      />
                      <button 
                        type="submit" 
                        className="btn btn-primary text-xs flex items-center gap-1.5 font-bold shrink-0"
                        disabled={testEmailLoading}
                      >
                        {testEmailLoading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                        <span>Send Test Email</span>
                      </button>
                    </form>
                  </div>

                  {/* Feature Quick Links */}
                  <div className="grid grid-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 border rounded-xl flex items-start gap-2.5">
                      <div className="p-1.5 bg-blue-100 text-blue-700 rounded-md mt-0.5">
                        <KeyRound size={15} />
                      </div>
                      <div>
                        <strong className="text-primary block">Forgot Password OTP</strong>
                        <span className="text-secondary text-[11px] leading-relaxed">
                          Sends 6-digit numeric OTPs with 15-minute expiry to user Gmail addresses.
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border rounded-xl flex items-start gap-2.5">
                      <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-md mt-0.5">
                        <GraduationCap size={15} />
                      </div>
                      <div>
                        <strong className="text-primary block">Member Verification</strong>
                        <span className="text-secondary text-[11px] leading-relaxed">
                          Sends welcome credentials and portal login link when approving students or alumni.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: .ENV CONFIGURATION & SETUP GUIDE */}
              {smtpModalTab === 'guide' && (
                <div className="flex flex-col gap-4">
                  {/* Where to Add Gmail Info Card */}
                  <div className="p-4 bg-surface border rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Server size={16} className="text-accent" />
                        <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Backend Config File</h4>
                      </div>
                      <button 
                        type="button" 
                        onClick={copyEnvSnippet} 
                        className="btn btn-secondary btn-sm text-xs flex items-center gap-1"
                      >
                        {copiedEnv ? <CheckCheck size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        <span>{copiedEnv ? 'Copied!' : 'Copy Template'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-secondary mb-2.5">
                      Open <code className="px-1.5 py-0.5 bg-slate-100 rounded text-primary font-bold">ProjectALMA/server/.env</code> and configure:
                    </p>
                    <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                      <div className="text-slate-400"># GMAIL SMTP CONFIGURATION</div>
                      <div><span className="text-sky-300">GMAIL_USER</span>=<span className="text-emerald-300">"rrcb6513@gmail.com"</span></div>
                      <div><span className="text-sky-300">GMAIL_APP_PASSWORD</span>=<span className="text-amber-300">"jubm scxk tzsj qrck"</span></div>
                      <div><span className="text-sky-300">EMAIL_FROM_NAME</span>=<span className="text-emerald-300">"AlmaConnect Portal"</span></div>
                    </div>
                  </div>

                  {/* Step-by-Step Google App Password Guide */}
                  <div className="p-4 bg-slate-50 border rounded-xl">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                      <KeyRound size={15} className="text-accent" /> How to Generate Google App Password (4 Steps)
                    </h4>
                    <div className="grid grid-2 gap-3 text-xs text-secondary">
                      <div className="p-2.5 bg-white border rounded-lg">
                        <div className="font-bold text-primary mb-1">1. Enable 2-Step Verification</div>
                        <p>Go to your Google Account (<a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-accent underline inline-flex items-center gap-0.5">Security Settings <ExternalLink size={10} /></a>) and enable 2-Step Verification.</p>
                      </div>
                      <div className="p-2.5 bg-white border rounded-lg">
                        <div className="font-bold text-primary mb-1">2. Open App Passwords</div>
                        <p>Visit <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-accent underline inline-flex items-center gap-0.5">myaccount.google.com/apppasswords <ExternalLink size={10} /></a> in your browser.</p>
                      </div>
                      <div className="p-2.5 bg-white border rounded-lg">
                        <div className="font-bold text-primary mb-1">3. Generate Password</div>
                        <p>Enter an app name (e.g. <code>AlmaConnect</code>) and click <strong>Create</strong> to get your 16-character code.</p>
                      </div>
                      <div className="p-2.5 bg-white border rounded-lg">
                        <div className="font-bold text-primary mb-1">4. Paste in server/.env</div>
                        <p>Paste the 16 characters into <code>GMAIL_APP_PASSWORD</code> in <code>server/.env</code> and restart your backend.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DISPATCHED EMAIL LOGS */}
              {smtpModalTab === 'logs' && (
                <div>
                  {emailLogs.length === 0 ? (
                    <div className="empty-state p-8 text-center">
                      <div className="empty-icon"><Mail size={32} /></div>
                      <h4 className="text-sm font-bold mt-2">No Emails Dispatched Yet</h4>
                      <p className="text-xs text-secondary">Dispatched OTPs, test emails, and verification letters will appear here.</p>
                    </div>
                  ) : (
                    <div className="table-container max-h-72 overflow-y-auto border rounded-lg">
                      <table className="table text-xs">
                        <thead>
                          <tr>
                            <th>Recipient</th>
                            <th>Type / Subject</th>
                            <th>Dispatched At</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {emailLogs.map(log => (
                            <tr key={log.id}>
                              <td>
                                <div className="font-semibold text-primary">{log.email || log.recipientEmail}</div>
                                {log.memberName && <div className="text-[11px] text-secondary">{log.memberName}</div>}
                              </td>
                              <td>
                                <div className="font-medium">{log.subject}</div>
                                {log.tempCredentials && <div className="text-[10px] font-mono text-accent">{log.tempCredentials}</div>}
                              </td>
                              <td className="text-secondary">{new Date(log.sentAt).toLocaleString()}</td>
                              <td>
                                <span className="badge badge-success text-[10px] py-0.5 px-2 flex items-center gap-1 w-fit">
                                  <CheckCircle2 size={11} /> {log.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

            </div>

            <div className="modal-footer flex justify-between items-center pt-3 border-t">
              <span className="text-[11px] text-secondary">
                Sender: <strong>{smtpStatus?.configured ? smtpStatus.user : 'Local Fallback'}</strong>
              </span>
              <button type="button" onClick={() => setShowSmtpModal(false)} className="btn btn-primary text-xs font-bold">
                Done & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPATCHED EMAIL LOGS AUDIT MODAL */}
      {showEmailLogsModal && (
        <div className="modal-backdrop">
          <div className="modal animate-scale-up" style={{ maxWidth: '780px' }}>
            <div className="modal-header">
              <h3><History size={18} /> Dispatched Verification Email Logs</h3>
              <button onClick={() => setShowEmailLogsModal(false)} className="btn btn-ghost p-1"><X size={18} /></button>
            </div>
            
            <div className="modal-body">
              {emailLogs.length === 0 ? (
                <div className="empty-state p-8 text-center">
                  <div className="empty-icon"><Mail size={32} /></div>
                  <h4>No Approval Emails Dispatched Yet</h4>
                  <p className="text-xs text-secondary">When candidates are approved with automated emails, dispatch records will appear here.</p>
                </div>
              ) : (
                <div className="table-container max-h-80 overflow-y-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Recipient</th>
                        <th>Subject</th>
                        <th>Dispatched At</th>
                        <th>Credentials Summary</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailLogs.map(log => {
                        const recipientName = log.recipientName || log.memberName || 'Candidate';
                        const recipientEmail = log.recipientEmail || log.email || '';
                        const isSimulated = log.status?.includes('Simulated') || log.status?.includes('Logged');
                        const credsClean = (log.tempCredentials || '')
                          .replace(/Pass:\s*\$2[aby]\$\d+\$[^\s|]+/i, 'Pass: [User Password]');

                        return (
                          <tr key={log.id}>
                            <td>
                              <div className="font-semibold">{recipientName}</div>
                              <div className="text-xs text-secondary">{recipientEmail}</div>
                            </td>
                            <td className="text-xs font-medium">{log.subject}</td>
                            <td className="text-xs text-secondary">{new Date(log.sentAt).toLocaleString()}</td>
                            <td className="text-xs font-mono text-accent">{credsClean || 'Active Account'}</td>
                            <td>
                              <span className={`badge ${isSimulated ? 'badge-warning' : 'badge-success'} flex items-center gap-1`}>
                                <CheckCircle2 size={12} /> {log.status || 'Recorded'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" onClick={() => setShowEmailLogsModal(false)} className="btn btn-secondary">Close Audit Logs</button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal animate-scale-up" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3><Plus size={18} /> Add Verified Member Manually</h3>
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost p-1"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddManual}>
              <div className="modal-body flex flex-col gap-4">
                {/* Role Switcher */}
                <div className="input-group">
                  <label>Member Role *</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="add-role" 
                        checked={addForm.role === 'student'} 
                        onChange={() => setAddForm(prev => ({ ...prev, role: 'student', rollNumber: '' }))} 
                      />
                      <span className="text-sm font-medium">Student</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="add-role" 
                        checked={addForm.role === 'alumni'} 
                        onChange={() => setAddForm(prev => ({ ...prev, role: 'alumni', rollNumber: '' }))} 
                      />
                      <span className="text-sm font-medium">Alumni</span>
                    </label>
                  </div>
                </div>

                {addForm.role === 'student' && (
                  <div className="input-group">
                    <label htmlFor="add-rollNumber">Roll Number / Student ID *</label>
                    <input 
                      id="add-rollNumber" 
                      type="text" 
                      className="input" 
                      placeholder="e.g. 4EG2027101" 
                      value={addForm.rollNumber} 
                      onChange={e => setAddForm(prev => ({ ...prev, rollNumber: e.target.value }))}
                      required 
                    />
                  </div>
                )}

                <div className="grid grid-2 gap-4">
                  <div className="input-group">
                    <label htmlFor="add-firstName">First Name *</label>
                    <input 
                      id="add-firstName" 
                      type="text" 
                      className="input" 
                      placeholder="John" 
                      value={addForm.firstName} 
                      onChange={e => setAddForm(prev => ({ ...prev, firstName: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="add-lastName">Last Name *</label>
                    <input 
                      id="add-lastName" 
                      type="text" 
                      className="input" 
                      placeholder="Doe" 
                      value={addForm.lastName} 
                      onChange={e => setAddForm(prev => ({ ...prev, lastName: e.target.value }))}
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-2 gap-4">
                  <div className="input-group">
                    <label htmlFor="add-email">Email Address *</label>
                    <input 
                      id="add-email" 
                      type="email" 
                      className="input" 
                      placeholder="john.doe@example.com" 
                      value={addForm.email} 
                      onChange={e => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="add-phone">Phone Number</label>
                    <input 
                      id="add-phone" 
                      type="tel" 
                      className="input" 
                      placeholder="+91 98765 43210" 
                      value={addForm.phone} 
                      onChange={e => setAddForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-3 gap-4">
                  <div className="input-group">
                    <label htmlFor="add-department">Department *</label>
                    <select 
                      id="add-department" 
                      className="select" 
                      value={addForm.department} 
                      onChange={e => setAddForm(prev => ({ ...prev, department: e.target.value }))}
                      required
                    >
                      <option value="">Select Dept</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Science">Information Science</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="MBA">MBA</option>
                    </select>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="add-degree">Degree *</label>
                    <select 
                      id="add-degree" 
                      className="select" 
                      value={addForm.degree} 
                      onChange={e => setAddForm(prev => ({ ...prev, degree: e.target.value }))}
                      required
                    >
                      <option value="">Select Degree</option>
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="add-graduationYear">Graduation Year *</label>
                    <input 
                      id="add-graduationYear" 
                      type="number" 
                      className="input" 
                      placeholder="2027" 
                      value={addForm.graduationYear} 
                      onChange={e => setAddForm(prev => ({ ...prev, graduationYear: e.target.value }))}
                      required 
                    />
                  </div>
                </div>

                {addForm.role === 'alumni' && (
                  <>
                    <div className="grid grid-2 gap-4">
                      <div className="input-group">
                        <label htmlFor="add-currentCompany">Current Company</label>
                        <input 
                          id="add-currentCompany" 
                          type="text" 
                          className="input" 
                          placeholder="Google" 
                          value={addForm.currentCompany} 
                          onChange={e => setAddForm(prev => ({ ...prev, currentCompany: e.target.value }))}
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="add-currentRole">Role / Designation</label>
                        <input 
                          id="add-currentRole" 
                          type="text" 
                          className="input" 
                          placeholder="Software Engineer" 
                          value={addForm.currentRole} 
                          onChange={e => setAddForm(prev => ({ ...prev, currentRole: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label htmlFor="add-location">Location (City)</label>
                      <input 
                        id="add-location" 
                        type="text" 
                        className="input" 
                        placeholder="Bengaluru" 
                        value={addForm.location} 
                        onChange={e => setAddForm(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </>
                )}

                <div className="input-group">
                  <label htmlFor="add-skills">Skills (Comma separated)</label>
                  <input 
                    id="add-skills" 
                    type="text" 
                    className="input" 
                    placeholder="React, Java, Python" 
                    value={addForm.skills} 
                    onChange={e => setAddForm(prev => ({ ...prev, skills: e.target.value }))}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary flex items-center gap-1">
                  <Check size={16} /> Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MEMBER MODAL */}
      {showEditModal && (
        <div className="modal-backdrop">
          <div className="modal animate-scale-up" style={{ maxWidth: '640px' }}>
            <div className="modal-header">
              <h3><Edit size={18} /> Edit Member Profile</h3>
              <button onClick={() => setShowEditModal(false)} className="btn btn-ghost p-1"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body flex flex-col gap-4">
                {editingMember?.role === 'student' && (
                  <div className="input-group">
                    <label htmlFor="edit-rollNumber">Roll Number *</label>
                    <input 
                      id="edit-rollNumber" 
                      type="text" 
                      className="input" 
                      value={editForm.rollNumber} 
                      onChange={e => setEditForm(prev => ({ ...prev, rollNumber: e.target.value }))}
                      required 
                    />
                  </div>
                )}

                <div className="grid grid-2 gap-4">
                  <div className="input-group">
                    <label htmlFor="edit-firstName">First Name *</label>
                    <input 
                      id="edit-firstName" 
                      type="text" 
                      className="input" 
                      value={editForm.firstName} 
                      onChange={e => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="edit-lastName">Last Name *</label>
                    <input 
                      id="edit-lastName" 
                      type="text" 
                      className="input" 
                      value={editForm.lastName} 
                      onChange={e => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-2 gap-4">
                  <div className="input-group">
                    <label htmlFor="edit-email">Email Address *</label>
                    <input 
                      id="edit-email" 
                      type="email" 
                      className="input" 
                      value={editForm.email} 
                      onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="edit-phone">Phone Number</label>
                    <input 
                      id="edit-phone" 
                      type="tel" 
                      className="input" 
                      value={editForm.phone} 
                      onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid grid-3 gap-4">
                  <div className="input-group">
                    <label htmlFor="edit-department">Department *</label>
                    <select 
                      id="edit-department" 
                      className="select" 
                      value={editForm.department} 
                      onChange={e => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                      required
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Science">Information Science</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="MBA">MBA</option>
                    </select>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="edit-degree">Degree *</label>
                    <select 
                      id="edit-degree" 
                      className="select" 
                      value={editForm.degree} 
                      onChange={e => setEditForm(prev => ({ ...prev, degree: e.target.value }))}
                      required
                    >
                      <option value="B.Tech">B.Tech</option>
                      <option value="M.Tech">M.Tech</option>
                      <option value="MBA">MBA</option>
                      <option value="B.Sc">B.Sc</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="edit-graduationYear">Graduation Year *</label>
                    <input 
                      id="edit-graduationYear" 
                      type="number" 
                      className="input" 
                      value={editForm.graduationYear} 
                      onChange={e => setEditForm(prev => ({ ...prev, graduationYear: e.target.value }))}
                      required 
                    />
                  </div>
                </div>

                {editingMember?.role !== 'student' && (
                  <>
                    <div className="grid grid-2 gap-4">
                      <div className="input-group">
                        <label htmlFor="edit-currentCompany">Current Company</label>
                        <input 
                          id="edit-currentCompany" 
                          type="text" 
                          className="input" 
                          value={editForm.currentCompany} 
                          onChange={e => setEditForm(prev => ({ ...prev, currentCompany: e.target.value }))}
                        />
                      </div>
                      <div className="input-group">
                        <label htmlFor="edit-currentRole">Role / Designation</label>
                        <input 
                          id="edit-currentRole" 
                          type="text" 
                          className="input" 
                          value={editForm.currentRole} 
                          onChange={e => setEditForm(prev => ({ ...prev, currentRole: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label htmlFor="edit-location">Location (City)</label>
                      <input 
                        id="edit-location" 
                        type="text" 
                        className="input" 
                        value={editForm.location} 
                        onChange={e => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                  </>
                )}

                <div className="input-group">
                  <label htmlFor="edit-skills">Skills (Comma separated)</label>
                  <input 
                    id="edit-skills" 
                    type="text" 
                    className="input" 
                    value={editForm.skills} 
                    onChange={e => setEditForm(prev => ({ ...prev, skills: e.target.value }))}
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="edit-bio">Bio</label>
                  <textarea 
                    id="edit-bio" 
                    className="textarea" 
                    value={editForm.bio} 
                    onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary flex items-center gap-1">
                  <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Identity Proof Inspection Lightbox Modal */}
      {proofModalImage && createPortal(
        <div 
          className="chat-lightbox-backdrop" 
          onClick={() => setProofModalImage(null)}
        >
          <button 
            type="button"
            className="chat-lightbox-close-btn" 
            onClick={() => setProofModalImage(null)}
            title="Close image view (Esc)"
          >
            <X size={24} />
          </button>
          <div className="chat-lightbox-content" onClick={e => e.stopPropagation()}>
            <img 
              src={proofModalImage} 
              alt="Identity Proof / College ID Card" 
              className="chat-lightbox-image" 
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
