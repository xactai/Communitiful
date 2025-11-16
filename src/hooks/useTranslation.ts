import { useAppStore } from '@/stores/useAppStore';
import { getTranslation, Language } from '@/lib/translations';

export const useTranslation = () => {
  const { settings } = useAppStore();
  const language = (settings.language || 'en') as Language;
  
  const t = (key: string): string => {
    return getTranslation(language, key);
  };
  
  return { t, language };
};

