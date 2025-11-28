'use client';

import { Tag, Truck, UserCheck } from 'lucide-react';

const deals = [
  {
    title: '10% Off Home Design Services',
    description: 'Get professional design consultation at discounted rates',
    icon: <Tag className="w-8 h-8 text-[#00A36C]" />,
    link: '/offers/design-discount'
  },
  {
    title: 'Bulk Discount on Building Materials',
    description: 'Save more when you buy materials in bulk',
    icon: <Truck className="w-8 h-8 text-[#00A36C]" />,
    link: '/offers/bulk-materials'
  },
  {
    title: 'Free First Consultation for New Users',
    description: 'Your first consultation with any professional is free',
    icon: <UserCheck className="w-8 h-8 text-[#00A36C]" />,
    link: '/offers/free-consultation'
  },
  {
    title: '20% Off Interior Design Packages',
    description: 'Complete interior design solutions at special prices',
    icon: <Tag className="w-8 h-8 text-[#00A36C]" />,
    link: '/offers/interior-discount'
  }
];

export default function DealsOffers() {
  return (
    <section className="py-16 bg-gradient-to-r from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
            Deals & Offers
          </h2>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  {deal.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-poppins">
                  {deal.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">
                  {deal.description}
                </p>
                <a
                  href={deal.link}
                  className="text-[#00A36C] font-semibold hover:text-[#008f5a] transition-colors duration-300"
                >
                  Learn More →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Scrollable */}
        <div className="md:hidden overflow-x-auto">
          <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
            {deals.map((deal, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex-shrink-0 w-72"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {deal.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 font-poppins">
                    {deal.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    {deal.description}
                  </p>
                  <a
                    href={deal.link}
                    className="text-[#00A36C] font-semibold hover:text-[#008f5a] transition-colors duration-300"
                  >
                    Learn More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}