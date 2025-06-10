
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAddFunds } from '@/hooks/useWallet';

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
  const { toast } = useToast();
  const addFunds = useAddFunds();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
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

    setIsLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      const options = {
        key: 'rzp_test_GB1Gh077tKVWWP', // Your test key
        amount: paymentAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'SMM Kings',
        description: 'Wallet Top-up',
        order_id: `order_${Date.now()}`, // In production, get this from backend
        handler: async function (response: any) {
          try {
            console.log('Payment successful:', response);
            await addFunds.mutateAsync(paymentAmount);
            toast({
              title: 'Payment Successful!',
              description: `₹${paymentAmount} has been added to your wallet.`,
            });
            setAmount('');
            onSuccess?.();
          } catch (error) {
            console.error('Error updating wallet:', error);
            toast({
              title: 'Error',
              description: 'Failed to update wallet balance',
              variant: 'destructive',
            });
          }
          setIsLoading(false);
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
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
        <CardTitle>Add Funds to Wallet</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
              className="rounded-lg"
            >
              ₹{quickAmount}
            </Button>
          ))}
        </div>

        <Button
          onClick={handlePayment}
          className="w-full gradient-primary rounded-xl"
          disabled={!amount || parseFloat(amount) < 10 || isLoading}
        >
          {isLoading ? 'Processing...' : `Pay ₹${amount || '0'}`}
        </Button>

        <div className="text-xs text-gray-500 mt-2">
          <p>Test Mode: Use test card details</p>
          <p>Card: 4111 1111 1111 1111</p>
          <p>CVV: Any 3 digits | Expiry: Any future date</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RazorpayPayment;
