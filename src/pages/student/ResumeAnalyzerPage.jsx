import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  Upload, FileText, Check, AlertTriangle, RefreshCw, 
  Plus, Trash2, Printer, Download, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Sparkles,
  Mail, Phone, MapPin, Link as LinkIcon, ExternalLink, Award, FileCode, CheckCircle, Info, RotateCcw,
  Lightbulb
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { apiRequest } from '../../utils/api';
import './ResumeAnalyzerPage.css';

// Configure pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

// Vector SVG Icons for high-DPI Print & Screen Rendering
const LinkedInIcon = ({ size = 12, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const GitHubIcon = ({ size = 12, className = '' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

// URL sanitization helpers
const formatLinkedInUrl = (input) => {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('linkedin.com/in/')) return `https://${trimmed}`;
  if (trimmed.startsWith('linkedin.com/')) return `https://www.${trimmed}`;
  return `https://linkedin.com/in/${trimmed.replace(/^@/, '')}`;
};

const formatGitHubUrl = (input) => {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('github.com/')) return `https://${trimmed}`;
  return `https://github.com/${trimmed.replace(/^@/, '')}`;
};

const formatPhoneLink = (phone) => {
  if (!phone) return '';
  const clean = phone.replace(/[^0-9+]/g, '');
  return `tel:${clean}`;
};

const formatEmailLink = (email) => {
  if (!email) return '';
  return `mailto:${email.trim()}`;
};

export const formatWebUrl = (url) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
};

export const getCleanLinkedInDisplay = (url) => {
  if (!url) return 'profile';
  return url.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/(in\/)?/, '').replace(/\/$/, '') || 'profile';
};

export const getCleanGitHubDisplay = (url) => {
  if (!url) return 'profile';
  return url.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').replace(/\/$/, '') || 'profile';
};

