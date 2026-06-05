import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music as MusicIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

const fmt = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
};

export const PersistentPlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    next,
    prev,
    progress,
    duration,
    currentTime,
    seek,
    volume,
    setVolume,
  } = useMusicPlayer();
  const location = useLocation();

  if (!currentTrack) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9999] border-t"
      style={{
        background: "hsl(0 0% 6% / 0.96)",
        backdropFilter: "blur(16px)",
        borderColor: "hsl(0 50% 35% / 0.4)",
      }}
    >
      {/* Progress bar */}
      <input
        type="range"
        min={0}
        max={1000}
        value={Math.round(progress * 1000)}
        onChange={(e) => seek(Number(e.target.value) / 1000)}
        className="w-full h-1 appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, hsl(0 70% 50%) ${progress * 100}%, hsl(0 0% 18%) ${progress * 100}%)`,
        }}
        aria-label="Seek track"
      />

      <div className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-2">
        {/* Album art + title */}
        <Link
          to="/music"
          className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity"
        >
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded flex items-center justify-center shrink-0 border"
            style={{
              background: "linear-gradient(135deg, hsl(0 60% 25%), hsl(0 0% 8%))",
              borderColor: "hsl(45 60% 40% / 0.5)",
            }}
          >
            <MusicIcon className="w-5 h-5" style={{ color: "hsl(45 80% 55%)" }} />
          </div>
          <div className="min-w-0">
            <div
              className="font-bold text-sm truncate"
              style={{ color: "hsl(45 80% 60%)" }}
            >
              {currentTrack.title}
            </div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider truncate" style={{ color: "hsl(0 0% 65%)" }}>
              Prophet Gad
            </div>
          </div>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={prev}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Previous track"
          >
            <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "hsl(45 80% 60%)" }} />
          </button>
          <button
            onClick={togglePlay}
            className="p-2 sm:p-2.5 rounded-full border transition-colors"
            style={{
              borderColor: "hsl(0 70% 50%)",
              background: "hsl(0 60% 20%)",
            }}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "hsl(45 90% 65%)" }} />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "hsl(45 90% 65%)" }} />
            )}
          </button>
          <button
            onClick={next}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Next track"
          >
            <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "hsl(45 80% 60%)" }} />
          </button>
        </div>

        {/* Time */}
        <div
          className="hidden sm:block font-mono text-[11px] tabular-nums shrink-0"
          style={{ color: "hsl(0 0% 65%)" }}
        >
          {fmt(currentTime)} / {fmt(duration)}
        </div>

        {/* Volume — desktop only */}
        <div className="hidden md:flex items-center gap-2 shrink-0 w-32">
          <button
            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
            className="p-1.5 rounded-full hover:bg-white/10"
            aria-label={volume > 0 ? "Mute" : "Unmute"}
          >
            {volume > 0 ? (
              <Volume2 className="w-4 h-4" style={{ color: "hsl(45 80% 60%)" }} />
            ) : (
              <VolumeX className="w-4 h-4" style={{ color: "hsl(0 70% 55%)" }} />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(e) => setVolume(Number(e.target.value) / 100)}
            className="w-full h-1 appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, hsl(45 80% 55%) ${volume * 100}%, hsl(0 0% 18%) ${volume * 100}%)`,
            }}
            aria-label="Volume"
          />
        </div>

        {/* Open full player */}
        {location.pathname !== "/music" && (
          <Link
            to="/music"
            className="hidden sm:inline-block font-bold text-[10px] tracking-widest uppercase px-3 py-1.5 rounded border shrink-0 hover:bg-white/5 transition-colors"
            style={{
              color: "hsl(45 80% 60%)",
              borderColor: "hsl(45 60% 40% / 0.5)",
            }}
          >
            Open
          </Link>
        )}
      </div>
    </div>
  );
};
