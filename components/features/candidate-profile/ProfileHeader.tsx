import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Building, MapPin } from "lucide-react";
import type { Candidate } from "@/types/candidate";

interface ProfileHeaderProps {
  candidate: Candidate;
}

export const ProfileHeader = ({ candidate }: ProfileHeaderProps) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
      <DialogHeader>
        <DialogTitle className="sr-only">Candidate Profile</DialogTitle>
        <DialogDescription className="sr-only">
          Detailed information about {candidate.name}, including their professional background, contact details, and skills.
        </DialogDescription>
        <div className="flex items-start gap-6">
          <Avatar className="w-24 h-24 border-4 border-white/20">
            <AvatarImage src={candidate.imageUrl} alt={candidate.name} />
            <AvatarFallback className="text-2xl">{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{candidate.name}</h2>
            <p className="text-xl text-white/90">{candidate.title}</p>
            <div className="flex items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span>{candidate.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{candidate.location}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogHeader>
    </div>
  );
};