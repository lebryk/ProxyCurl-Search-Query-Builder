import { SearchParameters, GlobalQuery, QueryVersion, CacheResult } from './searchTypes';
import { generateQueryHash, isQueryVersionStale } from './searchUtils';
import { createClient } from "@/utils/supabase/client";
import { Json } from '@/types/supabase';
import { PeopleSearchQueryParams } from '@/types/PersonSearch';

const supabase = createClient();

export async function findExistingQuery(params: SearchParameters): Promise<CacheResult> {
    try {
        const queryHash = generateQueryHash(params);
        console.log('Generated hash:', queryHash);

        // Get the query and its latest version
        const { data: queries, error: queryError } = await supabase
            .from('global_queries')
            .select('*')
            .eq('query_hash', queryHash);

        console.log('Query result:', { queries, queryError });

        if (queryError || !queries || queries.length === 0) {
            console.log('No query found or error:', { queryError });
            return { found: false };
        }

        const query = queries[0];
        console.log('Found query:', query);

        if (!query.current_version_number) {
            console.log('No version number found');
            return { found: false };
        }

        const { data: versions, error: versionError } = await supabase
            .from('global_query_versions')
            .select('*')
            .eq('query_hash', queryHash)
            .eq('version_number', query.current_version_number);

        console.log('Version result:', { versions, versionError });

        if (versionError || !versions || versions.length === 0) {
            console.log('No version found or error:', { versionError });
            return { found: false };
        }

        const version = versions[0];

        // Check if the version is stale
        if (isQueryVersionStale(new Date(version.created_at))) {
            console.log('Version is stale');
            return { found: false };
        }

        return {
            found: true,
            data: {
                query: query as GlobalQuery,
                version: version as QueryVersion
            }
        };
    } catch (error) {
        console.error('Error in findExistingQuery:', error);
        return { found: false };
    }
}

export async function createNewQuery(params: SearchParameters): Promise<string> {
    try {
        const queryHash = generateQueryHash(params);
        
        // Parse the query string to JSON object
        const queryParams = JSON.parse(params.query);
        
        const { error } = await supabase
            .from('global_queries')
            .upsert({
                query_hash: queryHash,
                parameters: queryParams,
                current_version_number: 1,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'query_hash'
            });

        if (error) {
            throw new Error(`Failed to create new query: ${error.message}`);
        }

        return queryHash;
    } catch (error) {
        console.error('Error in createNewQuery:', error);
        throw error;
    }
}

export async function createQueryVersion(
    queryHash: string,
    versionNumber: number,
    candidateIds: string[]
): Promise<void> {
    try {
        // First, insert the new version
        const { error: versionError } = await supabase
            .from('global_query_versions')
            .upsert({
                query_hash: queryHash,
                version_number: versionNumber,
                candidate_ids: candidateIds,
                created_at: new Date().toISOString()
            }, {
                onConflict: 'query_hash,version_number'
            });

        if (versionError) {
            throw new Error(`Failed to create query version: ${versionError.message}`);
        }

        // Then update the current version number
        const { error: updateError } = await supabase
            .from('global_queries')
            .update({ 
                current_version_number: versionNumber,
                updated_at: new Date().toISOString()
            })
            .eq('query_hash', queryHash);

        if (updateError) {
            throw new Error(`Failed to update query version: ${updateError.message}`);
        }
    } catch (error) {
        console.error('Error in createQueryVersion:', error);
        throw error;
    }
}

export async function recordUserQuery(
    userId: string,
    projectId: string,
    queryHash: string,
    versionNumber: number,
    numberOfResults: number
): Promise<void> {
    const { error } = await supabase
        .from('user_queries_history')
        .insert({
            user_id: userId,
            project_id: projectId,
            query_hash: queryHash,
            version_number: versionNumber,
            number_of_results: numberOfResults
        });

    if (error) {
        throw new Error(`Failed to record user query: ${error.message}`);
    }
}

export async function cleanupQueryVersions(queryHash: string): Promise<void> {
    const { error } = await supabase
        .from('global_query_versions')
        .delete()
        .eq('query_hash', queryHash);

    if (error) {
        throw new Error(`Failed to cleanup query versions: ${error.message}`);
    }
}

interface GlobalQueryResult {
    parameters: PeopleSearchQueryParams;
}

export async function getQueryHistory(projectId: string): Promise<Array<{ query_hash: string, parameters: PeopleSearchQueryParams, executed_at: string }>> {
    try {
        const { data, error } = await supabase
            .from('user_queries_history')
            .select(`
                query_hash,
                executed_at,
                global_queries!inner (
                    parameters
                )
            `)
            .eq('project_id', projectId)
            .order('executed_at', { ascending: false });
        
        console.log('>>>>>>Query history result:', data);

        if (error) {
            throw new Error(`Failed to fetch query history: ${error.message}`);
        }

        // Filter to keep only the most recent execution for each query_hash
        const uniqueQueries = data?.reduce((acc, item) => {
            if (!acc.some(q => q.query_hash === item.query_hash)) {
                acc.push({
                    query_hash: item.query_hash,
                    parameters: (item.global_queries as any).parameters as PeopleSearchQueryParams,
                    executed_at: item.executed_at
                });
            }
            return acc;
        }, [] as Array<{ query_hash: string, parameters: PeopleSearchQueryParams, executed_at: string }>);

        return (uniqueQueries || []).slice(0, 10);
    } catch (error) {
        console.error('Error in getQueryHistory:', error);
        throw error;
    }
}
