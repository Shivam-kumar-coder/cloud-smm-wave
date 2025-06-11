
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ExternalLink, Calendar, CreditCard, Loader2, ShoppingCart } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import DashboardLayout from '@/components/DashboardLayout';
import OrderStatusTracker from '@/components/OrderStatusTracker';
import { format } from 'date-fns';

const Orders = () => {
  const { data: orders = [], isLoading } = useOrders();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              My Orders
            </h1>
            <p className="text-gray-600">
              Track your SMM service orders and their delivery status.
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/new-order'} 
            className="gradient-primary rounded-xl"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            New Order
          </Button>
        </div>

        {orders.length === 0 ? (
          <Card className="light-card text-center py-12">
            <CardContent>
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start by ordering your first SMM service!
              </p>
              <Button 
                onClick={() => window.location.href = '/new-order'} 
                className="gradient-primary rounded-xl"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Place Your First Order
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="light-card hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">
                        {order.services?.name || 'Unknown Service'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(order.created_at), 'MMM dd, yyyy HH:mm')}
                        </span>
                        <span>Order #{order.id.slice(0, 8)}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="rounded-full">
                      {order.services?.category || 'Unknown'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <OrderStatusTracker status={order.status || 'pending'} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {order.quantity?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-gray-600">Quantity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-1">
                        <CreditCard className="w-5 h-5" />
                        ₹{order.total_cost || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Cost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {order.remains || 0}
                      </div>
                      <div className="text-sm text-gray-600">Remaining</div>
                    </div>
                  </div>

                  {order.link && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Target Link:</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 truncate">
                          {order.link}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(order.link, '_blank')}
                          className="rounded-lg"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Last updated: {format(new Date(order.updated_at), 'MMM dd, HH:mm')}
                    </div>
                    {order.status === 'processing' && (
                      <div className="flex items-center gap-2 text-blue-600 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Delivering...
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;
