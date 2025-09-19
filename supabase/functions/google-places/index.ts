import { corsHeaders } from '../_shared/cors.ts';

// ===== EMBEDDED TYPES =====
interface RestaurantParams {
  neighborhoods?: string[];
  cuisine?: string[];
  price?: string[];
  atmosphere?: string | string[];
  preferences?: string[];
  distance?: number;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  neighborhood: string;
  priceRange: string;
  description: string;
  address?: string;
  imageUrl?: string;
  logoUrl?: string;
  features?: string[];
  website?: string;
  openTableLink?: string;
  resyLink?: string;
  instagramLink?: string;
  phone?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface GooglePlaceResult {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  price_level?: number;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  photos?: { photo_reference: string }[];
  plus_code?: { compound_code: string };
  editorial_summary?: { overview: string };
  website?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    }
  };
}

// ===== EMBEDDED MAPPINGS =====
const priceRangeMap: Record<number, string> = {
  0: "$",
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$"
};

const cuisineMap: Record<string, string> = {
  "restaurant": "American",
  "cafe": "Cafe",
  "bar": "Bar",
  "food": "American",
  "meal_takeaway": "Fast Food",
  "meal_delivery": "Delivery",
  "fast_food": "Fast Food", 
  "bakery": "Bakery",
  "italian_restaurant": "Italian",
  "mexican_restaurant": "Mexican",
  "chinese_restaurant": "Chinese",
  "japanese_restaurant": "Japanese",
  "thai_restaurant": "Thai",
  "indian_restaurant": "Indian",
};

const featureMap: Record<string, string> = {
  "outdoor_seating": "Outdoor Seating",
  "live_music": "Live Music",
  "family_friendly": "Family Friendly",
  "wheelchair_accessible": "Wheelchair Accessible",
  "vegetarian_friendly": "Vegetarian Friendly",
  "vegan_friendly": "Vegan Options",
  "gluten_free": "Gluten-Free Options",
  "organic": "Organic",
  "farm_to_table": "Farm-to-Table",
  "romantic": "Romantic",
};

// ===== EMBEDDED HELPER FUNCTIONS =====
function getCuisineFromTypes(types: string[]): string {
  let cuisine = "American"; // Default
  if (types && types.length > 0) {
    for (const type of types) {
      if (cuisineMap[type]) {
        cuisine = cuisineMap[type];
        break;
      }
    }
  }
  return cuisine;
}

function extractNeighborhood(place: GooglePlaceResult): string {
  let neighborhood = "Nashville";
  
  if (place.vicinity) {
    const vicinity = place.vicinity.trim();
    if (vicinity && vicinity !== "Nashville") {
      neighborhood = vicinity;
    }
  }
  
  if (neighborhood === "Nashville" && place.formatted_address) {
    const addressParts = place.formatted_address.split(',');
    if (addressParts.length >= 2) {
      const possibleNeighborhood = addressParts[1].trim();
      if (possibleNeighborhood && !possibleNeighborhood.includes('TN') && !possibleNeighborhood.includes('Tennessee')) {
        neighborhood = possibleNeighborhood;
      }
    }
  }
  
  if (neighborhood === "Nashville" && place.plus_code && place.plus_code.compound_code) {
    const addressParts = place.plus_code.compound_code.split(',');
    if (addressParts.length > 0) {
      neighborhood = addressParts[0].replace(/^[^ ]+ /, '');
    }
  }
  
  return neighborhood;
}

function getPhotoUrl(place: GooglePlaceResult, apiKey: string): string | undefined {
  const photoUrl = place.photos?.length > 0 
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
    : undefined;
  
  return photoUrl;
}

function extractFeatures(place: GooglePlaceResult): string[] {
  const features: string[] = [];
  
  if (place.types) {
    for (const type of place.types) {
      if (featureMap[type]) {
        features.push(featureMap[type]);
      }
    }
  }
  
  if (place.rating && place.rating >= 4.5) features.push("Highly Rated");
  if (place.user_ratings_total && place.user_ratings_total > 500) features.push("Popular");
  
  return features;
}

