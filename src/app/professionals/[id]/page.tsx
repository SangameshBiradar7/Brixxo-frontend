'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import {
  Hammer,
  Palette,
  Compass,
  Wrench,
  Home,
  Sofa,
  Ruler,
  ChefHat,
  Building,
  FileText,
  Eye,
  Zap,
  Thermometer,
  CheckCircle,
  User,
  Image,
  Briefcase,
  Settings
} from 'lucide-react';

type TabType = 'about' | 'portfolio' | 'projects' | 'services';

// Professional service icon mapping
const getServiceIcon = (service: string) => {
  const serviceLower = service.toLowerCase();

  if (serviceLower.includes('construction') || serviceLower.includes('building')) {
    return Hammer;
  }
  if (serviceLower.includes('interior') || serviceLower.includes('design')) {
    return Palette;
  }
  if (serviceLower.includes('architectural') || serviceLower.includes('plans')) {
    return Compass;
  }
  if (serviceLower.includes('engineering') || serviceLower.includes('structural')) {
    return Wrench;
  }
  if (serviceLower.includes('renovation') || serviceLower.includes('remodeling')) {
    return Home;
  }
  if (serviceLower.includes('furniture') || serviceLower.includes('space planning')) {
    return Sofa;
  }
  if (serviceLower.includes('kitchen')) {
    return ChefHat;
  }
  if (serviceLower.includes('3d') || serviceLower.includes('visualization')) {
    return Eye;
  }
  if (serviceLower.includes('hvac') || serviceLower.includes('electrical')) {
    return Zap;
  }
  if (serviceLower.includes('commercial')) {
    return Building;
  }

  // Default icon
  return CheckCircle;
};

interface Professional {
  _id: string;
  name: string;
  description: string;
  services: string[];
  specialties: string[];
  portfolio: string[];
  rating: number;
  reviewCount: number;
  location?: {
    city: string;
    state: string;
    zipCode?: string;
  };
  professionalType: string;
  phone?: string;
  email?: string;
  website?: string;
  license?: string;
  businessHours?: any;
  reviews?: any[];
  tagline?: string;
}

