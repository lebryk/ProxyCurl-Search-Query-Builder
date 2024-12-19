import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WeightBarProps {
  weights: {
    fieldId: string;
    label: string;
    weight: number;
    isObligatory: boolean;
  }[];
}

const colors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-red-500",
  "bg-orange-500",
];

export function WeightsBarChart({ weights }: WeightBarProps) {
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  
  // Calculate normalized weights (relative to 100%)
  const normalizedWeights = weights.map(weight => ({
    ...weight,
    normalizedWeight: totalWeight > 0 ? (weight.weight / totalWeight) * 100 : 0
  }));
  
  return (
    <div className="space-y-2">
      <div className="flex h-4 w-full rounded-full overflow-hidden">
        <TooltipProvider>
          {normalizedWeights.map((weight, index) => {
            if (weight.normalizedWeight === 0) return null;
            
            return (
              <Tooltip key={weight.fieldId}>
                <TooltipTrigger asChild>
                  <div
                    role="presentation"
                    className={cn(
                      colors[index % colors.length],
                      "transition-all duration-500",
                      weight.isObligatory ? "[border:2px_solid_rgba(0,0,0,0.5)]" : "",
                      "cursor-default"
                    )}
                    style={{ width: `${weight.normalizedWeight}%` }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-medium">{weight.label}</p>
                    <p className="text-muted-foreground">
                      {weight.normalizedWeight.toFixed(1)}% 
                      {weight.isObligatory ? " (Required)" : ""}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <div className="space-x-2">
          <span>Original Total: {totalWeight}%</span>
          <span>•</span>
          <span>Normalized to 100%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 [border:2px_solid_rgba(0,0,0,0.5)]" />
            <span>Required</span>
          </div>
        </div>
      </div>
    </div>
  );
}
