import { Json } from '@/types/supabase';
import { PeopleSearchQueryParams } from './PersonSearch';

export interface GlobalQuery {
  query_hash: string;
  parameters: Json;
  current_version_number: number;
  created_at: string;
  updated_at: string;
}

export interface GlobalQueryVersion {
  query_hash: string;
  version_number: number;
  candidate_ids: string[];
  created_at: string;
}

export interface UserQueryHistory {
  id: string;
  user_id: string;
  project_id: string;
  query_hash: string;
  version_number: number;
  number_of_results: number;
  executed_at: string;
  global_queries?: GlobalQuery;
}

export type StoredQuery = UserQueryHistory;

export type QueryTypes = PeopleSearchQueryParams;

export function isJsonQueryParams(json: Json): json is Json {
  if (typeof json !== 'object' || json === null) return false;
  
  const params = json as Record<string, unknown>;
  return true;
}

export function parseQueryParams(json: Json): PeopleSearchQueryParams | null {
  if (!isJsonQueryParams(json)) return null;
  return json as PeopleSearchQueryParams;
}
