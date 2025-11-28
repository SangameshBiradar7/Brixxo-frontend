'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';
import {
  Send,
  MessageSquare,
  User,
  Search,
  ChevronLeft,
  MoreVertical,
  Phone,
  Mail
} from 'lucide-react';

interface Conversation {
  _id: string;
  participants: Array<{
    _id: string;
    name: string;
    role: string;
  }>;
  lastMessage?: {
    content: string;
    sender: string;
    timestamp: Date;
  };
  unreadCount: number;
  updatedAt: Date;
}

interface Message {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    name: string;
    role: string;
  };
  content: string;
  timestamp: Date;
  read: boolean;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get('/api/conversations', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setConversations(response.data.conversations || []);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchConversations();
    }
  }, [user]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`/api/conversations/${selectedConversation._id}/messages`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          setMessages(response.data.messages || []);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const response = await axios.post(`/api/conversations/${selectedConversation._id}/messages`, {
        content: newMessage.trim()
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Add the new message to the list
      setMessages(prev => [...prev, response.data.message]);
      setNewMessage('');

      // Update the conversation's last message
      setConversations(prev => prev.map(conv =>
        conv._id === selectedConversation._id
          ? { ...conv, lastMessage: response.data.message, updatedAt: new Date() }
          : conv
      ));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find(p => p._id !== user?._id);
  };

  const getConversationTitle = (conversation: Conversation) => {
    const otherParticipant = getOtherParticipant(conversation);
    return otherParticipant ? `${otherParticipant.name} (${otherParticipant.role})` : 'Unknown';
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-teal-600 transition-colors">
                  BRIXXO
                </Link>
              </div>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  href="/"
                  className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/projects"
                  className="text-gray-700 hover:text-teal-600 font-medium transition-colors"
                >
                  Projects
                </Link>
              </nav>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md h-[calc(100vh-12rem)] flex">
            {/* Conversations Sidebar */}
            <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                <p className="text-sm text-gray-600 mt-1">Communicate with your contacts</p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.length > 0 ? (
                  conversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?._id === conversation._id ? 'bg-teal-50 border-l-4 border-l-teal-500' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {getConversationTitle(conversation)}
                            </h3>
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatTime(new Date(conversation.lastMessage.timestamp))}
                              </span>
                            )}
                          </div>
                          {conversation.lastMessage ? (
                            <p className="text-sm text-gray-600 truncate mt-1">
                              {conversation.lastMessage.content}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400 italic mt-1">
                              No messages yet
                            </p>
                          )}
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
                    <p className="text-gray-600 text-sm">
                      Start a conversation by responding to quotes or contacting professionals
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="hidden md:flex flex-col flex-1">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {getConversationTitle(selectedConversation)}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {getOtherParticipant(selectedConversation)?.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.sender._id === user?._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender._id === user?._id
                              ? 'bg-teal-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender._id === user?._id ? 'text-teal-100' : 'text-gray-500'
                          }`}>
                            {formatTime(new Date(message.timestamp))}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        disabled={sending}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600 text-sm">Choose a conversation from the sidebar to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}