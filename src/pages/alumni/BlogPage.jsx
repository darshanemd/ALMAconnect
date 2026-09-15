import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  BookOpen, ThumbsUp, MessageSquare, Plus, Check, Trash2, 
  Image as ImageIcon, Upload, X, Sparkles, Video, Play, 
  Bold, Heading, Code, Quote, List, Eye, Edit3, Film, Loader2
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './BlogPage.css';

const BLOG_PRESET_IMAGES = [
  {
    label: 'Tech & Code',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'
  },
  {
    label: 'AI & Data',
    url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80'
  },
  {
    label: 'Leadership',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80'
  },
  {
    label: 'Campus Life',
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80'
  },
  {
    label: 'System Design',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80'
  }
];

const SAMPLE_VIDEO_CLIPS = [
  {
    title: 'System Scalability Demo',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '0:15 Demo'
  },
  {
    title: 'Campus Hackathon Tech Walkthrough',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    duration: '0:15 Clip'
  },
  {
    title: 'Interview & Career Advice',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    duration: '0:15 Clip'
  }
];

export default function BlogPage() {
  const { user } = useAuth();
  const { getBlogs, addBlog, likeBlog, deleteBlog } = useData();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  
  // Blog form state
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: 'success-story',
    tags: '',
    content: '',
    image: ''
  });

  const [imageInputMode, setImageInputMode] = useState('preset'); // 'preset' | 'upload' | 'url'
  const [editorTab, setEditorTab] = useState('write'); // 'write' | 'preview'
  
  // Upload status states
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Inline media expandable drawers (inside editor)
  const [activeMediaDrawer, setActiveMediaDrawer] = useState(null); // null | 'image' | 'video'

  // Inline Image state
  const [inlineImgUrl, setInlineImgUrl] = useState('');
  const [inlineImgCaption, setInlineImgCaption] = useState('');
  
  // Inline Video state
  const [inlineVideoUrl, setInlineVideoUrl] = useState('');
  const [inlineVideoTitle, setInlineVideoTitle] = useState('');
  const [videoInputMode, setVideoInputMode] = useState('samples'); // 'samples' | 'upload' | 'url'

  const textareaRef = useRef(null);
  const blogs = getBlogs();

  const filteredBlogs = activeCategory === 'all'
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  const categories = [
    { key: 'all', label: 'All Articles' },
    { key: 'success-story', label: 'Success Stories' },
    { key: 'career-tips', label: 'Career & Interview Prep' },
    { key: 'tech', label: 'Technology & Projects' },
    { key: 'campus-news', label: 'Campus News & Updates' }
  ];

  // Helper to upload media file via multipart FormData
  const uploadFileToServer = async (file) => {
    const data = new FormData();
    data.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: data
    });

    if (!res.ok) {
      throw new Error(`Upload failed with status ${res.status}`);
    }

    const result = await res.json();
    return result.url; // e.g. /uploads/media-12345.mp4
  };

  // Helper to insert markdown text at cursor in textarea
  const insertTextAtCursor = (textToInsert) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setFormData(prev => ({ ...prev, content: (prev.content ? prev.content + '\n' : '') + textToInsert }));
      return;
    }
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const current = formData.content;
    const updated = current.substring(0, start) + textToInsert + current.substring(end);
    setFormData(prev => ({ ...prev, content: updated }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 50);
  };

  // Header / Cover file upload (Fast Multipart)
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      const url = await uploadFileToServer(file);
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      console.error('Cover image upload failed:', err);
      alert('Failed to upload cover image. Please try again.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  // Inline Image file upload (Fast Multipart)
  const handleInlineImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const url = await uploadFileToServer(file);
      setInlineImgUrl(url);
    } catch (err) {
      console.error('Inline image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Inline Video file upload (Fast Multipart)
  const handleInlineVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingVideo(true);
      const url = await uploadFileToServer(file);
      setInlineVideoUrl(url);
    } catch (err) {
      console.error('Video upload failed:', err);
      alert('Failed to upload video clip. Please try again.');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Insert Inline Image into Content
  const handleApplyInlineImage = () => {
    if (!inlineImgUrl) {
      alert('Please select or upload an image first.');
      return;
    }
    const caption = inlineImgCaption.trim() || 'Photo';
    insertTextAtCursor(`\n\n![${caption}](${inlineImgUrl})\n\n`);
    setActiveMediaDrawer(null);
    setInlineImgUrl('');
    setInlineImgCaption('');
  };

  // Insert Inline Video into Content
  const handleApplyInlineVideo = () => {
    if (!inlineVideoUrl) {
      alert('Please select or upload a video first.');
      return;
    }
    const title = inlineVideoTitle.trim() || 'Video Clip';
    insertTextAtCursor(`\n\n[Video: ${title}](${inlineVideoUrl})\n\n`);
    setActiveMediaDrawer(null);
    setInlineVideoUrl('');
    setInlineVideoTitle('');
  };

  const handlePostBlog = async (e) => {
    e.preventDefault();
    const tagsArray = formData.tags
      ? formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0)
      : [];
      
    const payload = {
      title: formData.title,
      excerpt: formData.excerpt,
      category: formData.category,
      tags: tagsArray,
      content: formData.content,
      image: formData.image || null,
      author: {
        name: user?.name || 'Anonymous User',
        role: user?.role === 'alumni' ? 'Alumni' : (user?.role === 'college_admin' || user?.role === 'college') ? 'College Administrator' : 'Student',
        avatarInitials: user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : (user?.role === 'student' ? 'ST' : 'AU')
      }
    };

    await addBlog(payload);
    setModalOpen(false);
    setFormData({
      title: '',
      excerpt: '',
      category: 'success-story',
      tags: '',
      content: '',
      image: ''
    });
    setEditorTab('write');
    setActiveMediaDrawer(null);
  };

  const handleDeleteBlog = (e, blogId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this post?')) {
      deleteBlog(blogId);
    }
  };

  const canManage = (blog) => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'college' || user.role === 'college_admin') return true;
    return blog?.author?.name === user.name;
  };

  // Helper to determine if a URL is a video source
  const isVideoSource = (url, label = '') => {
    if (!url || typeof url !== 'string') return false;
    const lower = url.toLowerCase();
    const lowerLabel = typeof label === 'string' ? label.toLowerCase() : '';
    return (
      lower.startsWith('data:video/') ||
      lower.includes('.mp4') ||
      lower.includes('.webm') ||
      lower.includes('.mov') ||
      lower.includes('.ogg') ||
      lower.includes('commondatastorage.googleapis.com') ||
      lowerLabel.startsWith('video:') ||
      lowerLabel.includes('[video')
    );
  };

  // Helper to determine if a URL is an image source
  const isImageSource = (url) => {
    if (!url || typeof url !== 'string') return false;
    const lower = url.toLowerCase();
    return (
      lower.startsWith('data:image/') ||
      lower.includes('.jpg') ||
      lower.includes('.jpeg') ||
      lower.includes('.png') ||
      lower.includes('.gif') ||
      lower.includes('.webp') ||
      lower.includes('.svg') ||
      lower.includes('images.unsplash.com')
    );
  };

  // Custom Markdown renderer for images and video players
  const markdownComponents = {
    p: ({ node, children }) => (
      <div className="blog-p-block">{children}</div>
    ),
    img: ({ node, src, alt, ...props }) => {
      if (!src || typeof src !== 'string' || !src.trim()) return null;

      if (isVideoSource(src, alt)) {
        return (
          <div className="blog-video-container my-4">
            <video controls className="blog-inline-video" src={src}>
              Your browser does not support video playback.
            </video>
            {alt && alt !== 'Photo' && alt !== 'Image' && (
              <div className="blog-video-caption flex items-center gap-1.5 mt-2 text-xs text-secondary font-medium">
                <Film size={13} className="text-accent" /> {alt}
              </div>
            )}
          </div>
        );
      }

      return (
        <figure className="blog-markdown-figure my-4">
          <img src={src} alt={alt || 'Article image'} className="blog-inline-img" loading="lazy" {...props} />
          {alt && alt !== 'Photo' && alt !== 'Image' && (
            <figcaption className="blog-inline-caption">{alt}</figcaption>
          )}
        </figure>
      );
    },
    a: ({ node, href, children, ...props }) => {
      if (!href) return <span>{children}</span>;

      const labelText = Array.isArray(children) 
        ? children.join('') 
        : typeof children === 'string' 
          ? children 
          : '';

      if (isVideoSource(href, labelText)) {
        return (
          <div className="blog-video-container my-4">
            <video controls className="blog-inline-video" src={href} preload="metadata">
              Your browser does not support the video tag.
            </video>
            {labelText && (
              <div className="blog-video-caption flex items-center gap-1.5 mt-2 text-xs text-secondary font-semibold">
                <Film size={13} className="text-accent" /> {labelText}
              </div>
            )}
          </div>
        );
      }

      if (isImageSource(href)) {
        return (
          <figure className="blog-markdown-figure my-4">
            <img src={href} alt={labelText || 'Article image'} className="blog-inline-img" loading="lazy" />
            {labelText && labelText !== 'Photo' && !labelText.startsWith('http') && (
              <figcaption className="blog-inline-caption">{labelText}</figcaption>
            )}
          </figure>
        );
      }

      const ytMatch = href.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (ytMatch) {
        return (
          <div className="blog-video-embed-wrap my-4">
            <iframe
              src={`https://www.youtube.com/embed/${ytMatch[1]}`}
              title="Embedded Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="blog-video-iframe"
            />
          </div>
        );
      }

      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline font-semibold" {...props}>
          {children}
        </a>
      );
    }
  };

  const isAnyUploading = isUploadingCover || isUploadingImage || isUploadingVideo;

  return (
    <div className="blog-page stagger-children">
      {/* Categories and actions */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div className="tabs">
          {categories.map(cat => (
            <button 
              key={cat.key} 
              className={`tab-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {user && (
          <button onClick={() => setModalOpen(true)} className="btn btn-primary flex items-center gap-2">
            <Plus size={18} /> Write Post
          </button>
        )}
      </div>

      {/* Blogs list */}
      <div className="grid grid-3 gap-6">
        {filteredBlogs.map(blog => (
          <div 
            key={blog.id} 
            className="card blog-card card-interactive relative"
            onClick={() => navigate(`/blog/${blog.id}`)}
          >
            {/* Optional Cover Image Banner */}
            {blog.image && typeof blog.image === 'string' && blog.image.trim() !== '' && (
              <div className="blog-card-image-wrap">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="blog-card-cover-img" 
                  loading="lazy" 
                />
              </div>
            )}

            <div className="blog-card-body p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start">
                <span className="badge badge-accent capitalize">{blog.category ? blog.category.replace('-', ' ') : 'Article'}</span>
                {canManage(blog) && (
                  <button 
                    onClick={(e) => handleDeleteBlog(e, blog.id)}
                    className="btn btn-ghost btn-sm text-danger hover:bg-danger-bg p-1 rounded z-10"
                    title="Delete post"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
              
              <h3 className="font-semibold text-lg mt-3 line-clamp-2" title={blog.title}>{blog.title}</h3>
              <p className="text-sm text-secondary mt-2 flex-1 line-clamp-3">
                {blog.excerpt}
              </p>

              <div className="blog-card-author-row mt-4 pt-3 border-t border-light flex items-center gap-3">
                <div className="avatar avatar-sm">
                  {blog.author?.avatarInitials || (blog.author?.name ? blog.author.name[0] : 'AU')}
                </div>
                <div className="flex-1 min-width-0">
                  <div className="font-semibold text-xs truncate">{blog.author?.name || 'Anonymous'}</div>
                  <div className="text-secondary" style={{ fontSize: '10px' }}>{blog.author?.role || 'Community Member'}</div>
                </div>
              </div>

              <div className="blog-card-footer mt-4 flex justify-between items-center text-xs text-secondary">
                <span>{formatDate(blog.publishedDate)}</span>
                <div className="flex gap-3">
                  <span className="flex items-center gap-1"><ThumbsUp size={12} /> {blog.likes || 0}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={12} /> {blog.comments || 0}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Post Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal blog-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Write success story / tech blog</h3>
              <button className="btn btn-ghost p-1" onClick={() => setModalOpen(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handlePostBlog}>
              <div className="modal-body flex flex-col gap-4">
                
                {/* Post Title */}
                <div className="input-group">
                  <label htmlFor="blog-title">Title *</label>
                  <input 
                    type="text" 
                    id="blog-title" 
                    className="input" 
                    placeholder="e.g. Preparing for System Design interviews" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    required 
                  />
                </div>

                {/* Category & Tags */}
                <div className="grid grid-2 gap-4">
                  <div className="input-group">
                    <label htmlFor="blog-cat">Category *</label>
                    <select 
                      id="blog-cat" 
                      className="select" 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="success-story">Success Story</option>
                      <option value="career-tips">Career & Interview Prep</option>
                      <option value="tech">Technology & Projects</option>
                      <option value="campus-news">Campus News & Updates</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label htmlFor="blog-tags">Tags (Comma separated)</label>
                    <input 
                      type="text" 
                      id="blog-tags" 
                      className="input" 
                      placeholder="e.g. interview, placement" 
                      value={formData.tags} 
                      onChange={e => setFormData({...formData, tags: e.target.value})} 
                    />
                  </div>
                </div>

                {/* Article Cover Image Option */}
                <div className="input-group">
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-xs text-primary flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-accent" /> Featured Cover Header (Optional)
                    </label>
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setImageInputMode('preset')}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${imageInputMode === 'preset' ? 'bg-accent text-white' : 'text-secondary hover:text-primary'}`}
                      >
                        Presets
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setImageInputMode('upload')}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${imageInputMode === 'upload' ? 'bg-accent text-white' : 'text-secondary hover:text-primary'}`}
                      >
                        Upload
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setImageInputMode('url')}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded ${imageInputMode === 'url' ? 'bg-accent text-white' : 'text-secondary hover:text-primary'}`}
                      >
                        URL
                      </button>
                    </div>
                  </div>

                  {/* Mode 1: Curated Presets */}
                  {imageInputMode === 'preset' && (
                    <div className="blog-preset-images-grid">
                      {BLOG_PRESET_IMAGES.map((preset, idx) => {
                        const isSelected = formData.image === preset.url;
                        return (
                          <div 
                            key={idx}
                            onClick={() => setFormData(prev => ({ ...prev, image: isSelected ? '' : preset.url }))}
                            className={`blog-preset-thumb-item ${isSelected ? 'selected' : ''}`}
                          >
                            <img src={preset.url} alt={preset.label} />
                            <span>{preset.label}</span>
                            {isSelected && <div className="preset-selected-check"><Check size={10} /></div>}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Mode 2: Local File Upload (Fast Server-side) */}
                  {imageInputMode === 'upload' && (
                    <div className="blog-upload-dropzone">
                      <input 
                        type="file" 
                        id="blog-file-upload" 
                        accept="image/*" 
                        onChange={handleCoverUpload}
                        className="hidden-file-input"
                      />
                      <label htmlFor="blog-file-upload" className="upload-label-btn">
                        {isUploadingCover ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        {isUploadingCover ? 'Uploading cover...' : 'Choose Image from Device'}
                      </label>
                    </div>
                  )}

                  {/* Mode 3: Custom Web URL */}
                  {imageInputMode === 'url' && (
                    <div className="relative">
                      <input 
                        type="url" 
                        className="input text-xs" 
                        placeholder="https://example.com/cover-image.jpg"
                        value={formData.image}
                        onChange={e => setFormData({...formData, image: e.target.value})}
                      />
                    </div>
                  )}

                  {/* Active Cover Image Preview */}
                  {formData.image && (
                    <div className="blog-cover-preview-card mt-2">
                      <img src={formData.image} alt="Cover Preview" className="blog-cover-preview-img" />
                      <div className="blog-cover-preview-meta">
                        <span className="text-[11px] font-semibold text-primary">Featured Header Selected</span>
                        <button 
                          type="button" 
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                          className="btn btn-ghost btn-xs text-danger hover:bg-danger-bg p-1 rounded"
                          title="Remove Image"
                        >
                          <X size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Excerpt / Summary */}
                <div className="input-group">
                  <label htmlFor="blog-excerpt">Excerpt / Summary *</label>
                  <input 
                    type="text" 
                    id="blog-excerpt" 
                    className="input" 
                    placeholder="Brief 1-sentence summary of the article..." 
                    value={formData.excerpt} 
                    onChange={e => setFormData({...formData, excerpt: e.target.value})} 
                    required 
                  />
                </div>

                {/* Article Content with Rich Media Toolbar */}
                <div className="input-group">
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-xs text-primary">
                      Article Content (Markdown supported) *
                    </label>
                    
                    {/* Editor / Live Preview Mode Toggle */}
                    <div className="editor-tab-toggle">
                      <button
                        type="button"
                        onClick={() => setEditorTab('write')}
                        className={`editor-tab-btn ${editorTab === 'write' ? 'active' : ''}`}
                      >
                        <Edit3 size={11} /> Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorTab('preview')}
                        className={`editor-tab-btn ${editorTab === 'preview' ? 'active' : ''}`}
                      >
                        <Eye size={11} /> Preview
                      </button>
                    </div>
                  </div>

                  {/* Rich Inline Media Insertion Toolbar */}
                  {editorTab === 'write' && (
                    <div className="rich-editor-toolbar">
                      <div className="flex items-center gap-1 flex-wrap">
                        {/* Inline Image Trigger */}
                        <button 
                          type="button" 
                          onClick={() => setActiveMediaDrawer(activeMediaDrawer === 'image' ? null : 'image')}
                          className={`toolbar-btn highlight ${activeMediaDrawer === 'image' ? 'active-tool' : ''}`}
                          title="Insert image inside post"
                        >
                          <ImageIcon size={13} /> Add Image
                        </button>

                        {/* Inline Video Trigger */}
                        <button 
                          type="button" 
                          onClick={() => setActiveMediaDrawer(activeMediaDrawer === 'video' ? null : 'video')}
                          className={`toolbar-btn highlight ${activeMediaDrawer === 'video' ? 'active-tool' : ''}`}
                          title="Insert short video clip inside post"
                        >
                          <Video size={13} /> Add Video Clip
                        </button>

                        <div className="toolbar-divider" />

                        {/* Markdown formatting helpers */}
                        <button 
                          type="button" 
                          onClick={() => insertTextAtCursor('**bold text**')}
                          className="toolbar-btn"
                          title="Bold"
                        >
                          <Bold size={13} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => insertTextAtCursor('\n## Section Heading\n')}
                          className="toolbar-btn"
                          title="Heading 2"
                        >
                          <Heading size={13} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => insertTextAtCursor('\n```javascript\n// code here\n```\n')}
                          className="toolbar-btn"
                          title="Code Block"
                        >
                          <Code size={13} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => insertTextAtCursor('\n> Quote text\n')}
                          className="toolbar-btn"
                          title="Blockquote"
                        >
                          <Quote size={13} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => insertTextAtCursor('\n- List item 1\n- List item 2\n')}
                          className="toolbar-btn"
                          title="Bullet List"
                        >
                          <List size={13} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      INLINE IMAGE INSERTION DRAWER (Fast Server Upload)
                      ────────────────────────────────────────────────────────── */}
                  {editorTab === 'write' && activeMediaDrawer === 'image' && (
                    <div className="media-drawer-card animate-fade-in">
                      <div className="flex justify-between items-center mb-2 pb-1 border-b border-light">
                        <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                          <ImageIcon size={14} className="text-accent" /> Insert Inline Image into Post
                        </span>
                        <button 
                          type="button" 
                          onClick={() => setActiveMediaDrawer(null)}
                          className="btn btn-ghost p-0.5 text-secondary hover:text-primary rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Presets vs Upload vs URL */}
                      <div className="flex flex-col gap-2.5">
                        <div>
                          <label className="text-[11px] font-semibold text-secondary block mb-1">Quick Presets:</label>
                          <div className="blog-preset-images-grid">
                            {BLOG_PRESET_IMAGES.map((preset, idx) => (
                              <div 
                                key={idx}
                                onClick={() => {
                                  setInlineImgUrl(preset.url);
                                  setInlineImgCaption(preset.label);
                                }}
                                className={`blog-preset-thumb-item ${inlineImgUrl === preset.url ? 'selected' : ''}`}
                              >
                                <img src={preset.url} alt={preset.label} />
                                <span>{preset.label}</span>
                                {inlineImgUrl === preset.url && <div className="preset-selected-check"><Check size={10} /></div>}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-2 gap-2">
                          <div>
                            <label className="text-[11px] font-semibold text-secondary block mb-1">Or Upload from Device:</label>
                            <input 
                              type="file" 
                              id="drawer-inline-img" 
                              accept="image/*" 
                              onChange={handleInlineImageUpload}
                              className="hidden-file-input"
                            />
                            <label htmlFor="drawer-inline-img" className="upload-label-btn py-1.5 text-xs">
                              {isUploadingImage ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />} 
                              {isUploadingImage ? 'Uploading image...' : 'Choose Image File'}
                            </label>
                          </div>

                          <div>
                            <label className="text-[11px] font-semibold text-secondary block mb-1">Or Paste Image URL:</label>
                            <input 
                              type="url" 
                              className="input text-xs" 
                              placeholder="https://images.unsplash.com/..." 
                              value={inlineImgUrl.startsWith('/uploads') ? '' : inlineImgUrl}
                              onChange={e => setInlineImgUrl(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-secondary block mb-1">Image Caption (Optional):</label>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              className="input text-xs flex-1" 
                              placeholder="e.g. Architecture flowchart or campus celebration" 
                              value={inlineImgCaption}
                              onChange={e => setInlineImgCaption(e.target.value)}
                            />
                            <button 
                              type="button" 
                              onClick={handleApplyInlineImage}
                              className="btn btn-primary btn-sm font-bold text-xs"
                              disabled={!inlineImgUrl || isUploadingImage}
                            >
                              Insert Into Post
                            </button>
                          </div>
                        </div>

                        {inlineImgUrl && (
                          <div className="p-2 bg-surface rounded border flex items-center gap-3">
                            <img src={inlineImgUrl} alt="Preview" className="w-14 h-10 object-cover rounded" />
                            <span className="text-[11px] text-emerald-400 font-semibold flex-1 truncate">
                              ✓ Image uploaded & ready to insert
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ──────────────────────────────────────────────────────────
                      INLINE VIDEO INSERTION DRAWER (Fast Server Upload)
                      ────────────────────────────────────────────────────────── */}
                  {editorTab === 'write' && activeMediaDrawer === 'video' && (
                    <div className="media-drawer-card animate-fade-in">
                      <div className="flex justify-between items-center mb-2 pb-1 border-b border-light">
                        <span className="font-bold text-xs text-primary flex items-center gap-1.5">
                          <Video size={14} className="text-accent" /> Insert Short Video Clip into Post
                        </span>
                        <button 
                          type="button" 
                          onClick={() => setActiveMediaDrawer(null)}
                          className="btn btn-ghost p-0.5 text-secondary hover:text-primary rounded"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      {/* Video Modes */}
                      <div className="flex gap-1.5 mb-2">
                        <button
                          type="button"
                          onClick={() => setVideoInputMode('samples')}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${videoInputMode === 'samples' ? 'bg-accent text-white' : 'bg-surface text-secondary hover:text-primary'}`}
                        >
                          Sample Clips
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoInputMode('upload')}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${videoInputMode === 'upload' ? 'bg-accent text-white' : 'bg-surface text-secondary hover:text-primary'}`}
                        >
                          Upload File (.mp4)
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoInputMode('url')}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${videoInputMode === 'url' ? 'bg-accent text-white' : 'bg-surface text-secondary hover:text-primary'}`}
                        >
                          Video / YouTube URL
                        </button>
                      </div>

                      {videoInputMode === 'samples' && (
                        <div className="flex flex-col gap-1.5 mb-2">
                          {SAMPLE_VIDEO_CLIPS.map((clip, idx) => (
                            <div 
                              key={idx}
                              onClick={() => {
                                setInlineVideoUrl(clip.url);
                                setInlineVideoTitle(clip.title);
                              }}
                              className={`p-2 border rounded cursor-pointer flex items-center justify-between text-xs transition-all ${inlineVideoUrl === clip.url ? 'border-accent bg-accent-bg font-bold text-accent' : 'bg-surface hover:bg-surface-hover'}`}
                            >
                              <div className="flex items-center gap-2">
                                <Play size={12} className="text-accent" />
                                <span>{clip.title}</span>
                              </div>
                              <span className="text-[10px] text-tertiary">{clip.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {videoInputMode === 'upload' && (
                        <div className="mb-2">
                          <input 
                            type="file" 
                            id="drawer-inline-vid" 
                            accept="video/mp4,video/webm,video/ogg,video/quicktime" 
                            onChange={handleInlineVideoUpload}
                            className="hidden-file-input"
                          />
                          <label htmlFor="drawer-inline-vid" className="upload-label-btn py-2 text-xs">
                            {isUploadingVideo ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} 
                            {isUploadingVideo ? 'Uploading video clip to server...' : 'Upload Video Clip (.mp4)'}
                          </label>
                        </div>
                      )}

                      {videoInputMode === 'url' && (
                        <div className="mb-2">
                          <input 
                            type="url" 
                            className="input text-xs" 
                            placeholder="https://example.com/clip.mp4 or https://youtube.com/watch?v=..." 
                            value={inlineVideoUrl.startsWith('/uploads') ? '' : inlineVideoUrl}
                            onChange={e => setInlineVideoUrl(e.target.value)}
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-[11px] font-semibold text-secondary block mb-1">Video Title / Caption:</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            className="input text-xs flex-1" 
                            placeholder="e.g. Code walkthrough demo" 
                            value={inlineVideoTitle}
                            onChange={e => setInlineVideoTitle(e.target.value)}
                          />
                          <button 
                            type="button" 
                            onClick={handleApplyInlineVideo}
                            className="btn btn-primary btn-sm font-bold text-xs"
                            disabled={!inlineVideoUrl || isUploadingVideo}
                          >
                            Insert Video Clip
                          </button>
                        </div>
                      </div>

                      {inlineVideoUrl && (
                        <div className="mt-2 p-1.5 bg-surface rounded border text-center">
                          <video controls src={inlineVideoUrl} className="max-h-28 w-full rounded bg-black" />
                          <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                            ✓ Video uploaded & ready to insert
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode 1: Markdown Textarea */}
                  {editorTab === 'write' && (
                    <textarea 
                      ref={textareaRef}
                      id="blog-content" 
                      className="textarea font-mono text-xs" 
                      style={{ minHeight: '180px', lineHeight: '1.6' }} 
                      placeholder="## Introduction&#10;&#10;Write your post here... Click 'Add Image' or 'Add Video Clip' to embed media directly inside the story!" 
                      value={formData.content} 
                      onChange={e => setFormData({...formData, content: e.target.value})} 
                      required 
                    />
                  )}

                  {/* Mode 2: Live Real-time Markdown Preview */}
                  {editorTab === 'preview' && (
                    <div className="editor-live-preview-box">
                      {formData.content.trim() ? (
                        <div className="blog-post-markdown">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                          >
                            {formData.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-secondary text-xs italic text-center py-8">
                          Nothing to preview yet. Switch to the 'Write' tab to add your content, images, and videos.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isAnyUploading}>
                  {isAnyUploading ? 'Uploading Media...' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
