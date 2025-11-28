'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface ProfessionalForm {
  name: string;
  description: string;
  logo: string;
  website: string;
  phone: string;
  address: string;
  services: string[];
  specialties: string[];
  license: string;
  insurance: string;
  location: {
    city: string;
    state: string;
    zipCode: string;
  };
  businessHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string };
  };
}

export default function ProfessionalSetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [portfolioImages, setPortfolioImages] = useState<File[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<ProfessionalForm>({
    name: '',
    description: '',
    logo: '',
    website: '',
    phone: '',
    address: '',
    services: [],
    specialties: [],
    license: '',
    insurance: '',
    location: {
      city: '',
      state: '',
      zipCode: ''
    },
    businessHours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: { open: '09:00', close: '17:00' }
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadExistingProfile();
  }, [user, router]);

  const loadExistingProfile = async () => {
    try {
      const response = await axios.get('/api/professionals/my/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data) {
        setExistingProfile(response.data);
        setFormData({
          name: response.data.name || '',
          description: response.data.description || '',
          logo: response.data.logo || '',
          website: response.data.website || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          services: response.data.services || [],
          specialties: response.data.specialties || [],
          license: response.data.license || '',
          insurance: response.data.insurance || '',
          location: response.data.location || { city: '', state: '', zipCode: '' },
          businessHours: response.data.businessHours || formData.businessHours
        });
      }
    } catch (error) {
      // Profile doesn't exist yet, that's fine
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location.city.trim()) newErrors.city = 'City is required';
    if (!formData.location.state.trim()) newErrors.state = 'State is required';
    if (formData.services.length === 0) newErrors.services = 'At least one service is required';
    if (formData.specialties.length === 0) newErrors.specialties = 'At least one specialty is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLocationChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBusinessHoursChange = (day: string, field: 'open' | 'close', value: string) => {
    setFormData(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day as keyof typeof prev.businessHours],
          [field]: value
        }
      }
    }));
  };

  const handleArrayFieldChange = (field: 'services' | 'specialties', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: 'services' | 'specialties', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleLogoUpload = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    try {
      const response = await axios.post('/api/uploads', formDataUpload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData(prev => ({ ...prev, logo: response.data.url }));
      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
    }
  };

  const handlePortfolioUpload = async (files: FileList) => {
    const formDataUpload = new FormData();
    Array.from(files).forEach(file => {
      formDataUpload.append('images', file);
    });

    try {
      const response = await axios.post('/api/uploads/multiple', formDataUpload, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      // Assuming the response contains URLs of uploaded images
      const newImages = response.data.urls || [];
      setPortfolioImages(prev => [...prev, ...Array.from(files)]);
      toast.success(`${newImages.length} images uploaded successfully`);
    } catch (error) {
      toast.error('Failed to upload portfolio images');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const url = existingProfile ? '/api/professionals/my/profile' : '/api/professionals';
      const method = existingProfile ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success(existingProfile ? 'Profile updated successfully!' : 'Profile created successfully!');
      router.push('/dashboard/professional');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const renderPreviewCard = () => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {formData.logo ? (
          <img
            src={formData.logo}
            alt={formData.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-sm font-medium">Professional Photo</p>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
          <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-xs font-semibold text-gray-800">4.5</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {formData.name || 'Professional Name'}
        </h3>

        <div className="flex flex-wrap gap-1 mb-3">
          {formData.specialties.slice(0, 2).map((specialty, index) => (
            <span key={index} className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">
              {specialty}
            </span>
          ))}
          {formData.specialties.length > 2 && (
            <span className="text-xs text-gray-500">+{formData.specialties.length - 2} more</span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {formData.description || 'Professional description will appear here.'}
        </p>

        {formData.location.city && formData.location.state && (
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {formData.location.city}, {formData.location.state}
          </div>
        )}

        <div className="flex gap-3 mt-auto">
          <button className="flex-1 bg-gray-900 text-white text-center py-3 px-4 rounded-lg font-medium text-sm">
            View Profile
          </button>
          <button className="flex-1 border-2 border-gray-900 text-gray-900 text-center py-3 px-4 rounded-lg font-medium text-sm">
            Contact
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={['contractor', 'architect', 'interior-designer', 'professional', 'company_admin']}>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {existingProfile ? 'Edit Professional Profile' : 'Create Professional Profile'}
            </h1>
            <p className="text-lg text-gray-600">
              {existingProfile
                ? 'Update your professional information to attract more clients.'
                : 'Set up your professional profile to start receiving inquiries from homeowners.'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., John Smith Construction"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe your services, experience, and what makes you unique..."
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="https://www.yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number
                    </label>
                    <input
                      type="text"
                      value={formData.license}
                      onChange={(e) => handleInputChange('license', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Professional license number"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.location.city}
                      onChange={(e) => handleLocationChange('city', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="City"
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.location.state}
                      onChange={(e) => handleLocationChange('state', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="State"
                    />
                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      value={formData.location.zipCode}
                      onChange={(e) => handleLocationChange('zipCode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="12345"
                    />
                  </div>
                </div>
              </div>

              {/* Services and Specialties */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Services & Specialties</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Services Offered *
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        id="service-input"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Add a service"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            handleArrayFieldChange('services', input.value);
                            input.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('service-input') as HTMLInputElement;
                          handleArrayFieldChange('services', input.value);
                          input.value = '';
                        }}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.services.map((service, index) => (
                        <span key={index} className="inline-flex items-center bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">
                          {service}
                          <button
                            type="button"
                            onClick={() => removeArrayItem('services', index)}
                            className="ml-2 text-teal-600 hover:text-teal-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    {errors.services && <p className="mt-1 text-sm text-red-600">{errors.services}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialties *
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        id="specialty-input"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Add a specialty"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.target as HTMLInputElement;
                            handleArrayFieldChange('specialties', input.value);
                            input.value = '';
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('specialty-input') as HTMLInputElement;
                          handleArrayFieldChange('specialties', input.value);
                          input.value = '';
                        }}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.specialties.map((specialty, index) => (
                        <span key={index} className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {specialty}
                          <button
                            type="button"
                            onClick={() => removeArrayItem('specialties', index)}
                            className="ml-2 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    {errors.specialties && <p className="mt-1 text-sm text-red-600">{errors.specialties}</p>}
                  </div>
                </div>
              </div>

              {/* Media Upload */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Media</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Logo/Photo
                    </label>
                    <div className="flex items-center gap-4">
                      {formData.logo && (
                        <img src={formData.logo} alt="Logo" className="w-16 h-16 object-cover rounded-lg" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setLogoFile(file);
                            handleLogoUpload(file);
                          }
                        }}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio Images (Max 10)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handlePortfolioUpload(files);
                        }
                      }}
                      className="w-full"
                    />
                    {portfolioImages.length > 0 && (
                      <p className="mt-2 text-sm text-gray-600">
                        {portfolioImages.length} image{portfolioImages.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Live Preview</h2>
                <div className="max-w-sm">
                  {renderPreviewCard()}
                </div>
              </div>
            </div>
          </form>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (existingProfile ? 'Update Profile' : 'Create Profile')}
            </button>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}