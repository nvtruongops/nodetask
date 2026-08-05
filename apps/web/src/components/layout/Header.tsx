import React from 'react';
import { useTreeStore } from '../../store/useTreeStore';

interface HeaderProps {
  onOpenAISearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAISearch }) => {
  const { isDarkTheme, toggleTheme } = useTreeStore();

  return (
    <header className="h-14 border-b border-border bg-background px-4 flex items-center justify-between select-none">
      {/* Brand & System Status */}
      <div className="flex items-center gap-3">
        <span className="font-mono font-bold text-lg tracking-tight">
          nodetask<span className="text-muted-foreground">_v1.0</span>
        </span>
        <span className="text-xs font-mono px-2 py-0.5 border border-border rounded bg-muted/50">
          [ONLINE]
        </span>
      </div>

      {/* Action Bar & Theme Toggle */}
      <div className="flex items-center gap-3 font-mono text-xs">
        <button
          onClick={onOpenAISearch}
          className="px-3 py-1 border border-border hover:bg-foreground hover:text-background transition-colors rounded"
        >
          [AI RAG SEARCH]
        </button>

        <button
          onClick={toggleTheme}
          className="px-3 py-1 border border-border hover:bg-foreground hover:text-background transition-colors rounded"
        >
          [MODE: {isDarkTheme ? 'DARK' : 'LIGHT'}]
        </button>
      </div>
    </header>
  );
};
