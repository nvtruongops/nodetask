import React, { useState } from 'react';
import { AuthLayoutShell } from './AuthLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { getAuthContent, AuthContentKey } from './content';

interface AccountDisabledPageProps {
  onNavigate: (path: string) => void;
}

export function AccountDisabledPage({ onNavigate }: AccountDisabledPageProps) {
  const { locale } = useLanguageStore();
  const t = (key: AuthContentKey) => getAuthContent(key, locale);

  const [appealReason, setAppealReason] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <AuthLayoutShell onNavigate={onNavigate}>
      <article className="space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground [text-wrap:balance]">
            {t('account_disabled.title')}
          </h1>
          <p className="text-xs text-muted-foreground [text-wrap:pretty]">
            {t('account_disabled.subtitle')}
          </p>
        </header>

        <div className="p-4 border border-border bg-muted space-y-2 text-xs">
          <div className="font-semibold text-foreground">{t('account_disabled.reason_title')}</div>
          <div className="font-mono font-bold text-foreground">{t('account_disabled.reason_code')}</div>
          <p className="text-muted-foreground [text-wrap:pretty]">
            {t('account_disabled.reason_desc')}
          </p>
        </div>

        {submitted ? (
          <div className="p-4 border border-border text-xs text-foreground bg-muted text-center space-y-2">
            <div className="font-semibold">{t('common.success')}</div>
            <p>{t('account_disabled.appeal_submitted')}</p>
            <button
              onClick={() => onNavigate('/')}
              className="mt-2 py-1.5 px-3 border border-border text-xs font-medium hover:bg-foreground hover:text-background transition-colors focus:outline-none focus:ring-1 focus:ring-foreground"
            >
              {t('common.back_home')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleAppeal} className="space-y-4" role="form">
            <div className="text-xs font-semibold text-foreground border-b border-border pb-1">
              {t('account_disabled.appeal_title')}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="appeal-email" className="block text-xs font-semibold text-foreground">
                {t('account_disabled.appeal_email_label')}
              </label>
              <input
                id="appeal-email"
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder={t('account_disabled.appeal_email_placeholder')}
                className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="appeal-reason" className="block text-xs font-semibold text-foreground">
                {t('account_disabled.appeal_reason_label')}
              </label>
              <textarea
                id="appeal-reason"
                required
                rows={4}
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
                placeholder={t('account_disabled.appeal_reason_placeholder')}
                className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground resize-none min-h-[120px] max-h-[240px] overflow-y-auto focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-foreground"
            >
              {loading ? t('common.submitting') : t('account_disabled.submit_appeal')}
            </button>
          </form>
        )}
      </article>
    </AuthLayoutShell>
  );
}
