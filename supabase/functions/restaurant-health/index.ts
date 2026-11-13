import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { geocode } from "../_shared/scout.ts";

async function check(url?: string | null) {
  if (!url) return null;
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 NashMenusHealth" }, signal: AbortSignal.timeout(10000) });
    return res.status;
  } catch { return 0; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: rows } = await db.from("restaurants").select("id,name,neighborhood,menu_url,reserve_url,lat");
  const report = [];
  for (const r of rows ?? []) {
    const menu = await check(r.menu_url);
    const reserve = await check(r.reserve_url);
    const coords = r.lat ? null : await geocode(r.name, r.neighborhood);
    const update: Record<string, unknown> = { link_health: { menu, reserve, checked_at: new Date().toISOString() } };
    if (menu && menu < 400) update.last_verified_at = new Date().toISOString();
    if (coords) { update.lat = coords.lat; update.lng = coords.lng; }
    await db.from("restaurants").update(update).eq("id", r.id);
    report.push({ name: r.name, menu, reserve });
    await new Promise((s) => setTimeout(s, 1100)); // respect free geocoder rate limit
  }
  return new Response(JSON.stringify({ checked: report.length, report }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
