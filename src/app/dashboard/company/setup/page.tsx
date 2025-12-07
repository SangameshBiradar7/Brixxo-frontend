'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { api } from '@/lib/api';
import Link from 'next/link';

export default function CompanySetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [company, setCompany] = useState({
    _id: '',
    name: '',
    description: '',
    website: '',
    phone: '',
    address: '',
    services: [] as string[],
    specializations: [] as string[],
    certifications: [] as string[],
    established: '',
    employees: '',
    portfolioImages: [] as string[],
    rating: 0,
    isVerified: false,
    createdAt: ''
  });

  const [newService, setNewService] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Check if user is company_admin and load existing company data
  useEffect(() => {
    if (user && user.role !== 'company_admin') {
      router.push('/dashboard');
      return;
    }

    // Load existing company data
    const loadCompanyData = async () => {
      try {
        const response = await api.get('/companies/my/company');
        if (response.data) {
          setIsEditMode(true);
          setCompany({
            _id: response.data._id || '',
            name: response.data.name || '',
            description: response.data.description || '',
            website: response.data.website || '',
            phone: response.data.phone || '',
            address: response.data.address || '',
            services: response.data.services || [],
            specializations: response.data.specializations || [],
            certifications: response.data.certifications || [],
            established: response.data.established || '',
            employees: response.data.employees || '',
            portfolioImages: response.data.portfolioImages || [],
            rating: response.data.rating || 0,
            isVerified: response.data.isVerified || false,
            createdAt: response.data.createdAt || ''
          });
          setPortfolioImages(response.data.portfolioImages || []);
        }
      } catch (error) {
        console.log('No existing company found, showing create form');
        // No existing company, show create form
      }
    };

    if (user) {
      loadCompanyData();
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare company data - exclude _id for new companies
      const { _id, ...companyFields } = company;
      const companyData = {
        ...companyFields,
        portfolioImages: portfolioImages
      };

      let savedCompany;
      if (isEditMode) {
        // Update existing company - include _id for updates
        const updateData = {
          ...company,
          portfolioImages: portfolioImages
        };
        const response = await api.put('/companies/my/company', updateData);
        savedCompany = response.data;
        alert('Company profile updated successfully!');
      } else {
        // Create new company - exclude _id (let MongoDB generate it)
        const response = await api.post('/companies', companyData);
        savedCompany = response.data;
        alert('Company profile created successfully! Your portfolio images have been uploaded.');
      }

      // Redirect to company profile page if we have the company ID
      if (savedCompany && savedCompany._id) {
        router.push(`/companies/${savedCompany._id}`);
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Error saving company:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error saving company profile';
      console.error('Full error details:', error.response?.data);
      alert(`Error saving company profile: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your company profile? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete('/companies/my/company');
      alert('Company profile deleted successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error deleting company:', error);
      alert(error.response?.data?.message || 'Error deleting company profile');
    }
  };

  const addService = () => {
    if (newService.trim() && !company.services.includes(newService.trim())) {
      setCompany(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setCompany(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  const addSpecialization = () => {
    if (newSpecialization.trim() && !company.specializations.includes(newSpecialization.trim())) {
      setCompany(prev => ({
        ...prev,
        specializations: [...prev.specializations, newSpecialization.trim()]
      }));
      setNewSpecialization('');
    }
  };

  const removeSpecialization = (specialization: string) => {
    setCompany(prev => ({
      ...prev,
      specializations: prev.specializations.filter(s => s !== specialization)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim() && !company.certifications.includes(newCertification.trim())) {
      setCompany(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certification: string) => {
    setCompany(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== certification)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const formData = new FormData();

    // Add all selected files to form data
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const response = await api.upload('/uploads/images', formData);

      // Add uploaded image URLs to portfolio
      const uploadedUrls = response.data.urls || [];
      setPortfolioImages(prev => [...prev, ...uploadedUrls]);

      if (uploadedUrls.length > 0) {
        alert(`Successfully uploaded ${uploadedUrls.length} image(s)!`);
      } else {
        alert('Images uploaded successfully (using demo images for development)');
      }
    } catch (error: any) {
      console.error('Error uploading images:', error);
      console.error('Full error details:', error.response?.data);

      // Provide specific error message
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to upload images';
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setUploadingImages(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const removeImage = (imageUrl: string) => {
    setPortfolioImages(prev => prev.filter(img => img !== imageUrl));
  };

  if (user?.role !== 'company_admin') {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  DreamBuild
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-700 hover:text-gray-900">
                  Home
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <span className="text-gray-500">|</span>
                <span className="text-gray-700">Welcome, {user?.name}</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Manage Your Company Profile' : 'Set Up Your Company Profile'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEditMode
                ? 'Update your company information, services, and portfolio to attract more clients.'
                : 'Create your professional company profile to showcase your work and attract clients.'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={company.name}
                    onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="Enter your company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={company.website}
                    onChange={(e) => setCompany(prev => ({ ...prev, website: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="https://www.yourcompany.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={company.phone}
                    onChange={(e) => setCompany(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="+91-9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Established
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={company.established}
                    onChange={(e) => setCompany(prev => ({ ...prev, established: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="2020"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={company.description}
                  onChange={(e) => setCompany(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Describe your company, expertise, and what makes you unique..."
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Address *
                </label>
                <textarea
                  required
                  rows={3}
                  value={company.address}
                  onChange={(e) => setCompany(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Full business address including city and state"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Employees
                </label>
                <select
                  value={company.employees}
                  onChange={(e) => setCompany(prev => ({ ...prev, employees: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="" className="text-black">Select employee count</option>
                  <option value="1-10" className="text-black">1-10 employees</option>
                  <option value="11-50" className="text-black">11-50 employees</option>
                  <option value="51-200" className="text-black">51-200 employees</option>
                  <option value="201-500" className="text-black">201-500 employees</option>
                  <option value="500+" className="text-black">500+ employees</option>
                </select>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Services Offered</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="e.g., Residential Construction"
                />
                <button
                  type="button"
                  onClick={addService}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {company.services.map((service) => (
                  <span key={service} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {service}
                    <button
                      type="button"
                      onClick={() => removeService(service)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Specializations</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSpecialization}
                  onChange={(e) => setNewSpecialization(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="e.g., Green Building, Historic Restoration"
                />
                <button
                  type="button"
                  onClick={addSpecialization}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {company.specializations.map((specialization) => (
                  <span key={specialization} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    {specialization}
                    <button
                      type="button"
                      onClick={() => removeSpecialization(specialization)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications & Licenses</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="e.g., ISO 9001, LEED Certified"
                />
                <button
                  type="button"
                  onClick={addCertification}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {company.certifications.map((certification) => (
                  <span key={certification} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                    {certification}
                    <button
                      type="button"
                      onClick={() => removeCertification(certification)}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Portfolio Images */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Images</h2>
              <p className="text-gray-600 mb-4">
                Upload images of your completed work to showcase your expertise to potential clients.
              </p>

              {/* Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadingImages ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImages}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Image Gallery */}
              {portfolioImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Portfolio ({portfolioImages.length} images)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {portfolioImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Portfolio image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeImage(imageUrl)}
                            className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-all duration-200"
                            title="Remove image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Hover over images to remove them. These images will be displayed on your company profile.
                  </p>
                </div>
              )}

              {portfolioImages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No portfolio images uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-1">Upload images to showcase your work</p>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>💡 <strong>Pro Tip:</strong> {isEditMode ? 'Update your profile regularly to attract more clients.' : 'Your portfolio images will be displayed on your company profile page.'}</p>
              </div>
              <div className="flex gap-3">
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete Company
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (isEditMode ? 'Update Company Profile' : 'Save Company Profile')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}