import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const CompanyProfileSection = () => {
  const router = useRouter();
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-600 mb-2">
            We've analyzed companies similar to yours that experienced rapid growth in the past two years. 
            This helps us identify candidates who have tackled challenges you're facing now or will face soon. 
            Combined with your company profile, this approach ensures you find people with the most relevant experience for your growth stage.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/company')} className="shrink-0 ml-4">
          <Building className="mr-2 h-4 w-4" />
          Edit Company Profile
        </Button>
      </div>
    </div>
  );
};