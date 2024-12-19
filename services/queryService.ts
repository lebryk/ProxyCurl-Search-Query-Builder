
"use client";
import { Json } from '@/types/supabase';
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const generateQueryHash = async (params: any): Promise<string> => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((obj, key) => {
      obj[key] = params[key];
      return obj;
    }, {} as Record<string, any>);
  
  const msgBuffer = new TextEncoder().encode(JSON.stringify(sortedParams));
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const findExistingQuery = async (queryHash: string) => {
  const { data: allQueries, error: allQueriesError } = await supabase
    .from('global_queries')
    .select('*');

  if (allQueriesError) {
    throw new Error(`Error fetching all queries: ${allQueriesError.message}`);
  }

  return allQueries?.find(q => q.query_hash === queryHash);
};

export const getQueryVersion = async (queryHash: string, versionNumber: number) => {
  const { data: versions, error: versionError } = await supabase
    .from('global_query_versions')
    .select('*')
    .eq('query_hash', queryHash)
    .eq('version_number', versionNumber);

  if (versionError) {
    throw new Error(`Error fetching version data: ${versionError.message}`);
  }

  if (!versions || versions.length === 0) {
    throw new Error('No version found for this query');
  }

  if (versions.length > 1) {
    // If we somehow got multiple versions with the same number, use the latest one
    // and clean up the duplicates
    const latestVersion = versions.reduce((latest, current) => {
      return !latest || new Date(current.created_at) > new Date(latest.created_at)
        ? current
        : latest;
    }, null);

    // Clean up duplicate versions
    await supabase
      .from('global_query_versions')
      .delete()
      .eq('query_hash', queryHash)
      .eq('version_number', versionNumber)
      .lt('created_at', latestVersion.created_at);

    return latestVersion;
  }

  return versions[0];
};

export const cleanupQueryVersions = async (queryHash: string) => {
  // Delete any existing versions for this query
  const { error: deleteError } = await supabase
    .from('global_query_versions')
    .delete()
    .eq('query_hash', queryHash);

  if (deleteError) {
    throw new Error(`Error cleaning up versions: ${deleteError.message}`);
  }
};

export const deleteQuery = async (queryId: string, userId: string) => {
  // Verify ownership
  const { data: queryData, error: fetchError } = await supabase
    .from('user_queries_history')
    .select('*')
    .eq('id', queryId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !queryData) {
    throw new Error('Unable to verify query ownership');
  }

  // Delete the query
  const { error: deleteError } = await supabase
    .from('user_queries_history')
    .delete()
    .eq('id', queryId);

  if (deleteError) {
    throw new Error(`Error deleting query: ${deleteError.message}`);
  }

  return queryData;
};

export const createNewQuery = async (queryHash: string, params: any) => {
  const { data: query, error: queryError } = await supabase
    .from('global_queries')
    .insert({
      query_hash: queryHash,
      parameters: params as Json,
      current_version_number: 1,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (queryError) {
    throw new Error(`Error creating query: ${queryError.message}`);
  }

  return query;
};

export const createQueryVersion = async (queryHash: string, candidateIds: string[]) => {
  // Get current version number for this query
  const { data: query, error: queryError } = await supabase
    .from('global_queries')
    .select('current_version_number')
    .eq('query_hash', queryHash)
    .single();

  if (queryError) {
    throw new Error(`Error getting current version number: ${queryError.message}`);
  }

  const nextVersionNumber = (query?.current_version_number || 0) + 1;

  // Create new version
  const { data: version, error: versionError } = await supabase
    .from('global_query_versions')
    .insert([
      {
        query_hash: queryHash,
        version_number: nextVersionNumber,
        candidate_ids: candidateIds,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single();

  if (versionError) {
    throw new Error(`Error creating version: ${versionError.message}`);
  }

  // Update current version number in global_queries
  const { error: updateError } = await supabase
    .from('global_queries')
    .update({ current_version_number: nextVersionNumber })
    .eq('query_hash', queryHash);

  if (updateError) {
    throw new Error(`Error updating current version number: ${updateError.message}`);
  }

  return version;
};

export const searchCandidates = async (params: any): Promise<string[]> => {
  // Simulate searching candidates based on parameters
  // In a real implementation, this would call your candidate search service
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
  return [
    '123e4567-e89b-12d3-a456-426614174000',
    '987fcdeb-51a2-43f7-9abc-123456789012',
    'c71e15b9-74d3-4682-9b16-f53e6c76f3a2'
  ]; // Mock UUIDs
};
