import { QuizResult } from "@/utils/quizData";

// Expanded fallback data with more budget-friendly options and better variety
export const getFallbackRestaurants = (): QuizResult[] => {
  return [
    // Budget-friendly options ($) - Greatly expanded
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
      isAlternative: false
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
      isAlternative: false
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
      isAlternative: false
    },
    {
      id: "budget-4",
      name: "Krystal",
      cuisine: "Fast Food",
      neighborhood: "Multiple Locations",
      priceRange: "$",
      description: "Southern-style sliders and quick bites under $10.",
      address: "Various locations throughout Nashville",
      features: ["Sliders", "24/7", "Drive-thru"],
      coordinates: { latitude: 36.1627, longitude: -86.7816 },
      isAlternative: false
    },
    {
      id: "budget-5",
      name: "White Castle",
      cuisine: "Fast Food",
      neighborhood: "Multiple Locations", 
      priceRange: "$",
      description: "Iconic sliders and affordable late-night eats.",
      address: "Multiple Nashville locations",
      features: ["Sliders", "Late night", "Value meals"],
      coordinates: { latitude: 36.1535, longitude: -86.7743 },
      isAlternative: false
    },
    {
      id: "budget-6",
      name: "Taco Bell",
      cuisine: "Mexican Fast Food",
      neighborhood: "Multiple Locations",
      priceRange: "$",
      description: "Quick Mexican-inspired food with value menu options.",
      address: "Various Nashville locations",
      features: ["Value menu", "Drive-thru", "Late night"],
      coordinates: { latitude: 36.1580, longitude: -86.7734 },
      isAlternative: false
    },
    {
      id: "budget-7",
      name: "McDonald's",
      cuisine: "Fast Food",
      neighborhood: "Multiple Locations",
      priceRange: "$",
      description: "Classic fast food with dollar menu and value options.",
      address: "Numerous Nashville locations",
      features: ["Dollar menu", "McCafe", "24/7"],
      coordinates: { latitude: 36.1612, longitude: -86.7775 },
      isAlternative: false
    },
    {
      id: "budget-8",
      name: "Subway",
      cuisine: "Sandwiches",
      neighborhood: "Multiple Locations",
      priceRange: "$",
      description: "Fresh sandwiches and salads with daily deals.",
      address: "Multiple Nashville locations",
      features: ["$5 footlongs", "Fresh ingredients", "Healthy options"],
      coordinates: { latitude: 36.1598, longitude: -86.7752 },
      isAlternative: false
    },
    {
      id: "budget-9",
      name: "Wendy's",
      cuisine: "Fast Food",
      neighborhood: "Multiple Locations",
      priceRange: "$",
      description: "Fresh beef burgers and 4 for $4 deals.",
      address: "Various Nashville locations",
      features: ["4 for $4", "Fresh beef", "Frosty"],
      coordinates: { latitude: 36.1556, longitude: -86.7690 },
      isAlternative: false
    },
    {
      id: "budget-10",
      name: "KFC",
      cuisine: "Fried Chicken",
      neighborhood: "Multiple Locations",
      priceRange: "$",
      description: "Original recipe chicken with fill-up meals under $6.",
      address: "Multiple Nashville locations", 
      features: ["$5 Fill Up", "Original recipe", "Family meals"],
      coordinates: { latitude: 36.1523, longitude: -86.7812 },
      isAlternative: false
    },
    {
      id: "budget-11",
      name: "Little Caesars",
      cuisine: "Pizza",
      neighborhood: "Multiple Locations",
      priceRange: "$",
      description: "Hot-N-Ready pizzas for $5 and crazy bread.",
      address: "Various Nashville locations",
      features: ["$5 Hot-N-Ready", "Crazy bread", "No wait"],
      coordinates: { latitude: 36.1489, longitude: -86.7665 },
      isAlternative: false
    },
    {
      id: "budget-12",
      name: "Cookout",
      cuisine: "American",
      neighborhood: "Multiple Locations",
      priceRange: "$",
      description: "Burgers, BBQ, and milkshakes with combo trays under $6.",
      address: "Several Nashville locations",
      features: ["Combo trays", "40+ milkshakes", "Late night"],
      coordinates: { latitude: 36.1445, longitude: -86.7756 },
      isAlternative: false
    },
    // West Side Moderate Options ($$) - ADDED MORE
    {
      id: "west-1",
      name: "Puckett's Grocery & Restaurant",
      cuisine: "Southern",
      neighborhood: "Belle Meade",
      priceRange: "$$",
      description: "Classic Southern comfort food in a charming grocery store setting.",
      address: "4142 Harding Pike, Nashville, TN 37205",
      features: ["Comfort food", "Live music", "Historic setting"],
      website: "https://puckettsgrocery.com",
      phone: "(615) 298-5573",
      coordinates: { latitude: 36.1105, longitude: -86.8441 },
      isAlternative: false
    },
    {
      id: "west-2",
      name: "The Loveless Cafe",
      cuisine: "Southern",
      neighborhood: "Bellevue",
      priceRange: "$$",
      description: "Famous for biscuits and country ham, a Nashville institution since 1951.",
      address: "8400 Highway 100, Nashville, TN 37221",
      features: ["Famous biscuits", "Country ham", "Nashville institution"],
      website: "https://lovelesscafe.com",
      phone: "(615) 646-9700",
      coordinates: { latitude: 36.0668, longitude: -86.9127 },
      isAlternative: false
    },
    {
      id: "west-3",
      name: "Firebirds Wood Fired Grill",
      cuisine: "American",
      neighborhood: "Green Hills",
      priceRange: "$$",
      description: "Wood-fired steaks and fresh seafood in an upscale casual atmosphere.",
      address: "2120 Abbott Martin Rd, Nashville, TN 37215",
      features: ["Wood-fired grill", "Steaks", "Seafood"],
      website: "https://firebirdsrestaurants.com",
      phone: "(615) 577-2356",
      coordinates: { latitude: 36.1063, longitude: -86.8147 },
      isAlternative: false
    },
    {
      id: "west-4",
      name: "Whiskey Kitchen",
      cuisine: "American",
      neighborhood: "Green Hills",
      priceRange: "$$",
      description: "Elevated Southern cuisine with an extensive whiskey selection.",
      address: "118 12th Ave S, Nashville, TN 37203",
      features: ["Whiskey selection", "Southern cuisine", "Rooftop"],
      website: "https://whiskeykitchen.com",
      phone: "(615) 254-3029",
      coordinates: { latitude: 36.1063, longitude: -86.8147 },
      isAlternative: false
    },
    {
      id: "west-5",
      name: "Tavern",
      cuisine: "American",
      neighborhood: "West End",
      priceRange: "$$",
      description: "Modern American fare with a focus on local ingredients.",
      address: "1904 Broadway, Nashville, TN 37203",
      features: ["Local ingredients", "Modern American", "Craft cocktails"],
      website: "https://tavernashville.com",
      phone: "(615) 320-8580",
      coordinates: { latitude: 36.1508, longitude: -86.8014 },
      isAlternative: false
    },
    {
      id: "west-6",
      name: "Mesquite Chop House",
      cuisine: "Steakhouse",
      neighborhood: "Bellevue",
      priceRange: "$$",
      description: "Quality steaks and seafood in a relaxed atmosphere.",
      address: "7804 Highway 70 S, Nashville, TN 37221",
      features: ["Steaks", "Seafood", "Full bar"],
      phone: "(615) 646-4002",
      coordinates: { latitude: 36.0962, longitude: -86.8758 },
      isAlternative: false
    },
    {
      id: "west-7",
      name: "Sunset Grill",
      cuisine: "American",
      neighborhood: "Belle Meade",
      priceRange: "$$",
      description: "Eclectic menu with globally-inspired dishes and great atmosphere.",
      address: "2001 Belcourt Ave, Nashville, TN 37212",
      features: ["Eclectic menu", "Global cuisine", "Great atmosphere"],
      website: "https://sunsetgrill.com",
      phone: "(615) 386-3663",
      coordinates: { latitude: 36.1343, longitude: -86.8169 },
      isAlternative: false
    },
    // Moderate options ($$)
    {
      id: "moderate-1",
      name: "Pharmacy Burger Parlor",
      cuisine: "American",
      neighborhood: "East Nashville",
      priceRange: "$$",
      description: "Creative burgers and milkshakes in a retro pharmacy setting.",
      address: "731 McFerrin Ave, Nashville, TN 37206", 
      features: ["Craft burgers", "Milkshakes", "Unique atmosphere"],
      website: "https://pharmacyburger.com",
      phone: "(615) 712-9517",
      coordinates: { latitude: 36.1835, longitude: -86.7312 },
      isAlternative: false
    },
    {
      id: "moderate-2",
      name: "Folk",
      cuisine: "Pizza",
      neighborhood: "East Nashville",
      priceRange: "$$",
      description: "Creative, wood-fired pizzas and vegetable dishes.",
      address: "823 Meridian St, Nashville, TN 37207",
      features: ["Wood-fired pizza", "Vegetarian options", "Weekend brunch"],
      website: "https://www.folkrestaurant.com",
      phone: "(615) 610-2595",
      coordinates: { latitude: 36.1886, longitude: -86.7434 },
      isAlternative: false
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
      isAlternative: false
    },
    // Higher-end options for variety ($$$)
    {
      id: "upscale-1",
      name: "Husk Nashville",
      cuisine: "Southern",
      neighborhood: "Downtown",
      priceRange: "$$$",
      description: "Locally sourced Southern dishes in a historic mansion.",
      address: "37 Rutledge St, Nashville, TN 37210",
      features: ["Farm-to-table", "Historic setting", "Seasonal menu"],
      website: "https://husknashville.com",
      phone: "(615) 256-6565",
      coordinates: { latitude: 36.1553, longitude: -86.7699 },
      isAlternative: false
    }
  ];
};

