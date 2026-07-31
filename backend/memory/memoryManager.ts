import { MemoryState } from '../types.js';

class MemoryManager {
  private state: MemoryState = {
    conversationCount: 0,
    sessionState: {
      activePersona: 'AI Radar OS Professional',
      topicFocus: 'Automação, Inteligência Operacional e Análise',
      mode: 'Autônomo Orquestrado',
      customInstructions: 'Priorizar respostas diretas, precisas e em português com formatação limpa.',
    },
    projectFiles: [],
    longTermFacts: [
      {
        id: 'fact-1',
        category: 'architecture',
        fact: 'O AI Radar opera um ecossistema autônomo com 13 agentes especializados.',
        confidence: 0.99,
      },
    ],
  };

  public getFullState(): MemoryState {
    return this.state;
  }

  public clearAll(): void {
    this.state.conversationCount = 0;
    this.state.projectFiles = [];
    this.state.longTermFacts = [];
  }

  public addProjectFile(file: {
    fileName: string;
    fileType: string;
    extractedText: string;
    summary: string;
  }): { id: string; fileName: string; summary: string; fileType: string; addedAt: string } {
    const item = {
      id: `file-${Date.now()}`,
      fileName: file.fileName,
      summary: file.summary,
      fileType: file.fileType,
      addedAt: new Date().toISOString(),
    };
    this.state.projectFiles.push(item);
    return item;
  }

  public addConversationTurn(role: string, content: string): void {
    this.state.conversationCount += 1;
    if (content.length > 30 && role === 'user') {
      // Opportunistically save basic facts if clear
      if (content.toLowerCase().includes('meu nome é') || content.toLowerCase().includes('empresa')) {
        this.state.longTermFacts.push({
          id: `fact-${Date.now()}`,
          category: 'user-context',
          fact: content.slice(0, 100),
          confidence: 0.85,
        });
      }
    }
  }

  public getRelevantContext(query: string): string {
    const filesSummary = this.state.projectFiles
      .map((f) => `- [${f.fileName}]: ${f.summary}`)
      .join('\n');
    const factsSummary = this.state.longTermFacts
      .map((f) => `- (${f.category}): ${f.fact}`)
      .join('\n');

    return `### 🧠 Memória Unificada AI Radar\n*Arquivos no Projeto:* ${
      this.state.projectFiles.length > 0 ? '\n' + filesSummary : 'Nenhum arquivo anexado.'
    }\n*Fatos Memorizados:* ${
      this.state.longTermFacts.length > 0 ? '\n' + factsSummary : 'Sem fatos adicionais.'
    }`;
  }
}

export const memoryManager = new MemoryManager();
