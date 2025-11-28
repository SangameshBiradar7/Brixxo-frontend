'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Navigation from '@/components/Navigation';

interface Requirement {
  _id: string;
  title: string;
  description: string;
  budget: number;
  budgetRange: string;
  location: string;
  buildingType: string;
  size: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  timeline: {
    startDate: string;
    endDate: string;
  };
  priority: string;
  homeowner: {
    name: string;
    location: string;
  };
  createdAt: string;
}

export default function AvailableRequirementsPage() {
  const { user } = useAuth();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    buildingType: 'all',
    location: '',
    budgetRange: 'all'
  });

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.buildingType !== 'all') params.append('buildingType', filters.buildingType);
        if (filters.location) params.append('location', filters.location);
        if (filters.budgetRange !== 'all') params.append('budgetRange', filters.budgetRange);

        const response = await axios.get(`/api/requirements/open?${params.toString()}`);
        setRequirements(response.data.requirements || []);
      } catch (error) {
        console.error('Error fetching requirements:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'company_admin' || user?.role === 'professional') {
      fetchRequirements();
    }
  }, [user, filters]);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (user?.role !== 'company_admin' && user?.role !== 'professional') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only company administrators and professionals can view project requirements.</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Project Requirements</h1>
          <p className="text-gray-600">Browse open project requirements and submit your quotes</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Building Type</label>
              <select
                value={filters.buildingType}
                onChange={(e) => setFilters(prev => ({ ...prev, buildingType: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option value="all" className="text-black">All Types</option>
                <option value="Apartment" className="text-black">Apartment</option>
                <option value="Villa" className="text-black">Villa</option>
                <option value="Duplex" className="text-black">Duplex</option>
                <option value="Triplex" className="text-black">Triplex</option>
                <option value="Bungalow" className="text-black">Bungalow</option>
                <option value="Commercial" className="text-black">Commercial</option>
                <option value="Industrial" className="text-black">Industrial</option>
                <option value="Institutional" className="text-black">Institutional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black"
                placeholder="Search by location..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <select
                value={filters.budgetRange}
                onChange={(e) => setFilters(prev => ({ ...prev, budgetRange: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
              >
                <option value="all" className="text-black">All Budgets</option>
                <option value="Under ₹10L" className="text-black">Under ₹10L</option>
                <option value="₹10L - ₹25L" className="text-black">₹10L - ₹25L</option>
                <option value="₹25L - ₹50L" className="text-black">₹25L - ₹50L</option>
                <option value="₹50L - ₹1Cr" className="text-black">₹50L - ₹1Cr</option>
                <option value="₹1Cr - ₹2Cr" className="text-black">₹1Cr - ₹2Cr</option>
                <option value="Above ₹2Cr" className="text-black">Above ₹2Cr</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading requirements...</p>
          </div>
        ) : requirements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Requirements Found</h3>
            <p className="text-gray-600">No project requirements match your current filters. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requirements.map((requirement) => (
              <div key={requirement._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{requirement.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(requirement.priority)}`}>
                          {requirement.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      <p className="text-gray-600 line-clamp-2 mb-3">{requirement.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {requirement.homeowner.name}</span>
                        <span>•</span>
                        <span>Posted {new Date(requirement.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Budget</span>
                      <p className="font-semibold text-green-600">{formatCurrency(requirement.budget)}</p>
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
                      <span className="text-sm text-gray-500">Timeline</span>
                      <p className="font-semibold text-gray-900">
                        {calculateTimelineDays(requirement.timeline.startDate, requirement.timeline.endDate)} days
                      </p>
                    </div>
                  </div>

                  {requirement.size && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Size</span>
                        <p className="font-semibold text-gray-900">{requirement.size} sq ft</p>
                      </div>
                      {requirement.bedrooms && (
                        <div>
                          <span className="text-sm text-gray-500">Bedrooms</span>
                          <p className="font-semibold text-gray-900">{requirement.bedrooms}</p>
                        </div>
                      )}
                      {requirement.bathrooms && (
                        <div>
                          <span className="text-sm text-gray-500">Bathrooms</span>
                          <p className="font-semibold text-gray-900">{requirement.bathrooms}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {requirement.features && requirement.features.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm text-gray-500 block mb-2">Required Features</span>
                      <div className="flex flex-wrap gap-1">
                        {requirement.features.slice(0, 6).map((feature, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {feature}
                          </span>
                        ))}
                        {requirement.features.length > 6 && (
                          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                            +{requirement.features.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Expected start: {new Date(requirement.timeline.startDate).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        href={`/dashboard/quotes/submit/${requirement._id}`}
                        className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Submit Quote
                      </Link>
                      <button
                        onClick={() => {
                          // Show more details modal or expand card
                          alert('Detailed view coming soon!');
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{requirements.length}</div>
              <div className="text-sm text-gray-500">Available Requirements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {requirements.filter(r => r.priority === 'urgent' || r.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-500">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(requirements.reduce((sum, r) => sum + r.budget, 0))}
              </div>
              <div className="text-sm text-gray-500">Total Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(requirements.reduce((sum, r) => sum + r.budget, 0) / requirements.length) || 0}
              </div>
              <div className="text-sm text-gray-500">Avg. Budget</div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Submit Quotes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs mt-0.5">1</div>
              <div>
                <div className="font-medium">Review Requirements</div>
                <div>Carefully read the project details and homeowner preferences</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs mt-0.5">2</div>
              <div>
                <div className="font-medium">Prepare Your Quote</div>
                <div>Create detailed design proposal with accurate budget and timeline</div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-bold text-xs mt-0.5">3</div>
              <div>
                <div className="font-medium">Submit & Follow Up</div>
                <div>Submit your quote and be ready to discuss with the homeowner</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}