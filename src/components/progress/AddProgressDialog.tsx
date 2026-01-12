import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Code, Rocket, Target, BookOpen, Trophy, Lightbulb, 
  Loader2, CheckCircle2
} from "lucide-react";
import { useUserProgress, ProgressType } from "@/hooks/useUserProgress";
import { useToast } from "@/hooks/use-toast";

const progressTypes: { type: ProgressType; icon: typeof Code; label: string; description: string }[] = [
  { type: 'skill_learned', icon: Code, label: 'Skill Learned', description: 'A new skill you\'ve acquired' },
  { type: 'project_completed', icon: Rocket, label: 'Project Completed', description: 'A project you\'ve finished' },
  { type: 'milestone_reached', icon: Trophy, label: 'Milestone Reached', description: 'An important achievement' },
  { type: 'goal_set', icon: Lightbulb, label: 'Goal Set', description: 'A new goal you\'re working towards' },
  { type: 'roadmap_started', icon: Target, label: 'Roadmap Started', description: 'A career path you\'re pursuing' },
  { type: 'elective_added', icon: BookOpen, label: 'Elective Added', description: 'A course you\'ve planned' },
];

interface AddProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultType?: ProgressType;
  defaultTitle?: string;
  defaultDescription?: string;
}

export function AddProgressDialog({ 
  open, 
  onOpenChange,
  defaultType,
  defaultTitle = '',
  defaultDescription = '',
}: AddProgressDialogProps) {
  const [selectedType, setSelectedType] = useState<ProgressType | null>(defaultType || null);
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);
  const { addProgressAsync, isAddingProgress } = useUserProgress();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a type and enter a title.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addProgressAsync({
        progress_type: selectedType,
        title: title.trim(),
        description: description.trim() || undefined,
      });

      toast({
        title: "Progress Added! 🎉",
        description: "Your achievement has been recorded.",
      });

      // Reset and close
      setSelectedType(null);
      setTitle('');
      setDescription('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (!isAddingProgress) {
      setSelectedType(null);
      setTitle('');
      setDescription('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Add Achievement
          </DialogTitle>
          <DialogDescription>
            Track your progress by adding skills learned, projects completed, or goals achieved.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label>What did you accomplish?</Label>
            <div className="grid grid-cols-2 gap-2">
              {progressTypes.map(({ type, icon: Icon, label }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                    selectedType === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50 hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder={
                selectedType === 'skill_learned' ? "e.g., Learned React hooks" :
                selectedType === 'project_completed' ? "e.g., Built portfolio website" :
                selectedType === 'milestone_reached' ? "e.g., Got first internship offer" :
                selectedType === 'goal_set' ? "e.g., Master TypeScript by June" :
                "What did you accomplish?"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isAddingProgress}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Details (optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any notes or details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              disabled={isAddingProgress}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={handleClose}
              disabled={isAddingProgress}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={!selectedType || !title.trim() || isAddingProgress}
            >
              {isAddingProgress ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Add Achievement
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
