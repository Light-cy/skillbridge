import { CareerPath } from "@/types/database";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, TrendingUp, DollarSign, BarChart3, Code, Palette, Database, Shield, Brain, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface CareerCardProps {
  career: CareerPath;
  isSelected: boolean;
  onSelect: (career: CareerPath) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  code: Code,
  palette: Palette,
  database: Database,
  shield: Shield,
  brain: Brain,
  smartphone: Smartphone,
  default: BarChart3,
};

export function CareerCard({ career, isSelected, onSelect }: CareerCardProps) {
  const IconComponent = iconMap[career.icon || "default"] || iconMap.default;

  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2",
        isSelected
          ? "border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20"
          : "border-border hover:border-primary/50"
      )}
      onClick={() => onSelect(career)}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
          <Check className="w-4 h-4 text-primary-foreground" />
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
            isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
          )}>
            <IconComponent className="w-6 h-6" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-lg mb-1">{career.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {career.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {career.avg_salary_range && (
                <Badge variant="secondary" className="text-xs">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {career.avg_salary_range}
                </Badge>
              )}
              {career.growth_outlook && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {career.growth_outlook}
                </Badge>
              )}
            </div>
            
            {career.required_skills && career.required_skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {career.required_skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {career.required_skills.length > 3 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{career.required_skills.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
