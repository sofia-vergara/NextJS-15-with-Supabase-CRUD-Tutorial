import { createClient } from '@supabase/supabase-js';

// These public environment variables connect the browser app to your Supabase project.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Reuse one client for database requests throughout the app.
export const supabase = createClient(supabaseUrl, supabaseKey);