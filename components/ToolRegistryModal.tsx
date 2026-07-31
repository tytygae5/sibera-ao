import React from 'react';
import { useChat } from '../context/ChatContext';
import { ToolDefinition, ToolResult } from '../types';
import { Wrench, X, CheckCircle, Shield, Cpu } from 'lucide-react';

export const ToolRegistryModal: React.FC = () => {
  const { isToolRegistryOpen, setIsToolRegistryOpen } = useChat();

  if (!isToolRegistryOpen) return null;

  const tools: ToolDefinition[] = [
    {
      id: 'web-search-radar',
      name: 'Radar Web Search Engine',
      agent: 'Research Agent',
      description: 'Busca em tempo real por insights, tendências de mercado e notícias.',
      category: 'research',
      permissionLevel: 'public',
    },
    {
      id: 'content-script-generator',
      name: 'Viral Script & Copy Builder',
      agent: 'Content Agent',
      description: 'Cria roteiros para Reels/Shorts e headlines com métricas estimadas.',
      category: 'content',
      permissionLevel: 'public',
    },
    {
      id: 'market-metrics-analyzer',
      name: 'Analytics & Forecasting Model',
      agent: 'Business Agent',
      description: 'Analisa tendências financeiras, CTR e métricas de desempenho de campanhas.',
      category: 'analytics',
      permissionLevel: 'public',
    },
    {
      id: 'memory-inspector-tool',
      name: 'Unified Memory Reader',
      agent: 'Master Orchestrator',
      description: 'Consulta fatos de longo prazo e documentos anexados no projeto.',
      category: 'system',
      permissionLevel: 'public',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0F0F12] border border-[#27272A] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="h-14 px-6 border-b border-[#1C1C1F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Registro de Ferramentas (Tool Registry)
            </h3>
          </div>
          <button
            onClick={() => setIsToolRegistryOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E22] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-xs text-gray-400">
            Abaixo estão as ferramentas integradas ao AI Radar que os agentes podem invocar autonomamente durante o processamento de suas solicitações.
          </p>

          <div className="space-y-3">
            {tools.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-xl bg-[#141417] border border-[#27272A] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-white">{t.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#18181B] text-gray-400 border border-[#27272A] font-mono">
                      {t.id}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    {t.category}
                  </span>
                </div>

                <p className="text-xs text-gray-300">{t.description}</p>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-[#1C1C1F]/60">
                  <span>
                    Agente Responsável:{' '}
                    <strong className="text-gray-300">{t.agent}</strong>
                  </span>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Shield className="w-3 h-3" />
                    <span>{t.permissionLevel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1C1C1F] bg-[#0A0A0B] flex justify-end">
          <button
            onClick={() => setIsToolRegistryOpen(false)}
            className="px-4 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-xs font-medium text-gray-200 border border-[#27272A] transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
