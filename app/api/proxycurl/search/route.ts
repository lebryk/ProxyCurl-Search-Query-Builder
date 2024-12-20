import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const API_ENDPOINT = 'https://nubela.co/proxycurl/api/v2/search/person/';

// Debug logging function
function debugLog(...args: any[]) {
    // Log to console
    console.log(...args);
    
    // Also log to a file for debugging
    const logPath = path.join(process.cwd(), 'proxycurl-debug.log');
    const logMessage = new Date().toISOString() + ' - ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
    ).join(' ') + '\n';
    
    fs.appendFileSync(logPath, logMessage);
}

export async function GET(request: Request) {
    debugLog('API route called');
    
    try {
        // Check for API key
        const apiKey = process.env.PROXYCURL_API_KEY;
        if (!apiKey) {
            debugLog('API key missing');
            return NextResponse.json(
                { error: 'API key not configured. Please set PROXYCURL_API_KEY environment variable.' },
                { status: 500 }
            );
        }

        // Get search parameters from request URL
        const { searchParams } = new URL(request.url);
        debugLog('Request params:', searchParams.toString());

        // Add use_cache parameter
        searchParams.append('use_cache', 'if-present');
        
        const proxycurlUrl = API_ENDPOINT + '?' + searchParams.toString();
        debugLog('Proxycurl URL:', proxycurlUrl);

        // Make request to Proxycurl
        debugLog('Making request to Proxycurl');
        const response = await fetch(proxycurlUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // Log response details
        debugLog('Response status:', response.status);
        debugLog('Response headers:', Object.fromEntries(response.headers.entries()));

        // Get response text
        const responseText = await response.text();
        debugLog('Raw response:', responseText);

        if (!response.ok) {
            debugLog('Error response:', response.status, responseText);
            return NextResponse.json(
                { error: `Proxycurl API error: ${response.status} - ${responseText}` },
                { status: response.status }
            );
        }

        // Parse response
        let data;
        try {
            data = JSON.parse(responseText);
            debugLog('Parsed response:', data);
        } catch (e) {
            debugLog('Failed to parse response:', e);
            return NextResponse.json(
                { error: 'Invalid JSON response from Proxycurl API' },
                { status: 500 }
            );
        }

        // Transform response
        const transformedResponse = {
            total_result_count: data.total_result_count || 0,
            results: data.results?.map((result: any) => ({
                linkedin_profile_url: result.linkedin_profile_url,
                profile: result.profile || {
                    full_name: result.name
                }
            })) || []
        };

        debugLog('Transformed response:', transformedResponse);
        return NextResponse.json(transformedResponse);
    } catch (error) {
        debugLog('Error in API route:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
