'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Navigation from '@/components/Navigation';

interface Requirement {
  _id: string;
  title: string;
  description: string;
  designPreferences: string;
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
  homeowner: {
    name: string;
    email: string;
  };
}

interface QuoteFormData {
  designProposal: string;
  estimatedBudget: string;
  timeline: {
    startDate: string;
    endDate: string;
  };
  additionalNotes: string;
  budgetBreakdown: {
    materials: string;
    labor: string;
    equipment: string;
    permits: string;
    overhead: string;
    profit: string;
    other: string;
  };
  milestones: Array<{
    name: string;
    description: string;
    estimatedDate: string;
    percentage: string;
  }>;
  terms: {
    paymentSchedule: string;
    cancellationPolicy: string;
    revisionPolicy: string;
    warranty: string;
  };
}

export default function SubmitQuotePage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const requirementId = params.requirementId as string;

  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuoteFormData>({
    designProposal: '',
    estimatedBudget: '',
    timeline: {
      startDate: '',
      endDate: ''
    },
    additionalNotes: '',
    budgetBreakdown: {
      materials: '',
      labor: '',
      equipment: '',
      permits: '',
      overhead: '',
      profit: '',
      other: ''
    },
    milestones: [
      { name: 'Foundation', description: '', estimatedDate: '', percentage: '20' },
      { name: 'Structure', description: '', estimatedDate: '', percentage: '40' },
      { name: 'Finishing', description: '', estimatedDate: '', percentage: '30' },
      { name: 'Handover', description: '', estimatedDate: '', percentage: '10' }
    ],
    terms: {
      paymentSchedule: '',
      cancellationPolicy: '',
      revisionPolicy: '',
      warranty: ''
    }
  });

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        const response = await axios.get(`/api/requirements/${requirementId}/public`);
        setRequirement(response.data);
        
        // Set default timeline based on requirement
        if (response.data.timeline) {
          setFormData(prev => ({
            ...prev,
            timeline: {
              startDate: response.data.timeline.startDate.split('T')[0],
              endDate: response.data.timeline.endDate.split('T')[0]
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching requirement:', error);
        router.push('/dashboard/quotes');
      } finally {
        setLoading(false);
      }
    };

    if ((user?.role === 'company_admin' || user?.role === 'professional') && requirementId) {
      fetchRequirement();
    }
  }, [user, requirementId, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof QuoteFormData] as any,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMilestoneChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) => 
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { name: '', description: '', estimatedDate: '', percentage: '' }]
    }));
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = {
        requirement: requirementId,
        designProposal: formData.designProposal,
        estimatedBudget: parseFloat(formData.estimatedBudget),
        additionalNotes: formData.additionalNotes,
        budgetBreakdown: {
          materials: parseFloat(formData.budgetBreakdown.materials) || 0,
          labor: parseFloat(formData.budgetBreakdown.labor) || 0,
          equipment: parseFloat(formData.budgetBreakdown.equipment) || 0,
          permits: parseFloat(formData.budgetBreakdown.permits) || 0,
          overhead: parseFloat(formData.budgetBreakdown.overhead) || 0,
          profit: parseFloat(formData.budgetBreakdown.profit) || 0,
          other: parseFloat(formData.budgetBreakdown.other) || 0
        },
        timeline: {
          ...formData.timeline,
          milestones: formData.milestones.filter(m => m.name).map(m => ({
            ...m,
            percentage: parseFloat(m.percentage) || 0
          }))
        },
        terms: formData.terms
      };

      await axios.post('/api/quotes', submitData);
      
      alert('Your quote has been submitted successfully! The homeowner will review it soon.');
      router.push('/dashboard/quotes');
    } catch (error: any) {
      console.error('Error submitting quote:', error);
      alert(error.response?.data?.message || 'Failed to submit quote. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  if (user?.role !== 'company_admin' && user?.role !== 'professional') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only company administrators and professionals can submit quotes.</p>
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

  if (!requirement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirement Not Found</h2>
          <p className="text-gray-600">The requirement you're looking for doesn't exist or is no longer available.</p>
          <Link href="/dashboard/quotes" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            ← Back to Available Requirements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <Link href="/dashboard/quotes" className="hover:text-gray-700">Available Requirements</Link>
            <span>→</span>
            <span>Submit Quote</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Quote</h1>
          <p className="text-gray-600">Provide your detailed proposal for this construction project</p>
        </div>

        {/* Requirement Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Requirement</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">{requirement.title}</h3>
              <p className="text-gray-600 mb-4">{requirement.description}</p>
              {requirement.designPreferences && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Design Preferences</h4>
                  <p className="text-gray-600 text-sm">{requirement.designPreferences}</p>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                  <span className="text-sm text-gray-500">Size</span>
                  <p className="font-semibold text-gray-900">{requirement.size} sq ft</p>
                </div>
              </div>
              {requirement.features && requirement.features.length > 0 && (
                <div>
                  <span className="text-sm text-gray-500">Required Features</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {requirement.features.map((feature, index) => (
                      <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-500">
              Step {currentStep} of 3: {
                currentStep === 1 ? 'Design & Budget' :
                currentStep === 2 ? 'Timeline & Milestones' : 'Terms & Conditions'
              }
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          {/* Step 1: Design & Budget */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design Proposal *
                </label>
                <textarea
                  name="designProposal"
                  required
                  rows={6}
                  value={formData.designProposal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black"
                  placeholder="Describe your design approach, architectural style, materials, construction methodology, and how you'll meet the client's requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Budget (₹) *
                </label>
                <input
                  type="number"
                  name="estimatedBudget"
                  required
                  min="0"
                  value={formData.estimatedBudget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black"
                  placeholder="Enter your total project estimate"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Client's budget: {formatCurrency(requirement?.budget || 0)}
                </p>
              </div>

              {/* Budget Breakdown */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Breakdown (Optional)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(formData.budgetBreakdown).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {key}
                      </label>
                      <input
                        type="number"
                        name={`budgetBreakdown.${key}`}
                        min="0"
                        value={value}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="₹"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Timeline & Milestones */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Start Date *
                  </label>
                  <input
                    type="date"
                    name="timeline.startDate"
                    required
                    value={formData.timeline.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Completion Date *
                  </label>
                  <input
                    type="date"
                    name="timeline.endDate"
                    required
                    value={formData.timeline.endDate}
                    onChange={handleInputChange}
                    min={formData.timeline.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Project Milestones */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Project Milestones</h3>
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Milestone
                  </button>
                </div>
                
                <div className="space-y-4">
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                      <div>
                        <input
                          type="text"
                          placeholder="Milestone name"
                          value={milestone.name}
                          onChange={(e) => handleMilestoneChange(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black placeholder-black"
                        />
                      </div>
                      <div>
                        <input
                          type="date"
                          placeholder="Estimated date"
                          value={milestone.estimatedDate}
                          onChange={(e) => handleMilestoneChange(index, 'estimatedDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="% Complete"
                          min="0"
                          max="100"
                          value={milestone.percentage}
                          onChange={(e) => handleMilestoneChange(index, 'percentage', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black placeholder-black"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Description"
                          value={milestone.description}
                          onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black placeholder-black"
                        />
                        {formData.milestones.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMilestone(index)}
                            className="p-2 text-red-600 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Terms & Conditions */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Schedule
                </label>
                <textarea
                  name="terms.paymentSchedule"
                  rows={3}
                  value={formData.terms.paymentSchedule}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black"
                  placeholder="e.g., 20% advance, 30% on foundation completion, 30% on structure completion, 20% on handover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty Period
                  </label>
                  <input
                    type="text"
                    name="terms.warranty"
                    value={formData.terms.warranty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black"
                    placeholder="e.g., 5 years structural, 1 year finishing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revision Policy
                  </label>
                  <input
                    type="text"
                    name="terms.revisionPolicy"
                    value={formData.terms.revisionPolicy}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black"
                    placeholder="e.g., 2 free revisions, additional charges apply"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancellation Policy
                </label>
                <textarea
                  name="terms.cancellationPolicy"
                  rows={3}
                  value={formData.terms.cancellationPolicy}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black"
                  placeholder="Describe your cancellation terms, refund policy, and notice period requirements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="additionalNotes"
                  rows={4}
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black"
                  placeholder="Any additional information, special considerations, or terms you'd like to mention..."
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-4">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Submitting Quote...' : 'Submit Quote'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}