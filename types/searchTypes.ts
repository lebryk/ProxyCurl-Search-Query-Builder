export interface PeopleSearchQueryParams {
  // Basic Info
  country?: string;
  first_name?: string;
  last_name?: string;
  follower_count_min?: number;
  follower_count_max?: number;
  region?: string;
  city?: string;
  headline?: string;
  summary?: string;
  
  // Education
  education_field_of_study?: string | string[];
  education_degree_name?: string | string[];
  education_school_name?: string | string[];
  education_school_linkedin_profile_url?: string;
  
  // Role Info
  current_role_title?: string | string[];
  past_role_title?: string | string[];
  current_role_before?: string; // ISO8601 date
  current_role_after?: string;  // ISO8601 date
  current_job_description?: string;
  past_job_description?: string;
  
  // Company Info
  current_company_linkedin_profile_url?: string;
  past_company_linkedin_profile_url?: string;
  current_company_name?: string;
  past_company_name?: string;
  current_company_country?: string; // ISO3166 Alpha-2
  current_company_region?: string;
  current_company_city?: string;
  current_company_type?:
    | "EDUCATIONAL"
    | "GOVERNMENT_AGENCY"
    | "NON_PROFIT"
    | "PARTNERSHIP"
    | "PRIVATELY_HELD"
    | "PUBLIC_COMPANY"
    | "SELF_EMPLOYED"
    | "SELF_OWNED";
  current_company_follower_count_min?: number;
  current_company_follower_count_max?: number;
  current_company_industry?: string | string[];
  current_company_employee_count_min?: number;
  current_company_employee_count_max?: number;
  current_company_description?: string;
  current_company_founded_after_year?: number;
  current_company_founded_before_year?: number;
  current_company_funding_amount_min?: number;
  current_company_funding_amount_max?: number;
  current_company_funding_raised_after?: string;  // ISO8601 date
  current_company_funding_raised_before?: string; // ISO8601 date
  
  // Other Info
  linkedin_groups?: string | string[];
  languages?: string | string[];
  industries?: string | string[];
  interests?: string | string[];
  skills?: string | string[];
  
  // Search Parameters
  public_identifier_in_list?: string | string[];
  public_identifier_not_in_list?: string | string[];
  page_size?: number; // 1 to 100 or 1 to 10 if enrich
  enrich_profiles?: "skip" | "enrich";
  use_cache?: "if-present" | "if-recent";
}

