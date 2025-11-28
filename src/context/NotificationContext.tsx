'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => void;
  notificationCount: number;
  refreshNotificationCount: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  const refreshUnreadCount = async () => {
    if (!user) return;

    try {
      const response = await axios.get('/api/messages/conversations/all');
      const totalUnread = response.data.reduce((total: number, conv: any) => total + conv.unreadCount, 0);
      setUnreadCount(totalUnread);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const refreshNotificationCount = async () => {
    if (!user) return;

    try {
      const response = await axios.get('/api/notifications?unreadOnly=true');
      setNotificationCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  useEffect(() => {
    if (user) {
      // Initialize socket connection for notifications
      const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000');
      setSocket(newSocket);

      // Join user's room
      newSocket.emit('join', user._id);

      // Listen for new messages
      newSocket.on('newMessage', (message: any) => {
        // If the message is not from the current user, increment unread count
        if (message.sender._id !== user._id && message.receiver._id === user._id) {
          setUnreadCount(prev => prev + 1);
        }
      });

      // Initial load of unread count and notification count
      refreshUnreadCount();
      refreshNotificationCount();

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const value = {
    unreadCount,
    refreshUnreadCount,
    notificationCount,
    refreshNotificationCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};