import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Elective, UserElective } from '@/types/database';

export function useElectives() {
  return useQuery({
    queryKey: ['electives'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('electives')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Elective[];
    },
  });
}

export function useUserElectives() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-electives', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_electives')
        .select('*, elective:electives(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });
}

export function useAddUserElective() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ electiveId, semesterTaken }: { electiveId: string; semesterTaken?: number }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('user_electives')
        .insert({
          user_id: user.id,
          elective_id: electiveId,
          semester_taken: semesterTaken,
          status: 'planned',
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-electives'] });
    },
  });
}
