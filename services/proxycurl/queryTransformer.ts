import { PeopleSearchQueryParams } from '@/types/PersonSearch';

interface ProxycurlQueryParams {
    [key: string]: string;
}

/**
 * Converts a number or array of strings to a string format that Proxycurl accepts
 * @param value The value to convert
 * @returns A string representation of the value
 */
function convertToString(value: number | string | string[] | undefined | null): string | undefined {
    if (value === undefined || value === null) return undefined;
    
    if (Array.isArray(value)) {
        // Filter out null/undefined values from array
        const validValues = value.filter(v => v != null);
        return validValues.length > 0 ? validValues.join(' OR ') : undefined;
    }
    
    return value.toString();
}

/**
 * Transforms PeopleSearchQueryParams into a format suitable for the Proxycurl API
 * All values are converted to strings while keeping the original field names
 */
export function transformToProxycurlQuery(params: Partial<PeopleSearchQueryParams>): ProxycurlQueryParams {
    console.log('transformToProxycurlQuery input:', params);
    
    const transformedQuery: ProxycurlQueryParams = {};

    // Process each field and convert to string
    Object.entries(params).forEach(([key, value]) => {
        console.log(`Processing field ${key}:`, value);
        const stringValue = convertToString(value);
        console.log(`Converted ${key} to:`, stringValue);
        if (stringValue !== undefined) {
            transformedQuery[key] = stringValue;
        }
    });

    console.log('transformToProxycurlQuery output:', transformedQuery);
    return transformedQuery;
}
