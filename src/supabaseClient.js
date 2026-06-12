import { createClient } from '@supabase/supabase-js';

// These come from your .env file (and from Vercel's environment variables in production).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Base URL for calling Edge Functions (e.g. the manual override).
export const functionsUrl = `${supabaseUrl}/functions/v1`;
export const anonKey = supabaseKey;

