
-- Create admin_settings table for managing frontend statistics
CREATE TABLE public.admin_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  happy_customers integer NOT NULL DEFAULT 10000,
  orders_completed integer NOT NULL DEFAULT 50000,
  total_services integer NOT NULL DEFAULT 500,
  success_rate numeric NOT NULL DEFAULT 99.9,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default values
INSERT INTO public.admin_settings (happy_customers, orders_completed, total_services, success_rate)
VALUES (10000, 50000, 500, 99.9);

-- Add some sample services for different platforms
INSERT INTO public.services (name, category, description, price_per_1000, min_quantity, max_quantity, is_active) VALUES
('Instagram Followers', 'Instagram', 'High quality Instagram followers with profile pictures', 5.00, 100, 10000, true),
('Instagram Likes', 'Instagram', 'Real Instagram likes from active users', 2.50, 50, 5000, true),
('Instagram Comments', 'Instagram', 'Custom Instagram comments from real users', 8.00, 10, 1000, true),
('Instagram Views', 'Instagram', 'Instagram video/reel views from real users', 1.50, 100, 50000, true),

('Facebook Page Likes', 'Facebook', 'Facebook page likes from real profiles', 4.00, 100, 5000, true),
('Facebook Post Likes', 'Facebook', 'Facebook post likes from active users', 3.00, 50, 2000, true),
('Facebook Comments', 'Facebook', 'Custom Facebook comments from real users', 10.00, 5, 500, true),
('Facebook Shares', 'Facebook', 'Facebook post shares from real users', 15.00, 10, 1000, true),

('Twitter Followers', 'Twitter', 'High quality Twitter followers', 6.00, 100, 10000, true),
('Twitter Likes', 'Twitter', 'Twitter likes from active users', 2.00, 50, 5000, true),
('Twitter Retweets', 'Twitter', 'Twitter retweets from real users', 5.00, 25, 2000, true),
('Twitter Comments', 'Twitter', 'Custom Twitter replies from real users', 8.00, 10, 1000, true),

('TikTok Followers', 'TikTok', 'TikTok followers from real accounts', 7.00, 100, 10000, true),
('TikTok Likes', 'TikTok', 'TikTok video likes from active users', 1.80, 100, 10000, true),
('TikTok Views', 'TikTok', 'TikTok video views from real users', 0.80, 1000, 100000, true),
('TikTok Shares', 'TikTok', 'TikTok video shares from real users', 12.00, 50, 5000, true),

('YouTube Subscribers', 'YouTube', 'High quality YouTube subscribers', 8.00, 50, 5000, true),
('YouTube Views', 'YouTube', 'YouTube video views from real users', 1.20, 1000, 100000, true),
('YouTube Likes', 'YouTube', 'YouTube video likes from active users', 3.50, 50, 5000, true),
('YouTube Comments', 'YouTube', 'Custom YouTube comments from real users', 15.00, 5, 500, true),

('Telegram Members', 'Telegram', 'Telegram channel/group members', 4.50, 100, 10000, true),
('Telegram Views', 'Telegram', 'Telegram post views from real users', 0.50, 1000, 50000, true),

('LinkedIn Followers', 'LinkedIn', 'LinkedIn profile followers', 12.00, 50, 2000, true),
('LinkedIn Likes', 'LinkedIn', 'LinkedIn post likes from professionals', 6.00, 25, 1000, true),

('Spotify Plays', 'Spotify', 'Spotify track plays from real users', 2.00, 1000, 100000, true),
('Spotify Followers', 'Spotify', 'Spotify artist/playlist followers', 8.00, 100, 5000, true);
