
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
          profiles!support_tickets_user_id_fkey (
            id,
            full_name,
            email
          ),
          support_replies (
            id,
            message,
            is_admin,
            created_at,
            user_id,
            profiles!support_replies_user_id_fkey (
              id,
              full_name,
              email
            )
          )
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

      // Insert the reply
      const { data: reply, error: replyError } = await supabase
        .from('support_replies')
        .insert({
          ...replyData,
          user_id: user.id,
          is_admin: true,
        })
        .select(`
          *,
          profiles!support_replies_user_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .single();

      if (replyError) throw replyError;

      // Get ticket details for email notification
      const { data: ticket, error: ticketError } = await supabase
        .from('support_tickets')
        .select(`
          *,
          profiles!support_tickets_user_id_fkey (
            id,
            full_name,
            email
          )
        `)
        .eq('id', replyData.ticket_id)
        .single();

      if (ticketError) {
        console.error('Error fetching ticket for email:', ticketError);
      } else if (ticket && ticket.profiles) {
        // Send email notification to user
        try {
          await supabase.functions.invoke('send-reply-notification', {
            body: {
              ticketId: ticket.id,
              userEmail: ticket.profiles.email || '',
              userName: ticket.profiles.full_name || 'User',
              subject: ticket.subject,
              replyMessage: replyData.message,
              isFromAdmin: true,
            },
          });
        } catch (emailError) {
          console.error('Failed to send reply notification email:', emailError);
        }
      }

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
