'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
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
  user: {
    _id: string;
    name: string;
    email: string;
  };
  project: {
    _id: string;
    title: string;
    location: string;
    budget: number;
    images: string[];
  };
}

export default function InquiriesPage() {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [showNotesForm, setShowNotesForm] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatInquiry, setChatInquiry] = useState<Inquiry | null>(null);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/inquiries/company', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: { status: filter === 'all' ? undefined : filter }
      });
      setInquiries(response.data.inquiries || []);
    } catch (error: any) {
      console.error('Error loading inquiries:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`Failed to load inquiries: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'company_admin') {
      loadInquiries();
    } else {
      setLoading(false);
    }
  }, [user, filter]);

  const updateInquiryStatus = async (inquiryId: string, status: string) => {
    try {
      setUpdatingStatus(inquiryId);
      const response = await axios.put(`/api/inquiries/${inquiryId}/status`, {
        status,
        notes: notes || undefined
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      setInquiries(prev => prev.map(inquiry =>
        inquiry._id === inquiryId ? response.data.inquiry : inquiry
      ));

      setShowNotesForm(null);
      setNotes('');
      alert('Inquiry status updated successfully!');
    } catch (error: any) {
      console.error('Error updating inquiry status:', error);
      alert('Failed to update inquiry status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const openChat = (inquiry: Inquiry) => {
    setChatInquiry(inquiry);
    setShowChat(true);
  };

  const generateConversationId = (userId: string, companyId: string, inquiryId: string) => {
    return `conv_${userId}_${companyId}_${inquiryId}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  // Check if user is company_admin
  if (user && user.role !== 'company_admin') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">Only construction companies can view inquiries.</p>
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
            conversationId={generateConversationId(chatInquiry.user._id, user?._id || '', chatInquiry._id)}
            otherUser={{
              _id: chatInquiry.user._id,
              name: chatInquiry.name
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
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  DreamBuild
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-700 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <span className="text-gray-500">|</span>
                <span className="text-gray-700">Welcome, {user?.name}</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Customer Inquiries</h1>
            <p className="mt-2 text-gray-600">
              Manage inquiries from potential clients who contacted you through your project listings.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex gap-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              >
                <option value="all">All Inquiries</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
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
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
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
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
              <p className="mt-4 text-gray-600">Loading inquiries...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No inquiries yet</h3>
              <p className="text-gray-600">When clients contact you through your project listings, their inquiries will appear here.</p>
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
                            <span className="text-xl">👤</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{inquiry.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-slate-600">
                              <span>{inquiry.email}</span>
                              {inquiry.phone && <span>{inquiry.phone}</span>}
                              <span className="flex items-center">
                                <span className="mr-1">{getContactIcon(inquiry.preferredContact)}</span>
                                {inquiry.preferredContact}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                            {inquiry.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500 ml-4">
                            {getTimeAgo(inquiry.createdAt)}
                          </span>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Project Inquiry</h4>
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
                          <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{inquiry.message}</p>
                        </div>

                        {inquiry.notes && (
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">Your Notes</h4>
                            <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">{inquiry.notes}</p>
                          </div>
                        )}
                      </div>

                      {/* Action Panel */}
                      <div className="ml-8 flex flex-col space-y-3 min-w-[200px]">
                        <div className="bg-slate-50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-3">Update Status</h4>

                          <div className="space-y-2">
                            {inquiry.status !== 'pending' && (
                              <button
                                onClick={() => updateInquiryStatus(inquiry._id, 'pending')}
                                disabled={updatingStatus === inquiry._id}
                                className="w-full text-left px-3 py-2 text-sm text-yellow-700 bg-yellow-50 hover:bg-yellow-100 rounded disabled:opacity-50"
                              >
                                Mark as Pending
                              </button>
                            )}

                            {inquiry.status !== 'in_progress' && (
                              <button
                                onClick={() => updateInquiryStatus(inquiry._id, 'in_progress')}
                                disabled={updatingStatus === inquiry._id}
                                className="w-full text-left px-3 py-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded disabled:opacity-50"
                              >
                                Mark as In Progress
                              </button>
                            )}

                            {inquiry.status !== 'completed' && (
                              <button
                                onClick={() => updateInquiryStatus(inquiry._id, 'completed')}
                                disabled={updatingStatus === inquiry._id}
                                className="w-full text-left px-3 py-2 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded disabled:opacity-50"
                              >
                                Mark as Completed
                              </button>
                            )}

                            {inquiry.status !== 'cancelled' && (
                              <button
                                onClick={() => updateInquiryStatus(inquiry._id, 'cancelled')}
                                disabled={updatingStatus === inquiry._id}
                                className="w-full text-left px-3 py-2 text-sm text-red-700 bg-red-50 hover:bg-red-100 rounded disabled:opacity-50"
                              >
                                Mark as Cancelled
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => setShowNotesForm(showNotesForm === inquiry._id ? null : inquiry._id)}
                            className="w-full mt-3 px-3 py-2 text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded"
                          >
                            {showNotesForm === inquiry._id ? 'Hide Notes' : 'Add Notes'}
                          </button>

                          <button
                            onClick={() => openChat(inquiry)}
                            className="w-full mt-3 px-3 py-2 text-sm text-white bg-green-600 hover:bg-green-700 rounded flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Start Chat
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Notes Form */}
                    {showNotesForm === inquiry._id && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Add Notes</h4>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add internal notes about this inquiry..."
                          rows={3}
                          className="w-full px-3 py-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="flex justify-end space-x-2 mt-3">
                          <button
                            onClick={() => {
                              setShowNotesForm(null);
                              setNotes('');
                            }}
                            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => updateInquiryStatus(inquiry._id, inquiry.status)}
                            disabled={updatingStatus === inquiry._id}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                          >
                            {updatingStatus === inquiry._id ? 'Saving...' : 'Save Notes'}
                          </button>
                        </div>
                      </div>
                    )}
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