import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Music as MusicIcon, Play, Pause, Loader2 } from "lucide-react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

const Music = () => {
  const {
    tracks,
    currentIndex,
    isPlaying,
    loading,
    error,
    loadTracks,
    playIndex,
    togglePlay,
  } = useMusicPlayer();

  useEffect(() => {
    document.title = "Music — Prophet Gad | The Threshing Floor";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "Prophetic music from Prophet Gad — stream tracks from the sanctuary vault.");
    if (tracks.length === 0 && !loading) void loadTracks();
  }, [loadTracks, tracks.length, loading]);

  return (
    <main
      className="min-h-screen pb-32"
      style={{
        background:
          "radial-gradient(ellipse at top, hsl(0 40% 12%) 0%, hsl(0 0% 4%) 60%, hsl(0 0% 2%) 100%)",
      }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-4 border-b"
        style={{
          background: "hsl(0 0% 6% / 0.95)",
          backdropFilter: "blur(12px)",
          borderColor: "hsl(0 50% 35% / 0.3)",
        }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase hover:opacity-80"
          style={{ color: "hsl(45 80% 60%)" }}
          aria-label="Return to The Threshing Floor home"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </Link>
        <div className="text-center">
          <h1
            className="text-xl md:text-2xl font-black tracking-[0.2em] uppercase"
            style={{ color: "hsl(0 70% 55%)", textShadow: "0 0 14px hsl(0 70% 40% / 0.5)" }}
          >
            The Vault
          </h1>
          <p className="text-[10px] tracking-widest uppercase" style={{ color: "hsl(45 60% 50% / 0.7)" }}>
            Prophet Gad Music
          </p>
        </div>
        <div className="w-16" />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        {loading && (
          <div className="flex items-center justify-center py-20" style={{ color: "hsl(45 80% 60%)" }}>
            <Loader2 className="w-6 h-6 animate-spin mr-3" />
            <span className="tracking-widest text-sm uppercase">Summoning the vault…</span>
          </div>
        )}

        {error && (
          <div
            className="my-6 p-4 rounded border text-sm"
            style={{
              borderColor: "hsl(0 70% 50%)",
              background: "hsl(0 50% 15% / 0.4)",
              color: "hsl(0 0% 90%)",
            }}
          >
            Could not load tracks: {error}
          </div>
        )}

        {!loading && !error && tracks.length === 0 && (
          <div
            className="text-center py-20 rounded-lg border-2 border-dashed"
            style={{
              borderColor: "hsl(45 60% 40% / 0.4)",
              color: "hsl(0 0% 70%)",
            }}
          >
            <MusicIcon className="w-12 h-12 mx-auto mb-4" style={{ color: "hsl(45 80% 55% / 0.7)" }} />
            <p className="font-bold tracking-wider uppercase text-sm">The Vault is Silent</p>
            <p className="text-xs mt-2 max-w-md mx-auto" style={{ color: "hsl(0 0% 55%)" }}>
              No tracks found in the music bucket. Upload audio files to the <code>music</code> bucket in your backend to populate the vault.
            </p>
          </div>
        )}

        <ul className="space-y-2">
          {tracks.map((t, i) => {
            const active = i === currentIndex;
            const playingThis = active && isPlaying;
            return (
              <li key={t.path}>
                <button
                  onClick={() => (active ? togglePlay() : playIndex(i))}
                  className="w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg border transition-all text-left group"
                  style={{
                    borderColor: active ? "hsl(0 70% 50%)" : "hsl(45 60% 40% / 0.2)",
                    background: active
                      ? "linear-gradient(90deg, hsl(0 60% 18% / 0.6), hsl(0 0% 8% / 0.6))"
                      : "hsl(0 0% 7% / 0.5)",
                  }}
                >
                  <div
                    className="w-10 sm:w-12 text-center font-mono text-sm shrink-0"
                    style={{ color: active ? "hsl(45 90% 65%)" : "hsl(0 0% 50%)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded flex items-center justify-center shrink-0 border"
                    style={{
                      background: "linear-gradient(135deg, hsl(0 60% 22%), hsl(0 0% 8%))",
                      borderColor: active ? "hsl(0 70% 50%)" : "hsl(45 60% 40% / 0.4)",
                    }}
                  >
                    {playingThis ? (
                      <Pause className="w-4 h-4" style={{ color: "hsl(45 90% 65%)" }} />
                    ) : (
                      <Play className="w-4 h-4" style={{ color: "hsl(45 80% 60%)" }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className="font-bold text-sm sm:text-base truncate"
                      style={{ color: active ? "hsl(45 90% 70%)" : "hsl(0 0% 92%)" }}
                    >
                      {t.title}
                    </div>
                    <div
                      className="text-[10px] sm:text-xs uppercase tracking-widest truncate"
                      style={{ color: "hsl(0 0% 55%)" }}
                    >
                      Prophet Gad
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
};

export default Music;
