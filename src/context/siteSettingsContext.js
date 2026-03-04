import { createContext } from 'react';

export const SiteSettingsContext = createContext({
  settings: null,
  loading: true,
});
