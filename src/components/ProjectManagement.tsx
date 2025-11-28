'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import {
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Check,
  AlertCircle,
  Save,
  Star,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  Building2
} from 'lucide-react';
import DragDropUpload from './DragDropUpload';

interface Company {
  _id: string;
  name: string;
}

interface ProfessionalProject {
  _id: string;
  title: string;
  description: string;
  company: Company;
  projectType: string;
  status: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  location?: string;
  clientName?: string;
  images: string[];
  featuredImage?: string;
  tags: string[];
  isFeatured: boolean;
  isPublic: boolean;
  views: number;
  createdAt: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  companyId: string;
  projectType: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: string;
  location: string;
  clientName: string;
  tags: string[];
  isFeatured: boolean;
  isPublic: boolean;
}

const projectTypes = [
  { value: 'interior-design', label: 'Interior Design' },
  { value: 'construction', label: 'Construction' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'consultation', label: 'Consultation' }
];

const projectStatuses = [
  { value: 'completed', label: 'Completed' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'draft', label: 'Draft' }
];

export default function ProjectManagement() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProfessionalProject[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<ProfessionalProject | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    companyId: '',
    projectType: 'interior-design',
    status: 'completed',
    startDate: '',
    endDate: '',
    budget: '',
    location: '',
    clientName: '',
    tags: [],
    isFeatured: false,
    isPublic: true
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load companies first
      const companiesResponse = await axios.get('/api/professional-companies');
      setCompanies(companiesResponse.data);

      // Load projects
      const projectsResponse = await axios.get('/api/professional-projects');
      setProjects(projectsResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      companyId: '',
      projectType: 'interior-design',
      status: 'completed',
      startDate: '',
      endDate: '',
      budget: '',
      location: '',
      clientName: '',
      tags: [],
      isFeatured: false,
      isPublic: true
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setEditingProject(null);
    setShowCreateForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);

    // Create preview URLs
    const newUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]); // Clean up URL
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyId) {
      alert('Please select a company');
      return;
    }

    setSaving(true);

    try {
      const submitData = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'tags') {
          submitData.append(key, JSON.stringify(value));
        } else if (typeof value === 'boolean') {
          submitData.append(key, value.toString());
        } else {
          submitData.append(key, value);
        }
      });

      // Add image files
      selectedFiles.forEach((file, index) => {
        submitData.append('images', file);
      });

      if (editingProject) {
        // Update existing project
        await axios.put(`/api/professional-projects/${editingProject._id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new project
        await axios.post('/api/professional-projects', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Error saving project:', error);
      alert(error.response?.data?.message || 'Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: ProfessionalProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      companyId: project.company._id,
      projectType: project.projectType,
      status: project.status,
      startDate: project.startDate.split('T')[0], // Format for date input
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      budget: project.budget?.toString() || '',
      location: project.location || '',
      clientName: project.clientName || '',
      tags: project.tags || [],
      isFeatured: project.isFeatured,
      isPublic: project.isPublic
    });

    // Set existing images as preview
    if (project.images && project.images.length > 0) {
      setPreviewUrls(project.images);
    }

    setShowCreateForm(true);
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/professional-projects/${projectId}`);
      loadData();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const toggleFeatured = async (projectId: string) => {
    try {
      await axios.put(`/api/professional-projects/${projectId}/feature`);
      loadData();
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-600 mt-1">Create and manage your professional projects</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects List */}
      {projects.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-teal-300 transition-all duration-200">
              {/* Project Image */}
              <div className="h-48 bg-gradient-to-r from-teal-500 to-teal-600 relative">
                {project.images && project.images.length > 0 ? (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="w-12 h-12 text-white" />
                  </div>
                )}

                {/* Featured Badge */}
                {project.isFeatured && (
                  <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Featured</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    project.status === 'completed' ? 'bg-green-500 text-white' :
                    project.status === 'ongoing' ? 'bg-blue-500 text-white' :
                    project.status === 'upcoming' ? 'bg-orange-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{project.title}</h3>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                {/* Project Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{project.company.name}</span>
                  </div>

                  {project.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </div>
                  )}

                  {project.budget && (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{formatCurrency(project.budget)}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{new Date(project.startDate).getFullYear()}</span>
                  </div>
                </div>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                      title="View project"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                      title="Edit project"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleFeatured(project._id)}
                      className={`p-1 transition-colors ${
                        project.isFeatured
                          ? 'text-yellow-500 hover:text-yellow-600'
                          : 'text-gray-400 hover:text-yellow-500'
                      }`}
                      title={project.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <Star className={`w-4 h-4 ${project.isFeatured ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{project.views || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-500 mb-6">Create your first project to showcase your work</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Add Your First Project
          </button>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <select
                    name="companyId"
                    required
                    value={formData.companyId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                  >
                    <option value="">Select a company</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                  placeholder="Describe your project..."
                />
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Type *
                  </label>
                  <select
                    name="projectType"
                    required
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                  >
                    {projectTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                  >
                    {projectStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dates and Budget */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (₹)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    min="0"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                    placeholder="500000"
                  />
                </div>
              </div>

              {/* Location and Client */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                    placeholder="Client name (optional)"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={handleTagsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                  placeholder="modern, luxury, residential, kitchen"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Project Images
                </label>

                <DragDropUpload
                  onFilesSelected={(files) => setSelectedFiles(prev => [...prev, ...files])}
                  selectedFiles={selectedFiles}
                  onRemoveFile={removeImage}
                  maxFiles={20}
                  maxSizeMB={10}
                />
              </div>

              {/* Settings */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">Mark as featured project</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                  <span className="text-sm text-gray-700">Make project public</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}