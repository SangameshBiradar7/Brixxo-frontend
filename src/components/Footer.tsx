'use client';

import Link from 'next/link';
import { Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="text-white py-16 relative"
      style={{backgroundColor: '#0F0F0F'}}
      data-aos="fade-up"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-bold font-poppins mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-[#00A36C] transition-colors duration-300">About</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-[#00A36C] transition-colors duration-300">Careers</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-[#00A36C] transition-colors duration-300">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-[#00A36C] transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold font-poppins mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/services/design" className="text-gray-400 hover:text-[#00A36C] transition-colors duration-300">Design</Link></li>
              <li><Link href="/services/construction" className="text-gray-400 hover:text-[#00A36C] transition-colors duration-300">Construction</Link></li>
              <li><Link href="/services/renovation" className="text-gray-400 hover:text-[#00A36C] transition-colors duration-300">Renovation</Link></li>
              <li><Link href="/services/interiors" className="text-gray-400 hover:text-[#00A36C] transition-colors duration-300">Interiors</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold font-poppins mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/projects" className="text-gray-400 hover:text-[#00A36C] transition-colors duration-300">Projects</Link></li>
              <li><Link href="/professionals" className="text-gray-400 hover:text-[#00A36C] transition-colors duration-300">Professionals</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-[#00A36C] transition-colors duration-300">Support</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-lg font-bold font-poppins mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/dreamhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00A36C] transition-all duration-300 hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com/dreamhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00A36C] transition-all duration-300 hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/company/dreamhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00A36C] transition-all duration-300 hover:scale-110"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/dreamhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#00A36C] transition-all duration-300 hover:scale-110"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} BRIXXO. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}