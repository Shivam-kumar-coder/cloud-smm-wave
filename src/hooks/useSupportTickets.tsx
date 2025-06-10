
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
          support_replies (*)
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

      const { data, error } = await supabase
        .from('support_replies')
        .insert({
          ...replyData,
          user_id: user.id,
          is_admin: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supportTickets', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['adminTickets'] });
    },
  });
};
