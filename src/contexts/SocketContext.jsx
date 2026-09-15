import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [lastIncomingMessage, setLastIncomingMessage] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setSocket(prevSocket => {
        if (prevSocket) prevSocket.disconnect();
        return null;
      });
      setOnlineUsers([]);
      setTypingUsers({});
      return;
    }

    // Connect socket with auto-upgrade
    const newSocket = io('/', {
      withCredentials: true,
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_user', {
        userId: user.id,
        token: user.token
      });
    });

    newSocket.on('user_presence_change', (data) => {
      if (data?.onlineUsers) {
        setOnlineUsers(data.onlineUsers);
      }
    });

    newSocket.on('user_typing', ({ from, userName, isTyping }) => {
      setTypingUsers(prev => ({
        ...prev,
        [from]: isTyping ? (userName || 'Someone') : null
      }));
    });

    newSocket.on('receive_message', (msg) => {
      setLastIncomingMessage(msg);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user?.id, user?.token, isAuthenticated]);

  const emitTyping = useCallback((toUserId, isTyping) => {
    if (!socket || !toUserId || !user?.id) return;
    const eventName = isTyping ? 'typing_start' : 'typing_stop';
    socket.emit(eventName, {
      from: user.id,
      to: toUserId,
      userName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()
    });
  }, [socket, user]);

  const emitMessage = useCallback((toUserId, messageData) => {
    if (!socket || !toUserId || !user?.id) return;
    socket.emit('send_direct_message', {
      from: user.id,
      to: toUserId,
      ...messageData
    });
  }, [socket, user]);

  const isUserOnline = useCallback((userId) => {
    return onlineUsers.includes(userId);
  }, [onlineUsers]);

  const value = {
    socket,
    onlineUsers,
    typingUsers,
    lastIncomingMessage,
    emitTyping,
    emitMessage,
    isUserOnline
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
