import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";

export const SearchQueryBuilder = () => {
  const navigate = useNavigate();
  const { activeProject } = useProject();

  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl font-semibold">Search Query Builder</h1>
        <p className="text-sm text-muted-foreground">Project: {activeProject?.name}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">1951 Matches</span>
        <Button 
          variant="default"
          onClick={() => navigate('/search-results')}
          className="h-8"
        >
          Start Searching
        </Button>
      </div>
    </div>
  );
};