import { Building2, MapPin } from "lucide-react";
import { CandidateAvatar } from "../candidate/CandidateAvatar";
import { Badge } from "@/components/ui/badge";
import { SearchResult } from "@/types/PersonSearch";

interface ProfileHeaderProps {
  candidate: SearchResult;
}

export function ProfileHeader({ candidate }: ProfileHeaderProps) {
  const profile = candidate.profile;
  if (!profile) return null;

  const currentExperience = profile.experiences?.[0];

  return (
    <div className="p-6 bg-white border-b space-y-4">
      <div className="flex items-start gap-4">
        <CandidateAvatar
          name={`${profile.first_name || ''} ${profile.last_name || ''}`}
          imageUrl={profile.profile_pic_url || undefined}
          className="h-16 w-16"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {profile.first_name} {profile.last_name}
          </h2>
          <p className="text-gray-600">{profile.headline || currentExperience?.title || 'Not specified'}</p>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-gray-500">
            {currentExperience?.company && (
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{currentExperience.company}</span>
              </div>
            )}
            {profile.city && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{profile.city}{profile.country ? `, ${profile.country}` : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}