
import { QuizResult } from "@/utils/quizData";

// Enhanced fallback data with more variety and better categorization
export const getFallbackRestaurants = (): QuizResult[] => {
  return [
    {
      id: "1",
      name: "Husk Nashville",
      cuisine: "Southern",
      neighborhood: "Downtown",
      priceRange: "$$$",
      description: "Locally sourced Southern dishes served in a historic mansion with a modern touch.",
      address: "37 Rutledge St, Nashville, TN 37210",
      imageUrl: "https://husknashville.com/wp-content/uploads/sites/2/2018/08/MPHP-HUSK_NASHfacadexfade1.jpg",
      logoUrl: "https://husknashville.com/wp-content/uploads/sites/2/2021/07/husknew_gold.png",
      features: ["Farm-to-table", "Historic setting", "Seasonal menu"],
      website: "https://husknashville.com",
      resyLink: "https://resy.com/cities/bna/venues/husk-nashville",
      openTableLink: null,
      instagramLink: "https://www.instagram.com/husknashville",
      phone: "(615) 256-6565",
      isAlternative: true
    },
    {
      id: "2",
      name: "Rolf & Daughters",
      cuisine: "Modern American",
      neighborhood: "Germantown",
      priceRange: "$$$",
      description: "Rustic-modern spot with pasta dishes & innovative small plates in a converted factory space.",
      address: "700 Taylor St, Nashville, TN 37208",
      imageUrl: "https://www.rolfanddaughters.com/wp-content/uploads/2015/10/DSC_9863-1600x1067.jpg",
      logoUrl: "https://images.squarespace-cdn.com/content/v1/5c5c3833840b161566b59a22/70dbb757-1e8b-4159-b5e6-3fed48338e30/radlogo.png",
      features: ["House-made pasta", "Craft cocktails", "Industrial chic"],
      website: "https://www.rolfanddaughters.com",
      resyLink: "https://resy.com/cities/bna/venues/rolf-and-daughters",
      openTableLink: null,
      instagramLink: "https://www.instagram.com/rolfanddaughters",
      phone: "(615) 866-9897",
      isAlternative: true
    },
    {
      id: "3",
      name: "The Optimist",
      cuisine: "Seafood",
      neighborhood: "Germantown",
      priceRange: "$$$",
      description: "Sophisticated seafood spot with a coastal-inspired menu and oyster bar.",
      address: "1400 Adams St, Nashville, TN 37208",
      imageUrl: "https://images.squarespace-cdn.com/content/v1/5ef25f8a509c313cb73a9b20/1599601744952-G8UJ3JIB0WUYFNLW09OZ/Optimist+Nashville+Exterior.jpg",
      logoUrl: "https://images.squarespace-cdn.com/content/v1/5ef25f8a509c313cb73a9b20/1592942166899-8X5QI1WCY01LGG9HZCPC/Optimist+Logo+BW.png",
      features: ["Fresh seafood", "Craft cocktails", "Upscale casual"],
      website: "https://theoptimistrestaurant.com",
      resyLink: null,
      openTableLink: "https://www.opentable.com/r/the-optimist-nashville",
      instagramLink: "https://www.instagram.com/theoptimistnashville",
      phone: "(615) 618-2202",
      isAlternative: true
    },
    {
      id: "4",
      name: "Folk",
      cuisine: "Pizza",
      neighborhood: "East Nashville",
      priceRange: "$$",
      description: "Creative, wood-fired pizzas and vegetable dishes in a bright, stylish space.",
      address: "823 Meridian St, Nashville, TN 37207",
      imageUrl: "https://images.squarespace-cdn.com/content/v1/5a9e34dc0dbda3fd586e9316/1548271982852-9SLTFI169UWA934F68KN/folk+thanksgiving-7.jpg",
      logoUrl: "https://images.squarespace-cdn.com/content/v1/5a9e34dc0dbda3fd586e9316/c30b18d3-1675-4ddb-b5fa-30dabb39cc2f/Logo+Folk+Final.png",
      features: ["Wood-fired pizza", "Vegetarian options", "Weekend brunch"],
      website: "https://www.folkrestaurant.com",
      resyLink: "https://resy.com/cities/bna/venues/folk",
      openTableLink: null,
      instagramLink: "https://www.instagram.com/folknashville",
      phone: "(615) 610-2595",
      isAlternative: true
    },
    {
      id: "5",
      name: "Henrietta Red",
      cuisine: "Seafood",
      neighborhood: "Germantown",
      priceRange: "$$$",
      description: "Airy, stylish space for oysters, seafood small plates & creative cocktails.",
      address: "1200 4th Ave N, Nashville, TN 37208",
      imageUrl: "https://images.squarespace-cdn.com/content/v1/5875e150d482e9e1f2369749/1521566288837-NBF2DJLKML4C7C0QVHBM/Henrietta+Red+Dining+Room.jpg",
      logoUrl: "https://images.squarespace-cdn.com/content/v1/5875e150d482e9e1f2369749/287f1bc0-4670-42eb-ae7f-cbc0c6690cab/HRLogo_PrimaryWhite-01.png",
      features: ["Raw bar", "Seasonal menu", "Craft cocktails"],
      website: "https://www.henriettared.com",
      resyLink: "https://resy.com/cities/bna/venues/henrietta-red",
      openTableLink: null,
      instagramLink: "https://www.instagram.com/henrietta_red",
      phone: "(615) 490-8042",
      isAlternative: true
    },
    {
      id: "6",
      name: "Geist Bar + Restaurant",
      cuisine: "German",
      neighborhood: "Germantown",
      priceRange: "$$",
      description: "Modern German cuisine with craft cocktails in a sleek, industrial setting.",
      address: "311 Jefferson St, Nashville, TN 37208",
      features: ["German cuisine", "Craft cocktails", "Modern atmosphere"],
      website: "https://www.geistnashville.com",
      resyLink: "https://resy.com/cities/bna/venues/geist-bar-restaurant",
      instagramLink: "https://www.instagram.com/geistnashville",
      phone: "(615) 203-7005",
      isAlternative: true
    },
    {
      id: "7",
      name: "Lockeland Table",
      cuisine: "Southern",
      neighborhood: "East Nashville",
      priceRange: "$$",
      description: "Community-focused restaurant serving elevated Southern comfort food.",
      address: "1520 Woodland St, Nashville, TN 37206",
      features: ["Southern comfort", "Community focused", "Brunch"],
      website: "https://lockelandtable.com",
      instagramLink: "https://www.instagram.com/lockelandtable",
      phone: "(615) 228-4864",
      isAlternative: true
    },
    {
      id: "8",
      name: "Butchertown Hall",
      cuisine: "BBQ",
      neighborhood: "Germantown",
      priceRange: "$$",
      description: "Texas-style BBQ with live music in a spacious hall setting.",
      address: "1416 4th Ave N, Nashville, TN 37208",
      features: ["Texas BBQ", "Live music", "Large groups"],
      website: "https://butchertownhall.com",
      instagramLink: "https://www.instagram.com/butchertownhall",
      phone: "(615) 454-3634",
      isAlternative: true
    }
  ];
};

