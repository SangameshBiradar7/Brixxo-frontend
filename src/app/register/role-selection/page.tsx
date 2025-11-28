'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {professionalRoles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`bg-white rounded-2xl shadow-lg p-6 border-2 cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:scale-105 ${
                    selectedRole === role.id
                      ? 'border-teal-500 ring-2 ring-teal-100 bg-teal-50'
                      : 'border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{role.icon}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{role.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{role.description}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-800 text-sm">Key Features:</h4>
                    <ul className="space-y-1">
                      {role.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-slate-600">
                          <svg className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedRole === role.id && (
                    <div className="mt-4 flex justify-center">
                      <div className="bg-teal-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Selected
                      </div>
                    </div>
                  )}
                </div>
              ))}
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