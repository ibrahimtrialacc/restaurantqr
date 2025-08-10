import { supabase } from "@/integrations/supabase/client";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  status: string;
  customer?: string;
  location?: string;
  notes?: string;
  created_at?: string;
  user_id?: string;
};

export async function placeOrder(order: Omit<Order, "id" | "created_at" | "status" | "user_id">) {
  const { data: { session } } = await supabase.auth.getSession();
  const user_id = session?.user.id;
  const { data, error } = await supabase
    .from("orders")
    .insert([{ ...order, status: "pending", user_id }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}