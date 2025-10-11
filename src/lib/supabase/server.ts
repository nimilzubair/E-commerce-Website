// src/lib/supabase/server.ts
import { createClient } from '@supabase/supabase-js'

// Use environment variables from .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a Supabase client for server-side usage (admin access)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey)
