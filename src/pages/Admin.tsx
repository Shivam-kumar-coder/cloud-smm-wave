
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, Plus, Edit, Trash2, Shield, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import { useServices } from '@/hooks/useServices';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUserRole } from '@/hooks/useUserRole';

const Admin = () => {
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price_per_1000: '',
    min_quantity: '',
    max_quantity: '',
    is_active: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { data: services = [] } = useServices();
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const queryClient = useQueryClient();

  const categories = ['Instagram', 'YouTube', 'TikTok', 'Facebook', 'Twitter', 'Telegram', 'LinkedIn'];

  // Check if user is admin
  if (roleLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (userRole !== 'admin') {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="text-center max-w-md">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-4">
              You don't have permission to access the admin panel. This area is restricted to administrators only.
            </p>
            <Button onClick={() => window.history.back()} className="gradient-primary">
              Go Back
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      price_per_1000: '',
      min_quantity: '',
      max_quantity: '',
      is_active: true
    });
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const serviceData = {
        ...formData,
        price_per_1000: parseFloat(formData.price_per_1000),
        min_quantity: parseInt(formData.min_quantity) || 100,
        max_quantity: parseInt(formData.max_quantity) || 100000,
      };

      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        
        if (error) throw error;
        
        toast({
          title: 'Service Updated',
          description: 'Service has been updated successfully.',
        });
      } else {
        const { error } = await supabase
          .from('services')
          .insert(serviceData);
        
        if (error) throw error;
        
        toast({
          title: 'Service Added',
          description: 'New service has been added successfully.',
        });
      }

      queryClient.invalidateQueries({ queryKey: ['services'] });
      resetForm();
      setIsAddServiceOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save service.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (service: any) => {
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description || '',
      price_per_1000: service.price_per_1000.toString(),
      min_quantity: service.min_quantity.toString(),
      max_quantity: service.max_quantity.toString(),
      is_active: service.is_active
    });
    setEditingService(service);
    setIsAddServiceOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);
      
      if (error) throw error;
      
      toast({
        title: 'Service Deleted',
        description: 'Service has been deleted successfully.',
      });
      
      queryClient.invalidateQueries({ queryKey: ['services'] });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete service.',
        variant: 'destructive',
      });
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ is_active: !currentStatus })
        .eq('id', serviceId);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['services'] });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update service status.',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Settings className="w-8 h-8 text-blue-600" />
              Admin Panel
            </h1>
            <p className="text-gray-600">
              Manage services, pricing, and system settings.
            </p>
          </div>
          <Dialog open={isAddServiceOpen} onOpenChange={(open) => {
            setIsAddServiceOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gradient-primary rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                <DialogDescription>
                  {editingService ? 'Update service details and pricing.' : 'Create a new SMM service with pricing details.'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Instagram Followers"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Service description..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per 1000 (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price_per_1000}
                      onChange={(e) => setFormData({...formData, price_per_1000: e.target.value})}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="active">Active</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                      />
                      <Label htmlFor="active">{formData.is_active ? 'Active' : 'Inactive'}</Label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min">Min Quantity</Label>
                    <Input
                      id="min"
                      type="number"
                      placeholder="100"
                      value={formData.min_quantity}
                      onChange={(e) => setFormData({...formData, min_quantity: e.target.value})}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max">Max Quantity</Label>
                    <Input
                      id="max"
                      type="number"
                      placeholder="100000"
                      value={formData.max_quantity}
                      onChange={(e) => setFormData({...formData, max_quantity: e.target.value})}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full gradient-primary rounded-xl" disabled={isLoading}>
                  {isLoading ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Admin Access Notice */}
        <Card className="light-card border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span className="text-blue-800 font-medium">Admin Access Granted</span>
            </div>
          </CardContent>
        </Card>

        {/* Services Management */}
        <Card className="light-card">
          <CardHeader>
            <CardTitle className="text-gray-900">Services Management</CardTitle>
            <CardDescription>Manage your SMM services and pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{service.name}</h3>
                      <Badge variant={service.is_active ? "default" : "secondary"} className="rounded-full">
                        {service.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="rounded-full">{service.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{service.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>₹{service.price_per_1000}/1k</span>
                      <span>Min: {service.min_quantity}</span>
                      <span>Max: {service.max_quantity}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={service.is_active}
                      onCheckedChange={() => toggleServiceStatus(service.id, service.is_active)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(service)}
                      className="rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      className="rounded-lg hover:bg-red-50 hover:border-red-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
              {services.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No services found</p>
                  <p className="text-sm">Add your first service to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
