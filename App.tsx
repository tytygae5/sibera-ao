import React, { useRef, useEffect } from 'react';
import { ChatProvider, useChat } from './context/ChatContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { PipelineInspector } from './components/PipelineInspector';
import { AgentPanel } from './components/AgentPanel';
import { ToolRegistryModal } from './components/ToolRegistryModal';
import { MemoryViewerModal } from './components/MemoryViewerModal';
import { FileUploadModal } from './components/FileUploadModal';
import { SettingsModal } from './components/SettingsModal';
import { Sparkles, Bot, Brain, Wrench, Activity, ShieldCheck, ArrowRight } from 'lucide-react';

const ChatAppContent: React.FC = () => {
  const { messages, isStreaming, streamingText, activeSession } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isStreaming]);

  const nowString = new Date().toISOString().slice(11, 19);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0A0A0B] text-[#E0E0E5] font-sans">
      <Header />

      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        <Sidebar />

        {/* Main Chat Stream Container */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0B] relative">
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {messages.length === 0 ? (
              <EmptyStateGreeting />
            ) : (
              <div className="divide-y divide-[#1C1C1F]">
                {messages.map((msg, index) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isStreamingLast={isStreaming && index === messages.length - 1}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Status Console Bar (matching theme HTML) */}
          <div className="h-8 bg-[#0E0E10] border-t border-[#1C1C1F] px-4 flex items-center justify-between font-mono text-[10px] select-none shrink-0">
            <div className="flex gap-4">
              <span className="text-emerald-400 font-bold">
                <span className="opacity-50 text-gray-500 font-normal">STATUS: </span>
                {isStreaming ? 'PROCESSING' : 'RUNNING'}
              </span>
              <span className="text-gray-400">
                <span className="opacity-50 text-gray-500">MESSAGES: </span>
                {messages.length} ACTIVE
              </span>
            </div>
            <div className="flex gap-3 items-center">
              {isStreaming ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 animate-pulse rounded-full shadow-[0_0_6px_#3b82f6]"></div>
                  <span className="text-blue-400">thinking...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span className="text-emerald-400">ready</span>
                </div>
              )}
              <span className="text-gray-700">|</span>
              <span className="text-gray-500">UTC {nowString}</span>
            </div>
          </div>

          <ChatInput />
        </main>

        <PipelineInspector />
        <AgentPanel />
      </div>

      <ToolRegistryModal />
      <MemoryViewerModal />
      <FileUploadModal />
      <SettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <ChatProvider>
      <ChatAppContent />
    </ChatProvider>
  );
}

const EmptyStateGreeting: React.FC = () => {
  const { sendMessage } = useChat();

  const capabilities = [
    {
      icon: Activity,
      color: 'text-blue-400',
      title: 'Conversação Direta & Inteligente',
      desc: 'Respostas rápidas, amigáveis e naturais com Gemini 2.5 Flash.',
    },
    {
      icon: Bot,
      color: 'text-indigo-400',
      title: 'Orquestração de 13 Agentes',
      desc: 'Master, Trend, Research, Content, Business e Decision em tempo real.',
    },
    {
      icon: Brain,
      color: 'text-emerald-400',
      title: 'Memória Unificada de 4 Camadas',
      desc: 'Mantém contexto de conversas passadas, preferências e arquivos.',
    },
    {
      icon: Wrench,
      color: 'text-purple-400',
      title: 'Fábrica de Conteúdos & SEO',
      desc: 'Gera roteiros virais, headlines otimizadas e relatórios de mercado.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-full text-center space-y-6 select-none font-sans">
      <div className="w-12 h-12 rounded bg-blue-950 border border-blue-500/40 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
        <Sparkles className="w-6 h-6 text-blue-400" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-widest text-blue-400 uppercase">
          AI RADAR OPERATING SYSTEM
        </h2>
        <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed font-mono">
          Assistente conversacional autônomo com pipeline de agentes de inteligência e memória integrada.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left w-full font-mono">
        {capabilities.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-sm bg-[#121214] border border-[#1C1C1F] hover:border-gray-700 transition-colors space-y-1"
            >
              <div className="flex items-center space-x-2">
                <Icon className={`w-3.5 h-3.5 ${cap.color}`} />
                <h3 className="text-xs font-bold text-gray-200">{cap.title}</h3>
              </div>
              <p className="text-[11px] text-gray-400 font-sans leading-relaxed">{cap.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="pt-2">
        <button
          onClick={() => sendMessage('Oi! O que você pode fazer por mim hoje?')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all active:scale-95"
        >
          <span>Iniciar Conversa com o AI Radar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
