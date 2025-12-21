'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';

interface Company {
  _id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  phone?: string;
  address?: string;
  services: string[];
  specializations: string[];
  certifications: string[];
  established?: string;
  employees?: string;
  rating: number;
  isVerified: boolean;
  createdAt: string;
}

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

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = async () => {
    try {
      console.log('🔄 CompaniesPage: Fetching companies from API...');
      setLoading(true);
      setError(null);

      const response = await fetch('/api/companies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ CompaniesPage: Received companies data:', data);

      setCompanies(data || []);
    } catch (err) {
      console.error('❌ CompaniesPage: Error loading companies:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load companies';
      setError(errorMessage);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleRetry = () => {
    console.log('🔄 CompaniesPage: Retrying to load companies...');
    loadCompanies();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-poppins">Construction Companies</h1>
            <p className="text-xl text-gray-600">
              Discover verified construction companies ready to bring your projects to life
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <CompanyCardSkeleton key={index} />
              ))}
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

          {/* Companies Grid */}
          {!loading && !error && (
            <>
              {companies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {companies.map((company, index) => (
                    <div
                      key={company._id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-500 border border-gray-100 h-full group cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => window.open(`/companies/${company._id}`, '_blank')}
                    >
                      {/* Company Logo/Image */}
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                        {company.logo ? (
                          <Image
                            src={company.logo}
                            alt={company.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                            <div className="text-center text-slate-500">
                              <svg className="w-20 h-20 mx-auto mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <p className="text-sm font-medium">Company</p>
                            </div>
                          </div>
                        )}

                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Verified Badge */}
                        {company.isVerified && (
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
                            {company.rating.toFixed(1)}
                          </span>
                        </div>

                        {/* Services overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white text-sm italic font-light bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 leading-tight">
                            "{company.services.slice(0, 2).join(', ')}{company.services.length > 2 ? '...' : ''}"
                          </p>
                        </div>
                      </div>

                      {/* Company Details */}
                      <div className="p-6 flex flex-col h-full">
                        {/* Company Name & Type */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-slate-900 mb-1 font-poppins group-hover:text-slate-700 transition-colors">
                            {company.name}
                          </h3>
                          <p className="text-slate-600 text-sm font-medium">
                            {company.specializations[0] || 'Construction Company'}
                          </p>
                        </div>

                        {/* Specializations */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {company.specializations.slice(0, 2).map((specialty, idx) => (
                            <span key={idx} className="bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full font-medium border border-teal-100 group-hover:bg-teal-100 transition-colors">
                              {specialty}
                            </span>
                          ))}
                          {company.specializations.length > 2 && (
                            <span className="text-xs text-slate-500 font-medium">
                              +{company.specializations.length - 2} more
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {company.description && (
                          <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {company.description}
                          </p>
                        )}

                        {/* Location & Experience */}
                        <div className="flex items-center justify-between text-slate-500 text-sm mb-6">
                          {company.address && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {company.address}
                            </div>
                          )}
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {company.established ? `${new Date().getFullYear() - parseInt(company.established)} years` : 'New Company'}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mt-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle contact functionality
                              alert(`Contact request sent to ${company.name}`);
                            }}
                            className="flex-1 bg-emerald-600 text-white text-center py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Contact
                          </button>
                          <Link
                            href={`/companies/${company._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 bg-slate-900 text-white text-center py-3 px-4 rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    No Companies Yet
                  </h3>
                  <p className="text-slate-600 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                    Professional companies haven't joined our platform yet. Be the first to showcase your construction expertise!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/register/professional"
                      className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Register Your Company
                    </Link>
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