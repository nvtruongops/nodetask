import { useEffect, useState } from 'react';
import { LandingPage } from './features/landing/LandingPage';
import { AboutPage } from './features/about/AboutPage';
import { PrivacyPage } from './features/privacy/PrivacyPage';
import { TermsPage } from './features/terms/TermsPage';

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

  if (currentPath === '/about') {
    return <AboutPage onNavigate={handleNavigate} />;
  }

  if (currentPath === '/privacy') {
    return <PrivacyPage onNavigate={handleNavigate} />;
  }

  if (currentPath === '/terms') {
    return <TermsPage onNavigate={handleNavigate} />;
  }

  return <LandingPage onNavigate={handleNavigate} />;
}

export default App;
