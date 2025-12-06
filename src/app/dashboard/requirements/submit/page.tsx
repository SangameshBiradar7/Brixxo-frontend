'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
   Home,
   Wrench,
   RefreshCw,
   PenTool,
   Upload,
   X,
   Check,
   ArrowRight,
   ArrowLeft,
   Calendar,
   MapPin,
   DollarSign,
   FileText,
   Image as ImageIcon
} from 'lucide-react';

interface ServiceOption {
   id: string;
   title: string;
   description: string;
   icon: React.ReactNode;
}

interface RequirementFormData {
   serviceType: string;
   title: string;
   description: string;
   location: string;
   budget: number;
   timeline: {
     startDate: string;
     endDate: string;
   };
   priority: string;
   requestMultipleQuotes: boolean;
   attachments: File[];
}

const serviceOptions: ServiceOption[] = [
   {
     id: 'interior-design',
     title: 'Interior Design',
     description: 'Complete interior design and decoration services',
     icon: <Home className="w-8 h-8" />
   },
   {
     id: 'construction',
     title: 'Construction',
     description: 'New construction and building services',
     icon: <Wrench className="w-8 h-8" />
   },
   {
     id: 'renovation',
     title: 'Renovation',
     description: 'Home renovation and remodeling services',
     icon: <RefreshCw className="w-8 h-8" />
   },
   {
     id: 'architecture',
     title: 'Architecture',
     description: 'Architectural design and planning services',
     icon: <PenTool className="w-8 h-8" />
   }
];

export default function SubmitRequirementPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RequirementFormData>({
    serviceType: '',
    title: '',
    description: '',
    location: '',
    budget: 100000,
    timeline: {
      startDate: '',
      endDate: ''
    },
    priority: 'medium',
    requestMultipleQuotes: true,
    attachments: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof RequirementFormData] as any,
          [child]: value
        }
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'budget') {
      setFormData(prev => ({
        ...prev,
        budget: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceType: serviceId
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('serviceType', formData.serviceType);
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('location', formData.location);
      submitData.append('budget', formData.budget.toString());
      submitData.append('timeline', JSON.stringify(formData.timeline));
      submitData.append('priority', formData.priority);
      submitData.append('requestMultipleQuotes', formData.requestMultipleQuotes.toString());

      formData.attachments.forEach((file, index) => {
        submitData.append(`attachments`, file);
      });

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${backendUrl}/requirements`, {
        method: 'POST',
        body: submitData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      alert('Your requirement has been submitted successfully! Companies will start sending quotes soon.');
      router.push('/dashboard/requirements');
    } catch (error: any) {
      console.error('Error submitting requirement:', error);
      alert(error.message || 'Failed to submit requirement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  // Check if user is authenticated and has homeowner role
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to submit project requirements.</p>
          <Link href="/login" className="mt-4 inline-block bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (user.role !== 'homeowner') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only homeowners can submit project requirements.</p>
          <p className="text-sm text-gray-500 mt-2">Your current role: {user.role}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-teal-600 transition-colors">
                BRIXXO
              </Link>
            </div>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Submit Project Requirement</h1>
          <p className="text-gray-600">Get competitive quotes from verified construction professionals</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step <= currentStep
                    ? 'bg-teal-600 text-white'
                    : step === currentStep + 1 ? 'bg-teal-100 text-teal-600 border-2 border-teal-600'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 mx-2 transition-colors ${
                    step < currentStep ? 'bg-teal-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of 4: {
                currentStep === 1 ? 'Select Service' :
                currentStep === 2 ? 'Project Details' :
                currentStep === 3 ? 'Attachments' : 'Review & Submit'
              }
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">What service do you need?</h2>
                <p className="text-gray-600">Choose the type of service that best matches your project</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceOptions.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service.id)}
                    className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      formData.serviceType === service.id
                        ? 'border-teal-500 bg-teal-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        formData.serviceType === service.id ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{service.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      </div>
                      {formData.serviceType === service.id && (
                        <Check className="w-5 h-5 text-teal-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Project Details */}
          {currentStep === 2 && (
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="e.g., Modern 3BHK Villa Interior Design"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
                  placeholder="Describe your project requirements, expectations, and any specific needs..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                    placeholder="e.g., Bangalore, Karnataka"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Budget Range (₹)
                  </label>
                  <input
                    type="range"
                    name="budget"
                    min="50000"
                    max="5000000"
                    step="50000"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>₹50K</span>
                    <span className="font-semibold text-teal-600">₹{formData.budget.toLocaleString()}</span>
                    <span>₹50L</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    name="timeline.startDate"
                    value={formData.timeline.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  >
                    <option value="low">Low - Flexible timeline</option>
                    <option value="medium">Medium - Standard timeline</option>
                    <option value="high">High - Urgent requirement</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="multipleQuotes"
                  name="requestMultipleQuotes"
                  checked={formData.requestMultipleQuotes}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <label htmlFor="multipleQuotes" className="text-sm text-gray-700">
                  Request multiple quotes to compare options
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Attachments */}
          {currentStep === 3 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Project Files</h2>
                <p className="text-gray-600">Add images, documents, or plans to help professionals understand your project better</p>
              </div>

              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Drag & drop files here</h3>
                <p className="text-gray-600 mb-4">or click to browse files</p>
                <p className="text-sm text-gray-500">Supported formats: JPG, PNG, PDF, DOC, DWG (Max 10MB each)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.dwg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* File List */}
              {formData.attachments.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-medium text-gray-900">Uploaded Files ({formData.attachments.length})</h4>
                  {formData.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="w-5 h-5 text-gray-500" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Review Your Requirement</h2>
                <p className="text-gray-600">Please review all details before submitting</p>
              </div>

              <div className="space-y-6">
                {/* Service Type */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Service Type</h3>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      {serviceOptions.find(s => s.id === formData.serviceType)?.icon}
                    </div>
                    <span className="text-gray-700">
                      {serviceOptions.find(s => s.id === formData.serviceType)?.title}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Project Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Title:</span>
                      <span className="ml-2 text-gray-600">{formData.title}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Budget:</span>
                      <span className="ml-2 text-gray-600">₹{formData.budget.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <span className="ml-2 text-gray-600">{formData.location}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Priority:</span>
                      <span className="ml-2 text-gray-600 capitalize">{formData.priority}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="mt-1 text-gray-600 text-sm">{formData.description}</p>
                  </div>
                </div>

                {/* Attachments */}
                {formData.attachments.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Attachments ({formData.attachments.length})</h3>
                    <div className="space-y-2">
                      {formData.attachments.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <FileText className="w-4 h-4" />
                          <span>{file.name}</span>
                          <span className="text-gray-400">({formatFileSize(file.size)})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    By submitting this requirement, you agree to receive quotes from verified professionals.
                    You can review and accept quotes through your dashboard.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={currentStep === 1 && !formData.serviceType}
                  className="flex items-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Submitting...' : 'Submit Requirement'}
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-teal-50 border border-teal-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-teal-900 mb-2">Need Help?</h3>
          <p className="text-teal-800 text-sm">
            Our team is here to help you create the perfect project requirement.
            The more details you provide, the better quotes you'll receive from construction professionals.
          </p>
        </div>
      </div>
    </div>
  );
}