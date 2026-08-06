import { create } from 'zustand';

export type SupportedLocale = 'en' | 'vi';

interface LanguageStoreState {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  toggleLocale: () => void;
}

const STORAGE_KEY = 'nodetask_locale';

function getInitialLocale(): SupportedLocale {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem(STORAGE_KEY) as SupportedLocale | null;
  if (saved && ['en', 'vi'].includes(saved)) {
    return saved;
  }
  return 'en';
}

export const useLanguageStore = create<LanguageStoreState>((set, get) => ({
  locale: getInitialLocale(),

  setLocale: (newLocale: SupportedLocale) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLocale);
    }
    set({ locale: newLocale });
  },

  toggleLocale: () => {
    const current = get().locale;
    const nextLocale: SupportedLocale = current === 'en' ? 'vi' : 'en';
    get().setLocale(nextLocale);
  },
}));
