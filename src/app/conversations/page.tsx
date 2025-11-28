'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import ChatModal from '@/components/ChatModal';

interface Conversation {
  conversationId: string;
  otherUser: {
    _id: string;
    name: string;
    email: string;
  };
  company?: {
    _id: string;
    name: string;
    logo?: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    sender: string;
  };
  unreadCount: number;
  totalMessages: number;
}

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

export default function ConversationsPage() {
  const { user } = useAuth();
  const { refreshUnreadCount } = useNotifications();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000');
      setSocket(newSocket);

      // Join user's room
      newSocket.emit('join', user._id);

      // Listen for new messages
      newSocket.on('newMessage', (message: Message) => {
        if (selectedConversation && message.conversationId === selectedConversation.conversationId) {
          setMessages(prev => [...prev, message]);
        }
        // Refresh conversations to update last message
        loadConversations();
      });

      // Listen for typing indicators
      newSocket.on('userTyping', (data: { senderId: string; conversationId: string }) => {
        if (selectedConversation && data.senderId === selectedConversation.otherUser._id && data.conversationId === selectedConversation.conversationId) {
          setOtherUserTyping(true);
        }
      });

      newSocket.on('userStopTyping', (data: { senderId: string; conversationId: string }) => {
        if (selectedConversation && data.senderId === selectedConversation.otherUser._id && data.conversationId === selectedConversation.conversationId) {
          setOtherUserTyping(false);
        }
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user, selectedConversation]);

  // Load conversations
  const loadConversations = async () => {
    try {
      const response = await axios.get('/api/messages/conversations/all');
      setConversations(response.data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
      // Mark conversation as read
      markConversationAsRead();
    }
  }, [selectedConversation]);

  const loadMessages = async () => {
    if (!selectedConversation) return;

    try {
      const response = await axios.get(`/api/messages/conversation/${selectedConversation.conversationId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markConversationAsRead = async () => {
    if (!selectedConversation) return;

    try {
      await axios.put(`/api/messages/conversation/${selectedConversation.conversationId}/read`);
      // Refresh conversations to update unread counts
      loadConversations();
      // Refresh notification count
      refreshUnreadCount();
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !socket || !user || !selectedConversation) return;

    try {
      const messageData = {
        senderId: user._id,
        receiverId: selectedConversation.otherUser._id,
        conversationId: selectedConversation.conversationId,
        content: newMessage.trim()
      };

      socket.emit('sendMessage', messageData);
      setNewMessage('');

      // Stop typing indicator
      socket.emit('stopTyping', {
        senderId: user._id,
        receiverId: selectedConversation.otherUser._id,
        conversationId: selectedConversation.conversationId
      });

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    if (!socket || !user || !selectedConversation) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing indicator
    socket.emit('typing', {
      senderId: user._id,
      receiverId: selectedConversation.otherUser._id,
      conversationId: selectedConversation.conversationId
    });

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      socket?.emit('stopTyping', {
        senderId: user._id,
        receiverId: selectedConversation.otherUser._id,
        conversationId: selectedConversation.conversationId
      });
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view conversations</h1>
          <Link href="/login" className="text-blue-600 hover:text-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Allow both homeowners and company admins to access conversations
  if (user.role !== 'homeowner' && user.role !== 'company_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">Only registered users can access conversations.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md h-[calc(100vh-200px)] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.role === 'company_admin' ? 'Client Messages' : 'Messages'}
              </h2>
              <p className="text-sm text-gray-600">
                {user?.role === 'company_admin'
                  ? `${conversations.length} client conversations`
                  : `${conversations.length} conversations`
                }
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p>
                    {user?.role === 'company_admin'
                      ? 'No client messages yet'
                      : 'No conversations yet'
                    }
                  </p>
                  <p className="text-sm mt-1">
                    {user?.role === 'company_admin'
                      ? 'Client inquiries will appear here'
                      : 'Start chatting with companies!'
                    }
                  </p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.conversationId}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?.conversationId === conversation.conversationId ? 'bg-blue-50 border-r-2 border-r-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        {conversation.company?.logo ? (
                          <img
                            src={conversation.company.logo}
                            alt={conversation.company.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-slate-600 font-semibold">
                            {conversation.otherUser.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {conversation.company?.name || conversation.otherUser.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatDate(conversation.lastMessage.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="flex items-center mt-1">
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                      {selectedConversation.company?.logo ? (
                        <img
                          src={selectedConversation.company.logo}
                          alt={selectedConversation.company.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-slate-600 font-semibold">
                          {selectedConversation.otherUser.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedConversation.company?.name || selectedConversation.otherUser.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {otherUserTyping ? 'typing...' : 'online'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwnMessage = message.sender._id === user._id;
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwnMessage
                                ? 'bg-blue-100 text-gray-900'
                                : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            <p className="text-sm font-medium">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-600' : 'text-gray-500'}`}>
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
                <div className="border-t border-gray-200 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.512 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p>Choose a conversation from the list to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}