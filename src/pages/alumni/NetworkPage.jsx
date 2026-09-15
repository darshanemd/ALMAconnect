import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Users, UserPlus, UserCheck, MessageSquare, Compass, Check, X, Clock } from 'lucide-react';
import { getInitials } from '../../utils/formatters';
import ChatModal from '../../components/ui/ChatModal';
import './NetworkPage.css';

export default function NetworkPage() {
  const { user } = useAuth();
  const { alumni, getConnectionRequests, respondConnectionRequest, sendConnectionRequest } = useData();

  // Direct Messaging States
  const [chatOpen, setChatOpen] = useState(false);
  const [activeChatAlum, setActiveChatAlum] = useState(null);

  const handleOpenChat = (alum) => {
    setActiveChatAlum(alum);
    setChatOpen(true);
  };

  const [activeTab, setActiveTab] = useState('connections');

  const currentUserData = alumni.find(a => a.id === user?.id);
  const requests = useMemo(() => getConnectionRequests(user?.id) || [], [getConnectionRequests, user?.id]);

  // My connections list
  const connectionsList = useMemo(() => {
    if (!currentUserData || !currentUserData.connections) return [];
    return alumni.filter(a => currentUserData.connections.includes(a.id));
  }, [currentUserData, alumni]);

  // Pending incoming requests
  const incomingRequests = useMemo(() => {
    return requests
      .filter(r => r.to === user?.id && r.status === 'pending')
      .map(req => {
        const sender = alumni.find(a => a.id === req.from);
        return { ...req, sender };
      })
      .filter(r => r.sender);
  }, [requests, alumni, user]);

  // Suggested connections (not connected, no pending requests, same college/dept or overlapping skills)
  const suggestions = useMemo(() => {
    if (!currentUserData) return [];
    
    const connectedIds = currentUserData.connections || [];
    const pendingIds = requests.map(r => r.from === user?.id ? r.to : r.from);
    const excludeIds = [user?.id, ...connectedIds, ...pendingIds];

    return alumni
      .filter(a => !excludeIds.includes(a.id) && a.status === 'active')
      .map(alum => {
        // Calculate similarity score
        let score = 0;
        if (alum.department === currentUserData.department) score += 40;
        if (alum.collegeId === currentUserData.collegeId) score += 30;
        const shared = alum.skills.filter(s => currentUserData.skills.includes(s));
        score += shared.length * 10;
        
        return { ...alum, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  }, [currentUserData, alumni, requests, user]);

  const handleAccept = (reqId) => {
    respondConnectionRequest(reqId, 'accepted');
  };

  const handleReject = (reqId) => {
    respondConnectionRequest(reqId, 'rejected');
  };

  const handleConnect = (alumId) => {
    sendConnectionRequest(user?.id, alumId);
  };

  return (
    <div className="network-page stagger-children">
      {/* Tab bar */}
      <div className="tabs mb-6">
        <button className={`tab-btn ${activeTab === 'connections' ? 'active' : ''}`} onClick={() => setActiveTab('connections')}>
          My Connections ({connectionsList.length})
        </button>
        <button className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
          Pending Requests ({incomingRequests.length})
        </button>
        <button className={`tab-btn ${activeTab === 'suggestions' ? 'active' : ''}`} onClick={() => setActiveTab('suggestions')}>
          Suggested Matches
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'connections' && (
        <div className="grid grid-3 gap-6">
          {connectionsList.length === 0 ? (
            <div className="card empty-state p-12 text-center grid-span-3">
              <div className="empty-icon"><Users size={32} /></div>
              <h3>No Connections Yet</h3>
              <p>Grow your professional network by exploring the directory and sending connection requests.</p>
            </div>
          ) : (
            connectionsList.map(conn => (
              <div key={conn.id} className="card connection-card p-6 flex flex-col items-center text-center">
                <div className="avatar avatar-lg">{getInitials(`${conn.firstName} ${conn.lastName}`)}</div>
                <h3 className="font-semibold text-lg mt-3">{conn.firstName} {conn.lastName}</h3>
                <p className="text-xs text-secondary mt-1">{conn.degree} &bull; {conn.department}</p>
                <p className="text-sm font-medium text-accent mt-2">{conn.currentCompany ? `${conn.currentRole} at ${conn.currentCompany}` : 'Verified Alumni'}</p>
                
                <button 
                  onClick={() => handleOpenChat(conn)}
                  className="btn btn-secondary w-full mt-6 flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} /> Send Message
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="flex flex-col gap-4">
          {incomingRequests.length === 0 ? (
            <div className="card empty-state p-12 text-center">
              <div className="empty-icon"><Clock size={32} /></div>
              <h3>No Pending Requests</h3>
              <p>You have no incoming connection requests at the moment.</p>
            </div>
          ) : (
            incomingRequests.map(req => (
              <div key={req.id} className="card request-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="avatar avatar-md">{getInitials(`${req.sender.firstName} ${req.sender.lastName}`)}</div>
                  <div>
                    <h4 className="font-semibold">{req.sender.firstName} {req.sender.lastName}</h4>
                    <p className="text-xs text-secondary">{req.sender.degree} &bull; {req.sender.department} &bull; Class of {req.sender.graduationYear}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleAccept(req.id)} className="btn btn-primary btn-sm flex items-center gap-1">
                    <Check size={14} /> Accept
                  </button>
                  <button onClick={() => handleReject(req.id)} className="btn btn-secondary btn-sm flex items-center gap-1 text-danger">
                    <X size={14} /> Ignore
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'suggestions' && (
        <div className="grid grid-2 gap-6">
          {suggestions.length === 0 ? (
            <div className="card empty-state p-12 text-center grid-span-2">
              <div className="empty-icon"><Compass size={32} /></div>
              <h3>No Suggestions Available</h3>
              <p>We couldn't find matches. Try adding more skills to your profile to receive automated suggestions.</p>
            </div>
          ) : (
            suggestions.map(sug => (
              <div key={sug.id} className="card suggestion-card p-6 flex justify-between items-start gap-4">
                <div className="flex gap-4 flex-1">
                  <div className="avatar avatar-md">{getInitials(`${sug.firstName} ${sug.lastName}`)}</div>
                  <div className="flex-1 min-width-0">
                    <h4 className="font-semibold">{sug.firstName} {sug.lastName}</h4>
                    <p className="text-xs text-secondary mt-1">{sug.degree} in {sug.department}</p>
                    <p className="text-xs font-semibold text-accent mt-1">{sug.currentCompany ? `${sug.currentRole} at ${sug.currentCompany}` : 'Job Seeker'}</p>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {sug.skills.slice(0, 2).map((sk, idx) => (
                        <span key={idx} className="tag tag-outline" style={{ fontSize: '10px' }}>{sk}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {sug.score > 50 && (
                    <span className="badge badge-accent" style={{ fontSize: '10px' }}>Matched</span>
                  )}
                  <button onClick={() => handleConnect(sug.id)} className="btn btn-primary btn-sm flex items-center gap-1 mt-2">
                    <UserPlus size={14} /> Connect
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {/* Direct Messaging Modal */}
      {chatOpen && activeChatAlum && (
        <ChatModal 
          activeChatAlum={activeChatAlum} 
          onClose={() => setChatOpen(false)} 
        />
      )}
    </div>
  );
}
