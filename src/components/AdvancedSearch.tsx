'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

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

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onLocationDetected?: (location: string) => void;
}

export default function AdvancedSearch({ onSearch, onLocationDetected }: AdvancedSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    category: [],
    projectType: [],
    budgetMin: 500000, // ₹5L
    budgetMax: 5000000, // ₹50L
    location: '',
    experience: '',
    rating: 0,
    availability: '',
    sortBy: 'relevance',
    specialization: [],
    completedProjects: ''
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches
  const saveRecentSearch = (query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Geolocation detection
  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Reverse geocoding to get city name
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            );
            const data = await response.json();
            const city = data.city || data.locality || 'Current Location';
            setFilters(prev => ({ ...prev, location: city }));
            onLocationDetected?.(city);
          } catch (error) {
            console.error('Error getting location:', error);
            setFilters(prev => ({ ...prev, location: 'Current Location' }));
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to detect location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  // Voice search
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        handleSearch(transcript, filters);
      };

      recognition.onerror = () => {
        setIsListening(false);
        alert('Voice recognition failed. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported in this browser.');
    }
  };

  // Real-time suggestions
  useEffect(() => {
    if (searchQuery.length > 2) {
      // Mock suggestions - in real app, fetch from API
      const mockSuggestions = [
        `${searchQuery} contractors`,
        `${searchQuery} architects`,
        `${searchQuery} interior designers`,
        `${searchQuery} in Mumbai`,
        `${searchQuery} in Delhi`,
        `${searchQuery} under ₹50L`,
        `${searchQuery} with 5+ years experience`
      ];
      setSuggestions(mockSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Sticky behavior on mobile
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const handleSearch = (query: string = searchQuery, currentFilters: SearchFilters = filters) => {
    if (query.trim()) {
      saveRecentSearch(query);
    }
    onSearch(query, currentFilters);
    setShowSuggestions(false);
  };

  // Handle filter change
  const handleFilterChange = (key: keyof SearchFilters, value: string | number | string[]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update active filters display
    const active = Object.entries(newFilters)
      .filter(([k, v]) => {
        if (Array.isArray(v)) return v.length > 0;
        return v !== '' && v !== 0 && k !== 'sortBy';
      })
      .map(([k, v]) => {
        if (Array.isArray(v)) return `${k}:${v.join(',')}`;
        return `${k}:${v}`;
      });
    setActiveFilters(active);
  };

  // Remove filter
  const removeFilter = (filterKey: string) => {
    const [key, value] = filterKey.split(':');
    if (key === 'category' || key === 'projectType' || key === 'specialization') {
      // For array filters, remove the specific value
      const currentArray = filters[key as keyof SearchFilters] as string[];
      const newArray = currentArray.filter(item => item !== value);
      handleFilterChange(key as keyof SearchFilters, newArray);
    } else {
      // For single value filters
      handleFilterChange(key as keyof SearchFilters, key === 'rating' ? 0 : '');
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: [],
      projectType: [],
      budgetMin: 500000,
      budgetMax: 5000000,
      location: '',
      experience: '',
      rating: 0,
      availability: '',
      sortBy: 'relevance',
      specialization: [],
      completedProjects: ''
    });
    setActiveFilters([]);
  };

  // Apply filters
  const applyFilters = () => {
    handleSearch();
    setShowFilters(false);
  };

  const categories = [
    'Contractor', 'Architect', 'Renovator', 'Interior Designer', 'Structural Engineer', 'Estimator'
  ];

  const projectTypes = [
    'Residential', 'Commercial', 'Duplex', 'Villa', 'Apartment'
  ];

  const specializations = [
    'Civil Works', 'Electrical', 'Plumbing', 'Interior Design', 'Landscaping'
  ];

  const experienceLevels = [
    '0-3 years', '3-5 years', '5+ years'
  ];

  const availabilityOptions = [
    'Immediate Start', 'Within 1 Week', 'Within 1 Month'
  ];

  const completedProjectsOptions = [
    '1-10', '10-30', '30+'
  ];

  const sortOptions = [
    'Relevance', 'Rating (High to Low)', 'Budget (Low to High)', 'Budget (High to Low)'
  ];

  return (
    <div className={`bg-white border-b border-gray-200 ${isSticky ? 'sticky top-16 z-40 shadow-lg' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Main Search Bar */}
        <div className="relative">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for contractors, architects, interior designers..."
                  className="w-full pl-12 pr-12 py-4 text-lg text-gray-900 border-2 border-gray-600 rounded-xl focus:border-[#00A36C] focus:outline-none transition-colors placeholder-gray-500"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  onClick={startVoiceSearch}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                    isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-400'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-2 z-50 max-h-80 overflow-y-auto">
                  {suggestions.length > 0 && (
                    <div className="p-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                        Suggestions
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(suggestion);
                            handleSearch(suggestion);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                        >
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {suggestion}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {recentSearches.length > 0 && (
                    <div className="border-t border-gray-100 p-2">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                        Recent Searches
                      </div>
                      {recentSearches.map((recent, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(recent);
                            handleSearch(recent);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-900"
                        >
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {recent}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location Selector */}
            <div className="md:w-64">
              <div className="relative">
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  placeholder="Enter location"
                  className="w-full px-4 py-4 text-gray-900 border-2 border-gray-600 rounded-xl focus:border-[#00A36C] focus:outline-none transition-colors placeholder-gray-500"
                />
                <button
                  onClick={detectLocation}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Detect my location"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={() => handleSearch()}
              className="bg-[#00A36C] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#008f5a] transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </div>

        {/* Filters Toggle & Active Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-600 rounded-lg transition-colors font-semibold shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {activeFilters.length > 0 && (
              <span className="bg-[#00A36C] text-white text-xs px-2 py-1 rounded-full font-bold">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Active Filter Tags */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-3 p-4 bg-gray-800 rounded-lg border-2 border-gray-600">
              <span className="text-white font-semibold text-sm mr-2">Active Filters:</span>
              {activeFilters.map((filter, index) => {
                const [key, value] = filter.split(':');
                if (key === 'category' || key === 'projectType' || key === 'specialization') {
                  // For array filters, show individual tags
                  const values = value.split(',');
                  return values.map((val, valIndex) => (
                    <span key={`${index}-${valIndex}`} className="bg-[#00A36C] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 font-semibold shadow-md">
                      {val}
                      <button
                        onClick={() => removeFilter(`${key}:${val}`)}
                        className="hover:text-red-300 text-white font-bold text-lg leading-none"
                      >
                        ×
                      </button>
                    </span>
                  ));
                } else {
                  // For single value filters
                  return (
                    <span key={index} className="bg-[#00A36C] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 font-semibold shadow-md">
                      {filter.replace(':', ': ')}
                      <button
                        onClick={() => removeFilter(filter)}
                        className="hover:text-red-300 text-white font-bold text-lg leading-none"
                      >
                        ×
                      </button>
                    </span>
                  );
                }
              }).flat()}
              <button
                onClick={clearFilters}
                className="text-red-400 hover:text-red-300 text-sm font-semibold underline ml-4 px-3 py-1 rounded hover:bg-red-900/20 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div ref={filtersRef} className="mt-4 bg-white rounded-xl shadow-2xl border-2 border-gray-300 overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Category</label>
                  <div className="space-y-2">
                    {['Contractor', 'Architect', 'Renovator', 'Interior Designer', 'Structural Engineer', 'Estimator'].map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.category.includes(category)}
                          onChange={(e) => {
                            const newCategories = e.target.checked
                              ? [...filters.category, category]
                              : filters.category.filter(c => c !== category);
                            handleFilterChange('category', newCategories);
                          }}
                          className="w-4 h-4 text-[#00A36C] border-gray-300 rounded focus:ring-[#00A36C] bg-white"
                        />
                        <span className="ml-2 text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Project Type Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Project Type</label>
                  <div className="space-y-2">
                    {['Residential', 'Commercial', 'Duplex', 'Villa', 'Apartment'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.projectType.includes(type)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...filters.projectType, type]
                              : filters.projectType.filter(t => t !== type);
                            handleFilterChange('projectType', newTypes);
                          }}
                          className="w-4 h-4 text-[#00A36C] border-gray-300 rounded focus:ring-[#00A36C] bg-white"
                        />
                        <span className="ml-2 text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Budget Range Slider */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Budget Range</label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">₹{(filters.budgetMin / 100000).toFixed(0)}L</span>
                      <span className="text-sm text-gray-600">₹{(filters.budgetMax / 100000).toFixed(0)}L</span>
                    </div>
                    <input
                      type="range"
                      min="500000"
                      max="50000000"
                      step="500000"
                      value={filters.budgetMin}
                      onChange={(e) => handleFilterChange('budgetMin', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-green"
                    />
                    <input
                      type="range"
                      min="500000"
                      max="50000000"
                      step="500000"
                      value={filters.budgetMax}
                      onChange={(e) => handleFilterChange('budgetMax', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-green"
                    />
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Location</label>
                  <div className="space-y-2">
                    <select
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full px-3 py-2 text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C] bg-white"
                    >
                      <option value="">Any Location</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="chennai">Chennai</option>
                      <option value="pune">Pune</option>
                      <option value="hyderabad">Hyderabad</option>
                    </select>
                    <button
                      onClick={detectLocation}
                      className="w-full px-3 py-2 text-[#00A36C] border-2 border-[#00A36C] rounded-lg hover:bg-[#00A36C] hover:text-white transition-colors text-sm font-medium"
                    >
                      📍 Near Me
                    </button>
                  </div>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Experience</label>
                  <div className="space-y-2">
                    {['0-3 years', '3-5 years', '5+ years'].map(exp => (
                      <label key={exp} className="flex items-center">
                        <input
                          type="radio"
                          name="experience"
                          value={exp}
                          checked={filters.experience === exp}
                          onChange={(e) => handleFilterChange('experience', e.target.value)}
                          className="w-4 h-4 text-[#00A36C] border-gray-300 focus:ring-[#00A36C] bg-white"
                        />
                        <span className="ml-2 text-sm text-gray-700">{exp}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Ratings</label>
                  <div className="space-y-2">
                    {[5, 4, 3].map(rating => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={filters.rating === rating}
                          onChange={(e) => handleFilterChange('rating', rating)}
                          className="w-4 h-4 text-[#00A36C] border-gray-300 focus:ring-[#00A36C] bg-white"
                        />
                        <span className="ml-2 text-sm text-gray-700">{'★'.repeat(rating)}{'☆'.repeat(5-rating)} & above</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Availability</label>
                  <div className="space-y-2">
                    {['Immediate Start', 'Within 1 Week', 'Within 1 Month'].map(avail => (
                      <label key={avail} className="flex items-center">
                        <input
                          type="radio"
                          name="availability"
                          value={avail}
                          checked={filters.availability === avail}
                          onChange={(e) => handleFilterChange('availability', e.target.value)}
                          className="w-4 h-4 text-[#00A36C] border-gray-300 focus:ring-[#00A36C] bg-white"
                        />
                        <span className="ml-2 text-sm text-gray-700">{avail}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C] bg-white"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Rating (High to Low)</option>
                    <option value="budget-low">Budget (Low to High)</option>
                    <option value="budget-high">Budget (High to Low)</option>
                  </select>
                </div>

                {/* Specialization Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Specialization</label>
                  <div className="space-y-2">
                    {['Civil Works', 'Electrical', 'Plumbing', 'Interior Design', 'Landscaping'].map(spec => (
                      <label key={spec} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.specialization.includes(spec)}
                          onChange={(e) => {
                            const newSpecs = e.target.checked
                              ? [...filters.specialization, spec]
                              : filters.specialization.filter(s => s !== spec);
                            handleFilterChange('specialization', newSpecs);
                          }}
                          className="w-4 h-4 text-[#00A36C] border-gray-300 rounded focus:ring-[#00A36C] bg-white"
                        />
                        <span className="ml-2 text-sm text-gray-700">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Completed Projects Filter */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">Completed Projects</label>
                  <div className="space-y-2">
                    {['1-10', '10-30', '30+'].map(count => (
                      <label key={count} className="flex items-center">
                        <input
                          type="radio"
                          name="completedProjects"
                          value={count}
                          checked={filters.completedProjects === count}
                          onChange={(e) => handleFilterChange('completedProjects', e.target.value)}
                          className="w-4 h-4 text-[#00A36C] border-gray-300 focus:ring-[#00A36C] bg-white"
                        />
                        <span className="ml-2 text-sm text-gray-700">{count} projects</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-300">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={applyFilters}
                  className="px-6 py-2 bg-[#00A36C] text-white rounded-lg hover:bg-[#008f5a] transition-colors font-semibold"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}