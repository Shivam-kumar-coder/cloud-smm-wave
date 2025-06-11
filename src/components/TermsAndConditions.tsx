
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CreditCard, Clock, AlertTriangle, Users, Lock } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const TermsAndConditions = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
          <p className="text-gray-600">
            Please read these terms carefully before using our services.
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="light-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Secure Transactions</h3>
                <p className="text-gray-600">
                  All payments are processed securely through Razorpay, India's most trusted payment gateway. 
                  We use 256-bit SSL encryption to protect your financial information.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Payment Methods</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Credit/Debit Cards (Visa, MasterCard, RuPay)</li>
                  <li>Net Banking</li>
                  <li>UPI Payments</li>
                  <li>Digital Wallets</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Wallet System</h3>
                <p className="text-gray-600">
                  Funds added to your wallet are non-refundable unless required by law. 
                  Wallet balance can be used for any services on our platform.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="light-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Refund Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Refund Eligibility</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Service not delivered within specified timeframe</li>
                  <li>Service quality doesn't match description</li>
                  <li>Technical issues preventing service delivery</li>
                  <li>Duplicate orders placed by mistake</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Refund Process</h3>
                <p className="text-gray-600">
                  Refund requests are processed within 3-5 business days. Approved refunds 
                  are credited back to your wallet or original payment method.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Non-Refundable Services</h3>
                <p className="text-gray-600">
                  Services that have been delivered successfully and match the description 
                  are generally non-refundable.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="light-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                Service Delivery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Delivery Timeframes</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Standard services: 1-24 hours</li>
                  <li>Premium services: 1-7 days</li>
                  <li>Bulk orders: 1-14 days</li>
                  <li>Custom requests: As specified</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Platform Delays</h3>
                <p className="text-gray-600">
                  Delivery times may be affected by social media platform restrictions, 
                  high demand periods, or technical maintenance.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Quality Guarantee</h3>
                <p className="text-gray-600">
                  We guarantee high-quality services with real engagement. Non-drop services 
                  come with replacement guarantee for 30 days.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="light-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Data Protection</h3>
                <p className="text-gray-600">
                  Your personal information is encrypted and stored securely. We comply with 
                  Indian data protection regulations and international privacy standards.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Information Sharing</h3>
                <p className="text-gray-600">
                  We never share your personal data with third parties for marketing purposes. 
                  Service-related information may be shared with delivery partners only.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Account Security</h3>
                <p className="text-gray-600">
                  Users are responsible for maintaining account security. Use strong passwords 
                  and report suspicious activity immediately.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="light-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Account Usage</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Provide accurate profile information</li>
                  <li>Use services for legitimate purposes only</li>
                  <li>Do not share account credentials</li>
                  <li>Report any unauthorized access</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Prohibited Activities</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Using services for illegal content</li>
                  <li>Attempting to manipulate algorithms</li>
                  <li>Creating fake or duplicate accounts</li>
                  <li>Interfering with platform operations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="light-card border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                Important Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-red-700">
                <p className="mb-2">
                  <strong>Platform Risks:</strong> Social media platforms may change their algorithms 
                  or policies, which could affect service delivery.
                </p>
                <p className="mb-2">
                  <strong>No Guarantee:</strong> While we strive for 100% delivery, we cannot guarantee 
                  results due to factors beyond our control.
                </p>
                <p>
                  <strong>Account Safety:</strong> Use of SMM services may violate platform terms. 
                  Users accept full responsibility for their accounts.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-600">
            By using our services, you agree to these terms and conditions. 
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TermsAndConditions;
