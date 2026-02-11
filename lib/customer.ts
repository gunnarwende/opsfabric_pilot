import { supabaseAdmin } from "@/lib/supabase";
import type { Customer } from "@/lib/types";

/**
 * Fetch customer by slug from Supabase.
 * Used by all [slug] pages for customer resolution.
 */
export async function getCustomerBySlug(slug: string): Promise<Customer | null> {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Customer;
}

/**
 * Fetch all active customers (for sitemap, landing page, etc.)
 */
export async function getAllActiveCustomers(): Promise<Customer[]> {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error || !data) {
    return [];
  }

  return data as Customer[];
}