export default function ResumeAnalyzerPage() {
  const { user } = useAuth();
  const { getAlumniById } = useData();
  const profileData = getAlumniById(user?.id);

  // Tab state: 'analyze' (existing analyzer) or 'build' (new resume builder)
  const [activeTab, setActiveTab] = useState('analyze');

  // Analyzer States
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [mlResumeData, setMlResumeData] = useState(null);
  const [targetRole, setTargetRole] = useState('Software Engineer (SDE / Full Stack)');

  const resetAnalyzer = () => {
    setFile(null);
    setResults(null);
    setMlResumeData(null);
    setAnalyzing(false);
  };

  // Resume Builder States
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [activeSection, setActiveSection] = useState('contact');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    skills: '',
    experience: [],
    education: [],
    projects: []
  });

  const resetToProfile = useCallback(() => {
    if (!profileData) return;
    setFormData({
      firstName: profileData.firstName || '',
      lastName: profileData.lastName || '',
      email: profileData.email || '',
      phone: profileData.phone || '',
      location: profileData.location || '',
      linkedin: profileData.linkedin || '',
      github: '',
      summary: profileData.bio || '',
      skills: profileData.skills ? profileData.skills.join(', ') : '',
      experience: [
        {
          id: Date.now(),
          role: profileData.currentRole || 'Software Engineering Intern',
          company: profileData.currentCompany || 'Example Tech',
          location: profileData.location || 'Bangalore, India',
          startDate: 'Jun 2025',
          endDate: 'Present',
          current: true,
          description: 'Developed and optimized client-facing React web applications. Collaborated with software engineers to design REST APIs and structure database queries. Improved application performance by 20%.'
        }
      ],
      education: [
        {
          id: Date.now() + 1,
          degree: profileData.degree ? `${profileData.degree} in ${profileData.department}` : 'B.E. in Computer Science',
          school: 'Government Engineering College (GEC)',
          location: 'Chamarajanagar, India',
          startDate: '2022',
          endDate: String(profileData.graduationYear || '2026'),
          description: 'Focus on Data Structures, Algorithms, and Software Engineering. CGPA: 9.1'
        }
      ],
      projects: [
        {
          id: Date.now() + 2,
          name: 'AI Resume Analyzer Portal',
          technologies: 'React, Node.js, MongoDB',
          date: 'Jan 2026',
          description: 'Designed and built a full-stack resume analysis portal. Implemented keyword matching algorithms to measure ATS compatibility scores. Integrated single-column layout templates.'
        }
      ]
    });
  }, [profileData]);

  // Pre-fill from Profile Data or Load from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem('ats_resume_builder_data');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
        return;
      } catch (e) {
        console.error('Failed to parse saved resume builder data', e);
      }
    }

    if (profileData) {
      resetToProfile();
    }
  }, [profileData, resetToProfile]);

  // Sync to LocalStorage
  useEffect(() => {
    if (formData.firstName || formData.lastName || formData.email) {
      localStorage.setItem('ats_resume_builder_data', JSON.stringify(formData));
    }
  }, [formData]);

  const clearForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      summary: '',
      skills: '',
      experience: [],
      education: [],
      projects: []
    });
  };

  // Dynamic content helpers for arrays
  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now(), role: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }
      ]
    }));
  };

  const handleEditExperience = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const handleRemoveExperience = (id) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now(), degree: '', school: '', location: '', startDate: '', endDate: '', description: '' }
      ]
    }));
  };

  const handleEditEducation = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }));
  };

  const handleRemoveEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleAddProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: Date.now(), name: '', technologies: '', date: '', description: '' }
      ]
    }));
  };

  const handleEditProject = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj)
    }));
  };

  const handleRemoveProject = (id) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(proj => proj.id !== id)
    }));
  };

  const sectionOrder = ['contact', 'experience', 'education', 'skills', 'projects'];

  const handleNextSection = () => {
    const currentIndex = sectionOrder.indexOf(activeSection);
    if (currentIndex >= 0 && currentIndex < sectionOrder.length - 1) {
      setActiveSection(sectionOrder[currentIndex + 1]);
      const formCard = document.querySelector('.active-form-card');
      if (formCard) formCard.scrollTop = 0;
    }
  };

  const handlePreviousSection = () => {
    const currentIndex = sectionOrder.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sectionOrder[currentIndex - 1]);
      const formCard = document.querySelector('.active-form-card');
      if (formCard) formCard.scrollTop = 0;
    }
  };

  // Compiled text representation of built resume
  const getResumeText = () => {
    let text = `${formData.firstName} ${formData.lastName}\n`;
    text += `${formData.email} | ${formData.phone} | ${formData.location}\n`;
    text += `${formData.linkedin} | ${formData.github}\n\n`;
    text += `SUMMARY\n${formData.summary}\n\n`;
    text += `EXPERIENCE\n`;
    formData.experience.forEach(exp => {
      text += `${exp.role} - ${exp.company}, ${exp.location}\n`;
      text += `${exp.startDate} - ${exp.endDate}\n`;
      text += `${exp.description}\n\n`;
    });
    text += `EDUCATION\n`;
    formData.education.forEach(edu => {
      text += `${edu.degree} - ${edu.school}, ${edu.location}\n`;
      text += `${edu.startDate} - ${edu.endDate}\n`;
      text += `${edu.description}\n\n`;
    });
    text += `PROJECTS\n`;
    formData.projects.forEach(proj => {
      text += `${proj.name} (${proj.technologies})\n`;
      text += `${proj.date}\n`;
      text += `${proj.description}\n\n`;
    });
    text += `SKILLS\n${formData.skills}\n`;
    return text;
  };

  // Research-backed 5-category ATS Scoring Engine (0-100 Strict Un-clamped Range)
  const analyzeResumeTextContent = (text, filename, isPdf, _isDocx) => {
    const rawLower = (text || '').toLowerCase();

    // 1. Header & Contact Audit (Max 10 pts)
    const hasEmail = /[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}/.test(text);
    const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
    const hasLinkedIn = /linkedin\.com\/in/i.test(text) || /\blinkedin\b/.test(rawLower);
    const hasGitHub = /github\.com\//i.test(text) || /\bgithub\b/.test(rawLower);

    let contactScore = 0;
    if (hasEmail) contactScore += 3;
    if (hasPhone) contactScore += 3;
    if (hasLinkedIn) contactScore += 2;
    if (hasGitHub) contactScore += 2;

    // 2. Section Structure Audit (Max 15 pts)
    const sectionsBank = [
      { name: 'Summary / Profile', keys: ['summary', 'profile', 'about', 'objective'] },
      { name: 'Experience', keys: ['experience', 'work history', 'employment', 'history'] },
      { name: 'Education', keys: ['education', 'academic', 'qualifications', 'degree'] },
      { name: 'Skills', keys: ['skills', 'technologies', 'technical', 'core competencies'] },
      { name: 'Projects', keys: ['projects', 'personal projects', 'portfolio'] }
    ];

    let detectedSectionsCount = 0;
    sectionsBank.forEach(sec => {
      if (sec.keys.some(k => new RegExp(`\\b${k}\\b`).test(rawLower))) {
        detectedSectionsCount++;
      }
    });
    const structureScore = Math.min(15, detectedSectionsCount * 3);

    // 3. Impact Action Verbs & Quantified Metrics (Max 35 pts)
    const actionVerbsList = [
      'accelerated', 'achieved', 'analyzed', 'architected', 'automated', 'boosted', 'built', 
      'collaborated', 'conceptualized', 'coordinated', 'created', 'decreased', 'delivered', 
      'designed', 'developed', 'directed', 'drove', 'eliminated', 'engineered', 'enhanced', 
      'established', 'executed', 'facilitated', 'generated', 'grew', 'implemented', 'improved', 
      'increased', 'initiated', 'innovated', 'integrated', 'launched', 'led', 'managed', 
      'maximized', 'mentored', 'modernized', 'optimized', 'orchestrated', 'overhauled', 
      'pioneered', 'redesigned', 'reduced', 'resolved', 'revamped', 'saved', 'scaled', 
      'secured', 'simplified', 'spearheaded', 'streamlined', 'transformed', 'upgraded'
    ];

    let matchedVerbsCount = 0;
    actionVerbsList.forEach(verb => {
      const regex = new RegExp(`\\b${verb}\\b`, 'g');
      const matches = rawLower.match(regex);
      if (matches) matchedVerbsCount += matches.length;
    });
    // 1.5 points per action verb instance, max 15 pts
    const verbsScore = Math.min(15, matchedVerbsCount * 1.5);

    // Modern metrics regex: detects percentages, currency, multipliers (3x), or numbers >= 5
    const metricsMatches = text.match(/\b(?!\d{4}\b)\d+(\.\d+)?\s?(%|ms|\$|k|m|b|x|\+|percent|users|clients|requests|hours|days|months)\b|\b\$(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{2})?\b|\b(?!\d{4}\b)[5-9]\d+\b/gi) || [];
    // 2.5 points per metric, max 20 pts
    const metricsScore = Math.min(20, metricsMatches.length * 2.5);
    const impactScore = Math.min(35, Math.round(verbsScore + metricsScore));

    // 4. Hard Skills & Tech Keyword Match (Max 30 pts)
    const targetKeywordsList = [
      { name: 'JavaScript', search: '\\bjavascript\\b|\\bjs\\b' },
      { name: 'TypeScript', search: '\\btypescript\\b|\\bts\\b' },
      { name: 'React', search: '\\breact\\b|\\breactjs\\b' },
      { name: 'Node.js', search: '\\bnode\\.?js\\b|\\bnode\\b' },
      { name: 'Python', search: '\\bpython\\b' },
      { name: 'Java', search: '\\bjava\\b' },
      { name: 'C++', search: '\\bc\\+\\+\\b' },
      { name: 'SQL/DB', search: '\\bsql\\b|\\bmysql\\b|\\bpostgresql\\b|\\bnosql\\b|\\bmongodb\\b' },
      { name: 'Git', search: '\\bgit\\b|\\bgithub\\b|\\bgitlab\\b' },
      { name: 'Docker/Cloud', search: '\\bdocker\\b|\\baws\\b|\\bazure\\b|\\bgcp\\b|\\bcloud\\b' },
      { name: 'CI/CD', search: '\\bci/?cd\\b|\\bjenkins\\b|\\bactions\\b' },
      { name: 'APIs', search: '\\bapi\\b|\\brest\\b|\\bgraphql\\b' },
      { name: 'Agile', search: '\\bagile\\b|\\bscrum\\b' },
      { name: 'Algorithms', search: '\\balgorithm[s]?\\b|\\bdata structure[s]?\\b' }
    ];

    const matchedKeywords = [];
    const missingKeywords = [];

    targetKeywordsList.forEach(kw => {
      if (new RegExp(kw.search).test(rawLower)) {
        matchedKeywords.push(kw.name);
      } else {
        missingKeywords.push(kw.name);
      }
    });

    const keywordScore = Math.min(30, Math.round((matchedKeywords.length / targetKeywordsList.length) * 30));

    // 5. Length, Readability & Buzzword Penalty (Max 10 pts)
    const wordsCount = rawLower.split(/\s+/).filter(Boolean).length;
    let lengthScore = 10;
    if (wordsCount < 150) lengthScore = 2;
    else if (wordsCount >= 150 && wordsCount < 300) lengthScore = 6;
    else if (wordsCount >= 300 && wordsCount <= 800) lengthScore = 10;
    else if (wordsCount > 800 && wordsCount <= 1000) lengthScore = 6;
    else if (wordsCount > 1000) lengthScore = 2;

    // Buzzword Penalty
    const buzzwords = ['hard worker', 'team player', 'think outside the box', 'synergy', 'go-getter', 'detail oriented', 'dynamic', 'results-driven'];
    let buzzwordPenalties = 0;
    const foundBuzzwords = [];
    buzzwords.forEach(bw => {
      if (rawLower.includes(bw)) {
        buzzwordPenalties += 2;
        foundBuzzwords.push(bw);
      }
    });
    lengthScore = Math.max(0, lengthScore - buzzwordPenalties);

    // Total Combined Unclamped Score (0 - 100)
    const totalAtsScore = Math.min(100, Math.max(0, Math.round(contactScore + structureScore + impactScore + keywordScore + lengthScore)));

    const structureIssues = [];
    if (!hasEmail || !hasPhone) {
      structureIssues.push({ type: 'warning', msg: 'Missing Contact: Ensure professional email and phone number are visible.' });
    }
    if (!hasLinkedIn && !hasGitHub) {
      structureIssues.push({ type: 'warning', msg: 'Missing Links: Add your LinkedIn profile and GitHub/Portfolio to boost credibility.' });
    }
    if (matchedVerbsCount < 5) {
      structureIssues.push({ type: 'warning', msg: 'Weak Action Verbs: Use strong industry verbs (e.g. Engineered, Spearheaded, Optimized) at the start of bullet points.' });
    }
    if (metricsMatches.length < 2) {
      structureIssues.push({ type: 'warning', msg: 'Missing Impact Metrics: ATS systems score higher when you quantify achievements (e.g., Improved load speed by 35%, Led team of 5).' });
    }
    if (detectedSectionsCount < 4) {
      structureIssues.push({ type: 'warning', msg: `Missing Sections: Only detected ${detectedSectionsCount}/5 standard sections. Use clear headings like EXPERIENCE, EDUCATION, SKILLS.` });
    }
    if (foundBuzzwords.length > 0) {
      structureIssues.push({ type: 'warning', msg: `Cliché Buzzwords Detected: Avoid vague fluff like '${foundBuzzwords[0]}'. Show impact, don't just tell.` });
    }
    
    if (structureIssues.length === 0) {
      structureIssues.push({ type: 'info', msg: '🎉 Outstanding! Your resume passes top ATS parsers with high keyword density, strong metrics, and flawless structure.' });
    }

    structureIssues.push({ 
      type: 'info', 
      msg: isPdf ? 'PDF format detected. Ensure it was exported with selectable text, not as an image.' : 'DOCX format detected. Exporting as PDF preserves exact styling across all devices.' 
    });

    return {
      score: totalAtsScore,
      subScores: {
        contact: { score: contactScore, max: 10, label: 'Contact Links' },
        structure: { score: structureScore, max: 15, label: 'Sections' },
        impact: { score: impactScore, max: 35, label: 'Verbs & Metrics' },
        keywords: { score: keywordScore, max: 30, label: 'Tech Keywords' },
        length: { score: lengthScore, max: 10, label: 'Length & Clarity' }
      },
      wordsCount,
      matchedVerbsCount,
      metricsCount: metricsMatches.length,
      matchedKeywords,
      missingKeywords,
      structureIssues,
      checklist: [
        { name: 'Contact & Portfolio Links', passed: hasEmail && hasPhone && (hasLinkedIn || hasGitHub) },
        { name: 'Standard Section Headers', passed: detectedSectionsCount >= 4 },
        { name: 'Strong Action Verbs (5+)', passed: matchedVerbsCount >= 5 },
        { name: 'Quantified Metrics Included', passed: metricsMatches.length >= 2 },
        { name: 'Optimal Length & No Buzzwords', passed: (wordsCount >= 300 && wordsCount <= 800) && foundBuzzwords.length === 0 }
      ]
    };
  };

  // Real-time metrics calculations
  const getBuilderMetrics = () => {
    const fullText = getResumeText();
    const atsResult = analyzeResumeTextContent(fullText, 'BuilderResume.pdf', true, false);
    
    const summaryWords = formData.summary.trim().split(/\s+/).filter(Boolean).length;
    const skillsCount = formData.skills.split(',').map(s => s.trim()).filter(Boolean).length;
    
    // Convert matched verbs to mock array to satisfy UI requirements
    const foundVerbs = new Array(atsResult.matchedVerbsCount || 0).fill('verb');

    return {
      score: atsResult.score,
      matchedKeywords: atsResult.matchedKeywords,
      missingKeywords: atsResult.missingKeywords,
      foundVerbs,
      summaryWords,
      skillsCount,
      checklist: atsResult.checklist
    };
  };

  const metrics = getBuilderMetrics();

  // Run simulated analyzer on the built resume content
  const handleAnalyzeBuiltResume = async () => {
    setAnalyzing(true);
    setActiveTab('analyze');
    setResults(null);
    setMlResumeData(null);

    const fullText = getResumeText();

    try {
      const mlRes = await apiRequest('/ml/analyze-resume', 'POST', {
        resumeText: fullText,
        targetRole
      });
      if (mlRes?.success) {
        setMlResumeData(mlRes);
      }
    } catch (e) {
      console.warn('ML resume analysis fallback:', e);
    }

    setTimeout(() => {
      setAnalyzing(false);
      const actualResults = analyzeResumeTextContent(fullText, 'BuilderResume.pdf', true, false);
      setResults(actualResults);
    }, 1000);
  };

  // Strict Resume File Type Validator
  const validateResumeFile = (selectedFile) => {
    if (!selectedFile) return false;

    const lowerName = selectedFile.name.toLowerCase();
    const isPdf = lowerName.endsWith('.pdf') || selectedFile.type === 'application/pdf';
    const isDocx = lowerName.endsWith('.docx') || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    // Explicitly reject video, audio, image, and other non-resume formats
    const isMediaOrNonDoc = 
      selectedFile.type.startsWith('video/') || 
      selectedFile.type.startsWith('audio/') || 
      selectedFile.type.startsWith('image/') ||
      /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|3gp|mp3|wav|ogg|aac|jpg|jpeg|png|gif|webp|bmp|svg|zip|rar|tar|exe|bin|iso)$/i.test(lowerName);

    if (isMediaOrNonDoc || (!isPdf && !isDocx)) {
      alert("⚠️ Invalid file format!\n\nThe AI Resume Analyzer only accepts document files (.PDF or .DOCX).\n\nVideo, audio, and image files cannot be analyzed as resumes.");
      return false;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      alert("File size exceeds 15MB limit. Please upload a smaller resume document.");
      return false;
    }

    return true;
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateResumeFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const chosenFile = e.target.files[0];
      if (validateResumeFile(chosenFile)) {
        setFile(chosenFile);
      } else {
        e.target.value = ''; // Reset the file picker
      }
    }
  };

  const startAnalysis = async () => {
    if (!file) return;

    if (!validateResumeFile(file)) {
      setFile(null);
      return;
    }

    setAnalyzing(true);
    setResults(null);

    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    const isDocx = file.name.toLowerCase().endsWith('.docx');
    let extractedText = '';

    try {
      const arrayBuffer = await file.arrayBuffer();

      if (isPdf) {
        // Use pdfjs-dist to extract text from PDF
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        const textParts = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .filter(item => 'str' in item)
            .map(item => item.str)
            .join(' ');
          textParts.push(pageText);
        }
        extractedText = textParts.join('\n');
      } else if (isDocx) {
        // Use mammoth to extract text from DOCX
        const result = await mammoth.extractRawText({ arrayBuffer });
        extractedText = result.value || '';
      }
    } catch (err) {
      console.error('Text extraction failed:', err);
      alert('Could not extract readable text from this document. Please verify your PDF or Word document is not corrupted or password-protected.');
      setAnalyzing(false);
      return;
    }

    // Verify meaningful textual content was extracted
    if (!extractedText || extractedText.trim().length < 25) {
      alert("⚠️ Scanned Document or Empty Text Detected!\n\nNo readable text could be found inside this document. If your resume is a scanned image or photo saved as PDF, please upload a standard text-based PDF or DOCX file so ATS parsers can read it.");
      setAnalyzing(false);
      return;
    }

    // Call Python ML NLP inference pipeline
    try {
      const mlRes = await apiRequest('/ml/analyze-resume', 'POST', {
        resumeText: extractedText,
        targetRole
      });
      if (mlRes?.success) {
        setMlResumeData(mlRes);
      }
    } catch (e) {
      console.warn('ML resume analysis fallback:', e);
    }

    // Run the scoring engine on the actual extracted text
    const computedResults = analyzeResumeTextContent(extractedText, file.name, isPdf, isDocx);

    // Small delay for UX animation
    setTimeout(() => {
      setAnalyzing(false);
      setResults(computedResults);
    }, 800);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=1000');
    if (!printWindow) {
      window.print();
      return;
    }

    const emailHref = formatEmailLink(formData.email);
    const phoneHref = formatPhoneLink(formData.phone);
    const linkedinHref = formatLinkedInUrl(formData.linkedin);
    const githubHref = formatGitHubUrl(formData.github);

    const linkedinDisplay = getCleanLinkedInDisplay(formData.linkedin);
    const githubDisplay = getCleanGitHubDisplay(formData.github);

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>${formData.firstName || 'Candidate'}_${formData.lastName || 'Resume'}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              color: #111827;
              background: #ffffff;
              line-height: 1.45;
              font-size: 11.5px;
            }
            a {
              color: #111827 !important;
              text-decoration: none !important;
              cursor: pointer !important;
            }
            a:hover {
              text-decoration: underline !important;
            }
            .header {
              text-align: center;
              margin-bottom: 12px;
              border-bottom: 1.5px solid #111827;
              padding-bottom: 8px;
            }
            .name {
              font-size: 22px;
              font-weight: 800;
              letter-spacing: 0.05em;
              text-transform: uppercase;
              color: #111827;
            }
            .contact-row {
              display: flex;
              justify-content: center;
              align-items: center;
              flex-wrap: wrap;
              gap: 12px;
              font-size: 11px;
              color: #374151;
              margin-top: 4px;
            }
            .contact-link {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              color: #111827 !important;
              font-weight: 500;
            }
            .section {
              margin-top: 12px;
            }
            .section-title {
              font-size: 12px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              border-bottom: 1px solid #9ca3af;
              padding-bottom: 2px;
              margin-bottom: 6px;
              color: #111827;
            }
            .item {
              margin-bottom: 8px;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              align-items: baseline;
              font-size: 11.5px;
            }
            .item-title {
              font-weight: 700;
              color: #111827;
            }
            .item-sub {
              display: flex;
              justify-content: space-between;
              font-size: 11px;
              color: #4b5563;
              font-style: italic;
              margin-top: 1px;
            }
            .item-date {
              font-style: normal;
              font-weight: 500;
              color: #374151;
            }
            ul {
              margin-top: 3px;
              padding-left: 16px;
            }
            li {
              margin-bottom: 2px;
              text-align: justify;
            }
            .proj-links {
              display: inline-flex;
              gap: 8px;
              font-size: 10px;
              font-weight: 600;
              margin-left: 6px;
            }
            .proj-link {
              color: #2563eb !important;
              text-decoration: underline !important;
            }
            svg {
              vertical-align: middle;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="name">${formData.firstName || 'FIRST'} ${formData.lastName || 'LAST'}</h1>
            <div class="contact-row">
              ${formData.email ? `<a href="${emailHref}" class="contact-link"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> ${formData.email}</a>` : ''}
              ${formData.phone ? `<a href="${phoneHref}" class="contact-link"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> ${formData.phone}</a>` : ''}
              ${formData.location ? `<span class="contact-link"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${formData.location}</span>` : ''}
              ${formData.linkedin ? `<a href="${linkedinHref}" target="_blank" class="contact-link"><svg width="12" height="12" viewBox="0 0 24 24" fill="#0077B5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> linkedin.com/in/${linkedinDisplay}</a>` : ''}
              ${formData.github ? `<a href="${githubHref}" target="_blank" class="contact-link"><svg width="12" height="12" viewBox="0 0 24 24" fill="#111827"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg> github.com/${githubDisplay}</a>` : ''}
            </div>
          </div>

          ${formData.summary ? `
          <div class="section">
            <div class="section-title">Professional Summary</div>
            <p style="text-align: justify;">${formData.summary}</p>
          </div>` : ''}

          ${formData.experience.filter(e => e.role || e.company).length > 0 ? `
          <div class="section">
            <div class="section-title">Professional Experience</div>
            ${formData.experience.filter(e => e.role || e.company).map(exp => `
              <div class="item">
                <div class="item-header">
                  <span class="item-title">${exp.role || ''}</span>
                  <span class="item-date">${exp.location || ''}</span>
                </div>
                <div class="item-sub">
                  <span>${exp.company || ''}</span>
                  <span class="item-date">${exp.startDate || ''} – ${exp.endDate || ''}</span>
                </div>
                ${exp.description ? `
                  <ul>
                    ${exp.description.split('\n').filter(Boolean).map(bullet => `
                      <li>${bullet.trim().startsWith('•') || bullet.trim().startsWith('-') ? bullet.trim().substring(1).trim() : bullet.trim()}</li>
                    `).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>` : ''}

          ${formData.education.filter(e => e.degree || e.school).length > 0 ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${formData.education.filter(e => e.degree || e.school).map(edu => `
              <div class="item">
                <div class="item-header">
                  <span class="item-title">${edu.degree || ''}</span>
                  <span class="item-date">${edu.location || ''}</span>
                </div>
                <div class="item-sub">
                  <span>${edu.school || ''}</span>
                  <span class="item-date">${edu.startDate ? `${edu.startDate} – ` : ''}${edu.endDate || ''}</span>
                </div>
                ${edu.description ? `<p style="margin-top: 2px; color: #4b5563;">${edu.description}</p>` : ''}
              </div>
            `).join('')}
          </div>` : ''}

          ${formData.projects.filter(p => p.name).length > 0 ? `
          <div class="section">
            <div class="section-title">Academic & Engineering Projects</div>
            ${formData.projects.filter(p => p.name).map(proj => `
              <div class="item">
                <div class="item-header">
                  <span>
                    <strong class="item-title">${proj.name}</strong>
                    ${proj.technologies ? `<span style="color: #4b5563; font-weight: normal;"> | ${proj.technologies}</span>` : ''}
                    ${proj.link ? `<a href="${formatWebUrl(proj.link)}" target="_blank" class="proj-link">[Live Demo]</a>` : ''}
                    ${proj.github ? `<a href="${formatGitHubUrl(proj.github)}" target="_blank" class="proj-link">[GitHub]</a>` : ''}
                  </span>
                  <span class="item-date">${proj.date || ''}</span>
                </div>
                ${proj.description ? `
                  <ul>
                    ${proj.description.split('\n').filter(Boolean).map(bullet => `
                      <li>${bullet.trim().startsWith('•') || bullet.trim().startsWith('-') ? bullet.trim().substring(1).trim() : bullet.trim()}</li>
                    `).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>` : ''}

          ${formData.skills.trim().length > 0 ? `
          <div class="section">
            <div class="section-title">Technical Skills & Competencies</div>
            <p>${formData.skills}</p>
          </div>` : ''}
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="resume-analyzer-page stagger-children">
      {/* Top Header Card */}
      <div className="card p-6 mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="font-bold text-xl text-accent-dark">Resume Optimization Hub</h2>
            <p className="text-xs text-secondary mt-1">Check ATS compatibility scores, audit formatting issues, or instantly build a parser-friendly resume.</p>
          </div>
          {/* Tabs */}
          <div className="tabs border-none">
            <button 
              className={`tab-btn ${activeTab === 'analyze' ? 'active' : ''}`}
              onClick={() => setActiveTab('analyze')}
            >
              Analyze Resume File
            </button>
            <button 
              className={`tab-btn ${activeTab === 'build' ? 'active' : ''}`}
              onClick={() => setActiveTab('build')}
            >
              Build ATS Resume
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'analyze' ? (
        /* ANALYZER VIEW */
        <>
          {!results && !analyzing ? (
            <div className="card p-8 max-w-lg mx-auto text-center">
              <h3 className="section-title">AI Resume Scan</h3>
              <p className="text-xs text-secondary mt-1">Upload your resume (PDF or DOCX) to check keyword density matching and ATS compliance.</p>
              
              {/* Target Role Selector for NLP Semantic Match */}
              <div className="mt-4 text-left">
                <label className="text-xs font-semibold text-secondary flex items-center justify-between">
                  <span>Target Career Track for Semantic Match:</span>
                  <span className="text-[10px] text-accent font-semibold flex items-center gap-1">
                    <Sparkles size={11} /> NLP Model
                  </span>
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="input text-xs w-full mt-1.5 bg-surface border border-border rounded-lg py-2 px-3 text-primary focus:border-accent focus:outline-none"
                >
                  <option value="Software Engineer (SDE / Full Stack)">Software Engineer (SDE / Full Stack)</option>
                  <option value="Data Science">Data Science (AI / ML / Analytics)</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="Java Developer">Java Developer (Enterprise / Spring)</option>
                  <option value="DevOps Engineer">DevOps Engineer (Cloud / CI/CD)</option>
                  <option value="Web Designing">Web Designing (Frontend UI/UX)</option>
                  <option value="Database">Database Administrator / SQL Engineer</option>
                  <option value="Network Security Engineer">Network Security Engineer</option>
                  <option value="Testing">QA & Automation Testing</option>
                  <option value="Blockchain">Blockchain Developer</option>
                  <option value="Backend Engineer (Distributed Systems)">Backend Engineer (Distributed Systems)</option>
                </select>
              </div>

              <div 
                className="dropzone mt-4"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload size={36} className="text-accent mx-auto" />
                <p className="text-sm font-semibold mt-4">Drag and drop your resume here</p>
                <p className="text-xs text-secondary mt-1">Supported formats: <strong>.PDF, .DOCX</strong> (Max 15MB)</p>
                <input 
                  type="file" 
                  className="sr-only" 
                  id="res-file-picker" 
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                  onChange={handleFileChange}
                />
                <label htmlFor="res-file-picker" className="btn btn-secondary btn-sm mt-4 cursor-pointer font-semibold">Browse Resume Document</label>
              </div>

              {file && (
                <div className="file-info-badge mt-4 p-3 bg-background border rounded flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <FileText size={16} className="text-accent" />
                    <span className="font-semibold">{file.name}</span>
                  </div>
                  <button onClick={() => setFile(null)} className="btn btn-ghost btn-sm p-1 text-danger">Remove</button>
                </div>
              )}

              <button 
                onClick={startAnalysis} 
                className="btn btn-primary w-full mt-6"
                disabled={!file}
              >
                Analyze Resume ATS Compliance
              </button>
            </div>
          ) : analyzing ? (
            <div className="card p-12 text-center max-w-md mx-auto flex flex-col items-center">
              <RefreshCw size={36} className="text-accent animate-spin" />
              <h3 className="font-bold text-lg mt-4 animate-pulse">Running AI Resume Check...</h3>
              <p className="text-xs text-secondary mt-2">Checking formatting structures, parsing sections, and verifying keyword matches against hiring standards.</p>
            </div>
          ) : (
            /* Results Section with 3-Column Executive Dashboard */
            <div className={`resume-analyzer-results-grid ${!mlResumeData?.success ? 'no-ml' : ''}`}>
              
              {/* ─────────────────────────────────────────────────────────────
                  COLUMN 1: Overall ATS Score & Category Breakdown
                  ───────────────────────────────────────────────────────────── */}
              <div className="results-col results-col-score card p-6 flex flex-col items-center text-center shadow-sm">
                <h3 className="section-title">ATS Compliance Score</h3>
                
                <div className="ats-score-container mt-6 relative flex items-center justify-center">
                  <svg width="130" height="130">
                    <circle cx="65" cy="65" r="54" fill="none" stroke="var(--border-light)" strokeWidth="10" />
                    <circle 
                      cx="65" 
                      cy="65" 
                      r="54" 
                      fill="none" 
                      stroke="var(--accent)" 
                      strokeWidth="10" 
                      strokeDasharray={`${(results.score / 100) * 339} 339`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute font-extrabold text-3xl text-accent-dark">{results.score}%</div>
                </div>
                
                <span className={`badge ${results.score >= 80 ? 'badge-success' : 'badge-warning'} mt-4`}>
                  {results.score >= 80 ? '🎉 High ATS Pass Potential' : '⚡ Action Required (Goal: 80%+)'}
                </span>

                {/* 5 Sub-Score Categories */}
                <div className="subscores-list mt-6 w-full text-left flex flex-col gap-3">
                  <h4 className="font-semibold text-xs text-secondary uppercase tracking-wider mb-1">ATS Category Breakdown</h4>
                  {Object.values(results.subScores || {}).map((sub, idx) => (
                    <div key={idx} className="subscore-item">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-primary">{sub.label}</span>
                        <span className="text-accent-dark">{sub.score}/{sub.max}</span>
                      </div>
                      <div className="w-full bg-border-light h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-accent h-full transition-all duration-500" 
                          style={{ width: `${(sub.score / sub.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={resetAnalyzer} className="btn btn-secondary w-full mt-6 flex items-center justify-center gap-2">
                  <RotateCcw size={14} /> Upload Another Resume
                </button>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  COLUMN 2: Trained ML NLP Resume Intelligence
                  ───────────────────────────────────────────────────────────── */}
              {mlResumeData?.success && (
                <div className="results-col results-col-ml">
                  <div className="card p-5 border border-border shadow-sm flex flex-col gap-4">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-border">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent shrink-0">
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="section-title text-sm m-0">AI Resume Intelligence</h3>
                            <span className="badge badge-success text-[10px] py-0 px-2">TF-IDF NLP</span>
                          </div>
                          <p className="text-[11px] text-secondary mt-0.5">
                            Benchmark Role: <strong className="text-primary font-semibold">{mlResumeData.target_role}</strong>
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xl font-black text-accent leading-tight">{mlResumeData.semantic_match_score}%</div>
                        <span className="text-[10px] text-tertiary font-medium uppercase tracking-wider">Semantic Fit</span>
                      </div>
                    </div>

                    {/* AI Classified Career Domain Banner */}
                    {mlResumeData.predicted_category && (
                      <div className="domain-classifier-banner p-3 rounded-lg bg-surface-raised border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                          <span className="text-tertiary text-[11px]">Domain:</span>
                          <span className="font-bold text-primary">{mlResumeData.predicted_category}</span>
                          {mlResumeData.category_confidence && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              {mlResumeData.category_confidence}% match
                            </span>
                          )}
                        </div>
                        {mlResumeData.top_categories && mlResumeData.top_categories.length > 1 && (
                          <div className="flex items-center gap-1.5 text-[11px] text-secondary">
                            <span className="text-tertiary">Alt:</span>
                            {mlResumeData.top_categories.slice(1, 3).map((alt, aIdx) => (
                              <span key={aIdx} className="text-secondary font-medium">
                                {alt.category} <span className="text-tertiary">({alt.confidence}%)</span>{aIdx < 1 ? ' ·' : ''}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* 3 Metrics: Skills, Verbs, Metrics */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-2.5 bg-surface-raised/60 border border-border/80 rounded-lg text-center">
                        <div className="text-base font-bold text-primary">{mlResumeData.total_skills_detected}</div>
                        <div className="text-[10px] text-secondary mt-0.5 font-medium">Skills Found</div>
                      </div>
                      <div className="p-2.5 bg-surface-raised/60 border border-border/80 rounded-lg text-center">
                        <div className="text-base font-bold text-emerald-500">{mlResumeData.action_verbs_detected}</div>
                        <div className="text-[10px] text-secondary mt-0.5 font-medium">Action Verbs</div>
                      </div>
                      <div className="p-2.5 bg-surface-raised/60 border border-border/80 rounded-lg text-center">
                        <div className="text-base font-bold text-blue-500">{mlResumeData.quantified_metrics_count}</div>
                        <div className="text-[10px] text-secondary mt-0.5 font-medium">Metrics/Impact</div>
                      </div>
                    </div>

                    {/* Domain-Categorized Skill Extraction (Streamlined Domain Cloud) */}
                    {mlResumeData.categorized_skills && Object.keys(mlResumeData.categorized_skills).length > 0 && (
                      <div className="domain-skills-section">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-[11px] text-tertiary uppercase tracking-wider">
                            Identified Skills by Domain
                          </h4>
                          <span className="text-[10px] text-tertiary">
                            {Object.values(mlResumeData.categorized_skills).reduce((acc, s) => acc + s.length, 0)} extracted
                          </span>
                        </div>
                        <div className="domain-skills-grid flex flex-col gap-1.5">
                          {Object.entries(mlResumeData.categorized_skills).map(([category, skills]) => (
                            <div key={category} className="skill-domain-row flex items-start gap-2 text-xs">
                              <span className="skill-domain-badge shrink-0">
                                {category.replace('_', ' ')}
                              </span>
                              <div className="flex flex-wrap gap-1.5 flex-1 pt-0.5">
                                {skills.map((skill, sIdx) => (
                                  <span key={sIdx} className="skill-chip">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* High-Priority Missing Keywords */}
                    {mlResumeData.missing_target_skills && mlResumeData.missing_target_skills.length > 0 && (
                      <div className="missing-skills-callout">
                        <div className="missing-skills-header">
                          <AlertTriangle size={14} className="missing-skills-icon" />
                          <span>Missing for {mlResumeData.target_role}:</span>
                        </div>
                        <div className="missing-skills-list">
                          {mlResumeData.missing_target_skills.map((skill, kIdx) => (
                            <span key={kIdx} className="missing-skill-pill">
                              + {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dataset Training Credentials Footer */}
                    <div className="text-[11px] text-secondary flex items-center justify-between border-t border-border pt-2.5 mt-auto">
                      <span>Trained on 962 real resumes (25 domains)</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {mlResumeData.model_metadata?.test_accuracy || 98.96}% Accuracy
                      </span>
                    </div>

                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  COLUMN 3: Parser Readability, Keywords & AI Recommendations
                  ───────────────────────────────────────────────────────────── */}
              <div className="results-col results-col-audit flex flex-col gap-4">
                
                {/* 1. Readability & Format Audit */}
                <div className="card p-5 border border-border shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent shrink-0">
                        <CheckCircle size={16} />
                      </div>
                      <h3 className="section-title text-sm m-0">Readability & Format Audit</h3>
                    </div>
                    <span className="text-[11px] font-semibold text-secondary">
                      {results.checklist.filter(c => c.passed).length}/{results.checklist.length} Passed
                    </span>
                  </div>
                  
                  <div className="audit-checklist-container">
                    {results.checklist.map((item, idx) => (
                      <div key={idx} className="audit-checklist-row">
                        <div className="audit-checklist-left">
                          {item.passed ? (
                            <span className="audit-status-icon pass">
                              <Check size={11} strokeWidth={3} />
                            </span>
                          ) : (
                            <span className="audit-status-icon missing">
                              <AlertTriangle size={10} strokeWidth={2.5} />
                            </span>
                          )}
                          <span className="audit-item-name">{item.name}</span>
                        </div>
                        {item.passed ? (
                          <span className="audit-badge pass">Pass</span>
                        ) : (
                          <span className="audit-badge missing">Missing</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Technical Keyword Density Check */}
                <div className="card p-5 border border-border shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent shrink-0">
                        <FileCode size={16} />
                      </div>
                      <h3 className="section-title text-sm m-0">Keyword Density Check</h3>
                    </div>
                    <span className="text-[11px] font-semibold text-accent">
                      {results.matchedKeywords.length} Detected
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-[10px] text-tertiary uppercase tracking-wider mb-2">
                      Matched Keywords ({results.matchedKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {results.matchedKeywords.map((k, idx) => (
                        <span key={idx} className="keyword-chip-matched">
                          <Check size={11} strokeWidth={2.5} /> {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <h4 className="font-semibold text-[10px] text-tertiary uppercase tracking-wider mb-2">
                      Recommended Additions ({results.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {results.missingKeywords.length === 0 ? (
                        <span className="text-xs text-secondary italic">None! All target keywords detected.</span>
                      ) : (
                        results.missingKeywords.map((k, idx) => (
                          <span key={idx} className="keyword-chip-missing">
                            + {k}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Actionable Recommendations */}
                <div className="card p-5 border border-border shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center text-accent shrink-0">
                        <Lightbulb size={16} />
                      </div>
                      <h3 className="section-title text-sm m-0">Actionable Recommendations</h3>
                    </div>
                    <span className="text-[11px] font-semibold text-secondary">
                      {results.structureIssues.length} Notes
                    </span>
                  </div>

                  <div className="recommendations-container">
                    {results.structureIssues.map((issue, idx) => {
                      const parts = issue.msg.split(': ');
                      const title = parts.length > 1 ? parts[0] : (issue.type === 'warning' ? 'Recommendation' : 'Format Verification');
                      const text = parts.length > 1 ? parts.slice(1).join(': ') : issue.msg;

                      return (
                        <div 
                          key={idx} 
                          className={`recommendation-box ${issue.type === 'warning' ? 'warning' : 'info'}`}
                        >
                          <div className="recommendation-icon-wrapper">
                            {issue.type === 'warning' ? (
                              <AlertTriangle size={15} className="recommendation-icon warning" />
                            ) : (
                              <Info size={15} className="recommendation-icon info" />
                            )}
                          </div>
                          <div className="recommendation-content">
                            <div className="recommendation-title">{title}</div>
                            <div className="recommendation-msg">{text}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          )}
        </>
      ) : (
        /* RESUME BUILDER VIEW */
        <div className="resume-builder-workspace">
          {/* Left Panel: SECTIONS Navigation Sidebar + Active Section Form Card */}
          <div className="builder-editor-container">
            {/* Left Sidebar Column */}
            <div className="flex flex-col gap-4">
              {/* SECTIONS Sidebar */}
              <div className="sections-sidebar card">
                <h4 className="sections-sidebar-title">SECTIONS</h4>
                <div className="sections-menu">
                  {[
                    { id: 'contact', label: 'Contact', title: 'Contact & Personal Info', complete: !!(formData.firstName && formData.lastName && formData.email && formData.phone) },
                    { id: 'experience', label: 'Experience', title: 'Work & Internship Experience', complete: formData.experience.length > 0 && formData.experience.some(e => e.role || e.company) },
                    { id: 'education', label: 'Education', title: 'Education Details', complete: formData.education.length > 0 && formData.education.some(e => e.degree || e.school) },
                    { id: 'skills', label: 'Skills', title: 'Competencies & Skills', complete: formData.skills.trim().length > 0 },
                    { id: 'projects', label: 'Projects', title: 'Academic & Engineering Projects', complete: formData.projects.length > 0 && formData.projects.some(p => p.name) }
                  ].map(sec => (
                    <button
                      key={sec.id}
                      className={`section-nav-item ${activeSection === sec.id ? 'active' : ''}`}
                      onClick={() => setActiveSection(sec.id)}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`section-check-icon ${sec.complete ? 'complete' : 'incomplete'}`}>
                          <Check size={13} strokeWidth={3} />
                        </span>
                        <span className="font-semibold text-sm">{sec.label}</span>
                      </div>
                      {activeSection === sec.id && <span className="active-dot-indicator"></span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live ATS Score Widget Card (Compact & Smaller) */}
              <div className="card p-3 text-center border rounded-xl bg-surface shadow-xs flex flex-col items-center">
                <span className="text-[10px] font-bold text-secondary tracking-wider uppercase block">ATS SCORE</span>
                <div className="text-lg font-black text-primary leading-tight mt-0.5">
                  {metrics.score}<span className="text-xs font-bold text-secondary">/100</span>
                </div>
                <div className="text-[10px] font-bold mt-1 tracking-wide" style={{ color: metrics.score >= 80 ? '#2e7d32' : metrics.score >= 60 ? '#d97706' : '#dc2626' }}>
                  PASS RATE: {metrics.score >= 80 ? 'HIGH' : metrics.score >= 60 ? 'MEDIUM' : 'LOW'}
                </div>

                {/* Half-circle Semi-Circular Progress Arch Gauge */}
                <div className="flex justify-center items-center my-1.5 relative">
                  <svg width="95" height="50" viewBox="0 0 120 62">
                    {/* Background Arch */}
                    <path 
                      d="M 15 52 A 45 45 0 0 1 105 52" 
                      fill="none" 
                      stroke="#e2e8f0" 
                      strokeWidth="9" 
                      strokeLinecap="round" 
                    />
                    {/* Progress Arch */}
                    <path 
                      d="M 15 52 A 45 45 0 0 1 105 52" 
                      fill="none" 
                      stroke={metrics.score >= 80 ? '#52ad75' : metrics.score >= 60 ? '#f59e0b' : '#ef4444'} 
                      strokeWidth="9" 
                      strokeLinecap="round" 
                      strokeDasharray="141.37"
                      strokeDashoffset={141.37 * (1 - metrics.score / 100)}
                      style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
                    />
                    {/* Percentage Text inside gauge */}
                    <text x="60" y="46" textAnchor="middle" fill="#1e3a29" style={{ fontSize: '15px', fontWeight: '800' }}>
                      {metrics.score}%
                    </text>
                  </svg>
                </div>

                {/* Status Footer text */}
                <div className="text-[11px] font-bold mt-0.5" style={{ color: metrics.score >= 80 ? '#2e7d32' : metrics.score >= 60 ? '#d97706' : '#dc2626' }}>
                  {metrics.score >= 80 ? 'Ready for applications' : metrics.score >= 60 ? 'Needs minor polish' : 'Requires revisions'}
                </div>
              </div>
            </div>

            {/* Active Form Card */}
            <div className="active-form-card card p-6">
              {/* Form Card Top Header */}
              <div className="flex justify-between items-center mb-6 border-b border-light pb-4">
                <h3 className="font-bold text-lg text-primary">
                  {activeSection === 'contact' && 'Contact & Personal Info'}
                  {activeSection === 'experience' && 'Work & Internship Experience'}
                  {activeSection === 'education' && 'Education Details'}
                  {activeSection === 'skills' && 'Competencies & Skills'}
                  {activeSection === 'projects' && 'Academic & Engineering Projects'}
                </h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={resetToProfile} 
                    className="btn btn-ghost btn-sm text-secondary hover:text-accent flex items-center gap-1.5 font-medium"
                    title="Import profile info"
                  >
                    <RotateCcw size={14} /> Import Profile
                  </button>
                  <button 
                    onClick={clearForm} 
                    className="btn btn-ghost btn-sm text-danger flex items-center gap-1.5 font-medium"
                    title="Clear all fields"
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
              </div>

              {/* Form Fields for Active Section */}
              {activeSection === 'contact' && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-2 gap-4">
                    <div className="input-group">
                      <label className="label text-xs font-semibold text-secondary">First Name</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. John"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="label text-xs font-semibold text-secondary">Last Name</label>
                      <input 
                        type="text" 
                        className="input" 
                        placeholder="e.g. Doe"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-2 gap-4">
                    <div className="input-group">
                      <label className="label text-xs font-semibold text-secondary">Email Address</label>
                      <input 
                        type="email" 
                        className="input" 
                        placeholder="e.g. john.doe@email.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="label text-xs font-semibold text-secondary">Phone Number</label>
                      <input 
                        type="tel" 
                        className="input" 
                        placeholder="e.g. +91 9876543210"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="label text-xs font-semibold text-secondary">Location (City, State / Country)</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="e.g. Bangalore, India"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-2 gap-4">
                    <div className="input-group">
                      <label className="label text-xs font-semibold text-secondary">LinkedIn URL</label>
                      <input 
                        type="url" 
                        className="input" 
                        placeholder="e.g. linkedin.com/in/johndoe"
                        value={formData.linkedin}
                        onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label className="label text-xs font-semibold text-secondary">GitHub / Portfolio</label>
                      <input 
                        type="url" 
                        className="input" 
                        placeholder="e.g. github.com/johndoe"
                        value={formData.github}
                        onChange={e => setFormData({ ...formData, github: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="label text-xs font-semibold text-secondary">Professional Summary</label>
                    <textarea 
                      className="textarea text-xs" 
                      rows="4"
                      placeholder="Write a brief, impact-focused summary (20-100 words)..."
                      value={formData.summary}
                      onChange={e => setFormData({ ...formData, summary: e.target.value })}
                    />
                    <span className="text-[10px] text-secondary self-end mt-1">
                      Word count: {metrics.summaryWords} (Target: 20-100)
                    </span>
                  </div>
                </div>
              )}

              {activeSection === 'experience' && (
                <div className="flex flex-col gap-5">
                  {formData.experience.map((exp, idx) => (
                    <div key={exp.id} className="p-4 border border-border-light rounded-xl bg-background flex flex-col gap-4 shadow-xs">
                      {/* Entry Header */}
                      <div className="flex justify-between items-center pb-2 border-b border-light">
                        <span className="font-extrabold text-xs text-accent-dark tracking-wide uppercase">
                          Work Entry #{idx + 1}
                        </span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveExperience(exp.id)}
                          className="btn btn-ghost btn-sm text-danger hover:bg-danger-bg p-1 px-2.5 rounded-md flex items-center gap-1 text-xs font-semibold"
                          title="Remove experience entry"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>

                      <div className="grid grid-2 gap-4">
                        <div className="input-group">
                          <label className="label text-xs font-semibold text-secondary">Job Title / Role</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="e.g. Software Engineer Intern"
                            value={exp.role}
                            onChange={e => handleEditExperience(exp.id, 'role', e.target.value)}
                          />
                        </div>
                        <div className="input-group">
                          <label className="label text-xs font-semibold text-secondary">Company Name</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="e.g. Google"
                            value={exp.company}
                            onChange={e => handleEditExperience(exp.id, 'company', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-3 gap-3">
                        <div className="input-group grid-span-1">
                          <label className="label text-xs font-semibold text-secondary">Location</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="Bangalore, IN"
                            value={exp.location}
                            onChange={e => handleEditExperience(exp.id, 'location', e.target.value)}
                          />
                        </div>
                        <div className="input-group grid-span-1">
                          <label className="label text-xs font-semibold text-secondary">Start Date</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="Jun 2025"
                            value={exp.startDate}
                            onChange={e => handleEditExperience(exp.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="input-group grid-span-1">
                          <label className="label text-xs font-semibold text-secondary">End Date</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="Present or Aug 2025"
                            value={exp.endDate}
                            disabled={exp.current}
                            onChange={e => handleEditExperience(exp.id, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          id={`exp-curr-${exp.id}`}
                          checked={exp.current}
                          onChange={e => {
                            const checked = e.target.checked;
                            handleEditExperience(exp.id, 'current', checked);
                            if (checked) {
                              handleEditExperience(exp.id, 'endDate', 'Present');
                            }
                          }}
                          className="rounded text-accent focus:ring-accent"
                        />
                        <label htmlFor={`exp-curr-${exp.id}`} className="text-xs font-semibold cursor-pointer text-primary">
                          I currently work here
                        </label>
                      </div>

                      <div className="input-group">
                        <label className="label text-xs font-semibold text-secondary">Description & Key Achievements (Bullet points recommended)</label>
                        <textarea 
                          className="textarea text-xs" 
                          rows="4"
                          placeholder="Detail actions taken and quantifiable results (e.g. Developed X using Y to improve performance by 15%)."
                          value={exp.description}
                          onChange={e => handleEditExperience(exp.id, 'description', e.target.value)}
                        />
                        <span className="text-[10px] text-secondary mt-1">
                          💡 Tip: Use bullet points starting with action verbs like Developed, Engineered, Spearheaded, Optimized.
                        </span>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button"
                    onClick={handleAddExperience} 
                    className="btn btn-secondary btn-sm flex items-center gap-1.5 self-start mt-1 font-semibold"
                  >
                    <Plus size={15} /> Add Experience Entry
                  </button>
                </div>
              )}

              {activeSection === 'education' && (
                <div className="flex flex-col gap-5">
                  {formData.education.map((edu, idx) => (
                    <div key={edu.id} className="p-4 border border-border-light rounded-xl bg-background flex flex-col gap-4 shadow-xs">
                      {/* Entry Header */}
                      <div className="flex justify-between items-center pb-2 border-b border-light">
                        <span className="font-extrabold text-xs text-accent-dark tracking-wide uppercase">
                          Education #{idx + 1}
                        </span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveEducation(edu.id)}
                          className="btn btn-ghost btn-sm text-danger hover:bg-danger-bg p-1 px-2.5 rounded-md flex items-center gap-1 text-xs font-semibold"
                          title="Remove education entry"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>

                      <div className="grid grid-2 gap-4">
                        <div className="input-group">
                          <label className="label text-xs font-semibold text-secondary">Degree & Major</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="e.g. B.E. in Computer Science"
                            value={edu.degree}
                            onChange={e => handleEditEducation(edu.id, 'degree', e.target.value)}
                          />
                        </div>
                        <div className="input-group">
                          <label className="label text-xs font-semibold text-secondary">School / University Name</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="e.g. GEC"
                            value={edu.school}
                            onChange={e => handleEditEducation(edu.id, 'school', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-3 gap-3">
                        <div className="input-group grid-span-1">
                          <label className="label text-xs font-semibold text-secondary">Location</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="Mysore, IN"
                            value={edu.location}
                            onChange={e => handleEditEducation(edu.id, 'location', e.target.value)}
                          />
                        </div>
                        <div className="input-group grid-span-1">
                          <label className="label text-xs font-semibold text-secondary">Start Year</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="e.g. 2022"
                            value={edu.startDate}
                            onChange={e => handleEditEducation(edu.id, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="input-group grid-span-1">
                          <label className="label text-xs font-semibold text-secondary">End/Graduation Year</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="e.g. 2026"
                            value={edu.endDate}
                            onChange={e => handleEditEducation(edu.id, 'endDate', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <label className="label text-xs font-semibold text-secondary">Description / CGPA / Coursework</label>
                        <textarea 
                          className="textarea text-xs" 
                          rows="3"
                          placeholder="e.g. Focus on Data Structures, Algorithms, and Software Engineering. CGPA: 9.1"
                          value={edu.description}
                          onChange={e => handleEditEducation(edu.id, 'description', e.target.value)}
                        />
                        <span className="text-[10px] text-secondary mt-1">
                          💡 Tip: Include CGPA/GPA, honors, or key relevant subjects (e.g., Data Structures, Operating Systems, DBMS).
                        </span>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button"
                    onClick={handleAddEducation} 
                    className="btn btn-secondary btn-sm flex items-center gap-1.5 self-start mt-1 font-semibold"
                  >
                    <Plus size={15} /> Add Education Entry
                  </button>
                </div>
              )}

              {activeSection === 'skills' && (
                <div className="flex flex-col gap-4">
                  <div className="input-group">
                    <label className="label text-xs font-semibold text-secondary">Technical Skills & Competencies (Comma-separated list)</label>
                    <textarea 
                      className="textarea text-xs" 
                      rows="4"
                      placeholder="React, Node.js, JavaScript, Git, Python, SQL, REST APIs, Docker, Data Structures..."
                      value={formData.skills}
                      onChange={e => setFormData({ ...formData, skills: e.target.value })}
                    />
                    <span className="text-[11px] text-secondary mt-1">
                      💡 Tip: List core programming languages, frameworks, databases, and tools. Standard ATS parsers extract comma-separated keywords cleanly.
                    </span>
                  </div>

                  <div className="p-3 bg-surface border rounded-lg">
                    <span className="text-[11px] font-bold text-secondary uppercase block mb-1.5">Recommended Keywords to Include:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'REST APIs', 'Data Structures', 'Docker', 'HTML/CSS'].map((skillKw, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => {
                            if (!formData.skills.toLowerCase().includes(skillKw.toLowerCase())) {
                              const newSkills = formData.skills ? `${formData.skills}, ${skillKw}` : skillKw;
                              setFormData({ ...formData, skills: newSkills });
                            }
                          }}
                          className="badge badge-secondary hover:bg-accent-bg hover:text-accent-dark cursor-pointer text-[10px] font-medium transition-colors"
                        >
                          + {skillKw}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'projects' && (
                <div className="flex flex-col gap-5">
                  {formData.projects.map((proj, idx) => (
                    <div key={proj.id} className="p-4 border border-border-light rounded-xl bg-background flex flex-col gap-4 shadow-xs">
                      {/* Entry Header */}
                      <div className="flex justify-between items-center pb-2 border-b border-light">
                        <span className="font-extrabold text-xs text-accent-dark tracking-wide uppercase">
                          Project #{idx + 1}
                        </span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveProject(proj.id)}
                          className="btn btn-ghost btn-sm text-danger hover:bg-danger-bg p-1 px-2.5 rounded-md flex items-center gap-1 text-xs font-semibold"
                          title="Remove project entry"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </div>

                      <div className="grid grid-2 gap-4">
                        <div className="input-group">
                          <label className="label text-xs font-semibold text-secondary">Project Title</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="e.g. Portfolio Website"
                            value={proj.name}
                            onChange={e => handleEditProject(proj.id, 'name', e.target.value)}
                          />
                        </div>
                        <div className="input-group">
                          <label className="label text-xs font-semibold text-secondary">Technologies / Core Stack</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="e.g. React, Node.js, MongoDB"
                            value={proj.technologies}
                            onChange={e => handleEditProject(proj.id, 'technologies', e.target.value)}
                          />
                        </div>
                      </div>
                           <div className="grid grid-3 gap-3">
                        <div className="input-group">
                          <label className="label text-xs font-semibold text-secondary">Completion Date</label>
                          <input 
                            type="text" 
                            className="input" 
                            placeholder="e.g. Jan 2026"
                            value={proj.date}
                            onChange={e => handleEditProject(proj.id, 'date', e.target.value)}
                          />
                        </div>
                        <div className="input-group">
                          <label className="label text-xs font-semibold text-secondary">Live Demo / App URL</label>
                          <input 
                            type="url" 
                            className="input" 
                            placeholder="e.g. https://myproject.app"
                            value={proj.link || ''}
                            onChange={e => handleEditProject(proj.id, 'link', e.target.value)}
                          />
                        </div>
                        <div className="input-group">
                          <label className="label text-xs font-semibold text-secondary">GitHub Repository URL</label>
                          <input 
                            type="url" 
                            className="input" 
                            placeholder="e.g. github.com/user/project"
                            value={proj.github || ''}
                            onChange={e => handleEditProject(proj.id, 'github', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <label className="label text-xs font-semibold text-secondary">Project Details / Key Contributions</label>
                        <textarea 
                          className="textarea text-xs" 
                          rows="3"
                          placeholder="Explain what you built, system features implemented, and engineering challenges solved."
                          value={proj.description}
                          onChange={e => handleEditProject(proj.id, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button"
                    onClick={handleAddProject} 
                    className="btn btn-secondary btn-sm flex items-center gap-1.5 self-start mt-1 font-semibold"
                  >
                    <Plus size={15} /> Add Project Entry
                  </button>
                </div>
              )}

              {/* Form Card Bottom Navigation Bar */}
              <div className="flex justify-between items-center pt-6 mt-6 border-t border-light flex-wrap gap-3">
                <div>
                  {activeSection !== 'contact' && (
                    <button 
                      type="button"
                      onClick={handlePreviousSection}
                      className="btn btn-secondary btn-sm flex items-center gap-1.5 font-semibold"
                    >
                      <ChevronLeft size={16} /> Previous Section
                    </button>
                  )}
                </div>

                <div>
                  {activeSection !== 'projects' ? (
                    <button 
                      type="button"
                      onClick={handleNextSection}
                      className="btn btn-primary btn-sm flex items-center gap-1.5 font-semibold"
                    >
                      Next Section <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={handleAnalyzeBuiltResume}
                      className="btn btn-primary btn-sm flex items-center gap-1.5 font-semibold bg-success hover:bg-success-dark text-white"
                    >
                      <Sparkles size={16} /> Audit & Finalize Resume
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Column Header */}
          <div className="builder-preview-sticky flex flex-col gap-4">
              <div className="flex justify-between items-center bg-card p-3 rounded-lg border border-border-light shadow-xs flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-accent-dark uppercase tracking-wider">Template:</span>
                  <select 
                    value={selectedTemplate}
                    onChange={e => setSelectedTemplate(e.target.value)}
                    className="select select-sm text-xs py-1 px-2 border rounded font-semibold bg-background"
                  >
                    <option value="classic">Standard ATS (Single Column)</option>
                    <option value="modern">Executive Clean (Left Accent)</option>
                    <option value="minimal">Tech Minimalist (Serif Style)</option>
                  </select>
                </div>

                <button 
                  onClick={handlePrint} 
                  className="btn btn-secondary btn-sm flex items-center gap-1.5 font-semibold"
                  title="Print or export as an interactive PDF with clickable links"
                >
                  <Printer size={14} /> Print / Export PDF
                </button>
              </div>

              {/* Live Document Preview Card */}
              <div className="resume-preview-wrapper bg-border-light p-4 rounded border flex justify-center">
                <div 
                  id="resume-preview-to-print"
                  className={`resume-preview-card resume-print-area template-${selectedTemplate}`}
                >
                  {/* Header */}
                  <header className="resume-header text-center">
                    <h1 className="resume-name font-bold text-2xl tracking-wide uppercase">
                      {formData.firstName || 'FIRST'} {formData.lastName || 'LAST'}
                    </h1>
                    <div className="resume-contact text-xs mt-1.5 flex justify-center items-center flex-wrap gap-3 text-secondary">
                      {formData.email && (
                        <a 
                          href={formatEmailLink(formData.email)} 
                          className="resume-contact-link flex items-center gap-1 text-primary hover:text-accent font-medium transition-colors"
                          title="Click to compose email"
                        >
                          <Mail size={12} className="text-accent shrink-0" />
                          <span>{formData.email}</span>
                        </a>
                      )}
                      {formData.phone && (
                        <a 
                          href={formatPhoneLink(formData.phone)} 
                          className="resume-contact-link flex items-center gap-1 text-primary hover:text-accent font-medium transition-colors"
                          title="Click to dial phone number"
                        >
                          <Phone size={12} className="text-accent shrink-0" />
                          <span>{formData.phone}</span>
                        </a>
                      )}
                      {formData.location && (
                        <span className="resume-contact-item flex items-center gap-1 text-secondary">
                          <MapPin size={12} className="text-secondary shrink-0" />
                          <span>{formData.location}</span>
                        </span>
                      )}
                    </div>
                    <div className="resume-links text-xs mt-1.5 flex justify-center items-center flex-wrap gap-3 text-secondary">
                      {formData.linkedin && (
                        <a 
                          href={formatLinkedInUrl(formData.linkedin)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="resume-contact-link resume-badge-link flex items-center gap-1 text-blue-600 hover:underline font-semibold"
                          title="Click to open LinkedIn profile"
                        >
                          <LinkedInIcon size={12} className="text-blue-600 shrink-0" />
                          <span>linkedin.com/in/{getCleanLinkedInDisplay(formData.linkedin)}</span>
                        </a>
                      )}
                      {formData.github && (
                        <a 
                          href={formatGitHubUrl(formData.github)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="resume-contact-link resume-badge-link flex items-center gap-1 text-slate-800 dark:text-slate-200 hover:underline font-semibold"
                          title="Click to open GitHub profile"
                        >
                          <GitHubIcon size={12} className="shrink-0" />
                          <span>github.com/{getCleanGitHubDisplay(formData.github)}</span>
                        </a>
                      )}
                    </div>
                  </header>

                  {/* Professional Summary */}
                  {formData.summary && (
                    <section className="resume-section mt-4">
                      <h2 className="resume-section-title font-bold text-sm tracking-wider uppercase border-b border-gray-400 pb-1">
                        Professional Summary
                      </h2>
                      <p className="resume-summary text-xs mt-2 leading-relaxed text-justify">
                        {formData.summary}
                      </p>
                    </section>
                  )}

                  {/* Experience */}
                  {formData.experience.filter(e => e.role || e.company).length > 0 && (
                    <section className="resume-section mt-4">
                      <h2 className="resume-section-title font-bold text-sm tracking-wider uppercase border-b border-gray-400 pb-1">
                        Professional Experience
                      </h2>
                      <div className="resume-experience-list mt-2 flex flex-col gap-3">
                        {formData.experience.filter(e => e.role || e.company).map(exp => (
                          <div key={exp.id} className="resume-experience-item">
                            <div className="flex justify-between items-baseline font-bold text-xs">
                              <span>{exp.role || 'Role Title'}</span>
                              <span className="text-secondary font-normal">{exp.location || 'Location'}</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs text-secondary mt-0.5">
                              <span className="italic">{exp.company || 'Company Name'}</span>
                              <span>{exp.startDate || 'Start Date'} – {exp.endDate || 'End Date'}</span>
                            </div>
                            {exp.description && (
                              <ul className="list-disc list-inside mt-1.5 flex flex-col gap-1 text-xs text-justify pl-1">
                                {exp.description.split('\n').filter(Boolean).map((bullet, bIdx) => (
                                  <li key={bIdx} className="leading-relaxed">
                                    {bullet.trim().startsWith('•') || bullet.trim().startsWith('-') 
                                      ? bullet.trim().substring(1).trim() 
                                      : bullet.trim()}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Education */}
                  {formData.education.filter(e => e.degree || e.school).length > 0 && (
                    <section className="resume-section mt-4">
                      <h2 className="resume-section-title font-bold text-sm tracking-wider uppercase border-b border-gray-400 pb-1">
                        Education
                      </h2>
                      <div className="resume-education-list mt-2 flex flex-col gap-3">
                        {formData.education.filter(e => e.degree || e.school).map(edu => (
                          <div key={edu.id} className="resume-education-item">
                            <div className="flex justify-between items-baseline font-bold text-xs">
                              <span>{edu.degree || 'Degree Major'}</span>
                              <span className="text-secondary font-normal">{edu.location || 'Location'}</span>
                            </div>
                            <div className="flex justify-between items-baseline text-xs text-secondary mt-0.5">
                              <span className="italic">{edu.school || 'School Name'}</span>
                              <span>{edu.startDate ? `${edu.startDate} – ` : ''}{edu.endDate || 'Graduation'}</span>
                            </div>
                            {edu.description && (
                              <p className="text-xs mt-1 text-secondary leading-relaxed">
                                {edu.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Projects */}
                  {formData.projects.filter(p => p.name).length > 0 && (
                    <section className="resume-section mt-4">
                      <h2 className="resume-section-title font-bold text-sm tracking-wider uppercase border-b border-gray-400 pb-1">
                        Academic & Engineering Projects
                      </h2>
                      <div className="resume-project-list mt-2 flex flex-col gap-3">
                        {formData.projects.filter(p => p.name).map(proj => (
                          <div key={proj.id} className="resume-project-item">
                            <div className="flex justify-between items-baseline font-bold text-xs">
                              <span className="flex items-center gap-2 flex-wrap">
                                <span>{proj.name}</span>
                                {proj.technologies && <span className="font-normal text-secondary">| {proj.technologies}</span>}
                                {proj.link && (
                                  <a 
                                    href={formatWebUrl(proj.link)} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="resume-proj-link text-blue-600 hover:underline flex items-center gap-0.5 font-semibold text-[10.5px]"
                                    title="Open live demo"
                                  >
                                    <ExternalLink size={10} /> Live Demo
                                  </a>
                                )}
                                {proj.github && (
                                  <a 
                                    href={formatGitHubUrl(proj.github)} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="resume-proj-link text-slate-800 dark:text-slate-300 hover:underline flex items-center gap-0.5 font-semibold text-[10.5px]"
                                    title="View GitHub repository"
                                  >
                                    <GitHubIcon size={10} /> GitHub
                                  </a>
                                )}
                              </span>
                              <span className="text-secondary font-normal">{proj.date || 'Date'}</span>
                            </div>
                            {proj.description && (
                              <ul className="list-disc list-inside mt-1.5 flex flex-col gap-1 text-xs text-justify pl-1">
                                {proj.description.split('\n').filter(Boolean).map((bullet, bIdx) => (
                                  <li key={bIdx} className="leading-relaxed">
                                    {bullet.trim().startsWith('•') || bullet.trim().startsWith('-') 
                                      ? bullet.trim().substring(1).trim() 
                                      : bullet.trim()}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Skills */}
                  {formData.skills.trim().length > 0 && (
                    <section className="resume-section mt-4">
                      <h2 className="resume-section-title font-bold text-sm tracking-wider uppercase border-b border-gray-400 pb-1">
                        Technical Skills & Competencies
                      </h2>
                      <p className="resume-skills text-xs mt-2 leading-relaxed">
                        {formData.skills}
                      </p>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
      )}
    </div>
  );
}

