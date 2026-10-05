import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://smartsociety-demo.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'sample-anon-key';

let supabaseClient = null;

try {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  console.log('[Supabase] Initialized client for URL:', supabaseUrl);
} catch (err) {
  console.warn('[Supabase Warning] Could not initialize client:', err.message);
}

export const supabase = supabaseClient;

export const getSupabaseStatus = () => ({
  initialized: !!supabaseClient,
  url: supabaseUrl,
  status: 'Ready for Supabase Auth & Realtime Subscriptions'
});
