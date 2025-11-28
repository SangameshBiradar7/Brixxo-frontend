'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Search, Filter, MapPin, Star, CheckCircle, ArrowRight, Home, Wrench, Paintbrush, Hammer, Lightbulb, Shield, Users, Award } from 'lucide-react';

const topCategories = [
  {
    id: 1,
    name: 'Contractors',
    icon: Home,
    description: 'Complete home building and renovation experts',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop&crop=center',
    services: 1250,
    link: '/professionals?category=contractor'
  },
  {
    id: 2,
    name: 'Interior Designers',
    icon: Paintbrush,
    description: 'Transform your spaces with expert design',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
    services: 890,
    link: '/professionals?category=interior-designer'
  },
  {
    id: 3,
    name: 'Renovators',
    icon: Hammer,
    description: 'Modernize and upgrade your property',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop&crop=center',
    services: 675,
    link: '/professionals?category=renovator'
  },
  {
    id: 4,
    name: 'Architects',
    icon: Lightbulb,
    description: 'Professional architectural design services',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop&crop=center',
    services: 432,
    link: '/professionals?category=architect'
  }
];

const subcategories = [
  { name: 'Kitchen Remodeling', count: 156, link: '/professionals?category=renovator' },
  { name: 'Bathroom Renovation', count: 98, link: '/professionals?category=renovator' },
  { name: 'Flooring', count: 87, link: '/professionals?category=contractor' },
  { name: 'Painting', count: 203, link: '/professionals?category=contractor' },
  { name: 'Roofing', count: 76, link: '/professionals?category=contractor' },
  { name: 'HVAC', count: 145, link: '/professionals?category=engineer' },
  { name: 'Landscaping', count: 112, link: '/professionals?category=contractor' },
  { name: 'Smart Home', count: 89, link: '/professionals?category=engineer' }
];

const howItWorks = [
  {
    step: 1,
    title: 'Choose Your Service',
    description: 'Browse our curated categories and select the service that fits your needs.',
    icon: Search
  },
  {
    step: 2,
    title: 'Connect with Professionals',
    description: 'Get matched with verified, rated professionals in your area.',
    icon: Users
  },
  {
    step: 3,
    title: 'Get Your Project Done',
    description: 'Receive quality work with our satisfaction guarantee and support.',
    icon: CheckCircle
  }
];

const popularServices = [
  {
    name: 'Full Home Renovation',
    location: 'Mumbai, Maharashtra',
    rating: 4.9,
    reviews: 234,
    price: '₹2,50,000 - ₹8,50,000',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&h=200&fit=crop&crop=center'
  },
  {
    name: 'Modern Kitchen Design',
    location: 'Delhi, NCR',
    rating: 4.8,
    reviews: 189,
    price: '₹75,000 - ₹3,50,000',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&crop=center'
  },
  {
    name: 'Luxury Bathroom',
    location: 'Bangalore, Karnataka',
    rating: 4.9,
    reviews: 156,
    price: '₹50,000 - ₹2,50,000',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=300&h=200&fit=crop&crop=center'
  }
];

const featuredProfessionals = [
  {
    name: 'Rajesh Kumar',
    title: 'Senior Architect',
    rating: 4.9,
    projects: 127,
    experience: '12 years',
    specialization: 'Modern Residential Design',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    verified: true
  },
  {
    name: 'Priya Sharma',
    title: 'Interior Designer',
    rating: 4.8,
    projects: 89,
    experience: '8 years',
    specialization: 'Luxury Interiors',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    verified: true
  },
  {
    name: 'Amit Patel',
    title: 'Construction Manager',
    rating: 4.9,
    projects: 203,
    experience: '15 years',
    specialization: 'Commercial & Residential',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    verified: true
  }
];

