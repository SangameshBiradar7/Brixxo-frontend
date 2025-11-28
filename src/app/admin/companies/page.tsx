'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface Company {
  _id: string;
  name: string;
  description: string;
  website?: string;
  phone?: string;
  address?: string;
  isVerified: boolean;
  createdAt: string;
  admin: {
    name: string;
    email: string;
  };
  pastProjects: string[];
}

export default function AdminCompaniesPage() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadCompanies();
    }
  }, [user]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/companies/admin/all');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyCompany = async (id: string, companyName: string) => {
    try {
      await axios.put(`/api/companies/admin/verify/${id}`);
      loadCompanies(); // Reload companies
      alert(`Company "${companyName}" has been verified successfully`);
    } catch (error) {
      console.error('Error verifying company:', error);
      alert('Error verifying company');
    }
  };

  const deleteCompany = async (id: string, companyName: string) => {
    if (confirm(`Are you sure you want to delete company "${companyName}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`/api/companies/${id}`);
        loadCompanies(); // Reload companies
        alert('Company deleted successfully');
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Error deleting company');
      }
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.admin.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'verified' && company.isVerified) ||
                         (statusFilter === 'pending' && !company.isVerified);
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
                <Link href="/admin/projects" className="text-blue-600 hover:text-blue-800 font-medium">
                  Manage Projects
                </Link>
                <span className="text-gray-300">|</span>
                <Link href="/admin/professionals" className="text-blue-600 hover:text-blue-800 font-medium">
                  Manage Professionals
                </Link>
                <span className="text-gray-300">|</span>
                <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
              </div>
              <div className="text-sm text-gray-600">
                Total Companies: {companies.length}
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
                  Search Companies
                </label>
                <input
                  type="text"
                  placeholder="Search by name, description, or admin..."
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
                  <option value="all">All Companies</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending Verification</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={loadCompanies}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Companies Table */}
          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading companies...</p>
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
                        Admin
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Projects
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
                    {filteredCompanies.map((company) => (
                      <tr key={company._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{company.name}</div>
                            <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{company.description}</div>
                            {company.website && (
                              <a href={company.website} target="_blank" rel="noopener noreferrer"
                                 className="text-sm text-blue-600 hover:text-blue-800">
                                {company.website}
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{company.admin.name}</div>
                            <div className="text-sm text-gray-500">{company.admin.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            company.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {company.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.pastProjects?.length || 0} projects
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(company.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => alert(`Company Details:\n\nName: ${company.name}\nDescription: ${company.description}\nAdmin: ${company.admin.name} (${company.admin.email})\nWebsite: ${company.website || 'N/A'}\nPhone: ${company.phone || 'N/A'}\nAddress: ${company.address || 'N/A'}\nVerified: ${company.isVerified ? 'Yes' : 'No'}\nProjects: ${company.pastProjects?.length || 0}\nRegistered: ${new Date(company.createdAt).toLocaleString()}`)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Details
                            </button>
                            {!company.isVerified && (
                              <button
                                onClick={() => verifyCompany(company._id, company.name)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Verify
                              </button>
                            )}
                            <button
                              onClick={() => deleteCompany(company._id, company.name)}
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

              {filteredCompanies.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search criteria' : 'No companies registered yet'}
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
                  <p className="text-sm font-medium text-gray-600">Total Companies</p>
                  <p className="text-2xl font-semibold text-gray-900">{companies.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Verified Companies</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {companies.filter(c => c.isVerified).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Verification</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {companies.filter(c => !c.isVerified).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {companies.reduce((total, company) => total + (company.pastProjects?.length || 0), 0)}
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