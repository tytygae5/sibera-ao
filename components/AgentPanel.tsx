import React from 'react';
import { useChat } from '../context/ChatContext';
import {
  Radar,
  X,
  Brain,
  Search,
  Sparkles,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Activity,
} from 'lucide-react';

export const AgentPanel: React.FC = () => {
  const { agentPanelOpen, setAgentPanelOpen } = useChat();

  if (!agentPanelOpen) return null;

  const agents = [
    {
      id: 'master-orchestrator',
      name: 'Master Orchestrator',
      role: 'Orquestração Central',
      status: 'active',
      icon: <Brain className="w-4 h-4 text-emerald-400" />,
      description: 'Responsável pela detecção de intenção e divisão de plano agêntico.',
      tools: ['memory-inspector-tool'],
    },
    {
      id: 'research-agent',
      name: 'Research & Data Agent',
      role: 'Coleta de Dados Web',
      status: 'idle',
      icon: <Search className="w-4 h-4 text-blue-400" />,
      description: 'Varredura de tendências de mercado, busca em tempo real e consolidação de fatos.',
      tools: ['web-search-radar'],
    },
    {
      id: 'content-agent',
      name: 'Viral Content Agent',
      role: 'Roteiros & Headlines',
      status: 'idle',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      description: 'Gera roteiros estruturados, ganchos magnéticos e calcula retenção estimada.',
      tools: ['content-script-generator'],
    },
    {
      id: 'business-agent',
      name: 'Business Strategy Agent',
      role: 'Análise de Negócios',
      status: 'idle',
      icon: <TrendingUp className="w-4 h-4 text-amber-400" />,
      description: 'Projeta métricas operacionais, ROI e CTR para campanhas e decisões.',
      tools: ['market-metrics-analyzer'],
    },
  ];

  return (
    <aside className="w-80 border-l border-[#1C1C1F] bg-[#0A0A0B] flex flex-col h-full select-none shrink-0 z-10">
      {/* Header */}
      <div className="h-14 px-4 border-b border-[#1C1C1F] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radar className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white tracking-tight">
            PAINEL DE AGENTES
          </span>
        </div>
        <button
          onClick={() => setAgentPanelOpen(false)}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E22] transition-colors"
          title="Fechar painel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="text-[11px] text-gray-400 px-1">
          O AI Radar executa e coordena múltiplos agentes autônomos por trás de cada resposta.
        </div>

        {agents.map((ag) => (
          <div
            key={ag.id}
            className="p-3 rounded-xl bg-[#141417] border border-[#27272A] space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#1C1C1F] flex items-center justify-center">
                  {ag.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">{ag.name}</h4>
                  <p className="text-[10px] text-gray-500">{ag.role}</p>
                </div>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase ${
                  ag.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#1C1C1F] text-gray-500'
                }`}
              >
                {ag.status === 'active' ? 'Ativo' : 'Pronto'}
              </span>
            </div>

            <p className="text-[11px] text-gray-300 leading-relaxed">
              {ag.description}
            </p>

            <div className="flex items-center gap-1.5 pt-1">
              <Cpu className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] text-gray-500">Ferramenta vinculada:</span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {ag.tools[0]}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#1C1C1F] bg-[#0A0A0B] text-[11px] text-gray-500 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Orquestração em Tempo Real</span>
        </div>
        <span className="text-xs text-gray-400">4 / 4</span>
      </div>
    </aside>
  );
};
