'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'homeowner' | 'professional' | null>(null);

  const handleRoleSelect = (role: 'homeowner' | 'professional') => {
    setSelectedRole(role);
    if (role === 'homeowner') {
      router.push('/register/user');
    } else {
      router.push('/register/professional');
    }
  };

  const professionalRoles = [
    {
      id: 'contractor',
      title: 'Contractor',
      description: 'Manage construction projects, oversee workers, and handle client relationships',
      icon: '🏗️',
      features: ['Project Management', 'Worker Coordination', 'Client Communication', 'Safety Compliance']
    },
    {
      id: 'interior-designer',
      title: 'Interior Designer',
      description: 'Create stunning interior designs, showcase portfolios, and connect with clients',
      icon: '🎨',
      features: ['Design Creation', 'Portfolio Showcase', 'Client Consultations', 'Material Selection']
    },
    {
      id: 'renovator',
      title: 'Renovator',
      description: 'Handle renovation projects, manage timelines, and deliver quality transformations',
      icon: '🔧',
      features: ['Renovation Planning', 'Timeline Management', 'Quality Control', 'Client Updates']
    },
    {
      id: 'architect',
      title: 'Architect',
      description: 'Design blueprints, manage architectural projects, and bring visions to life',
      icon: '🏛️',
      features: ['Blueprint Design', 'Project Planning', 'Regulatory Compliance', 'Client Presentations']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="flex min-h-[calc(100vh-4rem)] pt-16">
        {/* Left Section - Background Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <img
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=1000&fit=crop&crop=center"
            alt="Construction"
            className="w-full h-full object-cover"
          />
          <div className="relative z-10 flex items-center justify-center w-full h-full p-12">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold font-poppins mb-4">
                BRIXXO
              </h1>
              <p className="text-xl opacity-90">
                Choose Your Professional Path
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Role Selection */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-4xl space-y-8">
            <div className="text-center lg:text-left">
              <div className="lg:hidden mb-6">
                <h1 className="text-3xl font-bold text-slate-900 font-poppins mb-2">
                  BRIXXO
                </h1>
                <p className="text-slate-600">
                  Choose Your Professional Path
                </p>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 font-poppins">
                Select Your Role
              </h2>
              <p className="mt-2 text-slate-600">
                Choose the professional category that best describes your expertise
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="grid grid-cols-1 gap-6">
              {/* Homeowner Card */}
              <div
                onClick={() => handleRoleSelect('homeowner')}
                className={`card p-8 cursor-pointer animate-fade-in hover-lift ${
                  selectedRole === 'homeowner' ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                }`}
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm a Homeowner</h3>
                  <p className="text-gray-600">Find trusted professionals and compare quotes</p>
                </div>
                <button className="btn-primary w-full">
                  Continue as Homeowner
                </button>
              </div>

              {/* Professional Card */}
              <div
                onClick={() => setSelectedRole('professional')}
                className={`card p-8 cursor-pointer animate-fade-in hover-lift ${
                  selectedRole === 'professional' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">I'm a Professional</h3>
                  <p className="text-gray-600">Manage your business and connect with clients</p>
                </div>

                {/* Professional Types List */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4 font-medium">Choose your profession:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="text-sm text-gray-700 font-medium">🔨 Contractor</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="text-sm text-gray-700 font-medium">🎨 Interior Designer</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="text-sm text-gray-700 font-medium">🔄 Renovator</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="text-sm text-gray-700 font-medium">📐 Architect</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors col-span-2">
                      <span className="text-sm text-gray-700 font-medium">➕ Other</span>
                    </div>
                  </div>
                </div>

                <button className="btn-secondary w-full">
                  Continue as Professional
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register/user"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                ← Back to Homeowner Signup
              </Link>

              {selectedRole && (
                <Link
                  href={`/register/professional?role=${selectedRole}`}
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 px-8 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Continue as {professionalRoles.find(r => r.id === selectedRole)?.title}
                </Link>
              )}
            </div>

            {/* Alternative Options */}
            <div className="text-center">
              <p className="text-slate-600 mb-4">Already have an account?</p>
              <Link
                href="/login"
                className="text-teal-600 hover:text-teal-800 font-semibold transition-colors"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}