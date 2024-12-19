"use client";

import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/types/supabase";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

type CompanyProfile = Database["public"]["Tables"]["company_profiles"]["Row"];
type CompanyMember = Database["public"]["Tables"]["company_members"]["Row"];
type CompanyRole = Database["public"]["Enums"]["company_role"];

type CompanyMemberWithProfile = {
  id: string;
  role: CompanyRole;
  created_at: string;
  updated_at: string;
  company: CompanyProfile;
}

interface CompanyMembershipData {
  membership: {
    id: string;
    role: CompanyRole;
    created_at: string;
    updated_at: string;
  };
  company: CompanyProfile;
}

export const useCompanyMembership = () => {

  return useQuery<CompanyMembershipData, Error>({
    queryKey: ["company-membership"],
    queryFn: async (): Promise<CompanyMembershipData> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.error("User must be logged in");
        throw new Error("User must be logged in");
      }

      const { data, error } = await supabase
        .from("company_members")
        .select(`
          id,
          role,
          created_at,
          updated_at,
          company:company_id (*)
        `)
        .eq("user_id", session.user.id)
        .single() as { data: CompanyMemberWithProfile | null; error: Error | null };

      if (error) {
        console.error("Error fetching company membership:", error);
        throw error;
      }

      if (!data) {
        throw new Error("No company membership found");
      }

      return {
        membership: {
          id: data.id,
          role: data.role,
          created_at: data.created_at,
          updated_at: data.updated_at
        },
        company: data.company
      };
    },
  });
};
