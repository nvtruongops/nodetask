import { useEffect } from 'react';
import { getAboutContent } from './content';
import { PublicLayoutShell } from '../../components/layout/PublicLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useAuthStore } from '../../store/useAuthStore';

interface AboutPageProps {
  onNavigate?: (path: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const { locale } = useLanguageStore();
  const { isAuthenticated } = useAuthStore();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = path;
    }
  };

  useEffect(() => {
    document.title = 'About nodetask - Architecture & Core Principles';
  }, []);

  return (
    <PublicLayoutShell currentPath="/about" onNavigate={handleNavigate}>
      {/* Container Token: container.article (80ch / clamp(800px, 90vw, 1100px)) */}
      <main id="main-content" role="main" className="max-w-[clamp(800px,90vw,1100px)] mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12 md:py-20 font-mono">
        {/* Section 1: Hero Component */}
        <section className="min-h-[55vh] flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto pt-4">
          <div className="inline-block px-3 py-1 border border-border text-[11px] uppercase tracking-widest text-muted-foreground bg-muted/20">
            {getAboutContent('about.hero.badge', locale)}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] uppercase max-w-4xl mx-auto whitespace-pre-line [text-wrap:balance]">
            {getAboutContent('about.hero.title', locale)}
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl font-normal leading-relaxed whitespace-pre-line [text-wrap:pretty]">
            {getAboutContent('about.hero.subheading', locale)}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            {isAuthenticated ? (
              <button
                onClick={() => handleNavigate('/workspace')}
                className="w-full sm:w-auto px-8 py-3 bg-foreground text-background font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity border border-foreground"
              >
                {getAboutContent('about.hero.cta_workspace', locale)}
              </button>
            ) : (
              <button
                onClick={() => handleNavigate('/auth/register')}
                className="w-full sm:w-auto px-8 py-3 bg-foreground text-background font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity border border-foreground"
              >
                {getAboutContent('about.hero.cta_register', locale)}
              </button>
            )}
          </div>
        </section>

        {/* Section 2: Technical Stack Grid (TechnicalCard Components) */}
        <section className="space-y-8">
          <div className="border-b border-border pb-4 flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
              {getAboutContent('about.tech.title', locale)}
            </h2>
            <span className="text-[10px] text-muted-foreground">[ 5 CORE COMPONENTS ]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tech 1 */}
            <article className="p-6 border border-border bg-card hover:border-foreground transition-colors space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <header className="text-xs text-muted-foreground font-bold">[01 // DATABASE]</header>
                <h3 className="text-base font-bold uppercase tracking-tight">
                  {getAboutContent('about.tech.ltree.title', locale)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                  {getAboutContent('about.tech.ltree.desc', locale)}
                </p>
              </div>
              <footer className="pt-4 text-[11px] text-muted-foreground uppercase border-t border-border/50">
                PATH INDEXING & HIERARCHY
              </footer>
            </article>

            {/* Tech 2 */}
            <article className="p-6 border border-border bg-card hover:border-foreground transition-colors space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <header className="text-xs text-muted-foreground font-bold">[02 // BACKEND]</header>
                <h3 className="text-base font-bold uppercase tracking-tight">
                  {getAboutContent('about.tech.serverpod.title', locale)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                  {getAboutContent('about.tech.serverpod.desc', locale)}
                </p>
              </div>
              <footer className="pt-4 text-[11px] text-muted-foreground uppercase border-t border-border/50">
                DART RPC & WEBSOCKET STREAMING
              </footer>
            </article>

            {/* Tech 3 */}
            <article className="p-6 border border-border bg-card hover:border-foreground transition-colors space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <header className="text-xs text-muted-foreground font-bold">[03 // EDITOR]</header>
                <h3 className="text-base font-bold uppercase tracking-tight">
                  {getAboutContent('about.tech.tiptap.title', locale)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                  {getAboutContent('about.tech.tiptap.desc', locale)}
                </p>
              </div>
              <footer className="pt-4 text-[11px] text-muted-foreground uppercase border-t border-border/50">
                NOTION-LIKE BLOCK AST
              </footer>
            </article>

            {/* Tech 4 */}
            <article className="p-6 border border-border bg-card hover:border-foreground transition-colors space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <header className="text-xs text-muted-foreground font-bold">[04 // UI/UX]</header>
                <h3 className="text-base font-bold uppercase tracking-tight">
                  {getAboutContent('about.tech.zero_icon.title', locale)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                  {getAboutContent('about.tech.zero_icon.desc', locale)}
                </p>
              </div>
              <footer className="pt-4 text-[11px] text-muted-foreground uppercase border-t border-border/50">
                STRICT MONOCHROME SYSTEM
              </footer>
            </article>

            {/* Tech 5 */}
            <article className="p-6 border border-border bg-card hover:border-foreground transition-colors space-y-3 flex flex-col justify-between md:col-span-2 lg:col-span-2">
              <div className="space-y-3">
                <header className="text-xs text-muted-foreground font-bold">[05 // INTELLIGENCE]</header>
                <h3 className="text-base font-bold uppercase tracking-tight">
                  {getAboutContent('about.tech.pgvector.title', locale)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                  {getAboutContent('about.tech.pgvector.desc', locale)}
                </p>
              </div>
              <footer className="pt-4 text-[11px] text-muted-foreground uppercase border-t border-border/50">
                POSTGRES HNSW VECTOR SEARCH
              </footer>
            </article>
          </div>
        </section>

        {/* Section 3: Timeline Component (Architecture Evolution) */}
        <section className="space-y-8">
          <div className="border-b border-border pb-4 flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
              {getAboutContent('about.timeline.title', locale)}
            </h2>
            <span className="text-[10px] text-muted-foreground">[ 2026 ROADMAP ]</span>
          </div>

          <div className="relative border-l-2 border-border ml-4 pl-6 space-y-10">
            {/* Milestone 1 */}
            <article className="relative group">
              <div className="absolute -left-[31px] top-1 w-3 h-3 bg-foreground border-2 border-background" />
              <header className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground bg-muted/30 px-2 py-0.5 border border-border">
                  {getAboutContent('about.timeline.m1.date', locale)}
                </span>
                <h3 className="text-sm font-bold uppercase text-foreground pt-1">
                  {getAboutContent('about.timeline.m1.title', locale)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                  {getAboutContent('about.timeline.m1.desc', locale)}
                </p>
              </header>
            </article>

            {/* Milestone 2 */}
            <article className="relative group">
              <div className="absolute -left-[31px] top-1 w-3 h-3 bg-foreground border-2 border-background" />
              <header className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground bg-muted/30 px-2 py-0.5 border border-border">
                  {getAboutContent('about.timeline.m2.date', locale)}
                </span>
                <h3 className="text-sm font-bold uppercase text-foreground pt-1">
                  {getAboutContent('about.timeline.m2.title', locale)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                  {getAboutContent('about.timeline.m2.desc', locale)}
                </p>
              </header>
            </article>

            {/* Milestone 3 */}
            <article className="relative group">
              <div className="absolute -left-[31px] top-1 w-3 h-3 bg-foreground border-2 border-background" />
              <header className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-muted-foreground bg-muted/30 px-2 py-0.5 border border-border">
                  {getAboutContent('about.timeline.m3.date', locale)}
                </span>
                <h3 className="text-sm font-bold uppercase text-foreground pt-1">
                  {getAboutContent('about.timeline.m3.title', locale)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">
                  {getAboutContent('about.timeline.m3.desc', locale)}
                </p>
              </header>
            </article>
          </div>
        </section>

        {/* Section 4: Data Lineage (SpecificationPanel Component) */}
        <section className="space-y-8 pb-12">
          <div className="border-b border-border pb-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
              {getAboutContent('about.arch.title', locale)}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {getAboutContent('about.arch.desc', locale)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="p-6 border border-border bg-card space-y-2">
              <h4 className="text-sm font-bold uppercase">{getAboutContent('about.arch.step1.title', locale)}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">{getAboutContent('about.arch.step1.desc', locale)}</p>
            </article>

            <article className="p-6 border border-border bg-card space-y-2">
              <h4 className="text-sm font-bold uppercase">{getAboutContent('about.arch.step2.title', locale)}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">{getAboutContent('about.arch.step2.desc', locale)}</p>
            </article>

            <article className="p-6 border border-border bg-card space-y-2">
              <h4 className="text-sm font-bold uppercase">{getAboutContent('about.arch.step3.title', locale)}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">{getAboutContent('about.arch.step3.desc', locale)}</p>
            </article>

            <article className="p-6 border border-border bg-card space-y-2">
              <h4 className="text-sm font-bold uppercase">{getAboutContent('about.arch.step4.title', locale)}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line [text-wrap:pretty]">{getAboutContent('about.arch.step4.desc', locale)}</p>
            </article>
          </div>
        </section>
      </main>
    </PublicLayoutShell>
  );
}

export default AboutPage;
