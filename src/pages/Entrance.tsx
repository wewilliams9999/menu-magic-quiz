import { Link } from "react-router-dom";
import { useEffect } from "react";
import logo from "@/assets/nashmenus-logo-neon.png";
import { trackEvent } from "@/utils/analytics";

const Entrance = () => {
  useEffect(() => {
    document.title = "NashMenus | Step inside Nashville's sound booth";
  }, []);

  return (
    <div className="theme-neon relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-center text-foreground">
      {/* warm glow pooling behind the sign */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[120vw] w-[120vw] max-h-[760px] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--on-air) / 0.16) 0%, hsl(var(--on-air) / 0.06) 38%, transparent 68%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center" style={{ animation: "fadeIn 1.2s ease-out both" }}>
        <img
          src={logo}
          alt="NashMenus, tune in to Nashville's tastiest spots"
          className="neon-flicker w-[86vw] max-w-[440px] object-contain"
        />

        <h1 className="font-calligraphy neon-glow-text mt-6 text-4xl leading-tight sm:text-5xl">
          Find your table.
        </h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground sm:text-base">
          Nashville's best tables, the ones locals keep to themselves.
        </p>

        <Link
          to="/booth"
          onClick={() => trackEvent("entrance_clicked")}
          className="door-glow mt-8 rounded-full bg-[hsl(var(--on-air))] px-8 py-4 text-lg font-semibold text-primary-foreground transition hover:scale-105"
        >
          Step inside the sound booth →
        </Link>
      </div>
    </div>
  );
};

export default Entrance;
