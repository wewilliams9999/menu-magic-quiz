import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { firecrawlSearch, geocode, extractParkingQuotes } from "../_shared/scout.ts";

const Body = z.object({ id: z.string().uuid() });
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Invalid id" }, 400);
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: r, error } = await db.from("restaurants").select("*").eq("id", parsed.data.id).single();
    if (error || !r) return json({ error: "Not found" }, 404);
    const fresh = r.parking_scouted_at && Date.now() - new Date(r.parking_scouted_at).getTime() < 30 * 864e5;
    if (fresh) return json({ notes: r.parking_notes, lat: r.lat, lng: r.lng, cached: true });
    const coords = r.lat ? { lat: r.lat, lng: r.lng } : await geocode(r.name, r.neighborhood);
    const results = await firecrawlSearch(`"${r.name}" Nashville parking`, 5);
    const notes = extractParkingQuotes(results, r.name);
    await db.from("restaurants").update({ parking_notes: notes, parking_scouted_at: new Date().toISOString(), lat: coords?.lat ?? null, lng: coords?.lng ?? null }).eq("id", r.id);
    return json({ notes, lat: coords?.lat ?? null, lng: coords?.lng ?? null, cached: false });
  } catch (e) {
    console.error("parking-scout failed", e);
    return json({ error: String(e) }, 500);
  }
});
