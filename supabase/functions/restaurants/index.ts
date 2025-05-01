import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface RestaurantParams {
  neighborhoods?: string[];
  cuisine?: string[];
  price?: string[];
  atmosphere?: string;
  preferences?: string[];
  distance?: number;
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

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
    
    // Build the Google Places API request
    let endpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    let query = 'restaurants in Nashville';
    
    // Refine the search based on parameters
    if (params.neighborhoods && params.neighborhoods.length > 0) {
      query += ` ${params.neighborhoods.join(' ')}`;
    }
    
    if (params.cuisine && params.cuisine.length > 0) {
      query += ` ${params.cuisine.join(' ')}`;
    }
    
    // Add cuisine types to query
    if (params.preferences && params.preferences.length > 0) {
      query += ` ${params.preferences.join(' ')}`;
    }
    
    if (params.atmosphere) {
      query += ` ${params.atmosphere}`;
    }
    
    // Build URL with parameters
    const url = new URL(endpoint);
    url.searchParams.append('query', query);
    url.searchParams.append('key', apiKey);
    
    // Add location-based parameters if available
    if (params.userLocation && params.distance) {
      url.searchParams.append('location', `${params.userLocation.latitude},${params.userLocation.longitude}`);
      // Convert miles to meters for the Google API
      const radiusInMeters = params.distance * 1609.34;
      url.searchParams.append('radius', radiusInMeters.toString());
    }
    
    // Optional price filtering
    if (params.price && params.price.length > 0) {
      // Google's price levels are 0 (Free) to 4 (Very Expensive)
      // Map our $ symbols to Google's numeric values
      const priceMapping: Record<string, string> = {
        '$': '1',
        '$$': '2',
        '$$$': '3',
        '$$$$': '4'
      };
      
      // Get the numeric price levels
      const priceLevels = params.price
        .map(price => priceMapping[price])
        .filter(Boolean);
      
      if (priceLevels.length > 0) {
        // Google API supports filtering by maxprice and minprice
        // For simplicity, we'll use the min and max values from our selection
        const minPrice = Math.min(...priceLevels.map(Number));
        const maxPrice = Math.max(...priceLevels.map(Number));
        
        url.searchParams.append('minprice', minPrice.toString());
        url.searchParams.append('maxprice', maxPrice.toString());
      }
    }
    
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
    const restaurants = data.results.map((place: any) => {
      // Extract neighborhood from address components if available
      let neighborhood = "Nashville";
      if (place.plus_code && place.plus_code.compound_code) {
        const addressParts = place.plus_code.compound_code.split(',');
        if (addressParts.length > 0) {
          neighborhood = addressParts[0].replace(/^[^ ]+ /, '');  // Remove the plus code
        }
      }
      
      // Determine price range from price_level
      const priceMap: Record<number, string> = {
        0: "$",
        1: "$",
        2: "$$",
        3: "$$$",
        4: "$$$$"
      };
      
      // Extract cuisine type from types
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
        // Add more mappings as needed
      };
      
      // Find a cuisine type that matches our known types
      let cuisine = "American"; // Default
      if (place.types && place.types.length > 0) {
        for (const type of place.types) {
          if (cuisineMap[type]) {
            cuisine = cuisineMap[type];
            break;
          }
        }
      }
      
      // Build feature tags from place details
      const features = [];
      
      if (place.types) {
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
        
        for (const type of place.types) {
          if (featureMap[type]) {
            features.push(featureMap[type]);
          }
        }
      }
      
      // Add some additional features based on the place details
      if (place.rating >= 4.5) features.push("Highly Rated");
      if (place.user_ratings_total > 500) features.push("Popular");
      
      // Fix the description to avoid duplicating "Nashville" and properly capitalize cuisine
      let description;
      if (place.editorial_summary?.overview) {
        description = place.editorial_summary.overview;
      } else {
        // Format the cuisine name with proper capitalization
        const formattedCuisine = cuisine.charAt(0).toUpperCase() + cuisine.slice(1).toLowerCase();
        // Only include the neighborhood if it's different from "Nashville"
        if (neighborhood !== "Nashville") {
          description = `${place.name} is a ${formattedCuisine.toLowerCase()} restaurant located in the ${neighborhood} area of Nashville.`;
        } else {
          description = `${place.name} is a ${formattedCuisine.toLowerCase()} restaurant located in Nashville.`;
        }
      }
      
      return {
        id: place.place_id,
        name: place.name,
        cuisine: cuisine,
        neighborhood: neighborhood,
        priceRange: place.price_level !== undefined ? priceMap[place.price_level] : "$$",
        description: description,
        address: place.formatted_address || place.vicinity,
        imageUrl: place.photos?.length > 0 
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
          : undefined,
        features: features.length > 0 ? features : ["Nashville Restaurant"],
        website: place.website,
        // These fields would require additional API calls to fill
        logoUrl: undefined,
        openTableLink: undefined,
        resyLink: undefined,
        instagramLink: undefined
      };
    });
    
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
