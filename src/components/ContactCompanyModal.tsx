'use client';

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface ContactCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: {
    _id: string;
    name: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    admin: {
      _id: string;
      name: string;
      email: string;
    };
  };
  projectId?: string;
  projectTitle?: string;
}

export default function ContactCompanyModal({
  isOpen,
  onClose,
  company,
  projectId,
  projectTitle
}: ContactCompanyModalProps) {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState<'inquiry' | 'chat' | 'direct' | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
    preferredContact: 'email'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const inquiryData: any = {
        ...formData,
        company: company._id
      };

      if (projectId) {
        inquiryData.project = projectId;
      }

      await axios.post('/api/inquiries', inquiryData);

      alert('Your inquiry has been sent successfully! The company will contact you soon.');
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Error sending inquiry:', error);
      alert(error.response?.data?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectContact = (method: 'phone' | 'whatsapp' | 'email') => {
    switch (method) {
      case 'phone':
        if (company.phone) {
          window.open(`tel:${company.phone}`, '_self');
        } else {
          alert('Phone number not available for this company.');
        }
        break;
      case 'whatsapp':
        if (company.whatsapp) {
          const message = encodeURIComponent(
            `Hi ${company.name}, I'm interested in your construction services${projectTitle ? ` for the project: ${projectTitle}` : ''}. Please let me know how we can proceed.`
          );
          window.open(`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
        } else {
          alert('WhatsApp number not available for this company.');
        }
        break;
      case 'email':
        const subject = encodeURIComponent(`Inquiry about construction services${projectTitle ? ` - ${projectTitle}` : ''}`);
        const body = encodeURIComponent(
          `Dear ${company.name},\n\nI am interested in your construction services${projectTitle ? ` for the project: ${projectTitle}` : ''}.\n\nPlease contact me to discuss further details.\n\nBest regards,\n${user?.name || 'Potential Client'}`
        );
        window.open(`mailto:${company.email || company.admin.email}?subject=${subject}&body=${body}`, '_self');
        break;
    }
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      message: '',
      preferredContact: 'email'
    });
    setSelectedOption(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Contact {company.name}</h2>
            <button
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {projectTitle && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Project:</strong> {projectTitle}
              </p>
            </div>
          )}

          {!selectedOption ? (
            <div className="space-y-4">
              <p className="text-gray-600 mb-6">Choose how you'd like to contact this company:</p>

              {/* Send Inquiry Option */}
              <div 
                onClick={() => setSelectedOption('inquiry')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Send Inquiry</h3>
                    <p className="text-sm text-gray-600">Submit a detailed inquiry form with your requirements</p>
                  </div>
                </div>
              </div>

              {/* Direct Contact Options */}
              <div 
                onClick={() => setSelectedOption('direct')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Direct Contact</h3>
                    <p className="text-sm text-gray-600">Call, WhatsApp, or email the company directly</p>
                  </div>
                </div>
              </div>

              {/* Live Chat Option */}
              <div 
                onClick={() => setSelectedOption('chat')}
                className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Live Chat</h3>
                    <p className="text-sm text-gray-600">Start a real-time conversation with the company</p>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedOption === 'inquiry' ? (
            <form onSubmit={handleSubmitInquiry} className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedOption(null)}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>
                <span className="text-gray-400">|</span>
                <span className="font-semibold text-gray-900">Send Inquiry</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black"
                  placeholder="+91-9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Contact Method
                </label>
                <select
                  name="preferredContact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                >
                  <option value="email" className="text-black">Email</option>
                  <option value="call" className="text-black">Phone Call</option>
                  <option value="whatsapp" className="text-black">WhatsApp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message / Requirements
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black placeholder-black"
                  placeholder="Tell the company about your requirements, timeline, budget, etc."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedOption(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>
            </form>
          ) : selectedOption === 'direct' ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => setSelectedOption(null)}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>
                <span className="text-gray-400">|</span>
                <span className="font-semibold text-gray-900">Direct Contact</span>
              </div>

              <p className="text-gray-600 mb-4">Choose your preferred contact method:</p>

              {/* Phone */}
              {company.phone && (
                <button
                  onClick={() => handleDirectContact('phone')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Call Now</div>
                    <div className="text-sm text-gray-600">{company.phone}</div>
                  </div>
                </button>
              )}

              {/* WhatsApp */}
              {company.whatsapp && (
                <button
                  onClick={() => handleDirectContact('whatsapp')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.109"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">WhatsApp</div>
                    <div className="text-sm text-gray-600">{company.whatsapp}</div>
                  </div>
                </button>
              )}

              {/* Email */}
              <button
                onClick={() => handleDirectContact('email')}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center space-x-3 group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Send Email</div>
                  <div className="text-sm text-gray-600">{company.email || company.admin.email}</div>
                </div>
              </button>

              {!company.phone && !company.whatsapp && (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Only email contact is available for this company.</p>
                </div>
              )}
            </div>
          ) : selectedOption === 'chat' ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <button
                  onClick={() => setSelectedOption(null)}
                  className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>
                <span className="text-gray-400">|</span>
                <span className="font-semibold text-gray-900">Live Chat</span>
              </div>

              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Live Chat</h3>
                <p className="text-gray-600 mb-6">
                  Connect instantly with {company.name} for real-time communication about your project.
                </p>
                <button
                  onClick={() => {
                    // This will be handled by the parent component
                    onClose();
                    // Trigger chat modal opening
                    const event = new CustomEvent('openChat', { 
                      detail: { 
                        conversationId: `${user?._id}-${company.admin._id}`,
                        otherUser: company.admin
                      } 
                    });
                    window.dispatchEvent(event);
                  }}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Start Chatting
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}