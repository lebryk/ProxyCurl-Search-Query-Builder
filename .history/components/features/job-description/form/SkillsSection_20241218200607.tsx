import { TagInput } from "@/components/TagInput";
import type { Tag } from "@/types/common";

interface SkillsSectionProps {
  skills: Tag[];
  onSkillsChange: (tags: Tag[]) => void;
}

export const SkillsSection = ({ skills, onSkillsChange }: SkillsSectionProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <h2 className="text-lg font-medium mb-4">Skills</h2>
      <TagInput
        tags={skills}
        onTagsChange={onSkillsChange}
        placeholder="Type a skill and select from the list"
      />
    </div>
  );
};