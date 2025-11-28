'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';
import {
  Home,
  FileText,
  MessageSquare,
  Bell,
  User,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Star,
  Clock,
  CheckCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface NotificationData {
  message: string;
  type: string;
  createdAt: string;
}

function HomeownerDashboardContent() {
  const { user, logout } = useAuth();
  const { notificationCount } = useNotifications();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [overviewStats, setOverviewStats] = useState<Array<{
    title: string;
    value: string;
    icon: React.ReactNode;
    change: string;
  }>>([]);
  const [requirements, setRequirements] = useState<Array<{
    _id: string;
    title: string;
    createdAt: string;
    status: string;
    quotes?: Array<{
      _id: string;
      amount?: string;
      timeline?: string;
      company?: { name: string; rating?: number };
    }>;
  }>>([]);
  const [quotes, setQuotes] = useState<Array<{
    _id: string;
    companyName?: string;
    amount?: string;
    timeline?: string;
    rating?: number;
    company?: {
      name: string;
      rating?: number;
    };
  }>>([]);
  const [recentActivities, setRecentActivities] = useState<Array<{
    message: string;
    time: string;
    type: string;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Handle URL parameters for tab switching
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['dashboard', 'requirements', 'quotes', 'messages'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Redirect non-homeowners to their appropriate dashboard
  useEffect(() => {
    if (!user) return;

    if (user.role !== 'homeowner') {
      router.push('/dashboard/professional');
    }
  }, [user, router]);

  // Role-based dashboard content
  const getDashboardTitle = () => {
    return "Homeowner Dashboard";
  };

  const getDashboardSubtitle = () => {
    return "Manage your construction requirements and connect with professionals";
  };

  // Fetch real-time dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user || user.role !== 'homeowner') return;

      try {
        setLoading(true);

        // Fetch user's requirements
        const requirementsResponse = await axios.get('/api/requirements/my', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const userRequirements = requirementsResponse.data || [];
        setRequirements(userRequirements);

        // Calculate active requirements count
        const activeRequirementsCount = userRequirements.length;

        // Calculate total quotes received across all requirements
        let totalQuotesCount = 0;
        const allQuotes = [];

        for (const requirement of userRequirements) {
          if (requirement.quotes && Array.isArray(requirement.quotes)) {
            totalQuotesCount += requirement.quotes.length;
            allQuotes.push(...requirement.quotes);
          }
        }

        setQuotes(allQuotes);

        // Fetch recent notifications/activities
        setLoadingActivities(true);
        try {
          const notificationsResponse = await axios.get('/api/notifications?limit=5', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          const notifications = notificationsResponse.data.notifications || [];
          const activities = notifications.map((notification: NotificationData) => ({
            message: notification.message,
            time: formatTimeAgo(new Date(notification.createdAt)),
            type: getActivityType(notification.type)
          }));

          setRecentActivities(activities);
        } catch (error) {
          console.error('Error fetching notifications:', error);
          setRecentActivities([]);
        } finally {
          setLoadingActivities(false);
        }

        // Update overview stats with real data
        setOverviewStats([
          {
            title: 'Active Requirements',
            value: activeRequirementsCount.toString(),
            icon: <FileText className="w-6 h-6" />,
            change: activeRequirementsCount > 0 ? 'Active projects' : 'No active projects'
          },
          {
            title: 'Quotes Received',
            value: totalQuotesCount.toString(),
            icon: <MessageSquare className="w-6 h-6" />,
            change: totalQuotesCount > 0 ? `${totalQuotesCount} quotes waiting` : 'No quotes yet'
          }
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set default empty state
        setOverviewStats([
          {
            title: 'Active Requirements',
            value: '0',
            icon: <FileText className="w-6 h-6" />,
            change: 'No active projects'
          },
          {
            title: 'Quotes Received',
            value: '0',
            icon: <MessageSquare className="w-6 h-6" />,
            change: 'No quotes yet'
          }
        ]);
        setRequirements([]);
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownOpen && !(event.target as Element).closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  // Real data will be loaded from API in useEffect

  const filteredRequirements = requirements.filter(req =>
    req.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Helper function to get activity type
  const getActivityType = (type: string) => {
    switch (type) {
      case 'quote_submitted':
        return 'quote';
      case 'requirement_status_changed':
        return 'progress';
      case 'inquiry_response':
        return 'response';
      default:
        return 'info';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Shortlisted': return 'text-green-600 bg-green-50';
      case 'In Review': return 'text-blue-600 bg-blue-50';
      case 'Pending': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { id: 'requirements', label: 'My Requirements', icon: <FileText className="w-5 h-5" /> },
    { id: 'quotes', label: 'Quotes', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-5 h-5" />, href: '/dashboard/messages' }
  ];

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
                {/* Submit Requirement Button */}
                <Link
                  href="/dashboard/requirements/submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Submit Requirement
                </Link>

                {/* Notifications */}
                <button className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                  <Bell className="w-5 h-5" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                        Welcome, {user?.name}
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {navigation.map((item) => (
                item.href ? (
                  <Link
                    key={item.id}
                    href={item.href}
                    className="flex items-center space-x-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === item.id
                        ? 'border-teal-600 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                )
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Welcome */}
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-poppins">{getDashboardTitle()}</h1>
                <p className="text-slate-600 mt-1">{getDashboardSubtitle()}</p>
              </div>

              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {overviewStats.map((stat, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                      </div>
                      <div className="text-gray-400">
                        {stat.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg border-2 border-gray-300 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {loadingActivities ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                    </div>
                  ) : recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: activity.type === 'quote' ? '#dcfce7' :
                                         activity.type === 'progress' ? '#dbeafe' :
                                         '#fef3c7'
                        }}
                      >
                        {activity.type === 'quote' ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : activity.type === 'progress' ? (
                          <Clock className="w-4 h-4 text-blue-600" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{activity.message}</p>
                        <p className="text-xs font-medium text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-600">No recent activity</p>
                      <p className="text-xs text-gray-500 mt-1">Your recent activities will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Requirements</h1>
                <Link
                  href="/dashboard/requirements/submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  New Requirement
                </Link>
              </div>

              {/* Search */}
              <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Search requirements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-700 font-medium bg-white"
                  />
                </div>
              </div>

              {/* Requirements Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirement</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quotes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRequirements.map((req) => (
                      <tr key={req._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{req.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(req.status)}`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {req.quotes?.length || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button className="text-teal-600 hover:text-teal-900">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'quotes' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
                <p className="text-gray-600 mt-1">Compare and choose the best offer for your project</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {quotes.length > 0 ? quotes.map((quote, index) => (
                  <div
                    key={quote._id}
                    className={`bg-white rounded-lg border p-6 ${
                      index === 0 ? 'border-teal-300 ring-2 ring-teal-100' : 'border-gray-200'
                    }`}
                  >
                    {index === 0 && (
                      <div className="bg-teal-600 text-white text-xs font-medium px-2 py-1 rounded mb-4 inline-block">
                        Best Value
                      </div>
                    )}

                    <div className="flex items-center space-x-3 mb-4">
                      <div className="text-2xl">🏗️</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{quote.company?.name || 'Company'}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{quote.company?.rating || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Quote Amount</span>
                        <span className="font-semibold text-gray-900">{quote.amount || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Timeline</span>
                        <span className="font-semibold text-gray-900">{quote.timeline || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                        Accept Quote
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                        Message
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No quotes yet</h3>
                    <p className="text-gray-600">Quotes from companies will appear here once they respond to your requirements</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-600 mt-1">Communicate with your service providers</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 h-96 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
                  <p className="text-gray-600">Your conversations with companies will appear here</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function HomeownerDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>}>
      <HomeownerDashboardContent />
    </Suspense>
  );
}