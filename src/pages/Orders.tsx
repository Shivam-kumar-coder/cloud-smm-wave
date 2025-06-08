
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw, Eye, Filter } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    {
      id: '#12345',
      service: 'Instagram Followers',
      category: 'Instagram',
      link: 'https://instagram.com/example',
      quantity: 1000,
      delivered: 1000,
      status: 'Completed',
      progress: 100,
      amount: '$12.50',
      startCount: 5420,
      remains: 0,
      date: '2024-01-15',
      time: '14:30'
    },
    {
      id: '#12346',
      service: 'YouTube Views',
      category: 'YouTube',
      link: 'https://youtube.com/watch?v=example',
      quantity: 5000,
      delivered: 3750,
      status: 'In Progress',
      progress: 75,
      amount: '$25.00',
      startCount: 12500,
      remains: 1250,
      date: '2024-01-16',
      time: '09:15'
    },
    {
      id: '#12347',
      service: 'TikTok Likes',
      category: 'TikTok',
      link: 'https://tiktok.com/@example',
      quantity: 2500,
      delivered: 625,
      status: 'Processing',
      progress: 25,
      amount: '$15.75',
      startCount: 1200,
      remains: 1875,
      date: '2024-01-16',
      time: '16:45'
    },
    {
      id: '#12348',
      service: 'Facebook Page Likes',
      category: 'Facebook',
      link: 'https://facebook.com/example',
      quantity: 1500,
      delivered: 0,
      status: 'Pending',
      progress: 0,
      amount: '$18.90',
      startCount: 890,
      remains: 1500,
      date: '2024-01-17',
      time: '11:20'
    },
    {
      id: '#12349',
      service: 'Twitter Followers',
      category: 'Twitter',
      link: 'https://twitter.com/example',
      quantity: 800,
      delivered: 800,
      status: 'Completed',
      progress: 100,
      amount: '$17.60',
      startCount: 2300,
      remains: 0,
      date: '2024-01-14',
      time: '08:00'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Processing':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Orders', value: orders.length, color: 'text-blue-500' },
    { label: 'Completed', value: orders.filter(o => o.status === 'Completed').length, color: 'text-green-500' },
    { label: 'In Progress', value: orders.filter(o => o.status === 'In Progress').length, color: 'text-orange-500' },
    { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, color: 'text-yellow-500' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage all your social media marketing orders.
            </p>
          </div>
          <Button variant="outline" className="hover:scale-105 transition-transform duration-200">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card border-0">
              <CardContent className="p-6 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="glass-card border-0 hover:scale-[1.02] transition-transform duration-200">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Order Info */}
                  <div className="lg:col-span-4">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{order.service}</h3>
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Order {order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.date} at {order.time}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="lg:col-span-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{order.progress}%</span>
                      </div>
                      <Progress value={order.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Delivered: {order.delivered}</span>
                        <span>Total: {order.quantity}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-3">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start count:</span>
                        <span>{order.startCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remains:</span>
                        <span>{order.remains.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">{order.amount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredOrders.length === 0 && (
            <Card className="glass-card border-0">
              <CardContent className="p-12 text-center">
                <div className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No orders found matching your filters.' 
                    : 'No orders yet. Place your first order to get started!'}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
