
'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { MapPin, Phone, Mail, Clock, Send, Upload, MessageCircle, PhoneCall, Headphones, Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    reason: '',
    message: '',
    file: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitted(true);
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ fullName: '', email: '', phone: '', reason: '', message: '', file: null });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: 'How do I post a project on BRIXXO?',
      answer: 'Simply create an account, go to your dashboard, and click "Add Project". Fill in your project details, and our verified professionals will send you proposals.'
    },
    {
      question: 'How long does it take to get responses from professionals?',
      answer: 'Most professionals respond within 24-48 hours. For urgent projects, you can use our priority posting feature.'
    },
    {
      question: 'Are all professionals verified?',
      answer: 'Yes, all professionals on our platform undergo a thorough verification process including background checks, license verification, and portfolio review.'
    },
    {
      question: 'What if I\'m not satisfied with the work?',
      answer: 'We have a satisfaction guarantee. If you\'re not happy with the service, contact our support team within 30 days for resolution.'
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach us through this contact form, WhatsApp, phone, or email. Our support team is available Monday to Saturday, 9 AM to 8 PM.'
    },
    {
      question: 'Is there a fee for posting projects?',
      answer: 'Posting basic projects is free. Premium features like priority listing and advanced analytics have optional paid upgrades.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative text-white overflow-hidden h-80 md:h-96">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-90"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop&crop=center)',
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-gray-900/60"></div>
          <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-full flex items-center">
            <div className="text-center w-full">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-poppins text-white drop-shadow-lg">
                Get in Touch With Us
              </h1>
              <p className="text-lg md:text-xl text-gray-100 drop-shadow-md max-w-2xl mx-auto">
                We're here to help you connect with trusted professionals.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-lg p-8" data-aos="fade-up">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-poppins">Send us a Message</h2>

                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Contact *</label>
                        <select
                          name="reason"
                          value={formData.reason}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
                        >
                          <option value="">Select a reason</option>
                          <option value="general">General Inquiry</option>
                          <option value="support">Customer Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="complaint">Complaint</option>
                          <option value="feedback">Feedback</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Attach File (optional)</label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#D4AF37] transition-colors"
                        >
                          <Upload className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-gray-600">
                            {formData.file ? formData.file.name : 'Click to upload PDF or image'}
                          </span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#0F0F0F] text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-8" data-aos="fade-up" data-aos-delay="200">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 font-poppins">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Office Address</h4>
                        <p className="text-gray-600">123 Construction Street<br />Building City, BC 12345</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Support Phone</h4>
                        <p className="text-gray-600">+1 (555) 123-4567</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Business Email</h4>
                        <p className="text-gray-600">support@dreamhouse.com</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Working Hours</h4>
                        <p className="text-gray-600">Mon - Sat: 9:00 AM - 8:00 PM<br />Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Maps Placeholder */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.241264875458!2d-73.98784868459375!3d40.74844097932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1623456789012!5m2!1sen!2sus"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    title="Office Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Contact Options */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Quick Contact Options</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the method that works best for you to get in touch with our team.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <a
                href="https://wa.me/15551234567"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-50 border border-green-200 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
                data-aos="fade-up"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp Chat</h3>
                <p className="text-gray-600 mb-4">Instant messaging for quick questions</p>
                <span className="text-green-600 font-medium">Start Chat →</span>
              </a>

              <button
                onClick={() => toast.success('Callback request submitted!')}
                className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PhoneCall className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Callback</h3>
                <p className="text-gray-600 mb-4">We'll call you back at your convenience</p>
                <span className="text-blue-600 font-medium">Request Now →</span>
              </button>

              <div
                className="bg-purple-50 border border-purple-200 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                data-aos="fade-up"
                data-aos-delay="200"
                onClick={() => toast.success('Live chat would open here!')}
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Chat with our support team in real-time</p>
                <span className="text-purple-600 font-medium">Start Chat →</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Frequently Asked Questions</h2>
              <p className="text-gray-600">
                Find answers to common questions about our platform and services.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm" data-aos="fade-up" data-aos-delay={index * 100}>
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900">{faq.question}</span>
                    <span className={`transform transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-16 bg-[#0F0F0F] text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <h2 className="text-3xl font-bold mb-4 font-poppins">Follow Us on Social Media</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Stay updated with the latest construction trends, project showcases, and community stories.
            </p>

            <div className="flex justify-center space-x-8">
              <a
                href="https://instagram.com/dreamhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors duration-300"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com/dreamhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors duration-300"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/company/dreamhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors duration-300"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://youtube.com/dreamhouse"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors duration-300"
                aria-label="Follow us on YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}