export default function ProfessionalDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('about');

  // Load professional details
  useEffect(() => {
    const loadProfessional = async () => {
      if (!id) return;

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/professionals/${id}`);
        setProfessional(response.data);
        if (response.data.portfolio && response.data.portfolio.length > 0) {
          setSelectedImage(response.data.portfolio[0]);
        }
      } catch (error) {
        console.error('Error loading professional:', error);
        router.push('/professionals');
      } finally {
        setLoading(false);
      }
    };

    loadProfessional();
  }, [id, router]);

  const handleContact = () => {
    if (user) {
      router.push(`/conversations?professional=${id}`);
    } else {
      router.push(`/login?redirect=/conversations?professional=${id}`);
    }
  };

  const handleSendInquiry = () => {
    if (user) {
      router.push(`/conversations?professional=${id}&action=inquiry`);
    } else {
      router.push(`/login?redirect=/conversations?professional=${id}&action=inquiry`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Not Found</h2>
            <Link href="/professionals" className="text-blue-600 hover:text-blue-800">
              ← Back to Professionals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-8 lg:mb-0">
              <Link href="/professionals" className="text-slate-300 hover:text-white text-sm font-medium mb-4 inline-block transition-colors">
                ← Back to Professionals
              </Link>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 font-poppins">{professional.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-emerald-500 text-white font-semibold capitalize shadow-lg">
                  {professional.professionalType?.replace('_', ' ') || 'Professional'}
                </span>
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <svg className="w-5 h-5 text-amber-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-semibold">{professional.rating || 4.5}</span>
                  <span className="text-slate-300 ml-2">({professional.reviewCount || 0} reviews)</span>
                </div>
              </div>
              <p className="text-xl text-slate-200 italic font-light leading-relaxed max-w-2xl">
                "Crafting excellence through dedication and innovative design solutions."
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleContact}
                className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                💬 Contact Professional
              </button>
              <button
                onClick={handleSendInquiry}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                📝 Send Inquiry
              </button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-teal-500/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-slate-600/30 rounded-full blur-xl"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-xl mb-12 border border-slate-100 overflow-hidden">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-0">
              {[
                { id: 'about', label: 'About', icon: User, desc: 'Learn more about us' },
                { id: 'portfolio', label: 'Portfolio', icon: Image, desc: 'View our work' },
                { id: 'projects', label: 'Projects', icon: Briefcase, desc: 'Completed projects' },
                { id: 'services', label: 'Services', icon: Settings, desc: 'What we offer' }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex-1 py-6 px-4 border-b-4 font-semibold text-sm transition-all duration-300 hover:bg-slate-50 ${
                      activeTab === tab.id
                        ? 'border-teal-500 text-teal-600 bg-teal-50'
                        : 'border-transparent text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <IconComponent className="w-6 h-6" />
                      <span>{tab.label}</span>
                      <span className="text-xs text-slate-500 font-normal">{tab.desc}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Content */}
            {activeTab === 'about' && (
              <div className="space-y-8">
                {/* About Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 font-poppins">About {professional.name}</h2>
                    <p className="text-xl text-slate-600 italic font-light">
                      "Excellence is not an act, but a habit. We build with passion and precision."
                    </p>
                  </div>

                  <div className="prose max-w-none">
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 mb-8">
                      <p className="text-slate-700 leading-relaxed text-lg mb-0">
                        {professional.description || 'This professional brings extensive experience and expertise to every project, committed to delivering exceptional results that exceed expectations.'}
                      </p>
                    </div>

                    {/* Professional Type Badge */}
                    <div className="mb-8 text-center">
                      <span className="inline-flex items-center px-6 py-3 rounded-full text-sm bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold shadow-lg">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {professional.professionalType?.replace('_', ' ') || 'Professional'}
                      </span>
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center justify-center mb-8">
                      <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
                        <div className="flex items-center">
                          <div className="flex text-amber-400 mr-3">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <div className="text-center">
                            <span className="text-slate-900 font-bold text-xl block">{professional.rating || 4.5}</span>
                            <span className="text-slate-500 text-sm">({professional.reviewCount || 0} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    {professional.specialties && professional.specialties.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center font-poppins">Our Specialties</h3>
                        <div className="flex flex-wrap gap-3 justify-center">
                          {professional.specialties.map((specialty, index) => {
                            const IconComponent = getServiceIcon(specialty);
                            return (
                              <span key={index} className="inline-flex items-center px-4 py-2 rounded-full text-sm bg-gradient-to-r from-teal-50 to-teal-100 text-teal-800 font-semibold border border-teal-200 shadow-sm">
                                <IconComponent className="w-4 h-4 mr-2 text-teal-600" />
                                {specialty}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* License */}
                    {professional.license && (
                      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                        <h3 className="text-xl font-bold text-emerald-900 mb-3 font-poppins">Professional License</h3>
                        <p className="text-emerald-800 font-medium text-lg">{professional.license}</p>
                        <p className="text-emerald-700 text-sm mt-2 italic">
                          "Licensed and insured for your peace of mind."
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="space-y-8">
                {/* Portfolio Section */}
                {professional.portfolio && professional.portfolio.length > 0 ? (
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-slate-900 mb-4 font-poppins">Portfolio Gallery</h2>
                      <p className="text-slate-600 italic">
                        "Showcasing excellence through our completed projects and craftsmanship."
                      </p>
                    </div>

                    {/* Main Image */}
                    {selectedImage && (
                      <div className="mb-8">
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                          <img
                            src={selectedImage}
                            alt="Portfolio work"
                            className="w-full h-96 md:h-[500px] object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    )}

                    {/* Thumbnail Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {professional.portfolio.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(image)}
                          className={`relative overflow-hidden rounded-xl border-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                            selectedImage === image
                              ? 'border-teal-500 ring-4 ring-teal-200 shadow-lg'
                              : 'border-slate-200 hover:border-teal-300'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-24 md:h-32 object-cover transition-transform duration-300"
                          />
                          {selectedImage === image && (
                            <div className="absolute inset-0 bg-teal-500 bg-opacity-30 flex items-center justify-center">
                              <CheckCircle className="w-8 h-8 text-white drop-shadow-lg" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 text-center bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
                      <p className="text-slate-700 font-medium">
                        Click on any image to view it in full size. This portfolio showcases {professional.name}'s completed work and expertise.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-100">
                    <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Image className="w-12 h-12 text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 font-poppins">Portfolio Coming Soon</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      This professional hasn't uploaded portfolio images yet. Check back soon to see their exceptional work!
                    </p>
                    <div className="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
                      <p className="text-teal-800 text-sm">
                        📸 Portfolio images help clients visualize the quality of work and build trust.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-8">
                {/* Projects Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Projects</h2>

                  {/* Placeholder for projects - in a real app, this would come from a projects API */}
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Showcase</h3>
                    <p className="text-gray-600 mb-6">
                      {professional.name} has successfully completed numerous projects. Here are some highlights:
                    </p>

                    {/* Sample project cards - in real app, these would be dynamic */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                      {[
                        { title: 'Modern Villa Design', type: 'Residential', year: '2024', description: 'Complete architectural design for a luxury villa' },
                        { title: 'Commercial Complex', type: 'Commercial', year: '2023', description: 'Multi-story commercial building design' },
                        { title: 'Sustainable Housing', type: 'Residential', year: '2023', description: 'Eco-friendly housing project' },
                        { title: 'Office Renovation', type: 'Commercial', year: '2022', description: 'Modern office space redesign' }
                      ].map((project, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {project.type}
                            </span>
                            <span className="text-sm text-gray-500">{project.year}</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
                          <p className="text-gray-600 text-sm">{project.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                      <p className="text-blue-800 text-sm">
                        📞 Contact {professional.name} to discuss your project requirements and get a personalized quote.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-8">
                {/* Services Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Services Offered</h2>

                  {professional.services && professional.services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {professional.services.map((service, index) => {
                        const IconComponent = getServiceIcon(service);
                        return (
                          <div key={index} className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                                  <IconComponent className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{service}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                  Professional {service.toLowerCase()} services with attention to detail and quality craftsmanship.
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Services Information</h3>
                      <p className="text-gray-600">
                        Detailed service information will be available soon. Contact {professional.name} for specific service inquiries.
                      </p>
                    </div>
                  )}

                  {/* Service Process */}
                  <div className="mt-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 mb-4 font-poppins">Our Service Process</h3>
                      <p className="text-slate-600 italic">
                        "Every great project begins with a vision and ends with excellence."
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[
                        { step: '1', title: 'Consultation', desc: 'Initial discussion of your needs', icon: '💬' },
                        { step: '2', title: 'Planning', desc: 'Detailed project planning', icon: '📋' },
                        { step: '3', title: 'Execution', desc: 'Professional implementation', icon: '⚡' },
                        { step: '4', title: 'Delivery', desc: 'Final delivery and support', icon: '🎯' }
                      ].map((process, index) => (
                        <div key={index} className="text-center bg-white rounded-xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                          <div className="text-3xl mb-4">{process.icon}</div>
                          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg shadow-lg">
                            {process.step}
                          </div>
                          <h4 className="font-bold text-slate-900 mb-2 text-lg">{process.title}</h4>
                          <p className="text-slate-600 text-sm leading-relaxed">{process.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {professional.location && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-gray-700 font-medium">Location</p>
                      <p className="text-gray-600 text-sm">
                        {professional.location.city}, {professional.location.state}
                        {professional.location.zipCode && ` ${professional.location.zipCode}`}
                      </p>
                    </div>
                  </div>
                )}

                {professional.phone && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <p className="text-gray-700 font-medium">Phone</p>
                      <p className="text-gray-600 text-sm">{professional.phone}</p>
                    </div>
                  </div>
                )}

                {professional.website && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0113.971 9h1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-gray-700 font-medium">Website</p>
                      <a
                        href={professional.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        {professional.website}
                      </a>
                    </div>
                  </div>
                )}

                {professional.license && (
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-gray-700 font-medium">License</p>
                      <p className="text-gray-600 text-sm">{professional.license}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleContact}
                  className="w-full bg-slate-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                >
                  💬 Start Conversation
                </button>
                <button
                  onClick={handleSendInquiry}
                  className="w-full border-2 border-slate-900 text-slate-900 py-3 px-4 rounded-lg font-medium hover:bg-slate-900 hover:text-white transition-colors"
                >
                  📝 Send Project Inquiry
                </button>
                <Link
                  href="/dashboard/requirements/submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
                >
                  📋 Submit Your Requirements
                </Link>
              </div>
            </div>

            {/* Business Hours */}
            {professional.businessHours && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Business Hours</h3>
                <div className="space-y-2">
                  {Object.entries(professional.businessHours).map(([day, hours]: [string, any]) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-700 capitalize">{day}</span>
                      <span className="text-gray-600">
                        {hours.open && hours.close ? `${hours.open} - ${hours.close}` : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}