'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  status?: string;
  rating?: number;
  images: string[];
  company?: {
    name: string;
  };
  professional?: {
    name: string;
  };
}

export default function ProjectShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      console.log('🔄 ProjectShowcase: Fetching projects from API...');
      setLoading(true);
      setError(null);

      const response = await fetch('/api/projects/search?limit=6&sortBy=newest', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ ProjectShowcase: Received projects data:', data);

      setProjects(data.projects || []);
    } catch (error) {
      console.error('❌ ProjectShowcase: Error fetching projects:', error);
      setError(error instanceof Error ? error.message : 'Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleRetry = () => {
    console.log('🔄 ProjectShowcase: Retrying to fetch projects...');
    fetchProjects();
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
              Recent Projects by Our Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our verified construction experts have recently built.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A36C]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
              Recent Projects by Our Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our verified construction experts have recently built.
            </p>
          </div>
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
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
              Recent Projects by Our Partners
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our verified construction experts have recently built.
            </p>
          </div>
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects available</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              There are no projects to display at the moment. Check back later for new construction projects.
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
            Recent Projects by Our Partners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what our verified construction experts have recently built.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-8">
          {projects.map((project, index) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative">
                <img
                  src={project.images?.[0] ? (project.images[0].startsWith('http') ? project.images[0] : project.images[0]) : '/images/image-not-available.png'}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status || 'Open'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">
                  {project.title}
                </h3>
                <div className="flex items-center mb-2">
                  <span className="text-gray-600 font-medium">
                    {project.company?.name || project.professional?.name || 'Our Partner'}
                  </span>
                </div>
                {project.location && (
                  <div className="flex items-center mb-3">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600 text-sm">{project.location}</span>
                  </div>
                )}
                {project.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.floor(project.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-gray-600 text-sm">
                      {project.rating || 0}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/projects/${project._id}`}
                  className="inline-block bg-[#00A36C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#008f5a] transition-colors duration-300 w-full text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden overflow-x-auto">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex-shrink-0 w-80"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative">
                  <img
                    src={project.images?.[0] ? (project.images[0].startsWith('http') ? project.images[0] : project.images[0]) : '/images/image-not-available.png'}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status || 'Open'}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">
                    {project.title}
                  </h3>
                  <div className="flex items-center mb-2">
                    <span className="text-gray-600 font-medium">
                      {project.company?.name || project.professional?.name || 'Our Partner'}
                    </span>
                  </div>
                  {project.location && (
                    <div className="flex items-center mb-3">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600 text-sm">{project.location}</span>
                    </div>
                  )}
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(project.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                      <span className="ml-2 text-gray-600 text-sm">
                        {project.rating || 0}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/projects/${project._id}`}
                    className="inline-block bg-[#00A36C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#008f5a] transition-colors duration-300 w-full text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-block bg-[#00A36C] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#008f5a] transition-colors duration-300"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}