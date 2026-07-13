import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ljlbtrmbvqfqgosqbnks.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbGJ0cm1idnFmcWdvc3FibmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDUwNjcsImV4cCI6MjA5OTEyMTA2N30.YpPDIN3funjbESU8erxmYRPmJzgWAB3KI-5HQgKSxg8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
