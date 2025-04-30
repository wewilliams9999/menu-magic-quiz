import { CasualIcon, ElegantIcon, TrendyIcon, UniqueIcon } from "@/utils/atmosphere-icons";

export interface QuizOption {
  id: string;
  text: string;
  value: string;
  icon?: React.ElementType;
  image?: string;
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  question: string;
  description?: string;
  type: "singleChoice" | "multipleChoice";
  options: QuizOption[];
  multiSelect?: boolean;
}

export interface QuizResult {
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
  isAlternative?: boolean;
  resyLink?: string;
  openTableLink?: string;
  instagramLink?: string;
  phone?: string;
}

export const locationMethodOptions: QuizOption[] = [
  {
    id: "method-1",
    text: "Use My Location",
    value: "location",
    icon: undefined
  },
  {
    id: "method-2",
    text: "Choose Neighborhoods",
    value: "manual",
    icon: undefined
  },
];

export const neighborhoodOptions: QuizOption[] = [
  { id: "neighborhood-1", text: "Downtown", value: "downtown" },
  { id: "neighborhood-2", text: "Germantown", value: "germantown" },
  { id: "neighborhood-3", text: "The Gulch", value: "gulch" },
  { id: "neighborhood-4", text: "Music Row", value: "music-row" },
  { id: "neighborhood-5", text: "North Nashville", value: "north-nashville" },
  { id: "neighborhood-6", text: "East Nashville", value: "east" },
  { id: "neighborhood-7", text: "West End", value: "west-end" },
  { id: "neighborhood-8", text: "Belle Meade", value: "belle-meade" },
  { id: "neighborhood-9", text: "Bellevue", value: "bellevue" },
  { id: "neighborhood-10", text: "Bordeaux", value: "bordeaux" },
  { id: "neighborhood-11", text: "Whites Creek", value: "whites-creek" },
  { id: "neighborhood-12", text: "12 South", value: "12south" },
  { id: "neighborhood-13", text: "Berry Hill", value: "berry-hill" },
  { id: "neighborhood-14", text: "Green Hills", value: "green-hills" },
  { id: "neighborhood-15", text: "Franklin", value: "franklin" },
  { id: "neighborhood-16", text: "Brentwood", value: "brentwood" },
  { id: "neighborhood-17", text: "Opryland", value: "opryland" },
  { id: "neighborhood-18", text: "Madison", value: "madison" },
  { id: "neighborhood-19", text: "Crieve Hall", value: "crieve-hall" },
  { id: "neighborhood-20", text: "Woodbine", value: "woodbine" }
];

export const cuisineOptions: QuizOption[] = [
  { id: "cuisine-0", text: "Anything - I'm Adventurous!", value: "anything" },
  { id: "cuisine-1", text: "American", value: "american" },
  { id: "cuisine-2", text: "Italian", value: "italian" },
  { id: "cuisine-3", text: "Mexican", value: "mexican" },
  { id: "cuisine-4", text: "Asian", value: "asian" },
  { id: "cuisine-5", text: "Seafood", value: "seafood" },
  { id: "cuisine-6", text: "Southern", value: "southern" },
  { id: "cuisine-7", text: "Healthy Options", value: "healthy" },
  { id: "cuisine-8", text: "Indulgent Treats", value: "indulgent" },
];

export const priceOptions: QuizOption[] = [
  { id: "price-1", text: "Budget-Friendly ($)", value: "$" },
  { id: "price-2", text: "Moderate ($$)", value: "$$" },
  { id: "price-3", text: "Pricey ($$$)", value: "$$$" },
  { id: "price-4", text: "Extravagant ($$$$)", value: "$$$$" },
];

export const dietaryOptions: QuizOption[] = [
  { id: "dietary-0", text: "No Specific Preferences", value: "none" },
  { id: "dietary-1", text: "Vegetarian", value: "vegetarian" },
  { id: "dietary-2", text: "Vegan", value: "vegan" },
  { id: "dietary-3", text: "Gluten-Free", value: "gluten-free" },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: "locationMethod",
    questionText: "How would you like to explore Nashville?",
    question: "How would you like to explore Nashville?",
    description: "We can help you discover restaurants based on specific neighborhoods or your current location.",
    type: "singleChoice",
    options: locationMethodOptions,
  },
  {
    id: "neighborhood",
    questionText: "Which neighborhoods would you like to explore?",
    question: "Which neighborhoods would you like to explore?",
    type: "multipleChoice",
    options: neighborhoodOptions,
    multiSelect: true,
  },
  {
    id: "cuisine",
    questionText: "What type of cuisine are you in the mood for?",
    question: "What type of cuisine are you in the mood for?",
    description: "Select all that apply",
    type: "multipleChoice",
    options: cuisineOptions,
    multiSelect: true,
  },
  {
    id: "price",
    questionText: "What's your preferred price range?",
    question: "What's your preferred price range?",
    description: "Select all that apply",
    type: "multipleChoice",
    options: priceOptions,
    multiSelect: true,
  },
  {
    id: "preferences",
    questionText: "Any specific dietary preferences?",
    question: "Any specific dietary preferences?",
    description: "Select all that apply or choose 'No Specific Preferences'",
    type: "multipleChoice",
    options: dietaryOptions,
    multiSelect: true,
  },
  {
    id: "atmosphere",
    questionText: "What kind of atmosphere do you prefer?",
    question: "What kind of atmosphere do you prefer?",
    description: "Select all that apply",
    type: "multipleChoice",
    options: [
      {
        id: "atmosphere-1",
        text: "Casual",
        value: "casual",
        icon: CasualIcon
      },
      {
        id: "atmosphere-2",
        text: "Trendy",
        value: "trendy",
        icon: TrendyIcon
      },
      {
        id: "atmosphere-3",
        text: "Elegant",
        value: "elegant",
        icon: ElegantIcon
      },
      {
        id: "atmosphere-4",
        text: "Unique",
        value: "unique",
        icon: UniqueIcon
      }
    ],
    multiSelect: true,
  },
];
