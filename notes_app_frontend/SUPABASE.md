# Supabase Integration (Frontend)

This app optionally connects to Supabase using environment variables. If these are not set, the app falls back to browser localStorage for notes (suitable for local demos).

## Environment Variables

Provide these in your `.env` (see `.env.example`):

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_SITE_URL (optional; useful for future auth flows)

Restart the dev server after editing `.env`.

## Current Database State (provisioned by automation)

The following actions were executed against your Supabase project:
1) Verified there were no existing tables in the public schema.
2) Created table public.notes with columns:
   - id text primary key
   - title text
   - content text
   - created_at timestamptz default now()
   - updated_at timestamptz default now()
3) Ensured primary key constraint on id.
4) Enabled Row Level Security (RLS) and added permissive demo policies:
   - notes_read_all: SELECT using (true)
   - notes_write_all: INSERT with check (true)
   - notes_update_all: UPDATE using (true)
   - notes_delete_all: DELETE using (true)

Important: These policies are permissive and intended for local demos. For production, replace them with user-scoped policies (e.g., add a user_id column and policy using (auth.uid() = user_id)).

## Schema (reference)

```
create table if not exists public.notes (
  id text primary key,
  title text,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.notes enable row level security;

-- Demo-open policies (replace for production)
create policy "notes_read_all" on public.notes for select using (true);
create policy "notes_write_all" on public.notes for insert with check (true);
create policy "notes_update_all" on public.notes for update using (true);
create policy "notes_delete_all" on public.notes for delete using (true);
```

## Frontend Usage

- When REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY are present, CRUD operations use Supabase via @supabase/supabase-js (see src/supabaseClient.js and src/services/notesService.js).
- If env vars are absent, the app falls back to localStorage mock seamlessly.

## Setup Checklist

1) In notes_app_frontend/.env (create from .env.example), set:
   - REACT_APP_SUPABASE_URL=https://YOUR-PROJECT-ref.supabase.co
   - REACT_APP_SUPABASE_KEY=YOUR-ANON-OR-SERVICE-ROLE-KEY
   - REACT_APP_SITE_URL (optional, for future auth) e.g., http://localhost:3000/
2) In Supabase Dashboard:
   - Confirm table public.notes exists.
   - RLS is enabled and demo policies exist (or replace with stricter user-based policies).
3) Restart the dev server after changes to .env.
4) Test:
   - Create, edit, delete notes in the UI.
   - Open DevTools network tab and verify requests to /rest/v1/notes when env vars are present.

## Hardening Recommendations (Production)

- Add user_id uuid references auth.users and enforce auth.uid() = user_id in RLS.
- Use row-level timestamps with triggers for updated_at if server-authoritative timestamps are required.
- Prefer service-role key on server only; for the browser use anon key with least-privilege policies.
- Configure Auth > URL Configuration in Supabase to include your local and production URLs if you later add authentication.
