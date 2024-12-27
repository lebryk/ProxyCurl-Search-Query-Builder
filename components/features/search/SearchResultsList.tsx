import { CandidateCard } from "@/components/features/CandidateCard";
import { SearchResult } from "@/types/PersonSearch";

interface SearchResultsListProps {
  candidates: SearchResult[];
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
        {candidates?.map((result) => {
          const profile = result.profile;
          if (!profile) return null;

          // Extract current experience if available
          const currentExperience = profile.experiences?.[0];
          
          console.log("Rendering candidate card:", {
            public_identifier: profile.public_identifier,
            name: profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
          });
          
          return (
            <CandidateCard 
              key={profile.public_identifier}
              id={profile.public_identifier}
              name={profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim()}
              title={profile.headline || currentExperience?.title || 'Not specified'}
              company={currentExperience?.company || 'Not specified'}
              location={profile.city ? `${profile.city}, ${profile.country || ''}` : profile.country || 'Not specified'}
              skills={[]} // Skills are not directly available in the profile
              score={75} // Default score since it's not in the profile
              imageUrl={profile.profile_pic_url || undefined}
              isSelected={selectedCandidates.includes(profile.public_identifier)}
              onSelect={onCandidateSelect}
              onClick={() => {
                console.log("Card clicked, calling onProfileClick with:", profile.public_identifier);
                onProfileClick(profile.public_identifier);
              }}
              aiSummary={profile.summary || undefined}
            />
          );
        })}
      </div>
    </div>
  );
};