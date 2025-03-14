export type QuizQuestion = {
  id: string;
  question: string;
  description?: string;
  options: QuizOption[];
  multiSelect?: boolean;
};

export type QuizOption = {
  id: string;
  text: string;
  image?: string;
  value: string;
};

export type QuizResult = {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: string[];
  address: string;
  website?: string;
  priceRange: string;
  neighborhood?: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "neighborhood",
    question: "What Nashville neighborhood would you like to go to?",
    description: "Select the area of Nashville you're interested in exploring.",
    multiSelect: true,
    options: [
      {
        id: "neighborhood-1",
        text: "East Nashville",
        value: "east"
      },
      {
        id: "neighborhood-2",
        text: "The Gulch",
        value: "gulch"
      },
      {
        id: "neighborhood-3",
        text: "Downtown",
        value: "downtown"
      },
      {
        id: "neighborhood-4",
        text: "12 South",
        value: "12south"
      },
      {
        id: "neighborhood-5",
        text: "Germantown",
        value: "germantown"
      },
      {
        id: "neighborhood-6",
        text: "Music Row",
        value: "music-row"
      },
      {
        id: "neighborhood-7",
        text: "Berry Hill",
        value: "berry-hill"
      },
      {
        id: "neighborhood-8",
        text: "West End",
        value: "west-end"
      },
      {
        id: "neighborhood-9",
        text: "Belle Meade",
        value: "belle-meade"
      },
      {
        id: "neighborhood-10",
        text: "Bellevue",
        value: "bellevue"
      },
      {
        id: "neighborhood-11",
        text: "Opryland",
        value: "opryland"
      },
      {
        id: "neighborhood-12",
        text: "Madison",
        value: "madison"
      },
      {
        id: "neighborhood-13",
        text: "North Nashville",
        value: "north-nashville"
      },
      {
        id: "neighborhood-14",
        text: "Bordeaux",
        value: "bordeaux"
      },
      {
        id: "neighborhood-15",
        text: "Whites Creek",
        value: "whites-creek"
      },
      {
        id: "neighborhood-16",
        text: "Franklin",
        value: "franklin"
      },
      {
        id: "neighborhood-17",
        text: "Brentwood",
        value: "brentwood"
      },
      {
        id: "neighborhood-18",
        text: "Green Hills",
        value: "green-hills"
      }
    ]
  },
  {
    id: "preferences",
    question: "What's important to you?",
    description: "Select all the factors that matter for your dining experience.",
    multiSelect: true,
    options: [
      {
        id: "pref-1",
        text: "Quiet Atmosphere",
        value: "quiet"
      },
      {
        id: "pref-2",
        text: "Easy Parking",
        value: "parking"
      },
      {
        id: "pref-3",
        text: "Budget-Friendly",
        value: "budget"
      },
      {
        id: "pref-4",
        text: "Outdoor Seating",
        value: "outdoor"
      },
      {
        id: "pref-5",
        text: "Child-Friendly",
        value: "family"
      },
      {
        id: "pref-6",
        text: "Unique Experience",
        value: "unique"
      },
      {
        id: "pref-7",
        text: "Late-Night Options",
        value: "late-night"
      },
      {
        id: "pref-8",
        text: "Live Music",
        value: "music"
      }
    ]
  },
  {
    id: "cuisine",
    question: "What type of cuisine are you in the mood for?",
    description: "Select the cuisine that appeals to you the most right now.",
    options: [
      {
        id: "cuisine-1",
        text: "Southern / Comfort Food",
        value: "southern",
        image: "https://images.unsplash.com/photo-1549648184-0d3e8e5f0f99?q=80&w=500&auto=format&fit=crop"
      },
      {
        id: "cuisine-2",
        text: "Modern American",
        value: "american",
        image: "https://images.unsplash.com/photo-1601314002592-b8734bca6604?q=80&w=500&auto=format&fit=crop"
      },
      {
        id: "cuisine-3",
        text: "International Flavors",
        value: "international",
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=500&auto=format&fit=crop"
      },
      {
        id: "cuisine-4",
        text: "Farm to Table",
        value: "farm-to-table",
        image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=500&auto=format&fit=crop"
      }
    ]
  },
  {
    id: "price",
    question: "What's your budget for this meal?",
    description: "Select your preferred price range.",
    options: [
      {
        id: "price-1",
        text: "Budget-Friendly ($)",
        value: "budget"
      },
      {
        id: "price-2",
        text: "Moderate ($$)",
        value: "moderate"
      },
      {
        id: "price-3",
        text: "High-End ($$$)",
        value: "highend"
      },
      {
        id: "price-4",
        text: "Special Occasion ($$$$)",
        value: "luxury"
      }
    ]
  },
  {
    id: "atmosphere",
    question: "What atmosphere are you looking for?",
    description: "Select the vibe that matches your mood.",
    options: [
      {
        id: "atmosphere-1",
        text: "Casual & Relaxed",
        value: "casual",
        image: "https://images.unsplash.com/photo-1555992336-fb0d29498b13?q=80&w=500&auto=format&fit=crop"
      },
      {
        id: "atmosphere-2",
        text: "Trendy & Energetic",
        value: "trendy",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500&auto=format&fit=crop"
      },
      {
        id: "atmosphere-3",
        text: "Elegant & Refined",
        value: "elegant",
        image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=500&auto=format&fit=crop"
      },
      {
        id: "atmosphere-4",
        text: "Unique & Memorable",
        value: "unique",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=500&auto=format&fit=crop"
      }
    ]
  }
];

