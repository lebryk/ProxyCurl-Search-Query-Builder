import { useState } from 'react';
import { PeopleSearchQueryParams, PeopleSearchResponse } from '@/types/PersonSearch';
import { ProxycurlService } from '@/services/proxycurl/proxycurlService';

interface UseProxycurlSearchReturn {
    search: (params: Partial<PeopleSearchQueryParams>) => Promise<void>;
    results: PeopleSearchResponse | null;
    isLoading: boolean;
    error: Error | null;
}

export function useProxycurlSearch(): UseProxycurlSearchReturn {
    const [results, setResults] = useState<PeopleSearchResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const proxycurlService = new ProxycurlService();

    const search = async (params: Partial<PeopleSearchQueryParams>) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const searchResults = await proxycurlService.searchPeople(params);
            setResults(searchResults);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        } finally {
            setIsLoading(false);
        }
    };

    return {
        search,
        results,
        isLoading,
        error
    };
}
