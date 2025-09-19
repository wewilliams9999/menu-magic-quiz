
// Re-export all functionality from our modular files
// This ensures backward compatibility with existing code

export { fetchRestaurants } from './restaurantApi';
export type { RestaurantApiResponse } from './restaurantApi';
export { getFallbackRestaurants, getFilteredFallbackRestaurants } from './mockData';
export { calculateDistance } from './restaurantUtils';
export { mapGooglePlacesToRestaurants } from './types';
export type { RestaurantApiParams } from './types';
