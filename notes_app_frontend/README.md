# Notes App Frontend (React) — Ocean Professional

A modern, minimalist notes application UI with blue and amber accents. Optional Supabase integration for persistence; falls back to localStorage when not configured.

## Features

- Ocean Professional theme (blue & amber accents, subtle gradients)
- Create, edit, delete personal notes
- Grid/List toggle, search
- Floating action button, modal editor
- Optional Supabase backend; otherwise localStorage mock

## Quick Start

1. Install dependencies
   - npm install
2. Run the app
   - npm start
3. Optional: configure Supabase
   - Copy `.env.example` to `.env`
   - Fill `REACT_APP_SUPABASE_URL` and `REACT_APP_SUPABASE_KEY`
   - Restart dev server

## Scripts

- npm start — start dev server
- npm test — run tests
- npm run build — build production bundle

## Supabase

See SUPABASE.md for details and schema.

## Style

All custom styles are in `src/App.css`. Components use light, rounded surfaces with subtle shadows and transitions to match the Ocean Professional aesthetic.
