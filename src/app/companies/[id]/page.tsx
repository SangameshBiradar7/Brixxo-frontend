'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import ChatModal from '@/components/ChatModal';

// Interface for Company data from backend API
interface Company {
  _id: string;
  name: string;
  description?: string;
  category: string;
  location: string;
  logoUrl?: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  whatsapp?: string;
  address?: string;
  services?: string[];
  specializations?: string[];
  certifications?: string[];
  established?: string;
  employees?: string;
  rating?: number;
  isVerified?: boolean;
  createdAt: string;
  admin?: {
    name: string;
    email: string;
  };
  pastProjects?: any[];
  reviews?: any[];
}

// Loading skeleton component
function CompanyDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const companyId = params.id as string;

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Load company details from backend API
  const loadCompanyDetails = async () => {
    try {
      console.log('🔄 CompanyDetailPage: Fetching company details for ID:', companyId);
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Company not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ CompanyDetailPage: Received company data:', data);

      setCompany(data);
    } catch (err) {
      console.error('❌ CompanyDetailPage: Error loading company:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load company details';
      setError(errorMessage);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial load of company details
  useEffect(() => {
    if (companyId) {
      loadCompanyDetails();
    }
  }, [companyId]);

  // Handle retry on error
  const handleRetry = () => {
    console.log('🔄 CompanyDetailPage: Retrying to load company...');
    loadCompanyDetails();
  };

  // Loading state
  if (loading) {
    return <CompanyDetailSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Unable to load company</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleRetry}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <Link
                    href="/professionals"
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back to Companies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Company not found
  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Company Not Found</h1>
              <p className="text-gray-600 mb-6">The company you're looking for doesn't exist.</p>
              <Link
                href="/professionals"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Back to Companies
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex text-sm">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:text-blue-600">Home</Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link href="/professionals" className="text-gray-500 hover:text-blue-600">Companies</Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <span className="text-gray-900 font-medium">{company.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Company Header Banner */}
      <section className="relative h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        {company.logo && (
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="flex items-center space-x-8 text-white">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              {company.logo || company.logoUrl ? (
                <Image
                  src={company.logo || company.logoUrl!}
                  alt={company.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-poppins mb-2">{company.name}</h1>
              <p className="text-lg mb-4 opacity-90">Professional {company.category} Services</p>
              <div className="flex items-center space-x-6 mb-4">
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.floor(company.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-semibold">{company.rating || 0}/5.0</span>
                </div>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {company.pastProjects?.length || 0} Projects Completed
                </span>
                {company.isVerified && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    ✅ Verified Company
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowContactModal(true)}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
              >
                Contact Company
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Side - Company Details */}
          <div className="lg:col-span-2 space-y-8">

            {/* About the Company */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-6">About the Company</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {company.description || 'Professional construction company providing high-quality services.'}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{company.established || '2020'}</div>
                      <div className="text-sm text-gray-600">Founded</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{company.employees || '10-50'}</div>
                      <div className="text-sm text-gray-600">Team Size</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Specializations</h3>
                  <div className="space-y-2">
                    {company.services && company.services.length > 0 ? (
                      company.services.map((service, index) => (
                        <div key={index} className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{service}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">Specialization details coming soon.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Portfolio/Projects Section */}
            <section className="bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 font-poppins">Portfolio</h2>
              </div>

              {company.pastProjects && company.pastProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {company.pastProjects.slice(0, 6).map((project: any) => (
                    <div key={project._id} className="group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="relative">
                        {project.images && project.images.length > 0 ? (
                          <Image
                            src={project.images[0].startsWith('http') ? project.images[0] : `/api/uploads/${project.images[0]}`}
                            alt={project.title}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                          <span className={`text-xs font-semibold ${
                            project.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                          }`}>
                            {project.status === 'completed' ? 'Completed' : 'Ongoing'}
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                        <div className="flex items-center mb-2">
                          <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-gray-600 text-sm">{project.location}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                        <Link
                          href={`/projects/${project._id}`}
                          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Projects Yet</h3>
                  <p className="text-gray-600">This company hasn't completed any projects yet.</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Side - Company Info Sidebar */}
          <div className="space-y-6">

            {/* Company Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">Company Information</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 capitalize">
                    {company.category}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Location</h4>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {company.location}
                  </div>
                </div>

                {company.contactPhone && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Phone</h4>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {company.contactPhone}
                    </div>
                  </div>
                )}

                {company.contactEmail && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {company.contactEmail}
                    </div>
                  </div>
                )}

                {company.website && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Website</h4>
                    <a
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  href="/professionals"
                  className="inline-block w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center mb-4"
                >
                  View More Companies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Company Modal */}
      {company && user && (
        <ChatModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          conversationId={`${user._id}-${company._id}`}
          otherUser={{
            _id: company._id,
            name: company.name
          }}
          inquiryId={undefined}
          companyInfo={{
            phone: company.contactPhone,
            whatsapp: company.whatsapp,
            email: company.contactEmail,
            website: company.website,
            address: company.address
          }}
        />
      )}
    </div>
  );
}