import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { parseCSV, validateAlumniCSV, validateStudentCSV } from '../../utils/csv';
import { Upload, Check, AlertTriangle, FileText, ChevronRight, Trash2, Plus, Search, UserPlus, X } from 'lucide-react';
import './CSVUploadPage.css';

export default function CSVUploadPage() {
  const { user } = useAuth();
  const { bulkAddAlumni, preVerifiedStudents, addPreVerifiedStudents, addManualPreVerifiedStudent, removePreVerifiedStudent } = useData();

  const [uploadType, setUploadType] = useState('alumni'); // 'alumni' or 'student'
  const [csvText, setCsvText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [validation, setValidation] = useState(null);
  const [imported, setImported] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Manual Add Student form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [manualStudent, setManualStudent] = useState({
    rollNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    expectedGraduationYear: '',
    degree: ''
  });

  const [studentSearch, setStudentSearch] = useState('');

  const alumniSampleCSV = `firstName,lastName,email,phone,department,graduationYear,degree,skills,currentCompany,currentRole,location,bio
Amit,Patil,amit.patil@example.com,+91 99887 76655,Computer Science,2022,B.Tech,React;NodeJS;JavaScript,Infosys,Software Engineer,Pune,Full stack dev
Kavita,Sethi,kavita.sethi@example.com,+91 99887 76656,MBA,2023,MBA,Strategy;Marketing,Wipro,Associate Consultant,Delhi,Biz strategist`;

  const studentSampleCSV = `rollNumber,firstName,lastName,email,department,expectedGraduationYear,degree
4EG2027003,Aarav,Mehta,aarav.mehta@example.com,Computer Science,2027,B.Tech
4EG2027004,Kriti,Joshi,kriti.joshi@example.com,Information Science,2027,B.Tech`;

  const currentSample = uploadType === 'alumni' ? alumniSampleCSV : studentSampleCSV;

  const handleTypeChange = (type) => {
    setUploadType(type);
    setCsvText('');
    setParsedData(null);
    setValidation(null);
    setImported(false);
  };

  const processFile = (file) => {
    if (!file) return;
    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      alert('Please upload a valid CSV file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setCsvText(text);
      try {
        const parsed = parseCSV(text);
        const valResults = uploadType === 'alumni'
          ? validateAlumniCSV(parsed)
          : validateStudentCSV(parsed);
        setParsedData(parsed);
        setValidation(valResults);
        setImported(false);
      } catch (err) {
        alert('Failed to parse CSV file. Check format guidelines.');
      }
    };
    reader.readAsText(file);
  };

  const handleParse = () => {
    if (!csvText.trim()) return;
    
    try {
      const parsed = parseCSV(csvText);
      const valResults = uploadType === 'alumni'
        ? validateAlumniCSV(parsed)
        : validateStudentCSV(parsed);
      setParsedData(parsed);
      setValidation(valResults);
      setImported(false);
    } catch (e) {
      alert('Failed to parse CSV. Check format guidelines.');
    }
  };

  const handleImport = () => {
    if (!validation || validation.valid.length === 0) return;
    
    const payload = validation.valid.map(record => ({
      ...record,
      collegeId: user?.collegeId
    }));

    if (uploadType === 'alumni') {
      bulkAddAlumni(payload);
    } else {
      addPreVerifiedStudents(payload);
    }
    
    setImported(true);
    setParsedData(null);
    setValidation(null);
    setCsvText('');
  };

  const handleManualInputChange = (e) => {
    const { id, value } = e.target;
    setManualStudent(prev => ({ ...prev, [id]: value }));
  };

  const handleAddManualStudent = (e) => {
    e.preventDefault();
    if (!manualStudent.rollNumber || !manualStudent.firstName || !manualStudent.lastName || !manualStudent.email || !manualStudent.department || !manualStudent.expectedGraduationYear || !manualStudent.degree) {
      alert('Please fill out all fields.');
      return;
    }

    if (preVerifiedStudents.some(s => s.rollNumber.trim().toLowerCase() === manualStudent.rollNumber.trim().toLowerCase())) {
      alert('This student roll number is already pre-verified.');
      return;
    }

    addManualPreVerifiedStudent({
      ...manualStudent,
      expectedGraduationYear: Number(manualStudent.expectedGraduationYear),
      collegeId: user?.collegeId
    });

    setManualStudent({
      rollNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      expectedGraduationYear: '',
      degree: ''
    });
    setShowAddForm(false);
    alert('Student pre-verified successfully!');
  };

  // Filter pre-verified list
  const filteredPreVerified = useMemo(() => {
    const list = preVerifiedStudents.filter(s => s.collegeId === user?.collegeId);
    if (!studentSearch.trim()) return list;
    const query = studentSearch.toLowerCase();
    return list.filter(s => 
      s.rollNumber?.toLowerCase().includes(query) ||
      s.firstName?.toLowerCase().includes(query) ||
      s.lastName?.toLowerCase().includes(query) ||
      s.email?.toLowerCase().includes(query) ||
      s.department?.toLowerCase().includes(query)
    );
  }, [preVerifiedStudents, studentSearch, user?.collegeId]);

  return (
    <div className="csv-upload-page stagger-children animate-fade-in">
      {/* Tab Switcher */}
      <div className="tabs mb-6">
        <button 
          className={`tab-btn ${uploadType === 'alumni' ? 'active' : ''}`} 
          onClick={() => handleTypeChange('alumni')}
        >
          Alumni Records CSV
        </button>
        <button 
          className={`tab-btn ${uploadType === 'student' ? 'active' : ''}`} 
          onClick={() => handleTypeChange('student')}
        >
          Student Pre-Verification CSV
        </button>
      </div>

      <div className="grid grid-3 gap-6">
        {/* Input area (2/3 width) */}
        <div className="grid-span-2 flex flex-col gap-6">
          <div className="card p-6">
            <h3 className="section-title">
              {uploadType === 'alumni' ? 'Upload Alumni CSV Records' : 'Upload Student Pre-Verification CSV'}
            </h3>
            <p className="text-xs text-secondary mb-4">
              {uploadType === 'alumni' 
                ? 'Upload a CSV file or paste raw comma-separated values matching college guidelines to import verified alumni.'
                : 'Upload student roll numbers and emails to allow them to register and get verified automatically.'}
            </p>
            
            <div 
              className={`csv-file-upload-zone ${dragActive ? 'drag-active' : ''}`}
              onDragEnter={e => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
              onDragOver={e => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
              onDragLeave={e => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
              onDrop={e => {
                e.preventDefault();
                e.stopPropagation();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <input 
                type="file" 
                id="csv-file-input" 
                accept=".csv" 
                className="hidden-file-input"
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    processFile(e.target.files[0]);
                  }
                }}
              />
              <label htmlFor="csv-file-input" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={32} className="text-accent" />
                <span className="font-semibold text-sm">Click to choose a CSV file or drag it here</span>
                <span className="text-xs text-secondary">Supports standard comma-separated text files (.csv)</span>
              </label>
            </div>
            
            <div className="text-center text-xs text-secondary my-4 font-semibold">— OR PASTE DATA BELOW —</div>

            <textarea 
              className="textarea csv-textarea" 
              placeholder={currentSample}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              rows="8"
            />
            
            <div className="flex gap-2 justify-end mt-4">
              <button 
                onClick={handleParse} 
                className="btn btn-primary flex items-center gap-2"
                disabled={!csvText.trim()}
              >
                Parse & Validate <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Validation Results */}
          {validation && (
            <div className="card p-6 animate-scale-up">
              <h3 className="section-title">Validation Summary</h3>
              
              <div className="validation-stats-bar mt-4 flex gap-6">
                <div className="val-stat-box text-success">
                  <span className="count font-bold text-xl">{validation.valid.length}</span>
                  <span className="label text-xs">Valid Records ready to import</span>
                </div>
                {validation.invalid.length > 0 && (
                  <div className="val-stat-box text-danger">
                    <span className="count font-bold text-xl">{validation.invalid.length}</span>
                    <span className="label text-xs">Invalid Records containing errors</span>
                  </div>
                )}
              </div>

              {validation.errors.length > 0 && (
                <div className="errors-log-box mt-4 p-4 bg-danger-bg border rounded text-xs text-danger">
                  <h4 className="font-semibold flex items-center gap-1 mb-2"><AlertTriangle size={14} /> Critical Formatting Errors:</h4>
                  <ul className="list-disc pl-4 flex flex-col gap-1">
                    {validation.errors.map((err, idx) => <li key={idx}>{err}</li>)}
                  </ul>
                </div>
              )}

              <div className="table-container mt-6">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Row</th>
                      {uploadType === 'student' && <th>Roll Number</th>}
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validation.valid.map((val, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        {uploadType === 'student' && <td className="font-semibold">{val.rollNumber}</td>}
                        <td>{val.firstName} {val.lastName}</td>
                        <td>{val.email}</td>
                        <td><span className="badge badge-success">Valid</span></td>
                      </tr>
                    ))}
                    {validation.invalid.map((val, idx) => (
                      <tr key={idx} className="bg-danger-bg">
                        <td>{val.row}</td>
                        {uploadType === 'student' && <td className="text-danger">{val.data.rollNumber || 'Missing Roll'}</td>}
                        <td>{val.data.firstName || 'N/A'} {val.data.lastName || 'N/A'}</td>
                        <td className="text-danger">{val.data.email || 'Missing Email'}</td>
                        <td><span className="badge badge-danger">Error</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button 
                  onClick={handleImport} 
                  className="btn btn-primary"
                  disabled={validation.valid.length === 0}
                >
                  {uploadType === 'alumni' 
                    ? `Import Verified Alumni (${validation.valid.length})`
                    : `Import Pre-Verified Students (${validation.valid.length})`}
                </button>
              </div>
            </div>
          )}

          {imported && (
            <div className="card p-6 bg-success-bg border border-success text-center animate-scale-up">
              <Check size={28} className="text-success mx-auto" />
              <h3 className="font-bold text-lg mt-3">Import Successful!</h3>
              <p className="text-xs text-secondary mt-1">
                {uploadType === 'alumni'
                  ? 'Alumni profiles have been imported, verified, and added to the directory database.'
                  : 'Student records have been saved. Matching roll numbers/emails will be auto-approved on registration.'}
              </p>
            </div>
          )}

          {/* Student Pre-verified List (Only shown on student tab) */}
          {uploadType === 'student' && (
            <div className="card p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="section-title mb-0">Pre-Verified Students List</h3>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)} 
                  className="btn btn-secondary btn-sm flex items-center gap-1"
                >
                  {showAddForm ? <X size={14} /> : <UserPlus size={14} />}
                  {showAddForm ? 'Cancel' : 'Add Student Manually'}
                </button>
              </div>

              {/* Manually Add Student Form */}
              {showAddForm && (
                <form onSubmit={handleAddManualStudent} className="card p-4 bg-surface-hover border flex flex-col gap-4 animate-scale-up">
                  <h4 className="font-semibold text-sm flex items-center gap-2"><Plus size={16} /> Pre-Verify Student Details</h4>
                  
                  <div className="grid grid-3 gap-4">
                    <div className="input-group">
                      <label htmlFor="rollNumber">Roll Number *</label>
                      <input id="rollNumber" type="text" className="input" placeholder="4EG2027100" value={manualStudent.rollNumber} onChange={handleManualInputChange} required />
                    </div>
                    <div className="input-group">
                      <label htmlFor="firstName">First Name *</label>
                      <input id="firstName" type="text" className="input" placeholder="Aman" value={manualStudent.firstName} onChange={handleManualInputChange} required />
                    </div>
                    <div className="input-group">
                      <label htmlFor="lastName">Last Name *</label>
                      <input id="lastName" type="text" className="input" placeholder="Gupta" value={manualStudent.lastName} onChange={handleManualInputChange} required />
                    </div>
                  </div>

                  <div className="grid grid-2 gap-4">
                    <div className="input-group">
                      <label htmlFor="email">Email Address *</label>
                      <input id="email" type="email" className="input" placeholder="aman.gupta@example.com" value={manualStudent.email} onChange={handleManualInputChange} required />
                    </div>
                    <div className="input-group">
                      <label htmlFor="department">Department *</label>
                      <select id="department" className="select" value={manualStudent.department} onChange={handleManualInputChange} required>
                        <option value="">Select Dept</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Science">Information Science</option>
                        <option value="Electronics & Communication">Electronics & Communication</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="MBA">MBA</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-2 gap-4">
                    <div className="input-group">
                      <label htmlFor="degree">Degree *</label>
                      <select id="degree" className="select" value={manualStudent.degree} onChange={handleManualInputChange} required>
                        <option value="">Select Degree</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="MBA">MBA</option>
                        <option value="B.Sc">B.Sc</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                    <div className="input-group">
                      <label htmlFor="expectedGraduationYear">Expected Graduation Year *</label>
                      <input id="expectedGraduationYear" type="number" className="input" placeholder="2027" value={manualStudent.expectedGraduationYear} onChange={handleManualInputChange} required />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-2">
                    <button type="submit" className="btn btn-primary flex items-center gap-1">
                      <Check size={16} /> Pre-Verify Student
                    </button>
                  </div>
                </form>
              )}

              {/* Search list */}
              <div className="search-bar w-full">
                <Search className="search-icon" size={16} />
                <input 
                  type="text" 
                  className="input w-full" 
                  placeholder="Search pre-verified list by name, roll number, or department..." 
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                />
              </div>

              {/* Table */}
              {filteredPreVerified.length === 0 ? (
                <div className="text-center p-6 text-secondary text-sm">
                  No pre-verified student records found.
                </div>
              ) : (
                <div className="table-container max-height-300" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                  <table className="table">
                    <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                      <tr>
                        <th>Roll Number</th>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Dept & Degree</th>
                        <th>Class of</th>
                        <th className="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPreVerified.map((stud) => (
                        <tr key={stud.rollNumber}>
                          <td className="font-semibold">{stud.rollNumber}</td>
                          <td>{stud.firstName} {stud.lastName}</td>
                          <td>{stud.email}</td>
                          <td>{stud.department} ({stud.degree})</td>
                          <td>{stud.expectedGraduationYear || stud.graduationYear}</td>
                          <td className="text-right">
                            <button 
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove pre-verification for ${stud.firstName} ${stud.lastName}?`)) {
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
              )}
            </div>
          )}
        </div>

        {/* Templates guide (1/3 width) */}
        <div className="card p-6 height-fit">
          <h3 className="section-title">Format Specifications</h3>
          <p className="text-xs text-secondary mt-1">Make sure the CSV matches the following header tokens exactly:</p>
          
          {uploadType === 'alumni' ? (
            <div className="spec-tokens-list mt-4 flex flex-col gap-2">
              <div className="token-spec-box text-xs">
                <code className="font-semibold">firstName *</code> - First name
              </div>
              <div className="token-spec-box text-xs">
                <code className="font-semibold">lastName *</code> - Last name
              </div>
              <div className="token-spec-box text-xs">
                <code className="font-semibold">email *</code> - Unique email address
              </div>
              <div className="token-spec-box text-xs">
                <code className="font-semibold">department *</code> - Department (e.g. Computer Science)
              </div>
              <div className="token-spec-box text-xs">
                <code className="font-semibold">graduationYear *</code> - 4-digit number (e.g. 2022)
              </div>
              <div className="token-spec-box text-xs">
                <code className="font-semibold">degree *</code> - Degree (e.g. B.Tech / MBA)
              </div>
              <div className="token-spec-box text-xs">
                <code>skills</code> - Semicolon separated list (e.g. React;NodeJS)
              </div>
            </div>
          ) : (
            <div className="spec-tokens-list mt-4 flex flex-col gap-2">
              <div className="token-spec-box text-xs">
                <code className="font-semibold">rollNumber *</code> - Unique roll number / student ID
              </div>
              <div className="token-spec-box text-xs">
                <code className="font-semibold">firstName *</code> - First name
              </div>
              <div className="token-spec-box text-xs">
                <code className="font-semibold">lastName *</code> - Last name
              </div>
              <div className="token-spec-box text-xs">
                <code className="font-semibold">email *</code> - Student college email address
              </div>
              <div className="token-spec-box text-xs">
                <code className="font-semibold">department *</code> - Department (e.g. Computer Science)
              </div>
              <div className="token-spec-box text-xs">
                <code className="font-semibold">expectedGraduationYear *</code> - Graduation year (e.g. 2027)
              </div>
              <div className="token-spec-box text-xs">
                <code className="font-semibold">degree *</code> - Degree (e.g. B.Tech / M.Sc)
              </div>
            </div>
          )}

          <button 
            onClick={() => setCsvText(currentSample)} 
            className="btn btn-secondary w-full mt-6 flex items-center justify-center gap-2 text-xs"
          >
            <FileText size={16} /> Load Template Sample
          </button>
        </div>
      </div>
    </div>
  );
}
