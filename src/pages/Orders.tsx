
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw, Eye, Filter } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useOrders } from '@/hooks/useOrders';
import { format } from 'date-fns';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: orders = [], isLoading, refetch } = useOrders();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'processing':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getProgress = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 100;
      case 'processing':
        return 75;
      case 'pending':
        return 25;
      case 'cancelled':
        return 0;
      default:
        return 0;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.services?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Orders', value: orders.length, color: 'text-blue-500' },
    { label: 'Success', value: orders.filter(o => o.status === 'success').length, color: 'text-green-500' },
    { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'text-blue-500' },
    { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'text-yellow-500' }
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

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
          <Button variant="outline" onClick={() => refetch()} className="hover:scale-105 transition-transform duration-200">
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
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
                      <h3 className="font-semibold">{order.services?.name || 'Unknown Service'}</h3>
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), 'MMM dd, yyyy')} at {format(new Date(order.created_at), 'HH:mm')}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="lg:col-span-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{getProgress(order.status)}%</span>
                      </div>
                      <Progress value={getProgress(order.status)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Quantity: {order.quantity}</span>
                        <span>Status: {order.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-3">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start count:</span>
                        <span>{order.start_count || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remains:</span>
                        <span>{order.remains || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">₹{order.total_cost}</span>
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