const testimonials = [
  {
    name: 'Mrs. Anjali Gupta',
    location: 'Pune, Maharashtra',
    rating: 5,
    text: 'BRIXXO connected me with an amazing architect who transformed our old house into a modern dream home. The entire process was seamless and professional.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: 'Mr. Vikram Singh',
    location: 'Gurgaon, Haryana',
    rating: 5,
    text: 'Found reliable contractors for our office renovation. The quality of work exceeded our expectations. Highly recommend BRIXXO.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
  },
  {
    name: 'Mrs. Kavita Rao',
    location: 'Hyderabad, Telangana',
    rating: 5,
    text: 'The interior designer we found through BRIXXO created exactly what we envisioned. Professional, creative, and budget-friendly.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
  }
];

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', { searchQuery, selectedLocation, selectedCategory });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-charcoal/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-poppins leading-tight">
              Craft Your Perfect
              <span className="block text-[#D4AF37]">Living Space</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Discover premium construction and design services from verified professionals.
              Transform your vision into reality with our curated marketplace.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="What service do you need?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-gray-900"
                    >
                      <option value="">Select Location</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="delhi">Delhi</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="pune">Pune</option>
                      <option value="hyderabad">Hyderabad</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#2C2C2C] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#1a1a1a] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-2xl font-bold text-[#D4AF37]">5000+</div>
                <div className="text-sm text-gray-300">Verified Professionals</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-2xl font-bold text-[#D4AF37]">25000+</div>
                <div className="text-sm text-gray-300">Projects Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-2xl font-bold text-[#D4AF37]">4.8★</div>
                <div className="text-sm text-gray-300">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Categories Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">
                Top Categories
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore our most popular construction and home improvement services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={category.id}
                    href={category.link}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="w-12 h-12 bg-[#D4AF37]/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-2">
                          <IconComponent className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <h3 className="text-xl font-bold font-poppins">{category.name}</h3>
                        <p className="text-sm text-gray-200">{category.services} services available</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <div className="flex items-center text-[#D4AF37] font-semibold">
                        Explore Services
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Subcategories Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">
                Specialized Services
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Find exactly what you need from our comprehensive range of home improvement services
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {subcategories.map((subcategory, index) => (
                <Link
                  key={index}
                  href={subcategory.link}
                  className="bg-gray-50 hover:bg-[#D4AF37]/5 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg group"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {subcategory.name}
                  </h3>
                  <p className="text-sm text-gray-500">{subcategory.count} professionals</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-[#F5F5DC]/30">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simple steps to transform your home with professional expertise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {howItWorks.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.step}
                    className="text-center"
                    data-aos="fade-up"
                    data-aos-delay={index * 200}
                  >
                    <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-[#2C2C2C] text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Popular Services Near You */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-16">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">
                  Popular Services Near You
                </h2>
                <p className="text-xl text-gray-600">
                  Trending services in your area with verified professionals
                </p>
              </div>
              <div className="flex items-center gap-4 mt-6 md:mt-0">
                <MapPin className="w-6 h-6 text-[#D4AF37]" />
                <span className="text-gray-600 font-medium">Showing results for Mumbai</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popularServices.map((service, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative h-48">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold text-gray-800">{service.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">
                      {service.name}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {service.location}
                    </div>
                    <p className="text-[#D4AF37] font-semibold text-lg mb-4">
                      {service.price}
                    </p>
                    <button className="w-full bg-[#2C2C2C] text-white py-3 rounded-xl font-semibold hover:bg-[#1a1a1a] transition-colors">
                      Get Quotes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Professionals */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">
                Featured Professionals
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet our top-rated professionals who bring expertise and excellence to every project
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProfessionals.map((professional, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="relative mb-6">
                    <img
                      src={professional.image}
                      alt={professional.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-[#D4AF37]/20"
                    />
                    {professional.verified && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1 font-poppins">
                    {professional.name}
                  </h3>
                  <p className="text-[#D4AF37] font-semibold mb-3">{professional.title}</p>
                  <p className="text-gray-600 text-sm mb-4">{professional.specialization}</p>
                  <div className="flex justify-center items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      {professional.rating}
                    </div>
                    <div>{professional.projects} projects</div>
                    <div>{professional.experience}</div>
                  </div>
                  <button className="w-full bg-[#D4AF37] text-white py-3 rounded-xl font-semibold hover:bg-[#B8860B] transition-colors">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-poppins">
                What Our Customers Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real experiences from homeowners who found their perfect professionals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-8 relative"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[#2C2C2C] to-[#1a1a1a] text-white">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-poppins">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Join thousands of satisfied homeowners who found their perfect professionals through BRIXXO.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-[#D4AF37] text-[#2C2C2C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#B8860B] transition-colors shadow-lg hover:shadow-xl"
              >
                Join as Professional
              </Link>
              <Link
                href="/projects/add"
                className="bg-white text-[#2C2C2C] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
              >
                Post Your Project
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}