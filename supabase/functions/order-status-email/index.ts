/* eslint-disable */
// @ts-expect-error: Deno import for Supabase Edge Functions
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
// @ts-expect-error: Deno import for Supabase Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  try {
    const { email, orderId, status } = await req.json();
    if (!email || !orderId || !status) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      // @ts-expect-error: Deno global for Supabase Edge Functions
      Deno.env.get("SUPABASE_URL")!,
      // @ts-expect-error: Deno global for Supabase Edge Functions
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "SENDGRID_API_KEY")
      .single();
    if (error || !data?.value) {
      return new Response(JSON.stringify({ error: "Missing SENDGRID_API_KEY in settings" }), { status: 500, headers: corsHeaders });
    }
    const SENDGRID_API_KEY = data.value;
    // @ts-expect-error: Deno global for Supabase Edge Functions
    const SENDGRID_FROM = Deno.env.get("SENDGRID_FROM") || "noreply@yourdomain.com";

    const subject = `Order #${orderId} Status Update`;
    const text = `Your order #${orderId} status is now: ${status.toUpperCase()}. Thank you for ordering!`;

    const sendRes = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SENDGRID_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: SENDGRID_FROM },
        subject,
        content: [{ type: "text/plain", value: text }],
      }),
    });

    if (!sendRes.ok) {
      const err = await sendRes.text();
      return new Response(JSON.stringify({ error: err }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
});