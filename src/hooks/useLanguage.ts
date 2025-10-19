import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import en from '@/i18n/locales/en';

export type TranslationKeys = keyof typeof en;

export const useLanguage = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = useCallback(
    (language: string) => {
      console.log('Changing language to:', language);
      i18n.changeLanguage(language);
    },
    [i18n],
  );

  const getCurrentLanguage = useCallback(() => {
    return i18n.language;
  }, [i18n.language]);

  return {
    t: t as (key: TranslationKeys) => string,
    changeLanguage,
    currentLanguage: getCurrentLanguage(),
    isRTL: i18n.dir() === 'rtl',
  };
};
