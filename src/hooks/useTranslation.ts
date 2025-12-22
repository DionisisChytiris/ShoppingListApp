import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * Custom hook wrapper around react-i18next's useTranslation
 * Provides convenient access to translation function and i18n instance
 */
export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  return { t, i18n };
};

