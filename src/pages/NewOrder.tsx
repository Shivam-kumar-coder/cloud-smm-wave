
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, DollarSign, Clock, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';

const NewOrder = () => {
  const [category, setCategory] = useState('');
  const [service, setService] = useState('');
  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const categories = [
    'Instagram',
    'YouTube',
    'TikTok',
    'Facebook',
    'Twitter',
    'LinkedIn'
  ];

  const services = {
    Instagram: [
      { id: 'ig_followers', name: 'Instagram Followers', price: 0.015, min: 100, max: 10000, time: '0-6 hours' },
      { id: 'ig_likes', name: 'Instagram Likes', price: 0.008, min: 100, max: 5000, time: '0-1 hour' },
      { id: 'ig_comments', name: 'Instagram Comments', price: 0.05, min: 10, max: 1000, time: '0-12 hours' },
      { id: 'ig_views', name: 'Instagram Views', price: 0.002, min: 1000, max: 100000, time: '0-6 hours' }
    ],
    YouTube: [
      { id: 'yt_subscribers', name: 'YouTube Subscribers', price: 0.025, min: 100, max: 5000, time: '0-24 hours' },
      { id: 'yt_views', name: 'YouTube Views', price: 0.003, min: 1000, max: 50000, time: '0-12 hours' },
      { id: 'yt_likes', name: 'YouTube Likes', price: 0.01, min: 100, max: 2000, time: '0-6 hours' },
      { id: 'yt_comments', name: 'YouTube Comments', price: 0.08, min: 10, max: 500, time: '0-24 hours' }
    ],
    TikTok: [
      { id: 'tt_followers', name: 'TikTok Followers', price: 0.02, min: 100, max: 10000, time: '0-12 hours' },
      { id: 'tt_likes', name: 'TikTok Likes', price: 0.006, min: 100, max: 10000, time: '0-6 hours' },
      { id: 'tt_views', name: 'TikTok Views', price: 0.001, min: 1000, max: 100000, time: '0-6 hours' },
      { id: 'tt_shares', name: 'TikTok Shares', price: 0.012, min: 50, max: 2000, time: '0-12 hours' }
    ],
    Facebook: [
      { id: 'fb_likes', name: 'Facebook Page Likes', price: 0.018, min: 100, max: 5000, time: '0-24 hours' },
      { id: 'fb_post_likes', name: 'Facebook Post Likes', price: 0.01, min: 100, max: 3000, time: '0-6 hours' },
      { id: 'fb_comments', name: 'Facebook Comments', price: 0.06, min: 10, max: 500, time: '0-24 hours' },
      { id: 'fb_shares', name: 'Facebook Shares', price: 0.015, min: 50, max: 1000, time: '0-12 hours' }
    ],
    Twitter: [
      { id: 'tw_followers', name: 'Twitter Followers', price: 0.022, min: 100, max: 5000, time: '0-24 hours' },
      { id: 'tw_likes', name: 'Twitter Likes', price: 0.009, min: 100, max: 3000, time: '0-6 hours' },
      { id: 'tw_retweets', name: 'Twitter Retweets', price: 0.015, min: 50, max: 1000, time: '0-12 hours' },
      { id: 'tw_comments', name: 'Twitter Comments', price: 0.07, min: 10, max: 300, time: '0-24 hours' }
    ],
    LinkedIn: [
      { id: 'li_followers', name: 'LinkedIn Followers', price: 0.035, min: 100, max: 2000, time: '0-48 hours' },
      { id: 'li_likes', name: 'LinkedIn Post Likes', price: 0.02, min: 50, max: 1000, time: '0-12 hours' },
      { id: 'li_comments', name: 'LinkedIn Comments', price: 0.12, min: 10, max: 200, time: '0-48 hours' },
      { id: 'li_shares', name: 'LinkedIn Shares', price: 0.025, min: 25, max: 500, time: '0-24 hours' }
    ]
  };

  const selectedService = services[category as keyof typeof services]?.find(s => s.id === service);
  const totalPrice = selectedService && quantity ? (selectedService.price * parseInt(quantity)).toFixed(2) : '0.00';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate order placement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Order Placed Successfully!',
        description: `Your order for ${selectedService?.name} has been placed and will be processed shortly.`,
      });
      
      // Reset form
      setCategory('');
      setService('');
      setLink('');
      setQuantity('');
    } catch (error) {
      toast({
        title: 'Order Failed',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Place New Order</h1>
          <p className="text-muted-foreground">
            Choose from our wide range of social media marketing services to boost your online presence.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Order Details</CardTitle>
                <CardDescription>Fill in the details below to place your order</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services[category as keyof typeof services]?.map((serv) => (
                            <SelectItem key={serv.id} value={serv.id}>
                              {serv.name} - ${serv.price}/unit
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
                    />
                  </div>

                  {selectedService && (
                    <div className="space-y-2">
                      <Label htmlFor="quantity">
                        Quantity (Min: {selectedService.min}, Max: {selectedService.max})
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min={selectedService.min}
                        max={selectedService.max}
                        placeholder={`Enter quantity (${selectedService.min}-${selectedService.max})`}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full gradient-primary hover:scale-105 transition-transform duration-200"
                    disabled={!selectedService || !link || !quantity || isLoading}
                  >
                    {isLoading ? (
                      'Placing Order...'
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Place Order - ${totalPrice}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedService ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price per unit:</span>
                      <span className="font-medium">${selectedService.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{quantity || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Delivery time:</span>
                      <span className="font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedService.time}
                      </span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary">${totalPrice}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Select a service to see the summary
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Why Choose Us?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">High Quality</p>
                    <p className="text-sm text-muted-foreground">Real, active users with high retention rates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">Fast Delivery</p>
                    <p className="text-sm text-muted-foreground">Most orders start within minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">24/7 Support</p>
                    <p className="text-sm text-muted-foreground">Always here to help you succeed</p>
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
