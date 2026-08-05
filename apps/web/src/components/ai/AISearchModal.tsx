import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { AIAskResponse } from '../../types';
import { useTreeStore } from '../../store/useTreeStore';

interface AISearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISearchModal: React.FC<AISearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AIAskResponse | null>(null);
  const { setActiveNodeId } = useTreeStore();

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const res = await apiService.askAI(query);
    setResponse(res);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono select-none">
      <div className="bg-card border border-border w-full max-w-xl p-6 rounded shadow-xl">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4 text-xs">
          <span className="font-bold uppercase tracking-wider">[AI SEMANTIC RAG ASSISTANT]</span>
          <button
            onClick={onClose}
            className="px-2 py-0.5 border border-border hover:bg-foreground hover:text-background rounded"
          >
            [CLOSE]
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask any course question or search lesson content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-background border border-border px-3 py-1.5 text-xs rounded focus:outline-none focus:ring-1 focus:ring-foreground"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 border border-foreground bg-primary text-primary-foreground text-xs font-bold rounded hover:opacity-90"
            >
              {loading ? '[SEARCHING...]' : '[ASK AI]'}
            </button>
          </div>
        </form>

        {response && (
          <div className="space-y-4 text-xs border-t border-border pt-4">
            <div>
              <span className="font-bold text-muted-foreground uppercase block mb-1">
                [AI ANSWER]:
              </span>
              <p className="leading-relaxed bg-muted/30 p-3 border border-border rounded">
                {response.answer}
              </p>
            </div>

            <div>
              <span className="font-bold text-muted-foreground uppercase block mb-2">
                [MATCHED COURSE SOURCES]:
              </span>
              <div className="space-y-2">
                {response.sources.map((src) => (
                  <div
                    key={src.nodeId}
                    onClick={() => {
                      setActiveNodeId(src.nodeId);
                      onClose();
                    }}
                    className="p-2 border border-border hover:bg-muted cursor-pointer rounded flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold block">{src.title}</span>
                      <span className="text-[10px] text-muted-foreground block truncate">
                        {src.snippet}
                      </span>
                    </div>
                    <span className="text-[10px] border border-border px-1.5 py-0.5 rounded font-bold">
                      SCORE: {(src.score * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
