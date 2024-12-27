import { TagInput } from "@/components/features/TagInput";
import type { Tag } from "@/types/common";

interface IndustrySectionProps {
  industries: Tag[];
  onIndustriesChange: (tags: Tag[]) => void;
}

export const IndustrySection = ({
  industries,
  onIndustriesChange,
}: IndustrySectionProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-medium mb-4">Industry</h2>
          <TagInput
            tags={industries}
            onTagsChange={onIndustriesChange}
            placeholder="Type an industry and select from the list"
            suggestions={[]}
          />
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Recent Job Industry</h2>
          <TagInput
            tags={industries}
            onTagsChange={onIndustriesChange}
            placeholder="Example: Technology, Finance"
          />
        </div>
      </div>
    </div>
  );
};