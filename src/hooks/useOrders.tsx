
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useOrders = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          services (name, category)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (orderData: {
      service_id: string;
      link: string;
      quantity: number;
      total_cost: number;
      serviceName?: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .insert({
          service_id: orderData.service_id,
          link: orderData.link,
          quantity: orderData.quantity,
          total_cost: orderData.total_cost,
          user_id: user.id,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Get user profile for name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      // Send email notification to admin
      try {
        await supabase.functions.invoke('send-order-notification', {
          body: {
            orderId: data.id,
            userName: profile?.full_name || 'Unknown User',
            userEmail: user.email || '',
            serviceName: orderData.serviceName || 'Unknown Service',
            quantity: orderData.quantity,
            totalCost: orderData.total_cost,
            link: orderData.link,
          },
        });
      } catch (emailError) {
        console.error('Failed to send order notification email:', emailError);
        // Don't fail the order creation if email fails
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', user?.id] });
    },
  });
};
