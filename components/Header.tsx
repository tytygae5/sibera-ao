import React from 'react';
import { useChat } from '../context/ChatContext';
import {
  Radar,
  FolderOpen,
  Wrench,
  Brain,
  Settings,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
  Download,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeSession,
    sidebarOpen,
    setSidebarOpen,
    agentPanelOpen,
    setAgentPanelOpen,
    setIsToolRegistryOpen,
    setIsMemoryViewerOpen,
    setIsFileUploadOpen,
    setIsSettingsOpen,
    createNewSession,
  } = useChat();

  const handleExportZip = async () => {
    try {
      const response = await fetch('/api/export-zip');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-radar-project.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Falha ao exportar ZIP');
      }
    } catch (err) {
      console.error('Erro ao baixar ZIP:', err);
    }
  };

  return (
    <header className="h-14 border-b border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-between px-4 select-none shrink-0 z-10">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E22] transition-colors"
          title={sidebarOpen ? 'Ocultar barra lateral' : 'Mostrar barra lateral'}
        >
          {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Radar className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white tracking-tight">AI RADAR</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">
                OS v3.5
              </span>
            </div>
            <p className="text-[10px] text-gray-500">
              {activeSession ? activeSession.title : 'Sistema de Agentes'}
            </p>
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => createNewSession()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-xs font-medium text-gray-200 border border-[#27272A] transition-colors"
          title="Nova conversa"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Nova Sessão</span>
        </button>

        <div className="h-4 w-px bg-[#27272A] mx-1" />

        <button
          onClick={() => setIsFileUploadOpen(true)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E22] transition-colors"
          title="Arquivos e Projeto"
        >
          <FolderOpen className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsToolRegistryOpen(true)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E22] transition-colors"
          title="Ferramentas e Ferramental"
        >
          <Wrench className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsMemoryViewerOpen(true)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E22] transition-colors"
          title="Memória e Fatos de Longo Prazo"
        >
          <Brain className="w-4 h-4" />
        </button>

        <button
          onClick={handleExportZip}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-medium text-emerald-400 border border-emerald-500/30 transition-colors ml-1"
          title="Exportar projeto completo com pasta context"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Export ZIP</span>
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E22] transition-colors"
          title="Configurações"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-[#27272A] mx-1" />

        <button
          onClick={() => setAgentPanelOpen(!agentPanelOpen)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
            agentPanelOpen
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-gray-400 hover:text-white hover:bg-[#1E1E22] border border-transparent'
          }`}
          title="Painel de Agentes e Orquestração"
        >
          <Radar className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Agentes</span>
        </button>
      </div>
    </header>
  );
};
