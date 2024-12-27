import { PeopleSearchQueryParams } from '../types/searchTypes'

export interface QueryField {
  name: keyof PeopleSearchQueryParams;
  group: string;
  label: string;
  field_description: string;
  example: string;
  validation_rules?: string; // Optional regex pattern for validation
}

export const queryFields: QueryField[] = [
  // Basic Info
  { 
    name: 'country', 
    group: 'Basic Info', 
    label: 'Country',
    field_description: 'Filter people located in this country. This parameter accepts a case-insensitive Alpha-2 ISO3166 country code.',
    example: 'US',
    validation_rules: '^[A-Za-z]{2}$'
  },
  { 
    name: 'first_name', 
    group: 'Basic Info', 
    label: 'First Name',
    field_description: 'Filter people whose first names match the provided search expression.',
    example: 'Sarah'
    // free text, no strict validation pattern
  },
  { 
    name: 'last_name', 
    group: 'Basic Info', 
    label: 'Last Name',
    field_description: 'Filter people whose last names match the provided search expression.',
    example: 'Jackson OR Johnson'
    // free text, no strict validation pattern
  },
  { 
    name: 'follower_count_min', 
    group: 'Basic Info', 
    label: 'Minimum Follower Count',
    field_description: 'Filter people with a LinkedIn follower count more than this value.',
    example: '1000',
    validation_rules: '^\\d+$'
  },
  { 
    name: 'follower_count_max', 
    group: 'Basic Info', 
    label: 'Maximum Follower Count',
    field_description: 'Filter people with a LinkedIn follower count less than this value.',
    example: '1000',
    validation_rules: '^\\d+$'
  },
  { 
    name: 'region', 
    group: 'Basic Info', 
    label: 'Region',
    field_description: 'Filter people located in a region matching the provided search expression. A "region" in this context means "state," "province," or similar political division.',
    example: 'California'
    // free text, no strict validation pattern
  },
  { 
    name: 'city', 
    group: 'Basic Info', 
    label: 'City',
    field_description: 'Filter people located in a city matching the provided search expression.',
    example: 'Seattle OR Los Angeles'
    // free text, no strict validation pattern
  },
  { 
    name: 'headline', 
    group: 'Basic Info', 
    label: 'Headline',
    field_description: 'Filter people whose LinkedIn headline fields match the provided search expression.',
    example: 'founder'
    // free text, no strict validation pattern
  },
  { 
    name: 'summary', 
    group: 'Basic Info', 
    label: 'Summary',
    field_description: 'Filter people whose LinkedIn summary fields match the provided search expression.',
    example: 'founder'
    // free text, no strict validation pattern
  },
  
  // Education
  { 
    name: 'education_field_of_study', 
    group: 'Education', 
    label: 'Field of Study',
    field_description: 'Filter people with a field of study matching the provided search expression, based on education history.',
    example: 'computer science'
    // free text, no strict validation pattern
  },
  { 
    name: 'education_degree_name', 
    group: 'Education', 
    label: 'Degree Name',
    field_description: 'Filter people who earned a degree matching the provided search expression, based on education history.',
    example: 'MBA'
    // free text, no strict validation pattern
  },
  { 
    name: 'education_school_name', 
    group: 'Education', 
    label: 'School Name',
    field_description: 'Filter people who have attended a school whose name matches the provided search expression, based on education history.',
    example: 'Caltech OR Massachusetts Institute of Technology'
    // free text, no strict validation pattern
  },
  { 
    name: 'education_school_linkedin_profile_url', 
    group: 'Education', 
    label: 'School LinkedIn Profile URL',
    field_description: 'Filter people who have attended a school with a specific LinkedIn profile URL, based on education history.',
    example: 'https://www.linkedin.com/school/national-university-of-singapore/',
    validation_rules: '^https:\\/\\/www\\.linkedin\\.com\\/(company|school)\\/[a-zA-Z0-9_-]+\\/?$'
  },
  
  // Role Info
  { 
    name: 'current_role_title', 
    group: 'Role Info', 
    label: 'Current Role Title',
    field_description: 'Filter people who are currently working as a role whose title matches the provided search expression.',
    example: 'founder'
    // free text, no strict validation pattern
  },
  { 
    name: 'past_role_title', 
    group: 'Role Info', 
    label: 'Past Role Title',
    field_description: 'Filter people who have in the past worked as a role whose title matches the provided search expression.',
    example: 'founder'
    // free text, no strict validation pattern
  },
  { 
    name: 'current_role_before', 
    group: 'Role Info', 
    label: 'Current Role Start Date',
    field_description: 'Filter people who started their current role before this date. This parameter takes an ISO8601 date.',
    example: '2019-12-30',
    validation_rules: '^\\d{4}-\\d{2}-\\d{2}$'
  },
  { 
    name: 'current_role_after', 
    group: 'Role Info', 
    label: 'Current Role End Date',
    field_description: 'Filter people who started their current role after this date. This parameter takes an ISO8601 date.',
    example: '2019-12-30',
    validation_rules: '^\\d{4}-\\d{2}-\\d{2}$'
  },
  { 
    name: 'current_job_description', 
    group: 'Role Info', 
    label: 'Current Job Description',
    field_description: 'Filter people with current job descriptions matching the provided search expression.',
    example: 'education'
    // free text, no strict validation pattern
  },
  { 
    name: 'past_job_description', 
    group: 'Role Info', 
    label: 'Past Job Description',
    field_description: 'Filter people with past job descriptions matching the provided search expression.',
    example: 'education'
    // free text, no strict validation pattern
  },
  
  // Company Info
  { 
    name: 'current_company_linkedin_profile_url', 
    group: 'Company Info', 
    label: 'Current Company LinkedIn URL',
    field_description: 'Filter people who are currently working at a company represented by this LinkedIn Company Profile URL.',
    example: 'https://www.linkedin.com/company/apple',
    validation_rules: '^https:\\/\\/www\\.linkedin\\.com\\/(company|school)\\/[a-zA-Z0-9_-]+\\/?$'
  },
  { 
    name: 'past_company_linkedin_profile_url', 
    group: 'Company Info', 
    label: 'Past Company LinkedIn URL',
    field_description: 'Filter people who have in the past worked at the company represented by this LinkedIn Company Profile URL.',
    example: 'https://www.linkedin.com/company/apple',
    validation_rules: '^https:\\/\\/www\\.linkedin\\.com\\/(company|school)\\/[a-zA-Z0-9_-]+\\/?$'
  },
  { 
    name: 'current_company_name', 
    group: 'Company Info', 
    label: 'Current Company Name',
    field_description: 'Filter people who are currently working at a company whose name matches the provided search expression.',
    example: 'Stripe OR Apple'
    // free text, no strict validation pattern
  },
  { 
    name: 'past_company_name', 
    group: 'Company Info', 
    label: 'Past Company Name',
    field_description: 'Filter people who have previously worked at a company whose name matches the provided search expression.',
    example: 'Stripe OR Apple'
    // free text, no strict validation pattern
  },
  { 
    name: 'current_company_country', 
    group: 'Company Info', 
    label: 'Current Company Country',
    field_description: 'Filter people currently working at a company with an office based in this country. Accepts Alpha-2 ISO3166 codes.',
    example: 'us',
    validation_rules: '^[A-Za-z]{2}$'
  },
  { 
    name: 'current_company_region', 
    group: 'Company Info', 
    label: 'Current Company Region',
    field_description: 'Filter people currently working at a company based in a region matching the provided search expression.',
    example: 'United States'
    // free text, no strict validation pattern
  },
  { 
    name: 'current_company_city', 
    group: 'Company Info', 
    label: 'Current Company City',
    field_description: 'Filter people currently working at a company based in a city matching the provided search expression.',
    example: 'Seattle OR Los Angeles'
    // free text, no strict validation pattern
  },
  { 
    name: 'current_company_type', 
    group: 'Company Info', 
    label: 'Current Company Type',
    field_description: 'Filter people currently working at a company of the provided LinkedIn type (e.g. NON_PROFIT, PUBLIC_COMPANY, etc.).',
    example: 'NON_PROFIT'
    // limited set of known values but text check only is fine
  },
  { 
    name: 'current_company_follower_count_min', 
    group: 'Company Info', 
    label: 'Current Company Min Followers',
    field_description: 'Filter people currently working at a company with a LinkedIn follower count more than this value.',
    example: '1000',
    validation_rules: '^\\d+$'
  },
  { 
    name: 'current_company_follower_count_max', 
    group: 'Company Info', 
    label: 'Current Company Max Followers',
    field_description: 'Filter people currently working at a company with a LinkedIn follower count less than this value.',
    example: '1000',
    validation_rules: '^\\d+$'
  },
  { 
    name: 'current_company_industry', 
    group: 'Company Info', 
    label: 'Current Company Industry',
    field_description: 'Filter people currently working at a company belonging to an industry that matches the provided search expression.',
    example: 'higher AND education'
    // free text, no strict validation pattern
  },
  { 
    name: 'current_company_employee_count_min', 
    group: 'Company Info', 
    label: 'Current Company Min Employees',
    field_description: 'Filter people currently working at a company with at least this many employees.',
    example: '1000',
    validation_rules: '^\\d+$'
  },
  { 
    name: 'current_company_employee_count_max', 
    group: 'Company Info', 
    label: 'Current Company Max Employees',
    field_description: 'Filter people currently working at a company with at most this many employees.',
    example: '1000',
    validation_rules: '^\\d+$'
  },
  { 
    name: 'current_company_description', 
    group: 'Company Info', 
    label: 'Current Company Description',
    field_description: 'Filter people currently working at a company with a description matching the provided search expression.',
    example: 'medical device'
    // free text, no strict validation pattern
  },
  { 
    name: 'current_company_founded_after_year', 
    group: 'Company Info', 
    label: 'Current Company Founded After Year',
    field_description: 'Filter people currently working at a company that was founded after this year.',
    example: '1999',
    validation_rules: '^\\d+$'
  },
  { 
    name: 'current_company_founded_before_year', 
    group: 'Company Info', 
    label: 'Current Company Founded Before Year',
    field_description: 'Filter people currently working at a company that was founded before this year.',
    example: '1999',
    validation_rules: '^\\d+$'
  },
  { 
    name: 'current_company_funding_amount_min', 
    group: 'Company Info', 
    label: 'Current Company Min Funding',
    field_description: 'Filter people currently working at a company that has raised at least this much (USD) in funding.',
    example: '1000000',
    validation_rules: '^\\d+$'
  },
  { 
    name: 'current_company_funding_amount_max', 
    group: 'Company Info', 
    label: 'Current Company Max Funding',
    field_description: 'Filter people currently working at a company that has raised at most this much (USD) in funding.',
    example: '1000000',
    validation_rules: '^\\d+$'
  },
  { 
    name: 'current_company_funding_raised_after', 
    group: 'Company Info', 
    label: 'Current Company Funding After Date',
    field_description: 'Filter people currently working at a company that has raised funding after this date.',
    example: '2019-12-30',
    validation_rules: '^\\d{4}-\\d{2}-\\d{2}$'
  },
  { 
    name: 'current_company_funding_raised_before', 
    group: 'Company Info', 
    label: 'Current Company Funding Before Date',
    field_description: 'Filter people currently working at a company that has raised funding before this date.',
    example: '2019-12-30',
    validation_rules: '^\\d{4}-\\d{2}-\\d{2}$'
  },
  
  // Other Info
  { 
    name: 'linkedin_groups', 
    group: 'Other Info', 
    label: 'LinkedIn Groups',
    field_description: 'Filter people who are members of LinkedIn groups whose names match the provided search expression.',
    example: 'haskell'
    // free text, no strict validation pattern
  },
  { 
    name: 'languages', 
    group: 'Other Info', 
    label: 'Languages',
    field_description: 'Filter people who list a language matching the provided search expression.',
    example: 'Mandarin OR Chinese'
    // free text, no strict validation pattern
  },
  { 
    name: 'industries', 
    group: 'Other Info', 
    label: 'Industries',
    field_description: 'Person\'s inferred industry. May sometimes exist when current_company_industry does not.',
    example: 'automotive'
    // free text, no strict validation pattern
  },
  { 
    name: 'interests', 
    group: 'Other Info', 
    label: 'Interests',
    field_description: 'Filter people whose LinkedIn interest fields match the provided search expression.',
    example: 'technology'
    // free text, no strict validation pattern
  },
  { 
    name: 'skills', 
    group: 'Other Info', 
    label: 'Skills',
    field_description: 'Filter people whose LinkedIn skill fields match the provided search expression.',
    example: 'accounting'
    // free text, no strict validation pattern
  },
  
  // Search Parameters
  { 
    name: 'public_identifier_in_list', 
    group: 'Search Parameters', 
    label: 'Include Public Identifiers',
    field_description: 'A list of public identifiers. The target person’s identifier must be a member of this list.',
    example: 'williamhgates,johnrmarty'
    // comma-separated identifiers, no strict pattern given
  },
  { 
    name: 'public_identifier_not_in_list', 
    group: 'Search Parameters', 
    label: 'Exclude Public Identifiers',
    field_description: 'A list of public identifiers. The target person’s identifier must not be a member of this list.',
    example: 'williamhgates,johnrmarty'
    // comma-separated identifiers, no strict pattern given
  },
  { 
    name: 'page_size', 
    group: 'Search Parameters', 
    label: 'Page Size',
    field_description: 'Tune the maximum results returned per API call. Default is 100, valid range is 1 to 100. When enrich_profiles=enrich, range is 1 to 10.',
    example: '10',
    validation_rules: '^\\d+$'
  },
  { 
    name: 'enrich_profiles', 
    group: 'Search Parameters', 
    label: 'Enrich Profiles',
    field_description: 'Get the person\'s complete profile data (enrich) or just URLs (skip). Valid values: skip (default), enrich.',
    example: 'enrich'
    // limited set of known values but no strict pattern necessary
  },
  { 
    name: 'use_cache', 
    group: 'Search Parameters', 
    label: 'Use Cache',
    field_description: 'Define the freshness guarantee on results. Valid values: if-present (default), if-recent.',
    example: 'if-present'
    // limited set of known values but no strict pattern necessary
  },
]

