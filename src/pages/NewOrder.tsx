
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Calculator, AlertCircle, Wallet, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useServices } from '@/hooks/useServices';
import { useCreateOrder } from '@/hooks/useOrders';
import { useWallet } from '@/hooks/useWallet';

const NewOrder = () => {
  const [selectedService, setSelectedService] = useState('');
  const [quantity, setQuantity] = useState('');
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  const { toast } = useToast();
  const { data: services = [], isLoading: servicesLoading } = useServices();
  const { data: wallet } = useWallet();
  const createOrder = useCreateOrder();

  const activeServices = services.filter(service => service.is_active);
  const selectedServiceData = activeServices.find(service => service.id === selectedService);
  const balance = wallet?.balance || 0;

  useEffect(() => {
    if (selectedServiceData && quantity) {
      const qty = parseInt(quantity) || 0;
      const cost = (qty / 1000) * selectedServiceData.price_per_1000;
      setTotalCost(Math.round(cost * 100) / 100);
    } else {
      setTotalCost(0);
    }
  }, [selectedService, quantity, selectedServiceData]);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedServiceData) {
      toast({
        title: 'Service Required',
        description: 'Please select a service.',
        variant: 'destructive',
      });
      return;
    }

    const qty = parseInt(quantity);
    
    if (!qty || qty < selectedServiceData.min_quantity || qty > selectedServiceData.max_quantity) {
      toast({
        title: 'Invalid Quantity',
        description: `Quantity must be between ${selectedServiceData.min_quantity} and ${selectedServiceData.max_quantity}.`,
        variant: 'destructive',
      });
      return;
    }

    if (!link || !validateUrl(link)) {
      toast({
        title: 'Invalid Link',
        description: 'Please provide a valid URL.',
        variant: 'destructive',
      });
      return;
    }

    if (totalCost > balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'Please add funds to your wallet first.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await createOrder.mutateAsync({
        service_id: selectedService,
        quantity: qty,
        link: link.trim(),
        total_cost: totalCost,
      });

      toast({
        title: 'Order Placed Successfully! 🎉',
        description: 'Your order has been submitted and will be processed shortly.',
      });

      // Reset form
      setSelectedService('');
      setQuantity('');
      setLink('');
      setTotalCost(0);
      
      // Redirect to orders page
      setTimeout(() => {
        window.location.href = '/orders';
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: 'Order Failed',
        description: error.message || 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const groupedServices = activeServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof activeServices>);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            Place New Order
          </h1>
          <p className="text-gray-600">
            Choose a service and boost your social media presence instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card className="light-card">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>
                  Fill in the details below to place your order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="service">Select Service</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Choose a service..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(groupedServices).map(([category, categoryServices]) => (
                          <div key={category}>
                            <div className="px-2 py-1 text-sm font-semibold text-gray-500 bg-gray-100">
                              {category}
                            </div>
                            {categoryServices.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                <div className="flex items-center justify-between w-full">
                                  <span>{service.name}</span>
                                  <span className="text-sm text-gray-500 ml-4">₹{service.price_per_1000}/1k</span>
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Service Details */}
                  {selectedServiceData && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-blue-900">{selectedServiceData.name}</h3>
                          <Badge variant="outline" className="rounded-full">
                            {selectedServiceData.category}
                          </Badge>
                        </div>
                        {selectedServiceData.description && (
                          <p className="text-sm text-blue-700">{selectedServiceData.description}</p>
                        )}
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-blue-600 font-medium">Price:</span>
                            <br />
                            ₹{selectedServiceData.price_per_1000}/1k
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">Min:</span>
                            <br />
                            {selectedServiceData.min_quantity.toLocaleString()}
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">Max:</span>
                            <br />
                            {selectedServiceData.max_quantity.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder={selectedServiceData ? `Min: ${selectedServiceData.min_quantity}` : "Enter quantity"}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min={selectedServiceData?.min_quantity || 1}
                      max={selectedServiceData?.max_quantity || 1000000}
                      className="rounded-xl"
                      required
                    />
                  </div>

                  {/* Link */}
                  <div className="space-y-2">
                    <Label htmlFor="link">Target Link</Label>
                    <Input
                      id="link"
                      type="url"
                      placeholder="https://instagram.com/your-profile"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="rounded-xl"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Provide the complete URL of your post/profile
                    </p>
                  </div>

                  {/* Balance Warning */}
                  {totalCost > balance && totalCost > 0 && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        Insufficient balance. You need ₹{(totalCost - balance).toFixed(2)} more to place this order.
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-red-600 underline ml-1"
                          onClick={() => window.location.href = '/wallet'}
                        >
                          Add funds
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full gradient-primary rounded-xl h-12 text-lg font-semibold"
                    disabled={!selectedService || !quantity || !link || isLoading || totalCost > balance}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Placing Order...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Place Order - ₹{totalCost.toFixed(2)}
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="light-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">
                      {selectedServiceData?.name || 'None selected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">
                      {quantity ? parseInt(quantity).toLocaleString() : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rate:</span>
                    <span className="font-medium">
                      ₹{selectedServiceData?.price_per_1000 || 0}/1k
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Cost:</span>
                    <span className="text-blue-600">₹{totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="light-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{balance.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-600">Available Balance</p>
                </div>
                
                {totalCost > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>After Order:</span>
                      <span className={totalCost > balance ? 'text-red-600 font-medium' : 'text-gray-600'}>
                        ₹{Math.max(0, balance - totalCost).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  className="w-full rounded-xl"
                  onClick={() => window.location.href = '/wallet'}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Funds
                </Button>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="light-card border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-medium text-green-800">Secure & Guaranteed</h4>
                    <p className="text-sm text-green-700">
                      All orders are processed securely with high-quality delivery guarantee.
                    </p>
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
