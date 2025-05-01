
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

// Map Google Places API results to our app's restaurant format
export function mapGooglePlacesToRestaurants(places: GooglePlaceResult[], apiKey: string): Restaurant[] {
  return places.map((place) => {
    // Extract neighborhood from address components if available
    let neighborhood = "Nashville";
    if (place.plus_code && place.plus_code.compound_code) {
      const addressParts = place.plus_code.compound_code.split(',');
      if (addressParts.length > 0) {
        neighborhood = addressParts[0].replace(/^[^ ]+ /, '');  // Remove the plus code
      }
    }
    
    // Determine cuisine type from place types
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
    
    // Create description
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
      priceRange: place.price_level !== undefined ? priceRangeMap[place.price_level] : "$$",
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
}
