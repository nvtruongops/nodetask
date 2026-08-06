import { useEffect, useState } from 'react';
import { LandingPage } from './features/landing/LandingPage';

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

  return (
    <LandingPage
      onNavigate={(path) => {
        setCurrentPath(path);
        window.location.hash = path;
      }}
    />
  );
}

export default App;
