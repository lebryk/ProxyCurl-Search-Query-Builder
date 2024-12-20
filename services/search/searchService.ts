import { SearchParameters } from './searchTypes';
import {
    findExistingQuery,
    createNewQuery,
    createQueryVersion,
    recordUserQuery
} from './searchCache';
import { generateQueryHash } from './searchUtils';
import { ProxycurlService } from '../proxycurl/proxycurlService';
import { PeopleSearchQueryParams, PeopleSearchResponse } from '@/types/PersonSearch';

export class SearchService {
    private userId: string;
    private projectId: string;
    private proxycurlService: ProxycurlService;

    /**
     * @param userId - UUID of the user
     * @param projectId - UUID of the project
     */
    constructor(userId: string, projectId: string) {
        if (!this.isValidUUID(userId)) {
            throw new Error('Invalid user ID format. Must be a valid UUID.');
        }
        if (!this.isValidUUID(projectId)) {
            throw new Error('Invalid project ID format. Must be a valid UUID.');
        }
        this.userId = userId;
        this.projectId = projectId;
        this.proxycurlService = new ProxycurlService();
    }

    private isValidUUID(uuid: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    async search(params: SearchParameters) {
        try {
            console.log('SearchService.search called with params:', params);
            
            // Check cache first
            const cacheResult = await findExistingQuery(params);
            const queryHash = generateQueryHash(params);

            if (cacheResult.found && cacheResult.data) {
                // Cache hit - Record usage and return cached results
                await recordUserQuery(
                    this.userId,
                    this.projectId,
                    cacheResult.data.query.query_hash,
                    cacheResult.data.version.version_number,
                    cacheResult.data.version.candidate_ids.length
                );

                return {
                    candidateIds: cacheResult.data.version.candidate_ids,
                    fromCache: true
                };
            }

            // Perform new search
            const searchResults = await this.performSearch(params);

            // Get existing query or create new one
            let query = cacheResult.data?.query;
            if (!query) {
                await createNewQuery(params);
            }

            // Create new version with incremented version number
            const versionNumber = query ? query.current_version_number + 1 : 1;

            await createQueryVersion(
                queryHash,
                versionNumber,
                searchResults
            );

            // Record in user history
            await recordUserQuery(
                this.userId,
                this.projectId,
                queryHash,
                versionNumber,
                searchResults.length
            );

            return {
                candidateIds: searchResults,
                fromCache: false
            };
        } catch (error) {
            console.error('Error in search:', error);
            throw error;
        }
    }

    private async performSearch(params: SearchParameters): Promise<string[]> {
        try {
            console.log('SearchService.performSearch called with params:', params);
            
            // Parse the query string back to an object
            const searchParams = JSON.parse(params.query) as Partial<PeopleSearchQueryParams>;
            console.log('Parsed search params:', searchParams);
            
            // Call Proxycurl API
            const results = await this.proxycurlService.searchPeople(searchParams);
            console.log('Proxycurl API results:', results);
            
            // Extract linkedin_profile_urls from results
            return results.results.map(result => result.linkedin_profile_url);
        } catch (error) {
            console.error('Error in performSearch:', error);
            throw error;
        }
    }
}
