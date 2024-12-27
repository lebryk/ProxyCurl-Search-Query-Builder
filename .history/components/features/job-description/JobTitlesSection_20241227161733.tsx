import { TagInput } from "@/components/features/TagInput";
import type { Tag } from "@/types/common";

interface JobTitlesSectionProps {
  jobTitles: Tag[];
  onJobTitlesChange: (tags: Tag[]) => void;
  jobTitleSuggestions: Tag[];
}

export const JobTitlesSection = ({ 
  jobTitles, 
  onJobTitlesChange, 
  jobTitleSuggestions 
}: JobTitlesSectionProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-4">
          <h2 className="text-lg font-medium">Job Titles</h2>
          <div className="rounded-full bg-slate-200 p-1 flex items-center justify-center">
            <span className="text-xs px-2 leading-none">Current</span>
          </div>
        </div>
        <TagInput
          tags={jobTitles}
          onTagsChange={onJobTitlesChange}
          placeholder="Type a job title and select from the list"
          suggestions={jobTitleSuggestions}
        />
      </div>

      <div className="mb-3">
        <div className="flex items-center space-x-2 mb-4">
          <h2 className="text-lg font-medium">Recent Job Title</h2>
          <div className="rounded-full bg-slate-200 p-1 flex items-center justify-center">
            <span className="text-xs px-2 leading-none">Past</span>
          </div>
        </div>
        <TagInput
          tags={jobTitles}
          onTagsChange={onJobTitlesChange}
          placeholder="Example: Software Engineer, Product Manager"
        />
      </div>
    </div>
  );
};