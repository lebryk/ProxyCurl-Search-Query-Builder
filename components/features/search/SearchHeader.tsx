import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { useToast } from "@/components/ui/use-toast";

interface SearchHeaderProps {
  selectedCount: number;
  onSaveShortlist: () => void;
}

export const SearchHeader = ({ selectedCount, onSaveShortlist }: SearchHeaderProps) => {
  return (
    <div className="sticky top-0 bg-gray-50/80 backdrop-blur-sm z-[5] p-4">
      <div className="flex items-center justify-between gap-4">
        <SearchBar />
        {selectedCount > 0 && (
          <Button onClick={onSaveShortlist} className="whitespace-nowrap">
            Save to Shortlist ({selectedCount})
          </Button>
        )}
      </div>
    </div>
  );
};