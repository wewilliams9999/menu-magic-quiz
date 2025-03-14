
export type QuizQuestion = {
  id: string;
  question: string;
  description?: string;
  options: QuizOption[];
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
};

export const quizQuestions: QuizQuestion[] = [
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
    priceRange: "$$$"
  },
  {
    id: "butcher-and-bee",
    name: "Butcher & Bee",
    description: "Farm-to-table Mediterranean-inspired fare with a focus on shared plates.",
    image: "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=500&auto=format&fit=crop",
    tags: ["farm-to-table", "moderate", "trendy"],
    address: "902 Main St, Nashville, TN 37206",
    website: "https://butcherandbee.com/nashville",
    priceRange: "$$"
  },
  {
    id: "folk",
    name: "Folk",
    description: "Artisanal pizzas and seasonal small plates in a bright, airy space.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop",
    tags: ["american", "moderate", "trendy"],
    address: "823 Meridian St, Nashville, TN 37207",
    website: "https://www.folkrestaurant.com",
    priceRange: "$$"
  },
  {
    id: "henrietta-red",
    name: "Henrietta Red",
    description: "Seafood-focused, seasonal menu with an exceptional raw bar.",
    image: "https://images.unsplash.com/photo-1535140728325-a4d3707eee61?q=80&w=500&auto=format&fit=crop",
    tags: ["american", "highend", "elegant"],
    address: "1200 4th Ave N, Nashville, TN 37208",
    website: "https://www.henriettared.com",
    priceRange: "$$$"
  },
  {
    id: "lockeland-table",
    name: "Lockeland Table",
    description: "Community-focused eatery serving wood-fired pizzas and Southern-inspired dishes.",
    image: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?q=80&w=500&auto=format&fit=crop",
    tags: ["american", "moderate", "casual"],
    address: "1520 Woodland St, Nashville, TN 37206",
    website: "https://www.lockelandtable.com",
    priceRange: "$$"
  },
  {
    id: "arnold",
    name: "Arnold's Country Kitchen",
    description: "Iconic meat-and-three cafeteria serving Nashville's best comfort food.",
    image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb8?q=80&w=500&auto=format&fit=crop",
    tags: ["southern", "budget", "casual"],
    address: "605 8th Ave S, Nashville, TN 37203",
    priceRange: "$"
  }
];

export const getRecommendations = (answers: Record<string, string>): QuizResult[] => {
  // Convert answers object to array of values
  const selectedValues = Object.values(answers);
  
  // Sort restaurants by how many matching tags they have with the selected answers
  return quizResults
    .map(result => {
      const matchScore = result.tags.filter(tag => selectedValues.includes(tag)).length;
      return { result, matchScore };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3) // Get top 3 matches
    .map(item => item.result);
};
