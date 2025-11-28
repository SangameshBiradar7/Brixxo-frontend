'use client';

import Link from 'next/link';

export default function RequirementSection() {
  return (
    <section
      className="py-16 bg-cover bg-center relative"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&h=600&fit=crop&crop=center)'
      }}
      data-aos="fade-up"
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
          Have a Construction Requirement?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Post your requirement and get quotes from multiple verified companies.
        </p>
        <Link
          href="/dashboard/requirements/submit"
          className="inline-block bg-[#00A36C] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#008f5a] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Submit Requirement
        </Link>
      </div>
    </section>
  );
}