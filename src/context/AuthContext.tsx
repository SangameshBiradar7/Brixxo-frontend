'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import { io, Socket } from 'socket.io-client';
import { api } from '@/lib/api';

// ----------- User Type ----------- //
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

// ----------- Context Type ----------- //
interface AuthContextType {
  user: User | null;
  loading: boolean;
  socket: Socket | null;
  login: (email: string, password: string) => Promise<User>;
  sendOTP: (data: { email?: string; phone?: string; name?: string }) => Promise<void>;
  verifyOTP: (data: { email?: string; phone?: string; otp: string; name?: string; role?: string }) => Promise<User>;
  loginOTP: (data: { email?: string; phone?: string }) => Promise<void>;
  verifyLoginOTP: (data: { email?: string; phone?: string; otp: string }) => Promise<User>;
  forgotPassword: (data: { email?: string; phone?: string }) => Promise<void>;
  resetPassword: (data: { email?: string; phone?: string; otp: string; newPassword: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -------- Hook -------- //
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

// -------- Provider -------- //
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
      'http://localhost:5000';

    // Initialize socket.io
    const socketConnection = io(backendUrl, {
      transports: ['websocket'],
      autoConnect: true,
    });

    setSocket(socketConnection);

    // Listen to professional events
    socketConnection.on('professionalCreated', (d) =>
      console.log('Real-time Created:', d)
    );
    socketConnection.on('professionalUpdated', (d) =>
      console.log('Real-time Updated:', d)
    );
    socketConnection.on('professionalDeleted', (d) =>
      console.log('Real-time Deleted:', d)
    );
    socketConnection.on('professionalVerified', (d) =>
      console.log('Real-time Verified:', d)
    );

    // Fetch profile if logged in
    const token = localStorage.getItem('token');

    if (token) {
      const loadUser = async () => {
        try {
          const data = await api.get('/users/profile');

          // Some backends return { user }, some return full object
          const userData = data.user || data;
          setUser(userData);

          // Join user's socket room
          socketConnection.once('connect', () => {
            socketConnection.emit('join', userData._id);
          });
        } catch (err) {
          console.error('Profile fetch failed:', err);
          localStorage.removeItem('token');
        } finally {
          setLoading(false);
        }
      };

      loadUser();
    } else {
      setLoading(false);
    }

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  // --- LOGIN FUNCTION ---
  const login = async (email: string, password: string): Promise<User> => {
    const data = await api.post('/auth/login', { email, password });

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token);
    }
    setUser(data.user);

    return data.user;
  };

  // --- OTP FUNCTIONS ---
  const sendOTP = async (data: { email?: string; phone?: string; name?: string }) => {
    await api.post('/auth/send-otp', data);
  };

  const verifyOTP = async (data: { email?: string; phone?: string; otp: string; name?: string; role?: string }): Promise<User> => {
    const response = await api.post('/auth/verify-otp', data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
    }
    setUser(response.user);
    return response.user;
  };

  const loginOTP = async (data: { email?: string; phone?: string }) => {
    await api.post('/auth/login-otp', data);
  };

  const verifyLoginOTP = async (data: { email?: string; phone?: string; otp: string }): Promise<User> => {
    const response = await api.post('/auth/verify-login-otp', data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', response.token);
    }
    setUser(response.user);
    return response.user;
  };

  const forgotPassword = async (data: { email?: string; phone?: string }) => {
    await api.post('/auth/forgot-password', data);
  };

  const resetPassword = async (data: { email?: string; phone?: string; otp: string; newPassword: string }) => {
    await api.post('/auth/reset-password', data);
  };

  // --- LOGOUT FUNCTION ---
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    socket?.disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        socket,
        login,
        sendOTP,
        verifyOTP,
        loginOTP,
        verifyLoginOTP,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
