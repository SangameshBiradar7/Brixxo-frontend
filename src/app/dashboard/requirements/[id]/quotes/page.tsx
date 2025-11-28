'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Navigation from '@/components/Navigation';
import ContactCompanyModal from '@/components/ContactCompanyModal';

interface Quote {
  _id: string;
  company: {
    _id: string;
    name: string;
    rating: number;
    logo?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    admin: {
      _id: string;
      name: string;
      email: string;
    };
  };
  designProposal: string;
  estimatedBudget: number;
  timeline: {
    startDate: string;
    endDate: string;
  };
  additionalNotes: string;
  status: string;
  createdAt: string;
  validUntil: string;
}

interface Requirement {
  _id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  buildingType: string;
}

export default function QuotesComparisonPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const requirementId = params.id as string;

  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Quote['company'] | null>(null);
  const [sortBy, setSortBy] = useState<'budget' | 'timeline' | 'rating'>('budget');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqResponse, quotesResponse] = await Promise.all([
          axios.get(`/api/requirements/${requirementId}`),
          axios.get(`/api/requirements/${requirementId}/quotes`)
        ]);
        
        setRequirement(reqResponse.data);
        setQuotes(quotesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        router.push('/dashboard/requirements');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'homeowner' && requirementId) {
      fetchData();
    }
  }, [user, requirementId, router]);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const calculateTimelineDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSelectCompany = async (quoteId: string) => {
    try {
      await axios.put(`/api/requirements/${requirementId}/select-quote`, {
        quoteId
      });
      
      alert('Company selected successfully! You can now proceed with the project.');
      router.push('/dashboard/requirements');
    } catch (error: any) {
      console.error('Error selecting company:', error);
      alert(error.response?.data?.message || 'Failed to select company. Please try again.');
    }
  };

  const handleContactCompany = (company: Quote['company']) => {
    setSelectedCompany(company);
    setShowContactModal(true);
  };

  const sortedQuotes = [...quotes].sort((a, b) => {
    switch (sortBy) {
      case 'budget':
        return a.estimatedBudget - b.estimatedBudget;
      case 'timeline':
        return calculateTimelineDays(a.timeline.startDate, a.timeline.endDate) - 
               calculateTimelineDays(b.timeline.startDate, b.timeline.endDate);
      case 'rating':
        return b.company.rating - a.company.rating;
      default:
        return 0;
    }
  });

  if (user?.role !== 'homeowner') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only homeowners can view quotes.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/dashboard/requirements" className="hover:text-gray-700">My Requirements</Link>
            <span>→</span>
            <span>Quotes Comparison</span>
          </div>
          
          {requirement && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{requirement.title}</h1>
              <p className="text-gray-600 mb-4">{requirement.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Budget</span>
                  <p className="font-semibold text-gray-900">{formatCurrency(requirement.budget)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Type</span>
                  <p className="font-semibold text-gray-900">{requirement.buildingType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Location</span>
                  <p className="font-semibold text-gray-900">{requirement.location}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Quotes</span>
                  <p className="font-semibold text-gray-900">{quotes.length} received</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sort Options */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Quotes Comparison ({quotes.length})
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
            >
              <option value="budget" className="text-black">Budget (Low to High)</option>
              <option value="timeline" className="text-black">Timeline (Shortest first)</option>
              <option value="rating" className="text-black">Company Rating (High to Low)</option>
            </select>
          </div>
        </div>

        {quotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Quotes Yet</h3>
            <p className="text-gray-600">Companies haven't submitted quotes for this requirement yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedQuotes.map((quote) => (
              <div key={quote._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  {/* Company Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {quote.company.logo ? (
                        <img
                          src={quote.company.logo}
                          alt={quote.company.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{quote.company.name}</h3>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm text-gray-600">{quote.company.rating}/5.0</span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      quote.status === 'submitted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Quote Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Design Proposal</h4>
                      <p className="text-gray-600 text-sm line-clamp-3">{quote.designProposal}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Estimated Budget</h4>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(quote.estimatedBudget)}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-1">Timeline</h4>
                        <p className="text-lg font-semibold text-gray-900">
                          {calculateTimelineDays(quote.timeline.startDate, quote.timeline.endDate)} days
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(quote.timeline.startDate).toLocaleDateString()} - {new Date(quote.timeline.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {quote.additionalNotes && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Notes</h4>
                        <p className="text-gray-600 text-sm">{quote.additionalNotes}</p>
                      </div>
                    )}

                    <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                      Submitted on {new Date(quote.createdAt).toLocaleDateString()} • 
                      Valid until {new Date(quote.validUntil).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-6 border-t border-gray-200 mt-6">
                    <button
                      onClick={() => {
                        if (selectedQuotes.includes(quote._id)) {
                          setSelectedQuotes(prev => prev.filter(id => id !== quote._id));
                        } else {
                          setSelectedQuotes(prev => [...prev, quote._id]);
                        }
                      }}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        selectedQuotes.includes(quote._id)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {selectedQuotes.includes(quote._id) ? 'Selected' : 'Compare'}
                    </button>
                    
                    <button
                      onClick={() => handleSelectCompany(quote._id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Select Company
                    </button>
                    
                    <button
                      onClick={() => handleContactCompany(quote.company)}
                      className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comparison Panel */}
        {selectedQuotes.length > 1 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">
                  {selectedQuotes.length} quotes selected for comparison
                </span>
                <button
                  onClick={() => setSelectedQuotes([])}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear selection
                </button>
              </div>
              <button
                onClick={() => {
                  // Open detailed comparison modal or navigate to comparison page
                  router.push(`/dashboard/requirements/${requirementId}/quotes/compare?quotes=${selectedQuotes.join(',')}`);
                }}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Compare Selected
              </button>
            </div>
          </div>
        )}

        {/* Contact Company Modal */}
        {selectedCompany && (
          <ContactCompanyModal
            isOpen={showContactModal}
            onClose={() => {
              setShowContactModal(false);
              setSelectedCompany(null);
            }}
            company={selectedCompany}
            projectTitle={requirement?.title}
          />
        )}
      </div>
    </div>
  );
}