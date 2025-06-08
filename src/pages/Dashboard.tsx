
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  Plus,
  ArrowRight,
  DollarSign,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useProfile } from '@/hooks/useProfile';
import { useOrders } from '@/hooks/useOrders';

const Dashboard = () => {
  const { data: profile } = useProfile();
  const { data: orders = [] } = useOrders();

  const completedOrders = orders.filter(order => order.status === 'completed');
  const activeOrders = orders.filter(order => ['pending', 'processing'].includes(order.status));
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_cost), 0);

  const stats = [
    {
      title: 'Wallet Balance',
      value: `$${(profile?.balance || 0).toFixed(2)}`,
      description: 'Available funds',
      icon: <Wallet className="w-4 h-4" />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      description: 'All time orders',
      icon: <ShoppingBag className="w-4 h-4" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Active Orders',
      value: activeOrders.length.toString(),
      description: 'In progress',
      icon: <Clock className="w-4 h-4" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      title: 'Total Spent',
      value: `$${totalSpent.toFixed(2)}`,
      description: 'All time',
      icon: <DollarSign className="w-4 h-4" />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  const quickActions = [
    {
      title: 'Place New Order',
      description: 'Browse our services and place a new order',
      icon: <Plus className="w-5 h-5" />,
      link: '/dashboard/new-order',
      gradient: 'from-purple-500 to-cyan-500'
    },
    {
      title: 'Add Funds',
      description: 'Top up your wallet to place more orders',
      icon: <Wallet className="w-5 h-5" />,
      link: '/dashboard/wallet',
      gradient: 'from-green-500 to-blue-500'
    },
    {
      title: 'View Orders',
      description: 'Check the status of your orders',
      icon: <ShoppingBag className="w-5 h-5" />,
      link: '/dashboard/orders',
      gradient: 'from-orange-500 to-pink-500'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name || 'User'}! 👋</h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening with your account today.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card border-0 hover:scale-105 transition-transform duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="glass-card border-0 hover:scale-105 transition-transform duration-200 cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center text-white mb-4`}>
                    {action.icon}
                  </div>
                  <CardTitle className="text-xl">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="glass-card border-0">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest order activity</CardDescription>
            </div>
            <Link to="/dashboard/orders">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{order.services?.name}</h4>
                      <span className="text-sm font-medium">${Number(order.total_cost).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>Quantity: {order.quantity.toLocaleString()}</span>
                      <span className={`font-medium ${
                        order.status === 'completed' ? 'text-green-500' : 
                        order.status === 'processing' ? 'text-blue-500' : 'text-orange-500'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <Progress 
                      value={order.status === 'completed' ? 100 : order.status === 'processing' ? 75 : 25} 
                      className="h-2" 
                    />
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No orders yet. Place your first order to get started!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
