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
  register: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
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

    localStorage.setItem('token', data.token);
    setUser(data.user);

    return data.user;
  };

  // --- REGISTER FUNCTION ---
  const register = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    const data = await api.post('/api/register', {
      name,
      email,
      password,
      role,
    });

    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  // --- LOGOUT FUNCTION ---
  const logout = () => {
    localStorage.removeItem('token');
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
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
