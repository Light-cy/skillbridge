import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Map, MessageCircle, Calendar, Trash2, ChevronRight, 
  GraduationCap, AlertCircle 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SavedRoadmap {
  id: string;
  career_path_id: string | null;
  expertise_level: string;
  roadmap_content: string;
  chat_messages: Array<{ role: string; content: string }> | null;
  created_at: string | null;
  updated_at: string | null;
  career_paths?: {
    name: string;
    icon: string | null;
  } | null;
}

interface SavedRoadmapsListProps {
  roadmaps: SavedRoadmap[] | undefined;
  isLoading: boolean;
  onSelect: (roadmap: SavedRoadmap) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

const expertiseLevelLabels: Record<string, string> = {
  complete_beginner: "Complete Beginner",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export function SavedRoadmapsList({
  roadmaps,
  isLoading,
  onSelect,
  onDelete,
  isDeleting,
}: SavedRoadmapsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="w-24 h-9" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!roadmaps || roadmaps.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Map className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">No saved roadmaps yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Generate your first career roadmap and save it to see it here
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {roadmaps.map((roadmap) => {
        const messageCount = roadmap.chat_messages?.length || 0;
        const createdAt = roadmap.created_at 
          ? formatDistanceToNow(new Date(roadmap.created_at), { addSuffix: true })
          : "Unknown";

        return (
          <Card 
            key={roadmap.id}
            className="group hover:border-primary/50 transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {roadmap.career_paths?.name || "Career Roadmap"}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Map className="w-3.5 h-3.5" />
                      {expertiseLevelLabels[roadmap.expertise_level] || roadmap.expertise_level}
                    </span>
                    {messageCount > 0 && (
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        {messageCount} messages
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {createdAt}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        disabled={isDeleting}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-destructive" />
                          Delete Roadmap
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this roadmap? This will also delete 
                          all chat messages associated with it. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(roadmap.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    onClick={() => onSelect(roadmap)}
                    className="gap-2"
                  >
                    View
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
