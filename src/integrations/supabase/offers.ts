import { supabase } from "@/integrations/supabase/client";

export type Offer = {
  id: string;
  title: string;
  message: string;
  date: string;
  created_at?: string;
};

export async function fetchOffers(): Promise<Offer[]> {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addOffer(offer: Omit<Offer, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("offers")
    .insert([offer])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateOffer(id: string, updates: Partial<Offer>) {
  const { data, error } = await supabase
    .from("offers")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteOffer(id: string) {
  const { error } = await supabase
    .from("offers")
    .delete()
    .eq("id", id);
  if (error) throw error;
}