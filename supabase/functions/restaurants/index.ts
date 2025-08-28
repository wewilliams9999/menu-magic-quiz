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
    console.log('🚀 Restaurant function v3 called at', new Date().toISOString());
    
    // Debug all environment variables
    console.log('Available env vars:', Object.keys(Deno.env.toObject()));
    
    // Get the API key from environment variables with multiple possible names
    let apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY') || 
                 Deno.env.get('GOOGLE_API_KEY') || 
                 Deno.env.get('PLACES_API_KEY');
    
    console.log('API key status:', apiKey ? `Present (${apiKey.length} chars)` : 'Missing');
    
    if (!apiKey) {
      console.error('❌ Missing Google Places API key in all variants');
      console.log('Checked: GOOGLE_PLACES_API_KEY, GOOGLE_API_KEY, PLACES_API_KEY');
      throw new Error('Missing Google Places API key');
    }

    // Parse request parameters
    const params: RestaurantParams = await req.json();
    console.log('📋 Received search params:', JSON.stringify(params, null, 2));
    
    // Build the Google Places API request URL
    const url = buildGooglePlacesApiQuery(params, apiKey);
    
    console.log('🌐 Calling Google Places API:', url.toString().replace(apiKey, 'API_KEY_HIDDEN'));
    
    // Make the request to Google Places API
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('❌ Google Places API HTTP error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      throw new Error(`Google Places API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`✅ Google Places API returned ${data.results?.length || 0} results with status: ${data.status}`);
    
    // Log detailed response for debugging
    if (data.results && data.results.length > 0) {
      console.log('🔍 Sample raw results:', data.results.slice(0, 3).map((r: any) => ({
        name: r.name,
        price_level: r.price_level,
        rating: r.rating,
        vicinity: r.vicinity,
        types: r.types
      })));
    }
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('❌ Google Places API status error:', data.status, data.error_message);
      
      // Try alternative search strategies based on the error
      if (data.status === 'INVALID_REQUEST' && params.userLocation) {
        console.log('🔄 Trying text search fallback due to invalid request...');
        return await tryTextSearchFallback(params, apiKey);
      }
      
      if (data.status === 'ZERO_RESULTS' && params.userLocation) {
        console.log('🔄 Zero results from nearby search, trying broader text search...');
        return await tryBroaderTextSearch(params, apiKey);
      }
      
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
    
    // If we got results, process them
    if (data.results && data.results.length > 0) {
      const restaurants = mapGooglePlacesToRestaurants(data.results, apiKey);
      
      console.log('🍽️ Processed restaurants:', restaurants.slice(0, 5).map(r => ({ 
        name: r.name, 
        coordinates: r.coordinates,
        cuisine: r.cuisine,
        priceRange: r.priceRange,
        vicinity: r.address,
        imageUrl: r.imageUrl
      })));
      
      return new Response(
        JSON.stringify({ results: restaurants }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If no results with location search, try broader approaches
    if (params.userLocation) {
      console.log('🔄 No results from initial search, trying alternative strategies...');
      return await tryAlternativeSearches(params, apiKey);
    }
    
    // If everything fails, return empty results to trigger fallback data
    console.log('❌ All search attempts failed, returning empty results for fallback handling');
    return new Response(
      JSON.stringify({ results: [], message: 'No restaurants found via API, using fallback data' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('💥 Error in restaurants function:', error.message);
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
  fallbackUrl.searchParams.append('key', apiKey);
  
  if (params.userLocation) {
    const location = `${params.userLocation.latitude},${params.userLocation.longitude}`;
    fallbackUrl.searchParams.append('location', location);
    fallbackUrl.searchParams.append('radius', '8000'); // 8km radius
  }
  
  console.log('🔄 Text search fallback URL:', fallbackUrl.toString().replace(apiKey, 'API_KEY_HIDDEN'));
  
  try {
    const response = await fetch(fallbackUrl.toString());
    const data = await response.json();
    
    console.log(`Text search returned ${data.results?.length || 0} results with status: ${data.status}`);
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const restaurants = mapGooglePlacesToRestaurants(data.results, apiKey);
      return new Response(
        JSON.stringify({ results: restaurants }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Text search fallback failed:', error);
  }
  
  return new Response(
    JSON.stringify({ results: [], message: 'Text search fallback failed' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper function to try broader text searches
async function tryBroaderTextSearch(params: RestaurantParams, apiKey: string) {
  const queries = [
    'restaurants Nashville Tennessee',
    'food Nashville TN',
    'dining Nashville',
    'places to eat Nashville'
  ];
  
  for (const query of queries) {
    try {
      const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
      searchUrl.searchParams.append('query', query);
      searchUrl.searchParams.append('key', apiKey);
      
      if (params.userLocation) {
        const location = `${params.userLocation.latitude},${params.userLocation.longitude}`;
        searchUrl.searchParams.append('location', location);
        searchUrl.searchParams.append('radius', '10000'); // 10km radius
      }
      
      console.log(`🔄 Trying broader search with query: "${query}"`);
      
      const response = await fetch(searchUrl.toString());
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        console.log(`✅ Broader search successful with ${data.results.length} results`);
        const restaurants = mapGooglePlacesToRestaurants(data.results, apiKey);
        return new Response(
          JSON.stringify({ results: restaurants }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      console.error(`Broader search failed for query "${query}":`, error);
      continue;
    }
  }
  
  return new Response(
    JSON.stringify({ results: [], message: 'All broader search attempts failed' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Helper function to try alternative search strategies
async function tryAlternativeSearches(params: RestaurantParams, apiKey: string): Promise<Response> {
  console.log('🔄 Trying nearby search without price constraints...');
  
  // Try nearby search without price level filtering
  const altUrl = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  altUrl.searchParams.append('location', `${params.userLocation!.latitude},${params.userLocation!.longitude}`);
  altUrl.searchParams.append('radius', '5000'); // 5km radius
  altUrl.searchParams.append('type', 'restaurant');
  altUrl.searchParams.append('key', apiKey);
  
  try {
    const response = await fetch(altUrl.toString());
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      console.log(`✅ Alternative nearby search successful with ${data.results.length} results`);
      const restaurants = mapGooglePlacesToRestaurants(data.results, apiKey);
      return new Response(
        JSON.stringify({ results: restaurants }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Alternative nearby search failed:', error);
  }
  
  // If nearby search fails, try text search fallback
  console.log('🔄 Nearby search failed, trying text search fallback...');
  return await tryTextSearchFallback(params, apiKey);
}