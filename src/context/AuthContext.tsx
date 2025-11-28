'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
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
    // Set axios base URL for API calls
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    axios.defaults.baseURL = backendUrl;

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
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user profile with timeout and retry logic
      const fetchUserProfile = async (retries = 3) => {
        try {
          const response = await axios.get('/api/users/profile', {
            timeout: 10000, // 10 second timeout
            headers: {
              'Cache-Control': 'no-cache'
            }
          });
          setUser(response.data);

          // Join user's personal room for notifications
          if (response.data._id) {
            socketConnection.emit('join', response.data._id);
          }
        } catch (err: any) {
          console.error('Failed to fetch user profile:', err);
          if (retries > 0 && err.code !== 'NETWORK_ERROR') {
            // Retry after a delay
            setTimeout(() => fetchUserProfile(retries - 1), 2000);
          } else {
            // Clear invalid token
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
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
      const res = await axios.post('/auth/login', { email, password }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const res = await axios.post('/auth/register', { name, email, password, role }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, socket }}>
      {children}
    </AuthContext.Provider>
  );
};