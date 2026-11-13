import { useState } from "react";
import { Car, Eye, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/utils/analytics";

type Note = { quote: string; url: string; source: string };
interface Props { id?: string; name: string; lat?: number | null; lng?: number | null; notes?: Note[] }

export function streetViewUrl(name: string, lat?: number | null, lng?: number | null) {
  if (lat && lng) return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Nashville TN`)}`;
}

export const ParkingScout = ({ id, name, lat, lng, notes: initial }: Props) => {
  const [notes, setNotes] = useState<Note[] | null>(initial && initial.length ? initial : null);
  const [coords, setCoords] = useState({ lat, lng });
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const scout = async () => {
    if (!id) return;
    setLoading(true);
    trackEvent("parking_scout_click", { restaurant_name: name });
    const { data, error } = await supabase.functions.invoke("parking-scout", { body: { id } });
    setLoading(false);
    setChecked(true);
    if (error || !data) { setNotes([]); return; }
    setNotes(data.notes ?? []);
    if (data.lat) setCoords({ lat: data.lat, lng: data.lng });
  };

  return (
    <div className="mt-3 rounded-lg border border-neon-cyan/30 bg-muted/30 p-3">
      <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-neon-cyan"><Car className="h-4 w-4" />Parking scout</p>
      {notes && notes.length > 0 && (
        <ul className="mt-2 space-y-2">
          {notes.map((n) => (
            <li key={n.url} className="text-sm">
              <span className="text-foreground">"{n.quote}"</span>{" "}
              <a href={n.url} target="_blank" rel="noopener noreferrer" className="ml-1 inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground underline-offset-2 hover:underline">
                <ShieldCheck className="h-3 w-3" />{n.source}
              </a>
            </li>
          ))}
        </ul>
      )}
      {checked && notes?.length === 0 && (
        <p className="mt-2 text-sm text-muted-foreground">No verified parking info found yet. Check Street View or call ahead.</p>
      )}
      <div className="mt-3 flex gap-2">
        {id && !notes && (
          <Button size="sm" variant="secondary" className="flex-1" onClick={scout} disabled={loading}>
            {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-1 h-4 w-4" />}Find cited parking tips
          </Button>
        )}
        <Button asChild size="sm" variant="outline" className="flex-1">
          <a href={streetViewUrl(name, coords.lat, coords.lng)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("street_view_click", { restaurant_name: name })}>
            <Eye className="mr-1 h-4 w-4" />See it on Street View
          </a>
        </Button>
      </div>
    </div>
  );
};
