'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import ModernSearch from '@/components/ModernSearch';

// Interface for Professional data from backend API
interface Professional {
  _id: string;
  name: string;
  email: string;
  description?: string;
  logo?: string;
  website?: string;
  phone?: string;
  address?: string;
  services: string[];
  specialties: string[];
  portfolio: any[];
  rating: number;
  reviewCount: number;
  user: string;
  isVerified: boolean;
  license?: string;
  insurance?: string;
  location?: {
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  businessHours?: any;
  createdAt: string;
  updatedAt: string;
  tagline?: string; // Add tagline for quotes
}

interface SearchFilters {
  category: string[];
  projectType: string[];
  budgetMin: number;
  budgetMax: number;
  location: string;
  experience: string;
  rating: number;
  availability: string;
  sortBy: string;
  specialization: string[];
  completedProjects: string;
}

// Loading skeleton component for company cards
function CompanyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
      <div className="w-full h-48 bg-gray-200"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    </div>
  );
}

export default function ProfessionalsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfessionalsPage />
    </Suspense>
  );
}

function ProfessionalsPage() {
  const { user, socket } = useAuth();
  const searchParams = useSearchParams();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('rating');

  // Map URL category parameters to display names (only four professional types)
  const categoryMapping: { [key: string]: string } = {
    'contractor': 'Contractors',
    'interior-designer': 'Interior Designers',
    'architect': 'Architects',
    'renovator': 'Renovators'
  };

  // Available categories for filtering
  const availableCategories = ['All', 'Contractors', 'Interior Designers', 'Architects', 'Renovators'];

  // Rotating quotes for hero section
  const quotes = [
    "Great design is born of simplicity and clarity.",
    "We don't just build structures, we build dreams.",
    "Every line we draw tells a story of innovation.",
    "Turning imagination into reality — one project at a time.",
    "Craftsmanship that stands the test of time.",
    "Where vision meets precision and excellence."
  ];

  // Read URL parameters and set initial category filter
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && categoryMapping[categoryParam]) {
      setActiveCategory(categoryMapping[categoryParam]);
    }
  }, [searchParams]);

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  // Load professionals from backend API
  const loadProfessionals = async () => {
    try {
      console.log('🔄 ProfessionalsPage: Fetching professionals from API...');
      setLoading(true);
      setError(null);

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/professionals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ ProfessionalsPage: Received professionals data:', data);

      setProfessionals(data || []);
    } catch (err) {
      console.error('❌ ProfessionalsPage: Error loading professionals:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load professionals';
      setError(errorMessage);
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of professionals
  useEffect(() => {
    loadProfessionals();
  }, []);

  // Filter and sort professionals
  useEffect(() => {
    let filtered = [...professionals];

    // Filter by category
    if (activeCategory !== 'All') {
      const categoryKeywords = {
        'Contractors': ['contractor', 'construction', 'builder'],
        'Interior Designers': ['interior designer', 'interior design', 'design'],
        'Architects': ['architect', 'architectural', 'architecture'],
        'Renovators': ['renovator', 'renovation', 'remodeling']
      };

      const keywords = categoryKeywords[activeCategory as keyof typeof categoryKeywords] || [];
      filtered = filtered.filter(professional =>
        professional.specialties.some(specialty =>
          keywords.some(keyword =>
            specialty.toLowerCase().includes(keyword.toLowerCase())
          )
        ) ||
        professional.services.some(service =>
          keywords.some(keyword =>
            service.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(professional =>
        professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (professional.description && professional.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        professional.specialties.some(specialty =>
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        professional.services.some(service =>
          service.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort professionals
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'experience':
        filtered.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProfessionals(filtered);
  }, [professionals, activeCategory, searchQuery, sortBy]);

  // Real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleProfessionalCreated = (data: any) => {
      console.log('Real-time: Professional created', data);
      if (data.professional.isVerified) {
        setProfessionals(prev => [data.professional, ...prev]);
        toast.success('New professional joined the platform!');
      }
    };

    const handleProfessionalUpdated = (data: any) => {
      console.log('Real-time: Professional updated', data);
      setProfessionals(prev =>
        prev.map(prof =>
          prof._id === data.professional._id ? data.professional : prof
        )
      );
    };

    const handleProfessionalDeleted = (data: any) => {
      console.log('Real-time: Professional deleted', data);
      setProfessionals(prev =>
        prev.filter(prof => prof._id !== data.professionalId)
      );
      toast('A professional profile was removed');
    };

    const handleProfessionalVerified = (data: any) => {
      console.log('Real-time: Professional verified', data);
      setProfessionals(prev =>
        prev.map(prof =>
          prof._id === data.professional._id ? data.professional : prof
        )
      );
      toast.success('Professional profile verified!');
    };

    socket.on('professionalCreated', handleProfessionalCreated);
    socket.on('professionalUpdated', handleProfessionalUpdated);
    socket.on('professionalDeleted', handleProfessionalDeleted);
    socket.on('professionalVerified', handleProfessionalVerified);

    return () => {
      socket.off('professionalCreated', handleProfessionalCreated);
      socket.off('professionalUpdated', handleProfessionalUpdated);
      socket.off('professionalDeleted', handleProfessionalDeleted);
      socket.off('professionalVerified', handleProfessionalVerified);
    };
  }, [socket]);

  // Handle retry on error
  const handleRetry = () => {
    console.log('🔄 ProfessionalsPage: Retrying to load professionals...');
    loadProfessionals();
  };

  // Handle search from ModernSearch component
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins">
              {activeCategory !== 'All' ? activeCategory : 'Meet Our Professionals'}
            </h1>
            <div className="max-w-3xl mx-auto mb-8">
              {activeCategory === 'All' ? (
                <p className="text-xl md:text-2xl text-slate-200 italic font-light leading-relaxed transition-opacity duration-1000">
                  "{quotes[currentQuote]}"
                </p>
              ) : (
                <p className="text-xl md:text-2xl text-slate-200 font-light leading-relaxed">
                  Discover our certified {activeCategory.toLowerCase()} ready to bring your vision to life
                </p>
              )}
            </div>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
              {activeCategory !== 'All'
                ? `Professional ${activeCategory.toLowerCase()} with expertise in their field`
                : 'Certified experts ready to bring your dream project to life'
              }
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, specialty, or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/50 transition-all duration-300"
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-teal-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-slate-600/20 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{professionals.length}+</div>
              <div className="text-gray-600 font-medium">Verified Professionals</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">250+</div>
              <div className="text-gray-600 font-medium">Projects Completed</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4.8/5</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Category Title and Filter Tabs */}
          <div className="mb-8">
            {activeCategory !== 'All' && (
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 font-poppins mb-2">
                  {activeCategory}
                </h2>
                <p className="text-lg text-slate-600">
                  Certified {activeCategory.toLowerCase()} ready to bring your project to life
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {availableCategories.map((category) => {
                const isFromUrl = searchParams.get('category') && categoryMapping[searchParams.get('category')!] === category;
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 relative ${
                      activeCategory === category
                        ? 'bg-slate-900 text-white shadow-lg transform scale-105'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:shadow-md'
                  }`}
                  >
                    {category}
                    {isFromUrl && activeCategory === category && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sort Options */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="experience">Most Experienced</option>
                  <option value="newest">Newest</option>
                  <option value="name">Name (A-Z)</option>
                </select>
                {searchParams.get('category') && (
                  <button
                    onClick={() => {
                      // Clear URL parameter and reset category
                      window.history.replaceState({}, '', '/professionals');
                      setActiveCategory('All');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
              <div className="text-gray-600 font-medium">
                Showing {filteredProfessionals.length} professional{filteredProfessionals.length !== 1 ? 's' : ''}
                {activeCategory !== 'All' && ` in ${activeCategory}`}
              </div>
            </div>
          </div>

          {/* Loading State with Skeletons */}
          {loading && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, index) => (
                  <CompanyCardSkeleton key={index} />
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
                <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to load companies</h3>
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

          {/* Professionals Grid */}
          {!loading && !error && (
            <>
              {/* Professionals Display */}
              {filteredProfessionals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredProfessionals.map((professional, index) => {
                    // Generate unique taglines for each professional
                    const taglines = [
                      "Transforming spaces with precision and care",
                      "Crafting excellence in every detail",
                      "Building dreams, one project at a time",
                      "Where quality meets innovation",
                      "Dedicated to exceptional craftsmanship",
                      "Your vision, our expertise"
                    ];
                    const tagline = taglines[index % taglines.length];

                    return (
                      <div
                        key={professional._id}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 border border-gray-100 h-full group cursor-pointer"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => window.open(`/professionals/${professional._id}`, '_blank')}
                      >

                        {/* Professional Logo/Image */}
                        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                          {professional.logo ? (
                            <Image
                              src={professional.logo}
                              alt={professional.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                              <div className="text-center text-slate-500">
                                <svg className="w-20 h-20 mx-auto mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <p className="text-sm font-medium">Professional</p>
                              </div>
                            </div>
                          )}

                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Verified Badge */}
                          {professional.isVerified && (
                            <div className="absolute top-4 right-4 bg-emerald-500 text-white rounded-full p-2 shadow-lg">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}

                          {/* Rating Badge */}
                          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-2 flex items-center shadow-lg">
                            <svg className="w-4 h-4 text-amber-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-bold text-slate-800">
                              {professional.rating.toFixed(1)}
                            </span>
                          </div>

                          {/* Tagline overlay */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white text-sm italic font-light bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 leading-tight">
                              "{tagline}"
                            </p>
                          </div>
                        </div>

                        {/* Professional Details */}
                        <div className="p-6 flex flex-col h-full">

                          {/* Professional Name & Role */}
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-slate-900 mb-1 font-poppins group-hover:text-slate-700 transition-colors">
                              {professional.name}
                            </h3>
                            <p className="text-slate-600 text-sm font-medium">
                              {professional.specialties[0] || 'Professional Service'}
                            </p>
                          </div>

                          {/* Specialties */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {professional.specialties.slice(0, 2).map((specialty, idx) => (
                              <span key={idx} className="bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full font-medium border border-teal-100 group-hover:bg-teal-100 transition-colors">
                                {specialty}
                              </span>
                            ))}
                            {professional.specialties.length > 2 && (
                              <span className="text-xs text-slate-500 font-medium">
                                +{professional.specialties.length - 2} more
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          {professional.description && (
                            <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                              {professional.description}
                            </p>
                          )}

                          {/* Location & Experience */}
                          <div className="flex items-center justify-between text-slate-500 text-sm mb-6">
                            {professional.location && (
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {professional.location.city}
                              </div>
                            )}
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {professional.reviewCount || 0} projects
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 mt-auto">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle contact functionality
                                toast.success(`Contact request sent to ${professional.name}`);
                              }}
                              className="flex-1 bg-emerald-600 text-white text-center py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Contact
                            </button>
                            <Link
                              href={`/professionals/${professional._id}`}
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 bg-slate-900 text-white text-center py-3 px-4 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Profile
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Empty State */
                <div className="text-center py-20">
                  <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 font-poppins">
                    Coming Soon
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                    We're working to bring exceptional construction professionals to our platform. Check back soon to connect with verified experts!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {activeCategory !== 'All' && (
                      <button
                        onClick={() => handleCategoryChange('All')}
                        className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        View All Professionals
                      </button>
                    )}
                    <button
                      onClick={handleRetry}
                      className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Refresh Page
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}