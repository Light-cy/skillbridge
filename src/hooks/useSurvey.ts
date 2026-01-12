import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export function useSaveSurveyResponses() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (responses: Array<{ question_key: string; answer: string }>) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const formattedResponses = responses.map(r => ({
        user_id: user.id,
        question_key: r.question_key,
        answer: r.answer,
      }));
      
      const { error } = await supabase
        .from('survey_responses')
        .insert(formattedResponses);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['survey-responses'] });
    },
  });
}
