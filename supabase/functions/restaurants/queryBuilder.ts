
import { RestaurantParams } from './types.ts';

// Build the Google Places API search URL
export function buildGooglePlacesApiQuery(params: RestaurantParams, apiKey: string): URL {
  const endpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
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
  
  // Add atmosphere only if it's not "anything"
  if (params.atmosphere && params.atmosphere !== 'anything' && params.atmosphere.toString() !== 'anything') {
    if (Array.isArray(params.atmosphere)) {
      // Filter out "anything" if it's in the array
      const filteredAtmosphere = params.atmosphere.filter(atm => atm !== 'anything');
      
      // Special handling for "quiet" - we specifically want to add this to the query
      // as it's an important attribute that might appear in descriptions
      if (filteredAtmosphere.includes('quiet')) {
        query += ' quiet';
        // Remove 'quiet' after adding it separately to avoid duplication
        filteredAtmosphere.splice(filteredAtmosphere.indexOf('quiet'), 1);
      }
      
      if (filteredAtmosphere.length > 0) {
        query += ` ${filteredAtmosphere.join(' ')}`;
      }
    } else if (params.atmosphere === 'quiet') {
      query += ' quiet';
    } else {
      query += ` ${params.atmosphere}`;
    }
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
  
  return url;
}
