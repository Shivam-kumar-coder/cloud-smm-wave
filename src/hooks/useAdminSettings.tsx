
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminSettings = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching admin settings:', error);
        // Return default values if query fails
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
      const { data, error } = await supabase
        .from('admin_settings')
        .update({
          happy_customers: settings.happy_customers,
          orders_completed: settings.orders_completed,
          total_services: settings.total_services,
          success_rate: settings.success_rate,
          updated_at: new Date().toISOString()
        })
        .eq('id', (await supabase.from('admin_settings').select('id').single()).data?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
    },
  });
};
