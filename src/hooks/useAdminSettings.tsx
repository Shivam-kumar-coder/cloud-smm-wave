
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminSettings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      // Use a raw query since admin_settings is not in the generated types yet
      const { data, error } = await supabase.rpc('get_admin_settings');

      if (error) {
        console.error('Error fetching admin settings:', error);
        // Return default values if RPC fails
        return {
          happy_customers: 10000,
          orders_completed: 50000,
          total_services: 500,
          success_rate: 99.9
        };
      }

      return data || {
        happy_customers: 10000,
        orders_completed: 50000,
        total_services: 500,
        success_rate: 99.9
      };
    },
    enabled: !!user,
  });
};

export const useUpdateAdminSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: {
      happy_customers: number;
      orders_completed: number;
      total_services: number;
      success_rate: number;
    }) => {
      const { data, error } = await supabase.rpc('update_admin_settings', {
        new_happy_customers: settings.happy_customers,
        new_orders_completed: settings.orders_completed,
        new_total_services: settings.total_services,
        new_success_rate: settings.success_rate
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    },
  });
};
