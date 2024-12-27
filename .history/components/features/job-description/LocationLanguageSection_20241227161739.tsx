import { TagInput } from "@/components/features/TagInput";
import { Search } from "lucide-react";
import type { Tag } from "@/types/common";

interface LocationLanguageSectionProps {
  languages: Tag[];
  nationalities: Tag[];
  locations: Tag[];
  onLanguagesChange: (tags: Tag[]) => void;
  onNationalitiesChange: (tags: Tag[]) => void;
  onLocationsChange: (tags: Tag[]) => void;
}

export const LocationLanguageSection = ({
  languages,
  nationalities,
  locations,
  onLanguagesChange,
  onNationalitiesChange,
  onLocationsChange,
}: LocationLanguageSectionProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="space-y-3">
        <div className="mb-5">
          <h2 className="text-lg font-medium mb-4">Language</h2>
          <TagInput
            tags={languages}
            onTagsChange={onLanguagesChange}
            placeholder="Example: English, Arabic, Urdu, Hindi"
          />
        </div>

        <div className="mb-5">
          <h2 className="text-lg font-medium mb-4">Nationality</h2>
          <TagInput
            tags={nationalities}
            onTagsChange={onNationalitiesChange}
            placeholder="Select nationality"
          />
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Location</h2>
          <TagInput
            tags={locations}
            onTagsChange={onLocationsChange}
            placeholder="Example: Abu Dhabi, Dubai, Oman"
            icon={<Search className="h-4 w-4 text-muted-foreground" />}
          />
        </div>
      </div>
    </div>
  );
};