import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

function isValidUrl(value: string | undefined): value is string {
  if (!value) return false
  try {
    return new URL(value).protocol.startsWith('http')
  } catch {
    return false
  }
}

/** Cliente Supabase ou null quando as variaveis de ambiente nao estao configuradas. */
export const supabase: SupabaseClient | null =
  isValidUrl(url) && anonKey ? createClient(url, anonKey) : null
