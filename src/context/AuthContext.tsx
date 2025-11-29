'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  socket: Socket | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

    // Initialize Socket.IO connection
    const socketConnection = io(backendUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
    });

    setSocket(socketConnection);

    // Socket event listeners for real-time updates
    socketConnection.on('professionalCreated', (data) => {
      console.log('Professional created:', data);
      // Handle real-time professional creation
    });

    socketConnection.on('professionalUpdated', (data) => {
      console.log('Professional updated:', data);
      // Handle real-time professional updates
    });

    socketConnection.on('professionalDeleted', (data) => {
      console.log('Professional deleted:', data);
      // Handle real-time professional deletion
    });

    socketConnection.on('professionalVerified', (data) => {
      console.log('Professional verified:', data);
      // Handle real-time professional verification
    });

    const token = localStorage.getItem('token');
    if (token) {
      // Fetch user profile with timeout and retry logic
      const fetchUserProfile = async (retries = 3) => {
        try {
          const response = await fetch(`${backendUrl}/api/users/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setUser(data);

          // Join user's personal room for notifications
          if (data._id) {
            socketConnection.emit('join', data._id);
          }
        } catch (err: any) {
          console.error('Failed to fetch user profile:', err);
          if (retries > 0 && !err.message.includes('401') && !err.message.includes('403')) {
            // Retry after a delay for non-auth errors
            setTimeout(() => fetchUserProfile(retries - 1), 2000);
          } else {
            // Clear invalid token
            localStorage.removeItem('token');
          }
        } finally {
          setLoading(false);
        }
      };

      fetchUserProfile();
    } else {
      setLoading(false);
    }

    // Cleanup socket connection on unmount
    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const { token, user } = await res.json();
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const { token, user } = await res.json();
      localStorage.setItem('token', token);
      setUser(user);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, socket }}>
      {children}
    </AuthContext.Provider>
  );
};