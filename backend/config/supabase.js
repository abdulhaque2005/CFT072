import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

let supabase = null;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️  Supabase credentials not configured. Using in-memory DB.');
    return null;
  }
  if (!supabase) {
    import('@supabase/supabase-js').then(({ createClient }) => {
      supabase = createClient(supabaseUrl, supabaseKey);
    });
  }
  return supabase;
}

export default { getSupabaseClient };
