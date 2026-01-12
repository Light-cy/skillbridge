import { Card, CardContent } from "@/components/ui/card";
import { Check, Sprout, Leaf, TreePine, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export type ExpertiseLevel = "complete_beginner" | "beginner" | "intermediate" | "advanced";

interface ExpertiseLevelOption {
  value: ExpertiseLevel;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const expertiseLevels: ExpertiseLevelOption[] = [
  {
    value: "complete_beginner",
    label: "Complete Beginner",
    description: "I have no experience in this field and am starting from scratch",
    icon: Sprout,
    color: "text-emerald-500",
  },
  {
    value: "beginner",
    label: "Beginner",
    description: "I know the basics but haven't built anything significant yet",
    icon: Leaf,
    color: "text-green-500",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "I have some projects and fundamental knowledge in this area",
    icon: TreePine,
    color: "text-teal-500",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "I'm already proficient and looking to specialize further",
    icon: Crown,
    color: "text-primary",
  },
];

interface ExpertiseSelectorProps {
  selectedLevel: ExpertiseLevel | null;
  onSelect: (level: ExpertiseLevel) => void;
}

export function ExpertiseSelector({ selectedLevel, onSelect }: ExpertiseSelectorProps) {
  return (
    <div className="grid gap-4">
      {expertiseLevels.map((level) => {
        const IconComponent = level.icon;
        const isSelected = selectedLevel === level.value;

        return (
          <Card
            key={level.value}
            className={cn(
              "relative cursor-pointer transition-all duration-300 hover:shadow-md border-2",
              isSelected
                ? "border-primary bg-primary/5 shadow-md"
                : "border-border hover:border-primary/50"
            )}
            onClick={() => onSelect(level.value)}
          >
            {isSelected && (
              <div className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-primary-foreground" />
              </div>
            )}

            <CardContent className="p-4 pr-12">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <IconComponent className={cn("w-5 h-5", isSelected ? "" : level.color)} />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{level.label}</h4>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
