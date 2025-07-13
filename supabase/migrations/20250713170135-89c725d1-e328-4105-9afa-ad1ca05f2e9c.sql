-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a table to store scraped menu data
CREATE TABLE IF NOT EXISTS public.scraped_menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  screenshot TEXT NOT NULL,
  title TEXT NOT NULL,
  scraped_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (but make it publicly readable since this is display data)
ALTER TABLE public.scraped_menus ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the menu data
CREATE POLICY "Anyone can view scraped menus" 
ON public.scraped_menus 
FOR SELECT 
USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_scraped_menus_scraped_at ON public.scraped_menus(scraped_at DESC);

-- Schedule daily menu scraping at 6 AM UTC
SELECT cron.schedule(
  'daily-menu-scrape',
  '0 6 * * *', -- 6 AM UTC daily
  $$
  SELECT
    net.http_post(
        url:='https://vgbpfraisdnzilymqbky.supabase.co/functions/v1/scrape-menus',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYnBmcmFpc2RuemlseW1xYmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDg1OTIsImV4cCI6MjA2MTM4NDU5Mn0.a-jJE6q7yrc4r9GtX6IKr2cNp2IC8EcOG1D2NrB8YGY"}'::jsonb,
        body:='{"restaurantUrls": ["https://hattieb.com", "https://princeshotchicken.com", "https://thegulchnashville.com", "https://www.lovelesscafe.com"], "storeInDb": true}'::jsonb
    ) as request_id;
  $$
);