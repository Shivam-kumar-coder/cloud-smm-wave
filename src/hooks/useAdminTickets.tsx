
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminTickets = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['adminTickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          *,
          profiles!support_tickets_user_id_fkey (full_name, email),
          support_replies (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin tickets:', error);
        throw error;
      }
      return data;
    },
    enabled: !!user,
  });
};

export const useCreateAdminReply = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (replyData: {
      ticket_id: string;
      message: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('support_replies')
        .insert({
          ...replyData,
          user_id: user.id,
          is_admin: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
    },
  });
};
