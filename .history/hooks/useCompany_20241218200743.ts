import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCompany = (companyId: string) => {
  return useQuery({
    queryKey: ["company", companyId],
    queryFn: async () => {
      if (!companyId) return null;

      const { data, error } = await supabase
        .from("company_profiles")
        .select("*")
        .eq("id", companyId)
        .single();

      if (error) {
        console.error("Error fetching company:", error);
        throw error;
      }

      return {
        ...data,
        // Transform size_range to readable format
        sizeRangeText: getSizeRangeText(data.size_range),
        // Transform scores to percentages for display
        metrics: {
          brandSentiment: (data.brand_sentiment / 5) * 100,
          cultureScore: (data.culture_score / 5) * 100,
          revenueGrowth: data.revenue_growth_percentage,
          teamGrowth: data.team_growth_percentage
        }
      };
    },
    enabled: !!companyId,
  });
};

function getSizeRangeText(sizeRange: number | null): string {
  switch (sizeRange) {
    case 1:
      return "< 50 employees";
    case 2:
      return "50-200 employees";
    case 3:
      return "201-1000 employees";
    case 4:
      return "1001-2000 employees";
    case 5:
      return "2000+ employees";
    default:
      return "Size not specified";
  }
}
