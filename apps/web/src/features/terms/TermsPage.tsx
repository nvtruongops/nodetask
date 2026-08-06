import { useEffect, useState } from 'react';
import { getTermsContent } from './content';
import { PublicLayoutShell } from '../../components/layout/PublicLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useAuthStore } from '../../store/useAuthStore';

interface TermsPageProps {
  onNavigate?: (path: string) => void;
}

export function TermsPage({ onNavigate }: TermsPageProps) {
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
    document.title = 'Terms of Service - nodetask';
  }, []);

  // IntersectionObserver for active section tracking (Synchronized with PrivacyPage)
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
    <PublicLayoutShell currentPath="/terms" onNavigate={handleNavigate}>
      {/* a11y Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-foreground text-background px-4 py-2 text-xs font-mono uppercase tracking-widest z-50 border border-foreground"
      >
        Skip to Content
      </a>

      {/* Container Token: container.content (Documentation / Legal Spec Archetype) */}
      <main id="main-content" role="main" className="max-w-[clamp(900px,92vw,1300px)] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-12 md:py-16 font-mono">
        {/* Document Control Hero (Synchronized with PrivacyPage) */}
        <section className="space-y-8 border-b border-border pb-12">
          {/* Metadata Control Bar */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="px-2.5 py-1 border border-border bg-muted/20 text-foreground font-bold">
              {getTermsContent('terms.hero.badge', locale)}
            </span>
            <span className="px-2.5 py-1 border border-border/70 bg-card">
              {getTermsContent('terms.meta.effective', locale)}
            </span>
            <span className="px-2.5 py-1 border border-border/70 bg-card">
              {getTermsContent('terms.meta.version', locale)}
            </span>
            <span className="px-2.5 py-1 border border-border/70 bg-card">
              {getTermsContent('terms.meta.status', locale)}
            </span>
          </div>

          {/* Editorial Title & Subtitle */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] uppercase text-foreground whitespace-pre-line [text-wrap:balance]">
              {getTermsContent('terms.hero.title', locale)}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-3xl font-normal leading-relaxed whitespace-pre-line [text-wrap:pretty]">
              {getTermsContent('terms.hero.subheading', locale)}
            </p>
          </div>

          {/* Key Agreement Bento Grid (3 Pillars) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <article className="p-5 border border-border bg-card space-y-2">
              <header className="text-[10px] text-muted-foreground uppercase tracking-widest">[ PILLAR_01 ]</header>
              <div className="text-sm font-bold text-foreground uppercase tracking-tight">
                {getTermsContent('terms.pillar.use.title', locale)}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getTermsContent('terms.pillar.use.desc', locale)}
              </p>
            </article>

            <article className="p-5 border border-border bg-card space-y-2">
              <header className="text-[10px] text-muted-foreground uppercase tracking-widest">[ PILLAR_02 ]</header>
              <div className="text-sm font-bold text-foreground uppercase tracking-tight">
                {getTermsContent('terms.pillar.ip.title', locale)}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getTermsContent('terms.pillar.ip.desc', locale)}
              </p>
            </article>

            <article className="p-5 border border-border bg-card space-y-2">
              <header className="text-[10px] text-muted-foreground uppercase tracking-widest">[ PILLAR_03 ]</header>
              <div className="text-sm font-bold text-foreground uppercase tracking-tight">
                {getTermsContent('terms.pillar.sla.title', locale)}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getTermsContent('terms.pillar.sla.desc', locale)}
              </p>
            </article>
          </div>
        </section>

        {/* 2-Column Main Layout: Sticky Sidebar Navigation + Article Content (Identical to PrivacyPage) */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 space-y-12 lg:space-y-0 items-start">
          {/* Sticky Navigation Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <nav aria-label="Terms of Service Navigation Index" className="border border-border bg-card p-6 space-y-6">
              <div className="text-xs font-bold uppercase tracking-widest text-foreground pb-3 border-b border-border flex items-center justify-between">
                <span>[ TERMS SECTIONS INDEX ]</span>
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
                    {getTermsContent('terms.tab.sec1', locale)}
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
                    {getTermsContent('terms.tab.sec2', locale)}
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
                    {getTermsContent('terms.tab.sec3', locale)}
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
                    {getTermsContent('terms.tab.sec4', locale)}
                  </button>
                </li>
              </ul>

              <div className="pt-4 border-t border-border flex flex-col space-y-3">
                <button
                  onClick={scrollToTop}
                  className="w-full text-center py-2 px-3 border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground transition-colors uppercase tracking-wider font-bold"
                >
                  [ BACK TO TOP ]
                </button>
                <div className="text-[10px] text-muted-foreground text-center tracking-widest uppercase">
                  [ CHECKSUM: SHA256-NODETASK-TERMS ]
                </div>
              </div>
            </nav>
          </aside>

          {/* Article Main Body */}
          <article role="article" className="lg:col-span-8 space-y-12 text-sm sm:text-base leading-relaxed">
            {/* Section 1 */}
            <section id="sec-1" className="p-6 md:p-8 border border-border bg-card space-y-4 scroll-mt-28">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/80 pb-3">
                <span className="font-bold text-foreground">{getTermsContent('terms.sec1.tag', locale)}</span>
                <span>[ TERM_01 ]</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground whitespace-pre-line [text-wrap:balance]">
                {getTermsContent('terms.sec1.title', locale)}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getTermsContent('terms.sec1.body', locale)}
              </p>
            </section>

            {/* Section 2 */}
            <section id="sec-2" className="p-6 md:p-8 border border-border bg-card space-y-4 scroll-mt-28">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/80 pb-3">
                <span className="font-bold text-foreground">{getTermsContent('terms.sec2.tag', locale)}</span>
                <span>[ TERM_02 ]</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground whitespace-pre-line [text-wrap:balance]">
                {getTermsContent('terms.sec2.title', locale)}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getTermsContent('terms.sec2.body', locale)}
              </p>
            </section>

            {/* Section 3 */}
            <section id="sec-3" className="p-6 md:p-8 border border-border bg-card space-y-4 scroll-mt-28">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/80 pb-3">
                <span className="font-bold text-foreground">{getTermsContent('terms.sec3.tag', locale)}</span>
                <span>[ TERM_03 ]</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground whitespace-pre-line [text-wrap:balance]">
                {getTermsContent('terms.sec3.title', locale)}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getTermsContent('terms.sec3.body', locale)}
              </p>
            </section>

            {/* Section 4 */}
            <section id="sec-4" className="p-6 md:p-8 border border-border bg-card space-y-4 scroll-mt-28">
              <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/80 pb-3">
                <span className="font-bold text-foreground">{getTermsContent('terms.sec4.tag', locale)}</span>
                <span>[ TERM_04 ]</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground whitespace-pre-line [text-wrap:balance]">
                {getTermsContent('terms.sec4.title', locale)}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getTermsContent('terms.sec4.body', locale)}
              </p>
            </section>

            {/* SpecificationPanel / Binding Notice Box */}
            <div className="p-6 md:p-8 border-2 border-foreground bg-foreground/5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-foreground">
                {getTermsContent('terms.callout.title', locale)}
              </div>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                {getTermsContent('terms.callout.body', locale)}
              </p>
            </div>
          </article>
        </div>

        {/* Footer Navigation Actions */}
        <section className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => handleNavigate('/')}
            className="w-full sm:w-auto px-6 py-3.5 border border-border text-foreground hover:bg-muted/50 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            {getTermsContent('terms.footer.cta_back', locale)}
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => handleNavigate('/workspace')}
              className="w-full sm:w-auto px-8 py-3.5 bg-foreground text-background font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity border border-foreground"
            >
              {getTermsContent('terms.footer.cta_workspace', locale)}
            </button>
          ) : (
            <button
              onClick={() => handleNavigate('/auth/register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-foreground text-background font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity border border-foreground"
            >
              {getTermsContent('terms.footer.cta_register', locale)}
            </button>
          )}
        </section>
      </main>
    </PublicLayoutShell>
  );
}

export default TermsPage;
