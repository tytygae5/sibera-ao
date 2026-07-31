import React, { useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { Attachment } from '../types';
import {
  Send,
  Paperclip,
  Radar,
  Sparkles,
  StopCircle,
  X,
  FileText,
} from 'lucide-react';

export const ChatInput: React.FC = () => {
  const { sendMessage, isStreaming, stopStreaming, setIsFileUploadOpen } = useChat();
  const [prompt, setPrompt] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isStreaming) return;

    const currentPrompt = prompt;
    const currentAttachments = [...attachments];
    setPrompt('');
    setAttachments([]);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    await sendMessage(currentPrompt, currentAttachments);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="border-t border-[#1C1C1F] bg-[#0A0A0B] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Attachments pills if any */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#18181B] border border-[#27272A] text-xs text-gray-300"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate max-w-[150px]">{att.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    setAttachments(attachments.filter((a) => a.id !== att.id))
                  }
                  className="text-gray-500 hover:text-gray-300 ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <div className="flex-1 relative rounded-xl bg-[#141417] border border-[#27272A] focus-within:border-emerald-500/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Digite seu comando para o AI Radar (ou Enter para enviar)..."
              className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-500 px-4 py-3 pr-12 resize-none focus:outline-none max-h-40"
            />

            <button
              type="button"
              onClick={() => setIsFileUploadOpen(true)}
              className="absolute right-3 bottom-2.5 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E22] transition-colors"
              title="Anexar arquivos ou dados ao projeto"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>

          {isStreaming ? (
            <button
              type="button"
              onClick={stopStreaming}
              className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors shrink-0 flex items-center justify-center"
              title="Interromper geração"
            >
              <StopCircle className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!prompt.trim()}
              className={`p-3 rounded-xl font-medium transition-colors shrink-0 flex items-center justify-center ${
                prompt.trim()
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-sm'
                  : 'bg-[#18181B] text-gray-600 border border-[#27272A] cursor-not-allowed'
              }`}
              title="Enviar comando"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 px-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Execução multicanal agêntica integrada</span>
          </div>
          <span>Shift + Enter para nova linha</span>
        </div>
      </div>
    </div>
  );
};
