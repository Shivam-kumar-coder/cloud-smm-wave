
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Wallet as WalletIcon, CreditCard, Plus, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';

const Wallet = () => {
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const balance = 125.50;

  const transactions = [
    {
      id: '#TXN001',
      type: 'credit',
      description: 'Funds Added - PayPal',
      amount: 100.00,
      date: '2024-01-17',
      time: '14:30',
      status: 'Completed'
    },
    {
      id: '#TXN002',
      type: 'debit',
      description: 'Order #12345 - Instagram Followers',
      amount: -12.50,
      date: '2024-01-16',
      time: '16:45',
      status: 'Completed'
    },
    {
      id: '#TXN003',
      type: 'debit',
      description: 'Order #12346 - YouTube Views',
      amount: -25.00,
      date: '2024-01-16',
      time: '09:15',
      status: 'Completed'
    },
    {
      id: '#TXN004',
      type: 'credit',
      description: 'Funds Added - Credit Card',
      amount: 50.00,
      date: '2024-01-15',
      time: '11:20',
      status: 'Completed'
    },
    {
      id: '#TXN005',
      type: 'debit',
      description: 'Order #12347 - TikTok Likes',
      amount: -15.75,
      date: '2024-01-15',
      time: '08:00',
      status: 'Completed'
    }
  ];

  const paymentMethods = [
    { value: 'paypal', label: 'PayPal', icon: '💳' },
    { value: 'stripe', label: 'Credit/Debit Card', icon: '💳' },
    { value: 'crypto', label: 'Cryptocurrency', icon: '₿' },
    { value: 'bank', label: 'Bank Transfer', icon: '🏦' }
  ];

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Funds Added Successfully!',
        description: `$${amount} has been added to your wallet.`,
      });
      
      setIsAddFundsOpen(false);
      setAmount('');
      setPaymentMethod('');
    } catch (error) {
      toast({
        title: 'Payment Failed',
        description: 'Unable to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    return type === 'credit' ? (
      <ArrowDownRight className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-red-500" />
    );
  };

  const getTransactionColor = (type: string) => {
    return type === 'credit' ? 'text-green-500' : 'text-red-500';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Wallet</h1>
            <p className="text-muted-foreground">
              Manage your funds and view transaction history.
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="glass-card border-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10" />
          <CardContent className="p-8 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-2">Current Balance</p>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  ${balance.toFixed(2)}
                </h2>
                <p className="text-sm text-muted-foreground mt-2">Available for orders</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <WalletIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-6">
              <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary hover:scale-105 transition-transform duration-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Funds
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Funds to Wallet</DialogTitle>
                    <DialogDescription>
                      Choose your payment method and amount to add funds to your wallet.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddFunds} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                      />
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {quickAmounts.map((quickAmount) => (
                          <Button
                            key={quickAmount}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setAmount(quickAmount.toString())}
                          >
                            ${quickAmount}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {paymentMethods.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              <div className="flex items-center gap-2">
                                <span>{method.icon}</span>
                                <span>{method.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gradient-primary"
                      disabled={!amount || !paymentMethod || isLoading}
                    >
                      {isLoading ? (
                        'Processing...'
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Add ${amount || '0.00'}
                        </>
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-500">
                +${transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Added</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold text-red-500">
                ${Math.abs(transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Spent</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <WalletIcon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-blue-500">{transactions.length}</div>
              <div className="text-sm text-muted-foreground">Transactions</div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Your recent wallet transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-background">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{transaction.description}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{transaction.date} at {transaction.time}</span>
                        <Badge variant="outline" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'credit' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">{transaction.id}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;
