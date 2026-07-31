import { WorkflowPlan, ToolResult } from '../types.js';
import { executeTool } from '../tools/toolRegistry.js';
import { agentOrchestrator } from '../agents/agentOrchestrator.js';

export interface ExecutionResult {
  toolResults: ToolResult[];
  agentSummaries: string[];
  agentsUsed: string[];
  toolsUsed: string[];
  executionSummary: string;
}

export type StepCallback = (stepNo: number, agentId: string, toolId?: string) => void;

export async function executeWorkflowPlan(
  plan: WorkflowPlan,
  callback?: StepCallback
): Promise<ExecutionResult> {
  const toolResults: ToolResult[] = [];
  const agentSummaries: string[] = [];
  const agentsUsedSet = new Set<string>();
  const toolsUsedSet = new Set<string>();

  for (const step of plan.steps) {
    agentsUsedSet.add(step.agentId);
    agentOrchestrator.updateAgentStatus(step.agentId, 'executing');

    if (callback) {
      callback(step.stepNumber, step.agentId, step.toolId);
    }

    if (step.toolId) {
      toolsUsedSet.add(step.toolId);
      const res = await executeTool(step.toolId, { stepNumber: step.stepNumber });
      toolResults.push(res);
      agentSummaries.push(`[${step.agentId}]: ${res.summary}`);
    } else {
      agentSummaries.push(`[${step.agentId}]: Etapa "${step.title}" concluída.`);
    }

    agentOrchestrator.updateAgentStatus(step.agentId, 'idle');
  }

  return {
    toolResults,
    agentSummaries,
    agentsUsed: Array.from(agentsUsedSet),
    toolsUsed: Array.from(toolsUsedSet),
    executionSummary: `Execução de ${plan.steps.length} etapas concluída com sucesso.`,
  };
}
