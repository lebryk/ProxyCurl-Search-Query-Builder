import { useProxycurlSearch } from '@/hooks/useProxycurlSearch';
import { PeopleSearchQueryParams, PeopleSearchResponse } from '@/types/PersonSearch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProxycurlSearchProps {
    searchParams: Partial<PeopleSearchQueryParams>;
    onResults?: (results: PeopleSearchResponse) => void;
}

export function ProxycurlSearch({ searchParams, onResults }: ProxycurlSearchProps) {
    const { search, results, isLoading, error } = useProxycurlSearch();
    const { toast } = useToast();

    const handleSearch = async () => {
        try {
            await search(searchParams);
            
            if (results && onResults) {
                onResults(results);
            }

            toast({
                title: 'Search completed',
                description: `Found ${results?.total_result_count || 0} results`,
                variant: 'default'
            });
        } catch (err) {
            toast({
                title: 'Search failed',
                description: error?.message || 'An unknown error occurred',
                variant: 'destructive'
            });
        }
    };

    return (
        <div>
            <Button 
                onClick={handleSearch}
                disabled={isLoading}
            >
                {isLoading ? 'Searching...' : 'Search Proxycurl'}
            </Button>

            {error && (
                <div className="text-red-500 mt-2">
                    {error.message}
                </div>
            )}

            {results && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">
                        Found {results.total_result_count} results
                    </h3>
                    <div className="mt-2 space-y-2">
                        {results.results.map((result, index) => (
                            <div 
                                key={index}
                                className="p-4 border rounded-lg"
                            >
                                <a 
                                    href={result.linkedin_profile_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {result.profile?.full_name || 'Unknown'}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
