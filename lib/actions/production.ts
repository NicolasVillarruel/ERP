"use server"

import { supabaseAdmin } from "@/lib/supabase"

export async function createProductionRecord(table: string, payload: any) {
  const supabase = supabaseAdmin()
  const { data, error } = await (supabase as any).from(table).insert([payload]).select()
  
  if (error) {
    console.error(`Error inserting into ${table}:`, error)
    return { error: error.message }
  }
  return { data }
}

export async function getProducts() {
  const supabase = supabaseAdmin()
  const { data, error } = await (supabase as any)
    .from('products')
    .select('id, name')
    .order('name')
  
  if (error) {
    console.error('Error fetching products:', error)
    return { error: error.message, data: null }
  }
  return { data, error: null }
}
