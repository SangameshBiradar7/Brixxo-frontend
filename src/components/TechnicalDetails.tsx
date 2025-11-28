'use client';

interface TechnicalDetailsProps {
  materials?: string[];
  timeline?: string;
  designStyle?: string;
  budget?: number;
  size?: number;
  features?: string[];
}

export default function TechnicalDetails({
  materials = [],
  timeline,
  designStyle,
  budget,
  size,
  features = []
}: TechnicalDetailsProps) {
  const specifications = [
    {
      category: 'Materials Used',
      items: materials.length > 0 ? materials : ['Cement', 'Steel', 'Wood', 'Flooring']
    },
    {
      category: 'Construction Timeline',
      items: [timeline || '12-18 months']
    },
    {
      category: 'Design Style',
      items: [designStyle || 'Modern Contemporary']
    },
    {
      category: 'Budget Breakdown',
      items: budget ? [`₹${(budget * 0.4).toLocaleString()} - Foundation`, `₹${(budget * 0.3).toLocaleString()} - Structure`, `₹${(budget * 0.3).toLocaleString()} - Finishing`] : ['Foundation: 40%', 'Structure: 30%', 'Finishing: 30%']
    }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Technical Details & Specifications</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {specifications.map((spec, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-[#00A36C] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {spec.category}
              </h3>
              <ul className="space-y-2">
                {spec.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center text-gray-700">
                    <svg className="w-4 h-4 text-[#00A36C] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Project Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-[#00A36C]/5 rounded-lg">
            <div className="text-2xl font-bold text-[#00A36C]">{size || 'N/A'}</div>
            <div className="text-sm text-gray-600">Sq. Ft. Area</div>
          </div>
          <div className="text-center p-4 bg-[#00A36C]/5 rounded-lg">
            <div className="text-2xl font-bold text-[#00A36C]">{timeline ? timeline.split(' ')[0] : '12-18'}</div>
            <div className="text-sm text-gray-600">Months Duration</div>
          </div>
          <div className="text-center p-4 bg-[#00A36C]/5 rounded-lg">
            <div className="text-2xl font-bold text-[#00A36C]">{materials.length || '4+'}</div>
            <div className="text-sm text-gray-600">Material Types</div>
          </div>
          <div className="text-center p-4 bg-[#00A36C]/5 rounded-lg">
            <div className="text-2xl font-bold text-[#00A36C]">{features.length || '10+'}</div>
            <div className="text-sm text-gray-600">Features</div>
          </div>
        </div>
      </div>
    </section>
  );
}