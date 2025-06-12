
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAdminServices, useCreateService, useUpdateService, useDeleteService } from '@/hooks/useServices';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminServicesManager = () => {
  const { data: services = [] } = useAdminServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price_per_1000: '',
    min_quantity: '',
    max_quantity: '',
    is_active: true
  });

  const categories = [
    'Instagram', 'Facebook', 'Twitter', 'TikTok', 'YouTube', 
    'Telegram', 'LinkedIn', 'Spotify', 'Other'
  ];

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
    setIsCreating(false);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const serviceData = {
        name: formData.name,
        category: formData.category,
        description: formData.description || undefined,
        price_per_1000: parseFloat(formData.price_per_1000),
        min_quantity: formData.min_quantity ? parseInt(formData.min_quantity) : undefined,
        max_quantity: formData.max_quantity ? parseInt(formData.max_quantity) : undefined,
        is_active: formData.is_active
      };

      if (editingService) {
        await updateService.mutateAsync({ 
          serviceId: editingService, 
          updates: serviceData 
        });
        toast({
          title: 'Service Updated',
          description: 'Service has been updated successfully.',
        });
      } else {
        await createService.mutateAsync(serviceData);
        toast({
          title: 'Service Created',
          description: 'New service has been created successfully.',
        });
      }
      
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Operation Failed',
        description: error.message || 'Failed to save service.',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (service: any) => {
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description || '',
      price_per_1000: service.price_per_1000.toString(),
      min_quantity: service.min_quantity?.toString() || '',
      max_quantity: service.max_quantity?.toString() || '',
      is_active: service.is_active
    });
    setEditingService(service.id);
    setIsCreating(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService.mutateAsync(serviceId);
        toast({
          title: 'Service Deleted',
          description: 'Service has been deleted successfully.',
        });
      } catch (error: any) {
        toast({
          title: 'Delete Failed',
          description: error.message || 'Failed to delete service.',
          variant: 'destructive',
        });
      }
    }
  };

  // Group services by category
  const servicesByCategory = services.reduce((acc: any, service: any) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <Card className="glass-card border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Services Management</CardTitle>
              <CardDescription>
                Manage social media services and pricing
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsCreating(true)}
              className="gradient-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
        </CardHeader>
        
        {isCreating && (
          <CardContent className="border-t">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Instagram Followers"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price per 1000</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price_per_1000}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_per_1000: e.target.value }))}
                    placeholder="5.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="min_quantity">Min Quantity</Label>
                  <Input
                    id="min_quantity"
                    type="number"
                    value={formData.min_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, min_quantity: e.target.value }))}
                    placeholder="100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max_quantity">Max Quantity</Label>
                  <Input
                    id="max_quantity"
                    type="number"
                    value={formData.max_quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_quantity: e.target.value }))}
                    placeholder="10000"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                    />
                    <Label htmlFor="is_active">Active Service</Label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Service description..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={createService.isPending || updateService.isPending}>
                  {editingService ? 'Update Service' : 'Create Service'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Services List by Category */}
      {Object.entries(servicesByCategory).map(([category, categoryServices]: [string, any]) => (
        <Card key={category} className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-lg">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryServices.map((service: any) => (
                <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{service.name}</h4>
                      <Badge variant={service.is_active ? 'default' : 'secondary'}>
                        {service.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <div className="text-sm text-muted-foreground mt-1">
                      Price: ${service.price_per_1000}/1k | Min: {service.min_quantity} | Max: {service.max_quantity}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {services.length === 0 && (
        <Card className="glass-card border-0">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No services found. Create your first service to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminServicesManager;
