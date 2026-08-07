import React, { useState, useEffect } from 'react';
import { AuthLayoutShell } from './AuthLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { getAuthContent, AuthContentKey } from './content';

interface VerifyEmailPageProps {
  onNavigate: (path: string) => void;
}

export function VerifyEmailPage({ onNavigate }: VerifyEmailPageProps) {
  const { locale } = useLanguageStore();
  const t = (key: AuthContentKey) => getAuthContent(key, locale);

  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.trim().length !== 6) {
      setError(t('verify_email.invalid_otp'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNavigate('/auth/login?verified=true');
    }, 600);
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    setCooldown(60);
    setError(null);
  };

  return (
    <AuthLayoutShell onNavigate={onNavigate}>
      <article className="space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground [text-wrap:balance]">
            {t('verify_email.title')}
          </h1>
          <p className="text-xs text-muted-foreground [text-wrap:pretty]">
            {t('verify_email.subtitle')}
          </p>
        </header>

        {error && (
          <div className="p-3 border border-border text-xs text-foreground bg-muted">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" role="form">
          <div className="space-y-1.5">
            <label htmlFor="verify-otp" className="block text-xs font-semibold text-foreground">
              {t('verify_email.otp_label')}
            </label>
            <input
              id="verify-otp"
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder={t('verify_email.otp_placeholder')}
              className="w-full px-3 py-2 text-center tracking-[0.5em] text-lg font-mono bg-background border border-border text-foreground placeholder:tracking-normal placeholder:font-sans placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {loading ? t('common.submitting') : t('verify_email.submit')}
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            type="button"
            disabled={cooldown > 0}
            onClick={handleResend}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {cooldown > 0
              ? t('verify_email.resend_cooldown').replace('{seconds}', cooldown.toString())
              : t('verify_email.resend')}
          </button>
        </div>

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
