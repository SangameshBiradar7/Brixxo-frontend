'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Combined schema for both user and professional signup
const signupSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  professionType: yup.string().optional(),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
  location: yup.string().optional(),
  terms: yup.boolean().oneOf([true], 'You must accept the terms and conditions'),
});

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'user' | 'professional'>('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
    resolver: yupResolver(signupSchema),
  });

  const password = watch('password', '');

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

    // Validate profession type for professionals
    if (activeTab === 'professional' && !data.professionType) {
      setError('Please select a profession type');
      setLoading(false);
      return;
    }

    try {
      const role = activeTab === 'user' ? 'homeowner' : data.professionType;
      await registerUser(data.name, data.email, data.password, role);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'user' | 'professional') => {
    setActiveTab(tab);
    reset(); // Reset form when switching tabs
    setPasswordStrength(0);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="flex min-h-[calc(100vh-4rem)] pt-16">
        {/* Left Section - Background Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00A36C] to-[#008f5a] relative overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
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
                Connecting Homeowners with Trusted Construction Experts
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
              <div className="lg:hidden mb-6">
                <h1 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
                  BRIXXO
                </h1>
                <p className="text-gray-600">
                  Connecting Homeowners with Trusted Construction Experts
                </p>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-poppins">
                Create Your Account
              </h2>
              <p className="mt-2 text-gray-600">
                Join our community to start your construction journey
              </p>
            </div>

            {/* Tab Selection */}
            <div className="bg-gray-100 rounded-lg p-1">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => handleTabChange('user')}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'user'
                      ? 'bg-white text-[#00A36C] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  User Signup
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('professional')}
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'professional'
                      ? 'bg-white text-[#00A36C] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Professional Signup
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    {...register('name')}
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C] transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-black"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name.message as string}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C] transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-black"
                    placeholder="Enter your email address"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">{errors.email.message as string}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    {...register('phone')}
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C] transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-black"
                    placeholder="+91-9876543210"
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone.message as string}</p>
                  )}
                </div>

                {activeTab === 'professional' && (
                  <div>
                    <label htmlFor="professionType" className="block text-sm font-semibold text-gray-700 mb-2">
                      Profession Type
                    </label>
                    <select
                      {...register('professionType')}
                      id="professionType"
                      name="professionType"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C] transition-all duration-200 bg-gray-50 focus:bg-white text-black"
                    >
                      <option value="">Select your profession</option>
                      <option value="contractor">Contractor</option>
                      <option value="architect">Architect</option>
                      <option value="interior-designer">Interior Designer</option>
                      <option value="renovator">Renovator</option>
                    </select>
                    {errors.professionType && (
                      <p className="text-red-600 text-sm mt-1">{errors.professionType.message as string}</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C] transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-black"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                            className={`h-2 w-8 rounded ${
                              level <= passwordStrength
                                ? passwordStrength <= 2
                                  ? 'bg-red-400'
                                  : passwordStrength <= 3
                                  ? 'bg-yellow-400'
                                  : 'bg-green-400'
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Medium' : 'Strong'} password
                      </p>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-red-600 text-sm mt-1">{errors.password.message as string}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C] transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-black"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message as string}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                    Location (Optional)
                  </label>
                  <input
                    {...register('location')}
                    id="location"
                    name="location"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A36C] focus:border-[#00A36C] transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-400 text-black"
                    placeholder="City, State"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    {...register('terms')}
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-[#00A36C] focus:ring-[#00A36C] border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#00A36C] hover:text-[#008f5a] underline">
                      Terms & Conditions
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="text-red-600 text-sm">{errors.terms.message as string}</p>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#00A36C] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#008f5a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    <span className="ml-2">LinkedIn</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link href="/login" className="text-gray-600 hover:text-[#00A36C] transition-colors">
                  Already have an account? <span className="font-semibold">Sign in</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}