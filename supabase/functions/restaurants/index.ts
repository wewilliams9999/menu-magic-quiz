
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
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }
    
    // If we got results, process them
    if (data.results && data.results.length > 0) {
      const restaurants = mapGooglePlacesToRestaurants(data.results, apiKey);
      
      console.log('Processed restaurants:', restaurants.map(r => ({ 
        name: r.name, 
        coordinates: r.coordinates,
        cuisine: r.cuisine,
        priceRange: r.priceRange
      })));
      
      return new Response(
        JSON.stringify({ results: restaurants }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If no results, try a fallback search with just "restaurants Nashville"
    console.log('No results found, trying fallback search...');
    const fallbackUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    fallbackUrl.searchParams.append('query', 'restaurants Nashville TN');
    fallbackUrl.searchParams.append('key', apiKey);
    
    console.log('Fallback search URL:', fallbackUrl.toString());
    
    const fallbackResponse = await fetch(fallbackUrl.toString());
    const fallbackData = await fallbackResponse.json();
    
    console.log(`Fallback search returned ${fallbackData.results?.length || 0} results`);
    
    if (fallbackData.results && fallbackData.results.length > 0) {
      const restaurants = mapGooglePlacesToRestaurants(fallbackData.results, apiKey);
      
      return new Response(
        JSON.stringify({ results: restaurants }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If even the fallback fails, return empty results
    return new Response(
      JSON.stringify({ results: [], message: 'No restaurants found matching your criteria' }),
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
