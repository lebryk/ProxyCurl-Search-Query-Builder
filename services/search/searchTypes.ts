// UUID type alias for clarity and type safety
type uuid = string;

export interface SearchParameters {
    query: string;
    filters?: Record<string, any>;
    page?: number;
    limit?: number;
}

export interface QueryVersion {
    query_hash: string;
    version_number: number;
    candidate_ids: uuid[];
    created_at: Date;
}

export interface GlobalQuery {
    query_hash: string;
    parameters: SearchParameters;
    current_version_number: number;
    created_at: Date;
    updated_at: Date;
}

export interface UserQueryHistory {
    id: uuid;
    user_id: uuid;
    project_id: uuid;
    query_hash: string | null;
    version_number: number;
    executed_at: Date;
    number_of_results: number;
}

export interface CacheResult {
    found: boolean;
    data?: {
        query: GlobalQuery;
        version: QueryVersion;
    };
}