function mapGooglePlacesToRestaurants(places: any[], apiKey: string) {
  return places.map(place => {
    const priceLevel = place.price_level || 2;
    const priceRange = "$".repeat(priceLevel);
    
    let coordinates;
    if (place.geometry && place.geometry.location) {
      coordinates = {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng
      };
    }
    
    return {
      id: place.place_id,
      name: place.name,
      cuisine: getCuisineFromTypes(place.types),
      neighborhood: extractNeighborhood(place),
      priceRange,
      description: place.editorial_summary?.overview || 
        `${place.name} is a ${priceRange} restaurant in Nashville.`,
      address: place.vicinity || place.formatted_address,
      imageUrl: getPhotoUrl(place, apiKey),
      features: extractFeatures(place),
      website: place.website,
      coordinates,
    };
  });
}

function buildGooglePlacesApiQuery(params: RestaurantParams, apiKey: string): URL {
  console.log('Building Google Places query with params:', JSON.stringify(params, null, 2));
  
  if (params.userLocation && params.distance) {
    const endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const url = new URL(endpoint);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('location', `${params.userLocation.latitude},${params.userLocation.longitude}`);
    
    const radiusInMeters = params.distance * 1609.34;
    url.searchParams.append('radius', radiusInMeters.toString());
    url.searchParams.append('type', 'restaurant');
    
    if (params.price && params.price.length > 0) {
      const priceLevels: number[] = [];
      params.price.forEach(priceRange => {
        switch (priceRange) {
          case '$':
            priceLevels.push(0, 1);
            break;
          case '$$':
            priceLevels.push(1, 2);
            break;
          case '$$$':
            priceLevels.push(2, 3);
            break;
          case '$$$$':
            priceLevels.push(3, 4);
            break;
        }
      });
      
      if (priceLevels.length > 0) {
        const minPriceLevel = Math.min(...priceLevels);
        const maxPriceLevel = Math.max(...priceLevels);
        url.searchParams.append('minprice', minPriceLevel.toString());
        url.searchParams.append('maxprice', maxPriceLevel.toString());
        console.log('Added price filtering:', { minPriceLevel, maxPriceLevel, originalPrices: params.price });
      }
    }
    
    // Handle cuisine filtering
    if (params.cuisine && params.cuisine.length > 0) {
      const validCuisines = params.cuisine.filter(c => 
        c && 
        c !== 'anything' && 
        c.trim() !== ''
      );
      if (validCuisines.length > 0) {
        url.searchParams.append('keyword', validCuisines[0]);
        console.log('Added cuisine keyword:', validCuisines[0]);
      }
    }
    
    // Handle atmosphere/parking filtering
    if (params.atmosphere) {
      const atmosphereArray = Array.isArray(params.atmosphere) ? params.atmosphere : [params.atmosphere];
      if (atmosphereArray.includes('parking')) {
        // Add parking-related keywords to help find places with good parking
        const currentKeyword = url.searchParams.get('keyword') || '';
        const parkingKeyword = currentKeyword ? `${currentKeyword} parking` : 'parking';
        url.searchParams.set('keyword', parkingKeyword);
        console.log('Added parking keyword:', parkingKeyword);
      }
    }
    
    console.log('Location-based search URL built successfully');
    return url;
  }
  
  // Fallback to text search
  const fallbackEndpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  const fallbackUrl = new URL(fallbackEndpoint);
  
  let query = 'restaurants Nashville TN';
  
  if (params.price && params.price.includes('$')) {
    query = 'cheap restaurants fast food Nashville TN under $10';
  } else if (params.price && params.price.includes('$$')) {
    query = 'affordable restaurants Nashville TN under $20';
  }
  
  if (params.cuisine && params.cuisine.length > 0) {
    const validCuisines = params.cuisine.filter(c => 
      c && c !== 'anything' && c.trim() !== ''
    );
    if (validCuisines.length > 0) {
      query = `${validCuisines[0]} ${query}`;
    }
  }
  
  fallbackUrl.searchParams.append('query', query);
  fallbackUrl.searchParams.append('key', apiKey);
  
  console.log('Text search fallback URL built successfully');
  console.log('Search query:', query);
  
  return fallbackUrl;
}

// ===== MAIN EDGE FUNCTION =====
Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Google Places function v7 - SELF CONTAINED', new Date().toISOString());
    
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
    
    console.log('Final API key status:', apiKey ? `SUCCESS! (${apiKey.length} chars)` : 'FAILED - NO ACCESS');
    
    if (!apiKey) {
      console.error('❌ Could not access Google Places API key with any method');
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