import enContent from './en.json';
import viContent from './vi.json';
import { SupportedLocale } from '../../../store/useLanguageStore';

export type LandingContentKey = keyof typeof enContent;

export function getLandingContent(key: LandingContentKey, locale: SupportedLocale = 'en'): string {
  const dict = locale === 'vi' ? viContent : enContent;
  return (dict as Record<string, string>)[key] || (enContent as Record<string, string>)[key] || key;
}

export { enContent, viContent };
