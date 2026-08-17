import { ReactNode, useEffect, useState } from 'react';
import { getLandingContent } from '../../features/landing/content';
import { useThemeStore } from '../../store/useThemeStore';
import { useLanguageStore } from '../../store/useLanguageStore';

interface PublicLayoutShellProps {
  children: ReactNode;
  onNavigate?: (path: string) => void;
  currentPath?: string;
}

export function PublicLayoutShell({ children, onNavigate, currentPath }: PublicLayoutShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { locale, toggleLocale } = useLanguageStore();

  const [activePath, setActivePath] = useState<string>(() => {
    if (currentPath) return currentPath;
    if (typeof window !== 'undefined') {
      return window.location.hash.replace('#', '') || '/';
    }
    return '/';
  });

  useEffect(() => {
    if (currentPath) {
      setActivePath(currentPath);
      return;
    }
    const handleHashChange = () => {
      const path = window.location.hash.replace('#', '') || '/';
      setActivePath(path);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPath]);

  const handleNavClick = (path: string) => {
    setActivePath(path);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = path;
    }
    setIsMobileMenuOpen(false);
  };

  const isNavActive = (path: string) => {
    if (path === '/') {
      return activePath === '/' || activePath === '';
    }
    return activePath === path;
  };

  const getThemeLabel = () => {
    if (theme === 'dark') return getLandingContent('nav.theme_dark', locale);
    if (theme === 'light') return getLandingContent('nav.theme_light', locale);
    return getLandingContent('nav.theme_system', locale);
  };

  const getLanguageLabel = () => {
    return locale.toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-mono selection:bg-foreground selection:text-background transition-colors duration-200">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-foreground focus:text-background font-bold tracking-wider"
      >
        Skip to Content
      </a>

      {/* Public Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur backdrop-filter">
        <div className="max-w-[clamp(1000px,92vw,1400px)] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 lg:gap-4 overflow-hidden">
          {/* Brand Logo Link */}
          <button
            onClick={() => handleNavClick('/')}
            aria-label={getLandingContent('brand.logo.aria', locale)}
            className="text-xs sm:text-sm font-bold tracking-tight hover:opacity-80 transition-opacity text-left shrink-0"
          >
            <span className="font-mono font-bold tracking-wider">[{getLandingContent('brand.logo.text', locale)}]</span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-4 text-xs uppercase tracking-wider shrink-0">
            <button
              onClick={() => handleNavClick('/')}
              className={`transition-colors shrink-0 ${
                isNavActive('/')
                  ? 'font-bold text-foreground border-b-2 border-foreground pb-0.5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {getLandingContent('nav.landing', locale)}
            </button>
            <button
              onClick={() => handleNavClick('/about')}
              aria-label="About page"
              className={`transition-colors shrink-0 ${
                isNavActive('/about')
                  ? 'font-bold text-foreground border-b-2 border-foreground pb-0.5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {getLandingContent('nav.about', locale)}
            </button>
            <button
              onClick={() => handleNavClick('/privacy')}
              aria-label="Privacy page"
              className={`transition-colors shrink-0 ${
                isNavActive('/privacy')
                  ? 'font-bold text-foreground border-b-2 border-foreground pb-0.5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {getLandingContent('nav.privacy', locale)}
            </button>
            <button
              onClick={() => handleNavClick('/terms')}
              aria-label="Terms page"
              className={`transition-colors shrink-0 ${
                isNavActive('/terms')
                  ? 'font-bold text-foreground border-b-2 border-foreground pb-0.5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {getLandingContent('nav.terms', locale)}
            </button>
            <button
              onClick={() => handleNavClick('/contact')}
              aria-label="Contact page"
              className={`transition-colors shrink-0 ${
                isNavActive('/contact')
                  ? 'font-bold text-foreground border-b-2 border-foreground pb-0.5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {getLandingContent('footer.contact', locale)}
            </button>
          </nav>


          {/* Desktop Header Controls & CTAs */}
          <div className="hidden md:flex items-center space-x-2 xl:space-x-3 text-xs uppercase tracking-wider font-semibold shrink-0">
            {/* Theme Switcher Button */}
            <button
              onClick={toggleTheme}
              aria-label={getLandingContent('nav.theme_toggle_aria', locale)}
              title="Toggle Theme"
              className="px-2.5 py-1.5 border border-border hover:border-foreground transition-colors text-[11px] whitespace-nowrap shrink-0"
            >
              [THEME: {getThemeLabel()}]
            </button>

            {/* Language Switcher Button */}
            <button
              onClick={toggleLocale}
              aria-label={getLandingContent('nav.language_switcher_aria', locale)}
              title={locale === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              className="px-2.5 py-1.5 border border-border hover:border-foreground transition-colors text-[11px] whitespace-nowrap shrink-0"
            >
              [LANG: {getLanguageLabel()}]
            </button>

            {/* Auth CTAs */}
            <button
              onClick={() => handleNavClick('/auth/login')}
              className="px-3 py-1.5 border border-border hover:border-foreground transition-colors whitespace-nowrap shrink-0"
            >
              {getLandingContent('nav.login', locale)}
            </button>
            <button
              onClick={() => handleNavClick('/auth/register')}
              className="px-3 py-1.5 bg-foreground text-background hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
            >
              {getLandingContent('nav.register', locale)}
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center space-x-2 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label={getLandingContent('nav.theme_toggle_aria', locale)}
              className="px-2 py-1 border border-border text-[11px] font-bold"
            >
              [{getThemeLabel()}]
            </button>
            <button
              onClick={toggleLocale}
              aria-label={getLandingContent('nav.language_switcher_aria', locale)}
              className="px-2 py-1 border border-border text-[11px] font-bold"
            >
              [{getLanguageLabel()}]
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              className="px-2.5 py-1 border border-border text-xs uppercase tracking-wider font-bold"
            >
              {isMobileMenuOpen ? '[CLOSE]' : getLandingContent('nav.mobile_toggle', locale)}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-4 space-y-3 text-xs uppercase tracking-wider">
            <button
              onClick={() => handleNavClick('/')}
              className={`block w-full text-left py-2 font-bold ${
                isNavActive('/') ? 'text-foreground underline' : 'text-muted-foreground'
              }`}
            >
              {getLandingContent('nav.landing', locale)}
            </button>
            <button
              onClick={() => handleNavClick('/about')}
              aria-label="About page mobile"
              className={`block w-full text-left py-2 font-bold ${
                isNavActive('/about') ? 'text-foreground underline' : 'text-muted-foreground'
              }`}
            >
              {getLandingContent('nav.about', locale)}
            </button>
            <button
              onClick={() => handleNavClick('/privacy')}
              aria-label="Privacy page mobile"
              className={`block w-full text-left py-2 font-bold ${
                isNavActive('/privacy') ? 'text-foreground underline' : 'text-muted-foreground'
              }`}
            >
              {getLandingContent('nav.privacy', locale)}
            </button>
            <button
              onClick={() => handleNavClick('/terms')}
              aria-label="Terms page mobile"
              className={`block w-full text-left py-2 font-bold ${
                isNavActive('/terms') ? 'text-foreground underline' : 'text-muted-foreground'
              }`}
            >
              {getLandingContent('nav.terms', locale)}
            </button>
            <button
              onClick={() => handleNavClick('/contact')}
              aria-label="Contact page mobile"
              className={`block w-full text-left py-2 font-bold ${
                isNavActive('/contact') ? 'text-foreground underline' : 'text-muted-foreground'
              }`}
            >
              {getLandingContent('footer.contact', locale)}
            </button>

            <div className="pt-2 border-t border-border flex flex-col space-y-2 font-semibold">
              <button
                onClick={() => handleNavClick('/auth/login')}
                className="w-full py-2 border border-border text-center"
              >
                {getLandingContent('nav.login', locale)}
              </button>
              <button
                onClick={() => handleNavClick('/auth/register')}
                className="w-full py-2 bg-foreground text-background text-center"
              >
                {getLandingContent('nav.register', locale)}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>

      {/* Public Footer */}
      <footer className="border-t border-border bg-background py-8 text-xs text-muted-foreground font-mono">
        <div className="max-w-[clamp(1000px,92vw,1400px)] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col space-y-1 text-center md:text-left">
            <p className="font-bold text-foreground">{getLandingContent('brand.logo.text', locale)}</p>
            <p>{getLandingContent('footer.copyright', locale)}</p>
            <p className="text-[11px] opacity-70">{getLandingContent('footer.build_info', locale)}</p>
          </div>

          {/* Footer Theme & Language Controls */}
          <div className="flex items-center space-x-2 text-[11px]">
            <button
              onClick={toggleTheme}
              className="px-2 py-1 border border-border hover:border-foreground transition-colors"
            >
              [THEME: {getThemeLabel()}]
            </button>
            <button
              onClick={toggleLocale}
              className="px-2 py-1 border border-border hover:border-foreground transition-colors"
            >
              [LANG: {getLanguageLabel()}]
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <button
              onClick={() => handleNavClick('/privacy')}
              className="hover:text-foreground hover:underline transition-colors"
            >
              {getLandingContent('footer.privacy', locale)}
            </button>
            <button
              onClick={() => handleNavClick('/terms')}
              className="hover:text-foreground hover:underline transition-colors"
            >
              {getLandingContent('footer.terms', locale)}
            </button>
            <a
              href="https://github.com/nvtruongops/nodetask"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground hover:underline transition-colors"
            >
              {getLandingContent('footer.github', locale)}
            </a>
            <button
              onClick={() => handleNavClick('/contact')}
              className="hover:text-foreground hover:underline transition-colors"
            >
              {getLandingContent('footer.contact', locale)}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayoutShell;
