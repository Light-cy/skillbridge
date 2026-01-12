import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CareerPath } from '@/types/database';

export function useCareerPaths() {
  return useQuery({
    queryKey: ['career-paths'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('career_paths')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as CareerPath[];
    },
  });
}

export function useCareerPath(id: string | null) {
  return useQuery({
    queryKey: ['career-path', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('career_paths')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return data as CareerPath | null;
    },
    enabled: !!id,
  });
}
