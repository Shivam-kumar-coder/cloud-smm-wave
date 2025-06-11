import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Eye, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useOrders } from '@/hooks/useOrders';
import OrderStatusTracker from '@/components/OrderStatusTracker';

const Orders = () => {
  const { data: orders = [], isLoading } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders.filter(order => {
    const searchRegex = new RegExp(searchTerm, 'i');
    const matchesSearch = searchRegex.test(order.services?.name) || searchRegex.test(order.id);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
  };

  const statusOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Orders</h1>
            <p className="text-muted-foreground mt-2">
              Track and manage your SMM Kings orders.
            </p>
          </div>
        </div>

        <Card className="glass-card border-0">
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Order History</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search orders..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading orders...
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="glass-card border-0 hover:scale-105 transition-transform duration-200">
                    <CardHeader>
                      <CardTitle>{order.services?.name}</CardTitle>
                      <CardDescription>Order ID: {order.id}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <OrderStatusTracker status={order.status} />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Quantity: {order.quantity.toLocaleString()}
                        </span>
                        <span className="text-sm font-medium">
                          ${Number(order.total_cost).toFixed(2)}
                        </span>
                      </div>
                      <Button variant="outline" className="w-full" onClick={() => handleViewOrder(order)}>
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No orders found.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <Card className="w-full max-w-2xl glass-card border-0">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Order Details</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                  <XCircle className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Service</Label>
                    <p className="font-medium">{selectedOrder.services?.name}</p>
                  </div>
                  <div>
                    <Label>Order ID</Label>
                    <p className="font-medium">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <OrderStatusTracker status={selectedOrder.status} />
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <p className="font-medium">{selectedOrder.quantity.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Total Cost</Label>
                    <p className="font-medium">${Number(selectedOrder.total_cost).toFixed(2)}</p>
                  </div>
                  <div>
                    <Label>Order Date</Label>
                    <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <Label>Link</Label>
                  <p className="font-medium">{selectedOrder.link}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;
