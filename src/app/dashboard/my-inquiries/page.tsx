'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/DashboardHeader';
import ChatModal from '@/components/ChatModal';
import axios from 'axios';
import Link from 'next/link';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredContact: 'call' | 'email' | 'whatsapp';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
  company: {
    _id: string;
    name: string;
    email: string;
    logo?: string;
  };
  project: {
    _id: string;
    title: string;
    location: string;
    budget: number;
    images: string[];
  };
}

export default function MyInquiriesPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [chatInquiry, setChatInquiry] = useState<Inquiry | null>(null);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/inquiries/my', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setInquiries(response.data || []);
    } catch (error: any) {
      console.error('Error loading inquiries:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Failed to load inquiries: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'homeowner') {
      loadInquiries();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'in_progress': return '🔄';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  const getContactIcon = (method: string) => {
    switch (method) {
      case 'call': return '📞';
      case 'whatsapp': return '💬';
      case 'email': return '✉️';
      default: return '📧';
    }
  };

  const formatBudget = (budget: number) => {
    if (budget >= 10000000) {
      return `₹${(budget / 10000000).toFixed(1)}Cr`;
    } else if (budget >= 100000) {
      return `₹${(budget / 100000).toFixed(1)}L`;
    }
    return `₹${budget.toLocaleString()}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const openChat = (inquiry: Inquiry) => {
    setChatInquiry(inquiry);
    setShowChat(true);
  };

  const generateConversationId = (userId: string, companyId: string, inquiryId: string) => {
    return `conv_${userId}_${companyId}_${inquiryId}`;
  };

  // Check if user is homeowner
  if (user && user.role !== 'homeowner') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">Only homeowners can view their inquiries.</p>
          </div>
        </div>
  
        {/* Chat Modal */}
        {chatInquiry && (
          <ChatModal
            isOpen={showChat}
            onClose={() => {
              setShowChat(false);
              setChatInquiry(null);
            }}
            conversationId={generateConversationId(user?._id || '', chatInquiry.company._id, chatInquiry._id)}
            otherUser={{
              _id: chatInquiry.company._id,
              name: chatInquiry.company.name
            }}
            inquiryId={chatInquiry._id}
          />
        )}
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Inquiries</h1>
            <p className="mt-2 text-gray-600">
              Track all the construction companies you've contacted and their responses.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                  <p className="text-2xl font-bold text-gray-900">{inquiries.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <span className="text-lg">⏳</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inquiries.filter(i => i.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <span className="text-lg">🔄</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inquiries.filter(i => i.status === 'in_progress').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <span className="text-lg">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {inquiries.filter(i => i.status === 'completed').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiries List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your inquiries...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries yet</h3>
              <p className="text-gray-600 mb-6">You haven't contacted any construction companies yet.</p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors"
              >
                Browse Projects
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {inquiries.map((inquiry) => (
                <div key={inquiry._id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                            {inquiry.company.logo ? (
                              <img
                                src={inquiry.company.logo}
                                alt={inquiry.company.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <span className="text-xl">🏗️</span>
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{inquiry.company.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <span>{inquiry.company.email}</span>
                              <span className="flex items-center">
                                <span className="mr-1">{getContactIcon(inquiry.preferredContact)}</span>
                                Preferred: {inquiry.preferredContact}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(inquiry.status)}`}>
                            <span className="mr-1">{getStatusIcon(inquiry.status)}</span>
                            {inquiry.status.replace('_', ' ').toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-500 ml-4">
                            Sent {getTimeAgo(inquiry.createdAt)}
                          </span>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Project</h4>
                          <Link
                            href={`/projects/${inquiry.project._id}`}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {inquiry.project.title}
                          </Link>
                          <div className="text-sm text-gray-600 mt-1">
                            📍 {inquiry.project.location} • 💰 {formatBudget(inquiry.project.budget)}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Your Message</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{inquiry.message}</p>
                        </div>

                        {inquiry.notes && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Company Notes</h4>
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                              <p className="text-blue-800">{inquiry.notes}</p>
                            </div>
                          </div>
                        )}

                        {/* Status Messages */}
                        <div className="mt-4">
                          {inquiry.status === 'pending' && (
                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                              <p className="text-yellow-800 text-sm">
                                ⏳ Your inquiry is pending review by the company. They will contact you soon.
                              </p>
                            </div>
                          )}

                          {inquiry.status === 'in_progress' && (
                            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                              <p className="text-blue-800 text-sm">
                                🔄 The company is actively working on your inquiry. Expect to hear from them soon.
                              </p>
                            </div>
                          )}

                          {inquiry.status === 'completed' && (
                            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                              <p className="text-green-800 text-sm">
                                ✅ Your inquiry has been completed. Check the company notes above for details.
                              </p>
                            </div>
                          )}

                          {inquiry.status === 'cancelled' && (
                            <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                              <p className="text-red-800 text-sm">
                                ❌ This inquiry has been cancelled. Check the company notes for more information.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Chat Button */}
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => openChat(inquiry)}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chat with Company
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}