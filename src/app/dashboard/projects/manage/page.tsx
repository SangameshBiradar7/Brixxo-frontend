'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import axios from 'axios';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  location: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  images: string[];
}

export default function ManageProjectsPage() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImages, setUploadingImages] = useState<string | null>(null);
  const [deletingProject, setDeletingProject] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    budget: 0,
    location: ''
  });

  const loadProjects = async () => {
    // Only load projects if user is authenticated and is a company admin
    if (!user || user.role !== 'company_admin') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Loading company projects...');

      // Get projects created by this company
      const response = await axios.get('/api/projects/my/company', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('✅ Projects loaded:', response.data);
      setProjects(response.data);
    } catch (error: any) {
      console.error('❌ Error loading projects:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      const errorMessage = error.response?.data?.message || error.message || 'Failed to load projects';
      alert(`Failed to load projects: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
          <p className="text-gray-600">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  // Check if user is company_admin
  if (user.role !== 'company_admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Only construction companies can manage projects.</p>
          <p className="text-sm text-gray-500 mt-2">Your current role: {user.role}</p>
        </div>
      </div>
    );
  }

  const uploadProjectImages = async (projectId: string, files: FileList) => {
    try {
      setUploadingImages(projectId);

      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post('/api/uploads/images', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update project with new images
      const currentProject = projects.find(p => p._id === projectId);
      const existingImages = currentProject?.images || [];
      const newImages = [...existingImages, ...response.data.urls];

      await axios.put(`/api/projects/company/${projectId}`, { images: newImages }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      setProjects(prev => prev.map(project =>
        project._id === projectId ? { ...project, images: newImages } : project
      ));

      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploadingImages(null);
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingProject(projectId);
      await axios.delete(`/api/projects/company/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      setProjects(prev => prev.filter(project => project._id !== projectId));

      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    } finally {
      setDeletingProject(null);
    }
  };

  const startEditProject = (project: Project) => {
    setEditingProject(project);
    setEditForm({
      title: project.title,
      description: project.description,
      budget: project.budget,
      location: project.location
    });
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setEditForm({
      title: '',
      description: '',
      budget: 0,
      location: ''
    });
  };

  const saveEditProject = async () => {
    if (!editingProject) return;

    try {
      const response = await axios.put(`/api/projects/company/${editingProject._id}`, editForm, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      setProjects(prev => prev.map(project =>
        project._id === editingProject._id ? { ...project, ...editForm } : project
      ));

      alert('Project updated successfully!');
      cancelEdit();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const removeProjectImage = async (projectId: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to remove this image?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/projects/company/${projectId}/images`, {
        data: { imageUrl },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Update local state
      setProjects(prev => prev.map(project =>
        project._id === projectId ? { ...project, images: response.data.images } : project
      ));

      alert('Image removed successfully!');
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Failed to remove image');
    }
  };

  const createDemoProject = async () => {
    try {
      const demoProject = {
        title: 'Demo Project - Modern Villa Construction',
        description: 'A demonstration project to showcase the project management features. This is a sample 3BHK villa construction project in Bangalore.',
        budget: 7500000, // 75 lakhs
        location: 'Bangalore, Karnataka',
        size: 2500, // sq ft
        timeline: '12 months',
        designStyle: 'Modern Contemporary',
        features: ['3 Bedrooms', '3 Bathrooms', 'Living Room', 'Kitchen', 'Garden'],
        images: ['/images/modern-villa.jpg']
      };

      const response = await axios.post('/api/projects/demo', demoProject, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Demo project created:', response.data);
      alert(response.data.message || 'Demo project created successfully! You can now manage it.');
      loadProjects(); // Reload projects
    } catch (error: any) {
      console.error('Error creating demo project:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert('Failed to create demo project: ' + errorMessage);
    }
  };


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Project Portfolio Management</h1>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Manage your construction projects professionally. Update project details, track progress,
                showcase your work with images, and monitor client feedback.
              </p>
            </div>
            <div className="mt-8 flex justify-center">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
                    <div className="text-sm text-slate-600">Total Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects List */}
          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your projects...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white p-16 rounded-xl shadow-lg border border-slate-200 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <svg className="w-16 h-16 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Welcome to Your Project Portfolio</h3>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Build your professional reputation by showcasing your completed construction projects.
                Add detailed project information, high-quality images, and let clients discover your expertise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard/projects/add"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-semibold rounded-lg hover:from-slate-900 hover:to-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Your First Project
                </Link>
                <button
                  onClick={createDemoProject}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Try Demo Project
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {projects.map((project) => (
                <>
                  <div key={project._id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900">{project.title}</h3>
                            <div className="flex items-center mt-1">
                              <span className="text-sm text-slate-500">
                                {project.user ? 'Client Project' : 'Portfolio Project'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-slate-600 mb-6 leading-relaxed">{project.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                          <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm font-medium text-slate-700">Location</span>
                            </div>
                            <p className="text-slate-900 font-semibold">{project.location}</p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              <span className="text-sm font-medium text-slate-700">Budget</span>
                            </div>
                            <p className="text-slate-900 font-semibold">₹{project.budget.toLocaleString()}</p>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm font-medium text-slate-700">Created</span>
                            </div>
                            <p className="text-slate-900 font-semibold">
                              {new Date(project.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        {project.images && project.images.length > 0 && (
                          <div className="mb-4">
                            <span className="text-sm font-medium text-gray-500">Project Images</span>
                            <div className="flex space-x-2 mt-2">
                              {project.images.slice(0, 3).map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Project image ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg border"
                                />
                              ))}
                              {project.images.length > 3 && (
                                <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                                  <span className="text-xs text-gray-500">+{project.images.length - 3}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}


                        {/* Media Management */}
                        <div className="mb-6">
                          <div className="flex items-center space-x-2 mb-3">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h4 className="text-lg font-semibold text-slate-900">Project Gallery</h4>
                          </div>

                          {project.images && project.images.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                              {project.images.slice(0, 4).map((image, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={image}
                                    alt={`Project image ${index + 1}`}
                                    className="w-full h-20 object-cover rounded-lg border border-slate-200"
                                  />
                                  {project.images.length > 4 && index === 3 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                      <span className="text-white font-semibold">+{project.images.length - 4}</span>
                                    </div>
                                  )}
                                  {/* Delete button */}
                                  <button
                                    onClick={() => removeProjectImage(project._id, image)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    title="Remove image"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:border-slate-400 transition-colors">
                            <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  uploadProjectImages(project._id, e.target.files);
                                }
                              }}
                              disabled={uploadingImages === project._id}
                              className="hidden"
                              id={`image-upload-${project._id}`}
                            />
                            <label
                              htmlFor={`image-upload-${project._id}`}
                              className="cursor-pointer flex flex-col items-center"
                            >
                              <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <span className="text-sm font-medium text-slate-600">
                                {uploadingImages === project._id ? 'Uploading...' : 'Add Project Images'}
                              </span>
                              <span className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB each</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Action Panel */}
                      <div className="ml-8 flex flex-col space-y-3 min-w-[200px]">
                        <div className="bg-slate-50 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-slate-900 mb-3">Project Actions</h4>


                          {/* Management Actions */}
                          <div className="space-y-2">
                            <button
                              onClick={() => startEditProject(project)}
                              className="w-full inline-flex items-center justify-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit Details
                            </button>

                            <Link
                              href={`/projects/${project._id}`}
                              className="w-full inline-flex items-center justify-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Public Page
                            </Link>

                            <button
                              onClick={() => deleteProject(project._id)}
                              disabled={deletingProject === project._id}
                              className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 transition-colors"
                            >
                              {deletingProject === project._id ? (
                                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>Deleting...</>
                              ) : (
                                <><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>Delete Project</>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                </>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200">
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Edit Project Details</h3>
                  <p className="text-sm text-slate-600">Update project information to keep your portfolio current</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Project Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Project Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors resize-none"
                    placeholder="Describe the project details, scope, and key features"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Budget (₹)</label>
                    <input
                      type="number"
                      value={editForm.budget}
                      onChange={(e) => setEditForm(prev => ({ ...prev, budget: Number(e.target.value) }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors"
                      placeholder="City, State"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={cancelEdit}
                  className="px-6 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditProject}
                  className="px-6 py-3 bg-slate-800 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-slate-900 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}