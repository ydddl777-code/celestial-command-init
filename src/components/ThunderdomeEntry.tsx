import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { BrandHeader } from "./BrandHeader";

import gadArmorCity from "@/assets/gad/gad-armor-city.png";
import gadArmorFull from "@/assets/gad/gad-armor-full.png";
import gadSuitManhattan from "@/assets/gad/gad-suit-manhattan.jpg";
import gadKneelingPrayer from "@/assets/gad/gad-kneeling-prayer.png";
import gadSpearWarrior from "@/assets/gad/gad-spear-warrior.jpg";
import gadHeroStance from "@/assets/gad/gad-hero-stance.png";

// Villain images
import villainNimrod from "@/assets/villains/nimrod.png";
import villainAhab from "@/assets/villains/ahab.png";
import villainConstantine from "@/assets/villains/constantine.png";
import villainBalaam from "@/assets/villains/balaam.png";
import villainPharaoh from "@/assets/villains/pharaoh.png";
import villainDarwin from "@/assets/villains/darwin.png";
import villainFalseProphet from "@/assets/villains/false-prophet.png";

// Tribal standards (flags)
import tribeBenjamin from "@/assets/tribes/benjamin.jpeg";
import tribeJudah from "@/assets/tribes/judah.jpeg";
import tribeLevi from "@/assets/tribes/levi.jpeg";

const gadPoses = [gadHeroStance, gadSpearWarrior, gadArmorFull, gadArmorCity, gadKneelingPrayer, gadSuitManhattan];

const opponents = [
  { name: "NIMROD", img: villainNimrod },
  { name: "AHAB", img: villainAhab },
  { name: "CONSTANTINE", img: villainConstantine },
  { name: "BALAAM", img: villainBalaam },
  { name: "PHARAOH", img: villainPharaoh },
  { name: "DARWIN", img: villainDarwin },
  { name: "FALSE PROPHET", img: villainFalseProphet },
];

interface ThunderdomeEntryProps {
  onEnter: () => void;
  onExit: () => void;
  gadImage: { src: string; alt: string };
}

