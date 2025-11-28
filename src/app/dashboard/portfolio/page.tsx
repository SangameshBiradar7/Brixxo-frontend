'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';
import Link from 'next/link';

export default function PortfolioPage() {
  const { user } = useAuth();
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load portfolio images
  useEffect(() => {
    const loadPortfolio = async () => {
      if (user?.role === 'professional') {
        try {
          const response = await axios.get('/api/professionals/my/profile');
          if (response.data && response.data.portfolio) {
            setPortfolioImages(response.data.portfolio);
          }
        } catch (error) {
          console.log('Error loading portfolio:', error);
        }
      } else if (user?.role === 'company_admin') {
        try {
          const response = await axios.get('/api/companies/my/company');
          if (response.data && response.data.portfolioImages) {
            setPortfolioImages(response.data.portfolioImages);
          }
        } catch (error) {
          console.log('Error loading portfolio:', error);
        }
      }
      setLoading(false);
    };

    if (user) {
      loadPortfolio();
    }
  }, [user]);

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
      const response = await axios.post('/api/uploads/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      // Add uploaded image URLs to portfolio
      const uploadedUrls = response.data.urls || [];
      const newImages = [...portfolioImages, ...uploadedUrls];
      setPortfolioImages(newImages);

      // Update profile/portfolio
      if (user?.role === 'professional') {
        await axios.put('/api/professionals/my/profile', { portfolio: newImages });
      } else if (user?.role === 'company_admin') {
        await axios.put('/api/companies/my/company', { portfolioImages: newImages });
      }

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

  const removeImage = async (imageUrl: string) => {
    if (!confirm('Are you sure you want to remove this image from your portfolio?')) {
      return;
    }

    try {
      const newImages = portfolioImages.filter(img => img !== imageUrl);
      setPortfolioImages(newImages);

      // Update profile/portfolio
      if (user?.role === 'professional') {
        await axios.put('/api/professionals/my/profile', { portfolio: newImages });
      } else if (user?.role === 'company_admin') {
        await axios.put('/api/companies/my/company', { portfolioImages: newImages });
      }

      alert('Image removed from portfolio successfully!');
    } catch (error: any) {
      console.error('Error removing image:', error);
      alert('Failed to remove image. Please try again.');
      // Revert the change
      setPortfolioImages(portfolioImages);
    }
  };

  if (user?.role !== 'professional' && user?.role !== 'company_admin') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
            <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              Go back to Dashboard
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
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

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Portfolio</h1>
            <p className="mt-2 text-gray-600">
              Upload and manage images of your completed work to showcase your expertise to potential clients.
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Images</h2>
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

          {/* Portfolio Gallery */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Portfolio ({portfolioImages.length} images)
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading portfolio...</span>
              </div>
            ) : portfolioImages.length > 0 ? (
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
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No portfolio images yet</p>
                <p className="text-sm text-gray-400 mt-1">Upload your first images above to get started</p>
              </div>
            )}

            {portfolioImages.length > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                Hover over images to remove them. These images will be displayed on your profile to attract clients.
              </p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}