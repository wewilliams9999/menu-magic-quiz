
import { corsHeaders } from '../_shared/cors.ts';
import { RestaurantParams } from './types.ts';
import { mapGooglePlacesToRestaurants } from './mappers.ts';
import { buildGooglePlacesApiQuery } from './queryBuilder.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the API key from environment variables
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      console.error('Missing Google Places API key');
      throw new Error('Missing Google Places API key');
    }

    // Parse request parameters
    const params: RestaurantParams = await req.json();
    console.log('Received search params:', JSON.stringify(params, null, 2));
    
    // Build the Google Places API request URL
    const url = buildGooglePlacesApiQuery(params, apiKey);
    
    console.log('Calling Google Places API:', url.toString());
    
    // Make the request to Google Places API
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('Google Places API HTTP error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Google Places API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`Google Places API returned ${data.results?.length || 0} results with status: ${data.status}`);
    
    // Log detailed response for debugging
    if (data.results && data.results.length > 0) {
      console.log('Sample raw results:', data.results.slice(0, 3).map((r: any) => ({
        name: r.name,
        price_level: r.price_level,
        rating: r.rating,
        vicinity: r.vicinity,
        types: r.types
      })));
    }
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API status error:', data.status, data.error_message);
      
      // Try alternative search strategies based on the error
      if (data.status === 'INVALID_REQUEST' && params.userLocation) {
        console.log('Trying text search fallback due to invalid request...');
        return await tryTextSearchFallback(params, apiKey);
      }
      
      if (data.status === 'ZERO_RESULTS' && params.userLocation) {
        console.log('Zero results from nearby search, trying broader text search...');
        return await tryBroaderTextSearch(params, apiKey);
      }
      
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
    
    // If we got results, process them
    if (data.results && data.results.length > 0) {
      const restaurants = mapGooglePlacesToRestaurants(data.results, apiKey);
      
      console.log('Processed restaurants:', restaurants.slice(0, 5).map(r => ({ 
        name: r.name, 
        coordinates: r.coordinates,
        cuisine: r.cuisine,
        priceRange: r.priceRange,
        vicinity: r.address
      })));
      
      return new Response(
        JSON.stringify({ results: restaurants }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If no results with location search, try broader approaches
    if (params.userLocation) {
      console.log('No results from initial search, trying alternative strategies...');
      return await tryAlternativeSearches(params, apiKey);
    }
    
    // If everything fails, return empty results to trigger fallback data
    console.log('All search attempts failed, returning empty results for fallback handling');
    return new Response(
      JSON.stringify({ results: [], message: 'No restaurants found via API, using fallback data' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in restaurants function:', error.message);
    console.error('Full error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ error: error.message, results: [] }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper function to try text search fallback
async function tryTextSearchFallback(params: RestaurantParams, apiKey: string) {
  const fallbackUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
  fallbackUrl.searchParams.append('query', 'cheap restaurants fast food Nashville TN');
  if (params.userLocation) {
    fallbackUrl.searchParams.append('location', `${params.userLocation.latitude},${params.userLocation.longitude}`);
    fallbackUrl.searchParams.append('radius', '8047'); // 5 miles in meters
  }
  fallbackUrl.searchParams.append('key', apiKey);
  
  console.log('Text search fallback URL:', fallbackUrl.toString());
  
  const fallbackResponse = await fetch(fallbackUrl.toString());
  const fallbackData = await fallbackResponse.json();
  
  console.log(`Text search fallback returned ${fallbackData.results?.length || 0} results`);
  
  if (fallbackData.results && fallbackData.results.length > 0) {
    const restaurants = mapGooglePlacesToRestaurants(fallbackData.results, apiKey);
    return new Response(
      JSON.stringify({ results: restaurants }),
      { headers: { corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  return new Response(
    JSON.stringify({ results: [], message: 'Text search fallback also returned no results' }),
    { headers: { corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper function to try broader text search
async function tryBroaderTextSearch(params: RestaurantParams, apiKey: string) {
  const queries = [
    'restaurants Nashville TN',
    'fast food Nashville TN',
    'dining Nashville Tennessee',
    'food Nashville'
  ];
  
  for (const query of queries) {
    console.log(`Trying broader search with query: ${query}`);
    
    const url = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    url.searchParams.append('query', query);
    url.searchParams.append('key', apiKey);
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      console.log(`Broader search "${query}" returned ${data.results.length} results`);
      const restaurants = mapGooglePlacesToRestaurants(data.results, apiKey);
      return new Response(
        JSON.stringify({ results: restaurants }),
        { headers: { corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }
  
  return new Response(
    JSON.stringify({ results: [], message: 'All broader searches returned no results' }),
    { headers: { corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper function to try alternative search strategies
async function tryAlternativeSearches(params: RestaurantParams, apiKey: string) {
  // Try nearby search without price constraints first
  const basicUrl = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  basicUrl.searchParams.append('location', `${params.userLocation!.latitude},${params.userLocation!.longitude}`);
  basicUrl.searchParams.append('radius', String(params.distance! * 1609.34));
  basicUrl.searchParams.append('type', 'restaurant');
  basicUrl.searchParams.append('key', apiKey);
  
  console.log('Trying basic nearby search without price constraints:', basicUrl.toString());
  
  const basicResponse = await fetch(basicUrl.toString());
  const basicData = await basicResponse.json();
  
  if (basicData.results && basicData.results.length > 0) {
    console.log(`Basic nearby search returned ${basicData.results.length} results`);
    const restaurants = mapGooglePlacesToRestaurants(basicData.results, apiKey);
    return new Response(
      JSON.stringify({ results: restaurants }),
      { headers: { corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
  
  // If that fails, try text search fallback
  return await tryTextSearchFallback(params, apiKey);
}
