import { ToolDefinition } from '../types.js';

export const SYSTEM_TOOL_DEFINITIONS: ToolDefinition[] = [
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
