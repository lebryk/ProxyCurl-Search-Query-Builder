"use client";
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useQueryHistory } from '@/hooks/useQueryHistory';
import { useRouter } from 'next/navigation';
import { generateQueryHash, findExistingQuery, getQueryVersion, deleteQuery, searchCandidates, createNewQuery, createQueryVersion, cleanupQueryVersions } from '@/services/queryService';
import { QueryHistory } from '@/components/features/search/QueryHistory';
import { SearchLogs } from '@/components/features/search/SearchLogs';
import PeopleSearchQueryForm from '@/components/features/job-description/PeopleSearchQueryForm';
import { Button } from '@/components/ui/button';
import { PeopleSearchQueryParams } from '@/types/PersonSearch';
import { UserQueryHistory } from '@/types/QueryTypes';

const convertToORList = (value: string | string[] | undefined): string[] | undefined => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value;
  return value.split(',').map(item => item.trim());
};

const CandidateSearch = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    storedQueries,
    loading,
    logs,
    addLog,
    fetchStoredQueries,
    updateQueryHistory
  } = useQueryHistory();
  const [currentQuery, setCurrentQuery] = useState<PeopleSearchQueryParams>({});
  const [lastQuery, setLastQuery] = useState<PeopleSearchQueryParams>({});
  const [storedQueryHistory, setStoredQueryHistory] = useState<UserQueryHistory[]>([]);

  useEffect(() => {
    const fetchQueries = async () => {
      if (user) {
        try {
          const queries = await fetchStoredQueries(user.id);
          console.log('Fetched queries:', queries);
          if (queries && queries.length > 0) {
            const lastQuery = queries[0];
            console.log('Last query found:', lastQuery);
            console.log('Last query parameters:', lastQuery.global_queries?.parameters);
            setStoredQueryHistory(queries);
            if (lastQuery.global_queries?.parameters) {
              const parameters = lastQuery.global_queries.parameters as PeopleSearchQueryParams;
              setLastQuery(parameters);
              setCurrentQuery(parameters);
            }
          }
        } catch (error: unknown) {
          console.error('Error fetching stored queries:', error instanceof Error ? error.message : String(error));
        }
      }
    };
    fetchQueries();
  }, [user]);

  const handleSearch = async (queryParams: PeopleSearchQueryParams) => {
    if (!user) {
      addLog('User not authenticated');
      router.push('/auth/login');
      return;
    }

    try {
      addLog('Starting search with parameters...');
      
      // Transform array fields and other parameters before processing
      const transformedParams = {
        ...queryParams,
        // Basic Info
        country: queryParams.country?.trim(),
        region: queryParams.region?.trim(),
        city: queryParams.city?.trim(),
        headline: queryParams.headline?.trim(),
        summary: queryParams.summary?.trim(),
        
        // Education
        education_field_of_study: queryParams.education_field_of_study ? convertToORList(queryParams.education_field_of_study) : undefined,
        education_degree_name: queryParams.education_degree_name ? convertToORList(queryParams.education_degree_name) : undefined,
        education_school_name: queryParams.education_school_name ? convertToORList(queryParams.education_school_name) : undefined,
        
        // Role Info
        current_role_title: queryParams.current_role_title ? convertToORList(queryParams.current_role_title) : undefined,
        past_role_title: queryParams.past_role_title ? convertToORList(queryParams.past_role_title) : undefined,
        
        // Skills and Other Lists
        skills: queryParams.skills ? convertToORList(queryParams.skills) : undefined,
        languages: queryParams.languages ? convertToORList(queryParams.languages) : undefined,
        interests: queryParams.interests ? convertToORList(queryParams.interests) : undefined,
        industries: queryParams.industries ? convertToORList(queryParams.industries) : undefined,
        linkedin_groups: queryParams.linkedin_groups ? convertToORList(queryParams.linkedin_groups) : undefined,
        
        // Company Info
        current_company_industry: queryParams.current_company_industry ? convertToORList(queryParams.current_company_industry) : undefined,
        
        // Search Parameters
        public_identifier_in_list: queryParams.public_identifier_in_list ? convertToORList(queryParams.public_identifier_in_list) : undefined,
        public_identifier_not_in_list: queryParams.public_identifier_not_in_list ? convertToORList(queryParams.public_identifier_not_in_list) : undefined,
        
        // Ensure numeric fields are properly typed
        page_size: queryParams.page_size ? Number(queryParams.page_size) : undefined,
        follower_count_min: queryParams.follower_count_min ? Number(queryParams.follower_count_min) : undefined,
        follower_count_max: queryParams.follower_count_max ? Number(queryParams.follower_count_max) : undefined,
        current_company_follower_count_min: queryParams.current_company_follower_count_min ? Number(queryParams.current_company_follower_count_min) : undefined,
        current_company_follower_count_max: queryParams.current_company_follower_count_max ? Number(queryParams.current_company_follower_count_max) : undefined,
        current_company_employee_count_min: queryParams.current_company_employee_count_min ? Number(queryParams.current_company_employee_count_min) : undefined,
        current_company_employee_count_max: queryParams.current_company_employee_count_max ? Number(queryParams.current_company_employee_count_max) : undefined,
        current_company_founded_after_year: queryParams.current_company_founded_after_year ? Number(queryParams.current_company_founded_after_year) : undefined,
        current_company_founded_before_year: queryParams.current_company_founded_before_year ? Number(queryParams.current_company_founded_before_year) : undefined,
        current_company_funding_amount_min: queryParams.current_company_funding_amount_min ? Number(queryParams.current_company_funding_amount_min) : undefined,
        current_company_funding_amount_max: queryParams.current_company_funding_amount_max ? Number(queryParams.current_company_funding_amount_max) : undefined,
      };
      
      const queryHash = await generateQueryHash(transformedParams);
      addLog(`Generated query hash: ${queryHash}`);

      const existingQuery = await findExistingQuery(queryHash);
      
      let versionNumber;
      let candidateIds;

      if (existingQuery) {
        addLog('Found existing query in cache');
        try {
          const queryVersion = await getQueryVersion(queryHash, existingQuery.current_version_number);
          versionNumber = queryVersion.version_number;
          candidateIds = queryVersion.candidate_ids;
          addLog(`Using cached results from version ${versionNumber}`);
        } catch (error) {
          addLog('No valid version found, creating new version for existing query');
          const results = await searchCandidates(transformedParams);
          candidateIds = results;
          const queryVersion = await createQueryVersion(queryHash, candidateIds);
          versionNumber = queryVersion.version_number;
          addLog(`Created new version ${versionNumber} for existing query`);
        }
      } else {
        addLog('No existing query found, creating new query');
        const newQuery = await createNewQuery(queryHash, transformedParams);
        const results = await searchCandidates(transformedParams);
        candidateIds = results;  
        const queryVersion = await createQueryVersion(queryHash, candidateIds);
        versionNumber = queryVersion.version_number;
        addLog(`Created new query version ${versionNumber}`);
        
        // Cleanup old versions
        await cleanupQueryVersions(queryHash);
      }

      // Update query history with all required parameters
      await updateQueryHistory(user.id, queryHash, versionNumber, candidateIds.length);
      
      addLog('Search completed successfully');
      addLog(`Found ${candidateIds.length} candidates`);
    } catch (error: unknown) {
      addLog(`Error during search: ${error instanceof Error ? error.message : String(error)}`);
      console.error('Search error:', error);
    }
  };

  const handleQueryChange = (query: PeopleSearchQueryParams) => {
    // Transform all parameters consistently with handleSearch
    const transformedValues = {
      // Basic Info
      country: query.country?.trim(),
      region: query.region?.trim(),
      city: query.city?.trim(),
      headline: query.headline?.trim(),
      summary: query.summary?.trim(),
      
      // Education
      education_field_of_study: query.education_field_of_study ? convertToORList(query.education_field_of_study) : undefined,
      education_degree_name: query.education_degree_name ? convertToORList(query.education_degree_name) : undefined,
      education_school_name: query.education_school_name ? convertToORList(query.education_school_name) : undefined,
      
      // Role Info
      current_role_title: query.current_role_title ? convertToORList(query.current_role_title) : undefined,
      past_role_title: query.past_role_title ? convertToORList(query.past_role_title) : undefined,
      
      // Skills and Other Lists
      skills: query.skills ? convertToORList(query.skills) : undefined,
      languages: query.languages ? convertToORList(query.languages) : undefined,
      interests: query.interests ? convertToORList(query.interests) : undefined,
      industries: query.industries ? convertToORList(query.industries) : undefined,
      linkedin_groups: query.linkedin_groups ? convertToORList(query.linkedin_groups) : undefined,
      
      // Company Info
      current_company_industry: query.current_company_industry ? convertToORList(query.current_company_industry) : undefined,
      
      // Search Parameters
      public_identifier_in_list: query.public_identifier_in_list ? convertToORList(query.public_identifier_in_list) : undefined,
      public_identifier_not_in_list: query.public_identifier_not_in_list ? convertToORList(query.public_identifier_not_in_list) : undefined,
      
      // Ensure numeric fields are properly typed
      page_size: query.page_size ? Number(query.page_size) : undefined,
      follower_count_min: query.follower_count_min ? Number(query.follower_count_min) : undefined,
      follower_count_max: query.follower_count_max ? Number(query.follower_count_max) : undefined,
      current_company_follower_count_min: query.current_company_follower_count_min ? Number(query.current_company_follower_count_min) : undefined,
      current_company_follower_count_max: query.current_company_follower_count_max ? Number(query.current_company_follower_count_max) : undefined,
      current_company_employee_count_min: query.current_company_employee_count_min ? Number(query.current_company_employee_count_min) : undefined,
      current_company_employee_count_max: query.current_company_employee_count_max ? Number(query.current_company_employee_count_max) : undefined,
      current_company_founded_after_year: query.current_company_founded_after_year ? Number(query.current_company_founded_after_year) : undefined,
      current_company_founded_before_year: query.current_company_founded_before_year ? Number(query.current_company_founded_before_year) : undefined,
      current_company_funding_amount_min: query.current_company_funding_amount_min ? Number(query.current_company_funding_amount_min) : undefined,
      current_company_funding_amount_max: query.current_company_funding_amount_max ? Number(query.current_company_funding_amount_max) : undefined,
    };

    // Create the final query params by combining original query with transformed values
    const finalQuery = {
      ...query,
      ...transformedValues
    };

    console.log('Setting current query:', finalQuery);
    setCurrentQuery(finalQuery);
  };

  const handleDeleteQuery = async (queryId: string) => {
    if (!user?.id) {
      addLog('Error: User not authenticated');
      return;
    }

    try {
      await deleteQuery(queryId, user.id);
      await fetchStoredQueries(user.id);
      addLog(`Successfully deleted query ${queryId}`);
    } catch (error: unknown) {
      addLog(`Error deleting query: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-end">
        <Button 
          onClick={() => currentQuery && handleSearch(currentQuery)}
          disabled={!currentQuery}
        >
          Search Candidates
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Form</CardTitle>
          </CardHeader>
          <CardContent>
            <PeopleSearchQueryForm 
              onQueryChange={handleQueryChange}
              defaultValues={lastQuery}
              key={JSON.stringify(lastQuery)} // Force re-render when lastQuery changes
            />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading history...</div>
              ) : (
                <QueryHistory queries={storedQueryHistory} onDelete={handleDeleteQuery} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchLogs logs={logs} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateSearch;