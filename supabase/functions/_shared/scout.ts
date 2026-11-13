export async function firecrawlSearch(query: string, limit = 5) {
  const key = Deno.env.get("FIRECRAWL_API_KEY");
  if (!key) throw new Error("FIRECRAWL_API_KEY missing");
  const gateway = key.startsWith("lovc_");
  const url = gateway ? "https://connector-gateway.lovable.dev/firecrawl/v2/search" : "https://api.firecrawl.dev/v2/search";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (gateway) {
    headers.Authorization = `Bearer ${Deno.env.get("LOVABLE_API_KEY") ?? ""}`;
    headers["X-Connection-Api-Key"] = key;
  } else headers.Authorization = `Bearer ${key}`;
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ query, limit, scrapeOptions: { formats: ["markdown"], onlyMainContent: true } }) });
  if (!res.ok) throw new Error(`Firecrawl [${res.status}]: ${await res.text()}`);
  const json = await res.json();
  return (json?.data?.web ?? json?.data ?? []) as Array<{ url: string; title?: string; description?: string; markdown?: string }>;
}

export async function geocode(name: string, neighborhood: string) {
  const q = encodeURIComponent(`${name}, Nashville, TN`);
  const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${q}`, { headers: { "User-Agent": "NashMenus/1.0 (nashmenus.com)" } });
  if (!res.ok) return null;
  const [hit] = await res.json();
  return hit ? { lat: Number(hit.lat), lng: Number(hit.lon) } : null;
}

// Only verbatim sentences that mention parking, each tied to its source URL. No generated text.
export function extractParkingQuotes(results: Array<{ url: string; title?: string; description?: string; markdown?: string }>, name: string) {
  const first = name.split(/\s|'/)[0].toLowerCase();
  const notes: { quote: string; url: string; source: string }[] = [];
  for (const r of results) {
    const text = `${r.description ?? ""}\n${r.markdown ?? ""}`;
    if (!text.toLowerCase().includes(first)) continue;
    const sentences = text.replace(/[#*_>\[\]()]/g, " ").split(/(?<=[.!?])\s+|\n+/);
    const hit = sentences.find((s) => /\b(park|parking|valet|lot|garage)\b/i.test(s) && s.length > 25 && s.length < 280);
    if (hit) notes.push({ quote: hit.trim(), url: r.url, source: new URL(r.url).hostname.replace(/^www\./, "") });
    if (notes.length >= 3) break;
  }
  return notes;
}
