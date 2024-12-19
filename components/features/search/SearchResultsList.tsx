import { CandidateCard } from "@/components/features/CandidateCard";

interface Candidate {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  score: number;
  imageUrl?: string;
  isShortlisted?: boolean;
  aiSummary?: string;
}

interface SearchResultsListProps {
  candidates: Candidate[];
  selectedCandidates: string[];
  onCandidateSelect: (id: string) => void;
  onProfileClick: (id: string) => void;
}

export const SearchResultsList = ({ 
  candidates = [], // Provide default empty array
  selectedCandidates = [], 
  onCandidateSelect,
  onProfileClick 
}: SearchResultsListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Found {candidates?.length || 0} matching candidates
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {candidates?.map((candidate) => (
          <CandidateCard 
            key={candidate.id}
            id={candidate.id}
            name={candidate.name}
            title={candidate.title}
            company={candidate.company}
            location={candidate.location}
            skills={candidate.skills}
            score={candidate.score}
            imageUrl={candidate.imageUrl}
            isSelected={selectedCandidates.includes(candidate.id)}
            onSelect={onCandidateSelect}
            onClick={() => onProfileClick(candidate.id)}
            aiSummary={candidate.aiSummary}
          />
        ))}
      </div>
    </div>
  );
};