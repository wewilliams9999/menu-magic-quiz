
import { RestaurantParams } from './types.ts';

// Build the Google Places API search URL
export function buildGooglePlacesApiQuery(params: RestaurantParams, apiKey: string): URL {
  const endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  
  const url = new URL(endpoint);
  url.searchParams.append('key', apiKey);
  
  // Use location-based search if user location is provided
  if (params.userLocation && params.distance) {
    url.searchParams.append('location', `${params.userLocation.latitude},${params.userLocation.longitude}`);
    // Convert miles to meters for the Google API
    const radiusInMeters = params.distance * 1609.34;
    url.searchParams.append('radius', radiusInMeters.toString());
    url.searchParams.append('type', 'restaurant');
    
    console.log('Using location-based search:', {
      location: `${params.userLocation.latitude},${params.userLocation.longitude}`,
      radius: `${params.distance} miles (${radiusInMeters}m)`
    });
  } else {
    // Fallback to text search for Nashville if no location
    const fallbackEndpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const fallbackUrl = new URL(fallbackEndpoint);
    fallbackUrl.searchParams.append('query', 'restaurants Nashville TN');
    fallbackUrl.searchParams.append('key', apiKey);
    console.log('No location provided, using text search fallback');
    return fallbackUrl;
  }
  
  // Add price level filtering based on user preferences
  if (params.price && params.price.length > 0) {
    // Map price ranges to Google Places price levels (0-4)
    const priceLevels: number[] = [];
    params.price.forEach(priceRange => {
      switch (priceRange) {
        case '$':
          priceLevels.push(0, 1); // Free and inexpensive
          break;
        case '$$':
          priceLevels.push(2); // Moderate
          break;
        case '$$$':
          priceLevels.push(3); // Expensive
          break;
        case '$$$$':
          priceLevels.push(4); // Very expensive
          break;
      }
    });
    
    if (priceLevels.length > 0) {
      // Use the lowest price level for filtering (Google API accepts single value)
      const minPriceLevel = Math.min(...priceLevels);
      const maxPriceLevel = Math.max(...priceLevels);
      url.searchParams.append('minprice', minPriceLevel.toString());
      url.searchParams.append('maxprice', maxPriceLevel.toString());
      console.log('Added price filtering:', { minPriceLevel, maxPriceLevel });
    }
  }
  
  // Add cuisine-based keyword if specified
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
  
  console.log('Final Google Places API URL:', url.toString());
  return url;
}
