import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SearchService } from '@/services/search/searchService';
import { PeopleSearchQueryParams } from '@/types/searchTypes';

// ...

// A simple interface for data returned by SearchService:
interface SearchResultData {
  candidateIds: string[];
  fromCache?: boolean;
}

interface UseSearchOptions {
  userId: string;
  projectId: string;
}

export function useSearch({ userId, projectId }: UseSearchOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (query: Partial<PeopleSearchQueryParams>) => {
      const searchService = new SearchService(userId, projectId);
      const params = { query: JSON.stringify(query) };
      const results: SearchResultData = await searchService.search(params);
      return { results, query };
    },
    onSuccess: (data) => {
      // Store results in React Query cache
      queryClient.setQueryData(['searchResults'], data);
    },
    onError: (error) => {
      console.error("Search error:", error);
    },
  });
}

// A small hook to read search results from the cache:
export function useSearchResults() {
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['searchResults'],
    // Just read data from the cache; no fetch required:
    queryFn: () => queryClient.getQueryData(['searchResults']),
    staleTime: Infinity,
  });
}

// ... 