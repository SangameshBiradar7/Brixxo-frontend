'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileDropdownOpen && !(event.target as Element).closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen]);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg transition-all duration-300 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold font-playfair-display text-gray-900 hover:text-green-600 transition-all duration-300"
            >
              BRIXXO
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 font-montserrat font-medium transition-all duration-300 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/projects"
              className="text-gray-700 hover:text-green-600 font-montserrat font-medium transition-all duration-300 relative group"
            >
              Projects
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/professionals"
              className="text-gray-700 hover:text-green-600 font-montserrat font-medium transition-all duration-300 relative group"
            >
              Professionals
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/categories"
              className="text-gray-700 hover:text-green-600 font-montserrat font-medium transition-all duration-300 relative group"
            >
              Categories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 hover:text-green-600 font-montserrat font-medium transition-all duration-300 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link
              href="/about"
              className="text-gray-700 hover:text-green-600 font-montserrat font-medium transition-all duration-300 relative group"
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {user ? (
              <>

                <Link
                  href="/dashboard/messages"
                  className="text-gray-700 hover:text-green-600 font-medium transition-all duration-300 relative group"
                >
                  Messages
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-110"
                    aria-label="Profile menu"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl py-1 z-50 border border-gray-200 font-roboto animate-slide-down">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                        Welcome, {user.name}
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Account Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center text-gray-700 hover:text-green-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Profile menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      href="/login"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
              >
                Home
              </Link>

              <Link
                href="/projects"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
              >
                Projects
              </Link>

              <Link
                href="/professionals"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
              >
                Professionals
              </Link>

              <Link
                href="/categories"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
              >
                Categories
              </Link>


              <Link
                href="/contact"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
              >
                Contact
              </Link>

              <Link
                href="/about"
                onClick={closeMenu}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
              >
                About
              </Link>

              {user ? (
                <>
                  <Link
                    href="/dashboard/messages"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                  >
                    Messages
                  </Link>

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="px-3 py-2 text-sm text-gray-600 font-medium">
                      Welcome, {user.name}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md font-medium transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-1">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="block px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md font-medium transition-colors duration-200 text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}