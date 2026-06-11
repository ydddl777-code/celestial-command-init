import { useState, useRef, useCallback, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { BattlefieldLanding } from "@/components/BattlefieldLanding";
import { SanctuaryInterior } from "@/components/SanctuaryInterior";

type ZoneState = "battlefield" | "sanctuary";

const Index = () => {
  const [zone, setZone] = useState<ZoneState>("battlefield");
  const musicRef = useRef<HTMLAudioElement>(null);
  const instrumentalRef = useRef<HTMLAudioElement>(null);

  // Music is OFF by default — no autoplay ambush. The visitor turns it on.
  const [musicOn, setMusicOn] = useState(false);
  // Soft background hum when on (25%), never a blast.
  const [globalVolume, setGlobalVolume] = useState(0.25);
  const [prevVolume, setPrevVolume] = useState(0.25);

  // Begin no longer auto-starts music; the on/off button is the only thing that does.
  const startMusic = useCallback(() => {}, []);

  const toggleMusic = useCallback(() => {
    setMusicOn((on) => {
      const next = !on;
      if (next) {
        if (musicRef.current) {
          musicRef.current.volume = globalVolume;
          musicRef.current.play().catch(() => {});
        }
      } else {
        if (musicRef.current) musicRef.current.pause();
        if (instrumentalRef.current) instrumentalRef.current.pause();
      }
      return next;
    });
  }, [globalVolume]);

  // Keep both tracks at the chosen volume whenever the slider/mute changes.
  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = globalVolume;
    if (instrumentalRef.current) instrumentalRef.current.volume = globalVolume;
  }, [globalVolume]);

  // When the vocal track ends, hand off to the looping instrumental — at the
  // CURRENT volume (respects mute), never a forced 80% blast.
  const handleMainSongEnd = useCallback(() => {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }
    if (musicOn && instrumentalRef.current) {
      instrumentalRef.current.volume = globalVolume;
      instrumentalRef.current.play().catch(() => {});
    }
  }, [globalVolume, musicOn]);

  const handleEnterSanctuary = () => setZone("sanctuary");
  const handleExitToGate = () => setZone("battlefield");

  const isMuted = globalVolume === 0;

  return (
    <>
      {/* Global persistent audio — never unmounts on navigation */}
      <audio
        ref={musicRef}
        src="/audio/warning-in-the-dark.mp3"
        preload="auto"
        onEnded={handleMainSongEnd}
      />
      <audio
        ref={instrumentalRef}
        src="/audio/warning-in-the-dark-instrumental.flac"
        preload="auto"
        loop
      />

      {/* Always-visible music control — tucked bottom-right so it never covers content. */}
      <div
        className="fixed bottom-4 right-4 z-[9998] flex items-center gap-2 px-3 py-2 rounded-full border"
        style={{
          background: 'hsla(0, 0%, 0%, 0.82)',
          backdropFilter: 'blur(8px)',
          borderColor: 'hsl(45 60% 40% / 0.4)',
          pointerEvents: 'auto',
        }}
      >
        {/* Big, obvious ON/OFF toggle */}
        <button
          onClick={toggleMusic}
          className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-white/10 transition-colors"
          title={musicOn ? "Turn music off" : "Turn music on"}
        >
          <Music className="w-4 h-4" style={{ color: musicOn ? 'hsl(45 80% 55%)' : 'hsl(0 0% 55%)' }} />
          <span className="font-terminal text-[10px] tracking-wide" style={{ color: musicOn ? 'hsl(45 80% 55%)' : 'hsl(0 0% 55%)' }}>
            {musicOn ? "MUSIC ON" : "MUSIC OFF"}
          </span>
        </button>

        {musicOn && (
          <>
            {/* Mute / Unmute */}
            <button
              onClick={() => {
                if (globalVolume > 0) {
                  setPrevVolume(globalVolume);
                  setGlobalVolume(0);
                } else {
                  setGlobalVolume(prevVolume || 0.25);
                }
              }}
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5" style={{ color: 'hsl(0 70% 55%)' }} />
              ) : (
                <Volume2 className="w-3.5 h-3.5" style={{ color: 'hsl(45 80% 55% / 0.7)' }} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(globalVolume * 100)}
              onChange={(e) => setGlobalVolume(Number(e.target.value) / 100)}
              className="volume-slider w-20 md:w-28 h-1.5 cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, hsl(45 80% 55%) ${globalVolume * 100}%, hsl(0 0% 20%) ${globalVolume * 100}%)`,
              }}
            />
            <span className="font-terminal text-[9px] w-7 text-center" style={{ color: 'hsl(45 80% 55% / 0.5)' }}>
              {Math.round(globalVolume * 100)}%
            </span>
          </>
        )}
      </div>

      {zone === "battlefield" ? (
        <BattlefieldLanding
          onEnterSanctuary={handleEnterSanctuary}
          musicRef={musicRef}
          startMusic={startMusic}
          musicStarted={musicOn}
        />
      ) : (
        <SanctuaryInterior
          onExit={handleExitToGate}
          musicRef={musicRef}
        />
      )}
    </>
  );
};

export default Index;
