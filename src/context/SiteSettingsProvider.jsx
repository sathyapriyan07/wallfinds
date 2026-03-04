import { useMemo } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { SiteSettingsContext } from './siteSettingsContext';

export const SiteSettingsProvider = ({ children }) => {
  const { data, isLoading } = useSiteSettings();

  const value = useMemo(
    () => ({
      settings: data || { telegram_link: '', enable_telegram_redirect: false },
      loading: isLoading,
    }),
    [data, isLoading]
  );

  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
};