export const ThunderdomeEntry = ({ onEnter, onExit, gadImage }: ThunderdomeEntryProps) => {
  const [opponentIndex, setOpponentIndex] = useState(0);
  const [gadPoseIndex, setGadPoseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpponentIndex((prev) => (prev + 1) % opponents.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGadPoseIndex((prev) => (prev + 1) % gadPoses.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const current = opponents[opponentIndex];

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <BrandHeader />

      {/* Arena background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 58% 50% at 50% 56%, hsl(35 44% 24%) 0%, hsl(18 28% 12%) 44%, hsl(0 0% 4%) 100%)`,
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 40px, hsl(32 28% 42% / 0.45) 40px, hsl(32 28% 42% / 0.45) 41px)`,
        }}
      />

      {/* Arena glow */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 28% 38% at 50% 45%, hsl(45 82% 74% / 0.24) 0%, transparent 100%),
            radial-gradient(ellipse 48% 58% at 50% 48%, hsl(12 72% 50% / 0.1) 0%, transparent 100%),
            radial-gradient(ellipse 14% 82% at 50% 0%, hsl(45 65% 86% / 0.08) 0%, transparent 100%)
          `,
        }}
      />

      {/* Arena circles */}
      <div className="absolute inset-0 z-[3] pointer-events-none flex items-center justify-center">
        <div className="relative" style={{ width: "min(86vw, 86vh)", height: "min(86vw, 86vh)" }}>
          <svg viewBox="0 0 400 400" className="w-full h-full absolute inset-0">
            <defs>
              <radialGradient id="arena-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(45 82% 60%)" stopOpacity="0.16" />
                <stop offset="55%" stopColor="hsl(12 72% 44%)" stopOpacity="0.08" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="200" cy="200" r="190" fill="url(#arena-glow)" />
            <circle cx="200" cy="200" r="190" fill="none" stroke="hsl(12 72% 44%)" strokeWidth="0.8" opacity="0.28" />
            <circle cx="200" cy="200" r="160" fill="none" stroke="hsl(45 82% 60%)" strokeWidth="0.5" opacity="0.18" />
            <circle cx="200" cy="200" r="82" fill="none" stroke="hsl(45 82% 60%)" strokeWidth="0.4" opacity="0.22" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 54% 54% at 50% 48%, transparent 34%, hsl(0 0% 0% / 0.28) 62%, hsl(0 0% 0% / 0.74) 100%)`,
        }}
      />

      {/* Smoke */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <div
          className="absolute w-[62%] h-[40%] top-[18%] left-[19%]"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, hsl(45 80% 70% / 0.08) 0%, transparent 70%)`,
            animation: "smoke-drift 15s ease-in-out infinite",
            filter: "blur(42px)",
          }}
        />
      </div>

      {/* TRIBAL STANDARDS — rectangular flags on back wall inside arena circle */}
      <div className="absolute inset-0 z-[6] pointer-events-none hidden md:flex items-center justify-center">
        <div className="relative" style={{ width: "min(86vw, 86vh)", height: "min(86vw, 86vh)" }}>
          {/* Levi — left wall */}
          <div className="absolute flex flex-col items-center"
            style={{ top: "22%", left: "18%", transform: "translate(-50%, 0)" }}>
            <div className="w-8 lg:w-11 h-14 lg:h-20 overflow-hidden rounded-sm"
              style={{ boxShadow: "0 4px 20px hsl(0 0% 0% / 0.7)", border: "1px solid hsl(30 20% 25% / 0.2)", opacity: 0.3, filter: "brightness(0.4) saturate(0.6)" }}>
              <img src={tribeLevi} alt="Standard of Levi" className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Judah — center back wall */}
          <div className="absolute flex flex-col items-center"
            style={{ top: "18%", left: "50%", transform: "translate(-50%, 0)" }}>
            <div className="w-9 lg:w-13 h-16 lg:h-22 overflow-hidden rounded-sm"
              style={{ boxShadow: "0 4px 25px hsl(0 0% 0% / 0.7)", border: "1px solid hsl(30 20% 25% / 0.25)", opacity: 0.4, filter: "brightness(0.45) saturate(0.65)" }}>
              <img src={tribeJudah} alt="Standard of Judah" className="w-full h-full object-cover" />
            </div>
          </div>
          {/* Benjamin — right wall */}
          <div className="absolute flex flex-col items-center"
            style={{ top: "22%", right: "18%", transform: "translate(50%, 0)" }}>
            <div className="w-8 lg:w-11 h-14 lg:h-20 overflow-hidden rounded-sm"
              style={{ boxShadow: "0 4px 20px hsl(0 0% 0% / 0.7)", border: "1px solid hsl(30 20% 25% / 0.2)", opacity: 0.3, filter: "brightness(0.4) saturate(0.6)" }}>
              <img src={tribeBenjamin} alt="Standard of Benjamin" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* LEFT PANEL — VILLAINS (challengers) with actual images */}
      <div className="absolute left-0 top-0 bottom-0 w-[14%] md:w-[18%] z-[10] overflow-hidden">
        {/* Subtle edge gradient */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, hsl(0 0% 6% / 0.3) 0%, transparent 100%)",
        }} />
        {/* Spotlight from above */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 30%, hsl(45 30% 85% / 0.25) 0%, transparent 70%)",
        }} />
        {opponents.map((villain, i) => (
          <img
            key={villain.name}
            src={villain.img}
            alt={villain.name}
            className="absolute inset-x-0 bottom-[8%] h-[72%] w-full object-cover object-center transition-opacity duration-700"
            style={{
              opacity: i === opponentIndex ? 1 : 0,
              filter: "brightness(0.95) contrast(1.15) saturate(0.9)",
              maskImage: "linear-gradient(to right, black 55%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 55%, transparent 100%)",
            }}
          />
        ))}
        <div className="absolute bottom-6 left-0 right-0 z-10 text-center">
          <p className="font-display text-[9px] md:text-xs tracking-[0.2em] uppercase font-bold"
            style={{ color: "hsl(0 60% 55%)", textShadow: "0 0 15px hsl(0 60% 55% / 0.4)" }}>
            {opponents[opponentIndex].name}
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — GAD / WARRIORS (good guys) */}
      <div className="absolute right-0 top-0 bottom-0 w-[14%] md:w-[18%] z-[10] overflow-hidden">
        {gadPoses.map((pose, i) => (
          <img
            key={i}
            src={pose}
            alt={`Warriors of Israel - Pose ${i + 1}`}
            className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000"
            style={{
              opacity: i === gadPoseIndex ? 1 : 0,
              filter: "brightness(0.75) contrast(1.35) saturate(0.85)",
              maskImage: "linear-gradient(to left, black 55%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to left, black 55%, transparent 100%)",
            }}
          />
        ))}
        <div className="absolute bottom-6 right-0 left-0 z-10 text-center">
          <p className="font-display text-[9px] md:text-xs tracking-[0.2em] uppercase font-bold"
            style={{ color: "hsl(45 85% 58%)", textShadow: "0 0 10px hsl(45 85% 58% / 0.4)" }}>
            THE MIGHTY MEN
          </p>
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div className="absolute inset-0 z-[20] flex flex-col items-center justify-center p-4">
        {/* Gad stationary portrait */}
        <div className="relative mb-2">
          <img
            src={gadImage.src}
            alt={gadImage.alt}
            className="w-auto max-w-[340px] md:max-w-[420px] lg:max-w-[480px]"
            style={{
              height: "auto",
              maxHeight: "55vh",
              objectFit: "contain",
              filter: "brightness(0.75) contrast(1.35) saturate(0.85)",
              borderRadius: "8px",
            }}
          />
        </div>

        {/* Matchup — CHALLENGER vs GAD */}
        <div className="mt-1 flex items-center justify-center gap-2 md:gap-3">
          <p className="font-display text-xs md:text-sm uppercase tracking-wider font-bold"
            style={{ color: "hsl(0 60% 50%)", textShadow: "0 0 15px hsl(0 60% 50% / 0.35)" }}>
            {current.name}
          </p>
          <span className="font-display text-sm md:text-base font-bold"
            style={{ color: "hsl(45 82% 60%)", textShadow: "0 0 20px hsl(45 82% 60% / 0.38)" }}>
            vs.
          </span>
          <p className="font-display text-xs md:text-sm uppercase tracking-wider font-bold"
            style={{ color: "hsl(12 76% 54%)", textShadow: "0 0 15px hsl(12 76% 54% / 0.35)" }}>
            GAD
          </p>
        </div>

        {/* ENTER button */}
        <button
          onClick={onEnter}
          className="mt-2 md:mt-3 px-8 md:px-12 py-2 md:py-2.5 font-display text-sm md:text-base uppercase tracking-[0.3em]
                     border transition-all duration-500 cursor-pointer relative overflow-hidden"
          style={{
            background: "linear-gradient(180deg, hsl(12 60% 26% / 0.85) 0%, hsl(0 55% 16% / 0.95) 100%)",
            borderColor: "hsl(12 76% 54%)",
            color: "hsl(45 82% 60%)",
            boxShadow: "0 0 20px hsl(12 76% 54% / 0.3), inset 0 0 20px hsl(12 60% 20% / 0.2)",
            textShadow: "0 0 12px hsl(45 82% 60% / 0.4)",
            animation: "enter-pulse 2.5s ease-in-out infinite",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 0 40px hsl(12 76% 54% / 0.45), inset 0 0 25px hsl(12 60% 20% / 0.25)";
            e.currentTarget.style.borderColor = "hsl(45 82% 60%)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 0 20px hsl(12 76% 54% / 0.3), inset 0 0 20px hsl(12 60% 20% / 0.2)";
            e.currentTarget.style.borderColor = "hsl(12 76% 54%)";
          }}
        >
          ENTER
        </button>



        {/* Mobile villain pills */}
        <div className="mt-4 flex md:hidden items-center justify-center gap-2 overflow-x-auto pb-2">
          {opponents.map((v, i) => (
            <div
              key={v.name}
              className="flex-shrink-0 rounded-full border transition-all duration-500 px-3 py-2"
              style={{
                borderColor: i === opponentIndex ? "hsl(45 85% 58% / 0.7)" : "hsl(0 0% 100% / 0.12)",
                background: i === opponentIndex ? "hsl(0 0% 8% / 0.92)" : "hsl(0 0% 5% / 0.72)",
                opacity: i === opponentIndex ? 1 : 0.55,
              }}
            >
              <span className="font-terminal text-[9px] uppercase tracking-[0.2em] whitespace-nowrap"
                style={{ color: i === opponentIndex ? "hsl(45 85% 58%)" : "hsl(0 0% 76%)" }}>
                {v.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Nav arrows — same plane, centered at bottom */}
      <div className="fixed bottom-6 left-[50%] -translate-x-[calc(50%+120px)] z-50">
        <button onClick={onExit} className="p-2 rounded-full bg-black/50 backdrop-blur-sm border transition-all duration-300 hover:bg-black/70 opacity-60 hover:opacity-100"
          style={{ borderColor: "hsl(45 60% 40% / 0.3)", color: "hsl(45 80% 55%)" }}>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
      <div className="fixed bottom-6 left-[50%] translate-x-[calc(50%+80px)] z-50">
        <button onClick={onEnter} className="p-2 rounded-full bg-black/50 backdrop-blur-sm border transition-all duration-300 hover:bg-black/70 opacity-60 hover:opacity-100"
          style={{ borderColor: "hsl(45 60% 40% / 0.3)", color: "hsl(45 80% 55%)" }}>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>

      <style>{`
        @keyframes smoke-drift {
          0% { transform: translateX(0) translateY(0); opacity: 0.5; }
          33% { transform: translateX(20px) translateY(-10px); opacity: 0.7; }
          66% { transform: translateX(-15px) translateY(5px); opacity: 0.4; }
          100% { transform: translateX(0) translateY(0); opacity: 0.5; }
        }
        @keyframes enter-pulse {
          0%, 100% { box-shadow: 0 0 25px hsl(12 76% 54% / 0.35), inset 0 0 30px hsl(12 60% 20% / 0.25); }
          50% { box-shadow: 0 0 40px hsl(12 76% 54% / 0.5), inset 0 0 40px hsl(12 60% 20% / 0.35); }
        }
      `}</style>
    </div>
  );
};
