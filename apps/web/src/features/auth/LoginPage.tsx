import React, { useState } from 'react';
import { AuthLayoutShell } from './AuthLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useAuthStore } from '../../store/useAuthStore';
import { getAuthContent, AuthContentKey } from './content';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { locale } = useLanguageStore();
  const loginState = useAuthStore((state) => state.login);
  const t = (key: AuthContentKey) => getAuthContent(key, locale);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.includes('@')) {
      setError(t('login.invalid_credentials'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Simulate successful login
      loginState(
        {
          id: 'usr_demo_123',
          email,
          fullName: email.split('@')[0] || 'User',
          systemRole: 'USER',
        },
        'sess_key_demo_token_xyz'
      );
      onNavigate('/workspace');
    }, 600);
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    onNavigate(`/auth/callback?provider=${provider}&code=demo_code_123`);
  };

  return (
    <AuthLayoutShell onNavigate={onNavigate}>
      <article className="space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground [text-wrap:balance]">
            {t('login.title')}
          </h1>
          <p className="text-xs text-muted-foreground [text-wrap:pretty]">
            {t('login.subtitle')}
          </p>
        </header>

        {error && (
          <div className="p-3 border border-border text-xs text-foreground bg-muted">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" role="form">
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-xs font-semibold text-foreground">
              {t('login.email_label')}
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('login.email_placeholder')}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="login-password" className="block text-xs font-semibold text-foreground">
                {t('login.password_label')}
              </label>
              <button
                type="button"
                onClick={() => onNavigate('/auth/forgot-password')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-foreground"
              >
                {t('login.forgot_password')}
              </button>
            </div>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('login.password_placeholder')}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {loading ? t('common.submitting') : t('login.submit')}
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-xs text-muted-foreground">[OR]</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="w-full py-2 px-4 border border-border bg-background text-foreground text-xs font-medium hover:bg-muted transition-colors focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {t('login.oauth_google')}
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('github')}
            className="w-full py-2 px-4 border border-border bg-background text-foreground text-xs font-medium hover:bg-muted transition-colors focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {t('login.oauth_github')}
          </button>
        </div>

        <footer className="pt-4 border-t border-border text-center text-xs text-muted-foreground space-x-1">
          <span>{t('login.no_account')}</span>
          <button
            onClick={() => onNavigate('/auth/register')}
            className="text-foreground font-semibold hover:underline focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {t('login.register_link')}
          </button>
        </footer>
      </article>
    </AuthLayoutShell>
  );
}
