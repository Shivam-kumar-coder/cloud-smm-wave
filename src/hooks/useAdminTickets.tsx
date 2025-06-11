
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
          support_replies (
            id,
            message,
            is_admin,
            created_at,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin tickets:', error);
        throw error;
      }

      // Get user profiles separately
      const userIds = [...new Set(data.map(ticket => ticket.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      // Combine tickets with profiles
      const ticketsWithProfiles = data.map(ticket => ({
        ...ticket,
        profile: profiles?.find(profile => profile.id === ticket.user_id) || null,
        support_replies: ticket.support_replies?.map(reply => ({
          ...reply,
          profile: profiles?.find(profile => profile.id === reply.user_id) || null
        })) || []
      }));

      return ticketsWithProfiles;
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

      const { data: reply, error: replyError } = await supabase
        .from('support_replies')
        .insert({
          ...replyData,
          user_id: user.id,
          is_admin: true,
        })
        .select()
        .single();

      if (replyError) throw replyError;
      return reply;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
      queryClient.invalidateQueries({ queryKey: ['supportTickets'] });
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: string }) => {
      const { data, error } = await supabase
        .from('support_tickets')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', ticketId)
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
