import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';

export const useMedia = () => {
  return useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*, title_logos(*)')
        .order('created_at', { ascending: false, foreignTable: 'title_logos' })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useMediaById = (id) => {
  return useQuery({
    queryKey: ['media', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*, title_logos(*)')
        .eq('id', id)
        .single();
      if (error) throw error;

      if (data?.title_logos?.length) {
        data.title_logos = [...data.title_logos].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      return data;
    },
    enabled: !!id,
  });
};

export const useSearchMedia = (query) => {
  const normalized = query?.trim();

  return useQuery({
    queryKey: ['media', 'search', normalized],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*, title_logos(*)')
        .ilike('title', `%${normalized}%`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!normalized,
  });
};

export const useCreateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (media) => {
      const { data, error } = await supabase
        .from('media')
        .insert(media)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
    },
  });
};

export const useCreateTitleLogo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (logo) => {
      const { data, error } = await supabase
        .from('title_logos')
        .insert(logo)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
    },
  });
};

export const useCreateTitleLogos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (logos) => {
      const { data, error } = await supabase
        .from('title_logos')
        .insert(logos)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
    },
  });
};

export const useUpdateTitleLogo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { error } = await supabase
        .from('title_logos')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['media']);
    },
  });
};

export const useMediaWallpapers = (mediaId) => {
  return useQuery({
    queryKey: ['wallpapers', 'media', mediaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallpapers')
        .select('*, categories(name, slug)')
        .eq('media_id', mediaId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!mediaId,
  });
};
