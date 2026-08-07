import React, { useState } from 'react';
import { AuthLayoutShell } from './AuthLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { getAuthContent, AuthContentKey } from './content';

interface ForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export function ForgotPasswordPage({ onNavigate }: ForgotPasswordPageProps) {
  const { locale } = useLanguageStore();
  const t = (key: AuthContentKey) => getAuthContent(key, locale);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        onNavigate(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 1200);
    }, 600);
  };

  return (
    <AuthLayoutShell onNavigate={onNavigate}>
      <article className="space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground [text-wrap:balance]">
            {t('forgot_password.title')}
          </h1>
          <p className="text-xs text-muted-foreground [text-wrap:pretty]">
            {t('forgot_password.subtitle')}
          </p>
        </header>

        {submitted && (
          <div className="p-3 border border-border text-xs text-foreground bg-muted text-center">
            {t('forgot_password.otp_sent')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" role="form">
          <div className="space-y-1.5">
            <label htmlFor="forgot-email" className="block text-xs font-semibold text-foreground">
              {t('forgot_password.email_label')}
            </label>
            <input
              id="forgot-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('forgot_password.email_placeholder')}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading || submitted}
            className="w-full py-2.5 px-4 bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {loading ? t('common.submitting') : t('forgot_password.submit')}
          </button>
        </form>

        <footer className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <button
            onClick={() => onNavigate('/auth/login')}
            className="text-foreground font-semibold hover:underline focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {t('forgot_password.back_login')}
          </button>
        </footer>
      </article>
    </AuthLayoutShell>
  );
}
