import { Link } from "react-router-dom";
import { useEffect } from "react";
import door from "@/assets/speakeasy-door.jpg";
import { trackEvent } from "@/utils/analytics";

const Entrance = () => {
  useEffect(() => { document.title = "NashMenus | Step inside Nashville's sound booth"; }, []);
  return (
    <div className="theme-neon relative flex min-h-screen flex-col items-center justify-end overflow-hidden bg-background text-foreground">
      <img src={door} alt="A glowing door at the end of a Nashville brick alley" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="relative z-10 flex flex-col items-center px-6 pb-20 text-center" style={{ animation: "fadeIn 1.2s ease-out both" }}>
        <img src="/lovable-uploads/5e438e4a-f73a-48ba-bd59-55214f04eeaf.png" alt="NashMenus logo" className="neon-flicker mix-blend-screen h-40 w-40 object-contain drop-shadow-[0_0_24px_hsl(var(--neon-pink)/0.7)]" />
        <h1 className="font-calligraphy mt-4 text-5xl neon-glow-text">Say the vibe.</h1>
        <p className="mt-3 max-w-xs text-muted-foreground">Nashville's best tables, the ones locals keep to themselves.</p>
        <Link to="/booth" onClick={() => trackEvent("entrance_clicked")}
          className="door-glow mt-8 rounded-full bg-neon-amber px-8 py-4 text-lg font-semibold text-primary-foreground transition hover:scale-105">
          Step inside the sound booth →
        </Link>
      </div>
    </div>
  );
};
export default Entrance;
