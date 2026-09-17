import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiRequest, getFileUrl } from '../../utils/api';
import { 
  ArrowLeft, ThumbsUp, MessageSquare, Calendar, Sparkles, 
  Film, Clock, Check, Bookmark, User, Tag, Send,
  Award, BookOpen, Eye, ExternalLink, Heart, Trash2, Loader2
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './BlogPostPage.css';

export default function BlogPostPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getBlogs, likeBlog, addBlogComment, deleteBlogComment } = useData();

  const [blog, setBlog] = useState(() => getBlogs().find(b => b.id === id) || null);
  const [loading, setLoading] = useState(!blog);
  const [isLiking, setIsLiking] = useState(false);

  // Comments state
  const commentsSectionRef = useRef(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Sync / Fetch blog details
  useEffect(() => {
    const cached = getBlogs().find(b => b.id === id);
    if (cached) {
      setBlog(cached);
      setLoading(false);
    }
    
    // Always fetch latest from server
    apiRequest('/blogs')
      .then(fetchedBlogs => {
        if (Array.isArray(fetchedBlogs)) {
          const match = fetchedBlogs.find(b => b.id === id);
          if (match) {
            setBlog(match);
          }
        }
      })
      .catch(err => console.warn('Could not refresh blog from backend:', err))
      .finally(() => setLoading(false));
  }, [id, getBlogs]);

  const currentUserId = user?.id || user?._id || user?.email;
  const isLiked = Boolean(
    currentUserId &&
    Array.isArray(blog?.likedBy) &&
    blog.likedBy.some(uid => String(uid).trim() === String(currentUserId).trim())
  );

  const handleLike = async () => {
    if (!blog || isLiking) return;
    if (!currentUserId) {
      alert('Please log in to like this story.');
      return;
    }

    setIsLiking(true);
    try {
      const updated = await likeBlog(blog.id, currentUserId);
      if (updated) {
        setBlog(updated);
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment || !blog) return;

    if (!currentUserId) {
      alert('Please log in to participate in the discussion.');
      return;
    }

    setIsSubmittingComment(true);
    try {
      const commentPayload = {
        userId: String(currentUserId),
        userName: user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Campus Member'),
        userRole: user?.role || 'student',
        avatarInitials: (user?.name || user?.firstName || 'U')[0].toUpperCase(),
        text: commentText.trim()
      };

      if (addBlogComment) {
        const updated = await addBlogComment(blog.id, commentPayload);
        if (updated) {
          setBlog(updated);
        } else {
          // Local fallback update
          const newComm = {
            id: `comm-${Date.now()}`,
            ...commentPayload,
            createdAt: new Date().toISOString()
          };
          setBlog(prev => prev ? {
            ...prev,
            comments: (prev.comments || 0) + 1,
            commentsList: [...(prev.commentsList || []), newComm]
          } : prev);
        }
      }
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      if (deleteBlogComment) {
        const updated = await deleteBlogComment(blog.id, commentId);
        if (updated) {
          setBlog(updated);
        }
      } else {
        setBlog(prev => prev ? {
          ...prev,
          comments: Math.max(0, (prev.comments || 1) - 1),
          commentsList: (prev.commentsList || []).filter(c => c.id !== commentId)
        } : prev);
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  // Estimate reading time based on word count
  const calculateReadingTime = (text) => {
    if (!text) return '1 min read';
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
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
      lower.includes('images.unsplash.com') ||
      lower.startsWith('/uploads/')
    );
  };

  // Custom Markdown renderer for images, videos, and YouTube embeds
  const markdownComponents = {
    // Render markdown paragraphs as divs to allow seamless inline video players and images
    p: ({ node, children }) => (
      <div className="blog-p-block">{children}</div>
    ),
    img: ({ node, src, alt, ...props }) => {
      if (!src || typeof src !== 'string' || !src.trim()) return null;

      if (isVideoSource(src, alt)) {
        return (
          <div className="blog-video-container my-6">
            <video controls className="blog-inline-video" src={getFileUrl(src)}>
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
        <figure className="blog-markdown-figure my-6">
          <img src={getFileUrl(src)} alt={alt || 'Article image'} className="blog-inline-img" loading="lazy" {...props} />
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

      // Check if it's a video file or video label
      if (isVideoSource(href, labelText)) {
        return (
          <div className="blog-video-container my-6">
            <video controls className="blog-inline-video" src={getFileUrl(href)} preload="metadata">
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

      // Check if it's an image pasted as a link
      if (isImageSource(href)) {
        return (
          <figure className="blog-markdown-figure my-6">
            <img src={href} alt={labelText || 'Article image'} className="blog-inline-img" loading="lazy" />
            {labelText && labelText !== 'Photo' && !labelText.startsWith('http') && (
              <figcaption className="blog-inline-caption">{labelText}</figcaption>
            )}
          </figure>
        );
      }

      // Check YouTube
      const ytMatch = href.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (ytMatch) {
        return (
          <div className="blog-video-embed-wrap my-6">
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

  if (loading) {
    return (
      <div className="card p-12 text-center animate-pulse">
        <p className="text-secondary">Loading story...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="card p-12 text-center">
        <h3>Article Not Found</h3>
        <p className="text-secondary mt-2">The success story or post you are searching for does not exist.</p>
        <Link to="/blog" className="btn btn-primary mt-4">Back to Feed</Link>
      </div>
    );
  }

  return (
    <div className="blog-post-page stagger-children">
      {/* Top action header bar */}
      <div className="blog-top-action-bar">
        <Link to="/blog" className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 font-medium">
          <ArrowLeft size={16} /> Back to Stories & Feed
        </Link>
        
        <div className="flex items-center gap-2.5">
          <button 
            onClick={handleLike} 
            disabled={isLiking}
            className={`btn btn-sm flex items-center gap-1.5 transition-all ${isLiked ? 'btn-primary' : 'btn-secondary'} ${isLiking ? 'opacity-70 cursor-not-allowed' : ''}`}
            title={isLiked ? 'Unlike this story' : 'Like this story'}
          >
            <ThumbsUp size={14} className={isLiked ? 'fill-current' : ''} />
            <span>{isLiked ? 'Liked' : 'Like'} ({blog.likes || 0})</span>
          </button>
        </div>
      </div>

      <div className="blog-article-layout-grid">
        {/* Main Article Publication Card */}
        <article className="blog-article-main-card">
          
          {/* Featured Cover Hero Banner */}
          {blog.image && typeof blog.image === 'string' && blog.image.trim() !== '' && (
            <div className="blog-article-hero-banner">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className="blog-article-hero-img" 
              />
            </div>
          )}

          {/* Article Header Metadata & Title */}
          <div className="blog-article-header-section">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="badge badge-accent capitalize font-semibold px-3 py-1">
                {blog.category ? blog.category.replace('-', ' ') : 'Success Story'}
              </span>
              <span className="blog-meta-badge">
                <Clock size={12} /> {calculateReadingTime(blog.content)}
              </span>
              <span className="blog-meta-badge">
                <Calendar size={12} /> {formatDate(blog.publishedDate)}
              </span>
            </div>

            <h1 className="blog-article-title">{blog.title}</h1>
            
            {blog.excerpt && (
              <p className="blog-article-excerpt">{blog.excerpt}</p>
            )}

            {/* Author Byline Bar */}
            <div className="blog-article-author-byline">
              <div className="avatar avatar-md">
                {blog.author?.avatarInitials || (blog.author?.name ? blog.author.name[0] : 'AU')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-primary">{blog.author?.name || 'Anonymous'}</span>
                  <span className="badge badge-outline text-[10px] py-0">{blog.author?.role || 'Community Member'}</span>
                </div>
                <div className="text-xs text-secondary mt-0.5">
                  Published in AlumniConnect Stories & Insights
                </div>
              </div>
            </div>
          </div>

          {/* Article Markdown Body Content */}
          <div className="blog-article-body-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {blog.content}
            </ReactMarkdown>
          </div>

          {/* Bottom Interactive Engagement Bar */}
          <div className="blog-article-footer-bar">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleLike} 
                disabled={isLiking}
                className={`btn btn-sm flex items-center gap-2 transition-all ${isLiked ? 'btn-primary' : 'btn-secondary'} ${isLiking ? 'opacity-70 cursor-not-allowed' : ''}`}
                title={isLiked ? 'Unlike this story' : 'Like this story'}
              >
                <ThumbsUp size={15} className={isLiked ? 'fill-current' : ''} />
                <span>{isLiked ? 'Liked' : 'Like'} ({blog.likes || 0})</span>
              </button>
            </div>
            <button 
              type="button"
              onClick={() => commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-ghost btn-sm flex items-center gap-1.5 text-secondary hover:text-primary font-medium"
              title="Jump to discussion comments"
            >
              <MessageSquare size={14} /> {(blog.commentsList?.length || blog.comments || 0)} Comments
            </button>
          </div>

          {/* Discussion & Comments Section */}
          <section ref={commentsSectionRef} id="comments-section" className="blog-comments-section">
            <div className="blog-comments-header">
              <h3 className="blog-comments-title">
                <MessageSquare size={18} className="text-accent" />
                <span>Discussion ({blog.commentsList?.length || blog.comments || 0})</span>
              </h3>
            </div>

            {/* Comment Submission Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="blog-comment-form-card">
                <div className="blog-comment-form-user">
                  <div className="avatar avatar-xs font-bold text-accent">
                    {(user?.name || user?.firstName || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-primary">{user?.name || user?.firstName || 'You'}</div>
                    <div className="text-[10px] text-secondary capitalize">{user?.role || 'Member'}</div>
                  </div>
                </div>

                <textarea 
                  className="blog-comment-input"
                  placeholder="Share your thoughts, ask a question, or leave feedback for the author..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  disabled={isSubmittingComment}
                  rows={3}
                />

                <div className="blog-comment-form-actions">
                  <button 
                    type="submit" 
                    disabled={!commentText.trim() || isSubmittingComment}
                    className="btn btn-primary btn-sm flex items-center gap-1.5"
                  >
                    {isSubmittingComment ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Post Comment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 rounded-xl border border-border bg-surface-hover mb-6 text-center">
                <p className="text-xs text-secondary mb-2">Please sign in to participate in the conversation and ask questions.</p>
                <Link to="/login" className="btn btn-primary btn-sm">Sign In to Comment</Link>
              </div>
            )}

            {/* Comments List */}
            <div className="blog-comments-list">
              {Array.isArray(blog.commentsList) && blog.commentsList.length > 0 ? (
                blog.commentsList.map((comment) => {
                  const isAuthor = currentUserId && (String(comment.userId) === String(currentUserId));
                  return (
                    <div key={comment.id} className="blog-comment-card">
                      <div className="blog-comment-header">
                        <div className="blog-comment-author-info">
                          <div className="avatar avatar-xs font-bold text-accent">
                            {comment.avatarInitials || (comment.userName ? comment.userName[0].toUpperCase() : 'U')}
                          </div>
                          <div>
                            <span className="blog-comment-author-name">{comment.userName}</span>
                            <span className="badge badge-outline text-[10px] ml-2 capitalize py-0 px-1.5">
                              {comment.userRole || 'Member'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="blog-comment-time">
                            {formatRelativeTime(comment.createdAt) || formatDate(comment.createdAt)}
                          </span>
                          {isAuthor && (
                            <button 
                              type="button"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="btn btn-ghost btn-xs text-tertiary hover:text-danger p-1"
                              title="Delete comment"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="blog-comment-body">
                        {comment.text}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-secondary text-xs">
                  <MessageSquare size={28} className="mx-auto mb-2 text-tertiary opacity-40" />
                  <p className="font-medium text-primary">No comments yet</p>
                  <p className="text-tertiary mt-1">Be the first to share your thoughts or questions!</p>
                </div>
              )}
            </div>
          </section>
        </article>

        {/* Beautiful Spacious Right Sidebar */}
        <aside className="blog-sidebar-sticky">
          
          {/* Card 1: Author Profile Card (Wide Horizontal Layout) */}
          <div className="blog-sidebar-card">
            <div className="sidebar-card-label-row">
              <span className="sidebar-section-title">
                <User size={13} className="text-accent" /> ABOUT THE AUTHOR
              </span>
            </div>
            
            <div className="author-card-main-content">
              <div className="flex items-start gap-3.5">
                <div className="avatar avatar-lg author-sidebar-avatar flex-shrink-0">
                  {blog.author?.avatarInitials || (blog.author?.name ? blog.author.name[0] : 'AU')}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base text-primary leading-tight truncate">
                    {blog.author?.name || 'Anonymous'}
                  </h4>
                  <div className="mt-1">
                    <span className="badge badge-accent text-[11px] font-semibold py-0.5 px-2">
                      {blog.author?.role || 'Community Member'}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="author-bio-text mt-3 text-xs text-secondary leading-relaxed">
                Passionate contributor sharing real-world placement experiences, career growth tips, and technical learnings.
              </p>
            </div>
          </div>

          {/* Card 2: Story Tags & Details Card */}
          <div className="blog-sidebar-card">
            <div className="sidebar-card-label-row">
              <span className="sidebar-section-title">
                <Tag size={13} className="text-accent" /> TOPICS & DETAILS
              </span>
            </div>

            <div className="p-4 pt-1">
              {blog.tags && blog.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="sidebar-tag-pill">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-secondary italic mb-3">No specific tags attached.</p>
              )}

              {/* Story Metrics */}
              <div className="sidebar-metrics-list border-t border-light pt-3">
                <div className="flex justify-between items-center text-xs py-1 text-secondary">
                  <span className="flex items-center gap-1.5"><Clock size={13} /> Reading Time:</span>
                  <span className="font-semibold text-primary">{calculateReadingTime(blog.content)}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 text-secondary">
                  <span className="flex items-center gap-1.5"><Calendar size={13} /> Published:</span>
                  <span className="font-semibold text-primary">{formatDate(blog.publishedDate)}</span>
                </div>
                <div className="flex justify-between items-center text-xs py-1 text-secondary">
                  <span className="flex items-center gap-1.5"><ThumbsUp size={13} /> Appreciation:</span>
                  <span className="font-semibold text-primary">{blog.likes || 0} Likes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Community Inspiration CTA Card */}
          <div className="blog-sidebar-cta-card">
            <div className="cta-icon-badge">
              <Sparkles size={22} className="text-accent" />
            </div>
            <h4 className="font-bold text-base text-primary mt-3">Share your journey</h4>
            <p className="text-xs text-secondary mt-1.5 leading-relaxed px-2">
              Have insights or interview tips? Help fellow students and alumni by writing a story.
            </p>
            <Link to="/blog" className="btn btn-primary w-full mt-4 font-bold text-xs py-2.5 shadow-sm">
              Write Success Story
            </Link>
          </div>

        </aside>
      </div>
    </div>
  );
}
