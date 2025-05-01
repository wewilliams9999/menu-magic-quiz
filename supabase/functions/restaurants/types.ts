
// Types for the restaurant search functionality
export interface RestaurantParams {
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

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  neighborhood: string;
  priceRange: string;
  description: string;
  address?: string;
  imageUrl?: string;
  logoUrl?: string;
  features?: string[];
  website?: string;
  openTableLink?: string;
  resyLink?: string;
  instagramLink?: string;
}

export interface GooglePlaceResult {
  place_id: string;
  name: string;
  vicinity?: string;
  formatted_address?: string;
  price_level?: number;
  rating?: number;
  user_ratings_total?: number;
  types?: string[];
  photos?: { photo_reference: string }[];
  plus_code?: { compound_code: string };
  editorial_summary?: { overview: string };
  website?: string;
}
