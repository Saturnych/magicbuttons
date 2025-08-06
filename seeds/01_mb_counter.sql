-- mb_counter

-- Disable RLS
ALTER TABLE IF EXISTS public.mb_counter disable row level security;

-- Drop table
DROP TABLE IF EXISTS public.mb_counter;

-- Create table mb_counter
CREATE TABLE public.mb_counter (
  id BIGSERIAL NOT NULL,
  uid uuid NOT NULL DEFAULT gen_random_uuid(),
  fingerprint TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL,
  CONSTRAINT mb_counter_pkey PRIMARY KEY (id),
  CONSTRAINT mb_counter_un_uid UNIQUE (uid),
  CONSTRAINT mb_counter_un_fingerprint UNIQUE (fingerprint)
);

-- Enable RLS
ALTER TABLE IF EXISTS public.mb_counter enable row level security;

-- Create Policies
CREATE POLICY "authenticated can insert to tg_bot_sessions"
on public.mb_counter for insert
to authenticated, postgres, service_role
with check ( true );

CREATE POLICY "authenticated can update to tg_bot_sessions"
on public.mb_counter for update
to authenticated, postgres, service_role
with check ( true );

CREATE POLICY "authenticated can select from tg_bot_sessions"
on public.mb_counter for select
to authenticated, postgres, service_role
using ( true );
