'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Handle scroll for sticky header
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
      if (isMobileMenuOpen && !(event.target as Element).closest('.mobile-menu')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen, isMobileMenuOpen]);

  // Fetch notification count
  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (!user) return;

      try {
        const data = await api.get('/api/notifications?unreadOnly=true');
        setNotificationCount(data.unreadCount || 0);
      } catch (error) {
        console.error('Error fetching notification count:', error);
      }
    };

    fetchNotificationCount();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };


  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`} style={{ backgroundColor: '#1e272e' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-white hover:text-orange-300 transition-colors">
              🏗️ BRIXXO
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center space-x-6 mx-8">
            <Link href="/" className="text-white hover:text-orange-300 transition-colors font-medium">
              Home
            </Link>
            <Link href="/projects" className="text-white hover:text-orange-300 transition-colors font-medium">
              Projects
            </Link>
            <Link href="/dashboard" className="text-white hover:text-orange-300 transition-colors font-medium border-b-2 border-orange-300">
              Dashboard
            </Link>
          </div>


          {/* Mobile menu button */}
          <div className="md:hidden flex items-center mr-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-orange-300 p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>

          {/* Right Side - Notifications, Chat, Profile */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button className="text-white hover:text-orange-300 p-2 rounded-full hover:bg-white/10 transition-colors relative z-10">
              <i className="fas fa-bell text-lg"></i>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>

            {/* Chat Icon */}
            <Link href="/conversations" className="text-white hover:text-orange-300 p-2 rounded-full hover:bg-white/10 transition-colors">
              <i className="fas fa-comments text-lg"></i>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center text-white hover:text-orange-300 p-2 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                <i className="fas fa-user-circle text-lg"></i>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200 font-medium">
                    Welcome, {user?.name}
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
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu md:hidden bg-orange-700 border-t border-orange-600">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-white hover:text-orange-200 hover:bg-orange-800 rounded-md font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/projects"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-white hover:text-orange-200 hover:bg-orange-800 rounded-md font-medium transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 text-orange-200 bg-orange-800 rounded-md font-medium"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}