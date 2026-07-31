import React, { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { Settings, X, Shield, Cpu, Sparkles, Key, Check, Globe } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { showSettings, setShowSettings } = useChat();
  const [apiKey, setApiKey] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (showSettings) {
      const stored = localStorage.getItem('AI_RADAR_GEMINI_KEY') || '';
      setApiKey(stored);
      setSaved(false);
    }
  }, [showSettings]);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('AI_RADAR_GEMINI_KEY', apiKey.trim());
    } else {
      localStorage.removeItem('AI_RADAR_GEMINI_KEY');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 bg-[#0A0A0B]/85 backdrop-blur-xs z-50 flex items-center justify-center p-4 select-none font-mono">
      <div className="bg-[#0E0E10] border border-[#1C1C1F] rounded-sm w-full max-w-md p-4 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1C1C1F] pb-3">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-blue-400" />
            <h2 className="font-bold text-xs text-blue-400 uppercase tracking-wider">
              SYSTEM & MODEL CONFIGURATION
            </h2>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="p-1 rounded border border-[#1C1C1F] text-gray-400 hover:text-white hover:bg-[#161618]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
          {/* NETLIFY / STATIC HOSTING CLIENT API KEY CONFIGURATION */}
          <div className="p-3 rounded-sm bg-[#121214] border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-400 font-bold">
                <Globe className="w-3.5 h-3.5" />
                <span>HOSPEDAGEM NETLIFY & MODO ESTÁTICO</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                Fallback Ativo
              </span>
            </div>
            <p className="text-gray-400 font-sans text-[11px] leading-relaxed">
              Em hospedagem estática (Netlify sem servidor Express), o AI Radar ativa automaticamente o <strong>Modo Híbrido Client-Side</strong>. Opcionalmente, insira sua chave da API Gemini abaixo para chamadas diretas pelo navegador:
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy... (Opcional - Gemini API Key)"
                  className="w-full bg-[#0A0A0B] border border-[#2D2D32] rounded px-2.5 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <button
                onClick={handleSaveKey}
                className="px-3 py-1.5 rounded bg-blue-600/80 hover:bg-blue-600 text-white font-bold text-[11px] flex items-center gap-1 transition-all shrink-0"
              >
                {saved ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Key className="w-3.5 h-3.5" />}
                <span>{saved ? 'SALVO' : 'SALVAR'}</span>
              </button>
            </div>
            {saved && (
              <p className="text-[10px] text-emerald-400 font-sans">
                Chave salva localmente! O Modo Híbrido usará esta chave caso /api/chat retorne 404 no Netlify.
              </p>
            )}
          </div>

          <div className="p-3 rounded-sm bg-[#121214] border border-[#1C1C1F] space-y-1">
            <div className="flex items-center space-x-2 text-blue-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI PROVIDER ENGINE</span>
            </div>
            <p className="text-gray-400 font-sans text-[11px] leading-relaxed">
              O backend do AI Radar opera com o SDK oficial <strong>@google/genai</strong> utilizando o modelo <code>gemini-2.5-flash</code>.
            </p>
            <div className="pt-1.5 text-[10px] text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Chave de API gerenciada com segurança no servidor ou modo híbrido estático.
            </div>
          </div>

          <div className="p-3 rounded-sm bg-[#121214] border border-[#1C1C1F] space-y-1">
            <div className="flex items-center space-x-2 text-indigo-400 font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>PIPELINE ORCHESTRATOR MODE</span>
            </div>
            <p className="text-gray-400 font-sans text-[11px] leading-relaxed">
              Modo <strong>AI Operating System Autônomo</strong> ativo com 13 Agentes Operacionais e Memória de 4 Camadas.
            </p>
          </div>

          <div className="p-3 rounded-sm bg-[#121214] border border-[#1C1C1F] space-y-1">
            <div className="flex items-center space-x-2 text-purple-400 font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>PRIVACY & SANDBOX ISOLATION</span>
            </div>
            <p className="text-gray-400 font-sans text-[11px] leading-relaxed">
              Todos os dados e arquivos enviados permanecem na sandbox da aplicação de forma isolada e segura.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowSettings(false)}
          className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all"
        >
          CLOSE CONFIGURATION
        </button>
      </div>
    </div>
  );
};

