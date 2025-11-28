'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery);
    if (location.trim()) params.set('location', location);
    if (category.trim()) params.set('category', category);
    activeFilters.forEach(filter => params.append('filters', filter));
    router.push(`/search?${params.toString()}`);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const filters = [
    { key: 'rating', label: '⭐ 4+ Stars' },
    { key: 'experience', label: '💼 Experienced' },
    { key: 'company-size', label: '🏢 Established' },
    { key: 'budget', label: '💰 Budget Friendly' }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Location Dropdown */}
            <div className="lg:w-48">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-transparent bg-white"
                style={{ fontSize: '16px' }}
              >
                <option value="">Select City or Area</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="bangalore">Bangalore</option>
                <option value="chennai">Chennai</option>
                <option value="pune">Pune</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for contractors, architects, interior designers, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-transparent"
                style={{ fontSize: '16px' }}
              />
            </div>

            {/* Category Dropdown */}
            <div className="lg:w-48">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 text-gray-900 border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A36C] focus:border-transparent bg-white"
                style={{ fontSize: '16px' }}
              >
                <option value="">All Categories</option>
                <option value="contractors">Contractors</option>
                <option value="architects">Architects</option>
                <option value="interior-designers">Interior Designers</option>
                <option value="renovators">Renovators</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="bg-[#00A36C] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#008f5a] transition-colors duration-300 whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => toggleFilter(filter.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilters.includes(filter.key)
                    ? 'bg-[#00A36C] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}