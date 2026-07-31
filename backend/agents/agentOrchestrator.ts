import { AgentDefinition } from '../types.js';

class AgentOrchestrator {
  private agents: Map<string, AgentDefinition> = new Map();

  constructor() {
    const defaultAgents: AgentDefinition[] = [
      {
        id: 'master-orchestrator',
        name: 'Master Orchestrator',
        role: 'Orquestração Principal',
        description: 'Coordena o fluxo de execução entre agentes especializados.',
        capabilities: ['Análise de Intenção', 'Planejamento de Workflow', 'Delegação'],
        tools: ['memory-inspector-tool'],
        status: 'idle',
        executionCount: 14,
      },
      {
        id: 'research-agent',
        name: 'Research & Data Agent',
        role: 'Investigação e Dados',
        description: 'Coleta informações e faz verificação analítica em tempo real.',
        capabilities: ['Busca Web', 'Síntese de Tendências', 'Sintetizador'],
        tools: ['web-search-radar'],
        status: 'idle',
        executionCount: 22,
      },
      {
        id: 'content-agent',
        name: 'Viral Content Agent',
        role: 'Conteúdo e Copywriting',
        description: 'Cria roteiros, ganchos virais e estimativas de retenção.',
        capabilities: ['Roteiros Curtos', 'Headlines', 'Análise de Retenção'],
        tools: ['content-script-generator'],
        status: 'idle',
        executionCount: 31,
      },
      {
        id: 'business-agent',
        name: 'Business Strategy Agent',
        role: 'Análise de Negócios',
        description: 'Projeta métricas e avalia decisões estratégicas de mercado.',
        capabilities: ['Previsão de Métricas', 'ROI', 'Análise Competitiva'],
        tools: ['market-metrics-analyzer'],
        status: 'idle',
        executionCount: 9,
      },
    ];

    defaultAgents.forEach((a) => this.agents.set(a.id, a));
  }

  public getAgents(): AgentDefinition[] {
    return Array.from(this.agents.values());
  }

  public getAllAgents(): AgentDefinition[] {
    return this.getAgents();
  }

  public getAgentById(id: string): AgentDefinition | undefined {
    return this.agents.get(id);
  }

  public selectAgentsForIntent(intent: string): string[] {
    if (intent === 'CONTENT_CREATION') {
      return ['content-agent', 'master-orchestrator'];
    }
    if (intent === 'ANALYSIS_RESEARCH') {
      return ['research-agent', 'master-orchestrator'];
    }
    if (intent === 'BUSINESS_DECISION') {
      return ['business-agent', 'master-orchestrator'];
    }
    return ['master-orchestrator'];
  }

  public updateAgentStatus(id: string, status: AgentDefinition['status']): void {
    const ag = this.agents.get(id);
    if (ag) {
      ag.status = status;
      if (status === 'executing') ag.executionCount += 1;
      this.agents.set(id, ag);
    }
  }
}

export const agentOrchestrator = new AgentOrchestrator();
