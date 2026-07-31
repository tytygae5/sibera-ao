import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

import { analyzeContext } from './backend/pipeline/contextAnalyzer.js';
import { detectIntent } from './backend/pipeline/intentDetector.js';
import { buildWorkflowPlan } from './backend/pipeline/planner.js';
import { executeWorkflowPlan } from './backend/pipeline/executor.js';
import { buildFinalPrompt } from './backend/pipeline/promptBuilder.js';
import { streamModelResponse } from './backend/pipeline/provider.js';
import { memoryManager } from './backend/memory/memoryManager.js';
import { toolRegistry } from './backend/tools/toolRegistry.js';
import { agentOrchestrator } from './backend/agents/agentOrchestrator.js';
import { historyManager } from './backend/services/historyManager.js';
import { Message, PipelineEvent } from './backend/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      system: 'AI Radar OS',
      version: '1.0.0',
      agents: agentOrchestrator.getAllAgents().length,
      tools: toolRegistry.getAllTools().length,
      timestamp: new Date().toISOString(),
    });
  });

  // Sessions CRUD
  app.get('/api/sessions', (req, res) => {
    res.json(historyManager.getAllSessions());
  });

  app.post('/api/sessions', (req, res) => {
    const { title } = req.body;
    const session = historyManager.createSession(title || 'Nova Conversa');
    res.json(session);
  });

  app.patch('/api/sessions/:id', (req, res) => {
    const { id } = req.params;
    const updated = historyManager.updateSession(id, req.body);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ error: 'Session not found' });
    }
  });

  app.delete('/api/sessions/:id', (req, res) => {
    const { id } = req.params;
    const deleted = historyManager.deleteSession(id);
    res.json({ success: deleted });
  });

  app.get('/api/sessions/:id/messages', (req, res) => {
    const { id } = req.params;
    res.json(historyManager.getMessages(id));
  });

  app.delete('/api/sessions/:sessionId/messages/:messageId', (req, res) => {
    const { sessionId, messageId } = req.params;
    const success = historyManager.deleteMessage(sessionId, messageId);
    res.json({ success });
  });

  // Tools & Agents API
  app.get('/api/tools', (req, res) => {
    res.json(toolRegistry.getAllTools());
  });

  app.get('/api/agents', (req, res) => {
    res.json(agentOrchestrator.getAllAgents());
  });

  // Memory Inspector API
  app.get('/api/memory', (req, res) => {
    res.json(memoryManager.getFullState());
  });

  app.post('/api/memory/clear', (req, res) => {
    memoryManager.clearAll();
    res.json({ success: true, message: 'Memory cleared.' });
  });

  // File Upload to Knowledge Base
  app.post('/api/upload', (req, res) => {
    const { name, content, fileType } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: 'Name and content are required' });
    }

    const added = memoryManager.addProjectFile({
      fileName: name,
      fileType: fileType || 'text',
      extractedText: content,
      summary: `Document: ${name} (${content.slice(0, 100)}...)`,
    });

    res.json({ success: true, file: added });
  });

  // STREAMING CHAT PIPELINE (SSE)
  const chatStreamHandler = async (req: express.Request, res: express.Response) => {
    const { sessionId, attachments } = req.body;
    const content = req.body.content || req.body.message;

    if (!sessionId || !content) {
      return res.status(400).json({ error: 'sessionId and content/message are required' });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendSSE = (event: string, data: unknown) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const pipelineEvents: PipelineEvent[] = [];
    const startTime = Date.now();

    const pushEvent = (type: PipelineEvent['type'], title: string, description: string, data?: Record<string, unknown>) => {
      const evt: PipelineEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type,
        title,
        description,
        timestamp: new Date().toISOString(),
        data,
      };
      pipelineEvents.push(evt);
      sendSSE('event', { type: 'event', event: evt });
      return evt;
    };

    try {
      // Step 1: Save User Message
      const userMsg: Message = {
        id: `msg-user-${Date.now()}`,
        sessionId,
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        attachments,
      };
      historyManager.addMessage(sessionId, userMsg);
      memoryManager.addConversationTurn('user', content);

      pushEvent('start', 'Context Analysis', 'Analyzing user request, project files, and 4-tier memory state...');

      // Step 2: Context Analysis
      const contextRes = analyzeContext(content);
      pushEvent('thinking', 'Intent Detection', 'Determining execution path and query intent...');

      // Step 3: Intent Detection
      const intent = detectIntent(content);
      pushEvent('thinking', `Intent Classified: ${intent}`, `Identified query pattern: ${intent}`);

      // Select active agents
      const activeAgents = agentOrchestrator.selectAgentsForIntent(intent);

      // Step 4: Workflow Planning & Execution
      let toolResults = [];
      let agentSummaries: string[] = [];

      if (intent === 'CONVERSATIONAL') {
        pushEvent('planning', 'Fast Direct Stream', 'Simple conversational intent detected. Direct routing to Gemini Provider without tool overhead.');
      } else {
        pushEvent('planning', 'Workflow Construction', `Creating specialized task plan for ${intent}...`);
        const plan = buildWorkflowPlan(content, intent);

        pushEvent('executing', 'Multi-Agent Execution', `Running ${plan.steps.length} workflow steps across active agents...`);

        const execRes = await executeWorkflowPlan(plan, (stepNo, agentId, toolId) => {
          pushEvent('tool', `Agent ${agentId} Action`, `Executing step ${stepNo} using tool '${toolId || 'logic'}'.`);
        });

        toolResults = execRes.toolResults;
        agentSummaries = execRes.agentSummaries;
      }

      // Step 5: Prompt Assembly
      pushEvent('provider', 'Prompt Orchestration', 'Assembling unified prompt with memory, agent insights, and system context...');
      const { systemInstruction, userPrompt } = buildFinalPrompt({
        userQuery: content,
        intent,
        memoryContext: contextRes.memoryContext,
        agentSummaries,
        toolResults,
      });

      // Step 6: Stream Response
      pushEvent('provider', 'Streaming Output', 'Generating response via Gemini Provider...');
      let assistantText = '';

      assistantText = await streamModelResponse(
        systemInstruction,
        userPrompt,
        (token) => {
          sendSSE('chunk', { type: 'chunk', text: token });
        }
      );

      // Step 7: Finalize & Store Assistant Message
      const executionTimeMs = Date.now() - startTime;
      pushEvent('finish', 'Pipeline Execution Complete', `Successfully finished pipeline in ${executionTimeMs}ms.`);

      const assistantMsg: Message = {
        id: `msg-ast-${Date.now()}`,
        sessionId,
        role: 'assistant',
        content: assistantText,
        timestamp: new Date().toISOString(),
        events: pipelineEvents,
        intent,
        agentsUsed: activeAgents,
        toolsUsed: toolResults.map((t) => t.toolId),
        executionTimeMs,
      };

      historyManager.addMessage(sessionId, assistantMsg);
      memoryManager.addConversationTurn('assistant', assistantText);

      sendSSE('complete', {
        type: 'complete',
        intent,
        agentsUsed: activeAgents,
        toolsUsed: toolResults.map((t) => t.toolId),
        executionTimeMs,
        message: assistantMsg,
      });
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Pipeline execution error';
      pushEvent('error', 'Execution Error', errorMsg);
      sendSSE('error', { type: 'error', error: errorMsg });
      res.write('data: [DONE]\n\n');
      res.end();
    }
  };

  app.post('/api/chat', chatStreamHandler);
  app.post('/api/chat/stream', chatStreamHandler);

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Radar OS] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
