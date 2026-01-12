import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Json } from '@/integrations/supabase/types';

export type ConversationMessage = { role: 'user' | 'assistant'; content: string };

export type Conversation = {
  id: string;
  user_id: string;
  messages: ConversationMessage[];
  context: Record<string, unknown>;
  created_at: string | null;
  updated_at: string | null;
};

export function useConversations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ai-conversations'],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((conv) => ({
        ...conv,
        messages: (conv.messages as unknown as ConversationMessage[]) || [],
        context: (conv.context as Record<string, unknown>) || {},
      })) as Conversation[];
    },
    enabled: !!user?.id,
  });
}

export function useConversation(conversationId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['ai-conversation', conversationId],
    queryFn: async () => {
      if (!user?.id || !conversationId) return null;

      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        ...data,
        messages: (data.messages as unknown as ConversationMessage[]) || [],
        context: (data.context as Record<string, unknown>) || {},
      } as Conversation;
    },
    enabled: !!user?.id && !!conversationId,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (initialMessage?: ConversationMessage) => {
      if (!user?.id) throw new Error('Not authenticated');

      const messages = initialMessage ? [initialMessage] : [];

      const { data, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          messages: messages as unknown as Json,
          context: {} as Json,
        })
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        messages: (data.messages as unknown as ConversationMessage[]) || [],
        context: (data.context as Record<string, unknown>) || {},
      } as Conversation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
    },
  });
}

export function useUpdateConversation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      conversationId,
      messages,
    }: {
      conversationId: string;
      messages: ConversationMessage[];
    }) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ai_conversations')
        .update({
          messages: messages as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      return {
        ...data,
        messages: (data.messages as unknown as ConversationMessage[]) || [],
        context: (data.context as Record<string, unknown>) || {},
      } as Conversation;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['ai-conversation', variables.conversationId] });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      if (!user?.id) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-conversations'] });
    },
  });
}

// Helper to get first message preview for sidebar
export function getConversationTitle(messages: ConversationMessage[]): string {
  const firstUserMessage = messages.find((m) => m.role === 'user');
  if (!firstUserMessage) return 'New conversation';
  const content = firstUserMessage.content;
  return content.length > 40 ? content.slice(0, 40) + '...' : content;
}
