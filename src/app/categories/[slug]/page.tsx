'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

const categoryData = {
  bedroom: {
    title: 'Bedroom Designs',
    subtitle: 'Create your perfect sanctuary where dreams begin and rest restores the soul',
    heroImage: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1920&h=1080&fit=crop&crop=center',
    description: 'Transform your bedroom into a peaceful retreat with our curated collection of modern designs, traditional aesthetics, and innovative space solutions that nurture your well-being.',
    subCategories: [
      { name: 'Master Bedroom', count: 245, image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400&h=300&fit=crop&crop=center' },
      { name: 'Kids Bedroom', count: 189, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center' },
      { name: 'Guest Bedroom', count: 156, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center' },
      { name: 'Small Bedroom', count: 98, image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400&h=300&fit=crop&crop=center' }
    ]
  },
  'living-room': {
    title: 'Living Room Designs',
    subtitle: 'Craft the heart of your home where memories are made and stories unfold',
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1080&fit=crop&crop=center',
    description: 'Design the heart of your home with stunning living room layouts, furniture arrangements, and decor ideas that create welcoming spaces where family bonds grow stronger.',
    subCategories: [
      { name: 'Modern Living', count: 312, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center' },
      { name: 'Traditional Living', count: 267, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center' },
      { name: 'Compact Living', count: 198, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center' },
      { name: 'Open Plan Living', count: 145, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center' }
    ]
  },
  kitchen: {
    title: 'Kitchen Designs',
    subtitle: 'Where culinary dreams come to life in spaces crafted with care and passion',
    heroImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&fit=crop&crop=center',
    description: 'Discover innovative kitchen layouts, premium appliances, and smart storage solutions that combine functionality with stunning aesthetics, creating spaces where meals become memories.',
    subCategories: [
      { name: 'Modern Kitchen', count: 289, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center' },
      { name: 'Traditional Kitchen', count: 234, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center' },
      { name: 'Small Kitchen', count: 176, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center' },
      { name: 'Island Kitchen', count: 123, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center' }
    ]
  },
  bathroom: {
    title: 'Bathroom Designs',
    subtitle: 'Your personal sanctuary where relaxation meets rejuvenation',
    heroImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&fit=crop&crop=center',
    description: 'Create your personal spa experience with elegant bathroom designs, premium fixtures, and innovative space-saving solutions that transform daily routines into moments of bliss.',
    subCategories: [
      { name: 'Master Bathroom', count: 198, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center' },
      { name: 'Guest Bathroom', count: 145, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center' },
      { name: 'Powder Room', count: 87, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center' },
      { name: 'Luxury Spa Bath', count: 76, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center' }
    ]
  }
};

const professionals = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Interior Designer',
    specialization: 'Modern Home Design',
    experience: '8+ years',
    rating: 4.9,
    projects: 45,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    verified: true
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Architect',
    specialization: 'Residential Design',
    experience: '12+ years',
    rating: 4.8,
    projects: 67,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    verified: true
  },
  {
    id: 3,
    name: 'Amit Patel',
    role: 'Interior Designer',
    specialization: 'Luxury Interiors',
    experience: '10+ years',
    rating: 4.7,
    projects: 52,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    verified: true
  }
];

const featuredProjects = [
  {
    id: 1,
    title: 'Luxury Master Bedroom Renovation',
    location: 'Bangalore',
    budget: '₹8-12L',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400&h=300&fit=crop&crop=center',
    designer: 'Rajesh Kumar'
  },
  {
    id: 2,
    title: 'Modern Living Room Makeover',
    location: 'Mumbai',
    budget: '₹5-8L',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
    designer: 'Priya Sharma'
  },
  {
    id: 3,
    title: 'Elegant Kitchen Redesign',
    location: 'Delhi',
    budget: '₹6-10L',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center',
    designer: 'Amit Patel'
  },
  {
    id: 4,
    title: 'Contemporary Bathroom Suite',
    location: 'Pune',
    budget: '₹4-7L',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center',
    designer: 'Rajesh Kumar'
  }
];

interface CategoryData {
  title: string;
  subtitle: string;
  heroImage: string;
  description: string;
  subCategories: {
    name: string;
    count: number;
    image: string;
  }[];
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    if (slug && typeof slug === 'string' && categoryData[slug as keyof typeof categoryData]) {
      setCategory(categoryData[slug as keyof typeof categoryData]);
    }
  }, [slug]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic
    console.log('Search:', searchQuery);
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter));
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Link href="/categories" className="text-[#2E7D32] hover:text-[#1b5e20]">
            ← Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-80 md:h-96 overflow-hidden">
        {/* Background Image - Emotionally engaging category-specific imagery */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${category.heroImage})` }}
        ></div>

        {/* Emotional Gradient Overlay - Warm and aspirational */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/50 to-green-900/40"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 font-poppins drop-shadow-2xl leading-tight">
              {category.title}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 drop-shadow-lg leading-relaxed">
              {category.subtitle}
            </p>
          </div>
        </div>

        {/* Emotional trust indicators */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white text-sm font-medium">
            💫 Discover {category.subCategories.reduce((sum, cat) => sum + cat.count, 0)}+ inspiring designs
          </div>
        </div>
      </section>

      {/* Sticky Search & Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search ${category.title.toLowerCase()} designs...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#2E7D32]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Sort Dropdown */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
              >
                <option value="popular">Sort by: Popular</option>
                <option value="recent">Sort by: Recent</option>
                <option value="rating">Sort by: Rating</option>
                <option value="budget-low">Budget: Low to High</option>
                <option value="budget-high">Budget: High to Low</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#2E7D32] text-white"
                >
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-2 text-white hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sub-Categories Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins mb-4">
              Explore {category.title}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.subCategories.map((subCategory, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <img
                    src={subCategory.image}
                    alt={subCategory.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {subCategory.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {subCategory.count} designs available
                  </p>
                  <button className="w-full bg-[#2E7D32] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1b5e20] transition-colors duration-300">
                    View Designs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professionals Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins mb-4">
              Verified Professionals
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with experienced professionals specializing in {category.title.toLowerCase()}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional, index) => (
              <div
                key={professional.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={professional.image}
                    alt={professional.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {professional.name}
                      </h3>
                      {professional.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[#2E7D32] font-medium mb-1">{professional.role}</p>
                    <p className="text-gray-600 text-sm mb-2">{professional.specialization}</p>
                    <p className="text-gray-500 text-xs mb-3">{professional.experience}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.floor(professional.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                        <span className="ml-2 text-gray-700 font-medium">{professional.rating}</span>
                      </div>
                      <span className="text-gray-500 text-sm">{professional.projects} projects</span>
                    </div>
                    <button className="w-full mt-4 bg-[#2E7D32] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1b5e20] transition-colors duration-300">
                      Contact Professional
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Gallery */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover inspiring {category.title.toLowerCase()} projects completed by our verified professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProjects.map((project, index) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1 shadow-sm">
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-800">{project.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {project.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.location}
                    </span>
                    <span className="font-semibold text-[#2E7D32]">{project.budget}</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-3">by {project.designer}</p>
                  <Link
                    href={`/projects/${project.id}`}
                    className="inline-block w-full bg-[#2E7D32] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1b5e20] transition-colors duration-300 text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-[#2E7D32] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg text-green-100 mb-8">
            Get started with your {category.title.toLowerCase()} project today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/requirements/submit"
              className="inline-block bg-white text-[#2E7D32] px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors duration-300"
            >
              Submit Requirement
            </Link>
            <Link
              href="/register/professional"
              className="inline-block bg-green-800 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-900 transition-colors duration-300"
            >
              Join as Professional
            </Link>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2C2C2C] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold font-poppins mb-4">BRIXXO</h3>
              <p className="text-gray-400 text-sm">
                Your trusted partner in construction and home improvement.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/projects" className="text-gray-400 hover:text-white transition-colors">Projects</Link></li>
                <li><Link href="/professionals" className="text-gray-400 hover:text-white transition-colors">Professionals</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/services/design" className="text-gray-400 hover:text-white transition-colors">Design</Link></li>
                <li><Link href="/services/construction" className="text-gray-400 hover:text-white transition-colors">Construction</Link></li>
                <li><Link href="/services/renovation" className="text-gray-400 hover:text-white transition-colors">Renovation</Link></li>
                <li><Link href="/services/interior" className="text-gray-400 hover:text-white transition-colors">Interior Design</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C8.396 0 7.609.035 6.298.129c-1.31.094-2.207.447-2.996.956-.81.512-1.496 1.198-2.008 2.008C1.283 4.29.93 5.187.836 6.498.742 7.809.707 8.596.707 12.017s.035 4.208.129 5.519c.094 1.31.447 2.207.956 2.996.512.81 1.198 1.496 2.008 2.008.81.512 1.707.865 2.996.956 1.31.094 2.098.129 5.519.129s4.208-.035 5.519-.129c1.31-.094 2.207-.447 2.996-.956.81-.512 1.496-1.198 2.008-2.008.512-.81.865-1.707.956-2.996.094-1.31.129-2.098.129-5.519s-.035-4.208-.129-5.519c-.094-1.31-.447-2.207-.956-2.996-.512-.81-1.198-1.496-2.008-2.008-.81-.512-1.707-.865-2.996-.956C16.225.035 15.438 0 11.817 0zM9.927 2.182c.378 0 .756.035 1.127.105.37.07.732.175 1.077.315.345.14.676.326.99.555.314.229.61.5.882.807.272.307.52.65.74.996.22.346.41.716.566 1.105.156.389.278.8.365 1.23.087.43.131.88.131 1.33s-.044.9-.131 1.33c-.087.43-.209.841-.365 1.23-.156.389-.346.759-.566 1.105-.22.346-.468.689-.74.996-.272.307-.568.578-.882.807-.314.229-.645.415-.99.555-.345.14-.707.245-1.077.315-.37.07-.749.105-1.127.105s-.756-.035-1.127-.105c-.37-.07-.732-.175-1.077-.315-.345-.14-.676-.326-.99-.555-.314-.229-.61-.5-.882-.807-.272-.307-.52-.65-.74-.996-.22-.346-.41-.716-.566-1.105-.156-.389-.278-.8-.365-1.23-.087-.43-.131-.88-.131-1.33s.044-.9.131-1.33c.087-.43.209-.841.365-1.23.156-.389.346-.759.566-1.105.22-.346.468-.689.74-.996.272-.307.568-.578.882-.807.314-.229.645-.415.99-.555.345-.14.707-.245 1.077-.315.37-.07.749-.105 1.127-.105zm4.89 2.182c-.917 0-1.661.744-1.661 1.661s.744 1.661 1.661 1.661 1.661-.744 1.661-1.661-.744-1.661-1.661-1.661zm-4.89 3.322c-2.483 0-4.5 2.017-4.5 4.5s2.017 4.5 4.5 4.5 4.5-2.017 4.5-4.5-2.017-4.5-4.5-4.5zm4.89 2.182c-.917 0-1.661.744-1.661 1.661s.744 1.661 1.661 1.661 1.661-.744 1.661-1.661-.744-1.661-1.661-1.661zm-4.89 3.322c-2.483 0-4.5 2.017-4.5 4.5s2.017 4.5 4.5 4.5 4.5-2.017 4.5-4.5-2.017-4.5-4.5-4.5z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} BRIXXO. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}