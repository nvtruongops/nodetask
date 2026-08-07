import React, { useState } from 'react';
import { AuthLayoutShell } from './AuthLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { getAuthContent, AuthContentKey } from './content';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { locale } = useLanguageStore();
  const t = (key: AuthContentKey) => getAuthContent(key, locale);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== rePassword) {
      setError(t('register.password_mismatch'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    }, 600);
  };

  return (
    <AuthLayoutShell onNavigate={onNavigate}>
      <article className="space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground [text-wrap:balance]">
            {t('register.title')}
          </h1>
          <p className="text-xs text-muted-foreground [text-wrap:pretty]">
            {t('register.subtitle')}
          </p>
        </header>

        {error && (
          <div className="p-3 border border-border text-xs text-foreground bg-muted">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" role="form">
          <div className="space-y-1.5">
            <label htmlFor="reg-fullname" className="block text-xs font-semibold text-foreground">
              {t('register.fullname_label')}
            </label>
            <input
              id="reg-fullname"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t('register.fullname_placeholder')}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="block text-xs font-semibold text-foreground">
              {t('register.email_label')}
            </label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('register.email_placeholder')}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="block text-xs font-semibold text-foreground">
              {t('register.password_label')}
            </label>
            <input
              id="reg-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('register.password_placeholder')}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-repassword" className="block text-xs font-semibold text-foreground">
              {t('register.repassword_label')}
            </label>
            <input
              id="reg-repassword"
              type="password"
              required
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              placeholder={t('register.repassword_placeholder')}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {loading ? t('common.submitting') : t('register.submit')}
          </button>
        </form>

        <footer className="pt-4 border-t border-border text-center text-xs text-muted-foreground space-x-1">
          <span>{t('register.has_account')}</span>
          <button
            onClick={() => onNavigate('/auth/login')}
            className="text-foreground font-semibold hover:underline focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {t('register.login_link')}
          </button>
        </footer>
      </article>
    </AuthLayoutShell>
  );
}
