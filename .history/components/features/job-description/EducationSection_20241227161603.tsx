import { TagInput } from "@/components/features/TagInput";
import type { Tag } from "@/types/common";

interface EducationSectionProps {
  educationDegrees: Tag[];
  educationMajors: Tag[];
  onEducationDegreesChange: (tags: Tag[]) => void;
  onEducationMajorsChange: (tags: Tag[]) => void;
}

export const EducationSection = ({
  educationDegrees,
  educationMajors,
  onEducationDegreesChange,
  onEducationMajorsChange,
}: EducationSectionProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-medium mb-4">Education Degree</h2>
          <TagInput
            tags={educationDegrees}
            onTagsChange={onEducationDegreesChange}
            placeholder="Example: Bachelors, Masters"
          />
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Education Major</h2>
          <TagInput
            tags={educationMajors}
            onTagsChange={onEducationMajorsChange}
            placeholder="Example: Accounting, Computer Science"
          />
        </div>
      </div>
    </div>
  );
};