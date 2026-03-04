import { useContext } from 'react';
import { SiteSettingsContext } from '../context/siteSettingsContext';

export const useSiteSettingsContext = () => useContext(SiteSettingsContext);
