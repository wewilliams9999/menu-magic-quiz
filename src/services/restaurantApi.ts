import { QuizResult } from "@/utils/quizData";

// API Key should ideally be stored in environment variables on a backend
// For demo purposes we're using it directly, but in production you'd want to use a backend endpoint
const API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key

export interface ApiRestaurant {
  id: string;
  name: string;
  description: string;
  image_url: string;
  logo_url?: string;
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
  cuisine?: string;
  priceRange?: string;
  instagram_url?: string;
}

// Define the input parameters for restaurant filtering
export interface RestaurantQueryParams {
  neighborhoods?: string[];
  cuisine?: string;
  price?: string;
  atmosphere?: string;
  preferences?: string[];
}

export const searchRestaurants = async (
  params: RestaurantQueryParams
): Promise<QuizResult[]> => {
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
    
    console.log("API search parameters:", params);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return mock data - in production, this would be real API data
    const filteredRestaurants = mockRestaurants.filter(restaurant => {
      let match = true;
      
      if (params.cuisine) {
        match = match && restaurant.categories.some(c => c.alias.includes(params.cuisine || ''));
      }
      
      if (params.price) {
        match = match && restaurant.price === params.price;
      }

      if (params.neighborhoods && params.neighborhoods.length > 0) {
        match = match && params.neighborhoods.some(n => 
          restaurant.neighborhoods?.includes(n)
        );
      }
      
      // Apply additional filters from preferences
      if (params.preferences && params.preferences.length > 0) {
        // This is a simplified version - in a real API this would be more complex
        // Just demonstrating how we might handle attribute filtering
        match = match && true; // Mocked to always match in our demo
      }
      
      return match;
    }).slice(0, 10);

    return filteredRestaurants.map(mapApiRestaurantToQuizResult);
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
  
  // Map categories to features
  const features = restaurant.categories.map(cat => cat.title);
  
  // Extract neighborhood if available
  const neighborhood = restaurant.neighborhoods?.[0] || "downtown";
  
  // Extract cuisine from categories or use default
  const cuisine = restaurant.categories[0]?.title || "American";
  
  return {
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description,
    imageUrl: restaurant.image_url,
    logoUrl: restaurant.logo_url,
    features: features,
    website: restaurant.url,
    priceRange: restaurant.priceRange || priceMap[restaurant.price] || "$$",
    neighborhood: neighborhood,
    cuisine: restaurant.cuisine || cuisine,
    instagramLink: restaurant.instagram_url
  };
};

// Mock data for demonstration - in production this would come from the API
const mockRestaurants: ApiRestaurant[] = [
  {
    id: "husk-nashville",
    name: "Husk",
    description: "A celebration of Southern ingredients reimagined with a modern approach.",
    image_url: "https://husknashville.com/wp-content/uploads/sites/2/2018/08/MPHP-HUSK_NASHfacadexfade1.jpg",
    logo_url: "https://husknashville.com/wp-content/uploads/sites/2/2021/07/husknew_gold.png",
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
    neighborhoods: ["downtown"],
    instagram_url: "https://www.instagram.com/husknashville"
  },
  {
    id: "butcher-and-bee-nashville",
    name: "Butcher & Bee",
    description: "Farm-to-table Mediterranean-inspired fare with a focus on shared plates.",
    image_url: "https://butcherandbee.com/nashville/wp-content/uploads/sites/3/2018/05/BandB_NASH-41.jpg",
    logo_url: "https://images.squarespace-cdn.com/content/v1/5a8f0595e45a7c670a287ba7/1519672592186-XV7L19IM35ZAJ2JY51BJ/be_Nash_logo.png",
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
    neighborhoods: ["east"],
    instagram_url: "https://www.instagram.com/butcherandbee"
  },
  {
    id: "folk-nashville",
    name: "Folk",
    description: "Artisanal pizzas and seasonal small plates in a bright, airy space.",
    image_url: "https://static.spacecrafted.com/fc949565f8c041de82d47246772f381d/i/ee3d0f74b16649a99ed0895b65a3e97f/1/GCuCv726gZycFxatRCb2ix/Folk_20221207_SM_36.jpg",
    logo_url: "https://images.squarespace-cdn.com/content/v1/57cbe08bff7c504d60b4ea51/1642710631058-V5MJSGKYW3YPH0HX3HF9/Folk_Final_Logo.png",
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
    neighborhoods: ["east"],
    instagram_url: "https://www.instagram.com/folkrestaurant"
  },
  {
    id: "henrietta-red-nashville",
    name: "Henrietta Red",
    description: "Seafood-focused, seasonal menu with an exceptional raw bar.",
    image_url: "https://images.squarespace-cdn.com/content/v1/586cfd48bebafb9f84b7cef6/1585084099200-M50KD0NRXIFNQOKDZNF9/Henrietta+Red+Exterior.JPG",
    logo_url: "https://images.squarespace-cdn.com/content/v1/586cfd48bebafb9f84b7cef6/1489079016732-W7D9CDJ8VE2DTYBB5VSQ/Henrietta-Red-Logo-Final-09.15.16-B%402x.png",
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
    neighborhoods: ["germantown"],
    instagram_url: "https://www.instagram.com/henriettared"
  },
  {
    id: "lockeland-table-nashville",
    name: "Lockeland Table",
    description: "Community-focused eatery serving wood-fired pizzas and Southern-inspired dishes.",
    image_url: "https://lockelandtable.com/wp-content/uploads/2020/09/AEE81243-D493-45C8-9F55-A11022BDDD73.jpeg",
    logo_url: "https://lockelandtable.com/wp-content/uploads/2022/09/LockelandTable_Logo.png",
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
    neighborhoods: ["east"],
    instagram_url: "https://www.instagram.com/lockelandtable"
  },
  {
    id: "arnold-country-kitchen-nashville",
    name: "Arnold's Country Kitchen",
    description: "Iconic meat-and-three cafeteria serving Nashville's best comfort food.",
    image_url: "https://arnoldscountrykitchen.com/wp-content/uploads/2019/07/arnolds_header.jpg",
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
    neighborhoods: ["downtown"],
    instagram_url: "https://www.instagram.com/arnoldscountrykitchen"
  },
  {
    id: "bartaco-nashville",
    name: "Bartaco",
    description: "Upscale street food with a coastal vibe, specializing in tacos and rice bowls.",
    image_url: "https://bartaco.com/wp-content/uploads/2021/09/MG_0173_bartaco_Nashville-patio-1.jpg",
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
    neighborhoods: ["12south"],
    instagram_url: "https://www.instagram.com/bartaco"
  },
  {
    id: "five-daughters-bakery-nashville",
    name: "Five Daughters Bakery",
    description: "Artisanal bakery famous for their 100-layer donuts and pastries.",
    image_url: "https://fivedaughtersbakery.com/wp-content/uploads/2018/07/12-South-outside.jpg",
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
    neighborhoods: ["12south"],
    instagram_url: "https://www.instagram.com/fivedaughtersbakery"
  },
  {
    id: "kayne-prime-nashville",
    name: "Kayne Prime",
    description: "Upscale steakhouse offering modern interpretations of classic American cuisine.",
    image_url: "https://www.mstreetnashville.com/wp-content/uploads/2019/04/Kayne-Prime-entrance-exterior-dark-Kayne.jpg",
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
    neighborhoods: ["gulch"],
    instagram_url: "https://www.instagram.com/kayneprime"
  }
];
