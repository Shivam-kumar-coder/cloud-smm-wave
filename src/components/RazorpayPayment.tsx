
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAddFunds } from '@/hooks/useWallet';
import { Shield, Lock, CreditCard } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  onSuccess?: () => void;
}

const RazorpayPayment = ({ onSuccess }: RazorpayPaymentProps) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();
  const addFunds = useAddFunds();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const paymentAmount = parseFloat(amount);
    
    if (paymentAmount < 10) {
      toast({
        title: 'Invalid Amount',
        description: 'Minimum amount is ₹10',
        variant: 'destructive',
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please agree to the terms and conditions',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      const options = {
        key: 'rzp_test_GB1Gh077tKVWWP',
        amount: paymentAmount * 100,
        currency: 'INR',
        name: 'SMM Kings',
        description: 'Wallet Top-up - Secure Payment',
        order_id: `order_${Date.now()}`,
        handler: async function (response: any) {
          try {
            console.log('Payment successful:', response);
            await addFunds.mutateAsync(paymentAmount);
            toast({
              title: 'Payment Successful! 🎉',
              description: `₹${paymentAmount} has been securely added to your wallet.`,
            });
            setAmount('');
            setAgreedToTerms(false);
            onSuccess?.();
          } catch (error) {
            console.error('Error updating wallet:', error);
            toast({
              title: 'Payment Processed',
              description: 'Payment was successful but there was an issue updating your wallet. Please contact support.',
              variant: 'destructive',
            });
          }
          setIsLoading(false);
        },
        prefill: {
          name: 'SMM User',
          email: 'user@smmkings.com',
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast({
              title: 'Payment Cancelled',
              description: 'Your payment was cancelled. No amount was charged.',
            });
          },
        },
        retry: {
          enabled: true,
          max_count: 3
        },
        timeout: 300,
        remember_customer: false
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        toast({
          title: 'Payment Failed',
          description: response.error.description || 'Payment could not be processed. Please try again.',
          variant: 'destructive',
        });
        setIsLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'Unable to process payment. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const quickAmounts = [10, 50, 100, 500, 1000, 2000];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Secure Payment Gateway
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <Shield className="w-4 h-4" />
          <span>256-bit SSL Encrypted</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800 text-sm">
            <Lock className="w-4 h-4" />
            <span>Powered by Razorpay - India's Most Trusted Payment Gateway</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            min="10"
            placeholder="Enter amount (min ₹10)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="rounded-xl"
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map((quickAmount) => (
            <Button
              key={quickAmount}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAmount(quickAmount.toString())}
              className="rounded-lg hover:bg-blue-50"
            >
              ₹{quickAmount}
            </Button>
          ))}
        </div>

        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm leading-tight">
              I agree to the{' '}
              <Dialog>
                <DialogTrigger asChild>
                  <span className="text-blue-600 underline cursor-pointer">
                    Terms and Conditions
                  </span>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Terms and Conditions</DialogTitle>
                    <DialogDescription>
                      Please read our terms and conditions carefully before proceeding.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm">
                    <section>
                      <h3 className="font-semibold mb-2">1. Payment Terms</h3>
                      <p>All payments are processed securely through Razorpay. We do not store your payment information.</p>
                    </section>
                    <section>
                      <h3 className="font-semibold mb-2">2. Refund Policy</h3>
                      <p>Refunds are processed within 3-5 business days. Service-related refunds depend on service completion status.</p>
                    </section>
                    <section>
                      <h3 className="font-semibold mb-2">3. Service Delivery</h3>
                      <p>Services are delivered within the specified timeframe. Delays may occur due to platform restrictions.</p>
                    </section>
                    <section>
                      <h3 className="font-semibold mb-2">4. Account Security</h3>
                      <p>Users are responsible for maintaining account security. Report suspicious activity immediately.</p>
                    </section>
                    <section>
                      <h3 className="font-semibold mb-2">5. Service Quality</h3>
                      <p>We guarantee high-quality services. Non-drop services come with replacement guarantee.</p>
                    </section>
                    <section>
                      <h3 className="font-semibold mb-2">6. Privacy Policy</h3>
                      <p>Your data is protected and never shared with third parties. We comply with data protection regulations.</p>
                    </section>
                  </div>
                </DialogContent>
              </Dialog>
            </Label>
          </div>
        </div>

        <Button
          onClick={handlePayment}
          className="w-full gradient-primary rounded-xl h-12 text-lg font-semibold"
          disabled={!amount || parseFloat(amount) < 10 || isLoading || !agreedToTerms}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing Secure Payment...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Pay ₹{amount || '0'} Securely
            </div>
          )}
        </Button>

        <div className="text-xs text-gray-500 space-y-1 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="font-semibold text-yellow-800">🧪 Test Mode Active</p>
          <p><strong>Test Card:</strong> 4111 1111 1111 1111</p>
          <p><strong>CVV:</strong> Any 3 digits | <strong>Expiry:</strong> Any future date</p>
          <p><strong>OTP:</strong> Use any 6 digit number</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RazorpayPayment;
