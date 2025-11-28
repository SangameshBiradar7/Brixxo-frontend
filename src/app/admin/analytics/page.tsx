'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import axios from 'axios';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalCompanies: number;
    totalProjects: number;
    totalRevenue: number;
    newUsers30Days: number;
  };
  users: {
    total: number;
    homeowners: number;
    companyAdmins: number;
    admins: number;
    newUsers30Days: number;
    monthlyGrowth: Array<{ month: string; users: number }>;
  };
  companies: {
    total: number;
    verified: number;
    unverified: number;
    topCompanies: Array<{ name: string; acceptedProposals: number }>;
  };
  projects: {
    total: number;
    open: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  proposals: {
    total: number;
    accepted: number;
    pending: number;
    rejected: number;
    acceptanceRate: string;
  };
  payments: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
    totalRevenue: number;
  };
  recentActivity: {
    projects: Array<{
      _id: string;
      title: string;
      status: string;
      budget: number;
      createdAt: string;
      user: { name: string };
    }>;
  };
}

export default function AdminAnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  if (user && user.role !== 'admin') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">Only administrators can view analytics.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading analytics...');

      const response = await axios.get('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('✅ Analytics loaded:', response.data);
      setAnalytics(response.data);
    } catch (error: any) {
      console.error('❌ Error loading analytics:', error);
      alert('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
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
                  <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                    Admin Dashboard
                  </Link>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-700">Welcome, {user?.name}</span>
                </div>
              </div>
            </div>
          </nav>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!analytics) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
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
                  <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                    Admin Dashboard
                  </Link>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-700">Welcome, {user?.name}</span>
                </div>
              </div>
            </div>
          </nav>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed to Load Analytics</h2>
              <p className="text-gray-600">Unable to load analytics data. Please try again.</p>
              <button
                onClick={loadAnalytics}
                className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
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
                <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                  Admin Dashboard
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
            <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="mt-2 text-gray-600">
              Comprehensive overview of DreamBuild marketplace performance and user engagement.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">👥</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🏢</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Companies</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalCompanies}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📋</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalProjects}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">💰</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{analytics.overview.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Homeowners</span>
                  <span className="font-semibold">{analytics.users.homeowners}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Company Admins</span>
                  <span className="font-semibold">{analytics.users.companyAdmins}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Administrators</span>
                  <span className="font-semibold">{analytics.users.admins}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600 font-medium">New Users (30 days)</span>
                  <span className="font-semibold text-green-600">{analytics.users.newUsers30Days}</span>
                </div>
              </div>
            </div>

            {/* Company Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Companies</span>
                  <span className="font-semibold">{analytics.companies.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Verified</span>
                  <span className="font-semibold text-green-600">{analytics.companies.verified}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Verification</span>
                  <span className="font-semibold text-yellow-600">{analytics.companies.unverified}</span>
                </div>
              </div>

              {analytics.companies.topCompanies.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Top Performing Companies</h4>
                  <div className="space-y-2">
                    {analytics.companies.topCompanies.slice(0, 3).map((company, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 truncate">{company.name}</span>
                        <span className="font-semibold">{company.acceptedProposals} projects</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Project Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Projects</span>
                  <span className="font-semibold">{analytics.projects.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Open</span>
                  <span className="font-semibold text-blue-600">{analytics.projects.open}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">In Progress</span>
                  <span className="font-semibold text-yellow-600">{analytics.projects.inProgress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-semibold text-green-600">{analytics.projects.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelled</span>
                  <span className="font-semibold text-red-600">{analytics.projects.cancelled}</span>
                </div>
              </div>
            </div>

            {/* Proposal & Payment Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Proposal & Payment Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Proposals</span>
                  <span className="font-semibold">{analytics.proposals.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Acceptance Rate</span>
                  <span className="font-semibold text-green-600">{analytics.proposals.acceptanceRate}%</span>
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Payments</span>
                    <span className="font-semibold">{analytics.payments.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-semibold text-green-600">{analytics.payments.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue</span>
                    <span className="font-semibold text-purple-600">₹{analytics.payments.totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Project Activity</h3>
            {analytics.recentActivity.projects.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentActivity.projects.map((project) => (
                  <div key={project._id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{project.title}</h4>
                      <p className="text-sm text-gray-600">by {project.user.name}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-600">₹{project.budget.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">No recent projects found.</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}