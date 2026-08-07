import React, { useState } from 'react';
import { AuthLayoutShell } from './AuthLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useAuthStore } from '../../store/useAuthStore';
import { getAuthContent, AuthContentKey } from './content';

interface AcceptInvitePageProps {
  onNavigate: (path: string) => void;
}

export function AcceptInvitePage({ onNavigate }: AcceptInvitePageProps) {
  const { locale } = useLanguageStore();
  const loginState = useAuthStore((state) => state.login);
  const t = (key: AuthContentKey) => getAuthContent(key, locale);

  const [token, setToken] = useState('inv_tok_demo_987');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAccept = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      loginState(
        {
          id: 'usr_org_member_456',
          email: 'member@organization.com',
          fullName: 'Organization Member',
          systemRole: 'ORG_MEMBER',
        },
        'sess_org_invite_token_xyz'
      );
      setTimeout(() => {
        onNavigate('/workspace');
      }, 1200);
    }, 600);
  };

  return (
    <AuthLayoutShell onNavigate={onNavigate}>
      <article className="space-y-6">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground [text-wrap:balance]">
            {t('accept_invite.title')}
          </h1>
          <p className="text-xs text-muted-foreground [text-wrap:pretty]">
            {t('accept_invite.subtitle')}
          </p>
        </header>

        <div className="p-4 border border-border bg-muted space-y-2 text-xs">
          <div className="font-semibold text-foreground">[Invitation Details]</div>
          <p className="text-muted-foreground">
            {t('accept_invite.inviter_info')
              .replace('{inviter}', 'Org Admin')
              .replace('{orgName}', 'Engineering Core Org')
              .replace('{role}', 'ORG_MEMBER')}
          </p>
        </div>

        {success && (
          <div className="p-3 border border-border text-xs text-foreground bg-muted text-center">
            {t('accept_invite.accepted_success')}
          </div>
        )}

        <form onSubmit={handleAccept} className="space-y-4" role="form">
          <div className="space-y-1.5">
            <label htmlFor="invite-token" className="block text-xs font-semibold text-foreground">
              {t('accept_invite.token_label')}
            </label>
            <input
              id="invite-token"
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-background border border-border text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || success}
              className="flex-1 py-2.5 px-4 bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-foreground"
            >
              {loading ? t('common.submitting') : t('accept_invite.accept_button')}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="py-2.5 px-4 border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors focus:outline-none focus:ring-1 focus:ring-foreground"
            >
              {t('accept_invite.decline_button')}
            </button>
          </div>
        </form>
      </article>
    </AuthLayoutShell>
  );
}
