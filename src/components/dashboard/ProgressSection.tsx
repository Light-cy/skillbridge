import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Trophy, Target, BookOpen, Lightbulb, Rocket, Code, 
  GraduationCap, Plus, ChevronRight, Sparkles, CheckCircle2,
  MessageSquare
} from "lucide-react";
import { useUserProgress, ProgressType } from "@/hooks/useUserProgress";
import { AddProgressDialog } from "@/components/progress/AddProgressDialog";
import { formatDistanceToNow } from "date-fns";

const progressTypeConfig: Record<ProgressType, { icon: typeof Trophy; label: string; color: string }> = {
  skill_learned: { icon: Code, label: "Skill", color: "text-info" },
  project_completed: { icon: Rocket, label: "Project", color: "text-success" },
  roadmap_started: { icon: Target, label: "Roadmap", color: "text-primary" },
  elective_added: { icon: BookOpen, label: "Elective", color: "text-warning" },
  milestone_reached: { icon: Trophy, label: "Milestone", color: "text-amber-500" },
  goal_set: { icon: Lightbulb, label: "Goal", color: "text-purple-500" },
  conversation_insight: { icon: MessageSquare, label: "Insight", color: "text-muted-foreground" },
};

interface ProgressSectionProps {
  semesterNumber?: number | null;
  semesterBucket?: string | null;
}

export function ProgressSection({ semesterNumber, semesterBucket }: ProgressSectionProps) {
  const { progressEntries, isLoading, getStats } = useUserProgress();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const stats = getStats();
  const displayedEntries = showAll ? progressEntries : (progressEntries?.slice(0, 4) || []);
  
  // Calculate a progress score based on entries
  const progressScore = Math.min(100, (stats.total * 10) + ((semesterNumber || 1) * 5));

  return (
    <>
      <Card className="animate-slide-up group hover:shadow-lg transition-all duration-300 overflow-hidden" style={{ animationDelay: '0.1s' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="pb-2 relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
              Your Journey
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-1"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          {/* Progress Ring / Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Progress Score
              </span>
              <span className="font-semibold text-primary">{progressScore}%</span>
            </div>
            <Progress value={progressScore} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {stats.total === 0 && "Start tracking your accomplishments!"}
              {stats.total > 0 && stats.total < 5 && "Great start! Keep adding your achievements."}
              {stats.total >= 5 && stats.total < 10 && "You're making excellent progress!"}
              {stats.total >= 10 && "Amazing journey! You're on fire! 🔥"}
            </p>
          </div>

          {/* Quick Stats */}
          {stats.total > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.byType).map(([type, count]) => {
                const config = progressTypeConfig[type as ProgressType];
                const Icon = config?.icon || CheckCircle2;
                return (
                  <Badge key={type} variant="secondary" className="gap-1">
                    <Icon className={`w-3 h-3 ${config?.color || ''}`} />
                    {count} {config?.label || type}
                  </Badge>
                );
              })}
            </div>
          )}

          {/* Recent Achievements */}
          {progressEntries && progressEntries.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent Achievements</p>
              <div className="space-y-2">
                {displayedEntries.map((entry) => {
                  const config = progressTypeConfig[entry.progress_type as ProgressType];
                  const Icon = config?.icon || CheckCircle2;
                  return (
                    <div 
                      key={entry.id} 
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-full bg-background flex items-center justify-center ${config?.color || ''}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{entry.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(entry.completed_at), { addSuffix: true })}
                        </p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
              {progressEntries.length > 4 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : `View All (${progressEntries.length})`}
                  <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${showAll ? 'rotate-90' : ''}`} />
                </Button>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <GraduationCap className="w-10 h-10 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground mb-3">
                No achievements tracked yet
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Your First Achievement
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddProgressDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />
    </>
  );
}
