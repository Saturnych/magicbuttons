-- mb_fingerprints

-- Disable RLS
ALTER TABLE IF EXISTS public.mb_fingerprints disable row level security;

-- Drop table
DROP TABLE IF EXISTS public.mb_fingerprints;

-- Create table mb_counter
CREATE TABLE public.mb_fingerprints (
  id BIGSERIAL NOT NULL,
  uid uuid NOT NULL DEFAULT gen_random_uuid(),
  fingerprint TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL,
  CONSTRAINT mb_counter_pkey PRIMARY KEY (id),
  CONSTRAINT mb_counter_un_uid UNIQUE (uid)
);
CREATE INDEX mb_fingerprints_fp_idx ON public.mb_fingerprints USING pgroonga(fingerprint);

-- Enable RLS
ALTER TABLE IF EXISTS public.mb_fingerprints enable row level security;

-- Create Policies
CREATE POLICY "authenticated can insert on mb_fingerprints"
on public.mb_fingerprints for insert
to authenticated, postgres, service_role
with check ( true );

CREATE POLICY "authenticated can update on mb_fingerprints"
on public.mb_fingerprints for update
to authenticated, postgres, service_role
with check ( true );

CREATE POLICY "authenticated can select from mb_fingerprints"
on public.mb_fingerprints for select
to authenticated, postgres, service_role
using ( true );
