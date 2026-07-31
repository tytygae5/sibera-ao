import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import {
  MessageSquare,
  Plus,
  Trash2,
  Pin,
  Search,
  ChevronRight,
  Radar,
  FolderTree,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createNewSession,
    deleteSession,
    sidebarOpen,
  } = useChat();

  const [searchTerm, setSearchTerm] = useState('');

  if (!sidebarOpen) return null;

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-64 border-r border-[#1C1C1F] bg-[#0A0A0B] flex flex-col h-full select-none shrink-0">
      {/* Header action */}
      <div className="p-3 border-b border-[#1C1C1F]">
        <button
          onClick={() => createNewSession()}
          className="w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Conversa</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-[#1C1C1F]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar sessões..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#141417] text-gray-200 text-xs pl-8 pr-3 py-1.5 rounded-md border border-[#27272A] focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
          Sessões Ativas
        </div>
        {filteredSessions.length === 0 ? (
          <div className="text-center py-6 text-gray-500 text-xs">
            Nenhuma sessão encontrada.
          </div>
        ) : (
          filteredSessions.map((s) => {
            const isActive = s.id === activeSessionId;
            return (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`group flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#18181B] text-white border border-[#27272A]'
                    : 'text-gray-400 hover:bg-[#141417] hover:text-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <MessageSquare
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-emerald-400' : 'text-gray-500'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{s.title}</p>
                    {s.lastMessageSummary && (
                      <p className="text-[10px] text-gray-500 truncate">
                        {s.lastMessageSummary}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {s.pinned && <Pin className="w-3 h-3 text-emerald-400" />}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(s.id);
                    }}
                    className="p-1 rounded hover:bg-red-500/10 hover:text-red-400 text-gray-500 transition-colors"
                    title="Excluir sessão"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer status */}
      <div className="p-3 border-t border-[#1C1C1F] bg-[#0A0A0B] flex items-center justify-between text-[11px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <Radar className="w-3.5 h-3.5 text-emerald-400" />
          <span>Radar Core v3.5</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Ativo</span>
        </div>
      </div>
    </aside>
  );
};
