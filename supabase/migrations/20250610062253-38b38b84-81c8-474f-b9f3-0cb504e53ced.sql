
-- Fix foreign key relationships and ensure proper table structure

-- Add foreign key constraints to orders table
ALTER TABLE public.orders 
ADD CONSTRAINT fk_orders_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.orders 
ADD CONSTRAINT fk_orders_service_id 
FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;

-- Add foreign key constraints to support_tickets table
ALTER TABLE public.support_tickets 
ADD CONSTRAINT fk_support_tickets_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraints to support_replies table
ALTER TABLE public.support_replies 
ADD CONSTRAINT fk_support_replies_ticket_id 
FOREIGN KEY (ticket_id) REFERENCES public.support_tickets(id) ON DELETE CASCADE;

ALTER TABLE public.support_replies 
ADD CONSTRAINT fk_support_replies_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint to transactions table
ALTER TABLE public.transactions 
ADD CONSTRAINT fk_transactions_user_id 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_service_id ON public.orders(service_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON public.support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_replies_ticket_id ON public.support_replies(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_replies_user_id ON public.support_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
