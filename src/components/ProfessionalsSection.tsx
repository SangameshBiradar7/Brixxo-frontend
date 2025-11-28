'use client';

import Link from 'next/link';

const professionalCategories = [
  {
    id: 1,
    title: 'Contractors',
    description: 'Hire certified contractors to execute your project efficiently.',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center',
    rating: 4.8,
    link: '/professionals?type=contractors'
  },
  {
    id: 2,
    title: 'Architects',
    description: 'Get modern and sustainable design solutions.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center',
    rating: 4.9,
    link: '/professionals?type=architects'
  },
  {
    id: 3,
    title: 'Interior Designers',
    description: 'Transform your space with creativity and function.',
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400&h=300&fit=crop&crop=center',
    rating: 4.7,
    link: '/professionals?type=interior-designers'
  },
  {
    id: 4,
    title: 'Renovators',
    description: 'Upgrade your home or office beautifully and efficiently.',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center',
    rating: 4.6,
    link: '/professionals?type=renovators'
  }
];

export default function ProfessionalsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
            Find Trusted Professionals Near You
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with verified experts to bring your dream project to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {professionalCategories.map((category, index) => (
            <div
              key={category.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">
                  {category.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {category.description}
                </p>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < Math.floor(category.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600 text-sm">
                    {category.rating}
                  </span>
                </div>
                <Link
                  href={category.link}
                  className="inline-block bg-[#00A36C] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#008f5a] transition-colors duration-300 w-full text-center"
                >
                  View Profiles
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/professionals"
            className="inline-block bg-[#00A36C] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#008f5a] transition-colors duration-300"
          >
            View All Professionals
          </Link>
        </div>
      </div>
    </section>
  );
}