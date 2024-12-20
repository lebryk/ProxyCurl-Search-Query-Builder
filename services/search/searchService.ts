import { SearchParameters } from './searchTypes';
import {
    findExistingQuery,
    createNewQuery,
    createQueryVersion,
    recordUserQuery
} from './searchCache';
import { generateQueryHash } from './searchUtils';

export class SearchService {
    private userId: string;
    private projectId: string;

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
    }

    private isValidUUID(uuid: string): boolean {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }

    async search(params: SearchParameters) {
        try {
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
        // TODO: Implement actual search logic here
        // This should integrate with your existing search implementation
        //throw new Error('Search implementation needed');
        return [
            "123e4567-e89b-12d3-a456-426614174000",
            "123e4567-e89b-12d3-a456-426614174001",
            "123e4567-e89b-12d3-a456-426614174002"
        ];
    }
}
