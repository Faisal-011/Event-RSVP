-- Create the rsvps table
CREATE TABLE IF NOT EXISTS public.rsvps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    special_requests text,
    CONSTRAINT rsvps_pkey PRIMARY KEY (id),
    CONSTRAINT rsvps_email_key UNIQUE (email)
);

-- Enable Row Level Security
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
-- Allows anyone to view any RSVP. This is needed for the "Find My RSVP" feature.
DROP POLICY IF EXISTS "Public read access" ON public.rsvps;
CREATE POLICY "Public read access" ON public.rsvps
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Policy: Allow public insert access
-- Allows anyone to create a new RSVP.
DROP POLICY IF EXISTS "Public insert access" ON public.rsvps;
CREATE POLICY "Public insert access" ON public.rsvps
AS PERMISSIVE FOR INSERT
TO public
WITH CHECK (true);
