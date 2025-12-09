'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { api } from '@/lib/api';

// Interface for project data from backend API
interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  imageUrl?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

// Loading skeleton component for project cards
function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-5">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

// Format currency for display
const formatCurrency = (amount: number) => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `₹${amount.toLocaleString()}`;
};

export default function ProjectsPage() {
  // State management for projects and UI
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects from backend API with error handling
  const loadProjects = async () => {
    try {
      console.log('🔄 ProjectsPage: Fetching projects from API...');
      setLoading(true);
      setError(null);

      // Fetch projects from backend API
      const data = await api.get('/projects');
      console.log('✅ ProjectsPage: Received projects data:', data);

      // Validate and set project data
      const projectData = Array.isArray(data) ? data : [];
      setProjects(projectData);

    } catch (err) {
      console.error('❌ ProjectsPage: Error loading projects:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects';
      setError(errorMessage);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of projects
  useEffect(() => {
    loadProjects();
  }, []);

  // Handle retry on error
  const handleRetry = () => {
    console.log('🔄 ProjectsPage: Retrying to load projects...');
    loadProjects();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-poppins">
              All Construction Projects
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Discover amazing construction projects from top companies and verified professionals
            </p>
          </div>

          {/* Loading State with Skeletons */}
          {loading && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <ProjectCardSkeleton key={index} />
                ))}
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to load projects</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={handleRetry}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && !error && (
            <>
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 font-medium">
                  Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Projects Display */}
              {projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {projects.map((project) => (
                    <Link
                      key={project._id}
                      href={`/projects/${project._id}`}
                      className="group block"
                    >
                      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 h-full">

                        {/* Project Image */}
                        <div className="relative h-48 overflow-hidden">
                          {project.imageUrl ? (
                            <Image
                              src={project.imageUrl.startsWith('http') ? project.imageUrl : `/api/uploads/${project.imageUrl}`}
                              alt={project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1">
                            <span className="text-xs font-semibold text-gray-800 capitalize">
                              {project.category}
                            </span>
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="p-5 flex flex-col h-full">

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2 mb-2 transition-colors">
                            {project.title}
                          </h3>

                          {/* Description */}
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Location and Budget */}
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {project.location}
                            </span>
                            <span className="text-green-600 font-medium">
                              {formatCurrency(project.budget)}
                            </span>
                          </div>

                          {/* View Details Button */}
                          <div className="mt-auto">
                            <span className="text-gray-400 text-sm group-hover:text-blue-600 transition-colors font-medium">
                              View Details →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    There are no projects available at the moment. Check back later for new construction projects.
                  </p>
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );


}



