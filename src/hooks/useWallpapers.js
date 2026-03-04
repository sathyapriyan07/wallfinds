import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../services/supabaseClient';

export const useWallpapers = (filters = {}) => {
  return useQuery({
    queryKey: ['wallpapers', filters],
    queryFn: async () => {
      let query = supabase
        .from('wallpapers')
        .select('*, categories(name, slug)')
        .order('created_at', { ascending: false });

      if (filters.category) {
        query = query.eq('category_id', filters.category);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
      }
      if (filters.featured) {
        query = query.eq('featured', true);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};

export const useWallpaper = (id) => {
  return useQuery({
    queryKey: ['wallpaper', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallpapers')
        .select('*, categories(name, slug)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateWallpaper = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (wallpaper) => {
      const { data, error } = await supabase
        .from('wallpapers')
        .insert(wallpaper)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wallpapers']);
    },
  });
};

export const useUpdateWallpaper = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from('wallpapers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wallpapers']);
    },
  });
};

export const useDeleteWallpaper = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('wallpapers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['wallpapers']);
    },
  });
};

export const useIncrementDownload = () => {
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.rpc('increment_downloads', { wallpaper_id: id });
      if (error) throw error;
    },
  });
};
