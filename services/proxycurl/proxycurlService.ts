import { PeopleSearchQueryParams, PeopleSearchResponse } from '@/types/PersonSearch';
import { transformToProxycurlQuery } from './queryTransformer';

const API_ENDPOINT = 'https://nubela.co/proxycurl/api/v2/search/person';

export class ProxycurlService {
    /**
     * Search for people using the Proxycurl API
     * @param params Search parameters
     * @returns Search results from Proxycurl
     */
    async searchPeople(params: Partial<PeopleSearchQueryParams>): Promise<PeopleSearchResponse> {
        try {
            const queryParams = transformToProxycurlQuery(params);
            
            // Set default parameters while allowing overrides
            const finalParams = {
                page_size: '2',  // Increase default page size
                enrich_profiles: 'enrich',  // Get full profile data
                use_cache: 'if-present',
                ...queryParams  // Allow overriding defaults with provided params
            };

            console.log('Sending request with params:', finalParams);
            const url = '/api/proxycurl/search?' + new URLSearchParams(finalParams);
            console.log('Request URL:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);

            // Clone the response so we can read it multiple times
            const responseClone = response.clone();
            const responseText = await responseClone.text();
            console.log('Raw response text:', responseText);

            if (!response.ok) {
                console.error('Error response:', responseText);
                throw new Error(`Proxycurl API error: ${response.status} - ${responseText}`);
            }

            // Parse the response text
            let data;
            try {
                data = JSON.parse(responseText);
                console.log('Parsed response data:', data);
            } catch (e) {
                console.error('Failed to parse response JSON:', e);
                throw new Error('Invalid JSON response from API');
            }

            if (!data.results) {
                console.error('Unexpected response format:', data);
                throw new Error('Unexpected response format from API');
            }

            return data;
        } catch (error) {
            console.error('Error in Proxycurl search:', error);
            throw error;
        }
    }
}
