'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import {
  Building2,
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Check,
  AlertCircle,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import DragDropUpload from './DragDropUpload';

interface Company {
  _id: string;
  name: string;
  description: string;
  website?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  services: string[];
  specializations: string[];
  certifications: string[];
  established?: string;
  employees?: string;
  logo?: string;
  rating: number;
  isVerified: boolean;
}

interface CompanyFormData {
  name: string;
  description: string;
  website: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  services: string[];
  specializations: string[];
  certifications: string[];
  established: string;
  employees: string;
}

const serviceOptions = [
  'Interior Design',
  'Architecture',
  'Construction',
  'Renovation',
  'Project Management',
  'Consultation'
];

const specializationOptions = [
  'Residential',
  'Commercial',
  'Luxury Homes',
  'Sustainable Design',
  'Modern Architecture',
  'Traditional Design'
];

const certificationOptions = [
  'Licensed Architect',
  'Certified Interior Designer',
  'ISO Certified',
  'Green Building Certified',
  'Safety Certified'
];

export default function CompanyManagement() {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    description: '',
    website: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    services: [],
    specializations: [],
    certifications: [],
    established: '',
    employees: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/professional-companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      website: '',
      phone: '',
      whatsapp: '',
      email: '',
      address: '',
      services: [],
      specializations: [],
      certifications: [],
      established: '',
      employees: ''
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setEditingCompany(null);
    setShowCreateForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayToggle = (field: keyof CompanyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          submitData.append(key, JSON.stringify(value));
        } else {
          submitData.append(key, value);
        }
      });

      // Add file if selected
      if (selectedFile) {
        submitData.append('logo', selectedFile);
      }

      if (editingCompany) {
        // Update existing company
        await axios.put(`/api/professional-companies/${editingCompany._id}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new company
        await axios.post('/api/professional-companies', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      resetForm();
      loadCompanies();
    } catch (error: any) {
      console.error('Error saving company:', error);
      alert(error.response?.data?.message || 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      description: company.description,
      website: company.website || '',
      phone: company.phone || '',
      whatsapp: company.whatsapp || '',
      email: company.email || '',
      address: company.address || '',
      services: company.services || [],
      specializations: company.specializations || [],
      certifications: company.certifications || [],
      established: company.established || '',
      employees: company.employees || ''
    });
    setPreviewUrl(company.logo || '');
    setShowCreateForm(true);
  };

  const handleDelete = async (companyId: string) => {
    if (!confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/professional-companies/${companyId}`);
      loadCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Failed to delete company');
    }
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
          <h2 className="text-2xl font-bold text-gray-900">My Company</h2>
          <p className="text-gray-600 mt-1">Create and manage your professional companies</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Company</span>
        </button>
      </div>

      {/* Companies List */}
      {companies.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div key={company._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-teal-300 transition-all duration-200">
              {/* Company Logo/Header */}
              <div className="h-32 bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center">
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-white" />
                )}
              </div>

              {/* Company Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                  {company.isVerified && (
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{company.description}</p>

                {/* Services */}
                {company.services && company.services.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Services</p>
                    <div className="flex flex-wrap gap-1">
                      {company.services.slice(0, 3).map((service, index) => (
                        <span key={index} className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                          {service}
                        </span>
                      ))}
                      {company.services.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{company.services.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= Math.floor(company.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">{company.rating.toFixed(1)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(company)}
                      className="p-1 text-gray-400 hover:text-teal-600 transition-colors"
                      title="Edit company"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(company._id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete company"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {companies.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies yet</h3>
          <p className="text-gray-500 mb-6">Create your first company to start showcasing your work</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Create Your First Company
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
                  {editingCompany ? 'Edit Company' : 'Create New Company'}
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
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </label>
                <DragDropUpload
                  onFilesSelected={(files) => {
                    if (files.length > 0) {
                      setSelectedFile(files[0]);
                      const url = URL.createObjectURL(files[0]);
                      setPreviewUrl(url);
                    }
                  }}
                  selectedFiles={selectedFile ? [selectedFile] : []}
                  onRemoveFile={() => {
                    setSelectedFile(null);
                    setPreviewUrl('');
                  }}
                  maxFiles={1}
                  maxSizeMB={5}
                />
              </div>

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                    placeholder="company@example.com"
                  />
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
                  placeholder="Describe your company and services..."
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                    placeholder="https://www.company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                    placeholder="City, State, Country"
                  />
                </div>
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Services Offered
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {serviceOptions.map((service) => (
                    <label key={service} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleArrayToggle('services', service)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Specializations
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specializationOptions.map((spec) => (
                    <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.specializations.includes(spec)}
                        onChange={() => handleArrayToggle('specializations', spec)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Certifications
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {certificationOptions.map((cert) => (
                    <label key={cert} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.certifications.includes(cert)}
                        onChange={() => handleArrayToggle('certifications', cert)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                      />
                      <span className="text-sm text-gray-700">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year Established
                  </label>
                  <input
                    type="number"
                    name="established"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.established}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                    placeholder="2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Employees
                  </label>
                  <select
                    name="employees"
                    value={formData.employees}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-900 placeholder-gray-500"
                  >
                    <option value="">Select range</option>
                    <option value="1-5">1-5 employees</option>
                    <option value="6-10">6-10 employees</option>
                    <option value="11-25">11-25 employees</option>
                    <option value="26-50">26-50 employees</option>
                    <option value="51-100">51-100 employees</option>
                    <option value="100+">100+ employees</option>
                  </select>
                </div>
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
                      <span>{editingCompany ? 'Update Company' : 'Create Company'}</span>
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