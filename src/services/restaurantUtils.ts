
import { QuizResult } from "@/utils/quizData";
import { RestaurantApiParams } from "./types";

/**
 * Calculate distance between two points using the Haversine formula
 * Returns distance in miles
 */
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  // Earth's radius in miles
  const R = 3958.8;
  
  // Convert latitude and longitude from degrees to radians
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLng = ((lng2 - lng1) * Math.PI) / 180;
  
  // Calculate haversine formula
  const a = 
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * 
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Distance in miles
  return R * c;
};

/**
 * Enhances restaurant results with links and distance calculations
 * Sorts by distance from user if coordinates are available
 */
export const enhanceAndSortResults = (results: QuizResult[], params: RestaurantApiParams): QuizResult[] => {
  // Add the missing links if they don't exist
  let enhancedResults = results.map(result => {
    // Always ensure we have a website link
    if (!result.website) {
      result.website = `https://www.google.com/search?q=${encodeURIComponent(result.name + " " + result.neighborhood + " Nashville")}`;
    }
    
    // Add mock reservation links to some restaurants (for demo purposes)
    if (!result.resyLink && Math.random() > 0.5) {
      result.resyLink = `https://resy.com/cities/bna/venues/${result.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    }
    
    if (!result.openTableLink && !result.resyLink && Math.random() > 0.5) {
      result.openTableLink = `https://www.opentable.com/r/${result.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    }
    
    // Add Instagram link if missing
    if (!result.instagramLink && Math.random() > 0.3) {
      result.instagramLink = `https://www.instagram.com/${result.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    }

    // Calculate distance from user if coordinates are available
    if (params.userLocation && result.coordinates) {
      const distance = calculateDistance(
        params.userLocation.latitude,
        params.userLocation.longitude,
        result.coordinates.latitude,
        result.coordinates.longitude
      );
      result.distanceFromUser = distance;
      
      // Mark as alternative if beyond the requested distance
      if (params.distance && distance > params.distance) {
        result.isAlternative = true;
      }
    }
    
    return result;
  });

  // Sort by distance from user if available
  if (params.userLocation) {
    enhancedResults = enhancedResults.sort((a, b) => {
      if (a.distanceFromUser && b.distanceFromUser) {
        return a.distanceFromUser - b.distanceFromUser;
      }
      return 0;
    });
  }
  
  return enhancedResults;
};
