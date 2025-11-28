'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import DashboardHeader from '@/components/DashboardHeader';

interface Requirement {
  _id: string;
  title: string;
  description: string;
  budget: number;
  budgetRange: string;
  location: string;
  buildingType: string;
  status: string;
  priority: string;
  timeline: {
    startDate: string;
    endDate: string;
  };
  quotes: any[];
  createdAt: string;
}

export default function RequirementsPage() {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        if (user?.role === 'homeowner') {
          const response = await axios.get('/api/requirements/my');
          setRequirements(response.data);
        } else if (user?.role === 'professional' || user?.role === 'company_admin') {
          const response = await axios.get('/api/requirements/open');
          setRequirements(response.data.requirements || []);
        }
      } catch (error) {
        console.error('Error fetching requirements:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchRequirements();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'reviewing_quotes': return 'bg-yellow-100 text-yellow-800';
      case 'company_selected': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  if (user?.role !== 'homeowner' && user?.role !== 'professional' && user?.role !== 'company_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.role === 'homeowner' ? 'My Project Requirements' : 'Available Requirements'}
            </h1>
            <p className="text-gray-600 mt-2">
              {user?.role === 'homeowner'
                ? 'Manage your project requirements and review quotes from companies and professionals'
                : 'Browse open project requirements and submit competitive quotes'
              }
            </p>
          </div>
          {user?.role === 'homeowner' && (
            <Link
              href="/dashboard/requirements/submit"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Requirement
            </Link>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your requirements...</p>
          </div>
        ) : requirements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {user?.role === 'homeowner' ? 'No Requirements Yet' : 'No Open Requirements'}
            </h3>
            <p className="text-gray-600 mb-6">
              {user?.role === 'homeowner'
                ? 'Start by submitting your first project requirement to get quotes from companies and professionals.'
                : 'There are currently no open project requirements. Check back later for new opportunities.'
              }
            </p>
            {user?.role === 'homeowner' && (
              <Link
                href="/dashboard/requirements/submit"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Your First Requirement
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requirements.map((requirement) => (
              <div key={requirement._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{requirement.title}</h3>
                      <p className="text-gray-600 line-clamp-2">{requirement.description}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                        {requirement.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(requirement.priority)}`}>
                        {requirement.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Budget</span>
                      <p className="font-semibold text-gray-900">{formatCurrency(requirement.budget)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Type</span>
                      <p className="font-semibold text-gray-900">{requirement.buildingType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Location</span>
                      <p className="font-semibold text-gray-900">{requirement.location}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Quotes Received</span>
                      <p className="font-semibold text-gray-900">{requirement.quotes?.length || 0}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Submitted on {new Date(requirement.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-3">
                      {user?.role === 'homeowner' ? (
                        <>
                          {requirement.quotes && requirement.quotes.length > 0 && (
                            <Link
                              href={`/dashboard/requirements/${requirement._id}/quotes`}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              View Quotes ({requirement.quotes.length})
                            </Link>
                          )}
                          <Link
                            href={`/dashboard/requirements/${requirement._id}`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/dashboard/quotes/submit/${requirement._id}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Submit Quote
                          </Link>
                          <Link
                            href={`/dashboard/requirements/${requirement._id}/public`}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}