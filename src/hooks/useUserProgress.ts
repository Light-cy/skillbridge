import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export type ProgressType = 
  | 'skill_learned'
  | 'project_completed'
  | 'roadmap_started'
  | 'elective_added'
  | 'milestone_reached'
  | 'goal_set'
  | 'conversation_insight';

export interface UserProgress {
  id: string;
  user_id: string;
  progress_type: ProgressType;
  title: string;
  description: string | null;
  metadata: Record<string, unknown>;
  completed_at: string;
  created_at: string;
}

export interface AddProgressParams {
  progress_type: ProgressType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export function useUserProgress() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all progress entries
  const { data: progressEntries, isLoading } = useQuery({
    queryKey: ["user-progress", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });

      if (error) throw error;
      return data as UserProgress[];
    },
    enabled: !!user?.id,
  });

  // Add progress entry
  const addProgressMutation = useMutation({
    mutationFn: async (params: AddProgressParams) => {
      if (!user?.id) throw new Error("Not authenticated");

      const insertData = {
        user_id: user.id,
        progress_type: params.progress_type,
        title: params.title,
        description: params.description || null,
        metadata: params.metadata || {},
      };

      const { data, error } = await supabase
        .from("user_progress")
        .insert(insertData as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
    },
    onError: (error) => {
      console.error("Error adding progress:", error);
    },
  });

  // Delete progress entry
  const deleteProgressMutation = useMutation({
    mutationFn: async (progressId: string) => {
      const { error } = await supabase
        .from("user_progress")
        .delete()
        .eq("id", progressId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Progress Removed",
        description: "The entry has been removed from your progress.",
      });
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete progress",
        variant: "destructive",
      });
    },
  });

  // Get aggregated stats
  const getStats = () => {
    if (!progressEntries) return { total: 0, byType: {} as Record<ProgressType, number> };

    const byType = progressEntries.reduce((acc, entry) => {
      const type = entry.progress_type as ProgressType;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<ProgressType, number>);

    return {
      total: progressEntries.length,
      byType,
      recentEntries: progressEntries.slice(0, 5),
    };
  };

  // Get progress summary for AI context
  const getProgressSummary = () => {
    if (!progressEntries || progressEntries.length === 0) {
      return "No progress tracked yet.";
    }

    const summary: string[] = [];
    
    const skills = progressEntries.filter(p => p.progress_type === 'skill_learned');
    if (skills.length > 0) {
      summary.push(`Skills learned: ${skills.map(s => s.title).join(", ")}`);
    }

    const projects = progressEntries.filter(p => p.progress_type === 'project_completed');
    if (projects.length > 0) {
      summary.push(`Projects completed: ${projects.map(p => p.title).join(", ")}`);
    }

    const roadmaps = progressEntries.filter(p => p.progress_type === 'roadmap_started');
    if (roadmaps.length > 0) {
      summary.push(`Career roadmaps started: ${roadmaps.map(r => r.title).join(", ")}`);
    }

    const milestones = progressEntries.filter(p => p.progress_type === 'milestone_reached');
    if (milestones.length > 0) {
      summary.push(`Milestones reached: ${milestones.map(m => m.title).join(", ")}`);
    }

    const goals = progressEntries.filter(p => p.progress_type === 'goal_set');
    if (goals.length > 0) {
      summary.push(`Goals set: ${goals.map(g => g.title).join(", ")}`);
    }

    return summary.join("\n");
  };

  return {
    progressEntries,
    isLoading,
    addProgress: addProgressMutation.mutate,
    addProgressAsync: addProgressMutation.mutateAsync,
    isAddingProgress: addProgressMutation.isPending,
    deleteProgress: deleteProgressMutation.mutate,
    isDeletingProgress: deleteProgressMutation.isPending,
    getStats,
    getProgressSummary,
  };
}
