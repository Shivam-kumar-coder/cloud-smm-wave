
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
            user_id,
            profiles!support_replies_user_id_fkey (
              id,
              full_name,
              email
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
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

      // Get user profile for name
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      // Send email notification to admin
      try {
        await supabase.functions.invoke('send-ticket-notification', {
          body: {
            ticketId: data.id,
            userEmail: user.email || '',
            userName: profile?.full_name || 'Unknown User',
            subject: ticketData.subject,
            message: ticketData.message,
            priority: ticketData.priority,
          },
        });
      } catch (emailError) {
        console.error('Failed to send ticket notification email:', emailError);
        // Don't fail the ticket creation if email fails
      }

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

      // Insert the reply
      const { data: reply, error: replyError } = await supabase
        .from('support_replies')
        .insert({
          ...replyData,
          user_id: user.id,
          is_admin: false,
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
      } else if (ticket) {
        // Get user profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        // Send email notification to admin
        try {
          await supabase.functions.invoke('send-reply-notification', {
            body: {
              ticketId: ticket.id,
              userEmail: userProfile?.email || user.email || '',
              userName: userProfile?.full_name || 'User',
              subject: ticket.subject,
              replyMessage: replyData.message,
              isFromAdmin: false,
            },
          });
        } catch (emailError) {
          console.error('Failed to send reply notification email:', emailError);
        }
      }

      return reply;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supportTickets', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
    },
  });
};
