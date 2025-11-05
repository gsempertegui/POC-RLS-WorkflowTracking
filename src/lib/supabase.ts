import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase env vars')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos de datos
export interface xxxxx {
  id: string
  name: string
}

// Obtener todos los productos
export async function getCandles(): Promise<Candle[]> {
  const { data, error } = await supabase
    .from('candles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching the whole candles: ', error)
    throw error
  }
  return data || []
}

