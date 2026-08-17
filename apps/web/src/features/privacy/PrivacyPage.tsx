import { useEffect, useState } from 'react';
import { getPrivacyContent } from './content';
import { PublicLayoutShell } from '../../components/layout/PublicLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useAuthStore } from '../../store/useAuthStore';

interface PrivacyPageProps {
  onNavigate?: (path: string) => void;
}

export function PrivacyPage({ onNavigate }: PrivacyPageProps) {
  const { locale } = useLanguageStore();
  const { isAuthenticated } = useAuthStore();
  const [activeSection, setActiveSection] = useState<string>('sec-1');

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = path;
    }
  };

  useEffect(() => {
    document.title = 'nodetask | Privacy';
  }, []);

  // IntersectionObserver for active section tracking
  useEffect(() => {
    const sectionIds = ['sec-1', 'sec-2', 'sec-3', 'sec-4'];
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <PublicLayoutShell currentPath="/privacy" onNavigate={handleNavigate}>
      {/* a11y Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-foreground text-background px-4 py-2 text-xs font-mono uppercase tracking-widest z-50 border border-foreground"
      >
        Skip to Content
      </a>

      <main id="main-content" role="main" className="max-w-[clamp(900px,92vw,1300px)] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12 md:py-16 font-mono">
        {/* Document Control Hero Section */}
        <section className="space-y-8 border-b border-border pb-12">
          {/* Metadata Control Bar */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="px-2.5 py-1 border border-border bg-muted/20 text-foreground font-bold">
              {getPrivacyContent('privacy.hero.badge', locale)}
            </span>
            <span className="px-2.5 py-1 border border-border/70 bg-card">
              {getPrivacyContent('privacy.meta.effective', locale)}
            </span>
            <span className="px-2.5 py-1 border border-border/70 bg-card">
              {getPrivacyContent('privacy.meta.version', locale)}
            </span>
            <span className="px-2.5 py-1 border border-border/70 bg-card">
              {getPrivacyContent('privacy.meta.status', locale)}
            </span>
          </div>

          {/* Editorial Title & Subtitle */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] uppercase text-foreground whitespace-pre-line [text-wrap:balance]">
              {getPrivacyContent('privacy.hero.title', locale)}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl font-normal leading-relaxed whitespace-pre-line [text-wrap:pretty]">
              {getPrivacyContent('privacy.hero.subheading', locale)}
            </p>
          </div>

          {/* Quick Technical Specs Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
            <article className="p-4 border border-border bg-card space-y-1">
              <header className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {getPrivacyContent('privacy.stats.encryption.label', locale)}
              </header>
              <div className="text-xs sm:text-sm font-bold text-foreground">
                {getPrivacyContent('privacy.stats.encryption.val', locale)}
              </div>
            </article>
            <article className="p-4 border border-border bg-card space-y-1">
              <header className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {getPrivacyContent('privacy.stats.rbac.label', locale)}
              </header>
              <div className="text-xs sm:text-sm font-bold text-foreground">
                {getPrivacyContent('privacy.stats.rbac.val', locale)}
              </div>
            </article>
            <article className="p-4 border border-border bg-card space-y-1">
              <header className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {getPrivacyContent('privacy.stats.retention.label', locale)}
              </header>
              <div className="text-xs sm:text-sm font-bold text-foreground">
                {getPrivacyContent('privacy.stats.retention.val', locale)}
              </div>
            </article>
            <article className="p-4 border border-border bg-card space-y-1">
              <header className="text-[10px] text-muted-foreground uppercase tracking-widest">
                {getPrivacyContent('privacy.stats.export.label', locale)}
              </header>
              <div className="text-xs sm:text-sm font-bold text-foreground">
                {getPrivacyContent('privacy.stats.export.val', locale)}
              </div>
            </article>
          </div>
        </section>

        {/* 2-Column Main Layout: Sticky Sidebar Navigation + Article Content */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 space-y-12 lg:space-y-0 items-start">
          {/* Sticky Navigation Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <nav aria-label="Privacy Policy Navigation Index" className="border border-border bg-card p-6 space-y-6">
              <div className="text-xs font-bold uppercase tracking-widest text-foreground pb-3 border-b border-border flex items-center justify-between">
                <span>{getPrivacyContent('privacy.toc.title', locale)}</span>
                <span className="text-[10px] text-muted-foreground font-normal">[ 4 SECTIONS ]</span>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => scrollToSection('sec-1')}
                    className={`w-full text-left p-2.5 transition-colors border ${
                      activeSection === 'sec-1'
                        ? 'bg-foreground text-background font-bold border-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border-transparent'
                    }`}
                  >
                    <span className="mr-2 font-mono">{activeSection === 'sec-1' ? '[▸]' : '[ ]'}</span>
                    {getPrivacyContent('privacy.toc.sec1', locale)}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('sec-2')}
                    className={`w-full text-left p-2.5 transition-colors border ${
                      activeSection === 'sec-2'
                        ? 'bg-foreground text-background font-bold border-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border-transparent'
                    }`}
                  >
                    <span className="mr-2 font-mono">{activeSection === 'sec-2' ? '[▸]' : '[ ]'}</span>
                    {getPrivacyContent('privacy.toc.sec2', locale)}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('sec-3')}
                    className={`w-full text-left p-2.5 transition-colors border ${
                      activeSection === 'sec-3'
                        ? 'bg-foreground text-background font-bold border-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border-transparent'
                    }`}
                  >
                    <span className="mr-2 font-mono">{activeSection === 'sec-3' ? '[▸]' : '[ ]'}</span>
                    {getPrivacyContent('privacy.toc.sec3', locale)}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('sec-4')}
                    className={`w-full text-left p-2.5 transition-colors border ${
                      activeSection === 'sec-4'
                        ? 'bg-foreground text-background font-bold border-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border-transparent'
                    }`}
                  >
                    <span className="mr-2 font-mono">{activeSection === 'sec-4' ? '[▸]' : '[ ]'}</span>
                    {getPrivacyContent('privacy.toc.sec4', locale)}
                  </button>
                </li>
              </ul>

              <div className="pt-4 border-t border-border flex flex-col space-y-3">
                <button
                  onClick={scrollToTop}
                  className="w-full text-center py-2 px-3 border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors uppercase tracking-wider font-bold"
                >
                  {getPrivacyContent('privacy.back_to_top', locale)}
                </button>
                <div className="text-[10px] text-muted-foreground text-center tracking-widest uppercase">
                  [ CHECKSUM: SHA256-NODETASK-PRIVACY ]
                </div>
              </div>
            </nav>
          </aside>

          {/* Article Main Body */}
          <article role="article" className="lg:col-span-8 space-y-12 text-sm sm:text-base leading-relaxed">
            {/* Section 1 */}
            <section id="sec-1" className="p-6 md:p-8 border border-border bg-card space-y-4 scroll-mt-28">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/80 pb-3">
                <span className="font-bold text-foreground">{getPrivacyContent('privacy.sec1.tag', locale)}</span>
                <span>[ SEC_01 ]</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground whitespace-pre-line [text-wrap:balance]">
                {getPrivacyContent('privacy.sec1.title', locale)}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getPrivacyContent('privacy.sec1.body', locale)}
              </p>
            </section>

            {/* Section 2 */}
            <section id="sec-2" className="p-6 md:p-8 border border-border bg-card space-y-4 scroll-mt-28">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/80 pb-3">
                <span className="font-bold text-foreground">{getPrivacyContent('privacy.sec2.tag', locale)}</span>
                <span>[ SEC_02 ]</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground whitespace-pre-line [text-wrap:balance]">
                {getPrivacyContent('privacy.sec2.title', locale)}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getPrivacyContent('privacy.sec2.body', locale)}
              </p>
            </section>

            {/* Guaranteed Commitment Callout Box */}
            <div className="p-6 md:p-8 border-2 border-foreground bg-foreground/5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-foreground">
                {getPrivacyContent('privacy.callout.title', locale)}
              </div>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getPrivacyContent('privacy.callout.body', locale)}
              </p>
            </div>

            {/* Section 3 */}
            <section id="sec-3" className="p-6 md:p-8 border border-border bg-card space-y-4 scroll-mt-28">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/80 pb-3">
                <span className="font-bold text-foreground">{getPrivacyContent('privacy.sec3.tag', locale)}</span>
                <span>[ SEC_03 ]</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground whitespace-pre-line [text-wrap:balance]">
                {getPrivacyContent('privacy.sec3.title', locale)}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getPrivacyContent('privacy.sec3.body', locale)}
              </p>
            </section>

            {/* Section 4 */}
            <section id="sec-4" className="p-6 md:p-8 border border-border bg-card space-y-4 scroll-mt-28">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/80 pb-3">
                <span className="font-bold text-foreground">{getPrivacyContent('privacy.sec4.tag', locale)}</span>
                <span>[ SEC_04 ]</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground whitespace-pre-line [text-wrap:balance]">
                {getPrivacyContent('privacy.sec4.title', locale)}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getPrivacyContent('privacy.sec4.body', locale)}
              </p>
            </section>
          </article>
        </div>

        {/* Footer Navigation CTAs */}
        <section className="pt-10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => handleNavigate('/')}
            className="w-full sm:w-auto px-6 py-3.5 border border-border text-foreground hover:bg-muted/50 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            {getPrivacyContent('privacy.footer.cta_back', locale)}
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => handleNavigate('/workspace')}
              className="w-full sm:w-auto px-8 py-3.5 bg-foreground text-background font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity border border-foreground"
            >
              {getPrivacyContent('privacy.footer.cta_workspace', locale)}
            </button>
          ) : (
            <button
              onClick={() => handleNavigate('/auth/register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-foreground text-background font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity border border-foreground"
            >
              {getPrivacyContent('privacy.footer.cta_register', locale)}
            </button>
          )}
        </section>
      </main>
    </PublicLayoutShell>
  );
}

export default PrivacyPage;
