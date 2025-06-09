
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, Clock, MessageCircle, HelpCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CustomerSupport = () => {
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('medium');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit a support ticket.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject,
          message,
          priority,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: 'Support Ticket Submitted',
        description: 'We have received your request and will respond within 24 hours.',
      });

      // Reset form
      setSubject('');
      setMessage('');
      setPriority('medium');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit support ticket.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Customer Support</h1>
          <p className="text-xl text-gray-600">
            We're here to help! Get in touch with our support team.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="light-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Mail className="w-5 h-5 text-blue-600" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-700">support@smmkings.com</p>
                  <p className="text-sm text-gray-600">
                    For general inquiries and technical support
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="light-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Phone className="w-5 h-5 text-green-600" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-700">+91-XXXXXXXXXX</p>
                  <p className="text-sm text-gray-600">
                    Available Mon-Sat, 9 AM - 6 PM IST
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="light-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-700">Within 24 hours</p>
                  <p className="text-sm text-gray-600">
                    We aim to respond to all queries promptly
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="light-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <HelpCircle className="w-5 h-5 text-orange-600" />
                  Common Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Order status inquiries</li>
                  <li>• Payment and billing issues</li>
                  <li>• Service quality concerns</li>
                  <li>• Account-related questions</li>
                  <li>• Refund requests</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Support Form */}
          <div className="lg:col-span-2">
            <Card className="light-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  Submit a Support Ticket
                </CardTitle>
                <CardDescription>
                  Describe your issue in detail and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General inquiry</SelectItem>
                        <SelectItem value="medium">Medium - Standard issue</SelectItem>
                        <SelectItem value="high">High - Urgent matter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide detailed information about your issue, including order IDs if applicable..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">Tips for faster resolution:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Include your order ID for order-related issues</li>
                          <li>• Attach screenshots if relevant</li>
                          <li>• Provide your registered email address</li>
                          <li>• Be specific about the problem you're experiencing</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !user}
                    className="w-full gradient-primary hover:opacity-90 transition-all duration-200 rounded-xl py-3"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </div>
                    ) : !user ? (
                      'Please log in to submit a ticket'
                    ) : (
                      'Submit Support Ticket'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="light-card mt-8">
              <CardHeader>
                <CardTitle className="text-gray-900">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">How long does order delivery take?</h4>
                    <p className="text-gray-700 text-sm">
                      Most orders begin processing within 0-24 hours. Delivery time varies by service type and quantity.
                    </p>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Can I cancel my order?</h4>
                    <p className="text-gray-700 text-sm">
                      Orders can be cancelled before processing begins. Once started, cancellation may not be possible.
                    </p>
                  </div>
                  
                  <div className="border-b border-gray-200 pb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">How do refunds work?</h4>
                    <p className="text-gray-700 text-sm">
                      Please refer to our <a href="/refund-policy" className="text-blue-600 hover:text-blue-700">Refund Policy</a> for detailed information about refund eligibility and process.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Is my personal information secure?</h4>
                    <p className="text-gray-700 text-sm">
                      Yes, we use industry-standard security measures to protect your data and never share your information with third parties.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
