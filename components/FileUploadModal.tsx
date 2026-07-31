import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { FolderOpen, X, UploadCloud, FileText, Check } from 'lucide-react';

export const FileUploadModal: React.FC = () => {
  const { isFileUploadOpen, setIsFileUploadOpen } = useChat();
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  if (!isFileUploadOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const names = Array.from(e.dataTransfer.files).map((f) => f.name);
      setUploadedFiles((prev) => [...prev, ...names]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const names = Array.from(e.target.files).map((f) => f.name);
      setUploadedFiles((prev) => [...prev, ...names]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0F0F12] border border-[#27272A] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-14 px-6 border-b border-[#1C1C1F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Arquivos e Dados do Projeto
            </h3>
          </div>
          <button
            onClick={() => setIsFileUploadOpen(false)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E22] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-gray-400">
            Arraste arquivos (PDF, CSV, MD, TXT, JSON) para enriquecer o contexto do AI Radar.
          </p>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? 'border-emerald-500 bg-emerald-500/10'
                : 'border-[#27272A] bg-[#141417] hover:border-gray-500'
            }`}
          >
            <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-gray-200 font-medium">
              Arraste arquivos aqui ou clique para selecionar
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              Até 10MB por arquivo (.csv, .pdf, .txt, .json)
            </p>

            <label className="mt-4 inline-block px-4 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-xs text-gray-200 border border-[#27272A] cursor-pointer transition-colors">
              Selecionar Arquivos
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-1 pt-2">
              <span className="text-xs font-semibold text-gray-300">
                Arquivos Anexados
              </span>
              {uploadedFiles.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#141417] border border-[#27272A]"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-gray-200">{name}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                    <Check className="w-3 h-3" />
                    Indexado
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1C1C1F] bg-[#0A0A0B] flex justify-end">
          <button
            onClick={() => setIsFileUploadOpen(false)}
            className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-semibold transition-colors"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
