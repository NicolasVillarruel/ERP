import { supabase } from "@/lib/supabase"

/**
 * Gets the first organization ID, creating a default one if none exists.
 * This prevents the "must create organization first" error for new setups.
 */
export async function getOrCreateOrganizationId(): Promise<string | null> {
  // Try to fetch existing org
  const { data: orgs } = await (supabase as any)
    .from('organizations')
    .select('id')
    .limit(1)

  if (orgs && orgs.length > 0) {
    return orgs[0].id
  }

  // No org found — create a default one
  const { data: newOrg, error } = await (supabase as any)
    .from('organizations')
    .insert([{
      name: 'Mi Empresa',
      country: 'PE',
      currency: 'USD',
      active: true
    }])
    .select('id')
    .single()

  if (error) {
    console.error('Error creating default organization:', error)
    return null
  }

  return newOrg?.id ?? null
}
