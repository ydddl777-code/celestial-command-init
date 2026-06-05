import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Track {
  name: string;       // raw filename
  title: string;      // pretty name
  path: string;       // path inside bucket
}

interface MusicPlayerState {
  tracks: Track[];
  currentIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;     // 0..1
  duration: number;
  currentTime: number;
  volume: number;
  loading: boolean;
  error: string | null;
  loadTracks: () => Promise<void>;
  playIndex: (i: number) => Promise<void>;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (frac: number) => void;
  setVolume: (v: number) => void;
}

const Ctx = createContext<MusicPlayerState | null>(null);

const prettify = (filename: string) =>
  filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (!audioRef.current && typeof window !== "undefined") {
    audioRef.current = new Audio();
    audioRef.current.preload = "auto";
  }
  const audio = audioRef.current!;

  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd = () => {
      setIsPlaying(false);
      setCurrentIndex((i) => {
        const ni = i + 1;
        if (ni < tracks.length) {
          void playByIndex(ni);
          return ni;
        }
        return i;
      });
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.volume = volume;
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks.length]);

  const loadTracks = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.storage.from("music").list("", {
      limit: 200,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const audioFiles = (data || []).filter((f) =>
      /\.(mp3|wav|flac|m4a|ogg|aac)$/i.test(f.name)
    );
    setTracks(
      audioFiles.map((f) => ({
        name: f.name,
        title: prettify(f.name),
        path: f.name,
      }))
    );
    setLoading(false);
  }, []);

  const playByIndex = useCallback(
    async (i: number) => {
      if (i < 0 || i >= tracks.length) return;
      const t = tracks[i];
      const { data, error } = await supabase.storage
        .from("music")
        .createSignedUrl(t.path, 60 * 60);
      if (error || !data?.signedUrl) {
        setError(error?.message ?? "Could not load track");
        return;
      }
      audio.src = data.signedUrl;
      audio.volume = volume;
      setCurrentIndex(i);
      try {
        await audio.play();
      } catch {
        /* autoplay block */
      }
    },
    [tracks, audio, volume]
  );

  const togglePlay = useCallback(() => {
    if (!audio.src && tracks.length > 0) {
      void playByIndex(0);
      return;
    }
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, [audio, tracks.length, playByIndex]);

  const next = useCallback(() => {
    if (currentIndex < tracks.length - 1) void playByIndex(currentIndex + 1);
  }, [currentIndex, tracks.length, playByIndex]);

  const prev = useCallback(() => {
    if (currentIndex > 0) void playByIndex(currentIndex - 1);
    else if (audio) audio.currentTime = 0;
  }, [currentIndex, audio, playByIndex]);

  const seek = useCallback(
    (frac: number) => {
      if (audio.duration) audio.currentTime = frac * audio.duration;
    },
    [audio]
  );

  const setVolume = useCallback(
    (v: number) => {
      setVolumeState(v);
      audio.volume = v;
    },
    [audio]
  );

  const currentTrack = currentIndex >= 0 ? tracks[currentIndex] ?? null : null;
  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <Ctx.Provider
      value={{
        tracks,
        currentIndex,
        currentTrack,
        isPlaying,
        progress,
        duration,
        currentTime,
        volume,
        loading,
        error,
        loadTracks,
        playIndex: playByIndex,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useMusicPlayer = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  return c;
};
