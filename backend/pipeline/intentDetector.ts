import { IntentType } from '../types.js';

export function detectIntent(prompt: string): IntentType {
  const lower = prompt.toLowerCase();
  if (
    lower.includes('roteiro') ||
    lower.includes('copy') ||
    lower.includes('viral') ||
    lower.includes('post') ||
    lower.includes('gancho')
  ) {
    return 'CONTENT_CREATION';
  }
  if (
    lower.includes('análise') ||
    lower.includes('pesquisa') ||
    lower.includes('tendência') ||
    lower.includes('mercado') ||
    lower.includes('busca')
  ) {
    return 'ANALYSIS_RESEARCH';
  }
  if (
    lower.includes('plano') ||
    lower.includes('workflow') ||
    lower.includes('etapas') ||
    lower.includes('estratégia')
  ) {
    return 'PLANNING_WORKFLOW';
  }
  if (
    lower.includes('roi') ||
    lower.includes('ctr') ||
    lower.includes('métrica') ||
    lower.includes('negócio') ||
    lower.includes('orçamento')
  ) {
    return 'BUSINESS_DECISION';
  }
  if (
    lower.includes('sistema') ||
    lower.includes('agente') ||
    lower.includes('memória') ||
    lower.includes('pipeline')
  ) {
    return 'SYSTEM_OPERATION';
  }
  return 'CONVERSATIONAL';
}
