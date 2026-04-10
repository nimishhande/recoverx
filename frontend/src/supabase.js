import { createClient } from '@supabase/supabase-js';

// User-provided Supabase credentials (Corrected syntax)
const supabaseUrl = 'https://cixniiquleiqwyzgrazk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpeG5paXF1bGVpcXd5emdyYXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1NjMxMzcsImV4cCI6MjA5MTEzOTEzN30.X7pAUCCiHasG06Y9rKSXqjvu9ljTNOMqmc_hyp6aWnw';

// Check if credentials are valid to avoid crashing the app
const isValid = supabaseUrl && supabaseUrl.startsWith('http') && supabaseAnonKey;

if (!isValid) {
  console.warn('⚠️ Supabase credentials not found or invalid. Please check src/supabase.js');
}

export const supabase = isValid ? createClient(supabaseUrl, supabaseAnonKey) : null;
