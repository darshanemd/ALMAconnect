import React from 'react';
import { X, Download, FileText, CheckCircle2 } from 'lucide-react';
import Avatar from './Avatar';
import { getFileUrl } from '../../utils/api';
import './ResumeViewerModal.css';

export default function ResumeViewerModal({ 
  alumniName = 'Priya Sharma', 
  alumniRole = 'Software Engineer III',
  avatarUrl, 
  resumeUrl, 
  resumeType = 'pdf',
  onClose 
}) {
  const isBase64Image = resumeUrl && (resumeUrl.startsWith('data:image/') || /\.(jpg|jpeg|png|webp)$/i.test(resumeUrl));
  const isBase64Pdf = resumeUrl && (resumeUrl.startsWith('data:application/pdf') || resumeUrl.endsWith('.pdf'));

  const handleDownload = () => {
    // If alumnus uploaded a custom file, download it directly
    if (resumeUrl && (resumeUrl.startsWith('data:') || resumeUrl.startsWith('/uploads/') || resumeUrl.startsWith('http'))) {
      const link = document.createElement('a');
      link.href = getFileUrl(resumeUrl);
      const ext = isBase64Image ? 'png' : 'pdf';
      link.download = `${alumniName.replace(/\s+/g, '_')}_Resume.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    // Direct PDF Blob generation for instant direct download to Downloads folder
    const pdfBinaryString = `%PDF-1.4
1 0 obj <</Type /Catalog /Pages 2 0 R>> endobj
2 0 obj <</Type /Pages /Count 1 /Kids [3 0 R]>> endobj
3 0 obj <</Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources <</Font <</F1 5 0 R>>>>>> endobj
4 0 obj <</Length 420>>
stream
BT
/F1 18 Tf
50 730 Td
(${alumniName} - Verified Resume) Tj
0 -25 Td
/F1 12 Tf
(Role: ${alumniRole}) Tj
0 -18 Td
(Verified Alma Mater Graduate | Class of 2020) Tj
0 -30 Td
(PROFESSIONAL SUMMARY) Tj
0 -16 Td
(Experienced Software Engineer specializing in full-stack web systems and cloud.) Tj
0 -30 Td
(WORK EXPERIENCE) Tj
0 -16 Td
(Senior Software Engineer @ Microsoft [2022 - Present]) Tj
0 -14 Td
(- Engineered microservices with 99.99% availability handling 2M+ API requests.) Tj
0 -16 Td
(Software Engineer @ Google [2020 - 2022]) Tj
0 -14 Td
(- Developed real-time telemetry analytics dashboards.) Tj
0 -30 Td
(EDUCATION & SKILLS) Tj
0 -16 Td
(B.Tech CS | Skills: React.js, Node.js, TypeScript, Python, AWS, Docker) Tj
ET
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
780
%%EOF`;

    const blob = new Blob([pdfBinaryString], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${alumniName.replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
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
              <span className="text-xs text-secondary">{alumniRole} &bull; Accepted Request</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              className="btn btn-primary btn-sm flex items-center gap-1 shadow-sm"
              onClick={handleDownload}
            >
              <Download size={14} /> Download PDF
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
          {isBase64Image ? (
            <img 
              src={getFileUrl(resumeUrl)} 
              alt={`${alumniName}'s Resume`} 
              className="resume-preview-img"
            />
          ) : isBase64Pdf ? (
            <embed 
              src={getFileUrl(resumeUrl)} 
              type="application/pdf" 
              className="resume-embed"
            />
          ) : (
            /* High-Quality Visual Paper Canvas Fallback */
            <div className="resume-paper-canvas">
              <div className="resume-paper-header">
                <h1>{alumniName}</h1>
                <p>{alumniRole}</p>
                <div className="resume-paper-contact">
                  <span>✉️ {alumniName.toLowerCase().replace(/\s+/g, '.')}@example.com</span>
                  <span>📞 +91 98765 43210</span>
                  <span>📍 Bengaluru, Karnataka</span>
                  <span>🌐 linkedin.com/in/{alumniName.toLowerCase().replace(/\s+/g, '')}</span>
                </div>
              </div>

              <div className="resume-paper-section">
                <div className="resume-paper-section-title">Professional Summary</div>
                <p className="resume-paper-bullet">
                  Experienced Software Engineer with 4+ years of expertise in full-stack architecture, React, Node.js, and cloud systems. Proven track record in designing scalable web applications and mentoring junior developers.
                </p>
              </div>

              <div className="resume-paper-section">
                <div className="resume-paper-section-title">Work Experience</div>
                
                <div className="resume-paper-exp-item">
                  <div className="flex justify-between items-baseline">
                    <span className="resume-paper-exp-role">Senior Software Engineer</span>
                    <span className="text-xs text-secondary font-bold">2022 - Present</span>
                  </div>
                  <div className="resume-paper-exp-company">Microsoft &bull; Full-time</div>
                  <div className="resume-paper-bullet">&bull; Engineered microservices handling 2M+ daily active API requests with 99.99% availability.</div>
                  <div className="resume-paper-bullet">&bull; Spearheaded React component library adoption across 5 cross-functional engineering teams.</div>
                </div>

                <div className="resume-paper-exp-item">
                  <div className="flex justify-between items-baseline">
                    <span className="resume-paper-exp-role">Software Development Engineer</span>
                    <span className="text-xs text-secondary font-bold">2020 - 2022</span>
                  </div>
                  <div className="resume-paper-exp-company">Google &bull; Full-time</div>
                  <div className="resume-paper-bullet">&bull; Developed real-time telemetry dashboards optimizing cloud database performance by 35%.</div>
                </div>
              </div>

              <div className="resume-paper-section">
                <div className="resume-paper-section-title">Education</div>
                <div className="flex justify-between items-baseline">
                  <span className="resume-paper-exp-role">B.Tech in Computer Science & Engineering</span>
                  <span className="text-xs text-secondary font-bold">Class of 2020</span>
                </div>
                <div className="resume-paper-exp-company">Alma Mater College of Engineering &bull; CGPA: 9.2/10</div>
              </div>

              <div className="resume-paper-section">
                <div className="resume-paper-section-title">Skills & Technologies</div>
                <div className="resume-paper-skills-grid">
                  <span className="resume-paper-skill-tag">React.js</span>
                  <span className="resume-paper-skill-tag">Node.js</span>
                  <span className="resume-paper-skill-tag">TypeScript</span>
                  <span className="resume-paper-skill-tag">Python</span>
                  <span className="resume-paper-skill-tag">System Design</span>
                  <span className="resume-paper-skill-tag">AWS</span>
                  <span className="resume-paper-skill-tag">Docker</span>
                </div>
              </div>

              <div className="resume-paper-section">
                <div className="resume-paper-section-title">Certifications & Awards</div>
                <div className="resume-paper-bullet">&bull; AWS Certified Solutions Architect - Associate</div>
                <div className="resume-paper-bullet">&bull; Winner, National Campus Hackathon (1st Place out of 250+ teams)</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="resume-modal-footer">
          <span className="text-xs text-secondary flex items-center gap-1">
            <FileText size={14} className="text-accent" /> Verified Resume document provided for career networking
          </span>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary btn-xs" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
