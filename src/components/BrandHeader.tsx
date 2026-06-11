import { Link } from "react-router-dom";
import { Music } from "lucide-react";
import lionLogo from "@/assets/lion-logo.png";
import breastplateLogo from "@/assets/breastplate-logo.png";

export const BrandHeader = () => {
  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[42] pointer-events-none flex items-center justify-between w-[calc(100%-2rem)] max-w-7xl px-2">
      <div className="rounded-full overflow-hidden border-2 p-0.5 w-9 h-9 md:w-12 md:h-12" style={{
        borderColor: 'hsl(45 80% 50%)',
        background: 'radial-gradient(circle, hsl(0 0% 100%) 0%, hsl(0 60% 40%) 60%, hsl(45 80% 50%) 100%)',
        boxShadow: '0 0 12px hsl(45 80% 50% / 0.25), 0 0 24px hsl(0 70% 50% / 0.15)',
      }}>
        <img src={lionLogo} alt="Lion of Judah" className="w-full h-full object-cover rounded-full drop-shadow-[0_0_10px_hsl(0,70%,50%,0.5)]" />
      </div>

      <Link
        to="/music"
        className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full border font-bold text-[10px] tracking-widest uppercase transition-all hover:scale-105"
        style={{
          background: 'hsl(0 0% 6% / 0.7)',
          backdropFilter: 'blur(8px)',
          borderColor: 'hsl(45 60% 40% / 0.5)',
          color: 'hsl(45 80% 60%)',
        }}
        aria-label="Open the music vault"
      >
        <Music className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">The Vault</span>
      </Link>

      <div className="rounded-full overflow-hidden border-2 p-0.5 w-9 h-9 md:w-12 md:h-12" style={{
        borderColor: 'hsl(45 80% 50%)',
        background: 'radial-gradient(circle, hsl(0 0% 100%) 0%, hsl(0 60% 40%) 60%, hsl(45 80% 50%) 100%)',
        boxShadow: '0 0 12px hsl(45 80% 50% / 0.25), 0 0 24px hsl(0 70% 50% / 0.15)',
      }}>
        <img src={breastplateLogo} alt="12-Gemstone Breastplate" className="w-full h-full object-cover rounded-full drop-shadow-[0_0_10px_hsl(0,70%,50%,0.5)]" />
      </div>
    </div>
  );
};
