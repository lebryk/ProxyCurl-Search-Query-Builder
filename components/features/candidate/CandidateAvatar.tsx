import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAvatarCache } from "@/hooks/useAvatarCache";
import { useEffect, useState } from "react";

interface CandidateAvatarProps {
  name: string;
  imageUrl?: string;
  className?: string;
}

export const CandidateAvatar = ({ name, imageUrl, className }: CandidateAvatarProps) => {
  const [showFallback, setShowFallback] = useState(!imageUrl);
  const { getImage } = useAvatarCache([imageUrl]);

  // Reset fallback state when image URL changes
  useEffect(() => {
    setShowFallback(!imageUrl);
  }, [imageUrl]);

  const initials = name.split(" ").map(n => n[0]).join("");

  return (
    <Avatar className={className}>
      {!showFallback && (
        <AvatarImage 
          src={imageUrl}
          alt={name}
          onError={() => setShowFallback(true)}
          className="transition-opacity duration-200"
        />
      )}
      <AvatarFallback 
        className={`bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-medium ${
          !showFallback ? "hidden" : ""
        }`}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};