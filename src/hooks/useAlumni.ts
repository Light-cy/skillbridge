import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Alumni } from '@/types/database';

export function useAlumni() {
  return useQuery({
    queryKey: ['alumni'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Alumni[];
    },
  });
}

export function useAlumniByCareerPath(careerPathId: string | null) {
  return useQuery({
    queryKey: ['alumni', 'career-path', careerPathId],
    queryFn: async () => {
      if (!careerPathId) return [];
      
      const { data, error } = await supabase
        .from('alumni')
        .select('*')
        .eq('career_path_id', careerPathId)
        .order('name');
      
      if (error) throw error;
      return data as Alumni[];
    },
    enabled: !!careerPathId,
  });
}
