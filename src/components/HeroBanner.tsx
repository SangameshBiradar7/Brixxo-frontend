'use client';

import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="relative text-white overflow-hidden h-96 md:h-[500px] lg:h-[600px]">
      {/* Background Image - Family enjoying their dream home */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop&crop=center)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>

      {/* Emotional Gradient Overlay - Warm and inviting */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-green-900/30"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full flex items-center py-12 md:py-16 lg:py-20 z-10">
        <div className="text-center w-full max-w-4xl mx-auto">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 font-poppins text-white drop-shadow-2xl leading-tight"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Your Dream Home Awaits
          </h1>
          <p
            className="text-xl md:text-2xl lg:text-3xl mb-12 text-gray-100 drop-shadow-lg font-light max-w-3xl mx-auto leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Connect with trusted craftsmen who turn your vision into reality, creating spaces filled with love, comfort, and lasting memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" data-aos="zoom-in" data-aos-delay="600">
            <Link
              href="/projects"
              className="inline-block bg-[#00A36C] text-white font-poppins font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-lg hover:scale-105 hover:shadow-2xl hover:bg-[#008f5a] shadow-lg"
            >
              Start Your Journey
            </Link>
            <Link
              href="/professionals"
              className="inline-block bg-white/90 backdrop-blur-sm text-[#00A36C] font-poppins font-bold py-4 px-8 rounded-2xl transition-all duration-300 text-lg hover:scale-105 hover:shadow-2xl hover:bg-white border-2 border-white/50"
            >
              Find Your Expert
            </Link>
          </div>
        </div>
      </div>

      {/* Emotional storytelling elements */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white text-sm font-medium">
          ✨ Trusted by 10,000+ happy families
        </div>
      </div>
    </section>
  );
}