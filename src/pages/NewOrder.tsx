
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Clock, Star, Wallet, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useServices } from '@/hooks/useServices';
import { useCreateOrder } from '@/hooks/useOrders';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const NewOrder = () => {
  const [category, setCategory] = useState('');
  const [service, setService] = useState('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: services = [] } = useServices();
  const createOrder = useCreateOrder();
  const { data: profile } = useProfile();

  const categories = [...new Set(services.map(s => s.category))];
  const filteredServices = services.filter(s => s.category === category);
  const selectedService = filteredServices.find(s => s.id === service);
  
  const totalPrice = selectedService && quantity 
    ? (selectedService.price_per_1000 * parseInt(quantity) / 1000).toFixed(2) 
    : '0.00';

  const userBalance = profile?.balance || 0;
  const hasInsufficientFunds = parseFloat(totalPrice) > userBalance;

  useEffect(() => {
    if (category && !filteredServices.find(s => s.id === service)) {
      setService('');
    }
  }, [category, filteredServices, service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedService) {
      toast({
        title: 'Error',
        description: 'Please select a service',
        variant: 'destructive',
      });
      return;
    }

    const orderAmount = parseFloat(totalPrice);

    if (orderAmount > userBalance) {
      toast({
        title: 'Insufficient Wallet Balance',
        description: `You need ₹${orderAmount.toFixed(2)} but only have ₹${userBalance.toFixed(2)}. Please add funds to your wallet.`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create order
      const orderData = await createOrder.mutateAsync({
        service_id: selectedService.id,
        link,
        quantity: parseInt(quantity),
        total_cost: orderAmount,
      });

      // Deduct from wallet balance
      const newBalance = userBalance - orderAmount;
      await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', user?.id);

      // Create transaction record
      await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          type: 'order',
          amount: orderAmount,
          description: `Order for ${selectedService.name}`,
          status: 'completed'
        });

      // Send admin notification email
      try {
        await supabase.functions.invoke('send-order-notification', {
          body: {
            order: {
              id: orderData.id,
              user_email: user?.email,
              service_name: selectedService.name,
              quantity: parseInt(quantity),
              amount: orderAmount,
              link,
            }
          }
        });
      } catch (emailError) {
        console.log('Email notification failed:', emailError);
        // Don't block the order if email fails
      }

      toast({
        title: 'Order Placed Successfully!',
        description: `Your order for ${selectedService.name} has been placed. ₹${orderAmount.toFixed(2)} deducted from wallet.`,
      });
      
      // Reset form
      setCategory('');
      setService('');
      setLink('');
      setQuantity('');
    } catch (error: any) {
      toast({
        title: 'Order Failed',
        description: error.message || 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Place New Order</h1>
          <p className="text-gray-600">
            Choose from our wide range of social media marketing services to boost your online presence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card className="light-card">
              <CardHeader>
                <CardTitle className="text-gray-900">Order Details</CardTitle>
                <CardDescription>Fill in the details below to place your order</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {category && (
                    <div className="space-y-2">
                      <Label htmlFor="service">Service</Label>
                      <Select value={service} onValueChange={setService}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredServices.map((serv) => (
                            <SelectItem key={serv.id} value={serv.id}>
                              {serv.name} - ₹{serv.price_per_1000}/1k
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="link">Link</Label>
                    <Input
                      id="link"
                      type="url"
                      placeholder="https://instagram.com/your-profile"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      required
                      className="rounded-xl"
                    />
                  </div>

                  {selectedService && (
                    <div className="space-y-2">
                      <Label htmlFor="quantity">
                        Quantity (Min: {selectedService.min_quantity}, Max: {selectedService.max_quantity})
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min={selectedService.min_quantity}
                        max={selectedService.max_quantity}
                        placeholder={`Enter quantity (${selectedService.min_quantity}-${selectedService.max_quantity})`}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        className="rounded-xl"
                      />
                    </div>
                  )}

                  {hasInsufficientFunds && parseFloat(totalPrice) > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-red-800 text-sm">
                          Insufficient wallet balance! You need ₹{totalPrice} but have ₹{userBalance.toFixed(2)}. 
                          Please add funds to your wallet.
                        </p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full gradient-primary hover:opacity-90 transition-all duration-200 rounded-xl py-3"
                    disabled={!selectedService || !link || !quantity || isLoading || hasInsufficientFunds}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Placing Order...
                      </div>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Place Order - ₹{totalPrice}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Wallet Info */}
          <div className="space-y-6">
            {/* Wallet Balance */}
            <Card className="light-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  Wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">₹{userBalance.toFixed(2)}</div>
                <p className="text-sm text-gray-600 mt-1">Available for orders</p>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="light-card">
              <CardHeader>
                <CardTitle className="text-gray-900">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedService ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium text-gray-900">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per 1000:</span>
                      <span className="font-medium text-gray-900">₹{selectedService.price_per_1000}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium text-gray-900">{quantity || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delivery time:</span>
                      <span className="font-medium flex items-center gap-1 text-gray-900">
                        <Clock className="w-4 h-4" />
                        0-24 hours
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gray-900">Total:</span>
                        <span className={hasInsufficientFunds ? 'text-red-500' : 'text-blue-600'}>
                          ₹{totalPrice}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Select a service to see the summary
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Why Choose Us */}
            <Card className="light-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Why Choose Us?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">High Quality</p>
                    <p className="text-sm text-gray-600">Real, active users with high retention rates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Fast Delivery</p>
                    <p className="text-sm text-gray-600">Most orders start within minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">24/7 Support</p>
                    <p className="text-sm text-gray-600">Always here to help you succeed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NewOrder;
