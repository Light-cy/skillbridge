import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { ChatMessage } from '@/types/database';

export function useChatMessages(alumniId: string | null) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Set up realtime subscription
  useEffect(() => {
    if (!user?.id || !alumniId) return;
    
    const channel = supabase
      .channel(`chat-${alumniId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['chat-messages', alumniId] });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, alumniId, queryClient]);
  
  return useQuery({
    queryKey: ['chat-messages', alumniId],
    queryFn: async () => {
      if (!user?.id || !alumniId) return [];
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${alumniId},receiver_id.eq.${alumniId}`)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!user?.id && !!alumniId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async ({ 
      receiverId, 
      message, 
      isAnonymous = false 
    }: { 
      receiverId: string; 
      message: string; 
      isAnonymous?: boolean;
    }) => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          message,
          is_anonymous: isAnonymous,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as ChatMessage;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.receiverId] });
    },
  });
}
