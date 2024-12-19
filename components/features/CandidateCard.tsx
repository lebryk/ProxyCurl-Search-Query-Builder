import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { CandidateAvatar } from "./candidate/CandidateAvatar";
import { CandidateHeader } from "./candidate/CandidateHeader";

interface CandidateCardProps {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  score: number;
  imageUrl?: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: () => void;
  aiSummary?: string;
}

export const CandidateCard = ({ 
  id,
  name, 
  title, 
  company,
  location,
  skills,
  score,
  imageUrl,
  isSelected = false,
  onSelect,
  onClick,
  aiSummary
}: CandidateCardProps) => {
  return (
    <Card 
      className={cn(
        "group w-full bg-white hover:shadow-lg transition-all relative cursor-pointer h-full",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
      )}
      onClick={onClick}
    >
      {onSelect && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
          }}
          className="absolute right-3 top-3 z-10 text-gray-400 hover:text-yellow-400 transition-colors"
          aria-label={isSelected ? "Remove from favorites" : "Add to favorites"}
        >
          <Star
            className={cn(
              "h-5 w-5 transition-all",
              isSelected && "fill-yellow-400 text-yellow-400"
            )}
          />
        </button>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <CandidateAvatar 
            name={name}
            imageUrl={imageUrl}
            className="h-12 w-12 ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all"
          />
          <CandidateHeader
            name={name}
            title={title}
            company={company}
            location={location}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {aiSummary && (
          <div className="bg-violet-50 rounded-lg p-3 text-sm text-violet-900">
            <p className="font-medium mb-1 text-violet-700 flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              AI Contextual Summary
            </p>
            <p className="leading-relaxed">{aiSummary}</p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill) => (
              <Badge 
                key={skill} 
                variant="secondary"
                className="px-2 py-0 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge 
                variant="secondary"
                className="px-2 py-0 text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                +{skills.length - 3}
              </Badge>
            )}
          </div>
          <Badge 
            variant="secondary" 
            className={cn(
              "text-xs font-medium",
              score >= 80 ? "bg-green-50 text-green-700" :
              score >= 60 ? "bg-blue-50 text-blue-700" :
              "bg-orange-50 text-orange-700"
            )}
          >
            {score}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};