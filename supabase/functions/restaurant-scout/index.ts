import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { firecrawlSearch, geocode } from "../_shared/scout.ts";

const QUERIES = [
  "best new restaurants Nashville opened this year",
  "best restaurants East Nashville",
  "best restaurants Germantown Nashville",
  "best restaurants The Gulch and Midtown Nashville",
  "best restaurants 12 South and Wedgewood-Houston Nashville",
  "best restaurants Brentwood TN",
  "best restaurants downtown Franklin TN",
  "Leiper's Fork restaurants",
  "best restaurants Sylvan Park and The Nations Nashville",
];
const HOODS = ["East Nashville","Germantown","The Gulch","Midtown","12 South","Downtown","Wedgewood-Houston","Sylvan Park","The Nations","Brentwood","Franklin","Leiper's Fork","Green Hills","Hendersonville"];

async function extract(text: string) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: `Extract real, currently open sit-down or notable restaurants in the Nashville area named in the text. Return JSON {"spots":[...]} with fields: name, neighborhood (one of ${HOODS.join(", ")}), vibe (short phrase), known_for (short phrase), noise (quiet|lively|loud), parking (lot|street|valet), reservations (bool), open_sunday (bool), price ($|$$|$$$), tags (from: family,date,romantic,brunch,patio,cocktails,hot chicken,beer,casual,friends,cozy,special), menu_url (official site, https). Skip anything closed or unsure. No em dashes.` },
        { role: "user", content: text.slice(0, 24000) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`AI ${res.status}`);
  const j = await res.json();
  try { return JSON.parse(j.choices[0].message.content).spots ?? []; } catch { return []; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  let body: { batch?: number } = {};
  try { body = await req.json(); } catch { /* empty */ }
  const start = Math.max(0, Math.min(QUERIES.length - 1, Number(body.batch ?? new Date().getUTCDate() % QUERIES.length)));
  const queries = QUERIES.slice(start, start + 3);

  const { data: existing } = await db.from("restaurants").select("name");
  const seen = new Set((existing ?? []).map((r) => r.name.toLowerCase().trim()));
  const added: string[] = [];

  for (const q of queries) {
    try {
      const results = await firecrawlSearch(q, 4);
      const text = results.map((r) => `${r.title}\n${r.description}\n${r.markdown ?? ""}`).join("\n\n");
      const spots = await extract(text);
      for (const s of spots) {
        const key = String(s.name ?? "").toLowerCase().trim();
        if (!key || seen.has(key) || !/^https:\/\//.test(s.menu_url ?? "") || !HOODS.includes(s.neighborhood)) continue;
        seen.add(key);
        const coords = await geocode(s.name, s.neighborhood);
        await new Promise((r) => setTimeout(r, 1100));
        const { error } = await db.from("restaurants").insert({
          name: s.name, neighborhood: s.neighborhood, vibe: s.vibe ?? "", known_for: s.known_for ?? "",
          noise: ["quiet","lively","loud"].includes(s.noise) ? s.noise : "lively",
          parking: ["lot","street","valet"].includes(s.parking) ? s.parking : "street",
          reservations: !!s.reservations, open_sunday: s.open_sunday !== false,
          price: ["$","$$","$$$"].includes(s.price) ? s.price : "$$",
          tags: Array.isArray(s.tags) ? s.tags.slice(0, 6) : [], menu_url: s.menu_url,
          reserve_url: s.reservations ? s.menu_url : null, lat: coords?.lat ?? null, lng: coords?.lng ?? null,
        });
        if (!error) added.push(`${s.name} (${s.neighborhood})`);
      }
    } catch (e) { console.error(q, (e as Error).message); }
  }
  return new Response(JSON.stringify({ queries, added: added.length, names: added }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