export const quizResults: QuizResult[] = [
  {
    id: "husk",
    name: "Husk",
    description: "A celebration of Southern ingredients reimagined with a modern approach.",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=500&auto=format&fit=crop",
    tags: ["southern", "highend", "elegant"],
    address: "37 Rutledge St, Nashville, TN 37210",
    website: "https://husknashville.com",
    priceRange: "$$$",
    neighborhood: "downtown"
  },
  {
    id: "butcher-and-bee",
    name: "Butcher & Bee",
    description: "Farm-to-table Mediterranean-inspired fare with a focus on shared plates.",
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=500&auto=format&fit=crop",
    tags: ["farm-to-table", "moderate", "trendy"],
    address: "902 Main St, Nashville, TN 37206",
    website: "https://butcherandbee.com/nashville",
    priceRange: "$$",
    neighborhood: "east"
  },
  {
    id: "folk",
    name: "Folk",
    description: "Artisanal pizzas and seasonal small plates in a bright, airy space.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop",
    tags: ["american", "moderate", "trendy"],
    address: "823 Meridian St, Nashville, TN 37207",
    website: "https://www.folkrestaurant.com",
    priceRange: "$$",
    neighborhood: "east"
  },
  {
    id: "henrietta-red",
    name: "Henrietta Red",
    description: "Seafood-focused, seasonal menu with an exceptional raw bar.",
    image: "https://images.unsplash.com/photo-1535140728325-a4d3707eee61?q=80&w=500&auto=format&fit=crop",
    tags: ["american", "highend", "elegant"],
    address: "1200 4th Ave N, Nashville, TN 37208",
    website: "https://www.henriettared.com",
    priceRange: "$$$",
    neighborhood: "downtown"
  },
  {
    id: "lockeland-table",
    name: "Lockeland Table",
    description: "Community-focused eatery serving wood-fired pizzas and Southern-inspired dishes.",
    image: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?q=80&w=500&auto=format&fit=crop",
    tags: ["american", "moderate", "casual"],
    address: "1520 Woodland St, Nashville, TN 37206",
    website: "https://www.lockelandtable.com",
    priceRange: "$$",
    neighborhood: "east"
  },
  {
    id: "arnold",
    name: "Arnold's Country Kitchen",
    description: "Iconic meat-and-three cafeteria serving Nashville's best comfort food.",
    image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb8?q=80&w=500&auto=format&fit=crop",
    tags: ["southern", "budget", "casual"],
    address: "605 8th Ave S, Nashville, TN 37203",
    priceRange: "$",
    neighborhood: "downtown"
  },
  {
    id: "bartaco",
    name: "Bartaco",
    description: "Upscale street food with a coastal vibe, specializing in tacos and rice bowls.",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=500&auto=format&fit=crop",
    tags: ["international", "moderate", "trendy"],
    address: "2526 12th Ave S, Nashville, TN 37204",
    website: "https://bartaco.com",
    priceRange: "$$",
    neighborhood: "12south"
  },
  {
    id: "five-daughters",
    name: "Five Daughters Bakery",
    description: "Artisanal bakery famous for their 100-layer donuts and pastries.",
    image: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?q=80&w=500&auto=format&fit=crop",
    tags: ["american", "budget", "casual"],
    address: "1110 Caruthers Ave, Nashville, TN 37204",
    website: "https://fivedaughtersbakery.com",
    priceRange: "$",
    neighborhood: "12south"
  },
  {
    id: "kayne-prime",
    name: "Kayne Prime",
    description: "Upscale steakhouse offering modern interpretations of classic American cuisine.",
    image: "https://images.unsplash.com/photo-1579312624347-ef08db393114?q=80&w=500&auto=format&fit=crop",
    tags: ["american", "luxury", "elegant"],
    address: "1103 McGavock St, Nashville, TN 37203",
    website: "https://www.mstreetnashville.com/kayne-prime",
    priceRange: "$$$$",
    neighborhood: "gulch"
  }
];

export const getRecommendations = (answers: Record<string, string>): QuizResult[] => {
  let filteredResults = quizResults;
  if (answers.neighborhood) {
    filteredResults = filteredResults.filter(result => 
      result.neighborhood === answers.neighborhood || !result.neighborhood
    );
  }
  
  if (filteredResults.length < 3) {
    filteredResults = quizResults;
  }
  
  const selectedValues = Object.entries(answers)
    .filter(([key]) => key !== 'neighborhood')
    .map(([_, value]) => value);
  
  return filteredResults
    .map(result => {
      const matchScore = result.tags.filter(tag => selectedValues.includes(tag)).length;
      const neighborhoodBonus = result.neighborhood === answers.neighborhood ? 2 : 0;
      return { result, matchScore: matchScore + neighborhoodBonus };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
    .map(item => item.result);
};
