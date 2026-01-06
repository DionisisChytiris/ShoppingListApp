import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import es from '../locales/es.json';
import el from '../locales/el.json';

// Language resources
const resources = {
  en: { translation: en },
  es: { translation: es },
  el: { translation: el },
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language - will be overridden by store subscription
    fallbackLng: 'en',
    compatibilityJSON: 'v4', // For React Native compatibility
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Function to change language (called from Redux middleware or component)
export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
};

export default i18n;

