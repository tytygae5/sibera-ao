import { ToolDefinition, ToolResult } from '../types.js';
import { SYSTEM_TOOL_DEFINITIONS } from './toolDefinitions.js';

class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();

  constructor() {
    SYSTEM_TOOL_DEFINITIONS.forEach((tool) => {
      this.tools.set(tool.id, tool);
    });
  }

  public getTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public getAllTools(): ToolDefinition[] {
    return this.getTools();
  }

  public getToolById(id: string): ToolDefinition | undefined {
    return this.tools.get(id);
  }

  public registerTool(tool: ToolDefinition): void {
    this.tools.set(tool.id, tool);
  }
}

export const toolRegistry = new ToolRegistry();

export async function executeTool(toolId: string, params: Record<string, unknown>): Promise<ToolResult> {
  const startTime = Date.now();
  let summary = `Ferramenta ${toolId} executada com sucesso.`;
  const output: Record<string, unknown> = { ...params, status: 'completed' };

  if (toolId === 'web-search-radar') {
    summary = `Busca radar concluída: 4 tendências encontradas para o termo analisado.`;
    output.trends = ['Automação Agêntica', 'IA Multimodal', 'Retenção em Shorts', 'Otimização de Prompting'];
  } else if (toolId === 'content-script-generator') {
    summary = `Roteiro otimizado gerado com estimativa de retenção > 65%.`;
    output.hook = 'Você sabia que 80% das pessoas estão usando IA do jeito errado?';
  }

  return {
    toolId,
    success: true,
    output,
    summary,
    executionTimeMs: Date.now() - startTime,
  };
}
