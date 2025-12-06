'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { api } from '@/lib/api';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    budget: '',
    buildingType: '',
    location: '',
    sortBy: 'relevance'
  });
  const [showFilters, setShowFilters] = useState(false);

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

  interface Company {
    _id: string;
    name: string;
    rating: number;
    pastProjects: string[];
    logo?: string;
    address?: string;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [topCompanies, setTopCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const budgetRanges = [
    'Under ₹50L',
    '₹50L - ₹1Cr',
    '₹1Cr - ₹2Cr',
    '₹2Cr - ₹5Cr',
    'Above ₹5Cr'
  ];

  const buildingTypes = [
    'Apartment',
    'Villa',
    'Duplex',
    'Triplex',
    'Bungalow',
    'Commercial',
    'Industrial',
    'Institutional'
  ];

  const locations = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Pune',
    'Hyderabad',
    'Kolkata',
    'Ahmedabad'
  ];

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [projectsRes, companiesRes] = await Promise.all([
          api.get('/api/projects'),
          api.get('/api/projects/top-professionals')
        ]);

        setProjects(projectsRes.data.projects || []);
        setTopCompanies(companiesRes.data || []);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to mock data if API fails
        setProjects([
          {
            _id: '1',
            title: 'Modern 2BHK Apartment',
            company: { name: 'Elite Builders', rating: 4.8 },
            location: 'Mumbai',
            budgetRange: '₹45L - ₹65L',
            buildingType: 'Apartment',
            rating: 4.8,
            images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop'],
            features: ['2 Bedrooms', '2 Bathrooms', '1200 sq ft', 'Modern Design'],
            completionDate: '2024'
          }
        ]);
        setTopCompanies([
          { _id: '1', name: 'Elite Builders', rating: 4.8, pastProjects: [], logo: '🏗️', address: 'Mumbai' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handle search
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery && !filters.budget && !filters.buildingType && !filters.location) {
        return; // Don't search if no filters
      }

      setSearchLoading(true);
      try {
        const params = new URLSearchParams({
          ...(searchQuery && { q: searchQuery }),
          ...(filters.budget && { budget: filters.budget }),
          ...(filters.buildingType && { buildingType: filters.buildingType }),
          ...(filters.location && { location: filters.location }),
          sortBy: filters.sortBy
        });

        const data = await api.get(`/api/projects?${params}`);
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300); // Debounce search
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters]);

  const filteredProjects = projects; // API already filters

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Find Your Perfect Project</h1>
          <p className="text-xl text-slate-600 mb-8">Tell us what you want to build and we'll find the best matches</p>

        </div>

        {/* Top Rated Companies */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center">
              <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Top Rated Companies
            </h2>
            <Link
              href="/companies"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {topCompanies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topCompanies.slice(0, 8).map((company) => (
                <Link key={company._id} href={`/companies/${company._id}`} className="group">
                  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-slate-200/50">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-4 mx-auto">
                      <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-slate-700 text-center line-clamp-1">{company.name}</h3>
                    <div className="flex items-center justify-center mb-3">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= Math.round(company.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="font-semibold text-slate-800 ml-2">{company.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                        {company.pastProjects?.length || 0} projects
                      </span>
                      <p className="text-slate-600 text-sm line-clamp-1">{company.address || 'Location not specified'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-600">Companies will appear here once they create their profiles.</p>
            </div>
          )}
        </div>

        {/* Search Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Search Results ({filteredProjects.length})
            </h2>
            <div className="text-slate-600">
              {loading && 'Loading...'}
              {searchLoading && 'Searching...'}
              {!loading && !searchLoading && searchQuery && `Found ${filteredProjects.length} results for "${searchQuery}"`}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects found</h3>
              <p className="text-slate-600">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link key={project._id} href={`/projects/${project._id}`} className="group">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-slate-200/50">
                    <div className="w-full h-56 relative overflow-hidden">
                      <img
                        src={project.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop'}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-slate-800 font-semibold text-sm">{project.rating}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 bg-slate-800/90 backdrop-blur-sm rounded-lg px-3 py-1">
                        <span className="text-white font-semibold text-sm">{project.buildingType}</span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 line-clamp-2 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-slate-600 font-medium mb-3">{project.company.name}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-slate-500 text-sm flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          {project.location}
                        </span>
                        <span className="text-green-600 font-semibold text-sm">{project.budgetRange}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-sm">Completed {project.completionDate}</span>
                        <span className="text-slate-400 text-sm group-hover:text-slate-600 transition-colors duration-200">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}