// Enhanced function to filter fallback restaurants based on user preferences
export const getFilteredFallbackRestaurants = (params?: {
  cuisine?: string[];
  price?: string[];
  neighborhoods?: string[];
}): QuizResult[] => {
  const allRestaurants = getFallbackRestaurants();
  
  if (!params) {
    return allRestaurants;
  }
  
  let filtered = allRestaurants;
  
  // Sort by preference matches
  filtered = filtered.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // Score based on cuisine match
    if (params.cuisine?.some(c => a.cuisine.toLowerCase().includes(c.toLowerCase()))) {
      scoreA += 10;
    }
    if (params.cuisine?.some(c => b.cuisine.toLowerCase().includes(c.toLowerCase()))) {
      scoreB += 10;
    }
    
    // Score based on price match
    if (params.price?.includes(a.priceRange)) {
      scoreA += 5;
    }
    if (params.price?.includes(b.priceRange)) {
      scoreB += 5;
    }
    
    // Score based on neighborhood match
    if (params.neighborhoods?.some(n => a.neighborhood.toLowerCase().includes(n.toLowerCase()))) {
      scoreA += 3;
    }
    if (params.neighborhoods?.some(n => b.neighborhood.toLowerCase().includes(n.toLowerCase()))) {
      scoreB += 3;
    }
    
    return scoreB - scoreA; // Higher score first
  });
  
  return filtered;
};
