import { memoryManager } from '../memory/memoryManager.js';

export interface ContextAnalysisResult {
  hasProjectFiles: boolean;
  longTermFactsCount: number;
  summary: string;
  enhancedContext: string;
  memoryContext: string;
}

export function analyzeContext(userPrompt: string): ContextAnalysisResult {
  const memState = memoryManager.getFullState();
  const enhancedContext = memoryManager.getRelevantContext(userPrompt);

  return {
    hasProjectFiles: memState.projectFiles.length > 0,
    longTermFactsCount: memState.longTermFacts.length,
    summary: `Contexto carregado com ${memState.projectFiles.length} arquivos e ${memState.longTermFacts.length} fatos de longo prazo.`,
    enhancedContext,
    memoryContext: enhancedContext,
  };
}
