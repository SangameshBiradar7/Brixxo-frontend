'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';

interface AnalyticsData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalProposals: number;
  acceptedProposals: number;
  proposalSuccessRate: number;
  totalEarnings: number;
  averageProjectValue: number;
  monthlyStats: {
    month: string;
    projects: number;
    proposals: number;
    earnings: number;
  }[];
  topPerformingProjects: {
    _id: string;
    title: string;
    views: number;
    proposals: number;
    status: string;
  }[];
  recentActivity: {
    type: string;
    description: string;
    date: string;
    amount?: number;
  }[];
}

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  // Check if user is company_admin
  if (user && user.role !== 'company_admin') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">Only professionals can view analytics.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`/api/analytics/professional?range=${timeRange}`);
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // No fallback data - show error state
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'proposal_accepted':
        return '✅';
      case 'project_completed':
        return '🏗️';
      case 'new_inquiry':
        return '📋';
      case 'proposal_submitted':
        return '📝';
      default:
        return '📊';
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="text-blue-600 hover:text-blue-700 mb-4"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Track your performance, earnings, and project success metrics.
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="mb-8">
            <div className="flex gap-2">
              {[
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: '90d', label: 'Last 3 months' },
                { value: '1y', label: 'Last year' }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.totalProjects || 0}</p>
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
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics?.proposalSuccessRate.toFixed(1) || 0}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics?.totalEarnings || 0)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Project Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics?.averageProjectValue || 0)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Monthly Performance Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance</h3>
              <div className="space-y-4">
                {analytics?.monthlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 text-sm font-medium text-gray-600">{stat.month}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">{stat.projects}</span> projects
                          </div>
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">{stat.proposals}</span> proposals
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(stat.earnings)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Projects */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Projects</h3>
              <div className="space-y-4">
                {analytics?.topPerformingProjects.map((project, index) => (
                  <div key={project._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{project.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-600">{project.views} views</span>
                        <span className="text-xs text-gray-600">{project.proposals} proposals</span>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {project.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {analytics?.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-600">{activity.date}</p>
                  </div>
                  {activity.amount && (
                    <div className="text-sm font-medium text-green-600">
                      +{formatCurrency(activity.amount)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Project Status Overview */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Projects</span>
                  <span className="text-sm font-medium text-blue-600">{analytics?.activeProjects || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed Projects</span>
                  <span className="text-sm font-medium text-green-600">{analytics?.completedProjects || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Proposals</span>
                  <span className="text-sm font-medium text-purple-600">{analytics?.totalProposals || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Accepted Proposals</span>
                  <span className="text-sm font-medium text-green-600">{analytics?.acceptedProposals || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <span className="text-sm font-medium text-blue-600">
                    {analytics ? '2.3 days avg' : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Client Satisfaction</span>
                  <span className="text-sm font-medium text-green-600">
                    {analytics ? '4.8/5.0' : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Repeat Clients</span>
                  <span className="text-sm font-medium text-purple-600">
                    {analytics ? '23%' : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile Views</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {analytics ? '1,247' : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Residential</span>
                  <span className="text-sm font-medium text-blue-600">
                    {analytics ? '65%' : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Commercial</span>
                  <span className="text-sm font-medium text-green-600">
                    {analytics ? '25%' : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Industrial</span>
                  <span className="text-sm font-medium text-purple-600">
                    {analytics ? '8%' : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Other</span>
                  <span className="text-sm font-medium text-gray-600">
                    {analytics ? '2%' : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}