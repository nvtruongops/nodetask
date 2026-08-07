import { useEffect } from 'react';
import { AuthLayoutShell } from './AuthLayoutShell';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useAuthStore } from '../../store/useAuthStore';
import { getAuthContent, AuthContentKey } from './content';

interface AuthCallbackPageProps {
  onNavigate: (path: string) => void;
}

export function AuthCallbackPage({ onNavigate }: AuthCallbackPageProps) {
  const { locale } = useLanguageStore();
  const loginState = useAuthStore((state) => state.login);
  const t = (key: AuthContentKey) => getAuthContent(key, locale);

  useEffect(() => {
    const timer = setTimeout(() => {
      loginState(
        {
          id: 'usr_oauth_789',
          email: 'oauth_user@gmail.com',
          fullName: 'OAuth Verified User',
          systemRole: 'USER',
        },
        'sess_oauth_token_abc'
      );
      onNavigate('/workspace');
    }, 1000);

    return () => clearTimeout(timer);
  }, [loginState, onNavigate]);

  return (
    <AuthLayoutShell onNavigate={onNavigate}>
      <article className="space-y-6 text-center py-4">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground [text-wrap:balance]">
            {t('callback.title')}
          </h1>
          <p className="text-xs text-muted-foreground [text-wrap:pretty]">
            {t('callback.subtitle')}
          </p>
        </header>

        <div className="py-6 flex flex-col items-center justify-center space-y-3">
          <div className="animate-pulse text-sm font-mono tracking-widest text-foreground">
            [Processing OAuth Token...]
          </div>
          <div className="text-xs text-muted-foreground">
            {t('common.demo_notice')}
          </div>
        </div>
      </article>
    </AuthLayoutShell>
  );
}
