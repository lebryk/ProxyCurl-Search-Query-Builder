import crypto from 'crypto';
import { SearchParameters } from './searchTypes';

export function normalizeParameters(params: SearchParameters): SearchParameters {
    const normalized = { ...params };
    
    // Sort filters if they exist
    if (normalized.filters) {
        const sortedFilters: Record<string, any> = {};
        Object.keys(normalized.filters)
            .sort()
            .forEach(key => {
                sortedFilters[key] = normalized.filters![key];
            });
        normalized.filters = sortedFilters;
    }

    // Ensure consistent defaults
    normalized.page = normalized.page || 1;
    normalized.limit = normalized.limit || 10;

    return normalized;
}

export function generateQueryHash(params: SearchParameters): string {
    const normalized = normalizeParameters(params);
    const jsonString = JSON.stringify(normalized);
    return crypto
        .createHash('sha256')
        .update(jsonString)
        .digest('hex');
}

export function isQueryVersionStale(createdAt: Date, maxAgeHours: number = 24): boolean {
    const now = new Date();
    const ageInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return ageInHours > maxAgeHours;
}
