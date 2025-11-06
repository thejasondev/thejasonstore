import { z } from 'zod'

/**
 * Esquema de validación para variables de entorno
 * Asegura que todas las variables necesarias estén presentes y sean válidas
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('URL de Supabase inválida'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Anon key de Supabase requerida'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Service role key requerida').optional(),
  NEXT_PUBLIC_WHATSAPP_PHONE: z.string().regex(/^\d+$/, 'Número de WhatsApp debe contener solo dígitos'),
  NEXT_PUBLIC_SITE_URL: z.string().url('URL del sitio inválida'),
})

/**
 * Variables de entorno validadas
 * Lanzará un error en build si alguna variable falta o es inválida
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NEXT_PUBLIC_WHATSAPP_PHONE: process.env.NEXT_PUBLIC_WHATSAPP_PHONE,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
})
