import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

interface ExperienceSectionProps {
  experienceRange: [number, number];
  onExperienceRangeChange: (value: [number, number]) => void;
  onExperienceRangeCommit: (value: [number, number]) => void;
}

export const ExperienceSection = ({
  experienceRange,
  onExperienceRangeChange,
  onExperienceRangeCommit,
}: ExperienceSectionProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <h2 className="text-lg font-medium mb-4">Experience (Years)</h2>
      <div className="space-y-3">
        <Slider
          value={experienceRange}
          onValueChange={(value) => onExperienceRangeChange(value as [number, number])}
          onValueCommit={(value) => onExperienceRangeCommit(value as [number, number])}
          max={30}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{experienceRange[0]} years</span>
          <span>{experienceRange[1]} years</span>
        </div>
        <p className="text-muted-foreground text-sm">
          Candidates that are within the experience range provided will be ranked higher
        </p>
        <div className="flex items-center space-x-2">
          <Checkbox id="experience-range" />
          <label htmlFor="experience-range" className="text-sm text-muted-foreground">
            Only show candidates that fall within the selected range
          </label>
        </div>
      </div>
    </div>
  );
};