import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 Testing secret access at', new Date().toISOString());
    
    // Get all environment variables
    const allEnvVars = Deno.env.toObject();
    const envKeys = Object.keys(allEnvVars);
    
    console.log('📋 Total environment variables found:', envKeys.length);
    console.log('📋 Environment variable keys:', envKeys);
    
    // Check specifically for Google Places API key variants
    const googleApiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    const googleApiKey2 = Deno.env.get('GOOGLE_API_KEY');
    const placesApiKey = Deno.env.get('PLACES_API_KEY');
    
    const secretTest = {
      timestamp: new Date().toISOString(),
      totalEnvVars: envKeys.length,
      envKeys: envKeys,
      googlePlacesApiKey: googleApiKey ? `Present (${googleApiKey.length} chars)` : 'Missing',
      googleApiKey: googleApiKey2 ? `Present (${googleApiKey2.length} chars)` : 'Missing',
      placesApiKey: placesApiKey ? `Present (${placesApiKey.length} chars)` : 'Missing',
      hasAnyGoogleKey: !!(googleApiKey || googleApiKey2 || placesApiKey)
    };
    
    console.log('🔑 Secret access test results:', secretTest);
    
    return new Response(
      JSON.stringify(secretTest, null, 2),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('❌ Error in test-secrets function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});