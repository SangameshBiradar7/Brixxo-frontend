'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface Message {
  _id: string;
  sender: {
    _id: string;
    name: string;
  };
  receiver: {
    _id: string;
    name: string;
  };
  conversationId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  otherUser: {
    _id: string;
    name: string;
  };
  inquiryId?: string;
  companyInfo?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
    website?: string;
    address?: string;
  };
}

export default function ChatModal({
  isOpen,
  onClose,
  conversationId,
  otherUser,
  inquiryId,
  companyInfo
}: ChatModalProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize socket connection with auto-reconnect
  const initializeSocket = useCallback(() => {
    if (!isOpen || !user) return;

    // Prevent multiple socket connections
    if (socketRef.current?.connected) {
      console.log('Socket already connected, reusing existing connection');
      setSocket(socketRef.current);
      setConnectionStatus('connected');
      return;
    }

    console.log('Initializing new socket connection...');
    setConnectionStatus('connecting');

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: false, // Reuse connection if possible
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      setConnectionStatus('connected');

      // Join user's room
      newSocket.emit('join', user._id);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setConnectionStatus('disconnected');

      // Auto-reconnect logic
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        // Server disconnected, try to reconnect
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          newSocket.connect();
        }, 2000);
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setConnectionStatus('disconnected');
    });

    // Listen for new messages
    newSocket.on('newMessage', (message: Message) => {
      console.log('📨 New message received:', message._id);
      if (message.conversationId === conversationId) {
        setMessages(prev => {
          // Prevent duplicate messages
          if (prev.some(m => m._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    });

    // Listen for typing indicators
    newSocket.on('userTyping', (data: { senderId: string; conversationId: string }) => {
      if (data.senderId === otherUser._id && data.conversationId === conversationId) {
        setOtherUserTyping(true);
      }
    });

    newSocket.on('userStopTyping', (data: { senderId: string; conversationId: string }) => {
      if (data.senderId === otherUser._id && data.conversationId === conversationId) {
        setOtherUserTyping(false);
      }
    });

    // Listen for message errors
    newSocket.on('messageError', (error) => {
      console.error('❌ Message error:', error);
      // Could show user notification here
    });

    // Listen for message sent confirmation
    newSocket.on('messageSent', (message: Message) => {
      console.log('✅ Message sent confirmation:', message._id);
      // Message is already in state from optimistic update
    });

  }, [isOpen, user, conversationId, otherUser._id]);

  // Initialize socket when modal opens
  useEffect(() => {
    if (isOpen) {
      initializeSocket();
    } else {
      // Clean up when modal closes
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [isOpen, initializeSocket]);

  // Load messages when modal opens or conversation changes
  useEffect(() => {
    if (isOpen && conversationId) {
      loadMessages();
    }
  }, [isOpen, conversationId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      console.log('📥 Loading messages for conversation:', conversationId);
      const response = await axios.get(`/api/messages/conversation/${conversationId}`, {
        timeout: 10000,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      setMessages(response.data);
      console.log('✅ Messages loaded:', response.data.length);
    } catch (error: any) {
      console.error('❌ Error loading messages:', error);
      // Could show error message to user
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || !user || connectionStatus !== 'connected') {
      console.warn('Cannot send message: missing requirements or disconnected');
      return;
    }

    const messageContent = newMessage.trim();

    try {
      const messageData = {
        senderId: user._id,
        receiverId: otherUser._id,
        conversationId,
        content: messageContent,
        inquiryId
      };

      console.log('📤 Sending message:', messageData);

      // Optimistic update - add message to UI immediately
      const optimisticMessage: Message = {
        _id: `temp-${Date.now()}`, // Temporary ID
        sender: { _id: user._id, name: user.name },
        receiver: { _id: otherUser._id, name: otherUser.name },
        conversationId,
        content: messageContent,
        createdAt: new Date().toISOString(),
        read: false
      };

      setMessages(prev => [...prev, optimisticMessage]);
      setNewMessage('');

      // Send via socket
      socket.emit('sendMessage', messageData);

      // Stop typing indicator
      socket.emit('stopTyping', {
        senderId: user._id,
        receiverId: otherUser._id,
        conversationId
      });

    } catch (error) {
      console.error('❌ Error sending message:', error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(m => !m._id.startsWith('temp-')));
      // Could show error message to user
    }
  };

  const handleTyping = () => {
    if (!socket || !user || connectionStatus !== 'connected') return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing indicator
    socket.emit('typing', {
      senderId: user._id,
      receiverId: otherUser._id,
      conversationId
    });

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      if (socket) {
        socket.emit('stopTyping', {
          senderId: user._id,
          receiverId: otherUser._id,
          conversationId
        });
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg h-[700px] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-semibold text-lg">
                {otherUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{otherUser.name}</h3>
              <p className="text-sm opacity-90 flex items-center">
                {connectionStatus === 'connected' ? (
                  <>
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    online
                  </>
                ) : connectionStatus === 'connecting' ? (
                  <>
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></span>
                    connecting...
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                    offline
                  </>
                )}
                {otherUserTyping && ' • typing...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-20"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contact Information */}
        {companyInfo && (
          <div className="bg-gray-50 border-b p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contact Information
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {companyInfo.whatsapp && (
                <a
                  href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 bg-white rounded-lg border hover:bg-green-50 hover:border-green-200 transition-colors group"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 group-hover:bg-green-200 transition-colors">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{companyInfo.whatsapp}</p>
                  </div>
                </a>
              )}

              {companyInfo.email && (
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="flex items-center p-2 bg-white rounded-lg border hover:bg-blue-50 hover:border-blue-200 transition-colors group"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{companyInfo.email}</p>
                  </div>
                </a>
              )}

              {companyInfo.website && (
                <a
                  href={companyInfo.website.startsWith('http') ? companyInfo.website : `https://${companyInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 bg-white rounded-lg border hover:bg-purple-50 hover:border-purple-200 transition-colors group"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2 group-hover:bg-purple-200 transition-colors">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Website</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{companyInfo.website}</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="text-center text-gray-500">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender._id === user?._id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      isOwnMessage
                        ? 'bg-green-100 text-gray-900'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm font-medium">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwnMessage ? 'text-green-600' : 'text-gray-500'}`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          {otherUserTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder={connectionStatus === 'connected' ? "Type a message..." : "Connecting..."}
              disabled={connectionStatus !== 'connected'}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || connectionStatus !== 'connected'}
              className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}