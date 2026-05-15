import { useEffect, useState, useRef } from 'react';
import { VoiceProvider, useVoice } from '@humeai/voice-react';
import { Mic, MicOff, X, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import lionLogo from '@/assets/lion-logo.png';

interface EmpathicVoiceModeProps {
  open: boolean;
  onClose: () => void;
}

/* -------------------------------------------------------------- */
/*  Inner conversation surface (rendered inside <VoiceProvider/>) */
/* -------------------------------------------------------------- */
const VoiceConversation = ({ onClose }: { onClose: () => void }) => {
  const { connect, disconnect, status, messages, isMuted, mute, unmute, micFft } = useVoice();
  const [connecting, setConnecting] = useState(false);

  const handleStart = async () => {
    setConnecting(true);
    try {
      await connect();
    } catch (err) {
      console.error('Hume connect failed', err);
    } finally {
      setConnecting(false);
    }
  };

  const handleEnd = async () => {
    await disconnect();
    onClose();
  };

  // Auto-connect on open
  useEffect(() => {
    if (status.value === 'disconnected') {
      handleStart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isConnected = status.value === 'connected';
  const lastSpoken = [...messages]
    .reverse()
    .find((m) => m.type === 'user_message' || m.type === 'assistant_message');

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center px-6">
      {/* Lion sigil pulses when assistant speaks */}
      <div
        className={cn(
          'rounded-full overflow-hidden border-[3px] p-1 transition-transform duration-300',
          isConnected && 'animate-pulse'
        )}
        style={{
          width: 180,
          height: 180,
          borderColor: 'hsl(45 80% 50%)',
          background:
            'radial-gradient(circle, hsl(0 0% 100%) 0%, hsl(0 60% 40%) 60%, hsl(45 80% 50%) 100%)',
          boxShadow:
            '0 0 40px hsl(45 80% 50% / 0.5), 0 0 80px hsl(0 70% 50% / 0.4)',
        }}
      >
        <img
          src={lionLogo}
          alt="Lion of Judah"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      <h2
        className="font-ceremonial mt-6 tracking-widest text-2xl md:text-3xl"
        style={{ color: 'hsl(0 70% 50%)' }}
      >
        EMPATHIC VOICE MODE
      </h2>
      <p
        className="font-ceremonial text-xs mt-2 tracking-wider max-w-md"
        style={{ color: 'hsl(45 70% 60%)' }}
      >
        Speak. The Prophet will hear the weight in thy voice and answer in kind.
      </p>

      {/* Status */}
      <div className="mt-6 min-h-[28px]">
        {connecting && (
          <p className="font-terminal text-xs flex items-center gap-2" style={{ color: 'hsl(45 70% 55%)' }}>
            <Loader2 className="w-4 h-4 animate-spin" />
            OPENING THE CHANNEL...
          </p>
        )}
        {status.value === 'connected' && (
          <p className="font-terminal text-xs" style={{ color: 'hsl(120 50% 55%)' }}>
            ● LIVE — SPEAK FREELY
          </p>
        )}
        {status.value === 'error' && (
          <p className="font-terminal text-xs flex items-center gap-2" style={{ color: 'hsl(0 70% 60%)' }}>
            <AlertTriangle className="w-4 h-4" />
            CONNECTION FAILED
          </p>
        )}
      </div>

      {/* Last message preview */}
      {lastSpoken && 'message' in lastSpoken && lastSpoken.message?.content && (
        <div
          className="mt-6 max-w-xl p-4 rounded-lg border"
          style={{
            background: 'hsl(20 10% 15% / 0.7)',
            borderColor: 'hsl(0 50% 35% / 0.4)',
          }}
        >
          <p
            className="font-terminal text-[10px] uppercase tracking-widest mb-1"
            style={{
              color:
                lastSpoken.type === 'user_message'
                  ? 'hsl(45 70% 55%)'
                  : 'hsl(0 70% 55%)',
            }}
          >
            {lastSpoken.type === 'user_message' ? 'CHALLENGER' : 'PROPHET GAD'}
          </p>
          <p className="font-ceremonial text-sm" style={{ color: 'hsl(45 30% 85%)' }}>
            {lastSpoken.message.content}
          </p>
        </div>
      )}

      {/* Mic FFT visualizer */}
      <div className="mt-6 flex items-end gap-1 h-12">
        {(micFft || []).slice(0, 24).map((v: number, i: number) => (
          <div
            key={i}
            className="w-1 rounded-full transition-all duration-75"
            style={{
              height: `${Math.max(4, Math.min(48, v * 2))}px`,
              background: 'hsl(0 70% 50%)',
              opacity: 0.4 + Math.min(0.6, v / 100),
            }}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-4">
        {isConnected && (
          <button
            onClick={() => (isMuted ? unmute() : mute())}
            className="p-4 rounded-full border-2 transition-all"
            style={{
              borderColor: isMuted ? 'hsl(0 70% 50%)' : 'hsl(45 80% 50%)',
              background: isMuted ? 'hsl(0 70% 50% / 0.2)' : 'hsl(20 10% 15%)',
              color: isMuted ? 'hsl(0 70% 60%)' : 'hsl(45 80% 60%)',
            }}
            title={isMuted ? 'Unmute mic' : 'Mute mic'}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        )}

        <button
          onClick={handleEnd}
          className="px-6 py-3 rounded-lg border-2 font-terminal text-xs uppercase tracking-widest transition-all flex items-center gap-2"
          style={{
            borderColor: 'hsl(0 70% 45%)',
            background: 'hsl(0 70% 35%)',
            color: 'hsl(0 0% 95%)',
          }}
        >
          <X className="w-4 h-4" />
          End Conversation
        </button>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------- */
/*  Token-fetching wrapper                                        */
/* -------------------------------------------------------------- */
export const EmpathicVoiceMode = ({ open, onClose }: EmpathicVoiceModeProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setAccessToken(null);
      setError(null);
      fetchedRef.current = false;
      return;
    }
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/hume-token`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
          }
        );
        const data = await res.json();
        if (!data.success || !data.accessToken) {
          throw new Error(data.error || 'No token returned');
        }
        setAccessToken(data.accessToken);
      } catch (err) {
        console.error('Hume token fetch failed', err);
        setError(err instanceof Error ? err.message : 'Failed to authorize');
      }
    })();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse at center, hsl(15 10% 8% / 0.98) 0%, hsl(0 0% 0% / 0.99) 100%)',
      }}
    >
      {/* Close (always available) */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full border transition-all z-10"
        style={{
          borderColor: 'hsl(0 50% 35% / 0.5)',
          color: 'hsl(0 70% 55%)',
          background: 'hsl(20 10% 15% / 0.6)',
        }}
        title="Close voice mode"
      >
        <X className="w-5 h-5" />
      </button>

      {error && (
        <div className="text-center px-6">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(0 70% 55%)' }} />
          <p className="font-ceremonial text-sm" style={{ color: 'hsl(0 70% 60%)' }}>
            {error}
          </p>
          <button
            onClick={onClose}
            className="mt-4 font-terminal text-xs underline"
            style={{ color: 'hsl(45 70% 55%)' }}
          >
            CLOSE
          </button>
        </div>
      )}

      {!error && !accessToken && (
        <div className="text-center">
          <Loader2 className="w-10 h-10 mx-auto mb-3 animate-spin" style={{ color: 'hsl(45 80% 55%)' }} />
          <p className="font-terminal text-xs tracking-widest" style={{ color: 'hsl(45 70% 55%)' }}>
            AUTHORIZING THE CHANNEL...
          </p>
        </div>
      )}

      {accessToken && (
        <VoiceProvider auth={{ type: 'accessToken', value: accessToken }}>
          <VoiceConversation onClose={onClose} />
        </VoiceProvider>
      )}
    </div>
  );
};
