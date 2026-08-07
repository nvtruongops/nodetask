import React from 'react';
import { useLanguageStore } from '../../store/useLanguageStore';
import { getAuthContent, AuthContentKey } from './content';

interface AuthLayoutShellProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export function AuthLayoutShell({ children, onNavigate }: AuthLayoutShellProps) {
  const { locale, toggleLocale } = useLanguageStore();

  const t = (key: AuthContentKey) => getAuthContent(key, locale);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-foreground selection:text-background">
      {/* Auth Header */}
      <header className="w-full border-b border-border py-4 px-6 flex items-center justify-between">
        <button
          onClick={() => onNavigate('/')}
          className="text-lg font-bold tracking-tight hover:opacity-80 transition-opacity focus:outline-none focus:ring-1 focus:ring-foreground p-1"
          aria-label="Navigate to Home"
        >
          [{t('common.brand')}]
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-foreground px-2 py-1"
          >
            {t('common.back_home')}
          </button>
          <button
            onClick={toggleLocale}
            className="text-xs border border-border px-2.5 py-1 hover:bg-foreground hover:text-background transition-colors focus:outline-none focus:ring-1 focus:ring-foreground"
            aria-label="Toggle language"
          >
            [{locale.toUpperCase()}]
          </button>
        </div>
      </header>

      {/* Main Auth Content Container */}
      <main id="main-content" className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-[480px] bg-card border border-border p-6 sm:p-8 shadow-sm">
          {children}
        </div>
      </main>

      {/* Auth Footer */}
      <footer className="w-full border-t border-border py-4 px-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 {t('common.brand')}. {t('common.tagline')}</span>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('/privacy')}
            className="hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            [Privacy]
          </button>
          <button
            onClick={() => onNavigate('/terms')}
            className="hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            [Terms]
          </button>
        </div>
      </footer>
    </div>
  );
}
