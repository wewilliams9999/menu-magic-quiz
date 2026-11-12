CREATE TABLE public.shortlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  search_query text,
  restaurants text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.shortlist_signups TO anon, authenticated;
GRANT ALL ON public.shortlist_signups TO service_role;
ALTER TABLE public.shortlist_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a valid shortlist signup" ON public.shortlist_signups
FOR INSERT TO anon, authenticated
WITH CHECK (
  length(email) <= 254
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND (search_query IS NULL OR length(search_query) <= 500)
  AND coalesce(array_length(restaurants, 1), 0) <= 10
);