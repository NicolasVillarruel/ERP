"use server"

import { supabaseAdmin } from "@/lib/supabase"

export async function createProductionRecord(table: string, payload: any) {
  const supabase = supabaseAdmin()
  const { data, error } = await supabase.from(table).insert([payload]).select()
  
  if (error) {
    console.error(`Error inserting into ${table}:`, error)
    return { error: error.message }
  }
  return { data }
}
