// PeopleSearchQueryForm.tsx

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { PeopleSearchQueryParams } from "@/types/PersonSearch";  // Make sure this points to where you defined PeopleSearchQueryParams
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagInput } from "@/components/features/TagInput";

// Utility function to safely convert comma-separated strings or string arrays into the format expected by the API
function convertToORList(input: string | string[]): string | undefined {
  if (Array.isArray(input)) {
    return input.length > 0 ? input.join(" OR ") : undefined;
  }
  const trimmed = input.trim();
  if (!trimmed) return undefined;
  const parts = trimmed.split(",").map(p => p.trim()).filter(Boolean);
  if (parts.length === 0) return undefined;
  return parts.join(" OR ");
}

const formSchema = z.object({
  // Basic Info
  country: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  follower_count_min: z.number().optional(),
  follower_count_max: z.number().optional(),
  
  // Education
  education_field_of_study: z.union([z.string(), z.array(z.string())]).optional(),
  education_degree_name: z.union([z.string(), z.array(z.string())]).optional(),
  education_school_name: z.union([z.string(), z.array(z.string())]).optional(),
  education_school_linkedin_profile_url: z.string().optional(),
  
  // Role Info
  current_role_title: z.union([z.string(), z.array(z.string())]).optional(),
  past_role_title: z.union([z.string(), z.array(z.string())]).optional(),
  current_role_before: z.string().optional(),
  current_role_after: z.string().optional(),
  current_job_description: z.string().optional(),
  past_job_description: z.string().optional(),
  
  // Company Info
  current_company_linkedin_profile_url: z.string().optional(),
  past_company_linkedin_profile_url: z.string().optional(),
  current_company_name: z.string().optional(),
  past_company_name: z.string().optional(),
  current_company_country: z.string().optional(),
  current_company_region: z.string().optional(),
  current_company_city: z.string().optional(),
  current_company_type: z.enum([
    "EDUCATIONAL",
    "GOVERNMENT_AGENCY",
    "NON_PROFIT",
    "PARTNERSHIP",
    "PRIVATELY_HELD",
    "PUBLIC_COMPANY",
    "SELF_EMPLOYED",
    "SELF_OWNED"
  ]).optional(),
  current_company_follower_count_min: z.number().optional(),
  current_company_follower_count_max: z.number().optional(),
  current_company_industry: z.union([z.string(), z.array(z.string())]).optional(),
  current_company_employee_count_min: z.number().optional(),
  current_company_employee_count_max: z.number().optional(),
  current_company_description: z.string().optional(),
  current_company_founded_after_year: z.number().optional(),
  current_company_founded_before_year: z.number().optional(),
  current_company_funding_amount_min: z.number().optional(),
  current_company_funding_amount_max: z.number().optional(),
  current_company_funding_raised_after: z.string().optional(),
  current_company_funding_raised_before: z.string().optional(),
  
  // Other Info
  linkedin_groups: z.union([z.string(), z.array(z.string())]).optional(),
  languages: z.union([z.string(), z.array(z.string())]).optional(),
  region: z.string().optional(),
  city: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  industries: z.union([z.string(), z.array(z.string())]).optional(),
  interests: z.union([z.string(), z.array(z.string())]).optional(),
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  
  // Search Parameters
  public_identifier_in_list: z.union([z.string(), z.array(z.string())]).optional(),
  public_identifier_not_in_list: z.union([z.string(), z.array(z.string())]).optional(),
  page_size: z.number().min(1).max(100).optional(),
  enrich_profiles: z.enum(["skip", "enrich"]).optional(),
  use_cache: z.enum(["if-present", "if-recent"]).optional(),
});

interface PeopleSearchQueryFormProps {
  onQueryChange?: (query: PeopleSearchQueryParams) => void;
  defaultValues?: PeopleSearchQueryParams;
}

