import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// Anon key is used for both server-side (API routes, server actions) and client-side queries
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Used for users, blogs, leads, bids
export const supabaseMain = createClient(supabaseUrl, supabaseAnonKey)

// Used for discussions & channels (same database, same key)
export const supabaseDiscussion = createClient(supabaseUrl, supabaseAnonKey)
