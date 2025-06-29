
import { RestaurantParams } from './types.ts';

// Build the Google Places API search URL
export function buildGooglePlacesApiQuery(params: RestaurantParams, apiKey: string): URL {
  const endpoint = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  
  // Start with a broader, more reliable base query
  let query = 'restaurants Nashville TN';
  
  // Only add specific neighborhoods if they're provided and not empty
  if (params.neighborhoods && params.neighborhoods.length > 0) {
    // Filter out any empty or invalid neighborhood values
    const validNeighborhoods = params.neighborhoods.filter(n => n && n.trim() !== '');
    if (validNeighborhoods.length > 0) {
      query += ` ${validNeighborhoods.join(' OR ')}`;
    }
  }
  
  // Add cuisine but be more flexible - don't add "anything"
  if (params.cuisine && params.cuisine.length > 0) {
    const validCuisines = params.cuisine.filter(c => c && c !== 'anything' && c.trim() !== '');
    if (validCuisines.length > 0) {
      query += ` ${validCuisines.join(' OR ')}`;
    }
  }
  
  // Skip preferences that are too generic
  if (params.preferences && params.preferences.length > 0) {
    const validPrefs = params.preferences.filter(p => p && p !== 'none' && p !== 'anything' && p.trim() !== '');
    if (validPrefs.length > 0) {
      query += ` ${validPrefs.join(' ')}`;
    }
  }
  
  // Handle atmosphere more carefully
  if (params.atmosphere && params.atmosphere !== 'anything') {
    if (Array.isArray(params.atmosphere)) {
      const validAtmosphere = params.atmosphere.filter(atm => atm !== 'anything' && atm.trim() !== '');
      if (validAtmosphere.length > 0) {
        query += ` ${validAtmosphere.join(' ')}`;
      }
    } else if (params.atmosphere.trim() !== '') {
      query += ` ${params.atmosphere}`;
    }
  }
  
  console.log('Final search query:', query);
  
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
  
  // Handle price filtering more conservatively - only apply if we have multiple price levels
  if (params.price && params.price.length > 0) {
    const priceMapping: Record<string, string> = {
      '$': '1',
      '$$': '2', 
      '$$$': '3',
      '$$$$': '4'
    };
    
    const priceLevels = params.price
      .map(price => priceMapping[price])
      .filter(Boolean);
    
    // Only add price filters if we have multiple price levels or if it's not the cheapest option
    if (priceLevels.length > 1) {
      const minPrice = Math.min(...priceLevels.map(Number));
      const maxPrice = Math.max(...priceLevels.map(Number));
      
      url.searchParams.append('minprice', minPrice.toString());
      url.searchParams.append('maxprice', maxPrice.toString());
      console.log('Added price filters:', minPrice, 'to', maxPrice);
    } else if (priceLevels.length === 1 && priceLevels[0] !== '1') {
      // Only apply single price filter if it's not the cheapest option (which is too restrictive)
      url.searchParams.append('minprice', priceLevels[0]);
      url.searchParams.append('maxprice', priceLevels[0]);
      console.log('Added single price filter:', priceLevels[0]);
    } else {
      console.log('Skipping restrictive price filter for single $ option');
    }
  }
  
  return url;
}
