'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Professional {
  _id: string;
  name: string;
  email: string;
  description: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  user: { name: string; email: string };
}

export default function AdminProfessionalsPage() {
  const { user } = useAuth();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadProfessionals();
    }
  }, [user]);

  const loadProfessionals = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/professionals');
      setProfessionals(response.data);
    } catch (error) {
      console.error('Error loading professionals:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyProfessional = async (id: string, name: string) => {
    try {
      await axios.put(`/api/professionals/${id}/verify`);
      loadProfessionals(); // Reload professionals
      alert(`Professional "${name}" has been verified successfully!`);
    } catch (error) {
      console.error('Error verifying professional:', error);
      alert('Error verifying professional');
    }
  };

  const deleteProfessional = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete professional "${name}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/admin/professionals/${id}`);
        loadProfessionals(); // Reload professionals
        alert('Professional deleted successfully');
      } catch (error) {
        console.error('Error deleting professional:', error);
        alert('Error deleting professional');
      }
    }
  };

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professional.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professional.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'verified' && professional.isVerified) ||
                         (statusFilter === 'pending' && !professional.isVerified);
    return matchesSearch && matchesStatus;
  });

  if (user?.role !== 'admin') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/admin" className="text-gray-600 hover:text-gray-900">
                  ← Back to Admin Dashboard
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/admin/users" className="text-blue-600 hover:text-blue-800 font-medium">
                  Manage Users
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/admin/companies" className="text-blue-600 hover:text-blue-800 font-medium">
                  Manage Companies
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/admin/projects" className="text-blue-600 hover:text-blue-800 font-medium">
                  Manage Projects
                </Link>
                <span className="text-gray-300">|</span>
                <h1 className="text-2xl font-bold text-gray-900">Professional Management</h1>
              </div>
              <div className="text-sm text-gray-600">
                Total Professionals: {professionals.length}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Professionals
                </label>
                <input
                  type="text"
                  placeholder="Search by name, email, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending Verification</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={loadProfessionals}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Professionals Table */}
          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading professionals...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProfessionals.map((professional) => (
                      <tr key={professional._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{professional.name}</div>
                            <div className="text-sm text-gray-500">{professional.email}</div>
                            <div className="text-sm text-gray-400 truncate max-w-xs">
                              {professional.description || 'No description provided'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-900">{professional.rating.toFixed(1)}</span>
                            </div>
                            <span className="text-sm text-gray-500 ml-2">
                              ({professional.reviewCount} reviews)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            professional.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {professional.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(professional.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => alert(`Professional Details:\n\nCompany: ${professional.name}\nEmail: ${professional.email}\nDescription: ${professional.description || 'N/A'}\nRating: ${professional.rating.toFixed(1)} (${professional.reviewCount} reviews)\nVerified: ${professional.isVerified ? 'Yes' : 'No'}\nAdmin: ${professional.user.name} (${professional.user.email})\nRegistered: ${new Date(professional.createdAt).toLocaleString()}`)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Details
                            </button>
                            {!professional.isVerified && (
                              <button
                                onClick={() => verifyProfessional(professional._id, professional.name)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Verify
                              </button>
                            )}
                            <button
                              onClick={() => deleteProfessional(professional._id, professional.name)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProfessionals.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No professionals found</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search criteria' : 'No professionals registered yet'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 2a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Professionals</p>
                  <p className="text-2xl font-semibold text-gray-900">{professionals.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {professionals.filter(p => p.isVerified).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {professionals.filter(p => !p.isVerified).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {professionals.length > 0
                      ? (professionals.reduce((sum, p) => sum + p.rating, 0) / professionals.length).toFixed(1)
                      : '0.0'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}