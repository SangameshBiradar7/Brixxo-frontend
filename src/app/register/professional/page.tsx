'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Combined schema for professional signup
const professionalSignupSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  professionType: yup.string().required('Please select a profession type'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
  location: yup.string().optional(),
  terms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

export default function ProfessionalSignupPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(professionalSignupSchema),
  });

  const password = watch('password', '');
  const selectedRole = watch('professionType', '');

  // Get role from URL params
  useEffect(() => {
    const role = searchParams.get('role');
    if (role) {
      setValue('professionType', role);
    }
  }, [searchParams, setValue]);

  const calculatePasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');

    try {
      await registerUser(data.name, data.email, data.password, data.professionType);
      router.push('/dashboard/professional');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const professionTypes = [
    { value: 'contractor', label: 'Contractor', icon: '🏗️', description: 'Construction project management' },
    { value: 'interior-designer', label: 'Interior Designer', icon: '🎨', description: 'Interior design and decoration' },
    { value: 'renovator', label: 'Renovator', icon: '🔧', description: 'Home renovation services' },
    { value: 'architect', label: 'Architect', icon: '🏛️', description: 'Architectural design and planning' }
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
                Join BRIXXO
              </h1>
              <p className="text-xl opacity-90">
                Start Your Professional Journey
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Professional Signup Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <div className="lg:hidden mb-6">
                <h1 className="text-3xl font-bold text-slate-900 font-poppins mb-2">
                  Join BRIXXO
                </h1>
                <p className="text-slate-600">
                  Start Your Professional Journey
                </p>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 font-poppins">
                Professional Signup
              </h2>
              <p className="mt-2 text-slate-600">
                Create your professional account and start building your business
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    {...register('name')}
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-slate-50 focus:bg-white placeholder-slate-400 text-black"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-slate-50 focus:bg-white placeholder-slate-400 text-black"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-slate-50 focus:bg-white placeholder-slate-400 text-black"
                    placeholder="+91-9876543210"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="professionType" className="block text-sm font-semibold text-slate-700 mb-3">
                    Profession Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {professionTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                          selectedRole === type.value
                            ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-100'
                            : 'border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        <input
                          {...register('professionType')}
                          type="radio"
                          value={type.value}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-medium text-slate-900 text-sm">{type.label}</div>
                          <div className="text-xs text-slate-500 mt-1">{type.description}</div>
                        </div>
                        {selectedRole === type.value && (
                          <div className="absolute top-2 right-2 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                  {errors.professionType && (
                    <p className="text-red-600 text-sm mt-1">{errors.professionType.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      onChange={(e) => {
                        register('password').onChange(e);
                        calculatePasswordStrength(e.target.value);
                      }}
                      className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-slate-50 focus:bg-white placeholder-slate-400 text-black"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <svg className="w-5 h-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 w-8 rounded ${level <= passwordStrength ? (passwordStrength <= 2 ? 'bg-red-400' : passwordStrength <= 3 ? 'bg-yellow-400' : 'bg-green-400') : 'bg-slate-200'}`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'} password
                      </p>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('confirmPassword')}
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-slate-50 focus:bg-white placeholder-slate-400 text-black"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <svg className="w-5 h-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {showConfirmPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        )}
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-slate-700 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    {...register('location')}
                    id="location"
                    name="location"
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 bg-slate-50 focus:bg-white placeholder-slate-400 text-black"
                    placeholder="City, State"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    {...register('terms')}
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-slate-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-teal-600 hover:text-teal-800 underline">
                      Terms & Conditions
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-600 text-sm">{errors.terms.message}</p>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Create Professional Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/register/role-selection" className="text-slate-600 hover:text-teal-600 transition-colors">
                  ← Back to Role Selection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}