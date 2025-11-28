'use client';

import { CheckCircle, Wrench, Clock } from 'lucide-react';

export default function AdPromoSection() {
  return (
    <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-r from-green-600 to-black text-white relative" data-aos="fade-up">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 font-poppins text-white">
          Connect with verified construction companies instantly.
        </h2>

        <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-16 mt-12">
          <div className="flex items-center space-x-3" data-aos="fade-up" data-aos-delay="200">
            <CheckCircle className="w-10 h-10 text-green-400" />
            <span className="text-xl font-medium text-white">Verified</span>
          </div>

          <div className="flex items-center space-x-3" data-aos="fade-up" data-aos-delay="400">
            <Wrench className="w-10 h-10 text-green-400" />
            <span className="text-xl font-medium text-white">Quality</span>
          </div>

          <div className="flex items-center space-x-3" data-aos="fade-up" data-aos-delay="600">
            <Clock className="w-10 h-10 text-green-400" />
            <span className="text-xl font-medium text-white">On-Time Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}