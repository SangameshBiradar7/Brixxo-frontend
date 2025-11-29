import Navigation from '@/components/Navigation';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-16 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>

            <div className="prose prose-gray max-w-none">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6">
                By accessing and using BRIXXO, you accept and agree to be bound by the terms and provision of this agreement.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. User Accounts</h2>
              <p className="text-gray-700 mb-6">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Service Description</h2>
              <p className="text-gray-700 mb-6">
                BRIXXO provides a platform connecting homeowners with verified construction professionals. We facilitate communication and project management but are not directly involved in construction work.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Conduct</h2>
              <p className="text-gray-700 mb-6">
                You agree to use the service only for lawful purposes and in accordance with these terms. You are prohibited from using the service in any way that could damage, disable, or impair our platform.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Professional Verification</h2>
              <p className="text-gray-700 mb-6">
                While we strive to verify all professionals on our platform, we cannot guarantee the quality of work or reliability of any professional. Users should conduct their own due diligence.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Payment Terms</h2>
              <p className="text-gray-700 mb-6">
                Payment processing is handled through secure third-party providers. BRIXXO may charge service fees for certain transactions, which will be clearly disclosed.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-6">
                BRIXXO shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our service.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy Policy</h2>
              <p className="text-gray-700 mb-6">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of BRIXXO, to understand our practices.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Termination</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to terminate or suspend your account and access to our service at our sole discretion, without prior notice, for conduct that violates these terms.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to modify these terms at any time. Your continued use of BRIXXO after such modifications constitutes acceptance of the updated terms.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700 mb-6">
                These terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 mb-6">
                If you have any questions about these Terms & Conditions, please contact us at support@brixxo.in.
              </p>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Last updated:</strong> November 29, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}