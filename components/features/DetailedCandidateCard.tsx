import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, Clock, Trash2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailedCandidateCardProps {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  summary?: string;
  imageUrl?: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: () => void;
  aiSummary?: string;
}

export const DetailedCandidateCard = ({
  id,
  name,
  title,
  company,
  location,
  experience,
  skills,
  summary = "",
  imageUrl,
  isSelected = false,
  onSelect,
  onClick,
  aiSummary
}: DetailedCandidateCardProps) => {
  return (
    <Card 
      className={cn(
        "group w-full bg-white hover:shadow-lg transition-all relative cursor-pointer overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity"
      )}
      onClick={onClick}
    >
      <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(id);
          }}
          className="text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Remove from shortlist"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <CardHeader className="flex flex-row items-start gap-4 pb-3">
        <Avatar className="h-16 w-16 ring-2 ring-primary/5 group-hover:ring-primary/20 transition-all">
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-medium">
            {name.split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="pr-8">
            <h3 className="font-semibold text-lg leading-none group-hover:text-primary transition-colors mb-1">
              {name}
            </h3>
            <p className="text-base text-muted-foreground">{title}</p>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Building className="h-4 w-4 text-gray-500" />
              <span>{company}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{experience}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {aiSummary && (
          <div className="bg-violet-50 rounded-lg p-3 text-sm text-violet-900">
            <p className="font-medium mb-1 text-violet-700 flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              AI Contextual Summary
            </p>
            <p className="leading-relaxed">{aiSummary}</p>
          </div>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {summary}
        </p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.map((skill) => (
            <Badge 
              key={skill} 
              variant="secondary"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};