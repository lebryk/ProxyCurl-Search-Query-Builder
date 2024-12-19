import { Button } from "@/components/ui/button";

interface GenderSectionProps {
  gender: string;
  onGenderChange: (gender: string) => void;
}

export const GenderSection = ({ gender, onGenderChange }: GenderSectionProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <h2 className="text-lg font-medium mb-4">Gender</h2>
      <div className="flex space-x-4">
        <Button 
          variant={gender === "both" ? "default" : "outline"}
          onClick={() => onGenderChange("both")}
        >
          Both
        </Button>
        <Button
          variant={gender === "male" ? "default" : "outline"}
          onClick={() => onGenderChange("male")}
        >
          Male
        </Button>
        <Button
          variant={gender === "female" ? "default" : "outline"}
          onClick={() => onGenderChange("female")}
        >
          Female
        </Button>
      </div>
    </div>
  );
};