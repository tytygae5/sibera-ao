import React from 'react';
import { useChat } from '../context/ChatContext';
import { Activity, X, CheckCircle2, Clock, Cpu, Bot, Wrench, Sparkles, AlertCircle } from 'lucide-react';

export const PipelineInspector: React.FC = () => {
  const { showPipelineInspector, setShowPipelineInspector, streamingEvents, isStreaming, messages } = useChat();

  if (!showPipelineInspector) return null;

  // Use live streaming events or last assistant message events
  const lastMsgWithEvents = [...messages].reverse().find((m) => m.role === 'assistant' && m.events && m.events.length > 0);
  const eventsToDisplay = isStreaming || streamingEvents.length > 0
    ? streamingEvents
    : (lastMsgWithEvents?.events || []);

  const pipelineNodes = [
    { code: 'ID', label: 'Intent', active: isStreaming },
    { code: 'CA', label: 'Context', active: isStreaming },
    { code: 'PL', label: 'Planner', active: isStreaming },
    { code: 'EX', label: 'Exec', active: isStreaming },
    { code: 'PR', label: 'Prov', active: !isStreaming && eventsToDisplay.length > 0 },
  ];

  return (
    <aside className="w-80 sm:w-96 bg-[#0E0E10] border-l border-[#1C1C1F] flex flex-col h-full z-30 shrink-0 select-none font-mono">
      {/* Header */}
      <div className="p-3 border-b border-[#1C1C1F] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <h2 className="font-bold text-xs text-blue-400 uppercase tracking-wider">
            PIPELINE INSPECTOR
          </h2>
        </div>
        <button
          onClick={() => setShowPipelineInspector(false)}
          className="p-1 rounded border border-[#1C1C1F] text-gray-400 hover:text-white hover:bg-[#161618]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Flow Nodes Bar (matching theme HTML) */}
      <div className="px-4 py-3 flex items-center justify-center border-b border-[#1C1C1F] bg-[#121214] relative overflow-hidden">
        <div className="flex items-center gap-1.5 relative z-10">
          {pipelineNodes.map((node, i) => (
            <React.Fragment key={node.code}>
              <div className={`flex flex-col items-center ${node.active ? 'scale-105' : 'opacity-40'}`}>
                <div
                  className={`w-7 h-7 rounded border flex items-center justify-center text-[9px] font-bold ${
                    node.active
                      ? 'border-blue-500 bg-blue-950 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                      : 'border-gray-600 text-gray-300'
                  }`}
                >
                  {node.code}
                </div>
                <span className={`text-[8px] mt-1 uppercase ${node.active ? 'text-blue-400 font-bold' : 'text-gray-500'}`}>
                  {node.label}
                </span>
              </div>
              {i < pipelineNodes.length - 1 && (
                <div className={`w-4 h-px ${node.active ? 'bg-blue-500' : 'bg-gray-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Subtitle Status */}
      <div className="px-3 py-1.5 bg-[#0A0A0B] border-b border-[#1C1C1F] flex items-center justify-between text-[10px]">
        <span className="text-gray-500">PIPELINE STATUS:</span>
        <span className={`flex items-center gap-1 font-bold ${isStreaming ? 'text-amber-400' : 'text-emerald-400'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
          {isStreaming ? 'EXECUTING PIPELINE' : 'IDLE / READY'}
        </span>
      </div>

      {/* Timeline Stream Events */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
        {eventsToDisplay.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-[11px] italic">
            Nenhuma execução ativa. Envie uma mensagem no chat para inspecionar os eventos em tempo real!
          </div>
        ) : (
          eventsToDisplay.map((evt, idx) => (
            <div key={evt.id || idx} className="relative pl-5 border-l border-[#1C1C1F] pb-2 last:pb-0">
              {/* Event node dot */}
              <div
                className={`absolute -left-2 top-0.5 w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                  evt.type === 'finish'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : evt.type === 'error'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : evt.type === 'tool'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                    : 'bg-blue-500/20 border-blue-500 text-blue-300'
                }`}
              >
                {evt.type === 'finish' ? (
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                ) : evt.type === 'error' ? (
                  <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
                ) : evt.type === 'tool' ? (
                  <Wrench className="w-2.5 h-2.5 text-purple-400" />
                ) : (
                  <Cpu className="w-2.5 h-2.5 text-blue-400" />
                )}
              </div>

              <div className="bg-[#121214] border border-[#1C1C1F] rounded p-2.5 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-gray-200">{evt.title}</span>
                  <span className="text-gray-600">{evt.timestamp.slice(11, 19)}</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">{evt.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2.5 border-t border-[#1C1C1F] bg-[#0A0A0B] text-[9px] text-gray-600 text-center">
        PIPELINE: CA → ID → PL → EX → PR → MODEL (GEMINI 2.5 FLASH)
      </div>
    </aside>
  );
};
