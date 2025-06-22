
-- Enable the pg_cron extension for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable the pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the keep-alive function to run every 6 days at 9:00 AM UTC
-- This will make an HTTP request to your edge function
SELECT cron.schedule(
  'keep-supabase-alive',
  '0 9 */6 * *', -- Every 6 days at 9:00 AM UTC
  $$
  SELECT
    net.http_post(
      url := 'https://vgbpfraisdnzilymqbky.supabase.co/functions/v1/keep-alive',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYnBmcmFpc2RuemlseW1xYmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDg1OTIsImV4cCI6MjA2MTM4NDU5Mn0.a-jJE6q7yrc4r9GtX6IKr2cNp2IC8EcOG1D2NrB8YGY"}'::jsonb,
      body := '{"automated": true}'::jsonb
    ) as request_id;
  $$
);
