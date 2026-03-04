import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';

const SETTINGS_QUERY_KEY = ['site-settings'];

export const useSiteSettings = () => {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('id', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      return (
        data || {
          id: 1,
          telegram_link: '',
          enable_telegram_redirect: false,
        }
      );
    },
  });
};

export const useUpsertSiteSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings) => {
      const payload = {
        id: settings.id || 1,
        telegram_link: settings.telegram_link || '',
        enable_telegram_redirect: !!settings.enable_telegram_redirect,
      };

      const { data, error } = await supabase
        .from('site_settings')
        .upsert(payload, { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });
};
