
import { QuizResult } from "@/utils/quizData";

// Enhanced fallback data with more budget-friendly options and better variety
export const getFallbackRestaurants = (): QuizResult[] => {
  return [
    // Budget-friendly options ($)
    {
      id: "budget-1",
      name: "Prince's Hot Chicken Shack",
      cuisine: "Southern",
      neighborhood: "North Nashville",
      priceRange: "$",
      description: "Legendary Nashville hot chicken at unbeatable prices.",
      address: "123 Ewing Dr, Nashville, TN 37207",
      features: ["Hot chicken", "Cash only", "Local legend"],
      website: "https://www.princeshotchicken.com",
      phone: "(615) 226-9442",
      coordinates: { latitude: 36.1945, longitude: -86.8027 },
      isAlternative: true
    },
    {
      id: "budget-2", 
      name: "Mas Tacos Por Favor",
      cuisine: "Mexican",
      neighborhood: "East Nashville",
      priceRange: "$",
      description: "Authentic Mexican street tacos and affordable eats.",
      address: "732 McFerrin Ave, Nashville, TN 37206",
      features: ["Street tacos", "Casual dining", "Great value"],
      website: "https://www.mastacos.com",
      phone: "(615) 543-6271",
      coordinates: { latitude: 36.1836, longitude: -86.7311 },
      isAlternative: true
    },
    {
      id: "budget-3",
      name: "Hattie B's Hot Chicken",
      cuisine: "Southern", 
      neighborhood: "Downtown",
      priceRange: "$",
      description: "Nashville's famous hot chicken with multiple heat levels.",
      address: "112 19th Ave S, Nashville, TN 37203",
      features: ["Hot chicken", "Multiple locations", "Tourist favorite"],
      website: "https://hattieb.com",
      phone: "(615) 678-4794",
      coordinates: { latitude: 36.1447, longitude: -86.7978 },
      isAlternative: true
    },
    {
      id: "budget-4",
      name: "Pharmacy Burger Parlor",
      cuisine: "American",
      neighborhood: "East Nashville",
      priceRange: "$",
      description: "Creative burgers and milkshakes in a retro pharmacy setting.",
      address: "731 McFerrin Ave, Nashville, TN 37206", 
      features: ["Craft burgers", "Milkshakes", "Unique atmosphere"],
      website: "https://pharmacyburger.com",
      phone: "(615) 712-9517",
      coordinates: { latitude: 36.1835, longitude: -86.7312 },
      isAlternative: true
    },
    // Moderate options ($$)
    {
      id: "moderate-1",
      name: "Folk",
      cuisine: "Pizza",
      neighborhood: "East Nashville",
      priceRange: "$$",
      description: "Creative, wood-fired pizzas and vegetable dishes in a bright, stylish space.",
      address: "823 Meridian St, Nashville, TN 37207",
      features: ["Wood-fired pizza", "Vegetarian options", "Weekend brunch"],
      website: "https://www.folkrestaurant.com",
      resyLink: "https://resy.com/cities/bna/venues/folk",
      phone: "(615) 610-2595",
      coordinates: { latitude: 36.1886, longitude: -86.7434 },
      isAlternative: true
    },
    {
      id: "moderate-2",
      name: "Lockeland Table",
      cuisine: "Southern",
      neighborhood: "East Nashville", 
      priceRange: "$$",
      description: "Community-focused restaurant serving elevated Southern comfort food.",
      address: "1520 Woodland St, Nashville, TN 37206",
      features: ["Southern comfort", "Community focused", "Brunch"],
      website: "https://lockelandtable.com",
      phone: "(615) 228-4864",
      coordinates: { latitude: 36.1767, longitude: -86.7420 },
      isAlternative: true
    },
    {
      id: "moderate-3",
      name: "Butchertown Hall",
      cuisine: "BBQ",
      neighborhood: "Germantown",
      priceRange: "$$", 
      description: "Texas-style BBQ with live music in a spacious hall setting.",
      address: "1416 4th Ave N, Nashville, TN 37208",
      features: ["Texas BBQ", "Live music", "Large groups"],
      website: "https://butchertownhall.com",
      phone: "(615) 454-3634",
      coordinates: { latitude: 36.1795, longitude: -86.7841 },
      isAlternative: true
    },
    // Higher-end options for variety ($$$)
    {
      id: "upscale-1",
      name: "Husk Nashville",
      cuisine: "Southern",
      neighborhood: "Downtown",
      priceRange: "$$$",
      description: "Locally sourced Southern dishes served in a historic mansion with a modern touch.",
      address: "37 Rutledge St, Nashville, TN 37210",
      features: ["Farm-to-table", "Historic setting", "Seasonal menu"],
      website: "https://husknashville.com",
      resyLink: "https://resy.com/cities/bna/venues/husk-nashville",
      phone: "(615) 256-6565",
      coordinates: { latitude: 36.1553, longitude: -86.7699 },
      isAlternative: true
    }
  ];
};

// Enhanced function to filter and sort fallback restaurants based on user preferences and location
export const getFilteredFallbackRestaurants = (params?: {
  cuisine?: string[];
  price?: string[];
  neighborhoods?: string[];
  userLocation?: { latitude: number; longitude: number };
  distance?: number;
}): QuizResult[] => {
  let restaurants = getFallbackRestaurants();
  
  if (!params) {
    return restaurants;
  }
  
  // Filter by price range first to prioritize budget-friendly options
  if (params.price && params.price.length > 0) {
    const filtered = restaurants.filter(r => params.price!.includes(r.priceRange));
    if (filtered.length > 0) {
      restaurants = filtered;
    }
  }
  
  // Calculate distances and filter by distance if user location is provided
  if (params.userLocation && params.distance) {
    restaurants = restaurants.map(restaurant => {
      if (restaurant.coordinates) {
        const distance = calculateDistance(
          params.userLocation!.latitude,
          params.userLocation!.longitude,
          restaurant.coordinates.latitude,
          restaurant.coordinates.longitude
        );
        return { ...restaurant, distanceFromUser: distance };
      }
      return restaurant;
    });
    
    // Filter by distance and sort by proximity
    restaurants = restaurants
      .filter(r => !r.distanceFromUser || r.distanceFromUser <= params.distance!)
      .sort((a, b) => (a.distanceFromUser || 999) - (b.distanceFromUser || 999));
  }
  
  // Score and sort by preference matches
  restaurants = restaurants.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // Higher score for exact price match
    if (params.price?.includes(a.priceRange)) scoreA += 10;
    if (params.price?.includes(b.priceRange)) scoreB += 10;
    
    // Score for cuisine match
    if (params.cuisine?.some(c => a.cuisine.toLowerCase().includes(c.toLowerCase()))) {
      scoreA += 5;
    }
    if (params.cuisine?.some(c => b.cuisine.toLowerCase().includes(c.toLowerCase()))) {
      scoreB += 5;
    }
    
    // Score for neighborhood match
    if (params.neighborhoods?.some(n => a.neighborhood.toLowerCase().includes(n.toLowerCase()))) {
      scoreA += 3;
    }
    if (params.neighborhoods?.some(n => b.neighborhood.toLowerCase().includes(n.toLowerCase()))) {
      scoreB += 3;
    }
    
    return scoreB - scoreA;
  });
  
  return restaurants;
};

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLng = ((lng2 - lng1) * Math.PI) / 180;
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * 
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}
