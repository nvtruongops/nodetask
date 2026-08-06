import { useEffect } from 'react';
import { getLandingContent } from './content';
import { PublicLayoutShell } from '../../components/layout/PublicLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useAuthStore } from '../../store/useAuthStore';

interface LandingPageProps {
  onNavigate?: (path: string) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const { locale } = useLanguageStore();
  const { isAuthenticated } = useAuthStore();

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = path;
    }
  };

  // Auth Guard & Document Title Setup per landing.md spec
  useEffect(() => {
    document.title = 'nodetask - Monorepo Document & Knowledge Space Management';
    if (isAuthenticated) {
      handleNavigate('/workspace');
    }
  }, [isAuthenticated]);


  return (
    <PublicLayoutShell onNavigate={handleNavigate}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12 md:py-20 font-mono">
        {/* Hero Section */}
        <section className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto pt-8">
          {/* Hero Badge */}
          <div className="inline-block px-3 py-1 border border-border text-[11px] uppercase tracking-widest text-muted-foreground bg-muted/20">
            {getLandingContent('hero.badge', locale)}
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] uppercase max-w-4xl lg:max-w-5xl mx-auto [text-wrap:balance]">
            {getLandingContent('hero.heading', locale)}
          </h1>

          {/* Hero Subheading */}
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl font-normal leading-relaxed">
            {getLandingContent('hero.subheading', locale)}
          </p>

          {/* Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            <button
              onClick={() => handleNavigate('/auth/register')}
              className="w-full sm:w-auto px-8 py-3 bg-foreground text-background font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity border border-foreground"
            >
              {getLandingContent('hero.cta.primary', locale)}
            </button>
            <button
              onClick={() => handleNavigate('/demo')}
              className="w-full sm:w-auto px-8 py-3 bg-background text-foreground font-bold text-sm uppercase tracking-wider border border-border hover:border-foreground transition-colors"
            >
              {getLandingContent('hero.cta.secondary', locale)}
            </button>
          </div>
        </section>

        {/* Feature Matrix Grid */}
        <section className="space-y-8">
          <div className="border-b border-border pb-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
              {getLandingContent('feature.matrix_title', locale)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature Card 1: Tree Engine */}
            <div className="p-6 border border-border bg-card hover:border-foreground transition-colors space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground font-bold">[01]</div>
                <h3 className="text-base font-bold uppercase tracking-tight">
                  {getLandingContent('feature.tree_engine.title', locale)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {getLandingContent('feature.tree_engine.desc', locale)}
                </p>
              </div>
              <div className="pt-4 text-[11px] text-muted-foreground uppercase border-t border-border/50">
                PostgreSQL LTREE
              </div>
            </div>

            {/* Feature Card 2: AST Editor */}
            <div className="p-6 border border-border bg-card hover:border-foreground transition-colors space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground font-bold">[02]</div>
                <h3 className="text-base font-bold uppercase tracking-tight">
                  {getLandingContent('feature.ast_editor.title', locale)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {getLandingContent('feature.ast_editor.desc', locale)}
                </p>
              </div>
              <div className="pt-4 text-[11px] text-muted-foreground uppercase border-t border-border/50">
                Tiptap Block AST
              </div>
            </div>

            {/* Feature Card 3: Zero-Icon UI */}
            <div className="p-6 border border-border bg-card hover:border-foreground transition-colors space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground font-bold">[03]</div>
                <h3 className="text-base font-bold uppercase tracking-tight">
                  {getLandingContent('feature.zero_icon_ui.title', locale)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {getLandingContent('feature.zero_icon_ui.desc', locale)}
                </p>
              </div>
              <div className="pt-4 text-[11px] text-muted-foreground uppercase border-t border-border/50">
                Strict Monochrome
              </div>
            </div>

            {/* Feature Card 4: AI RAG */}
            <div className="p-6 border border-border bg-card hover:border-foreground transition-colors space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground font-bold">[04]</div>
                <h3 className="text-base font-bold uppercase tracking-tight">
                  {getLandingContent('feature.ai_rag.title', locale)}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {getLandingContent('feature.ai_rag.desc', locale)}
                </p>
              </div>
              <div className="pt-4 text-[11px] text-muted-foreground uppercase border-t border-border/50">
                Native pgvector HNSW
              </div>
            </div>
          </div>
        </section>

        {/* Technical Comparison Matrix Table */}
        <section className="space-y-8 pb-12">
          <div className="border-b border-border pb-4">
            <h2 className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
              {getLandingContent('comparison.title', locale)}
            </h2>
          </div>

          <div className="overflow-x-auto border border-border">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20 uppercase tracking-wider text-muted-foreground font-bold">
                  <th className="p-4 border-r border-border w-1/3">{getLandingContent('comparison.col.dimension', locale)}</th>
                  <th className="p-4 border-r border-border w-1/3">{getLandingContent('comparison.col.generic', locale)}</th>
                  <th className="p-4 w-1/3 text-foreground font-bold">{getLandingContent('comparison.col.nodetask', locale)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                <tr className="hover:bg-muted/10">
                  <td className="p-4 border-r border-border font-semibold">{getLandingContent('comparison.row.hierarchy.label', locale)}</td>
                  <td className="p-4 border-r border-border text-muted-foreground">{getLandingContent('comparison.row.hierarchy.generic', locale)}</td>
                  <td className="p-4 font-semibold">{getLandingContent('comparison.row.hierarchy.nodetask', locale)}</td>
                </tr>
                <tr className="hover:bg-muted/10">
                  <td className="p-4 border-r border-border font-semibold">{getLandingContent('comparison.row.format.label', locale)}</td>
                  <td className="p-4 border-r border-border text-muted-foreground">{getLandingContent('comparison.row.format.generic', locale)}</td>
                  <td className="p-4 font-semibold">{getLandingContent('comparison.row.format.nodetask', locale)}</td>
                </tr>
                <tr className="hover:bg-muted/10">
                  <td className="p-4 border-r border-border font-semibold">{getLandingContent('comparison.row.ui.label', locale)}</td>
                  <td className="p-4 border-r border-border text-muted-foreground">{getLandingContent('comparison.row.ui.generic', locale)}</td>
                  <td className="p-4 font-semibold">{getLandingContent('comparison.row.ui.nodetask', locale)}</td>
                </tr>
                <tr className="hover:bg-muted/10">
                  <td className="p-4 border-r border-border font-semibold">{getLandingContent('comparison.row.theme.label', locale)}</td>
                  <td className="p-4 border-r border-border text-muted-foreground">{getLandingContent('comparison.row.theme.generic', locale)}</td>
                  <td className="p-4 font-semibold">{getLandingContent('comparison.row.theme.nodetask', locale)}</td>
                </tr>
                <tr className="hover:bg-muted/10">
                  <td className="p-4 border-r border-border font-semibold">{getLandingContent('comparison.row.vector.label', locale)}</td>
                  <td className="p-4 border-r border-border text-muted-foreground">{getLandingContent('comparison.row.vector.generic', locale)}</td>
                  <td className="p-4 font-semibold">{getLandingContent('comparison.row.vector.nodetask', locale)}</td>
                </tr>
                <tr className="hover:bg-muted/10">
                  <td className="p-4 border-r border-border font-semibold">{getLandingContent('comparison.row.sync.label', locale)}</td>
                  <td className="p-4 border-r border-border text-muted-foreground">{getLandingContent('comparison.row.sync.generic', locale)}</td>
                  <td className="p-4 font-semibold">{getLandingContent('comparison.row.sync.nodetask', locale)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PublicLayoutShell>
  );
}
