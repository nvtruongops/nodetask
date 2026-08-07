import { useEffect, useState } from 'react';
import { LandingPage } from './features/landing/LandingPage';
import { AboutPage } from './features/about/AboutPage';
import { ContactPage } from './features/contact/ContactPage';
import { PrivacyPage } from './features/privacy/PrivacyPage';
import { TermsPage } from './features/terms/TermsPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { VerifyEmailPage } from './features/auth/VerifyEmailPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/ResetPasswordPage';
import { AcceptInvitePage } from './features/auth/AcceptInvitePage';
import { AccountDisabledPage } from './features/auth/AccountDisabledPage';
import { AuthCallbackPage } from './features/auth/AuthCallbackPage';

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.hash.replace('#', '') || '/';
  });

  // Handle Hash Location Navigation Sync
  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.replace('#', '') || '/';
      setCurrentPath(path);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.location.hash = path;
  };

  // Route matching based on path prefix / exact route
  const basePath = currentPath.split('?')[0];

  if (basePath === '/about') {
    return <AboutPage onNavigate={handleNavigate} />;
  }

  if (basePath === '/contact') {
    return <ContactPage onNavigate={handleNavigate} />;
  }

  if (basePath === '/privacy') {
    return <PrivacyPage onNavigate={handleNavigate} />;
  }

  if (basePath === '/terms') {
    return <TermsPage onNavigate={handleNavigate} />;
  }

  // Auth Feature Routes
  if (basePath === '/auth/login') {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  if (basePath === '/auth/register') {
    return <RegisterPage onNavigate={handleNavigate} />;
  }

  if (basePath === '/auth/verify-email') {
    return <VerifyEmailPage onNavigate={handleNavigate} />;
  }

  if (basePath === '/auth/forgot-password') {
    return <ForgotPasswordPage onNavigate={handleNavigate} />;
  }

  if (basePath === '/auth/reset-password') {
    return <ResetPasswordPage onNavigate={handleNavigate} />;
  }

  if (basePath === '/auth/accept-invite') {
    return <AcceptInvitePage onNavigate={handleNavigate} />;
  }

  if (basePath === '/auth/account-disabled') {
    return <AccountDisabledPage onNavigate={handleNavigate} />;
  }

  if (basePath === '/auth/callback') {
    return <AuthCallbackPage onNavigate={handleNavigate} />;
  }

  return <LandingPage onNavigate={handleNavigate} />;
}

export default App;
