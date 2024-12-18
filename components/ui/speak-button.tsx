import { useState } from "react";
import { SpeakerIcon } from "lucide-react";
import { speak } from "@/utils/globalAudio";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface SpeakButtonProps {
  text: string;
  className?: string;
}

export function SpeakButton({ text, className }: SpeakButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isSpeaking}
      className={cn("h-8 w-8", className)}
      onClick={async () => {
        try {
          setIsSpeaking(true);
          await speak(text);
        } finally {
          setIsSpeaking(false);
        }
      }}
    >
      <SpeakerIcon className={cn("h-4 w-4", isSpeaking && "animate-pulse")} />
    </Button>
  );
}
