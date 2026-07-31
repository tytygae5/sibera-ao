import React from 'react';
import { Message } from '../types';
import { useChat } from '../context/ChatContext';
import {
  User,
  Radar,
  Copy,
  Check,
  Cpu,
  Clock,
  Sparkles,
  Terminal,
} from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isStreamingLast?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`py-4 px-4 sm:px-6 transition-colors ${
        isUser ? 'bg-transparent' : 'bg-[#121215] border-y border-[#1C1C1F]'
      }`}
    >
      <div className="max-w-4xl mx-auto flex gap-3 sm:gap-4">
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
            isUser
              ? 'bg-[#27272A] text-gray-300'
              : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Radar className="w-4 h-4" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-300">
                {isUser ? 'Você' : 'AI Radar OS'}
              </span>
              {!isUser && message.intent && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#1C1C1F] text-emerald-400 border border-emerald-500/20 font-mono">
                  {message.intent}
                </span>
              )}
              {!isUser && message.executionTimeMs && (
                <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {message.executionTimeMs}ms
                </span>
              )}
            </div>

            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-[#1E1E22] text-gray-500 hover:text-gray-300 transition-colors"
              title="Copiar mensagem"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Message Text */}
          <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap break-words font-sans">
            {message.content}
          </div>

          {/* Pipeline Events summary badge if present */}
          {!isUser && message.events && message.events.length > 0 && (
            <div className="mt-3 pt-2 border-t border-[#1C1C1F] flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-emerald-400" />
                Pipeline: {message.events.length} etapas executadas
              </span>
              {message.agentsUsed && message.agentsUsed.map((agent, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-[#18181B] text-gray-400 px-1.5 py-0.5 rounded border border-[#27272A]"
                >
                  {agent}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
