
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
      console.error('Google Places API error:', response.status, response.statusText);
      throw new Error(`Google Places API returned ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`Google Places API returned ${data.results?.length || 0} results`);
    console.log('API Status:', data.status);
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API status error:', data.status, data.error_message);
      
      // For specific errors, try a different approach
      if (data.status === 'INVALID_REQUEST' && params.userLocation) {
        console.log('Trying text search fallback due to invalid request...');
        const fallbackUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
        fallbackUrl.searchParams.append('query', 'restaurants near me Nashville TN');
        fallbackUrl.searchParams.append('location', `${params.userLocation.latitude},${params.userLocation.longitude}`);
        fallbackUrl.searchParams.append('radius', '4828'); // 3 miles in meters
        fallbackUrl.searchParams.append('key', apiKey);
        
        const fallbackResponse = await fetch(fallbackUrl.toString());
        const fallbackData = await fallbackResponse.json();
        
        if (fallbackData.results && fallbackData.results.length > 0) {
          const restaurants = mapGooglePlacesToRestaurants(fallbackData.results, apiKey);
          console.log('Fallback search successful:', restaurants.length, 'restaurants found');
          return new Response(
            JSON.stringify({ results: restaurants }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
    
    // If we got results, process them
    if (data.results && data.results.length > 0) {
      const restaurants = mapGooglePlacesToRestaurants(data.results, apiKey);
      
      console.log('Processed restaurants:', restaurants.map(r => ({ 
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
    
    // If no results with location search, try broader text search
    if (params.userLocation) {
      console.log('No results from nearby search, trying text search fallback...');
      const fallbackUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
      fallbackUrl.searchParams.append('query', 'cheap restaurants Nashville TN');
      fallbackUrl.searchParams.append('key', apiKey);
      
      const fallbackResponse = await fetch(fallbackUrl.toString());
      const fallbackData = await fallbackResponse.json();
      
      console.log(`Text search fallback returned ${fallbackData.results?.length || 0} results`);
      
      if (fallbackData.results && fallbackData.results.length > 0) {
        const restaurants = mapGooglePlacesToRestaurants(fallbackData.results, apiKey);
        
        return new Response(
          JSON.stringify({ results: restaurants }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // If everything fails, return empty results to trigger fallback data
    console.log('All search attempts failed, returning empty results for fallback handling');
    return new Response(
      JSON.stringify({ results: [], message: 'No restaurants found via API, using fallback data' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in restaurants function:', error.message);
    console.error('Full error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message, results: [] }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
