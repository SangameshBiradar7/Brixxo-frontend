'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import {
  Grid,
  List,
  Filter,
  Star,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  Search,
  X
} from 'lucide-react';

interface ProfessionalProject {
  _id: string;
  title: string;
  description: string;
  company: {
    _id: string;
    name: string;
  };
  projectType: string;
  status: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  location?: string;
  clientName?: string;
  images: string[];
  featuredImage?: string;
  tags: string[];
  isFeatured: boolean;
  isPublic: boolean;
  views: number;
  createdAt: string;
}

interface Company {
  _id: string;
  name: string;
}

const projectTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'interior-design', label: 'Interior Design' },
  { value: 'construction', label: 'Construction' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'consultation', label: 'Consultation' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'featured', label: 'Featured First' },
  { value: 'most-viewed', label: 'Most Viewed' }
];

export default function PortfolioShowcase() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProfessionalProject[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedFeatured, setSelectedFeatured] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);

      // Load companies
      const companiesResponse = await axios.get('/api/professional-companies');
      setCompanies(companiesResponse.data);

      // Load projects
      const projectsResponse = await axios.get('/api/professional-projects');
      setProjects(projectsResponse.data);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProjects = () => {
    const filtered = projects.filter(project => {
      // Company filter
      if (selectedCompany !== 'all' && project.company._id !== selectedCompany) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && project.projectType !== selectedType) {
        return false;
      }

      // Featured filter
      if (selectedFeatured === 'featured' && !project.isFeatured) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(searchLower);
        const matchesDescription = project.description.toLowerCase().includes(searchLower);
        const matchesTags = project.tags.some(tag => tag.toLowerCase().includes(searchLower));
        const matchesLocation = project.location?.toLowerCase().includes(searchLower);

        if (!matchesTitle && !matchesDescription && !matchesTags && !matchesLocation) {
          return false;
        }
      }

      return true;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'featured':
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'most-viewed':
          return (b.views || 0) - (a.views || 0);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getProjectTypeLabel = (type: string) => {
    return projectTypes.find(t => t.value === type)?.label || type;
  };

  const filteredProjects = filteredAndSortedProjects();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
          <p className="text-gray-600 mt-1">Showcase your best work to potential clients</p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-teal-100 text-teal-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-teal-100 text-teal-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
            >
              <option value="all">All Companies</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
            >
              {projectTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={selectedFeatured}
              onChange={(e) => setSelectedFeatured(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
            >
              <option value="all">All Projects</option>
              <option value="featured">Featured Only</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found</span>
          {(searchTerm || selectedCompany !== 'all' || selectedType !== 'all' || selectedFeatured !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCompany('all');
                setSelectedType('all');
                setSelectedFeatured('all');
              }}
              className="flex items-center space-x-1 text-teal-600 hover:text-teal-700"
            >
              <span>Clear filters</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Projects Display */}
      {filteredProjects.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-r from-teal-500 to-teal-600">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-white" />
                    </div>
                  )}

                  {/* Featured Badge */}
                  {project.isFeatured && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Featured</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed' ? 'bg-green-500 text-white' :
                      project.status === 'ongoing' ? 'bg-blue-500 text-white' :
                      project.status === 'upcoming' ? 'bg-orange-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button className="bg-white text-gray-900 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-teal-600 transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                  {/* Project Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{project.company.name}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                        {getProjectTypeLabel(project.projectType)}
                      </span>
                    </div>

                    {project.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{project.location}</span>
                      </div>
                    )}

                    {project.budget && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{formatCurrency(project.budget)}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{project.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{project.views || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(project.startDate).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex">
                  {/* Project Image */}
                  <div className="w-48 h-32 bg-gradient-to-r from-teal-500 to-teal-600 flex-shrink-0">
                    {project.images && project.images.length > 0 ? (
                      <img
                        src={project.images[0]}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>{project.company.name}</span>
                          <span className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                            {getProjectTypeLabel(project.projectType)}
                          </span>
                          {project.isFeatured && (
                            <span className="flex items-center space-x-1 text-yellow-600">
                              <Star className="w-3 h-3 fill-current" />
                              <span className="text-xs">Featured</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ml-4 ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'upcoming' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {project.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{project.location}</span>
                          </div>
                        )}
                        {project.budget && (
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>{formatCurrency(project.budget)}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{project.views || 0} views</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(project.startDate).getFullYear()}</span>
                        </div>
                      </div>

                      <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedCompany !== 'all' || selectedType !== 'all' || selectedFeatured !== 'all'
              ? 'Try adjusting your filters or search terms'
              : 'Create your first project to start building your portfolio'
            }
          </p>
          {(!searchTerm && selectedCompany === 'all' && selectedType === 'all' && selectedFeatured === 'all') && (
            <button className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium">
              Add Your First Project
            </button>
          )}
        </div>
      )}
    </div>
  );
}