import { Building, MapPin } from "lucide-react";

interface CandidateHeaderProps {
  name: string;
  title: string;
  company: string;
  location: string;
}

export const CandidateHeader = ({ name, title, company, location }: CandidateHeaderProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base leading-none group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{title}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Building className="h-3.5 w-3.5 text-gray-500" />
          <span className="line-clamp-1">{company}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-gray-500" />
          <span className="line-clamp-1">{location}</span>
        </div>
      </div>
    </div>
  );
};