// Enhanced function with better randomization and location-aware filtering
export const getFilteredFallbackRestaurants = (params?: {
  cuisine?: string[];
  price?: string[];
  neighborhoods?: string[];
  userLocation?: { latitude: number; longitude: number };
  distance?: number;
}): QuizResult[] => {
  let restaurants = getFallbackRestaurants();
  
  if (!params) {
    // Randomize order to avoid showing the same restaurants every time
    return shuffleArray(restaurants).slice(0, 12);
  }
  
  console.log('Filtering fallback restaurants with params:', params);
  
  // IMPROVED NEIGHBORHOOD FILTERING - more flexible matching
  if (params.neighborhoods && params.neighborhoods.length > 0) {
    const filtered = restaurants.filter(restaurant => {
      return params.neighborhoods!.some(selectedNeighborhood => {
        const restaurantNeighborhood = restaurant.neighborhood.toLowerCase();
        const selectedLower = selectedNeighborhood.toLowerCase();
        
        // Direct match
        if (restaurantNeighborhood.includes(selectedLower)) return true;
        
        // Handle common variations
        const neighborhoodMappings: { [key: string]: string[] } = {
          'bellevue': ['bellevue'],
          'belle-meade': ['belle meade', 'bellemeade'],
          'green-hills': ['green hills', 'greenhills'],
          'west-end': ['west end', 'westend'],
          'east': ['east nashville'],
          'downtown': ['downtown', 'gulch', 'music row'],
          '12south': ['12 south', 'twelve south']
        };
        
        // Check if selected neighborhood maps to restaurant neighborhood
        const mappedNeighborhoods = neighborhoodMappings[selectedLower] || [];
        return mappedNeighborhoods.some(mapped => restaurantNeighborhood.includes(mapped));
      });
    });
    
    if (filtered.length > 0) {
      restaurants = filtered;
      console.log(`Filtered by neighborhoods: ${restaurants.length} restaurants match`, params.neighborhoods);
    } else {
      console.log('No exact neighborhood matches found, keeping all restaurants for variety');
    }
  }
  
  // Filter by price range
  if (params.price && params.price.length > 0) {
    const priceFiltered = restaurants.filter(r => params.price!.includes(r.priceRange));
    if (priceFiltered.length > 0) {
      restaurants = priceFiltered;
      console.log(`Filtered by price: ${restaurants.length} restaurants match ${params.price.join(', ')}`);
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
      // For restaurants without coordinates, assign a reasonable distance for multiple location chains
      const isChain = restaurant.neighborhood === "Multiple Locations";
      return { 
        ...restaurant, 
        distanceFromUser: isChain ? 1.5 : undefined // Assume chains are typically within 1.5 miles
      };
    });
    
    // Filter by distance and sort by proximity
    restaurants = restaurants
      .filter(r => !r.distanceFromUser || r.distanceFromUser <= params.distance!)
      .sort((a, b) => (a.distanceFromUser || 999) - (b.distanceFromUser || 999));
    
    console.log(`Filtered by distance (${params.distance} miles): ${restaurants.length} restaurants`);
  }
  
  // Score and sort by preference matches, but maintain some randomization
  restaurants = restaurants.sort((a, b) => {
    let scoreA = Math.random() * 2; // Add randomization factor
    let scoreB = Math.random() * 2;
    
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
    
    // Higher score for neighborhood match
    if (params.neighborhoods?.some(n => {
      const restaurantNeighborhood = a.neighborhood.toLowerCase();
      const selectedLower = n.toLowerCase();
      return restaurantNeighborhood.includes(selectedLower) || 
             selectedLower.includes(restaurantNeighborhood);
    })) {
      scoreA += 8; // Higher weight for neighborhood matches
    }
    if (params.neighborhoods?.some(n => {
      const restaurantNeighborhood = b.neighborhood.toLowerCase();
      const selectedLower = n.toLowerCase();
      return restaurantNeighborhood.includes(selectedLower) || 
             selectedLower.includes(restaurantNeighborhood);
    })) {
      scoreB += 8;
    }
    
    return scoreB - scoreA;
  });
  
  // Return a good variety, limiting to prevent overwhelming results
  const result = restaurants.slice(0, 15);
  console.log(`Final fallback results: ${result.length} restaurants`);
  console.log('Sample results:', result.slice(0, 5).map(r => ({ name: r.name, neighborhood: r.neighborhood, price: r.priceRange })));
  return result;
};

// Helper function to shuffle array for randomization
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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
