import { GooglePlaceResult, Restaurant } from './types.ts';

// Maps for different data transformations
export const priceRangeMap: Record<number, string> = {
  0: "$",
  1: "$",
  2: "$$",
  3: "$$$",
  4: "$$$$"
};

export const cuisineMap: Record<string, string> = {
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

export const featureMap: Record<string, string> = {
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

// Map Google Places API results to our Restaurant format
export function mapGooglePlacesToRestaurants(places: any[], apiKey: string) {
  return places.map(place => {
    // Map price level to price range
    const priceLevel = place.price_level || 2; // Default to 2 ($$) if not specified
    const priceRange = "$".repeat(priceLevel);
    
    // Map the rest of the Google Places data to our Restaurant format
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
      // Note: We don't have direct reservation links from Google Places
      // Those would need to be added separately or matched with other data sources
    };
  });
}

// Helper functions
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
  if (place.plus_code && place.plus_code.compound_code) {
    const addressParts = place.plus_code.compound_code.split(',');
    if (addressParts.length > 0) {
      neighborhood = addressParts[0].replace(/^[^ ]+ /, '');  // Remove the plus code
    }
  }
  return neighborhood;
}

function getPhotoUrl(place: GooglePlaceResult, apiKey: string): string | undefined {
  return place.photos?.length > 0 
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
    : undefined;
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
  
  // Add some additional features based on the place details
  if (place.rating && place.rating >= 4.5) features.push("Highly Rated");
  if (place.user_ratings_total && place.user_ratings_total > 500) features.push("Popular");
  
  return features;
}
