
-- Create a dedicated schema for extensions
CREATE SCHEMA IF NOT EXISTS extensions;

-- Drop the extension from public schema and recreate it in extensions schema
DROP EXTENSION IF EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Update the cron job to use the extension from the new schema
SELECT cron.unschedule('keep-supabase-alive');

SELECT cron.schedule(
  'keep-supabase-alive',
  '0 9 */6 * *', -- Every 6 days at 9:00 AM UTC
  $$
  SELECT
    extensions.http_post(
      url := 'https://vgbpfraisdnzilymqbky.supabase.co/functions/v1/keep-alive',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnYnBmcmFpc2RuemlseW1xYmt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MDg1OTIsImV4cCI6MjA2MTM4NDU5Mn0.a-jJE6q7yrc4r9GtX6IKr2cNp2IC8EcOG1D2NrB8YGY"}'::jsonb,
      body := '{"automated": true}'::jsonb
    ) as request_id;
  $$
);
