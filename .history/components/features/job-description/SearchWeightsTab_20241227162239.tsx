import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { WeightsBarChart } from "@/components/features/WeightsBarChart";
import { defaultProfiles, SearchProfile } from "@/data/searchProfiles";

interface SearchWeightsTabProps {
  searchWeights: any[];
  onWeightsChange: (weights: any[]) => void;
  activeProfile: SearchProfile | null;
  onProfileChange: (profile: SearchProfile | null) => void;
}

export const SearchWeightsTab = ({
  searchWeights,
  onWeightsChange,
  activeProfile,
  onProfileChange
}: SearchWeightsTabProps) => {
  const [weights, setWeights] = useState(searchWeights);

  useEffect(() => {
    if (activeProfile) {
      setWeights(activeProfile.weights);
      onWeightsChange(activeProfile.weights);
    }
  }, [activeProfile]);

  const handleWeightChange = (fieldId: string, value: number) => {
    const updatedWeights = weights.map(weight => {
      if (weight.fieldId === fieldId) {
        return { ...weight, weight: value };
      }
      return weight;
    });
    setWeights(updatedWeights);
    onWeightsChange(updatedWeights);
  };

  const handleObligatoryChange = (fieldId: string, checked: boolean) => {
    const updatedWeights = weights.map(weight => {
      if (weight.fieldId === fieldId) {
        return { ...weight, isObligatory: checked };
      }
      return weight;
    });
    setWeights(updatedWeights);
    onWeightsChange(updatedWeights);
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Search Configuration</h2>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => onProfileChange(defaultProfiles[0])}>
            Load Default Profile
          </Button>
          <Button variant="outline">
            Save as Profile
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <WeightsBarChart weights={weights} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {weights.map((weight) => (
          <div key={weight.fieldId} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base">{weight.label}</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={weight.isObligatory}
                  onCheckedChange={(checked) => handleObligatoryChange(weight.fieldId, checked as boolean)}
                />
                <span className="text-sm text-muted-foreground">Required</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Slider
                value={[weight.weight]}
                onValueChange={([value]) => handleWeightChange(weight.fieldId, value)}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="w-12 text-sm">{weight.weight}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};