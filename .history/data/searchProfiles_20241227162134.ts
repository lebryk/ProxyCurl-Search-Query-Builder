export interface SearchProfile {
  name: string;
  weights: {
    fieldId: string;
    isObligatory: boolean;
    label: string;
    weight: number;
  }[];
}

// An example default profile array:
export const defaultProfiles: SearchProfile[] = [
  {
    name: "My Default Profile",
    weights: [
      { fieldId: "field1", isObligatory: false, label: "Label 1", weight: 50 },
      { fieldId: "field2", isObligatory: true, label: "Label 2", weight: 75 },
    ],
  },
]; 