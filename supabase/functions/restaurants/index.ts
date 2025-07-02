
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
      console.error('❌ Missing Google Places API key');
      return new Response(
        JSON.stringify({ error: 'Missing Google Places API key', results: [] }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request parameters
    const params: RestaurantParams = await req.json();
    console.log('🔍 Received search params:', JSON.stringify(params, null, 2));
    
    // Build the Google Places API request URL
    const url = buildGooglePlacesApiQuery(params, apiKey);
    
    console.log('📡 Calling Google Places API:', url.toString());
    
    // Make the request to Google Places API
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('❌ Google Places API HTTP error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      return new Response(
        JSON.stringify({ error: `Google Places API HTTP ${response.status}`, results: [] }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const data = await response.json();
    
    console.log(`📊 Google Places API returned ${data.results?.length || 0} results with status: ${data.status}`);
    
    // Log detailed response for debugging
    if (data.results && data.results.length > 0) {
      console.log('✅ Sample raw results:', data.results.slice(0, 3).map((r: any) => ({
        name: r.name,
        price_level: r.price_level,
        rating: r.rating,
        vicinity: r.vicinity,
        types: r.types
      })));
    } else {
      console.log('⚠️ No results returned from Google Places API');
      console.log('API Response:', { status: data.status, error_message: data.error_message });
    }
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('❌ Google Places API status error:', data.status, data.error_message);
      
      return new Response(
        JSON.stringify({ 
          error: `Google Places API error: ${data.status} - ${data.error_message || 'Unknown error'}`,
          results: [] 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Process results if we have them
    if (data.results && data.results.length > 0) {
      const restaurants = mapGooglePlacesToRestaurants(data.results, apiKey);
      
      console.log('🍽️ Processed restaurants:', restaurants.slice(0, 5).map(r => ({ 
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
    
    // Return empty results to trigger fallback data
    console.log('📱 No results found, returning empty to trigger fallback handling');
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