const PeopleSearchQueryForm: React.FC<PeopleSearchQueryFormProps> = ({ 
  onQueryChange,
  defaultValues 
}) => {
  //console.log('PeopleSearchQueryForm rendered with defaultValues:', defaultValues);
  
  // Parse initial defaultValues
  const [parsedDefaults, setParsedDefaults] = useState<z.infer<typeof formSchema> | null>(null);
  
  useEffect(() => {
    if (defaultValues) {
      formSchema.parseAsync(defaultValues)
        .then(parsed => setParsedDefaults(parsed))
        .catch(error => console.error('Error parsing initial default values:', error));
    }
  }, [defaultValues]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: parsedDefaults || {
      // Basic Info
      country: undefined,
      first_name: undefined,
      last_name: undefined,
      follower_count_min: undefined,
      follower_count_max: undefined,
      region: undefined,
      city: undefined,
      headline: undefined,
      summary: undefined,
      
      // Education
      education_field_of_study: undefined,
      education_degree_name: undefined,
      education_school_name: undefined,
      education_school_linkedin_profile_url: undefined,
      
      // Role Info
      current_role_title: undefined,
      past_role_title: undefined,
      current_role_before: undefined,
      current_role_after: undefined,
      current_job_description: undefined,
      past_job_description: undefined,
      
      // Company Info
      current_company_linkedin_profile_url: undefined,
      past_company_linkedin_profile_url: undefined,
      current_company_name: undefined,
      past_company_name: undefined,
      current_company_country: undefined,
      current_company_region: undefined,
      current_company_city: undefined,
      current_company_type: undefined,
      current_company_follower_count_min: undefined,
      current_company_follower_count_max: undefined,
      current_company_industry: undefined,
      current_company_employee_count_min: undefined,
      current_company_employee_count_max: undefined,
      current_company_description: undefined,
      current_company_founded_after_year: undefined,
      current_company_founded_before_year: undefined,
      current_company_funding_amount_min: undefined,
      current_company_funding_amount_max: undefined,
      current_company_funding_raised_after: undefined,
      current_company_funding_raised_before: undefined,
      
      // Other Info
      linkedin_groups: undefined,
      languages: undefined,
      industries: undefined,
      interests: undefined,
      skills: undefined,
      
      // Search Parameters
      public_identifier_in_list: undefined,
      public_identifier_not_in_list: undefined,
      page_size: undefined,
      enrich_profiles: undefined,
      use_cache: undefined,
    }
  });

  // Reset form when defaultValues change
  useEffect(() => {
    const handleDefaultValues = async () => {
      console.log('defaultValues changed:', defaultValues);
      if (defaultValues) {
        try {
          console.log('Resetting form with values:', defaultValues);
          const parsedValues = await formSchema.parseAsync(defaultValues);
          form.reset(parsedValues);
        } catch (error) {
          console.error('Error parsing default values:', error);
        }
      }
    };
    handleDefaultValues();
  }, [defaultValues, form]);

  // Watch for form changes and update parent component
  useEffect(() => {
    const subscription = form.watch(async (value) => {
      console.log('Form value changed:', value);
      if (onQueryChange) {
        try {
          // Parse and transform the values through Zod schema
          const parsedValue = await formSchema.parseAsync(value);
          onQueryChange(parsedValue as PeopleSearchQueryParams);
        } catch (error) {
          console.error('Form validation error:', error);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onQueryChange]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // First, transform the comma-separated values
    const transformedValues = {
      current_role_title: values.current_role_title ? convertToORList(values.current_role_title) : undefined,
      past_role_title: values.past_role_title ? convertToORList(values.past_role_title) : undefined,
      skills: values.skills ? convertToORList(values.skills) : undefined,
      languages: values.languages ? convertToORList(values.languages) : undefined,
      interests: values.interests ? convertToORList(values.interests) : undefined,
      industries: values.industries ? convertToORList(values.industries) : undefined,
      linkedin_groups: values.linkedin_groups ? convertToORList(values.linkedin_groups) : undefined,
      education_field_of_study: values.education_field_of_study ? convertToORList(values.education_field_of_study) : undefined,
      education_degree_name: values.education_degree_name ? convertToORList(values.education_degree_name) : undefined,
      education_school_name: values.education_school_name ? convertToORList(values.education_school_name) : undefined,
      public_identifier_in_list: values.public_identifier_in_list ? convertToORList(values.public_identifier_in_list) : undefined,
      public_identifier_not_in_list: values.public_identifier_not_in_list ? convertToORList(values.public_identifier_not_in_list) : undefined,
    };

    // Then, create the query params by spreading both objects
    const queryParams: PeopleSearchQueryParams = {
      ...values,
      ...transformedValues
    };
    
    console.log('Query params updated:', queryParams);
    if (onQueryChange) {
      onQueryChange(queryParams);
    }
  };

  const companyTypes = [
    { value: "EDUCATIONAL", label: "Educational Institution" },
    { value: "GOVERNMENT_AGENCY", label: "Government Agency" },
    { value: "NON_PROFIT", label: "Nonprofit" },
    { value: "PARTNERSHIP", label: "Partnership" },
    { value: "PRIVATELY_HELD", label: "Privately Held" },
    { value: "PUBLIC_COMPANY", label: "Public Company" },
    { value: "SELF_EMPLOYED", label: "Self-Employed" },
    { value: "SELF_OWNED", label: "Sole Proprietorship" },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>People Search Query</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Don't call form.handleSubmit since we don't want to trigger a full form submission
              return false;
            }} 
            className="space-y-8"
          >
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country (Alpha-2 code)</FormLabel>
                      <FormControl>
                        <Input placeholder="US, GB, DE..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Region</FormLabel>
                      <FormControl>
                        <Input placeholder="Region..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City names (comma separated)..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Headline</FormLabel>
                      <FormControl>
                        <Input placeholder="Search in headlines..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="follower_count_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Followers</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Minimum followers..."
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="follower_count_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Followers</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Maximum followers..."
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Role Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Role Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="current_role_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Role Titles</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={
                            (typeof field.value === 'string' 
                              ? field.value.split(',').filter(Boolean)
                              : Array.isArray(field.value)
                                ? field.value
                                : []
                            ).map(label => ({
                              id: String(label),
                              label: String(label).trim()
                            }))
                          }
                          onTagsChange={(tags) => {
                            console.log('TagInput changed:', { fieldName: field.name, tags });
                            const newValue = tags.map(tag => tag.label).join(',');
                            console.log('New field value:', newValue);
                            field.onChange(newValue);
                          }}
                          placeholder="Add role titles..."
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="past_role_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Past Role Titles</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={
                            (typeof field.value === 'string' 
                              ? field.value.split(',').filter(Boolean)
                              : Array.isArray(field.value)
                                ? field.value
                                : []
                            ).map(label => ({
                              id: String(label),
                              label: String(label).trim()
                            }))
                          }
                          onTagsChange={(tags) => {
                            console.log('TagInput changed:', { fieldName: field.name, tags });
                            const newValue = tags.map(tag => tag.label).join(',');
                            console.log('New field value:', newValue);
                            field.onChange(newValue);
                          }}
                          placeholder="Add past role titles..."
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_role_before"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Role Before</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_role_after"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Role After</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="current_job_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Job Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Search in current job descriptions..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="past_job_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Past Job Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Search in past job descriptions..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Company Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="current_company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Company Names</FormLabel>
                      <FormControl>
                        <Input placeholder="Company names (comma separated)..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="past_company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Past Company Names</FormLabel>
                      <FormControl>
                        <Input placeholder="Company names (comma separated)..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_company_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select company type" />
                          </SelectTrigger>
                          <SelectContent>
                            {companyTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_company_industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Industry</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={
                            (typeof field.value === 'string' 
                              ? field.value.split(',').filter(Boolean)
                              : Array.isArray(field.value)
                                ? field.value
                                : []
                            ).map(label => ({
                              id: String(label),
                              label: String(label).trim()
                            }))
                          }
                          onTagsChange={(tags) => {
                            console.log('TagInput changed:', { fieldName: field.name, tags });
                            const newValue = tags.map(tag => tag.label).join(',');
                            console.log('New field value:', newValue);
                            field.onChange(newValue);
                          }}
                          placeholder="Add industries..."
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="current_company_country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Alpha-2 code..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_company_region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Region</FormLabel>
                      <FormControl>
                        <Input placeholder="Region..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_company_city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company City</FormLabel>
                      <FormControl>
                        <Input placeholder="City..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="current_company_employee_count_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Employees</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Minimum employees..."
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_company_employee_count_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Employees</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Maximum employees..."
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="current_company_founded_after_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founded After Year</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Year..."
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_company_founded_before_year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founded Before Year</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Year..."
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="current_company_linkedin_profile_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Company LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input placeholder="LinkedIn URL..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="past_company_linkedin_profile_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Past Company LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input placeholder="LinkedIn URL..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="current_company_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Search in company descriptions..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="current_company_funding_amount_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Funding Amount (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Minimum funding..."
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_company_funding_amount_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Funding Amount (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          placeholder="Maximum funding..."
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_company_funding_raised_after"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Raised After</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_company_funding_raised_before"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Funding Raised Before</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="education_field_of_study"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={
                            (typeof field.value === 'string' 
                              ? field.value.split(',').filter(Boolean)
                              : Array.isArray(field.value)
                                ? field.value
                                : []
                            ).map(label => ({
                              id: String(label),
                              label: String(label).trim()
                            }))
                          }
                          onTagsChange={(tags) => {
                            console.log('TagInput changed:', { fieldName: field.name, tags });
                            const newValue = tags.map(tag => tag.label).join(',');
                            console.log('New field value:', newValue);
                            field.onChange(newValue);
                          }}
                          placeholder="Add fields of study..."
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="education_degree_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree Name</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={
                            (typeof field.value === 'string' 
                              ? field.value.split(',').filter(Boolean)
                              : Array.isArray(field.value)
                                ? field.value
                                : []
                            ).map(label => ({
                              id: String(label),
                              label: String(label).trim()
                            }))
                          }
                          onTagsChange={(tags) => {
                            console.log('TagInput changed:', { fieldName: field.name, tags });
                            const newValue = tags.map(tag => tag.label).join(',');
                            console.log('New field value:', newValue);
                            field.onChange(newValue);
                          }}
                          placeholder="Add degree names..."
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="education_school_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={
                            (typeof field.value === 'string' 
                              ? field.value.split(',').filter(Boolean)
                              : Array.isArray(field.value)
                                ? field.value
                                : []
                            ).map(label => ({
                              id: String(label),
                              label: String(label).trim()
                            }))
                          }
                          onTagsChange={(tags) => {
                            console.log('TagInput changed:', { fieldName: field.name, tags });
                            const newValue = tags.map(tag => tag.label).join(',');
                            console.log('New field value:', newValue);
                            field.onChange(newValue);
                          }}
                          placeholder="Add school names..."
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="education_school_linkedin_profile_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input placeholder="LinkedIn URL..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Other Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Other Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="linkedin_groups"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn Groups</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={
                            (typeof field.value === 'string' 
                              ? field.value.split(',').filter(Boolean)
                              : Array.isArray(field.value)
                                ? field.value
                                : []
                            ).map(label => ({
                              id: String(label),
                              label: String(label).trim()
                            }))
                          }
                          onTagsChange={(tags) => {
                            console.log('TagInput changed:', { fieldName: field.name, tags });
                            const newValue = tags.map(tag => tag.label).join(',');
                            console.log('New field value:', newValue);
                            field.onChange(newValue);
                          }}
                          placeholder="Add LinkedIn groups..."
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={
                            (typeof field.value === 'string' 
                              ? field.value.split(',').filter(Boolean)
                              : Array.isArray(field.value)
                                ? field.value
                                : []
                            ).map(label => ({
                              id: String(label),
                              label: String(label).trim()
                            }))
                          }
                          onTagsChange={(tags) => {
                            console.log('TagInput changed:', { fieldName: field.name, tags });
                            const newValue = tags.map(tag => tag.label).join(',');
                            console.log('New field value:', newValue);
                            field.onChange(newValue);
                          }}
                          placeholder="Add languages..."
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={
                            (typeof field.value === 'string' 
                              ? field.value.split(',').filter(Boolean)
                              : Array.isArray(field.value)
                                ? field.value
                                : []
                            ).map(label => ({
                              id: String(label),
                              label: String(label).trim()
                            }))
                          }
                          onTagsChange={(tags) => {
                            console.log('TagInput changed:', { fieldName: field.name, tags });
                            const newValue = tags.map(tag => tag.label).join(',');
                            console.log('New field value:', newValue);
                            field.onChange(newValue);
                          }}
                          placeholder="Add skills..."
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={
                            (typeof field.value === 'string' 
                              ? field.value.split(',').filter(Boolean)
                              : Array.isArray(field.value)
                                ? field.value
                                : []
                            ).map(label => ({
                              id: String(label),
                              label: String(label).trim()
                            }))
                          }
                          onTagsChange={(tags) => {
                            console.log('TagInput changed:', { fieldName: field.name, tags });
                            const newValue = tags.map(tag => tag.label).join(',');
                            console.log('New field value:', newValue);
                            field.onChange(newValue);
                          }}
                          placeholder="Add interests..."
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Input placeholder="Search in profile summaries..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Search Parameters Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Search Parameters</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="public_identifier_in_list"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Include Public Identifiers</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={
                            (typeof field.value === 'string' 
                              ? field.value.split(',').filter(Boolean)
                              : Array.isArray(field.value)
                                ? field.value
                                : []
                            ).map(label => ({
                              id: String(label),
                              label: String(label).trim()
                            }))
                          }
                          onTagsChange={(tags) => {
                            console.log('TagInput changed:', { fieldName: field.name, tags });
                            const newValue = tags.map(tag => tag.label).join(',');
                            console.log('New field value:', newValue);
                            field.onChange(newValue);
                          }}
                          placeholder="Add public identifiers to include..."
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="public_identifier_not_in_list"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exclude Public Identifiers</FormLabel>
                      <FormControl>
                        <TagInput
                          tags={
                            (typeof field.value === 'string' 
                              ? field.value.split(',').filter(Boolean)
                              : Array.isArray(field.value)
                                ? field.value
                                : []
                            ).map(label => ({
                              id: String(label),
                              label: String(label).trim()
                            }))
                          }
                          onTagsChange={(tags) => {
                            console.log('TagInput changed:', { fieldName: field.name, tags });
                            const newValue = tags.map(tag => tag.label).join(',');
                            console.log('New field value:', newValue);
                            field.onChange(newValue);
                          }}
                          placeholder="Add public identifiers to exclude..."
                          onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="page_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Page Size (1-100)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          placeholder="10"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enrich_profiles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enrich Profiles</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select enrichment option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="skip">Skip</SelectItem>
                          <SelectItem value="enrich">Enrich</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="use_cache"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cache Usage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select cache option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="if-present">If Present</SelectItem>
                          <SelectItem value="if-recent">If Recent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PeopleSearchQueryForm;
