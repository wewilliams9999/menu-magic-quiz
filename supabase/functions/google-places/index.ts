import { corsHeaders } from '../_shared/cors.ts';
import { RestaurantParams } from '../restaurants/types.ts';
import { mapGooglePlacesToRestaurants } from '../restaurants/mappers.ts';
import { buildGooglePlacesApiQuery } from '../restaurants/queryBuilder.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Google Places function - FRESH DEPLOYMENT', new Date().toISOString());
    
    // Try multiple methods to get the API key
    let apiKey: string | undefined;
    
    // Method 1: Try both secret names with standard Deno.env.get
    apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY') || Deno.env.get('GOOGLE_API_KEY');
    console.log('Method 1 (both names):', apiKey ? `Found ${apiKey.length} chars` : 'Not found');
    
    // Method 2: Try alternative environment access
    if (!apiKey) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        
        console.log('Method 2: Testing Supabase admin access...');
        console.log('- SUPABASE_URL exists:', !!supabaseUrl);
        console.log('- SERVICE_ROLE_KEY exists:', !!supabaseKey);
        
        // If basic Supabase vars work but API key doesn't, it's a specific secret issue
        if (supabaseUrl && supabaseKey) {
          console.log('✅ Supabase env vars accessible, but API key is not');
        }
      } catch (err) {
        console.log('Method 2 failed:', err.message);
      }
    }
    
    // Method 3: Try process.env as fallback
    if (!apiKey && typeof process !== 'undefined' && process.env) {
      apiKey = process.env.GOOGLE_PLACES_API_KEY;
      console.log('Method 3 (process.env):', apiKey ? `Found ${apiKey.length} chars` : 'Not found');
    }
    
    // Method 4: Try globalThis approach
    if (!apiKey && typeof globalThis !== 'undefined') {
      try {
        // @ts-ignore
        apiKey = globalThis.GOOGLE_PLACES_API_KEY;
        console.log('Method 4 (globalThis):', apiKey ? `Found ${apiKey.length} chars` : 'Not found');
      } catch (err) {
        console.log('Method 4 failed:', err.message);
      }
    }
    
    console.log('Final API key status:', apiKey ? `SUCCESS! (${apiKey.length} chars)` : 'FAILED - NO ACCESS');
    
    if (!apiKey) {
      console.error('❌ Could not access Google Places API key with any method');
      // List all available env vars for debugging
      const allVars = Object.keys(Deno.env.toObject());
      console.log('Available env vars:', allVars);
      console.log('GOOGLE_PLACES_API_KEY in list:', allVars.includes('GOOGLE_PLACES_API_KEY'));
      
      return new Response(
        JSON.stringify({ 
          error: 'API key access failed - see logs for debugging info',
          availableVars: allVars,
          results: [] 
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ API key accessible! Proceeding with Google Places API...');

    // Parse request parameters
    const params: RestaurantParams = await req.json();
    console.log('📋 Search params:', JSON.stringify(params, null, 2));
    
    // Build and make the Google Places API request
    const url = buildGooglePlacesApiQuery(params, apiKey);
    console.log('🌐 Calling Google Places API...');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Google API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Google API error: ${response.status}`, results: [] }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await response.json();
    console.log(`✅ Google API success: ${data.results?.length || 0} results, status: ${data.status}`);
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const restaurants = mapGooglePlacesToRestaurants(data.results, apiKey);
      console.log('🍽️ Returning processed restaurants:', restaurants.length);
      
      return new Response(
        JSON.stringify({ results: restaurants }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('❌ No results from Google Places API');
    return new Response(
      JSON.stringify({ results: [], message: 'No restaurants found' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('💥 Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message, results: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});