# Supabase Integration (Frontend)

This app optionally connects to Supabase using environment variables. If these are not set, the app falls back to browser localStorage for notes (suitable for local demos).

## Environment Variables

Provide these in your `.env` (see `.env.example`):

- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_KEY
- REACT_APP_SITE_URL (optional; useful for future auth flows)

Restart the dev server after editing `.env`.

## Schema

Create a table named `notes`:

```
create table if not exists public.notes (
  id text primary key,
  title text,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

No Row Level Security is configured here. In production, configure RLS and policies appropriately.

## Usage

When env vars are present, CRUD operations use Supabase via `@supabase/supabase-js`. Otherwise, the app uses localStorage mock and behaves identically from the UI perspective.
