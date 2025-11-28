'use client';

interface ProjectHighlightsProps {
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  features?: string[];
}

export default function ProjectHighlights({ bedrooms, bathrooms, size, features = [] }: ProjectHighlightsProps) {
  const highlights = [
    {
      icon: '🏠',
      label: 'Bedrooms',
      value: bedrooms || 'N/A'
    },
    {
      icon: '🪔',
      label: 'Pooja Room',
      value: features.includes('Pooja Room') ? 'Yes' : 'No'
    },
    {
      icon: '🌿',
      label: 'Balcony',
      value: features.includes('Balcony') ? 'Yes' : 'No'
    },
    {
      icon: '🚗',
      label: 'Parking',
      value: features.includes('Parking') ? 'Yes' : 'No'
    },
    {
      icon: '💡',
      label: 'Lighting',
      value: features.includes('Modern Lighting') ? 'Modern' : 'Standard'
    },
    {
      icon: '🌳',
      label: 'Garden',
      value: features.includes('Garden') ? 'Yes' : 'No'
    },
    {
      icon: '🛁',
      label: 'Bathrooms',
      value: bathrooms || 'N/A'
    },
    {
      icon: '📐',
      label: 'Area',
      value: size ? `${size} sq ft` : 'N/A'
    }
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Project Highlights</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div className="text-3xl mb-2">{highlight.icon}</div>
              <div className="text-sm text-gray-600 mb-1">{highlight.label}</div>
              <div className="font-semibold text-gray-900">{highlight.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}