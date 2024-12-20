# Caching Mechanism

The application employs a sophisticated caching system:

### INPUT
at input we have json with query parameters

## Query Hashing
- Unique identifier: Each search query has a hash generated by `generateQueryHash`
- Hash creation process:
  1. Sort query parameters alphabetically
  2. Convert parameters to JSON
  3. Apply SHA-256 for a deterministic hash

## Database Structure
Three main tables in Supabase:
1. `global_queries`: Stores base queries
2. `global_query_versions`: Holds different versions of query results
3. `user_queries_history`: Tracks user-specific query history

## Caching Flow
1. Generate hash for query parameters
2. Check for existing query using `findExistingQuery`
   2.1 If found: Retrieve latest version with `getQueryVersion`
   2.2 If not found: Create new query via `createNewQuery`
3. Store search results as versions using `createQueryVersion`

## Version Management
- Multiple versions per query
- Versions are numbered and timestamped
- Automatic cleanup of duplicate versions
- `cleanupQueryVersions` function removes all versions for a query

## User-Specific Features
- Queries linked to users through `user_queries_history` table
- Users can only delete their own queries
- System maintains per-user query history


### 1. Database Schema
We have the following tables in Supabase:

CREATE TABLE public.global_queries (
    query_hash text NOT NULL,
    parameters jsonb NOT NULL,
    current_version_number integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


CREATE TABLE public.global_query_versions (
    query_hash text NOT NULL,
    version_number integer NOT NULL,
    candidate_ids uuid[] NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.user_queries_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    project_id uuid NOT NULL,
    query_hash text,
    version_number integer NOT NULL,
    executed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    number_of_results integer NOT NULL
);

### 2. New Folder Structure
```
/services/search/
├── searchService.ts       # Core search service implementation
├── searchCache.ts         # Caching logic
├── searchTypes.ts         # TypeScript types and interfaces
└── searchUtils.ts         # Utility functions
```

### 3. Core Components

#### A. Search Service (`searchService.ts`)
- Query execution
- Results processing
- Integration with Supabase API

#### B. Cache Service (`searchCache.ts`)
- Query hash generation
- Cache lookup and storage
- Version management
- Cache invalidation

#### C. Types (`searchTypes.ts`)
- Search parameters interface
- Results interface
- Cache entry types
- Version types

#### D. Utilities (`searchUtils.ts`)
- Parameter normalization
- Hash generation
- Data transformation helpers

### 4. Implementation Steps

1. **Phase 1: Core Infrastructure**
   - Create new folder structure
   - Implement basic service interfaces

2. **Phase 2: Caching Logic**
   - Implement hash generation
   - Create cache storage/retrieval (we use supabase DB tables as our cache)
   - Add version management
   - Set up cleanup utilities


### OUTPUT
As a result of this we should recive the following:
   2.1 If found: Retrieve latest version with `getQueryVersion` of TABLE public.global_query_versions including `candidate_ids`
   2.2 If not found: Retrieve latest version with `getQueryVersion` of TABLE public.global_query_versions excluding `candidate_ids` as they are not yet created