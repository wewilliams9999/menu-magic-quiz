
import { QuizQuestion } from "./types";
import { locationMethodOptions, neighborhoodOptions } from "./locationOptions";
import { cuisineOptions } from "./cuisineOptions";
import { priceOptions } from "./priceOptions";
import { dietaryOptions } from "./dietaryOptions";
import { atmosphereOptions } from "./atmosphereOptions";

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
    questionText: "What's important to you?",
    question: "What's important to you?",
    description: "Select all that apply",
    type: "multipleChoice",
    options: atmosphereOptions,
    multiSelect: true,
  },
];
