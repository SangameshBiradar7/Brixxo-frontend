'use client';

import Link from 'next/link';

export default function CTASection() {
  return (
    <section
      className="py-16 bg-cover bg-center relative text-white"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&h=600&fit=crop&crop=center)'
      }}
      data-aos="fade-up"
      data-aos-offset="200"
    >
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
          Are You a Construction Company?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          List your company, showcase your projects, and grow with us.
        </p>
        <Link
          href="/register"
          className="inline-block bg-[#00A36C] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#008f5a] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          List Your Company
        </Link>
      </div>
    </section>
  );
}