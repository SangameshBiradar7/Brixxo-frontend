'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ModernSearchProps {
  placeholder?: string;
  categories?: string[];
  defaultCategory?: string;
  onSearch?: (query: string, category: string) => void;
  showFilters?: boolean;
  filters?: {
    locations?: string[];
    budgets?: { label: string; value: string }[];
    ratings?: number[];
    buildingTypes?: string[];
  };
  onFilterChange?: (filters: any) => void;
}

export default function ModernSearch({
  placeholder = "Search for projects, companies...",
  categories = ["All", "Projects", "Companies", "Professionals"],
  defaultCategory = "All",
  onSearch,
  showFilters = true,
  filters,
  onFilterChange
}: ModernSearchProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    locations: string[];
    budgets: string[];
    ratings: number[];
    buildingTypes: string[];
  }>({
    locations: [],
    budgets: [],
    ratings: [],
    buildingTypes: []
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery, selectedCategory);
    } else {
      // Default search behavior
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set('q', searchQuery);
      if (selectedCategory !== 'All') params.set('category', selectedCategory);
      router.push(`/search?${params.toString()}`);
    }
  };

  const handleFilterChange = (filterType: keyof typeof activeFilters, value: string | number, checked: boolean) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      if (checked) {
        if (filterType === 'ratings') {
          (updated[filterType] as number[]).push(value as number);
        } else {
          (updated[filterType] as string[]).push(value as string);
        }
      } else {
        if (filterType === 'ratings') {
          updated[filterType] = (updated[filterType] as number[]).filter(item => item !== value);
        } else {
          updated[filterType] = (updated[filterType] as string[]).filter(item => item !== value);
        }
      }
      return updated;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({
      locations: [],
      budgets: [],
      ratings: [],
      buildingTypes: []
    });
  };

  const applyFilters = () => {
    if (onFilterChange) {
      onFilterChange(activeFilters);
    }
    setIsFilterOpen(false);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((total, arr) => total + arr.length, 0);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Search Bar */}
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-2 mb-6">
        <form onSubmit={handleSearch} className="flex items-center">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-gray-50 border-r border-gray-200 px-4 py-3 rounded-l-2xl text-gray-700 font-medium focus:outline-none min-w-[120px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 border-0"
              style={{ fontSize: '16px' }} // Prevents zoom on iOS
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-[#f39c12] to-[#e67e22] hover:from-[#e67e22] hover:to-[#d35400] text-white px-8 py-3 rounded-r-2xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-105"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filters Toggle & Active Filters */}
      {showFilters && (
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
          >
            <svg className="w-5 h-5 text-[#f39c12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-[#555555] font-medium">Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="bg-[#f39c12] text-white text-xs px-2 py-1 rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </button>

          {/* Active Filter Tags */}
          {getActiveFilterCount() > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.locations.map(location => (
                <span key={location} className="bg-[#f39c12]/10 text-[#f39c12] px-3 py-1 rounded-full text-sm flex items-center">
                  {location}
                  <button
                    onClick={() => handleFilterChange('locations', location, false)}
                    className="ml-2 text-[#f39c12] hover:text-[#e67e22]"
                  >
                    ×
                  </button>
                </span>
              ))}
              {activeFilters.budgets.map(budget => (
                <span key={budget} className="bg-[#f39c12]/10 text-[#f39c12] px-3 py-1 rounded-full text-sm flex items-center">
                  {budget}
                  <button
                    onClick={() => handleFilterChange('budgets', budget, false)}
                    className="ml-2 text-[#f39c12] hover:text-[#e67e22]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && isFilterOpen && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Location Filter */}
            {filters?.locations && (
              <div>
                <h3 className="font-semibold text-[#555555] mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-[#f39c12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filters.locations.map(location => (
                    <label key={location} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={activeFilters.locations.includes(location)}
                        onChange={(e) => handleFilterChange('locations', location, e.target.checked)}
                        className="w-4 h-4 text-[#f39c12] border-gray-300 rounded focus:ring-[#f39c12]"
                      />
                      <span className="text-[#555555] text-sm">{location}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Budget Filter */}
            {filters?.budgets && (
              <div>
                <h3 className="font-semibold text-[#555555] mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-[#f39c12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Budget Range
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filters.budgets.map(budget => (
                    <label key={budget.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={activeFilters.budgets.includes(budget.value)}
                        onChange={(e) => handleFilterChange('budgets', budget.value, e.target.checked)}
                        className="w-4 h-4 text-[#f39c12] border-gray-300 rounded focus:ring-[#f39c12]"
                      />
                      <span className="text-[#555555] text-sm">{budget.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Filter */}
            {filters?.ratings && (
              <div>
                <h3 className="font-semibold text-[#555555] mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-[#f39c12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Rating
                </h3>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={activeFilters.ratings.includes(rating)}
                        onChange={(e) => handleFilterChange('ratings', rating, e.target.checked)}
                        className="w-4 h-4 text-[#f39c12] border-gray-300 rounded focus:ring-[#f39c12]"
                      />
                      <span className="text-[#555555] text-sm flex items-center">
                        {'★'.repeat(rating)}{'☆'.repeat(5-rating)} & Up
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Building Type Filter */}
            {filters?.buildingTypes && (
              <div>
                <h3 className="font-semibold text-[#555555] mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-[#f39c12]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Building Type
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {filters.buildingTypes.map(type => (
                    <label key={type} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={activeFilters.buildingTypes.includes(type)}
                        onChange={(e) => handleFilterChange('buildingTypes', type, e.target.checked)}
                        className="w-4 h-4 text-[#f39c12] border-gray-300 rounded focus:ring-[#f39c12]"
                      />
                      <span className="text-[#555555] text-sm">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={clearAllFilters}
              className="px-6 py-2 text-[#555555] hover:text-[#f39c12] font-medium transition-colors"
            >
              Clear All
            </button>
            <div className="space-x-3">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-6 py-2 border border-gray-300 text-[#555555] rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={applyFilters}
                className="px-6 py-2 bg-[#f39c12] text-white rounded-lg hover:bg-[#e67e22] transition-colors font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}