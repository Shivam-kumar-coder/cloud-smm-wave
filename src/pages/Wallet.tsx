
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
                  ₹{balance.toFixed(2)}
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
                    <CreditCard className="w-4 h-4 mr-2" />
                    Add Funds
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Funds via Razorpay</DialogTitle>
                    <DialogDescription>
                      Add money to your wallet using Razorpay payment gateway.
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
          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-500">
                +₹{transactions.filter(t => t.type === 'deposit' || t.type === 'refund').reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total Added</div>
            </CardContent>
          </Card>
          <Card className="glass-card border-0">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold text-red-500">
                ₹{transactions.filter(t => t.type === 'order' || t.type === 'withdrawal').reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)}
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
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your recent wallet transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-accent/50 hover:bg-accent/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-background">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{transaction.description || `${transaction.type} transaction`}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{new Date(transaction.created_at).toLocaleDateString()}</span>
                          <Badge variant="outline" className="text-xs">
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                        {getTransactionSign(transaction.type)}₹{Number(transaction.amount).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">#{transaction.id.slice(0, 8)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
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
