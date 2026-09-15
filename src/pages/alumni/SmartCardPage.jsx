import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  CreditCard, GraduationCap, Download, MapPin, QrCode, RotateCw, ShieldCheck, 
  BookOpen, Dumbbell, Home, Award, CheckCircle, Lock, Barcode, Printer, Eye,
  Hash, Layers, Building
} from 'lucide-react';
import { getInitials } from '../../utils/formatters';
import QRCode from 'react-qr-code';
import './SmartCardPage.css';

export default function SmartCardPage() {
  const { user } = useAuth();
  const { getAlumniById, colleges } = useData();

  const [isFlipped, setIsFlipped] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const isStudent = user?.role === 'student';
  const alum = getAlumniById(user?.id) || user;
  const college = colleges.find(c => c.id === (alum?.collegeId || user?.collegeId));
  const collegeName = college ? college.name : (user?.collegeName || 'Government Engineering College');
  
  // Student ID Number (Roll Number / USN)
  const studentIdNumber = alum?.rollNumber || user?.rollNumber || user?.studentId || (isStudent ? '4EG2027001' : (user?.id || '4EG2020001'));
  
  // Branch / Department
  const branchName = alum?.department || user?.department || 'Computer Science & Engineering';
  const degreeName = alum?.degree || user?.degree || (isStudent ? 'B.Tech' : 'B.E');
  const gradYear = alum?.graduationYear || user?.graduationYear || (isStudent ? 2027 : 2024);

  const passTypeTitle = isStudent ? 'STUDENT PASS' : 'ALUMNI PASS';
  const statusLabel = isStudent ? 'Active Student' : 'Active Alum';
  const pageTitle = isStudent ? 'Interactive Smart Student ID Card' : 'Interactive Smart Alumni ID Card';
  const pageDesc = isStudent 
    ? 'Official digital student identity card with campus gate access, library privileges, and 3D security verification.' 
    : 'Official digital identity card with campus gate access, library privileges, and 3D security verification.';
  const featuresTitle = isStudent ? 'Smart Student ID Card Features' : 'Smart Alumni ID Card Features';

  const cardRef = useRef(null);

  const handlePrintCard = () => {
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      window.print();
      return;
    }

    const qrCodeSvg = document.querySelector('.smart-card-qr-box svg')?.outerHTML || '';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${user?.name || 'Student'} - Smart ID Card Double Sided</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background: #ffffff;
              color: #111827;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 25px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 15px;
            }
            .header h1 {
              font-size: 20px;
              color: #1e1b4b;
              font-weight: 800;
            }
            .header p {
              font-size: 11px;
              color: #4b5563;
              margin-top: 4px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .header .meta {
              font-size: 11px;
              color: #6b7280;
              margin-top: 4px;
            }
            .cards-row {
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              gap: 30px;
              margin: 20px 0;
            }
            .card-wrapper {
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
            }
            .tag {
              font-size: 10px;
              font-weight: 800;
              letter-spacing: 0.1em;
              background: #f3f4f6;
              color: #374151;
              padding: 3px 10px;
              border-radius: 99px;
              border: 1px solid #d1d5db;
            }
            .card-face {
              width: 310px;
              height: 480px;
              border-radius: 18px;
              padding: 20px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              position: relative;
              overflow: hidden;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            }
            .card-front {
              background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%) !important;
              color: #ffffff !important;
            }
            .card-back {
              background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%) !important;
              color: #ffffff !important;
            }
            .brand {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid rgba(255,255,255,0.25);
              padding-bottom: 8px;
            }
            .brand-title {
              font-weight: 800;
              font-size: 13px;
              letter-spacing: 0.05em;
              text-transform: uppercase;
            }
            .badge {
              background: rgba(255,255,255,0.2);
              border: 1px solid rgba(255,255,255,0.4);
              padding: 3px 8px;
              border-radius: 99px;
              font-size: 10px;
              font-weight: 700;
            }
            .avatar {
              width: 62px;
              height: 62px;
              border-radius: 50%;
              background: #ffffff;
              color: #4f46e5;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 22px;
              font-weight: 800;
              margin: 4px auto 0;
              border: 3px solid rgba(255,255,255,0.8);
            }
            .name {
              font-size: 17px;
              font-weight: 800;
              text-align: center;
              margin-top: 6px;
            }
            .id-pill {
              display: inline-block;
              background: rgba(255,255,255,0.22);
              border: 1px solid rgba(255,255,255,0.4);
              padding: 2px 8px;
              border-radius: 99px;
              font-family: monospace;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.05em;
              margin-top: 2px;
            }
            .sub {
              font-size: 11px;
              text-align: center;
              opacity: 0.95;
              margin-top: 2px;
            }
            .branch-tag {
              font-size: 11px;
              font-weight: 700;
              color: #fef08a;
              margin-top: 1px;
              text-align: center;
            }
            .qr-box {
              background: #ffffff;
              padding: 6px;
              border-radius: 8px;
              display: inline-block;
              margin-top: 6px;
            }
            .id-num {
              font-size: 11px;
              font-family: monospace;
              font-weight: 700;
              margin-top: 2px;
              letter-spacing: 0.05em;
            }
            .front-foot {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 10px;
              border-top: 1px solid rgba(255,255,255,0.2);
              padding-top: 6px;
            }
            .stripe {
              height: 36px;
              background: #000000;
              margin: -20px -20px 10px -20px;
            }
            .privileges {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 4px;
              margin-top: 4px;
            }
            .chip {
              background: rgba(255,255,255,0.1);
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 4px;
              padding: 3px 5px;
              font-size: 9px;
              font-weight: 600;
            }
            .barcode {
              background: #ffffff;
              color: #000000;
              padding: 4px;
              border-radius: 4px;
              font-family: monospace;
              font-weight: bold;
              letter-spacing: 0.2em;
              text-align: center;
              font-size: 12px;
              margin-top: 4px;
            }
            .emergency {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 6px;
              margin-top: 6px;
            }
            .sig-row {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-top: 1px solid rgba(255,255,255,0.2);
              padding-top: 6px;
            }
            .sig {
              font-family: cursive, serif;
              font-size: 13px;
              border-bottom: 1px solid rgba(255,255,255,0.4);
            }
            .cut-guide {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 6px;
            }
            .cut-line {
              width: 1px;
              height: 100px;
              border-left: 2px dashed #9ca3af;
            }
            .cut-text {
              font-size: 9px;
              font-weight: 700;
              color: #6b7280;
              text-align: center;
              max-width: 120px;
            }
            .footer {
              text-align: center;
              font-size: 10px;
              font-family: monospace;
              color: #6b7280;
              margin-top: 25px;
              border-top: 1px solid #e5e7eb;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${collegeName}</h1>
            <p>OFFICIAL ${passTypeTitle} &bull; DOUBLE-SIDED IDENTIFICATION PASS</p>
            <div class="meta">Issued To: <strong>${user?.name || ''}</strong> &bull; ID Number: <strong>${studentIdNumber}</strong> &bull; Date: ${new Date().toLocaleDateString()}</div>
          </div>

          <div class="cards-row">
            <!-- FRONT SIDE -->
            <div class="card-wrapper">
              <div class="tag">FRONT SIDE</div>
              <div class="card-face card-front">
                <div class="brand">
                  <div class="brand-title">🎓 ${college?.code || 'GEC'} ${passTypeTitle}</div>
                  <div class="badge">✓ VERIFIED</div>
                </div>
                <div style="text-align: center;">
                  <div class="avatar">${getInitials(user?.name)}</div>
                  <div class="name">${user?.name || ''}</div>
                  <div class="id-pill">ID: ${studentIdNumber}</div>
                  <div class="branch-tag">Branch: ${branchName}</div>
                  <div class="sub">${degreeName} &bull; ${collegeName}</div>
                  <div class="qr-box">${qrCodeSvg}</div>
                  <div class="id-num">USN: ${studentIdNumber}</div>
                </div>
                <div class="front-foot">
                  <span>Year of Graduation: ${gradYear}</span>
                  <span style="color:#6ee7b7; font-weight:700;">● ${statusLabel}</span>
                </div>
              </div>
            </div>

            <!-- CUT GUIDE -->
            <div class="cut-guide">
              <div class="cut-line"></div>
              <div class="cut-text">✂ FOLD / CUT TO BIND FRONT & BACK</div>
              <div class="cut-line"></div>
            </div>

            <!-- BACK SIDE -->
            <div class="card-wrapper">
              <div class="tag">BACK SIDE</div>
              <div class="card-face card-back">
                <div class="stripe"></div>
                <div style="border-bottom:1px solid rgba(255,255,255,0.2); padding-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <div style="font-size:11px; font-weight:700; color:#fcd34d;">${isStudent ? 'STUDENT ACCESS PASS' : 'SECURITY & PRIVILEGE PASS'}</div>
                    <div style="font-size:9px; opacity:0.75; font-family:monospace;">ID: ${studentIdNumber} &bull; Dept: ${branchName}</div>
                  </div>
                  <div>🔒</div>
                </div>

                <div style="margin-top: 4px;">
                  <div style="font-size:9px; text-transform:uppercase; opacity:0.7; font-weight:700; margin-bottom:2px;">Authorized Campus Access</div>
                  <div class="privileges">
                    <div class="chip">📚 Central Library</div>
                    <div class="chip">🏋️ Sports Complex</div>
                    <div class="chip">🏠 ${isStudent ? 'Campus Hostel' : 'Guest House'}</div>
                    <div class="chip">🏆 Innovation Lab</div>
                  </div>
                </div>

                <div style="margin-top: 4px;">
                  <div style="font-size:9px; text-transform:uppercase; opacity:0.7; font-weight:700;">Gate Scanner Barcode</div>
                  <div class="barcode">|||||| | ||||| || ||||||| ||| |||</div>
                </div>

                <div class="emergency">
                  <div>
                    <div style="font-size:8px; opacity:0.7;">EMERGENCY HELPLINE</div>
                    <div style="font-family:monospace; font-weight:700; font-size:10px;">+91 (80) 2289-9000</div>
                  </div>
                  <div>
                    <div style="font-size:8px; opacity:0.7;">VALID THROUGH</div>
                    <div style="font-family:monospace; font-weight:700; font-size:10px;">${isStudent ? `JUN ${gradYear}` : 'PERPETUAL (2030+)'}</div>
                  </div>
                </div>

                <div class="sig-row">
                  <div>
                    <div style="font-size:8px; opacity:0.7;">AUTHORIZATION SIGNATURE</div>
                    <div class="sig">Prof. K. R. Sharma</div>
                  </div>
                  <div style="font-size:8px; opacity:0.7; text-align:right;">
                    Property of ${college?.code || 'GEC'}.<br/>Non-transferable.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="footer">
            Cryptographically Verified Pass &bull; Verification Hash: sha256-${studentIdNumber}-alma-auth-sec &bull; Project ALMA Smart Identity System
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 250);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="smart-card-page stagger-children animate-fade-in">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div>
          <h2>{pageTitle}</h2>
          <p className="text-xs text-secondary">{pageDesc}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowPrintPreview(prev => !prev)} 
            className={`btn ${showPrintPreview ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
          >
            <Eye size={16} /> {showPrintPreview ? 'Hide Print Layout' : 'Preview 2-Side Printable Sheet'}
          </button>
          <button 
            onClick={() => setIsFlipped(prev => !prev)} 
            className="btn btn-secondary flex items-center gap-2"
          >
            <RotateCw size={16} className={isFlipped ? 'animate-spin' : ''} /> Flip Card ({isFlipped ? 'Front View' : 'Back View'})
          </button>
        </div>
      </div>

      {showPrintPreview && (
        <div className="card p-6 mb-6 border border-accent bg-accent/5 transition-all">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2 text-accent-dark">
                <Printer size={18} /> Official Both-Sides Single Page Print Sheet
              </h3>
              <p className="text-xs text-secondary">
                Front and Back sides are formatted side-by-side on a single page with standard CR80 dimensions and cut guidelines.
              </p>
            </div>
            <button onClick={handlePrintCard} className="btn btn-primary flex items-center gap-2">
              <Printer size={16} /> Print Now (Single Page)
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-2 gap-8 items-center">
        {/* 3D Flip Smart ID Display */}
        <div className="flex flex-col items-center justify-center">
          <div className="smart-card-scene">
            <div 
              ref={cardRef}
              className={`smart-card-flipper ${isFlipped ? 'is-flipped' : ''}`}
              onClick={() => setIsFlipped(prev => !prev)}
              title="Click card to flip between Front and Back views"
            >
              {/* CARD FRONT */}
              <div className="smart-card-face card-front">
                <div className="smart-card-brand">
                  <div className="brand-title">
                    <GraduationCap size={20} />
                    <span>{college?.code || 'GEC'} {passTypeTitle}</span>
                  </div>
                  <div className="security-hologram-badge">
                    <ShieldCheck size={12} /> VERIFIED
                  </div>
                </div>

                <div className="smart-card-body mt-2">
                  <div className="smart-card-avatar">
                    {getInitials(user?.name)}
                  </div>
                  <h3 className="font-bold text-base mt-1.5 text-center text-white">{user?.name}</h3>
                  
                  {/* Student ID Number Pill */}
                  <div className="smart-card-id-pill">
                    <Hash size={11} className="inline mr-0.5" /> ID: {studentIdNumber}
                  </div>

                  {/* Branch & Degree */}
                  <div className="smart-card-branch-tag mt-1">
                    Branch: {branchName}
                  </div>
                  <p className="text-[11px] font-medium opacity-85 text-center mt-0.5">
                    {degreeName} &bull; {collegeName}
                  </p>

                  <div className="smart-card-qr-box mt-2.5">
                    <QRCode value={`${isStudent ? 'studentAuthToken' : 'alumniAuthToken'}:${studentIdNumber}`} size={92} />
                  </div>
                  <p className="text-[11px] mt-1 opacity-90 uppercase tracking-wider font-mono font-bold">
                    USN / ID: {studentIdNumber}
                  </p>
                </div>

                <div className="flex justify-between items-center text-[11px] pt-2 border-t border-white/20">
                  <span>Year of Graduation: {gradYear}</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-300">
                    <CheckCircle size={12} /> {statusLabel}
                  </span>
                </div>

                <div className="flip-hint-overlay">
                  <RotateCw size={10} /> Click to Flip Card
                </div>
              </div>

              {/* CARD BACK */}
              <div className="smart-card-face card-back">
                <div className="magnetic-stripe"></div>

                <div className="flex justify-between items-center border-b border-white/20 pb-2">
                  <div>
                    <div className="text-xs font-bold text-amber-300">{isStudent ? 'STUDENT ACCESS PASS' : 'SECURITY & PRIVILEGE PASS'}</div>
                    <div className="text-[10px] opacity-75 font-mono">ID: {studentIdNumber} &bull; Dept: {branchName}</div>
                  </div>
                  <Lock size={16} className="opacity-80" />
                </div>

                {/* Privilege Badges */}
                <div className="my-1.5">
                  <div className="back-section-title">Authorized Campus Access</div>
                  <div className="privilege-badges-grid">
                    <div className="privilege-chip"><BookOpen size={12} className="text-indigo-300" /> Central Library</div>
                    <div className="privilege-chip"><Dumbbell size={12} className="text-emerald-300" /> Sports Complex</div>
                    <div className="privilege-chip"><Home size={12} className="text-amber-300" /> {isStudent ? 'Campus Hostel' : 'Guest House'}</div>
                    <div className="privilege-chip"><Award size={12} className="text-purple-300" /> Innovation Lab</div>
                  </div>
                </div>

                {/* Gate Security Barcode */}
                <div className="my-1">
                  <div className="back-section-title">Gate Scanner Barcode</div>
                  <div className="barcode-box">
                    |||||| | ||||| || ||||||| ||| |||
                  </div>
                </div>

                {/* Emergency Contact & Signature */}
                <div className="grid grid-2 gap-2 text-xs opacity-90 my-1">
                  <div>
                    <span className="block font-semibold text-gray-300 text-[9px]">EMERGENCY HELPLINE</span>
                    <span className="font-mono text-white text-[11px]">+91 (80) 2289-9000</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-gray-300 text-[9px]">VALID THROUGH</span>
                    <span className="font-mono text-white text-[11px]">{isStudent ? `JUN ${gradYear}` : 'PERPETUAL (2030+)'}</span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-2 flex justify-between items-end">
                  <div>
                    <div className="text-[9px] text-gray-300">AUTHORIZATION SIGNATURE</div>
                    <div className="signature-line font-serif text-xs">Prof. K. R. Sharma</div>
                  </div>
                  <div className="text-[8px] text-right opacity-70">
                    Property of {college?.code || 'GEC'}.<br />Non-transferable.
                  </div>
                </div>

                <div className="flip-hint-overlay">
                  <RotateCw size={10} /> Click to Flip Front
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-secondary mt-3 flex items-center gap-1">
            <RotateCw size={12} /> Interactive 3D Card: Click card or use Flip button above to view Front & Back
          </p>
        </div>

        {/* Feature Overview & Action Details */}
        <div className="card p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h3 className="section-title flex items-center gap-2 mb-0">
              <CreditCard size={20} className="text-primary" /> {featuresTitle}
            </h3>
            <span className="badge badge-accent font-mono text-xs">ID: {studentIdNumber}</span>
          </div>

          <div className="bg-surface-hover p-3.5 rounded-lg border border-border flex flex-col gap-1.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-secondary font-medium">Student Name:</span>
              <span className="font-bold text-primary">{user?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary font-medium">Student ID Number / USN:</span>
              <span className="font-mono font-bold text-accent">{studentIdNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary font-medium">Branch / Department:</span>
              <span className="font-bold text-primary">{branchName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary font-medium">Degree:</span>
              <span className="font-semibold text-primary">{degreeName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary font-medium">Year of Graduation:</span>
              <span className="font-semibold text-primary">{gradYear}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-secondary font-medium">Institution:</span>
              <span className="font-semibold text-primary">{collegeName}</span>
            </div>
          </div>

          <div className="feature-instructions flex flex-col gap-3 mt-1">
            <div className="instruction-step flex gap-3">
              <div className="step-num"><QrCode size={16} /></div>
              <div>
                <h4 className="font-semibold text-sm">Automated Event Check-In</h4>
                <p className="text-xs text-secondary">
                  Present the Front QR code at workshops, guest lectures, and campus events for instant check-in.
                </p>
              </div>
            </div>
            <div className="instruction-step flex gap-3">
              <div className="step-num"><MapPin size={16} /></div>
              <div>
                <h4 className="font-semibold text-sm">Gate Access & Campus Facilities</h4>
                <p className="text-xs text-secondary">
                  Scan the Back Security Barcode at campus turnstiles for central library, computer labs, and sports complex entry.
                </p>
              </div>
            </div>
            <div className="instruction-step flex gap-3">
              <div className="step-num"><ShieldCheck size={16} /></div>
              <div>
                <h4 className="font-semibold text-sm">Cryptographic Verification</h4>
                <p className="text-xs text-secondary">
                  Features an embedded institutional token linked to your verified student enrollment record ({studentIdNumber}).
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 w-full mt-2 flex-wrap">
            <button 
              onClick={() => setIsFlipped(prev => !prev)} 
              className="btn btn-secondary flex-1 flex items-center justify-center gap-2 font-bold"
            >
              <RotateCw size={16} /> Flip Card View
            </button>
            <button 
              onClick={handlePrintCard} 
              className="btn btn-primary flex-1 flex items-center justify-center gap-2 font-bold"
            >
              <Printer size={16} /> Print ID Pass (Single Page)
            </button>
          </div>
        </div>
      </div>

      {/* DOUBLE-SIDED SINGLE-PAGE PRINT SHEET (Always rendered for printing, and toggleable on-screen) */}
      <div className={`smart-card-print-sheet ${showPrintPreview ? 'on-screen-preview' : ''}`}>
        <div className="print-header text-center mb-4">
          <div className="flex items-center justify-center gap-2 text-indigo-950 font-bold text-lg">
            <GraduationCap size={24} /> {collegeName}
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-600 mt-1">
            OFFICIAL {passTypeTitle} &bull; DOUBLE-SIDED IDENTIFICATION PASS
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5">
            Issued To: <strong className="text-gray-800">{user?.name}</strong> &bull; ID Number: <strong className="text-gray-800">{studentIdNumber}</strong> &bull; Branch: <strong className="text-gray-800">{branchName}</strong> &bull; Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="print-cards-flex">
          {/* PRINT FRONT SIDE CARD */}
          <div className="print-card-container">
            <div className="print-side-tag">FRONT SIDE</div>
            <div className="smart-card-face card-front print-face-box">
              <div className="smart-card-brand">
                <div className="brand-title">
                  <GraduationCap size={20} />
                  <span>{college?.code || 'GEC'} {passTypeTitle}</span>
                </div>
                <div className="security-hologram-badge">
                  <ShieldCheck size={12} /> VERIFIED
                </div>
              </div>

              <div className="smart-card-body mt-2">
                <div className="smart-card-avatar">
                  {getInitials(user?.name)}
                </div>
                <h3 className="font-bold text-base mt-1.5 text-center text-white">{user?.name}</h3>
                
                <div className="smart-card-id-pill">
                  ID: {studentIdNumber}
                </div>

                <div className="smart-card-branch-tag mt-1">
                  Branch: {branchName}
                </div>
                <p className="text-[11px] font-medium opacity-85 text-center mt-0.5">
                  {degreeName} &bull; {collegeName}
                </p>

                <div className="smart-card-qr-box mt-2">
                  <QRCode value={`${isStudent ? 'studentAuthToken' : 'alumniAuthToken'}:${studentIdNumber}`} size={85} />
                </div>
                <p className="text-[11px] mt-1 opacity-90 uppercase tracking-wider font-mono font-bold">
                  USN: {studentIdNumber}
                </p>
              </div>

              <div className="flex justify-between items-center text-[11px] pt-2 border-t border-white/20">
                <span>Year of Graduation: {gradYear}</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-300">
                  <CheckCircle size={12} /> {statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* FOLD & CUT DASHED GUIDELINE */}
          <div className="print-fold-line">
            <div className="dashed-cut"></div>
            <span className="fold-text">✂ FOLD / CUT ALONG DASHED LINE TO BIND FRONT & BACK</span>
            <div className="dashed-cut"></div>
          </div>

          {/* PRINT BACK SIDE CARD */}
          <div className="print-card-container">
            <div className="print-side-tag">BACK SIDE</div>
            <div className="smart-card-face card-back print-face-box">
              <div className="magnetic-stripe"></div>

              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <div>
                  <div className="text-xs font-bold text-amber-300">{isStudent ? 'STUDENT ACCESS PASS' : 'SECURITY & PRIVILEGE PASS'}</div>
                  <div className="text-[10px] opacity-75 font-mono">ID: {studentIdNumber} &bull; Dept: {branchName}</div>
                </div>
                <Lock size={14} className="opacity-80" />
              </div>

              {/* Privilege Badges */}
              <div className="my-2">
                <div className="back-section-title">Authorized Campus Access</div>
                <div className="privilege-badges-grid">
                  <div className="privilege-chip"><BookOpen size={12} className="text-indigo-300" /> Central Library</div>
                  <div className="privilege-chip"><Dumbbell size={12} className="text-emerald-300" /> Sports Complex</div>
                  <div className="privilege-chip"><Home size={12} className="text-amber-300" /> {isStudent ? 'Campus Hostel' : 'Guest House'}</div>
                  <div className="privilege-chip"><Award size={12} className="text-purple-300" /> Innovation Lab</div>
                </div>
              </div>

              {/* Gate Security Barcode */}
              <div className="my-1">
                <div className="back-section-title">Gate Scanner Barcode</div>
                <div className="barcode-box">
                  |||||| | ||||| || ||||||| ||| |||
                </div>
              </div>

              {/* Emergency Contact & Signature */}
              <div className="grid grid-2 gap-2 text-xs opacity-90 my-1">
                <div>
                  <span className="block font-semibold text-gray-300 text-[9px]">EMERGENCY HELPLINE</span>
                  <span className="font-mono text-white text-[11px]">+91 (80) 2289-9000</span>
                </div>
                <div>
                  <span className="block font-semibold text-gray-300 text-[9px]">VALID THROUGH</span>
                  <span className="font-mono text-white text-[11px]">{isStudent ? `JUN ${gradYear}` : 'PERPETUAL (2030+)'}</span>
                </div>
              </div>

              <div className="border-t border-white/20 pt-2 flex justify-between items-end">
                <div>
                  <div className="text-[9px] text-gray-300">AUTHORIZATION SIGNATURE</div>
                  <div className="signature-line font-serif text-xs">Prof. K. R. Sharma</div>
                </div>
                <div className="text-[8px] text-right opacity-70">
                  Property of {college?.code || 'GEC'}.<br />Non-transferable.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="print-footer text-center mt-4 pt-2 border-t border-gray-200">
          <p className="text-[10px] text-gray-500 font-mono">
            Cryptographically Verified Pass &bull; Verification Hash: sha256-{studentIdNumber}-alma-auth-sec &bull; Project ALMA Smart Identity System
          </p>
        </div>
      </div>
    </div>
  );
}
