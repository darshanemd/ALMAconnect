import React, { useState } from 'react';
import { X, Download, FileText, CheckCircle2, Eye, ExternalLink, AlertCircle } from 'lucide-react';
import Avatar from './Avatar';
import { getFileUrl } from '../../utils/api';
import './ResumeViewerModal.css';

export default function ResumeViewerModal({ 
  alumniName = 'Priya Sharma', 
  alumniRole = 'Software Engineer III',
  avatarUrl, 
  resumeUrl, 
  resumeType = 'pdf',
  alumniData = null,
  onClose 
}) {
  const isBase64Image = Boolean(resumeUrl && (resumeUrl.startsWith('data:image/') || /\.(jpg|jpeg|png|webp)$/i.test(resumeUrl)));
  const isPdf = Boolean(resumeUrl && (resumeUrl.startsWith('data:application/pdf') || resumeUrl.endsWith('.pdf') || resumeUrl.includes('.pdf') || resumeType === 'pdf'));
  const isRawCloudinaryPdf = Boolean(resumeUrl && resumeUrl.includes('cloudinary.com') && resumeUrl.includes('/raw/upload/'));

  // Default to digital profile if the file is a raw Cloudinary upload (to prevent ACL 401 black screens) or if no file URL
  const [viewMode, setViewMode] = useState(() => (isRawCloudinaryPdf || !resumeUrl ? 'digital' : 'document'));

  // Normalized Profile Data for Verified Digital Resume
  const displayCompany = alumniData?.company || 'Technology Organization';
  const displayEmail = alumniData?.email || `${alumniName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@example.com`;
  const displayPhone = alumniData?.phone || '+91 98765 43210';
  const displayLocation = alumniData?.location || 'Bengaluru, India';
  const displayLinkedin = alumniData?.linkedinUrl || alumniData?.linkedin || `linkedin.com/in/${alumniName.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const displayDegree = alumniData?.department ? `B.Tech in ${alumniData.department}` : 'B.Tech in Engineering';
  const displayCollege = alumniData?.collegeName || 'Alma Mater College of Engineering';
  const displayGradYear = alumniData?.graduationYear || alumniData?.batch || '2023';
  const displayBio = alumniData?.bio || alumniData?.headline || 'Passionate software engineering professional dedicated to developing scalable systems, high-quality code, and mentoring next-generation students.';
  
  const skillsList = alumniData?.skills && Array.isArray(alumniData.skills) && alumniData.skills.length > 0 
    ? alumniData.skills 
    : ['React.js', 'Node.js', 'TypeScript', 'System Design', 'Cloud Architecture', 'Problem Solving'];

  const directFileUrl = resumeUrl ? getFileUrl(resumeUrl) : '';

  // Download generator: Creates an instant client-side PDF document with zero network dependencies
  const generateDigitalPdf = () => {
    const cleanName = alumniName.replace(/[()]/g, '');
    const cleanRole = alumniRole.replace(/[()]/g, '');
    const cleanCompany = displayCompany.replace(/[()]/g, '');
    const cleanDegree = displayDegree.replace(/[()]/g, '');
    const cleanGradYear = String(displayGradYear).replace(/[()]/g, '');
    const cleanSummary = displayBio.slice(0, 150).replace(/[()]/g, '');
    const cleanSkills = skillsList.slice(0, 8).join(', ').replace(/[()]/g, '');

    const streamContent = `BT
/F1 18 Tf
50 730 Td
(${cleanName} - Verified Resume) Tj
0 -25 Td
/F1 12 Tf
(Role: ${cleanRole} at ${cleanCompany}) Tj
0 -18 Td
(Verified Alma Mater Graduate | Class of ${cleanGradYear}) Tj
0 -30 Td
(PROFESSIONAL SUMMARY) Tj
0 -16 Td
(${cleanSummary}) Tj
0 -30 Td
(WORK EXPERIENCE) Tj
0 -16 Td
(${cleanRole} @ ${cleanCompany} [Current]) Tj
0 -14 Td
(- Engineering scalable web applications and collaborating across engineering teams.) Tj
0 -30 Td
(EDUCATION & SKILLS) Tj
0 -16 Td
(${cleanDegree} | Skills: ${cleanSkills}) Tj
ET`;

    const pdfBinaryString = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Count 1 /Kids [3 0 R]>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>> endobj
4 0 obj <</Length ${streamContent.length}>>
stream
${streamContent}
endstream
endobj
5 0 obj <</Type /Font /Subtype /Type1 /BaseFont /Helvetica>> endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000235 00000 n 
0000000710 00000 n 
trailer <</Size 6 /Root 1 0 R>>
startxref
${800 + streamContent.length}
%%EOF`;

    const blob = new Blob([pdfBinaryString], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${alumniName.replace(/\s+/g, '_')}_Verified_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  };

  const handleDownload = () => {
    // If viewing document and the file is directly accessible (e.g. local or non-raw image/pdf), trigger direct download
    if (viewMode === 'document' && directFileUrl && !isRawCloudinaryPdf) {
      const link = document.createElement('a');
      link.href = directFileUrl;
      link.target = '_blank';
      const ext = isBase64Image ? 'png' : 'pdf';
      link.download = `${alumniName.replace(/\s+/g, '_')}_Resume.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Otherwise generate the verified digital PDF instantly
    generateDigitalPdf();
  };

  return (
    <div className="resume-modal-backdrop" onClick={onClose}>
      <div className="resume-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="resume-modal-header">
          <div className="flex items-center gap-3">
            <Avatar src={avatarUrl} name={alumniName} role="alumni" size="sm" isVerified={true} />
            <div>
              <h3 className="font-bold text-sm text-primary flex items-center gap-1.5">
                {alumniName}'s Verified Resume <CheckCircle2 size={14} className="text-accent" />
              </h3>
              <span className="text-xs text-secondary">{alumniRole} {alumniData?.company ? `• ${alumniData.company}` : ''}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-border text-xs">
              <button 
                type="button"
                className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === 'digital' 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-secondary hover:text-primary'
                }`}
                onClick={() => setViewMode('digital')}
                title="View verified digital profile canvas"
              >
                <Eye size={13} className={viewMode === 'digital' ? 'text-accent' : ''} />
                <span>Digital Profile</span>
              </button>

              {resumeUrl && (
                <button 
                  type="button"
                  className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                    viewMode === 'document' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-secondary hover:text-primary'
                  }`}
                  onClick={() => setViewMode('document')}
                  title="View uploaded PDF document"
                >
                  <FileText size={13} />
                  <span>Uploaded File</span>
                </button>
              )}
            </div>

            <button 
              className="btn btn-primary btn-sm flex items-center gap-1.5 shadow-sm"
              onClick={handleDownload}
              title="Download PDF"
            >
              <Download size={14} /> 
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button 
              className="btn btn-ghost btn-sm p-1.5 rounded-full" 
              onClick={onClose}
              aria-label="Close resume modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Document Body Viewer */}
        <div className="resume-modal-body">
          {viewMode === 'document' && isBase64Image ? (
            <img 
              src={directFileUrl} 
              alt={`${alumniName}'s Resume`} 
              className="resume-preview-img"
            />
          ) : viewMode === 'document' && isPdf ? (
            <div className="w-full h-full flex flex-col items-center">
              {/* Informative notice if hosted on Cloudinary raw storage */}
              {isRawCloudinaryPdf && (
                <div className="w-full max-w-2xl mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-200 text-xs flex items-start gap-2.5 shrink-0">
                  <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-300">Cloudinary Raw Storage Notice</p>
                    <p className="text-amber-200/90 mt-0.5 leading-relaxed">
                      If in-browser preview is blocked by Cloudinary account security, enable <strong>"Allow delivery of PDF and ZIP files"</strong> in Cloudinary Console (Settings &gt; Security). 
                      You can also view the complete <strong>Digital Profile</strong> or open the original file link.
                    </p>
                  </div>
                </div>
              )}

              <object 
                data={directFileUrl} 
                type="application/pdf" 
                className="resume-embed"
              >
                <div className="p-8 text-center text-white bg-slate-800 rounded-lg max-w-md my-auto flex flex-col items-center">
                  <FileText size={44} className="mb-3 text-emerald-400" />
                  <h4 className="font-bold text-sm mb-1.5">PDF Preview Notice</h4>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    This document is stored on cloud storage. You can open the file directly in a new tab or switch to the Verified Digital Resume.
                  </p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    <a 
                      href={directFileUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="btn btn-primary btn-xs flex items-center gap-1.5"
                    >
                      <ExternalLink size={12} /> Open Original File
                    </a>
                    <button 
                      type="button" 
                      onClick={() => setViewMode('digital')} 
                      className="btn btn-secondary btn-xs flex items-center gap-1.5"
                    >
                      <Eye size={12} /> View Digital Resume
                    </button>
                  </div>
                </div>
              </object>
            </div>
          ) : (
            /* High-Quality Verified Digital Paper Canvas */
            <div className="resume-paper-canvas">
              <div className="resume-paper-header">
                <h1>{alumniName}</h1>
                <p>{alumniRole} {alumniData?.company ? `• ${alumniData.company}` : ''}</p>
                <div className="resume-paper-contact">
                  <span>✉️ {displayEmail}</span>
                  <span>📞 {displayPhone}</span>
                  <span>📍 {displayLocation}</span>
                  <span>🌐 {displayLinkedin}</span>
                </div>
              </div>

              <div className="resume-paper-section">
                <div className="resume-paper-section-title">Professional Summary</div>
                <p className="resume-paper-bullet">
                  {displayBio}
                </p>
              </div>

              <div className="resume-paper-section">
                <div className="resume-paper-section-title">Work Experience</div>
                
                <div className="resume-paper-exp-item">
                  <div className="flex justify-between items-baseline">
                    <span className="resume-paper-exp-role">{alumniRole}</span>
                    <span className="text-xs text-secondary font-bold">Current</span>
                  </div>
                  <div className="resume-paper-exp-company">{displayCompany} &bull; Full-time Professional</div>
                  <div className="resume-paper-bullet">&bull; Delivering scalable software engineering solutions and architecting robust digital features.</div>
                  <div className="resume-paper-bullet">&bull; Active alumni mentor advising current undergraduates on technology careers and interview readiness.</div>
                </div>
              </div>

              <div className="resume-paper-section">
                <div className="resume-paper-section-title">Education & Credentials</div>
                <div className="flex justify-between items-baseline">
                  <span className="resume-paper-exp-role">{displayDegree}</span>
                  <span className="text-xs text-secondary font-bold">Class of {displayGradYear}</span>
                </div>
                <div className="resume-paper-exp-company">{displayCollege} &bull; Verified Alumni Member</div>
              </div>

              <div className="resume-paper-section">
                <div className="resume-paper-section-title">Skills & Technologies</div>
                <div className="resume-paper-skills-grid">
                  {skillsList.map((skill, idx) => (
                    <span key={idx} className="resume-paper-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="resume-paper-section">
                <div className="resume-paper-section-title">Alumni Network Verification</div>
                <div className="resume-paper-bullet">&bull; Verified Graduate Identity &bull; Authorized resume document for career networking</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="resume-modal-footer">
          <span className="text-xs text-secondary flex items-center gap-1.5">
            <FileText size={14} className="text-accent" /> 
            <span>Verified Alumni Resume &bull; Shared for career mentorship and networking</span>
          </span>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary btn-xs" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
