import React, { useState } from 'react';
import { AuthLayoutShell } from './AuthLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { getAuthContent, AuthContentKey } from './content';

interface ResetPasswordPageProps {
  onNavigate: (path: string) => void;
}

export function ResetPasswordPage({ onNavigate }: ResetPasswordPageProps) {
  const { locale } = useLanguageStore();
  const t = (key: AuthContentKey) => getAuthContent(key, locale);

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== reNewPassword) {
      setError(t('register.password_mismatch'));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(t('reset_password.success'));
      setTimeout(() => {
        onNavigate('/auth/login');
      }, 1500);
    }, 600);
  };

  return (
    <AuthLayoutShell onNavigate={onNavigate}>
      <article className="space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground [text-wrap:balance]">
            {t('reset_password.title')}
          </h1>
          <p className="text-xs text-muted-foreground [text-wrap:pretty]">
            {t('reset_password.subtitle')}
          </p>
        </header>

        {error && (
          <div className="p-3 border border-border text-xs text-foreground bg-muted">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 border border-border text-xs text-foreground bg-muted text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" role="form">
          <div className="space-y-1.5">
            <label htmlFor="reset-otp" className="block text-xs font-semibold text-foreground">
              {t('reset_password.otp_label')}
            </label>
            <input
              id="reset-otp"
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder={t('reset_password.otp_placeholder')}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reset-new-password" className="block text-xs font-semibold text-foreground">
              {t('reset_password.new_password_label')}
            </label>
            <input
              id="reset-new-password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('reset_password.new_password_placeholder')}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reset-renew-password" className="block text-xs font-semibold text-foreground">
              {t('reset_password.re_new_password_label')}
            </label>
            <input
              id="reset-renew-password"
              type="password"
              required
              value={reNewPassword}
              onChange={(e) => setReNewPassword(e.target.value)}
              placeholder={t('reset_password.re_new_password_placeholder')}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-foreground"
          >
            {loading ? t('common.submitting') : t('reset_password.submit')}
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
