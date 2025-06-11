
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useSupportTickets = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['supportTickets', user?.id],
    queryFn: async () => {
      if (!user) return [];

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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get profiles for replies
      const replyUserIds = data.flatMap(ticket => 
        ticket.support_replies?.map(reply => reply.user_id) || []
      );
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', replyUserIds);

      // Combine with profiles
      const ticketsWithProfiles = data.map(ticket => ({
        ...ticket,
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

export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (ticketData: {
      subject: string;
      message: string;
      priority: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          ...ticketData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supportTickets', user?.id] });
    },
  });
};

export const useCreateSupportReply = () => {
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
          is_admin: false,
        })
        .select()
        .single();

      if (replyError) throw replyError;
      return reply;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supportTickets', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
    },
  });
};
