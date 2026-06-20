import { useState, useRef } from 'react';
import { Volume2, Square, Play, User, Shield, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage as ChatMessageType } from '@/hooks/useDoctrinalChat';

interface ChatMessageProps {
  message: ChatMessageType;
  isPlaying?: boolean;
  onPlayVoice?: () => void;
  onStopVoice?: () => void;
  voiceEnabled?: boolean;
}

export const ChatMessage = ({
  message,
  isPlaying = false,
  onPlayVoice,
  onStopVoice,
  voiceEnabled = true,
}: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const messageRef = useRef<HTMLDivElement>(null);

  const formatContent = (content: string) => {
    const versePattern = /(\d?\s?[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\s\d+:\d+(?:-\d+)?)/g;
    const parts = content.split(versePattern);
    
    return parts.map((part, index) => {
      if (versePattern.test(part)) {
        return (
          <span 
            key={index} 
            className="text-sanctuary-gold font-bold cursor-help"
            title="KJV Scripture Reference"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isUser) return;
    e.preventDefault();
    const rect = messageRef.current?.getBoundingClientRect();
    if (rect) {
      setMenuPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    setShowContextMenu(true);
  };

  const handlePrintMessage = () => {
    setShowContextMenu(false);
    const header = `═══════════════════════════════════════\n   PROPHETIC DECREE\n   Law-Keeper Assembly Protocol\n═══════════════════════════════════════\n\n`;
    const body = `[PGAI] ${message.timestamp.toLocaleString()}\n\n${message.content}`;
    const footer = `\n\n═══════════════════════════════════════\n   SEALED BY THE 12-GEMSTONE BREASTPLATE\n═══════════════════════════════════════`;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Prophetic Decree</title>
            <style>
              body { font-family: 'Georgia', serif; padding: 40px; background: #0a0a0a; color: #d4a843; }
              pre { white-space: pre-wrap; word-wrap: break-word; font-family: 'Georgia', serif; font-size: 14px; line-height: 1.8; }
              h1 { text-align: center; letter-spacing: 4px; border-bottom: 2px solid #d4a843; padding-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>⚔️ PROPHETIC DECREE ⚔️</h1>
            <pre>${header}${body}${footer}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div
      ref={messageRef}
      className={cn(
        'relative flex gap-3 p-4 rounded-lg transition-all',
        isUser
          ? 'bg-white/5 border border-white/10'
          : 'bg-sanctuary-gold/5 border border-sanctuary-gold/20',
        isPlaying && 'ring-2 ring-sanctuary-gold/50'
      )}
      onContextMenu={handleContextMenu}
      onClick={() => showContextMenu && setShowContextMenu(false)}
    >
      {/* Context Menu */}
      {showContextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowContextMenu(false)} />
          <div
            className="absolute z-50 bg-black/95 border border-sanctuary-gold/40 rounded-lg shadow-xl py-1 min-w-[180px]"
            style={{ left: menuPos.x, top: menuPos.y }}
          >
            <button
              onClick={handlePrintMessage}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-left font-terminal text-xs text-sanctuary-gold hover:bg-sanctuary-gold/10 transition-colors"
            >
              <Printer className="w-4 h-4" />
              PRINT TO PDF
            </button>
            {voiceEnabled && (
              <button
                onClick={() => { setShowContextMenu(false); isPlaying ? onStopVoice?.() : onPlayVoice?.(); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left font-terminal text-xs text-sanctuary-gold hover:bg-sanctuary-gold/10 transition-colors"
              >
                {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'STOP AUDIO' : 'PLAY AUDIO'}
              </button>
            )}
          </div>
        </>
      )}

      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          isUser
            ? 'bg-white/10 text-white/70'
            : 'bg-sanctuary-gold/20 text-sanctuary-gold'
        )}
      >
        {isUser ? <User className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-terminal text-xs text-sanctuary-gold/60 uppercase tracking-wider">
            {isUser ? 'CHALLENGER' : 'PROPHET GAD AI'}
          </span>
          <span className="font-terminal text-xs text-sanctuary-gold/30">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          {/* Audio Controls — prominent for AI messages */}
          {!isUser && voiceEnabled && (
            <div className="ml-auto flex items-center gap-1">
              {isPlaying ? (
                <button
                  onClick={onStopVoice}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-600/80 hover:bg-red-500 text-white transition-all font-terminal text-[10px] uppercase tracking-wider"
                  title="Stop audio"
                >
                  <Square className="w-3 h-3" />
                  STOP
                </button>
              ) : (
                <button
                  onClick={onPlayVoice}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sanctuary-gold/20 hover:bg-sanctuary-gold/30 text-sanctuary-gold border border-sanctuary-gold/30 transition-all font-terminal text-[10px] uppercase tracking-wider"
                  title="Play response"
                >
                  <Play className="w-3 h-3" />
                  HEAR PROPHECY
                </button>
              )}
            </div>
          )}
        </div>

        <div
          className={cn(
            'font-ceremonial text-sm leading-relaxed whitespace-pre-wrap',
            isUser ? 'text-white/80' : 'text-sanctuary-gold/90',
            isPlaying && 'war-room-text-glow'
          )}
        >
          {isUser ? message.content : formatContent(message.content)}
        </div>

        {isPlaying && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-sanctuary-gold rounded-full animate-pulse"
                  style={{
                    height: `${8 + Math.random() * 12}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <span className="font-terminal text-xs text-sanctuary-gold">
              VOICE ACTIVE
            </span>
          </div>
        )}

        {/* Right-click hint for AI messages */}
        {!isUser && (
          <p className="mt-2 font-terminal text-[9px] text-sanctuary-gold/25 select-none">
            RIGHT-CLICK FOR OPTIONS
          </p>
        )}
      </div>
    </div>
  );
};
