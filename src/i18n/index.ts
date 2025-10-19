import en from './locales/en';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import es from './locales/es';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

const getDeviceLanguage = (): string => {
  try {
    const locales = Localization.getLocales();
    if (locales?.[0]?.languageCode) {
      return locales[0].languageCode;
    }
  } catch (error) {
    console.warn('Could not get device locale:', error);
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  compatibilityJSON: 'v4', // For React Native compatibility
  react: {
    useSuspense: false, // Disable suspense for React Native
  },
});

export default i18n;
