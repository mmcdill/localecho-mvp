import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { type SupabaseClient } from '@supabase/supabase-js'
// import type { Database } from '@/types/supabase' ❌ REMOVE THIS

export const createClient = () =>
  createBrowserSupabaseClient<any>() as SupabaseClient
