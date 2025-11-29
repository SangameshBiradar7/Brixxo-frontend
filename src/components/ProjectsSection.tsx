'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Project {
  _id: string;
  title: string;
  company: {
    name: string;
    rating: number;
  };
  location: string;
  budgetRange: string;
  buildingType: string;
  rating: number;
  images: string[];
  features: string[];
  completionDate: string;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'topRated' | 'newlyAdded'>('topRated');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await api.get('/api/projects/search');
        const allProjects = data.projects || [];

        if (activeTab === 'topRated') {
          const sortedByRating = [...allProjects].sort((a, b) => (b.rating || 0) - (a.rating || 0));
          setProjects(sortedByRating.slice(0, 4));
        } else {
          // For newly added, sort by completion date (assuming newer projects have later completion dates)
          const sortedByDate = [...allProjects].sort((a, b) =>
            new Date(b.completionDate || b.createdAt || 0).getTime() - new Date(a.completionDate || a.createdAt || 0).getTime()
          );
          setProjects(sortedByDate.slice(0, 4));
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [activeTab]);

  if (loading) {
    return (
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-20 bg-gray-50 relative"
      style={{background: 'linear-gradient(135deg, #f5f5f5 0%, #e8f5e8 100%)'}}
      data-aos="fade-up"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-3xl md:text-4xl font-oswald font-bold text-gray-900 mb-4 uppercase tracking-wide">
            🏗️ Explore Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover top-rated construction projects from leading companies
          </p>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
              <button
                onClick={() => setActiveTab('topRated')}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'topRated'
                    ? 'bg-green-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                Top Rated
              </button>
              <button
                onClick={() => setActiveTab('newlyAdded')}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === 'newlyAdded'
                    ? 'bg-green-600 text-white shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                Newly Added
              </button>
            </div>
          </div>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8" data-aos="fade-up" data-aos-delay="400">
            {projects.map((project, index) => (
              <div
                key={project._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 border border-gray-200 group relative"
                data-aos="zoom-in"
                data-aos-delay={500 + index * 100}
              >
                <div className="w-full h-48 relative overflow-hidden">
                  <img
                    src={project.images && project.images.length > 0 ? project.images[0] : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'}
                    alt={project.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gray-800 font-semibold text-sm">{project.rating || 0}</span>
                  </div>

                  {/* Hover overlay with buttons */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center space-x-4">
                    <Link
                      href={`/projects/${project._id}`}
                      className="bg-white text-gray-800 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => {/* TODO: Implement contact company modal */}}
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Contact Company
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-lato font-bold text-gray-900 line-clamp-2 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm font-medium text-blue-600 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {project.company?.name || 'Company'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No projects available at the moment.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  );
}