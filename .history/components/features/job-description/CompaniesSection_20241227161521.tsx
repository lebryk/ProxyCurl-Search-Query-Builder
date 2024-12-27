import { TagInput } from "@/components/features/TagInput";
import type { Tag } from "@/types/common";

interface CompaniesSectionProps {
  companies: Tag[];
  excludedCompanies: Tag[];
  currentEmployer: Tag[];
  previousEmployer: Tag[];
  onCompaniesChange: (tags: Tag[]) => void;
  onExcludedCompaniesChange: (tags: Tag[]) => void;
  onCurrentEmployerChange: (tags: Tag[]) => void;
  onPreviousEmployerChange: (tags: Tag[]) => void;
}

export const CompaniesSection = ({
  companies,
  excludedCompanies,
  currentEmployer,
  previousEmployer,
  onCompaniesChange,
  onExcludedCompaniesChange,
  onCurrentEmployerChange,
  onPreviousEmployerChange,
}: CompaniesSectionProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="space-y-3">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-lg font-medium">Companies</h2>
            <div className="rounded-full bg-slate-200 p-1 flex items-center">
              <span className="text-xs px-2 leading-none">Current + Past</span>
            </div>
          </div>
          <TagInput
            tags={companies}
            onTagsChange={onCompaniesChange}
            placeholder="Example: Google, Amazon, Bayt"
          />
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Excluded Companies</h2>
          <TagInput
            tags={excludedCompanies}
            onTagsChange={onExcludedCompaniesChange}
            placeholder="Example: Google, Amazon, Bayt"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-medium">Recent Employer</h2>
            <div className="rounded-full bg-slate-200 p-1 flex items-center">
              <span className="text-xs px-2 leading-none">Current</span>
            </div>
          </div>
          <TagInput
            tags={currentEmployer}
            onTagsChange={onCurrentEmployerChange}
            placeholder="Example: Google, Amazon, Bayt"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-medium">Previous Employer</h2>
            <div className="rounded-full bg-slate-200 p-1 flex items-center">
              <span className="text-xs px-2 leading-none">Past</span>
            </div>
          </div>
          <TagInput
            tags={previousEmployer}
            onTagsChange={onPreviousEmployerChange}
            placeholder="Example: Google, Amazon, Bayt"
          />
        </div>
      </div>
    </div>
  );
};