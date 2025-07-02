
import { RestaurantParams } from './types.ts';

// Build the Google Places API search URL with improved location and price handling
export function buildGooglePlacesApiQuery(params: RestaurantParams, apiKey: string): URL {
  console.log('Building Google Places query with params:', JSON.stringify(params, null, 2));
  
  // Use location-based search if user location is provided
  if (params.userLocation && params.distance) {
    const endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const url = new URL(endpoint);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('location', `${params.userLocation.latitude},${params.userLocation.longitude}`);
    
    // Convert miles to meters for the Google API
    const radiusInMeters = params.distance * 1609.34;
    url.searchParams.append('radius', radiusInMeters.toString());
    url.searchParams.append('type', 'restaurant');
    
    // Add price level filtering based on user preferences - be more aggressive
    if (params.price && params.price.length > 0) {
      // Map price ranges to Google Places price levels (0-4)
      const priceLevels: number[] = [];
      params.price.forEach(priceRange => {
        switch (priceRange) {
          case '$':
            priceLevels.push(0, 1); // Free and inexpensive
            break;
          case '$$':
            priceLevels.push(1, 2); // Inexpensive to moderate
            break;
          case '$$$':
            priceLevels.push(2, 3); // Moderate to expensive
            break;
          case '$$$$':
            priceLevels.push(3, 4); // Expensive to very expensive
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
    
    // Add cuisine-based keyword if specified and not "anything"
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
    
    console.log('Location-based search URL:', url.toString());
    return url;
  }
  
  // Fallback to text search with better query construction
  const fallbackEndpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  const fallbackUrl = new URL(fallbackEndpoint);
  
  // Build a more specific query
  let query = 'restaurants Nashville TN';
  
  // Add price-based terms to the text search
  if (params.price && params.price.includes('$')) {
    query = 'cheap restaurants fast food Nashville TN under $10';
  } else if (params.price && params.price.includes('$$')) {
    query = 'affordable restaurants Nashville TN under $20';
  }
  
  // Add cuisine to text search if specified
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
  
  console.log('Text search fallback URL:', fallbackUrl.toString());
  console.log('Search query:', query);
  
  return fallbackUrl;
}
