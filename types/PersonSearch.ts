/**
 * =========================
 * Request Parameter Types
 * =========================
 */
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

/**
 * =========================
 * Response Data Types
 * =========================
 */

export interface PeopleSearchResponse {
  next_page: string | null;
  results: SearchResult[];
  total_result_count: number;
}

export interface SearchResult {
  last_updated: string; // ISO8601 timestamp
  linkedin_profile_url: string;
  profile: Person | null;
}

export interface Person {
  public_identifier: string;
  profile_pic_url: string | null;
  background_cover_image_url: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  follower_count: number | null;
  occupation: string | null;
  headline: string | null;
  summary: string | null;
  country: string | null; // ISO3166-1 alpha-2 code
  country_full_name: string | null;
  city: string | null;
  state: string | null;
  experiences: Experience[];
  education: Education[];
  languages?: string[]; // Returned as simple strings in examples
  accomplishment_organisations?: AccomplishmentOrg[];
  accomplishment_publications?: Publication[];
  accomplishment_honors_awards?: HonourAward[];
  accomplishment_patents?: Patent[];
  accomplishment_courses?: Course[];
  accomplishment_projects?: Project[];
  accomplishment_test_scores?: TestScore[];
  volunteer_work?: VolunteeringExperience[];
  certifications?: Certification[];
  connections?: number;
  people_also_viewed?: PeopleAlsoViewed[];
  recommendations?: string[];
  activities?: Activity[];
  similarly_named_profiles?: SimilarProfile[];
  articles?: Article[];
  groups?: PersonGroup[];
}

/**
 * DateObject
 */
export interface DateObject {
  day?: number;
  month?: number;
  year?: number;
}

/**
 * Experience
 */
export interface Experience {
  starts_at: DateObject | null;
  ends_at: DateObject | null;
  company: string | null;
  company_linkedin_profile_url: string | null;
  company_facebook_profile_url: string | null;
  title: string | null;
  description: string | null;
  location: string | null;
  logo_url: string | null;
}

/**
 * Education
 */
export interface Education {
  starts_at: DateObject | null;
  ends_at: DateObject | null;
  field_of_study: string | null;
  degree_name: string | null;
  school: string | null;
  school_linkedin_profile_url: string | null;
  school_facebook_profile_url: string | null;
  description: string | null;
  logo_url: string | null;
  grade: string | null;
  activities_and_societies: string | null;
}

/**
 * Language (Defined but not used directly since response returns strings)
 */
export interface Language {
  name: string;
  proficiency?:
    | "ELEMENTARY"
    | "LIMITED_WORKING"
    | "PROFESSIONAL_WORKING"
    | "FULL_PROFESSIONAL"
    | "NATIVE_OR_BILINGUAL";
}

/**
 * AccomplishmentOrg
 */
export interface AccomplishmentOrg {
  starts_at: DateObject | null;
  ends_at: DateObject | null;
  org_name: string | null;
  title: string | null;
  description: string | null;
}

/**
 * Publication
 */
export interface Publication {
  name: string | null;
  publisher: string | null;
  published_on: DateObject | null;
  description: string | null;
  url: string | null;
}

/**
 * HonourAward
 */
export interface HonourAward {
  title: string | null;
  issuer: string | null;
  issued_on: DateObject | null;
  description: string | null;
}

/**
 * Patent
 */
export interface Patent {
  title: string | null;
  issuer: string | null;
  issued_on: DateObject | null;
  description: string | null;
  application_number: string | null;
  patent_number: string | null;
  url: string | null;
}

/**
 * Course
 */
export interface Course {
  name: string | null;
  number: string | null;
}

/**
 * Project
 */
export interface Project {
  starts_at: DateObject | null;
  ends_at: DateObject | null;
  title: string | null;
  description: string | null;
  url: string | null;
}

/**
 * TestScore
 */
export interface TestScore {
  name: string | null;
  score: string | null;
  date_on: DateObject | null;
  description: string | null;
}

/**
 * VolunteeringExperience
 */
export interface VolunteeringExperience {
  starts_at: DateObject | null;
  ends_at: DateObject | null;
  title: string | null;
  cause: string | null;
  company: string | null;
  company_linkedin_profile_url: string | null;
  description: string | null;
  logo_url: string | null;
}

/**
 * Certification
 */
export interface Certification {
  starts_at: DateObject | null;
  ends_at: DateObject | null;
  name: string | null;
  license_number: string | null;
  display_source: string | null;
  authority: string | null;
  url: string | null;
}

/**
 * PeopleAlsoViewed
 */
export interface PeopleAlsoViewed {
  link: string | null;
  name: string | null;
  summary: string | null;
  location: string | null;
}

/**
 * Activity
 */
export interface Activity {
  title: string | null;
  link: string | null;
  activity_status: string | null;
}

/**
 * SimilarProfile
 */
export interface SimilarProfile {
  name: string | null;
  link: string | null;
  summary: string | null;
  location: string | null;
}

/**
 * Article
 */
export interface Article {
  title: string | null;
  link: string | null;
  published_date?: DateObject;
  author: string | null;
  image_url: string | null;
}

/**
 * PersonGroup
 */
export interface PersonGroup {
  profile_pic_url: string | null;
  name: string | null;
  url: string | null;
}