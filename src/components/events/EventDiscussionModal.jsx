import React, { useState, useEffect, useRef } from 'react';
import { 
  X, MessageSquare, Send, Calendar, MapPin, 
  Sparkles, UserCheck, ShieldCheck 
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { useData } from '../../contexts/DataContext';
import Avatar from '../ui/Avatar';

export default function EventDiscussionModal({ event, user, onClose }) {
  const { eventComments, addEventComment } = useData();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef(null);

  const comments = (eventComments || []).filter(c => event && c.eventId === event.id);

  // Auto-scroll to bottom of discussion on new comment
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments.length]);

  if (!event || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addEventComment(event.id, {
        authorId: user.id,
        authorName: user.name || 'Campus Member',
        authorAvatar: user.avatarUrl || null,
        role: user.role || 'student',
        text: commentText.trim()
      });
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal p-0 max-w-xl overflow-hidden rounded-2xl border shadow-2xl bg-surface flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-4 bg-background border-b border-light flex justify-between items-center">
          <div>
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <MessageSquare size={18} className="text-accent" /> Event Discussion Forum
            </h3>
            <span className="text-xs text-secondary font-medium">{event.title}</span>
          </div>
          <button type="button" className="btn btn-ghost p-1" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Event Quick Context Strip */}
        <div className="px-4 py-2 bg-accent-bg/20 border-b border-light flex items-center justify-between text-xs text-secondary flex-wrap gap-2">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} className="text-accent" /> {formatDate(event.date)} at {event.time}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-accent" /> {event.location}
          </span>
        </div>

        {/* Discussion Stream */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 min-h-[260px]">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-auto py-8 text-center">
              <MessageSquare size={36} className="text-secondary/40 mb-2" />
              <p className="text-xs font-bold text-primary">No questions or comments yet</p>
              <p className="text-xxs text-secondary mt-1 max-w-xs">
                Be the first to start the discussion, ask organizers for details, or coordinate travel with peers!
              </p>
            </div>
          ) : (
            comments.map((comment, idx) => {
              const isOwn = comment.userId === user.id || comment.authorId === user.id;
              const authorRole = comment.userRole || comment.role || 'student';
              const authorName = comment.userName || comment.authorName || 'Campus Member';

              return (
                <div 
                  key={comment.id || idx} 
                  className={`flex items-start gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar 
                    src={comment.authorAvatar} 
                    name={authorName} 
                    role={authorRole} 
                    size="sm" 
                    isVerified={true}
                  />
                  <div className={`flex flex-col max-w-[80%] ${isOwn ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-bold text-xs text-primary">{isOwn ? 'You' : authorName}</span>
                      <span className="badge badge-accent text-[9px] py-0 px-1 font-semibold">
                        {authorRole === 'student' ? 'Student' : authorRole === 'alumni' ? 'Alumni' : 'Admin'}
                      </span>
                      <span className="text-[10px] text-tertiary">
                        {comment.timestamp ? new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>

                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isOwn 
                        ? 'bg-accent text-white rounded-tr-none' 
                        : 'bg-background border text-primary rounded-tl-none'
                    }`}>
                      {comment.text}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Comment Input Footer */}
        <form onSubmit={handleSubmit} className="p-3 bg-background border-t border-light flex items-center gap-2">
          <input 
            type="text" 
            className="input text-xs flex-1 py-2.5" 
            placeholder="Ask a question, post discussion, or coordinate with batchmates..." 
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            disabled={isSubmitting}
          />
          <button 
            type="submit" 
            disabled={!commentText.trim() || isSubmitting}
            className="btn btn-primary btn-sm px-4 flex items-center gap-1.5 font-bold shadow disabled:opacity-50"
          >
            <Send size={14} /> Send
          </button>
        </form>

      </div>
    </div>
  );
}
