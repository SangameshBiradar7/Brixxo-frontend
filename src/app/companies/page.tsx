import Navigation from '@/components/Navigation';

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-16 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Construction Companies</h1>
            <p className="text-xl text-gray-600">
              Discover verified construction companies ready to bring your projects to life
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 mb-6">
              We're working to bring verified construction companies to our platform. Check back soon to connect with professional companies.
            </p>
            <a
              href="/register/professional"
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Join as a Company
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}