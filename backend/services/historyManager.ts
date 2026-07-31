import { Session, Message } from '../types.js';

class HistoryManager {
  private sessions: Map<string, Session> = new Map();
  private messages: Map<string, Message[]> = new Map();

  constructor() {
    const defaultSession: Session = {
      id: 'session-default-1',
      title: 'Sessão Inicial AI Radar',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: true,
      messageCount: 0,
      lastMessageSummary: 'Pronto para iniciar análise e automação.',
    };
    this.sessions.set(defaultSession.id, defaultSession);
    this.messages.set(defaultSession.id, []);
  }

  public getAllSessions(): Session[] {
    return Array.from(this.sessions.values()).sort((a, b) =>
      b.updatedAt.localeCompare(a.updatedAt)
    );
  }

  public createSession(title: string): Session {
    const id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const session: Session = {
      id,
      title,
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
    };
    this.sessions.set(id, session);
    this.messages.set(id, []);
    return session;
  }

  public updateSession(id: string, updates: Partial<Session>): Session | null {
    const existing = this.sessions.get(id);
    if (!existing) return null;
    const updated: Session = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.sessions.set(id, updated);
    return updated;
  }

  public deleteSession(id: string): boolean {
    if (!this.sessions.has(id)) return false;
    this.sessions.delete(id);
    this.messages.delete(id);
    return true;
  }

  public getMessages(sessionId: string): Message[] {
    return this.messages.get(sessionId) || [];
  }

  public addMessage(sessionId: string, msg: Message): Message {
    const list = this.messages.get(sessionId) || [];
    list.push(msg);
    this.messages.set(sessionId, list);

    const session = this.sessions.get(sessionId);
    if (session) {
      session.messageCount = list.length;
      session.updatedAt = new Date().toISOString();
      if (msg.role === 'user') {
        session.lastMessageSummary = msg.content.slice(0, 50);
      }
      this.sessions.set(sessionId, session);
    }
    return msg;
  }

  public deleteMessage(sessionId: string, messageId: string): boolean {
    const list = this.messages.get(sessionId);
    if (!list) return false;
    const filtered = list.filter((m) => m.id !== messageId);
    if (filtered.length === list.length) return false;
    this.messages.set(sessionId, filtered);
    return true;
  }
}

export const historyManager = new HistoryManager();
