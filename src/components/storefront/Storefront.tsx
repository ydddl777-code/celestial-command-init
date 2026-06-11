import { NavArrows } from "../NavArrows";
import { ExtendedPlayList } from "./ExtendedPlayList";
import lionLogo from "@/assets/lion-logo.png";
import breastplateLogo from "@/assets/breastplate-logo.png";

interface StorefrontProps {
  onBack: () => void;
}

export const Storefront = ({ onBack }: StorefrontProps) => {
  return (
    <div
      className="fixed inset-0 overflow-y-auto z-20"
      style={{
        background: "linear-gradient(180deg, hsl(15 12% 10%) 0%, hsl(0 0% 4%) 100%)",
      }}
    >
      {/* Brand Header */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: "hsl(15 12% 10% / 0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "hsl(0 50% 35% / 0.3)",
        }}
      >
        <div className="flex items-center gap-3">
          <img src={lionLogo} alt="Lion of Judah" className="w-10 h-10 rounded-full" />
          <div>
            <h1
              className="font-ceremonial text-lg tracking-wider"
              style={{ color: "hsl(0 70% 50%)" }}
            >
              Prophet Gad Music
            </h1>
            <p
              className="font-terminal text-[9px] tracking-widest uppercase"
              style={{ color: "hsl(45 60% 50% / 0.6)" }}
            >
              Thread Bear Music — Remnant Seed LLC
            </p>
          </div>
        </div>
        <img src={breastplateLogo} alt="Breastplate" className="w-10 h-10 rounded-full" />
      </div>

      {/* Content — music only. (E-books moved to the .com store.) */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 pb-20">
        <ExtendedPlayList />
      </div>

      {/* Nav arrows — back to warfare */}
      <NavArrows onBack={onBack} backLabel="WARFARE" />
    </div>
  );
};
