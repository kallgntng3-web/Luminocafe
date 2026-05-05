import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dptbshjbdczegibzsroy.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwdGJzaGpiZGN6ZWdpYnpzcm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MTY4MzgsImV4cCI6MjA5MzA5MjgzOH0.36cVq6x2Rvcna6G2zrdBq9LMEzzM1L3rsU2rowAlGYo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
