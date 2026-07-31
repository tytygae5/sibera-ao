/**
 * Shared Client Type Definitions
 */

export type IntentType =
  | 'CONVERSATIONAL'
  | 'ANALYSIS_RESEARCH'
  | 'PLANNING_WORKFLOW'
  | 'CONTENT_CREATION'
  | 'BUSINESS_DECISION'
  | 'FORECAST_METRICS'
  | 'SYSTEM_OPERATION';

export type EventType =
  | 'start'
  | 'thinking'
  | 'planning'
  | 'executing'
  | 'tool'
  | 'provider'
  | 'finish'
  | 'error';

export interface PipelineEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  timestamp: string;
  data?: Record<string, unknown>;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  content?: string;
  url?: string;
}

export interface Message {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: Attachment[];
  events?: PipelineEvent[];
  intent?: IntentType;
  agentsUsed?: string[];
  toolsUsed?: string[];
  executionTimeMs?: number;
  error?: boolean;
}

export interface Session {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  messageCount: number;
  lastMessageSummary?: string;
  tags?: string[];
}

export interface ToolDefinition {
  id: string;
  name: string;
  agent: string;
  description: string;
  category: 'research' | 'analytics' | 'planning' | 'content' | 'system';
  permissionLevel: 'public' | 'restricted' | 'admin';
}

export interface ToolResult {
  toolId: string;
  success: boolean;
  output: Record<string, unknown>;
  summary: string;
  error?: string;
  executionTimeMs: number;
}

export interface AgentDefinition {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  tools: string[];
  status: 'idle' | 'active' | 'executing' | 'completed' | 'error';
  executionCount: number;
}

export interface MemoryState {
  conversationCount: number;
  sessionState: {
    activePersona: string;
    topicFocus: string;
    mode: string;
    customInstructions: string;
  };
  projectFiles: Array<{
    id: string;
    fileName: string;
    summary: string;
    fileType: string;
    addedAt: string;
  }>;
  longTermFacts: Array<{
    id: string;
    category: string;
    fact: string;
    confidence: number;
  }>;
}
