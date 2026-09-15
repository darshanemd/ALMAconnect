import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';
import BufferingOverlay from '../components/ui/BufferingOverlay';

const AuthContext = createContext(null);

/**
 * Normalizes user role: if a student's graduation year has arrived or passed,
 * automatically treat them as an alumni.
 */
const normalizeUserRole = (userData) => {
  if (!userData) return userData;
  const currentYear = new Date().getFullYear();
  const gradYear = Number(userData.graduationYear);
  if (userData.role === 'student' && gradYear && gradYear <= currentYear) {
    return {
      ...userData,
      role: 'alumni'
    };
  }
  return userData;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = window.localStorage.getItem('alumni_auth');
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      const normalized = normalizeUserRole(parsed);
      if (normalized.role !== parsed.role) {
        window.localStorage.setItem('alumni_auth', JSON.stringify(normalized));
      }
      return normalized;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!user);
  const [isLoading, setIsLoading] = useState(false);

  // Buffering animation overlay state
  const [bufferingState, setBufferingState] = useState(null);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (email, password) => {
    setBufferingState({
      active: true,
      title: "Loading AlumniConnect",
      subtitle: "Connecting alumni worldwide..."
    });

    const startTime = Date.now();
    try {
      const loggedUser = await apiRequest('/auth/login', 'POST', { email, password });
      
      // Ensure smooth minimum animation display (~1200ms) for high quality visual experience
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1200) {
        await new Promise(resolve => setTimeout(resolve, 1200 - elapsedTime));
      }

      const normalizedUser = normalizeUserRole({
        ...loggedUser,
        avatarUrl: loggedUser.avatarUrl || loggedUser.avatar || null
      });

      setUser(normalizedUser);
      setIsAuthenticated(true);
      window.localStorage.setItem('alumni_auth', JSON.stringify(normalizedUser));
      return normalizedUser;
    } catch (err) {
      throw new Error(err.message || 'Invalid email or password.', { cause: err });
    } finally {
      setBufferingState(null);
    }
  };

  const logout = async () => {
    setBufferingState({
      active: true,
      title: "Logging Out...",
      subtitle: "Securing your session and disconnecting..."
    });

    // Display animation smoothly before clearing session (~1200ms)
    await new Promise(resolve => setTimeout(resolve, 1200));

    setUser(null);
    setIsAuthenticated(false);
    window.localStorage.removeItem('alumni_auth');
    setBufferingState(null);
  };

  const register = async (userData) => {
    try {
      const endpoint = userData.role === 'student' ? '/members/manual-student' : '/members/manual-alumni';
      const payload = {
        ...userData,
        status: userData.status || 'pending',
        isVerified: userData.isVerified || false
      };
      const savedUser = await apiRequest(endpoint, 'POST', payload);
      return { success: true, user: savedUser, message: 'Registration submitted successfully!' };
    } catch (err) {
      console.error('Failed to register member in backend API:', err);
      throw err;
    }
  };

  const updateUser = async (updatedFields) => {
    setUser(prevUser => {
      const updated = normalizeUserRole({ ...prevUser, ...updatedFields });
      window.localStorage.setItem('alumni_auth', JSON.stringify(updated));
      return updated;
    });

    // Also persist changes to the MongoDB backend database if user.id exists
    if (user?.id) {
      try {
        const payload = {};
        if (updatedFields.avatarUrl !== undefined) {
          payload.avatar = updatedFields.avatarUrl;
        }
        if (updatedFields.avatar !== undefined) {
          payload.avatar = updatedFields.avatar;
        }
        if (updatedFields.name) {
          const parts = updatedFields.name.trim().split(' ');
          payload.firstName = parts[0];
          payload.lastName = parts.slice(1).join(' ') || '';
        }
        // Copy any other updated fields
        Object.keys(updatedFields).forEach(key => {
          if (!['avatarUrl', 'name'].includes(key)) {
            payload[key] = updatedFields[key];
          }
        });

        await apiRequest(`/members/${user.id}`, 'PUT', payload);
      } catch (err) {
        console.warn('Could not sync user update to backend database:', err.message);
      }
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    bufferingState,
    login,
    logout,
    register,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {bufferingState?.active && (
        <BufferingOverlay 
          title={bufferingState.title} 
          subtitle={bufferingState.subtitle} 
        />
      )}
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;

