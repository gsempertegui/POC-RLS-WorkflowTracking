// @utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase'; // Importa tu tipo de base de datos

/**
 * Crea y devuelve una instancia de Supabase Client para el lado del cliente (navegador).
 * Este cliente se utiliza en componentes de React marcados con 'use client'.
 *
 * @returns Una instancia de SupabaseClient configurada para el entorno de cliente de Next.js.
 */
export function createClient() {
  return createBrowserClient<Database>( // Tipado fuerte de tu base de datos
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}