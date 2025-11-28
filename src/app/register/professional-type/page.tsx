'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

const professionalTypes = [
  {
    id: 'contractor',
    name: 'Contractor',
    description: 'Construction and project execution services',
    icon: (
      <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    specializations: ['General Contractor', 'Specialty Contractor', 'Residential Contractor', 'Commercial Contractor']
  },
  {
    id: 'architect',
    name: 'Architect',
    description: 'Design and planning of buildings and structures',
    icon: (
      <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    specializations: ['Residential Architect', 'Commercial Architect', 'Landscape Architect', 'Interior Architect']
  },
  {
    id: 'interior-designer',
    name: 'Interior Designer',
    description: 'Interior design and space planning',
    icon: (
      <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
      </svg>
    ),
    specializations: ['Residential Interior Design', 'Commercial Interior Design', 'Office Design', 'Retail Design']
  },
  {
    id: 'renovator',
    name: 'Renovator',
    description: 'Home renovation and remodeling services',
    icon: (
      <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    specializations: ['Kitchen Renovation', 'Bathroom Renovation', 'Home Remodeling', 'Restoration']
  },
  {
    id: 'structural-engineer',
    name: 'Structural Engineer',
    description: 'Design and analysis of building structures',
    icon: (
      <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    specializations: ['Building Structures', 'Bridge Engineering', 'Foundation Design', 'Seismic Design']
  },
  {
    id: 'estimation-engineer',
    name: 'Estimation Engineer',
    description: 'Cost estimation and quantity surveying',
    icon: (
      <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    specializations: ['Cost Estimation', 'Quantity Surveying', 'Project Budgeting', 'Material Estimation']
  }
];

export default function ProfessionalTypePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('');

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setSelectedSpecialization('');
  };

  const handleSpecializationSelect = (specialization: string) => {
    setSelectedSpecialization(specialization);
  };

  const handleContinue = () => {
    if (selectedType && selectedSpecialization) {
      // Store the selections in localStorage or pass via URL params
      const professionalData = {
        type: selectedType,
        specialization: selectedSpecialization
      };
      localStorage.setItem('professionalTypeData', JSON.stringify(professionalData));
      router.push('/register/professional');
    }
  };

  const selectedTypeData = professionalTypes.find(type => type.id === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navigation />

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Choose Your Professional Type
            </h2>
            <p className="text-slate-600">
              Select your profession and specialization to create a tailored experience
            </p>
          </div>

          {/* Professional Types Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {professionalTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedType === type.id
                    ? 'ring-2 ring-green-500 bg-green-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {type.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{type.name}</h3>
                    <p className="text-sm text-slate-600">{type.description}</p>
                  </div>
              </div>
            ))}
          </div>

          {/* Specialization Selection */}
          {selectedTypeData && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Select Your Specialization in {selectedTypeData.name}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {selectedTypeData.specializations.map((spec) => (
                  <div
                    key={spec}
                    onClick={() => handleSpecializationSelect(spec)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedSpecialization === spec
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">{spec}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/register/role-selection')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>

            <button
              onClick={handleContinue}
              disabled={!selectedType || !selectedSpecialization}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue to Registration
            </button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200">
              Already have an account? <span className="text-slate-800 font-semibold">Sign in here</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}