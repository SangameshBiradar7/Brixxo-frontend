'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';
import Link from 'next/link';

export default function AddProjectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [project, setProject] = useState({
    title: '',
    description: '',
    type: '',
    location: '',
    area: '',
    budget: '',
    completionDate: '',
    features: [] as string[],
    images: [] as string[]
  });

  const [newFeature, setNewFeature] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);

  // Check if user is company_admin
  if (user && user.role !== 'company_admin') {
    router.push('/dashboard');
    return null;
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
      setIsEdit(true);
      setProjectId(editId);
      loadProjectForEdit(editId);
    }
  }, []);

  const loadProjectForEdit = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const projectData = response.data;
      setProject({
        title: projectData.title || '',
        description: projectData.description || '',
        type: projectData.buildingType || '',
        location: projectData.location || '',
        area: projectData.size || '',
        budget: projectData.budget || '',
        completionDate: projectData.completionDate || '',
        features: projectData.features || [],
        images: projectData.images || []
      });
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Failed to load project for editing');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const projectData = {
        title: project.title,
        description: project.description,
        buildingType: project.type,
        location: project.location,
        size: project.area ? parseInt(project.area) : undefined,
        budget: project.budget ? parseInt(project.budget.replace(/[^\d]/g, '')) : undefined,
        completionDate: project.completionDate,
        features: project.features,
        images: project.images
      };

      let response;
      if (isEdit) {
        response = await axios.put(`http://localhost:5000/api/projects/company/${projectId}`, projectData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Project updated:', response.data);
        alert('Project updated successfully!');
      } else {
        response = await axios.post('http://localhost:5000/api/projects/company', projectData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log('Project created:', response.data);
        alert('Project added successfully!');
      }

      router.push('/dashboard/projects/manage');
    } catch (error: any) {
      console.error('Error saving project:', error);
      alert(error.response?.data?.message || `Error ${isEdit ? 'updating' : 'adding'} project`);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !project.features.includes(newFeature.trim())) {
      setProject(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setProject(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    console.log('🔄 Starting image upload for', files.length, 'files');
    setUploadingImages(true);
    const formData = new FormData();

    // Add all selected files to form data
    for (let i = 0; i < files.length; i++) {
      console.log(`📎 Adding file ${i + 1}:`, files[i].name, 'Size:', files[i].size, 'Type:', files[i].type);
      formData.append('images', files[i]);
    }

    try {
      console.log('📤 Sending upload request to /api/uploads/images');
      const response = await axios.post('/api/uploads/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      console.log('✅ Upload response:', response.data);

      // Add uploaded image URLs to project
      const uploadedUrls = response.data.urls || [];
      console.log('📸 Uploaded URLs:', uploadedUrls);

      setProject(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));

      if (uploadedUrls.length > 0) {
        alert(`Successfully uploaded ${uploadedUrls.length} image(s)!`);
      } else {
        alert('Images uploaded successfully (using demo images for development)');
      }
    } catch (error: any) {
      console.error('❌ Error uploading images:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setUploadingImages(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const removeImage = (image: string) => {
    setProject(prev => ({
      ...prev,
      images: prev.images.filter(img => img !== image)
    }));
  };

  const projectTypes = [
    'Apartment',
    'Villa',
    'Duplex',
    'Triplex',
    'Bungalow',
    'Commercial',
    'Industrial',
    'Institutional'
  ];

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
              {isEdit ? 'Edit Project' : 'Add New Project'}
            </h1>
            <p className="mt-2 text-gray-600">
              {isEdit
                ? 'Update your project details and showcase your work.'
                : 'Showcase your completed construction project to attract potential clients.'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={project.title}
                    onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    placeholder="e.g., Modern Luxury Villa Complex"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type *
                  </label>
                  <select
                    required
                    value={project.type}
                    onChange={(e) => setProject(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 bg-white"
                  >
                    <option value="" className="text-slate-600">Select project type</option>
                    {projectTypes.map(type => (
                      <option key={type} value={type} className="text-slate-900 bg-white">{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={project.location}
                    onChange={(e) => setProject(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Area (sq ft)
                  </label>
                  <input
                    type="text"
                    value={project.area}
                    onChange={(e) => setProject(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    placeholder="e.g., 50,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={project.budget}
                    onChange={(e) => setProject(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    placeholder="e.g., ₹12 Cr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Completion Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={project.completionDate}
                    onChange={(e) => setProject(prev => ({ ...prev, completionDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                    placeholder="e.g., December 2024"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={project.description}
                  onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  placeholder="Describe the project, challenges faced, solutions implemented, and final results..."
                />
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  placeholder="e.g., Sustainable Design, Smart Home Technology"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.features.map((feature) => (
                  <span key={feature} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Images</h2>
              <p className="text-gray-600 mb-4">
                Upload high-quality images of your completed project directly from your computer.
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
              {project.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Project Images ({project.images.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {project.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Project image ${index + 1}`}
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
                    Hover over images to remove them. These images will be displayed on your project page.
                  </p>
                </div>
              )}

              {project.images.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No images uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-1">Upload images to showcase your project</p>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (isEdit ? 'Updating Project...' : 'Adding Project...') : (isEdit ? 'Update Project' : 'Add Project')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}