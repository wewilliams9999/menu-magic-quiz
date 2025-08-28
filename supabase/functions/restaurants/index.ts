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
    console.log('🚀 Restaurant function v6 MINIMAL TEST at', new Date().toISOString());
    
    // Get the API key - simplest possible approach
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    console.log('API Key test:');
    console.log('- Exists:', !!apiKey);
    console.log('- Length:', apiKey?.length || 0);
    console.log('- Type:', typeof apiKey);
    console.log('- First 10 chars:', apiKey?.substring(0, 10) || 'none');
    
    if (!apiKey) {
      console.error('❌ No API key found');
      return new Response(
        JSON.stringify({ error: 'Missing Google Places API key', results: [] }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ API key found! Proceeding with Google Places API call...');

    // Parse request parameters
    const params: RestaurantParams = await req.json();
    console.log('📋 Received search params:', JSON.stringify(params, null, 2));
    
    // Build the Google Places API request URL
    const url = buildGooglePlacesApiQuery(params, apiKey);
    
    console.log('🌐 Calling Google Places API...');
    
    // Make the request to Google Places API
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error('❌ Google Places API HTTP error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      return new Response(
        JSON.stringify({ error: `Google Places API returned ${response.status}`, results: [] }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    const data = await response.json();
    console.log(`✅ Google Places API returned ${data.results?.length || 0} results with status: ${data.status}`);
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('❌ Google Places API status error:', data.status, data.error_message);
      return new Response(
        JSON.stringify({ error: `Google Places API error: ${data.status}`, results: [] }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
    
    // If we got results, process them
    if (data.results && data.results.length > 0) {
      const restaurants = mapGooglePlacesToRestaurants(data.results, apiKey);
      
      console.log('🍽️ Processed restaurants:', restaurants.slice(0, 3).map(r => ({ 
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
    
    // No results found
    console.log('❌ No results from Google Places API');
    return new Response(
      JSON.stringify({ results: [], message: 'No restaurants found via API' }),
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