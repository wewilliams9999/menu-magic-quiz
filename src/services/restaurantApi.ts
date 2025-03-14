
import { QuizResult } from "@/utils/quizData";

// API Key should ideally be stored in environment variables on a backend
// For demo purposes we're using it directly, but in production you'd want to use a backend endpoint
const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key

export interface ApiRestaurant {
  id: string;
  name: string;
  description: string;
  image_url: string;
  categories: { alias: string; title: string }[];
  price: string;
  location: {
    address1: string;
    city: string;
    state: string;
    zip_code: string;
  };
  url: string;
  neighborhoods?: string[];
}

export const searchRestaurants = async (
  location: string = "Nashville, TN",
  categories?: string,
  price?: string,
  limit: number = 10
): Promise<ApiRestaurant[]> => {
  try {
    // This simulates an API call for demonstration
    // In a real application, you'd replace this with actual API calls
    
    // For example, with Yelp Fusion API:
    // const response = await fetch(`https://api.yelp.com/v3/businesses/search?location=${location}&categories=${categories}&price=${price}&limit=${limit}`, {
    //   headers: {
    //     Authorization: `Bearer ${API_KEY}`,
    //   },
    // });
    // const data = await response.json();
    // return data.businesses;
    
    console.log("API search parameters:", { location, categories, price, limit });
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock data - in production, this would be real API data
    return mockRestaurants.filter(restaurant => {
      let match = true;
      
      if (categories) {
        const categoryList = categories.split(',');
        match = match && categoryList.some(cat => 
          restaurant.categories.some(c => c.alias.includes(cat))
        );
      }
      
      if (price) {
        match = match && restaurant.price === price;
      }
      
      return match;
    }).slice(0, limit);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
};

export const mapApiRestaurantToQuizResult = (restaurant: ApiRestaurant): QuizResult => {
  // Map price to our internal format
  const priceMap: Record<string, string> = {
    "$": "$",
    "$$": "$$",
    "$$$": "$$$",
    "$$$$": "$$$$"
  };
  
  // Map categories to tags
  const tags = restaurant.categories.map(cat => cat.alias);
  
  // Extract neighborhood if available
  const neighborhood = restaurant.neighborhoods?.[0] || "downtown";
  
  return {
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.image_url || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500&auto=format&fit=crop",
    tags: tags,
    address: `${restaurant.location.address1}, ${restaurant.location.city}, ${restaurant.location.state} ${restaurant.location.zip_code}`,
    website: restaurant.url,
    priceRange: priceMap[restaurant.price] || "$$",
    neighborhood: neighborhood
  };
};

// Mock data for demonstration - in production this would come from the API
const mockRestaurants: ApiRestaurant[] = [
  {
    id: "husk-nashville",
    name: "Husk",
    description: "A celebration of Southern ingredients reimagined with a modern approach.",
    image_url: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=500&auto=format&fit=crop",
    categories: [
      { alias: "southern", title: "Southern" },
      { alias: "newamerican", title: "New American" }
    ],
    price: "$$$",
    location: {
      address1: "37 Rutledge St",
      city: "Nashville",
      state: "TN",
      zip_code: "37210"
    },
    url: "https://husknashville.com",
    neighborhoods: ["downtown"]
  },
  {
    id: "butcher-and-bee-nashville",
    name: "Butcher & Bee",
    description: "Farm-to-table Mediterranean-inspired fare with a focus on shared plates.",
    image_url: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=500&auto=format&fit=crop",
    categories: [
      { alias: "farm-to-table", title: "Farm to Table" },
      { alias: "mediterranean", title: "Mediterranean" }
    ],
    price: "$$",
    location: {
      address1: "902 Main St",
      city: "Nashville",
      state: "TN",
      zip_code: "37206"
    },
    url: "https://butcherandbee.com/nashville",
    neighborhoods: ["east"]
  },
  {
    id: "folk-nashville",
    name: "Folk",
    description: "Artisanal pizzas and seasonal small plates in a bright, airy space.",
    image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop",
    categories: [
      { alias: "pizza", title: "Pizza" },
      { alias: "american", title: "American" }
    ],
    price: "$$",
    location: {
      address1: "823 Meridian St",
      city: "Nashville",
      state: "TN",
      zip_code: "37207"
    },
    url: "https://www.folkrestaurant.com",
    neighborhoods: ["east"]
  },
  {
    id: "henrietta-red-nashville",
    name: "Henrietta Red",
    description: "Seafood-focused, seasonal menu with an exceptional raw bar.",
    image_url: "https://images.unsplash.com/photo-1535140728325-a4d3707eee61?q=80&w=500&auto=format&fit=crop",
    categories: [
      { alias: "seafood", title: "Seafood" },
      { alias: "american", title: "American" }
    ],
    price: "$$$",
    location: {
      address1: "1200 4th Ave N",
      city: "Nashville",
      state: "TN",
      zip_code: "37208"
    },
    url: "https://www.henriettared.com",
    neighborhoods: ["germantown"]
  },
  {
    id: "lockeland-table-nashville",
    name: "Lockeland Table",
    description: "Community-focused eatery serving wood-fired pizzas and Southern-inspired dishes.",
    image_url: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?q=80&w=500&auto=format&fit=crop",
    categories: [
      { alias: "pizza", title: "Pizza" },
      { alias: "southern", title: "Southern" },
      { alias: "american", title: "American" }
    ],
    price: "$$",
    location: {
      address1: "1520 Woodland St",
      city: "Nashville",
      state: "TN",
      zip_code: "37206"
    },
    url: "https://www.lockelandtable.com",
    neighborhoods: ["east"]
  },
  {
    id: "arnold-country-kitchen-nashville",
    name: "Arnold's Country Kitchen",
    description: "Iconic meat-and-three cafeteria serving Nashville's best comfort food.",
    image_url: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb8?q=80&w=500&auto=format&fit=crop",
    categories: [
      { alias: "southern", title: "Southern" },
      { alias: "comfortfood", title: "Comfort Food" }
    ],
    price: "$",
    location: {
      address1: "605 8th Ave S",
      city: "Nashville",
      state: "TN",
      zip_code: "37203"
    },
    url: "https://www.arnoldscountrykitchen.com",
    neighborhoods: ["downtown"]
  },
  {
    id: "bartaco-nashville",
    name: "Bartaco",
    description: "Upscale street food with a coastal vibe, specializing in tacos and rice bowls.",
    image_url: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=500&auto=format&fit=crop",
    categories: [
      { alias: "mexican", title: "Mexican" },
      { alias: "tacos", title: "Tacos" },
      { alias: "international", title: "International" }
    ],
    price: "$$",
    location: {
      address1: "2526 12th Ave S",
      city: "Nashville",
      state: "TN",
      zip_code: "37204"
    },
    url: "https://bartaco.com",
    neighborhoods: ["12south"]
  },
  {
    id: "five-daughters-bakery-nashville",
    name: "Five Daughters Bakery",
    description: "Artisanal bakery famous for their 100-layer donuts and pastries.",
    image_url: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?q=80&w=500&auto=format&fit=crop",
    categories: [
      { alias: "bakeries", title: "Bakeries" },
      { alias: "dessert", title: "Dessert" }
    ],
    price: "$",
    location: {
      address1: "1110 Caruthers Ave",
      city: "Nashville",
      state: "TN",
      zip_code: "37204"
    },
    url: "https://fivedaughtersbakery.com",
    neighborhoods: ["12south"]
  },
  {
    id: "kayne-prime-nashville",
    name: "Kayne Prime",
    description: "Upscale steakhouse offering modern interpretations of classic American cuisine.",
    image_url: "https://images.unsplash.com/photo-1579312624347-ef08db393114?q=80&w=500&auto=format&fit=crop",
    categories: [
      { alias: "steak", title: "Steakhouses" },
      { alias: "american", title: "American" }
    ],
    price: "$$$$",
    location: {
      address1: "1103 McGavock St",
      city: "Nashville",
      state: "TN",
      zip_code: "37203"
    },
    url: "https://www.mstreetnashville.com/kayne-prime",
    neighborhoods: ["gulch"]
  }
];
