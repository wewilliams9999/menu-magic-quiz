
import { RestaurantParams } from './types.ts';

// Build the Google Places API search URL
export function buildGooglePlacesApiQuery(params: RestaurantParams, apiKey: string): URL {
  const endpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  
  // Start with a very broad, reliable base query
  let query = 'restaurants Nashville TN';
  
  // Only add specific filters if we have strong preferences
  // Skip neighborhoods entirely for location-based searches to get more variety
  if (params.neighborhoods && params.neighborhoods.length > 0 && !params.userLocation) {
    // Only add neighborhoods if not using location and we have specific ones
    const validNeighborhoods = params.neighborhoods.filter(n => n && n.trim() !== '');
    if (validNeighborhoods.length > 0 && validNeighborhoods.length <= 2) {
      // Only add if we have 1-2 specific neighborhoods to avoid being too restrictive
      query += ` ${validNeighborhoods.join(' OR ')}`;
    }
  }
  
  // Be very selective about adding cuisine - only if specific
  if (params.cuisine && params.cuisine.length > 0) {
    const validCuisines = params.cuisine.filter(c => 
      c && 
      c !== 'anything' && 
      c !== 'american' && // Skip generic cuisines that don't help narrow results
      c.trim() !== ''
    );
    if (validCuisines.length > 0 && validCuisines.length <= 2) {
      // Only add 1-2 specific cuisines to avoid being too restrictive
      query += ` ${validCuisines.slice(0, 2).join(' OR ')}`;
    }
  }
  
  // Skip preferences and atmosphere for broader results
  console.log('Broad search query:', query);
  
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
    console.log('Added location and radius:', params.userLocation, `${params.distance} miles`);
  }
  
  // Skip price filtering entirely to get more results
  console.log('Skipping price filters to get broader results');
  
  return url;
}
