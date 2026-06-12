// =====================================================================
// manual-result  —  Supabase Edge Function
//
// Powers the password-protected manual override on the website.
// The browser never sees the admin password check result OR the database
// service key — it just sends the password + the desired action here, and
// THIS function (running on Supabase's servers) verifies the password and
// performs the write with privileged access.
//
// Actions:
//   { password, action: "set",   matchId, winner }  -> set/override a result (locks it)
//   { password, action: "reset", matchId }          -> clear a result (unlocks, removes row)
//
// A "locked" result is one a human set here; the automatic sync-results
// function will not overwrite it.
// =====================================================================

import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  // Browsers send a preflight OPTIONS request first; answer it.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!ADMIN_PASSWORD || !SUPABASE_URL || !SERVICE_KEY) {
    return json({ error: "Server not configured" }, 500);
  }

  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Bad request" }, 400);
  }

  const { password, action, matchId, winner } = payload ?? {};

  // Verify the password on the server. A wrong password never gets to write.
  if (password !== ADMIN_PASSWORD) {
    return json({ error: "Incorrect password" }, 401);
  }

  if (typeof matchId !== "number") {
    return json({ error: "matchId must be a number" }, 400);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  // A lightweight check the login screen uses to confirm the password
  // without changing any data.
  if (action === "verify") {
    return json({ ok: true, action: "verify" });
  }

  if (action === "reset") {
    const { error } = await supabase.from("results").delete().eq("match_id", matchId);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, action: "reset", matchId });
  }

  if (action === "set") {
    if (typeof winner !== "string" || winner.length === 0) {
      return json({ error: "winner is required" }, 400);
    }
    const { error } = await supabase
      .from("results")
      .upsert(
        { match_id: matchId, winner, locked: true, updated_at: new Date().toISOString() },
        { onConflict: "match_id" },
      );
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true, action: "set", matchId, winner });
  }

  return json({ error: "Unknown action" }, 400);
});
