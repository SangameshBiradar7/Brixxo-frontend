'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { CheckCircle, Users, Award, MessageSquare } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote: "BRIXXO transformed our home renovation experience. We found trustworthy professionals who delivered beyond our expectations.",
    name: "Sarah Johnson",
    role: "Homeowner",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face'
  },
  {
    id: 2,
    quote: "The platform's transparency and verified professionals gave us the confidence to start our dream kitchen project.",
    name: "Michael Chen",
    role: "Homeowner",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face'
  },
  {
    id: 3,
    quote: "As a contractor, BRIXXO helped me connect with quality clients and showcase my work effectively.",
    name: "David Rodriguez",
    role: "Contractor",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-16">
        {/* Hero Section – "Every Dream Deserves a Foundation" */}
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1080&fit=crop&crop=center)'
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-green-900/40"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-center text-white max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-poppins drop-shadow-2xl">
                Building Dreams, One Home at a Time
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 drop-shadow-lg">
                We connect homeowners with trusted professionals to bring their dream spaces to life.
              </p>
              <Link
                href="/professionals"
                className="inline-block bg-[#1E5631] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#0f2a18] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Find Trusted Professionals
              </Link>
            </div>
          </div>
        </section>

        {/* Story Section – "Our Journey" */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins">
                  Our Journey
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  It all started with a simple idea — to make construction simple, transparent, and reliable. We saw how stressful it was for people to find trustworthy professionals. That's why we built a platform that connects homeowners with verified companies, making the process effortless and transparent.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  What began as a solution to a common problem has now become India's most trusted digital construction marketplace, serving thousands of homeowners and hundreds of verified professionals.
                </p>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop&crop=center"
                  alt="Construction site with professionals"
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white relative">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=1920&h=600&fit=crop&crop=center)'
            }}
          ></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To simplify the construction journey for every homeowner — from inspiration to execution.
                </p>
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-6">
                  Our Vision
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To build a future where everyone can construct, design, and renovate their dream space confidently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
                What Makes Us Different
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <CheckCircle className="w-12 h-12 text-[#1E5631] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Professionals Only</h3>
                <p className="text-gray-600">Every professional on our platform undergoes rigorous verification</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <Users className="w-12 h-12 text-[#1E5631] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Real Projects, Real Results</h3>
                <p className="text-gray-600">Browse authentic project portfolios and client testimonials</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <MessageSquare className="w-12 h-12 text-[#1E5631] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Direct Communication</h3>
                <p className="text-gray-600">Connect directly with professionals for seamless collaboration</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <Award className="w-12 h-12 text-[#1E5631] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">End-to-End Support</h3>
                <p className="text-gray-600">From design consultation to project completion, we're with you</p>
              </div>
            </div>
          </div>
        </section>

        {/* Meet Our Professionals */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
                The People Behind Every Project
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our community of experts believes that every wall tells a story — from the first brick to the final touch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
                  alt="Architect"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Experienced Architects</h3>
                <p className="text-gray-600">Designing spaces that inspire and endure</p>
              </div>

              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                  alt="Interior Designer"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Creative Designers</h3>
                <p className="text-gray-600">Transforming interiors with vision and style</p>
              </div>

              <div className="text-center">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face"
                  alt="Contractor"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Skilled Contractors</h3>
                <p className="text-gray-600">Building foundations that stand the test of time</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact & Achievements */}
        <section className="py-16 bg-[#1E5631] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
                Our Impact in Numbers
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
                <div className="text-lg opacity-90">Verified Companies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">1200+</div>
                <div className="text-lg opacity-90">Completed Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-lg opacity-90">Customer Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
                <div className="text-lg opacity-90">Cities Served</div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins mb-4">
                Stories from Our Community
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <blockquote className="text-gray-700 mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-[#1E5631] font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-16 bg-cover bg-center relative text-white"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=600&fit=crop&crop=center)'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Dream Home Starts Here
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Let's make your vision a reality — with trusted professionals, real projects, and complete transparency.
            </p>
            <Link
              href="/register"
              className="inline-block bg-[#1E5631] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#0f2a18] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}