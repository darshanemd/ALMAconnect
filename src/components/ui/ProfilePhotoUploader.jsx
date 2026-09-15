import React, { useState, useRef } from 'react';
import { Upload, X, Trash2, Camera, Link as LinkIcon, Check, Image as ImageIcon, Maximize2, Minimize2 } from 'lucide-react';
import Avatar from './Avatar';
import './ProfilePhotoUploader.css';

// Preset non-human vector & abstract avatars (Bots, Crests, Badges, Icons)
const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=AlexTech',
  'https://api.dicebear.com/7.x/identicon/svg?seed=CollegeSeal',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=StudentGrad',
  'https://api.dicebear.com/7.x/icons/svg?seed=AlumniPro',
  'https://api.dicebear.com/7.x/shapes/svg?seed=PulseEngine',
  'https://api.dicebear.com/7.x/rings/svg?seed=GECConnect',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=CoderSpark',
  'https://api.dicebear.com/7.x/initials/svg?seed=AC'
];

export default function ProfilePhotoUploader({ 
  currentSrc, 
  userName = 'User', 
  userRole = 'default',
  onSave, 
  onClose 
}) {
  const [selectedPhoto, setSelectedPhoto] = useState(currentSrc || '');
  const [fitMode, setFitMode] = useState('cover'); // 'cover' or 'contain'
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedPhoto(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setSelectedPhoto(urlInput.trim());
      setShowUrlField(false);
      setUrlInput('');
    }
  };

  const handleSavePhoto = () => {
    onSave(selectedPhoto);
    onClose();
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto('');
  };

  return (
    <div className="photo-uploader-backdrop" onClick={onClose}>
      <div className="photo-uploader-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header with Save & Close */}
        <div className="photo-uploader-header">
          <h3>Update Profile Photo</h3>
          <div className="flex items-center gap-2">
            <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={handleSavePhoto}>
              <Check size={14} /> Save
            </button>
            <button className="photo-uploader-close" onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="photo-uploader-body">
          {/* Main Avatar Preview */}
          <div className="flex flex-col items-center gap-2">
            <Avatar 
              src={selectedPhoto} 
              name={userName} 
              role={userRole} 
              size="xl" 
              className={fitMode === 'contain' ? 'fit-contain' : ''}
            />

            {/* Fit mode toggle */}
            {selectedPhoto && (
              <div className="flex items-center gap-2 mt-1">
                <button 
                  type="button"
                  className={`btn btn-xs ${fitMode === 'cover' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setFitMode('cover')}
                >
                  <Maximize2 size={11} /> Crop Fill
                </button>
                <button 
                  type="button"
                  className={`btn btn-xs ${fitMode === 'contain' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setFitMode('contain')}
                >
                  <Minimize2 size={11} /> Logo Fit
                </button>
              </div>
            )}
          </div>

          {/* Upload Dropzone */}
          <div 
            className={`dropzone-area ${dragActive ? 'drag-active' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
            <div className="dropzone-icon">
              <Upload size={20} />
            </div>
            <p className="text-xs font-semibold text-primary">
              Click or drag image to upload
            </p>
            <p className="text-xs text-secondary mt-0.5" style={{ fontSize: '10px' }}>
              PNG, JPG, or WebP up to 5MB
            </p>
          </div>

          {/* URL Input option */}
          {showUrlField ? (
            <div className="flex items-center gap-2 w-full">
              <input 
                type="url" 
                placeholder="Paste image URL (https://...)" 
                className="input text-xs" 
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
              />
              <button className="btn btn-primary btn-sm" onClick={handleApplyUrl}>Apply</button>
            </div>
          ) : (
            <button 
              className="text-xs font-semibold text-accent flex items-center gap-1 hover:underline"
              onClick={() => setShowUrlField(true)}
            >
              <LinkIcon size={12} /> Or paste an image URL directly
            </button>
          )}

          {/* Preset Avatars Selection */}
          <div className="w-full">
            <label className="text-xs font-bold text-secondary block mb-1.5">
              Choose Sample Avatar:
            </label>
            <div className="presets-grid">
              {PRESET_AVATARS.map((url, idx) => (
                <button 
                  key={idx} 
                  type="button"
                  className={`preset-avatar-btn ${selectedPhoto === url ? 'selected' : ''}`}
                  onClick={() => setSelectedPhoto(url)}
                >
                  <img src={url} alt={`Preset ${idx + 1}`} className="w-9 h-9 rounded-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="photo-uploader-footer">
          {selectedPhoto ? (
            <button className="btn btn-ghost btn-sm text-danger flex items-center gap-1" onClick={handleRemovePhoto}>
              <Trash2 size={14} /> Remove Photo
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary btn-sm flex items-center gap-1" onClick={handleSavePhoto}>
              <Check size={14} /> Save Profile Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
