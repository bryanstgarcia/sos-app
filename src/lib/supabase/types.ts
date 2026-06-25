// Regenerar con: npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
// O desde: Supabase Dashboard → Project Settings → API → TypeScript types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
