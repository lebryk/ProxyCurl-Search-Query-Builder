import { NextResponse } from 'next/server';

const API_ENDPOINT = 'https://nubela.co/proxycurl/api/v2/search/person/';

// Simple console logging function
function log(...args: any[]) {
    if (process.env.NODE_ENV === 'development') {
        console.log(...args);
    }
}

export async function GET(request: Request) {
    log('API route called');
    
    try {
        // Check for API key
        const apiKey = process.env.PROXYCURL_API_KEY;
        log('API Key present:', !!apiKey);
        
        if (!apiKey) {
            console.error('API key missing');
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        // Get and log search parameters
        const { searchParams } = new URL(request.url);
        const params = Object.fromEntries(searchParams.entries());
        log('Search parameters:', params);

        // Construct Proxycurl URL
        const proxycurlUrl = API_ENDPOINT + '?' + searchParams.toString();
        log('Proxycurl URL:', proxycurlUrl.replace(apiKey, '[REDACTED]'));

        try {
            // Make request to Proxycurl
            log('Making request to Proxycurl');
            const response = await fetch(proxycurlUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                }
            });

            log('Proxycurl response status:', response.status);
            log('Proxycurl response headers:', Object.fromEntries(response.headers.entries()));

            const responseText = await response.text();
            log('Proxycurl raw response:', responseText);

            if (!response.ok) {
                return NextResponse.json(
                    { 
                        error: `Proxycurl API error: ${response.status}`,
                        details: responseText
                    },
                    { status: response.status }
                );
            }

            // Try to parse the response
            try {
                const data = JSON.parse(responseText);
                return NextResponse.json(data);
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                return NextResponse.json(
                    { 
                        error: 'Failed to parse Proxycurl response',
                        details: responseText
                    },
                    { status: 500 }
                );
            }
        } catch (fetchError) {
            console.error('Fetch error:', fetchError);
            return NextResponse.json(
                { 
                    error: 'Failed to fetch from Proxycurl',
                    details: fetchError instanceof Error ? fetchError.message : 'Unknown error'
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Top-level error:', error);
        return NextResponse.json(
            { 
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
