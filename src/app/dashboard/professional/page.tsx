'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CompanyManagement from '@/components/CompanyManagement';
import ProjectManagement from '@/components/ProjectManagement';
import PortfolioShowcase from '@/components/PortfolioShowcase';
import {
  Building2,
  FolderOpen,
  MessageSquare,
  LogOut,
  Plus,
  Briefcase,
  Star,
  Eye,
  TrendingUp,
  ChevronDown,
  Users,
  Wrench,
  Palette,
  Ruler,
  Home,
  FileText,
  BarChart3
} from 'lucide-react';
import axios from 'axios';

interface Company {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  services: string[];
  rating: number;
  isVerified: boolean;
}

interface Project {
  _id: string;
  title: string;
  status: string;
  isFeatured: boolean;
  images: string[];
  views?: number;
  createdAt: string;
}

interface DashboardStats {
  companies: number;
  projects: number;
  featuredProjects: number;
  totalViews: number;
}

interface NotificationResponse {
  message: string;
  type: string;
  createdAt: string;
}

export default function ProfessionalDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    companies: 0,
    projects: 0,
    featuredProjects: 0,
    totalViews: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'projects' | 'portfolio' | 'messages'>('overview');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if user has professional access
    if (!['contractor', 'architect', 'interior-designer', 'renovator', 'professional', 'company_admin'].includes(user.role)) {
      router.push('/dashboard');
      return;
    }

    loadDashboardData();
  }, [user, router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load companies
      const companiesResponse = await axios.get('/api/professional-companies', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCompanies(companiesResponse.data);

      // Load projects
      const projectsResponse = await axios.get('/api/professional-projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProjects(projectsResponse.data);

      // Calculate stats
      const featuredProjects = projectsResponse.data.filter((p: Project) => p.isFeatured).length;
      const totalViews = projectsResponse.data.reduce((sum: number, p: Project) => sum + (p.views || 0), 0);

      setStats({
        companies: companiesResponse.data.length,
        projects: projectsResponse.data.length,
        featuredProjects,
        totalViews
      });

    } catch (error: unknown) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

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

  // Role-specific content
  const getRoleConfig = () => {
    switch (user?.role) {
      case 'contractor':
        return {
          title: 'Contractor Dashboard',
          subtitle: 'Manage construction projects, oversee workers, and handle client relationships',
          icon: Building2,
          color: 'blue',
          stats: [
            { label: 'Active Projects', value: stats.projects, icon: FolderOpen, color: 'blue' },
            { label: 'Companies', value: stats.companies, icon: Building2, color: 'green' },
            { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'purple' },
            { label: 'Featured Work', value: stats.featuredProjects, icon: Star, color: 'yellow' }
          ],
          quickActions: [
            { label: 'Create Company', icon: Plus, action: () => setActiveTab('companies') },
            { label: 'Add Project', icon: FolderOpen, action: () => setActiveTab('projects') },
            { label: 'Manage Portfolio', icon: Briefcase, action: () => setActiveTab('portfolio') }
          ]
        };
      case 'interior-designer':
        return {
          title: 'Interior Designer Dashboard',
          subtitle: 'Create stunning designs, showcase your portfolio, and connect with clients',
          icon: Palette,
          color: 'purple',
          stats: [
            { label: 'Design Projects', value: stats.projects, icon: Palette, color: 'purple' },
            { label: 'Portfolio Items', value: stats.companies, icon: Briefcase, color: 'pink' },
            { label: 'Profile Views', value: stats.totalViews, icon: Eye, color: 'blue' },
            { label: 'Featured Designs', value: stats.featuredProjects, icon: Star, color: 'yellow' }
          ],
          quickActions: [
            { label: 'Add New Design', icon: Plus, action: () => setActiveTab('projects') },
            { label: 'Showcase Portfolio', icon: Briefcase, action: () => setActiveTab('portfolio') },
            { label: 'View Clients', icon: Users, action: () => setActiveTab('messages') }
          ]
        };
      case 'renovator':
        return {
          title: 'Renovator Dashboard',
          subtitle: 'Handle renovation projects, manage timelines, and deliver quality transformations',
          icon: Wrench,
          color: 'orange',
          stats: [
            { label: 'Active Renovations', value: stats.projects, icon: Wrench, color: 'orange' },
            { label: 'Completed Works', value: stats.companies, icon: Building2, color: 'green' },
            { label: 'Client Requests', value: stats.totalViews, icon: MessageSquare, color: 'blue' },
            { label: 'Featured Projects', value: stats.featuredProjects, icon: Star, color: 'yellow' }
          ],
          quickActions: [
            { label: 'Add New Work', icon: Plus, action: () => setActiveTab('projects') },
            { label: 'Manage Portfolio', icon: Briefcase, action: () => setActiveTab('portfolio') },
            { label: 'View Feedback', icon: MessageSquare, action: () => setActiveTab('messages') }
          ]
        };
      case 'architect':
        return {
          title: 'Architect Dashboard',
          subtitle: 'Design blueprints, manage architectural projects, and bring visions to life',
          icon: Ruler,
          color: 'indigo',
          stats: [
            { label: 'Active Projects', value: stats.projects, icon: FolderOpen, color: 'indigo' },
            { label: 'Blueprints', value: stats.companies, icon: Ruler, color: 'blue' },
            { label: 'Client Projects', value: stats.totalViews, icon: Users, color: 'green' },
            { label: 'Featured Designs', value: stats.featuredProjects, icon: Star, color: 'yellow' }
          ],
          quickActions: [
            { label: 'Upload Plan', icon: Plus, action: () => setActiveTab('projects') },
            { label: 'View Projects', icon: FolderOpen, action: () => setActiveTab('projects') },
            { label: 'Manage Portfolio', icon: Briefcase, action: () => setActiveTab('portfolio') }
          ]
        };
      default:
        return {
          title: 'Professional Dashboard',
          subtitle: 'Manage your professional services and connect with clients',
          icon: Building2,
          color: 'gray',
          stats: [
            { label: 'Projects', value: stats.projects, icon: FolderOpen, color: 'gray' },
            { label: 'Companies', value: stats.companies, icon: Building2, color: 'gray' },
            { label: 'Views', value: stats.totalViews, icon: Eye, color: 'gray' },
            { label: 'Featured', value: stats.featuredProjects, icon: Star, color: 'gray' }
          ],
          quickActions: [
            { label: 'Add Project', icon: Plus, action: () => setActiveTab('projects') },
            { label: 'Manage Portfolio', icon: Briefcase, action: () => setActiveTab('portfolio') },
            { label: 'View Messages', icon: MessageSquare, action: () => setActiveTab('messages') }
          ]
        };
    }
  };

  const roleConfig = getRoleConfig();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
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

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Create Company Button */}
              <button
                onClick={() => setActiveTab('companies')}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Company</span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-teal-600">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium">{user?.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      Welcome, {user?.name}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Dashboard', icon: TrendingUp },
              { id: 'companies', label: 'My Company', icon: Building2 },
              { id: 'projects', label: 'Projects', icon: FolderOpen },
              { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
              { id: 'messages', label: 'Messages', icon: MessageSquare }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-teal-600 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg bg-${roleConfig.color}-100`}>
                  <roleConfig.icon className={`w-8 h-8 text-${roleConfig.color}-600`} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{roleConfig.title}</h1>
                  <p className="text-gray-600 mt-1">{roleConfig.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roleConfig.stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center">
                    <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roleConfig.quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <action.icon className="w-6 h-6 text-teal-600" />
                    <span className="font-medium text-gray-900">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Companies */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Companies</h3>
                </div>
                <div className="p-6">
                  {companies.length > 0 ? (
                    <div className="space-y-4">
                      {companies.slice(0, 3).map((company) => (
                        <div key={company._id} className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            {company.logo ? (
                              <img src={company.logo} alt={company.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Building2 className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{company.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{company.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No companies yet</p>
                      <button
                        onClick={() => setActiveTab('companies')}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Create Your First Company
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Projects */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
                </div>
                <div className="p-6">
                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects.slice(0, 3).map((project) => (
                        <div key={project._id} className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                            {project.images && project.images.length > 0 ? (
                              <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <FolderOpen className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{project.title}</p>
                            <p className="text-sm text-gray-500 capitalize">{project.status}</p>
                          </div>
                          {project.isFeatured && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No projects yet</p>
                      <button
                        onClick={() => setActiveTab('projects')}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Add Your First Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'companies' && <CompanyManagement />}

        {activeTab === 'projects' && <ProjectManagement />}

        {activeTab === 'portfolio' && <PortfolioShowcase />}

        {activeTab === 'messages' && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Messages</h3>
            <p className="text-gray-500 mb-6">Communicate with clients and collaborators</p>
            <Link
              href="/conversations"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium inline-block"
            >
              Open Messages
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}