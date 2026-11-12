import { useEffect, useRef, useState } from "react";
import { Mic, Search, MapPin, Volume2, Car, CalendarCheck, ExternalLink, Mail } from "lucide-react";
import { SPOTS } from "@/data/nashvilleSpots";
import { matchSpots, parseIntent, type Match } from "@/lib/booth/matchSpots";
import { trackEvent } from "@/utils/analytics";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CHIPS = [
  "Quiet Sunday dinner with dad in East Nashville",
  "Patio date night with cocktails in Germantown",
  "Casual hot chicken and beer near Midtown",
];
const NOISE = { quiet: "Quiet", lively: "Lively", loud: "High energy" };
const PARK = { lot: "Own parking lot", valet: "Valet", street: "Street parking only" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechAPI: any = typeof window !== "undefined" ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

const Index = () => {
  const [query, setQuery] = useState("");
  const [onAir, setOnAir] = useState(false);
  const [results, setResults] = useState<Match[] | null>(null);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const recRef = useRef<any>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { document.title = "NashMenus | Say the vibe, find your Nashville table"; }, []);

  const runSearch = (text: string, source: "typed" | "voice" | "chip") => {
    const q = text.trim();
    if (!q) return;
    setResults(matchSpots(SPOTS, parseIntent(q)));
    setSaved(false);
    trackEvent("sound_booth_search", { source, query_length: q.length });
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const toggleMic = () => {
    if (onAir) { recRef.current?.stop(); return; }
    if (!SpeechAPI) { toast("Voice isn't supported on this browser. Type or tap a suggestion instead."); return; }
    const rec = new SpeechAPI();
    rec.lang = "en-US"; rec.interimResults = true; rec.continuous = false;
    let finalText = "";
    rec.onresult = (e: any) => {
      const text = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setQuery(text); finalText = text;
    };
    rec.onerror = (e: any) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") toast("No problem. Mic access is off, so just type or tap a suggestion.");
    };
    rec.onend = () => { setOnAir(false); if (finalText) runSearch(finalText, "voice"); };
    recRef.current = rec;
    setOnAir(true);
    trackEvent("mic_activated");
    rec.start();
  };

  const saveShortlist = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(clean) || clean.length > 254) { toast("Please enter a valid email."); return; }
    if (saving || !results) return;
    setSaving(true);
    const { error } = await (supabase as any).from("shortlist_signups").insert({
      email: clean, search_query: query.slice(0, 500), restaurants: results.map((r) => r.spot.name),
    });
    setSaving(false);
    if (error) { toast("Couldn't save right now. Please try again."); return; }
    setSaved(true); setEmail("");
    trackEvent("email_shortlist_saved", { count: results.length });
  };

  return (
    <div className="theme-neon min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-2xl px-5 pb-16 pt-10">
        <header className="flex flex-col items-center text-center">
          <img src="/lovable-uploads/5e438e4a-f73a-48ba-bd59-55214f04eeaf.png" alt="NashMenus logo" className="h-28 w-28 object-contain sm:h-36 sm:w-36" />
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.3em] text-accent">Music City dining</p>
          <h1 className="font-display mt-2 text-4xl font-bold leading-tight neon-glow-text sm:text-5xl">Say the vibe.<br />Find your table.</h1>
          <p className="mt-3 max-w-md text-muted-foreground">Tell us who you're with, where, and what matters. We'll match the room, the noise level, and the parking.</p>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); runSearch(query, "typed"); }} className="booth-glow mt-8 flex items-center gap-2 rounded-full border border-border bg-card p-2 pl-5">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={onAir ? "Listening..." : "Dinner with dad Sunday in East Nashville..."}
            aria-label="Describe what you're looking for" className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-muted-foreground" />
          <button type="button" onClick={toggleMic} aria-label={onAir ? "Stop listening" : "Speak your search"} aria-pressed={onAir}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition ${onAir ? "on-air-glow animate-pulse bg-neon-amber text-primary-foreground" : "bg-secondary text-foreground hover:bg-muted"}`}>
            <Mic className="h-5 w-5" />
          </button>
        </form>
        <div className="mt-2 h-5 text-center text-xs font-bold uppercase tracking-[0.3em] text-neon-amber" aria-live="polite">{onAir ? "● On Air" : ""}</div>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {CHIPS.map((c) => (
            <button key={c} onClick={() => { setQuery(c); trackEvent("chip_clicked", { chip: c }); runSearch(c, "chip"); }}
              className="rounded-full border border-neon-pink/50 px-4 py-2 text-sm text-foreground transition hover:bg-neon-pink/15">{c}</button>
          ))}
        </div>

        <section ref={resultsRef} className="mt-10 space-y-5" aria-live="polite">
          {results?.map(({ spot, reasons }, i) => (
            <article key={spot.name} className="rounded-2xl border border-border bg-card p-5" style={{ animation: `fadeIn 0.4s ease-out ${i * 0.1}s both` }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-bold">{spot.name}</h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-accent"><MapPin className="h-4 w-4" />{spot.neighborhood} · {spot.price}</p>
                </div>
                <span className="rounded-full bg-neon-pink/15 px-3 py-1 text-xs font-medium text-neon-pink">#{i + 1} match</span>
              </div>
              <p className="mt-3 text-foreground">{spot.vibe}. <span className="text-muted-foreground">Known for {spot.knownFor.toLowerCase()}.</span></p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-secondary p-2"><Volume2 className="mb-1 h-4 w-4 text-neon-cyan" />{NOISE[spot.noise]}</div>
                <div className="rounded-lg bg-secondary p-2"><Car className="mb-1 h-4 w-4 text-neon-cyan" />{PARK[spot.parking]}</div>
                <div className="rounded-lg bg-secondary p-2"><CalendarCheck className="mb-1 h-4 w-4 text-neon-cyan" />{spot.reservations ? "Reservations" : "Walk-in only"}</div>
              </div>
              {reasons.length > 0 && <p className="mt-3 text-sm text-muted-foreground">Why it fits: {reasons.slice(0, 3).join(" · ")}</p>}
              <div className="mt-4 flex gap-2">
                <Button asChild variant="secondary" className="flex-1">
                  <a href={spot.menuUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("menu_click", { restaurant_name: spot.name })}>View menu <ExternalLink className="ml-1 h-4 w-4" /></a>
                </Button>
                {spot.reserveUrl && (
                  <Button asChild className="flex-1">
                    <a href={spot.reserveUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("reservation_click", { restaurant_name: spot.name })}>Reserve</a>
                  </Button>
                )}
              </div>
            </article>
          ))}

          {results && (
            <div className="rounded-2xl border border-neon-cyan/40 p-5">
              {saved ? (
                <p className="text-center font-medium text-neon-cyan">Saved! We will send your shortlist to your inbox.</p>
              ) : (
                <form onSubmit={saveShortlist}>
                  <p className="font-display flex items-center gap-2 text-lg font-bold"><Mail className="h-5 w-5 text-neon-cyan" />Save my vibe shortlist</p>
                  <p className="mt-1 text-sm text-muted-foreground">Get these picks and menu links by email. No spam, and we never share your email.</p>
                  <div className="mt-3 flex gap-2">
                    <Input type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Email address" />
                    <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                  </div>
                </form>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
