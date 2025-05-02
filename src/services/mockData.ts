
import { QuizResult } from "@/utils/quizData";

// Fallback data in case the API fails
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
      phone: "(615) 256-6565"
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
      phone: "(615) 866-9897"
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
      phone: "(615) 618-2202"
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
      phone: "(615) 610-2595"
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
      phone: "(615) 490-8042"
    }
  ];
};
