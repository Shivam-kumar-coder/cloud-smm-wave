
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
          services (
            id,
            name,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
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
      quantity: number;
      link: string;
      total_cost: number;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          user_id: user.id,
        })
        .select(`
          *,
          services (
            id,
            name,
            category
          ),
          profiles!orders_user_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .single();

      if (error) throw error;

      // Send email notification to admin
      try {
        await supabase.functions.invoke('send-order-notification', {
          body: {
            orderId: data.id,
            userName: data.profiles?.full_name || 'Unknown User',
            userEmail: data.profiles?.email || user.email || '',
            serviceName: data.services?.name || 'Unknown Service',
            quantity: data.quantity,
            totalCost: data.total_cost,
            link: data.link,
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
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });
};
