'use client';

import Link from 'next/link';

const categories = [
  {
    name: 'Bedroom',
    image: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=400&h=400&fit=crop&crop=center',
    link: '/categories/bedroom'
  },
  {
    name: 'Pooja Room',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
    link: '/categories/pooja-room'
  },
  {
    name: 'Balcony',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop&crop=center',
    link: '/categories/balcony'
  },
  {
    name: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
    link: '/categories/kitchen'
  },
  {
    name: 'Living Room',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
    link: '/categories/living-room'
  },
  {
    name: 'Bathroom',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center',
    link: '/categories/bathroom'
  },
  {
    name: 'Study Room',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center',
    link: '/categories/study-room'
  },
  {
    name: 'Garden Area',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=400&fit=crop&crop=center',
    link: '/categories/garden-area'
  }
];

export default function ExploreCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
            Explore Your Home Spaces
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.name}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-poppins">
                  {category.name}
                </h3>
                <Link
                  href={category.link}
                  className="inline-block bg-[#00A36C] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#008f5a] transition-colors duration-300 text-sm"
                >
                  Explore Designs
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}