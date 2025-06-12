
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAdminSettings, useUpdateAdminSettings } from '@/hooks/useAdminSettings';
import { Users, CheckCircle, Briefcase, TrendingUp } from 'lucide-react';

const AdminStatsManager = () => {
  const { data: settings } = useAdminSettings();
  const updateSettings = useUpdateAdminSettings();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    happy_customers: 10000,
    orders_completed: 50000,
    total_services: 500,
    success_rate: 99.9
  });

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        happy_customers: settings.happy_customers || 10000,
        orders_completed: settings.orders_completed || 50000,
        total_services: settings.total_services || 500,
        success_rate: settings.success_rate || 99.9
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateSettings.mutateAsync(formData);
      toast({
        title: 'Settings Updated',
        description: 'Frontend statistics have been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update settings.',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const statsConfig = [
    {
      field: 'happy_customers',
      label: 'Happy Customers',
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-500'
    },
    {
      field: 'orders_completed',
      label: 'Orders Completed',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-500'
    },
    {
      field: 'total_services',
      label: 'Total Services',
      icon: <Briefcase className="w-5 h-5" />,
      color: 'text-purple-500'
    },
    {
      field: 'success_rate',
      label: 'Success Rate (%)',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-orange-500'
    }
  ];

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <CardTitle>Frontend Statistics Manager</CardTitle>
        <CardDescription>
          Control the statistics displayed on the homepage
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {statsConfig.map((stat) => (
              <div key={stat.field} className="space-y-2">
                <Label htmlFor={stat.field} className="flex items-center gap-2">
                  <span className={stat.color}>{stat.icon}</span>
                  {stat.label}
                </Label>
                <Input
                  id={stat.field}
                  type="number"
                  step={stat.field === 'success_rate' ? '0.1' : '1'}
                  value={formData[stat.field as keyof typeof formData]}
                  onChange={(e) => handleInputChange(stat.field, e.target.value)}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          
          <Button
            type="submit"
            className="w-full gradient-primary"
            disabled={updateSettings.isPending}
          >
            {updateSettings.isPending ? 'Updating...' : 'Update Statistics'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminStatsManager;
