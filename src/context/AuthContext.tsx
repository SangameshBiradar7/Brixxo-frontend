'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

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
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const backendUrl = apiUrl.replace('/api', '');

    // --- SOCKET INITIALIZATION ---
    const socketConnection = io(backendUrl, {
      transports: ['websocket', 'polling'],
      upgrade: true,
    });

    setSocket(socketConnection);

    // General events
    socketConnection.on('professionalCreated', (d) => console.log('Real-time created:', d));
    socketConnection.on('professionalUpdated', (d) => console.log('Real-time updated:', d));
    socketConnection.on('professionalDeleted', (d) => console.log('Real-time deleted:', d));
    socketConnection.on('professionalVerified', (d) => console.log('Real-time verified:', d));

    // --- PROFILE FETCH ---
    const token = localStorage.getItem('token');

    if (token) {
      const fetchProfile = async (retries = 3) => {
        try {
          const data = await api.get('/users/profile');

          // FIX: Extract actual user object
          const userData = data.user || data;
          setUser(userData);

          // Join private room AFTER socket connects
          socketConnection.once('connect', () => {
            socketConnection.emit('join', userData._id);
          });

        } catch (err: any) {
          console.error('Profile fetch failed:', err);

          if (retries > 0 && err?.status && ![401, 403].includes(err.status)) {
            return setTimeout(() => fetchProfile(retries - 1), 2000);
          }

          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    } else {
      setLoading(false);
    }

    return () => {
      socketConnection.disconnect();
    };

  }, []);

  // --- LOGIN ---
  const login = async (email: string, password: string): Promise<User> => {
    const data = await api.post('/auth/login', { email, password });

    localStorage.setItem('token', data.token);
    setUser(data.user);

    return data.user;
  };

  // --- REGISTER ---
  const register = async (name: string, email: string, password: string, role: string) => {
    const data = await api.post('/register', { name, email, password, role });

    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  // --- LOGOUT ---
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    socket?.disconnect(); // fix socket issue
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, socket }}>
      {children}
    </AuthContext.Provider>
  );
};