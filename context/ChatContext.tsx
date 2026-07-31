import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Message,
  Session,
  Attachment,
  PipelineEvent,
} from '../types';
import { executeClientSidePipeline } from '../services/clientAIOrchestrator';


interface ChatContextType {
  sessions: Session[];
  activeSessionId: string;
  activeSession: Session | undefined;
  messages: Message[];
  isStreaming: boolean;
  streamingText: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  agentPanelOpen: boolean;
  setAgentPanelOpen: (open: boolean) => void;
  pipelineInspectorOpen: boolean;
  setPipelineInspectorOpen: (open: boolean) => void;
  showPipelineInspector: boolean;
  setShowPipelineInspector: (open: boolean) => void;
  isToolRegistryOpen: boolean;
  setIsToolRegistryOpen: (open: boolean) => void;
  isMemoryViewerOpen: boolean;
  setIsMemoryViewerOpen: (open: boolean) => void;
  isFileUploadOpen: boolean;
  setIsFileUploadOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  showSettings: boolean;
  setShowSettings: (open: boolean) => void;
  activeEvents: PipelineEvent[];
  streamingEvents: PipelineEvent[];
  sendMessage: (content: string, attachments?: Attachment[]) => Promise<void>;
  stopStreaming: () => void;
  createNewSession: (title?: string) => void;
  setActiveSessionId: (id: string) => void;
  deleteSession: (id: string) => void;
  clearHistory: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: 'session-default-1',
      title: 'Sessão Inicial AI Radar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: true,
      messageCount: 1,
      lastMessageSummary: 'AI Radar OS v3.5 ativo e pronto.',
    },
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('session-default-1');
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({
    'session-default-1': [
      {
        id: 'msg-init-1',
        sessionId: 'session-default-1',
        role: 'assistant',
        content:
          '### ⚡ AI Radar OS v3.5 — Sistema Orquestrado de Inteligência\n\nOlá! Sou o **AI Radar OS**, operando com orquestração autônoma de 4 agentes especializados (*Research, Content, Business, Master*) e ferramentas de inspeção de memória em tempo real.\n\nComo posso apoiar sua estratégia hoje?',
        timestamp: new Date().toISOString(),
        intent: 'SYSTEM_OPERATION',
        executionTimeMs: 120,
      },
    ],
  });

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingText, setStreamingText] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [agentPanelOpen, setAgentPanelOpen] = useState<boolean>(false);
  const [pipelineInspectorOpen, setPipelineInspectorOpen] = useState<boolean>(false);
  const [isToolRegistryOpen, setIsToolRegistryOpen] = useState<boolean>(false);
  const [isMemoryViewerOpen, setIsMemoryViewerOpen] = useState<boolean>(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeEvents, setActiveEvents] = useState<PipelineEvent[]>([]);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const messages = messagesMap[activeSessionId] || [];

  const createNewSession = (title = 'Nova Sessão AI Radar') => {
    const id = `session-${Date.now()}`;
    const newSession: Session = {
      id,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messageCount: 0,
    };
    setSessions((prev) => [newSession, ...prev]);
    setMessagesMap((prev) => ({ ...prev, [id]: [] }));
    setActiveSessionId(id);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setMessagesMap((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const clearHistory = () => {
    setMessagesMap((prev) => ({
      ...prev,
      [activeSessionId]: [],
    }));
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  const sendMessage = async (content: string, attachments: Attachment[] = []) => {
    if (!content.trim() || isStreaming) return;

    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      sessionId: activeSessionId,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      attachments,
    };

    setMessagesMap((prev) => {
      const current = prev[activeSessionId] || [];
      return {
        ...prev,
        [activeSessionId]: [...current, userMessage],
      };
    });

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSessionId && s.messageCount === 0
          ? {
              ...s,
              title: content.slice(0, 32) + (content.length > 32 ? '...' : ''),
              messageCount: s.messageCount + 1,
              updatedAt: new Date().toISOString(),
              lastMessageSummary: content.slice(0, 50),
            }
          : s.id === activeSessionId
          ? {
              ...s,
              messageCount: s.messageCount + 1,
              updatedAt: new Date().toISOString(),
              lastMessageSummary: content.slice(0, 50),
            }
          : s
      )
    );

    setIsStreaming(true);
    setStreamingText('');
    setActiveEvents([]);

    const assistantMsgId = `msg-assistant-${Date.now()}`;
    const initialAssistantMsg: Message = {
      id: assistantMsgId,
      sessionId: activeSessionId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      events: [],
    };

    setMessagesMap((prev) => {
      const current = prev[activeSessionId] || [];
      return {
        ...prev,
        [activeSessionId]: [...current, initialAssistantMsg],
      };
    });

    let usedServer = false;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          message: content,
          attachments,
        }),
      });

      if (response.ok) {
        usedServer = true;
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              const dataIndex = trimmed.indexOf('data: ');
              if (dataIndex !== -1) {
                const dataStr = trimmed.slice(dataIndex + 6).trim();
                if (dataStr === '[DONE]') {
                  break;
                }
                try {
                  const parsed = JSON.parse(dataStr);

                  if (parsed.type === 'event') {
                    const evt: PipelineEvent = parsed.event;
                    setActiveEvents((prev) => [...prev, evt]);
                    setMessagesMap((prev) => {
                      const current = prev[activeSessionId] || [];
                      return {
                        ...prev,
                        [activeSessionId]: current.map((m) =>
                          m.id === assistantMsgId
                            ? { ...m, events: [...(m.events || []), evt] }
                            : m
                        ),
                      };
                    });
                  } else if (parsed.type === 'chunk') {
                    setStreamingText((prev) => prev + parsed.text);
                    setMessagesMap((prev) => {
                      const current = prev[activeSessionId] || [];
                      return {
                        ...prev,
                        [activeSessionId]: current.map((m) =>
                          m.id === assistantMsgId
                            ? { ...m, content: m.content + parsed.text }
                            : m
                        ),
                      };
                    });
                  } else if (parsed.type === 'complete') {
                    setMessagesMap((prev) => {
                      const current = prev[activeSessionId] || [];
                      return {
                        ...prev,
                        [activeSessionId]: current.map((m) =>
                          m.id === assistantMsgId
                            ? {
                                ...m,
                                intent: parsed.intent,
                                agentsUsed: parsed.agentsUsed,
                                toolsUsed: parsed.toolsUsed,
                                executionTimeMs: parsed.executionTimeMs,
                              }
                            : m
                        ),
                      };
                    });
                  }
                } catch (e) {
                  // Ignore parse errors on incomplete chunks
                }
              }
            }
          }
        }
      } else {
        console.warn(`[AI Radar OS] Servidor /api/chat respondeu HTTP ${response.status}. Ativando Modo Híbrido Estático (Netlify/Client-Side)...`);
      }
    } catch (err) {
      console.warn('[AI Radar OS] Falha ao contatar /api/chat (Netlify estático / servidor offline). Ativando Modo Híbrido Client-Side:', err);
    }

    if (!usedServer) {
      try {
        await executeClientSidePipeline({
          sessionId: activeSessionId,
          content,
          attachments,
          onEvent: (evt) => {
            setActiveEvents((prev) => [...prev, evt]);
            setMessagesMap((prev) => {
              const current = prev[activeSessionId] || [];
              return {
                ...prev,
                [activeSessionId]: current.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, events: [...(m.events || []), evt] }
                    : m
                ),
              };
            });
          },
          onChunk: (text) => {
            setStreamingText((prev) => prev + text);
            setMessagesMap((prev) => {
              const current = prev[activeSessionId] || [];
              return {
                ...prev,
                [activeSessionId]: current.map((m) =>
                  m.id === assistantMsgId
                    ? { ...m, content: m.content + text }
                    : m
                ),
              };
            });
          },
          onComplete: (meta) => {
            setMessagesMap((prev) => {
              const current = prev[activeSessionId] || [];
              return {
                ...prev,
                [activeSessionId]: current.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        intent: meta.intent,
                        agentsUsed: meta.agentsUsed,
                        toolsUsed: meta.toolsUsed,
                        executionTimeMs: meta.executionTimeMs,
                      }
                    : m
                ),
              };
            });
          },
        });
      } catch (clientErr) {
        console.error('[AI Radar OS] Erro fatal no pipeline Client-Side:', clientErr);
        setMessagesMap((prev) => {
          const current = prev[activeSessionId] || [];
          return {
            ...prev,
            [activeSessionId]: current.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content:
                      '❌ Ocorreu um erro ao processar sua solicitação. Verifique sua chave de API e conexão.',
                    error: true,
                  }
                : m
            ),
          };
        });
      }
    }

    setIsStreaming(false);
    setStreamingText('');
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSessionId,
        activeSession,
        messages,
        isStreaming,
        streamingText,
        sidebarOpen,
        setSidebarOpen,
        agentPanelOpen,
        setAgentPanelOpen,
        pipelineInspectorOpen,
        setPipelineInspectorOpen,
        showPipelineInspector: pipelineInspectorOpen,
        setShowPipelineInspector: setPipelineInspectorOpen,
        isToolRegistryOpen,
        setIsToolRegistryOpen,
        isMemoryViewerOpen,
        setIsMemoryViewerOpen,
        isFileUploadOpen,
        setIsFileUploadOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        showSettings: isSettingsOpen,
        setShowSettings: setIsSettingsOpen,
        activeEvents,
        streamingEvents: activeEvents,
        sendMessage,
        stopStreaming,
        createNewSession,
        setActiveSessionId,
        deleteSession,
        clearHistory,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat deve ser usado dentro de um ChatProvider');
  }
  return context;
};
