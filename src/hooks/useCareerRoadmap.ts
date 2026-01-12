import { useState, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { ExpertiseLevel } from "@/components/career/ExpertiseSelector";

interface GenerateRoadmapParams {
  careerPathId: string;
  expertiseLevel: ExpertiseLevel;
  userProfile?: {
    semester_number?: number | null;
    semester_bucket?: string | null;
    career_clarity?: string | null;
    work_style?: string | null;
  };
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface SavedRoadmap {
  id: string;
  career_path_id: string | null;
  expertise_level: string;
  roadmap_content: string;
  chat_messages: ChatMessage[] | null;
  created_at: string | null;
  updated_at: string | null;
  career_paths?: {
    name: string;
    icon: string | null;
  } | null;
}

export function useCareerRoadmap() {
  const [roadmapContent, setRoadmapContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [currentRoadmapId, setCurrentRoadmapId] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Ref to track if auto-save is pending
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Store context for chat
  const [chatContext, setChatContext] = useState<{
    careerPathName: string;
    expertiseLevel: ExpertiseLevel;
    roadmapContent: string;
  } | null>(null);

  // Fetch saved roadmaps
  const { data: savedRoadmaps, isLoading: isLoadingRoadmaps } = useQuery({
    queryKey: ["user-roadmaps", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("user_roadmaps")
        .select(`
          id,
          career_path_id,
          expertise_level,
          roadmap_content,
          chat_messages,
          created_at,
          updated_at,
          career_paths (
            name,
            icon
          )
        `)
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      
      // Type the response properly - cast through unknown for JSON compatibility
      return (data || []).map(item => ({
        ...item,
        chat_messages: (item.chat_messages as unknown) as ChatMessage[] | null
      })) as SavedRoadmap[];
    },
    enabled: !!user?.id,
  });

  // Auto-save chat messages mutation
  const updateChatMessagesMutation = useMutation({
    mutationFn: async ({
      roadmapId,
      messages,
    }: {
      roadmapId: string;
      messages: ChatMessage[];
    }) => {
      const { error } = await supabase
        .from("user_roadmaps")
        .update({ 
          chat_messages: JSON.parse(JSON.stringify(messages)),
          updated_at: new Date().toISOString()
        })
        .eq("id", roadmapId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roadmaps"] });
    },
  });

  // Auto-save chat messages with debounce
  const autoSaveChatMessages = useCallback((messages: ChatMessage[]) => {
    if (!currentRoadmapId) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Debounce the save
    autoSaveTimeoutRef.current = setTimeout(() => {
      updateChatMessagesMutation.mutate({
        roadmapId: currentRoadmapId,
        messages,
      });
    }, 1000);
  }, [currentRoadmapId, updateChatMessagesMutation]);

  const generateRoadmap = useCallback(async (params: GenerateRoadmapParams) => {
    setIsGenerating(true);
    setRoadmapContent("");
    setChatMessages([]);
    setCurrentRoadmapId(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-roadmap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            ...params,
            userId: user?.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast({
            title: "Rate Limited",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Payment Required",
            description: "Please add funds to continue using AI features.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(errorData.error || "Failed to generate roadmap");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              accumulatedContent += content;
              setRoadmapContent(accumulatedContent);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              accumulatedContent += content;
              setRoadmapContent(accumulatedContent);
            }
          } catch {
            /* ignore */
          }
        }
      }
    } catch (error) {
      console.error("Error generating roadmap:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate roadmap",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const sendChatMessage = useCallback(async (message: string) => {
    if (!chatContext) return;

    const userMessage: ChatMessage = { role: "user", content: message };
    const newMessagesWithUser = [...chatMessages, userMessage];
    setChatMessages(newMessagesWithUser);
    setIsChatLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-roadmap`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            roadmapContent: chatContext.roadmapContent,
            careerPathName: chatContext.careerPathName,
            expertiseLevel: chatContext.expertiseLevel,
            messages: newMessagesWithUser,
            userId: user?.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast({
            title: "Rate Limited",
            description: "Too many requests. Please try again in a moment.",
            variant: "destructive",
          });
          setChatMessages((prev) => prev.slice(0, -1));
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Payment Required",
            description: "Please add funds to continue using AI features.",
            variant: "destructive",
          });
          setChatMessages((prev) => prev.slice(0, -1));
          return;
        }
        throw new Error(errorData.error || "Failed to send message");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // Add empty assistant message that we'll update
      setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setChatMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setChatMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {
            /* ignore */
          }
        }
      }

      // Auto-save messages after assistant response completes
      const finalMessages = [...newMessagesWithUser, { role: "assistant" as const, content: assistantContent }];
      autoSaveChatMessages(finalMessages);

    } catch (error) {
      console.error("Error sending chat message:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
      setChatMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsChatLoading(false);
    }
  }, [chatContext, chatMessages, toast, autoSaveChatMessages]);

  const saveRoadmapMutation = useMutation({
    mutationFn: async ({
      careerPathId,
      expertiseLevel,
      content,
      messages,
    }: {
      careerPathId: string;
      expertiseLevel: ExpertiseLevel;
      content: string;
      messages?: ChatMessage[];
    }) => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("user_roadmaps")
        .insert({
          user_id: user.id,
          career_path_id: careerPathId,
          expertise_level: expertiseLevel,
          roadmap_content: content,
          chat_messages: JSON.parse(JSON.stringify(messages || [])),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setCurrentRoadmapId(data.id);
      toast({
        title: "Roadmap Saved!",
        description: "Your career roadmap has been saved. Chat messages will auto-save.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-roadmaps"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save roadmap",
        variant: "destructive",
      });
    },
  });

  const deleteRoadmapMutation = useMutation({
    mutationFn: async (roadmapId: string) => {
      const { error } = await supabase
        .from("user_roadmaps")
        .delete()
        .eq("id", roadmapId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Roadmap Deleted",
        description: "The roadmap has been removed.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-roadmaps"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete roadmap",
        variant: "destructive",
      });
    },
  });

  const loadSavedRoadmap = useCallback((roadmap: SavedRoadmap) => {
    setRoadmapContent(roadmap.roadmap_content);
    setChatMessages(roadmap.chat_messages || []);
    setCurrentRoadmapId(roadmap.id);
    
    // Set chat context from saved roadmap
    if (roadmap.career_paths) {
      setChatContext({
        careerPathName: roadmap.career_paths.name,
        expertiseLevel: roadmap.expertise_level as ExpertiseLevel,
        roadmapContent: roadmap.roadmap_content,
      });
    }
  }, []);

  const resetRoadmap = useCallback(() => {
    setRoadmapContent("");
    setChatMessages([]);
    setChatContext(null);
    setCurrentRoadmapId(null);
    
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
  }, []);

  return {
    roadmapContent,
    isGenerating,
    generateRoadmap,
    saveRoadmap: (params: { careerPathId: string; expertiseLevel: ExpertiseLevel; content: string }) => 
      saveRoadmapMutation.mutate({ ...params, messages: chatMessages }),
    isSaving: saveRoadmapMutation.isPending,
    resetRoadmap,
    // Chat functionality
    chatMessages,
    isChatLoading,
    sendChatMessage,
    setChatContext,
    // Saved roadmaps
    savedRoadmaps,
    isLoadingRoadmaps,
    loadSavedRoadmap,
    deleteRoadmap: deleteRoadmapMutation.mutate,
    isDeleting: deleteRoadmapMutation.isPending,
    currentRoadmapId,
    isAutoSaving: updateChatMessagesMutation.isPending,
  };
}
