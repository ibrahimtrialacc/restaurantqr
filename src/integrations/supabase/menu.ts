import { supabase } from "@/integrations/supabase/client";

export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  available?: boolean;
  is_special?: boolean;
  branch_id?: string | null;
  created_at?: string;
};

export async function fetchMenuItems(branchId?: string): Promise<MenuItem[]> {
  let query = supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false });
  if (branchId) {
    query = query.or(`branch_id.is.null,branch_id.eq.${branchId}`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function addMenuItem(item: Omit<MenuItem, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("menu_items")
    .insert([item])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMenuItem(id: string, updates: Partial<MenuItem>) {
  const { data, error } = await supabase
    .from("menu_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMenuItem(id: string) {
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
}