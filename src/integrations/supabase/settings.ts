import { supabase } from "@/integrations/supabase/client";

export async function getSetting(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", key)
    .single();
  if (error) return null;
  return data?.value ?? null;
}

export async function setSetting(key: string, value: string) {
  const { error } = await supabase
    .from("settings")
    .upsert({ key, value });
  if (error) throw error;
}