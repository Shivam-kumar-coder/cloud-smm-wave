
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-xl text-gray-600">
            Understanding our refund terms and conditions
          </p>
        </div>

        <div className="space-y-8">
          <Card className="light-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Shield className="w-6 h-6 text-blue-600" />
                Our Commitment
              </CardTitle>
              <CardDescription>
                We are committed to providing high-quality social media marketing services
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                At SMM Kings, we strive to deliver the best possible service to our customers. 
                We understand that sometimes things don't go as planned, which is why we have 
                established this comprehensive refund policy to protect your interests.
              </p>
            </CardContent>
          </Card>

          <Card className="light-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Refund Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Full Refund Cases:</h4>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Service not started within 24 hours of order placement</li>
                    <li>• Order cancelled before processing begins</li>
                    <li>• Technical errors from our side</li>
                    <li>• Duplicate payments or billing errors</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900">Partial Refund Cases:</h4>
                  <ul className="mt-2 space-y-1 text-gray-700">
                    <li>• Service partially completed but stopped due to platform issues</li>
                    <li>• Quality does not meet our promised standards</li>
                    <li>• Significant delays beyond our estimated delivery time</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="light-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Non-Refundable Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="space-y-2 text-gray-700">
                  <li>• Services that have been completed successfully</li>
                  <li>• Changes in customer requirements after order placement</li>
                  <li>• Account suspension or deletion by the social media platform</li>
                  <li>• Natural drop in followers/engagement after service completion</li>
                  <li>• Incorrect link provided by the customer</li>
                  <li>• Orders placed on private or restricted accounts</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="light-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Clock className="w-6 h-6 text-blue-600" />
                Refund Process Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Request Submitted</h4>
                  <p className="text-sm text-gray-600">
                    Submit your refund request through our support system
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Review Process</h4>
                  <p className="text-sm text-gray-600">
                    Our team reviews your case within 24-48 hours
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Refund Processed</h4>
                  <p className="text-sm text-gray-600">
                    Approved refunds are processed within 3-5 business days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="light-card">
            <CardHeader>
              <CardTitle className="text-gray-900">How to Request a Refund</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  To request a refund, please contact our support team with the following information:
                </p>
                <ul className="space-y-2 text-gray-700 ml-6">
                  <li>• Order ID and transaction details</li>
                  <li>• Reason for refund request</li>
                  <li>• Supporting evidence (screenshots, if applicable)</li>
                  <li>• Your registered email address</li>
                </ul>
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    📧 Email: support@smmkings.com<br/>
                    📞 Phone: +91-XXXXXXXXXX<br/>
                    🕒 Support Hours: 9 AM - 6 PM (Mon-Sat)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="light-card">
            <CardHeader>
              <CardTitle className="text-gray-900">Important Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• All refunds are processed to the original payment method</li>
                  <li>• Refund requests must be submitted within 7 days of order completion</li>
                  <li>• We reserve the right to refuse refunds for policy violations</li>
                  <li>• This policy is subject to change with prior notice</li>
                  <li>• For disputes, please refer to our Terms of Service</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Have questions about our refund policy?{' '}
            <a href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
