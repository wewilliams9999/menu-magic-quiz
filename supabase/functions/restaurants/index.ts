
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
      throw new Error('Missing Google Places API key');
    }

    // Parse request parameters
    const params: RestaurantParams = await req.json();
    console.log('Received search params:', params);
    
    // Build the Google Places API request URL
    const url = buildGooglePlacesApiQuery(params, apiKey);
    
    console.log('Calling Google Places API:', url.toString());
    
    // Make the request to Google Places API
    const response = await fetch(url.toString());
    const data = await response.json();
    
    console.log(`Google Places API returned ${data.results?.length || 0} results`);
    
    // If the request was successful but returned no results, say so
    if (!data.results || data.results.length === 0) {
      return new Response(
        JSON.stringify({ results: [], message: 'No restaurants found matching your criteria' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Map the Google Places API response to our app's format
    const restaurants = mapGooglePlacesToRestaurants(data.results, apiKey);
    
    // Log coordinates for debugging
    console.log('Restaurants with coordinates:', 
      restaurants.map(r => ({ 
        name: r.name, 
        coordinates: r.coordinates 
      }))
    );
    
    return new Response(
      JSON.stringify({ results: restaurants }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
