import { createClient } from '@supabase/supabase-js'
import { Database } from '@/app/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const db = createClient<Database>(supabaseUrl, supabaseKey) 