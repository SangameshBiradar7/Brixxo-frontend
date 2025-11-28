'use client';

import Link from 'next/link';

export default function ReadyToJoinSection() {
  return (
    <section
      className="py-20 text-white relative"
      style={{backgroundImage: 'url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1920&h=1080&fit=crop&crop=center)'}}
      data-aos="fade-up"
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-3xl md:text-4xl font-dancing-script font-bold mb-4"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Are you a Construction Company? Showcase your projects today!
        </h2>
        <p
          className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Register your company and connect with clients looking for quality construction services.
          Join India's premier construction marketplace today.
        </p>
        <div
          className="flex justify-center"
          data-aos="zoom-in"
          data-aos-delay="600"
        >
          <Link
            href="/register"
            className="inline-block bg-[#00A36C] text-white font-poppins font-bold py-5 px-12 rounded-xl transition-all duration-300 text-lg hover:scale-105 hover:shadow-2xl hover:bg-[#008f5a]"
          >
            Join BRIXXO Today
          </Link>
        </div>
      </div>
    </section>
  );
}