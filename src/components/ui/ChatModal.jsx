import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useSocket } from '../../contexts/SocketContext';
import { 
  X, Send, RefreshCw, Image, ShieldAlert, Flag, Ban, CheckCircle2, 
  Trash2, AlertTriangle, Lock, Unlock, Eye, Sparkles, Mic, MicOff 
} from 'lucide-react';
import './ChatModal.css';

export default function ChatModal({ activeChatAlum, onClose }) {
  const { user } = useAuth();
  const { 
    getDirectMessages, 
    sendDirectMessage, 
    blockedUsers = [],
    blockedByUsers = [],
    refreshBlocks,
    blockUser, 
    unblockUser, 
    isUserBlocked, 
    reportUserToAdmin 
  } = useData();

  const { emitTyping, emitMessage, typingUsers, lastIncomingMessage, isUserOnline } = useSocket();

  const [chatMessages, setChatMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // base64
  const [imagePreview, setImagePreview] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [previewEnlargedImage, setPreviewEnlargedImage] = useState(null);

  // Report Form State
  const [reportReason, setReportReason] = useState('Inappropriate behavior / harassment');
  const [reportDetails, setReportDetails] = useState('');
  const [reportProofImage, setReportProofImage] = useState(null);
  const [reportProofPreview, setReportProofPreview] = useState(null);
  const [blockAlsoChecked, setBlockAlsoChecked] = useState(true);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [submittingReport, setSubmittingReport] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Voice Typing State & Refs
  const [isListening, setIsListening] = useState(false);
  const [voiceStatusText, setVoiceStatusText] = useState('');
  const [speechLanguage, setSpeechLanguage] = useState('en-IN');
  const [micVolume, setMicVolume] = useState(0);
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const baseTextBeforeSpeechRef = useRef('');
  const accumulatedSpeechRef = useRef('');
  const restartTimeoutRef = useRef(null);
  const audioStreamRef = useRef(null);
  const audioCtxRef = useRef(null);
  const animFrameRef = useRef(null);

  const fileInputRef = useRef(null);
  const reportProofInputRef = useRef(null);
  const chatBottomRef = useRef(null);
  const menuRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const iBlockedTarget = blockedUsers.includes(activeChatAlum?.id);
  const targetBlockedMe = blockedByUsers.includes(activeChatAlum?.id);
  const isBlocked = iBlockedTarget || targetBlockedMe;

  // Escape key listener to close enlarged image lightbox
  useEffect(() => {
    if (!previewEnlargedImage) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setPreviewEnlargedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewEnlargedImage]);

  // Real-time incoming message receiver
  useEffect(() => {
    if (lastIncomingMessage && lastIncomingMessage.from === activeChatAlum?.id) {
      setChatMessages(prev => {
        if (prev.some(m => (m.id && m.id === lastIncomingMessage.id) || (m._id && m._id === lastIncomingMessage._id))) {
          return prev;
        }
        return [...prev, lastIncomingMessage];
      });
    }
  }, [lastIncomingMessage, activeChatAlum?.id]);

  // Close options menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Refresh block list on mount or when current user changes
  useEffect(() => {
    if (refreshBlocks && user?.id) {
      refreshBlocks();
    }
  }, [user?.id]);

  // Fetch initial messages for active chat partner
  useEffect(() => {
    let isMounted = true;
    const fetchMessages = async () => {
      if (!user?.id || !activeChatAlum?.id) return;
      setLoadingMessages(true);
      try {
        const msgs = await getDirectMessages(user.id, activeChatAlum.id);
        if (isMounted) {
          setChatMessages(msgs || []);
        }
      } catch (err) {
        console.error('Error fetching chat messages:', err);
      } finally {
        if (isMounted) {
          setLoadingMessages(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [user?.id, activeChatAlum?.id, getDirectMessages]);

  // Handle typing indicator dispatch
  const handleInputChange = (e) => {
    setNewMessageText(e.target.value);
    if (activeChatAlum?.id) {
      emitTyping(activeChatAlum.id, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        emitTyping(activeChatAlum.id, false);
      }, 2000);
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, imagePreview, typingUsers]);

  // Handle Photo selection
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WebP, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target.result);
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Proof Screenshot selection for Report Modal
  const handleReportProofSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid screenshot image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Proof screenshot size must be smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setReportProofImage(ev.target.result);
      setReportProofPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeReportProofImage = () => {
    setReportProofImage(null);
    setReportProofPreview(null);
    if (reportProofInputRef.current) reportProofInputRef.current.value = '';
  };

  // Stop voice typing and clean up
  const stopVoiceTyping = useCallback(() => {
    isListeningRef.current = false;
    setIsListening(false);
    setVoiceStatusText('');
    setMicVolume(0);
    accumulatedSpeechRef.current = '';

    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onaudiostart = null;
        recognitionRef.current.onsoundstart = null;
        recognitionRef.current.onspeechstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (e) { /* ignore */ }
      recognitionRef.current = null;
    }

    if (audioStreamRef.current) {
      try {
        audioStreamRef.current.getTracks().forEach(t => t.stop());
      } catch (e) { /* ignore */ }
      audioStreamRef.current = null;
    }

    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close().catch(() => {});
      } catch (e) { /* ignore */ }
      audioCtxRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (activeChatAlum?.id) {
      emitTyping(activeChatAlum.id, false);
    }
  }, [activeChatAlum?.id, emitTyping]);

  // Clean-running mobile & desktop speech engine
  const startSpeechEngine = useCallback(() => {
    if (!isListeningRef.current) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onstart = null;
          recognitionRef.current.onaudiostart = null;
          recognitionRef.current.onsoundstart = null;
          recognitionRef.current.onspeechstart = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.stop();
        } catch (e) { /* ignore */ }
        recognitionRef.current = null;
      }

      const recognition = new SpeechRecognition();
      // On mobile browsers, continuous=false prevents engine hang/freeze.
      // Speech utterances are seamlessly accumulated via accumulatedSpeechRef.
      recognition.continuous = !isMobile;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = speechLanguage || 'en-IN';

      recognition.onstart = () => {
        if (isListeningRef.current) {
          setVoiceStatusText('Listening... Speak now');
        }
      };

      recognition.onaudiostart = () => {
        if (isListeningRef.current) {
          setVoiceStatusText('Microphone active... Speak clearly');
        }
      };

      recognition.onsoundstart = () => {
        if (isListeningRef.current) {
          setVoiceStatusText('Sound detected... transcribing');
        }
      };

      recognition.onspeechstart = () => {
        if (isListeningRef.current) {
          setVoiceStatusText('Speech detected! Converting to text...');
        }
      };

      recognition.onresult = (event) => {
        let sessionFinal = '';
        let sessionInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item && item[0] && item[0].transcript) {
            if (item.isFinal) {
              sessionFinal += item[0].transcript + ' ';
            } else {
              sessionInterim += item[0].transcript;
            }
          }
        }

        if (sessionFinal) {
          accumulatedSpeechRef.current = (accumulatedSpeechRef.current + ' ' + sessionFinal).trim();
        }

        const totalSpeech = (accumulatedSpeechRef.current + (sessionInterim ? ' ' + sessionInterim : '')).trim();
        const base = baseTextBeforeSpeechRef.current ? baseTextBeforeSpeechRef.current.trim() : '';
        const combined = (base ? base + ' ' + totalSpeech : totalSpeech).slice(0, 500);

        setNewMessageText(combined);

        if (totalSpeech) {
          setVoiceStatusText(`"${totalSpeech.slice(-45)}"`);
        }

        if (activeChatAlum?.id) {
          emitTyping(activeChatAlum.id, true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            emitTyping(activeChatAlum.id, false);
          }, 2500);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceStatusText('⚠️ Mic blocked! Please allow microphone access in browser settings.');
          alert('Microphone permission was denied. Please allow microphone access in your browser settings.');
          stopVoiceTyping();
        } else if (event.error === 'network') {
          setVoiceStatusText('⚠️ Speech service unreachable. Check internet connection.');
        } else if (event.error === 'audio-capture') {
          setVoiceStatusText('⚠️ Microphone busy or not found.');
          stopVoiceTyping();
        } else if (event.error === 'no-speech') {
          setVoiceStatusText('Listening... (Waiting for your voice)');
        } else if (event.error === 'aborted') {
          // Normal abort on user stop or restart, ignore
        } else {
          setVoiceStatusText(`Notice: ${event.error}`);
        }
      };

      recognition.onend = () => {
        // Keep listening as long as user is active
        if (isListeningRef.current) {
          if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = setTimeout(() => {
            if (isListeningRef.current) {
              startSpeechEngine();
            }
          }, isMobile ? 350 : 150);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
      if (isListeningRef.current) {
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = setTimeout(() => {
          if (isListeningRef.current) {
            startSpeechEngine();
          }
        }, 500);
      }
    }
  }, [speechLanguage, activeChatAlum?.id, emitTyping, stopVoiceTyping]);

  // Cleanup speech recognition on unmount or active user switch
  useEffect(() => {
    return () => {
      stopVoiceTyping();
    };
  }, [stopVoiceTyping]);

  // Voice Typing (Speech-to-Text) Toggle
  const toggleVoiceTyping = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice typing is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    if (isListeningRef.current) {
      stopVoiceTyping();
      return;
    }

    // Check for insecure context on mobile (e.g. testing over HTTP on LAN)
    if (typeof window !== 'undefined' && !window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      alert('Voice typing on mobile requires a secure connection (HTTPS) or localhost. If accessing via local IP over HTTP, browser security blocks the speech API.');
      return;
    }

    try {
      isListeningRef.current = true;
      setIsListening(true);
      setVoiceStatusText('Listening... Speak now');

      baseTextBeforeSpeechRef.current = newMessageText || '';
      accumulatedSpeechRef.current = '';

      startSpeechEngine();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      alert('Could not start voice typing: ' + (err.message || 'Microphone error'));
      stopVoiceTyping();
    }
  };

  // Send message with text and/or photo
  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (isBlocked) return;
    if (!newMessageText.trim() && !selectedImage) return;

    // Stop voice typing if active when sending
    stopVoiceTyping();

    const imageToSend = selectedImage;
    const textToSend = newMessageText.trim() || (imageToSend ? '📷 Photo' : ' ');

    setNewMessageText('');
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setSendingMessage(true);

    try {
      const savedMsg = await sendDirectMessage(user.id, activeChatAlum.id, textToSend, imageToSend);
      setChatMessages(prev => [...prev, savedMsg]);
      emitMessage(activeChatAlum.id, savedMsg);
      emitTyping(activeChatAlum.id, false);
    } catch (err) {
      if (refreshBlocks) await refreshBlocks();
      alert('Failed to send message: ' + (err.message || 'Server error'));
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle Block / Unblock Toggle
  const handleToggleBlock = async () => {
    if (iBlockedTarget) {
      await unblockUser(activeChatAlum.id);
    } else {
      await blockUser(activeChatAlum.id);
    }
    if (refreshBlocks) await refreshBlocks();
    setMenuOpen(false);
  };

  // Handle Submit Report to Admin
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReport(true);
    try {
      await reportUserToAdmin({
        reportedId: activeChatAlum.id,
        reportedName: `${activeChatAlum.firstName || ''} ${activeChatAlum.lastName || ''}`.trim(),
        reason: reportReason,
        details: reportDetails,
        proofImage: reportProofImage,
        blockAlso: blockAlsoChecked
      });
      if (refreshBlocks) await refreshBlocks();
      setReportSubmitted(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSubmitted(false);
        setReportDetails('');
        setReportProofImage(null);
        setReportProofPreview(null);
      }, 1800);
    } catch (err) {
      alert('Failed to submit report: ' + (err.message || 'Server error'));
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal chat-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header chat-header flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="avatar avatar-md">
              {activeChatAlum.firstName ? activeChatAlum.firstName.charAt(0) : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base flex items-center gap-2">
                  Chat with {activeChatAlum.firstName} {activeChatAlum.lastName}
                  {isBlocked && (
                    <span className="badge badge-danger text-xs font-semibold px-2 py-0.5">Blocked</span>
                  )}
                </h3>
                {!isBlocked && (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isUserOnline(activeChatAlum.id) ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isUserOnline(activeChatAlum.id) ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {isUserOnline(activeChatAlum.id) ? 'Online' : 'Offline'}
                  </span>
                )}
              </div>
              <span className="text-xs text-secondary">
                {activeChatAlum.currentRole} {activeChatAlum.currentCompany ? `at ${activeChatAlum.currentCompany}` : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Options Menu (Block & Report) */}
            <div className="relative" ref={menuRef}>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(prev => !prev);
                }} 
                className={`btn btn-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border shadow-sm ${isBlocked ? 'btn-danger' : 'btn-secondary text-primary font-semibold'}`}
                title="Options: Report misconduct or block user"
              >
                <ShieldAlert size={16} className={isBlocked ? "text-white" : "text-accent"} />
                <span>{isBlocked ? 'Blocked' : 'Options'}</span>
              </button>

              {menuOpen && (
                <div className="chat-options-menu">
                  <button 
                    type="button"
                    onClick={(e) => { 
                      e.stopPropagation();
                      setMenuOpen(false); 
                      setReportModalOpen(true); 
                    }} 
                    className="chat-menu-item text-danger font-semibold"
                    title="Report inappropriate student/alumni behavior to college admin"
                  >
                    <Flag size={15} />
                    <span>Report User to Admin</span>
                  </button>

                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleBlock();
                    }} 
                    className="chat-menu-item font-semibold"
                    title={isBlocked ? "Unblock this user to resume chat" : "Block user to stop receiving messages"}
                  >
                    {isBlocked ? (
                      <>
                        <Unlock size={15} className="text-success" />
                        <span className="text-success">Unblock User</span>
                      </>
                    ) : (
                      <>
                        <Ban size={15} className="text-danger" />
                        <span className="text-danger">Block User</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <button className="btn btn-ghost p-1" onClick={onClose} title="Close Chat">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="chat-body-container">
          {/* Chat History */}
          <div className="chat-history-container">
            {loadingMessages ? (
              <div className="text-center my-auto p-6 text-xs text-secondary flex flex-col items-center justify-center">
                <RefreshCw size={24} className="text-accent animate-spin mb-2" />
                <span>Loading chat history...</span>
              </div>
            ) : chatMessages.length === 0 ? (
              <div className="text-center my-auto p-6 text-xs text-secondary flex flex-col items-center justify-center">
                <p>No messages yet. Send a text or photo to start the conversation!</p>
              </div>
            ) : (
              chatMessages.map(msg => {
                const isSelf = msg.from === user?.id;
                return (
                  <div key={msg.id || msg._id} className={`chat-bubble ${isSelf ? 'self' : ''}`}>
                    <div className="chat-bubble-header">
                      <span className="chat-bubble-author">{isSelf ? 'You' : `${activeChatAlum.firstName}`}</span>
                      <span className="chat-bubble-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Image Attachment in message */}
                    {msg.image && (
                      <div className="chat-message-image-wrapper">
                        <img 
                          src={msg.image} 
                          alt="Sent photo" 
                          className="chat-message-image" 
                          title="Click to view photo full screen"
                          onClick={() => setPreviewEnlargedImage(msg.image)}
                        />
                      </div>
                    )}

                    {/* Text content */}
                    {msg.text && msg.text.trim() !== '📷 Photo' && <div className="chat-bubble-text">{msg.text}</div>}
                  </div>
                );
              })
            )}

            {/* Real-time typing status */}
            {typingUsers[activeChatAlum?.id] && (
              <div className="text-xs text-secondary italic px-3 py-1 flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-md my-1 w-fit animate-pulse">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
                <span>{activeChatAlum.firstName} is typing...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Bottom Area (Blocked banner or Preview & Input Form) */}
          <div className="chat-input-area">
            {isBlocked ? (
              <div className="blocked-banner p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-xs text-red-700">
                <div className="flex items-center gap-2 font-medium">
                  <Ban size={16} />
                  <span>
                    {iBlockedTarget 
                      ? "You have blocked this user. Messages cannot be sent or received." 
                      : "Messaging is disabled because this user has blocked messaging with you."}
                  </span>
                </div>
                {iBlockedTarget && (
                  <button onClick={() => unblockUser(activeChatAlum.id)} className="btn btn-outline btn-xs text-red-700 font-bold" title="Unblock User">
                    Unblock
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Photo Preview Bar before sending */}
                {imagePreview && (
                  <div className="image-preview-bar">
                    <div className="image-preview-thumb-box">
                      <img src={imagePreview} alt="Selected attachment" className="image-preview-thumb" />
                      <button 
                        type="button" 
                        onClick={removeSelectedImage} 
                        className="image-preview-remove-btn"
                        title="Remove attached photo"
                      >
                        <X size={11} />
                      </button>
                    </div>
                    <div className="image-preview-info">
                      <span className="font-semibold text-primary block text-xs">Photo attached</span>
                      <span className="text-[11px] text-secondary">Ready to send with your message</span>
                    </div>
                  </div>
                )}

                {/* Voice Typing Active Notification Bar */}
                {isListening && (
                  <div className="voice-typing-status-bar">
                    <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
                      {/* Animated Voice Waveform */}
                      <div className="voice-wave-container flex-shrink-0" title="Microphone recording active">
                        <span className="voice-wave-bar"></span>
                        <span className="voice-wave-bar"></span>
                        <span className="voice-wave-bar"></span>
                        <span className="voice-wave-bar"></span>
                      </div>

                      <span className="font-semibold text-xs truncate">
                        {voiceStatusText || "Listening... Speak clearly"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const nextLang = speechLanguage === 'en-IN' ? 'en-US' : 'en-IN';
                          setSpeechLanguage(nextLang);
                          setVoiceStatusText(`Dialect: ${nextLang === 'en-IN' ? 'EN (India)' : 'EN (US)'}`);
                          if (isListeningRef.current) {
                            setTimeout(() => {
                              if (isListeningRef.current) startSpeechEngine();
                            }, 100);
                          }
                        }}
                        className="voice-lang-badge"
                        title="Click to toggle English accent dialect"
                      >
                        {speechLanguage === 'en-IN' ? 'EN (India)' : 'EN (US)'}
                      </button>

                      <button 
                        type="button" 
                        onClick={stopVoiceTyping} 
                        className="voice-stop-btn"
                        title="Finish voice typing"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}

                {/* Chat Input Form */}
                <form onSubmit={handleSendChatMessage} className="chat-input-form">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleImageSelect} 
                    style={{ display: 'none' }} 
                  />

                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    className={`btn btn-ghost p-2 rounded-lg text-secondary hover:text-accent hover:bg-accent-bg ${selectedImage ? 'text-accent font-bold' : ''}`}
                    title="Attach Photo (Click to select image)"
                  >
                    <Image size={20} />
                  </button>

                  <input 
                    type="text" 
                    className="input flex-1" 
                    placeholder={isListening ? "🎙️ Listening... speak now" : selectedImage ? "Add an optional caption..." : "Type a message..."} 
                    value={newMessageText}
                    onChange={handleInputChange}
                    maxLength={500}
                    disabled={sendingMessage}
                  />

                  {/* Voice Typing Microphone Button */}
                  <button
                    type="button"
                    onClick={toggleVoiceTyping}
                    className={`btn btn-ghost p-2 rounded-lg transition-all ${
                      isListening 
                        ? 'text-red-500 bg-red-500/15 border border-red-500/40 shadow-sm' 
                        : 'text-secondary hover:text-accent hover:bg-accent-bg'
                    }`}
                    title={isListening ? "Listening... Click to stop voice typing" : "Voice typing (Click to speak)"}
                    disabled={sendingMessage}
                  >
                    {isListening ? (
                      <MicOff size={20} className="text-red-500 animate-pulse" />
                    ) : (
                      <Mic size={20} />
                    )}
                  </button>

                  <button 
                    type="submit" 
                    className="btn btn-primary flex items-center justify-center gap-1.5"
                    disabled={sendingMessage || (!newMessageText.trim() && !selectedImage)}
                    title="Send Message"
                  >
                    {sendingMessage ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Send size={16} /> 
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Enlarged Photo Lightbox Modal - Portaled to document.body for top-level full-screen overlay */}
      {previewEnlargedImage && createPortal(
        <div 
          className="chat-lightbox-backdrop" 
          onClick={(e) => {
            e.stopPropagation();
            setPreviewEnlargedImage(null);
          }}
        >
          <button 
            type="button"
            className="chat-lightbox-close-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setPreviewEnlargedImage(null);
            }}
            title="Close image view (Esc)"
            aria-label="Close enlarged photo"
          >
            <X size={24} />
          </button>

          <div className="chat-lightbox-content" onClick={e => e.stopPropagation()}>
            <img 
              src={previewEnlargedImage} 
              alt="Enlarged photo attachment" 
              className="chat-lightbox-image" 
            />
          </div>
        </div>,
        document.body
      )}

      {/* Report User to Admin Modal */}
      {reportModalOpen && createPortal(
        <div 
          className="report-modal-backdrop" 
          onClick={(e) => {
            e.stopPropagation();
            setReportModalOpen(false);
          }}
        >
          <div className="modal report-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-2 text-danger">
                <Flag size={20} />
                <h3 className="font-bold text-base text-primary">Report {activeChatAlum.firstName} {activeChatAlum.lastName}</h3>
              </div>
              <button 
                type="button" 
                className="btn btn-ghost p-1" 
                onClick={(e) => {
                  e.stopPropagation();
                  setReportModalOpen(false);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReportSubmit}>
              <div className="modal-body p-5 flex flex-col gap-4">
                {reportSubmitted ? (
                  <div className="text-center p-6 flex flex-col items-center justify-center">
                    <CheckCircle2 size={44} className="text-success mb-3 animate-bounce" />
                    <h3 className="font-bold text-lg">Report Submitted to Admin</h3>
                    <p className="text-xs text-secondary mt-2">
                      College administrators have been notified and will review this account misconduct report.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-secondary">
                      If this user's behavior is inappropriate, abusive, or violating community guidelines, please report them to college administration.
                    </p>

                    <div className="input-group">
                      <label htmlFor="report-reason" className="font-semibold text-xs text-primary">Reason for Reporting *</label>
                      <select 
                        id="report-reason" 
                        className="select w-full"
                        value={reportReason}
                        onChange={e => setReportReason(e.target.value)}
                        required
                        disabled={submittingReport}
                      >
                        <option value="Inappropriate behavior / harassment">Inappropriate behavior / harassment</option>
                        <option value="Unprofessional or offensive language">Unprofessional or offensive language</option>
                        <option value="Spam, scam or unauthorized solicitation">Spam, scam or unauthorized solicitation</option>
                        <option value="Fake profile or impersonation">Fake profile or impersonation</option>
                        <option value="Other misconduct">Other misconduct</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label htmlFor="report-details" className="font-semibold text-xs text-primary">Additional Details (Optional)</label>
                      <textarea 
                        id="report-details" 
                        className="textarea w-full" 
                        rows="3" 
                        placeholder="Provide details about what happened..." 
                        value={reportDetails}
                        onChange={e => setReportDetails(e.target.value)}
                        disabled={submittingReport}
                      />
                    </div>

                    {/* Proof Screenshot / Evidence Image Upload */}
                    <div className="input-group">
                      <label className="font-semibold text-xs text-primary block mb-1">
                        Attach Proof Screenshot / Evidence <span className="font-normal text-secondary">(Optional)</span>
                      </label>

                      {reportProofPreview ? (
                        <div className="relative inline-block border rounded-lg overflow-hidden max-w-[220px]">
                          <img src={reportProofPreview} alt="Evidence preview" className="w-full h-28 object-cover" />
                          <button 
                            type="button" 
                            onClick={removeReportProofImage} 
                            className="absolute top-1 right-1 bg-danger text-white rounded-full p-1 shadow hover:scale-105"
                            title="Remove attached proof screenshot"
                            disabled={submittingReport}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <input 
                            type="file" 
                            ref={reportProofInputRef} 
                            accept="image/*" 
                            onChange={handleReportProofSelect} 
                            style={{ display: 'none' }} 
                            id="report-proof-file"
                          />
                          <button 
                            type="button" 
                            onClick={() => reportProofInputRef.current?.click()} 
                            className="btn btn-secondary btn-sm flex items-center gap-2 border border-dashed px-3 py-2 text-xs font-semibold"
                            disabled={submittingReport}
                          >
                            <Image size={15} className="text-accent" />
                            <span>Upload Proof Screenshot (PNG, JPG, WebP)</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <input 
                        type="checkbox" 
                        id="block-also" 
                        checked={blockAlsoChecked} 
                        onChange={e => setBlockAlsoChecked(e.target.checked)}
                        className="checkbox" 
                        disabled={submittingReport}
                      />
                      <label htmlFor="block-also" className="text-xs font-semibold text-primary cursor-pointer">
                        Also block this user from messaging me
                      </label>
                    </div>
                  </>
                )}
              </div>

              {!reportSubmitted && (
                <div className="modal-footer flex justify-end gap-2 p-4 border-t border-light">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setReportModalOpen(false);
                    }}
                    disabled={submittingReport}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-danger flex items-center gap-1.5 font-bold"
                    disabled={submittingReport}
                  >
                    {submittingReport ? (
                      <RefreshCw size={14} className="animate-spin" />
                    ) : (
                      <Flag size={14} />
                    )}
                    <span>{submittingReport ? 'Submitting...' : 'Submit Report'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
