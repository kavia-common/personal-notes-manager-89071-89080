/**
 * Supabase client initialization. If environment variables are not present,
 * the app will fall back to localStorage-based mock storage in services/notesService.js.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_KEY;

let supabase = null;
if (url && key) {
  supabase = createClient(url, key, {
    auth: {
      persistSession: true
    }
  });
}

export default supabase;
