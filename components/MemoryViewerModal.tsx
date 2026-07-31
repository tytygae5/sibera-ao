import React from 'react';
import { useChat } from '../context/ChatContext';
import { Brain, X, Database, CheckCircle, Trash2, Sparkles } from 'lucide-react';

export const MemoryViewerModal: React.FC = () => {
  const { isMemoryViewerOpen, setIsMemoryViewerOpen } = useChat();

  if (!isMemoryViewerOpen) return null;

  const facts = [
    {
      id: 'fact-1',
      category: 'arquitetura',
      fact: 'AI Radar possui 4 agentes autônomos e 4 ferramentas nativas.',
      confidence: 0.99,
    },
    {
      id: 'fact-2',
      category: 'preferência-usuário',
      fact: 'O usuário prefere respostas em português, estruturadas com markdown limpo.',
      confidence: 0.95,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0F0F12] border border-[#27272A] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="h-14 px-6 border-b border-[#1C1C1F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Visualizador de Memória (Memory Viewer)
            </h3>
          </div>
          <button
            onClick={() => setIsMemoryViewerOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E22] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Persona Ativa no Sistema
            </h4>
            <div className="p-4 rounded-xl bg-[#141417] border border-[#27272A] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  AI Radar OS Professional v3.5
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                  Sessão Ativa
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Foco no fornecimento de análises estratégicas, criação de roteiros virais e orquestração ágil.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Fatos de Longo Prazo Memorizados
            </h4>
            <div className="space-y-2">
              {facts.map((f) => (
                <div
                  key={f.id}
                  className="p-3 rounded-xl bg-[#141417] border border-[#27272A] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase text-emerald-400 font-mono">
                        {f.category}
                      </span>
                      <p className="text-xs text-gray-200">{f.fact}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">
                    {(f.confidence * 100).toFixed(0)}% conf
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            A memória unificada persiste nas sessões para coerência do assistente.
          </span>
          <button
            onClick={() => setIsMemoryViewerOpen(false)}
            className="px-4 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-xs font-medium text-gray-200 border border-[#27272A] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
