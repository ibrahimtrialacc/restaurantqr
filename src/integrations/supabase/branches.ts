import { supabase } from "@/integrations/supabase/client";

export type Branch = {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  hours?: string;
  created_at?: string;
};

export async function fetchBranches(): Promise<Branch[]> {
  const { data, error } = await supabase
    .from("branches")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addBranch(branch: Omit<Branch, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("branches")
    .insert([branch])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBranch(id: string, updates: Partial<Branch>) {
  const { data, error } = await supabase
    .from("branches")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteBranch(id: string) {
  const { error } = await supabase
    .from("branches")
    .delete()
    .eq("id", id);
  if (error) throw error;
}