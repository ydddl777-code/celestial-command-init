import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Send, Trash2, Volume2, VolumeX, Swords, AlertTriangle, Download, FileAudio, Save, Maximize2, Minimize2, Mic } from 'lucide-react';
import { useDoctrinalChat } from '@/hooks/useDoctrinalChat';
import { ChatMessage } from './ChatMessage';
import { VoiceInput } from './VoiceInput';
import { EmpathicVoiceMode } from './EmpathicVoiceMode';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import lionLogo from '@/assets/lion-logo.png';

interface DoctrinalWarfareProps {
  defaultVoiceId?: string;
}

export const DoctrinalWarfare = ({ defaultVoiceId }: DoctrinalWarfareProps) => {
  const [inputText, setInputText] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [voiceModeOpen, setVoiceModeOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    error,
    currentlyPlayingId,
    sendMessage,
    generateVoice,
    stopAudio,
    clearMessages,
  } = useDoctrinalChat({
    voiceEnabled,
    voiceId: defaultVoiceId,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      sendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleVoiceTranscript = (text: string) => {
    if (text && !isLoading) {
      sendMessage(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDownloadPDF = () => {
    if (messages.length === 0) return;
    const transcript = messages.map(m => 
      `[${m.role === 'user' ? 'CHALLENGER' : 'PROPHET GAD AI'}] ${m.timestamp.toLocaleString()}\n${m.content}\n`
    ).join('\n---\n\n');
    
    const header = `═══════════════════════════════════════\n   PROPHETIC DECREE — RECORD OF ENGAGEMENT\n   The Thunderdome\n═══════════════════════════════════════\n\n`;
    const footer = `\n\n═══════════════════════════════════════\n   SEALED BY THE 12-GEMSTONE BREASTPLATE\n   The Truth Does Not Negotiate\n═══════════════════════════════════════`;
    
    const blob = new Blob([header + transcript + footer], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prophetic-decree-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAudio = () => {
    const lastAiMsg = [...messages].reverse().find(m => m.role === 'assistant');
    if (lastAiMsg) {
      generateVoice(lastAiMsg.content, lastAiMsg.id);
    }
  };

  const handleSaveToVault = () => {
    const sessionData = {
      timestamp: new Date().toISOString(),
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp.toISOString(),
      })),
    };
    const existing = JSON.parse(localStorage.getItem('pgai-vault') || '[]');
    existing.push(sessionData);
    localStorage.setItem('pgai-vault', JSON.stringify(existing));
    alert('Session sealed to the Vault.');
  };

  const content = (
    <div className={cn(
      "flex flex-col border-2 overflow-hidden relative",
      isFullScreen
        ? "fixed inset-0 z-[100] rounded-none"
        : "rounded-lg"
    )}
      style={{ 
        minHeight: isFullScreen ? '100vh' : '700px',
        background: 'linear-gradient(180deg, hsl(20 12% 12%) 0%, hsl(15 10% 8%) 100%)',
        borderColor: 'hsl(0 50% 35% / 0.5)',
      }}
    >
      {/* Thunderdome Arena Background — full-screen only */}
      {isFullScreen && (
        <>
          <div className="fixed inset-0 z-0 pointer-events-none" style={{
            background: `
              radial-gradient(ellipse 40% 35% at 50% 0%, hsl(0 70% 50% / 0.15) 0%, transparent 100%),
              radial-gradient(circle at 50% 50%, hsl(0 70% 50% / 0.06) 0%, transparent 60%),
              radial-gradient(circle at 50% 50%, hsl(0 0% 0% / 0.95) 0%, hsl(0 0% 0% / 1) 100%)
            `
          }} />
          {/* Thunderdome ring outline */}
          <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center">
            <div className="relative" style={{
              width: 'min(85vw, 85vh)',
              height: 'min(85vw, 85vh)',
            }}>
              <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0">
                <polygon
                  points="29.3,4 70.7,4 96,29.3 96,70.7 70.7,96 29.3,96 4,70.7 4,29.3"
                  fill="none"
                  stroke="hsl(0 70% 45%)"
                  strokeWidth="0.4"
                  opacity="0.35"
                />
                <polygon
                  points="32,8 68,8 92,32 92,68 68,92 32,92 8,68 8,32"
                  fill="none"
                  stroke="hsl(0 70% 45%)"
                  strokeWidth="0.2"
                  opacity="0.15"
                />
                <circle cx="50" cy="50" r="18" fill="hsl(0 0% 100% / 0.03)" stroke="hsl(0 70% 45%)" strokeWidth="0.15" opacity="0.4" />
              </svg>
            </div>
          </div>
          {[
            'top-8 left-8', 'top-8 right-8', 'bottom-8 left-8', 'bottom-8 right-8',
          ].map((pos, i) => (
            <div key={i} className={`fixed ${pos} z-0 w-3 h-3 rounded-full`} style={{ background: 'hsl(0 70% 45% / 0.3)', boxShadow: '0 0 12px hsl(0 70% 45% / 0.4)' }} />
          ))}
        </>
      )}

      {/* Lion of Judah Header */}
      <div className={cn(
        "flex flex-col items-center pt-6 pb-4 border-b-2 relative z-10",
        isFullScreen && "from-black/70 to-transparent"
      )} style={{
        borderColor: 'hsl(0 50% 35% / 0.4)',
        background: 'linear-gradient(180deg, hsl(15 15% 15%) 0%, hsl(15 10% 10%) 100%)',
      }}>
        <div className={cn(
          "rounded-full overflow-hidden border-[3px] p-1",
          isFullScreen ? "w-24 h-24" : "w-36 h-36 md:w-40 md:h-40"
        )} style={{
          borderColor: 'hsl(45 80% 50%)',
          background: 'radial-gradient(circle, hsl(0 0% 100%) 0%, hsl(0 60% 40%) 60%, hsl(45 80% 50%) 100%)',
          boxShadow: '0 0 25px hsl(45 80% 50% / 0.3), 0 0 50px hsl(0 70% 50% / 0.2)',
        }}>
          <img src={lionLogo} alt="Lion of Judah" className="w-full h-full object-cover rounded-full drop-shadow-[0_0_20px_hsl(0,70%,50%,0.5)]" />
        </div>
        <h2 className={cn(
          "font-ceremonial mt-3 tracking-widest text-center",
          isFullScreen ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"
        )} style={{ color: 'hsl(0 70% 50%)' }}>
          DOCTRINAL WARFARE
        </h2>
        <p className="font-ceremonial text-sm mt-1 tracking-wider text-center max-w-md px-4"
          style={{ color: 'hsl(45 80% 55%)' }}>
          ENTER THE THRESHING FLOOR
        </p>
        <p className="font-ceremonial text-xs mt-1 tracking-wider text-center max-w-md px-4"
          style={{ color: 'hsl(0 50% 40% / 0.7)' }}>
          The Truth Does Not Negotiate
        </p>
      </div>

      {/* Controls Bar — simplified */}
      <div className="flex items-center justify-between px-4 py-2 border-b relative z-10" style={{ borderColor: 'hsl(0 50% 35% / 0.3)', background: 'hsl(18 12% 13%)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 transition-colors"
            style={{ color: 'hsl(0 70% 50% / 0.7)' }}
            title={isFullScreen ? "Exit full screen" : "Enter full screen"}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {voiceEnabled ? (
              <Volume2 className="w-4 h-4" style={{ color: 'hsl(0 70% 50%)' }} />
            ) : (
              <VolumeX className="w-4 h-4" style={{ color: 'hsl(0 70% 50% / 0.4)' }} />
            )}
            <Switch
              checked={voiceEnabled}
              onCheckedChange={setVoiceEnabled}
              className="data-[state=checked]:bg-red-700"
            />
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="p-1.5 text-red-500/50 hover:text-red-500 transition-colors"
              title="Clear engagement"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* War Room Scroll — Messages Area */}
      <div className={cn(
        "flex-1 overflow-y-auto p-4 md:p-6 space-y-4 relative z-10",
        isFullScreen && "max-w-4xl mx-auto w-full"
      )} style={{ maxHeight: isFullScreen ? 'none' : '400px' }}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 mx-auto">
            <img src={lionLogo} alt="Lion of Judah" className="w-20 h-20 md:w-24 md:h-24 mb-4 rounded-full mx-auto block" style={{ boxShadow: '0 0 30px hsl(45 80% 50% / 0.4)' }} />
            <h4 className="font-ceremonial text-lg mb-2" style={{ color: 'hsl(45 70% 55%)' }}>
              THE THRESHING FLOOR AWAITS
            </h4>
            <p className="font-ceremonial text-sm max-w-sm" style={{ color: 'hsl(30 20% 60%)' }}>
              Challenge doctrine. Question tradition. The Prophet responds with
              Scripture — no soft answers, no compromise.
            </p>
            <div className="mt-4 p-3 border rounded-lg max-w-md"
              style={{ background: 'hsl(25 20% 18%)', borderColor: 'hsl(45 50% 45% / 0.4)' }}>
              <p className="font-ceremonial text-sm" style={{ color: 'hsl(45 70% 60%)' }}>
                ✦ TRY: "Why don't you believe the Trinity?"
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isPlaying={currentlyPlayingId === message.id}
              onPlayVoice={() => generateVoice(message.content, message.id)}
              onStopVoice={stopAudio}
              voiceEnabled={voiceEnabled}
            />
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-lg"
            style={{ background: 'hsl(0 70% 50% / 0.05)', border: '1px solid hsl(0 70% 50% / 0.2)' }}>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: 'hsl(0 70% 50%)', animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="font-terminal text-xs" style={{ color: 'hsl(0 70% 50%)' }}>
              THE PROPHET IS RESPONDING...
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="font-terminal text-xs text-red-400">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t-2 space-y-3" style={{ borderColor: 'hsl(0 50% 35% / 0.3)', background: 'hsl(20 12% 14%)' }}>
        <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Challenge doctrine, question tradition..."
            disabled={isLoading}
            className={cn(
              'flex-1 min-h-[60px] max-h-[120px] resize-none',
              'font-ceremonial text-sm'
            )}
            style={{
              borderColor: 'hsl(0 50% 40% / 0.5)',
              color: 'hsl(45 30% 85%)',
              background: 'hsl(20 10% 18%)',
              caretColor: 'hsl(45 80% 60%)',
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={cn(
              'px-4 py-2 rounded-lg transition-all flex items-center justify-center',
              'font-terminal text-sm uppercase',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            style={{
              background: 'hsl(0 70% 40%)',
              color: 'hsl(0 0% 95%)',
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <p className="font-terminal text-xs text-center" style={{ color: 'hsl(45 30% 55%)' }}>
          TYPE YOUR CHALLENGE BELOW • PRESS ENTER TO SEND • SHIFT+ENTER FOR NEW LINE
        </p>
      </div>

      {/* Export Suite */}
      {messages.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-3 border-t-2 border-red-800/20 bg-black/80">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded border font-terminal text-xs uppercase transition-all"
            style={{ borderColor: 'hsl(0 70% 45% / 0.5)', background: 'hsl(0 70% 45% / 0.1)', color: 'hsl(0 70% 55%)' }}
          >
            <Download className="w-4 h-4" />
            Download Decree
          </button>
          <button
            onClick={handleExportAudio}
            className="flex items-center gap-2 px-4 py-2 rounded border font-terminal text-xs uppercase transition-all"
            style={{ borderColor: 'hsl(0 70% 45% / 0.5)', background: 'hsl(0 70% 45% / 0.1)', color: 'hsl(0 70% 55%)' }}
          >
            <FileAudio className="w-4 h-4" />
            Export Audio
          </button>
          <button
            onClick={handleSaveToVault}
            className="flex items-center gap-2 px-4 py-2 rounded border font-terminal text-xs uppercase transition-all"
            style={{ borderColor: 'hsl(0 70% 45% / 0.5)', background: 'hsl(0 70% 45% / 0.1)', color: 'hsl(0 70% 55%)' }}
          >
            <Save className="w-4 h-4" />
            Save to Vault
          </button>
        </div>
      )}
    </div>
  );

  if (isFullScreen) {
    return (
      <>
        <div className="rounded-lg border-2 border-red-800/40 war-room-bg p-8 text-center" style={{ minHeight: '700px' }}>
          <Swords className="w-10 h-10 mx-auto mb-3" style={{ color: 'hsl(0 70% 50% / 0.3)' }} />
          <p className="font-ceremonial text-sm" style={{ color: 'hsl(0 50% 40% / 0.6)' }}>THUNDERDOME IS IN FULL-SCREEN MODE</p>
          <button onClick={() => setIsFullScreen(false)} className="mt-4 font-terminal text-xs transition-colors" style={{ color: 'hsl(0 50% 40% / 0.5)' }}>
            [ EXIT FULL SCREEN ]
          </button>
        </div>
        {createPortal(content, document.body)}
      </>
    );
  }

  return content;
};