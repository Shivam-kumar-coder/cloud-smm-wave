
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownRight, DollarSign, CreditCard } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useProfile } from '@/hooks/useProfile';
import DashboardLayout from '@/components/DashboardLayout';
import RazorpayPayment from '@/components/RazorpayPayment';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Wallet = () => {
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const { data: wallet } = useWallet();
  const { data: profile } = useProfile();
  const { user } = useAuth();

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const balance = profile?.balance || 0;

  const getTransactionIcon = (type: string) => {
    return type === 'deposit' || type === 'refund' ? (
      <ArrowDownRight className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowUpRight className="w-4 h-4 text-red-500" />
    );
  };

  const getTransactionColor = (type: string) => {
    return type === 'deposit' || type === 'refund' ? 'text-green-500' : 'text-red-500';
  };

  const getTransactionSign = (type: string) => {
    return type === 'deposit' || type === 'refund' ? '+' : '-';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet</h1>
            <p className="text-gray-600">
              Manage your funds and view transaction history.
            </p>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="light-card border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-2">Current Balance</p>
                <h2 className="text-4xl font-bold text-blue-600">
                  ₹{balance.toFixed(2)}
                </h2>
                <p className="text-sm text-gray-500 mt-2">Available for orders</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <WalletIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-6">
              <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary hover:opacity-90 transition-all duration-200 rounded-xl">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Funds
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Funds via Razorpay</DialogTitle>
                    <DialogDescription>
                      Add money to your wallet using Razorpay payment gateway. Minimum amount: ₹10
                    </DialogDescription>
                  </DialogHeader>
                  <RazorpayPayment onSuccess={() => setIsAddFundsOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="light-card">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-500">
                +₹{transactions.filter(t => t.type === 'deposit' || t.type === 'refund').reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Added</div>
            </CardContent>
          </Card>
          <Card className="light-card">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold text-red-500">
                ₹{transactions.filter(t => t.type === 'order' || t.type === 'withdrawal').reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </CardContent>
          </Card>
          <Card className="light-card">
            <CardContent className="p-6 text-center">
              <WalletIcon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-blue-500">{transactions.length}</div>
              <div className="text-sm text-gray-600">Transactions</div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="light-card">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Transactions</CardTitle>
            <CardDescription>Your recent wallet transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-white border border-gray-200">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{transaction.description || `${transaction.type} transaction`}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                          <Badge variant="outline" className="text-xs rounded-full">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                        {getTransactionSign(transaction.type)}₹{Number(transaction.amount).toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">#{transaction.id.slice(0, 8)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <WalletIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet</p>
                  <p className="text-sm">Add funds to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;
