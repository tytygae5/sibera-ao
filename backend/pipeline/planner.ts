import { IntentType, WorkflowPlan, ExecutionPlanStep } from '../types.js';

export function buildWorkflowPlan(prompt: string, intent: IntentType): WorkflowPlan {
  const steps: ExecutionPlanStep[] = [];

  if (intent === 'CONTENT_CREATION') {
    steps.push({
      stepNumber: 1,
      title: 'Busca de Ganchos Virais',
      agentId: 'content-agent',
      toolId: 'content-script-generator',
      description: 'Gerar estrutura de roteiro com retenção e CTR otimizados.',
    });
  } else if (intent === 'ANALYSIS_RESEARCH') {
    steps.push({
      stepNumber: 1,
      title: 'Varredura de Dados no Radar Web',
      agentId: 'research-agent',
      toolId: 'web-search-radar',
      description: 'Consultar tendências recentes e insights analíticos.',
    });
  } else if (intent === 'BUSINESS_DECISION') {
    steps.push({
      stepNumber: 1,
      title: 'Projeções Analíticas',
      agentId: 'business-agent',
      toolId: 'market-metrics-analyzer',
      description: 'Avaliar CTR e métricas financeiras de campanha.',
    });
  } else {
    steps.push({
      stepNumber: 1,
      title: 'Análise de Contexto e Memória',
      agentId: 'master-orchestrator',
      toolId: 'memory-inspector-tool',
      description: 'Sintetizar dados de longo prazo para uma resposta direta e precisa.',
    });
  }

  return {
    intent,
    summary: `Plano de execução para intenção: ${intent} com ${steps.length} etapas.`,
    steps,
  };
}
