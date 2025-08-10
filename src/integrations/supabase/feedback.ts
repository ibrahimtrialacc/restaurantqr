import { supabase } from "@/integrations/supabase/client";

export type Feedback = {
  id: string;
  order_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  created_at?: string;
};

export async function submitFeedback(feedback: Omit<Feedback, "id" | "created_at">) {
  const { data, error } = await supabase
    .from("feedback")
    .insert([feedback])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchFeedbackForOrder(order_id: string) {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .eq("order_id", order_id)
    .single();
  if (error && error.code !== "PGRST116") throw error; // Not found is OK
  return data;
}

export async function fetchAllFeedback() {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}